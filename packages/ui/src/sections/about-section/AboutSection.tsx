import { ItemContent } from "../collection-view/CollectionView";
import { SectionFrame } from "../section/section-frame";
import { SectionHeading } from "../section/section-heading";
import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function AboutSection(props: SectionProps) {
  const { section, language } = props;
  if (section.options?.layout !== "about-editorial") {
    return <SectionPresentation {...props} type="about" />;
  }
  if (!section.visible || (!section.items.length && !section.options.description)) return null;

  const [lead, ...details] = section.items;
  const headingId = `${section.id}-heading`;
  return (
    <SectionFrame
      className="@container scroll-mt-24 border-y border-border/70"
      context="composed"
      id={section.id}
      layout="about-editorial"
      sectionType="about"
    >
      <div className="grid min-w-0 gap-xl @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <SectionHeading
          description={section.options.description}
          id={headingId}
          level={2}
          title={section.title}
        />
        <div className="grid min-w-0 content-start gap-lg wrap-anywhere">
          {lead && (
            <article className="grid min-w-0 gap-sm leading-relaxed text-muted-foreground">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">{lead.title}</h3>
              <ItemContent item={lead} language={language} />
            </article>
          )}
          {details.length > 0 && (
            <ul className="grid min-w-0 list-none gap-md border-t border-border/70 p-0 pt-md @lg:grid-cols-2">
              {details.map((item) => (
                <li
                  className="grid min-w-0 content-start gap-xs text-sm leading-relaxed text-muted-foreground"
                  key={item.id}
                >
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <ItemContent item={item} language={language} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SectionFrame>
  );
}
