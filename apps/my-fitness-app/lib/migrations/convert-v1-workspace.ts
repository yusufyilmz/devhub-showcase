import { createTask } from "@/lib/domain/task";
import type { Workspace } from "@/lib/domain/workspace";
import { ScheduleService } from "@/lib/services/schedule-service";

import { trainerIngredients } from "./trainer-ingredients";
import type { State as LegacyState, Workout as LegacyWorkout } from "./v1-model";
import { seed as legacySeed } from "./v1-seed";

function templates(old: LegacyState): Workspace {
  const workspace: Workspace = {
    choices: [],
    ingredients: [],
    overrides: [],
    schedules: [],
    settings: {
      leadMinutes: old.settings.leadMinutes,
      name: old.settings.name,
      proteinTarget: old.settings.proteinTarget,
      reminders: old.settings.reminders,
      rotation: old.settings.rotation,
      rotationStart: old.settings.startDate,
      timezone: old.settings.timezone,
      waterTarget: old.settings.waterTarget,
    },
    tasks: [],
    version: 2,
    weights: old.weights,
  };
  const add = (input: Parameters<typeof createTask>[0]) => workspace.tasks.push(createTask(input));
  add({ id: "nutrition", kind: "category", title: "Diet plans" });
  add({ id: "gym", kind: "gym", title: "Gym" });
  add({ id: "supplements", kind: "category", title: "Supplements" });
  add({ id: "hydration", kind: "category", title: "Hydration" });
  old.plans.forEach((p, i) => {
    add({
      id: p.id,
      kind: "diet",
      notes:
        p.id === "y2"
          ? "Trainer’s lower-calorie day. No cheat meal. Protein is below your normal target."
          : "",
      parentId: "nutrition",
      position: i,
      title: p.name,
    });
  });
  old.tasks.forEach((task, index) => addLegacyTask(workspace, old, task, index, add));
  for (const [index, w] of old.workouts.entries()) {
    add({
      id: w.id,
      kind: "workout",
      parentId: "gym",
      position: index,
      title: w.name,
    });
    if (w.days.length)
      workspace.schedules.push({
        id: `schedule:${w.id}`,
        taskId: w.id,
        time: old.settings.gymTime,
        weekdays: w.days,
      });
    const groupIds = new Map<string, string>();
    w.exercises.forEach((exercise, index) => addExercise(add, w.id, exercise, index, groupIds));
  }
  const original = legacySeed();
  workspace.ingredients = trainerIngredients().filter((i) =>
    old.tasks.some(
      (t) =>
        t.id === i.mealTaskId && t.detail === original.tasks.find((o) => o.id === t.id)?.detail,
    ),
  );
  return workspace;
}
export function convertV1Workspace(old: LegacyState): Workspace {
  const next = templates(old);
  const scheduling = new ScheduleService();
  for (const [date, day] of Object.entries(old.days))
    applySavedDay(next, old, date, day, scheduling);
  return next;
}

function addLegacyTask(
  workspace: Workspace,
  old: LegacyState,
  task: LegacyState["tasks"][number],
  index: number,
  add: (input: Parameters<typeof createTask>[0]) => void,
) {
  if (task.kind === "workout") return;
  add({
    details: legacyDetails(task),
    id: task.id,
    kind: task.kind,
    notes: task.detail,
    parentId: legacyParentId(task, old),
    position: index,
    time: task.time,
    title: task.title,
  });
  if (task.kind === "meal") return;
  workspace.schedules.push({
    id: `schedule:${task.id}`,
    taskId: task.id,
    time: task.time,
    weekdays: [0, 1, 2, 3, 4, 5, 6],
  });
}

function legacyParentId(task: LegacyState["tasks"][number], old: LegacyState) {
  if (task.kind === "meal") {
    const plan = old.plans[0];
    if (!plan) throw new Error("A diet plan is required.");
    return task.planId || plan.id;
  }
  if (task.kind === "water") return "hydration";
  return "supplements";
}

function legacyDetails(task: LegacyState["tasks"][number]) {
  if (task.kind === "meal") return { type: "meal" as const, waterMl: task.amount };
  if (task.kind === "water") return { ml: task.amount, type: "water" as const };
  return {
    amount: Number(task.detail.match(/^\d+(?:\.\d+)?/)?.[0] ?? 0),
    type: "dose" as const,
    unit: "g",
  };
}

