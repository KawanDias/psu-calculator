import fetch from 'node-fetch';
import cheerio from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const TIMEOUT_MS = 12000;
const PLACEHOLDER_PATTERNS = ['via.placeholder', 'placeholder', 'example.com', 'dummyimage', 'blank', 'spacer.gif', 'missing', 'default'];

const FALLBACK_RESULTS = [
    {
        title: 'Corsair RM650x 650W 80 Plus Gold',
        price: 'R$ 1.199,00',
        image: 'https://m.media-amazon.com/images/I/71V8I7mwpUL._AC_SL1500_.jpg',
        url: 'https://lista.mercadolivre.com.br/fonte-corsair-rm650x-650w-80-plus-gold'
    },
    {
        title: 'MSI MPG A650GF 650W 80 Plus Gold',
        price: 'R$ 1.049,00',
        image: 'https://m.media-amazon.com/images/I/71xFw3zJd5L._AC_SL1500_.jpg',
        url: 'https://lista.mercadolivre.com.br/fonte-msi-mpg-a650gf-650w-80-plus-gold'
    },
    {
        title: 'Cooler Master MWE Gold 750W 80 Plus',
        price: 'R$ 950,00',
        image: 'https://m.media-amazon.com/images/I/61Y8uqxqFwL._AC_SL1500_.jpg',
        url: 'https://lista.mercadolivre.com.br/fonte-cooler-master-mwe-gold-750w'
    }
];

function normalizeUrl(value, baseUrl) {
    if (!value || typeof value !== 'string') {
        return null;
    }

    let trimmed = value.trim();
    if (trimmed.startsWith('//')) {
        trimmed = `https:${trimmed}`;
    }

    if (trimmed.startsWith('/')) {
        try {
            const base = new URL(baseUrl);
            trimmed = `${base.protocol}//${base.host}${trimmed}`;
        } catch {
            return null;
        }
    }

    try {
        return new URL(trimmed, baseUrl).toString();
    } catch {
        return null;
    }
}

function cleanText(value) {
    if (!value || typeof value !== 'string') {
        return '';
    }
    return value.replace(/\s+/g, ' ').trim();
}

function isPlaceholderImage(url) {
    if (!url || typeof url !== 'string') {
        return true;
    }

    const lower = url.trim().toLowerCase();
    if (lower.startsWith('data:')) {
        return true;
    }

    if (PLACEHOLDER_PATTERNS.some(pattern => lower.includes(pattern))) {
        return true;
    }

    try {
        new URL(lower);
        return false;
    } catch {
        return true;
    }
}

async function fetchHtml(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9'
            },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }

        return await response.text();
    } finally {
        clearTimeout(timeoutId);
    }
}

function parseProductItem(element, baseUrl) {
    const title = cleanText(
        element.find('h2.ui-search-item__title, .ui-search-item__title, .product-title, .item__title').text() ||
        element.find('img').attr('alt')
    );

    const rawUrl = element.find('a.ui-search-link, a').first().attr('href');
    const rawImage =
        element.find('img.ui-search-result-image__element').attr('data-src') ||
        element.find('img').attr('data-src') ||
        element.find('img').attr('data-original') ||
        element.find('img').attr('src');

    const url = normalizeUrl(rawUrl, baseUrl);
    const image = normalizeUrl(rawImage, baseUrl);

    const priceWhole = cleanText(element.find('span.price-tag-fraction, .price-fraction').first().text());
    const priceCents = cleanText(element.find('span.price-tag-cents').first().text());
    const currency = cleanText(element.find('span.price-tag-symbol, .price-symbol').first().text()) || 'R$';

    let price = '';
    if (priceWhole) {
        price = `${currency} ${priceWhole}${priceCents ? `,${priceCents}` : ''}`;
    }

    if (!price) {
        price = cleanText(element.find('.ui-search-price__second-line, .price, .product-price').text());
    }

    if (!title || !url || !image || !price || isPlaceholderImage(image)) {
        return null;
    }

    return {
        title,
        price,
        image,
        url
    };
}

function parseSearchResults(html, baseUrl) {
    const $ = cheerio.load(html);
    const results = [];
    const productElements = $('li.ui-search-layout__item, div.ui-search-result__wrapper, div.ui-search-result__item');

    productElements.each((_, element) => {
        if (results.length >= 3) {
            return false;
        }

        const product = parseProductItem($(element), baseUrl);
        if (!product) {
            return;
        }

        if (!results.some(item => item.url === product.url)) {
            results.push(product);
        }
    });

    return results;
}

function createFallbackResponse(wattage) {
    return {
        source: 'fallback',
        fallback: true,
        wattage,
        results: FALLBACK_RESULTS
    };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Use GET para consultar o endpoint.' });
    }

    const url = new URL(req.url, `https://${req.headers.host || 'vercel.sh'}`);
    const wattage = parseInt(url.searchParams.get('wattage') || '', 10);

    if (!wattage || wattage < 50) {
        return res.status(400).json({ error: 'Informe wattage válido via query string, por exemplo: /api/search?wattage=650' });
    }

    const searchUrl = `https://lista.mercadolivre.com.br/fonte-${encodeURIComponent(wattage)}w-80-plus`;

    try {
        const html = await fetchHtml(searchUrl);
        const results = parseSearchResults(html, searchUrl);

        if (!results.length) {
            return res.status(200).json(createFallbackResponse(wattage));
        }

        res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
        return res.status(200).json({ source: 'mercadolivre', fallback: false, wattage, results });
    } catch (error) {
        return res.status(200).json(createFallbackResponse(wattage));
    }
}
