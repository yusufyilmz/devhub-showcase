import { expect, test } from "@playwright/test";

import { urls } from "@shared/config/urls";

import { openEditor, showEditorPreview } from "../support/editor";

test("editor workspace keeps draft editing, preview and publication separate", async ({
  page,
  context,
}, info) => {
  const mobile = info.project.name.startsWith("mobile");
  const id = `e2e2e2e2-e2e2-42e2-82e2-e2e2e2e2e2e${mobile ? 1 : 0}`;
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
  const username = `${mobile ? "mobile" : "desktop"}-workspace-owner`;
  const endpoint = urls.studio.profile();
  let saves = 0;
  page.on("request", (request) => {
    if (request.method() === "PUT" && request.url().endsWith(endpoint)) saves++;
  });
  await page.goto(`/${username}/edit`);
  await expect(
    page.getByRole("heading", { exact: true, name: "Edit your portfolio" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { exact: true, name: mobile ? "Mobile · 375px" : "Desktop · 1280px" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { exact: true, name: "Edit" }).click();
  await expect(page.getByRole("dialog", { exact: true, name: "Edit Profile" })).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() => page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]'))))
    .toBe(true);
  await expect(page.getByRole("textbox", { exact: true, name: "Full name" })).toBeVisible();
  await expect(page.getByLabel("Username", { exact: true })).toHaveCount(0);
  const title = page.getByRole("textbox", { exact: true, name: "Professional title" });
  await title.fill("Unsaved editor workspace title");
  async function navigate(section: string) {
    await page.getByRole("combobox", { name: "Editor section" }).selectOption(section);
  }
  await navigate("Experience");
  const entry = page.locator(".editor-collection-toggle").first();
  await entry.click();
  await expect(entry).toHaveAttribute("aria-expanded", "true");
  await navigate("Profile");
  await expect(title).toHaveValue("Unsaved editor workspace title");
  await page.getByRole("dialog").screenshot({ path: info.outputPath("editor-lightbox.png") });
  await page.screenshot({ path: info.outputPath("editor-lightbox-page.png") });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { exact: true, name: "Edit" })).toBeFocused();
  const frame = page.frameLocator('iframe[title="Private draft preview"]');
  await expect(frame.getByText("Unsaved editor workspace title", { exact: true })).toBeVisible();
  await page.getByRole("button", { exact: true, name: "CV" }).click();
  await expect(page.getByRole("article", { name: "CV content preview" })).toContainText(
    "Unsaved editor workspace title",
  );
  await expect(page.getByRole("article", { name: "CV content preview" })).not.toContainText(
    "Confidential project",
  );
  await expect(page.getByRole("link", { name: "Download saved PDF" })).toBeVisible();
  expect(saves).toBe(0);
  await page.getByRole("button", { exact: true, name: "Review & publish" }).click();
  await expect(page.getByRole("dialog", { exact: true, name: "Edit Publishing" })).toBeVisible();
  await expect(page.getByLabel("Username", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { exact: true, name: "Review publication" }),
  ).toBeDisabled();
  await expect(
    page.getByText("Save your draft before reviewing publication.", { exact: true }),
  ).toBeVisible();
  let failSave = true;
  await page.route(`**${endpoint}`, (route) => {
    if (route.request().method() === "PUT" && failSave) {
      failSave = false;
      return route.fulfill({ json: { error: "Temporary workspace save failure" }, status: 503 });
    }
    return route.continue();
  });
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Temporary workspace save failure",
  );
  await navigate("Profile");
  await expect(title).toHaveValue("Unsaved editor workspace title");
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.locator(".studio-status")).toContainText("All changes saved");
  await page.reload();
  await openEditor(page);
  await expect(title).toHaveValue("Unsaved editor workspace title");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
  await showEditorPreview(page);
  await page.screenshot({ path: info.outputPath("editor-workspace-viewport.png") });
  await page.screenshot({ fullPage: true, path: info.outputPath("editor-workspace.png") });
  expect((await page.request.get(`/${username}`)).status()).toBe(404);
  await context.clearCookies();
  expect((await page.request.get(endpoint)).status()).toBe(403);
});
