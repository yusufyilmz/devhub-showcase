import { expect, test } from "@playwright/test";

import { openEditor } from "../support/editor";

test("the original owner can moderate testimonials on desktop and at a narrow width", async ({
  page,
  context,
}, info) => {
  // biome-ignore lint/suspicious/noSkippedTests: The single original-owner fixture is shared across projects. This test checks both widths.
  test.skip(info.project.name !== "desktop-chromium", "Both widths use the same review queue.");
  await page.goto("/reviews");
  await expect(page).toHaveURL(/\/login/);

  const id = "11111111-1111-4111-8111-111111111119";
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const token = `fixture.${Buffer.from(JSON.stringify({ exp, sub: id })).toString("base64url")}.signature`;
  const session = {
    access_token: token,
    expires_at: exp,
    expires_in: 3600,
    refresh_token: "fixture-refresh",
    token_type: "bearer",
    user: { id },
  };
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      url: "http://localhost:3100",
      value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`,
    },
  ]);
  await page.goto("/reviews");
  await expect(page).toHaveURL(/\/yusufyilmz\/edit\?tab=reviews$/);
  const queue = page.getByRole("region", { name: "Testimonial reviews" });
  await expect(queue.getByText("2 pending")).toBeVisible();
  await queue.screenshot({ path: info.outputPath("reviews-desktop.png") });

  await page.setViewportSize({ height: 844, width: 390 });
  await queue.screenshot({ path: info.outputPath("reviews-mobile.png") });
  const approve = queue.getByRole("button", { name: "Approve testimonial from Alex Example" });
  await page.route("**/yusufyilmz/edit?tab=reviews", (route) =>
    route.request().method() === "POST" ? route.abort() : route.continue(),
  );
  await approve.click();
  await expect(queue.getByRole("alert")).toHaveText("Couldn’t save your decision. Try again.");
  await page.unroute("**/yusufyilmz/edit?tab=reviews");

  await approve.click();
  await expect(queue.getByText("1 pending")).toBeVisible();
  await queue.getByRole("button", { name: "Reject testimonial from Sam Example" }).click();
  await expect(queue.getByText("You’re all caught up")).toBeVisible();
  await page.reload();
  await openEditor(page);
  await expect(queue.getByText("0 pending")).toBeVisible();

  await context.clearCookies();
  await page.goto("/yusufyilmz");
  await expect(page.getByText("Alex supplied a fictional testimonial.")).toBeVisible();
  await expect(page.getByText("Sam supplied a fictional testimonial.")).toHaveCount(0);
});
