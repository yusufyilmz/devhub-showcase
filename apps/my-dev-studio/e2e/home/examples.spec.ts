import { expect, test } from "@playwright/test";

import { portfolioExamples } from "@shared/assistant/examples-data";

test("carousel filters, navigates in both directions and opens a full demo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#examples");
  const gallery = page.locator("#examples");
  await expect(gallery.locator(".example-card")).toHaveCount(portfolioExamples.length);
  await gallery.screenshot({
    path: test.info().outputPath("homepage-gallery.png"),
  });
  const track = gallery.locator(".example-track");
  await gallery.getByRole("button", { name: "Next portfolio examples" }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  await gallery.getByRole("button", { name: "Previous portfolio examples" }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeLessThan(3);
  await gallery.getByRole("button", { exact: true, name: "Designer" }).click();
  await expect(gallery.locator(".example-card")).toHaveCount(
    portfolioExamples.filter((item) => item.profile.portfolioType === "designer").length,
  );
  await gallery.getByRole("link", { name: /Explore Maya Chen/ }).click();
  const preview = page.getByRole("dialog");
  await expect(
    preview.getByRole("heading", { exact: true, level: 2, name: "Maya Chen" }),
  ).toBeVisible();
  await preview.getByRole("link", { name: "Open full page" }).click();
  await expect(page).toHaveURL("/p/examples/maya-chen");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Maya");
  await page.getByRole("link", { name: "All examples" }).click();
  await expect(page).toHaveURL("/#examples");
});
