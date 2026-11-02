import { expect, test } from "@playwright/test";

test("existing public chat uses a scoped greeting and session-only history", async ({ page }) => {
  await page.goto("/yusufyilmz");
  await page.getByRole("button", { name: "Resume Chat" }).click();
  await expect(page.locator(".chat-panel")).toContainText(
    "published experience, projects and skills",
  );
  await page.locator(".chat-panel").getByRole("textbox").fill("Which projects are public?");
  await page.locator(".chat-panel").getByRole("button", { exact: true, name: "Send" }).click();
  await expect(page.locator(".chat-panel")).toContainText("Which projects are public?");
  await page.reload();
  await page.getByRole("button", { name: "Resume Chat" }).click();
  await expect(page.locator(".chat-panel")).toContainText("Which projects are public?");
  expect(
    await page.evaluate(() =>
      Object.keys(sessionStorage).some((key) => key.startsWith("my-dev-studio-chat-store:")),
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).some((key) => key.startsWith("my-dev-studio-chat-store:")),
    ),
  ).toBe(false);
});
