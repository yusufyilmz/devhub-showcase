'use client'
import { type ReactNode, useId, useRef, useState } from 'react'
export type SectionItem = { id: string; title: string; content: ReactNode }
export function SectionGrid({
  items,
  label,
  variant = 'cards'
}: {
  items: SectionItem[]
  label: string
  variant?: 'cards' | 'gallery'
}) {
  return (
    <ul
      className={`section-view-grid section-view-${variant}`}
      aria-label={label}
    >
      {items.map((item) => (
        <li key={item.id}>
          <h3>{item.title}</h3>
          {item.content}
        </li>
      ))}
    </ul>
  )
}
export function SectionAccordion({
  items,
  label
}: {
  items: SectionItem[]
  label: string
}) {
  return (
    <section aria-label={label} className="section-view-accordion">
      {items.map((item) => (
        <details key={item.id}>
          <summary>{item.title}</summary>
          <div>{item.content}</div>
        </details>
      ))}
    </section>
  )
}
export function SectionTabs({
  items,
  label
}: {
  items: SectionItem[]
  label: string
}) {
  const [selected, setSelected] = useState('')
  const id = useId()
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const index = Math.max(
    0,
    items.findIndex((item) => item.id === selected)
  )
  if (!items.length) return null
  function select(next: number) {
    const item = items[next]
    if (item) {
      setSelected(item.id)
      buttons.current[next]?.focus()
    }
  }
  return (
    <section className="section-view-tabs" aria-label={label}>
      <div role="tablist" aria-label={label}>
        {items.map((item, n) => (
          <button
            key={item.id}
            ref={(node) => {
              buttons.current[n] = node
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${n}`}
            aria-controls={`${id}-panel-${n}`}
            aria-selected={n === index}
            tabIndex={n === index ? 0 : -1}
            onClick={() => setSelected(item.id)}
            onKeyDown={(event) => {
              const keys: Record<string, number> = {
                Home: 0,
                End: items.length - 1,
                ArrowRight: (index + 1) % items.length,
                ArrowLeft: (index + items.length - 1) % items.length
              }
              const next = keys[event.key]
              if (next !== undefined) {
                event.preventDefault()
                select(next)
              }
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
      {items.map((item, n) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${id}-panel-${n}`}
          aria-labelledby={`${id}-tab-${n}`}
          hidden={n !== index}
        >
          {item.content}
        </div>
      ))}
    </section>
  )
}
export function SectionCarousel({
  items,
  label,
  previousLabel = 'Previous items',
  nextLabel = 'Next items'
}: {
  items: SectionItem[]
  label: string
  previousLabel?: string
  nextLabel?: string
}) {
  const list = useRef<HTMLUListElement>(null)
  const id = useId()
  function move(direction: number) {
    const node = list.current
    if (node)
      node.scrollBy({
        left: direction * node.clientWidth * 0.85,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth'
      })
  }
  if (!items.length) return null
  return (
    <section aria-label={label} className="section-view-carousel">
      <div className="section-view-controls">
        <button
          type="button"
          aria-label={previousLabel}
          aria-controls={id}
          onClick={() => move(-1)}
        >
          ←
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          aria-controls={id}
          onClick={() => move(1)}
        >
          →
        </button>
      </div>
      <ul ref={list} id={id}>
        {items.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            {item.content}
          </li>
        ))}
      </ul>
    </section>
  )
}
