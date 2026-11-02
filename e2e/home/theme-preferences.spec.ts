import { expect, test } from "@playwright/test";

test("appearance settings persist across reloads and mode changes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { exact: true, name: "Theme settings" }).click();
  await page.getByLabel("spacing", { exact: true }).selectOption("spacious");
  await page.getByLabel("accent", { exact: true }).selectOption("violet");
  await page.getByLabel("radius", { exact: true }).selectOption("pill");
  await expect(page.locator("html")).toHaveAttribute("data-spacing", "spacious");
  await expect(page.locator("html")).toHaveAttribute("data-accent", "violet");
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim(),
      ),
    )
    .toMatch(/184 165 255|111 69 177/);
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-spacing", "spacious");
  await expect(page.locator("html")).toHaveAttribute("data-radius", "pill");
  const mode = await page.locator("html").getAttribute("data-theme");
  await page
    .getByRole("button", { name: `Switch to ${mode === "dark" ? "light" : "dark"} theme` })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-spacing", "spacious");
  await page.getByRole("button", { exact: true, name: "Theme settings" }).click();
  await expect(page.getByLabel("spacing", { exact: true })).toHaveValue("spacious");
  await page.getByRole("button", { name: "Reset appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-accent", "cyan");
});
