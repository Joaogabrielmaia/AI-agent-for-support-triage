# Segurança e confiabilidade

[← Índice do ciclo de vida](README.md) · [04 · Arquitetura](04-arquitetura-e-adrs.md) · [07 · Testes](07-testes-e-qualidade.md)

Controles implementados, como cada um é testado e onde estão os limites. As decisões completas estão nos [ADR-006](../03-arquitetura/decisoes.md#adr-006--mascaramento-de-dados-pessoais), [ADR-007](../03-arquitetura/decisoes.md#adr-007--prompt-injection) e [ADR-009](../03-arquitetura/decisoes.md#adr-009--autenticação-e-sessão).

## Ameaças e controles
| Ameaça | Controle | Onde | Teste | Limite conhecido |
|---|---|---|---|---|
| Injeção de prompt direta | Padrões de entrada bloqueiam a mensagem antes do modelo (RN-07) | `detectInjection` | `security.test.ts` (8 casos, com espião que prova que o modelo não é chamado) | Regras por padrão; ataques novos, em outro idioma ou em várias mensagens podem passar |
| Texto do cliente tratado como instrução | Texto isolado em `<pergunta>` e prompt que o trata como dado | `providers.ts` | Só exercitado com o provedor simulado e com a Groq | A camada não foi medida isoladamente |
| Vazamento do prompt | Marcador-canário no prompt; resposta que o contém é bloqueada | `checkOutput` | `security.test.ts` (modelo induzido a vazar) | Depende de o marcador aparecer literalmente |
| Dados de outro cliente | Bloqueio de pedidos sobre terceiros (RN-07) | `detectThirdPartyData` | `security.test.ts` (3 pedidos) | Regras por padrão |
| Dado pessoal no banco ou no modelo | Mascaramento de CPF, CNPJ, e-mail, telefone e cartão com Luhn (RN-06) | `maskPii` | `guardrails.test.ts`, `pipeline.test.ts` | Nomes e endereços não são mascarados |
| Preço ou política inventados | Todo valor em R$ da resposta precisa constar nas fontes (RN-08) | `checkOutput` | `pipeline.test.ts` | O filtro cobre valores em R$, não outros fatos |
| Promessa de reembolso, prazo ou exceção | Resposta com promessa não fundamentada vira encaminhamento (RN-09) | `checkOutput` | `pipeline.test.ts` | Padrões de linguagem escritos pelo autor |
| Acesso indevido à área da equipe | Sessão com cookie assinado `httpOnly`, papéis, guarda por página e ação | `auth.ts`, `requireUser` | E2E (rotas exigem login; atendente não abre o painel) | Sem limite de tentativas; sem recuperação de senha; sem 2FA |
| Enumeração de usuários | Mesma mensagem para e-mail inexistente e senha errada | login | E2E "senha errada" | — |
| Segredos no repositório | Chaves só por variável de ambiente; `.env` fora do Git | `.gitignore`, `.env.example` | Varredura do histórico em 2026-10-24: nenhuma chave de API; apenas credencial local do compose | O exemplo traz credencial de desenvolvimento local |

## Critérios de recusa e escalonamento
- **Recusa (RN-02):** confiança abaixo de 0,16, ou cobertura das palavras da pergunta abaixo de 0,4 (a confiança vira similaridade × cobertura), ou o próprio modelo admitindo que não sabe. A pergunta entra nas lacunas.
- **Escalonamento (RN-04):** reembolso e estorno, cobrança contestada, exclusão de conta ou dados, recuperação de acesso, pedido comercial, ameaça jurídica, perda de dados e pedido explícito de atendente.
- **Bloqueio (RN-07):** injeção e dados de terceiros, sem chamar o modelo.
- **Prioridade (RN-05):** Urgente para jurídico e perda de dados; Alta para reembolso, cobrança contestada, exclusão e acesso; Média para pedido comercial, pedido de atendente, filtro de saída e provedor fora.

## Limites da recuperação de conhecimento
- A busca é lexical (embedding por hashing). Perguntas fora da base que compartilham palavras com artigos reais (F01, F03) chegam a 0,33 de confiança, acima de 7 perguntas respondíveis, e nenhum limiar as separa.
- Nada detecta um artigo errado, apenas a ausência de artigo (R-06).
- A rodada com o Claude real não foi executada: o comportamento do prompt com esse modelo é hipótese.

## Confiabilidade
Modos de falha e tratamento estão em [sequencia-e-falhas.md](../03-arquitetura/sequencia-e-falhas.md): modelo fora vira encaminhamento (RN-10), busca fora vira recusa, resumo que falha não impede o chamado. Não há fila de reenvio com o banco fora, e não há teste de carga.
