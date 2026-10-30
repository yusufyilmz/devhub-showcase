'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function CTASectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="cta" />
}
