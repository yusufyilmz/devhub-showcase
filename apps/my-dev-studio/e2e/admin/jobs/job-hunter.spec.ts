import { type BrowserContext, expect, type TestInfo, test } from "@playwright/test";

async function signIn(context: BrowserContext, info: TestInfo) {
  const mobile = info.project.name.startsWith("mobile");
  const id = `83838383-8383-4383-8383-83838383838${mobile ? 1 : 0}`;
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
      url: info.project.use.baseURL ?? "http://localhost:3100",
      value: `base64-${Buffer.from(
        JSON.stringify({
          access_token: token,
          expires_at: exp,
          expires_in: 3600,
          refresh_token: "fixture-refresh",
          token_type: "bearer",
          user: { email: "ai-owner@example.test", id },
        }),
      ).toString("base64url")}`,
    },
  ]);
}

test("a confirmed owner can create, pause and delete a private saved search", async ({
  page,
  context,
}, info) => {
  await signIn(context, info);

  await page.goto("/admin/jobs");
  await expect(page.getByRole("heading", { exact: true, name: "Job Hunter" })).toBeVisible();
  await page.getByRole("tab", { name: "Settings" }).click();
  await page.getByText("Create a saved search", { exact: true }).click();
  await page.getByLabel("Search name").fill("Fixture engineering search");
  await page.getByLabel("Job title").fill("Software Engineer");
  await page.getByLabel("Enable scheduled discovery and AI matching against my CV").check();
  await page.getByRole("button", { name: "Save search" }).click();
  await expect(page.getByText("Fixture engineering search · Enabled")).toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: "Settings" }).click();
  await page.getByText("Fixture engineering search · Enabled").click();
  const edit = page.locator("details").filter({ hasText: "Fixture engineering search · Enabled" });
  await edit.getByLabel("Enable scheduled discovery and AI matching against my CV").uncheck();
  await edit.getByRole("button", { name: "Save search" }).click();
  await page.getByText("Fixture engineering search · Paused").click();
  await page.getByRole("button", { name: "Delete search" }).click();
  await expect(page.getByText("Fixture engineering search · Paused")).toHaveCount(0);
});

test("signed-out users are redirected to sign in", async ({ page }) => {
  await page.goto("/admin/jobs");
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});

test("matches can be saved and an external application tracked", async ({
  page,
  context,
}, info) => {
  await signIn(context, info);
  await page.route("https://jobs.example.test/vacancy", (route) =>
    route.fulfill({
      body: "<h1>Fictional provider vacancy</h1>",
      contentType: "text/html",
    }),
  );
  await page.goto("/admin/jobs");
  await page.getByLabel("Listing view").selectOption("alerts");
  await expect(page.getByText("Relevant TypeScript experience.")).toBeVisible();
  await page.getByRole("button", { name: "Save job" }).click();
  await page.getByRole("tab", { name: "Saved" }).click();
  await expect(page.getByText("Fixture Software Engineer")).toBeVisible();
  await page.getByRole("button", { name: "Open application site" }).click();
  await expect(page.getByRole("heading", { name: "Fictional provider vacancy" })).toBeVisible();
  await page.goto("/admin/jobs");
  await page.getByRole("tab", { name: "Applications" }).click();
  await expect(page.getByLabel("Application status")).toHaveValue("opened");
  await page.getByLabel("Application status").selectOption("applied");
  await expect(page.getByRole("status")).toHaveText("Saved.");
  await page.reload();
  await page.getByRole("tab", { name: "Applications" }).click();
  await expect(page.getByLabel("Application status")).toHaveValue("applied");
});
