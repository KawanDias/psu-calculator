# PSU Calculator & Bottleneck Analyzer

Aplicação web desenvolvida para estimar o consumo energético (Watts) de configurações de hardware, recomendar a potência ideal de fonte de alimentação (PSU) e analisar o nível de gargalo (*bottleneck*) entre processador (CPU) e placa de vídeo (GPU).

**Link da aplicação:** [psu-calculator-xi.vercel.app](https://psu-calculator-xi.vercel.app)

---

## Recursos e Funcionalidades

* **Dimensionamento de Potência:** Cálculo do consumo total estimado com base no TDP dos componentes principais, aplicando margem de segurança operacional para oscilações de carga.
* **Análise de Eficiência e Gargalo:** Diagnóstico de compatibilidade de desempenho entre CPU e GPU para identificar possíveis limitações de processamento.
* **Mapeamento de Hardware:** Integração com URLs de busca estruturadas para direcionamento a lojas e distribuidores de componentes.
* **Interface Responsiva:** Desenvolvida em arquitetura *Mobile-First* com tema escuro (*Dark Mode*) otimizado para usabilidade.

---

## Tecnologias Utilizadas

* **Linguagens:** HTML5, JavaScript (ES6+)
* **Estilização:** Tailwind CSS
* **Hospedagem e CI/CD:** Vercel

---

## Instalação e Execução Local

1. Clone o repositório:
   ```bash
   git clone [https://github.com/KawAnDias/psu-calculator.git](https://github.com/KawAnDias/psu-calculator.git)
