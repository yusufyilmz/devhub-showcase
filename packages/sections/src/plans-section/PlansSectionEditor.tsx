'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function PlansSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="plans" />
}
