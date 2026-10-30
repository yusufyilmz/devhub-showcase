import { SectionPresentation } from '../shared/presenter'
import type { SectionProps } from '../types'
export function ClientsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="clients" />
}
