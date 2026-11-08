import type { z } from "zod";

import type { choiceSchema, ingredientSchema } from "../schemas/nutrition";

export type MealIngredient = z.infer<typeof ingredientSchema>;
export type MealChoice = z.infer<typeof choiceSchema>;

export interface ResolvedIngredient {
  key: string;
  max: number | null;
  min: number | null;
  name: string;
  sourceMeal: string;
  unit: string;
  warning: string | null;
}
export interface PlannedMeal {
  choices: {
    groupId: string;
    options: MealIngredient[];
    selected: string | null;
  }[];
  date: string;
  diet: string;
  ingredients: ResolvedIngredient[];
  sourceId: string;
  taskId: string;
  time: string | null;
  title: string;
}
