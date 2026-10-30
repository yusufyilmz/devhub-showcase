import { SectionPresentation } from '../shared/presenter'
import type { SectionProps } from '../types'
export function ProjectsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="projects" />
}
