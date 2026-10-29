// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { SectionOrderEditor } from '../apps/web/features/admin/section-order-editor'
import {
  moveItem,
  SortableList
} from '../packages/components/src/sortable-list'
import { profile } from '../packages/content/src/profile'

beforeEach(() =>
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0)
    return 0
  })
)
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
it('moves an item without mutating the original list or losing entries', () => {
  const original = ['a', 'b', 'c']
  expect(moveItem(original, 2, 0)).toEqual(['c', 'a', 'b'])
  expect(original).toEqual(['a', 'b', 'c'])
  expect(moveItem(original, 0, 7)).toEqual(original)
})
it('supports keyboard and button reordering with announcements and boundary controls', () => {
  function Harness() {
    const [items, setItems] = useState([
      { id: 'a', label: 'About' },
      { id: 'b', label: 'Projects' }
    ])
    return (
      <SortableList
        label="Sections"
        items={items}
        onChange={(ids) =>
          setItems(ids.flatMap((id) => items.filter((item) => item.id === id)))
        }
      />
    )
  }
  render(<Harness />)
  expect(
    screen
      .getByRole('button', { name: 'Move About up' })
      .hasAttribute('disabled')
  ).toBe(true)
  fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Projects' }), {
    key: 'Home'
  })
  expect(screen.getAllByRole('listitem')[0]?.textContent).toContain('Projects')
  expect(screen.getByRole('status').textContent).toContain(
    'Projects moved to position 1 of 2'
  )
  fireEvent.click(screen.getByRole('button', { name: 'Move About up' }))
  expect(screen.getAllByRole('listitem')[0]?.textContent).toContain('About')
  fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder About' }), {
    key: 'ArrowUp'
  })
  expect(screen.getAllByRole('listitem')[0]?.textContent).toContain('About')
})
it('reset clears the override and restores the current layout default', () => {
  const onChange = vi.fn()
  render(
    <SectionOrderEditor
      profile={{
        ...profile,
        portfolioType: 'designer',
        sectionOrder: [
          'languages',
          'about',
          'experience',
          'projects',
          'education',
          'skills'
        ]
      }}
      onChange={onChange}
    />
  )
  fireEvent.click(
    screen.getByRole('button', { name: 'Reset to layout default' })
  )
  const updated = onChange.mock.calls[0]?.[0]
  expect(updated.sectionOrder).toBeUndefined()
  expect(updated.portfolioType).toBe('designer')
  expect(updated.name).toBe(profile.name)
})
