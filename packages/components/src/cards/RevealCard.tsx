"use client";

import { type ReactNode, useId, useRef, useState } from "react";

const defaultLabels = {
  fullDetails: "Full details",
  hideDetails: "Hide details for",
  hoverDetails: "Hover to explore",
  keyboardDetails: "Show details",
  showDetails: "Show details for",
  tapClose: "Tap to close",
  tapDetails: "Tap for details",
};
interface RevealCardProps {
  brief?: string | null;
  children: ReactNode;
  className?: string;
  heading: ReactNode;
  id?: string;
  labels?: typeof defaultLabels;
  title: string;
}

export function RevealCard({
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
      className={`section-card reveal-card ${className}`}
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
      <div className="reveal-heading">{heading}</div>
      {brief && (
        <div aria-hidden={expanded} className="reveal-preview">
          <p className="reveal-brief">{brief}</p>
        </div>
      )}
      <button
        aria-controls={detailsId}
        aria-expanded={expanded}
        aria-label={`${expanded ? labels.hideDetails : labels.showDetails} ${title}`}
        className="reveal-toggle"
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
        <span className="reveal-hint-desktop">
          {expanded ? labels.fullDetails : labels.hoverDetails}
        </span>
        <span className="reveal-hint-touch">{expanded ? labels.tapClose : labels.tapDetails}</span>
        <span className="reveal-hint-keyboard">
          {expanded ? labels.fullDetails : labels.keyboardDetails}
        </span>
        <span aria-hidden="true" className="reveal-chevron">
          ↗
        </span>
      </button>
      <div aria-hidden={!expanded} className="reveal-details" id={detailsId} inert={!expanded}>
        <div className="reveal-details-inner">{children}</div>
      </div>
    </article>
  );
}
