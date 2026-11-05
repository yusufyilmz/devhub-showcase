import { describe, expect, it } from "vitest";

import { createTask, defaultDetails, validateWorkspace } from "@shared/services/types";

import { starterWorkspace } from "@/features/task-workspace/starter";

import { appendWorkoutDraft } from "./workout-draft";

describe("workout assistant draft", () => {
  const proposal = {
    exercises: [{ notes: "Controlled pace", sets: [{ notes: "", reps: 10 }], title: "Row" }],
    summary: "Reviewed plan",
    workoutTitle: "Upper body",
  };

  it("creates a workout, exercise and target sets without mutating the source", () => {
    const source = starterWorkspace();
    source.tasks.push(createTask({ id: "gym", kind: "gym", title: "Gym" }));
    const result = appendWorkoutDraft(source, "gym", proposal);
    validateWorkspace(result);
    expect(source.tasks).toHaveLength(2);
    const workout = result.tasks.find((task) => task.title === "Upper body");
    const exercise = result.tasks.find((task) => task.title === "Row");
    const set = result.tasks.find((task) => task.kind === "set");
    expect(workout).toMatchObject({ kind: "workout", parentId: "gym" });
    expect(exercise?.parentId).toBe(workout?.id);
    expect(set).toMatchObject({
      details: { actualReps: null, targetReps: 10, weightKg: null },
      parentId: exercise?.id,
      status: "pending",
    });
  });

  it("appends targets to an existing exercise after its current sets", () => {
    const source = starterWorkspace();
    source.tasks.push(
      createTask({ id: "row", kind: "exercise", title: "Row" }),
      createTask({
        details: defaultDetails("set"),
        id: "set",
        kind: "set",
        parentId: "row",
        position: 3,
        title: "Set 4",
      }),
    );
    const result = appendWorkoutDraft(source, "row", { ...proposal, workoutTitle: null });
    expect(result.tasks.at(-1)).toMatchObject({ parentId: "row", position: 4, title: "Set 5" });
  });

  it("rejects archived targets and invalid model repetitions", () => {
    const source = starterWorkspace();
    source.tasks.push(createTask({ archived: true, id: "gym", kind: "gym", title: "Gym" }));
    expect(() => appendWorkoutDraft(source, "gym", proposal)).toThrow("Choose an active");
    expect(() => appendWorkoutDraft(source, "everyday-meals", proposal)).toThrow(
      "Choose an active",
    );
    source.tasks.push(createTask({ id: "active-gym", kind: "gym", title: "Gym" }));
    expect(() =>
      appendWorkoutDraft(source, "active-gym", {
        ...proposal,
        exercises: [{ notes: "", sets: [{ notes: "", reps: 0 }], title: "Row" }],
      }),
    ).toThrow();
  });
});
