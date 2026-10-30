import { SectionPresentation } from '../shared/presenter'
import type { SectionProps } from '../types'
export function GalleryGridSection(props: SectionProps) {
  return <SectionPresentation {...props} type="gallery-grid" />
}
