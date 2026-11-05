import { z } from "zod";

import { choiceSchema, ingredientSchema } from "./nutrition";
import { dateSchema, taskDetailTypes, taskSchema, timeSchema } from "./task";
export const settingsSchema = z.object({
  leadMinutes: z.number().int().min(0).max(120),
  name: z.string().min(1).max(100),
  proteinTarget: z.number().min(1).max(500),
  reminders: z.boolean(),
  rotation: z.array(z.string()).min(1).max(100),
  rotationStart: dateSchema,
  timezone: z.string().refine((v) => {
    try {
      new Intl.DateTimeFormat("en", { timeZone: v });
      return true;
    } catch {
      return false;
    }
  }),
  waterTarget: z.number().min(250).max(20000),
});
export const scheduleSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  time: timeSchema,
  weekdays: z.array(z.number().int().min(0).max(6)).min(1).max(7),
});
export const overrideSchema = z.object({
  date: dateSchema,
  dietTaskId: z.string(),
  workoutTaskId: z.string().nullable(),
});
export const workspaceSchema = z.object({
  choices: z.array(choiceSchema).max(10000),
  ingredients: z.array(ingredientSchema).max(50000),
  overrides: z.array(overrideSchema).max(10000),
  schedules: z.array(scheduleSchema).max(500),
  settings: settingsSchema,
  tasks: z.array(taskSchema).max(50000),
  version: z.literal(2),
  weights: z.array(z.object({ date: dateSchema, value: z.number().min(20).max(400) })).max(10000),
});
export type Workspace = z.infer<typeof workspaceSchema>;
export type TaskSchedule = z.infer<typeof scheduleSchema>;
type TaskMap = Map<string, Workspace["tasks"][number]>;

const porkPattern = /\b(pork|cerdo|jam[oó]n|ham|bacon)\b/i;

export function validateWorkspace(workspace: Workspace): void {
  const map = new Map(workspace.tasks.map((task) => [task.id, task]));
  assertUniqueTaskIds(workspace, map);
  assertTasks(workspace, map);
  assertIngredients(workspace, map);
  assertPlans(workspace, map);
}

function assertUniqueTaskIds(workspace: Workspace, map: TaskMap) {
  if (map.size !== workspace.tasks.length) throw new Error("Task IDs must be unique.");
}

function assertTasks(workspace: Workspace, map: TaskMap) {
  for (const task of workspace.tasks) {
    assertParent(task, map);
    assertSource(task, map);
    assertNoCycle(task, map);
    assertTaskShape(task);
  }
}

function assertParent(task: Workspace["tasks"][number], map: TaskMap) {
  if (!task.parentId) return;
  const parent = map.get(task.parentId);
  if (!parent) throw new Error("Task parent is missing.");
  const sameScope = parent.scope === task.scope;
  const sameDay = parent.date === task.date || task.scope !== "scheduled";
  if (!sameScope || !sameDay)
    throw new Error("Parent and child must belong to the same task scope and day.");
}

function assertSource(task: Workspace["tasks"][number], map: TaskMap) {
  if (!task.sourceTaskId || !map.has(task.sourceTaskId)) return;
  if (map.get(task.sourceTaskId)?.scope !== "template")
    throw new Error("Task source must be a template.");
}

function assertNoCycle(task: Workspace["tasks"][number], map: TaskMap) {
  const seen = new Set([task.id]);
  let parent = task.parentId;
  while (parent) {
    if (seen.has(parent)) throw new Error("Task hierarchy cannot contain a cycle.");
    seen.add(parent);
    parent = map.get(parent)?.parentId ?? null;
  }
}

function assertTaskShape(task: Workspace["tasks"][number]) {
  const standaloneDetails =
    (task.kind === "exercise" && task.details.type === "exercise") ||
    (task.kind === "workout" && task.details.type === "workout");
  if (!standaloneDetails && task.details.type !== (taskDetailTypes[task.kind] ?? "basic"))
    throw new Error(`Invalid details for ${task.kind}.`);
  const templateHasDate = task.scope === "template" && task.date !== null;
  const datedTaskMissingDate = task.scope !== "template" && task.date === null;
  if (templateHasDate || datedTaskMissingDate)
    throw new Error("Only scheduled and generated tasks have dates.");
}

function activeTemplate(map: TaskMap, id: string, kind?: string) {
  const task = map.get(id);
  if (task?.scope !== "template" || task?.archived) return false;
  return !kind || task.kind === kind;
}

function assertIngredients(workspace: Workspace, map: TaskMap) {
  if (
    new Set(workspace.ingredients.map((ingredient) => ingredient.id)).size !==
    workspace.ingredients.length
  )
    throw new Error("Ingredient IDs must be unique.");
  for (const ingredient of workspace.ingredients) assertIngredient(ingredient, map);
  for (const group of ingredientGroups(workspace).values()) {
    if (group.length > 1 && group.some((ingredient) => !ingredient.isChoice))
      throw new Error("Multiple ingredients in one group must be alternatives.");
  }
}

function assertIngredient(ingredient: Workspace["ingredients"][number], map: TaskMap) {
  if (map.get(ingredient.mealTaskId)?.kind !== "meal")
    throw new Error("Ingredients must belong to a meal task.");
  if (porkPattern.test(ingredient.name))
    throw new Error("Ingredient conflicts with the no-pork restriction.");
}

function ingredientGroups(workspace: Workspace) {
  const groups = new Map<string, Workspace["ingredients"]>();
  for (const ingredient of workspace.ingredients) {
    const key = `${ingredient.mealTaskId}::${ingredient.groupId}`;
    groups.set(key, [...(groups.get(key) ?? []), ingredient]);
  }
  return groups;
}

function assertPlans(workspace: Workspace, map: TaskMap) {
  if (!workspace.settings.rotation.every((id) => activeTemplate(map, id, "diet")))
    throw new Error("Rotation must reference active diet tasks.");
  assertSchedules(workspace, map);
  assertOverrides(workspace, map);
  if (new Set(workspace.choices.map((choice) => choice.id)).size !== workspace.choices.length)
    throw new Error("Choice IDs must be unique.");
}

function assertSchedules(workspace: Workspace, map: TaskMap) {
  if (
    new Set(workspace.schedules.map((schedule) => schedule.id)).size !== workspace.schedules.length
  )
    throw new Error("Schedule IDs must be unique.");
  for (const schedule of workspace.schedules) {
    if (!activeTemplate(map, schedule.taskId))
      throw new Error("Schedule must reference an active template.");
  }
}

function assertOverrides(workspace: Workspace, map: TaskMap) {
  for (const override of workspace.overrides) {
    const dietReady = activeTemplate(map, override.dietTaskId, "diet");
    const workoutReady =
      !override.workoutTaskId || activeTemplate(map, override.workoutTaskId, "workout");
    if (!dietReady || !workoutReady) throw new Error("Day override refers to an unavailable plan.");
  }
  if (
    new Set(workspace.overrides.map((override) => override.date)).size !==
    workspace.overrides.length
  )
    throw new Error("Only one override per date is allowed.");
}
