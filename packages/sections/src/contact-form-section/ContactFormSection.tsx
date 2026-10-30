import { SectionPresentation } from '../shared/presenter'
import type { SectionProps } from '../types'
export function ContactFormSection(props: SectionProps) {
  return <SectionPresentation {...props} type="contact-form" />
}
