import { expect, test } from "@playwright/test";

test("owner saves custom sections, reorders, duplicates and removes them, and visitors see the result", async ({
  page,
  context,
}, info) => {
  const device = info.project.name.startsWith("mobile") ? "mobile" : "desktop";
  const index = device === "mobile" ? 1 : 0;
  const id = `cdcdcdcd-cdcd-4dcd-8dcd-cdcdcdcdcdc${index}`;
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
    user: { email: "custom-owner@example.test", id },
  };
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      sameSite: "Lax",
      url: "http://localhost:3100",
      value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`,
    },
  ]);
  const editor = `/${device}-custom-owner/edit`;
  await page.goto(editor);
  await page.getByRole("button", { exact: true, name: "Custom sections" }).click();
  await page.getByRole("button", { exact: true, name: "Add custom section" }).click();
  await page.getByLabel("Section name", { exact: true }).fill("Community work");
  await page.getByLabel("Section display").selectOption("accordion");
  await page.getByRole("button", { exact: true, name: "+ Add section items" }).click();
  await page.getByLabel("Item title", { exact: true }).fill("Mentoring");
  await page
    .getByLabel("Item details")
    .fill("Helping new developers learn.\n\nA second paragraph.");
  await page.getByLabel("Item link").fill("https://example.com/mentoring");
  await page.getByRole("button", { exact: true, name: "Duplicate section" }).click();
  await page.getByRole("button", { exact: true, name: "Section order" }).click();
  const handle = page.getByRole("button", {
    exact: true,
    name: "Reorder Community work copy",
  });
  await handle.focus();
  await handle.press("Home");
  await expect(
    page.getByRole("list", { name: "Portfolio section order" }).locator("li").first(),
  ).toContainText("Community work copy");
  await page.getByRole("button", { exact: true, name: "Custom sections" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("group", { exact: true, name: "Community work" })
    .getByRole("button", { exact: true, name: "Remove section" })
    .click();
  await page.getByLabel("Publish my profile and CV at a public link").check();
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved.");
  await expect(page.getByRole("button", { exact: true, name: "Save changes" })).toBeDisabled();
  await page.reload();
  await page.getByRole("button", { exact: true, name: "Custom sections" }).click();
  await expect(page.getByLabel("Section name", { exact: true })).toHaveValue("Community work copy");
  await page
    .getByRole("group", { exact: true, name: "Community work copy" })
    .screenshot({ path: info.outputPath("custom-editor.png") });
  await context.clearCookies();
  await page.goto(`/${device}-custom-owner`);
  const firstSection = page.locator("#main-content section").filter({
    has: page.getByRole("heading", {
      exact: true,
      name: "Community work copy",
    }),
  });
  await expect(firstSection).toBeVisible();
  await firstSection.locator("summary").click();
  await expect(
    firstSection.getByText("Helping new developers learn.", { exact: true }),
  ).toBeVisible();
  await expect(firstSection.getByRole("link", { name: "Mentoring ↗" })).toHaveAttribute(
    "href",
    "https://example.com/mentoring",
  );
  expect(
    await page
      .locator("#main-content .portfolio-section h2, #main-content .folio-section h2")
      .first()
      .textContent(),
  ).toBe("Community work copy");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await firstSection.screenshot({
    path: info.outputPath("custom-portfolio.png"),
  });
});
