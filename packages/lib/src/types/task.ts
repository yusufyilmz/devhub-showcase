import type { z } from "zod";

import type { taskSchema } from "../schemas/task";

export type Task = z.infer<typeof taskSchema>;
export type TaskKind = Task["kind"];
export type TaskDetails = Task["details"];
export function createTask(input: Partial<Task> & Pick<Task, "id" | "kind" | "title">): Task {
  return {
    archived: false,
    date: null,
    details: { type: "basic" },
    notes: "",
    parentId: null,
    position: 0,
    scope: "template",
    sourceTaskId: null,
    status: "pending",
    time: null,
    ...input,
  };
}
export function defaultDetails(kind: TaskKind): TaskDetails {
  if (kind === "meal") return { type: "meal", waterMl: 0 };
  if (kind === "set") return { actualReps: null, targetReps: 12, type: "set", weightKg: null };
  if (kind === "supplement") return { amount: 0, type: "dose", unit: "g" };
  if (kind === "water") return { ml: 250, type: "water" };
  return { type: "basic" };
}
