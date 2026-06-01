import { UserProjectDrafts, TimelinePhase, QuizQuestion, SprintStructure } from "./types";

export const DEFAULT_DRAFTS: UserProjectDrafts = {
  theme: "",
  population: "",
  object: "",
  context: "",
  delimitedTheme: "",
  researchProblem: "",
  generalObjective: "",
  specificObjective1: "",
  specificObjective2: "",
  specificObjective3: "",
  hypotheses: "",
  
  congressLectureTitle: "",
  congressProblem: "",
  congressObjective: "",
  congressHypothesis: "",
  
  justificationSocial: "",
  justificationScientific: "",
  justificationPractical: "",
  justificationViability: "",
  
  researchType: "",
  researchApproach: "",
  sampleCriteria: "",
  
  dataCollectionTool: "",
  dataAnalysisMethod: "",
  ethicsApprovalNeeded: false,
  
  expectedResultsText: "",
};

export const EXAMPLE_DRAFTS: UserProjectDrafts = {
  theme: "Adultização de crianças e adolescentes nas redes sociais",
  population: "Crianças e adolescentes entre 9 e 14 anos ativos em redes sociais",
  object: "Processos de adultização precoce (sexualização, uso de maquiagem, imitação de gestos e falas adultas)",
  context: "Plataformas digitais TikTok e Instagram no Brasil, período de 2023 a 2025",
  delimitedTheme: "A adultização de crianças e adolescentes de 9 a 14 anos nas plataformas digitais TikTok e Instagram no Brasil entre 2023 e 2025.",
  researchProblem: "Como a presença ativa e o engajamento nas plataformas digitais TikTok e Instagram influenciam a adoção de comportamentos adultizados em crianças e adolescentes de 9 a 14 anos no Brasil entre 2023 e 2025?",
  generalObjective: "Analisar a influência da participação ativa nas plataformas digitais TikTok e Instagram sobre a adoção de comportamentos e linguagens adultizadas em crianças de 9 a 14 anos no Brasil.",
  specificObjective1: "Mapear os tipos de conteúdos mais consumidos e produzidos por crianças e adolescentes nessas plataformas.",
  specificObjective2: "Identificar sinais visuais de adultização nos perfis analisados (uso de maquiagem, vestuário inadequado, imitação de gestos).",
  specificObjective3: "Verificar a percepção e o nível de mediação de pais e responsáveis em relação ao tempo de tela de seus filhos.",
  hypotheses: "H1: Menores com maior tempo de exposição ativa sem controle parental apresentam mais sinais de adultização.\nH2: O consumo de conteúdos criados por influenciadores digitais adultos acelera a adoção de posturas de consumo incompatíveis com a infância.",
  
  congressLectureTitle: "Tecnologia, Saúde Mental e Infância na Sociedade de Consumo",
  congressProblem: "Quais os impactos psiconeurológicos do uso precoce de telas interativas no sono de crianças de 0 a 6 anos?",
  congressObjective: "Avaliar qualitativamente a relação entre o excesso de luminosidade azul das redes e distúrbios da melatonina infantil.",
  congressHypothesis: "Mais de 3 horas de tela noturna reduzem significativamente a fase profunda do sono infantil.",
  
  justificationSocial: "A pesquisa aborda a urgente necessidade de proteção do desenvolvimento infanto-juvenil saudável frente à exposição comercial e erotização precoce online, que predispõem a ansiedades e autoimagem distorcida.",
  justificationScientific: "Preenche lacunas científicas em mídias digitais brasileiras correlacionando o papel do algoritmo do TikTok/Instagram com a alteração de hábitos sociais e estéticos de menores no Sul Global.",
  justificationPractical: "Oferece insumos sólidos e cartilhas para educadores e famílias construírem estratégias de mediação parental, além de subsidiar órgãos reguladores em políticas de proteção digital.",
  justificationViability: "O projeto é viável, pois investiga perfis públicos disponíveis na rede, complementado com entrevistas virtuais dentro do limite do calendário do ano letivo de 5 meses.",
  
  researchType: "Exploratória, Descritiva e Multimétodo",
  researchApproach: "Qualitativa",
  sampleCriteria: "Amostra de 15 perfis infantis altamente engajados e entrevistas com 12 pais voluntários selecionados via conselho escolar.",
  
  dataCollectionTool: "Roteiro de entrevista semiestruturada com pais e ficha de análise documental de postagens públicas das mídias.",
  dataAnalysisMethod: "Análise de Conteúdo Temática baseada em Bardin (2011), categorizando as recorrências em núcleos de significados.",
  ethicsApprovalNeeded: true,
  
  expectedResultsText: "Espera-se mapear um padrão de comportamento de consumo estético induzido pelo algoritmo e constatar que a supervisão parental ativa funciona como fator de proteção, servindo para propor diretrizes de mediação digital escolar.",
};

export const INITIAL_TIMELINE_PHASES: TimelinePhase[] = [
  { id: "p1", label: "Levantamento bibliográfico", startMonth: 1, durationMonths: 3, description: "Revisão teórica de autores clássicos (Severino, Gil, Lakatos)" },
  { id: "p2", label: "Definição de problema e hipóteses", startMonth: 1, durationMonths: 1, description: "Ajuste e refinamento da pergunta de pesquisa" },
  { id: "p3", label: "Planejamento metodológico", startMonth: 2, durationMonths: 1, description: "Seleção de amostragem e aprovação pelo comitê ético" },
  { id: "p4", label: "Coleta de dados", startMonth: 2, durationMonths: 2, description: "Entrevistas com voluntários e mapeamento documental" },
  { id: "p5", label: "Análise dos dados", startMonth: 3, durationMonths: 2, description: "Categorização baseada na técnica temática de Bardin" },
  { id: "p6", label: "Redação do trabalho", startMonth: 4, durationMonths: 2, description: "Produção científica da introdução ao capítulo conclusivo" },
  { id: "p7", label: "Revisão final e entrega", startMonth: 5, durationMonths: 1, description: "Normalização ABNT e preparo dos slides apresentativos" },
];

