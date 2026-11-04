import { type BrowserContext, expect, test } from "@playwright/test";

async function signIn(context: BrowserContext, id: string) {
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
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture", token_type: "bearer", user: { email: "support@example.test", id } })).toString("base64url")}`,
    },
  ]);
}
test("staff inspect operational metadata and explicitly disable chat with an audit", async ({
  page,
  context,
}, info) => {
  const n = info.project.name.startsWith("mobile") ? 1 : 0;
  const actor = `99999999-9999-4999-8999-99999999999${n}`;
  const account = `77777777-7777-4777-8777-77777777777${n}`;
  await signIn(context, actor);
  await page.goto("/admin/support");
  await expect(page.getByRole("heading", { exact: true, name: "Account support" })).toBeVisible();
  await page.getByRole("button", { exact: true, name: account }).click();
  const disable = page.getByRole("button", { exact: true, name: "Disable visitor chat" });
  await expect(disable).toBeDisabled();
  await page.getByRole("checkbox").check();
  await disable.click();
  await expect(page.getByText(/Actor .*disable_visitor_chat/)).toContainText(actor);
  await expect(disable).toBeDisabled();
  const summary = await (await page.request.get(`/api/support?account=${account}`)).json();
  expect(summary.billing.chatEnabled).toBe(false);
  expect(summary.audit).toHaveLength(1);
  expect(summary.billing.plan).toBe("pro");
  expect(summary.billing.chatUsed).toBe(2);
  expect(JSON.stringify(summary)).not.toMatch(/document|prompt|email|password/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ fullPage: true, path: info.outputPath("account-support.png") });
});
test("ordinary sessions cannot read or mutate support data", async ({ page, context }, info) => {
  expect((await page.request.get("/api/support")).status()).toBe(403);
  await signIn(
    context,
    info.project.name.startsWith("mobile")
      ? "88888888-8888-4888-8888-888888888881"
      : "88888888-8888-4888-8888-888888888880",
  );
  expect((await page.request.get("/api/support")).status()).toBe(403);
  expect(
    (
      await page.request.post("/api/support", {
        data: {},
        headers: { Origin: "http://localhost:3100" },
      })
    ).status(),
  ).toBe(403);
  await page.goto("/admin/support");
  await expect(page).not.toHaveURL(/\/admin\/support/);
});
