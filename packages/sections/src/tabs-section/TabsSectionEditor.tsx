'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function TabsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="tabs" />
}
