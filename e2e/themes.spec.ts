import { expect, test } from "@playwright/test";
import {
  getThemePalette,
  portfolioThemes,
} from "../packages/content/src/themes";

const rgb = (value: string) => `rgb(${value.replaceAll(" ", ", ")})`;
for (const { id: theme } of portfolioThemes) {
  for (const layout of ["engineer", "designer", "consultant", "minimal"]) {
    test(`${theme} works with ${layout} in both color modes`, async ({
      page,
    }, testInfo) => {
      await page.goto(`/${theme}-${layout}`);
      await expect(page.locator("html")).toHaveAttribute(
        "data-portfolio-theme",
        theme,
      );
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        rgb(getThemePalette(theme, "dark").bg),
      );
      await page.getByRole("button", { name: "Switch to light theme" }).click();
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        rgb(getThemePalette(theme, "light").bg),
      );
      await expect(page.locator("html")).toHaveAttribute(
        "data-portfolio-theme",
        theme,
      );
      if (theme === "paper")
        await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
          "font-family",
          /Georgia/,
        );
      if (theme === "graphite")
        await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
          "font-family",
          /monospace/,
        );
      if (layout === "designer")
        await page.screenshot({
          path: testInfo.outputPath(`${theme}-light.png`),
          fullPage: true,
        });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(page.locator("html")).toHaveAttribute(
        "data-portfolio-theme",
        theme,
      );
    });
  }
}
test("device mode changes keep the selected theme and respect a visitor override", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/paper-system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute(
    "data-portfolio-theme",
    "paper",
  );
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute(
    "data-portfolio-theme",
    "paper",
  );
});
