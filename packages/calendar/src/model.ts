import { z } from "zod";

import { monday, shiftDate } from "@shared/utils/date";

export interface CalendarItem {
  completed?: boolean;
  date: string;
  description?: string;
  href?: string;
  id: string;
  source: "studio" | "google-calendar" | "google-tasks" | "fitness";
  sourceLabel?: string;
  time?: string;
  title: string;
  type: "event" | "task";
}

export type TaskDraft = z.infer<typeof taskDraftSchema>;

export const taskDraftSchema = z.strictObject({
  completed: z.boolean(),
  date: z.iso.date(),
  description: z.string().trim().max(2000),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable(),
  title: z.string().trim().min(1).max(160),
});

export const calendarRangeSchema = z
  .strictObject({
    from: z.iso.date(),
    timeZone: z
      .string()
      .min(1)
      .max(100)
      .refine((timeZone) => {
        try {
          new Intl.DateTimeFormat("en", { timeZone });
          return true;
        } catch {
          return false;
        }
      }),
    to: z.iso.date(),
  })
  .refine(({ from, to }) => from < to && to <= shiftDate(from, 42));

export function calendarRange(date: string) {
  const from = monday(`${date.slice(0, 7)}-01`);
  return { from, to: shiftDate(from, 42) };
}
