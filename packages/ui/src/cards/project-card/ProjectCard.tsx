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
    <CardBase asChild className="gap-4 overflow-hidden p-5" interaction="static">
      <article>
        {images.length > 0 && (
          <Carousel aria-label={`${title} screenshots`} className="relative">
            <CarouselContent>
              {images.map(({ src, alt }) => (
                <CarouselItem key={src}>
                  {/* biome-ignore lint/performance/noImgElement: The component accepts caller-supplied screenshots. */}
                  <img
                    alt={alt}
                    className="aspect-video w-full rounded-md object-cover"
                    loading="lazy"
                    src={src}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        )}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
          {avatars.length > 0 && <AvatarGroup avatars={avatars} />}
        </div>
        {(caseStudyHref || projectHref) && (
          <div className="flex flex-wrap gap-2">
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
