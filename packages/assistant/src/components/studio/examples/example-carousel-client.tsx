"use client";
import "../../sections/home-section/examples.css";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import { type PortfolioType, portfolioTypes } from "@shared/config";
import { Button as LibraryButton } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { GalleryLightbox } from "@shared/ui/dialog";

import { examplePath, type PortfolioExample } from "./data";
import { ExampleThumbnail } from "./example-thumbnail";
import { useExampleAutoplay } from "./use-example-autoplay";

export function ExampleCarouselClient({
  items,
}: {
  items: (PortfolioExample & { preview: ReactNode })[];
}) {
  const [filter, setFilter] = useState<PortfolioType | "all">("all");
  const [activeExample, setActiveExample] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const track = useRef<HTMLUListElement>(null);
  const id = useId();
  const examples = items.filter(
    (item) => filter === "all" || item.profile.portfolioType === filter,
  );
  const count = examples.length;
  useExampleAutoplay(track, count, autoplayPaused || activeExample !== null);
  useEffect(() => {
    const list = track.current;
    if (!list || count === 0) return;
    const measure = () => setAtEnd(list.scrollLeft + list.clientWidth >= list.scrollWidth - 2);
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    measure();
    return () => observer.disconnect();
  }, [count]);
  function choose(value: PortfolioType | "all") {
    setFilter(value);
    setActiveExample(null);
    setPosition(0);
    track.current?.scrollTo({ behavior: "instant", left: 0 });
  }
  function move(direction: number) {
    const list = track.current;
    if (!list) return;
    list.scrollBy({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      left: direction * (list.clientWidth * 0.85),
    });
  }
  function updatePosition() {
    const list = track.current;
    if (!list) return;
    setAtEnd(list.scrollLeft + list.clientWidth >= list.scrollWidth - 2);
    const cards = Array.from(list.children) as HTMLElement[];
    const nearest = cards.reduce(
      (best, card, index) =>
        Math.abs(card.offsetLeft - list.offsetLeft - list.scrollLeft) <
        Math.abs((cards[best]?.offsetLeft ?? 0) - list.offsetLeft - list.scrollLeft)
          ? index
          : best,
      0,
    );
    // The final card may share a viewport with the previous card.
    setPosition(
      list.scrollLeft + list.clientWidth >= list.scrollWidth - 2 ? examples.length - 1 : nearest,
    );
  }
  return (
    <section
      aria-labelledby="examples-title"
      className="home-container home-examples"
      id="examples"
    >
      <div className="home-section-intro">
        <p className="home-eyebrow">FIND YOUR STARTING POINT</p>
        <h2 id="examples-title">
          Different work.
          <br />
          <span>Different ways to show it.</span>
        </h2>
        <p>
          Explore fictional portfolios for every layout. Open an example to see the complete page
          and download its sample CV.
        </p>
      </div>
      <div className="example-toolbar">
        <fieldset aria-label="Filter portfolio examples" className="example-filters">
          <LibraryButton
            aria-pressed={filter === "all"}
            onClick={() => choose("all")}
            type="button"
            variant="unstyled"
          >
            All layouts
          </LibraryButton>
          {portfolioTypes.map((type) => (
            <LibraryButton
              aria-pressed={filter === type.id}
              key={type.id}
              onClick={() => choose(type.id)}
              type="button"
              variant="unstyled"
            >
              {type.name}
            </LibraryButton>
          ))}
        </fieldset>
        <div className="example-controls">
          {count > 1 && (
            <LibraryButton
              aria-controls={id}
              aria-label={autoplayPaused ? "Play portfolio examples" : "Pause portfolio examples"}
              onClick={() => setAutoplayPaused((paused) => !paused)}
              type="button"
              variant="unstyled"
            >
              <span aria-hidden="true">{autoplayPaused ? "▶" : "Ⅱ"}</span>
            </LibraryButton>
          )}
        </div>
      </div>
      <div className="example-stage">
        <LibraryButton
          aria-controls={id}
          aria-label="Previous portfolio examples"
          className="example-nav example-nav-previous"
          disabled={position === 0}
          onClick={() => move(-1)}
          type="button"
          variant="unstyled"
        >
          <span aria-hidden="true">←</span>
        </LibraryButton>
        <LibraryButton
          aria-controls={id}
          aria-label="Next portfolio examples"
          className="example-nav example-nav-next"
          disabled={atEnd}
          onClick={() => move(1)}
          type="button"
          variant="unstyled"
        >
          <span aria-hidden="true">→</span>
        </LibraryButton>
        <ul
          aria-label="Portfolio examples carousel"
          className="example-track"
          id={id}
          onScroll={updatePosition}
          ref={track}
        >
          {examples.map((item, itemIndex) => (
            <Card asChild key={item.slug} layout="plain" surface="portfolio">
              <li className="example-card">
                <a
                  aria-label={`Explore ${item.profile.name}'s ${item.profile.portfolioType} example`}
                  href={examplePath(item.slug)}
                  onClick={(event) => {
                    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    setActiveExample(itemIndex);
                  }}
                >
                  <ExampleThumbnail item={item} />
                  <span className="example-preview-action">
                    Preview portfolio <span aria-hidden="true">↗</span>
                  </span>
                  <div className="example-card-copy">
                    <span className="example-label">
                      {item.profile.portfolioType} / {item.profile.appearance?.theme}
                    </span>
                    <h3>
                      {item.profile.name} <span aria-hidden="true">↗</span>
                    </h3>
                    <p>{item.profile.title}</p>
                    <div className="example-card-meta">
                      <span>
                        {item.profile.portfolioLanguage?.toUpperCase()} · {item.profile.cvLayout} CV
                      </span>
                      <span>Fictional example</span>
                    </div>
                  </div>
                </a>
              </li>
            </Card>
          ))}
        </ul>
      </div>
      <GalleryLightbox
        index={activeExample}
        items={examples.map((item) => ({
          content: item.preview,
          description: `${item.profile.portfolioType} · Fictional portfolio example`,
          href: examplePath(item.slug),
          id: item.slug,
          thumbnail: <ExampleThumbnail item={item} />,
          title: item.profile.name,
        }))}
        onIndexChange={setActiveExample}
      />
      <div className="example-caption">
        <span>Swipe, scroll or use the arrows to explore.</span>
        <span role="status">
          {position + 1} / {examples.length} examples
        </span>
      </div>
    </section>
  );
}
