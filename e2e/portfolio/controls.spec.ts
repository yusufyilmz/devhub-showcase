import { expect, test } from "@playwright/test";

import { getThemePalette } from "@shared/config";

const rgb = (value: string) => `rgb(${value.replaceAll(" ", ", ")})`;

test("reveal controls stay readable on hover and activation pins the open card", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/studio-engineer");
  const toggle = page.locator(".reveal-toggle").first();
  for (const mode of ["dark", "light"] as const) {
    if ((await page.locator("html").getAttribute("data-theme")) !== mode)
      await page.getByRole("button", { name: `Switch to ${mode} theme` }).click();
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await toggle.hover();
    await expect(toggle).toHaveCSS("color", rgb(getThemePalette("studio", mode).text));
    const contrast = await toggle.evaluate((element) => {
      const style = getComputedStyle(element);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Cannot measure reveal-control contrast");
      function luminance(color: string) {
        if (!context) throw new Error("Missing canvas context");
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        const channels = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
        return channels.reduce((sum, channel, index) => {
          const value = channel / 255;
          const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
          return sum + linear * ([0.2126, 0.7152, 0.0722][index] ?? 0);
        }, 0);
      }
      const foreground = luminance(style.color);
      const background = luminance(style.backgroundColor);
      return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
    await page
      .locator(".reveal-card")
      .first()
      .screenshot({
        path: info.outputPath(`reveal-control-${mode}.png`),
      });
    await toggle.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  }
});

test("portfolio icon controls use matching foreground and surface colors in both themes", async ({
  page,
}, info) => {
  await page.goto("/yusufyilmz");
  for (const mode of ["dark", "light"] as const) {
    if ((await page.locator("html").getAttribute("data-theme")) !== mode)
      await page.getByRole("button", { name: `Switch to ${mode} theme` }).click();
    const palette = getThemePalette("studio", mode);
    const labels = ["Resume Chat", "Referral Chat", "Scroll to next section"];
    if (info.project.name.startsWith("mobile")) labels.push("Menu");
    for (const name of labels) {
      const control = page.getByRole("button", { exact: true, name });
      await expect(control).toBeVisible();
      await expect(control).toHaveCSS("background-color", rgb(palette.surface));
      await expect(control).toHaveCSS("color", rgb(palette.text));
      await expect(control.locator("svg")).toHaveCSS("color", rgb(palette.text));
    }
    await page.screenshot({ path: info.outputPath(`portfolio-controls-${mode}.png`) });
  }
  await page.getByRole("button", { exact: true, name: "Resume Chat" }).click();
  await expect(page.locator(".chat-panel")).toBeVisible();
  await page.getByRole("button", { exact: true, name: "Close chat" }).click();
  if (info.project.name.startsWith("mobile")) {
    const menu = page.getByRole("button", { exact: true, name: "Menu" });
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("dialog")).toBeVisible();
  }
});
