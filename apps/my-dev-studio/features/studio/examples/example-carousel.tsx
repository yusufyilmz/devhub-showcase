"use client";
import "@shared/ui/examples.css";

import { useEffect, useId, useRef, useState } from "react";

import { type PortfolioType, portfolioTypes } from "@shared/config";
import { Card } from "@shared/ui/cards";
import { GalleryLightbox } from "@shared/ui/dialog";

import { examplePath, portfolioExamples } from "./data";
import { ExampleThumbnail } from "./example-thumbnail";

export function ExampleCarousel() {
  const [filter, setFilter] = useState<PortfolioType | "all">("all");
  const [activeExample, setActiveExample] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const track = useRef<HTMLUListElement>(null);
  const id = useId();
  const examples = portfolioExamples.filter(
    (item) => filter === "all" || item.profile.portfolioType === filter,
  );
  const count = examples.length;
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
          <button aria-pressed={filter === "all"} onClick={() => choose("all")} type="button">
            All layouts
          </button>
          {portfolioTypes.map((type) => (
            <button
              aria-pressed={filter === type.id}
              key={type.id}
              onClick={() => choose(type.id)}
              type="button"
            >
              {type.name}
            </button>
          ))}
        </fieldset>
        <div className="example-controls">
          <button
            aria-controls={id}
            aria-label="Previous portfolio examples"
            disabled={position === 0}
            onClick={() => move(-1)}
            type="button"
          >
            ←
          </button>
          <button
            aria-controls={id}
            aria-label="Next portfolio examples"
            disabled={atEnd}
            onClick={() => move(1)}
            type="button"
          >
            →
          </button>
        </div>
      </div>
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
      <GalleryLightbox
        index={activeExample}
        items={examples.map((item) => ({
          content: (
            <iframe
              loading="lazy"
              src={examplePath(item.slug)}
              title={`${item.profile.name} portfolio preview`}
            />
          ),
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
