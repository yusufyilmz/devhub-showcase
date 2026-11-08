import { describe, expect, it } from "vitest";

import { seedWorkspace } from "../../db/seed";
import { dueFitnessReminders, reminderInstant } from "./reminders";

function fixture() {
  const state = seedWorkspace();
  state.settings.reminders = true;
  state.settings.timezone = "Europe/Madrid";
  state.settings.leadMinutes = 10;
  const meal = structuredClone(state.tasks.find((task) => task.kind === "meal")!);
  Object.assign(meal, {
    archived: false,
    date: "2026-11-06",
    id: "scheduled-meal",
    notes: "Private note",
    parentId: null,
    scope: "scheduled",
    status: "pending",
    time: "00:05",
    title: "Private meal",
  });
  state.tasks = [meal];
  return state;
}
describe("fitness reminder timing", () => {
  it("resolves daylight saving gaps and chooses the first repeated hour", () => {
    expect(reminderInstant("2026-03-29", "02:30", "Europe/Madrid")).toBeNull();
    expect(reminderInstant("2026-10-25", "02:30", "Europe/Madrid")).toBe(
      Date.parse("2026-10-25T00:30:00Z"),
    );
    expect(reminderInstant("2026-11-06", "00:05", "Europe/Madrid")).toBe(
      Date.parse("2026-11-05T23:05:00Z"),
    );
  });
  it("finds next-day tasks whose lead reminder is before midnight without mutating the workspace", () => {
    const state = fixture();
    const original = structuredClone(state);
    const due = dueFitnessReminders(state, Date.parse("2026-11-05T22:55:30Z"));
    expect(due).toHaveLength(1);
    expect(due[0]?.url).toContain("date=2026-11-06");
    expect(due[0]?.dueAt).toBe(Date.parse("2026-11-05T22:55:00Z"));
    expect(state).toEqual(original);
    expect(dueFitnessReminders(state, Date.parse("2026-11-05T22:55:50Z"))[0]?.key).toBe(
      due[0]?.key,
    );
  });
  it("excludes completed, archived, disabled, future and stale reminders", () => {
    const state = fixture();
    const now = Date.parse("2026-11-05T22:55:30Z");
    state.settings.reminders = false;
    expect(dueFitnessReminders(state, now)).toEqual([]);
    state.settings.reminders = true;
    state.tasks[0]!.status = "done";
    expect(dueFitnessReminders(state, now)).toEqual([]);
    state.tasks[0]!.status = "pending";
    state.tasks[0]!.archived = true;
    expect(dueFitnessReminders(state, now)).toEqual([]);
    state.tasks[0]!.archived = false;
    expect(dueFitnessReminders(state, now - 60000)).toEqual([]);
    expect(dueFitnessReminders(state, now + 600000, 99999999)).toEqual([]);
  });
});
