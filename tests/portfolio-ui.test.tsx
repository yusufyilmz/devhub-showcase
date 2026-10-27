// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { profile } from '../packages/content/src/profile'
import { getPortfolioResources } from '../packages/lib/src/services/portfolio'
import { ProjectItem } from '../packages/ui/src/components/sections/project/ProjectItem/ProjectItem'
import { SummarySection } from '../packages/ui/src/components/sections/summary/SummarySection/SummarySection'

afterEach(cleanup)
it('renders the current professional title in the existing hero layout', () => {
  render(<SummarySection />)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
    profile.name
  )
  expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
    profile.title
  )
})
it('links a personal project to its live app and GitHub source', () => {
  const project = getPortfolioResources().projects.find(
    (item) => item.id === 'fitness-os'
  )
  if (!project) throw new Error('Missing Fitness OS project')
  render(<ProjectItem project={project} />)
  expect(
    screen.getByRole('link', { name: 'Visit project' }).getAttribute('href')
  ).toBe('https://yusuf-fitness-os.vercel.app')
  expect(
    screen.getByRole('link', { name: 'Source on GitHub' }).getAttribute('href')
  ).toBe('https://github.com/yusufyilmz/yusuf-fitness-os')
})
