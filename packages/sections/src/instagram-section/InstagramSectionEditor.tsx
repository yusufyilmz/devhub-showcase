'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function InstagramSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="instagram" />
}
