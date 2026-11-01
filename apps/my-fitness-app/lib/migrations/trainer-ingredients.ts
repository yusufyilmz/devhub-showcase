import type { MealIngredient } from "@/lib/domain/nutrition";
/** Exact provided amounts only; null means the trainer did not specify an amount. */
export function trainerIngredients(): MealIngredient[] {
  const items: MealIngredient[] = [];
  const add = (
    meal: string,
    group: string,
    name: string,
    min: number | null,
    unit: string,
    options: {
      max?: number | null;
      choice?: boolean;
      optional?: boolean;
      note?: string;
      key?: string;
    } = {},
  ) => {
    const key = options.key ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    items.push({
      groupId: group,
      id: `${meal}:${group}:${key}`,
      ingredientKey: key,
      isChoice: options.choice ?? false,
      mealTaskId: meal,
      name,
      note: options.note ?? "",
      optional: options.optional ?? false,
      position: items.filter((i) => i.mealTaskId === meal).length,
      quantityMax: options.max === undefined ? min : options.max,
      quantityMin: min,
      unit,
    });
  };
  const choices = (
    meal: string,
    group: string,
    names: string[],
    qty: number | null,
    unit: string,
    note = "",
  ) =>
    names.forEach((name) => {
      add(meal, group, name, qty, unit, { choice: true, note });
    });
  for (const [meal, eggs] of [
    ["y1-breakfast", 3],
    ["y2-breakfast", 4],
  ] as const) {
    add(meal, "eggs", "Whole eggs", eggs, "piece");
    if (meal === "y1-breakfast") add(meal, "cheese", "Mozzarella", 30, "g");
    add(meal, "blend", "Turmeric, matcha and maca blend", 1, "level tbsp", {
      note: "Combined mixture amount; the ratio of each ingredient was not supplied.",
    });
    add(meal, "pepper", "Pepper", 1, "pinch");
    choices(
      meal,
      "drink",
      meal === "y1-breakfast"
        ? ["Coffee", "Coffee with plant milk"]
        : ["Coffee", "Coffee with plant milk", "Tea"],
      null,
      "portion",
      "Drink amount not specified. Add plant milk and stevia as needed.",
    );
  }
  choices(
    "y1-lunch",
    "protein",
    ["Chicken", "Turkey", "Fish", "Beef"],
    250,
    "g",
    "Raw/cooked basis not specified.",
  );
  choices(
    "y1-lunch",
    "carb",
    ["Quinoa", "Basmati rice", "Couscous"],
    125,
    "g",
    "Raw/cooked basis not specified.",
  );
  add("y1-snack", "bread", "Thins bread", 1, "sandwich portion", {
    note: "Bread needed for one sandwich; slice count not supplied.",
  });
  choices(
    "y1-snack",
    "filling",
    ["Mozzarella", "Turkey", "Chicken", "Tuna", "Salmon"],
    null,
    "portion",
    "Sandwich filling amount not supplied.",
  );
  add("y1-snack", "gelatin", "Sugar-free gelatin", 1, "unit", { max: 2 });
  choices(
    "y1-snack",
    "drink",
    ["Coffee", "Coffee with plant milk", "Tea"],
    null,
    "portion",
    "Drink amount not supplied. Add stevia as needed.",
  );
  for (const meal of ["y1-dinner", "y2-dinner"]) {
    choices(
      meal,
      "soup",
      ["Gazpacho", "Creamy vegetable soup"],
      1,
      meal === "y2-dinner" ? "large cup" : "cup",
    );
    add(
      meal,
      "salad",
      meal === "y1-dinner" ? "Salad: choose 3 ingredients" : "Salad: choose 4 ingredients",
      null,
      "portion",
      {
        note: "Salad ingredients and quantities must be chosen; no amount is invented.",
      },
    );
    add(meal, "gelatin", "Sugar-free gelatin", 2, "unit");
  }
  choices(
    "y1-dinner",
    "protein",
    ["Chicken", "Turkey", "Fish", "Beef"],
    250,
    "g",
    "Raw/cooked basis not specified.",
  );
  add("y2-lunch", "salad", "Salad of choice", null, "portion", {
    note: "Choose salad ingredients and quantities.",
  });
  add("y2-snack", "yogurt", "Low-fat yogurt", 2, "unit");
  add("y2-snack", "fruit", "Fruit of choice", 1, "piece", {
    note: "Choose the type of fruit.",
  });
  return items;
}
