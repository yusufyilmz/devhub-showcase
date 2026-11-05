import { expect, test } from "@playwright/test";

import { starterWorkspace } from "../apps/my-fitness-app/features/task-workspace/starter";
import { createTask } from "../packages/services/src/types/task";

test.describe("Fitness plan cards", () => {
  test("filters plans and opens the existing task editor from a reveal card", async ({
    page,
  }, testInfo) => {
    const state = starterWorkspace();
    state.tasks.push(
      createTask({ id: "movement", kind: "gym", title: "Movement plan" }),
      createTask({ id: "walk", kind: "workout", parentId: "movement", title: "Afternoon walk" }),
    );
    let writes = 0;
    await page.route("**/api/state", (route) =>
      route.fulfill({
        json:
          route.request().method() === "PUT"
            ? { revision: ++writes }
            : { canEdit: true, revision: 0, state, workspaceId: "fixture-user" },
      }),
    );
    await page.goto("/?view=Tasks");

    const filter = page.getByLabel("Filter plans");
    await filter.selectOption("movement");
    await expect(page.getByRole("heading", { name: "Everyday meals" })).toHaveCount(0);
    const plan = page.locator(".fitness-plan").filter({
      has: page.getByRole("heading", { name: "Movement plan" }),
    });
    const toggle = plan.getByRole("button", { name: /details for Movement plan/ });
    const edit = plan.getByRole("button", { includeHidden: true, name: "Edit Movement plan" });
    await expect(edit).toBeHidden();

    if (testInfo.project.use.hasTouch) {
      await toggle.tap();
    } else {
      await plan.hover();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await filter.hover();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await toggle.focus();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await toggle.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await filter.focus();
      await toggle.focus();
    }
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(plan.getByText("Afternoon walk")).toBeVisible();
    const details = plan.locator(".reveal-details");
    await expect(details).toHaveCSS("transition-duration", "0.65s, 0.65s, 0.43s, 0.65s");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(details).toHaveCSS("transition-duration", "0s");
    await page.screenshot({ path: testInfo.outputPath("fitness-plans-expanded.png") });
    await edit.click();
    const editor = page.getByRole("dialog", { name: "Edit task" });
    await expect(editor.getByLabel("Title")).toBeFocused();
    await page.screenshot({ path: testInfo.outputPath("fitness-task-editor.png") });
    await editor.getByRole("button", { exact: true, name: "Archive" }).click();
    const confirm = page.getByRole("alertdialog", { name: "Archive this task?" });
    await expect(confirm).toBeVisible();
    await confirm.getByRole("button", { name: "Cancel" }).click();
    await expect(editor).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(editor).toBeHidden();
    await expect(edit).toBeFocused();
    expect(writes).toBe(0);

    await edit.click();
    await editor.getByLabel("Title").fill("Revised movement plan");
    await editor.getByRole("button", { name: "Save task" }).click();
    await expect(editor).toBeHidden();
    await expect(page.getByRole("heading", { name: "Revised movement plan" })).toBeVisible();
    const saved = page.getByRole("status").filter({ hasText: "Task saved" });
    await saved.getByRole("button", { name: "Undo" }).click();
    await expect(page.getByRole("heading", { exact: true, name: "Movement plan" })).toBeVisible();
    expect(writes).toBe(2);
  });

  test("switches between the shared weekly tabs without enabling demo writes", async ({
    page,
  }, testInfo) => {
    await page.goto("/preview?view=Week");
    const list = page.getByRole("tablist", { name: "Weekly plan" });
    const shopping = list.getByRole("tab", { name: "Shopping checklist" });
    const cooking = list.getByRole("tab", { name: "Meals to prepare" });
    const ingredients = list.getByRole("tab", { name: "Choose ingredients" });
    await expect(shopping).toHaveAttribute("aria-selected", "true");
    if (testInfo.project.use.hasTouch) await ingredients.tap();
    else {
      await shopping.focus();
      await shopping.press("ArrowRight");
      await expect(cooking).toHaveAttribute("aria-selected", "true");
      await cooking.press("ArrowRight");
    }
    await expect(ingredients).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("heading", { name: "No meals this week" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Save weekly tasks" })).toBeDisabled();
    await page.screenshot({ path: testInfo.outputPath("fitness-week-tabs.png") });
  });
});
