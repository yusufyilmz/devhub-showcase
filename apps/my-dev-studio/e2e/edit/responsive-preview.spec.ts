import { expect, test } from "@playwright/test";

import { portfolioTypes } from "@shared/config";
import { urls } from "@shared/config/urls";

import { openEditor, selectEditorSection, showEditorPreview } from "../support/editor";

test("private draft preview resizes, changes layouts and preserves unsaved edits", async ({
  page,
  context,
}, info) => {
  const mobile = info.project.name.startsWith("mobile");
  const id = `62626262-6262-4262-8262-62626262626${mobile ? 1 : 0}`;
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

  const profileApi = urls.studio.profile();
  const original = (await (await page.request.get(profileApi)).json()).profile.title;
  let saves = 0;
  page.on("request", (request) => {
    if (request.url().endsWith(profileApi) && request.method() === "PUT") saves++;
  });
  await page.goto(`/${mobile ? "mobile" : "desktop"}-preview-owner/edit`);
  await openEditor(page);
  const title = page.getByRole("textbox", {
    exact: true,
    includeHidden: true,
    name: "Professional title",
  });
  await title.fill("Unsaved responsive portfolio");
  await showEditorPreview(page);
  const preview = page.frameLocator('iframe[title="Private draft preview"]');
  await expect(preview.getByText("Unsaved responsive portfolio", { exact: true })).toBeVisible();
  await expect(preview.getByText("Confidential project", { exact: true })).toHaveCount(0);
  await expect(preview.locator("#experiences")).toHaveCount(0);
  for (const [label, width] of [
    ["Mobile", 375],
    ["Tablet", 768],
    ["Desktop", 1280],
  ] as const) {
    await page.getByRole("button", { exact: true, name: `${label} · ${width}px` }).click();
    await expect
      .poll(() =>
        preview.locator("html").evaluate((node) => node.ownerDocument.defaultView?.innerWidth),
      )
      .toBe(width);
    // The preview itself must fit its viewport. A wide desktop canvas can scroll inside the editor.
    await expect
      .poll(() =>
        preview
          .locator("html")
          .evaluate(
            (node) => node.scrollWidth <= (node.ownerDocument.defaultView?.innerWidth ?? 0),
          ),
      )
      .toBe(true);
    await openEditor(page);
    await expect(title).toHaveValue("Unsaved responsive portfolio");
    await showEditorPreview(page);
  }
  await selectEditorSection(page, "Section order");
  const moveLanguages = page.getByRole("button", { exact: true, name: "Move Languages up" });
  for (let n = 0; n < 6 && (await moveLanguages.isEnabled()); n++) {
    await moveLanguages.focus();
    await page.keyboard.press("Enter");
  }
  await showEditorPreview(page);
  await expect(preview.locator(".portfolio-section h2").first()).toHaveText("Languages");
  await selectEditorSection(page, "Layout");
  for (const type of portfolioTypes.filter((type) => type.id !== "engineer")) {
    await openEditor(page);
    await page.getByRole("radio", { name: new RegExp(type.name) }).check();
    await showEditorPreview(page);
    await expect(preview.locator(`[data-portfolio-type="${type.id}"]`)).toBeVisible();
    await expect(preview.getByText("Unsaved responsive portfolio", { exact: true })).toBeVisible();
    for (const [label, width] of [
      ["Mobile", 375],
      ["Tablet", 768],
      ["Desktop", 1280],
    ] as const) {
      await page.getByRole("button", { exact: true, name: `${label} · ${width}px` }).click();
      await expect
        .poll(() =>
          preview
            .locator("html")
            .evaluate(
              (node) => node.scrollWidth <= (node.ownerDocument.defaultView?.innerWidth ?? 0),
            ),
        )
        .toBe(true);
    }
    await expect(preview.getByText("Confidential project", { exact: true })).toHaveCount(0);
  }
  await page.getByText("Preview your draft", { exact: true }).click();
  await page.getByText("Preview your draft", { exact: true }).click();
  await expect(preview.locator('[data-portfolio-type="creator"]')).toBeVisible();
  await page
    .locator(".draft-preview")
    .screenshot({ path: info.outputPath("responsive-draft.png") });
  expect(saves).toBe(0);
  expect((await (await page.request.get(profileApi)).json()).profile.title).toBe(original);
  await page.getByRole("button", { exact: true, name: "Arrange sections" }).click();
  const arranged = preview.getByRole("list", { name: "Arrange portfolio sections" });
  const first = arranged.locator(":scope > [data-sortable-id]").first();
  await expect(first).toHaveAttribute("data-sortable-id", "languages");
  await arranged.getByRole("button", { exact: true, name: "Reorder About" }).press("Home");
  await expect(first).toHaveAttribute("data-sortable-id", "about");
  await expect(preview.getByText("Confidential project", { exact: true })).toHaveCount(0);
  expect(saves).toBe(0);
  await page.getByRole("button", { name: "Save layout draft" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Saved privately." })).toBeVisible();
  const saved = (await (await page.request.get(profileApi)).json()).profile;
  expect(saved.sectionSequence).toContain("experience");
  expect(saved.sectionSequence).toContain("projects");
  expect(saved.sectionSequence.indexOf("about")).toBeLessThan(
    saved.sectionSequence.indexOf("languages"),
  );
  expect(saves).toBe(1);
  await page.goto(
    `/${mobile ? "mobile" : "desktop"}-preview-owner/edit?view=arrange#portfolio-draft-preview`,
  );
  await expect(arranged).toBeVisible();
  await expect(first).toHaveAttribute("data-sortable-id", "about");
  await context.clearCookies();
  expect(
    (
      await page.request.get(`/${mobile ? "mobile" : "desktop"}-preview-owner/edit?view=arrange`, {
        maxRedirects: 0,
      })
    ).status(),
  ).toBe(307);
  expect((await page.request.get(`/${mobile ? "mobile" : "desktop"}-preview-owner`)).status()).toBe(
    404,
  );
  expect((await page.request.get(profileApi)).status()).toBe(403);
});
