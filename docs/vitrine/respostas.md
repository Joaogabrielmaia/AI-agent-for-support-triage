# Respostas para "me fala desse projeto"

## Em 30 segundos
Construí o Prumo, um agente de IA que faz a triagem do suporte de uma empresa fictícia de agendamento. Ele responde com fontes, admite quando não sabe e encaminha para uma pessoa com o contexto organizado. O diferencial é que eu montei um conjunto de 70 perguntas de teste e ajustei o agente olhando os erros: a recusa correta foi de 20% para 80%. E eu deixo claro o que não sei: rodei com um provedor simulado, então a rodada com o Claude real está em branco, esperando uma chave de API.

## Em 2 minutos
O problema que escolhi foi o de um suporte pequeno afogado em perguntas repetidas, com um medo muito concreto: o robô dar informação errada. Isso virou requisito. O agente só responde com base numa base de conhecimento de 31 artigos, cita a fonte, recusa quando a confiança é baixa, e nunca decide dinheiro, identidade nem exclusão de dados: esses assuntos vão para uma pessoa, com resumo, categoria, prioridade e motivo.

Montei em Next.js e TypeScript, PostgreSQL com pgvector e o Claude atrás de uma interface, com um provedor simulado para testar sem rede. Tem guardrails em camadas: mascaro dados pessoais antes de guardar, bloqueio a injeção de prompt antes de chamar o modelo, e um filtro de saída barra preço inventado e promessa de reembolso.

A parte de que mais me orgulho é a avaliação. Escrevi 50 perguntas, e mais 20 de validação separadas antes de ajustar. Na primeira rodada o agente acertou 66%. Olhei os erros e vi que o limiar de confiança não separava as classes. Mudei a confiança para considerar a cobertura das palavras da pergunta e cheguei a 86% no desenvolvimento e 80% na validação. O ganho menor na validação me mostrou o quanto eu tinha sobreajustado. A terceira rodada não mudou o total, e isso também está registrado.

As limitações estão no README: a busca é lexical e não semântica, o provedor registrado é simulado, e os adversariais foram escritos por mim. A próxima etapa é rodar com o Claude real e trocar a busca por embeddings.

## Perguntas que costumam vir depois
**"Isso está em produção?"** Não. É um estudo com empresa fictícia, rodando local. Não há cliente real, e as reuniões do discovery são simuladas e marcadas assim.

**"Qual foi o maior erro?"** Mudar cinco coisas de uma vez na segunda rodada. Não sei a contribuição de cada uma. Faria uma por rodada.

**"Por que não usou embeddings de verdade?"** Para tudo rodar sem rede e sem chave, de forma reproduzível. É a maior limitação, e é o item 3 do roadmap.
