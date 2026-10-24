# 08 · Implantação e operação

[← Índice do ciclo de vida](README.md) · [← 07 Testes](07-testes-e-qualidade.md) · Próximo: [09 · Evolução e roadmap](09-evolucao-e-roadmap.md)

**O que existe:** o produto roda em um ambiente local (aplicação Next.js e PostgreSQL com pgvector em contêiner). **O que é plano:** tudo o que está marcado como "Plano" abaixo não foi executado. Nenhuma implantação em nuvem foi feita e não há evidência de uso em produção.

## Arquitetura de implantação
| Elemento | Existente | Plano |
|---|---|---|
| Aplicação Next.js | Build e execução locais | Um serviço de aplicação com variáveis de ambiente por ambiente |
| Banco | PostgreSQL com pgvector via Docker Compose | PostgreSQL gerenciado com a extensão `vector` |
| Provedor de linguagem | Simulado (padrão) e Groq, por variável de ambiente | Provedor escolhido após a rodada com o Claude e a medição de custo e latência |
| Ambientes | Local | Homologação com dados fictícios, depois produção |
| CI/CD | Inexistente | Workflow com tipos, lint, Vitest e E2E em cada PR |

## Configuração
Variáveis de ambiente (nomes, sem valores): conexão do banco, segredo de sessão, escolha do provedor e, apenas nas rodadas com modelo real, a chave do provedor e os preços por milhão de tokens. Nenhuma chave é versionada. Instruções locais em [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Plano de rollout (plano)
| Etapa | Escopo | Critério para avançar |
|---|---|---|
| 1. Sombra | O agente gera resposta e resumo, mas só o atendente vê | Avaliação dos atendentes: respostas marcadas como corretas, sem promessa indevida |
| 2. Assistido | O agente responde apenas às categorias de baixo risco com fonte | Taxa de recusa e de escalonamento estável; nenhuma violação de guardrail registrada |
| 3. Geral | Todas as perguntas da base | Lacunas em queda e atendentes no controle da avaliação |

## Plano de rollback (plano)
1. Desligar o chat do cliente e manter apenas o formulário de contato anterior.
2. Manter o banco em modo leitura para preservar conversas e chamados abertos.
3. Reverter a versão da aplicação pela tag anterior (`v1.0.0` ou `v1.1.0`); a migration da v1.1 é aditiva e dispensa reversão de dados.

## Migração e preparação de dados
A base vem de 31 artigos em Markdown (`kb/`), carregados e vetorizados pelo seed. Um cliente real exigiria revisar cada artigo, regenerar os vetores e remarcar as conversas de demonstração (`isDemo`).

## Treinamento, documentação e onboarding (plano)
- Atendentes: uma sessão sobre a fila, o resumo do chamado e a avaliação "correta/incorreta".
- Líder: leitura do painel e da lista de lacunas.
- Administrador: ciclo de sugestão de artigos (aceitar, descartar, escrever e publicar em `kb/`).
- Material de apoio já existente: [galeria](../screenshots/README.md) e [regras de negócio](../02-definicao/regras-de-negocio.md).

## Monitoramento, logs e suporte
| Recurso | Existente | Plano |
|---|---|---|
| Painel de métricas (volume por categoria, resolução, escalonamento, lacunas, qualidade, tokens) | Sim, sobre os dados do banco | — |
| Auditoria por mensagem (confiança, fontes, guardrail) | Sim | — |
| Logs estruturados, alertas e rastreamento | Não | Registrar erros de provedor e falhas de busca com alerta |
| Custo por conversa | Só aparece se os preços forem configurados | Medir com o provedor real |

## Indicadores de adoção e sucesso (plano)
Percentual de conversas resolvidas sem chamado (hoje "resolvida" significa que não virou chamado, sem confirmação do cliente), taxa de respostas marcadas como corretas, quantidade de lacunas por semana e tempo até a resposta humana. Nenhum deles tem valor real medido.

## Riscos operacionais
Banco fora (sem fila de reenvio), provedor fora (vira encaminhamento), base desatualizada (nada detecta artigo errado), embedder trocado sem regerar vetores e ausência de limite de tentativas de login.
