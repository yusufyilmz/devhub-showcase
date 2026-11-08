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
      className="library-section"
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
