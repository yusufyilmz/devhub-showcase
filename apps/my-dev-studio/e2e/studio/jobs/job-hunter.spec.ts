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

  await page.goto("/studio/jobs");
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
  await page.goto("/studio/jobs");
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
  await page.goto("/studio/jobs");
  await page.getByLabel("Listing view").selectOption("alerts");
  await expect(page.getByText("Relevant TypeScript experience.")).toBeVisible();
  await page.getByRole("button", { name: "Save job" }).click();
  await page.getByRole("tab", { name: "Saved" }).click();
  await expect(page.getByText("Fixture Software Engineer")).toBeVisible();
  await page.getByRole("button", { name: "Open application site" }).click();
  await expect(page.getByRole("heading", { name: "Fictional provider vacancy" })).toBeVisible();
  await page.goto("/studio/jobs");
  await page.getByRole("tab", { name: "Applications" }).click();
  await expect(page.getByLabel("Application status")).toHaveValue("opened");
  await page.getByLabel("Application status").selectOption("applied");
  await expect(page.getByRole("status")).toHaveText("Saved.");
  await page.reload();
  await page.getByRole("tab", { name: "Applications" }).click();
  await expect(page.getByLabel("Application status")).toHaveValue("applied");
});

test("the profile menu opens job settings and other account pages", async ({
  page,
  context,
}, info) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Profile menu" })).toHaveCount(0);
  await signIn(context, info);
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Profile menu" });
  await expect(menu).toBeVisible();
  await menu.press("Enter");
  await expect(page.getByRole("menuitem", { name: "Edit profile" })).toHaveAttribute(
    "href",
    /\/edit$/,
  );
  await expect(page.getByRole("menuitem", { name: "Plan and billing" })).toHaveAttribute(
    "href",
    "/studio/billing",
  );
  await expect(page.getByRole("menuitem", { name: "Manage portfolios" })).toHaveCount(0);
  await page.getByRole("menuitem", { name: "Job settings" }).click();
  await expect(page.getByRole("tab", { name: "Settings" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await menu.click();
  await page.getByRole("menuitem", { name: "Applications" }).click();
  await expect(page.getByRole("tab", { name: "Applications" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("ChatGPT research can be previewed before committing an import", async ({
  context,
  page,
}, info) => {
  await signIn(context, info);
  const calls: string[] = [];
  await page.route("**/api/jobs/import-chatgpt*", async (route) => {
    const url = new URL(route.request().url());
    calls.push(url.searchParams.get("preview") === "1" ? "preview" : "commit");
    await route.fulfill({
      contentType: "application/json",
      json: {
        duplicates: 0,
        imported: url.searchParams.get("preview") === "1" ? 0 : 1,
        jobs: [
          {
            company: "Fictional Studio",
            duplicate: false,
            title: "Senior Frontend Engineer",
            url: "https://example.test/jobs/123",
          },
        ],
        summary: "One fictional result.",
      },
    });
  });

  await page.goto("/studio/jobs");
  await page.getByText("Import ChatGPT research report").click();
  await page.getByLabel("ChatGPT report JSON").fill(
    JSON.stringify({
      jobs: [
        {
          company: "Fictional Studio",
          originalUrl: "https://example.test/jobs/123",
          title: "Senior Frontend Engineer",
        },
      ],
      report: {
        automationTitle: "Job research",
        generatedAt: "2026-11-19T19:00:00Z",
        source: "chatgpt_automation",
        summary: "One fictional result.",
      },
      schemaVersion: 1,
    }),
  );

  await page.getByRole("button", { name: "Preview report" }).click();
  await expect(page.getByText("One fictional result.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirm import" })).toBeVisible();
  expect(calls).toEqual(["preview"]);

  await page.getByRole("button", { name: "Confirm import" }).click();
  await expect(page.getByRole("status")).toContainText("Imported 1 jobs");
  expect(calls).toEqual(["preview", "commit"]);
});

test("ChatGPT import shows validation errors and duplicate research", async ({
  context,
  page,
}, info) => {
  await signIn(context, info);
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/studio/jobs");
  await page.getByText("Import ChatGPT research report").click();
  await page.getByLabel("ChatGPT report JSON").fill("{");
  await page.getByRole("button", { name: "Preview report" }).click();
  await expect(page.getByRole("status")).toContainText("Please enter valid JSON.");

  await page.route("**/api/jobs/import-chatgpt*", async (route) => {
    const preview = new URL(route.request().url()).searchParams.get("preview") === "1";
    await route.fulfill({
      contentType: "application/json",
      json: preview
        ? {
            duplicates: 1,
            imported: 0,
            jobs: [
              {
                company: "Fictional Studio",
                duplicate: true,
                salaryKnown: false,
                title: "Senior Frontend Engineer",
                url: "https://example.test/jobs/123",
              },
            ],
            summary: "Already seen.",
          }
        : {
            error: "Invalid ChatGPT report format.",
            fields: [{ message: "Enter a public HTTPS link.", path: "jobs.0.originalUrl" }],
          },
      status: preview ? 200 : 400,
    });
  });
  await page.getByLabel("ChatGPT report JSON").fill(
    JSON.stringify({
      jobs: [
        {
          company: "Fictional Studio",
          originalUrl: "https://example.test/jobs/123",
          title: "Senior Frontend Engineer",
        },
      ],
      report: {
        automationTitle: "Job research",
        generatedAt: "2026-11-19T19:00:00Z",
        source: "chatgpt_automation",
        summary: "Already seen.",
      },
      schemaVersion: 1,
    }),
  );
  await page.getByRole("button", { name: "Preview report" }).click();
  await expect(page.getByText("ChatGPT research · unverified.")).toBeVisible();
  await expect(page.getByText("(already imported)")).toBeVisible();
  await expect(page.getByText("Salary unknown.")).toBeVisible();
  await page.getByRole("button", { name: "Confirm import" }).click();
  await expect(page.getByRole("status")).toContainText(
    "jobs.0.originalUrl: Enter a public HTTPS link.",
  );
});
