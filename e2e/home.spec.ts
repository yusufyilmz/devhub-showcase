import { expect, test } from "@playwright/test";

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

test("theme choice persists after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
});

test("FAQs expand and the layout fits the viewport", async ({ page }) => {
  await page.goto("/");
  const question = page
    .locator("summary")
    .filter({ hasText: "Is my portfolio public as soon as I sign up?" });
  await question.click();
  await expect(page.getByText(/Your portfolio starts private/)).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});

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

test("unknown usernames return 404 instead of another person’s portfolio", async ({ page }) => {
  const response = await page.goto("/missing-portfolio");
  expect(response?.status()).toBe(404);
  await expect(page.locator("#main-content")).toHaveCount(0);
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
    "/admin/login",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
});
