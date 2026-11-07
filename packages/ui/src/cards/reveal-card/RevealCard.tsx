"use client";

import { useId, useRef, useState } from "react";

import { getPortfolioCopy } from "@shared/config";

import { Button } from "../../buttons/button/Button";
import { CardBase as Card } from "../card/CardBase";
import { revealCardBaseClassName, revealCardStyles } from "../styles";
import type { LocalizedRevealCardProps, RevealCardProps } from "../types";

const defaultLabels = {
  fullDetails: "Full details",
  hideDetails: "Hide details for",
  hoverDetails: "Hover to explore",
  keyboardDetails: "Show details",
  showDetails: "Show details for",
  tapClose: "Tap to close",
  tapDetails: "Tap for details",
};

export function RevealCardBase({
  backdrop,
  id,
  title,
  heading,
  brief,
  children,
  className = "",
  labels = defaultLabels,
  pinOnDetailsClick = false,
}: RevealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const pinned = useRef(false);
  const pointerIntent = useRef<boolean | null>(null);
  const detailsId = useId();

  return (
    <Card asChild backdrop={backdrop} interaction="lift" layout="plain" surface="portfolio">
      <article
        className={revealCardBaseClassName(className)}
        data-expanded={expanded}
        id={id}
        onBlurCapture={(event) => {
          if (!pinned.current && !event.currentTarget.contains(event.relatedTarget))
            setExpanded(false);
        }}
        onFocusCapture={() => setExpanded(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            pinned.current = false;
            event.currentTarget.querySelector<HTMLButtonElement>(".reveal-toggle")?.focus();
            setExpanded(false);
          }
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setExpanded(true);
        }}
        onPointerLeave={(event) => {
          if (!pinned.current && !event.currentTarget.contains(document.activeElement))
            setExpanded(false);
        }}
      >
        <div className={revealCardStyles.element1}>{heading}</div>
        {brief && (
          <div aria-hidden={expanded} className={revealCardStyles.element2}>
            <p className={revealCardStyles.element3}>{brief}</p>
          </div>
        )}
        <Button
          aria-controls={detailsId}
          aria-expanded={expanded}
          aria-label={`${expanded ? labels.hideDetails : labels.showDetails} ${title}`}
          className={revealCardStyles.element4}
          onClick={() => {
            const next = pointerIntent.current ?? !pinned.current;
            pointerIntent.current = null;
            pinned.current = next;
            setExpanded(next);
          }}
          onPointerCancel={() => {
            pointerIntent.current = null;
          }}
          onPointerDown={() => {
            pointerIntent.current = !pinned.current;
          }}
          type="button"
          variant="ghost"
        >
          <span className={revealCardStyles.element5}>
            {expanded ? labels.fullDetails : labels.hoverDetails}
          </span>
          <span className={revealCardStyles.element6}>
            {expanded ? labels.tapClose : labels.tapDetails}
          </span>
          <span className={revealCardStyles.element7}>
            {expanded ? labels.fullDetails : labels.keyboardDetails}
          </span>
          <span aria-hidden="true" className={revealCardStyles.element8}>
            ↗
          </span>
        </Button>
        <div
          aria-hidden={!expanded}
          className={revealCardStyles.element9}
          id={detailsId}
          inert={!expanded}
          onClickCapture={
            pinOnDetailsClick
              ? (event) => {
                  if (
                    event.target instanceof Element &&
                    event.target.closest("button, a, input, select, textarea")
                  )
                    pinned.current = true;
                }
              : undefined
          }
        >
          <div className={revealCardStyles.element10}>{children}</div>
        </div>
      </article>
    </Card>
  );
}

export function RevealCard({ language = "en", ...props }: LocalizedRevealCardProps) {
  const text = getPortfolioCopy(language);
  const labels = {
    fullDetails: text.fullDetails,
    hideDetails: text.hideDetails,
    hoverDetails: text.hoverDetails,
    keyboardDetails: text.keyboardDetails,
    showDetails: text.showDetails,
    tapClose: text.tapClose,
    tapDetails: text.tapDetails,
  };
  return <RevealCardBase {...props} labels={labels} />;
}
