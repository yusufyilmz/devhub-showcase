import { SectionPresentation } from '../shared/presenter'
import type { SectionProps } from '../types'
export function FeaturesSection(props: SectionProps) {
  return <SectionPresentation {...props} type="features" />
}
