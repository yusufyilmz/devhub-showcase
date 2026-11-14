"use client";
import { useMemo } from "react";

import { RefreshCw, ShoppingBasket } from "lucide-react";

import { TaskService } from "@shared/lib/fitness";
import { MealPlanningService, WeeklyPlanningService } from "@shared/lib/meal";
import type { Workspace } from "@shared/lib/types";
import { dateLabel, monday } from "@shared/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Button as LibraryButton } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { EmptyState } from "@shared/ui/empty-state";
import { Label as LibraryLabel } from "@shared/ui/label";
import { NativeSelect as LibraryNativeSelect } from "@shared/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { Eyebrow } from "@shared/ui/typography";

import { TaskTree } from "@/features/task-tree/task-tree";

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
      <Card
        asChild
        className="fitness-week-summary [&_+_[data-slot='alert']]:[margin-top:12px]"
        interaction="static"
        layout="plain"
      >
        <section>
          <ShoppingBasket aria-hidden="true" />
          <div>
            <h2>Week of {dateLabel(start)}</h2>
            <p>
              {plan.length} meals · {unresolved} ingredient choices to make
            </p>
          </div>
          <LibraryButton
            className="fitness-primary [color:var(--on-primary)]"
            disabled={readOnly || busy}
            onClick={() =>
              update(
                (s) => weekly.generate(s, start),
                "Weekly cooking and shopping tasks generated",
              )
            }
            size="lg"
            type="button"
          >
            <RefreshCw size={15} />
            {saved ? "Regenerate" : "Save weekly tasks"}
          </LibraryButton>
        </section>
      </Card>
      {!saved && (
        <Alert>
          <AlertTitle>Weekly preview</AlertTitle>
          <AlertDescription>
            {readOnly
              ? "Calculated from the demo meal plan. Weekly tasks are read-only here."
              : "Save weekly tasks to start checking off cooking and shopping."}
          </AlertDescription>
        </Alert>
      )}
      {saved?.details.type === "week" && saved.details.stale && (
        <Alert>
          <AlertTitle>Weekly checklist needs a refresh</AlertTitle>
          <AlertDescription>
            Regenerate the checklist after a plan change. Completed items stay checked when their
            contents are unchanged.
          </AlertDescription>
        </Alert>
      )}
      <Tabs
        className="fitness-week-tabs [margin-top:16px] [&_[data-slot='tabs-list']]:[justify-content:flex-start] [&_[data-slot='tabs-trigger']]:[min-height:36px] [&_[data-slot='tabs-trigger'][data-state='active']]:[color:var(--ink)] max-[700px]:[&_[data-slot='tabs-list']]:[display:grid] max-[700px]:[&_[data-slot='tabs-trigger']]:[height:100%]"
        defaultValue="shopping"
      >
        <TabsList aria-label="Weekly plan">
          <TabsTrigger value="shopping">Shopping checklist</TabsTrigger>
          <TabsTrigger value="cooking">Meals to prepare</TabsTrigger>
          <TabsTrigger value="choices">Choose ingredients</TabsTrigger>
        </TabsList>
        {(["shopping", "cooking"] as const).map((mode) => (
          <TabsContent key={mode} value={mode}>
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
          </TabsContent>
        ))}
        <TabsContent value="choices">
          {plan.length === 0 ? (
            <EmptyState
              description="Add meals to your plan to choose ingredients here."
              height="auto"
              title="No meals this week"
            />
          ) : (
            <div className="meal-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:20px] max-[950px]:[gap:15px] max-[700px]:[grid-template-columns:1fr]">
              {plan.map((meal) => (
                <Card
                  asChild
                  className="fitness-shared-panel [padding:clamp(16px,_3vw,_24px)]"
                  interaction="static"
                  key={meal.taskId}
                  layout="plain"
                >
                  <section>
                    <Eyebrow as="span">
                      {dateLabel(meal.date)} · {meal.time}
                    </Eyebrow>
                    <h2>{meal.title}</h2>
                    <p className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)]">
                      {meal.diet}
                    </p>
                    {meal.choices.length ? (
                      meal.choices.map((choice) => (
                        <LibraryLabel key={choice.groupId} unstyled>
                          {choice.groupId}
                          <LibraryNativeSelect
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
                            unstyled
                            value={choice.selected ?? ""}
                          >
                            <option value="">Choose one…</option>
                            {choice.options.map((o) => (
                              <option key={o.id} value={o.ingredientKey}>
                                {o.name}
                              </option>
                            ))}
                          </LibraryNativeSelect>
                        </LibraryLabel>
                      ))
                    ) : (
                      <p>No alternatives to choose.</p>
                    )}
                  </section>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <p className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)] space-top [margin-top:30px]">
        Shopping includes only meal ingredients. Supplements and drinking water are not groceries
        here. Optional items are excluded. Salad composition, fruit type, drink amounts, and
        raw/cooked weight basis need your review where the trainer did not specify them.
      </p>
    </>
  );
}
