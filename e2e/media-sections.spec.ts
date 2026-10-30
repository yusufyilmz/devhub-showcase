import { expect, test } from "@playwright/test";

for (const type of ["engineer", "designer", "consultant", "minimal"]) {
  test(`${type} supports hero media and authored compositions with curated social work`, async ({
    page,
  }, info) => {
    await page.route("https://www.youtube-nocookie.com/**", (route) =>
      route.fulfill({
        body: "<p>Fixture player</p>",
        contentType: "text/html",
      }),
    );
    await page.goto(`/media-${type}`);
    await expect(page.locator(".hero-surface img")).toBeVisible();
    await expect(page.getByRole("heading", { exact: true, name: "Services" })).toBeVisible();
    const faq = page.locator(".composition-faq");
    await faq.locator("summary").click();
    await expect(faq.getByText("Send a message to discuss your project.")).toBeVisible();
    await expect(page.locator(".composition-statistics")).toContainText("12+");
    const films = page.locator(".composition-youtube");
    await expect(films.locator("iframe")).toHaveCount(0);
    await films.getByRole("button", { name: "Load YouTube video: Studio film" }).click();
    await expect(films.locator("iframe")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
    );
    await films.getByRole("button", { name: "Unload video" }).click();
    await expect(films.locator("iframe")).toHaveCount(0);
    await expect(page.locator(".composition-instagram img")).toBeVisible();
    await expect(page.locator(".composition-instagram a")).toHaveAttribute(
      "href",
      "https://www.instagram.com/p/ABC_123/",
    );
    await expect(page.locator(".composition-pinterest a")).toHaveAttribute(
      "href",
      "https://www.pinterest.com/pin/123456/",
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    await page.locator(".hero-surface").screenshot({ path: info.outputPath("hero.png") });
    await page
      .locator(".composition-instagram")
      .screenshot({ path: info.outputPath("social-work.png") });
  });
}
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
  await page.getByLabel("Publish my profile and CV at a public link").check();
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved.");
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
