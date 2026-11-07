import { expect, type Locator, type Page, test } from "@playwright/test";

import { createTask, defaultDetails } from "../../../../packages/services/src/types/task";
import { starterWorkspace } from "../../features/task-workspace/starter";

async function swipePlanRight(page: Page, summary: Locator) {
  await summary.scrollIntoViewIfNeeded();
  const box = await summary.boundingBox();
  if (!box) throw new Error("The selected plan summary is outside the viewport.");

  const session = await page.context().newCDPSession(page);
  const point = (fraction: number) => ({
    x: box.x + box.width * fraction,
    y: box.y + box.height / 2,
  });
  try {
    await session.send("Input.dispatchTouchEvent", {
      touchPoints: [point(0.2)],
      type: "touchStart",
    });
    for (const fraction of [0.35, 0.5, 0.65, 0.8]) {
      await session.send("Input.dispatchTouchEvent", {
        touchPoints: [point(fraction)],
        type: "touchMove",
      });
    }
    await session.send("Input.dispatchTouchEvent", { touchPoints: [], type: "touchEnd" });
  } finally {
    await session.detach();
  }
}

test.describe("Fitness plan workspace", () => {
  test("switches plans and opens one task level at a time", async ({ page }, testInfo) => {
    const state = starterWorkspace();
    state.tasks.push(
      createTask({ id: "movement", kind: "gym", title: "Movement plan" }),
      createTask({ id: "walk", kind: "workout", parentId: "movement", title: "Afternoon workout" }),
      createTask({
        id: "mobility",
        kind: "workout",
        parentId: "movement",
        position: 1,
        title: "Mobility session",
      }),
      createTask({
        id: "recovery",
        kind: "workout",
        parentId: "movement",
        position: 2,
        title: "Active recovery",
      }),
      createTask({ id: "pair", kind: "superset", parentId: "walk", title: "Strength pair" }),
      createTask({ id: "lift", kind: "exercise", parentId: "pair", title: "Kettlebell row" }),
      createTask({
        details: defaultDetails("set"),
        id: "set",
        kind: "set",
        parentId: "lift",
        title: "First set",
      }),
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
    await page.goto("/?date=2026-11-05&view=Tasks");

    const planCard = page.getByRole("region", { exact: true, name: "Your plans" });
    const carousel = planCard.getByRole("region", { exact: true, name: "Plans" });
    const choosePlan = carousel.getByLabel("Choose plan");
    const actions = planCard.getByRole("group", { name: "Plan actions" });
    const pager = planCard.getByRole("navigation", { name: "Plan pages" });
    const previous = pager.getByRole("button", { name: "Previous plan" });
    const next = pager.getByRole("button", { name: "Next plan" });
    const movement = carousel.getByRole("heading", { exact: true, name: "Movement plan" });
    await expect(planCard).toHaveAttribute("data-backdrop", "accent");
    await expect(actions.getByRole("button", { name: "New task" })).toBeEnabled();
    await expect(planCard.getByRole("heading", { name: "Plan tasks" })).toBeVisible();
    await expect(choosePlan).toHaveValue("everyday-meals");
    await expect(previous).toBeDisabled();
    if (testInfo.project.use.hasTouch) await next.tap();
    else await carousel.press("ArrowRight");
    await expect(choosePlan).toHaveValue("movement");
    await expect(next).toBeDisabled();
    await expect(movement).toBeInViewport({ ratio: 0.9 });
    await expect(
      carousel.locator('[data-slot="carousel-content"]').getByRole("heading"),
    ).toHaveCount(1);
    await expect(pager.getByRole("status")).toHaveText("Plan 2 of 2");
    await expect(actions.getByRole("button", { name: "Edit Movement plan" })).toBeEnabled();

    if (testInfo.project.use.hasTouch) {
      await swipePlanRight(
        page,
        carousel.locator('[data-slot="carousel-item"][aria-hidden="false"]'),
      );
      await expect(choosePlan).toHaveValue("everyday-meals");
      await next.tap();
      await expect(choosePlan).toHaveValue("movement");
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await previous.click();
    await expect(choosePlan).toHaveValue("everyday-meals");
    await choosePlan.selectOption("movement");
    await expect(movement).toBeInViewport({ ratio: 0.9 });
    await planCard.screenshot({ path: testInfo.outputPath("fitness-plan-overview.png") });

    const openWorkout = planCard.getByRole("button", { name: "Open Afternoon workout" });
    await openWorkout.click();
    await expect(page.getByRole("heading", { name: "Afternoon workout" })).toBeFocused();
    await expect(actions.getByRole("button", { name: "Edit Afternoon workout" })).toBeEnabled();
    await expect(openWorkout).toHaveCount(0);

    await previous.click();
    await next.click();
    await expect(openWorkout).toBeVisible();
    await openWorkout.click();
    await page.getByRole("button", { name: "Open Strength pair" }).click();
    await page.getByRole("button", { name: "Open Kettlebell row" }).click();
    await expect(page.getByRole("list", { name: "Subtasks of Kettlebell row" })).toBeVisible();
    await planCard.screenshot({ path: testInfo.outputPath("fitness-plan-drilldown.png") });
    await page.getByRole("button", { name: "Open First set" }).click();
    await expect(page.getByText(/Target: \d+ reps/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Add subtask" })).toHaveCount(0);

    const breadcrumb = page.getByRole("navigation", { name: "Task hierarchy" });
    await breadcrumb.getByRole("button", { name: "Afternoon workout" }).click();
    await expect(page.getByRole("button", { name: "Open Strength pair" })).toBeVisible();
    await breadcrumb.getByRole("button", { name: "Movement plan" }).click();
    await expect(page.getByRole("heading", { name: "Plan tasks" })).toBeFocused();

    await openWorkout.click();
    await page.getByRole("button", { name: "Add subtask" }).click();
    const addEditor = page.getByRole("dialog", { name: "Add subtask" });
    await addEditor.getByLabel("Title").fill("Cool-down stretch");
    await addEditor.getByRole("button", { name: "Save task" }).click();
    await expect(page.getByRole("button", { name: "Open Cool-down stretch" })).toBeVisible();
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(page.getByRole("button", { name: "Open Cool-down stretch" })).toHaveCount(0);
    await breadcrumb.getByRole("button", { name: "Movement plan" }).click();

    const edit = page.getByRole("button", { name: "Edit Movement plan" });
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
    expect(writes).toBe(2);

    await edit.click();
    await editor.getByLabel("Title").fill("Revised movement plan");
    await editor.getByRole("button", { name: "Save task" }).click();
    await expect(editor).toBeHidden();
    await expect(page.getByRole("heading", { name: "Revised movement plan" })).toBeVisible();
    const saved = page.getByRole("status").filter({ hasText: "Task saved" });
    await saved.getByRole("button", { name: "Undo" }).click();
    await expect(page.getByRole("heading", { exact: true, name: "Movement plan" })).toBeVisible();
    expect(writes).toBe(4);

    await page.getByRole("button", { name: "Appearance controls" }).click();
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(openWorkout).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
    await planCard.screenshot({ path: testInfo.outputPath("fitness-plan-dark.png") });
  });

  test("keeps the demo plan and disabled editing controls in the card", async ({ page }) => {
    await page.goto("/preview?view=Tasks");
    const planCard = page.getByRole("region", { exact: true, name: "Your plans" });
    const actions = planCard.getByRole("group", { name: "Plan actions" });
    await expect(planCard).toHaveAttribute("data-backdrop", "accent");
    await expect(planCard).toHaveCSS("background-image", /radial-gradient/);
    await expect(planCard.getByRole("heading", { name: "Everyday meals" })).toBeVisible();
    await expect(planCard.getByText("No subtasks yet.")).toBeVisible();
    await expect(actions.getByRole("button", { name: "New task" })).toBeDisabled();
    await expect(actions.getByRole("button", { name: "Edit Everyday meals" })).toBeDisabled();
    await expect(actions.getByRole("button", { name: "Add subtask" })).toBeDisabled();
    await expect(planCard.getByRole("navigation", { name: "Plan pages" })).toHaveCount(0);
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
