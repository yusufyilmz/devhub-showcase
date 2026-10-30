'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function ProjectsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="projects" />
}
