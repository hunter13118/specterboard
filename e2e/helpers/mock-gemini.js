export const MOCK_SMACK = "Past-You already logged twice. You're still on your first rep. Embarrassing.";

export async function installGeminiMock(page) {
  await page.route("**/generativelanguage.googleapis.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        candidates: [{ content: { parts: [{ text: MOCK_SMACK }] } }],
      }),
    });
  });
}
