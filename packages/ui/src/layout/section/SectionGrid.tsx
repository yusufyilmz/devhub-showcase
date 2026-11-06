"use client";

import "../../styles/components/layout/section/section-views.css";

import { Section } from "./Section";
import { SectionItemCard } from "./SectionItemCard";
import { sectionGridClassName } from "./styles";
import type { SectionGridOptions } from "./types";

export function SectionGrid({
  items,
  label,
  variant = "cards",
  surface = "semantic",
  type,
  sectionId,
}: SectionGridOptions) {
  if (!items.length) return null;

  return (
    <Section asChild>
      <section aria-label={label} id={sectionId}>
        <ul className={sectionGridClassName(variant)}>
          {items.map((item) => (
            <li key={item.id}>
              <SectionItemCard item={item} surface={surface} type={type} />
            </li>
          ))}
        </ul>
      </section>
    </Section>
  );
}
