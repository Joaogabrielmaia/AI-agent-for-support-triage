# 06 · Desenvolvimento e gestão de configuração

[← Índice do ciclo de vida](README.md) · [← 05 Dados](05-modelo-de-dados.md) · Próximo: [07 · Testes e qualidade](07-testes-e-qualidade.md)

Tudo abaixo foi confirmado no repositório e no GitHub em 2026-10-24.

## Fluxo de trabalho
| Prática | Estado |
|---|---|
| Branch principal | `main` |
| Branches de trabalho | `feat/sugestoes-de-artigos` (v1.1), `docs/apresentacao` e `docs/readme-venda` (documentação) |
| Pull requests | PR da v1.1 (merge `1640e4a`); PR [#1](https://github.com/Joaogabrielmaia/AI-agent-for-support-triage/pull/1) e [#2](https://github.com/Joaogabrielmaia/AI-agent-for-support-triage/pull/2) (documentação) |
| Convenção de commits | Conventional Commits com IDs de requisito, por exemplo `feat(sugestoes): ... (RF-13, RN-12)` |
| Versionamento | SemVer: tags `v1.0.0` (`f0240fe`) e `v1.1.0` (`1640e4a`), com releases no GitHub e [CHANGELOG](../../CHANGELOG.md) |
| Revisão de código | Não há revisão de segunda pessoa registrada; os merges foram feitos pelo autor |
| CI/CD | **Não existe workflow**: a API do GitHub mostra 0 execuções em Actions. O único check dos PRs é o GitGuardian |

## Histórico de commits (datas reais do Git)
Todos os commits do produto são de 2026-10-23; os de documentação e correções são de 2026-10-24. O calendário das sprints ([02](02-planejamento-e-scrum.md)) é acadêmico e não corresponde a essas datas.

| Commit | Data | Conteúdo |
|---|---|---|
| `9642275` | 2026-10-23 | Núcleo do agente, base de conhecimento e harness (RF-01 a RF-12) |
| `9bb6e4d` | 2026-10-23 | Rodada 1 e conjunto de validação |
| `402ff74` | 2026-10-23 | Perfil ajustado após a análise de erros |
| `df23b60` | 2026-10-23 | Rodada 2, validação separada e varredura de limiar |
| `137349c` | 2026-10-23 | Chat, fila, painel, lacunas, avaliação e rodada 3 |
| `08596d8` e `2c2cb95` | 2026-10-23 | Testes unitários, de integração, de segurança, de paridade e E2E |
| `850a33b`, `89008b9`, `1640e4a` | 2026-10-23 | v1.1: sugestão de artigos (RF-13, RN-12) |
| `c729230`, `30de504` | 2026-10-23 | Provedor Groq, relatório do modelo aberto e correções (RF-12, RN-02) |
| `fb6b3bc` | 2026-10-24 | `fix(e2e)`: porta lida de `PORT` |

## Organização modular
| Camada | Pasta | Papel |
|---|---|---|
| Agente | `src/lib/agent` | Pipeline, guardrails, escalonamento, busca, provedores |
| Aplicação | `src/app` | Páginas, API de chat e área da equipe |
| Dados | `prisma`, `kb` | Esquema, migrations, seed e artigos |
| Avaliação | `eval` | Perguntas, pontuação, execução, varredura, comparativo |
| Testes | `tests` | Unitários, integração, segurança, E2E |
| Documentação | `docs` | Episódios e ciclo de vida |

## Ambientes, configuração e dependências
- A configuração vem de variáveis de ambiente; `.env.example` lista os nomes e traz apenas credenciais de desenvolvimento local. As instruções de execução estão em [CONTRIBUTING.md](../../CONTRIBUTING.md).
- As dependências principais estão fixadas em versão exata no `package.json` (Next.js 15.1.3, Prisma 6.1.0, TypeScript 5.7.2, Vitest 2.1.8) e o `package-lock.json` está versionado.
- Segredos: nenhum no repositório. A varredura do histórico em 2026-10-24 não encontrou chave de API nem chave privada.
- Existe um ambiente: o local. Não há homologação nem produção.

## Evolução entre versões
| Versão | Mudança | Compatibilidade |
|---|---|---|
| v1.0.0 | MVP completo | — |
| v1.1.0 | Nova tabela `ArticleSuggestion`, novo método `draftArticle` na interface `LlmProvider`, agrupamento de lacunas com radicais | A migration é aditiva; provedores novos precisam implementar `draftArticle` |
| Pós-v1.1 | Provedor Groq, tratamento da recusa do modelo no pipeline, correção do avaliador | Não altera o esquema |

## Dívida técnica
| Item | Origem | Prioridade |
|---|---|---|
| Embedding por hashing, não semântico | [ADR-002](../03-arquitetura/decisoes.md#adr-002--embeddings-locais-e-pgvector) | Alta |
| Embedder trocado sem regerar vetores não é detectado | [sequência e falhas](../03-arquitetura/sequencia-e-falhas.md) | Média |
| Sem limite de tentativas de login | R-10 | Média |
| Sem workflow de CI | Este documento | Média |
| Rodada 2 sem ablação | [análise de erros](../04-avaliacao/analise-de-erros.md) | Baixa |
| Agrupamento de lacunas lexical e em memória | [modelo de dados](../03-arquitetura/modelo-de-dados.md) | Baixa |
