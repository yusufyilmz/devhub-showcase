import { expect, test } from "@playwright/test";

test("section rail follows page content and jumps to a selected section", async ({
  page,
}, info) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { exact: true, name: "Page sections" });
  await expect(navigation).toBeVisible();
  const links = navigation.getByRole("link");
  expect(await links.count()).toBeGreaterThan(1);
  const target = links.nth(1);
  await target.focus();
  await expect(target.locator("strong")).toBeVisible();
  await target.click();
  await expect(target).toHaveAttribute("aria-current", "location");
  await page.screenshot({ path: info.outputPath("section-navigator.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
