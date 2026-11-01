import { asc, eq } from "drizzle-orm";

import type { Transaction } from "@/lib/db/client";
import {
  dayOverrides,
  mealChoices,
  rotations,
  schedules,
  taskIngredients,
  weights,
} from "@/lib/db/schema";

import type { PlanningRecords, PlanningRepository } from "./planning-repository";
export class DrizzlePlanningRepository implements PlanningRepository {
  constructor(private readonly db: Transaction) {}
  async load(userId: string): Promise<PlanningRecords> {
    const [ingredients, scheduleRows, choices, overrides, weightRows, rotationRows] =
      await Promise.all([
        this.db.select().from(taskIngredients).where(eq(taskIngredients.userId, userId)),
        this.db.select().from(schedules).where(eq(schedules.userId, userId)),
        this.db.select().from(mealChoices).where(eq(mealChoices.userId, userId)),
        this.db.select().from(dayOverrides).where(eq(dayOverrides.userId, userId)),
        this.db.select().from(weights).where(eq(weights.userId, userId)),
        this.db
          .select()
          .from(rotations)
          .where(eq(rotations.userId, userId))
          .orderBy(asc(rotations.position)),
      ]);
    return {
      choices,
      ingredients,
      overrides,
      rotation: rotationRows.map((r) => r.taskId),
      schedules: scheduleRows,
      weights: weightRows,
    };
  }
  async replace(userId: string, data: PlanningRecords) {
    if (data.ingredients.length)
      for (let i = 0; i < data.ingredients.length; i += 200)
        await this.db
          .insert(taskIngredients)
          .values(data.ingredients.slice(i, i + 200).map((v) => ({ ...v, userId })));
    if (data.schedules.length)
      await this.db.insert(schedules).values(data.schedules.map((v) => ({ ...v, userId })));
    if (data.choices.length)
      for (let i = 0; i < data.choices.length; i += 200)
        await this.db
          .insert(mealChoices)
          .values(data.choices.slice(i, i + 200).map((v) => ({ ...v, userId })));
    if (data.overrides.length)
      await this.db.insert(dayOverrides).values(data.overrides.map((v) => ({ ...v, userId })));
    if (data.weights.length)
      await this.db.insert(weights).values(data.weights.map((v) => ({ ...v, userId })));
    if (data.rotation.length)
      await this.db.insert(rotations).values(
        data.rotation.map((taskId, position) => ({
          position,
          taskId,
          userId,
        })),
      );
  }
}
