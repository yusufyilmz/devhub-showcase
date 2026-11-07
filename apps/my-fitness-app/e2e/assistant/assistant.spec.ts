import { expect, test } from "@playwright/test";

import { createTask, defaultDetails } from "@shared/services/types";

import { starterWorkspace } from "../../features/task-workspace/starter";

test.describe("Fitness plan assistant", () => {
  test("starts a full-page chat and reviews task and schedule proposals before saving", async ({
    page,
  }, info) => {
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
    const trigger = page.getByRole("button", { name: "Fitness assistant" });
    await trigger.click();
    const assistant = page.getByRole("region", { name: "Fitness assistant" });
    await expect(page).toHaveURL(/view=Assistant/);
    await expect(
      assistant.getByRole("heading", { name: "What are we working on today?" }),
    ).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.screenshot({ path: info.outputPath("fitness-assistant-start.png") });
    const message = assistant.getByRole("textbox", { name: "Your message" });
    await message.fill("A gentle start");
    await message.press("Enter");
    await expect(assistant.getByRole("log", { name: "Conversation" })).toContainText(
      "A gentle start",
    );
    await assistant.getByRole("button", { name: "Review Short warm-up" }).click();
    const add = page.getByRole("dialog", { name: "Add subtask" });
    await expect(add.getByLabel("Title")).toHaveValue("Short warm-up");
    expect(writes).toHaveLength(0);
    await add.getByRole("button", { name: "Save task" }).click();
    await expect(add).toBeHidden();
    expect(writes[0]?.tasks).toContainEqual(
      expect.objectContaining({ parentId: "gym", title: "Short warm-up" }),
    );

    await assistant
      .getByRole("combobox", { exact: true, name: "Assistant" })
      .selectOption("NOTIFICATIONS");
    await assistant
      .getByRole("textbox", { name: "Your message" })
      .fill("Monday and Wednesday after 9");
    await assistant.getByRole("button", { name: "Send message" }).click();
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
    await expect(assistant.getByRole("log")).toContainText("Monday and Wednesday after 9");
    await assistant.getByRole("button", { name: "New chat" }).click();
    await expect(
      assistant.getByRole("heading", { name: "What are we working on today?" }),
    ).toBeVisible();
    await expect(assistant.getByRole("log")).toBeHidden();
    await page.goBack();
    await expect(page.getByRole("heading", { exact: true, name: "Tasks" })).toBeVisible();
  });

  test("uses the workspace header to review a workout, edit it, shop and notify this device", async ({
    page,
    context,
  }) => {
    const state = starterWorkspace();
    state.tasks.push(
      createTask({ id: "gym", kind: "gym", title: "Gym plan" }),
      createTask({
        details: defaultDetails("meal"),
        id: "meal",
        kind: "meal",
        parentId: "everyday-meals",
        title: "Oatmeal",
      }),
    );
    state.ingredients.push({
      groupId: "oats",
      id: "oats",
      ingredientKey: "oats",
      isChoice: false,
      mealTaskId: "meal",
      name: "Oats",
      note: "",
      optional: false,
      position: 0,
      quantityMax: 40,
      quantityMin: 40,
      unit: "g",
    });
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
      if (input.mode === "TASK_EDIT") {
        expect(input.taskId).toBe(
          writes[0]?.tasks.find((task) => task.title === "New workout")?.id,
        );
        return route.fulfill({
          json: {
            notes: "Keep a controlled pace.",
            summary: "Rename workout",
            targetReps: null,
            title: "Morning strength",
          },
        });
      }
      expect(input.mode).toBe("WORKOUT");
      expect(input.taskId).toBe("gym");
      return route.fulfill({
        json: {
          exercises: [
            {
              notes: "Controlled movement.",
              sets: [{ notes: "", reps: 10 }],
              title: "Dumbbell row",
            },
          ],
          summary: "One exercise to review.",
          workoutTitle: "New workout",
        },
      });
    });
    await context.grantPermissions(["notifications"]);
    await page.goto("/?date=2026-11-05&view=Today");
    const open = page.getByRole("button", { name: "Fitness assistant" });
    const assistant = page.getByRole("region", { name: "Fitness assistant" });
    const mode = assistant.getByRole("combobox", { exact: true, name: "Assistant" });
    await open.click();
    await assistant.getByRole("button", { name: "Build a workout" }).click();
    await assistant.getByLabel("Source plan").selectOption("gym");
    await assistant
      .getByRole("textbox", { name: "Your message" })
      .fill("Dumbbells and a short upper-body workout");
    await assistant.getByRole("button", { name: "Send message" }).click();
    await expect(assistant.getByText("10 target reps")).toBeVisible();
    expect(writes).toHaveLength(0);
    await assistant.getByRole("button", { name: "Add proposed sets" }).click();
    await expect(assistant.getByRole("button", { name: "Add proposed sets" })).toBeHidden();
    expect(writes[0]?.tasks).toContainEqual(
      expect.objectContaining({
        details: { actualReps: null, targetReps: 10, type: "set", weightKg: null },
        kind: "set",
      }),
    );

    const workout = writes[0]?.tasks.find((task) => task.title === "New workout");
    expect(workout).toBeDefined();
    await mode.selectOption("TASK_EDIT");
    await assistant.getByLabel("Source plan").selectOption("gym");
    await assistant.getByLabel("Target task").selectOption(workout?.id ?? "");
    await assistant
      .getByRole("textbox", { name: "Your message" })
      .fill("Rename and add a pacing note");
    await assistant.getByRole("button", { name: "Send message" }).click();
    await assistant.getByRole("button", { name: "Review task edit" }).click();
    const edit = page.getByRole("dialog", { name: "Edit task" });
    await expect(edit.getByLabel("Title")).toHaveValue("Morning strength");
    expect(writes).toHaveLength(1);
    await edit.getByRole("button", { name: "Save task" }).click();
    await expect(edit).toBeHidden();
    expect(writes[1]?.tasks).toContainEqual(
      expect.objectContaining({ id: workout?.id, title: "Morning strength" }),
    );

    await mode.selectOption("SHOPPING");
    await expect(assistant.getByText("Oats", { exact: true })).toBeVisible();
    expect(writes).toHaveLength(2);
    await assistant.getByRole("button", { name: "Save weekly shopping list" }).click();
    await expect(assistant).toBeHidden();
    await expect(page.getByRole("tab", { name: "Shopping checklist" })).toBeVisible();
    expect(writes[2]?.tasks).toContainEqual(
      expect.objectContaining({ kind: "shopping_item", title: "Oats" }),
    );

    await open.click();
    await mode.selectOption("SEND");
    await assistant.getByLabel("Notification message").fill("Check your routine.");
    await assistant.getByRole("button", { name: "Send to this device" }).click();
    const granted = await page.evaluate(() => Notification.permission === "granted");
    const status = assistant.getByRole("status");
    await expect(status).toHaveText(
      granted
        ? "Notification shown on this device."
        : "Allow notifications for Fitness Studio in your device settings first.",
    );
    expect(writes).toHaveLength(3);
  });
});
