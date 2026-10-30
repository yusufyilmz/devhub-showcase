import { SectionPresentation } from '../shared/presenter'
import type { SectionProps } from '../types'
export function VideoSection(props: SectionProps) {
  return <SectionPresentation {...props} type="video" />
}
