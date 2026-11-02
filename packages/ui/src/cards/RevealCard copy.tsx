"use client";

import { useId, useRef, useState } from "react";

import { getPortfolioCopy } from "@shared/config";

import { revealCardBaseClassName, revealCardCopyStyles } from "./styles";
import type {
  LocalizedRevealCardProps,
  RevealCardcopyRevealCardProps as RevealCardProps,
} from "./types";

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
  id,
  title,
  heading,
  brief,
  children,
  className = "",
  labels = defaultLabels,
}: RevealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const pinned = useRef(false);
  const pointerIntent = useRef<boolean | null>(null);
  const detailsId = useId();

  return (
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
      <div className={revealCardCopyStyles.element1}>{heading}</div>
      {brief && (
        <div aria-hidden={expanded} className={revealCardCopyStyles.element2}>
          <p className={revealCardCopyStyles.element3}>{brief}</p>
        </div>
      )}
      <button
        aria-controls={detailsId}
        aria-expanded={expanded}
        aria-label={`${expanded ? labels.hideDetails : labels.showDetails} ${title}`}
        className={revealCardCopyStyles.element4}
        onClick={() => {
          const next = pointerIntent.current ?? !expanded;
          pointerIntent.current = null;
          pinned.current = next;
          setExpanded(next);
        }}
        onPointerCancel={() => {
          pointerIntent.current = null;
        }}
        onPointerDown={() => {
          pointerIntent.current = !expanded;
        }}
        type="button"
      >
        <span className={revealCardCopyStyles.element5}>
          {expanded ? labels.fullDetails : labels.hoverDetails}
        </span>
        <span className={revealCardCopyStyles.element6}>
          {expanded ? labels.tapClose : labels.tapDetails}
        </span>
        <span className={revealCardCopyStyles.element7}>
          {expanded ? labels.fullDetails : labels.keyboardDetails}
        </span>
        <span aria-hidden="true" className={revealCardCopyStyles.element8}>
          ↗
        </span>
      </button>
      <div
        aria-hidden={!expanded}
        className={revealCardCopyStyles.element9}
        id={detailsId}
        inert={!expanded}
      >
        <div className={revealCardCopyStyles.element10}>{children}</div>
      </div>
    </article>
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
