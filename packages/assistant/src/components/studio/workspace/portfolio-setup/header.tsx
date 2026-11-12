import type { Ref } from "react";

import { DialogDescription, DialogTitle } from "@shared/ui/dialog";

import { stages } from "./steps";

export function SetupHeader({
  heading,
  stage,
}: {
  heading: Ref<HTMLHeadingElement>;
  stage: number;
}) {
  const copy = stages[stage] ?? stages[0];
  return (
    <header className="portfolio-setup-header">
      <p className="eyebrow">
        Step {stage + 1} of {stages.length}
      </p>
      <DialogTitle ref={heading} tabIndex={-1}>
        {copy.title}
      </DialogTitle>
      <DialogDescription>{copy.description}</DialogDescription>
      <ol aria-label="Setup progress" className="portfolio-setup-progress">
        {stages.map(({ label }, index) => (
          <li
            aria-current={index === stage ? "step" : undefined}
            data-reached={index <= stage}
            key={label}
          >
            {label}
          </li>
        ))}
      </ol>
    </header>
  );
}
