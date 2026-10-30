'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function HeroSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="hero" />
}
