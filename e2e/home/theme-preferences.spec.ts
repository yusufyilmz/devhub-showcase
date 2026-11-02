import { expect, test } from "@playwright/test";

import { themePreferenceOptions } from "../../packages/runtime/src/user/themePreferences";

test("appearance settings persist across reloads and mode changes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Appearance controls" }).hover();
  await page.getByRole("button", { exact: true, name: "Theme settings" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator("select, details")).toHaveCount(0);
  for (const [key, values] of Object.entries(themePreferenceOptions)) {
    await expect(dialog.locator(`[data-options="${key}"] button`)).toHaveCount(values.length + 1);
  }
  await page.getByRole("button", { exact: true, name: "Theme: pink" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-brand", "pink");
  await page.getByRole("button", { exact: true, name: "Border: thick" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-border", "thick");
  await page.getByRole("button", { exact: true, name: "Border: Page default" }).click();
  await page.getByRole("button", { exact: true, name: "Spacing: spacious" }).click();
  await page.getByRole("button", { exact: true, name: "Accent: violet" }).click();
  await page.getByRole("button", { exact: true, name: "Corners: pill" }).click();
  await page.getByRole("button", { exact: true, name: "Font: serif" }).click();
  await expect(page.locator("body")).toHaveCSS("font-family", /Georgia/);
  await page.screenshot({ path: "/tmp/appearance-panel.png" });
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
  await page.getByRole("button", { name: "Appearance controls" }).hover();
  await page
    .getByRole("button", { name: `Switch to ${mode === "dark" ? "light" : "dark"} theme` })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-spacing", "spacious");
  await page.getByRole("button", { name: "Appearance controls" }).hover();
  await page.getByRole("button", { exact: true, name: "Theme settings" }).click();
  await expect(
    page.getByRole("button", { exact: true, name: "Spacing: spacious" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Reset appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-accent", "cyan");
});
