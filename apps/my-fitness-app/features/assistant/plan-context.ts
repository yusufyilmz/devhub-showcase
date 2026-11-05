import type { FitnessAssistantRequest } from "@shared/assistant/fitness-contract";
import { TaskService } from "@shared/services/fitness/task";
import type { Task, Workspace } from "@shared/services/types";

const tasks = new TaskService();
export function canSuggestSubtasks(task: Task) {
  return !["set", "supplement", "water"].includes(task.kind);
}

export function reminderTasks(templates: Task[], plan: Task) {
  return [plan, ...tasks.descendants(templates, plan.id)].filter((task) =>
    ["workout", "supplement", "water"].includes(task.kind),
  );
}

export function assistantContext(state: Workspace, input: FitnessAssistantRequest) {
  const templates = state.tasks.filter((task) => task.scope === "template");
  const plan = tasks.children(templates, null).find((task) => task.id === input.planId);
  if (!plan) return null;
  if (input.mode === "NOTIFICATIONS") {
    const task = reminderTasks(templates, plan).find((item) => item.id === input.taskId);
    if (!task) return null;
    const schedule = state.schedules.find((item) => item.taskId === task.id);
    return {
      goal: input.goal,
      task: {
        kind: task.kind,
        time: schedule?.time ?? task.time,
        weekdays: schedule?.weekdays ?? [],
      },
      timezone: state.settings.timezone,
    };
  }
  if (!canSuggestSubtasks(plan)) return null;
  const descendants = tasks.descendants(templates, plan.id);
  return {
    goal: input.goal,
    plan: { kind: plan.kind, notes: plan.notes.slice(0, 1200), title: plan.title },
    remainingTasks: Math.max(0, descendants.length - 30),
    tasks: descendants.slice(0, 30).map(({ kind, title }) => ({ kind, title })),
  };
}
