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

test("carousel keeps responsive card widths and scopes typography to the caption", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#examples");
  const track = page.locator(".example-track");
  const card = track.locator(".example-card").first();
  const link = card.getByRole("link").first();
  const heading = card.getByRole("heading", { level: 3 });
  for (const width of [390, 700, 701, 1200]) {
    await page.setViewportSize({ height: 850, width });
    await expect(card).toHaveCSS("flex-basis", width <= 700 ? "88%" : "calc(50% - 12px)");
    await expect(heading).toHaveCSS("display", "flex");
    await expect(heading).toHaveCSS("justify-content", "space-between");
    await expect(card.locator(".example-card-copy p").first()).toHaveCSS("margin", "0px");
    await link.focus();
    await expect(card).toHaveCSS("outline-width", "2px");
  }
});
