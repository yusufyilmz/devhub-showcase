import { expect, test } from "@playwright/test";

test("visitors reach login and cannot open an editor", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Create your portfolio/ })
    .first()
    .click();
  await expect(page).toHaveURL("/admin/login");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Welcome to your");
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Google/ })).toBeVisible();
  await page.goto("/yusufyilmz/edit");
  await expect(page).toHaveURL("/admin/login");
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
});
