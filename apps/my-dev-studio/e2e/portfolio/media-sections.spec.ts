import { expect, test } from "@playwright/test";

for (const type of ["engineer", "designer", "consultant", "minimal"]) {
  test(`${type} supports hero media and authored compositions with curated social work`, async ({
    page,
  }, info) => {
    await page.route("https://www.youtube-nocookie.com/**", (route) =>
      route.fulfill({
        body: "<p>Fixture player</p>",
        contentType: "text/html",
      }),
    );
    await page.goto(`/media-${type}`);
    await expect(page.locator(".hero-surface img")).toBeVisible();
    await expect(page.getByRole("heading", { exact: true, name: "Services" })).toBeVisible();
    const faq = page.locator(".composition-faq");
    await faq.locator("summary").click();
    await expect(faq.getByText("Send a message to discuss your project.")).toBeVisible();
    await expect(page.locator(".composition-statistics")).toContainText("12+");
    const films = page.locator(".composition-youtube");
    await expect(films.locator("iframe")).toHaveCount(0);
    await films.getByRole("button", { name: "Load YouTube video: Studio film" }).click();
    await expect(films.locator("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
    );
    await films.getByRole("button", { name: "Unload video" }).click();
    await expect(films.locator("iframe")).toHaveCount(0);
    await expect(page.locator(".composition-instagram img")).toBeVisible();
    await expect(page.locator(".composition-instagram a")).toHaveAttribute(
      "href",
      "https://www.instagram.com/p/ABC_123/",
    );
    await expect(page.locator(".composition-pinterest a")).toHaveAttribute(
      "href",
      "https://www.pinterest.com/pin/123456/",
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    await page.locator(".hero-surface").screenshot({ path: info.outputPath("hero.png") });
    await page
      .locator(".composition-instagram")
      .screenshot({ path: info.outputPath("social-work.png") });
  });
}

test("blocked media retains readable context and the original link", async ({ page }) => {
  await page.route("https://www.youtube-nocookie.com/**", (route) => route.abort());
  await page.goto("/media-designer");
  const films = page.locator(".composition-youtube");
  await expect(films.getByRole("link", { name: /Open original/ })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=M7lc1UVf-VE",
  );
  await films.getByRole("button", { name: "Load YouTube video: Studio film" }).click();
  await expect(films.getByRole("status")).toContainText(/blocked|unavailable/);
  await expect(films.getByRole("link", { name: /Open original/ })).toBeVisible();
  await films.getByRole("button", { name: "Unload video" }).click();
  await expect(films.locator("iframe")).toHaveCount(0);
});
