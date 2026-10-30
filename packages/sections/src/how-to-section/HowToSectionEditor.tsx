'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function HowToSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="how-to" />
}
