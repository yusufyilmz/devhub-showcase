import { cn } from "cn";

import { Card } from "../../cards";
import { ItemContent } from "../collection-view/CollectionView";
import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function FeaturesSection(props: SectionProps) {
  const { section, language } = props;
  if (section.options?.layout !== "features-bento") {
    return <SectionPresentation {...props} type="features" />;
  }
  if (!section.visible || (!section.items.length && !section.options.description)) return null;

  const headingId = `${section.id}-heading`;
  const hasSupportingTiles = section.items.length > 2;
  return (
    <section
      aria-labelledby={headingId}
      className="@container scroll-mt-24 grid min-w-0 gap-lg py-lg sm:py-xl"
      data-section-layout="features-bento"
      data-section-type="features"
      id={section.id}
    >
      <div className="grid gap-s">
        <h2 className="text-balance text-3xl font-semibold tracking-tight" id={headingId}>
          {section.title}
        </h2>
        {section.options.description && (
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {section.options.description}
          </p>
        )}
      </div>
      {section.items.length > 0 && (
        <ul
          className={cn(
            "grid min-w-0 list-none gap-sm p-0",
            section.items.length > 1 && "@lg:grid-cols-2",
            hasSupportingTiles && "@3xl:grid-cols-3",
          )}
        >
          {section.items.map((item, index) => (
            <Card
              asChild
              className={cn(
                "grid min-w-0 content-start gap-sm rounded-xl border-border/70 p-md wrap-anywhere @lg:p-lg",
                index === 0 && "bg-linear-to-br from-primary/10 via-card to-card",
                index === 0 && hasSupportingTiles && "@3xl:col-span-2 @3xl:row-span-2",
              )}
              interaction="static"
              key={item.id}
              layout="plain"
            >
              <li>
                <h3
                  className={
                    index === 0
                      ? "text-2xl font-semibold tracking-tight"
                      : "text-base font-semibold"
                  }
                >
                  {item.title}
                </h3>
                <div className="grid min-w-0 gap-s text-sm leading-relaxed text-muted-foreground [&_a]:w-fit [&_a]:text-foreground [&_a]:underline [&_pre]:max-w-full [&_pre]:overflow-x-auto">
                  <ItemContent item={item} language={language} />
                </div>
              </li>
            </Card>
          ))}
        </ul>
      )}
    </section>
  );
}
