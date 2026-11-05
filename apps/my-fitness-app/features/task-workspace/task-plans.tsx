"use client";

import { Plus } from "lucide-react";

import { TaskService } from "@shared/services/fitness/task";
import type { Workspace } from "@shared/services/types";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Label } from "@shared/ui/label";
import { NativeSelect } from "@shared/ui/native-select";
import { RevealCard } from "@shared/ui/reveal-card";

import { TaskBranch, type TaskTreeProps } from "@/features/task-tree/task-tree";

const tasks = new TaskService();

export function TaskPlans({
  onCreate,
  selected,
  setSelected,
  state,
  tree,
}: {
  onCreate: () => void;
  selected: string | null;
  setSelected: (id: string | null) => void;
  state: Workspace;
  tree: Omit<TaskTreeProps, "depth" | "parentId" | "workspace">;
}) {
  const workspace = { ...state, tasks: state.tasks.filter((task) => task.scope === "template") };
  const plans = tasks.children(workspace.tasks, null);
  const current = plans.find((plan) => plan.id === selected);
  return (
    <section aria-labelledby="fitness-plans-heading" className="fitness-plans">
      <div className="fitness-plans-toolbar">
        <div>
          <h2 id="fitness-plans-heading">Your plans</h2>
          <p>Open a plan to view its subtasks and make changes.</p>
        </div>
        <div className="fitness-plans-controls">
          {plans.length > 1 && (
            <Label className="fitness-plan-filter">
              Filter plans
              <NativeSelect
                onChange={(event) => setSelected(event.target.value || null)}
                value={current?.id ?? ""}
              >
                <option value="">All plans</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title}
                  </option>
                ))}
              </NativeSelect>
            </Label>
          )}
          <Button
            className="fitness-new-task"
            disabled={tree.readOnly || tree.busy}
            onClick={onCreate}
            size="lg"
            type="button"
          >
            <Plus aria-hidden="true" />
            New task
          </Button>
        </div>
      </div>
      {plans.length === 0 ? (
        <Card className="fitness-plan-empty" interaction="static">
          <h3>No plans yet</h3>
          <p>
            {tree.readOnly
              ? "Plans will appear here when available."
              : "Create a task to start organizing your routine."}
          </p>
        </Card>
      ) : (
        <div className="fitness-plan-grid">
          {(current ? [current] : plans).map((plan) => {
            const count = tasks.children(workspace.tasks, plan.id).length;
            return (
              <RevealCard
                brief={plan.notes}
                className="fitness-plan"
                heading={
                  <>
                    <div className="fitness-plan-meta">
                      <Badge variant="secondary">{plan.kind.replaceAll("_", " ")}</Badge>
                      <span>
                        {count} {count === 1 ? "subtask" : "subtasks"}
                      </span>
                    </div>
                    <h3>{plan.title}</h3>
                  </>
                }
                key={plan.id}
                pinOnDetailsClick
                title={plan.title}
              >
                <TaskBranch {...tree} parentId={null} planRoot task={plan} workspace={workspace} />
              </RevealCard>
            );
          })}
        </div>
      )}
    </section>
  );
}
