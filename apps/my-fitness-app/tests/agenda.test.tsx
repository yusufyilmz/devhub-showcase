import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { test } from "vitest";

import { seedWorkspace } from "@shared/lib/db/seed";
import { MealPlanningService, WeeklyPlanningService } from "@shared/lib/meal";
import { AgendaService, ScheduleService, TaskService } from "@shared/lib/schedule";
import { validateWorkspace, workspaceSchema } from "@shared/lib/types";

import { DayAgenda } from "../features/agenda/day-agenda";
import { CalendarGrid } from "../features/calendar/calendar-grid";

const agenda = new AgendaService();
const schedule = new ScheduleService();
const tasks = new TaskService();
const date = "2026-10-19";
const to = "2026-10-20";
const noop = () => {
  /* Static markup does not handle interaction. */
};
test("agenda is chronological, exposes each workout once, and keeps sets in details", () => {
  const events = agenda.events(seedWorkspace(), date);
  const times = events.map((e) => e.time ?? "99:99");
  assert.deepEqual(times, [...times].sort());
  assert.equal(events.filter((e) => e.task.kind === "workout").length, 1);
  assert.equal(
    events.filter((e) => ["category", "diet", "exercise", "set"].includes(e.task.kind)).length,
    0,
  );
  assert.equal(events.filter((e) => e.task.kind === "meal").length, 4);
  assert.ok(events.some((e) => e.task.kind === "supplement"));
});
test("moving one workout preserves its subtree, recurring template, and source-day history", () => {
  const seed = seedWorkspace();
  const event = agenda.events(seed, date).find((e) => e.task.kind === "workout")!;
  const moved = agenda.move(seed, event.task.id, date, to, "21:15");
  assert.doesNotThrow(() => validateWorkspace(workspaceSchema.parse(moved)));
  assert.ok(!agenda.events(moved, date).some((e) => e.task.id === event.task.id));
  assert.equal(agenda.events(moved, to).find((e) => e.task.id === event.task.id)?.time, "21:15");
  const subtree = tasks.descendants(moved.tasks, event.task.id);
  assert.ok(subtree.length > 30);
  assert.ok(subtree.every((t) => t.date === to));
  assert.deepEqual(
    moved.tasks.filter((t) => t.scope === "template"),
    seed.tasks,
  );
  const repeated = schedule.ensureDay(moved, date);
  assert.equal(repeated.tasks.filter((t) => t.id === event.task.id).length, 1);
  assert.throws(() => schedule.changeDay(moved, date, "y1", null), /moved activities/);
  assert.throws(() => schedule.changeDay(moved, to, "y1", null), /moved activities/);
});
test("moving meals preserves ingredients and per-occurrence choices without changing another meal", () => {
  const planner = new MealPlanningService();
  let seed = seedWorkspace();
  const meal = planner.planWeek(seed, date).find((m) => m.date === date && m.choices.length);
  if (!meal) throw new Error("Expected a meal with choices.");
  const choice = meal.choices[0];
  const option = choice?.options[0];
  if (!choice || !option) throw new Error("Expected a meal choice.");
  const key = option.ingredientKey;
  seed.choices.push({
    date,
    groupId: choice.groupId,
    id: "test-choice",
    ingredientKey: key,
    mealSourceId: meal.sourceId,
  });
  seed = new WeeklyPlanningService().generate(seed, date);
  const moved = agenda.move(seed, meal.taskId, date, to, "19:45");
  const plans = planner.planWeek(moved, date);
  const planned = plans.find((m) => m.taskId === meal.taskId);
  if (!planned) throw new Error("Expected the moved meal.");
  assert.equal(planned.date, to);
  assert.equal(planned.time, "19:45");
  assert.equal(planned.choices[0]?.selected, key);
  const other = plans.find(
    (m) => m.date === to && m.taskId !== meal.taskId && m.title === meal.title,
  );
  if (!other) throw new Error("Expected the other meal occurrence.");
  assert.equal(other.choices[0]?.selected, null);
  assert.ok(moved.ingredients.some((i) => i.mealTaskId === meal.taskId));
  assert.ok(moved.tasks.some((t) => t.details.type === "week" && t.details.stale));
  assert.equal(plans.length, 28);
  const back = agenda.move(moved, meal.taskId, to, date, "20:00");
  assert.doesNotThrow(() => validateWorkspace(back));
  assert.equal(
    planner.planWeek(back, date).find((m) => m.taskId === meal.taskId)?.choices[0]?.selected,
    key,
  );
});
test("logged events cannot be dragged; same-day time changes do not duplicate occurrences", () => {
  const seed = seedWorkspace();
  const event = agenda.events(seed, date).find((e) => e.task.kind === "meal")!;
  const completed = tasks.complete(schedule.ensureDay(seed, date), event.task.id, "done");
  assert.throws(() => agenda.move(completed, event.task.id, date, to, "14:00"), /Reopen/);
  const moved = agenda.move(seed, event.task.id, date, date, "06:15");
  assert.equal(agenda.events(moved, date).filter((e) => e.task.id === event.task.id).length, 1);
  assert.equal(agenda.events(moved, date)[0]?.task.id, event.task.id);
  assert.throws(() => agenda.move(seed, event.task.id, date, to, "25:00"));
});
test("generated cooking entries appear on their meal dates, not all on Monday", () => {
  const generated = new WeeklyPlanningService().generate(seedWorkspace(), date);
  const events = agenda.events(generated, to);
  assert.equal(events.filter((e) => e.task.kind === "cook").length, 4);
  assert.ok(
    events
      .filter((e) => e.task.kind === "cook")
      .every((e) => e.task.details.type === "cook" && e.task.details.mealDate === to),
  );
});
test("read-only agenda and month calendar expose navigable details but disable writes and dragging", () => {
  const workspace = seedWorkspace();
  for (const html of [
    renderToStaticMarkup(
      <DayAgenda {...{ date, workspace }} busy={false} onOpen={noop} onStatus={noop} readOnly />,
    ),
    renderToStaticMarkup(
      <CalendarGrid
        {...{ date, workspace }}
        busy={false}
        onMove={noop}
        onOpen={noop}
        onStatus={noop}
        openDay={noop}
        readOnly
        setDate={noop}
      />,
    ),
  ]) {
    assert.match(html, /view=day/);
    assert.match(html, /task=/);
    assert.match(html, /type="checkbox"/);
    assert.match(html, /disabled=""/);
    assert.doesNotMatch(html, /draggable="true"/);
  }
});
