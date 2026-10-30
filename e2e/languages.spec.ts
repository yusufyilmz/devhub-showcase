import { expect, test } from "@playwright/test";
import { getPortfolioCopy } from "../packages/content/src/languages";

for (const language of ["es", "tr"] as const) {
  for (const type of ["engineer", "designer", "consultant", "minimal"]) {
    test(`${type} uses ${language} labels while the CV keeps its own language`, async ({
      page,
    }, testInfo) => {
      const text = getPortfolioCopy(language);
      await page.goto(`/${type}-${language}`);
      await expect(page.locator("html")).toHaveAttribute("lang", language);
      await expect(
        page.getByRole("heading", { name: text.experience, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: text.about, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: text.switchLight }),
      ).toBeVisible();
      if (type === "engineer") {
        await expect(page.locator(".reveal-toggle").first()).toHaveAttribute(
          "aria-label",
          new RegExp(text.showDetails),
        );
      }
      const response = await page.request.get(`/${type}-${language}/cv.pdf`);
      expect(response.headers()["content-language"]).toBe(
        language === "es" ? "tr" : language,
      );
      expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
      if (type === "designer") {
        await page.screenshot({
          path: testInfo.outputPath("localized-portfolio.png"),
          fullPage: true,
        });
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
    });
  }
}
