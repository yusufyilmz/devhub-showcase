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
  expect(await robots.text()).toContain(
    "Sitemap: http://localhost:3100/sitemap.xml",
  );
  expect(await robots.text()).toContain("Disallow: /*/edit");
});

test("portfolio metadata and branding use its published identity", async ({
  page,
  request,
}) => {
  await page.goto("/designer-example");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "http://localhost:3100/designer-example",
  );
  await expect(
    page.locator('meta[property="og:image"]').first(),
  ).toHaveAttribute(
    "content",
    "http://localhost:3100/designer-example/share.png",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    "http://localhost:3100/designer-example/icon.svg",
  );
  await expect(page.locator(".folio-monogram")).toHaveText("DE");
  const structured = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(JSON.parse(structured ?? "{}")).toMatchObject({
    "@type": "Person",
    name: "Designer Example",
    url: "http://localhost:3100/designer-example",
  });
  const icon = await request.get("/designer-example/icon.svg");
  expect(icon.ok()).toBeTruthy();
  expect(await icon.text()).toContain("Designer Example");
  expect(await icon.text()).toContain(">DE</text>");
  const image = await request.get("/designer-example/share.png");
  expect(image.ok()).toBeTruthy();
  expect(image.headers()["content-type"]).toContain("image/png");
  const png = await image.body();
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});

test("private or missing usernames have no public branding endpoints", async ({
  request,
}) => {
  for (const username of ["private-seo-portfolio", "missing-portfolio"]) {
    for (const asset of ["icon.svg", "share.png"]) {
      const response = await request.get(`/${username}/${asset}`);
      expect(response.status()).toBe(404);
    }
  }
});

test("homepage and sign-in keep platform branding without personal structured data", async ({
  page,
}) => {
  for (const path of ["/", "/admin/login"]) {
    await page.goto(path);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      "href",
      "/studio-icon.svg",
    );
    const structured = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) ?? "{}",
    );
    expect(structured["@type"]).toBe("WebSite");
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
});
