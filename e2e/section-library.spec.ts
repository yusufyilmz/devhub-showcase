import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

import { authorableSectionTypes } from "../packages/content/src/authorable-sections";

for (const type of ["engineer", "designer"]) {
  test(`${type} renders the complete section catalog and functional supporting widgets`, async ({
    page,
  }, info) => {
    await page.route("https://www.openstreetmap.org/export/**", (route) =>
      route.fulfill({ body: "<p>Map fixture</p>", contentType: "text/html" }),
    );
    await page.goto(`/library-${type}`);
    await expect(page.locator("[data-section-type]")).toHaveCount(authorableSectionTypes.length);
    for (const sectionType of authorableSectionTypes)
      await expect(page.locator(`[data-section-type="${sectionType}"] > h2`)).toHaveText(
        `Library ${sectionType}`,
      );
    await page
      .locator('[data-section-type="map"]')
      .getByRole("button", { name: "Load location map" })
      .click();
    await expect(page.locator('[data-section-type="map"] iframe')).toHaveAttribute(
      "src",
      /openstreetmap.org\/export/,
    );
    await page.locator('[data-section-type="faq"] summary').click();
    await expect(page.locator('[data-section-type="faq"] details')).toHaveAttribute("open", "");
    await expect(
      page
        .locator('[data-section-type="contact-form"]')
        .getByRole("button", { name: "Open email app" }),
    ).toBeVisible();
    await expect(
      page.locator('[data-section-type="newsletter"]').getByRole("link", { name: "Subscribe ↗" }),
    ).toHaveAttribute("href", "https://example.test/subscribe");
    await expect(page.locator('[data-section-type="table-of-contents"] a').first()).toHaveAttribute(
      "href",
      /^#/,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    await page
      .locator('[data-section-type="pricing"]')
      .screenshot({ path: info.outputPath("pricing.png") });
    await page
      .locator('[data-section-type="timeline"]')
      .screenshot({ path: info.outputPath("timeline.png") });
  });
}
test("owner creates a library section, saves a template, exports content, reviews PageForge import and publishes only after save", async ({
  page,
  context,
}, info) => {
  const device = info.project.name.startsWith("mobile") ? "mobile" : "desktop";
  const id = `20202020-2020-4020-8020-20202020202${device === "mobile" ? 1 : 0}`;
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const token = [
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url"),
    Buffer.from(JSON.stringify({ aud: "authenticated", exp, sub: id })).toString("base64url"),
    Buffer.from("fixture-only-signature").toString("base64url"),
  ].join(".");
  const session = {
    access_token: token,
    expires_at: exp,
    expires_in: 3600,
    refresh_token: "fixture-refresh",
    token_type: "bearer",
    user: { email: "library-owner@example.test", id },
  };
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      sameSite: "Lax",
      url: "http://localhost:3100",
      value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`,
    },
  ]);
  await page.goto(`/${device}-library-owner/edit`);
  await page.getByRole("button", { exact: true, name: "Custom sections" }).click();
  await page.getByLabel("Section starter").selectOption("pricing");
  await page.getByRole("button", { name: "Add custom section" }).click();
  await page.getByRole("button", { name: "+ Add section items" }).click();
  await page.getByLabel("Item title", { exact: true }).fill("Independent plan");
  await page.getByLabel("Item details").fill("A focused engagement.");
  await page.getByLabel("Price or value").fill("€250");
  await page.getByRole("button", { exact: true, name: "Templates" }).click();
  await page.getByLabel("Template name").fill("Pricing preset");
  await page.getByRole("button", { exact: true, name: "Save section template" }).click();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { exact: true, name: "Export sections JSON" }).click();
  const download = await downloadEvent;
  const path = await download.path();
  if (!path) throw new Error("Expected download");
  const configuration = JSON.parse(readFileSync(path, "utf8"));
  expect(configuration.includesContent).toBe(false);
  expect(JSON.stringify(configuration)).not.toContain("Independent plan");
  await page.getByLabel("Include authored content, media and bindings").check();
  const contentDownload = page.waitForEvent("download");
  await page.getByRole("button", { exact: true, name: "Export sections JSON" }).click();
  const contentPath = await (await contentDownload).path();
  if (!contentPath) throw new Error("Expected content download");
  expect(readFileSync(contentPath, "utf8")).toContain("Independent plan");
  await page.getByRole("button", { exact: true, name: "Review Pricing preset" }).click();
  await expect(page.getByRole("region", { name: "Import review" })).toContainText(
    "configuration only",
  );
  await page.getByRole("button", { exact: true, name: "Apply to draft" }).click();
  const imported = {
    content: {
      main: [
        {
          blocks: [
            {
              content: {
                images: [{ alt: "Orbit art", src: "/examples/orbit-brand.svg" }],
                title: "Imported art",
              },
              type: "gallery",
            },
            {
              content: {
                tabs: [
                  { content: "Start with a conversation.", title: "Discover" },
                  { content: "Build with care.", title: "Create" },
                ],
                title: "My process",
              },
              type: "tabs",
            },
          ],
          id: "main",
        },
      ],
    },
  };
  await page.getByLabel("PageForge source asset base URL").fill("http://localhost:3100");
  await page.getByLabel("Import sections JSON").setInputFiles({
    buffer: Buffer.from(JSON.stringify(imported)),
    mimeType: "application/json",
    name: "pageforge.json",
  });
  await expect(page.getByRole("region", { name: "Import review" })).toContainText(
    "Conversion notes",
  );
  await expect(page.getByRole("region", { name: "Import review" })).toContainText("Imported art");
  await page.getByRole("button", { exact: true, name: "Apply to draft" }).click();
  await page.getByLabel("Publish my profile and CV at a public link").check();
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved.");
  await page.reload();
  await page.getByRole("button", { exact: true, name: "Templates" }).click();
  await expect(
    page.getByRole("button", { exact: true, name: "Review Pricing preset" }),
  ).toBeVisible();
  await page.screenshot({
    fullPage: true,
    path: info.outputPath("templates-editor.png"),
  });
  await context.clearCookies();
  expect((await page.request.get("/api/admin/section-templates")).status()).toBe(403);
  await page.goto(`/${device}-library-owner`);
  await expect(page.getByRole("heading", { exact: true, name: "Independent plan" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Imported art" })).toBeVisible();
  await page.getByRole("tab", { exact: true, name: "Create" }).click();
  await expect(page.getByText("Build with care.", { exact: true })).toBeVisible();
  await page
    .locator('[data-section-type="gallery-grid"]')
    .screenshot({ path: info.outputPath("imported-gallery.png") });
});
