import { shiftDate } from "@shared/lib/date";

import { ScheduleService } from "../../schedule/services/schedule-service";
import type { MealIngredient, PlannedMeal, ResolvedIngredient } from "../../types/nutrition";
import type { Task } from "../../types/task";
import type { Workspace } from "../../types/workspace";

export class MealPlanningService {
  constructor(private readonly scheduling: ScheduleService = new ScheduleService()) {}
  planWeek(workspace: Workspace, weekStart: string): PlannedMeal[] {
    const output: PlannedMeal[] = [];
    for (let day = 0; day < 7; day++) {
      output.push(...this.mealsForDate(workspace, shiftDate(weekStart, day)));
    }
    return output;
  }
  private mealsForDate(workspace: Workspace, date: string): PlannedMeal[] {
    const snapshot = this.scheduling.ensureDay(workspace, date);
    return snapshot.tasks
      .filter((task) => isScheduledMeal(task, date))
      .sort((left, right) => (left.time ?? "").localeCompare(right.time ?? ""))
      .map((meal) => plannedMeal(workspace, snapshot, meal, date));
  }
}

function isScheduledMeal(task: Task, date: string) {
  return (
    task.kind === "meal" &&
    task.scope === "scheduled" &&
    task.date === date &&
    !task.archived &&
    task.status !== "skipped"
  );
}

function plannedMeal(
  workspace: Workspace,
  snapshot: Workspace,
  meal: Task,
  date: string,
): PlannedMeal {
  const requirements = snapshot.ingredients.filter(
    (ingredient) => ingredient.mealTaskId === meal.id,
  );
  const groups = Map.groupBy(requirements, (ingredient) => ingredient.groupId);
  const ingredients: ResolvedIngredient[] = [];
  const choices: PlannedMeal["choices"] = [];
  for (const [groupId, options] of groups) {
    addIngredientGroup(workspace, meal, date, groupId, options, ingredients, choices);
  }
  if (!requirements.length) ingredients.push(unstructuredIngredient(meal, date));
  return {
    choices,
    date,
    diet: dietTitle(snapshot, meal),
    ingredients,
    sourceId: meal.id,
    taskId: meal.id,
    time: meal.time,
    title: meal.title,
  };
}

function addIngredientGroup(
  workspace: Workspace,
  meal: Task,
  date: string,
  groupId: string,
  options: MealIngredient[],
  ingredients: ResolvedIngredient[],
  choices: PlannedMeal["choices"],
) {
  if (options.every((option) => option.optional)) return;
  const first = options[0];
  if (!first) return;
  if (!options.some((option) => option.isChoice)) {
    ingredients.push(resolvedIngredient(first, date, meal.title));
    return;
  }
  const choice = findChoice(workspace, meal, date, groupId);
  const chosen = options.find((option) => option.ingredientKey === choice?.ingredientKey);
  choices.push({
    groupId,
    options,
    selected: chosen?.ingredientKey ?? null,
  });
  if (!chosen) {
    ingredients.push(unresolvedChoice(options, date, meal.title));
    return;
  }
  ingredients.push(resolvedIngredient(chosen, date, meal.title));
}

function findChoice(workspace: Workspace, meal: Task, date: string, groupId: string) {
  return (
    workspace.choices.find(
      (choice) =>
        choice.date === date && choice.mealSourceId === meal.id && choice.groupId === groupId,
    ) ??
    workspace.choices.find(
      (choice) =>
        choice.date === date &&
        choice.mealSourceId === (meal.sourceTaskId ?? meal.id) &&
        choice.groupId === groupId,
    )
  );
}

function resolvedIngredient(
  selected: MealIngredient,
  date: string,
  title: string,
): ResolvedIngredient {
  return {
    key: selected.ingredientKey,
    max: selected.quantityMax,
    min: selected.quantityMin,
    name: selected.name,
    sourceMeal: `${date} ${title}`,
    unit: selected.unit,
    warning: selected.note || (selected.quantityMin === null ? "Quantity not supplied." : null),
  };
}

function unresolvedChoice(
  options: MealIngredient[],
  date: string,
  title: string,
): ResolvedIngredient {
  const sample = options[0];
  if (!sample) throw new Error("Ingredient group is empty.");
  const sameMax = options.every((option) => option.quantityMax === sample.quantityMax);
  const sameMin = options.every((option) => option.quantityMin === sample.quantityMin);
  return {
    key: `choice:${options
      .map((option) => option.ingredientKey)
      .sort()
      .join("|")}`,
    max: sameMax ? sample.quantityMax : null,
    min: sameMin ? sample.quantityMin : null,
    name: `Choose: ${options.map((option) => option.name).join(" / ")}`,
    sourceMeal: `${date} ${title}`,
    unit: sample.unit,
    warning: "Select one alternative for this meal.",
  };
}

function unstructuredIngredient(meal: Task, date: string): ResolvedIngredient {
  return {
    key: `unstructured:${meal.id}`,
    max: null,
    min: null,
    name: `Review ingredients: ${meal.title}`,
    sourceMeal: `${date} ${meal.title}`,
    unit: "meal",
    warning: "Add structured ingredients to this meal before shopping.",
  };
}

function dietTitle(snapshot: Workspace, meal: Task) {
  let parent = snapshot.tasks.find((task) => task.id === meal.parentId);
  while (parent && parent.kind !== "diet") {
    const current = parent;
    parent = snapshot.tasks.find((task) => task.id === current.parentId);
  }
  return parent?.title ?? "Custom meal";
}