export const QUIZZES: { [key: number]: QuizQuestion[] } = {
  1: [
    {
      id: 101,
      question: "Qual é a principal função de um Projeto de Pesquisa no meio acadêmico?",
      options: [
        "Decorar a tese com citações para obter notas altas sem foco prático.",
        "Funcionar como um planejamento detalhado (mapa do percurso) que garante organização, viabilidade e rigor científico.",
        "Obter financiamento garantido de órgãos públicos sem necessidade de apresentar métodos de coleta.",
        "Apenas resumir artigos científicos escritos por outros autores sem propor uma nova pergunta.",
      ],
      correctIndex: 1,
      explanation: "Parabéns! De acordo com Lakatos e Marconi (2021), o projeto funciona como um guia detalhado e organizador de etapas que demonstra a viabilidade do estudo e direciona toda a prática científica.",
    },
    {
      id: 102,
      question: "Quantos componentes estruturais clássicos constituem o desenho de planejamento sugerido no Capítulo I?",
      options: [
        "Apenas 2: O Tema e a Conclusão final.",
        "Nove (9) componentes estruturais coordenados, que vão da seleção do tema até a apresentação do projeto pronto.",
        "Cinco (5) etapas, excluindo o cronograma e os recursos econômicos por serem opcionais no planejamento.",
        "Inúmeras etapas livres sem ordem cronológica obrigatória.",
      ],
      correctIndex: 1,
      explanation: "Excelente! O projeto acadêmico se divide em componentes integrados: Seleção do Tema, Formulação do Problema, Levantamento de Hipóteses, Levantamento Bibliográfico Inicial, Recursos Técnicos e Metodológicos, Recursos Econômicos, Plano Provisório, Cronograma, e Apresentação.",
    }
  ],
  2: [
    {
      id: 201,
      question: "A delimitação de um tema consiste em realizar um recorte metodológico preciso. Qual sigla mnemônica o livro ensina?",
      options: [
        "S.O.S: Sentido, Obra e Solução.",
        "P.O.C: População, Objeto e Contexto (Onde/Quando).",
        "A.B.N.T: Associação, Biblioteca, Normas e Teses.",
        "F.O.C.A: Fato, Opinião, Critério e Abordagem.",
      ],
      correctIndex: 1,
      explanation: "Isso mesmo! O P.O.C (População, Objeto e Contexto) é a técnica clássica de delimitação ensinada no Capítulo II, permitindo recortar um assunto amplo em um escopo perfeitamente viável.",
    },
    {
      id: 202,
      question: "Selecione a alternativa que representa um Tema perfeitamente Delimitado:",
      options: [
        "Stress em estudantes.",
        "Adultização infantil de crianças de 9 a 12 anos no TikTok e Instagram no Brasil entre 2023 e 2025.",
        "Redes sociais e seus impactos globais na saúde mental dos jovens modernos.",
        "Como a maquiagem altera a percepção social.",
      ],
      correctIndex: 1,
      explanation: "Incrível! A opção 2 delimita claramente a População (crianças de 9 a 12 anos), o Objeto (adultização infantil) e o Contexto (no TikTok e Instagram no Brasil entre 2023 e 2025).",
    }
  ],
  3: [
    {
      id: 301,
      question: "O Problema de Pesquisa deve ser formulado preferencialmente em qual formato estrutural?",
      options: [
        "Uma afirmação contundente e sem dúvidas.",
        "Uma pergunta clara, exata e investigativa que emerge da Delimitação do Tema.",
        "Um parágrafo histórico descrevendo a importância do tema sem interrogações.",
        "Em formato de hipótese sim/não.",
      ],
      correctIndex: 1,
      explanation: "Correto! O problema de pesquisa é a hipótese traduzida em pergunta investigativa central. Deve ser específico, viável, claro e formulado com um ponto de interrogação.",
    },
    {
      id: 302,
      question: "Qual das seguintes perguntas constitui um Problema de Pesquisa Científica válido?",
      options: [
        "As redes sociais são ruins para as crianças brasileiras?",
        "Como a exposição ao algoritmo do TikTok estimula gastos econômicos em adolescentes paulistas no ano de 2024?",
        "Devem os pais proibir as redes sociais imediatamente para proteger os menores?",
        "Por que as pessoas usam redes sociais?",
      ],
      correctIndex: 1,
      explanation: "Exato! A opção 2 é aberta, específica, mensurável empiricamente e estabelece um elo metodológico direto de causa e efeito em população/contexto estabelecidos.",
    }
  ],
  4: [
    {
      id: 401,
      question: "Como diferenciam-se o Objetivo Geral e os Objetivos Específicos de uma investigação acadêmica?",
      options: [
        "O geral aponta o tema amplo e os específicos mostram as opiniões pessoais da autoria.",
        "O Objetivo Geral expressa a finalidade maior do estudo (onde pretende-se chegar) e os Específicos são as metas intermediárias coordenadas de cada etapa.",
        "Não há diferença real, servem apenas para cumprir requisitos formais de formatação.",
        "O geral é o cronograma teórico e os específicos são os recursos financeiros gastos.",
      ],
      correctIndex: 1,
      explanation: "Perfeito! O objetivo geral indica a meta macro da pesquisa, enquanto os objetivos específicos funcionam como etapas progressivas que somadas permitem atingi-lo.",
    },
    {
      id: 402,
      question: "Qual a definição metodológica de 'Hipóteses' em pesquisa científica?",
      options: [
        "Respostas provisórias à pergunta de pesquisa que o estudo irá oportunamente testar, confirmar ou refutar.",
        "Ideias genéricas aceitas universalmente como verdades dogmáticas inapeláveis.",
        "Resumos bibliográficos das obras dos autores citados.",
        "O cronograma temporal de execução das atividades.",
      ],
      correctIndex: 0,
      explanation: "Espetacular! A hipótese é uma proposição de resposta conjectural que tenta explicar o problema e cuja veracidade o estudo testará através de dados experimentais ou qualitativos.",
    }
  ],
  5: [
    {
      id: 501,
      question: "A que pergunta essencial deve responder a Justificativa de um projeto de pesquisa?",
      options: [
        "Como vou coletar meus dados?",
        "Quanto custará a impressão da tese de graduação?",
        "Por que este estudo é importante e por que vale a pena realizá-lo?",
        "Quem me ajudará a formatar o texto segundo a ABNT?",
      ],
      correctIndex: 2,
      explanation: "Exatamente! Enquanto o problema indica o *o quê* será pesquisado, a justificativa explica a relevância social, científica e prática do estudo (comprovando por que ele merece atenção).",
    },
    {
      id: 502,
      question: "Segundo Severino (2017), quais dimensões de relevância uma boa justificativa idealmente deve cobrir?",
      options: [
        "Social (para a comunidade), Científica (teórica) e Prática (aplicação no trabalho), respaldada na Viabilidade técnica.",
        "Somente a dimensão econômica de custos operacionais diretos.",
        "Apenas a relevância científica baseada em tradução de livros internacionais.",
        "Opiniões subjetivas e juízos morais de certo/errado.",
      ],
      correctIndex: 0,
      explanation: "Muito bem! Uma justificativa robusta deve convencer a banca e a comunidade sobre a relevância prática, doação à ciência e o retorno à sociedade de forma realista (viabilidade).",
    }
  ],
  6: [
    {
      id: 601,
      question: "Recursos Metodológicos incluem planejar a Tipologia da Pesquisa. Quais classificações clássicas são apresentadas?",
      options: [
        "Rápidas, demoradas e medianas.",
        "Exploratória, Descritiva e Explicativa (conforme objetivo); e abordagens Qualitativa, Quantitativa ou Mista.",
        "Nenhuma, o pesquisador rascunha livre de categorias prévias.",
        "Pública ou Privada.",
      ],
      correctIndex: 1,
      explanation: "Perfeito! Conforme Gil (2019), as tipologias ordenam a investigação, dividindo-a por fins (exploratória, descritiva, explicativa) e meios de dados (qualitativa, quantitativa, mista).",
    }
  ],
  7: [
    {
      id: 701,
      question: "Qual técnica de análise de dados qualitativos é altamente recomendada no material (Capítulo V, Bardin 2011) para analisar conteúdos e falas?",
      options: [
        "Estatística multivariada linear.",
        "Análise de Conteúdo Temática (categorização de recorrências em temas de significados).",
        "Opinião pessoal baseada em intuição subjetiva.",
        "Pesquisa de opinião quantitativa eleitoral.",
      ],
      correctIndex: 1,
      explanation: "Você acertou! De acordo com Laurence Bardin (2011), a Análise de Conteúdo é a técnica clássica de codificar depoimentos ou mídias em unidades de registro reunidas em temas.",
    },
    {
      id: 702,
      question: "Se a sua pesquisa coleta dados de seres humanos (ex. entrevistas ou questionários), qual é a conduta ética correta?",
      options: [
        "Divulgar os nomes e fotos de todos os entrevistados nas redes sociais para engajamento.",
        "Submeter o projeto à aprovação do Comitê de Ética em Pesquisa (CEP) e coletar as assinaturas do Termo de Consentimento Livre e Esclarecido (TCLE).",
        "Não precisa de nenhuma proteção ética caso os participantes concordem verbalmente.",
        "Apenas manter os depoimentos escondidos, sem se preocupar com as comissões governamentais.",
      ],
      correctIndex: 1,
      explanation: "Sua conduta é exemplar! Pesquisas com seres humanos requerem anuência do CEP e proteção rígida da dignidade humana, sigilo absoluta e consentimento seguro via TCLE.",
    }
  ],
  8: [
    {
      id: 801,
      question: "Qual o papel dos 'Resultados Esperados' na fase de proposta de projeto de pesquisa?",
      options: [
        "Prever fatos exatos e inalteráveis antes mesmo de coletar os dados reais.",
        "Apresentar as projeções fundamentadas do que o pesquisador espera constatar (padrões ou percepções) com base teórica previa.",
        "Uma seção vazia que só é escrita no dia da defesa final.",
        "Uma lista de agradecimentos e créditos.",
      ],
      correctIndex: 1,
      explanation: "Perfeito! No projeto (antes da execução), os resultados esperados delimitam o que se antevê cientificamente, mostrando as implicações que as descobertas trarão.",
    }
  ],
  9: [
    {
      id: 901,
      question: "Quais as especificações de margem exigidas pela ABNT para trabalhos acadêmicos?",
      options: [
        "Esquerda e Superior com 3 cm; Direita e Inferior com 2 cm.",
        "Todas as margens iguais a 2,5 cm para maximizar a economia de papel.",
        "Esquerda e Inferior com 3 cm; Direita e Superior com 2 cm.",
        "Prazos e tamanhos livres dependendo da formatação de cada faculdade."
      ],
      correctIndex: 0,
      explanation: "Perfeito! A norma estabelece margens superiores e esquerdas com 3 cm (para dar espaço a encadernações) e margens inferiores e direitas com 2 cm."
    },
    {
      id: 902,
      question: "Quando uma citação direta é classificada como 'longa' e qual sua formatação de acordo com a NBR 10520?",
      options: [
        "Sempre que tiver mais de 5 linhas; deve ser formatada com espaçamento duplo e em negrito.",
        "Quando tiver mais de 3 linhas; deve ser destacada em bloco novo, com recuo de 4 cm à esquerda, fonte tamanho 10, espaçamento simples e sem aspas.",
        "Sempre que ultrapassar um parágrafo inteiro, devendo ser colocada entre aspas duplas de tamanho 14.",
        "Quando necessitar de tradução de outro idioma científico estrangeiro."
      ],
      correctIndex: 1,
      explanation: "Excelente! Citações diretas com mais de 3 linhas requerem recuo de 4 cm da margem esquerda, tamanho de fonte reduzido (geralmente 10), espaçamento simples e sem uso de aspas."
    }
  ]
};

