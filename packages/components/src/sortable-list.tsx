'use client'
import { type PointerEvent, useEffect, useId, useRef, useState } from 'react'

export function moveItem<T>(
  items: readonly T[],
  from: number,
  to: number
): T[] {
  const next = [...items]
  if (from < 0 || to < 0 || from >= next.length || to >= next.length)
    return next
  const [item] = next.splice(from, 1)
  if (item !== undefined) next.splice(to, 0, item)
  return next
}
type Item = { id: string; label: string }
type Drag = { id: string; items: Item[]; pointerId: number }
export function SortableList({
  items,
  onChange,
  label
}: {
  items: Item[]
  onChange: (ids: string[]) => void
  label: string
}) {
  const root = useRef<HTMLOListElement>(null)
  const active = useRef<Drag | null>(null)
  const [preview, setPreview] = useState<Item[] | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const helpId = useId()
  const visible = preview ?? items
  useEffect(() => {
    const cancel = (event: KeyboardEvent) => {
      const current = active.current
      if (event.key !== 'Escape' || !current) return
      active.current = null
      setPreview(null)
      setAnnouncement('Reorder cancelled.')
      if (root.current?.hasPointerCapture(current.pointerId))
        root.current.releasePointerCapture(current.pointerId)
    }
    window.addEventListener('keydown', cancel)
    return () => window.removeEventListener('keydown', cancel)
  }, [])
  function commit(next: Item[], id: string) {
    onChange(next.map((item) => item.id))
    requestAnimationFrame(() => {
      const row = Array.from(root.current?.children ?? []).find(
        (element) => (element as HTMLElement).dataset.sortableId === id
      )
      row
        ?.querySelector<HTMLButtonElement>('.sortable-handle')
        ?.focus({ preventScroll: true })
    })
    const index = next.findIndex((item) => item.id === id)
    setAnnouncement(
      `${next[index]?.label} moved to position ${index + 1} of ${next.length}.`
    )
  }
  function move(id: string, target: number) {
    const index = items.findIndex((item) => item.id === id)
    if (target === index || target < 0 || target >= items.length) return
    commit(moveItem(items, index, target), id)
  }
  function start(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (!event.isPrimary || event.button !== 0) return
    event.currentTarget.focus()
    active.current = { id, items: [...items], pointerId: event.pointerId }
    setPreview(items)
    root.current?.setPointerCapture(event.pointerId)
    setAnnouncement(
      'Dragging section. Release to place, or press Escape to cancel.'
    )
  }
  function drag(event: PointerEvent<HTMLOListElement>) {
    const current = active.current
    if (!current || current.pointerId !== event.pointerId) return
    const rows = Array.from(event.currentTarget.children)
    const target = rows.reduce((best, row, index) => {
      const center = (element: Element) => {
        const rect = element.getBoundingClientRect()
        return rect.top + rect.height / 2
      }
      return Math.abs(center(row) - event.clientY) <
        Math.abs(center(rows[best] ?? row) - event.clientY)
        ? index
        : best
    }, 0)
    const from = current.items.findIndex((item) => item.id === current.id)
    current.items = moveItem(current.items, from, target)
    setPreview(current.items)
    if (event.clientY < 80) window.scrollBy(0, -15)
    if (event.clientY > window.innerHeight - 80) window.scrollBy(0, 15)
  }
  function finish(cancel = false) {
    const current = active.current
    if (!current) return
    active.current = null
    setPreview(null)
    if (cancel) setAnnouncement('Reorder cancelled.')
    else if (current.items.some((item, index) => item.id !== items[index]?.id))
      commit(current.items, current.id)
    if (root.current?.hasPointerCapture(current.pointerId))
      root.current.releasePointerCapture(current.pointerId)
  }
  return (
    <div className="sortable-panel">
      <p id={helpId}>
        Drag a handle to reorder. You can also use the move buttons, or focus a
        handle and use the arrow keys. Press Escape to cancel a drag.
      </p>
      <ol
        ref={root}
        aria-label={label}
        className="sortable-list"
        onPointerMove={drag}
        onPointerUp={() => finish()}
        onPointerCancel={() => finish(true)}
        onLostPointerCapture={() => finish(true)}
      >
        {visible.map((item, index) => (
          <li
            key={item.id}
            data-sortable-id={item.id}
            data-dragging={active.current?.id === item.id || undefined}
          >
            <button
              type="button"
              className="sortable-handle"
              aria-label={`Reorder ${item.label}`}
              aria-describedby={helpId}
              onPointerDown={(event) => start(event, item.id)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  finish(true)
                  return
                }
                if (active.current) return
                const targets: Record<string, number> = {
                  ArrowUp: index - 1,
                  ArrowDown: index + 1,
                  Home: 0,
                  End: items.length - 1
                }
                const target = targets[event.key]
                if (target === undefined) return
                event.preventDefault()
                move(item.id, target)
              }}
            >
              <span aria-hidden="true">⠿</span>
            </button>
            <span className="sortable-number" aria-hidden="true">
              {index + 1}
            </span>
            <span className="sortable-label">{item.label}</span>
            <button
              type="button"
              className="sortable-move"
              aria-label={`Move ${item.label} up`}
              disabled={index === 0}
              onClick={() => move(item.id, index - 1)}
            >
              ↑
            </button>
            <button
              type="button"
              className="sortable-move"
              aria-label={`Move ${item.label} down`}
              disabled={index === items.length - 1}
              onClick={() => move(item.id, index + 1)}
            >
              ↓
            </button>
          </li>
        ))}
      </ol>
      <p className="sortable-announcement" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}
