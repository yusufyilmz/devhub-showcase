import { expect, test } from "@playwright/test";

test("owner reviews AI suggestions before changing a draft and can undo without saving", async ({
  page,
  context,
}, info) => {
  const device = info.project.name.startsWith("mobile") ? "mobile" : "desktop";
  const id = `83838383-8383-4383-8383-83838383838${device === "mobile" ? 1 : 0}`;
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const token = [
    "fixture",
    Buffer.from(JSON.stringify({ exp, sub: id })).toString("base64url"),
    "signature",
  ].join(".");
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      sameSite: "Lax",
      url: "http://localhost:3100",
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: "ai-owner@example.test", id } })).toString("base64url")}`,
    },
  ]);
  const original = (await (await page.request.get("/api/admin/profile")).json()).profile.title;
  // Isolate UI review behavior. The real route's ownership/quotas/provider are covered by unit tests.
  await page.route("**/api/admin/assistant", async (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({ json: { enabled: true, limit: 10, usage: 0 } });
    return route.fulfill({
      json: {
        proposal: {
          changes: [
            { field: "title", reason: "Your requested role", value: '"Frontend engineer"' },
          ],
          summary: "A clearer role",
        },
        revision: route.request().postDataJSON().revision,
      },
    });
  });
  let saves = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/admin/profile") && request.method() === "PUT") saves++;
  });
  await page.goto(`/${device}-ai-owner/edit`);
  await page.getByRole("button", { exact: true, name: "AI assistant" }).click();
  await page.getByLabel("What would you like to change?").fill("Shorten my title");
  await page.getByRole("button", { exact: true, name: "Generate proposal" }).click();
  await expect(page.getByText("A clearer role", { exact: true })).toBeVisible();
  expect(saves).toBe(0);
  await page.getByText("Compare before and after", { exact: true }).click();
  await expect(page.locator(".ai-profile-json").last()).toContainText("Frontend engineer");
  await page
    .locator(".editor-card")
    .filter({ has: page.getByRole("heading", { exact: true, name: "Private AI assistant" }) })
    .screenshot({ path: info.outputPath("ai-edit-review.png") });
  await page.getByRole("button", { exact: true, name: "Apply selected changes to draft" }).click();
  await expect(page.getByText(/Applied to your draft/)).toBeVisible();
  expect(saves).toBe(0);
  expect((await (await page.request.get("/api/admin/profile")).json()).profile.title).toBe(
    original,
  );
  await page.getByRole("button", { exact: true, name: "Undo AI changes" }).click();
  await page.getByRole("button", { exact: true, name: "Profile" }).click();
  await expect(page.getByLabel("Professional title")).toHaveValue(original);
  await context.clearCookies();
  expect((await page.request.get("/api/admin/assistant")).status()).toBe(403);
});
