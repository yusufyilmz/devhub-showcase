import { expect, test } from "@playwright/test";

import { extractedCv } from "../tests/cv-import-fixture";

test("owner reviews a CV, cancels safely, applies edits and explicitly saves before publishing", async ({
  page,
  context,
}, info) => {
  const index = info.project.name.startsWith("mobile") ? 1 : 0;
  const device = index ? "mobile" : "desktop";
  const userId = `69696969-6969-4969-8969-69696969696${index}`;
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const token = [
    "fixture",
    Buffer.from(JSON.stringify({ exp, sub: userId })).toString("base64url"),
    "signature",
  ].join(".");
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      sameSite: "Lax",
      url: "http://localhost:3100",
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: "cv-owner@example.test", id: userId } })).toString("base64url")}`,
    },
  ]);
  let requests = 0;
  await page.route("**/api/admin/cv-import", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { enabled: true } });
    requests++;
    if (requests === 1)
      return route.fulfill({
        json: { error: "CV processing is temporarily unavailable." },
        status: 503,
      });
    return route.fulfill({ json: extractedCv });
  });
  await page.goto(`/${device}-cv-importer/edit`);
  await page.getByRole("button", { name: "Start from a CV" }).click();
  await page.getByLabel("Your CV file").setInputFiles({
    buffer: Buffer.from("%PDF-1.7\nFictional CV"),
    mimeType: "application/pdf",
    name: "sample.pdf",
  });
  await expect(page.getByRole("button", { name: "Process CV" })).toBeDisabled();
  await page.getByLabel("Send this CV to OpenAI").check();
  await page.getByRole("button", { name: "Process CV" }).click();
  await expect(page.locator(".cv-import-panel [role=alert]")).toContainText(
    "temporarily unavailable",
  );
  await page.getByRole("button", { name: "Process CV" }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("Alex Rivera");
  await page.getByRole("button", { name: "Cancel import" }).click();
  await page.getByRole("button", { exact: true, name: "Profile" }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("CV Import Owner");
  await page.getByRole("button", { exact: true, name: "Import CV" }).click();
  await page.getByLabel("Your CV file").setInputFiles({
    buffer: Buffer.from("%PDF-1.7\nFictional CV"),
    mimeType: "application/pdf",
    name: "sample.pdf",
  });
  await page.getByLabel("Send this CV to OpenAI").check();
  await page.getByRole("button", { name: "Process CV" }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("Alex Rivera");
  await page.getByLabel("Full name").fill("Alex Reviewed");
  await page.getByLabel("Replace Projects", { exact: true }).uncheck();
  await page.locator(".cv-import-panel").screenshot({ path: info.outputPath("cv-review.png") });
  await page.getByRole("button", { name: "Apply reviewed details to draft" }).click();
  await expect(page.getByText("Applied to your draft.", { exact: false })).toBeVisible();
  expect((await page.request.get(`/${device}-cv-importer`)).status()).toBe(404);
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(
    page.getByText("Saved. Your CV now uses these details.", { exact: true }),
  ).toContainText("Saved.");
  await page.reload();
  await expect(page.getByLabel("Full name")).toHaveValue("Alex Reviewed");
  await expect(page.getByLabel("Publish my profile and CV at a public link")).not.toBeChecked();
  await page.getByLabel("Publish my profile and CV at a public link").check();
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(
    page.getByText("Saved. Your CV now uses these details.", { exact: true }),
  ).toContainText("Saved.");
  await context.clearCookies();
  expect(
    (
      await page.request.post("/api/admin/cv-import", {
        headers: { origin: "http://localhost:3100" },
      })
    ).status(),
  ).toBe(403);
  await page.goto(`/${device}-cv-importer`);
  await expect(page.getByRole("heading", { name: /Alex Reviewed/ }).first()).toBeVisible();
  await expect(page.getByText("Example Studio", { exact: true }).first()).toBeVisible();
  expect((await page.request.get(`/${device}-cv-importer/cv.pdf`)).status()).toBe(200);
});

test("homepage showcases working section previews, templates and CV import", async ({
  page,
}, info) => {
  await page.goto("/");
  const examples = page.getByRole("group", { name: "Section examples" });
  await examples.getByRole("button", { exact: true, name: "Timeline" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Show the journey" })).toBeVisible();
  await examples.getByRole("button", { exact: true, name: "FAQ" }).click();
  await page.getByText("How do we start working together?", { exact: true }).click();
  await expect(
    page.getByText("Start with a conversation about your goals and ideas.", { exact: true }),
  ).toBeVisible();
  await page.getByText(/Browse all \d+ section types/).click();
  await expect(page.locator(".home-library-catalog")).toContainText("YouTube");
  await expect(
    page.getByRole("heading", { name: "A starting point you can reuse." }),
  ).toBeVisible();
  await page.locator("#section-library").screenshot({ path: info.outputPath("home-library.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await page.getByRole("link", { name: "Start with your CV" }).click();
  await expect(page).toHaveURL("/admin/login");
});
