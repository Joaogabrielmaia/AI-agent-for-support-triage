# Decisões de arquitetura (ADRs)

Cada decisão segue o mesmo formato: **contexto, alternativas, escolha, motivo, trade-off e quando eu mudaria de ideia.** Os números citados vêm das rodadas registradas em [`../04-avaliacao/`](../04-avaliacao/comparativo-rodadas.md).

Índice: [001 RAG](#adr-001--rag-vs-ajuste-fino-vs-regras) · [002 Embeddings e pgvector](#adr-002--embeddings-locais-e-pgvector) · [003 Tamanho dos trechos](#adr-003--tamanho-dos-trechos) · [004 Limiar de confiança](#adr-004--limiar-de-confiança-e-como-medi-lo) · [005 Citação](#adr-005--política-de-citação) · [006 Mascaramento](#adr-006--mascaramento-de-dados-pessoais) · [007 Prompt injection](#adr-007--prompt-injection) · [008 Provedor](#adr-008--abstração-do-provedor-de-linguagem) · [009 Sessão](#adr-009--autenticação-e-sessão) · [010 Avaliação](#adr-010--como-avaliar-sem-se-enganar)

---

## ADR-001 · RAG vs. ajuste fino vs. regras
**Contexto.** O agente precisa responder sobre um produto cujo conteúdo muda (preços, telas, prazos) e **citar a fonte**.

**Alternativas.**
1. **Regras/árvore de decisão** (palavras-chave → resposta fixa).
2. **Ajuste fino** de um modelo com as respostas da empresa.
3. **RAG:** buscar trechos de artigos e pedir ao modelo que responda só com eles.

**Escolha.** RAG, com regras **só** para o que nunca deve ser decidido pelo modelo (RN-04, RN-07).

**Motivo.** Preço e política mudam: no RAG, atualizar um arquivo Markdown atualiza o agente, e no ajuste fino seria preciso retreinar. Só o RAG dá citação nativa (o trecho **é** a fonte). Regras puras não generalizam para perguntas escritas de jeito novo.

**Trade-off.** A qualidade passa a depender da busca: se o trecho certo não vem, a resposta falha (foi o que a avaliação mais mostrou). E o RAG não impede o modelo de ignorar a fonte, por isso existe o filtro de saída (ADR-007).

**Quando eu mudaria.** Se o volume crescesse e as respostas exigissem tom e formato muito específicos, eu combinaria RAG com um modelo ajustado no estilo. Ajuste fino **para fatos**, nunca.

---

## ADR-002 · Embeddings locais e pgvector
**Contexto.** A API da Anthropic não oferece modelo de embeddings, e eu queria que o sistema, os testes e a avaliação rodassem **sem rede e sem chave**.

**Alternativas.**
1. API de embeddings de terceiro.
2. Modelo neural local (baixar pesos, rodar em Node).
3. **Embedding local por hashing** (bag of words com IDF, bigramas e hash para 512 dimensões).

**Escolha.** A opção 3, isolada em `embedder.ts`, com **pgvector** como armazenamento e busca por cosseno.

**Motivo.** Determinístico, instantâneo, zero dependência externa, reprodutível por qualquer pessoa. O pgvector entra porque é o armazenamento certo para a evolução (trocar o embedder não muda o resto) e porque um teste de integração garante que a busca em memória, usada na avaliação, devolve o mesmo trecho que o `<=>` do pgvector nas 50 perguntas.

**Trade-off.** **Não é busca semântica de verdade:** ele casa palavras, e não significados. "Grátis" só encontra "gratuito" porque acrescentei raiz por prefixo e um pequeno léxico de sinônimos. Foi a maior limitação do projeto: F01 ("integração com WhatsApp para lembretes") e F03 ("CNPJ da empresa Agenda Bela") tiram nota 0,33 porque dividem palavras com artigos reais.

**Quando eu mudaria.** Já. Com chave de API ou um modelo neural local, o primeiro passo do roadmap é trocar o `HashingEmbedder` e rodar a mesma avaliação para comparar. A interface do embedder e o formato `vector(512)` precisariam acompanhar a nova dimensão.

---

## ADR-003 · Tamanho dos trechos
**Contexto.** O artigo inteiro num vetor dilui o assunto; um trecho pequeno demais perde contexto.

**Alternativas.** (a) um trecho por artigo; (b) um trecho por seção `##`, com divisão por frase acima de 600 caracteres; (c) janelas fixas de N caracteres.

**Escolha.** (b). Os artigos já são escritos em seções curtas, então a seção é a unidade natural. Resultado: 93 trechos de 31 artigos (contra 31 no baseline).

**Evidência.** Na rodada 1 (um trecho por artigo), "Como configuro a comissão dos profissionais?" (R25) foi recusada com confiança 0,14 por diluição. Na rodada 2, com seções, passou. A fundamentação nas 30 respondíveis foi de 73,3% para 90,0%. **Cuidado:** na rodada 2 mudaram várias coisas ao mesmo tempo (seções, bigramas, sinônimos, prefixo, confiança com cobertura). Não isolei o efeito de cada uma, e por isso não atribuo o ganho só aos trechos.

**Trade-off.** Seção pequena às vezes não tem a frase que responde (R01, R23, H01 na rodada 2). Isso gerou o ajuste da rodada 3 (ADR-005).

**Quando eu mudaria.** Com artigos longos e sem seções, passaria para janelas com sobreposição. Com embeddings neurais eu testaria trechos maiores.

---

## ADR-004 · Limiar de confiança e como medi-lo
**Contexto.** RN-02: abaixo de um limiar, o agente recusa. Preciso de uma definição de "confiança" e de um número.

**Alternativas.**
1. Limiar fixo na similaridade do melhor trecho (**baseline: 0,15**).
2. Limiar na similaridade **e** cobertura mínima das palavras da pergunta no trecho.
3. Pedir ao modelo que diga o quanto está seguro.

**Escolha.** A opção 2 (`top1+coverage`), com **limiar 0,16 e cobertura mínima 0,4**. Quando a cobertura fica abaixo do mínimo, a confiança vira `similaridade × cobertura`.

**Como medi.** Pelo harness: na rodada 1 a confiança das respondíveis ia de 0,12 a 0,54 (mediana 0,29) e a das fora da base de 0,07 a 0,29. **As faixas se sobrepõem**, então nenhum limiar só na similaridade separa os grupos (recusa correta de 20%). Com a cobertura, a confiança das fora da base despenca (mediana 0,06) enquanto a das respondíveis sobe (mediana 0,42). Escolhi os valores com `npm run sweep` ([saída gravada](../04-avaliacao/varredura-limiar.txt)) e depois confirmei no conjunto de validação separado.

**Resultado.** Recusa correta de 20% para 80% (desenvolvimento) e de 60% para 80% (validação).

**O que não resolve.** Duas perguntas fora da base seguem respondidas, F01 e F03, ambas com confiança 0,33. Sete das 30 respondíveis têm confiança menor que 0,33 (as confianças das respondíveis estão em `resultados-rodada-3.json`). **Nenhum limiar as separa:** é um limite da busca lexical (ADR-002), e não de calibragem.

**Um ponto de honestidade.** Depois da rodada 3, a varredura mostra que **0,22–0,24 com cobertura 0,4 daria 88%** no desenvolvimento (uma pergunta a mais). Não mudei, por dois motivos: seria ajustar de novo no mesmo conjunto, e a diferença é de uma pergunta, abaixo do que consigo distinguir de ruído.

**Trade-off.** Limiar alto recusa demais (o cliente fica sem resposta), limiar baixo erra demais (o cliente recebe informação errada). Pelo medo da líder, **errei para o lado de recusar**.

**Quando eu mudaria.** Com o Claude real, eu mediria também a taxa de "o modelo disse que não sabe" e usaria isso como segundo sinal. Com embeddings neurais, toda a calibragem precisaria ser refeita.

---

## ADR-005 · Política de citação
**Contexto.** O cliente quer saber de onde veio a resposta (reunião 3), e a líder quer auditar.

**Alternativas.** (a) listar todos os trechos recuperados; (b) citar só os que sustentam a resposta; (c) citar por artigo.

**Escolha.** (b): até **3 trechos**, descartando os abaixo de `max(limiar, 60% do melhor)`, com **no máximo 2 do mesmo artigo**, mostrando "Título · Seção" e o trecho ao abrir. O Mock cita `[1] [2]`; o prompt do Claude exige citar os números usados.

**Motivo e evidência.** A versão inicial mantinha **1 trecho por artigo**, e o trecho que sobrevivia nem sempre era o que respondia. Foi visto ao vivo: "Quanto custa o plano Profissional?" respondeu o preço do profissional adicional. Permitir 2 por artigo corrigiu R01, R23 e H01.

**Trade-off honesto.** O total de aprovadas **não mudou** (43/50 e 16/20). A mudança trocou erros: corrigiu 3 e introduziu 3 (R12, R17, H07), porque o `MockProvider` extrativo escolhe frases piores quando recebe mais texto. Isso é uma propriedade do Mock, e o Claude real provavelmente lidaria melhor com mais contexto, **mas isso é uma hipótese, não medi**. Mantive a mudança porque corrige o caso mais visível (a pergunta de preço).

**Quando eu mudaria.** Se a rodada com o Claude real mostrasse piora com 2 trechos por artigo, voltaria para 1 e melhoraria a seleção do trecho.

---

## ADR-006 · Mascaramento de dados pessoais
**Contexto.** A dona da clínica (reunião 3) não quer dados de clientes indo para um modelo externo.

**Alternativas.** (a) mascarar antes de guardar e de enviar; (b) mascarar só ao enviar; (c) não mascarar e confiar no provedor.

**Escolha.** (a) com regex para e-mail, CNPJ, CPF, cartão (validado por Luhn) e telefone, **antes** de qualquer persistência, busca, resumo ou chamada ao modelo.

**Trade-off.** Regex não pega nomes, endereços nem texto livre com dados de saúde. Também há risco de falso positivo (um número longo parecido com telefone). A checagem de Luhn reduz o falso positivo em cartões; para telefone não há checagem equivalente.

**Quando eu mudaria.** Com dados de saúde de verdade no chat, eu adicionaria detecção de entidades por modelo e uma política de retenção. Aqui eu só mascaro o que sei descrever com padrão.

---

## ADR-007 · Prompt injection
**Contexto.** O texto do cliente é entrada não confiável que chega ao modelo.

**Alternativas.** (a) confiar no prompt de sistema; (b) filtro de entrada por padrões; (c) filtro de saída; (d) várias camadas.

**Escolha.** (d), em quatro camadas: **(1)** padrões de entrada bloqueiam a mensagem **sem chamar o modelo**; **(2)** o texto do cliente vai em `<pergunta>` e o prompt manda tratá-lo como dado; **(3)** o prompt contém um **marcador-canário** (`PRUMO-CANARY-7731`) e qualquer resposta que o contenha é bloqueada; **(4)** o filtro de saída barra preço fora da fonte e promessa.

**Evidência.** Os 8 casos de injeção dos testes de segurança e os 3 casos de injeção do harness são bloqueados antes do modelo, e um teste simula um modelo "induzido a vazar" para provar que a camada 3 segura.

**Limite importante.** As camadas 1 e 3 são regras que eu escrevi, **depois de pensar nos ataques que testei**. O conjunto adversarial do harness deu 100% desde a rodada 1 e **isso não prova robustez**: prova que as regras cobrem os ataques que conheço. Ataques novos, em outra língua, ou construídos em várias mensagens podem passar. A camada 2 só foi exercitada com o `MockProvider`, que ignora o prompt.

**Quando eu mudaria.** Com o Claude real, eu rodaria um conjunto maior de ataques escritos por outra pessoa, medindo a camada 2 isoladamente (desligando as regras de entrada).

---

## ADR-008 · Abstração do provedor de linguagem
**Contexto.** Preciso testar sem rede e sem gastar, e não quero depender de um fornecedor.

**Escolha.** Interface `LlmProvider` (`answer`, `summarize`, `draftArticle`) com `MockProvider` (extrativo, determinístico) e `AnthropicProvider` (Messages API via `fetch`, chave por variável de ambiente). `providerFromEnv()` escolhe com `LLM_PROVIDER`.

**Motivo.** Todos os testes, a avaliação e a demonstração rodam sem chave. O provedor não decide nada de política: guardrails, limiar e escalonamento ficam no pipeline, então valem para qualquer modelo.

**Trade-off.** O Mock **não é um proxy da qualidade do Claude**. Ele mede a parte do sistema que não depende da redação. Por isso todo relatório declara o provedor, e a rodada com o Claude real está vazia, com instruções.

**Quando eu mudaria.** Se eu precisasse de streaming ou de uso de ferramentas, a interface ganharia métodos novos.

**Atualização.** Provedor Groq adicionado depois (commit `c729230`); ver [`relatorio-modelo-aberto.md`](../04-avaliacao/relatorio-modelo-aberto.md).

---

## ADR-009 · Autenticação e sessão
**Contexto.** E-mail e senha, papéis Admin e Atendente, sem dependência pesada.

**Escolha.** Senha com `scrypt` e sal por usuário; cookie `httpOnly`, `sameSite=lax`, com `userId.expiração.assinatura` (HMAC-SHA256, comparação em tempo constante); **guarda no servidor** em cada página e Server Action, sem depender de middleware. Mesma mensagem para e-mail inexistente e senha errada.

**Trade-off.** Não há limite de tentativas, recuperação de senha nem rotação de sessão. Para um estudo local é aceitável; para produção não.

**Quando eu mudaria.** Para qualquer uso real, adotaria uma biblioteca de autenticação mantida, com limite de tentativas e 2FA.

---

## ADR-010 · Como avaliar sem se enganar
**Contexto.** Ajustar o agente olhando as mesmas perguntas que o avaliam infla o resultado.

**Escolha.** Dois conjuntos: **desenvolvimento** (50 perguntas, usado para decidir os ajustes) e **validação** (20 perguntas, escrito **antes** do ajuste e consultado só no fim de cada rodada). Cada execução grava commit, data, perfil e provedor.

**Evidência de que importou.** O ganho no desenvolvimento (66% → 86%) é maior que na validação (70% → 80%). A diferença é o sobreajuste que eu esperava.

**Trade-off.** Vinte perguntas são poucas (uma pergunta = 5 pontos percentuais) e eu escrevi os dois conjuntos. Não há intervalo de confiança aqui, e eu não afirmo precisão além do que os números mostram.

**Quando eu mudaria.** Pediria a outra pessoa que escrevesse perguntas sem ver a base.
