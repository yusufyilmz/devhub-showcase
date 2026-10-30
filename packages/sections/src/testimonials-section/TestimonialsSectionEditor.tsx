'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function TestimonialsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="testimonials" />
}
