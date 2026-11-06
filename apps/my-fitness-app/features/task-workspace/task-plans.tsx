"use client";

import { useLayoutEffect, useMemo, useState } from "react";

import { Layers, ListPlus, Pencil, Plus } from "lucide-react";

import { TaskService } from "@shared/services/fitness/task";
import type { Task, Workspace } from "@shared/services/types";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@shared/ui/carousel";
import { NativeSelect } from "@shared/ui/native-select";
import { Tooltip } from "@shared/ui/tooltip";

import type { TaskTreeProps } from "@/features/task-tree/task-tree";

import {
  canAddPlanSubtask,
  PlanTaskList,
  resolvePlanTaskPath,
  subtaskLabel,
} from "./plan-task-list";

const tasks = new TaskService();
const carouselOptions = { watchFocus: false };

type PlanEditing = Pick<TaskTreeProps, "busy" | "onAdd" | "onEdit" | "readOnly">;

function PlanActions({
  current,
  onCreate,
  tree,
}: {
  current?: Task;
  onCreate: () => void;
  tree: PlanEditing;
}) {
  const disabled = tree.readOnly || tree.busy;

  return (
    <fieldset aria-label="Plan actions" className="fitness-plan-actions">
      <Tooltip title="New task">
        <Button
          aria-label="New task"
          disabled={disabled}
          onClick={onCreate}
          size="icon-lg"
          type="button"
        >
          <Plus aria-hidden="true" />
        </Button>
      </Tooltip>
      {current && current.kind !== "day" && (
        <Tooltip title={`Edit ${current.title}`}>
          <Button
            aria-label={`Edit ${current.title}`}
            disabled={disabled}
            onClick={() => tree.onEdit(current)}
            size="icon-lg"
            type="button"
            variant="outline"
          >
            <Pencil aria-hidden="true" />
          </Button>
        </Tooltip>
      )}
      {current && canAddPlanSubtask(current) && (
        <Tooltip title="Add subtask">
          <Button
            aria-label="Add subtask"
            disabled={disabled}
            onClick={() => tree.onAdd(current)}
            size="icon-lg"
            type="button"
            variant="outline"
          >
            <ListPlus aria-hidden="true" />
          </Button>
        </Tooltip>
      )}
    </fieldset>
  );
}

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
  tree: PlanEditing;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [taskPath, setTaskPath] = useState<{ planId: string; ids: string[] } | null>(null);
  const templates = useMemo(
    () => state.tasks.filter((task) => task.scope === "template"),
    [state.tasks],
  );
  const plans = useMemo(() => tasks.children(templates, null), [templates]);
  const activeIndex = Math.max(
    0,
    plans.findIndex((plan) => plan.id === selected),
  );
  const plan = plans[activeIndex];
  const path = plan
    ? resolvePlanTaskPath(plan, taskPath?.planId === plan.id ? taskPath.ids : [], templates)
    : [];
  const current = path.at(-1);

  useLayoutEffect(() => {
    if (!api || !plans.length) return;

    const syncSlide = () => {
      if (api.selectedScrollSnap() !== activeIndex) api.scrollTo(activeIndex, true);
    };
    const selectPlan = () => {
      const index = api.selectedScrollSnap();
      if (index === activeIndex) return;
      setTaskPath(null);
      setSelected(plans[index]?.id ?? null);
    };

    syncSlide();
    api.on("select", selectPlan).on("reInit", syncSlide);
    return () => {
      api.off("select", selectPlan).off("reInit", syncSlide);
    };
  }, [activeIndex, api, plans, setSelected]);

  const toolbar = (
    <header className="fitness-plan-toolbar">
      <div className="fitness-plan-picker">
        <h2 id="fitness-plans-heading">Your plans</h2>
        {plan && plans.length > 1 && (
          <NativeSelect
            aria-label="Choose plan"
            onChange={(event) => {
              setTaskPath(null);
              setSelected(event.target.value);
            }}
            value={plan.id}
          >
            {plans.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </NativeSelect>
        )}
      </div>
      <PlanActions current={current} onCreate={onCreate} tree={tree} />
    </header>
  );

  return (
    <Card asChild backdrop="accent" interaction="static" layout="plain">
      <section aria-labelledby="fitness-plans-heading" className="fitness-plans">
        {plan && current ? (
          <Carousel
            aria-label="Plans"
            className="fitness-plan-content"
            opts={carouselOptions}
            setApi={setApi}
            tabIndex={0}
          >
            {toolbar}
            <CarouselContent className="ml-0">
              {plans.map((item, index) => (
                <CarouselItem
                  aria-hidden={index !== activeIndex}
                  className="pl-0"
                  inert={index !== activeIndex}
                  key={item.id}
                >
                  <div className="fitness-plan-summary">
                    <div>
                      <Badge variant="secondary">{item.kind.replaceAll("_", " ")}</Badge>
                      <h3>{item.title}</h3>
                      <p>{subtaskLabel(tasks.children(templates, item.id).length)}</p>
                    </div>
                    <span aria-hidden="true" className="fitness-plan-mark">
                      <Layers />
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <PlanTaskList
              busy={tree.busy}
              current={current}
              key={plan.id}
              onEdit={tree.onEdit}
              onNavigate={(nextPath) =>
                setTaskPath({ ids: nextPath.slice(1).map((task) => task.id), planId: plan.id })
              }
              path={path}
              plan={plan}
              readOnly={tree.readOnly}
              templates={templates}
            />
            {plans.length > 1 && (
              <nav aria-label="Plan pages" className="fitness-plan-paging">
                <CarouselPrevious aria-label="Previous plan" placement="inline" size="icon-lg" />
                <span role="status">
                  Plan {activeIndex + 1} of {plans.length}
                </span>
                <CarouselNext aria-label="Next plan" placement="inline" size="icon-lg" />
              </nav>
            )}
          </Carousel>
        ) : (
          <>
            {toolbar}
            <div className="fitness-plan-empty">
              <h3>No plans yet</h3>
              <p>
                {tree.readOnly
                  ? "Plans will appear here when available."
                  : "Create a task to start organizing your routine."}
              </p>
            </div>
          </>
        )}
      </section>
    </Card>
  );
}
