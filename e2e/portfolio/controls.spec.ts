import { expect, test } from "@playwright/test";

import { getThemePalette } from "@shared/config";

const rgb = (value: string) => `rgb(${value.replaceAll(" ", ", ")})`;

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
