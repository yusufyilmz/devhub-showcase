import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { test } from "vitest";

import { seedWorkspace } from "@shared/lib/db/seed";
import { ScheduleService } from "@shared/lib/schedule";

import Preview from "../app/preview/page";
import { TaskTree } from "../features/task-tree/task-tree";
import { WeeklyPlanner } from "../features/weekly-planner/weekly-planner";

const noop = () => {
  /* Static markup does not handle interaction. */
};
test("demo loading view contains no personal workout records", () => {
  const html = renderToStaticMarkup(<Preview />);
  assert.match(html, /Getting your tasks ready/);
  assert.doesNotMatch(html, /type="password"/);
  assert.doesNotMatch(html, /Whole eggs|Original plans/);
});
test("set logging inputs are disabled in read-only tree", () => {
  const workspace = new ScheduleService().ensureDay(seedWorkspace(), "2026-10-19");
  const html = renderToStaticMarkup(
    <TaskTree
      busy={false}
      onAdd={noop}
      onEdit={noop}
      onSet={noop}
      onStatus={noop}
      parentId="day:2026-10-19:w1:hip-abduction-machine"
      readOnly
      workspace={workspace}
    />,
  );
  const inputs = html.match(/<input[^>]*>/g) ?? [];
  assert.equal(inputs.length, 18);
  inputs.forEach((i) => {
    assert.match(i, /disabled=""/);
  });
});
test("read-only weekly planner calculates grocery tasks without persistence", () => {
  const html = renderToStaticMarkup(
    <WeeklyPlanner
      busy={false}
      date="2026-10-19"
      readOnly
      update={() => {
        throw new Error("Preview attempted save");
      }}
      workspace={seedWorkspace()}
    />,
  );
  assert.match(html, /Whole eggs/);
  assert.match(html, /23 piece/);
  assert.match(html, /demo meal plan/);
});
