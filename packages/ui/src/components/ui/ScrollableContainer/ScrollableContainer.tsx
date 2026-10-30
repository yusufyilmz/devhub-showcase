"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import type { CVCategoryType } from "@shared/lib/types";

import { CARD_IDS } from "../../../constants/cards";
import { IconButton } from "../IconButton/IconButton";
import { ArrowBackIcon, ArrowForwardIcon } from "../Icons/Icons";

interface ScrollableContainerProps {
  category: CVCategoryType;
  children: React.ReactNode;
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ children, category }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const offset = (document.getElementById(CARD_IDS[category])?.offsetWidth ?? 300) + 32;
      scrollContainerRef.current.scrollBy({
        behavior: "smooth",
        left: -offset,
      });
      handleScroll();
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const offset = (document.getElementById(CARD_IDS[category])?.offsetWidth ?? 300) + 32;

      scrollContainerRef.current.scrollBy({ behavior: "smooth", left: offset });
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
      setContainerHeight(element.clientHeight);
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
    <div className="relative flex align-top scrollbar-hide overflow-hidden">
      {showLeftArrow && (
        <div
          className="absolute z-10 left-0 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
          style={{ top: `${containerHeight / 2}px` }}
        >
          <IconButton aria-label="Scroll left" onClick={scrollLeft}>
            <ArrowBackIcon />
          </IconButton>
        </div>
      )}
      <div
        className="w-full gap-8 no-scrollbar flex flex-row justify-start overflow-x-auto scrollbar-hide whitespace-nowrap p-4 max-w-full"
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        {children}
      </div>
      {showRightArrow && (
        <div
          className="absolute z-10 right-0 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
          style={{ top: `${containerHeight / 2}px` }}
        >
          <IconButton aria-label="Scroll right" onClick={scrollRight}>
            <ArrowForwardIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};
