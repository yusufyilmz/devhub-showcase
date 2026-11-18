import { z } from "zod";

import { type CalendarItem, taskDraftSchema } from "@shared/calendar";

export type StudioTask = CalendarItem & { source: "studio"; type: "task"; revision: number };

export interface CalendarData {
  connection: "connected" | "disconnected" | "expired" | "unavailable";
  items: CalendarItem[];
  tasks: StudioTask[];
  warnings: string[];
}

const existingTask = { id: z.uuid(), revision: z.number().int().positive().max(2147483646) };

export const taskMutation = z.discriminatedUnion("action", [
  z.strictObject({ action: z.literal("create"), draft: taskDraftSchema }),
  z.strictObject({ action: z.literal("update"), draft: taskDraftSchema, ...existingTask }),
  z.strictObject({ action: z.literal("delete"), ...existingTask }),
]);
