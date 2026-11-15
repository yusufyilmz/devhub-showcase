import { expect, test } from "@playwright/test";

test("homepage examples arrive server-rendered, open inline, and show project images", async ({
  page,
  request,
}, info) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain("Avery Morgan");
  expect(html).toContain("/examples/atlas-interface.svg");
  expect(html).toContain("example-rendered-preview");
  await page.goto("/");
  await page
    .getByRole("heading", { name: "Where would you like to start?" })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("homepage-composer.png") });
  await page
    .getByRole("link", { exact: true, name: "Explore Avery Morgan's engineer example" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { exact: true, name: "Avery Morgan" })).toBeVisible();
  await expect(dialog.locator("iframe")).toHaveCount(0);
  const image = dialog.getByRole("img", { exact: true, name: "Beacon developer portal" });
  await image.scrollIntoViewIfNeeded();
  await expect(image).toBeVisible();
  await expect
    .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await page.screenshot({ path: info.outputPath("example-with-images.png") });
});

test("section browser reveals more rows only after explicit activation", async ({ page }, info) => {
  await page.goto("/");
  const list = page.getByRole("list", { name: "Available section types" });
  const reveal = page.getByRole("button", { exact: true, name: "Show all section types" });
  await reveal.scrollIntoViewIfNeeded();
  const expected = info.project.name.startsWith("mobile") ? 3 : 9;
  await expect(list.locator("li:visible")).toHaveCount(expected);
  await reveal.click();
  await expect(list.locator("li:visible")).toHaveCount(47);
  await page.getByRole("button", { exact: true, name: "Show fewer sections" }).click();
  await expect(list.locator("li:visible")).toHaveCount(expected);
});

const demos = [
  ["lena-park", "Lena Park", "designer", "paper", "en"],
  ["noah-bell", "Noah Bell", "consultant", "graphite", "en"],
  ["ada-woods", "Ada Woods", "minimal", "bloom", "en"],
  ["robin-lane", "Robin Lane", "creator", "paper", "en"],
  ["avery-morgan", "Avery Morgan", "engineer", "studio", "en"],
  ["maya-chen", "Maya Chen", "designer", "paper", "en"],
  ["alex-rivera", "Alex Rivera", "consultant", "graphite", "en"],
  ["jamie-reed", "Jamie Reed", "minimal", "paper", "en"],
  ["samir-kaya", "Samir Kaya", "engineer", "graphite", "tr"],
  ["luna-ortiz", "Luna Ortiz", "designer", "bloom", "en"],
  ["deniz-arslan", "Deniz Arslan", "consultant", "studio", "en"],
  ["sofia-marin", "Sofía Marín", "minimal", "bloom", "es"],
] as const;
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
