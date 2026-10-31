import { expect, test } from "@playwright/test";

test("new owner chooses Google details, reviews fields and applies without saving", async ({
  page,
  context,
}, info) => {
  const index = info.project.name.startsWith("mobile") ? 1 : 0;
  const device = index ? "mobile" : "desktop";
  const id = `71717171-7171-4171-8171-71717171717${index}`;
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
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: "google-owner@example.test", id } })).toString("base64url")}`,
    },
  ]);
  // Exercise the consent/review UI with fictional Google transport. Real OAuth requires separate verification.
  await page.route("https://accounts.google.com/gsi/client", (route) =>
    route.fulfill({
      body: `window.google = { accounts: { oauth2: { initTokenClient: function(options) { return { requestAccessToken: function() { options.callback({ access_token: "fictional-google-token", scope: "email profile" }); } }; } } } };`,
      contentType: "text/javascript",
    }),
  );
  await page.route("**/api/admin/google-profile", (route) => {
    if (route.request().method() === "POST") {
      expect(route.request().postDataJSON()).toEqual({
        categories: ["basic"],
        token: "fictional-google-token",
      });
      return route.fulfill({
        json: { notes: [], suggestions: [{ field: "name", value: "Alex Google Demo" }] },
      });
    }
    return route.fulfill({
      json: { clientId: "123-fixture.apps.googleusercontent.com", enabled: true },
    });
  });
  let saves = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/admin/profile") && request.method() === "PUT") saves++;
  });
  await page.goto(`/${device}-google-owner/edit`);
  await page.getByRole("button", { name: "Start from Google profile" }).click();
  const read = page.getByRole("button", { name: "Read selected Google details" });
  await expect(read).toBeDisabled();
  await expect(page.getByLabel("Birthdate (optional)", { exact: true })).not.toBeChecked();
  await page
    .getByLabel("Let MyDevStudio read my selected Google profile details for review.")
    .check();
  await expect(read).toBeEnabled();
  await read.click();
  await expect(page.getByRole("heading", { name: "Review Google profile details" })).toBeVisible();
  const apply = page.getByRole("button", { name: "Apply selected Google details to draft" });
  await expect(apply).toBeDisabled();
  await page.getByLabel("Replace Full name").check();
  await apply.click();
  await page.getByRole("button", { exact: true, name: "Profile" }).click();
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue("Alex Google Demo");
  expect(saves).toBe(0);
  expect((await (await page.request.get("/api/admin/profile")).json()).profile.name).toBe(
    "Google Import Owner",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
});
