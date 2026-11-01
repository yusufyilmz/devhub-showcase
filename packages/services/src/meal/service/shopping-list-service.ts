import type { PlannedMeal } from "../../types/nutrition";
export interface ShoppingItem {
  key: string;
  max: number | null;
  min: number | null;
  name: string;
  occurrences: number;
  sourceMeals: string[];
  unit: string;
  warnings: string[];
}
export class ShoppingListService {
  aggregate(meals: PlannedMeal[]): ShoppingItem[] {
    const map = new Map<string, ShoppingItem>();
    for (const meal of meals) {
      for (const ingredient of meal.ingredients) addShoppingIngredient(map, ingredient);
    }
    return [...map.values()].sort(
      (a, b) => a.name.localeCompare(b.name) || a.unit.localeCompare(b.unit),
    );
  }
}

function addShoppingIngredient(
  map: Map<string, ShoppingItem>,
  ingredient: PlannedMeal["ingredients"][number],
) {
  // Unknown quantities and unresolved choices never merge into known totals.
  const key = JSON.stringify([
    ingredient.key,
    ingredient.unit,
    ingredient.min === null ? "unknown" : "known",
  ]);
  const existing = map.get(key);
  if (!existing) {
    map.set(key, {
      key,
      max: ingredient.max,
      min: ingredient.min,
      name: ingredient.name,
      occurrences: 1,
      sourceMeals: [ingredient.sourceMeal],
      unit: ingredient.unit,
      warnings: ingredient.warning ? [ingredient.warning] : [],
    });
    return;
  }
  mergeKnownQuantity(existing, ingredient);
  existing.occurrences++;
  existing.sourceMeals.push(ingredient.sourceMeal);
  if (ingredient.warning && !existing.warnings.includes(ingredient.warning))
    existing.warnings.push(ingredient.warning);
}

function mergeKnownQuantity(
  existing: ShoppingItem,
  ingredient: PlannedMeal["ingredients"][number],
) {
  if (existing.min === null || ingredient.min === null) return;
  if (existing.max === null || ingredient.max === null) return;
  existing.min += ingredient.min;
  existing.max += ingredient.max;
}
