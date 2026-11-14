import { type Ref, useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@shared/ui/button";
import { DialogDescription, DialogTitle } from "@shared/ui/dialog";
import { Eyebrow } from "@shared/ui/typography";

import { progressSteps, type SetupPosition, sections, stages } from "./steps";

export function SetupHeader({
  heading,
  position,
}: {
  heading: Ref<HTMLHeadingElement>;
  position: SetupPosition;
}) {
  const { stage, section } = position;
  const index = stage === 2 ? 2 + section : stage === 3 ? progressSteps.length - 1 : stage;
  const copy = stages[stage] ?? stages[0];
  return (
    <header className="grid gap-2 border-b border-border p-6 pe-[max(3rem,1.5rem)] [&_[data-slot=dialog-title]]:text-[clamp(1.375rem,4vw,2rem)]">
      <Eyebrow>
        Step {index + 1} of {progressSteps.length}
      </Eyebrow>
      <DialogTitle ref={heading} tabIndex={-1}>
        {stage === 2 ? sections[section]?.title : copy.title}
      </DialogTitle>
      <DialogDescription>
        {stage === 2 && section > 0
          ? "Optional. You can return to this section later."
          : copy.description}
      </DialogDescription>
      <SetupProgress active={index} />
    </header>
  );
}

function SetupProgress({ active }: { active: number }) {
  const list = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ end: false, start: false });

  const readEdges = useCallback(() => {
    const element = list.current;
    if (!element) return;
    const start = element.scrollLeft > 1;
    const end = element.scrollLeft + element.clientWidth < element.scrollWidth - 1;
    setEdges((previous) =>
      previous.start === start && previous.end === end ? previous : { end, start },
    );
  }, []);

  useEffect(() => {
    const element = list.current;
    if (!element) return;
    const item = element.children.item(active);
    if (item instanceof HTMLElement) {
      const left = item.offsetLeft - (element.clientWidth - item.offsetWidth) / 2;
      element.scrollTo({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        left,
      });
    }
    readEdges();
    const observer = new ResizeObserver(readEdges);
    observer.observe(element);
    return () => observer.disconnect();
  }, [active, readEdges]);

  function scroll(direction: -1 | 1) {
    const element = list.current;
    if (!element) return;
    element.scrollBy({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      left: direction * Math.max(140, element.clientWidth * 0.6),
    });
  }

  return (
    <div className="group relative mt-2 -ms-6 -me-[max(3rem,1.5rem)] min-w-0">
      <Button
        aria-label="Previous setup steps"
        className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 bg-card opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 data-[edge=end]:right-0 data-[edge=start]:left-0"
        data-edge="start"
        hidden={!edges.start}
        onClick={() => scroll(-1)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      <ol
        aria-label="Setup progress"
        className="m-0 flex w-full list-none flex-nowrap overflow-x-auto px-3 [&::-webkit-scrollbar]:hidden"
        onScroll={readEdges}
        ref={list}
      >
        {progressSteps.map((label, step) => (
          <li
            aria-current={step === active ? "step" : undefined}
            className="flex-[1_0_auto] border-b-2 border-border px-3 py-1.5 text-center text-xs whitespace-nowrap text-muted-foreground data-[reached=true]:border-primary aria-[current=step]:font-semibold aria-[current=step]:text-foreground"
            data-reached={step <= active}
            key={label}
          >
            {label}
          </li>
        ))}
      </ol>
      <Button
        aria-label="Next setup steps"
        className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 bg-card opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 data-[edge=end]:right-0 data-[edge=start]:left-0"
        data-edge="end"
        hidden={!edges.end}
        onClick={() => scroll(1)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </div>
  );
}
