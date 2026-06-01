import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API router for server-side Gemini review
  app.post("/api/gemini/review", async (req, res) => {
    try {
      const { sprintNum, drafts } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      // If API key is not present/unset, fallback immediately to local structured advice
      if (!apiKey || apiKey.includes("MY_GEMINI_API_KEY") || apiKey.trim() === "") {
        return res.status(200).json({
          feedback: `### ⚠️ Nota do Co-orientador (Modo Simulado)
Como a chave de API do Gemini ainda não foi cadastrada nos segredos (Secrets) do projeto, estou operando em **modo de simulação acadêmica local**.

Aqui estão algumas diretrizes metodológicas gerais sobre o seu progresso no **Sprint ${sprintNum}**:

1. **Alinhamento Conceitual**: Lembre-se do "fio condutor" de qualquer trabalho científico: o **Tema Delimitado** precisa estar em perfeita sintonia rítmica com a sua **Pergunta de Pesquisa**, os seus **Objetivos**, as suas **Hipóteses**, a **Justificativa** e, por fim, com as técnicas propostas na **Metodologia**.
2. **P.O.C Check (Se for o Tema/Delimitação)**: Lembre-se, delimitar é recortar! Garanta que delimitou indicando claramente quem é a **População**, qual o **Objeto** exato de análise e em qual **Contexto** (Ex: TikTok e Instagram no Brasil, entre 2023-2025).
3. **Clareza nos Objetivos**: Todo objetivo deve começar com um **verbo de ação no infinitivo** (ex: *analisar, mapear, quantificar, confrontar, identificar*). Evite verbos subjetivos como *ajudar* ou *melhorar*.
4. **Viabilidade Prática**: O seu cronograma e recursos (econômicos/metodológicos) devem ser realistas e adaptados a um prazo acadêmico (por exemplo, 5 meses).

*Dica: Para habilitar a análise em tempo real baseada em IA para os seus próprios dados textuais, faça o cadastro de sua chave de API do Gemini no painel de Segredos (Secrets) do Google AI Studio Build!*`
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let prompt = "";
      if (sprintNum === 2) {
        prompt = `Você é um professor catedrático e co-orientador acadêmico especialista em Metodologia de Pesquisa Científica (Baseado em Lakatos e Marconi).
O aluno está no Sprint 2: Definição e Delimitação do Tema.
Ele submeteu as seguintes informações sobre o projeto de pesquisa dele:
- Tema Amplo: "${drafts.theme || ""}"
- População: "${drafts.population || ""}"
- Objeto de Estudo: "${drafts.object || ""}"
- Contexto (Onde/Quando): "${drafts.context || ""}"
- Proposta de Tema Delimitado por ele: "${drafts.delimitedTheme || ""}"

Por favor, faça uma análise científica de alto nível em língua portuguesa usando Markdown. Use espaçamentos confortáveis e excelente design de texto.
Sua resposta deve ter exatamente estas seções bem formatadas com emojis sérios:
1. **🔍 Análise do Triângulo P.O.C (População, Objeto, Contexto)**: Avalie o rascunho de delimitação dele.
2. **⚠️ Riscos Metodológicos Identificados**: Aponte se o tema está amplo demais, se falta fundamentação operacional ou se parece cientificamente inviável.
3. **🎓 Sugestão de Escrita Fluida (Delimitação)**: Ofereça 1 ou 2 formulações acadêmicas impecáveis e otimizadas baseando-se nas informações que ele introduziu.`;
      } else if (sprintNum === 3) {
        prompt = `Você é um professor titular e co-orientador de Metodologia de Pesquisa Científica.
O aluno está no Sprint 3: Problema de Pesquisa.
As informações do desenho científico que ele rascunhou:
- Tema Delimitado: "${drafts.delimitedTheme || ""}"
- Pergunta de Pesquisa (Problema): "${drafts.researchProblem || ""}"

Analise em língua portuguesa sob o formato Markdown estruturado:
1. **❓ Crítica da Pergunta Norteadora**: Ela começa com palavra interrogativa apropriada (ex: 'Como', 'De que maneira', 'Quais fatores')? É delimitadora e operacional? Evita respostas dicotômicas simples de 'sim' ou 'não' e estimula análise factual ou estrutural?
2. **🔗 Conexão de Escopo**: O problema de pesquisa deriva de forma transparente e lógica do Tema Delimitado?
3. **🪄 Redações Alternativas Recomendadas**: Forneça 2 opções de formulação extremamente afiadas e adequadas às regras formais da metodologia acadêmica.`;
      } else if (sprintNum === 4) {
        prompt = `Você é um co-orientador de Metodologia Científica altamente rigoroso e construtivo.
O aluno está no Sprint 4: Objetivos e Hipóteses de Pesquisa.
Os dados de progresso coletados:
- Tema Delimitado: "${drafts.delimitedTheme || ""}"
- Problema de Pesquisa: "${drafts.researchProblem || ""}"
- Objetivo Geral: "${drafts.generalObjective || ""}"
- Objetivos Específicos:
  1. "${drafts.specificObjective1 || ""}"
  2. "${drafts.specificObjective2 || ""}"
  3. "${drafts.specificObjective3 || ""}"
- Hipótese(s) Formulada(s): "${drafts.hypotheses || ""}"

Apresente um parecer acadêmico formal em Markdown compreendendo:
1. **🎯 Alinhamento do Fio Condutor**: O Objetivo Geral dialoga diretamente com o Problema de Pesquisa, iniciando obrigatoriamente com verbo de ação no infinitivo?
2. **🛠️ Avaliação da Escada de Objetivos Específicos**: Eles formam uma sequência lógica (ex: descrever, identificar, correlcionar, confrontar) para se atingir o objetivo geral?
3. **💡 Consistência das Hipóteses**: Representam respostas provisórias robustas e plausíveis que serão testadas? São livres de juízos de valor meramente opinativos?
4. **📝 Proposta de Melhoria**: Sugira reescritas para otimizar os verbos, a concisão e a precisão científica desses elementos.`;
      } else if (sprintNum === 5) {
        prompt = `Você é uma banca avaliadora de projetos acadêmicos e co-orientador científico.
O aluno está no Sprint 5: Justificativa do Projeto (baseado nas diretrizes clássicas de Severino, 2017).
Ele inseriu os seguintes rascunhos para justificar a importância do seu estudo:
- Relevância Social (sociedade, problemas reais, comunidade): "${drafts.justificationSocial || ""}"
- Relevância Científica (contribuição ao estado da arte, literatura, lacunas acadêmicas): "${drafts.justificationScientific || ""}"
- Relevância Prática (uso diário por profissionais, aplicabilidade prática): "${drafts.justificationPractical || ""}"
- Viabilidade e Prazos (acesso real aos dados, exequibilidade de tempo): "${drafts.justificationViability || ""}"

Forneça feedback refinado em Markdown:
1. **⚖️ Avaliação Crítica das Relevâncias**: O argumento construído tem poder persuasivo e robustez científica? Explica claramente *quem* se beneficia da pesquisa?
2. **📈 Viabilidade de Coleta**: O aluno previu de modo sensato o acesso aos sujeitos/fontes no cronograma acadêmico?
3. **✍️ Redação Acadêmica Unificada**: Formule e costure os rascunhos fornecidos pelo aluno em **um ou dois parágrafos prontos de alto padrão científico** (normas padrão e estilo clássico) que ele possa copiar e usar diretamente em sua justificativa acadêmica oficial!`;
      } else if (sprintNum === 6 || sprintNum === 7) {
        prompt = `Você é um especialista em metodologia de pesquisa científica e desenho amostral (baseado em Gil, 2019 e Bardin, 2011).
O estudante está definindo a estrutura operacional e de coleta/ética (Sprints 6 e 7).
Configuração metodológica delineada:
- Tipo e Cobertura de Pesquisa: "${drafts.researchType || ""}"
- Abordagem de Investigação: "${drafts.researchApproach || ""}"
- Amostra e Critérios de Entrada: "${drafts.sampleCriteria || ""}"
- Ferramenta / Instrumento de Coleta: "${drafts.dataCollectionTool || ""}"
- Mecanismo de Análise de Dados: "${drafts.dataAnalysisMethod || ""}"
- Requer Aprovação do Comitê de Ética (seres humanos): "${drafts.ethicsApprovalNeeded ? 'Sim, precisa passar pelo CEP/Conep' : 'Não'}"

Produza o parecer técnico metodológico em Markdown abordando:
1. **📊 Coerência de Desenho Operacional**: A abordagem (ex: Qualitativa) faz sentido lógico em termos práticos com o método de análise (ex: Análise de Conteúdo Temática)?
2. **⚙️ Robustez Amostral**: O critério de seleção da população e da amostra é reprodutível, viável e metodologicamente idôneo?
3. **🛡️ Recomendações Éticas e Científicas**: Se lida com humanos, quais cuidados de sigilo, TCLE e normas éticas (Ex. Resoluções do Brasil CNS 466/12 ou 510/16) devem ser rigidamente delineados?
4. **📖 Autores Clássicos de Apoio**: Recomende os autores de metodologia mais conceituados para o tipo de pesquisa dele (ex: Creswell, Yin, Bardin, Gil ou Minayo) para ele incluir em suas referências bibliográficas.`;
      } else if (sprintNum === 8) {
        prompt = `Você é um co-orientador especialista em Metodologia de Pesquisa.
O aluno submeteu seu desenho acadêmico consolidado (Sprints de 1 a 8) e deseja um parecer metodológico de encerramento.
Dados compilados do projeto:
- Tema Delimitado: "${drafts.delimitedTheme || drafts.theme || ""}"
- Problema Metodológico: "${drafts.researchProblem || ""}"
- Objetivo Geral: "${drafts.generalObjective || ""}"
- Projeção de Resultados Esperados: "${drafts.expectedResultsText || ""}"

Por favor, faça um parecer integrador final em Markdown elegante em português:
1. **👑 Consistência do Fio Condutor**: Uma avaliação global se a introdução teórica se alinha de forma conclusiva com a sua projeção de resultados esperados.
2. **📝 Dicas Para o Relatório de Campo Final**: Como conduzir a análise livre de viés e como reportar as limitações.
3. **✨ Mensagem de Sucesso**: Uma bela e respeitosa saudação acadêmica motivadora e profissional de encerramento de Sprints para incentivar o progresso cientifico contínuo do aluno!`;
      } else {
        prompt = `Você é um co-orientador acadêmico especialista em Normas de Publicação Científica e ABNT.
O aluno está no Capítulo Especial: Regras de Formatação de Trabalhos Acadêmicos (Normas ABNT).
Não há campos específicos digitados, o aluno quer uma orientação avançada ou revisão de dúvidas sobre formatação ABNT (margens, fontes, citações longas e referências de livros/sites/periódicos).

Faça um parecer pedagógico rico em Markdown em português abordando:
1. **📏 Checklist de Impacto ABNT**: Detalhes cruciais de margens (3-3-2-2), fontes (Arial vs Times New Roman), espaçamento (1,5) e recuo (1,25 cm).
2. **📖 A Arte de Citar Sem Plágio**: Como diferenciar visualmente citações diretas curtas (até 3 linhas entre aspas) de citações diretas longas (mais de 3 linhas com recuo de 4 cm e fonte reduzida) seguindo a NBR 10520.
3. **📚 Organização de Referências Primorosa**: Dicas de como construir a lista bibliográfica impecavelmente conforme a NBR 6023 para livros físicos, capítulos de livros, artigos científicos de bases como SciELO e endereços eletrônicos de internet.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const feedback = response.text;
      res.json({ feedback });
    } catch (apiError: any) {
      console.error("Gemini API Error:", apiError);
      res.status(500).json({ error: "Erro ao processar análise do Gemini: " + apiError.message });
    }
  });

  // Serve static assets in production, otherwise Vite handles it
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
