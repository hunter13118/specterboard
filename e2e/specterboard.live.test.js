import { test, expect } from "@playwright/test";
import { installGeminiMock, MOCK_SMACK } from "./helpers/mock-gemini.js";

async function onboard(page) {
  await page.getByRole("textbox", { name: "Metric" }).fill("LeetCode problems");
  await page.getByRole("textbox", { name: "Unit label" }).fill("problems");
  await page.getByRole("button", { name: "Start haunting" }).click();
}

test.describe("SpecterBoard", () => {
  test.beforeEach(async ({ page }) => {
    await installGeminiMock(page);
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("onboarding", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "SpecterBoard" })).toBeVisible();
    await onboard(page);
    await expect(page.getByText("LeetCode problems")).toBeVisible();
  });

  test("+1 leaderboard", async ({ page }) => {
    await onboard(page);
    await page.getByRole("button", { name: "Log plus one" }).click();
    const board = page.locator(".lb-list");
    await expect(board.getByText("Past-You")).toBeVisible();
    await expect(board.getByText("Elite 1%")).toBeVisible();
  });

  test("smack talk", async ({ page }) => {
    await onboard(page);
    await page.getByRole("button", { name: "Log plus one" }).click();
    await expect(page.locator("blockquote")).toContainText(/Past-You|logged/i, { timeout: 15_000 });
  });

  test("share download", async ({ page }) => {
    await onboard(page);
    await page.getByRole("button", { name: "Log plus one" }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Share card" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/specterboard-.*\.png/);
  });
});
