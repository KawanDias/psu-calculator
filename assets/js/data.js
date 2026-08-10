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
        {
            id: 'msi-mag-a650bn',
            name: 'Fonte MSI MAG A650BN, 650W',
            power: 650,
            rating: '80 Plus Bronze',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
            url: 'https://www.example.com/msi-mag-a650bn'
        },
        {
            id: 'corsair-rm650x',
            name: 'Fonte Corsair RM650X, 650W',
            power: 650,
            rating: '80 Plus Gold',
            image: 'https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=600&q=80',
            url: 'https://www.example.com/corsair-rm650x'
        },
        {
            id: 'cooler-master-mwe-750',
            name: 'Fonte Cooler Master MWE Gold, 750W',
            power: 750,
            rating: '80 Plus Gold',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
            url: 'https://www.example.com/cooler-master-mwe-750'
        },
        {
            id: 'xpg-core-850w',
            name: 'Fonte XPG Core Reactor, 850W',
            power: 850,
            rating: '80 Plus Gold',
            image: 'https://images.unsplash.com/photo-1561154464-65c1fa8d1bb6?auto=format&fit=crop&w=600&q=80',
            url: 'https://www.example.com/xpg-core-850w'
        },
        {
            id: 'gamemax-m-700',
            name: 'Fonte Gamemax M700, 700W',
            power: 700,
            rating: '80 Plus Bronze',
            image: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=600&q=80',
            url: 'https://www.example.com/gamemax-m-700'
        },
        {
            id: 'corsair-rm750x',
            name: 'Fonte Corsair RM750X, 750W',
            power: 750,
            rating: '80 Plus Gold',
            image: 'https://images.unsplash.com/photo-1531089073312-70a8879c30b4?auto=format&fit=crop&w=600&q=80',
            url: 'https://www.example.com/corsair-rm750x'
        },
        {
            id: 'msi-potent-850',
            name: 'Fonte MSI Potent 850W',
            power: 850,
            rating: '80 Plus Bronze',
            image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80',
            url: 'https://www.example.com/msi-potent-850'
        }
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
