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
      className="home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-examples [padding-block:5rem] max-[700px]:[padding-block:3rem]"
      id="examples"
    >
      <div className="home-section-intro [&_:where(h2)]:[margin-block:17px_20px] [font-size:clamp(34px,_4vw,_51px)] [font-weight:500] [line-height:1.16] [letter-spacing:-0.045em] [&_:where(h2)_>_:where(span)]:[color:var(--muted-foreground)] [&_>_:where(p):not(.home-eyebrow)]:[max-width:510px] [font-size:14px] [line-height:1.9] [color:var(--muted-foreground)] max-[760px]:[&_:where(h2)]:[font-size:36px] max-[760px]:[&_>_:where(p):not(.home-eyebrow)]:[font-size:13px]">
        <p className="home-eyebrow [display:flex] [gap:9px] [align-items:center] [font:500_10px\_/\_1.6_var(--font-geist-mono),_monospace] [color:var(--primary)] [letter-spacing:0.13em] [&_>_:where(span)]:[width:5px] [height:5px] [background:currentColor] [border-radius:50%] [box-shadow:0_0_12px_color-mix(in_srgb,_var(--primary)_50%,_transparent)]">
          FIND YOUR STARTING POINT
        </p>
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
      <div className="example-toolbar [display:flex] [gap:0.6rem] [align-items:center] [justify-content:space-between] [flex-wrap:wrap] [margin:2rem_0_1.25rem]">
        <fieldset
          aria-label="Filter portfolio examples"
          className="example-filters [display:flex] [gap:0.6rem] [align-items:center] [flex-wrap:wrap] [&_button]:[padding:0.65rem_1rem] [font:inherit] [font-size:0.85rem] [color:var(--foreground)] [cursor:pointer] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:var(--portfolio-radius,_var(--radius,_0.5rem))] [&_button:hover]:[color:var(--primary)] [border-color:var(--primary)] [&_button[aria-pressed='true']]:[color:var(--primary-foreground)]"
        >
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
        <div className="example-controls [display:flex] [gap:0.6rem] [align-items:center] [&_button]:[padding:0.65rem_1rem] [font:inherit] [font-size:0.85rem] [color:var(--foreground)] [cursor:pointer] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:var(--portfolio-radius,_var(--radius,_0.5rem))] [&_button:hover]:[color:var(--primary)] [border-color:var(--primary)] [&_button:disabled]:[cursor:default] [opacity:0.35]">
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
      <div className="example-stage [position:relative] hover:[&_.example-nav]:[pointer-events:auto] [opacity:1] focus-within:[&_.example-nav]:[pointer-events:auto] hover:[&_.example-nav:disabled]:[opacity:0.35] focus-within:[&_.example-nav:disabled]:[opacity:0.35]">
        <LibraryButton
          aria-controls={id}
          aria-label="Previous portfolio examples"
          className="example-nav [position:absolute] [top:50%] [z-index:2] [display:grid] [place-items:center] [width:40px] [height:40px] [padding:0] [font-size:1.1rem] [color:var(--foreground)] [pointer-events:none] [cursor:pointer] [background:color-mix(in_srgb,_var(--card)_90%,_transparent)] [border:1px_solid_var(--border)] [border-radius:var(--portfolio-radius,_var(--radius,_999px))] [opacity:0] [transform:translateY(-50%)] [transition:opacity_160ms_ease] disabled:[cursor:default] [@media(hover:_none)]:[pointer-events:auto] [opacity:1] example-nav-previous [left:12px]"
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
          className="example-nav [position:absolute] [top:50%] [z-index:2] [display:grid] [place-items:center] [width:40px] [height:40px] [padding:0] [font-size:1.1rem] [color:var(--foreground)] [pointer-events:none] [cursor:pointer] [background:color-mix(in_srgb,_var(--card)_90%,_transparent)] [border:1px_solid_var(--border)] [border-radius:var(--portfolio-radius,_var(--radius,_999px))] [opacity:0] [transform:translateY(-50%)] [transition:opacity_160ms_ease] disabled:[cursor:default] [@media(hover:_none)]:[pointer-events:auto] [opacity:1] example-nav-next [right:12px]"
          disabled={atEnd}
          onClick={() => move(1)}
          type="button"
          variant="unstyled"
        >
          <span aria-hidden="true">→</span>
        </LibraryButton>
        <ul
          aria-label="Portfolio examples carousel"
          className="example-track [position:relative] [display:flex] [gap:1.5rem] [padding:2px_2px_1.25rem] [margin:0] [overflow-x:auto] [overscroll-behavior-x:contain] [list-style:none] [scroll-snap-type:x_mandatory] [scroll-padding-inline:1px] [scrollbar-width:thin]"
          id={id}
          onScroll={updatePosition}
          ref={track}
        >
          {examples.map((item, itemIndex) => (
            <Card asChild key={item.slug} layout="plain" surface="portfolio">
              <li className="example-card [flex:0_0_calc((100%_-_1.5rem)\_/\_2)] [min-width:0] [overflow:hidden] [scroll-snap-align:start] [background:var(--card)] [border-radius:var(--portfolio-radius,_var(--radius,_1.2rem))] [&_>_a]:[display:block] [height:100%] [color:inherit] [text-decoration:none] [&_>_a:focus-visible]:[outline-offset:-4px] [&_h3]:[display:flex] [justify-content:space-between] [margin:0.65rem_0_0.3rem] [font-size:1.35rem] max-[700px]:[flex-basis:88%] [&_>_a]:[position:relative] [display:block] [cursor:pointer] focus-within:[outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]:2px_solid_var(--primary)] [outline-offset:4px] [@media(hover:_hover)_and_(prefers-reduced-motion:_no-preference)]:[transition:transform_0.25s,_box-shadow_0.25s] [@media(hover:_hover)_and_(prefers-reduced-motion:_no-preference)]:hover:[box-shadow:0_12px_28px_color-mix(in_srgb,_var(--foreground)_10%,_transparent)] [transform:translateY(-4px)] [@media(hover:_hover)_and_(prefers-reduced-motion:_no-preference)]:hover:[&_.example-preview-action]:[color:var(--foreground)]">
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
                  <span className="example-preview-action [position:absolute] [top:12px] [right:18px] [z-index:1] [font-size:12px] [font-weight:600] [color:var(--primary)] [text-decoration:underline] [text-underline-offset:3px]">
                    Preview portfolio <span aria-hidden="true">↗</span>
                  </span>
                  <div className="example-card-copy [padding:1.5rem] [&_p]:[margin:0] [font-size:0.9rem] [color:var(--muted-foreground)]">
                    <span className="example-label [font-size:0.65rem] [color:var(--muted-foreground)] [text-transform:uppercase] [letter-spacing:0.1em]">
                      {item.profile.portfolioType} / {item.profile.appearance?.theme}
                    </span>
                    <h3>
                      {item.profile.name} <span aria-hidden="true">↗</span>
                    </h3>
                    <p>{item.profile.title}</p>
                    <div className="example-card-meta [display:flex] [flex-wrap:wrap] [gap:0.5rem] [justify-content:space-between] [margin-top:1.5rem] [font-size:0.7rem] [color:var(--muted-foreground)]">
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
      <div className="example-caption [display:flex] [gap:0.6rem] [align-items:center] [justify-content:space-between] [margin-top:0.75rem] [font-size:0.75rem] [color:var(--muted-foreground)] max-[700px]:[gap:1rem] [align-items:start] max-[700px]:[&_[role='status']]:[white-space:nowrap]">
        <span>Swipe, scroll or use the arrows to explore.</span>
        <span role="status">
          {position + 1} / {examples.length} examples
        </span>
      </div>
    </section>
  );
}
