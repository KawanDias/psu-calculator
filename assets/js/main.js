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

function evaluateBottleneck(cpuScore, gpuScore, profile = '1080p') {
    // profile-sensitive bottleneck evaluation
    if (profile === '1080p') {
        const cpuEffective = cpuScore * 1.3; // CPU importance increased for 1080p
        if (cpuEffective < gpuScore) {
            return { label: 'Gargalo de CPU em 1080p (Sua GPU é mais forte que o processador)', ratio: 90 };
        }
        if (cpuEffective > gpuScore * 1.35) {
            return { label: 'Gargalo de GPU em 1080p (CPU acima do necessário)', ratio: 35 };
        }
        return { label: 'Equilíbrio para jogos em 1080p', ratio: 65 };
    }

    if (profile === '4k') {
        const gpuEffective = gpuScore * 1.4; // GPU importance increased for 4K
        if (gpuEffective > cpuScore) {
            return { label: 'Limite de GPU em 4K (Gargalo de CPU insignificante)', ratio: 90 };
        }
        if (cpuScore > gpuEffective * 1.25) {
            return { label: 'CPU dominante em 4K (GPU pode estar subutilizada)', ratio: 35 };
        }
        return { label: 'Equilíbrio para jogos em 4K', ratio: 60 };
    }

    // render (conteúdo/produção): balance evaluation under sustained load
    const diff = cpuScore - gpuScore;
    const rel = Math.abs(diff) / Math.max(cpuScore, gpuScore);
    if (diff < 0 && rel > 0.15) {
        return { label: 'Gargalo de CPU em render (CPU abaixo do necessário para carga contínua)', ratio: 85 };
    }
    if (diff > 0 && rel > 0.15) {
        return { label: 'Gargalo de GPU em render (GPU abaixo do necessário para cargas de render)', ratio: 35 };
    }
    return { label: 'Equilíbrio para render/produção', ratio: 65 };
}

function setSearchStatus(message) {
    searchStatus.textContent = message || '';
}

function showSkeletons() {
    psuGrid.innerHTML = Array.from({ length: 3 }).map(() => `
        <div class="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 animate-pulse">
            <div class="h-40 w-full rounded-2xl bg-slate-800"></div>
            <div class="mt-4 space-y-3">
                <div class="h-4 w-5/6 rounded-full bg-slate-800"></div>
                <div class="h-4 w-1/2 rounded-full bg-slate-800"></div>
                <div class="h-10 rounded-2xl bg-slate-800"></div>
            </div>
        </div>
    `).join('');
}

function renderPsuCards(psus) {
    psuGrid.innerHTML = (Array.isArray(psus) ? psus : [])
        .map(item => `
                                                <div class="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-indigo-500/50">
                                                    <div>
                                                        <div class="relative flex h-36 w-full items-center justify-center rounded-xl bg-slate-950 border border-slate-800/80 mb-3">
                                                            <span class="absolute top-2 left-2 rounded-md bg-indigo-950/80 px-2.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-800/50">
                                                                ${item.store}
                                                            </span>
                                                            <svg class="h-16 w-16 text-indigo-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                            </svg>
                                                        </div>
                                                        <h3 class="text-sm font-semibold text-slate-100 line-clamp-2">${item.title}</h3>
                                                    </div>
                                                    <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="mt-4 block w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-center text-xs font-semibold text-white transition shadow-md">
                                                        Ver Oferta
                                                    </a>
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

// fetch removed — suggestions are generated client-side to avoid backend failures

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

    // 1) Recalcular potência total e aplicar margem de 25%
    const baseTotal = cpu.tdp + gpu.tdp + BASE_SYSTEM_WATTS; // sem margem
    const rawRequired = Math.ceil(baseTotal * SAFETY_MARGIN); // com margem aplicada

    // read selected profile
    const profile = document.querySelector('input[name="profile"]:checked')?.value || '1080p';

    // 2) Arredondar para potências comerciais conforme regras exatas
    let recommendedWattage;
    if (rawRequired <= 500) recommendedWattage = 500;
    else if (rawRequired <= 550) recommendedWattage = 550;
    else if (rawRequired <= 600) recommendedWattage = 600;
    else if (rawRequired <= 650) recommendedWattage = 650;
    else if (rawRequired <= 750) recommendedWattage = 750;
    else if (rawRequired <= 850) recommendedWattage = 850;
    else recommendedWattage = 1000;

    const bottleneck = evaluateBottleneck(cpu.score, gpu.score, profile);

    // 3) Atualização reativa do DOM
    resultPlaceholder.classList.add('hidden');
    resultBlock.classList.remove('hidden');
    // exibe o valor exato calculado (com margem) no #power-output
    powerOutput.textContent = formatWatts(rawRequired);
    powerDetails.textContent = `Recomendação comercial mínima com margem aplicada: ${recommendedWattage}W`;
    bottleneckText.textContent = bottleneck.label;
    bottleneckBar.style.width = `${bottleneck.ratio}%`;

    // Limpa e gera as 3 sugestões 100% client-side usando recommendedWattage
    psuGrid.innerHTML = '';
    setSearchStatus('Opções recomendadas para o seu sistema:');

    const suggestions = [
        {
            title: `Fonte ATX ${recommendedWattage}W 80 Plus`,
            store: 'KaBuM!',
            url: `https://www.kabum.com.br/busca?query=fonte+${recommendedWattage}w+80+plus`
        },
        {
            title: `Fonte Modular ${recommendedWattage}W 80 Plus Gold`,
            store: 'Mercado Livre',
            url: `https://lista.mercadolivre.com.br/fonte-${recommendedWattage}w-80-plus`
        },
        {
            title: `Fonte de Alimentação ${recommendedWattage}W PC`,
            store: 'Amazon',
            url: `https://www.amazon.com.br/s?k=fonte+${recommendedWattage}w+80+plus`
        }
    ];

    // Renderiza imediatamente os cards (sem dependência de backend)
    renderPsuCards(suggestions);
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
