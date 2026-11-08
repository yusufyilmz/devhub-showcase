"use client";
import "./template-picker.css";

import { applyPortfolioTemplate, portfolioTemplates } from "@shared/config";
import { Button } from "@shared/ui/button";

import type { TemplatePickerProps } from "./types";

export function TemplatePicker({ profile, onChange }: TemplatePickerProps) {
  return (
    <section aria-label="Curated profession templates">
      <h2>Start with a composition</h2>
      <p>
        Change the arrangement, not your story. Content, hidden sections, private projects and PDF
        preferences are retained. Preview links open fictional examples.
      </p>
      <div className="template-picker-grid">
        {portfolioTemplates.map((template) => (
          <article className="template-choice" key={template.id}>
            <div aria-hidden="true" className="template-schematic" data-template={template.id}>
              <i />
              <span />
              <span />
              <span />
            </div>
            <h3>{template.name}</h3>
            <p>{template.description}</p>
            <div className="template-actions">
              <Button
                onClick={() => onChange(applyPortfolioTemplate(profile, template.id))}
                type="button"
                variant="outline"
              >
                Use {template.id} template
              </Button>
              <Button
                href={`/p/examples/${template.example}`}
                rel="noopener noreferrer"
                target="_blank"
                variant="ghost"
              >
                Preview ↗
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
