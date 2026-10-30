'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function CustomSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="custom" />
}
