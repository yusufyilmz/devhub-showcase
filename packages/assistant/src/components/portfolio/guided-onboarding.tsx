"use client";
import "./workflow.css";

import { Bot, FileUp, PenLine, UserRound } from "lucide-react";

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

const startStageCopy = {
  layout: {
    description: "Start with the suggested layout or choose another.",
    tip: "You can change the design later. Your content stays with you.",
    title: "Pick a layout for your work",
  },
  start: {
    description: "Add details yourself or bring in information you already have.",
    tip: "Start with a CV if it’s up to date. If you’re starting from notes, I can help shape an introduction.",
    title: "Choose how to start",
  },
  work: {
    description: "Choose the closest match and we’ll suggest a layout.",
    tip: "Pick the work you want to showcase. You can use any layout on the next step.",
    title: "Choose your work type",
  },
} as const;

function SetupCompanion({
  children,
  disabled,
  onAsk,
}: {
  children: string;
  disabled?: boolean;
  onAsk?: () => void;
}) {
  return (
    <aside aria-label="Studio companion" className="setup-companion">
      <Bot aria-hidden="true" size={22} />
      <div>
        <strong>Studio companion</strong>
        <p>{children}</p>
      </div>
      {onAsk && (
        <Button disabled={disabled} onClick={onAsk} type="button" variant="outline">
          Ask Studio AI
        </Button>
      )}
    </aside>
  );
}

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
  onAskAssistant,
  onCancel,
  managed,
  children,
  startStep = "work",
  onStartStep,
  onOpen,
  reached = 0,
}: GuidedOnboardingProps) {
  const stageCopy = startStageCopy[startStep];
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
      <h1>{stageCopy.title}</h1>
      <p>{stageCopy.description}</p>
      <SetupCompanion onAsk={startStep === "start" ? onAskAssistant : undefined}>
        {startStep === "start" && !onAskAssistant
          ? "Choose a CV if it’s up to date, or enter just the basics to get started."
          : stageCopy.tip}
      </SetupCompanion>
      {children}
      {startStep === "work" && (
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
        <fieldset aria-label="Starting options" className="setup-start-options">
          <Button
            className="setup-start-option"
            onClick={onContinue}
            type="button"
            variant="outline"
          >
            <PenLine aria-hidden="true" />
            <span>
              <strong>Enter details manually</strong>
              <small>Start with your name, title and an introduction.</small>
            </span>
          </Button>
          <Button className="setup-start-option" onClick={onImport} type="button" variant="outline">
            <FileUp aria-hidden="true" />
            <span>
              <strong>Start from a CV</strong>
              <small>Upload a CV and review the suggested details.</small>
            </span>
          </Button>
          {!managed && (
            <Button
              className="setup-start-option"
              onClick={onGoogleImport}
              type="button"
              variant="outline"
            >
              <UserRound aria-hidden="true" />
              <span>
                <strong>Start from Google profile</strong>
                <small>Bring in the basic details you choose to share.</small>
              </span>
            </Button>
          )}
        </fieldset>
      )}
      <Flex direction="row" gap="md" justify="space-between" paddingX="sm" wrap>
        <Button
          disabled={startStep === "work"}
          onClick={() => onStartStep?.(startStep === "start" ? "layout" : "work")}
          type="button"
          variant="outline"
        >
          Back
        </Button>
        {onCancel && (
          <Button onClick={onCancel} type="button" variant="ghost">
            Cancel starting over
          </Button>
        )}
        {startStep !== "start" && (
          <Button onClick={advance} type="button">
            {startStep === "work" ? "Choose a layout" : "Choose how to start"}
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
  onAskAssistant,
  onPreview,
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
          else if (stage === "review" && canReview) onStep("review");
          else if (stage === "work" || stage === "layout" || stage === "start") onOpen?.(stage);
        }}
        reached={reached}
      />
      <h2>{step === "details" ? "Add your details" : "Review your portfolio"}</h2>
      <p>
        {step === "details"
          ? "Start with your name and professional title. You can add the rest now or return to it later."
          : "Preview your portfolio and CV, then finish setup. Save changes keeps your draft private until you choose to publish."}
      </p>
      {step === "details" && (
        <SetupCompanion disabled={disabled} onAsk={onAskAssistant}>
          {onAskAssistant
            ? "I can help you draft an introduction using facts you share. You choose what to keep."
            : "Add a short introduction about the work you want to show."}
        </SetupCompanion>
      )}
      <div className="studio-header-actions">
        <Button
          disabled={disabled}
          onClick={() => (step === "review" ? onStep("details") : onOpen?.("start"))}
          type="button"
          variant="outline"
        >
          Back to {step === "review" ? "details" : "starting options"}
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
          <>
            {onPreview && (
              <Button disabled={disabled} onClick={onPreview} type="button" variant="outline">
                Preview draft
              </Button>
            )}
            <Button disabled={disabled} onClick={() => onStep("done")} type="button">
              Finish setup
            </Button>
          </>
        )}
        <Button disabled={disabled} onClick={() => onStep("done")} type="button" variant="outline">
          Continue in full editor
        </Button>
      </div>
    </section>
  );
}
