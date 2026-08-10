const hardwareData = {
    cpus: [
        { id: 'amd-ryzen-5-3600', name: 'AMD Ryzen 5 3600', tdp: 65, score: 8200 },
        { id: 'amd-ryzen-7-3700x', name: 'AMD Ryzen 7 3700X', tdp: 65, score: 9400 },
        { id: 'amd-ryzen-5-5600x', name: 'AMD Ryzen 5 5600X', tdp: 65, score: 9800 },
        { id: 'amd-ryzen-7-5800x', name: 'AMD Ryzen 7 5800X', tdp: 105, score: 11100 },
        { id: 'amd-ryzen-9-7900x', name: 'AMD Ryzen 9 7900X', tdp: 170, score: 14500 },
        { id: 'intel-core-i5-10400f', name: 'Intel Core i5-10400F', tdp: 65, score: 7600 },
        { id: 'intel-core-i7-11700k', name: 'Intel Core i7-11700K', tdp: 125, score: 11500 },
        { id: 'intel-core-i5-12600k', name: 'Intel Core i5-12600K', tdp: 125, score: 11900 },
        { id: 'intel-core-i7-12700k', name: 'Intel Core i7-12700K', tdp: 125, score: 13600 },
        { id: 'intel-core-i9-13900k', name: 'Intel Core i9-13900K', tdp: 125, score: 16800 }
    ],
    gpus: [
        { id: 'nvidia-gtx-1660-super', name: 'NVIDIA GTX 1660 SUPER', tdp: 125, score: 8600 },
        { id: 'nvidia-rtx-2060', name: 'NVIDIA RTX 2060', tdp: 160, score: 10100 },
        { id: 'nvidia-rtx-3060', name: 'NVIDIA RTX 3060', tdp: 170, score: 11800 },
        { id: 'nvidia-rtx-3070', name: 'NVIDIA RTX 3070', tdp: 220, score: 14100 },
        { id: 'nvidia-rtx-4070', name: 'NVIDIA RTX 4070', tdp: 200, score: 16600 },
        { id: 'amd-rx-6600', name: 'AMD Radeon RX 6600', tdp: 132, score: 9600 },
        { id: 'amd-rx-6700-xt', name: 'AMD Radeon RX 6700 XT', tdp: 230, score: 11600 },
        { id: 'amd-rx-6800', name: 'AMD Radeon RX 6800', tdp: 250, score: 13800 },
        { id: 'amd-rx-7900-xt', name: 'AMD Radeon RX 7900 XT', tdp: 300, score: 16800 },
        { id: 'amd-rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX', tdp: 355, score: 17900 }
    ],
    psus: [
        { id: 'psu-500w', name: 'Fonte 500W 80 Plus Bronze', power: 500, rating: '80 Plus Bronze', url: 'https://example.com/psu-500w' },
        { id: 'psu-600w', name: 'Fonte 600W 80 Plus Bronze', power: 600, rating: '80 Plus Bronze', url: 'https://example.com/psu-600w' },
        { id: 'psu-650w', name: 'Fonte 650W 80 Plus Gold', power: 650, rating: '80 Plus Gold', url: 'https://example.com/psu-650w' },
        { id: 'psu-750w', name: 'Fonte 750W 80 Plus Gold', power: 750, rating: '80 Plus Gold', url: 'https://example.com/psu-750w' },
        { id: 'psu-850w', name: 'Fonte 850W 80 Plus Platinum', power: 850, rating: '80 Plus Platinum', url: 'https://example.com/psu-850w' }
    ],
    pages: {
        about: {
            title: 'Sobre o Projeto',
            subtitle: 'Ferramenta de cálculo de hardware 100% client-side.',
            content: 'Esta calculadora foi criada para estimar o consumo de energia e ajudar gamers e criadores de conteúdo a entender a necessidade ideal de fonte e o equilíbrio entre CPU e GPU. O site roda totalmente no navegador, sem backend.'
        },
        terms: {
            title: 'Termos de Uso',
            subtitle: 'Uso responsável e finalidade educativa.',
            content: 'Esta ferramenta é fornecida como uma referência de consumo e gargalo estimado. Não oferecemos garantia sobre os resultados. O usuário deve sempre verificar as especificações oficiais dos componentes antes de comprar.'
        },
        privacy: {
            title: 'Política de Privacidade',
            subtitle: 'Nenhum dado pessoal é coletado.',
            content: 'Não armazenamos ou enviamos dados de usuários. Todas as escolhas de CPU e GPU permanecem no navegador do visitante. Os links fornecidos são apenas de exemplo e não envolvem rastreamento de dados pessoais.'
        }
    }
};
