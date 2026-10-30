import { type BrowserContext, expect, test } from "@playwright/test";

async function signIn(context: BrowserContext, id: string, email: string) {
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
    user: { email, id },
  };
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      sameSite: "Lax",
      url: "http://localhost:3100",
      value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`,
    },
  ]);
}
test("signed out visitors cannot open management pages or create temporary profiles", async ({
  page,
}) => {
  expect((await page.goto("/admin/portfolios"))?.status()).toBe(404);
  const result = await page.request.post("/api/admin/managed", {
    data: {},
    headers: { Origin: "http://localhost:3100" },
  });
  expect(result.status()).toBe(403);
  const pdf = await page.request.get(
    "/admin/portfolios/99999999-9999-4999-8999-999999999999/cv.pdf",
  );
  expect(pdf.status()).toBe(403);
});
test("an administrator creates, edits, publishes, hides and transfers an imported portfolio", async ({
  page,
  context,
}, info) => {
  const n = info.project.name.startsWith("mobile") ? 1 : 0;
  await signIn(context, `99999999-9999-4999-8999-99999999999${n}`, `manager${n}@example.test`);
  await page.goto("/admin/portfolios");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Manage portfolios");
  await page.getByLabel("Import portfolio JSON").setInputFiles({
    buffer: Buffer.from(
      JSON.stringify({
        profile: {
          about: ["Work and visual stories."],
          appearance: {
            accent: "violet",
            defaultTheme: "dark",
            theme: "bloom",
          },
          cvUrl: "/cv.pdf",
          education: [],
          email: "pending@example.com",
          experiences: [],
          github: "",
          languages: [],
          linkedin: "",
          location: "Not specified",
          name: "Creative Import",
          phone: "",
          portfolioType: "designer",
          projects: [],
          skills: { Creative: ["Illustration"] },
          summary: "An imported creative portfolio.",
          templateChosen: true,
          title: "Visual designer",
          website: "",
        },
        username: `managed-import-${n}`,
      }),
    ),
    mimeType: "application/json",
    name: "portfolio.json",
  });
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Creative Import");
  await page.getByRole("button", { name: "Create private portfolio" }).click();
  await expect(page).toHaveURL(/\/admin\/portfolios\/[a-f0-9-]+$/);
  const editorUrl = page.url();
  await expect(page.getByLabel("Full name")).toHaveValue("Creative Import");
  await expect(page.getByLabel("Publish my profile and CV at a public link")).not.toBeChecked();
  const privatePdf = await page.request.get(`${editorUrl}/cv.pdf`);
  expect(privatePdf.status()).toBe(200);
  expect((await privatePdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await page.getByLabel("Full name").fill("Creative Managed");
  await page.getByLabel("Username", { exact: true }).fill(`managed-portfolio-${n}`);
  await page.getByLabel("Publish my profile and CV at a public link").check();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved");
  await expect(page).toHaveURL(editorUrl);
  await page.reload();
  await expect(page.getByLabel("Full name")).toHaveValue("Creative Managed");
  await page.screenshot({
    fullPage: true,
    path: info.outputPath("managed-editor.png"),
  });
  const visitor = await context.browser()?.newContext();
  if (!visitor) throw new Error("Missing browser");
  const publicPage = await visitor.newPage();
  await publicPage.goto(`http://localhost:3100/managed-portfolio-${n}`);
  await expect(publicPage.getByRole("heading", { level: 1 })).toContainText("Creative Managed");
  await page.getByLabel("Publish my profile and CV at a public link").uncheck();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved");
  expect((await publicPage.reload())?.status()).toBe(404);
  await page.getByLabel("Owner account email").fill("missing@example.test");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Transfer portfolio" }).click();
  await expect(page.locator(".editor-alert")).toContainText("sign in with Google");
  await page.getByLabel("Owner account email").fill(`recipient${n}@example.test`);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Transfer portfolio" }).click();
  await expect(page).toHaveURL("/admin/portfolios");
  await expect(page.getByRole("link", { name: "Edit portfolio" })).toHaveCount(0);
  expect((await page.request.get(`${editorUrl}/cv.pdf`)).status()).toBe(403);
  await context.clearCookies();
  await signIn(context, `88888888-8888-4888-8888-88888888888${n}`, `recipient${n}@example.test`);
  await page.goto(`/managed-portfolio-${n}/edit`);
  await expect(page.getByLabel("Full name")).toHaveValue("Creative Managed");
  expect((await page.goto("/admin/portfolios"))?.status()).toBe(404);
  await visitor.close();
});
