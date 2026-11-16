import { Check } from "lucide-react";

import { safeLink } from "@shared/utils";

import { Button } from "../../buttons";
import type { SectionProps } from "../types";

export function PlanComparison({
  section,
  type,
}: Pick<SectionProps, "section"> & { type: "plans" | "pricing" }) {
  if (!section.visible || (!section.items.length && !section.options?.description)) return null;
  const headingId = `${section.id}-heading`;
  const features = [...new Set(section.items.flatMap((item) => item.details ?? []))];
  return (
    <section
      aria-labelledby={headingId}
      className="@container scroll-mt-24 grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-lg py-xl"
      data-section-layout="pricing-comparison"
      data-section-type={type}
      id={section.id}
    >
      <header className="grid gap-s">
        <h2
          className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
          id={headingId}
        >
          {section.title}
        </h2>
        {section.options?.description && (
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {section.options.description}
          </p>
        )}
      </header>
      {section.items.length > 0 && (
        <section
          aria-label="Plan comparison table"
          className="relative min-w-0 max-w-full overflow-x-auto rounded-xl border border-border/70 focus-visible:outline-2 focus-visible:outline-ring"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: The scrollable table must be keyboard-scrollable.
          tabIndex={0}
        >
          <table className="w-full border-collapse text-start text-sm">
            <thead>
              <tr className="divide-x divide-border/70 bg-card text-start">
                <th className="min-w-20 p-s text-start align-top @lg:min-w-36 @lg:p-md" scope="col">
                  Features
                </th>
                {section.items.map((item) => (
                  <th
                    className="min-w-28 max-w-64 p-s text-start align-top @lg:min-w-40 @lg:p-md"
                    key={item.id}
                    scope="col"
                  >
                    <div className="grid gap-s font-normal wrap-anywhere">
                      <span className="text-base font-semibold">{item.title}</span>
                      {item.value && (
                        <strong className="text-2xl font-semibold tracking-tight">
                          {item.value}
                        </strong>
                      )}
                      {item.period && <span className="text-muted-foreground">{item.period}</span>}
                      {item.body && (
                        <span className="leading-relaxed whitespace-pre-line text-muted-foreground">
                          {item.body}
                        </span>
                      )}
                      {safeLink(item.url) && (
                        <Button
                          className="w-fit max-w-full whitespace-normal"
                          href={item.url}
                          size="sm"
                          variant="outline"
                        >
                          {item.title}
                        </Button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr className="divide-x divide-border/70 border-t border-border/70" key={feature}>
                  <th className="p-s text-start font-medium wrap-anywhere @lg:p-md" scope="row">
                    {feature}
                  </th>
                  {section.items.map((item) => (
                    <td className="p-s text-center @lg:p-md" key={item.id}>
                      {item.details?.includes(feature) ? (
                        <>
                          <span className="sr-only">Included</span>
                          <Check aria-hidden="true" className="mx-auto size-4" />
                        </>
                      ) : (
                        <>
                          <span className="sr-only">Not listed</span>
                          <span aria-hidden="true" className="text-muted-foreground">
                            —
                          </span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </section>
  );
}
