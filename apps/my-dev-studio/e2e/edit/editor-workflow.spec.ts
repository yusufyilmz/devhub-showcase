import { expect, test } from "@playwright/test";

import { urls } from "@shared/config/urls";

import { openDraftTools, openEditor } from "../support/editor";

test("guided setup recovers unsaved work and reconciles a newer save from another tab", async ({
  page,
  context,
}, info) => {
  const mobile = info.project.name.startsWith("mobile");
  const id = `65656565-6565-4565-8565-65656565656${mobile ? 1 : 0}`;
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

  const ownerUrl = `/${mobile ? "mobile" : "desktop"}-workflow-owner/edit`;
  let saves = 0;
  page.on("request", (request) => {
    if (request.method() === "PUT" && request.url().endsWith(urls.studio.profile())) saves++;
  });
  page.on("dialog", (dialog) => dialog.accept());
  await page.route(`**${urls.studio.cvImport()}`, (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { enabled: true } });
    return route.fulfill({ json: { error: "Import temporarily unavailable" }, status: 503 });
  });
  await page.goto(ownerUrl);
  await openEditor(page);
  await page
    .getByRole("combobox", { name: "What kind of work do you do?" })
    .selectOption("designer");
  await page.getByRole("button", { exact: true, name: "Choose a layout" }).click();
  await page.getByRole("button", { name: "Continue to CV import" }).click();
  await expect(page.getByRole("dialog", { name: "Import a CV" })).toBeVisible();
  await expect(page.getByText("Start from Google profile")).toHaveCount(0);
  await page.getByLabel("Your CV file").setInputFiles({
    buffer: Buffer.from("%PDF-1.7\nFictional CV"),
    mimeType: "application/pdf",
    name: "sample.pdf",
  });
  await page.getByLabel("Send this CV to OpenAI").check();
  await page.getByRole("button", { name: "Process CV" }).click();
  await expect(page.getByText("Import temporarily unavailable", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await expect(page.getByRole("dialog", { name: "Add your details" })).toBeVisible();
  await page.getByRole("button", { name: "Help me write an introduction" }).click();
  await expect(page.locator("#ai-studio-message")).toHaveValue(
    /Help me write a short portfolio introduction/,
  );
  await page.getByRole("button", { name: "Hide AI help" }).click();
  await page.getByRole("textbox", { exact: true, name: "Full name" }).fill("Alex Designer");
  await page
    .getByRole("textbox", { exact: true, name: "Professional title" })
    .fill("Recovered designer draft");
  await page
    .getByRole("textbox", { name: "Short introduction (optional)" })
    .fill("A thoughtful introduction.");
  await page.getByRole("button", { exact: true, name: "Continue" }).click();
  await expect(page.getByText("2 of 6 · Optional")).toBeVisible();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Projects" }).first()).toBeVisible();
  await expect(page.getByText("Recovery saved in this tab", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { exact: true, name: "Restore recovered draft" }).click();
  await expect(page.getByText("3 of 6 · Optional")).toBeVisible();
  await page.getByRole("button", { name: "Review draft" }).click();
  await expect(page.getByRole("dialog", { name: "Review your draft" })).toBeVisible();
  await page.getByRole("button", { exact: true, name: "CV" }).click();
  await expect(page.getByRole("article", { name: "CV content preview" })).toContainText(
    "Recovered designer draft",
  );
  expect(saves).toBe(0);
  let failSave = true;
  await page.route(`**${urls.studio.profile()}`, (route) => {
    if (route.request().method() === "PUT" && failSave) {
      failSave = false;
      return route.fulfill({ json: { error: "Temporary save failure" }, status: 503 });
    }
    return route.continue();
  });
  await page.getByRole("button", { name: "Save private draft" }).click();
  await expect(page.getByText("Temporary save failure", { exact: true })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Review your draft" })).toBeVisible();
  await page.getByRole("button", { name: "Save private draft" }).click();
  await expect(page.locator(".studio-status")).toContainText("All changes saved");
  await openEditor(page);
  await page
    .getByRole("textbox", { exact: true, name: "Professional title" })
    .fill("Unsaved first tab text");
  await openDraftTools(page);
  await expect(page.getByText("Recovery saved in this tab", { exact: true })).toBeVisible();
  const other = await context.newPage();
  await other.goto(ownerUrl);
  await openEditor(other);
  await other
    .getByRole("textbox", { exact: true, name: "Professional title" })
    .fill("Newer saved revision");
  await other.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(other.locator(".studio-status")).toContainText("All changes saved");
  await expect(page.getByText(/A newer saved revision exists/)).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "Save changes" })).toBeDisabled();
  await page.reload();
  await openEditor(page);
  await expect(
    page.getByRole("button", { exact: true, name: "Restore recovered draft" }),
  ).toBeDisabled();
  await page.getByRole("button", { exact: true, name: "Discard recovery" }).click();
  await expect(page.getByRole("textbox", { exact: true, name: "Professional title" })).toHaveValue(
    "Newer saved revision",
  );
  await page.screenshot({ fullPage: true, path: info.outputPath("guided-recovery.png") });
  await other.close();
});
