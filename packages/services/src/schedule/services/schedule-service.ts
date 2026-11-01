import { createTask, type Task } from "../../types/task";
import type { Workspace } from "../../types/workspace";
import { TaskService } from "./task-service";

export class ScheduleService {
  constructor(private readonly tasks: TaskService = new TaskService()) {}
  dietFor(workspace: Workspace, date: string) {
    const override = workspace.overrides.find((o) => o.date === date);
    if (override) return override.dietTaskId;
    const diff = Math.round(
      (Date.parse(`${date}T12:00Z`) - Date.parse(`${workspace.settings.rotationStart}T12:00Z`)) /
        86400000,
    );
    const rotation = workspace.settings.rotation;
    const dietId = rotation[((diff % rotation.length) + rotation.length) % rotation.length];
    if (!dietId) throw new Error("Rotation must contain a diet.");
    return dietId;
  }
  ensureDay(workspace: Workspace, date: string): Workspace {
    const rootId = `day:${date}`;
    if (workspace.tasks.some((task) => task.id === rootId)) return workspace;
    const next = structuredClone(workspace);
    next.tasks.push(
      createTask({
        date,
        id: rootId,
        kind: "day",
        scope: "scheduled",
        title: "Daily routine",
      }),
    );
    const weekday = new Date(`${date}T12:00Z`).getUTCDay();
    const selected = templatesForDay(workspace, date, weekday, this.dietFor(workspace, date));
    let position = 0;
    const parentCopies = new Map<string, string>();
    for (const templateId of selected) {
      position = this.copyTemplate(workspace, next, {
        date,
        parentCopies,
        position,
        rootId,
        templateId,
      });
    }
    return next;
  }
  private copyTemplate(
    source: Workspace,
    next: Workspace,
    copy: {
      date: string;
      parentCopies: Map<string, string>;
      position: number;
      rootId: string;
      templateId: string;
    },
  ) {
    const template = source.tasks.find((task) => task.id === copy.templateId && !task.archived);
    if (!template) return copy.position;
    const schedule = next.schedules.find((item) => item.taskId === copy.templateId);
    const placed = copyCategoryParent(source, next, template, copy);
    const subtree = [template, ...this.tasks.descendants(source.tasks, template.id)];
    const ids = new Map(subtree.map((task) => [task.id, `${copy.rootId}:${task.id}`]));
    for (const task of subtree) {
      copyScheduledNode(source, next, task, {
        date: copy.date,
        id: copiedId(ids, task.id),
        parentId: task.id === template.id ? placed.parentId : copiedId(ids, task.parentId),
        scheduleTime: schedule?.time ?? null,
      });
    }
    return placed.position;
  }
  changeDay(workspace: Workspace, date: string, dietTaskId: string, workoutTaskId: string | null) {
    if (
      workspace.tasks.some(
        (t) =>
          t.scope === "scheduled" &&
          t.sourceTaskId &&
          ((t.id.startsWith(`day:${date}:`) && t.date !== date) ||
            (t.date === date && !t.id.startsWith(`day:${date}:`))),
      )
    )
      throw new Error(
        "This day has moved activities. Edit individual tasks to preserve their schedule.",
      );
    const next = structuredClone(workspace);
    const ids = new Set([
      `day:${date}`,
      ...this.tasks.descendants(next.tasks, `day:${date}`).map((t) => t.id),
    ]);
    if (next.tasks.some((t) => ids.has(t.id) && t.status !== "pending"))
      throw new Error("This day has logs. Edit individual tasks to preserve them.");
    next.tasks = next.tasks.filter((t) => !ids.has(t.id));
    next.ingredients = next.ingredients.filter((i) => !ids.has(i.mealTaskId));
    next.overrides = [
      ...next.overrides.filter((o) => o.date !== date),
      { date, dietTaskId, workoutTaskId },
    ];
    this.tasks.markWeeklyPlansStale(next);
    return this.ensureDay(next, date);
  }
  waterTotal(workspace: Workspace, date: string) {
    return workspace.tasks
      .filter((t) => t.scope === "scheduled" && t.date === date && t.status === "done")
      .reduce(
        (n, t) =>
          n +
          (t.details.type === "water"
            ? t.details.ml
            : t.details.type === "meal"
              ? t.details.waterMl
              : 0),
        0,
      );
  }
}

function templatesForDay(workspace: Workspace, date: string, weekday: number, dietId: string) {
  const override = workspace.overrides.find((item) => item.date === date);
  const selected = new Set<string>([dietId]);
  for (const schedule of workspace.schedules) {
    const template = workspace.tasks.find((task) => task.id === schedule.taskId);
    if (!template || template.archived || !schedule.weekdays.includes(weekday)) continue;
    if (template.kind === "workout" && override) continue;
    selected.add(template.id);
  }
  if (override?.workoutTaskId) selected.add(override.workoutTaskId);
  return selected;
}

function copyCategoryParent(
  source: Workspace,
  next: Workspace,
  template: Task,
  copy: {
    date: string;
    parentCopies: Map<string, string>;
    position: number;
    rootId: string;
  },
) {
  const templateParent = source.tasks.find((task) => task.id === template.parentId);
  if (!templateParent) return { parentId: copy.rootId, position: copy.position };
  const existing = copy.parentCopies.get(templateParent.id);
  if (existing) return { parentId: existing, position: copy.position };
  const copyId = `${copy.rootId}:${templateParent.id}`;
  copy.parentCopies.set(templateParent.id, copyId);
  next.tasks.push({
    ...structuredClone(templateParent),
    date: copy.date,
    id: copyId,
    parentId: copy.rootId,
    position: copy.position,
    scope: "scheduled",
    sourceTaskId: templateParent.id,
    status: "pending",
  });
  return { parentId: copyId, position: copy.position + 1 };
}

function copyScheduledNode(
  source: Workspace,
  next: Workspace,
  task: Task,
  copy: { date: string; id: string; parentId: string; scheduleTime: string | null },
) {
  const scheduled: Task = {
    ...structuredClone(task),
    date: copy.date,
    id: copy.id,
    parentId: copy.parentId,
    scope: "scheduled",
    sourceTaskId: task.id,
    status: "pending",
    time: task.time ?? copy.scheduleTime,
  };
  if (scheduled.details.type === "set") {
    scheduled.details.actualReps = null;
    scheduled.details.weightKg = null;
  }
  next.tasks.push(scheduled);
  for (const ingredient of source.ingredients.filter((item) => item.mealTaskId === task.id)) {
    next.ingredients.push({
      ...ingredient,
      id: `${scheduled.id}:ingredient:${ingredient.id}`,
      mealTaskId: scheduled.id,
    });
  }
}

function copiedId(ids: Map<string, string>, id: string | null) {
  if (!id) throw new Error("Scheduled task parent is missing.");
  const copyId = ids.get(id);
  if (!copyId) throw new Error("Scheduled task copy is missing.");
  return copyId;
}
