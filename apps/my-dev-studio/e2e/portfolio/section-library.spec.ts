import { expect, test } from "@playwright/test";

import { authorableSectionTypes } from "@shared/config";
import { storage } from "@shared/config/storage";

test("homepage replaces the example without mounting the previous section", async ({
  page,
}, info) => {
  const mode = info.project.name.startsWith("mobile") ? "dark" : "light";
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), {
    key: storage.theme,
    value: JSON.stringify({
      state: { activeMode: mode, themePreferences: {} },
      version: storage.version,
    }),
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
  const library = page.locator("#section-library");
  const search = library.getByRole("searchbox", { name: "Filter live section examples" });
  const tiles = library.getByRole("group", { name: "Section examples" });
  expect(await library.locator("[data-preview-kind]").count()).toBe(
    authorableSectionTypes.length + 9,
  );
  await search.fill("Gallery Grid");
  const galleryTile = tiles.getByRole("button", { exact: true, name: "Gallery Grid" });
  await galleryTile.focus();
  await galleryTile.press("Enter");
  const gallery = library.getByRole("region", { name: "Gallery Grid section example" });
  await expect(gallery).toBeVisible();
  await gallery.getByRole("button", { name: "View Orbit identity" }).click();
  const lightbox = page.getByRole("dialog", { name: "Orbit identity" });
  await expect(lightbox).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(lightbox).toBeHidden();
  await search.fill("YouTube");
  await tiles.getByRole("button", { exact: true, name: "YouTube" }).click();
  await expect(library.getByRole("button", { name: /load youtube video/i })).toBeDisabled();
  await expect(gallery).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

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
      await expect(
        page
          .locator(`[data-section-type="${sectionType}"]`)
          .getByRole("heading", { exact: true, name: `Library ${sectionType}` }),
      ).toHaveText(`Library ${sectionType}`);
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
      page
        .locator('[data-section-type="newsletter"]')
        .getByRole("link", { exact: true, name: "Subscribe" }),
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
