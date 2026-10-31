import { expect, test } from "@playwright/test";

async function signIn(context: import("@playwright/test").BrowserContext, id: string) {
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
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: "billing-owner@example.test", id } })).toString("base64url")}`,
    },
  ]);
}
const summary = {
  access: "active",
  aiConfigured: true,
  assignedProfileId: "alpha",
  chatEnabled: false,
  limits: { portfolio_chat: 20, studio_assistant: 5 },
  periodEnd: "2026-11-07T12:00:00Z",
  periodStart: "2026-10-31T12:00:00Z",
  plan: "pro",
  usage: { portfolio_chat: 3, studio_assistant: 5 },
};
test("owner sees separate AI readiness and refreshes without changing publication", async ({
  page,
  context,
}, info) => {
  await signIn(
    context,
    info.project.name.startsWith("mobile")
      ? "94949494-9494-4494-8494-949494949491"
      : "94949494-9494-4494-8494-949494949490",
  );
  await page.route("**/api/admin/profile", (route) =>
    route.fulfill({ json: { id: "alpha", isPublic: false } }),
  );
  let saved = false;
  await page.route("**/api/admin/billing", async (route) => {
    if (route.request().method() === "PUT") {
      expect(route.request().postDataJSON()).toEqual({ chatEnabled: true, profileId: "alpha" });
      saved = true;
      return route.fulfill({ json: { saved: true } });
    }
    return route.fulfill({ json: { ...summary, chatEnabled: saved } });
  });
  await page.route("**/api/billing/pricing", (route) =>
    route.fulfill({ json: { available: false }, status: 503 }),
  );
  await page.goto("/admin/billing");
  await expect(page.getByRole("heading", { name: "Pro is active" })).toBeVisible();
  await expect(page.getByText(/5 \/ 5 attempts used. 0 remaining/)).toBeVisible();
  await expect(page.getByText(/Your portfolio is private/)).toBeVisible();
  await page.getByRole("button", { name: "Enable portfolio AI chat" }).click();
  await expect(page.getByRole("button", { name: "Disable portfolio AI chat" })).toBeVisible();
  await expect(page.getByText(/Publication: Private/)).toBeVisible();
  await page.getByRole("button", { name: "Refresh status" }).click();
  await expect(page.getByRole("button", { name: "Disable portfolio AI chat" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
});
test("checkout return alone never displays active Pro and portal errors explain the next action", async ({
  page,
  context,
}, info) => {
  await signIn(
    context,
    info.project.name.startsWith("mobile")
      ? "95959595-9595-4595-8595-959595959591"
      : "95959595-9595-4595-8595-959595959590",
  );
  await page.route("**/api/admin/profile", (route) =>
    route.fulfill({ json: { id: "alpha", isPublic: false } }),
  );
  await page.route("**/api/admin/billing", (route) =>
    route.fulfill({
      json: {
        ...summary,
        access: "free",
        assignedProfileId: null,
        limits: { portfolio_chat: 0, studio_assistant: 0 },
        plan: "free",
      },
    }),
  );
  await page.route("**/api/billing/portal", (route) =>
    route.fulfill({
      json: { code: "no_subscription", error: "hidden provider detail" },
      status: 503,
    }),
  );
  await page.goto("/admin/billing?checkout=returned");
  await expect(page.getByText(/returning here does not activate Pro/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "You are on Free" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pro is active" })).toHaveCount(0);
  await page.getByRole("button", { name: "Manage subscription" }).click();
  await expect(page.getByRole("alert", { name: "Billing error" })).toContainText(
    "A demo grant does not create a Stripe subscription",
  );
  await expect(page.getByText("hidden provider detail")).toHaveCount(0);
});
