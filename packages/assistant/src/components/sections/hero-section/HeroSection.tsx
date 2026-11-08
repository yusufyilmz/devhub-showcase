import "@shared/ui/sections.css";

import { getPortfolioCopy } from "@shared/config";
import { Button } from "@shared/ui/button";
import { WorkMedia } from "@shared/ui/display";
import { safeLink } from "@shared/utils";

import { CollectionView } from "../collection-view/CollectionView";
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
      className="section-hero-block py-xl"
      data-alignment={alignment}
      data-section-type="hero"
      description={description}
      headingId={`${section.id}-heading`}
      id={section.id}
      title={section.title}
      visual={
        mediaUrl && safeLink(mediaUrl) ? (
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
