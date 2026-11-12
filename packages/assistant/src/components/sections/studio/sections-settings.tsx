import { Layers3, ListOrdered, PanelTop, SlidersHorizontal } from "lucide-react";

import type { PortfolioProfile } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";

const destinations = [
  {
    action: "Open section library",
    description: "Add blocks, edit their content, or hide a custom section.",
    icon: Layers3,
    label: "Custom sections",
    tab: "Custom sections",
  },
  {
    action: "Reorder sections",
    description: "Choose the order visitors see on your portfolio.",
    icon: ListOrdered,
    label: "Section order",
    tab: "Section order",
  },
  {
    action: "Edit display settings",
    description: "Choose which built-in sections and items appear.",
    icon: SlidersHorizontal,
    label: "Section display",
    tab: "Section display",
  },
  {
    action: "Manage templates",
    description: "Save and reuse a section configuration.",
    icon: PanelTop,
    label: "Templates",
    tab: "Templates",
  },
] as const;

export function SectionsSettings({
  profile,
  onNavigate,
}: {
  profile: PortfolioProfile;
  onNavigate: (tab: string) => void;
}) {
  const customSections = profile.customSections?.length ?? 0;
  return (
    <Card asChild interaction="static" layout="plain">
      <section aria-labelledby="portfolio-sections-title" className="editor-card grid gap-4">
        <div className="grid gap-1">
          <h2 id="portfolio-sections-title">Portfolio sections</h2>
          <p className="text-muted-foreground">
            Manage the content and layout of your portfolio. Changes are saved with your draft.
          </p>
        </div>
        <ul className="m-0 grid list-none divide-y divide-border p-0">
          {destinations.map(({ action, description, icon: Icon, label, tab }) => (
            <li className="flex flex-wrap items-center justify-between gap-3 py-3" key={tab}>
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <Icon aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                <div className="grid gap-1">
                  <h3 className="text-base">{label}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  {tab === "Custom sections" && (
                    <small className="text-muted-foreground">{customSections} added</small>
                  )}
                </div>
              </div>
              <Button onClick={() => onNavigate(tab)} type="button" variant="outline">
                {action}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}
