import { expect, type Page } from "@playwright/test";

export async function confirmPublication(page: Page) {
  await page.getByRole("button", { exact: true, name: "Review publication" }).click();
  await page.getByRole("button", { exact: true, name: "Confirm publication" }).click();
  await expect(page.getByText(/^Published revision \d+\./)).toBeVisible();
}
