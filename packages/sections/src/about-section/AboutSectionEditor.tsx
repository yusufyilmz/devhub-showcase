'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function AboutSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="about" />
}
