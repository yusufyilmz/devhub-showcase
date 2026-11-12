"use client";

import "./portfolio-setup.css";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { Bot } from "lucide-react";

import { type PortfolioProfile, type PortfolioType, portfolioTypes } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@shared/ui/dialog";
import { Field, SelectField } from "@shared/ui/forms";

import { PortfolioTypePicker } from "../../portfolio/portfolio-type-picker";
import {
  EducationEditor,
  ExperienceEditor,
  LanguagesEditor,
  ProjectsEditor,
  SkillsEditor,
} from "../../sections/index";
import { CvImportEditor } from "../import/cv-import-editor";

const stages = [
  {
    description: "Choose the closest match to get a suggested layout.",
    label: "Work",
    title: "Choose your work type",
  },
  {
    description: "Choose a design for your work. You can change it later.",
    label: "Layout",
    title: "Pick a portfolio layout",
  },
  {
    description: "Upload an existing CV or skip to enter your details yourself.",
    label: "CV",
    title: "Import a CV",
  },
  {
    description: "Add what you want to share. You can skip any optional section.",
    label: "Details",
    title: "Add your details",
  },
  {
    description: "Check your website and CV before saving your private draft.",
    label: "Review",
    title: "Review your draft",
  },
] as const;

const sections = [
  { Editor: null, title: "Profile" },
  { Editor: ExperienceEditor, title: "Work experience" },
  { Editor: ProjectsEditor, title: "Projects" },
  { Editor: SkillsEditor, title: "Skills" },
  { Editor: EducationEditor, title: "Education" },
  { Editor: LanguagesEditor, title: "Languages" },
] as const;

export type SetupPosition = { stage: number; section: number };

function basicsComplete(profile: PortfolioProfile) {
  return Boolean(
    profile.name.trim() &&
      profile.name.trim() !== "Your name" &&
      profile.title.trim() &&
      profile.title.trim() !== "Add your professional title",
  );
}

function SetupProfile({
  profile,
  onChange,
  assistant,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
  assistant?: ReactNode;
}) {
  const [showAssistant, setShowAssistant] = useState(false);
  return (
    <div className="portfolio-setup-fields">
      <Field
        label="Full name"
        onChange={(name) => onChange({ ...profile, name })}
        required
        value={profile.name === "Your name" ? "" : profile.name}
      />
      <Field
        label="Professional title"
        onChange={(title) => onChange({ ...profile, title })}
        required
        value={profile.title === "Add your professional title" ? "" : profile.title}
      />
      <Field
        label="Short introduction (optional)"
        multiline
        onChange={(summary) => onChange({ ...profile, summary })}
        value={profile.summary === "Add a short professional summary." ? "" : profile.summary}
      />
      <aside aria-label="Studio companion" className="portfolio-setup-companion">
        <Bot aria-hidden="true" size={22} />
        <div>
          <strong>Studio companion</strong>
          <p>Start with what you do and the kind of work you want to share.</p>
        </div>
        {assistant && (
          <Button
            aria-expanded={showAssistant}
            onClick={() => setShowAssistant(!showAssistant)}
            type="button"
            variant="outline"
          >
            {showAssistant ? "Hide AI help" : "Help me write an introduction"}
          </Button>
        )}
      </aside>
      {showAssistant && assistant}
    </div>
  );
}

