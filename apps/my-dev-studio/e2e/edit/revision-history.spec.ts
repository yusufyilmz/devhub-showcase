import { expect, test } from "@playwright/test";

import { urls } from "@shared/config/urls";

test("owner reviews saved history and independent field choices without autosave", async ({
  page,
  context,
}, info) => {
  const mobile = info.project.name.startsWith("mobile");
  const id = `67676767-6767-4767-8767-67676767676${mobile ? 1 : 0}`;
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
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: "owner@example.test", id } })).toString("base64url")}`,
    },
  ]);

  let writes = 0;
  page.on("request", (request) => {
    if (request.method() === "PUT" && request.url().endsWith(urls.studio.profile())) writes++;
  });
  const current = await (await page.request.get(urls.studio.profile())).json();
  await page.route(`**${urls.studio.profileHistory()}*`, (route) => {
    const revision = new URL(route.request().url()).searchParams.get("revision");
    return route.fulfill({
      json: revision
        ? {
            createdAt: "2026-11-03T00:00:00Z",
            currentRevision: current.revision,
            profile: { ...current.profile, title: "Earlier saved title" },
            revision: 1,
          }
        : {
            currentRevision: current.revision,
            retention: { count: 20, days: 90 },
            revisions: [{ created_at: "2026-11-03T00:00:00Z", revision: 1 }],
          },
    });
  });
  await page.goto(`/${mobile ? "mobile" : "desktop"}-assistant-tools/edit`);
  await page.getByRole("button", { exact: true, name: "Field visibility" }).click();
  await page.getByRole("checkbox", { name: "Include email on website" }).uncheck();
  await expect(page.getByRole("checkbox", { name: "Include email on cv" })).toBeChecked();
  await page.getByRole("checkbox", { name: "Include phone on cv" }).uncheck();
  await page.getByRole("button", { exact: true, name: "PDF" }).click();
  await expect(
    page.getByRole("checkbox", { exact: true, name: "Include phone" }),
  ).not.toBeChecked();
  await page.getByRole("button", { exact: true, name: "Revision history" }).click();
  await page.getByRole("combobox", { name: /Saved revision/ }).selectOption("1");
  await page.getByRole("button", { exact: true, name: "Inspect revision" }).click();
  await expect(
    page.getByRole("button", { name: "Restore reviewed revision to draft" }),
  ).toBeVisible();
  expect(writes).toBe(0);
  await page.getByRole("button", { name: "Restore reviewed revision to draft" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Earlier work restored" })).toBeVisible();
  await page.getByRole("button", { exact: true, name: "Profile" }).click();
  await expect(page.getByRole("textbox", { exact: true, name: "Professional title" })).toHaveValue(
    "Earlier saved title",
  );
  expect(writes).toBe(0);
});
