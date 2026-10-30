'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function QuickstartSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="quickstart" />
}
