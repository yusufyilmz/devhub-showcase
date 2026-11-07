import { expect, test } from "@playwright/test";

import { getPortfolioCopy } from "@shared/config";
import { urls } from "@shared/config/urls";

import { openEditor, selectEditorSection } from "../support/editor";
import { confirmPublication } from "../support/publication";

test("a new owner chooses a layout, saves it and returns to the editor without losing the choice", async ({
  page,
  context,
}, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Appearance controls" }).hover();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  const index = testInfo.project.name.startsWith("mobile") ? 1 : 0;
  const device = index ? "mobile" : "desktop";
  await page.request.post(`http://127.0.0.1:3101/__test/reset/${device}`);
  const userId = `33333333-3333-4333-8333-33333333333${index}`;
  const exp = Math.floor(Date.now() / 1000) + 3600;
  // Only the test fixture accepts this synthetic token. No real account or
  // production provider is involved. This does not exercise live Google OAuth.
  const accessToken = [
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url"),
    Buffer.from(JSON.stringify({ aud: "authenticated", exp, sub: userId })).toString("base64url"),
    Buffer.from("test-signature").toString("base64url"),
  ].join(".");
  const session = {
    access_token: accessToken,
    expires_at: exp,
    expires_in: 3600,
    refresh_token: "fixture-refresh",
    token_type: "bearer",
    user: { email: "owner@example.test", id: userId },
  };
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      sameSite: "Lax",
      url: "http://localhost:3100",
      value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`,
    },
  ]);
  await page.goto(`/${device}-starter/edit`);
  await openEditor(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key) ?? "null")?.state?.user?.id,
        "mydevstudio-userconfig-store",
      ),
    )
    .toBe(userId);
  await expect(page.getByRole("group", { name: "Choose your portfolio layout" })).toBeVisible();
  await page.getByRole("radio", { name: /Designer/ }).check();
  await page.screenshot({
    fullPage: true,
    path: testInfo.outputPath("type-picker.png"),
  });
  await page.getByRole("button", { name: "Use this layout" }).click();
  await expect(page.getByRole("textbox", { exact: true, name: "Full name" })).toHaveValue(
    "New Portfolio Owner",
  );
  await selectEditorSection(page, "Publishing");
  await expect(page.getByText("Your saved draft is private until you publish it.")).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");
  await page.reload();
  await openEditor(page);
  await expect(page.getByRole("textbox", { exact: true, name: "Full name" })).toHaveValue(
    "New Portfolio Owner",
  );
  await selectEditorSection(page, "Layout");
  await expect(page.getByRole("radio", { name: /Designer/ })).toBeChecked();
  await selectEditorSection(page, "PDF");
  await expect(page.getByLabel("CV layout")).toHaveValue("editorial");
  await selectEditorSection(page, "Language settings");
  await page.getByLabel("Portfolio language").selectOption("es");
  await page.getByRole("combobox", { name: /^CV language/ }).selectOption("tr");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");
  await page.reload();
  await openEditor(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await selectEditorSection(page, "Language settings");
  await expect(page.getByLabel("Portfolio language")).toHaveValue("es");
  await expect(page.getByRole("combobox", { name: /^CV language/ })).toHaveValue("tr");
  const savedPdf = await page.request.get(urls.studio.cv());
  expect(savedPdf.headers()["content-language"]).toBe("tr");
  expect((await savedPdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await selectEditorSection(page, "Appearance");
  await page.getByRole("radio", { name: /Paper/ }).check();
  await page.getByRole("button", { name: "Preview light" }).click();
  const preview = page.getByRole("region", { name: "Portfolio theme preview" });
  await expect(preview).toHaveAttribute("data-portfolio-theme", "paper");
  await expect(preview).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("group", { name: "Preview color mode" }).locator("legend")).toHaveCSS(
    "position",
    "absolute",
  );
  await expect(page.locator("html")).not.toHaveAttribute("data-portfolio-theme");
  await page.screenshot({
    fullPage: true,
    path: testInfo.outputPath("theme-picker.png"),
  });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");
  await page.reload();
  await openEditor(page);
  await selectEditorSection(page, "Appearance");
  await expect(page.getByRole("radio", { name: /Paper/ })).toBeChecked();
  await expect(page.getByLabel("Default color mode")).toHaveValue("system");
  await selectEditorSection(page, "Section order");
  const sections = page.getByRole("list", { name: "Portfolio section order" });
  await expect
    .poll(() =>
      sections
        .locator("li")
        .evaluateAll((rows) => rows.map((row) => (row as HTMLElement).dataset.sortableId)),
    )
    .toEqual(["projects", "about", "experience", "skills", "education", "languages"]);
  const about = page.getByRole("button", {
    exact: true,
    name: "Reorder About",
  });
  await about.focus();
  await about.press("Home");
  await expect(sections.locator("li").first()).toHaveAttribute("data-sortable-id", "about");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved");
  await page.reload();
  await openEditor(page);
  await selectEditorSection(page, "Section order");
  await expect(sections.locator("li").first()).toHaveAttribute("data-sortable-id", "about");
  // A pointer cancel must not commit the provisional order.
  await sections.scrollIntoViewIfNeeded();
  const handle = page.getByRole("button", {
    exact: true,
    name: "Reorder About",
  });
  const target = sections.locator('[data-sortable-id="experience"]');
  const start = await handle.boundingBox();
  const end = await target.boundingBox();
  if (!start || !end) throw new Error("Missing drag targets");
  if (index) {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      touchPoints: [{ x: start.x + 20, y: start.y + 20 }],
      type: "touchStart",
    });
    await cdp.send("Input.dispatchTouchEvent", {
      touchPoints: [{ x: start.x + 20, y: end.y + end.height / 2 }],
      type: "touchMove",
    });
    await cdp.send("Input.dispatchTouchEvent", {
      touchPoints: [],
      type: "touchCancel",
    });
    await expect(sections.locator("li").first()).toHaveAttribute("data-sortable-id", "about");
    await cdp.send("Input.dispatchTouchEvent", {
      touchPoints: [{ x: start.x + 20, y: start.y + 20 }],
      type: "touchStart",
    });
    await cdp.send("Input.dispatchTouchEvent", {
      touchPoints: [{ x: start.x + 20, y: end.y + end.height / 2 }],
      type: "touchMove",
    });
    await cdp.send("Input.dispatchTouchEvent", {
      touchPoints: [],
      type: "touchEnd",
    });
    await cdp.detach();
  } else {
    await page.mouse.move(start.x + 20, start.y + 20);
    await page.mouse.down();
    await page.mouse.move(start.x + 20, end.y + end.height / 2, { steps: 6 });
    await page.keyboard.press("Escape");
    await page.mouse.up();
    await expect(sections.locator("li").first()).toHaveAttribute("data-sortable-id", "about");
    await page.mouse.move(start.x + 20, start.y + 20);
    await page.mouse.down();
    await page.mouse.move(start.x + 20, end.y + end.height / 2, { steps: 6 });
    await page.mouse.up();
  }
  await expect
    .poll(() =>
      sections
        .locator("li")
        .evaluateAll((rows) => rows.map((row) => (row as HTMLElement).dataset.sortableId)),
    )
    .toEqual(["projects", "experience", "about", "skills", "education", "languages"]);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved");
  await page.reload();
  await openEditor(page);
  await selectEditorSection(page, "Section order");
  await expect
    .poll(() =>
      sections
        .locator("li")
        .evaluateAll((rows) => rows.map((row) => (row as HTMLElement).dataset.sortableId)),
    )
    .toEqual(["projects", "experience", "about", "skills", "education", "languages"]);
  await page.screenshot({
    fullPage: true,
    path: testInfo.outputPath("section-order.png"),
  });
  await page.getByRole("button", { name: "Reset to layout default" }).click();
  await expect
    .poll(() =>
      sections
        .locator("li")
        .evaluateAll((rows) => rows.map((row) => (row as HTMLElement).dataset.sortableId)),
    )
    .toEqual(["projects", "about", "experience", "skills", "education", "languages"]);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved");
  await page.reload();
  await openEditor(page);
  await selectEditorSection(page, "Section order");
  await expect
    .poll(() =>
      sections
        .locator("li")
        .evaluateAll((rows) => rows.map((row) => (row as HTMLElement).dataset.sortableId)),
    )
    .toEqual(["projects", "about", "experience", "skills", "education", "languages"]);
  await selectEditorSection(page, "Profile");
  await page.getByLabel("About you").fill("An independent test portfolio.");
  await selectEditorSection(page, "Skills");
  await page.getByRole("button", { name: "+ Add group" }).click();
  await page.getByLabel("Skill group 1 skills").fill("TypeScript");
  await selectEditorSection(page, "Section order");
  await page.getByRole("button", { exact: true, name: "Reorder Skills" }).press("Home");
  await page.getByRole("button", { name: "Save changes" }).click();
  await confirmPublication(page);
  await expect(page.locator(".editor-success")).toContainText("Saved");
  await page.goto(`/${device}-starter`);
  const publicHeadings = await page.locator(".folio-story .folio-section h2").allTextContents();
  const text = getPortfolioCopy("es");
  expect(publicHeadings.slice(0, 2)).toEqual([text.creativeToolkit, text.about]);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("New Portfolio Owner");
});
