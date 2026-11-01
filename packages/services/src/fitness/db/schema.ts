import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
  foreignKey,
  index,
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import type { TaskDetails } from "../../types/task";

const owner = () => uuid("user_id").notNull();
const ownPolicy = (name: string) =>
  pgPolicy(name, {
    for: "all",
    to: "authenticated",
    using: sql`(select auth.uid()) = user_id`,
    withCheck: sql`(select auth.uid()) = user_id`,
  });
export const workspaces = pgTable(
  "task_workspaces",
  {
    leadMinutes: integer("lead_minutes").notNull().default(0),
    name: text("name").notNull(),
    proteinTarget: integer("protein_target").notNull(),
    reminders: boolean("reminders").notNull().default(false),
    revision: integer("revision").notNull().default(0),
    rotationStart: date("rotation_start").notNull(),
    timezone: text("timezone").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    userId: owner().primaryKey(),
    waterTarget: integer("water_target").notNull(),
  },
  () => [ownPolicy("task_workspaces_owner")],
).enableRLS();
export const tasks = pgTable(
  "fitness_tasks",
  {
    archived: boolean("archived").notNull().default(false),
    date: date("date"),
    details: jsonb("details").$type<TaskDetails>().notNull(),
    id: text("id").notNull(),
    kind: text("kind").notNull(),
    notes: text("notes").notNull().default(""),
    parentId: text("parent_id"),
    position: integer("position").notNull(),
    scope: text("scope").$type<"template" | "scheduled" | "generated">().notNull(),
    sourceTaskId: text("source_task_id"),
    status: text("status").$type<"pending" | "done" | "skipped">().notNull().default("pending"),
    time: text("time"),
    title: text("title").notNull(),
    userId: owner().references(() => workspaces.userId, {
      onDelete: "cascade",
    }),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.id] }),
    index("fitness_tasks_parent").on(t.userId, t.parentId),
    index("fitness_tasks_date").on(t.userId, t.date),
    foreignKey({
      columns: [t.userId, t.parentId],
      foreignColumns: [t.userId, t.id],
      name: "fitness_tasks_parent_fk",
    }),
    ownPolicy("fitness_tasks_owner"),
  ],
).enableRLS();
export const taskIngredients = pgTable(
  "task_meal_ingredients",
  {
    groupId: text("group_id").notNull(),
    id: text("id").notNull(),
    ingredientKey: text("ingredient_key").notNull(),
    isChoice: boolean("is_choice").notNull(),
    mealTaskId: text("meal_task_id").notNull(),
    name: text("name").notNull(),
    note: text("note").notNull(),
    optional: boolean("optional").notNull(),
    position: integer("position").notNull(),
    quantityMax: doublePrecision("quantity_max"),
    quantityMin: doublePrecision("quantity_min"),
    unit: text("unit").notNull(),
    userId: owner(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.id] }),
    foreignKey({
      columns: [t.userId, t.mealTaskId],
      foreignColumns: [tasks.userId, tasks.id],
    }).onDelete("cascade"),
    ownPolicy("task_ingredients_owner"),
  ],
).enableRLS();
export const schedules = pgTable(
  "task_schedules",
  {
    id: text("id").notNull(),
    taskId: text("task_id").notNull(),
    time: text("time").notNull(),
    userId: owner(),
    weekdays: integer("weekdays").array().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.id] }),
    foreignKey({
      columns: [t.userId, t.taskId],
      foreignColumns: [tasks.userId, tasks.id],
    }).onDelete("cascade"),
    ownPolicy("task_schedules_owner"),
  ],
).enableRLS();
export const rotations = pgTable(
  "task_diet_rotation",
  {
    position: integer("position").notNull(),
    taskId: text("task_id").notNull(),
    userId: owner(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.position] }),
    foreignKey({
      columns: [t.userId, t.taskId],
      foreignColumns: [tasks.userId, tasks.id],
    }).onDelete("cascade"),
    ownPolicy("task_rotation_owner"),
  ],
).enableRLS();
export const dayOverrides = pgTable(
  "task_day_overrides",
  {
    date: date("date").notNull(),
    dietTaskId: text("diet_task_id").notNull(),
    userId: owner().references(() => workspaces.userId, {
      onDelete: "cascade",
    }),
    workoutTaskId: text("workout_task_id"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.date] }), ownPolicy("task_overrides_owner")],
).enableRLS();
export const mealChoices = pgTable(
  "task_meal_choices",
  {
    date: date("date").notNull(),
    groupId: text("group_id").notNull(),
    id: text("id").notNull(),
    ingredientKey: text("ingredient_key").notNull(),
    mealSourceId: text("meal_source_id").notNull(),
    userId: owner().references(() => workspaces.userId, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.id] }), ownPolicy("task_choices_owner")],
).enableRLS();
export const weights = pgTable(
  "task_weight_entries",
  {
    date: date("date").notNull(),
    userId: owner().references(() => workspaces.userId, {
      onDelete: "cascade",
    }),
    value: doublePrecision("value").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.date] }), ownPolicy("task_weights_owner")],
).enableRLS();
export const taskRelations = relations(tasks, ({ one, many }) => ({
  children: many(tasks, { relationName: "taskTree" }),
  ingredients: many(taskIngredients),
  parent: one(tasks, {
    fields: [tasks.userId, tasks.parentId],
    references: [tasks.userId, tasks.id],
    relationName: "taskTree",
  }),
}));
export type TaskRecord = typeof tasks.$inferSelect;
export type NewTaskRecord = typeof tasks.$inferInsert;
