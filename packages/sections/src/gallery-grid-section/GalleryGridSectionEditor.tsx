'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function GalleryGridSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="gallery-grid" />
}
