# Rodar localmente

Requisitos: Node 20+ e Docker.

```bash
npm install
cp .env.example .env            # ajuste SESSION_SECRET (qualquer string longa)
docker compose up -d            # PostgreSQL com pgvector na porta 5440
npx prisma migrate deploy
npm run db:seed                 # usuários, 31 artigos e vetores
npm run db:demo                 # conversas de demonstração (apaga todas as conversas)
npm run build && npm run start  # http://localhost:3000
```

Contas de demonstração (fictícias, só locais): `admin@agendabela.test` e `atendente@agendabela.test`, senha `prumo-demo-123`. O cliente usa `/chat` sem login, com `LLM_PROVIDER=mock` por padrão.

## Testes
```bash
npm test && npm run test:e2e && npm run lint && npm run typecheck
```
A porta do app no E2E vem de `PORT` (padrão 3000). As telas de lacunas esperam os dados de `npm run db:demo`. No Windows, uma vez: `npx playwright install chromium`.

## Avaliação
```bash
npm run eval -- --profile final --label minha-rodada      # 50 perguntas, sem banco e sem rede
npm run eval -- --profile final --label minha-validacao --dataset holdout
npm run sweep -- --profile final                           # varredura de limiar
npm run screenshots                                        # regenera docs/screenshots
```
Esses comandos gravam relatórios em `docs/04-avaliacao/` e sobrescrevem registros anteriores com o mesmo rótulo. A rodada com o Claude está descrita em [`docs/04-avaliacao/relatorio-claude.md`](docs/04-avaliacao/relatorio-claude.md). Chaves de API vêm só do ambiente, nunca de arquivo versionado.
