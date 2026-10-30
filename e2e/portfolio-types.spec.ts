import { expect, test } from "@playwright/test";

import { getPortfolioCopy } from "../packages/content/src/languages";

for (const type of ["designer", "consultant", "minimal"]) {
  test(`${type} portfolio renders its content and downloads a CV`, async ({ page }, testInfo) => {
    const response = await page.goto(`/${type}-example`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("[data-portfolio-type]")).toHaveAttribute(
      "data-portfolio-type",
      type,
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Example");
    await expect(page.locator("#work")).toContainText("Yusuf Fitness OS");
    await expect(page.locator("#work")).not.toContainText("Bank Movements Classifier");
    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath("portfolio.png"),
    });
    await page.getByRole("link", { name: /Explore my work/ }).click();
    await expect(page).toHaveURL(new RegExp(`/${type}-example#work$`));
    const pdf = await page.request.get(`/${type}-example/cv.pdf`);
    expect(pdf.headers()["content-type"]).toContain("application/pdf");
    expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");

    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  });
}

test("a new owner chooses a layout, saves it and returns to the editor without losing the choice", async ({
  page,
  context,
}, testInfo) => {
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
  await expect(page.getByRole("group", { name: "Choose your portfolio layout" })).toBeVisible();
  await page.getByRole("radio", { name: /Designer/ }).check();
  await page.screenshot({
    fullPage: true,
    path: testInfo.outputPath("type-picker.png"),
  });
  await page.getByRole("button", { name: "Use this layout" }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("New Portfolio Owner");
  await expect(page.getByLabel("Publish my profile and CV at a public link")).not.toBeChecked();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");
  await page.reload();
  await expect(page.getByLabel("Full name")).toHaveValue("New Portfolio Owner");
  await page.getByRole("button", { exact: true, name: "Layout" }).click();
  await expect(page.getByRole("radio", { name: /Designer/ })).toBeChecked();
  await page.getByRole("button", { exact: true, name: "PDF" }).click();
  await expect(page.getByLabel("CV layout")).toHaveValue("editorial");
  await page.getByRole("button", { name: "Language settings" }).click();
  await page.getByLabel("Portfolio language").selectOption("es");
  await page.getByLabel("CV language").selectOption("tr");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Language settings" }).click();
  await expect(page.getByLabel("Portfolio language")).toHaveValue("es");
  await expect(page.getByLabel("CV language")).toHaveValue("tr");
  const savedPdf = await page.request.get("/api/admin/cv");
  expect(savedPdf.headers()["content-language"]).toBe("tr");
  expect((await savedPdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await page.getByRole("button", { exact: true, name: "Appearance" }).click();
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
  await page.getByRole("button", { exact: true, name: "Appearance" }).click();
  await expect(page.getByRole("radio", { name: /Paper/ })).toBeChecked();
  await expect(page.getByLabel("Default color mode")).toHaveValue("system");
  await page.getByRole("button", { exact: true, name: "Section order" }).click();
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
  await page.getByRole("button", { exact: true, name: "Section order" }).click();
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
  await page.getByRole("button", { exact: true, name: "Section order" }).click();
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
  await page.getByRole("button", { exact: true, name: "Section order" }).click();
  await expect
    .poll(() =>
      sections
        .locator("li")
        .evaluateAll((rows) => rows.map((row) => (row as HTMLElement).dataset.sortableId)),
    )
    .toEqual(["projects", "about", "experience", "skills", "education", "languages"]);
  await page.getByRole("button", { exact: true, name: "Profile" }).click();
  await page.getByLabel("About paragraphs").fill("An independent test portfolio.");
  await page.getByRole("button", { exact: true, name: "Skills" }).click();
  await page.getByRole("button", { name: "+ Add group" }).click();
  await page.getByLabel("Skill group 1 skills").fill("TypeScript");
  await page.getByRole("button", { exact: true, name: "Section order" }).click();
  await page.getByRole("button", { exact: true, name: "Reorder Skills" }).press("Home");
  await page.getByLabel("Publish my profile and CV at a public link").check();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved");
  await page.goto(`/${device}-starter`);
  const publicHeadings = await page.locator(".folio-story .folio-section h2").allTextContents();
  const text = getPortfolioCopy("es");
  expect(publicHeadings.slice(0, 2)).toEqual([text.creativeToolkit, text.about]);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("New Portfolio Owner");
});
