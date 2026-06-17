import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:5181",
    headless: true,
    screenshot: "on",
    viewport: { width: 390, height: 844 },
  },
  projects: [{ name: "chromium", use: { ...devices["Pixel 5"] } }],
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5181",
    port: 5181,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
