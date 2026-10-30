'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function BlogPageSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="blog-page" />
}
