import { expect, test } from "@playwright/test";

test("Studio tasks can be created, completed, and deleted", async ({ page, context }, info) => {
  const mobile = info.project.name.startsWith("mobile");
  const id = `83838383-8383-4383-8383-83838383838${mobile ? 1 : 0}`;
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
      value: `base64-${Buffer.from(
        JSON.stringify({
          access_token: token,
          expires_at: exp,
          expires_in: 3600,
          refresh_token: "fixture-refresh",
          token_type: "bearer",
          user: { email: "ai-owner@example.test", id },
        }),
      ).toString("base64url")}`,
    },
  ]);

  await page.goto("/");
  const header = page.getByRole("banner").first();
  await expect(header.locator(".site-navigation-actions :is(a, button):visible")).toHaveCount(2);
  await page.getByRole("button", { name: "Profile menu" }).click();
  await expect(page.getByRole("menuitem", { name: "My portfolio" })).toHaveAttribute(
    "href",
    mobile ? "/mobile-ai-owner" : "/desktop-ai-owner",
  );
  await page.getByRole("menuitem", { name: "My Calendar" }).click();
  await expect(page.getByRole("heading", { name: "My Calendar" })).toBeVisible();
  const title = "Review the fixture roadmap";
  const month = page.getByRole("region", { name: "Month calendar" });
  const cell = month
    .locator("div.relative:not([data-outside]):not([data-selected])")
    .filter({
      has: page.getByRole("button", { name: /^Select / }),
    })
    .filter({ hasNot: page.getByRole("button", { name: /^Select /, pressed: true }) })
    .first();
  const select = cell.getByRole("button", { name: /^Select / });
  const dayLabel = await select.getAttribute("aria-label");
  await cell.click({ position: { x: 12, y: 40 } });
  await expect(month.getByRole("button", { exact: true, name: dayLabel ?? "" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const selectedDate = await page.locator("time[datetime]").first().getAttribute("datetime");
  await page.getByRole("button", { name: "Add task for this day" }).click();
  const add = page.getByRole("dialog", { name: "Add task" });
  await expect(add.getByLabel("Date", { exact: true })).toHaveValue(selectedDate ?? "");
  await add.getByLabel("Title").fill(title);
  await add.getByLabel("Time (optional)").fill("09:30");
  await add.getByRole("button", { name: "Add task" }).click();

  const editButton = page.getByRole("button", { name: `Edit ${title}` });
  await expect(editButton).toBeVisible();
  await page.reload();
  await page.getByRole("button", { exact: true, name: dayLabel ?? "" }).click();
  await editButton.click();
  const edit = page.getByRole("dialog", { name: "Edit task" });
  await expect(edit.getByLabel("Time (optional)")).toHaveValue("09:30");
  await edit.getByLabel("Completed").check();
  await edit.getByRole("button", { name: "Save changes" }).click();
  await expect(
    page.getByRole("region", { name: /^Agenda for/ }).getByText("Completed"),
  ).toBeVisible();

  await page.getByRole("button", { exact: true, name: "Week" }).click();
  await expect(page.getByRole("region", { name: "Week calendar" })).toBeVisible();
  await page.getByLabel("Calendar source").selectOption("google-calendar");
  await expect(editButton).toHaveCount(0);
  await page.getByLabel("Calendar source").selectOption("studio");
  await editButton.click();
  page.once("dialog", (dialog) => dialog.accept());
  await edit.getByRole("button", { name: "Delete task" }).click();
  await expect(page.getByText("Task deleted.")).toBeVisible();
  await expect(editButton).toHaveCount(0);
});

test("My Calendar redirects signed-out visitors", async ({ page }) => {
  await page.goto("/studio/calendar");
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});
