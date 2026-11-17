import { expect, test } from "@playwright/test";

import { dateLabel } from "@shared/lib/types";

test("the Fitness demo opens the shared calendar and its day agenda", async ({ page }, info) => {
  const date = "2026-11-17";
  await page.goto(`/preview?date=${date}&view=Calendar`);
  const featureTip = page.getByRole("button", { name: "Dismiss feature tip" });
  if (await featureTip.isVisible()) await featureTip.click();

  const month = page.getByRole("region", { name: "Month calendar" });
  await expect(month).toBeVisible();
  if (info.project.use.hasTouch) {
    const main = await page
      .getByRole("main")
      .evaluate((element) => element.getBoundingClientRect().width);
    expect(main).toBeGreaterThan((page.viewportSize()?.width ?? 0) * 0.9);
  }
  const width = await month.evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(width).toBeLessThanOrEqual(1);
  await page
    .getByRole("group", { name: "Calendar view" })
    .getByRole("button", { name: "Week" })
    .click();
  const week = page.getByRole("region", { name: "Week calendar" });
  await expect(week).toBeVisible();
  await week.getByRole("link", { name: `Open ${dateLabel(date)}` }).click();
  await expect(page.getByRole("region", { name: `Agenda for ${dateLabel(date)}` })).toBeVisible();
});
