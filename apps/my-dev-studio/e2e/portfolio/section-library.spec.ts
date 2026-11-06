import { expect, test } from "@playwright/test";

import { authorableSectionTypes } from "@shared/config";

for (const type of ["engineer", "designer"]) {
  test(`${type} renders the complete section catalog and functional supporting widgets`, async ({
    page,
  }, info) => {
    await page.route("https://www.openstreetmap.org/export/**", (route) =>
      route.fulfill({ body: "<p>Map fixture</p>", contentType: "text/html" }),
    );
    await page.goto(`/library-${type}`);
    await expect(page.locator("[data-section-type]")).toHaveCount(authorableSectionTypes.length);
    for (const sectionType of authorableSectionTypes)
      await expect(page.locator(`[data-section-type="${sectionType}"] > h2`)).toHaveText(
        `Library ${sectionType}`,
      );
    await page
      .locator('[data-section-type="map"]')
      .getByRole("button", { name: "Load location map" })
      .click();
    await expect(page.locator('[data-section-type="map"] iframe')).toHaveAttribute(
      "src",
      /openstreetmap.org\/export/,
    );
    await page.locator('[data-section-type="faq"] summary').click();
    await expect(page.locator('[data-section-type="faq"] details')).toHaveAttribute("open", "");
    await expect(
      page
        .locator('[data-section-type="contact-form"]')
        .getByRole("button", { name: "Open email app" }),
    ).toBeVisible();
    await expect(
      page.locator('[data-section-type="newsletter"]').getByRole("link", { name: "Subscribe ↗" }),
    ).toHaveAttribute("href", "https://example.test/subscribe");
    await expect(page.locator('[data-section-type="table-of-contents"] a').first()).toHaveAttribute(
      "href",
      /^#/,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    await page
      .locator('[data-section-type="pricing"]')
      .screenshot({ path: info.outputPath("pricing.png") });
    await page
      .locator('[data-section-type="timeline"]')
      .screenshot({ path: info.outputPath("timeline.png") });
  });
}
