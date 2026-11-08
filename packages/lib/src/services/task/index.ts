import { taskSchema } from "../../schemas/task";
import { validateWorkspace } from "../../schemas/workspace";
import { createTask, defaultDetails, type Task, type TaskKind } from "../../types/task";
import type { Workspace } from "../../types/workspace";
export class TaskService {
  children(tasks: Task[], parentId: string | null) {
    return tasks
      .filter((t) => !t.archived && t.parentId === parentId)
      .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
  }
  descendants(tasks: Task[], id: string): Task[] {
    const children = this.children(tasks, id);
    return children.flatMap((t) => [t, ...this.descendants(tasks, t.id)]);
  }
  progress(tasks: Task[], id: string) {
    const node = tasks.find((t) => t.id === id);
    const descendants = this.descendants(tasks, id);
    const leaves = (descendants.length ? descendants : node ? [node] : []).filter(
      (t) =>
        !["day", "category", "diet", "gym", "week", "cooking"].includes(t.kind) &&
        !this.children(tasks, t.id).length,
    );
    return {
      done: leaves.filter((t) => t.status === "done").length,
      skipped: leaves.filter((t) => t.status === "skipped").length,
      total: leaves.length,
    };
  }
  status(tasks: Task[], id: string): Task["status"] {
    const p = this.progress(tasks, id);
    return p.total && p.done === p.total
      ? "done"
      : p.total && p.skipped === p.total
        ? "skipped"
        : "pending";
  }
  complete(workspace: Workspace, id: string, status: Task["status"]) {
    const next = structuredClone(workspace);
    const task = next.tasks.find((t) => t.id === id);
    if (!task || task.archived) throw new Error("Task not found.");
    if (task.scope === "template")
      throw new Error("Complete a scheduled task, not a reusable template.");
    const nodes = [task, ...this.descendants(next.tasks, id)];
    for (const node of nodes) {
      if (
        status === "done" &&
        node.kind === "set" &&
        node.details.type === "set" &&
        (node.details.actualReps === null || node.details.weightKg === null)
      )
        throw new Error("Log reps and weight for every set, or skip unfinished sets individually.");
      node.status = status;
    }
    if (nodes.some((t) => t.kind === "meal")) this.markWeeklyPlansStale(next);
    return next;
  }
  save(workspace: Workspace, task: Task) {
    const next = structuredClone(workspace);
    const item = taskSchema.parse(task);
    const index = next.tasks.findIndex((t) => t.id === item.id);
    if (index >= 0) next.tasks[index] = item;
    else next.tasks.push(item);
    if (["meal", "diet"].includes(item.kind)) this.markWeeklyPlansStale(next);
    validateWorkspace(next);
    return next;
  }
  add(workspace: Workspace, parentId: string | null, kind: TaskKind, title: string) {
    const parent = workspace.tasks.find((t) => t.id === parentId);
    const task = createTask({
      date: parent?.date ?? null,
      details: defaultDetails(kind),
      id: crypto.randomUUID(),
      kind,
      parentId,
      position: this.children(workspace.tasks, parentId).length,
      scope: parent?.scope ?? "template",
      title,
    });
    return this.save(workspace, task);
  }
  archive(workspace: Workspace, id: string) {
    const next = structuredClone(workspace);
    const task = next.tasks.find((t) => t.id === id);
    if (!task) throw new Error("Task not found.");
    const ids = new Set([id, ...this.descendants(next.tasks, id).map((t) => t.id)]);
    if (next.settings.rotation.some((x) => ids.has(x)))
      throw new Error("Remove this diet from the rotation before archiving it.");
    if (
      next.overrides.some(
        (o) => ids.has(o.dietTaskId) || (o.workoutTaskId && ids.has(o.workoutTaskId)),
      )
    )
      throw new Error("Remove calendar overrides referencing this plan first.");
    next.tasks.forEach((t) => {
      if (ids.has(t.id)) t.archived = true;
    });
    next.schedules = next.schedules.filter((s) => !ids.has(s.taskId));
    this.markWeeklyPlansStale(next);
    return next;
  }
  reorder(workspace: Workspace, id: string, direction: -1 | 1) {
    const next = structuredClone(workspace);
    const task = next.tasks.find((t) => t.id === id);
    if (!task) return next;
    const siblings = this.children(next.tasks, task.parentId);
    const i = siblings.findIndex((t) => t.id === id);
    const other = siblings[i + direction];
    if (!other) return next;
    [siblings[i], siblings[i + direction]] = [other, task];
    siblings.forEach((t, index) => {
      t.position = index;
    });
    return next;
  }
  logSet(workspace: Workspace, id: string, reps: number, weight: number) {
    const t = workspace.tasks.find((t) => t.id === id);
    if (!t || t.scope === "template" || t.details.type !== "set")
      throw new Error("Select a scheduled set.");
    return this.save(workspace, {
      ...t,
      details: { ...t.details, actualReps: reps, weightKg: weight },
      status: "done",
    });
  }
  previousSet(workspace: Workspace, task: Task) {
    const sourceDate = task.date;
    if (!task.sourceTaskId || !sourceDate) return null;
    return (
      workspace.tasks
        .filter(
          (earlier) =>
            earlier.sourceTaskId === task.sourceTaskId &&
            earlier.scope === "scheduled" &&
            earlier.date !== null &&
            earlier.date < sourceDate &&
            earlier.status === "done" &&
            earlier.details.type === "set",
        )
        .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))[0] ?? null
    );
  }
  markWeeklyPlansStale(workspace: Workspace) {
    for (const t of workspace.tasks) if (t.details.type === "week") t.details.stale = true;
  }
}
