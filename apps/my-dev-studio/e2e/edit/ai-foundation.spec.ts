import { expect, test } from "@playwright/test";

import { urls } from "@shared/config/urls";

import { openEditor, selectEditorSection } from "../support/editor";
import { confirmPublication } from "../support/publication";

test("owner can inspect private and public knowledge from the latest saved revision", async ({
  page,
  context,
}, info) => {
  const device = info.project.name.startsWith("mobile") ? "mobile" : "desktop";
  const index = device === "mobile" ? 1 : 0;
  const id = `83838383-8383-4383-8383-83838383838${index}`;
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
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: "ai-owner@example.test", id } })).toString("base64url")}`,
    },
  ]);
  await page.goto(`/${device}-ai-owner/edit`);
  await openEditor(page);
  await selectEditorSection(page, "AI profile");
  await expect(
    page.getByText("Your portfolio is private. No public AI knowledge is available."),
  ).toBeVisible();
  await page.getByLabel("Show private owner knowledge").check();
  await expect(page.locator(".ai-profile-json")).toContainText("Confidential project");
  await selectEditorSection(page, "Profile");
  await page.getByRole("textbox", { exact: true, name: "Full name" }).fill("Alex Updated");
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await confirmPublication(page);
  await expect(
    page.getByText("Saved privately. Review publication to update your public website and CV.", {
      exact: true,
    }),
  ).toBeVisible();
  await selectEditorSection(page, "AI profile");
  await expect(page.locator(".ai-profile-json")).toContainText("Alex Updated");
  const knowledge = JSON.parse((await page.locator(".ai-profile-json").textContent()) ?? "{}");
  expect(knowledge.audience).toBe("public");
  expect(knowledge.source.revision).toBe(2);
  expect(knowledge.sections.some((section: { id: string }) => section.id === "experience")).toBe(
    false,
  );
  expect(JSON.stringify(knowledge)).not.toContain("Confidential project");
  await page
    .locator(".editor-card")
    .filter({ has: page.getByRole("heading", { exact: true, name: "Your AI profile" }) })
    .screenshot({ path: info.outputPath("ai-profile.png") });
  await context.clearCookies();
  expect((await page.request.get(urls.studio.profile())).status()).toBe(403);
  await page.goto(`/${device}-ai-owner`);
  await expect(page.getByRole("link", { name: "Portfolio assistant" })).toHaveCount(0);
});
