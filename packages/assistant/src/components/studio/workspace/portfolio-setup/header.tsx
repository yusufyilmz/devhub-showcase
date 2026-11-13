import type { Ref } from "react";

import { DialogDescription, DialogTitle } from "@shared/ui/dialog";

import { progressSteps, type SetupPosition, sections, stages } from "./steps";

export function SetupHeader({
  heading,
  position,
}: {
  heading: Ref<HTMLHeadingElement>;
  position: SetupPosition;
}) {
  const { stage, section } = position;
  const index = stage === 3 ? 3 + section : stage === 4 ? progressSteps.length - 1 : stage;
  const copy = stages[stage] ?? stages[0];
  return (
    <header className="portfolio-setup-header">
      <p className="eyebrow">
        Step {index + 1} of {progressSteps.length}
      </p>
      <DialogTitle ref={heading} tabIndex={-1}>
        {stage === 3 ? sections[section]?.title : copy.title}
      </DialogTitle>
      <DialogDescription>
        {stage === 3 && section > 0
          ? "Optional. You can return to this section later."
          : copy.description}
      </DialogDescription>
      <ol aria-label="Setup progress" className="portfolio-setup-progress">
        {progressSteps.map((label, step) => (
          <li
            aria-current={step === index ? "step" : undefined}
            data-reached={step <= index}
            key={label}
          >
            {label}
          </li>
        ))}
      </ol>
    </header>
  );
}
