import { TaskService } from "@shared/lib/fitness";
import { createTask, defaultDetails, type Task, type Workspace } from "@shared/lib/types";

import { type WorkoutProposal, workoutProposalSchema } from "../models/fitness-assistant-contract";
import { workoutTarget } from "./fitness-context";

const tasks = new TaskService();

export function appendWorkoutDraft(
  state: Workspace,
  taskId: string,
  proposal: WorkoutProposal,
): Workspace {
  const selected = state.tasks.find(
    (task) => task.id === taskId && task.scope === "template" && !task.archived,
  );
  if (!selected || !workoutTarget(selected))
    throw new Error("Choose an active gym plan, workout, or exercise.");
  const { exercises, workoutTitle } = workoutProposalSchema.parse(proposal);
  if (!exercises.length || (selected.kind === "exercise" && exercises.length !== 1))
    throw new Error("The proposal needs a valid set of exercises. Generate it again.");
  if (selected.kind === "gym" && !workoutTitle)
    throw new Error("The proposal needs a workout title. Generate it again.");

  const nextPosition = (id: string) =>
    tasks.children(state.tasks, id).reduce((max, item) => Math.max(max, item.position + 1), 0);
  const additions: Task[] = [];
  const parent: Task =
    selected.kind === "gym" && workoutTitle
      ? createTask({
          details: defaultDetails("workout"),
          id: crypto.randomUUID(),
          kind: "workout",
          parentId: selected.id,
          position: nextPosition(selected.id),
          title: workoutTitle,
        })
      : selected;
  if (parent !== selected) additions.push(parent);
  const start = nextPosition(parent.id);
  const exerciseDrafts = exercises.flatMap((exercise, index) =>
    draftExercise(parent, exercise, start, index),
  );
  return { ...state, tasks: [...state.tasks, ...additions, ...exerciseDrafts] };
}

function draftExercise(
  parent: Task,
  exercise: WorkoutProposal["exercises"][number],
  start: number,
  index: number,
) {
  const existing = parent.kind === "exercise";
  const target = existing
    ? parent
    : createTask({
        details: defaultDetails("exercise"),
        id: crypto.randomUUID(),
        kind: "exercise",
        notes: exercise.notes,
        parentId: parent.id,
        position: start + index,
        title: exercise.title,
      });
  const first = existing ? start : 0;
  const sets = exercise.sets.map((set, setIndex) =>
    createTask({
      details: { actualReps: null, targetReps: set.reps, type: "set", weightKg: null },
      id: crypto.randomUUID(),
      kind: "set",
      notes: set.notes,
      parentId: target.id,
      position: first + setIndex,
      title: `Set ${first + setIndex + 1}`,
    }),
  );
  return existing ? sets : [target, ...sets];
}
