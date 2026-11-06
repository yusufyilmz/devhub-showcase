import { expect, test } from "@playwright/test";

for (const type of ["designer", "consultant", "minimal"]) {
  test(`${type} portfolio renders its content and downloads a CV`, async ({ page }, testInfo) => {
    const response = await page.goto(`/${type}-example`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("[data-portfolio-type]")).toHaveAttribute(
      "data-portfolio-type",
      type,
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Example");
    await expect(page.locator("#work")).toContainText("Yusuf Fitness OS");
    await expect(page.locator("#work")).not.toContainText("Bank Movements Classifier");
    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath("portfolio.png"),
    });
    await page.getByRole("link", { name: /Explore my work/ }).click();
    await expect(page).toHaveURL(new RegExp(`/${type}-example#work$`));
    const pdf = await page.request.get(`/${type}-example/cv.pdf`);
    expect(pdf.headers()["content-type"]).toContain("application/pdf");
    expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");

    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  });
}
