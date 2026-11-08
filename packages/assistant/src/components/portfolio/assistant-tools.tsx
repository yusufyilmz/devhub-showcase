"use client";
import "./workflow.css";

import { Button } from "@shared/ui/button";
import { SelectField } from "@shared/ui/forms";

import type { AssistantFeedbackProps, AssistantToolsProps, PublishedSourcesProps } from "./types";
export function AssistantTools({ profile, value, onChange, disabled }: AssistantToolsProps) {
  const writing =
    value?.kind === "writing"
      ? value
      : {
          field: "summary" as const,
          kind: "writing" as const,
          length: "standard" as const,
          tone: "professional" as const,
        };
  const items =
    writing.field === "projects"
      ? profile.projects.map((item) => ({ id: item.id, title: item.name }))
      : profile.experiences.map((item) => ({
          id: item.id,
          title: `${item.position} · ${item.company}`,
        }));
  return (
    <fieldset
      className="grid min-w-0 gap-s rounded-xl border bg-card p-md text-card-foreground sm:grid-cols-2"
      disabled={disabled}
    >
      <legend className="px-xs text-base font-semibold">Assistant task</legend>
      <SelectField
        label="What do you want help with?"
        onChange={(kind) =>
          onChange(
            kind === "edit" ? undefined : kind === "feedback" ? { kind: "feedback" } : writing,
          )
        }
        value={value?.kind ?? "edit"}
      >
        <option value="edit">General editing</option>
        <option value="writing">Improve selected writing</option>
        <option value="feedback">Review portfolio quality</option>
      </SelectField>
      {value?.kind === "writing" && (
        <>
          <SelectField
            label="Source field"
            onChange={(field) =>
              onChange({ ...writing, field: field as typeof writing.field, itemId: undefined })
            }
            value={writing.field}
          >
            <option value="summary">Summary</option>
            <option value="projects">Project description</option>
            <option value="experiences">Experience bullets</option>
          </SelectField>
          {writing.field !== "summary" && (
            <SelectField
              label="Source item"
              onChange={(itemId) => onChange({ ...writing, itemId })}
              value={writing.itemId ?? ""}
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </SelectField>
          )}
          <SelectField
            label="Writing tone"
            onChange={(tone) => onChange({ ...writing, tone: tone as typeof writing.tone })}
            value={writing.tone}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="direct">Direct</option>
          </SelectField>
          <SelectField
            label="Writing length"
            onChange={(length) => onChange({ ...writing, length: length as typeof writing.length })}
            value={writing.length}
          >
            <option value="concise">Concise</option>
            <option value="standard">Standard</option>
            <option value="detailed">Detailed</option>
          </SelectField>
          <p>
            Only the selected source text is sent for rewriting. Verify that the alternative
            preserves every fact before accepting.
          </p>
        </>
      )}
      {value?.kind === "feedback" && (
        <p>
          Assess supplied content by section. Missing facts become recommendations requiring your
          input, never invented achievements. Analysis does not change your draft.
        </p>
      )}
    </fieldset>
  );
}
const destinations: Record<string, string> = {
  appearance: "Appearance",
  customSections: "Custom sections",
  education: "Education",
  experiences: "Experience",
  languages: "Languages",
  portfolioType: "Layout",
  projects: "Projects",
  skills: "Skills",
};
export function AssistantFeedback({ feedback, onNavigate, editorHref }: AssistantFeedbackProps) {
  if (!feedback.length) return null;
  return (
    <section aria-label="Portfolio feedback" className="grid gap-s">
      <h3>Feedback by section</h3>
      {feedback.map((item) => (
        <article
          className="grid justify-items-start gap-s rounded-xl border bg-card p-md text-card-foreground"
          key={`${item.field}:${item.issue}`}
        >
          <h4>{item.field}</h4>
          <p>{item.issue}</p>
          <p>{item.recommendation}</p>
          <p>
            {item.needsInput
              ? "Needs your facts or decision"
              : "Supported improvement; review any proposed edit below"}
          </p>
          {onNavigate ? (
            <Button
              onClick={() => onNavigate(destinations[item.field] ?? "Profile")}
              type="button"
              variant="outline"
            >
              Edit {item.field}
            </Button>
          ) : (
            editorHref && (
              <Button href={editorHref} variant="outline">
                Open editor to review {item.field}
              </Button>
            )
          )}
        </article>
      ))}
    </section>
  );
}

export function PublishedSources({ sources }: PublishedSourcesProps) {
  const allowed = sources.filter((source) =>
    /^\/[a-zA-Z0-9_-]+#[a-zA-Z0-9%_-]+$/.test(source.href),
  );
  if (!allowed.length) return null;
  return (
    <nav aria-label="Published portfolio sources" className="published-sources">
      {allowed.map((source) => (
        <Button href={source.href} key={source.href} variant="outline">
          {source.label}
        </Button>
      ))}
    </nav>
  );
}
