import "@shared/ui/sections.css";

import { ItemContent } from "../collection-view/CollectionView";
import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";
import { FAQBlock } from "./FAQBlock";

export function FAQSection(props: SectionProps) {
  const { section, language } = props;
  if (section.renderer !== "accordion") return <SectionPresentation {...props} type="faq" />;
  if (!section.visible || (!section.items.length && !section.options?.description)) return null;
  return (
    <FAQBlock
      className="library-section [--section-columns:3] [min-width:0] [padding-block:3.5rem] [overflow-wrap:anywhere] [border-top:1px_solid_var(--border)] [&[data-alignment='center']]:[text-align:center] [&[data-alignment='right']]:[text-align:right] [&[data-columns='1']]:[--section-columns:1] [&[data-columns='2']]:[--section-columns:2] [&[data-columns='4']]:[--section-columns:4] [&[data-section-type]]:[scroll-margin-top:100px]"
      data-alignment={section.options?.alignment}
      data-section-type="faq"
      description={section.options?.description}
      headingId={`${section.id}-heading`}
      id={section.id}
      items={section.items.map((item) => ({
        content: <ItemContent item={item} language={language} />,
        id: item.id,
        title: item.title,
      }))}
      title={section.title}
    />
  );
}
