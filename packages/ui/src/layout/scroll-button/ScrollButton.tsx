"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { IconButton } from "../../buttons/icon-button/IconButton";
import { ArrowDownwardIcon } from "../../display/icons/Icons";

type ScrollButtonProps = {
  sectionIds: string[];
};

export const ScrollButton: React.FC<ScrollButtonProps> = ({ sectionIds }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToNextSection = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < sectionIds.length && sectionIds[nextIndex]) {
      const nextSection = document.getElementById(sectionIds[nextIndex]);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
        setCurrentIndex(nextIndex);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      for (let i = 0; i < sectionIds.length; i++) {
        const section = document.getElementById(sectionIds[i] as string);
        if (section) {
          const rect = section.getBoundingClientRect();
          const top = rect.top;
          const bottom = rect.bottom;
          const windowHeight = window.innerHeight;

          if (top <= windowHeight / 2 && bottom >= windowHeight / 2) {
            setCurrentIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds]);

  if (currentIndex === sectionIds.length - 1) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center animate-bounce z-50">
      <IconButton
        aria-label="Scroll to next section"
        className="rounded-full"
        onClick={scrollToNextSection}
        size="lg"
        surface="portfolio"
        variant="outline"
      >
        <ArrowDownwardIcon />
      </IconButton>
    </div>
  );
};
