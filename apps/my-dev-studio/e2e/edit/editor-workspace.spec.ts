import { expect, test } from "@playwright/test";

import { urls } from "@shared/config/urls";

import { openEditor, selectEditorSection, showEditorPreview } from "../support/editor";

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
  const assistant = page.getByLabel("Open Studio assistant", { exact: true });
  await expect(assistant).toBeVisible();
  const workspace = page.locator(".editor-workspace-main");
  const sidebar = page.getByRole("navigation", { name: "Editor sections" });
  if (!mobile) {
    const sidebarBounds = await sidebar.boundingBox();
    const headingBounds = await page.locator(".studio-editor-header").boundingBox();
    expect(sidebarBounds?.x).toBe(0);
    expect(sidebarBounds?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(headingBounds?.y ?? 0);
    await sidebar.getByRole("button", { name: "Collapse sidebar" }).click();
    await expect(sidebar).toHaveCSS("width", "64px");
    const publishing = sidebar.getByRole("button", { exact: true, name: "Publishing" });
    await expect(publishing.locator("svg.lucide-send")).toHaveCount(1);
    await expect(publishing).toHaveText("");
    await publishing.click();
    await expect(workspace.getByRole("region", { name: "Edit Publishing" })).toBeInViewport();
    await sidebar.getByRole("button", { name: "Expand sidebar" }).click();
    await expect(sidebar).toHaveCSS("width", "232px");
    await selectEditorSection(page, "Profile");
  } else {
    await openEditor(page);
  }
  await expect(workspace.getByRole("region", { name: "Edit Profile" })).toBeVisible();
  await expect(assistant).toBeHidden();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("textbox", { exact: true, name: "Full name" })).toBeVisible();
  await expect(page.getByLabel("Username", { exact: true })).toHaveCount(0);
  const title = page.getByRole("textbox", { exact: true, name: "Professional title" });
  await title.fill("Unsaved editor workspace title");
  await selectEditorSection(page, "Experience");
  const entry = page.locator(".editor-collection-toggle").first();
  await entry.click();
  await expect(entry).toHaveAttribute("aria-expanded", "true");
  await selectEditorSection(page, "Profile");
  await expect(title).toHaveValue("Unsaved editor workspace title");
  await page.screenshot({ path: info.outputPath("editor-section.png") });
  await page.getByRole("button", { name: "Done editing" }).click();
  await expect(workspace.getByRole("region", { name: "Edit Profile" })).toHaveCount(0);
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
  await expect(workspace.getByRole("region", { name: "Edit Publishing" })).toBeVisible();
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
  await selectEditorSection(page, "Profile");
  await expect(title).toHaveValue("Unsaved editor workspace title");
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.locator(".studio-status")).toContainText("All changes saved");
  await page.reload();
  await openEditor(page);
  await expect(title).toHaveValue("Unsaved editor workspace title");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
  await title.fill("Existing unsaved edit");
  const savesBeforeStartingOver = saves;
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Start from scratch" }).click();
  await expect(page.getByRole("dialog", { name: "Create your portfolio" })).toBeVisible();
  await page.getByRole("button", { name: "Choose a layout" }).click();
  await page.getByRole("button", { name: "Choose how to start" }).click();
  await page.getByRole("button", { name: /Enter details manually/ }).click();
  await expect(title).toHaveValue("Add your professional title");
  await page.getByRole("button", { name: "Cancel starting over" }).click();
  await expect(title).toHaveValue("Existing unsaved edit");
  expect(saves).toBe(savesBeforeStartingOver);
  await title.fill("Unsaved editor workspace title");
  await showEditorPreview(page);
  await page.screenshot({ path: info.outputPath("editor-workspace-viewport.png") });
  await page.screenshot({ fullPage: true, path: info.outputPath("editor-workspace.png") });
  expect((await page.request.get(`/${username}`)).status()).toBe(404);
  await context.clearCookies();
  expect((await page.request.get(endpoint)).status()).toBe(403);
});
