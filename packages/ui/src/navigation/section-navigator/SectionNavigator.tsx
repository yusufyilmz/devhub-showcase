"use client";

import "../../styles/components/navigation/section-navigator.css";

import { useEffect, useState } from "react";

import { Button } from "../../buttons/button/Button";
import { currentPageSection, discoverPageSections } from "./sections";
import { sectionNavigatorStyle, sectionNavigatorStyles as styles } from "./styles";
import type { PageSection, SectionNavigatorProps } from "./types";

export function SectionNavigator({ sections, label = "Page sections" }: SectionNavigatorProps) {
  const [items, setItems] = useState<PageSection[]>([]);
  const [active, setActive] = useState("");
  useEffect(() => {
    let frame = 0;
    let entries: PageSection[] = [];
    const refresh = () => {
      entries = sections ?? discoverPageSections();
      setItems((previous) =>
        JSON.stringify(previous) === JSON.stringify(entries) ? previous : entries,
      );
      setActive(currentPageSection(entries));
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(currentPageSection(entries)));
    };
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, {
      attributeFilter: ["hidden", "aria-hidden"],
      attributes: true,
      childList: true,
      subtree: true,
    });
    refresh();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", refresh);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", refresh);
    };
  }, [sections]);
  if (items.length < 2) return null;
  return (
    <nav aria-label={label} className={styles.root} style={sectionNavigatorStyle(items.length)}>
      {items.map((item) => (
        <Button
          aria-current={active === item.id ? "location" : undefined}
          aria-label={`Go to ${item.title}`}
          className={styles.link}
          href={`#${encodeURIComponent(item.id)}`}
          key={item.id}
          variant="unstyled"
        >
          <span aria-hidden="true" className={styles.marker} />
          <span aria-hidden="true" className={styles.preview}>
            <strong>{item.title}</strong>
            {item.description && <span>{item.description}</span>}
          </span>
        </Button>
      ))}
    </nav>
  );
}
