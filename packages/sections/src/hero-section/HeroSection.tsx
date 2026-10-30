import { SectionPresentation } from '../shared/presenter'
import type { SectionProps } from '../types'
export function HeroSection(props: SectionProps) {
  return <SectionPresentation {...props} type="hero" />
}
