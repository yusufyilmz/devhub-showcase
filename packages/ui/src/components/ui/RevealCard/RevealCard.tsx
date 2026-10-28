'use client'

import { type ReactNode, useId, useRef, useState } from 'react'

interface RevealCardProps {
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
  className = ''
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
      {!expanded && brief && <p className="reveal-brief">{brief}</p>}
      <button
        type="button"
        className="reveal-toggle"
        aria-label={`${expanded ? 'Hide' : 'Show'} details for ${title}`}
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
          {expanded ? 'Full details' : 'Hover to explore'}
        </span>
        <span className="reveal-hint-touch">
          {expanded ? 'Tap to close' : 'Tap for details'}
        </span>
        <span className="reveal-hint-keyboard">
          {expanded ? 'Full details' : 'Show details'}
        </span>
        <span className="reveal-chevron" aria-hidden="true">
          ↗
        </span>
      </button>
      <div id={detailsId} className="reveal-details" hidden={!expanded}>
        {children}
      </div>
    </article>
  )
}
