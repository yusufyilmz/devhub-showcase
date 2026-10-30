import { SectionPresentation } from '../shared/presenter'
import type { SectionProps } from '../types'
export function PlansSection(props: SectionProps) {
  return <SectionPresentation {...props} type="plans" />
}
