"use client";

import { useState } from "react";

import { Button } from "../../buttons";
import { GalleryLightbox } from "../../overlays/gallery-lightbox/GalleryLightbox";
import { LiveSectionPreview, type LiveSectionPreviewProps } from "./live-section-preview";
import { sectionExamples } from "./preview-examples";
import { SectionCatalogPreview } from "./section-catalog-preview";

export function SectionGallery({ assetUrl }: Pick<LiveSectionPreviewProps, "assetUrl"> = {}) {
  const [index, setIndex] = useState<number | null>(null);
  const items = sectionExamples.map(({ id, name, description }) => ({
    content: (
      <div className="w-full min-w-0">
        <LiveSectionPreview assetUrl={assetUrl} exampleId={id} />
      </div>
    ),
    description,
    id,
    thumbnail: <SectionCatalogPreview type={id} />,
    title: name,
  }));

  return (
    <GalleryLightbox
      index={index}
      items={items}
      onIndexChange={setIndex}
      trigger={
        <Button type="button" variant="outline">
          Open section gallery
        </Button>
      }
    />
  );
}
