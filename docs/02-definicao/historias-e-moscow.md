# Histórias de usuário, critérios de aceite e MoSCoW

Formato: **Como** [papel], **quero** [ação], **para** [benefício]. Critérios em Dado/Quando/Então.

## HU-01 · Perguntar e receber resposta com fonte (Must) — RF-01, RF-02, RF-03
Como **dona de salão**, quero perguntar no chat e ver de onde veio a resposta, para saber se posso confiar.
- **Dado** uma pergunta coberta pela base, **quando** envio, **então** recebo uma resposta curta com fontes numeradas.
- **Dado** a resposta, **quando** abro uma fonte, **então** vejo o trecho original.
- **Dado** uma resposta, **então** ela só cita artigos da base.

## HU-02 · Receber uma recusa honesta (Must) — RF-04
Como **dona de salão**, quero que o robô diga quando não sabe, para não perder tempo com palpite.
- **Dado** uma pergunta fora da base, **quando** envio, **então** recebo "Não tenho essa informação" **sem fontes**.
- **Dado** a recusa, **então** vejo o botão "Falar com uma pessoa da equipe".

## HU-03 · Ser encaminhada a uma pessoa com contexto (Must) — RF-05, RF-08
Como **dona de salão**, quero chegar a uma pessoa sem repetir a história.
- **Dado** um assunto sensível (RN-04), **quando** envio, **então** o agente escala, **sem prometer** reembolso, valor ou prazo.
- **Dado** o encaminhamento, **então** o chamado tem resumo, categoria, prioridade e motivo.
- **Dado** que o atendente respondeu, **então** vejo a resposta na mesma conversa.

## HU-04 · Atender pela fila (Must) — RF-06, RF-07
Como **atendente**, quero ver os chamados por prioridade e abrir o contexto, para começar pelo mais urgente sem perguntar tudo de novo.
- **Dado** a fila, **quando** filtro por status, categoria e prioridade, **então** a lista respeita os filtros.
- **Dado** um chamado, **então** vejo resumo, motivo, conversa completa, fontes e confiança.

## HU-05 · Avaliar a resposta do agente (Must) — RF-09
Como **atendente**, quero marcar se o agente acertou, para a qualidade ficar visível e sob o meu controle.
- **Dado** uma resposta do agente, **quando** marco correta ou incorreta, **então** a marcação fica salva e o painel considera.
- **Dado** uma conversa resolvida sem chamado, **então** posso avaliá-la também.

## HU-06 · Ver o desempenho do agente (Should) — RF-10
Como **líder de suporte**, quero um painel com volume, resolução e escalonamento.
- **Então** vejo volume por categoria, % resolvidas pelo agente, % escalonadas e custo estimado por conversa (ou aviso de que os preços não foram configurados).
- **Então** o painel diz que, no ambiente de demonstração, os dados não são medições reais.

## HU-07 · Ver as lacunas da base (Must) — RF-11
Como **líder de suporte**, quero saber o que os clientes perguntam e a base não cobre.
- **Dado** perguntas recusadas parecidas, **então** aparecem agrupadas com a contagem.

## HU-08 · Proteger dados e regras (Must) — RN-06 a RN-09
Como **dona de clínica**, quero que meus dados e as regras da empresa estejam protegidos.
- **Dado** um CPF, e-mail, telefone ou cartão, **então** ele não é guardado nem enviado ao modelo em claro.
- **Dado** uma instrução para ignorar as regras ou um pedido de dados de outro cliente, **então** o agente bloqueia.
- **Dado** uma resposta com preço fora da fonte ou promessa, **então** ela é bloqueada.

## HU-09 · Avaliar o agente com perguntas de teste (Must) — RF-12
Como **desenvolvedor**, quero rodar 50 perguntas e ver um relatório, para decidir ajustes com dados.
- **Então** o script roda sem rede, compara com o esperado e gera o relatório com commit, data, perfil e provedor.

## HU-10 · Entrar com papéis (Must) — RF-15
Como **administradora**, quero que só Admin veja painel, base, avaliação e sugestões.
- **Dado** um Atendente, **quando** abre `/painel`, **então** é redirecionado.

## HU-11 · Transformar lacunas em artigos (Could, v1.1) — RF-13
Como **líder de suporte**, quero um rascunho de artigo para uma lacuna repetida.
- **Dado** uma lacuna com 2 ou mais ocorrências, **então** o Admin cria um rascunho **sem fatos inventados**, e depois aceita ou descarta.

## MoSCoW
| Must | Should | Could | Won't (nesta versão) |
|---|---|---|---|
| HU-01, 02, 03, 04, 05, 07, 08, 09, 10 | HU-06 (painel) | HU-11 (v1.1) | WhatsApp, voz, treinamento de modelo, multiempresa, sugestão de resposta ao atendente, resposta do cliente confirmando "resolveu" |
