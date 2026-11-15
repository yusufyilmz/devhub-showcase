import { dateSchema, timeSchema } from "../../schemas/task";
import { validateWorkspace } from "../../schemas/workspace";
import type { Task } from "../../types/task";
import type { Workspace } from "../../types/workspace";
import { TaskService } from "../task/index";
import { ScheduleService } from "./scheduling";

export interface AgendaEvent {
  date: string;
  status: Task["status"];
  task: Task;
  time: string | null;
}
const containers = new Set(["day", "category", "diet", "gym", "week", "cooking"]);
export class AgendaService {
  constructor(
    private readonly schedule = new ScheduleService(),
    private readonly tasks = new TaskService(),
  ) {}
  events(workspace: Workspace, date: string): AgendaEvent[] {
    const day = this.schedule.ensureDay(workspace, date);
    const map = new Map(day.tasks.map((t) => [t.id, t]));
    const candidates = day.tasks.filter(
      (t) => !t.archived && t.scope !== "template" && !containers.has(t.kind),
    );
    const ids = new Set(candidates.map((t) => t.id));
    return candidates
      .filter((t) => {
        const eventDate = t.details.type === "cook" ? t.details.mealDate : t.date;
        if (eventDate !== date) return false;
        let parent = t.parentId;
        while (parent) {
          if (ids.has(parent)) return false;
          parent = map.get(parent)?.parentId ?? null;
        }
        return true;
      })
      .map((task) => ({
        date,
        status: this.tasks.status(day.tasks, task.id),
        task,
        time: task.time,
      }))
      .sort(
        (a, b) =>
          (a.time ?? "99:99").localeCompare(b.time ?? "99:99") ||
          a.task.position - b.task.position ||
          a.task.id.localeCompare(b.task.id),
      );
  }
  move(workspace: Workspace, id: string, from: string, to: string, time: string | null): Workspace {
    dateSchema.parse(from);
    dateSchema.parse(to);
    if (time !== null) timeSchema.parse(time);
    let next = structuredClone(this.schedule.ensureDay(workspace, from));
    const { task, nodes } = this.movableActivity(next, id, from);
    if (from === to && task.time === time) return next;
    next = structuredClone(this.schedule.ensureDay(next, to));
    rescheduleActivity(next, nodes, task, from, to, time);
    if (from !== to) moveMealChoices(next, nodes, from, to);
    if (nodes.some((item) => item.kind === "meal")) this.tasks.markWeeklyPlansStale(next);
    validateWorkspace(next);
    return next;
  }
  private movableActivity(next: Workspace, id: string, from: string) {
    const event = this.events(next, from).find((item) => item.task.id === id);
    if (event?.task.scope !== "scheduled")
      throw new Error(
        "Only scheduled activities can be moved. Generated weekly tasks follow the meal plan.",
      );
    const task = next.tasks.find((item) => item.id === id);
    if (!task)
      throw new Error(
        "Only scheduled activities can be moved. Generated weekly tasks follow the meal plan.",
      );
    const nodes = [task, ...this.tasks.descendants(next.tasks, id)];
    if (nodes.some((item) => item.status !== "pending"))
      throw new Error("Reopen logged or skipped items before rescheduling this activity.");
    return { nodes, task };
  }
}

function rescheduleActivity(
  next: Workspace,
  nodes: Task[],
  task: Task,
  from: string,
  to: string,
  time: string | null,
) {
  const ids = new Set(nodes.map((item) => item.id));
  // Keep IDs and ingredient snapshots stable; move one occurrence, never its template.
  for (const item of next.tasks) {
    if (!ids.has(item.id)) continue;
    item.date = to;
    assignMovedTime(item, task, from, to, time);
  }
}

function assignMovedTime(item: Task, task: Task, from: string, to: string, time: string | null) {
  if (item.id === task.id) {
    if (from !== to) item.parentId = `day:${to}`;
    item.time = time;
    return;
  }
  if (item.time === task.time) item.time = time;
}

function moveMealChoices(next: Workspace, nodes: Task[], from: string, to: string) {
  for (const meal of nodes.filter((item) => item.kind === "meal")) {
    const byGroup = choicesForMeal(next, meal, from);
    next.choices = next.choices.filter(
      (choice) => !(choice.date === from && choice.mealSourceId === meal.id),
    );
    for (const groupId of choiceGroupIds(next, meal.id)) {
      const choice = byGroup.get(groupId);
      next.choices.push({
        date: to,
        groupId,
        id: `${to}:${meal.id}:${groupId}`,
        // An explicit unresolved choice prevents inheriting another occurrence's existing choice.
        ingredientKey: choice?.ingredientKey ?? "",
        mealSourceId: meal.id,
      });
    }
  }
}

function choicesForMeal(next: Workspace, meal: Task, from: string) {
  const choices = next.choices.filter(
    (choice) =>
      choice.date === from &&
      (choice.mealSourceId === meal.id || choice.mealSourceId === (meal.sourceTaskId ?? meal.id)),
  );
  const byGroup = new Map(choices.map((choice) => [choice.groupId, choice]));
  for (const choice of choices.filter((item) => item.mealSourceId === meal.id)) {
    byGroup.set(choice.groupId, choice);
  }
  return byGroup;
}

function choiceGroupIds(next: Workspace, mealId: string) {
  return new Set(
    next.ingredients
      .filter((ingredient) => ingredient.mealTaskId === mealId && ingredient.isChoice)
      .map((ingredient) => ingredient.groupId),
  );
}
