'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function PinterestSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="pinterest" />
}
