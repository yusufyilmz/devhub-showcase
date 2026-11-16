import "../section/sections.css";

import { getPortfolioCopy } from "@shared/config";
import { safeLink } from "@shared/utils";

import { Button } from "../../buttons";
import { WorkMedia } from "../../display";
import { CollectionView } from "../collection-view/CollectionView";
import { isSectionImage } from "../item-media/section-image";
import type { SectionProps } from "../types";
import { HeroBlock } from "./HeroBlock";

export function HeroSection({ section, language }: SectionProps) {
  if (!section.visible) return null;
  const { actionUrl, alignment, description, mediaUrl } = section.options ?? {};
  return (
    <HeroBlock
      actions={
        actionUrl && safeLink(actionUrl) ? (
          <Button href={actionUrl}>{getPortfolioCopy(language).exploreWork} ↗</Button>
        ) : undefined
      }
      className="section-hero-block [&[data-alignment='center']_>_div:first-child]:[justify-items:center] [&[data-alignment='right']_>_div:first-child]:[justify-items:end] py-lg sm:py-xl"
      data-alignment={alignment ?? "left"}
      data-section-type="hero"
      description={description}
      headingId={`${section.id}-heading`}
      id={section.id}
      title={section.title}
      visual={
        isSectionImage(mediaUrl) ? (
          <WorkMedia imageUrl={mediaUrl} title={section.title} />
        ) : undefined
      }
    >
      {section.items.length > 0 && (
        <div className="min-w-0 md:col-span-full">
          <CollectionView language={language} section={section} type="hero" />
        </div>
      )}
    </HeroBlock>
  );
}
