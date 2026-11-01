import { expect, test } from "@playwright/test";

test("unknown usernames return 404 instead of another person’s portfolio", async ({ page }) => {
  const response = await page.goto("/missing-portfolio");
  expect(response?.status()).toBe(404);
  await expect(page.locator("#main-content")).toHaveCount(0);
});
