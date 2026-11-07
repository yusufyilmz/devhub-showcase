import { expect, test } from "@playwright/test";

import { urls } from "@shared/config/urls";

test("writing alternatives and section feedback require review and never autosave", async ({
  page,
  context,
}, info) => {
  const mobile = info.project.name.startsWith("mobile");
  const id = `67676767-6767-4767-8767-67676767676${mobile ? 1 : 0}`;
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
    if (request.method() === "PUT" && request.url().endsWith(urls.studio.profile())) saves++;
  });
  let selectedTask: unknown;
  await page.route(`**${urls.studio.assistant()}`, (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({ json: { enabled: true, limit: 10, usage: 0 } });
    const body = route.request().postDataJSON();
    selectedTask = body.task;
    const feedback = body.task.kind === "feedback";
    return route.fulfill({
      json: {
        proposal: {
          changes: feedback
            ? [
                {
                  field: "title",
                  reason: "Shorter wording",
                  value: JSON.stringify("Frontend engineer"),
                },
              ]
            : [
                {
                  field: "summary",
                  reason: "Same facts, friendly tone",
                  value: JSON.stringify("Creates accessible interfaces."),
                },
              ],
          feedback: feedback
            ? [
                {
                  field: "summary",
                  issue: "No audience is supplied",
                  needsInput: true,
                  recommendation: "Add the audience if you can support it.",
                },
              ]
            : [],
          summary: feedback ? "A clearer introduction" : "A writing alternative",
        },
        revision: body.revision,
      },
    });
  });
  await page.goto(`/${mobile ? "mobile" : "desktop"}-assistant-tools/edit`);
  await page.getByRole("button", { exact: true, name: "AI assistant" }).click();
  await page.getByRole("combobox", { name: /^What do you want help with/ }).selectOption("writing");
  await page.getByRole("combobox", { name: /^Writing tone/ }).selectOption("friendly");
  await page.getByRole("combobox", { name: /^Writing length/ }).selectOption("concise");
  await page.getByRole("button", { exact: true, name: "Generate proposal" }).click();
  await expect(page.getByText("A writing alternative", { exact: true })).toBeVisible();
  expect(selectedTask).toMatchObject({
    field: "summary",
    kind: "writing",
    length: "concise",
    tone: "friendly",
  });
  await expect(
    page.getByRole("button", { exact: true, name: "Apply selected changes to draft" }),
  ).toBeDisabled();
  await page.getByRole("checkbox", { exact: true, name: "summary" }).check();
  await page.getByRole("button", { exact: true, name: "Apply selected changes to draft" }).click();
  await page.getByRole("button", { exact: true, name: "Undo AI changes" }).click();
  await page
    .getByRole("combobox", { name: /^What do you want help with/ })
    .selectOption("feedback");
  await page.getByRole("button", { exact: true, name: "Generate proposal" }).click();
  await expect(page.getByRole("region", { name: "Portfolio feedback" })).toContainText(
    "No audience is supplied",
  );
  await expect(page.getByText("Needs your facts or decision", { exact: true })).toBeVisible();
  await page.getByRole("button", { exact: true, name: "Reject all proposed changes" }).click();
  await expect(
    page.getByRole("button", { exact: true, name: "Apply selected changes to draft" }),
  ).toBeDisabled();
  await page.getByRole("button", { exact: true, name: "Edit summary" }).click();
  await expect(page.getByRole("textbox", { exact: true, name: "Short introduction" })).toHaveValue(
    "Builds accessible interfaces.",
  );
  expect(saves).toBe(0);
  await page.screenshot({ fullPage: true, path: info.outputPath("assistant-tools.png") });
});
