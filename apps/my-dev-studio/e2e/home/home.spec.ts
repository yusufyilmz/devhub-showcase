import { expect, test } from "@playwright/test";

import { getThemePalette, portfolioAccentIds, portfolioAccents } from "@shared/config";

test("the homepage shows all six portfolio cards in one reveal-card grid", async ({ page }) => {
  await page.goto("/");
  const features = page.locator("#features");
  const cards = features.locator(".home-feature-grid > .home-feature-card");
  await expect(cards).toHaveCount(6);
  await expect(cards.nth(3).getByRole("heading")).toHaveText("Open your studio");
  await expect(cards.nth(4).getByRole("heading")).toHaveText("Put your story together");
  await expect(cards.nth(5).getByRole("heading")).toHaveText("Share it when you’re ready");
  await expect(features.getByRole("heading", { name: /From a blank page/ })).toHaveCount(0);

  await page.getByRole("contentinfo").getByRole("link", { name: "How it works" }).click();
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(cards.nth(3).getByRole("heading")).toBeInViewport();

  for (const card of await cards.all()) {
    const toggle = card.getByRole("button", { name: /details for/ });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const details = card.locator(".reveal-details");
    await expect(details).toHaveAttribute("aria-hidden", "false");
    await expect(details.locator("p")).toHaveCSS("font-size", "14px");
    await toggle.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  }
});

test("homepage opens the real portfolio instead of an anchor", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("MyDevStudio | A home for your work");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your work.");
  const example = page.getByRole("link", { name: "See a real portfolio" });
  await expect(example).toHaveAttribute("href", "/yusufyilmz");
  await example.click();
  await expect(page).toHaveURL("/yusufyilmz");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Yusuf");
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.getByRole("link", { name: /Edit your/ })).toHaveCount(0);
});

test("preview supports keyboard tabs and accent selection", async ({ page }) => {
  await page.goto("/");
  const portfolio = page.getByRole("tab", { exact: true, name: "Portfolio" });
  const cv = page.getByRole("tab", { exact: true, name: "CV" });
  await portfolio.focus();
  await portfolio.press("ArrowRight");
  await expect(cv).toBeFocused();
  await expect(cv).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("YOUR DOWNLOADABLE CV");
  await cv.press("Home");
  await expect(portfolio).toBeFocused();
  await expect(portfolio).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Preview your CV" }).click();
  await expect(cv).toBeFocused();
  await page.getByRole("button", { name: "Preview in violet" }).click();
  await expect(page.locator("[data-preview-accent]")).toHaveAttribute(
    "data-preview-accent",
    "violet",
  );
  await expect(page.getByRole("button", { name: "Preview in violet" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("theme choice persists across homepage, studio navigation and reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Appearance controls" }).hover();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("link", { exact: true, name: "Sign in" }).first().click();
  await expect(page).toHaveURL("/login");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(9, 15, 26)");
  await expect(page.getByRole("main")).toHaveClass("auth-login");
  await expect(page.getByRole("button", { name: "Open studio →" })).toHaveCSS(
    "background-color",
    "rgb(103, 216, 231)",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Appearance controls" }).hover();
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("FAQs expand and the layout fits the viewport", async ({ page }) => {
  await page.goto("/");
  const question = page.getByRole("button", {
    name: /details for Is my portfolio public as soon as I sign up\?/,
  });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText(/Your portfolio starts private/)).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
test("without local storage the example links to the published portfolio", async ({ page }) => {
  await page.goto("http://localhost:3102/");
  await expect(page.getByRole("link", { name: "See a real portfolio" })).toHaveAttribute(
    "href",
    "https://mydevstudio.vercel.app/yusufyilmz",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your work.");
});

test("plans show configured sandbox pricing and a safe sign-in link", async ({ page }) => {
  await page.route("**/api/billing/pricing", (route) =>
    route.fulfill({
      body: JSON.stringify({
        amount: 1200,
        available: true,
        chatLimit: 80,
        currency: "eur",
        editorLimit: 15,
        interval: "month",
        mode: "test",
      }),
      contentType: "application/json",
    }),
  );
  await page.goto("/");
  const plans = page.locator("#pricing");
  await expect(plans).toContainText("€12.00");
  await expect(plans).toContainText("80 visitor chat attempts");
  await expect(plans.getByRole("link", { name: "Sign in to try Pro" })).toHaveAttribute(
    "href",
    "/login",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
});

test("portfolio preview stays straight and matches the active theme and accent", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Appearance controls" }).hover();
  await page.getByRole("button", { exact: true, name: "Theme settings" }).click();
  await page.getByRole("button", { exact: true, name: "Accent: emerald" }).click();
  await page.keyboard.press("Escape");
  const preview = page.locator(".home-preview-browser");
  const rgb = (value: string) => `rgb(${value.replaceAll(" ", ", ")})`;
  await expect(page.locator(".home-preview-wrap")).toHaveCSS("transform", "none");
  for (const mode of ["dark", "light", "dark"] as const) {
    if (mode !== (await page.locator("html").getAttribute("data-theme"))) {
      await page.getByRole("button", { name: "Appearance controls" }).hover();
      await page.getByRole("button", { name: `Switch to ${mode} theme` }).click();
    }
    const palette = getThemePalette("studio", mode);
    await expect(preview).toHaveCSS("background-color", rgb(palette.surface));
    await expect(preview).toHaveCSS("color", rgb(palette.text));
    await expect(page.locator(".home-preview-chrome")).toHaveCSS(
      "background-color",
      rgb(palette.soft),
    );
    const cvTab = page.getByRole("tab", { exact: true, name: "CV" });
    await expect(cvTab).toHaveCSS("color", rgb(palette.text));
    await expect(cvTab).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    const previewCv = page.getByRole("button", { name: "Preview your CV" });
    for (const accent of portfolioAccentIds) {
      await page.getByRole("button", { name: `Preview in ${accent}` }).click();
      await expect(page.locator(".home-sample-intro h2 span")).toHaveCSS(
        "color",
        rgb(portfolioAccents[accent][mode]),
      );
      await expect(previewCv).toHaveCSS("background-color", rgb(portfolioAccents[accent][mode]));
      await expect(previewCv).toHaveCSS("color", rgb(palette.surface));
    }
    await cvTab.click();
    await expect(cvTab).toHaveCSS("background-color", rgb(palette.soft));
    await expect(cvTab).toHaveCSS("color", rgb(palette.text));
    await cvTab.press("Home");
    await page
      .locator(".home-preview-wrap")
      .screenshot({ path: info.outputPath(`homepage-preview-${mode}.png`) });
  }
});

test("homepage effects preserve the backdrop and controls in reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const backdrop = page.locator('[data-slot="background"][data-effect="aurora"]');
  const heroTitle = page.getByRole("heading", { level: 1 });
  await expect(heroTitle).toHaveCSS("animation-name", "home-enter");
  expect(
    await backdrop.evaluate((element) => getComputedStyle(element, "::before").backgroundImage),
  ).toContain("radial-gradient");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(heroTitle).toHaveCSS("animation-name", "none");
  expect(
    await backdrop.evaluate((element) => getComputedStyle(element, "::before").animationName),
  ).toBe("none");
  const card = page.locator('#features [data-backdrop="accent"]').first();
  await expect(card).toHaveCSS("border-inline-start-width", "3px");
  await expect(card).toHaveCSS("background-image", /linear-gradient/);
  const details = card.getByRole("button", { name: /details for your own portfolio/ });
  await details.focus();
  await expect(details).toHaveAttribute("aria-expanded", "true");
  await details.press("Escape");
  await expect(details).toHaveAttribute("aria-expanded", "false");
});
