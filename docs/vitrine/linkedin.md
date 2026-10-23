# Post de LinkedIn (rascunho)

Construí um agente de IA de suporte. O mais importante não foi o chatbot, foi a avaliação.

O **Prumo** faz a triagem do suporte de uma empresa fictícia (a Agenda Bela, um SaaS de agendamento para salões). Ele responde com fontes, diz "não tenho essa informação" quando não sabe e encaminha para uma pessoa com resumo, categoria, prioridade e motivo.

O que eu mais aprendi:

→ **Subir o limiar de confiança não bastava.** As faixas de confiança das perguntas respondíveis e das fora da base se sobrepunham. Só uma medida de cobertura das palavras da pergunta separou os dois grupos: a recusa correta foi de 20% para 80%.

→ **Um conjunto de validação separado me corrigiu.** O ganho no conjunto em que ajustei foi de +20 pontos. No separado, +10. A diferença é sobreajuste, e eu só vi porque separei antes.

→ **Uma melhoria que não melhorou também entra no relatório.** A terceira rodada não mudou o total: corrigiu 3 erros e criou 3.

→ **Um Mock não é o modelo.** Rodei tudo com um provedor determinístico, sem chave de API. Ele mede busca, limiar, escalonamento e guardrails. Não mede o Claude, e a rodada com o Claude real está em branco no repositório, com o passo a passo para rodar.

Tem 31 artigos, 70 perguntas de avaliação, 78 testes, 14 E2E e 13 prints. Tudo roda local com Docker Compose. Não tem demo hospedada de propósito: o README, os documentos e os prints contam a história.

Reuniões e entrevistas do discovery são simuladas, e estão marcadas assim.

[link do repositório]

#IA #automação #suporte #engenharia
