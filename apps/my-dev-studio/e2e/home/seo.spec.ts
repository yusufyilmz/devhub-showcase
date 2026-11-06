import { expect, test } from "@playwright/test";

test("public discovery lists published profiles and excludes private workspaces", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  expect(xml).toContain("http://localhost:3100/yusufyilmz");
  expect(xml).toContain("http://localhost:3100/designer-example");
  expect(xml).not.toContain("/admin");
  expect(xml).not.toContain("private-seo-portfolio");
  expect(xml).not.toContain("/p/examples");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Sitemap: http://localhost:3100/sitemap.xml");
  expect(await robots.text()).toContain("Disallow: /*/edit");
});
test("homepage and sign-in keep platform branding without personal structured data", async ({
  page,
}) => {
  for (const path of ["/", "/login"]) {
    await page.goto(path);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/studio-icon.svg");
    const structured = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
    );
    expect(structured["@type"]).toBe("WebSite");
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});

test("homepage publishes a branded social image", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "http://localhost:3100/share.png",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  const image = await request.get("/share.png");
  expect(image.ok()).toBeTruthy();
  expect(image.headers()["content-type"]).toContain("image/png");
  const png = await image.body();
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});
