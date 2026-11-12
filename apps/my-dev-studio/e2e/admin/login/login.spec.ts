import { expect, test } from "@playwright/test";

test("visitors reach login and cannot open an editor", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Create your portfolio/ })
    .first()
    .click();
  await expect(page).toHaveURL("/login");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Welcome to your");
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Google/ })).toBeVisible();
  await page.goto("/yusufyilmz/edit");
  await expect(page).toHaveURL("/login");
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
});

test("the login panel animates on desktop and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/login");
  const visual = page.locator(".login-visual");
  const icon = visual.locator(".login-visual-icon");

  if ((page.viewportSize()?.width ?? 0) <= 760) {
    await expect(visual).toBeHidden();
    await expect(icon).toHaveCSS("animation-name", "none");
  } else {
    await expect(visual).toBeVisible();
    await expect(icon).toHaveCSS("animation-name", "login-visual-icon");
    await expect
      .poll(() => visual.evaluate((panel) => getComputedStyle(panel, "::before").animationName))
      .toBe("login-visual-glow");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(icon).toHaveCSS("animation-name", "none");
    await expect
      .poll(() => visual.evaluate((panel) => getComputedStyle(panel, "::before").animationName))
      .toBe("none");
  }

  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
});
