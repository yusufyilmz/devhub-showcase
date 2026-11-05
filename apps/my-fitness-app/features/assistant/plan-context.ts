import type { FitnessAssistantRequest } from "@shared/assistant/fitness-contract";
import { TaskService } from "@shared/services/fitness/task";
import type { Task, Workspace } from "@shared/services/types";

const tasks = new TaskService();
export function canSuggestSubtasks(task: Task) {
  return !["set", "supplement", "water"].includes(task.kind);
}

export function planTasks(templates: Task[], plan: Task) {
  return [plan, ...tasks.descendants(templates, plan.id)];
}

export function workoutTarget(task: Task) {
  return ["gym", "workout", "superset", "exercise"].includes(task.kind);
}

export function reminderTarget(task: Task) {
  return ["workout", "supplement", "water"].includes(task.kind);
}

export function assistantContext(state: Workspace, input: FitnessAssistantRequest) {
  const templates = state.tasks.filter((task) => task.scope === "template");
  const plan = tasks.children(templates, null).find((task) => task.id === input.planId);
  if (!plan) return null;
  if (input.mode === "FITNESS") return plannerContext(templates, plan, input.goal);
  const task = planTasks(templates, plan).find((item) => item.id === input.taskId);
  if (!task) return null;
  if (input.mode === "NOTIFICATIONS") {
    if (!reminderTarget(task)) return null;
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
  if (input.mode === "WORKOUT" && !workoutTarget(task)) return null;
  if (input.mode === "TASK_EDIT" && task.kind === "day") return null;
  return {
    children: tasks
      .children(templates, task.id)
      .slice(0, 25)
      .map(({ kind, title, details }) => ({
        kind,
        targetReps: details.type === "set" ? details.targetReps : null,
        title,
      })),
    goal: input.goal,
    task: {
      kind: task.kind,
      notes: task.notes.slice(0, 1500),
      targetReps: task.details.type === "set" ? task.details.targetReps : null,
      title: task.title,
    },
  };
}

function plannerContext(templates: Task[], plan: Task, goal: string) {
  if (!canSuggestSubtasks(plan)) return null;
  const descendants = tasks.descendants(templates, plan.id);
  return {
    goal,
    plan: { kind: plan.kind, notes: plan.notes.slice(0, 1200), title: plan.title },
    remainingTasks: Math.max(0, descendants.length - 30),
    tasks: descendants.slice(0, 30).map(({ kind, title }) => ({ kind, title })),
  };
}
