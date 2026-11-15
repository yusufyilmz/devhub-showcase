import { z } from "zod";

import type { TaskDetails, TaskKind } from "../types/task";
export const taskKinds = [
  "day",
  "category",
  "diet",
  "gym",
  "workout",
  "superset",
  "exercise",
  "set",
  "meal",
  "supplement",
  "water",
  "week",
  "cooking",
  "cook",
  "shopping",
  "shopping_item",
] as const;

export const taskKindSchema = z.enum(taskKinds);

export const dateSchema = z.iso.date();
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const taskDetailsSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("basic") }),
  // Existing standalone Fitness OS workspaces store these JSON shapes.
  z.object({ postponed: z.boolean(), type: z.literal("workout") }),
  z.object({
    legacySets: z
      .array(
        z.object({
          actualReps: z.number().int().min(0).max(200).nullable(),
          archived: z.boolean(),
          id: z.string(),
          notes: z.string(),
          status: z.enum(["pending", "done", "skipped"]),
          targetReps: z.number().int().min(1).max(200),
          title: z.string(),
          weightKg: z.number().min(0).max(1500).nullable(),
        }),
      )
      .max(1000),
    prescription: z.string().max(4000),
    type: z.literal("exercise"),
  }),
  z.object({ type: z.literal("meal"), waterMl: z.number().min(0).max(10000) }),
  z.object({
    actualReps: z.number().int().min(0).max(200).nullable(),
    targetReps: z.number().int().min(1).max(200),
    type: z.literal("set"),
    weightKg: z.number().min(0).max(1500).nullable(),
  }),
  z.object({
    amount: z.number().min(0).max(10000),
    type: z.literal("dose"),
    unit: z.string().min(1).max(30),
  }),
  z.object({ ml: z.number().min(0).max(10000), type: z.literal("water") }),
  z.object({
    lines: z.array(z.string()),
    mealDate: dateSchema,
    mealTaskId: z.string(),
    type: z.literal("cook"),
    warnings: z.array(z.string()),
  }),
  z.object({
    ingredientKey: z.string(),
    occurrences: z.number().int().positive(),
    quantityMax: z.number().nonnegative().nullable(),
    quantityMin: z.number().nonnegative().nullable(),
    sourceMeals: z.array(z.string()),
    type: z.literal("shopping"),
    unit: z.string(),
    warnings: z.array(z.string()),
  }),
  z.object({
    generatedFrom: z.string(),
    stale: z.boolean(),
    type: z.literal("week"),
    weekStart: dateSchema,
  }),
]);
export const taskSchema = z.object({
  archived: z.boolean(),
  date: dateSchema.nullable(),
  details: taskDetailsSchema,
  id: z.string().min(1).max(400),
  kind: taskKindSchema,
  notes: z.string().max(4000),
  parentId: z.string().max(400).nullable(),
  position: z.number().int().min(0),
  scope: z.enum(["template", "scheduled", "generated"]),
  sourceTaskId: z.string().max(400).nullable(),
  status: z.enum(["pending", "done", "skipped"]),
  time: timeSchema.nullable(),
  title: z.string().min(1).max(200),
});

export const taskDetailTypes: Partial<Record<TaskKind, TaskDetails["type"]>> = {
  cook: "cook",
  meal: "meal",
  set: "set",
  shopping_item: "shopping",
  supplement: "dose",
  water: "water",
  week: "week",
};
