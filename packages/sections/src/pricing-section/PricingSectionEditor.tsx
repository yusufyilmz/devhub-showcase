'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function PricingSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="pricing" />
}
