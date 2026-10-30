'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function ContactFormSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="contact-form" />
}
