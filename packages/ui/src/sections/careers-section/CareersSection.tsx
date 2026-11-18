import { ChevronDown } from "lucide-react";

import { ItemContent } from "../collection-view/CollectionView";
import { SectionFrame } from "../section/section-frame";
import { SectionHeading } from "../section/section-heading";
import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function CareersSection(props: SectionProps) {
  const { section, language } = props;
  if (section.options?.layout !== "careers-openings") {
    return <SectionPresentation {...props} type="careers" />;
  }
  if (!section.visible || (!section.items.length && !section.options.description)) return null;

  const headingId = `${section.id}-heading`;
  return (
    <SectionFrame
      className="@container scroll-mt-24"
      context="composed"
      id={section.id}
      layout="careers-openings"
      sectionType="careers"
    >
      <div className="grid min-w-0 gap-lg @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <SectionHeading
          description={section.options.description}
          id={headingId}
          level={2}
          title={section.title}
        />
        {section.items.length > 0 && (
          <ul className="m-0 grid min-w-0 list-none divide-y divide-border/70 border-y border-border/70 p-0">
            {section.items.map((item, index) => (
              <li className="min-w-0 wrap-anywhere" key={item.id}>
                <details className="group" open={index === 0}>
                  <summary className="flex min-w-0 cursor-pointer list-none items-center justify-between gap-md rounded-md py-md text-lg font-semibold focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                    {item.title}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground group-open:rotate-180"
                    />
                  </summary>
                  <div className="grid min-w-0 gap-sm pb-md leading-relaxed text-muted-foreground">
                    <ItemContent item={item} language={language} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionFrame>
  );
}
