import { expect, type Page } from "@playwright/test";

export async function confirmPublication(page: Page) {
  await page.getByRole("button", { exact: true, name: "Review publication" }).click();
  const confirmation = page.getByRole("button", { exact: true, name: "Confirm publication" });
  await confirmation.click();
  // A previous published status stays visible while the new request is running.
  // Wait for this review to finish before asserting the latest public state.
  await expect(confirmation).toHaveCount(0);
  await expect(page.getByText(/^Published revision \d+\./)).toBeVisible();
}
