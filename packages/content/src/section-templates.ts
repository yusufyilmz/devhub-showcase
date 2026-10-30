import type { CustomSection } from './custom-sections'
export type SectionTemplateFile = {
  format: 'mydevstudio.sections'
  version: 1
  name: string
  includesContent: boolean
  sections: CustomSection[]
}
export type SavedSectionTemplate = SectionTemplateFile & { id: string }
