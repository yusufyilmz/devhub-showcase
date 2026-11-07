import type { Page } from "@playwright/test";

export async function selectEditorSection(page: Page, section: string) {
  const picker = page.getByRole("combobox", { name: "Editor section" });
  if (await picker.isVisible()) await picker.selectOption(section);
  else
    await page
      .getByRole("navigation", { exact: true, name: "Editor sections" })
      .getByRole("button", { exact: true, name: section })
      .click();
}

export async function showEditorPreview(page: Page) {
  const close = page.getByRole("button", { exact: true, name: "Close editor" });
  if (await close.isVisible()) await close.click();
}

export async function openEditor(page: Page) {
  const edit = page.getByRole("button", { exact: true, name: "Edit" });
  if (await edit.isVisible()) await edit.click();
}

export async function openDraftTools(page: Page) {
  const tools = page.locator(".editor-draft-tools");
  if (!(await tools.evaluate((node) => (node as HTMLDetailsElement).open))) {
    await tools.locator("summary").first().click();
  }
}
