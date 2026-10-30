import { SectionPresentation } from '../shared/presenter'
import type { SectionProps } from '../types'
export function MenuSection(props: SectionProps) {
  return <SectionPresentation {...props} type="menu" />
}
