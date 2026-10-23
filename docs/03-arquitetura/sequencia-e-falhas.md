# Fluxo da resposta e modos de falha

## Visão geral dos componentes
```mermaid
flowchart LR
    subgraph Cliente
      C[Chat /chat]
    end
    subgraph Next.js
      API[/api/chat/]
      P[pipeline.ts<br/>handleMessage]
      G[guardrails.ts]
      E[escalation.ts]
      S[setup.ts<br/>embedder + perfil]
    end
    DB[(PostgreSQL<br/>+ pgvector)]
    LLM{{LlmProvider}}
    M[MockProvider]
    A[AnthropicProvider]
    subgraph Equipe
      Q[Fila, conversas,<br/>painel, lacunas]
    end
    C --> API --> P
    P --> G
    P --> E
    P --> S
    P --> DB
    P --> LLM
    LLM -.-> M
    LLM -.-> A
    API --> DB
    Q --> DB
```

## Sequência: pergunta respondível
```mermaid
sequenceDiagram
    actor U as Cliente
    participant API as /api/chat
    participant P as pipeline
    participant PG as pgvector
    participant L as LlmProvider
    participant DB as Banco

    U->>API: "Esqueci minha senha, o que eu faço?"
    API->>P: handleMessage(pergunta, histórico)
    P->>P: maskPii (RN-06)
    P->>P: detectInjection / detectThirdPartyData (RN-07)
    P->>P: matchEscalation (RN-04) → nenhuma
    P->>PG: busca top-4 por cosseno
    PG-->>P: trechos + similaridade
    P->>P: scoreConfidence (RN-02) ≥ limiar
    P->>P: pickSources (RN-03)
    P->>L: answer(pergunta, fontes)
    L-->>P: texto com [1] [2]
    P->>P: checkOutput (RN-08/09) ok
    P-->>API: ANSWER + fontes + confiança + tokens
    API->>DB: guarda mensagem do cliente (mascarada) e a do agente
    API-->>U: resposta com fontes
```

## Sequência: pedido sensível
```mermaid
sequenceDiagram
    actor U as Cliente
    participant P as pipeline
    participant L as LlmProvider
    participant DB as Banco
    actor A as Atendente

    U->>P: "Cobraram duas vezes, quero reembolso"
    P->>P: maskPii, injeção? não
    P->>P: matchEscalation → reembolso (COBRANCA, ALTA)
    P->>L: summarize(histórico, motivo, fontes)
    L-->>P: resumo
    P-->>U: texto fixo, sem prometer valor nem prazo
    P->>DB: mensagem + Ticket (resumo, categoria, prioridade, motivo)
    A->>DB: abre a fila, vê o chamado
    A->>DB: responde na mesma conversa
    U->>DB: o chat consulta a conversa e mostra a resposta
```

## Modos de falha
| Falha | O que acontece | Regra | Teste |
|---|---|---|---|
| **API do modelo fora** ou erro de rede (`ProviderError`) | O cliente **não fica sem resposta**: vira encaminhamento (prioridade Média) com resumo por template. | RN-10 | `pipeline.test.ts` "provedor falha" |
| **Resumo falha** durante o escalonamento | O chamado é criado com resumo simples (pergunta + motivo). O escalonamento nunca falha por causa do modelo. | RN-10 | idem |
| **Busca vetorial fora** | Tratada como confiança zero: o agente recusa e oferece uma pessoa. | RN-10 | `pipeline.test.ts` "falha da busca" |
| **Busca sem resultado** | Confiança zero → recusa honesta, e a pergunta entra nas lacunas. | RN-02 | `pipeline.test.ts` "admite que não sabe" |
| **Modelo responde com preço ou promessa fora da fonte** | A resposta é descartada e vira encaminhamento com o motivo. | RN-08/09 | `pipeline.test.ts` (2 testes) |
| **Modelo vaza o marcador do prompt** | Bloqueado pelo filtro de saída. | RN-07 | `security.test.ts` |
| **Banco fora** | A API responde 500 com mensagem genérica e o chat mostra um alerta, continuando utilizável. **Não há fila de reenvio.** | — | E2E "erro do servidor" (simula o 500) |
| **Embedder trocado sem regerar vetores** | Busca com lixo. Não há checagem de versão. | — | **Sem teste.** Risco conhecido, no roadmap. |
