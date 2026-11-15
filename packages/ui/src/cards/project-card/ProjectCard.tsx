"use client";

import { Button } from "../../buttons/button";
import { AvatarGroup } from "../../display/avatar-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../display/carousel";
import { CardBase } from "../card/CardBase";
import type { ProjectCardProps } from "./types";

export function ProjectCard({
  title,
  description,
  images = [],
  avatars = [],
  caseStudyHref,
  projectHref,
}: ProjectCardProps) {
  return (
    <CardBase asChild className="flex flex-col gap-md p-md" interaction="static" layout="plain">
      <article>
        {images.length > 0 && (
          <Carousel aria-label={`${title} screenshots`}>
            <CarouselContent>
              {images.map(({ src, alt }) => (
                <CarouselItem key={src}>
                  {/* biome-ignore lint/performance/noImgElement: The component accepts caller-supplied screenshots. */}
                  <img
                    alt={alt}
                    className="aspect-video w-full rounded-lg border border-border/60 bg-muted object-cover"
                    loading="lazy"
                    src={src}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 size-9" />
                <CarouselNext className="right-2 size-9" />
              </>
            )}
          </Carousel>
        )}
        <div className="flex flex-col items-start gap-xs wrap-anywhere">
          <h3 className="text-lg leading-tight font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
          {avatars.length > 0 && <AvatarGroup avatars={avatars} />}
        </div>
        {(caseStudyHref || projectHref) && (
          <div className="flex flex-wrap gap-xs">
            {caseStudyHref && (
              <Button href={caseStudyHref} variant="outline">
                Read case study
              </Button>
            )}
            {projectHref && <Button href={projectHref}>View project</Button>}
          </div>
        )}
      </article>
    </CardBase>
  );
}
