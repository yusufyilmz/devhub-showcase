import { expect, test } from "@playwright/test";

for (const type of ["engineer", "designer", "consultant", "minimal"]) {
  test(`${type} renders saved section views and hides sections on desktop and touch`, async ({
    page,
  }) => {
    await page.goto(`/configured-${type}`);
    await expect(page.getByRole("heading", { exact: true, name: "About me" })).toHaveCount(0);
    const carousel = page.locator(".configured-section .section-view-carousel");
    await expect(carousel).toBeVisible();
    await expect(carousel.locator(":scope > ul > li")).toHaveCount(1);
    const tabs = page.getByRole("tablist", { name: "Professional Experience" });
    await expect(tabs).toBeVisible();
    const second = tabs.getByRole("tab").nth(1);
    await second.click();
    await expect(second).toHaveAttribute("aria-selected", "true");
    const details = page.locator(".configured-section .section-view-accordion details").first();
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  });
}
