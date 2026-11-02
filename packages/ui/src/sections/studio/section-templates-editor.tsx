"use client";

import { useEffect, useState } from "react";

import {
  resolveSectionSource,
  type SavedSectionTemplate,
  type SectionTemplateFile,
} from "@shared/config";
import { urls } from "@shared/config/urls";
import { importPageForge, parseSectionFile } from "@shared/lib/pageforge-import";
import {
  applySectionTemplate,
  createSectionTemplate,
  sectionTemplateFileSchema,
} from "@shared/lib/section-templates";
import { useStudioRequest } from "@shared/runtime/studio";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { Field, SelectField } from "../../forms";
import { Input as LibraryInput } from "../../forms/input/Input";
import { Label as LibraryLabel } from "../../forms/label/Label";
import { CustomPortfolioSection } from "./custom-portfolio-section";
import { sectionTemplatesEditorStyles } from "./styles";
import type { SectionTemplatesEditorOptions } from "./types";

function download(document: SectionTemplateFile) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(document, null, 2)], { type: "application/json" }),
  );
  const link = window.document.createElement("a");
  link.href = url;
  link.download = "mydevstudio-sections.json";
  link.click();
  URL.revokeObjectURL(url);
}
export function SectionTemplatesEditor({ profile, onChange }: SectionTemplatesEditorOptions) {
  const request = useStudioRequest();
  const [name, setName] = useState("My section template");
  const [includeContent, setIncludeContent] = useState(false);
  const [review, setReview] = useState<SectionTemplateFile | null>(null);
  const [warnings, showWarnings] = useState<string[]>([]);
  const [error, showError] = useState("");
  const [mode, setMode] = useState<"append" | "replace">("append");
  const [json, setJson] = useState("");
  const [assetBase, setAssetBase] = useState("");
  const [templates, setTemplates] = useState<SavedSectionTemplate[]>([]);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false;
    request(urls.next.studio.sectionTemplates())
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        if (!cancelled) {
          setTemplates(result.templates);
          setRevision(result.revision);
        }
      })
      .catch((reason) => {
        if (!cancelled) showError(reason.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [request]);
  async function persist(next: SavedSectionTemplate[]) {
    setBusy(true);
    showError("");
    try {
      const response = await request(urls.next.studio.sectionTemplates(), {
        body: JSON.stringify({ revision, templates: next }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setTemplates(result.templates);
      setRevision(result.revision);
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : "Could not save templates");
    } finally {
      setBusy(false);
    }
  }
  function attempt(action: () => void) {
    try {
      showError("");
      action();
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : "Could not process sections");
    }
  }
  function inspect(raw: string) {
    setReview(null);
    showWarnings([]);
    attempt(() => {
      const value = parseSectionFile(raw);
      if (value && typeof value === "object" && "format" in value) {
        setReview(sectionTemplateFileSchema.parse(value));
        showWarnings([]);
      } else {
        const imported = importPageForge(value, () => crypto.randomUUID(), assetBase || undefined);
        setReview(imported.document);
        showWarnings(imported.warnings);
      }
    });
  }
  function snapshot() {
    return createSectionTemplate(profile, name, includeContent);
  }
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section className={sectionTemplatesEditorStyles.element1}>
        <h2>Section templates and import/export</h2>
        <p>
          Templates contain authorable sections. Identity, publication, CV content and account
          ownership are never imported. Configuration exports omit content, media, contact details
          and profile bindings by default.
        </p>
        <Field label="Template name" onChange={setName} value={name} />
        <LibraryLabel unstyled>
          <LibraryInput
            checked={includeContent}
            onChange={(event) => setIncludeContent(event.target.checked)}
            type="checkbox"
            unstyled
          />{" "}
          Include authored content, media and bindings
        </LibraryLabel>
        <div className={sectionTemplatesEditorStyles.element2}>
          <Button
            className={sectionTemplatesEditorStyles.element3}
            disabled={loading || busy || !name.trim() || templates.length >= 5}
            onClick={() =>
              attempt(() => persist([...templates, { ...snapshot(), id: crypto.randomUUID() }]))
            }
            type="button"
            variant="outline"
          >
            Save section template
          </Button>
          <Button
            className={sectionTemplatesEditorStyles.element4}
            disabled={!name.trim()}
            onClick={() => attempt(() => download(snapshot()))}
            type="button"
            variant="outline"
          >
            Export sections JSON
          </Button>
        </div>
        <p>
          Saved templates belong to your signed-in account and are stored privately, separately from
          your published portfolio. Applying a template changes only the portfolio draft. Exports
          with content can contain personal information; share those files only intentionally.
        </p>
        <ul className={sectionTemplatesEditorStyles.element5}>
          {templates.map((template) => (
            <li key={template.id}>
              {template.name} · {template.sections.length} sections
              <Button
                onClick={() => {
                  setReview(template);
                  showWarnings([]);
                }}
                type="button"
              >
                Review {template.name}
              </Button>
              <Button onClick={() => download(template)} type="button">
                Export {template.name}
              </Button>
              <Button
                onClick={() => persist(templates.filter(({ id }) => id !== template.id))}
                type="button"
              >
                Delete {template.name}
              </Button>
            </li>
          ))}
        </ul>
        <Field
          hint="Optional original website URL to resolve relative image and link paths. Native templates do not need it."
          label="PageForge source asset base URL"
          onChange={setAssetBase}
          type="url"
          value={assetBase}
        />
        <LibraryLabel unstyled>
          Import sections JSON
          <LibraryInput
            accept=".json,application/json"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (file.size > 500_000) {
                showError("Import files must be smaller than 500 KB");
                return;
              }
              try {
                inspect(await file.text());
              } catch {
                showError("Could not read this file");
              }
            }}
            type="file"
            unstyled
          />
        </LibraryLabel>
        <Field label="Paste sections JSON" multiline onChange={setJson} value={json} />
        <Button disabled={!json.trim()} onClick={() => inspect(json)} type="button">
          Review import
        </Button>
        {error && <p role="alert">{error}</p>}
        {review && (
          <Card asChild layout="plain" surface="portfolio">
            <section aria-label="Import review" className={sectionTemplatesEditorStyles.element6}>
              <h3>Review: {review.name}</h3>
              <p>
                {review.sections.length} sections ·{" "}
                {review.includesContent ? "includes authored content" : "configuration only"}.
                Applying creates fresh IDs. Profile sources bind to this account and include
                current/future items; private projects remain excluded. Nothing is published by
                importing.
              </p>
              {warnings.length > 0 && (
                <details open>
                  <summary>Conversion notes ({warnings.length})</summary>
                  <ul>
                    {warnings.map((warning, index) => (
                      <li key={`${index}-${warning}`}>{warning}</li>
                    ))}
                  </ul>
                </details>
              )}
              <ol>
                {review.sections.map((section) => (
                  <li key={section.id}>
                    {section.title} · {section.sectionType ?? section.composition ?? "custom"} ·{" "}
                    {section.renderer} · {section.items.length} items
                    <details>
                      <summary>Preview {section.title}</summary>
                      <CustomPortfolioSection
                        language={profile.portfolioLanguage}
                        preview
                        section={resolveSectionSource(section, profile)}
                      />
                    </details>
                  </li>
                ))}
              </ol>
              <SelectField
                label="Apply mode"
                onChange={(value) => setMode(value as typeof mode)}
                value={mode}
              >
                <option value="append">Append sections</option>
                <option value="replace">Replace custom sections</option>
              </SelectField>
              <Button
                className={sectionTemplatesEditorStyles.element7}
                onClick={() =>
                  attempt(() => {
                    if (
                      mode === "replace" &&
                      !window.confirm(
                        "Replace the custom sections in this draft? Save changes later to keep the result.",
                      )
                    )
                      return;
                    onChange(
                      applySectionTemplate(profile, review, mode, () => crypto.randomUUID()),
                    );
                    setReview(null);
                  })
                }
                type="button"
              >
                Apply to draft
              </Button>
              <Button onClick={() => setReview(null)} type="button">
                Cancel import
              </Button>
            </section>
          </Card>
        )}
      </section>
    </Card>
  );
}
