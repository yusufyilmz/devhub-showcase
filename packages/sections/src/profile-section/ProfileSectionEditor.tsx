'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function ProfileSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="profile" />
}
