"use client";

import { type RefObject, useEffect } from "react";

const AUTOPLAY_INTERVAL = 6000;
const SCROLL_COOLDOWN = 1500;

export function useExampleAutoplay(
  track: RefObject<HTMLUListElement | null>,
  count: number,
  paused: boolean,
) {
  useEffect(() => {
    const list = track.current;
    if (!list || count < 2 || paused) return;

    const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!motion || typeof IntersectionObserver !== "function") return;

    let visible = false;
    let lastScroll = Number.NEGATIVE_INFINITY;
    const canHover = window.matchMedia("(hover: hover)");
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    observer.observe(list);
    const recordScroll = () => {
      lastScroll = performance.now();
    };
    list.addEventListener("scroll", recordScroll, { passive: true });
    const timer = window.setInterval(() => {
      if (
        !visible ||
        document.hidden ||
        motion.matches ||
        list.contains(document.activeElement) ||
        (canHover.matches && list.matches(":hover")) ||
        list.matches(":active") ||
        performance.now() - lastScroll < SCROLL_COOLDOWN
      )
        return;

      const [first, second] = Array.from(list.children) as HTMLElement[];
      if (!first || !second || list.scrollWidth <= list.clientWidth + 2) return;
      if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 2) {
        list.scrollTo({ behavior: "smooth", left: 0 });
      } else {
        list.scrollBy({ behavior: "smooth", left: second.offsetLeft - first.offsetLeft });
      }
    }, AUTOPLAY_INTERVAL);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      list.removeEventListener("scroll", recordScroll);
    };
  }, [count, paused, track]);
}
