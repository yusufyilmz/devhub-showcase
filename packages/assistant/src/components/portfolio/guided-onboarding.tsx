"use client";
import "./workflow.css";

import { Bot, FileUp, PenLine, UserRound } from "lucide-react";

import { portfolioTypes } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Flex } from "@shared/ui/flex";
import { SelectField } from "@shared/ui/forms";
import { Eyebrow } from "@shared/ui/typography";

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
    <aside
      aria-label="Studio companion"
      className="setup-companion [display:flex] [flex-wrap:wrap] [gap:0.625rem_0.875rem] [align-items:start] [padding:0.875rem_1rem] [margin-block:1rem] [background:color-mix(in_srgb,_var(--primary)_7%,_var(--card))] [border:1px_solid_var(--border)] [border-radius:var(--radius-md)] [&_>_svg]:[flex-shrink:0] [color:var(--primary)] [&_>_div]:[flex:1_1_12rem] [min-width:0] [&_p]:[margin-block:0.25rem_0] [color:var(--muted-foreground)]"
    >
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
    <ol
      aria-label="Setup steps"
      className="setup-steps [display:flex] [flex-wrap:wrap] [gap:8px] [align-items:center] [padding:0] [margin:0_0_24px] [list-style:none]"
    >
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
      <li className="setup-steps-count [margin-left:auto] [font-size:12px] [color:var(--muted-foreground)]">
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
    <div
      className="studio [max-width:1160px] [padding:var(--studio-top,_36px)_40px_var(--studio-bottom,_80px)] [margin:auto] max-[767px]:[padding:var(--studio-top,_20px)_18px_var(--studio-bottom,_50px)] [&.studio-editor]:[max-width:none] [padding:0_32px_96px_0] max-[767px]:[&.studio-editor]:[padding:20px_16px_104px] [--studio-bottom:0px] type-onboarding [&_.setup-steps]:[display:grid] [grid-template-columns:repeat(5,_minmax(0,_1fr))] [&_.setup-steps_.ui-button]:[width:100%] [min-height:2.5rem] [&_.setup-steps_[aria-current='step']]:[color:var(--primary-foreground)] max-w-[1180px] [&>h1]:my-4 [&>h1]:mb-6 [&>h1]:text-[clamp(36px,5vw,60px)] [&>h1]:leading-[1.1] [&>h1]:font-[550] [&>h1]:tracking-[-0.05em] [&>h1_span]:text-primary [&>p:not(.eyebrow)]:my-4 [&>p:not(.eyebrow)]:mb-6 [&>p:not(.eyebrow)]:max-w-[720px] [&>p:not(.eyebrow)]:text-sm [&>p:not(.eyebrow)]:leading-[1.7] [&>p:not(.eyebrow)]:text-muted-foreground"
      id="admin-content"
    >
      <Eyebrow>YOUR FIRST PORTFOLIO</Eyebrow>
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
        <fieldset
          aria-label="Starting options"
          className="setup-start-options [display:grid] [gap:0.75rem] [margin-block:1rem]"
        >
          <Button
            className="setup-start-option [&_>_span]:[display:grid] [gap:0.25rem] [&_small]:[color:var(--muted-foreground)]"
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
          <Button
            className="setup-start-option [&_>_span]:[display:grid] [gap:0.25rem] [&_small]:[color:var(--muted-foreground)]"
            onClick={onImport}
            type="button"
            variant="outline"
          >
            <FileUp aria-hidden="true" />
            <span>
              <strong>Start from a CV</strong>
              <small>Upload a CV and review the suggested details.</small>
            </span>
          </Button>
          {!managed && (
            <Button
              className="setup-start-option [&_>_span]:[display:grid] [gap:0.25rem] [&_small]:[color:var(--muted-foreground)]"
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
    <section
      aria-label="Guided setup"
      className="editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px] editor-fields grid grid-cols-2 gap-6 max-[767px]:grid-cols-1 max-[767px]:gap-[18px]"
    >
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
      <div className="flex flex-wrap items-center justify-between gap-2.5">
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
