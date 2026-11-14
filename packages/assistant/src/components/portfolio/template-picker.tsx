"use client";

import { cn } from "cn";

import { applyPortfolioTemplate, portfolioTemplates } from "@shared/config";
import { Button } from "@shared/ui/button";

import type { TemplatePickerProps } from "./types";

const schematicLayout: Record<string, string> = {
  blogger: "grid-cols-1",
  consultant: "grid-cols-[1fr_2fr] [&_i]:col-start-1 [&_i]:row-span-3",
  freelancer: "grid-cols-[1fr_2fr] [&_i]:col-start-1 [&_i]:row-span-3",
  photographer: "grid-cols-3",
  retail: "grid-cols-3",
  student: "grid-cols-1",
};

export function TemplatePicker({ profile, onChange }: TemplatePickerProps) {
  return (
    <section aria-label="Curated profession templates">
      <h2>Start with a composition</h2>
      <p>
        Change the arrangement, not your story. Content, hidden sections, private projects and PDF
        preferences are retained. Preview links open fictional examples.
      </p>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
        {portfolioTemplates.map((template) => (
          <article className="rounded-xl border border-border bg-card p-[18px]" key={template.id}>
            <div
              aria-hidden="true"
              className={cn(
                "grid h-[100px] gap-2 rounded-lg bg-secondary p-3 [&_i]:rounded-sm [&_i]:bg-primary/30 [&_span]:rounded-sm [&_span]:bg-border",
                schematicLayout[template.id] ?? "grid-cols-2 [&_i]:col-span-full",
              )}
            >
              <i />
              <span />
              <span />
              <span />
            </div>
            <h3 className="mt-[18px] mb-2 text-[17px] font-semibold">{template.name}</h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {template.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
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
