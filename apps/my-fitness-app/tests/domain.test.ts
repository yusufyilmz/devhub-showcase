import assert from "node:assert/strict";

import { test } from "vitest";

import { seedWorkspace } from "@shared/services/db/seed";
import { TaskService } from "@shared/services/fitness/task";

import {
  MealPlanningService,
  ShoppingListService,
  WeeklyPlanningService,
} from "../../../packages/services/src/meal";
import { ScheduleService } from "../../../packages/services/src/schedule";
import {
  createTask,
  dateKey,
  monday,
  validateWorkspace,
  workspaceSchema,
} from "../../../packages/services/src/types";

const tasks = new TaskService();
const schedule = new ScheduleService();
const meals = new MealPlanningService();
const shopping = new ShoppingListService();
const weekly = new WeeklyPlanningService();
const start = "2026-10-19";
test("trainer plan becomes valid diet, workout, superset and set task trees", () => {
  const s = seedWorkspace();
  assert.ok(workspaceSchema.safeParse(s).success);
  assert.doesNotThrow(() => validateWorkspace(s));
  assert.equal(s.tasks.filter((t) => t.kind === "diet").length, 2);
  assert.equal(s.tasks.filter((t) => t.kind === "meal").length, 8);
  assert.equal(s.tasks.filter((t) => t.kind === "workout").length, 4);
  assert.equal(s.tasks.filter((t) => t.kind === "exercise").length, 28);
  assert.deepEqual(
    tasks.children(s.tasks, "gym").map((t) => t.title),
    ["Glutes + Arms", "Legs + Shoulders", "Legs + Chest", "Legs + Calves + Back"],
  );
  assert.deepEqual(
    tasks
      .children(s.tasks, "w1:hip-abduction-machine")
      .map((t) => (t.details.type === "set" ? t.details.targetReps : 0)),
    [20, 15, 12, 10, 8, 6, 6, 6, 15],
  );
});
test("rotation is anchored and day override does not shift future days", () => {
  const s = seedWorkspace();
  assert.deepEqual(
    ["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22"].map((d) => schedule.dietFor(s, d)),
    ["y1", "y1", "y2", "y1"],
  );
  const changed = schedule.changeDay(s, "2026-10-20", "y2", null);
  assert.equal(schedule.dietFor(changed, "2026-10-21"), "y2");
  assert.equal(
    changed.tasks.filter((t) => t.date === "2026-10-20" && t.kind === "workout").length,
    0,
  );
});
test("daily snapshots include ingredients and preserve historical instructions", () => {
  const s = schedule.ensureDay(seedWorkspace(), start);
  const old = structuredClone(s.tasks.find((t) => t.id === `day:${start}:y1-breakfast`));
  const ingredient = s.ingredients.find(
    (i) => i.mealTaskId === `day:${start}:y1-breakfast` && i.ingredientKey === "whole-eggs",
  )!;
  s.tasks.find((t) => t.id === "y1-breakfast")!.notes = "New instructions";
  s.ingredients.find(
    (i) => i.mealTaskId === "y1-breakfast" && i.ingredientKey === "whole-eggs",
  )!.quantityMin = 20;
  assert.deepEqual(
    schedule.ensureDay(s, start).tasks.find((t) => t.id === old?.id),
    old,
  );
  assert.equal(ingredient.quantityMin, 3);
});
test("completion rolls up leaves without double-counting containers", () => {
  let s = schedule.ensureDay(seedWorkspace(), start);
  const root = `day:${start}:y1`;
  const total = tasks.progress(s.tasks, root).total;
  s = tasks.complete(s, root, "done");
  assert.equal(total, 4);
  assert.deepEqual(tasks.progress(s.tasks, root), {
    done: 4,
    skipped: 0,
    total: 4,
  });
  assert.equal(schedule.waterTotal(s, start), 1500);
});
test("set logging requires actual reps and weight; past completed set is returned", () => {
  let s = schedule.ensureDay(seedWorkspace(), start);
  const id = `day:${start}:w1:hip-abduction-machine:set:0`;
  assert.throws(() => tasks.complete(s, id, "done"), /Log reps/);
  s = tasks.logSet(s, id, 20, 40);
  s = schedule.ensureDay(s, "2026-10-26");
  const future = s.tasks.find((t) => t.id === "day:2026-10-26:w1:hip-abduction-machine:set:0")!;
  assert.equal(tasks.previousSet(s, future)?.details.type, "set");
  assert.equal(tasks.previousSet(s, s.tasks.find((t) => t.id === id)!), null);
});
test("cycles, duplicate IDs and inconsistent task details are rejected", () => {
  const s = seedWorkspace();
  s.tasks.find((t) => t.id === "gym")!.parentId = "w1";
  assert.throws(() => validateWorkspace(s), /cycle/);
  const duplicate = seedWorkspace();
  const duplicateTask = duplicate.tasks[0];
  if (!duplicateTask) throw new Error("Expected a task.");
  duplicate.tasks.push(duplicateTask);
  assert.throws(() => validateWorkspace(duplicate), /unique/);
  const mismatch = seedWorkspace();
  mismatch.tasks.find((t) => t.kind === "set")!.details = { type: "basic" };
  assert.throws(() => validateWorkspace(mismatch), /details/);
});
test("weekly shopping sums exact quantities and ranges without selecting alternatives", () => {
  const plan = meals.planWeek(seedWorkspace(), start);
  assert.equal(plan.length, 28);
  const list = shopping.aggregate(plan);
  assert.equal(list.find((i) => i.name === "Whole eggs")?.min, 23);
  const gelatin = list.find((i) => i.name === "Sugar-free gelatin")!;
  assert.equal(gelatin.min, 19);
  assert.equal(gelatin.max, 24);
  assert.equal(
    list.some((i) => i.name === "Chicken"),
    false,
  );
  assert.ok(list.some((i) => i.name.startsWith("Choose: Chicken")));
  assert.ok(list.some((i) => i.min === null));
  assert.ok(
    list.filter((i) => i.name.startsWith("Choose: Gazpacho")).some((i) => i.unit === "large cup"),
  );
});
test("selecting chicken changes only that meal and does not count the other proteins", () => {
  const s = seedWorkspace();
  s.choices.push({
    date: start,
    groupId: "protein",
    id: "selection",
    ingredientKey: "chicken",
    mealSourceId: "y1-lunch",
  });
  const list = shopping.aggregate(meals.planWeek(s, start));
  assert.equal(list.find((i) => i.name === "Chicken")?.min, 250);
  assert.equal(
    list.some((i) => i.name === "Fish"),
    false,
  );
});
test("daily overrides and skips affect the weekly meal and shopping plan", () => {
  let s = schedule.changeDay(seedWorkspace(), start, "y2", null);
  let list = shopping.aggregate(meals.planWeek(s, start));
  assert.equal(list.find((i) => i.name === "Whole eggs")?.min, 24);
  s = tasks.complete(s, `day:${start}:y2-breakfast`, "skipped");
  assert.equal(meals.planWeek(s, start).length, 27);
  list = shopping.aggregate(meals.planWeek(s, start));
  assert.equal(list.find((i) => i.name === "Whole eggs")?.min, 20);
});
test("unstructured new meals are flagged rather than assigned guessed ingredients", () => {
  const s = seedWorkspace();
  s.tasks.push(
    createTask({
      details: { type: "meal", waterMl: 0 },
      id: "custom",
      kind: "meal",
      parentId: "y1",
      title: "Custom lunch",
    }),
  );
  const list = shopping.aggregate(meals.planWeek(s, start));
  assert.ok(list.some((i) => i.name === "Review ingredients: Custom lunch" && i.min === null));
});
test("weekly generation is idempotent and preserves only unchanged checklist completions", () => {
  let s = weekly.generate(seedWorkspace(), start);
  const count = s.tasks.length;
  const eggs = s.tasks.find((t) => t.kind === "shopping_item" && t.title === "Whole eggs")!;
  s = tasks.complete(s, eggs.id, "done");
  s = weekly.generate(s, start);
  assert.equal(s.tasks.length, count);
  assert.equal(s.tasks.find((t) => t.id === eggs.id)?.status, "done");
  s = schedule.changeDay(s, start, "y2", null);
  s = weekly.generate(s, start);
  assert.equal(s.tasks.find((t) => t.id === eggs.id)?.status, "pending");
  assert.doesNotThrow(() => validateWorkspace(s));
});
test("parent template archive preserves scheduled descendants", () => {
  const s = schedule.ensureDay(seedWorkspace(), start);
  const next = tasks.archive(s, "w1");
  assert.equal(next.tasks.find((t) => t.id === "w1")?.archived, true);
  assert.equal(next.tasks.find((t) => t.id === `day:${start}:w1`)?.archived, false);
});
test("logged days cannot be replaced", () => {
  let s = schedule.ensureDay(seedWorkspace(), start);
  s = tasks.complete(s, `day:${start}:y1-breakfast`, "done");
  assert.throws(() => schedule.changeDay(s, start, "y2", null), /has logs/);
});
test("calendar calculations respect Madrid dates and Monday week starts", () => {
  assert.equal(dateKey("Europe/Madrid", new Date("2026-10-18T22:30Z")), "2026-10-19");
  assert.equal(monday("2026-10-25"), "2026-10-19");
});
