"use client";
import "../styles/portfolio/workflow.css";

import { portfolioTypes } from "@shared/config";

import { Button } from "../buttons/button/Button";
import { SelectField } from "../forms";
import { Flex } from "../layout/flex";
import { PortfolioTypePicker } from "./portfolio-type-picker";
import type { GuidedOnboardingProps, SetupNavigationProps } from "./types";

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
}: GuidedOnboardingProps) {
  return (
    <main className="studio type-onboarding" id="admin-content">
      <p className="eyebrow">YOUR FIRST PORTFOLIO · STEP 1 OF 3</p>
      <h1>
        A home for <span>your work.</span>
      </h1>
      <p>
        Choose your profession and a starting layout. Your existing details stay
        intact. You can go back or change the layout later.
      </p>
      {children}
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
      <PortfolioTypePicker
        onChange={(portfolioType) => onChange({ ...profile, portfolioType })}
        value={profile.portfolioType ?? "engineer"}
      />
      <Flex direction="row" gap="md" justify="space-between" paddingX="sm">
        <Button onClick={onContinue} type="button">
          Use this layout
        </Button>
        <Flex direction="row" gap="md">
          <Button onClick={onImport} type="button" variant="outline">
            Start from a CV
          </Button>
          {!managed && (
            <Button onClick={onGoogleImport} type="button" variant="outline">
              Start from Google profile
            </Button>
          )}
        </Flex>
      </Flex>
      <p>
        Next: import or enter your details, then review before saving or
        publishing. Autosave stays in this browser tab.
      </p>
    </main>
  );
}

export function SetupNavigation({
  step,
  onStep,
  onImport,
  onManual,
  disabled = false,
}: SetupNavigationProps) {
  if (step === "done" || step === "template") return null;
  return (
    <section aria-label="Guided setup" className="editor-card editor-fields">
      <h2>
        {step === "details"
          ? "Step 2 of 3 · Add your details"
          : "Step 3 of 3 · Review your portfolio"}
      </h2>
      <p>
        {step === "details"
          ? "Import a CV or type your details below. Failed imports leave your draft unchanged. You can skip import and continue manually."
          : "Check your content, preview and visibility. Save changes is explicit; publishing shares your portfolio and CV."}
      </p>
      <div className="studio-header-actions">
        <Button
          disabled={disabled}
          onClick={() => onStep(step === "review" ? "details" : "template")}
          type="button"
          variant="outline"
        >
          Back to {step === "review" ? "details" : "layout"}
        </Button>
        {step === "details" && (
          <>
            <Button
              disabled={disabled}
              onClick={onImport}
              type="button"
              variant="outline"
            >
              Import a CV
            </Button>
            <Button
              disabled={disabled}
              onClick={onManual}
              type="button"
              variant="outline"
            >
              Skip import · enter manually
            </Button>
            <Button
              disabled={disabled}
              onClick={() => onStep("review")}
              type="button"
            >
              Review draft
            </Button>
          </>
        )}
        {step === "review" && (
          <Button
            disabled={disabled}
            onClick={() => onStep("done")}
            type="button"
          >
            Finish setup
          </Button>
        )}
        <Button
          disabled={disabled}
          onClick={() => onStep("done")}
          type="button"
          variant="outline"
        >
          Continue in full editor
        </Button>
      </div>
    </section>
  );
}
