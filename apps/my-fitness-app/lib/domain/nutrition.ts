import { z } from "zod";
export const ingredientSchema = z
  .object({
    groupId: z.string().min(1).max(200),
    id: z.string().min(1).max(400),
    ingredientKey: z.string().min(1).max(200),
    isChoice: z.boolean(),
    mealTaskId: z.string().min(1).max(400),
    name: z.string().min(1).max(200),
    note: z.string().max(1000),
    optional: z.boolean(),
    position: z.number().int().nonnegative(),
    quantityMax: z.number().nonnegative().max(100000).nullable(),
    quantityMin: z.number().nonnegative().max(100000).nullable(),
    unit: z.string().min(1).max(40),
  })
  .refine(
    (i) => (i.quantityMin === null) === (i.quantityMax === null),
    "Both quantities must be known or unknown",
  )
  .refine((ingredient) => {
    if (ingredient.quantityMin === null) return true;
    return ingredient.quantityMax !== null && ingredient.quantityMax >= ingredient.quantityMin;
  }, "Maximum must be at least minimum");
export type MealIngredient = z.infer<typeof ingredientSchema>;
export const choiceSchema = z.object({
  date: z.iso.date(),
  groupId: z.string(),
  id: z.string(),
  ingredientKey: z.string(),
  mealSourceId: z.string(),
});
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
