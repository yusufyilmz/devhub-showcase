"use client";

import "../../styles/components/layout/section/section-views.css";

import { useId, useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../../buttons/button";
import { Section } from "./Section";
import { SectionItemCard } from "./SectionItemCard";
import { sectionElementsStyles } from "./styles";
import type { SectionCarouselOptions } from "./types";

export function SectionCarousel({
  items,
  label,
  previousLabel = "Previous items",
  nextLabel = "Next items",
  surface = "semantic",
  type,
  sectionId,
}: SectionCarouselOptions) {
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();

  function move(direction: number) {
    const node = list.current;
    if (!node) return;

    node.scrollBy({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      left:
        direction *
        ((node.children[1]?.getBoundingClientRect().left ?? 0) -
          (node.children[0]?.getBoundingClientRect().left ?? 0) || node.clientWidth * 0.85),
    });
  }

  if (!items.length) return null;

  return (
    <Section asChild>
      <section aria-label={label} className={sectionElementsStyles.element3} id={sectionId}>
        <div className={sectionElementsStyles.element4}>
          <Button
            aria-controls={listId}
            aria-label={previousLabel}
            className="size-[2.25rem]"
            onClick={() => move(-1)}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>

          <Button
            aria-controls={listId}
            aria-label={nextLabel}
            className="size-[2.25rem]"
            onClick={() => move(1)}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>

        <ul id={listId} ref={list}>
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
