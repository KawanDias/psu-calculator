const cpuSelect = document.querySelector('#cpu-select');
const gpuSelect = document.querySelector('#gpu-select');
const form = document.querySelector('#hardware-form');
const powerOutput = document.querySelector('#power-output');
const powerDetails = document.querySelector('#power-details');
const psuName = document.querySelector('#psu-name');
const psuPower = document.querySelector('#psu-power');
const psuRating = document.querySelector('#psu-rating');
const psuLink = document.querySelector('#psu-link');
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

function selectRecommendedPsu(requiredPower) {
    return hardwareData.psus.find(psu => psu.power >= requiredPower) || hardwareData.psus[hardwareData.psus.length - 1];
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

function updateResults({ consumption, recommendedPsu, bottleneck }) {
    powerOutput.textContent = formatWatts(consumption);
    powerDetails.textContent = 'Inclui 100W adicionais para outros componentes e roteamento de reserva.';
    psuName.textContent = recommendedPsu.name;
    psuPower.textContent = `${recommendedPsu.power}W — Recomendado para sua configuração`;
    psuRating.textContent = recommendedPsu.rating;
    psuLink.href = recommendedPsu.url;
    psuLink.textContent = 'Ver Oferta / Menor Preço';
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
    const recommendedPsu = selectRecommendedPsu(recommendedWatts);
    const bottleneck = evaluateBottleneck(cpu.score, gpu.score);

    resultPlaceholder.classList.add('hidden');
    resultBlock.classList.remove('hidden');
    updateResults({ consumption: totalSystemWatts, recommendedPsu, bottleneck });
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
