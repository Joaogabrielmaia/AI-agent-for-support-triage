# Riscos

Probabilidade e impacto são **julgamentos meus** (A/M/B), não medições.

| ID | Risco | Prob. | Impacto | Mitigação no projeto | Risco residual |
|---|---|---|---|---|---|
| R-01 | **Alucinação:** o agente afirma algo que não está na base. | M | A | Responder só com fontes (RN-01), limiar de confiança (RN-02), filtro de saída de preço e promessa (RN-08/09), avaliação com perguntas fora da base. | Médio. O filtro só pega preços e promessas; fato errado sem número passa. A rodada 3 ainda tem 2 de 10 fora da base respondidas (F01, F03). |
| R-02 | **Vazamento de dados pessoais** para o modelo ou para o banco. | M | A | Mascaramento antes de guardar e enviar (RN-06), bloqueio de dados de terceiros (RN-07), guarda de acesso no servidor. | Baixo para os formatos cobertos. Nomes e endereços **não** são mascarados. |
| R-03 | **Prompt injection.** | M | A | Bloqueio na entrada, isolamento do texto do cliente em `<pergunta>`, marcador-canário e filtro de saída (ADR-007). | Médio. Regras por padrão não pegam todo ataque novo; só testei os que escrevi. |
| R-04 | **Custo** maior que o esperado. | M | M | Trechos curtos, no máximo 3 fontes, busca local sem custo de embeddings, estimativa no painel. | Desconhecido: sem execução real não há número. |
| R-05 | **Promessa indevida** (reembolso, prazo). | M | A | RN-04, RN-09, texto fixo no escalonamento. | Baixo. |
| R-06 | **Base desatualizada** responde com informação velha. | A | M | Lacunas (RF-11), sugestões (RF-13). | Médio. Nada detecta artigo **errado**, só ausente. |
| R-07 | **Medir o que o Mock faz e achar que é o Claude.** | A | A | Todo relatório declara o provedor; o relatório do Claude está em branco com instruções. | Alto até alguém rodar com chave. |
| R-08 | **Sobreajuste ao conjunto de avaliação.** | A | M | Conjunto de validação separado (20 perguntas) escrito antes do ajuste. | Médio: o conjunto é pequeno e eu sou o autor dos dois. |
| R-09 | **Resistência do time** (medo de perder o emprego). | M | A | O atendente avalia e controla; painel sem produtividade individual. | O software sozinho não resolve. Ver [retrospectiva](../06-pos-lancamento/retrospectiva.md). |
| R-10 | **Força bruta no login.** | B | M | Mesma mensagem para e-mail inexistente e senha errada. | **Sem limite de tentativas** implementado. Limitação conhecida. |
