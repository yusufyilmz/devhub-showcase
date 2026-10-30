import { expect, test } from "@playwright/test";

const demos = [
  ["avery-morgan", "Avery Morgan", "engineer", "studio", "en"],
  ["maya-chen", "Maya Chen", "designer", "paper", "en"],
  ["alex-rivera", "Alex Rivera", "consultant", "graphite", "en"],
  ["jamie-reed", "Jamie Reed", "minimal", "paper", "en"],
  ["samir-kaya", "Samir Kaya", "engineer", "graphite", "tr"],
  ["luna-ortiz", "Luna Ortiz", "designer", "bloom", "en"],
  ["deniz-arslan", "Deniz Arslan", "consultant", "studio", "en"],
  ["sofia-marin", "Sofía Marín", "minimal", "bloom", "es"],
] as const;

test("carousel filters, navigates in both directions and opens a full demo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#examples");
  const gallery = page.locator("#examples");
  await expect(gallery.locator(".example-card")).toHaveCount(8);
  await gallery.screenshot({
    path: test.info().outputPath("homepage-gallery.png"),
  });
  const track = gallery.locator(".example-track");
  await gallery.getByRole("button", { name: "Next portfolio examples" }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  await gallery.getByRole("button", { name: "Previous portfolio examples" }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeLessThan(3);
  await gallery.getByRole("button", { exact: true, name: "Designer" }).click();
  await expect(gallery.locator(".example-card")).toHaveCount(2);
  await gallery.getByRole("link", { name: /Explore Maya Chen/ }).click();
  await expect(page).toHaveURL("/p/examples/maya-chen");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Maya");
  await page.getByRole("link", { name: "All examples" }).click();
  await expect(page).toHaveURL("/#examples");
});

for (const [slug, name, type, theme, language] of demos) {
  test(`${name} opens a complete fictional ${type} portfolio and CV`, async ({ page, request }) => {
    // This second app server deliberately has no database configuration.
    const response = await page.goto(`http://localhost:3102/p/examples/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(name.split(" ")[0] ?? name);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.locator("html")).toHaveAttribute("data-portfolio-theme", theme);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    expect(schema).toContain('"@type":"WebSite"');
    expect(schema).not.toContain('"@type":"Person"');
    expect(schema).not.toContain("Yusuf");
    await expect(page.getByText("Fictional portfolio · Sample work and CV")).toBeVisible();
    await expect(page.locator('a[href="/admin"]')).toHaveText("Create your portfolio ↗");
    await expect(page.locator(`a[href="/p/examples/${slug}/cv.pdf"]`).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    if (slug === "maya-chen")
      await page.screenshot({
        fullPage: true,
        path: test.info().outputPath("designer-demo.png"),
      });
    const pdf = await request.get(`http://localhost:3102/p/examples/${slug}/cv.pdf`);
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    expect(pdf.headers()["content-language"]).toBe(language);
    expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });
}
test("unknown demos return 404 without a database fallback", async ({ page, request }) => {
  const pageResponse = await page.goto("http://localhost:3102/p/examples/not-a-demo");
  expect(pageResponse?.status()).toBe(404);
  const pdf = await request.get("http://localhost:3102/p/examples/not-a-demo/cv.pdf");
  expect(pdf.status()).toBe(404);
});
