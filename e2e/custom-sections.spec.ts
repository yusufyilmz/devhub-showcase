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
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
      "base64url",
    ),
    Buffer.from(
      JSON.stringify({ sub: id, exp, aud: "authenticated" }),
    ).toString("base64url"),
    Buffer.from("fixture-only-signature").toString("base64url"),
  ].join(".");
  const session = {
    access_token: token,
    refresh_token: "fixture-refresh",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: exp,
    user: { id, email: "custom-owner@example.test" },
  };
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`,
      url: "http://localhost:3100",
      sameSite: "Lax",
    },
  ]);
  const editor = `/${device}-custom-owner/edit`;
  await page.goto(editor);
  await page
    .getByRole("button", { name: "Custom sections", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add custom section", exact: true })
    .click();
  await page.getByLabel("Section name", { exact: true }).fill("Community work");
  await page.getByLabel("Section display").selectOption("accordion");
  await page
    .getByRole("button", { name: "+ Add section items", exact: true })
    .click();
  await page.getByLabel("Item title", { exact: true }).fill("Mentoring");
  await page
    .getByLabel("Item details")
    .fill("Helping new developers learn.\n\nA second paragraph.");
  await page.getByLabel("Item link").fill("https://example.com/mentoring");
  await page
    .getByRole("button", { name: "Duplicate section", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Section order", exact: true })
    .click();
  const handle = page.getByRole("button", {
    name: "Reorder Community work copy",
    exact: true,
  });
  await handle.focus();
  await handle.press("Home");
  await expect(
    page
      .getByRole("list", { name: "Portfolio section order" })
      .locator("li")
      .first(),
  ).toContainText("Community work copy");
  await page
    .getByRole("button", { name: "Custom sections", exact: true })
    .click();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("group", { name: "Community work", exact: true })
    .getByRole("button", { name: "Remove section", exact: true })
    .click();
  await page.getByLabel("Publish my profile and CV at a public link").check();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Saved.");
  await expect(
    page.getByRole("button", { name: "Save changes", exact: true }),
  ).toBeDisabled();
  await page.reload();
  await page
    .getByRole("button", { name: "Custom sections", exact: true })
    .click();
  await expect(page.getByLabel("Section name", { exact: true })).toHaveValue(
    "Community work copy",
  );
  await page
    .getByRole("group", { name: "Community work copy", exact: true })
    .screenshot({ path: info.outputPath("custom-editor.png") });
  await context.clearCookies();
  await page.goto(`/${device}-custom-owner`);
  const firstSection = page.locator("#main-content section").filter({
    has: page.getByRole("heading", {
      name: "Community work copy",
      exact: true,
    }),
  });
  await expect(firstSection).toBeVisible();
  await firstSection.locator("summary").click();
  await expect(
    firstSection.getByText("Helping new developers learn.", { exact: true }),
  ).toBeVisible();
  await expect(
    firstSection.getByRole("link", { name: "Mentoring ↗" }),
  ).toHaveAttribute("href", "https://example.com/mentoring");
  expect(
    await page
      .locator(
        "#main-content .portfolio-section h2, #main-content .folio-section h2",
      )
      .first()
      .textContent(),
  ).toBe("Community work copy");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await firstSection.screenshot({
    path: info.outputPath("custom-portfolio.png"),
  });
});
