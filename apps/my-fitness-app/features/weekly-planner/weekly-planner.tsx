"use client";
import { useMemo, useState } from "react";

import { RefreshCw, ShoppingBasket } from "lucide-react";

import { TaskTree } from "@/features/task-tree/task-tree";
import { dateLabel, monday } from "@/lib/domain/dates";
import type { Workspace } from "@/lib/domain/workspace";
import { MealPlanningService } from "@/lib/services/meal-planning-service";
import { TaskService } from "@/lib/services/task-service";
import { WeeklyPlanningService } from "@/lib/services/weekly-planning-service";

const meals = new MealPlanningService();
const weekly = new WeeklyPlanningService();
const tasks = new TaskService();
interface Props {
  busy: boolean;
  date: string;
  readOnly: boolean;
  update: (fn: (s: Workspace) => Workspace, label?: string) => void;
  workspace: Workspace;
}
export function WeeklyPlanner({ workspace, date, readOnly, busy, update }: Props) {
  const [mode, setMode] = useState<"shopping" | "cooking" | "choices">("shopping");
  const start = monday(date);
  const rootId = `week:${start}`;
  const saved = workspace.tasks.find((t) => t.id === rootId);
  const display = useMemo(
    () => (saved ? workspace : weekly.generate(workspace, start)),
    [workspace, start, saved],
  );
  const plan = useMemo(() => meals.planWeek(workspace, start), [workspace, start]);
  const unresolved = plan.reduce((sum, m) => sum + m.choices.filter((c) => !c.selected).length, 0);
  return (
    <>
      <section className="plan-banner">
        <ShoppingBasket />
        <div>
          <strong>Week of {dateLabel(start)}</strong>
          <p>
            {plan.length} meals · {unresolved} ingredient choices to make
          </p>
        </div>
        <button
          className="primary"
          disabled={readOnly || busy}
          onClick={() =>
            update((s) => weekly.generate(s, start), "Weekly cooking and shopping tasks generated")
          }
          type="button"
        >
          <RefreshCw size={15} />
          {saved ? "Regenerate" : "Save weekly tasks"}
        </button>
      </section>
      {!saved && (
        <p className="notice">
          {readOnly
            ? "Calculated from the owner’s live meal plan. The owner has not saved this week’s checklist yet."
            : "This is a calculated preview. Save weekly tasks to start checking off cooking and shopping."}
        </p>
      )}
      {saved?.details.type === "week" && saved.details.stale && (
        <p className="notice">
          Your plan changed. Regenerate to refresh this checklist. Completed items stay checked only
          when their contents are unchanged.
        </p>
      )}
      <div className="tabs wrap">
        {(["shopping", "cooking", "choices"] as const).map((m) => (
          <button
            className={mode === m ? "selected" : ""}
            key={m}
            onClick={() => setMode(m)}
            type="button"
          >
            {m === "shopping"
              ? "Shopping checklist"
              : m === "cooking"
                ? "Meals to prepare"
                : "Choose ingredients"}
          </button>
        ))}
      </div>
      {mode !== "choices" ? (
        <TaskTree
          busy={busy}
          onAdd={() => {
            /* Generated week rows are not created from this list. */
          }}
          onEdit={() => {
            /* Generated week rows are edited from the meal plan. */
          }}
          onSet={() => {
            /* Generated week rows do not log workout sets. */
          }}
          onStatus={(task, status) =>
            update(
              (s) => tasks.complete(s, task.id, status),
              status === "done" ? "Task completed" : "Task updated",
            )
          }
          parentId={`${rootId}:${mode}`}
          readOnly={readOnly || !saved}
          workspace={display}
        />
      ) : (
        <div className="meal-grid">
          {plan.map((meal) => (
            <section className="card" key={meal.taskId}>
              <span className="eyebrow">
                {dateLabel(meal.date)} · {meal.time}
              </span>
              <h2>{meal.title}</h2>
              <p className="hint">{meal.diet}</p>
              {meal.choices.length ? (
                meal.choices.map((choice) => (
                  <label key={choice.groupId}>
                    {choice.groupId}
                    <select
                      disabled={readOnly || busy}
                      onChange={(e) => {
                        const value = e.target.value;
                        update((s) => {
                          const next = structuredClone(s);
                          const id = `${meal.date}:${meal.sourceId}:${choice.groupId}`;
                          next.choices = next.choices.filter((c) => c.id !== id);
                          next.choices.push({
                            date: meal.date,
                            groupId: choice.groupId,
                            id,
                            ingredientKey: value,
                            mealSourceId: meal.sourceId,
                          });
                          return weekly.generate(next, start);
                        }, "Ingredient choice saved; weekly tasks refreshed");
                      }}
                      value={choice.selected ?? ""}
                    >
                      <option value="">Choose one…</option>
                      {choice.options.map((o) => (
                        <option key={o.id} value={o.ingredientKey}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ))
              ) : (
                <p>No alternatives to choose.</p>
              )}
            </section>
          ))}
        </div>
      )}
      <p className="hint space-top">
        Shopping includes only meal ingredients. Supplements and drinking water are not groceries
        here. Optional items are excluded. Salad composition, fruit type, drink amounts, and
        raw/cooked weight basis need your review where the trainer did not specify them.
      </p>
    </>
  );
}
