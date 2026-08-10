const cpuSelect = document.querySelector('#cpu-select');
const gpuSelect = document.querySelector('#gpu-select');
const form = document.querySelector('#hardware-form');
const powerOutput = document.querySelector('#power-output');
const powerDetails = document.querySelector('#power-details');
const psuGrid = document.querySelector('#psu-grid');
const bottleneckText = document.querySelector('#bottleneck-text');
const bottleneckBar = document.querySelector('#bottleneck-bar');
const resultBlock = document.querySelector('#result-block');
const resultPlaceholder = document.querySelector('#result-placeholder');
const searchStatus = document.querySelector('#search-status');
const pageLinks = document.querySelectorAll('[data-page]');
const modal = document.querySelector('#page-modal');
const modalTitle = document.querySelector('#modal-title');
const modalSubtitle = document.querySelector('#modal-subtitle');
const modalContent = document.querySelector('#modal-content');
const modalClose = document.querySelector('#modal-close');

const BASE_SYSTEM_WATTS = 100;
const SAFETY_MARGIN = 1.25;
const LOADING_MESSAGE = 'Buscando as melhores ofertas de fontes em tempo real...';

function createOption(item) {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name;
    return option;
}

function populateSelects() {
    hardwareData.cpus.forEach(cpu => cpuSelect.appendChild(createOption(cpu)));
    hardwareData.gpus.forEach(gpu => gpuSelect.appendChild(createOption(gpu)));
}

function getHardwareItem(list, id) {
    return list.find(item => item.id === id);
}

function formatWatts(value) {
    return `${value.toFixed(0)} W`;
}

function openModal(pageKey) {
    const page = hardwareData.pages[pageKey];
    if (!page) return;

    modalTitle.textContent = page.title;
    modalSubtitle.textContent = page.subtitle;
    modalContent.innerHTML = page.content.replace(/\n/g, '<br><br>');
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

function evaluateBottleneck(cpuScore, gpuScore) {
    const difference = gpuScore - cpuScore;
    const threshold = cpuScore * 0.35;
    if (difference > threshold) {
        return {
            label: 'Gargalo de Processador em 1080p (Sua GPU é mais forte que o processador)',
            ratio: 90
        };
    }

    const cpuDiff = cpuScore - gpuScore;
    const thresholdGpu = gpuScore * 0.35;
    if (cpuDiff > thresholdGpu) {
        return {
            label: 'Gargalo de Placa de Vídeo (Sua CPU sobra para esta GPU)',
            ratio: 35
        };
    }

    return {
        label: 'Equilíbrio Excelente entre CPU e GPU',
        ratio: 65
    };
}

function setSearchStatus(message) {
    searchStatus.textContent = message || '';
}

function showLoadingState() {
    psuGrid.innerHTML = `
        <div class="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-center text-slate-300">
            <p class="text-base font-semibold text-slate-100">${LOADING_MESSAGE}</p>
            <p class="mt-2 text-sm text-slate-400">Aguarde enquanto buscamos ofertas reais de fontes para a sua potência recomendada.</p>
        </div>
    `;
}

function renderPsuCards(psus) {
    if (!Array.isArray(psus) || psus.length === 0) {
        psuGrid.innerHTML = `
            <div class="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-center text-slate-400">
                <p class="text-base font-semibold text-slate-100">Não foi possível encontrar ofertas reais no momento.</p>
                <p class="mt-2 text-sm">Tente novamente em alguns instantes.</p>
            </div>
        `;
        return;
    }

    psuGrid.innerHTML = psus
        .map(psu => `
            <div class="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-sm shadow-slate-950/20">
                <div class="overflow-hidden rounded-3xl bg-slate-800">
                    <img src="${psu.image}" alt="${psu.title}" class="h-40 w-full object-cover" />
                </div>
                <div class="mt-4 space-y-3">
                    <p class="text-lg font-semibold text-slate-100">${psu.title}</p>
                    <p class="text-sm text-slate-300">${psu.price}</p>
                    <a href="${psu.url}" target="_blank" rel="noopener noreferrer" class="inline-flex w-full justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
                        Ver Oferta
                    </a>
                </div>
            </div>
        `)
        .join('');
}

function updateResults({ consumption, bottleneck }) {
    powerOutput.textContent = formatWatts(consumption);
    powerDetails.textContent = 'Inclui 100W adicionais para outros componentes e margem de segurança.';
    bottleneckText.textContent = bottleneck.label;
    bottleneckBar.style.width = `${bottleneck.ratio}%`;
}

async function fetchPsuOffers(wattage) {
    const response = await fetch(`/api/search?wattage=${encodeURIComponent(wattage)}`, {
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar ofertas de fonte em tempo real.');
    }

    const data = await response.json();
    if (!Array.isArray(data.results)) {
        throw new Error('Resposta inválida da API de busca.');
    }

    return data.results;
}

async function handleSubmit(event) {
    event.preventDefault();

    const selectedCpuId = cpuSelect.value;
    const selectedGpuId = gpuSelect.value;

    if (!selectedCpuId || !selectedGpuId) {
        bottleneckText.textContent = 'Por favor, selecione CPU e GPU para calcular.';
        return;
    }

    const cpu = getHardwareItem(hardwareData.cpus, selectedCpuId);
    const gpu = getHardwareItem(hardwareData.gpus, selectedGpuId);

    const totalSystemWatts = cpu.tdp + gpu.tdp + BASE_SYSTEM_WATTS;
    const recommendedWatts = Math.ceil(totalSystemWatts * SAFETY_MARGIN / 50) * 50;
    const bottleneck = evaluateBottleneck(cpu.score, gpu.score);

    resultPlaceholder.classList.add('hidden');
    resultBlock.classList.remove('hidden');
    setSearchStatus(LOADING_MESSAGE);
    updateResults({ consumption: totalSystemWatts, bottleneck });
    showLoadingState();

    try {
        const psus = await fetchPsuOffers(recommendedWatts);
        setSearchStatus('');
        renderPsuCards(psus);
    } catch (error) {
        setSearchStatus('Não foi possível carregar ofertas ao vivo. Mostrando resultados locais.');
        renderPsuCards([]);
        console.error(error);
    }
}

populateSelects();

pageLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const pageKey = link.dataset.page;
        openModal(pageKey);
    });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', event => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

form.addEventListener('submit', handleSubmit);
