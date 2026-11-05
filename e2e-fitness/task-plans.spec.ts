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
    await page.route("**/api/state", (route) =>
      route.fulfill({ json: { canEdit: true, revision: 0, state, workspaceId: "fixture-user" } }),
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
    await expect(page.getByRole("heading", { name: "Edit task" })).toBeVisible();
  });
});
