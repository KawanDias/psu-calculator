import cheerio from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const TIMEOUT_MS = 12000;
const PLACEHOLDER_PATTERNS = ['via.placeholder', 'placeholder', 'example.com', 'dummyimage', 'blank', 'spacer.gif', 'missing', 'default'];


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

// Serverless handler simplified: always return 3 generated search links for the requested wattage.

function createResultsForWattage(wattage) {
    return [
        {
            title: `Fonte ${wattage}W 80 Plus Bronze / Gold (KaBuM!)`,
            price: 'Ver ofertas em tempo real',
            image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop',
            url: `https://www.kabum.com.br/busca?query=fonte+${wattage}w+80+plus`
        },
        {
            title: `Fonte ${wattage}W 80 Plus (Mercado Livre)`,
            price: 'Ver ofertas em tempo real',
            image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop',
            url: `https://lista.mercadolivre.com.br/fonte-${wattage}w-80-plus`
        },
        {
            title: `Fonte ${wattage}W 80 Plus (Amazon Brasil)`,
            price: 'Ver ofertas em tempo real',
            image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop',
            url: `https://www.amazon.com.br/s?k=fonte+${wattage}w+80+plus`
        }
    ];
}

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Use GET para consultar o endpoint.' });
    }

    const url = new URL(req.url, `https://${req.headers.host || 'vercel.sh'}`);
    const wattage = parseInt(url.searchParams.get('wattage') || '', 10);

    if (!wattage || wattage < 50) {
        return res.status(400).json({ error: 'Informe wattage válido via query string, por exemplo: /api/search?wattage=650' });
    }

    const results = createResultsForWattage(wattage);

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ source: 'generated', fallback: false, wattage, results });
}

