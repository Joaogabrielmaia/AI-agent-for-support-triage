import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  workers: 1,
  use: { baseURL: "http://localhost:3000", trace: "off" },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000/login",
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
