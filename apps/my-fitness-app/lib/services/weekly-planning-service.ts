import { monday } from "@/lib/domain/dates";
import { createTask, type Task } from "@/lib/domain/task";
import type { Workspace } from "@/lib/domain/workspace";

import { MealPlanningService } from "./meal-planning-service";
import { ShoppingListService } from "./shopping-list-service";
import { TaskService } from "./task-service";
export function quantityLabel(min: number | null, max: number | null, unit: string) {
  return min === null
    ? `Amount needed · ${unit}`
    : `${min === max ? String(min) : `${min}–${max}`} ${unit}`;
}
export class WeeklyPlanningService {
  constructor(
    private readonly meals: MealPlanningService = new MealPlanningService(),
    private readonly shopping: ShoppingListService = new ShoppingListService(),
    private readonly tasks: TaskService = new TaskService(),
  ) {}
  generate(workspace: Workspace, date: string): Workspace {
    const weekStart = monday(date);
    const rootId = `week:${weekStart}`;
    const next = structuredClone(workspace);
    const previousIds = new Set([
      rootId,
      ...this.tasks.descendants(next.tasks, rootId).map((t) => t.id),
    ]);
    const old = new Map(next.tasks.filter((t) => previousIds.has(t.id)).map((t) => [t.id, t]));
    const planned = this.meals.planWeek(next, weekStart);
    const shopping = this.shopping.aggregate(planned);
    const generated: Task[] = [
      createTask({
        date: weekStart,
        details: {
          generatedFrom: JSON.stringify(
            planned.map((m) => ({ id: m.taskId, ingredients: m.ingredients })),
          ),
          stale: false,
          type: "week",
          weekStart,
        },
        id: rootId,
        kind: "week",
        scope: "generated",
        title: `Week of ${weekStart}`,
      }),
    ];
    generated.push(
      createTask({
        date: weekStart,
        id: `${rootId}:cooking`,
        kind: "cooking",
        notes:
          "Derived from scheduled diet meals. Ready-to-eat meals are included; no cooking method is invented.",
        parentId: rootId,
        scope: "generated",
        title: "Meals to prepare this week",
      }),
    );
    generated.push(
      createTask({
        date: weekStart,
        id: `${rootId}:shopping`,
        kind: "shopping",
        notes:
          "Quantities follow the trainer’s plan. Choose alternatives and review unknown amounts before buying.",
        parentId: rootId,
        position: 1,
        scope: "generated",
        title: "Weekly shopping",
      }),
    );
    for (const [i, meal] of planned.entries())
      generated.push(
        createTask({
          date: weekStart,
          details: {
            lines: meal.ingredients.map(
              (i) => `${i.name} — ${quantityLabel(i.min, i.max, i.unit)}`,
            ),
            mealDate: meal.date,
            mealTaskId: meal.taskId,
            type: "cook",
            warnings: meal.ingredients.map((i) => i.warning).filter((s): s is string => !!s),
          },
          id: `${rootId}:cook:${meal.taskId}`,
          kind: "cook",
          parentId: `${rootId}:cooking`,
          position: i,
          scope: "generated",
          time: meal.time,
          title: `${meal.date} · ${meal.title}`,
        }),
      );
    for (const [i, item] of shopping.entries())
      generated.push(
        createTask({
          date: weekStart,
          details: {
            ingredientKey: item.key,
            occurrences: item.occurrences,
            quantityMax: item.max,
            quantityMin: item.min,
            sourceMeals: item.sourceMeals,
            type: "shopping",
            unit: item.unit,
            warnings: item.warnings,
          },
          id: `${rootId}:shop:${encodeURIComponent(item.key)}`,
          kind: "shopping_item",
          parentId: `${rootId}:shopping`,
          position: i,
          scope: "generated",
          title: item.name,
        }),
      );
    // Preserve checklist state only when the generated content is unchanged.
    for (const task of generated) {
      const previous = old.get(task.id);
      if (
        previous &&
        JSON.stringify(previous.details) === JSON.stringify(task.details) &&
        previous.title === task.title
      )
        task.status = previous.status;
    }
    next.tasks = next.tasks.filter((t) => !old.has(t.id));
    next.tasks.push(...generated);
    return next;
  }
}
