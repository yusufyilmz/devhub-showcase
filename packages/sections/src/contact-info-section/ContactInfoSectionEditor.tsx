'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function ContactInfoSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="contact-info" />
}
