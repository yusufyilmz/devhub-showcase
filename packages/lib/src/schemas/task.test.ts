import { describe, expect, it } from "vitest";

import { seedWorkspace } from "../db/seed";
import { TaskService } from "../services/task/index";
import { createTask } from "../types/task";
import { taskSchema } from "./task";
import { validateWorkspace, workspaceSchema } from "./workspace";

const exerciseDetails = {
  legacySets: [
    {
      actualReps: 10,
      archived: false,
      id: "fixture-set",
      notes: "Fictional saved note",
      status: "done" as const,
      targetReps: 12,
      title: "Set 1",
      weightKg: 20,
    },
  ],
  prescription: "Fictional exercise prescription",
  type: "exercise" as const,
};
describe("standalone Fitness OS stored task compatibility", () => {
  it("retains exercise prescriptions, archived flags and logged set history when parsing and editing", () => {
    const state = seedWorkspace();
    const exercise = state.tasks.find((task) => task.kind === "exercise")!;
    exercise.details = exerciseDetails;
    const workout = state.tasks.find((task) => task.kind === "workout")!;
    workout.details = { postponed: true, type: "workout" };
    const parsed = workspaceSchema.parse(state);
    expect(() => validateWorkspace(parsed)).not.toThrow();
    expect(parsed.tasks.find((task) => task.id === exercise.id)?.details).toEqual(exerciseDetails);
    const saved = new TaskService().save(parsed, { ...exercise, title: "Updated fictional title" });
    expect(saved.tasks.find((task) => task.id === exercise.id)?.details).toEqual(exerciseDetails);
    expect(saved.tasks.find((task) => task.id === workout.id)?.details).toEqual({
      postponed: true,
      type: "workout",
    });
  });
  it("continues to accept earlier basic exercise/workout documents and rejects incorrect detail types", () => {
    const state = seedWorkspace();
    expect(() => validateWorkspace(workspaceSchema.parse(state))).not.toThrow();
    const meal = state.tasks.find((task) => task.kind === "meal")!;
    meal.details = exerciseDetails;
    expect(() => validateWorkspace(state)).toThrow("Invalid details");
  });
  it("validates stored set logs rather than silently dropping invalid or unknown data", () => {
    const task = createTask({
      details: exerciseDetails,
      id: "exercise",
      kind: "exercise",
      title: "Fictional exercise",
    });
    expect(taskSchema.parse(task).details).toEqual(exerciseDetails);
    expect(() =>
      taskSchema.parse({
        ...task,
        details: {
          ...exerciseDetails,
          legacySets: [{ ...exerciseDetails.legacySets[0], actualReps: -1 }],
        },
      }),
    ).toThrow();
    expect(() => taskSchema.parse({ ...task, details: { type: "unrecognized" } })).toThrow();
  });
});
