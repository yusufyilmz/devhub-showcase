import { expect, test } from "@playwright/test";

import { urls } from "@shared/config/urls";

test("checklist follows draft changes and history stays local until save", async ({
  page,
  context,
}, info) => {
  const mobile = info.project.name.startsWith("mobile");
  const id = `61616161-6161-4161-8161-61616161616${mobile ? 1 : 0}`;
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
  let saves = 0;
  page.on("request", (request) => {
    if (request.url().endsWith(urls.studio.profile()) && request.method() === "PUT") saves++;
  });
  await page.goto(`/${mobile ? "mobile" : "desktop"}-guidance-owner/edit`);
  const summary = page.getByRole("textbox", { exact: true, name: "Short introduction" });
  const original = await summary.inputValue();
  await summary.fill("");
  await page.getByText(/Portfolio checklist/).click();
  const item = page
    .locator(".editor-checklist li")
    .filter({ has: page.getByText("Short introduction", { exact: true }) });
  await expect(item).not.toHaveAttribute("data-complete");
  await page.getByRole("button", { exact: true, name: "Undo draft change" }).click();
  await expect(summary).toHaveValue(original);
  await expect(item).toHaveAttribute("data-complete", "true");
  await page.getByRole("button", { exact: true, name: "Redo draft change" }).click();
  await expect(summary).toHaveValue("");
  await page.getByRole("button", { exact: true, name: "Edit Short introduction" }).click();
  await expect(summary).toBeFocused();
  expect(saves).toBe(0);
  await summary.fill("A clear introduction.");
  await expect(page.getByRole("button", { exact: true, name: "Redo draft change" })).toBeDisabled();
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.locator(".studio-status")).toContainText("All changes saved");
  await expect(page.getByRole("button", { exact: true, name: "Undo draft change" })).toBeDisabled();
  await page.reload();
  await expect(summary).toHaveValue("A clear introduction.");
  await page.screenshot({ fullPage: true, path: info.outputPath("editor-guidance.png") });
});