export const SPRINTS_DATA: { [key: number]: SprintStructure } = {
  1: {
    num: 1,
    dates: "04/05 a 10/05",
    title: "Introdução e Componentes do Projeto de Pesquisa",
    pages: "Capítulo I, Páginas 3 a 5",
    summary: "Nesta semana, compreenderemos conceitualmente o que constitui um Projeto de Pesquisa e analisaremos em detalhes seus componentes estruturais essenciais, finalizando com as dicas didáticas iniciais de abordagem.",
    contentMarkdown: `### O que é um Projeto de Pesquisa?
O projeto de pesquisa é o **planejamento detalhado** que orienta toda a execução das fases do estudo. Ele funciona como um **mapa metodológico** que indica, de forma rigorosa e transparente, as indagações científicas e os caminhos empíricos ou bibliográficos de resolução.

Segundo as diretrizes de **Lakatos e Marconi (2021)**, o projeto permite:
- Planejar ordenadamente cada passo e período da pesquisa.
- Demonstrar explicitamente a viabilidade teórica e prática do estudo.
- Servir como guia definitivo para execução de coleta e avaliação de dados.

### Componentes Essenciais do Planejamento Científico
O percurso da pesquisa científica exige 9 etapas coordenadas:
1. **Seleção do Tema**: Escolha de assunto relevante, atual e viável.
2. **Formulação do Problema**: Tradução do tema em uma pergunta específica e clara.
3. **Levantamento das Hipóteses**: Elaboração de respostas provisórias que serão testadas.
4. **Levantamento Bibliográfico Inicial**: Revisão de conceitos, teses e teorias preexistentes.
5. **Indicação dos Recursos Técnicos e Metodológicos**: Determinação dos caminhos e ferramentas de coleta/análise.
6. **Indicação dos Recursos Econômicos**: Estimativa honesta de custos logísticos ou insumos.
7. **Plano Provisório de Assunto**: Esqueleto prévio de capítulos e tópicos.
8. **Cronograma da Pesquisa**: Planejamento temporal e distribuição de prazos.
9. **Apresentação do Projeto**: Formatação acadêmica (capa, resumo, bibliografia).

### Exercício Resolvido – Caso Prático: Estruturação dos Componentes de Pesquisa
**Problema Proposto:** Um estudante da área de Enfermagem deseja analisar o esgotamento profissional (Síndrome de Burnout) na sua instituição local, mas possui apenas anotações soltas sem qualquer rigor metodológico ou sequenciamento cronológico estruturado. Como o estudante deve organizar e ordenar sua proposta de pesquisa de acordo com os 9 componentes estruturais de Lakatos & Marconi (2021) para submeter à sua banca examinadora?

**Resolução e Orientação Comentada:**
O aluno deve converter suas anotações em uma estrutura linear e encadeada coerentemente:
1. *Tema Geral:* Síndrome de Burnout em profissionais de enfermagem de urgência hospitalar pública.
2. *Problema de Pesquisa:* Qual a prevalência e quais os principais fatores organizacionais preditores da Síndrome de Burnout em enfermeiros atuantes no Bloco de Emergência do Hospital Metropolitano X durante o ano de 2024?
3. *Levantamento de Hipóteses:* H1: Carga de plantões semanais superior a 44 horas associada à escassez de materiais médicos eleva significativamente os índices de burnout. H2: O sentimento de baixa valorização profissional correlaciona-se com o absenteísmo.
4. *Levantamento Bibliográfico:* Busca ativa de artigos indexados sobre Saúde Coletiva no SciELO e PubMed sob os termos "Burnout", "Nursing Staff" e "Emergency Medicine".
5. *Recursos Técnicos:* Aplicação do instrumento padronizado validado *Maslach Burnout Inventory (MBI)* e questionário sócio-ocupacional.
6. *Recursos Econômicos:* Custos estimados em R$ 120,00 para fotocópias de termos de consentimento, transporte do pesquisador e software de estatística livre (software R).
7. *Plano Provisório:* Divisão do trabalho em 3 capítulos estruturais: I. Fundamentação Teórica da Saúde do Trabalhador; II. Percurso Metodológico Clínico; III. Análise dos Indicadores Coletados.
8. *Cronograma:* Escalonamento em 5 meses de atividades, especificando redação bibliográfica nos meses 1-2, coleta de dados no mês 3, e análise final e entrega no mês 5.
9. *Apresentação do Projeto:* Layout nas normas estritas de formatação científica da ABNT.

### Dicas Didáticas Essenciais
- **Use Exemplos Concretos**: Sempre ancore ideias metodológicas abstratas em casos práticos. No material oficial, utilizamos o exemplo unificador da *adultização infantil nas redes sociais*.
- **Organize Visualmente**: Utilize tabelas, cronogramas e fluxogramas para facilitar o entendimento lógico imediato pela banca avaliadora.
- **Revise Constantemente**: Certifique-se de que seus objetivos de fato atacam a pergunta-problema de pesquisa.
- **Registre Fontes desde o Início**: Economize tempo registrando suas cotações bibliográficas em tempo real.`
  },
  2: {
    num: 2,
    dates: "11/05 a 17/05",
    title: "Definição e Delimitação do Tema de Pesquisa",
    pages: "Capítulo II (Itens 1, 2 e 3), Páginas 5 e 6",
    summary: "Selecione um tema com base em relevância científica e aprenda a aplicar a técnica mnemônica do P.O.C. (População, Objeto e Contexto) para delimitar o escopo da sua investigação de forma precisa.",
    contentMarkdown: `### O que é o Tema?
O tema representa o **assunto central** que se pretende investigar. É o campo de interesse científico, mas que ainda se encontra muito amplo e genérico, exigindo lapidação metódica.
*Exemplo de Tema Amplo*: "Adultização infantil nas redes sociais".

### A Importância de Argumentar o Tema
Um tema relevante não brota do acaso; defenda seu valor acadêmico com base em:
- **Atualidade**: Estar no centro de discussões contemporâneas da sociedade.
- **Repercussão Social**: Impacto direto na proteção de grupos vulneráveis ou saúde coletiva.
- **Apelo Interdisciplinar**: Gerar debates em áreas como psicologia, educação, comunicação e políticas públicas.

### A Técnica Metodológica de Delimitação: O Mnemônico P.O.C.
Para tornar o tema executável de forma viável dentro do limite de tempo, devemos realizar um fatiamento estrito na metodologia. A forma mais eficaz de fazer isso é preencher o triângulo do **P.O.C.**:
1. **P - População**: Definir detalhadamente quem será o sujeito de estudo (ex: *Crianças de 9 a 12 anos*).
2. **O - Objeto**: O fenômeno exato de estudo empírico (ex: *Processo de adultização: maquiagem, trejeitos, mercantilização infantil*).
3. **C - Contexto**: O contexto espacial e limites temporais (ex: *No TikTok e Instagram no Brasil, no biênio de 2023-2025*).

### Exercício Resolvido – Caso Prático: Aplicação de Delimitação com o Filtro P.O.C.
**Problema Proposto:** Um aluno de Odontologia ou Medicina quer pesquisar sobre "Telemedicina no Brasil". O orientador alertou que o assunto é vasto o suficiente para inviabilizar o trabalho se não sofrer delimitação cirúrgica. Como o aluno deve aplicar o mnemônico P.O.C. para reestruturar seu trabalho e focar em um nicho empiricamente viável?

**Resolução e Orientação Comentada:**
O aluno deve destrinchar o seu objeto geral aplicando sistematicamente as três etapas do mnemônico P.O.C.:
- **P (População):** Selecionar um público acessível e homogêneo. Em vez de "médicos em geral", define-se: *médicos pediatras e enfermeiros plantonistas de triagem*.
- **O (Objeto):** Escolher o fenômeno particular de reflexão. Em vez de "revolução da medicina digital", foca-se nas: *barreiras psicotecnológicas de adesão a prontuários eletrônicos compartilhados e atendimento síncrono*.
- **C (Contexto):** Georreferenciar e datar o local da coleta de dados operacionais (Contexto). Em vez de "Brasil" inteiro, escolhe-se: *hospitais filantrópicos conveniados ao SUS na Região Metropolitana de Salvador (BA), no biênio de 2023-2024*.

**Resultado Formatado (Tema Delimitado Conectado):**
"As barreiras psicotecnológicas de adesão à teleconsulta síncrona por médicos pediatras em hospitais filantrópicos conveniados ao SUS na Região Metropolitana de Salvador (BA) no biênio de 2023 a 2024."

### Exemplo Unificador de Tema Delimitado Conectado:
"Adultização infantil (sexualização e comportamentos adultos) de crianças entre 9 e 12 anos nas redes sociais (TikTok e Instagram) no Brasil entre 2023 e 2025."`
  },
  3: {
    num: 3,
    dates: "18/05 a 24/05",
    title: "Problema de Pesquisa e Prática Inicial",
    pages: "Capítulo II (Itens 4 a 7), Páginas 6 e 7",
    summary: "Aprenda a fundamentar ideias transformando o seu Tema Delimitado em uma Pergunta Investigativa precisa e explore o passo a passo de formulação do seu Problema de Pesquisa.",
    contentMarkdown: `### O que é o Problema de Pesquisa?
O problema de pesquisa é a **pergunta norteadora central** que direcionará todo o projeto. Ele define a lacuna empírica que você quer desvendar. Cientificamente, nenhuma pesquisa se inicia sem um problema claro.

### Regras de Ouro na Formulation da Pergunta Científica
- **Operacional**: Deve começar com termos de questionamento de alta especificação científica (ex: *Como...*, *Quais fatores...*, *De que maneira...*). Evite perguntas fechadas de sim ou não (ex: *As redes sociais fazem mal?*).
- **Especificidade**: O problema precisa conter, de forma embutida, os mesmos recortes de delimitação delimitados anteriormente.
- **Validade Empírica**: Deve ser resolvida através de coleta de dados realistas e fundamentação analítica, sem apelos puramente morais ou subjetivos.

### Exercício Resolvido – Caso Prático: Formulação e Refinamento de Problema de Pesquisa
**Problema Proposto:** Um acadêmico de Administração elaborou a seguinte pergunta-problema: "Os aplicativos de chatbot inteligentes ajudam a manter clientes felizes no e-commerce ou não?". O comitê de orientação recusou a pergunta, indicando que ela peca em rigor terminológico, traz juízo de valor informal ("clientes felizes") e induz uma resposta bimodal ou binária de sim/não. Como o estudante deve reestruturar e calibrar cientificamente essa questão?

**Resolução e Orientação Comentada:**
O aluno deve afastar termos emotivos ou subjetivos por variáveis operacionais quantificáveis e substituir o viés binário por um pronome interrogativo aberto:
- *Termo Informal Eliminado:* "clientes felizes" é substituído por dimensões científicas como "índices de fidelização de clientes" ou "taxa de churn (cancelamento)".
- *Substituição de Viés Binário:* A estrutura "ajudam ou não" é convertida em uma pergunta aberta sobre processos causais/correlacionais: "Como..." ou "Em que medida...".
- *Inclusão de Delimitação:* Especificar o marco temporal e geográfico-empresarial (Contexto), o produto estudado (Objeto) e quem interage com ele (População).

**Problema Refinado e Cientificamente Aprovado:**
"Em que medida a implementação de assistentes conversacionais baseados em Inteligência Artificial Generativa influencia a taxa de retenção de clientes recorrentes e as métricas de resolutibilidade em plataformas brasileiras de comércio eletrônico no segmento farmacêutico durante o ano de 2024?"

### Transformando Tema Delimitado em problema (Exemplo):
- **Tema Delimitado**: Adultização de crianças de 9 a 12 anos no TikTok no Brasil (2023-2025).
- **Problema Derivado**: *Como a presença sistemática no TikTok de crianças entre 9 e 12 anos no Brasil no período de 2023 a 2025 influencia a reprodução e adoção de comportamentos estéticos adultizados no cotidiano escolar?*

### Passo a Passo Prático de Alinhamento Coerente:
| Fase | Pergunta-chave | Aplicado ao exemplo |
| :--- | :--- | :--- |
| **Tema** | Qual assunto estudar? | *Adultização infantil nas redes sociais.* |
| **Delimitação (P.O.C.)** | Quem? O que? Onde/Quando? | *Crianças 9-12 anos; no TikTok/Instagram; Brasil; 2023-2025.* |
| **Problema** | Que pergunta central investigar? | *Como as redes estimulam e influenciam esses comportamentos nos menores brasileiros?* |`
  },
  4: {
    num: 4,
    dates: "25/05 a 31/05",
    title: "Objetivos e Hipóteses em Pesquisa Científica",
    pages: "Capítulo III, Páginas 7 a 9",
    summary: "Compreenda a diferença fulcral entre Objetivo Geral e Objetivos Específicos e aprenda a redigir Hipóteses acadêmicas sólidas. Especial: Alinhamento ao I Congresso Integrado dos Cursos da Saúde.",
    contentMarkdown: `### Objetivos da Pesquisa: Onde Queremos Chegar?
Os objetivos expressam de forma clara a meta do seu projeto científico. Eles respondem à clássica pergunta: **“Para quê estou pesquisando?”**.

- **Objetivo Geral**: É a finalidade macro do estudo. Ele está visceralmente amarrado à Pergunta-Problema de Pesquisa. Deve começar com **verbo no infinitivo** que demonstre ação analítica cognitiva (ex: *Analisar, Compreender, Comparar, Identificar*).
- **Objetivos Específicos**: Funcionam como degraus ou metas intermediárias cronológicas que, somadas, viabilizam alcançar o Objetivo Geral. Geralmente sugere-se formular entre 3 e 4 objetivos específicos.

### Hipóteses: Respostas Conjecturais Testáveis
As hipóteses são **respostas provisórias** formuladas em resposta ao Problema de Pesquisa. São suposições lógicas que o estudo ao longo da coleta irá atestar para *confirmar* ou *refutar*. 
*Exemplos de Hipóteses (Adultização)*:
- **H1**: Crianças submetidas a maior tempo de visualização ativa de influenciadores digitais demonstram maior tendência a adotar maquiagens e trejeitos comerciais adultos.
- **H2**: A presença de supervisão parental sistemática reduz de forma expressiva as práticas de adultização no TikTok do menor.

### Exercício Resolvido – Caso Prático: Alinhamento de Objetivos e Formulação de Hipóteses
**Problema Proposto:** Um grupo de pesquisadores em Oncologia quer testar se sessões diárias de musicoterapia reduzem a ansiedade declarada por pacientes geriátricos sob quimioterapia ambulatorial. Como estruturar verticalmente os Objetivos (Geral e Específicos) e as Hipóteses correspondentes para garantir aprovação em conselhos científicos federais?

**Resolução e Orientação Comentada:**
O desenho deve alinhar perfeitamente o problema com as ações cognitivas (verbos) e as respostas conjecturais:
- *Objetivo Geral (Meta Macro):* Avaliar a eficácia de sessões diárias de musicoterapia passiva no controle da ansiedade de pacientes oncológicos geriátricos sob quimioterapia ativa.
- *Objetivos Específicos (Etapas progressivas de viabilização):*
  1. Identificar os níveis basais de ansiedade dos pacientes por meio da Escala de Ansiedade de Beck antes de iniciar a quimioterapia.
  2. Aplicar sessões diárias padronizadas de musicoterapia passiva (30 minutos, andamentos lentos, fones estereofônicos) durante as infusões.
  3. Mensurar comparativamente a variação de marcadores fisiológicos (frequência cardíaca e pressão arterial média) pré e pós-intervenção.
  4. Correlacionar as flutuações de ansiedade com variáveis exógenas (sexo, idade e tipo de tumor sólido).
- *Hipótese de Pesquisa (H1):* Pacientes idosos submetidos à musicoterapia síncrona apresentam redução média superior a 25% nos escores de ansiedade da Escala de Beck se comparados ao grupo-controle convencional.
- *Hipótese Nula (H0):* Não há diferença estatisticamente significativa nos índices de ansiedade entre o grupo exposto à musicoterapia e o grupo exposto ao repouso tradicional.

### 🏥 Contexto Especial: Exercício do I Congresso Integrado dos Cursos da Saúde
Durante palestras em congressos de saúde, cientistas apresentam problemas e objetivos reais em tempo real. Esta semana coincide com o congresso integrado, servindo como uma sandbox para os estudantes. 
**Desafio**: Pratique a escuta ativa assistindo às palestras acadêmicas e extraia dali o Problema, o Objetivo Geral hipotético e as Hipóteses defendidas pelos palestrantes na Ficha Prática do Congresso!`
  },
  5: {
    num: 5,
    dates: "01/06 a 07/06",
    title: "A Justificativa do Projeto de Pesquisa",
    pages: "Capítulo IV, Páginas 9 a 23",
    summary: "Aprenda a fundamentar teoricamente a relevância do seu tema unindo as três dimensões de relevância clássicas (Social, Científica e Prática) sustentadas no referencial clássico de Severino.",
    contentMarkdown: `### O que é a Justificativa?
A justificativa responde à icônica questão da banca: **“POR QUE ESTE ESTUDO É IMPORTANTE?”**. Ela convence os avaliadores de que seu projeto traz contribuições valiosas e reais e, portanto, merece ser executado.

Segundo o referencial teórico clássico de **Severino (2017)** ou Lakatos (2021), a justificativa exige cobrir de forma robusta e elegante três dimensões principais de relevância:
1. **Relevância Social**: Demonstrar a contribuição prática para o avanço da sociedade, de grupos sob vulnerabilidade social ou para a formação coletiva humana.
2. **Relevância Científica**: Evidenciar como a sua pesquisa abordará lacunas da literatura atual, atualizará debates clássicos ou gerará novos insumos para a academia.
3. **Relevância Prática**: Identificar a utilidade imediata do estudo para profissionais da área em suas rotinas de trabalho diárias.
4. **Viabilidade**: Explicar com base em dados de disponibilidade física e prazos (geralmente cinco meses acadêmicos) que a pesquisa possui livre acesso a fontes para ser realizada sem impeditivos.

### Exercício Resolvido – Caso Prático: Elaboração Trimembre de Justificativa Teórica e Prática
**Problema Proposto:** Uma graduanda em Psicologia quer formular a Justificativa para seu TCC sobre "Inclusão escolar de crianças autistas via gamificação digital de reforço positivo". O primeiro manuscrito dela foi: "Eu acho esse tema lindo e meus primos autistas amam joguinhos". Como reestruturar essa justificativa sob as três dimensões de relevância acadêmica (Social, Científica e Prática) de Severino (2017) e defender sua viabilidade?

**Resolução e Orientação Comentada:**
O sentimento afetivo legítimo deve ser transformado em argumentos lógicos estruturados:
- **1. Relevância Social:** A gamificação direcionada apoia a diminuição de barreiras de comunicação e isolamento pedagógico escolar primário do aluno com Transtorno do Espectro Autista (TEA), alinhando-se diretamente às diretrizes nacionais da LBI (Lei Brasileira de Inclusão, Lei nº 13.146/15) e fomentando a cidadania.
- **2. Relevância Científica:** A literatura corrente exibe abundante fundamentação sobre gamificação de entretenimento, contudo carece de análises empíricas integrando técnicas de Análise do Comportamento Aplicada (ABA) com dispositivos móveis interativos de baixo custo nas redes de ensino municipais do Nordeste.
- **3. Relevância Prática:** Oferece um roteiro instrucional aplicável e adaptado para psicopedagogos e docentes em salas de Atendimento Educacional Especializado (AEE), subsidiando o planejamento de micro-recompensas cognitivas.
- **4. Viabilidade Técnica:** A pesquisa é exequível pois se ampara na análise de prontuários anonimizados cedidos voluntariamente pela Clínica Social Y e na aplicação de questionários digitais fechados a 15 professores cooperados durante o semestre letivo corrente.

### Estrutura Textual do Desenho Convencedor:
- **Contexto de Fundo**: Situar o tema de forma geral.
- **Problematização Curta**: Lembrar o porquê de o tema merecer uma atenção prioritária.
- **As Dimensões (Social/Acadêmica/Prática)**: Destacar os ganhos, os beneficiários teóricos e operacionais do estudo.
- **Conclusão de Exequibilidade**: Confirmar a viabilidade logística.`
  },
  6: {
    num: 6,
    dates: "08/06 a 14/06",
    title: "Metodologia da Pesquisa – Estrutura Operacional",
    pages: "Capítulo V (Itens 5.1 e 5.2), Página 24",
    summary: "Rascunhe os primeiros passos da metodologia, definindo a classificação científica do seu tipo de pesquisa, sua população-alvo e os critérios para amostragem empírica.",
    contentMarkdown: `### Elementos Operacionais da Metodologia (Gil, 2019)
A metodologia descreve o instrumental técnico e os procedimentos racionais usados para buscar respostas válidas e reprodutíveis à pergunta científica inicial.

Nesta Etapa 1 do planejamento metodológico, o foco repousa sobre a tipologia e a definição populacional do estudo:

### Classificação do Tipo de Pesquisa:
Conceitualmente, os projetos classificam-se em diferentes faces e direções:
- **Conforme os Objetivos**:
  - *Exploratória*: Quando o tema é pouco explorado e busca-se maior familiaridade visual inicial.
  - *Descritiva*: Quando o objetivo é descrever características, comportamentos e padrões de dada amostra.
  - *Explicativa*: Tenta decifrar as exatas causas e conexões que determinam dado fenômeno.
- **Conforme a Abordagem**:
  - *Qualitativa*: Foco na compreensão e profundidade subjetiva de percepções e significados, sem métricas numéricas.
  - *Quantitativa*: Foco em medições objetivas, uso de testes numéricos e tabelas estáticas.
  - *Mista*: Integração harmoniosa de dados quali e quanti num mesmo arcabouço.

### População-Alvo e Amostragem:
- **População (Universo)**: Conjunto total de indivíduos compartilhando as características do tema (ex: *Responsáveis por menores de 9 a 12 anos no estado de São Paulo*).
- **Amostra**: O recorte prático, numérico e realista que de fato participará da coleta de dados. Deve ser selecionada com base em **critérios de inclusão/exclusão** explícitos, garantindo a idoneidade científica do estudo.

### Exercício Resolvido – Caso Prático: Enquadramento Metodológico e Amostragem
**Problema Proposto:** Um acadêmico de Nutrição Desportiva quer avaliar "o perfil de ingestão proteica e o nível de satisfação muscular com dietas hiperproteicas exclusivamente plant-based em praticantes amadores de musculação". Como ele deve classificar e esquematizar seu enquadramento metodológico clássico segundo Gil (2019) e construir seus critérios formais de inclusão e deleção amostral?

**Resolução e Orientação Comentada:**
O pesquisador deve segmentar de forma analítica o tipo de pesquisa e fixar filtros precisos para a amostragem:
- **1. Classificação Metodológica Metódica:**
  - *Conforme os Objetivos:* Descritiva (pois pretende detalhar o padrão alimentar contemporâneo e mapear dados de satisfação existentes sem induzir manipulação direta de variáveis).
  - *Conforme a Abordagem:* Mista ou Quali-Quantitativa (visto que quantificará a gramagem proteica média corporal - dados quanti - e extrairá o nível de percepção qualitativa de recuperação pós-treino via entrevistas dirigidas).
- **2. Filtros de Seleção de Amostra (Amostragem não-probabilística por conveniência):**
  - *Critérios de Inclusão:* Praticantes regulares de musculação com frequência mínima de 3 dias por semana nos últimos 6 meses; idade entre 18 e 45 anos; que adotem orientação dietética estritamente baseada em vegetais (vegana) no último ano; ativos em centros de treino ou academias parceiras da pesquisa.
  - *Critérios de Exclusão:* Praticantes com histórico de cirurgia bariátrica recente; praticantes sob uso síncrono de esteroides anabolizantes sintéticos não-prescritos; indivíduos incapacitados de responder digitalmente ao questionário respondente.`
  },
  7: {
    num: 7,
    dates: "15/06 a 21/06",
    title: "Metodologia da Pesquisa – Coleta, Análise e Ética",
    pages: "Capítulo V (Itens 5.3 e 5.4), Páginas 24 e 25",
    summary: "Selecione ferramentas de coleta de dados qualitativos ou quantitativos de forma coordenada e planeje as de análise de Bardin, respeitando as normas éticas com seres humanos (CEP/TCLE).",
    contentMarkdown: `### Instrumentos de Coleta de Dados
Os instrumentos de coleta definem a forma como o pesquisador coletará as informações empíricas para responder aos seus objetivos:
- **Entrevistas Semiestruturadas**: Excelentes para qualitativas. Roteiros de perguntas abertas que dão liberdade de discurso ao entrevistador.
- **Questionários de Escala Likert**: Excelentes para abordagens estatísticas ou quantitativas.
- **Análise Documental**: Mapeamento de perfis públicos, legislações, posts ou registros corporativos.

### Análise de Dados: Encontrando Padrões
Não basta coletar; é fundamental planejar como as informações serão tratadas:
- **Análise de Conteúdo Temática (Bardin, 2011)**: Técnica para dados qualitativos, que consiste em ler, codificar, e agrupar registros repetidos em categorias analíticas de significados.
- **Estatística Descritiva**: Para dados numéricos quantitativos (médias, frequências, porcentagens em gráficos de pizza/barras).

### 🛡️ Ética na Pesquisa Científica com Seres Humanos
Qualquer captação de dados de pessoas (física ou virtualmente) deve atentar-se às resoluções governamentais de ética (ex: no Brasil, a **CNS 466/12 e a CNS 510/16**):
- **O Comitê de Ética em Pesquisa (CEP)**: Tramitação do projeto pela Plataforma Brasil.
- **Termo de Consentimento Livre e Esclarecido (TCLE)**: Documento oficial obrigatório assinado para participantes adultos.
- **Termo de Assentimento**: Para menores de idade.
- **Anonimização**: Garantir em contrato de sigilo que nenhum dado pessoal que permita identificar o participante será publicado.

### Exercício Resolvido – Caso Prático: Desenho de Roteiro de Entrevista e Parecer de Ética
**Problema Proposto:** Um mestrando em Saúde Coletiva planeja entrevistar 10 médicos pediatras sobre "o impacto da exposição precoce às telas touch-screen na aquisição de linguagem em lactentes". Quais as etapas burocráticas éticas obrigatórias (Plataforma Brasil) e como redigir um roteiro inicial de perguntas consistentes para a entrevista qualitativa?

**Resolução e Orientação Comentada:**
O pesquisador deve obrigatoriamente conciliar as exigências morais legais da CEP (Comissão de Ética em Pesquisa) com um bom instrumento de coleta qualitativa:
- **1. Trâmite Ético Legal (Plataforma Brasil):**
  - *Passo A - TCLE:* Elaborar o Termo de Consentimento Livre e Esclarecido (TCLE) com linguagem acessível, declarando riscos (cansaço, desconforto emocional), benefícios, direito de desistir a qualquer momento e termo de sigilo rígido.
  - *Passo B - Submissão:* Cadastrar a proposta na Plataforma Brasil, anexando a Folha de Rosto assinada pela diretoria da universidade, o projeto completo de pesquisa, e o roteiro exato de perguntas. 
  - *Passo C - Coleta:* Aguardar a emissão de Parecer de Aprovação Consubstanciado emitido pelo CEP da instituição antes de disparar qualquer entrevista ou contato direto.
- **2. Estrutura das Perguntas Qualitativas (Roteiro Semiestruturado):**
  - *Pergunta 1 (Abordagem Exploratória Clínica):* "Em sua rotina de consultas neuropediátricas, quais as principais manifestações de atraso no desenvolvimento fonológico que o(a) senhor(a) associa diretamente ao tempo excessivo de tela de lactentes menores de dois anos?"
  - *Pergunta 2 (Fatores Ambientais/Orientação):* "Como o(a) senhor(a) avalia a adesão prática e a receptividade dos pais ou cuidadores quando instruídos a retirar integralmente os estímulos digitais do cotidiano imediato do lactente?"`
  },
  8: {
    num: 8,
    dates: "22/06 a 28/06",
    title: "Resultados Esperados, Conclusão e Cronograma",
    pages: "Capítulos VI e VII, Páginas 26 e 27",
    summary: "Projete as implicações práticas do seu projeto, formate a síntese dos seus achados para elaboração de políticas, e finalize ajustando seu cronograma temporal para a entrega acadêmica.",
    contentMarkdown: `### Resultados Esperados em Projetos de Pesquisa
Como o projeto descreve um planejamento prévio à coleta real do trabalho de campo, não apresentamos dados consolidados concluídos, mas sim a seção de **Resultados Esperados**. 

Você deve responder de forma fundamentada e coerente:
- O que você plausivelmente estima constatar ao final da coleta de dados? (ex: *estimamos que a supervisão parental ativa reduza de forma expressiva o tempo de scroll ativo das crianças*).
- De que modo essas constatações resolverão os objetivos ou justificarão as hipóteses indicadas?
- Qual a sua visão prospectiva sobre as futuras contribuições teóricas ou práticas do estudo?

### A Conclusão da Proposta do Projeto
Diferente da conclusão das pesquisas prontas, a conclusão do projeto visa amarrar os fios condutores:
- Confirmar cientificamente a coerência integradora essencial do projeto.
- Delinear as limitações e possíveis imprevistos de escopo enfrentados (ex: *risco de perda amostral de entrevistados*).
- Consolidar propostas de impacto em políticas públicas coletivas.

### O Cronograma de Atividades: Seu Guia de Prática Diária
O cronograma em tabela ou Gantt estabelece a viabilidade física sequencial exequível. Ele deve refletir as interações e de forma realista dispor prazos adequados, como rascunhado em nosso gráfico de Gantt interativo! Garantir que a revisão bibliográfica alimente a formulação teórica antes de entrar a campo para coleta ajudará a evitar re-trabalhos metodológicos recorrentes.

### Exercício Resolvido – Caso Prático: Projeção de Resultados Esperados e Gestão de Riscos
**Problema Proposto:** Um acadêmico de Engenharia e Gestão Ambiental está escrevendo o último capítulo de seu projeto teórico de sensores de telemetria autônomos em filtros de água rurais. Como formular coerentemente a seção de "Resultados Esperados" sem alegar falsas certezas antecipadas e como desenhar uma matriz rápida de contingência de prazos para a banca?

**Resolução e Orientação Comentada:**
O aluno deve se expressar em tom prospectivo e provisório e propor soluções de salvaguarda de tempo:
- **1. Formulação Científica dos Resultados Esperados (Projeção Analítica):**
  - *Redação Adequada:* "Espera-se constatar que a inserção de microcontroladores de medição contínua de turbidez nos reservatórios comunitários reduza em até 40% o tempo médio de resposta de manutenção preventiva operada pelas autarquias de saneamento. Plausivelmente, as leituras telemétricas comprovarão a hipótese de que o acúmulo de biofilme sedimentar nas membranas obedece a um ritmo linear de saturação sazonal."
- **2. Matriz de Contingência (Gestão de Riscos do Cronograma):**
  - *Risco A (Perda de Prazos de Fornecimento de Peças):* Mitigação: Uso de simuladores virtuais baseados em software ou sensores analógicos locais alternativos para calibração.
  - *Risco B (Dificuldade de Acesso às Comunidades Rurais por intempéries climáticas):* Mitigação: Agendamento prévio de representantes locais treinados via chamadas telefônicas síncronas de áudio e envio de coletas assistidas.`
  },
  9: {
    num: 9,
    dates: "Especial Conclusão",
    title: "Regras de Formatação de Trabalhos Acadêmicos (Normas ABNT)",
    pages: "Capítulo Especial, Páginas 28 a 30",
    summary: "Domine as diretrizes definitivas de apresentação científica conforme as normas regulamentares da ABNT: padrões de layout, recuos, citações e referências bibliográficas.",
    contentMarkdown: `### 📖 A Importância da Padronização Científica (ABNT)
As normas da **Associação Brasileira de Normas Técnicas (ABNT)** não são meros caprichos burocráticos. Elas garantem a **democraticidade, legibilidade e uniformidade** na comunicação da ciência. Ao padronizar a estrutura, qualquer pesquisador no mundo consegue identificar com facilidade a autoria, as fontes citadas e os métodos empregados no seu estudo.

### 📐 Formatação Geral da Página
Para qualquer documento acadêmico padrão (Monografias, TCCs, Projetos ou Dissertações), a ABNT define regras precisas de layout:
- **Margens:** Esquerda e Superior com **3 cm**; Direita e Inferior com **2 cm**.
- **Fontes recomendadas:** *Arial* ou *Times New Roman* (tamanho 12 para o corpo do texto).
- **Espaçamento:** Simplesmente **1,5** para o corpo do texto e **1,0 (simples)** para citações longas, notas de rodapé, tabelas e referências.
- **Alinhamento:** Todo o texto deve ser **Justificado**, com recuo de primeira linha do parágrafo de **1,25 cm** (ou 1 tabulação padrão).
- **Numeração de folhas:** Exibida no canto superior direito, a partir da primeira folha da parte textual (Introdução), embora a contagem comece desde a folha de rosto.

### 💬 Citações Diretas e Indiretas (NBR 10520)
A ética científica exige dar o devido crédito aos autores originais. Há duas formas principais de realizar isso no fluxo do seu manuscrito:

#### 1. Citação Direta (Transcrição Literal das Palavras do Autor)
- **Citação Curta (Até 3 linhas):** Deve ser integrada ao corpo do texto, necessariamente **entre aspas**.
  > *Exemplo:* Segundo Severino (2017, p. 82), "a ciência se constrói coletivamente mediante debates documentados".
- **Citação Longa (Mais de 3 linhas):** Deve ser destacada em um bloco separado, com recuo de **4 cm** da margem esquerda, tamanho de fonte **10**, espaçamento simples (1,0) e sem aspas.
  > *Exemplo destacado:*
  > A pesquisa teórica deve ser pautada pelo escrutínio rigoroso de fontes fidedignas e metodologicamente estruturadas para evitar desvios ideológicos ou suposições baseadas exclusivamente no senso comum do próprio autor analista. (GIL, 2019, p. 104)

#### 2. Citação Indireta (Paráfrase - Reescrita com suas próprias palavras)
Nesta modalidade, você resume ou aborda o pensamento do autor com o seu linguajar. Não usa aspas nem recuo, mas obrigatoriamente cita o sobrenome e o ano.
- > *Exemplo:* O desenho metodológico adequado confere robustez jurídica e reputacional à investigação teórica (GIL, 2019).

### 📚 Listagem de Referências Bibliográficas (NBR 6023)
Localizada ao final do trabalho, a seção de Referências deve listar em ordem alfabética todas as fontes citadas. Veja os principais modelos formatados:

| Tipo de Fonte | Estrutura Padrão | Exemplo Prático de Aplicação |
| :--- | :--- | :--- |
| **Livro (Um autor)** | SOBRENOME, Nome. *Título do livro em itálico*: subtítulo. Edição. Local: Editora, ano. | SEVERINO, Antônio Joaquim. *Metodologia do Trabalho Científico*. 24. ed. São Paulo: Cortez, 2017. |
| **Artigo de Periódico** | SOBRENOME, Nome. Título do artigo. *Nome da Revista em Itálico*, Local, v. volume, n. número, p. páginas, ano. | BARDIN, Laurence. A análise de conteúdo sob o prisma qualitativo. *Revista de Psicologia Analítica*, São Paulo, v. 12, n. 3, p. 45-56, 2011. |
| **Documento de Internet** | AUTOR ou ENTIDADE. *Título em itálico*. Ano. Disponível em: URL. Acesso em: dia mês. ano. | BRASIL. Ministério da Saúde. *Diretrizes éticas de estudos com seres humanos*. 2016. Disponível em: http://saude.gov.br. Acesso em: 12 maio 2026. |

### 🎓 Exercício Resolvido – Caso Prático: Formatação de Referências e Citações
**Problema Proposto:** Um acadêmico de Ciências Sociais elaborou a seguinte citação no corpo do texto: *"Como diz o Gil no seu livro Como Elaborar Projetos de Pesquisa, a pesquisa empírica é muito boa porque traz dados úteis."* Além do linguajar coloquial reprovado, ele inseriu na sua lista final de referências apenas: *"Gil, Antonio Carlos. Como Elaborar Projetos de Pesquisa (2019) Editora Atlas"*. Como reestruturar essas passagens para passarem no crivo da banca e cumprirem as normas NBR 10520 e NBR 6023 da ABNT?

**Resolução e Orientação Comentada:**
O sentimento e a coloquialidade devem ser transformados em argumentos lógicos estruturados e em conformidade estrita com o manual da ABNT:
- **1. Calibração da Citação (Paráfrase Acadêmica):** No fluxo do texto, o autor deve usar a voz ativa científica impessoal com o sobrenome destacado de forma sóbria:
  - *Redação Correta:* De acordo com Gil (2019), a coleta sistemática de dados empíricos fornece subsídios práticos e operacionais para a compreensão e resolução de problemas sociais estruturados.
- **2. Normalização da Referência Bibliográfica:** Ajustar seguindo rigorosamente a ordem de sobrenome em caixa alta, título em destaque itálico, local de publicação e editora:
  - *Referência Correta:* GIL, Antônio Carlos. *Como elaborar projetos de pesquisa*. 6. ed. São Paulo: Atlas, 2019.`
  }
};
