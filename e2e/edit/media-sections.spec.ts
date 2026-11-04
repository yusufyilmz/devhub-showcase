import { expect, test } from "@playwright/test";

import { confirmPublication } from "../support/publication";

test("owner saves a video hero and YouTube section and visitors with reduced motion see a paused background", async ({
  page,
  context,
}, info) => {
  const device = info.project.name.startsWith("mobile") ? "mobile" : "desktop";
  const id = `eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee${device === "mobile" ? 1 : 0}`;
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
    user: { email: "media-owner@example.test", id },
  };
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      sameSite: "Lax",
      url: "http://localhost:3100",
      value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`,
    },
  ]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/test-background.mp4", (route) => route.abort());
  await page.goto(`/${device}-media-owner/edit`);
  await page.getByRole("button", { exact: true, name: "Appearance" }).click();
  await page.getByLabel("Use hero background").check();
  await page.getByLabel("Background type").selectOption("video");
  await page.getByLabel("Background media URL").fill("http://localhost:3100/test-background.mp4");
  await page.getByLabel("Video poster URL").fill("http://localhost:3100/examples/orbit-brand.svg");
  await page.getByRole("button", { exact: true, name: "Custom sections" }).click();
  await page.getByLabel("Section starter").selectOption("youtube");
  await page.getByRole("button", { exact: true, name: "Add custom section" }).click();
  await page.getByRole("button", { exact: true, name: "+ Add section items" }).click();
  await page.getByLabel("Item title", { exact: true }).fill("A new film");
  await page.getByLabel("Item link").fill("https://youtu.be/M7lc1UVf-VE");
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await confirmPublication(page);
  await expect(page.getByRole("status")).toContainText("Saved privately.");
  await page.reload();
  await page.getByRole("button", { exact: true, name: "Appearance" }).click();
  await expect(page.getByLabel("Background media URL")).toHaveValue(
    "http://localhost:3100/test-background.mp4",
  );
  await context.clearCookies();
  await page.goto(`/${device}-media-owner`);
  await expect(
    page.getByRole("button", { exact: true, name: "Play background video" }),
  ).toBeVisible();
  expect(
    await page
      .locator(".hero-surface video")
      .evaluate((node: HTMLVideoElement) => node.paused && node.muted),
  ).toBe(true);
  await expect(page.locator(".composition-youtube")).toContainText("A new film");
  await expect(page.locator(".composition-youtube iframe")).toHaveCount(0);
  await page.locator(".hero-surface").screenshot({ path: info.outputPath("video-poster.png") });
});
