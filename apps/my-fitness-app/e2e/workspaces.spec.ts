import { expect, test } from "@playwright/test";

test.describe("Fitness workspace entry points", () => {
  test("signed-out visitors reach sign-in and the API returns no workspace", async ({
    page,
    request,
  }) => {
    const response = await request.get("/api/state?userId=someone-else");
    expect(response.status()).toBe(401);
    expect(await response.json()).not.toHaveProperty("state");
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("link", { name: /Explore the demo/ })).toBeVisible();
  });

  test("renders the fictional demo with shared controls on desktop and mobile", async ({
    page,
  }, testInfo) => {
    const accountRequests: string[] = [];
    page.on("request", (request) => {
      const path = new URL(request.url()).pathname;
      if (path === "/api/state" || path === "/api/notifications") accountRequests.push(path);
    });
    await page.goto("/preview");
    await expect(page.getByText("Afternoon walk")).toBeVisible();
    const progress = page.getByRole("progressbar", { name: "Daily tasks completed" });
    await expect(progress).toBeVisible();
    await expect(progress).toHaveAttribute("aria-valuenow", "50");
    await expect(page.getByRole("button", { name: "250 ml water" })).toBeDisabled();
    await page.screenshot({ path: testInfo.outputPath("fitness-demo-light.png") });
    await page.getByRole("button", { name: "Appearance controls" }).click();
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.screenshot({ path: testInfo.outputPath("fitness-demo-dark.png") });
    await page.getByRole("button", { exact: true, name: "More" }).click();
    await expect(page.getByRole("heading", { name: "Your routine" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Save preferences" })).toBeDisabled();
    expect(accountRequests).toEqual([]);
  });
});
