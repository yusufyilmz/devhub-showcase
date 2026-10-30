'use client'
import { SectionContentEditor } from '../shared/editor'
import type { SectionEditorProps } from '../types'
export function ShopItemsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="shop-items" />
}
