import { expect, test } from "@playwright/test";

import { authorableSectionTypes } from "@shared/config";

test("homepage showcases working section previews, templates and CV import", async ({
  page,
}, info) => {
  await page.goto("/");
  const examples = page.getByRole("group", { name: "Section examples" });
  await examples.getByRole("button", { exact: true, name: "Timeline" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Show the journey" })).toBeVisible();
  await examples.getByRole("button", { exact: true, name: "FAQ" }).click();
  await page.getByText("How do we start working together?", { exact: true }).click();
  await expect(
    page.getByText("Start with a conversation about your goals and ideas.", { exact: true }),
  ).toBeVisible();
  await expect(examples.getByRole("button")).toHaveCount(4);
  const total = authorableSectionTypes.length + 9;
  await page.getByRole("button", { name: `Show all ${total} examples` }).click();
  await expect(examples.getByRole("button")).toHaveCount(total);
  await page.getByRole("searchbox", { name: "Filter live section examples" }).fill("Languages");
  await examples.getByRole("button", { exact: true, name: "Languages" }).click();
  await expect(page.getByRole("region", { name: "Languages section example" })).toContainText(
    "Spanish",
  );
  await page.getByRole("button", { name: "Show featured examples" }).click();
  await expect(examples.getByRole("button")).toHaveCount(4);
  await page.getByRole("searchbox", { name: "Find a section" }).fill("YouTube");
  await expect(page.locator(".home-library-catalog")).toContainText("YouTube");
  await expect(
    page.getByRole("heading", { name: "A starting point you can reuse." }),
  ).toBeVisible();
  await page.locator("#section-library").screenshot({ path: info.outputPath("home-library.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await page.getByRole("link", { name: "Start with your CV" }).click();
  await expect(page).toHaveURL("/login");
});
