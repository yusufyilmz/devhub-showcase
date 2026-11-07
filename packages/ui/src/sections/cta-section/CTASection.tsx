import "../../styles/components/sections/sections.css";

import { ArrowUpRight } from "lucide-react";

import { getPortfolioCopy, getSocialWork } from "@shared/config";
import { safeLink } from "@shared/utils";

import { Button } from "../../buttons/button";
import { ItemContent } from "../collection-view/CollectionView";
import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";
import { CTABlock } from "./CTABlock";

export function CTASection(props: SectionProps) {
  const { section, language } = props;
  if (section.renderer !== "cards") return <SectionPresentation {...props} type="cta" />;
  const { description, actionUrl } = section.options ?? {};
  if (!section.visible || (!section.items.length && !description && !actionUrl)) return null;
  const actions = section.items.filter((item) => safeLink(item.url));
  const details = section.items.filter(
    (item) =>
      !safeLink(item.url) ||
      item.body ||
      item.imageUrl ||
      item.value ||
      item.period ||
      item.details?.length ||
      item.code ||
      getSocialWork(item.url),
  );
  return (
    <CTABlock
      actions={
        actions.length > 0 ? (
          actions.map((item, index) => (
            <Button
              endIcon={<ArrowUpRight />}
              href={item.url}
              key={item.id}
              variant={index === 0 ? "default" : "outline"}
            >
              {item.title}
            </Button>
          ))
        ) : actionUrl && safeLink(actionUrl) ? (
          <Button endIcon={<ArrowUpRight />} href={actionUrl}>
            {getPortfolioCopy(language).exploreWork}
          </Button>
        ) : undefined
      }
      data-section-type="cta"
      description={description}
      headingId={`${section.id}-heading`}
      id={section.id}
      title={section.title}
    >
      {details.length > 0 && (
        <div className="grid w-full max-w-prose gap-s">
          {details.map((item) => (
            <div key={item.id}>
              {!safeLink(item.url) && <h3 className="text-base">{item.title}</h3>}
              <ItemContent hideLink item={item} language={language} />
            </div>
          ))}
        </div>
      )}
    </CTABlock>
  );
}
