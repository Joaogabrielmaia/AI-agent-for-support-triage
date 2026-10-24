# 01 · Brainstorm de ideias de IA para suporte e matriz de decisão

## Contexto
Listei cinco usos de IA que fazem sentido para um suporte pequeno e os comparei numa matriz. Queria uma decisão comparável, e não a ideia que parece mais legal.

## As cinco ideias
| # | Ideia | O que faria |
|---|---|---|
| A | **Chatbot de FAQ** | Responde dúvidas repetidas direto ao cliente, com base num material aprovado. |
| B | **Triagem e priorização** | Classifica o chamado (categoria, urgência) e encaminha para a pessoa certa. |
| C | **Resumo de tickets** | Resume uma conversa longa para quem assume o chamado. |
| D | **Sugestão de resposta ao atendente** | O modelo rascunha, a pessoa revisa e envia. |
| E | **Análise de lacunas** | Mostra o que os clientes perguntam e a base não cobre. |

## Critérios e pesos
Os pesos refletem o negócio descrito em [02-agenda-bela.md](02-agenda-bela.md): o maior medo é o robô dar informação errada, e o maior custo é gente respondendo a mesma pergunta.

| Critério | Peso | Por quê |
|---|---|---|
| Reduz trabalho repetitivo | 5 | É a dor declarada. |
| Risco de resposta errada ao cliente | 5 (invertido: menos risco, mais nota) | É o medo declarado. |
| Esforço de construir e avaliar | 3 | Estudo individual, com prazo. |
| Dá para medir com perguntas de teste | 4 | A avaliação é o diferencial do projeto. |
| Exercita automação, IA aplicada e implantação | 3 | É o recorte de competências do estudo. |

## Matriz (nota de 1 a 5 por critério; total = soma de nota × peso)
| Ideia | Repetitivo (×5) | Risco (×5) | Esforço (×3) | Mensurável (×4) | Recorte do estudo (×3) | **Total** |
|---|---|---|---|---|---|---|
| A. Chatbot de FAQ | 5 | 2 | 3 | 5 | 4 | 25+10+9+20+12 = **76** |
| B. Triagem e priorização | 3 | 4 | 4 | 4 | 4 | 15+20+12+16+12 = **75** |
| C. Resumo de tickets | 2 | 5 | 5 | 2 | 3 | 10+25+15+8+9 = **67** |
| D. Sugestão de resposta | 4 | 4 | 3 | 3 | 4 | 20+20+9+12+12 = **73** |
| E. Análise de lacunas | 3 | 5 | 4 | 3 | 3 | 15+25+12+12+9 = **73** |

> As notas são o meu julgamento para este caso, não medições. Mudar um peso muda o ranking, e é por isso que deixei os pesos escritos.

## Decisão
**Escolhi combinar A + B + C + E com A como núcleo**: um chatbot de FAQ que, quando não deve ou não consegue responder, faz a triagem (B) com resumo (C) e registra a pergunta como lacuna (E). Deixei **D (sugestão de resposta ao atendente) fora** do MVP.

- **Contexto:** o negócio quer menos volume, mas teme a resposta errada.
- **Alternativas:** só triagem (B), que é a mais segura e quase não reduz volume; ou só FAQ (A), que reduz volume mas sem rede de proteção.
- **Escolha e motivo:** A com B/C/E em volta. A reduz o volume, e B/C/E são a rede de proteção que torna A aceitável para quem tem medo de erro. Também é o desenho que mais se presta a ser avaliado com perguntas de teste.
- **Trade-off:** o escopo é maior do que o de uma ideia só, e o chatbot fala direto com o cliente, que é o ponto de maior risco.
- **Quando eu mudaria:** se a avaliação com o Claude real mostrasse muita resposta errada com confiança alta, eu recuaria para D (o modelo só rascunha para a pessoa) e trataria A como fase seguinte.
