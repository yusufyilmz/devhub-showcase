"use client";

import { useLayoutEffect, useMemo, useState } from "react";

import { Layers, Plus } from "lucide-react";

import { TaskService } from "@shared/services/fitness/task";
import type { Workspace } from "@shared/services/types";
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

import type { TaskTreeProps } from "@/features/task-tree/task-tree";

import { PlanTaskList, subtaskLabel } from "./plan-task-list";

const tasks = new TaskService();
const carouselOptions = { watchFocus: false };

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
  tree: Pick<TaskTreeProps, "busy" | "onAdd" | "onEdit" | "readOnly">;
}) {
  const [api, setApi] = useState<CarouselApi>();
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

  useLayoutEffect(() => {
    if (!api || !plans.length) return;

    const syncSlide = () => {
      if (api.selectedScrollSnap() !== activeIndex) api.scrollTo(activeIndex, true);
    };
    const selectPlan = () => setSelected(plans[api.selectedScrollSnap()]?.id ?? null);

    syncSlide();
    api.on("select", selectPlan).on("reInit", syncSlide);
    return () => {
      api.off("select", selectPlan).off("reInit", syncSlide);
    };
  }, [activeIndex, api, plans, setSelected]);

  return (
    <section aria-labelledby="fitness-plans-heading" className="fitness-plans">
      <div className="fitness-plans-toolbar">
        <h2 id="fitness-plans-heading">Your plans</h2>
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
      {plan ? (
        <>
          <Carousel aria-label="Plans" opts={carouselOptions} setApi={setApi} tabIndex={0}>
            {plans.length > 1 && (
              <div className="fitness-plan-navigation">
                <NativeSelect
                  aria-label="Choose plan"
                  onChange={(event) => setSelected(event.target.value)}
                  value={plan.id}
                >
                  {plans.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </NativeSelect>
                <div className="fitness-plan-paging">
                  <span role="status">
                    Plan {activeIndex + 1} of {plans.length}
                  </span>
                  <CarouselPrevious aria-label="Previous plan" placement="inline" size="icon-lg" />
                  <CarouselNext aria-label="Next plan" placement="inline" size="icon-lg" />
                </div>
              </div>
            )}
            <CarouselContent className="ml-0">
              {plans.map((item, index) => (
                <CarouselItem
                  aria-hidden={index !== activeIndex}
                  className="pl-0"
                  inert={index !== activeIndex}
                  key={item.id}
                >
                  <Card className="fitness-plan-summary" interaction="static" layout="plain">
                    <div>
                      <Badge variant="secondary">{item.kind.replaceAll("_", " ")}</Badge>
                      <h3>{item.title}</h3>
                      <p>{subtaskLabel(tasks.children(templates, item.id).length)}</p>
                    </div>
                    <span aria-hidden="true" className="fitness-plan-mark">
                      <Layers />
                    </span>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <PlanTaskList {...tree} key={plan.id} plan={plan} templates={templates} />
        </>
      ) : (
        <Card className="fitness-plan-empty" interaction="static">
          <h3>No plans yet</h3>
          <p>
            {tree.readOnly
              ? "Plans will appear here when available."
              : "Create a task to start organizing your routine."}
          </p>
        </Card>
      )}
    </section>
  );
}
