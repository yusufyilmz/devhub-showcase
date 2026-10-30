'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function HeadingSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="heading" />
}
