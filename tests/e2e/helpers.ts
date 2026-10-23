import { expect, type Page } from "@playwright/test";

export const ADMIN = { email: "admin@agendabela.test", password: "prumo-demo-123" };
export const AGENT = { email: "atendente@agendabela.test", password: "prumo-demo-123" };

export async function login(page: Page, user: { email: string; password: string }) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(user.email);
  await page.getByLabel("Senha").fill(user.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/tickets/);
}

export async function ask(page: Page, text: string) {
  const before = await page.getByTestId("msg-AGENT_AI").count();
  await page.getByLabel("Sua mensagem").fill(text);
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByTestId("msg-AGENT_AI")).toHaveCount(before + 1, { timeout: 20_000 });
}

/** O Next injeta um role="alert" próprio (anunciador de rotas); este seletor pega só os alertas da aplicação. */
export const appAlert = (page: Page) => page.locator('[role="alert"]:not(#__next-route-announcer__)');