export function PortfolioSetup({
  position,
  onPosition,
  profile,
  onChange,
  profession,
  onProfession,
  preview,
  assistant,
  recovery,
  onCancel,
  onSave,
  busy,
  stale,
  error,
}: {
  position: SetupPosition;
  onPosition: (position: SetupPosition) => void;
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
  profession: PortfolioType;
  onProfession: (profession: PortfolioType) => void;
  preview: ReactNode;
  assistant?: ReactNode;
  recovery: ReactNode;
  onCancel?: () => void;
  onSave: () => void;
  busy: boolean;
  stale: boolean;
  error: string;
}) {
  const { stage, section } = position;
  const copy = stages[stage] ?? stages[0];
  const activeSection = sections[section] ?? sections[0];
  const body = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const sectionHeading = useRef<HTMLHeadingElement>(null);
  const [cvApplied, setCvApplied] = useState(false);
  const ready = basicsComplete(profile);
  const Editor = activeSection.Editor;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset focus and scrolling on each stage or section change.
  useEffect(() => {
    body.current?.scrollTo?.({ top: 0 });
    (sectionHeading.current ?? heading.current)?.focus({ preventScroll: true });
  }, [copy, activeSection]);

  function go(next: number, detail = 0) {
    onPosition({ section: detail, stage: next });
  }

  return (
    <Dialog open>
      <DialogContent
        className="setup-dialog portfolio-setup"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        showCloseButton={false}
      >
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
        <div className="portfolio-setup-body" ref={body}>
          {recovery}
          <fieldset className="portfolio-setup-content" disabled={busy}>
            {stage === 0 && (
              <SelectField
                label="What kind of work do you do?"
                onChange={(value) => onProfession(value as PortfolioType)}
                value={profession}
              >
                {portfolioTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.id === "minimal" ? "General portfolio" : type.audience}
                  </option>
                ))}
              </SelectField>
            )}
            {stage === 1 && (
              <PortfolioTypePicker
                onChange={(portfolioType) => onChange({ ...profile, portfolioType })}
                value={profile.portfolioType ?? profession}
              />
            )}
            {stage === 2 && (
              <CvImportEditor
                embedded
                onChange={(next) => {
                  onChange(next);
                  setCvApplied(true);
                }}
                profile={profile}
              />
            )}
            {stage === 3 && (
              <>
                <div className="portfolio-setup-section-heading">
                  <h3 ref={sectionHeading} tabIndex={-1}>
                    {activeSection.title}
                  </h3>
                  <span>
                    {section + 1} of {sections.length}
                    {section > 0 ? " · Optional" : ""}
                  </span>
                </div>
                {Editor ? (
                  <Editor key={activeSection.title} onChange={onChange} profile={profile} />
                ) : (
                  <SetupProfile assistant={assistant} onChange={onChange} profile={profile} />
                )}
              </>
            )}
            {stage === 4 && (
              <>
                <nav aria-label="Edit draft sections" className="portfolio-setup-review-links">
                  {sections.map(({ title }, index) => (
                    <Button
                      key={title}
                      onClick={() => go(3, index)}
                      type="button"
                      variant="outline"
                    >
                      {title}
                    </Button>
                  ))}
                </nav>
                <div className="editor-preview-pane">{preview}</div>
              </>
            )}
          </fieldset>
        </div>
        <SetupActions
          busy={busy}
          cvApplied={cvApplied}
          error={error}
          go={go}
          onCancel={onCancel}
          onSave={onSave}
          position={position}
          ready={ready}
          stale={stale}
        />
      </DialogContent>
    </Dialog>
  );
}

function SetupActions({
  busy,
  cvApplied,
  error,
  go,
  onCancel,
  onSave,
  position,
  ready,
  stale,
}: {
  busy: boolean;
  cvApplied: boolean;
  error: string;
  go: (stage: number, section?: number) => void;
  onCancel?: () => void;
  onSave: () => void;
  position: SetupPosition;
  ready: boolean;
  stale: boolean;
}) {
  const { stage, section } = position;
  function back() {
    if (stage === 3 && section > 0) go(3, section - 1);
    else if (stage === 4) go(3, section);
    else go(stage - 1);
  }

  function next() {
    if (stage === 3 && section < sections.length - 1) go(3, section + 1);
    else go(stage + 1, section);
  }

  return (
    <footer className="portfolio-setup-actions">
      {error && (
        <p className="portfolio-setup-error editor-alert" role="alert">
          {error}
        </p>
      )}
      <Button disabled={busy || stage === 0} onClick={back} type="button" variant="outline">
        Back
      </Button>
      {onCancel && (
        <Button disabled={busy} onClick={onCancel} type="button" variant="ghost">
          Cancel starting over
        </Button>
      )}
      <div>
        {stage === 2 && !cvApplied && (
          <Button disabled={busy} onClick={() => go(3)} type="button" variant="ghost">
            Skip for now
          </Button>
        )}
        {stage === 3 && section > 0 && (
          <Button disabled={busy} onClick={next} type="button" variant="ghost">
            Skip for now
          </Button>
        )}
        {stage === 3 && ready && section < sections.length - 1 && (
          <Button disabled={busy} onClick={() => go(4, section)} type="button" variant="outline">
            Review draft
          </Button>
        )}
        {stage < 4 && (stage !== 2 || cvApplied) && (
          <Button disabled={busy || (stage === 3 && !ready)} onClick={next} type="button">
            {nextLabel(stage, section)}
          </Button>
        )}
        {stage === 4 && (
          <Button disabled={busy || stale || !ready} onClick={onSave} type="button">
            {busy ? "Saving…" : "Save private draft"}
          </Button>
        )}
      </div>
    </footer>
  );
}

function nextLabel(stage: number, section: number) {
  if (stage === 0) return "Choose a layout";
  if (stage === 1) return "Continue to CV import";
  if (stage === 2) return "Continue to details";
  return section === sections.length - 1 ? "Review draft" : "Continue";
}
