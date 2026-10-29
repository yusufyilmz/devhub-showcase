'use client'

import { type ReactNode, useId, useRef, useState } from 'react'

const defaultLabels = {
  showDetails: 'Show details for',
  hideDetails: 'Hide details for',
  fullDetails: 'Full details',
  hoverDetails: 'Hover to explore',
  tapDetails: 'Tap for details',
  tapClose: 'Tap to close',
  keyboardDetails: 'Show details'
}
interface RevealCardProps {
  labels?: typeof defaultLabels
  id?: string
  title: string
  heading: ReactNode
  brief?: string | null
  children: ReactNode
  className?: string
}

export function RevealCard({
  id,
  title,
  heading,
  brief,
  children,
  className = '',
  labels = defaultLabels
}: RevealCardProps) {
  const [expanded, setExpanded] = useState(false)
  const pinned = useRef(false)
  const pointerIntent = useRef<boolean | null>(null)
  const detailsId = useId()

  return (
    <article
      id={id}
      className={`section-card reveal-card ${className}`}
      data-expanded={expanded}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setExpanded(true)
      }}
      onPointerLeave={(event) => {
        if (
          !pinned.current &&
          !event.currentTarget.contains(document.activeElement)
        )
          setExpanded(false)
      }}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(event) => {
        if (
          !pinned.current &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setExpanded(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          pinned.current = false
          event.currentTarget
            .querySelector<HTMLButtonElement>('.reveal-toggle')
            ?.focus()
          setExpanded(false)
        }
      }}
    >
      <div className="reveal-heading">{heading}</div>
      {brief && (
        <div className="reveal-preview" aria-hidden={expanded}>
          <p className="reveal-brief">{brief}</p>
        </div>
      )}
      <button
        type="button"
        className="reveal-toggle"
        aria-label={`${expanded ? labels.hideDetails : labels.showDetails} ${title}`}
        aria-expanded={expanded}
        aria-controls={detailsId}
        onPointerDown={() => {
          pointerIntent.current = !expanded
        }}
        onPointerCancel={() => {
          pointerIntent.current = null
        }}
        onClick={() => {
          const next = pointerIntent.current ?? !expanded
          pointerIntent.current = null
          pinned.current = next
          setExpanded(next)
        }}
      >
        <span className="reveal-hint-desktop">
          {expanded ? labels.fullDetails : labels.hoverDetails}
        </span>
        <span className="reveal-hint-touch">
          {expanded ? labels.tapClose : labels.tapDetails}
        </span>
        <span className="reveal-hint-keyboard">
          {expanded ? labels.fullDetails : labels.keyboardDetails}
        </span>
        <span className="reveal-chevron" aria-hidden="true">
          ↗
        </span>
      </button>
      <div
        id={detailsId}
        className="reveal-details"
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div className="reveal-details-inner">{children}</div>
      </div>
    </article>
  )
}
