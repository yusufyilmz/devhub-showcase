import { expect, test } from "@playwright/test";

import { urls } from "@shared/config/urls";

test("full-screen Studio chat reviews, applies and explicitly saves a proposal", async ({
  page,
  context,
}, info) => {
  const index = info.project.name.startsWith("mobile") ? 1 : 0;
  const id = `87878787-8787-4787-8787-87878787878${index}`;
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
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: "chat-owner@example.test", id } })).toString("base64url")}`,
    },
  ]);
  const assistantApi = urls.next.studio.assistant();
  const profileApi = urls.next.studio.profile();
  await page.route(`**${assistantApi}`, async (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({ json: { enabled: true, limit: 10, usage: 0 } });
    return route.fulfill({
      json: {
        proposal: {
          changes: [{ field: "title", reason: "Requested wording", value: '"Frontend engineer"' }],
          summary: "A clearer role",
        },
        revision: route.request().postDataJSON().revision,
      },
    });
  });
  let saves = 0;
  page.on("request", (request) => {
    if (request.url().endsWith(profileApi) && request.method() === "PUT") saves++;
  });
  await page.goto("/admin/chat");
  await expect(page.getByRole("heading", { name: "What would you like to create?" })).toBeVisible();
  await page.screenshot({ fullPage: true, path: info.outputPath("studio-chat-empty.png") });
  await page.getByRole("textbox", { name: "Your message" }).fill("Shorten my title");
  await page.getByRole("button", { exact: true, name: "Send message" }).click();
  await expect(page.getByRole("heading", { name: "Review proposed changes" })).toBeVisible();
  expect(saves).toBe(0);
  await page.getByRole("button", { exact: true, name: "Apply selected changes to draft" }).click();
  expect(saves).toBe(0);
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.getByText("Changes saved.", { exact: true })).toBeVisible();
  expect(saves).toBe(1);
  const result = await (await page.request.get(profileApi)).json();
  expect(result.profile.title).toBe("Frontend engineer");
  expect(result.isPublic).toBe(false);
});
