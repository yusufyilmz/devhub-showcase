import { expect, test } from "@playwright/test";

test("portfolio metadata and branding use its published identity", async ({ page, request }) => {
  await page.goto("/designer-example");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "http://localhost:3100/designer-example",
  );
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
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
  const structured = await page.locator('script[type="application/ld+json"]').textContent();
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

test("private or missing usernames have no public branding endpoints", async ({ request }) => {
  for (const username of ["private-seo-portfolio", "missing-portfolio"]) {
    for (const asset of ["icon.svg", "share.png"]) {
      const response = await request.get(`/${username}/${asset}`);
      expect(response.status()).toBe(404);
    }
  }
});
