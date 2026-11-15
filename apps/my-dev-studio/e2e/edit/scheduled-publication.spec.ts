import { expect, test } from "@playwright/test";

import { openEditor, selectEditorSection } from "../support/editor";

test.use({ timezoneId: "Europe/Madrid" });
test("reviewed scheduled snapshots survive later edits, execute once, and can be cancelled", async ({
  page,
  context,
  browser,
}, info) => {
  const mobile = info.project.name.startsWith("mobile");
  const n = mobile ? 1 : 0;
  const id = `85858585-8585-4585-8585-85858585858${n}`;
  const device = mobile ? "mobile" : "desktop";
  const username = `${device}-schedule-owner`;
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
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: `schedule${n}@example.test`, id } })).toString("base64url")}`,
    },
  ]);
  const visitor = await browser.newContext();
  try {
    await page.goto(`/${username}/edit`);
    await openEditor(page);
    await page.getByRole("button", { exact: true, name: "Review & publish" }).click();
    await page.getByRole("button", { exact: true, name: "Review publication" }).click();
    const date = page.getByLabel("Publish date and time (Europe/Madrid)");
    await date.fill("2027-03-28T02:30");
    await expect(
      page.getByRole("button", { name: "Confirm scheduled publication" }),
    ).toBeDisabled();
    await date.fill("2027-01-01T12:00");
    await expect(page.locator(".publication-schedule")).toContainText("2027-01-01T11:00:00.000Z");
    await page
      .locator(".publication-schedule")
      .screenshot({ path: `/tmp/scheduled-publication-${device}.png` });
    await page.getByRole("button", { name: "Confirm scheduled publication" }).click();
    await expect(page.locator(".publication-schedule")).toContainText("pending");
    expect((await visitor.request.get(`http://localhost:3100/${username}`)).status()).toBe(404);
    await selectEditorSection(page, "Profile");
    await page
      .getByRole("textbox", { exact: true, name: "Full name" })
      .fill("Later private scheduled draft");
    await page.getByRole("button", { exact: true, name: "Save changes" }).click();
    await expect(page.locator(".editor-success")).toContainText("Saved privately");
    expect(
      (await visitor.request.get("http://localhost:3100/api/cron/publications")).status(),
    ).toBe(403);
    await page.request.post(`http://127.0.0.1:3101/__test/schedules/due/${device}`);
    const run = () =>
      page.request.get("/api/cron/publications", {
        headers: { Authorization: "Bearer fixture-only-scheduler-secret-32-characters" },
      });
    expect((await run()).status()).toBe(200);
    expect(await (await run()).json()).toEqual({ completed: 0 });
    const publicPage = await visitor.newPage();
    await publicPage.goto(`/${username}`);
    await expect(publicPage.getByRole("heading", { level: 1 })).toContainText("Publication Owner");
    await expect(publicPage.locator("body")).not.toContainText("Later private scheduled draft");
    await page.getByRole("button", { exact: true, name: "Review & publish" }).click();
    await page.getByRole("button", { name: "Refresh schedule status" }).click();
    await expect(page.locator(".publication-schedule")).toContainText("completed");
    await page.getByRole("button", { exact: true, name: "Review & publish" }).click();
    await page.getByRole("button", { exact: true, name: "Review publication" }).click();
    await date.fill("2027-01-01T13:00");
    await page.getByRole("button", { name: "Confirm scheduled publication" }).click();
    await page.getByRole("button", { name: "Cancel scheduled publication" }).click();
    await expect(page.locator(".publication-schedule")).toContainText("cancelled");
    await page.request.post(`http://127.0.0.1:3101/__test/schedules/due/${device}`);
    expect(await (await run()).json()).toEqual({ completed: 0 });
  } finally {
    await visitor.close();
  }
});
