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
const pageLinks = document.querySelectorAll('[data-page]');
const modal = document.querySelector('#page-modal');
const modalTitle = document.querySelector('#modal-title');
const modalSubtitle = document.querySelector('#modal-subtitle');
const modalContent = document.querySelector('#modal-content');
const modalClose = document.querySelector('#modal-close');

const BASE_SYSTEM_WATTS = 100;
const SAFETY_MARGIN = 1.25;

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

function selectRecommendedPsus(requiredPower) {
    const candidates = hardwareData.psus
        .filter(psu => psu.power >= requiredPower)
        .sort((a, b) => a.power - b.power)
        .slice(0, 3);

    if (candidates.length > 0) {
        return candidates;
    }

    return hardwareData.psus
        .slice()
        .sort((a, b) => a.power - b.power)
        .slice(-3);
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

function renderPsuCards(psus) {
    psuGrid.innerHTML = psus
        .map(psu => `
            <div class="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-sm shadow-slate-950/20">
                <div class="overflow-hidden rounded-3xl bg-slate-800">
                    <img src="${psu.image}" alt="${psu.name}" class="h-40 w-full object-cover" />
                </div>
                <div class="mt-4 space-y-3">
                    <p class="text-lg font-semibold text-slate-100">${psu.name}</p>
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">${psu.rating}</span>
                        <span class="text-sm text-slate-400">${psu.power}W</span>
                    </div>
                    <a href="${psu.url}" target="_blank" rel="noopener noreferrer" class="inline-flex w-full justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
                        Ver Oferta / Menor Preço
                    </a>
                </div>
            </div>
        `)
        .join('');
}

function updateResults({ consumption, recommendedPsus, bottleneck }) {
    powerOutput.textContent = formatWatts(consumption);
    powerDetails.textContent = 'Inclui 100W adicionais para outros componentes e roteamento de reserva.';
    renderPsuCards(recommendedPsus);
    bottleneckText.textContent = bottleneck.label;
    bottleneckBar.style.width = `${bottleneck.ratio}%`;
    resultBlock.classList.remove('opacity-80');
}

function handleSubmit(event) {
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
    const recommendedPsus = selectRecommendedPsus(recommendedWatts);
    const bottleneck = evaluateBottleneck(cpu.score, gpu.score);

    resultPlaceholder.classList.add('hidden');
    resultBlock.classList.remove('hidden');
    updateResults({ consumption: totalSystemWatts, recommendedPsus, bottleneck });
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
