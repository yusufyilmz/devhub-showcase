import { expect, test } from "@playwright/test";

import { starterWorkspace } from "../apps/my-fitness-app/features/task-workspace/starter";
import { createTask } from "../packages/services/src/types/task";

test.describe("Fitness plan assistant", () => {
  test("reviews task and schedule proposals before saving", async ({ page }) => {
    const state = starterWorkspace();
    state.tasks.push(
      createTask({ id: "gym", kind: "gym", title: "Movement plan" }),
      createTask({ id: "walk", kind: "workout", parentId: "gym", title: "Walk" }),
    );
    const writes: (typeof state)[] = [];
    await page.route("**/api/state", (route) => {
      if (route.request().method() === "PUT") {
        writes.push(route.request().postDataJSON().state);
        return route.fulfill({ json: { revision: writes.length } });
      }
      return route.fulfill({
        json: { canEdit: true, revision: 0, state, workspaceId: "fixture-user" },
      });
    });
    await page.route("**/api/assistant", (route) => {
      const input = route.request().postDataJSON();
      expect(input.planId).toBe("gym");
      if (input.mode === "NOTIFICATIONS") {
        expect(input.taskId).toBe("walk");
        return route.fulfill({
          json: {
            preview: "Time for your routine.",
            summary: "Morning reminder",
            time: "09:15",
            weekdays: [1, 3],
          },
        });
      }
      return route.fulfill({
        json: {
          suggestions: [{ notes: "Start gently.", title: "Short warm-up" }],
          summary: "A small addition.",
        },
      });
    });
    await page.goto("/?view=Tasks");
    await page.getByLabel("Choose plan").selectOption("gym");
    const trigger = page.getByRole("button", { name: "Plan assistant" });
    await trigger.click();
    const assistant = page.getByRole("dialog", { name: "Plan assistant" });
    await assistant.getByLabel("Goal and constraints").fill("A gentle start");
    await assistant.getByRole("button", { name: "Generate proposal" }).click();
    await assistant.getByRole("button", { name: "Review Short warm-up" }).click();
    const add = page.getByRole("dialog", { name: "Add subtask" });
    await expect(add.getByLabel("Title")).toHaveValue("Short warm-up");
    expect(writes).toHaveLength(0);
    await add.getByRole("button", { name: "Save task" }).click();
    await expect(add).toBeHidden();
    expect(writes[0]?.tasks).toContainEqual(
      expect.objectContaining({ parentId: "gym", title: "Short warm-up" }),
    );

    await trigger.click();
    await assistant
      .getByRole("combobox", { exact: true, name: "Assistant" })
      .selectOption("NOTIFICATIONS");
    await assistant
      .getByLabel("Timing preferences and quiet hours")
      .fill("Monday and Wednesday after 9");
    await assistant.getByRole("button", { name: "Generate proposal" }).click();
    await expect(assistant.getByText("09:15 (UTC)")).toBeVisible();
    await assistant.getByRole("button", { name: "Review schedule" }).click();
    const edit = page.getByRole("dialog", { name: "Edit task" });
    await expect(edit.getByLabel("Time", { exact: true })).toHaveValue("09:15");
    expect(writes).toHaveLength(1);
    await edit.getByRole("button", { name: "Save task" }).click();
    await expect(edit).toBeHidden();
    expect(writes[1]?.schedules).toContainEqual(
      expect.objectContaining({ taskId: "walk", time: "09:15", weekdays: [1, 3] }),
    );
  });
});
