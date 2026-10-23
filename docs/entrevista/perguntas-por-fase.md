# Perguntas de entrevista, por fase

Três perguntas por fase, com respostas curtas em primeira pessoa. Todas as respostas usam só o que está no repositório.

## Fase 0 — Preparação
**1. Por que um projeto de suporte, e por que essa empresa fictícia?**
Porque suporte é onde IA aplicada tem benefício e risco ao mesmo tempo, e é onde eu tenho experiência. Criei a Agenda Bela para ter um domínio pequeno, completo e sem dado real.

**2. Como você garantiu a integridade de um caso fictício?**
Escrevi as regras no `CLAUDE.md` e no `docs/00-sobre-este-caso`: reuniões simuladas marcadas como tal, metas como hipóteses, nenhum número de avaliação sem execução real, nada de deploy.

**3. Por que tudo roda local?**
Para qualquer pessoa reproduzir com `docker compose up` e para eu não precisar manter nem expor nada. As provas são prints e documentos.

## Fase 1 — Descoberta
**1. Como você escolheu a ideia?**
Fiz uma matriz de decisão com pesos. O chatbot de FAQ pontuou mais, mas o medo de erro do negócio me levou a cercá-lo com triagem, resumo e lacunas. A matriz está em `docs/01-discovery`.

**2. Como lidou com pedidos vagos?**
Perguntava o contrário: "me dê 3 coisas que ele *não* pode fazer". Dali saiu a lista de assuntos que sempre escalam.

**3. O que mudou o escopo?**
A restrição de que só o financeiro decide reembolso e desconto. Ela virou regra de negócio (RN-04), filtro de saída e o motivo no chamado.

## Fase 2 — Definição
**1. Como você manteve rastreabilidade?**
IDs de requisito (RF, RNF, RN), commits que os citam e uma matriz que liga requisito, história, código e teste.

**2. Como tratou metas de qualidade?**
Como hipóteses, com a forma de verificar. Algumas ficaram **abaixo** da meta nos números reais, e eu deixei isso escrito.

**3. Qual risco você considera mais perigoso?**
Medir o Mock e achar que é o Claude. Por isso todo relatório declara o provedor.

## Fase 3 — Arquitetura
**1. Por que RAG e não ajuste fino?**
Porque preço e política mudam, e no RAG atualizar um arquivo atualiza o agente. E só o RAG dá citação nativa.

**2. Qual foi a decisão mais questionável?**
Embeddings por hashing local. Dá reprodutibilidade, mas não é semântico, e é a maior limitação do projeto. Documentei isso no ADR-002 com o que eu faria depois.

**3. Como o sistema falha?**
Modo por modo: API fora vira encaminhamento, busca fora vira recusa, resposta com promessa vira encaminhamento. Cada um tem teste.

## Fase 4 — Avaliação
**1. Como você evitou enganar a si mesmo?**
Escrevi 20 perguntas de validação antes de ajustar. O ganho foi de 20 pontos no desenvolvimento e 10 na validação, e a diferença é sobreajuste.

**2. O que o Mock mede?**
Busca, limiar, escalonamento e guardrails. Não mede a redação do Claude, e a rodada com o Claude real está em branco, com o passo a passo.

**3. Qual resultado foi ruim?**
A rodada 3 não mudou o total. Corrigiu 3 erros e criou 3. Está registrado, com a explicação.

## Fase 5 — Implementação
**1. Como o agente decide responder, recusar ou escalar?**
Primeiro bloqueio de injeção e de dados de terceiros, depois regras de assuntos sensíveis, depois confiança. Só então chamo o modelo, e o filtro de saída ainda pode desfazer a resposta.

**2. Como você tratou dados pessoais?**
Mascaro CPF, CNPJ, e-mail, telefone e cartão antes de guardar e de enviar. Não mascaro nomes, e isso está na lista de limitações.

**3. Um bug que você encontrou na demo?**
"Agendamentos sumiram" não escalava, porque minha regex esperava a ordem inversa. Corrigi e criei teste com as duas ordens.

## Fase 6 — Qualidade
**1. O que seus testes provam?**
78 testes unitários e de integração, 14 E2E contra o build de produção, lint e tipos sem erros. Não medi cobertura e não vou afirmar percentual.

**2. Como testou segurança?**
Injeção bloqueada sem chamar o modelo, modelo malicioso contido pelo filtro de saída, dados de terceiros, acesso sem login e papel errado.

**3. O que ficou sem teste?**
O `AnthropicProvider`, o limite de tentativas de login, a acessibilidade com ferramenta automática e a carga.

## Fase 7 — Evolução
**1. O que você implementou na v1.1 e por quê?**
Sugestão de novos artigos a partir de lacunas repetidas. Fecha o ciclo entre "o que o cliente pergunta" e "o que a base cobre".

**2. Por que o rascunho não traz fatos?**
Porque um artigo bonito e errado viraria fonte do próprio agente. O rascunho traz as perguntas reais e campos a preencher.

**3. O que faria primeiro no roadmap?**
Rodar a avaliação com o Claude real. É a maior lacuna.

## Fase 8 — Vitrine e README
**1. Como contar esse projeto em 30 segundos?**
Veja `docs/vitrine/respostas.md`.

**2. O que o projeto demonstra sobre você?**
Que eu trato IA como sistema que precisa ser medido, que desenho para falhar bem, e que registro o que não funcionou.

**3. O que você não afirma?**
Que existe cliente real, ganho de tempo ou economia medidos, ou que o Claude se sairia como o Mock.
