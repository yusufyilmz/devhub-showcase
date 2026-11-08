"use client";
import "./workflow.css";

import { portfolioTypes } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Flex } from "@shared/ui/flex";
import { SelectField } from "@shared/ui/forms";

import { PortfolioTypePicker } from "./portfolio-type-picker";
import type { GuidedOnboardingProps, SetupNavigationProps } from "./types";

export const setupStages = [
  { id: "work", label: "Work" },
  { id: "layout", label: "Layout" },
  { id: "start", label: "Start" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
] as const;

export type SetupStage = (typeof setupStages)[number]["id"];

function SetupSteps({
  current,
  reached,
  onSelect,
}: {
  current: SetupStage;
  reached: number;
  onSelect: (stage: SetupStage) => void;
}) {
  const index = setupStages.findIndex((stage) => stage.id === current);
  return (
    <ol aria-label="Setup steps" className="setup-steps">
      {setupStages.map((stage, stageIndex) => (
        <li key={stage.id}>
          <Button
            aria-current={stage.id === current ? "step" : undefined}
            disabled={stageIndex > reached}
            onClick={() => onSelect(stage.id)}
            type="button"
            variant={stage.id === current ? "default" : "outline"}
          >
            {stageIndex + 1}. {stage.label}
          </Button>
        </li>
      ))}
      <li className="setup-steps-count">
        Step {index + 1} of {setupStages.length}
      </li>
    </ol>
  );
}

export function GuidedOnboarding({
  profile,
  profession,
  onProfessionChange,
  onChange,
  onContinue,
  onImport,
  onGoogleImport,
  managed,
  children,
  startStep = "work",
  onStartStep,
  onOpen,
  reached = 0,
}: GuidedOnboardingProps) {
  function open(stage: SetupStage) {
    if (setupStages.findIndex((item) => item.id === stage) > reached) return;
    if (stage === "work" || stage === "layout" || stage === "start") onStartStep?.(stage);
    else onOpen?.(stage);
  }
  function advance() {
    onStartStep?.(startStep === "work" ? "layout" : "start");
  }
  return (
    <div className="studio type-onboarding" id="admin-content">
      <p className="eyebrow">YOUR FIRST PORTFOLIO</p>
      <SetupSteps current={startStep} onSelect={open} reached={reached} />
      <h1>
        A home for <span>your work.</span>
      </h1>
      <p>
        Finish this step before the next one opens. You can go back to anything you already
        completed.
      </p>
      {children}
      {(startStep === "work" || startStep === "layout") && (
        <SelectField
          label="What kind of work do you do?"
          onChange={(value) => {
            if (onProfessionChange)
              onProfessionChange(value as typeof profile.portfolioType & string);
            else
              onChange({
                ...profile,
                portfolioType: value as typeof profile.portfolioType,
              });
          }}
          value={profession ?? profile.portfolioType ?? "engineer"}
        >
          {portfolioTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.audience}
            </option>
          ))}
        </SelectField>
      )}
      {startStep === "layout" && (
        <PortfolioTypePicker
          onChange={(portfolioType) => onChange({ ...profile, portfolioType })}
          value={profile.portfolioType ?? "engineer"}
        />
      )}
      {startStep === "start" && (
        <section aria-label="How to start" className="editor-card editor-fields">
          <h2>How do you want to begin?</h2>
          <p>Start empty, or bring in a CV or Google profile. You can switch methods later.</p>
          <Flex direction="row" gap="md">
            <Button onClick={onContinue} type="button">
              Use this layout
            </Button>
            <Button onClick={onImport} type="button" variant="outline">
              Start from a CV
            </Button>
            {!managed && (
              <Button onClick={onGoogleImport} type="button" variant="outline">
                Start from Google profile
              </Button>
            )}
          </Flex>
        </section>
      )}
      <Flex direction="row" gap="md" justify="space-between" paddingX="sm">
        <Button
          disabled={startStep === "work"}
          onClick={() => onStartStep?.(startStep === "start" ? "layout" : "work")}
          type="button"
          variant="outline"
        >
          Back
        </Button>
        {startStep !== "start" && (
          <Button onClick={advance} type="button">
            Next
          </Button>
        )}
      </Flex>
    </div>
  );
}

export function SetupNavigation({
  step,
  onStep,
  onImport,
  onManual,
  onOpen,
  canReview = false,
  reached = 0,
  disabled = false,
}: SetupNavigationProps) {
  if (step === "done" || step === "template") return null;
  const current: SetupStage = step === "review" ? "review" : "details";
  return (
    <section aria-label="Guided setup" className="editor-card editor-fields">
      <SetupSteps
        current={current}
        onSelect={(stage) => {
          if (setupStages.findIndex((item) => item.id === stage) > reached) return;
          if (stage === "details") onStep("details");
          else if (stage === "review") onStep("review");
          else onOpen?.(stage);
        }}
        reached={reached}
      />
      <h2>
        {step === "details"
          ? "Step 4 of 5 · Add your details"
          : "Step 5 of 5 · Review your portfolio"}
      </h2>
      <p>
        {step === "details"
          ? "Import a CV or type your details below. Failed imports leave your draft unchanged. You can skip import and continue manually."
          : "Check your content, preview and visibility. Save changes is explicit; publishing shares your portfolio and CV."}
      </p>
      <div className="studio-header-actions">
        <Button
          disabled={disabled}
          onClick={() => (step === "review" ? onStep("details") : onOpen?.("layout"))}
          type="button"
          variant="outline"
        >
          Back to {step === "review" ? "details" : "layout"}
        </Button>
        {step === "details" && (
          <>
            <Button disabled={disabled} onClick={onImport} type="button" variant="outline">
              Import a CV
            </Button>
            <Button disabled={disabled} onClick={onManual} type="button" variant="outline">
              Skip import · enter manually
            </Button>
            <Button
              disabled={disabled || !canReview}
              onClick={() => onStep("review")}
              type="button"
            >
              Review draft
            </Button>
          </>
        )}
        {step === "review" && (
          <Button disabled={disabled} onClick={() => onStep("done")} type="button">
            Finish setup
          </Button>
        )}
        <Button disabled={disabled} onClick={() => onStep("done")} type="button" variant="outline">
          Continue in full editor
        </Button>
      </div>
    </section>
  );
}
