import "./section-views.css";

import { Section } from "./Section";
import { SectionItemCard } from "./SectionItemCard";
import { sectionElementsStyles } from "./styles";
import type { SectionAccordionOptions } from "./types";

export function SectionAccordion({
  items,
  label,
  surface = "semantic",
  type,
  sectionId,
}: SectionAccordionOptions) {
  if (!items.length) return null;

  return (
    <Section asChild>
      <section aria-label={label} className={sectionElementsStyles.element1} id={sectionId}>
        {items.map((item) => (
          <SectionItemCard accordion item={item} key={item.id} surface={surface} type={type} />
        ))}
      </section>
    </Section>
  );
}
