'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function FAQSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="faq" />
}
