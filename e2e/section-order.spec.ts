import { expect, test } from "@playwright/test";

for (const type of ["engineer", "designer", "consultant", "minimal"]) {
  test(`${type} renders the saved section order and keeps the intro first`, async ({ page }) => {
    await page.goto(`/reordered-${type}`);
    const headings = await page
      .locator("#main-content .portfolio-section h2, .folio-story .folio-section h2")
      .allTextContents();
    expect(headings.slice(0, 3)).toEqual([
      "Languages",
      "Education & Credentials",
      type === "engineer" ? "Skills" : type === "designer" ? "Creative toolkit" : "Expertise",
    ]);
    expect(headings[3]).toBe(
      type === "engineer"
        ? "Projects & Contributions"
        : type === "designer"
          ? "Selected work"
          : "Projects & client work",
    );
    expect(headings.slice(4, 6)).toEqual(["Professional Experience", "About me"]);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Yusuf");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  });
}