function addExercise(
  add: (input: Parameters<typeof createTask>[0]) => void,
  workoutId: string,
  exercise: LegacyWorkout["exercises"][number],
  index: number,
  groupIds: Map<string, string>,
) {
  const parentId = exerciseParent(add, workoutId, exercise, index, groupIds);
  const exerciseId = `${workoutId}:${exercise.id}`;
  add({
    id: exerciseId,
    kind: "exercise",
    notes:
      exercise.notes ||
      "Normal rest between sets. Increase weight as reps decrease where appropriate.",
    parentId,
    position: index,
    title: exercise.name,
  });
  exercise.reps.forEach((reps, setIndex) => addSet(add, exerciseId, exercise.id, reps, setIndex));
}

function exerciseParent(
  add: (input: Parameters<typeof createTask>[0]) => void,
  workoutId: string,
  exercise: LegacyWorkout["exercises"][number],
  index: number,
  groupIds: Map<string, string>,
) {
  if (!exercise.group) return workoutId;
  const existing = groupIds.get(exercise.group);
  if (existing) return existing;
  const groupId = `${workoutId}:group:${exercise.group.toLowerCase().replaceAll(" ", "-")}`;
  groupIds.set(exercise.group, groupId);
  add({
    id: groupId,
    kind: "superset",
    notes: "Perform the paired exercises consecutively, then rest.",
    parentId: workoutId,
    position: index,
    title: exercise.group,
  });
  return groupId;
}

function addSet(
  add: (input: Parameters<typeof createTask>[0]) => void,
  exerciseId: string,
  exerciseKey: string,
  reps: number,
  index: number,
) {
  add({
    details: {
      actualReps: null,
      targetReps: reps,
      type: "set",
      weightKg: null,
    },
    id: `${exerciseId}:set:${index}`,
    kind: "set",
    notes:
      exerciseKey === "hip-abduction-machine" && index >= 5
        ? "Final drop sequence: reduce weight, no rest."
        : "",
    parentId: exerciseId,
    position: index,
    title: `Set ${index + 1}`,
  });
}

function applySavedDay(
  next: Workspace,
  old: LegacyState,
  date: string,
  day: LegacyState["days"][string],
  scheduling: ScheduleService,
) {
  const historical = templates(historicalState(old, day));
  historical.overrides.push({
    date,
    dietTaskId: day.planId,
    workoutTaskId: day.workoutId || null,
  });
  const snapshot = scheduling.ensureDay(historical, date);
  for (const task of snapshot.tasks.filter((item) => item.scope === "scheduled")) {
    applySavedStatus(task, day, old);
    next.tasks.push(task);
  }
  next.ingredients.push(
    ...snapshot.ingredients.filter((ingredient) =>
      snapshot.tasks.some(
        (task) => task.id === ingredient.mealTaskId && task.scope === "scheduled",
      ),
    ),
  );
  if (day.water <= 0) return;
  next.tasks.push(
    createTask({
      date,
      details: { ml: day.water, type: "water" },
      id: `day:${date}:extra-water`,
      kind: "water",
      parentId: `day:${date}`,
      scope: "scheduled",
      status: "done",
      title: "Additional water",
    }),
  );
}

function historicalState(old: LegacyState, day: LegacyState["days"][string]): LegacyState {
  return {
    ...old,
    days: {},
    plans: old.plans.some((plan) => plan.id === day.planId)
      ? old.plans
      : [...old.plans, { id: day.planId, name: "Saved diet plan" }],
    tasks: day.tasks.filter((task) => task.kind !== "workout"),
    workouts: day.workout
      ? [day.workout]
      : old.workouts.filter((workout) => workout.id === day.workoutId),
  };
}

function applySavedStatus(
  task: Workspace["tasks"][number],
  day: LegacyState["days"][string],
  old: LegacyState,
) {
  if (task.sourceTaskId && day.status[task.sourceTaskId]) {
    task.status = day.status[task.sourceTaskId] === "done" ? "done" : "skipped";
  }
  if (task.details.type === "set") applySetLog(task, day, old);
}

function applySetLog(
  task: Workspace["tasks"][number],
  day: LegacyState["days"][string],
  old: LegacyState,
) {
  if (task.details.type !== "set") return;
  const workout = day.workout ?? old.workouts.find((item) => item.id === day.workoutId);
  for (const exercise of workout?.exercises ?? []) {
    const prefix = `${workout?.id}:${exercise.id}:set:`;
    if (!task.sourceTaskId?.startsWith(prefix)) continue;
    const log = day.sets[`${exercise.id}:${Number(task.sourceTaskId.slice(prefix.length))}`];
    if (!log) continue;
    task.details.actualReps = log.reps;
    task.details.weightKg = log.weight;
    task.status = log.done ? "done" : "pending";
  }
}
