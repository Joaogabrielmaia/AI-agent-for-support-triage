# Qualidade: plano e resultados reais

Os logs completos estão ao lado, gerados pelo comando indicado, com data e commit no cabeçalho.

## Resultado das execuções

Os logs de `1640e4a` (sem sufixo de commit) são anteriores à rodada com a Groq (commits `c729230` e `30de504`), que alterou `providers.ts`, `pipeline.ts`, `score.ts`, `run.ts` e testes. Valem como histórico. O estado do HEAD está nos logs com o commit no nome.

**Estado do HEAD** (2026-10-24, Node v24.14.0, banco local com `db:seed` e `db:demo`):

| Verificação | Resultado | Log |
|---|---|---|
| Vitest | **83 de 83 passando**, em 9 arquivos | [`execucao-vitest-2cb000d.txt`](execucao-vitest-2cb000d.txt) |
| `tsc --noEmit` e `next lint` | sem erros nem avisos | [`execucao-lint-tipos-2cb000d.txt`](execucao-lint-tipos-2cb000d.txt) |
| Playwright E2E | **13 de 14 passando** (ver nota) | [`execucao-e2e-486a2c6.txt`](execucao-e2e-486a2c6.txt) |

Nota sobre o E2E: a porta 3000 da máquina estava ocupada por um servidor de outro projeto, então a suíte rodou com o app na porta 3001 (configuração temporária, fora do repositório). O teste da fila (`staff.spec.ts:27`) abre o chat com `http://localhost:3000` escrito no código, falou com o servidor errado e deu timeout. Não corrigi o teste. As tentativas anteriores também estão no diretório (`-tentativa-1` a `-4`), com a causa de cada uma no log: porta ocupada, banco com dados de uma execução anterior, banco sem `db:demo` e servidor de outro projeto.

**Histórico** (logs capturados no commit `1640e4a`, antes da rodada com a Groq):

| Verificação | Resultado | Log |
|---|---|---|
| Vitest | 78 de 78, em 8 arquivos | [`execucao-vitest.txt`](execucao-vitest.txt) |
| Playwright E2E | 14 de 14 | [`execucao-e2e.txt`](execucao-e2e.txt) |
| Tipos e lint | sem erros | [`execucao-lint-tipos.txt`](execucao-lint-tipos.txt) |

> **Não medi cobertura de código.** Não há relatório de cobertura neste repositório, e não vou afirmar um percentual.

## O que cada camada cobre
| Camada | Arquivos | O que prova |
|---|---|---|
| **Unitários** | `tests/unit/` | Limiar e fontes (`confidence`), mascaramento e guardrails (`guardrails`), escalonamento e prioridade (`escalation`), base e painel e sessão (`kb-and-metrics`), sugestões v1.1 (`suggestions`). Inclui um teste de **falso positivo**: nenhuma das 40 perguntas legítimas do conjunto de avaliação é bloqueada como injeção. |
| **Integração com `MockProvider`** | `tests/integration/pipeline.test.ts` | Resposta com fontes, recusa, escalonamento com resumo, mascaramento, e os **modos de falha**: provedor fora, busca fora, modelo que promete, modelo que inventa preço. |
| **Segurança** | `tests/integration/security.test.ts` | 8 injeções bloqueadas **sem chamar o modelo** (um espião verifica isso), modelo "induzido" a vazar o marcador é contido pelo filtro de saída, 3 pedidos de dados de outro cliente, e o conjunto adversarial inteiro sem vazamento. |
| **Paridade** | `tests/integration/pgvector-parity.test.ts` | A busca em memória (usada na avaliação) e o pgvector (usado no app) devolvem o **mesmo trecho no topo para as 50 perguntas**, com diferença de pontuação < 1e-4. Precisa do banco no ar, e se não houver, o teste é pulado. |
| **E2E** | `tests/e2e/` | Chat (resposta com fontes, recusa + pedido de pessoa, escalonamento, injeção, erro do servidor, mobile) e equipe (login obrigatório, erro genérico de senha, papéis, fila + resposta + avaliação, painel/lacunas/base/avaliação, v1.1). |

## Testes de segurança pedidos
| Cenário | Resultado | Teste |
|---|---|---|
| Prompt injection direta ("ignore as instruções…") | Bloqueada, modelo não é chamado | `security.test.ts`, E2E |
| Pedido de dados de outro cliente | Bloqueado | `security.test.ts`, A04/A05 do harness |
| Modelo malicioso devolve o marcador do prompt | Bloqueado na saída | `security.test.ts` |
| Modelo promete reembolso ou inventa preço | Bloqueado na saída e vira encaminhamento | `pipeline.test.ts` |
| Acesso à área da equipe sem login | Redireciona para `/login` | E2E |
| Atendente tentando abrir o painel e as sugestões | Redireciona para a fila | E2E |
| Senha errada ou e-mail inexistente | Mesma mensagem | E2E |
| Token de sessão adulterado ou expirado | Rejeitado | `kb-and-metrics.test.ts` |

## O que **não** foi testado (limitações)
- **Claude real:** nenhum teste exercita o `AnthropicProvider` (sem chave de API).
- **Limite de tentativas de login:** não existe, logo não há teste.
- **Acessibilidade:** não rodei auditoria automatizada (como axe). Há rótulos, `aria-live`, foco visível e `aria-pressed`, mas isso foi revisão manual.
- **Carga e concorrência:** nenhum teste.
- **Injeção por vários turnos ou em outro idioma:** não testada.
- **Ao rodar o E2E em `next dev`**, a primeira requisição depois da compilação a frio falhou uma vez com um erro de escopo de `cookies()`. Isso **não** acontece no build de produção, contra o qual o E2E é executado (a configuração do Playwright já sobe `build` + `start`). Registro aqui por transparência.

## Reunião simulada de aceitação
Veja [`reuniao-de-aceitacao.md`](reuniao-de-aceitacao.md).
