"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "cn";

import { IconButton } from "../../buttons/icon-button/IconButton";
import { CARD_IDS } from "../../constants/cards";
import { ArrowBackIcon, ArrowForwardIcon } from "../../display/icons/Icons";
import { scrollableContainerStyles } from "./styles";
import type { ScrollableContainerProps } from "./types";

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  category = "contact",
  className,
  onScroll,
  ...props
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const offset = (document.getElementById(CARD_IDS[category])?.offsetWidth ?? 300) + 32;
      scrollContainerRef.current.scrollBy({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        left: -offset,
      });
      handleScroll();
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const offset = (document.getElementById(CARD_IDS[category])?.offsetWidth ?? 300) + 32;

      scrollContainerRef.current.scrollBy({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        left: offset,
      });
      handleScroll();
    }
  };

  const handleScroll = () => {
    const element = scrollContainerRef.current;
    if (!element) return;
    const { scrollLeft, scrollWidth, clientWidth } = element;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;
    const update = () => {
      setShowLeftArrow(element.scrollLeft > 0);
      setShowRightArrow(element.scrollLeft + element.clientWidth < element.scrollWidth);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={scrollableContainerStyles.element1}>
      {showLeftArrow && (
        <div className={scrollableContainerStyles.element2}>
          <IconButton
            aria-label="Scroll left"
            className={scrollableContainerStyles.button}
            onClick={scrollLeft}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
      )}
      <div
        className={cn(scrollableContainerStyles.element3, className)}
        onScroll={(event) => {
          handleScroll();
          onScroll?.(event);
        }}
        ref={scrollContainerRef}
        {...props}
      >
        {children}
      </div>
      {showRightArrow && (
        <div className={scrollableContainerStyles.element4}>
          <IconButton
            aria-label="Scroll right"
            className={scrollableContainerStyles.button}
            onClick={scrollRight}
          >
            <ArrowForwardIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};
