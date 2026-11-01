import { expect, test } from "@playwright/test";

test("shared semantic utilities resolve the active palette in both color modes", async ({
  page,
}, testInfo) => {
  await page.goto("/studio-engineer");
  const skill = page.locator(".reveal-card .bg-main-light").first();
  await expect(skill).toHaveCSS("display", "flex");
  await expect(skill).toHaveCSS("padding-left", "12px");
  await expect(skill).toHaveCSS("color", "rgb(184, 165, 255)");
  await expect(skill).toHaveCSS("background-color", "rgb(22, 34, 52)");
  await page.screenshot({
    fullPage: true,
    path: testInfo.outputPath("engineer-dark.png"),
  });
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(skill).toHaveCSS("color", "rgb(111, 69, 177)");
  await expect(skill).toHaveCSS("background-color", "rgb(236, 242, 248)");
  await page.screenshot({
    fullPage: true,
    path: testInfo.outputPath("engineer-light.png"),
  });
});
