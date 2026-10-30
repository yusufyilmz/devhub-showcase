'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function CareersSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="careers" />
}
