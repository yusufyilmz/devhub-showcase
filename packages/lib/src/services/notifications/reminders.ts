import { dateKey, type Workspace } from "../../types/index";
import { ScheduleService } from "../schedule/index";

const kinds = new Set(["meal", "supplement", "water", "workout"]);
const formatters = new Map<string, Intl.DateTimeFormat>();
function localParts(epoch: number, timezone: string) {
  let formatter = formatters.get(timezone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
      minute: "2-digit",
      month: "2-digit",
      timeZone: timezone,
      year: "numeric",
    });
    formatters.set(timezone, formatter);
    if (formatters.size > 16) formatters.delete(formatters.keys().next().value ?? "");
  }
  const parts = formatter.formatToParts(new Date(epoch));
  const value = (key: string) => parts.find((part) => part.type === key)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}T${value("hour")}:${value("minute")}`;
}
/** Resolve wall time with DST validation; choose the first occurrence on a repeated clock hour. */
export function reminderInstant(date: string, time: string, timezone: string) {
  const target = `${date}T${time}`;
  const wall = Date.parse(`${target}:00Z`);
  const candidates = [-36, 0, 36]
    .map((hours) => {
      const sample = wall + hours * 3600000;
      const offset =
        Date.parse(`${localParts(sample, timezone)}:00Z`) - Math.floor(sample / 60000) * 60000;
      return wall - offset;
    })
    .filter((epoch) => localParts(epoch, timezone) === target);
  return candidates.length ? Math.min(...candidates) : null;
}
export function dueFitnessReminders(state: Workspace, now = Date.now(), lookbackMs = 120000) {
  if (!state.settings.reminders) return [];
  const today = dateKey(state.settings.timezone, new Date(now));
  const dates = [-1, 0, 1].map((days) =>
    new Date(Date.parse(`${today}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10),
  );
  const lower = Math.floor((now - Math.min(lookbackMs, 300000)) / 60000) * 60000;
  const found = new Map<
    string,
    { key: string; url: string; taskTitle: string; notes: string; dueAt: number }
  >();
  for (const date of dates) {
    const day = new ScheduleService().ensureDay(state, date);
    for (const task of day.tasks) {
      if (
        task.scope !== "scheduled" ||
        task.date !== date ||
        task.status !== "pending" ||
        task.archived ||
        !task.time ||
        !kinds.has(task.kind)
      )
        continue;
      const scheduled = reminderInstant(date, task.time, state.settings.timezone);
      if (scheduled === null) continue;
      const dueAt = scheduled - state.settings.leadMinutes * 60000;
      if (dueAt < lower || dueAt > now) continue;
      const key = `${date}:${task.id}:${task.time}:${state.settings.leadMinutes}`;
      found.set(key, {
        dueAt,
        key,
        notes: task.notes,
        taskTitle: task.title,
        url: `/?view=day&date=${date}&task=${encodeURIComponent(task.id)}`,
      });
    }
  }
  return [...found.values()];
}
