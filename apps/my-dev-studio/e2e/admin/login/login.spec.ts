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

test("the desktop login illustration can be replayed and respects reduced motion", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/login");
  const visual = page.locator(".login-visual");
  const portfolio = visual.locator(".login-preview-portfolio");
  const cv = visual.locator(".login-preview-cv");
  const replay = visual.getByRole("button", { name: "Replay animation" });

  if ((page.viewportSize()?.width ?? 0) <= 760) {
    await expect(visual).toBeHidden();
  } else {
    await expect(portfolio).toBeVisible();
    await expect(cv).toBeVisible();
    await expect(portfolio).toHaveCSS("animation-name", "login-preview-portfolio");
    await expect(cv).toHaveCSS("animation-name", "login-preview-cv");
    await portfolio.evaluate((card) => Promise.all(card.getAnimations().map((a) => a.finished)));
    await visual.screenshot({
      animations: "disabled",
      path: info.outputPath("login-illustration.png"),
    });

    await replay.click();
    await expect
      .poll(() => portfolio.evaluate((card) => card.getAnimations()[0]?.playState))
      .toBe("running");
    await expect(replay).toBeFocused();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(portfolio).toHaveCSS("animation-name", "none");
    await expect(cv).toHaveCSS("animation-name", "none");
    await expect(cv).toBeVisible();
    await expect(replay).toBeHidden();
  }

  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
});
