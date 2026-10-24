import { expect, test } from "@playwright/test";
import { ADMIN, AGENT, appAlert, ask, login } from "./helpers";

test.describe("área da equipe", () => {
  test("rotas da equipe exigem login (RNF-05)", async ({ page }) => {
    await page.goto("/tickets");
    await expect(page).toHaveURL(/\/login/);
    await page.goto("/painel");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login com senha errada mostra erro genérico", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(AGENT.email);
    await page.getByLabel("Senha").fill("errada");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(appAlert(page)).toContainText("E-mail ou senha incorretos");
  });

  test("atendente não acessa o painel (papéis)", async ({ page }) => {
    await login(page, AGENT);
    await page.goto("/painel");
    await expect(page).toHaveURL(/\/tickets/);
    await expect(page.getByRole("link", { name: "Painel" })).toHaveCount(0);
  });

  test("fila: filtros, detalhe com resumo/motivo, resposta ao cliente e avaliação (RF-06..RF-09)", async ({ page, browser }) => {
    // O cliente abre um chamado de verdade pelo chat.
    const customer = await browser.newPage({ baseURL: `http://localhost:${process.env.PORT ?? "3000"}` });
    await customer.goto("/chat");
    await ask(customer, "Como faço para cancelar minha assinatura?");
    await ask(customer, "Quero o reembolso do último mês.");
    await expect(customer.getByTestId("msg-AGENT_AI").last()).toHaveAttribute("data-kind", "ESCALATION");

    await login(page, AGENT);
    await page.getByLabel("Categoria").selectOption("COBRANCA");
    await page.getByLabel("Prioridade").selectOption("ALTA");
    await page.getByRole("button", { name: "Filtrar" }).click();
    await expect(page.getByTestId("ticket-list").locator("li").first()).toBeVisible();

    await page.getByTestId("ticket-list").locator("li").first().getByRole("link").click();
    await expect(page.getByTestId("ticket-reason")).toContainText(/reembolso/i);
    await expect(page.getByTestId("ticket-summary")).not.toBeEmpty();

    // Avalia a resposta do agente (a primeira resposta da conversa foi uma ANSWER).
    const rating = page.getByTestId("rating").first();
    if (await rating.count()) {
      await rating.getByRole("button", { name: "Correta", exact: true }).click();
      await expect(rating.getByRole("button", { name: "Correta", exact: true })).toHaveAttribute("aria-pressed", "true");
    }

    const reply = `Olá, recebi o seu pedido (teste e2e ${Date.now()}).`;
    await page.getByLabel("Responder ao cliente").fill(reply);
    await page.getByRole("button", { name: "Enviar resposta" }).click();
    await expect(page.getByTestId("transcript")).toContainText(reply);
    await customer.close();
  });

  test("conversa resolvida pelo agente pode ser avaliada como incorreta", async ({ page }) => {
    await login(page, AGENT);
    await page.getByRole("link", { name: "Conversas" }).click();
    await page.getByTestId("conversation-list").locator("li", { hasText: "Respondida" }).first().getByRole("link").click();
    const rating = page.getByTestId("rating").first();
    await rating.getByRole("button", { name: "Incorreta", exact: true }).click();
    await expect(rating.getByRole("button", { name: "Incorreta", exact: true })).toHaveAttribute("aria-pressed", "true");
  });

  test("admin vê painel, lacunas, base e avaliação (RF-10, RF-11, RF-12)", async ({ page }) => {
    await login(page, ADMIN);
    await page.getByRole("link", { name: "Painel" }).click();
    await expect(page.getByTestId("stat-resolution")).toBeVisible();
    await expect(page.getByTestId("by-category")).toBeVisible();

    await page.getByRole("link", { name: "Lacunas" }).click();
    await expect(page.getByTestId("gaps-table")).toContainText(/WhatsApp/i);

    await page.getByRole("link", { name: "Base" }).click();
    await expect(page.getByTestId("kb-table").locator("tbody tr")).toHaveCount(31);

    await page.getByRole("link", { name: "Avaliação" }).click();
    await expect(page.getByTestId("runs-table")).toContainText("rodada-1");
    await expect(page.getByTestId("runs-table")).toContainText("rodada-3");
  });
});

test("v1.1: admin cria rascunho de artigo a partir de lacuna repetida e decide sobre ele", async ({ page }) => {
  await login(page, ADMIN);
  await page.getByRole("link", { name: "Lacunas" }).click();
  const row = page.getByTestId("gaps-table").locator("tr", { hasText: "WhatsApp" }).first();
  await expect(row.locator("td").nth(1)).toHaveText("2");
  await row.getByRole("button", { name: "Criar rascunho de artigo" }).click();
  await expect(row.getByText("Rascunho criado")).toBeVisible();

  await page.getByRole("link", { name: "Sugestões" }).click();
  const card = page.getByTestId("suggestions").locator("li").first();
  await expect(card).toContainText("[PREENCHER");
  await expect(card).toContainText("Pendente");
  await card.getByRole("button", { name: /Aceitar/ }).click();
  await expect(page.getByTestId("suggestions").locator("li").first()).toContainText("Aceita");
});

test("v1.1: atendente não vê coluna nem página de sugestões", async ({ page }) => {
  await login(page, AGENT);
  await page.goto("/lacunas");
  await expect(page.getByRole("columnheader", { name: "Sugestão de artigo" })).toHaveCount(0);
  await page.goto("/sugestoes");
  await expect(page).toHaveURL(/\/tickets/);
});
