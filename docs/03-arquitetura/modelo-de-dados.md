# Modelo de dados

PostgreSQL com a extensão `vector` (pgvector). O esquema fica em [`prisma/schema.prisma`](../../prisma/schema.prisma) e as migrações em `prisma/migrations/`.

```mermaid
erDiagram
    User ||--o{ Ticket : "é responsável por"
    User ||--o{ Message : "avalia"
    Article ||--o{ Chunk : "é dividido em"
    Conversation ||--o{ Message : "contém"
    Conversation ||--o| Ticket : "gera (no máximo 1)"

    User {
        string id PK
        string name
        string email UK
        string passwordHash
        enum role "ADMIN | AGENT"
    }
    Article {
        string slug PK
        string title
        string category
        text body
    }
    Chunk {
        string id PK "slug#ordinal"
        string articleSlug FK
        string heading
        text text
        int ordinal
        vector embedding "vector(512)"
    }
    Conversation {
        string id PK
        string customerName
        enum category
        bool isDemo
    }
    Message {
        string id PK
        enum role "CUSTOMER | AGENT_AI | HUMAN"
        text content "texto do cliente já mascarado"
        enum kind "ANSWER | REFUSAL | ESCALATION | BLOCKED"
        json sources
        float confidence
        string guardrail
        string_array piiFound
        int inputTokens
        int outputTokens
        enum rating "CORRECT | INCORRECT"
    }
    Ticket {
        string id PK
        string conversationId FK,UK
        enum category
        enum priority "BAIXA | MEDIA | ALTA | URGENTE"
        string reason
        text summary
        enum status "OPEN | IN_PROGRESS | DONE"
    }
    ArticleSuggestion {
        string id PK
        string title
        string_array questions
        int occurrences
        text draft
        enum status "PENDING | ACCEPTED | DISCARDED"
    }
```

## Decisões de modelagem
| Decisão | Motivo | Trade-off |
|---|---|---|
| **A mensagem do cliente é guardada já mascarada** (RN-06) | O dado original nunca toca o banco. | Não dá para recuperar o CPF digitado, nem para depurar com ele. É de propósito. |
| **`kind`, `confidence`, `sources` e `guardrail` por mensagem** (RNF-09) | Auditar *por que* o agente fez o que fez, na tela do chamado. | Mais colunas; `sources` é JSON sem esquema rígido. |
| **Um chamado por conversa** (`conversationId` único, RN-11) | Evita fila duplicada para o mesmo cliente. | Uma segunda questão sensível na mesma conversa reaproveita o chamado. |
| **Lacunas não têm tabela:** são derivadas das mensagens `REFUSAL` | Uma fonte de verdade só, e o agrupamento pode mudar sem migração. | O agrupamento roda em memória a cada abertura da tela. Com muito volume precisaria virar tabela ou visão materializada. |
| **`Chunk.embedding` com `vector(512)`** | Dimensão do embedder atual. | Trocar de embedder exige regerar os vetores e possivelmente mudar a dimensão. |
| **Sem tabela de cliente final** | Fora do escopo (sem multiempresa). A conversa guarda só um nome informado. | Não dá para ver o histórico de um mesmo cliente entre conversas. |
