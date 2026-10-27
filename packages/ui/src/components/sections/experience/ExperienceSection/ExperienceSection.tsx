import { copy } from '@shared/content'
import type { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import type React from 'react'
import { Section } from '../../../../components'
import { ExperienceList } from '../ExperienceList'

interface ExperienceSectionProps {
  experiences: ExperienceWithCompanyProjectAndSkills[]
}

const { id, title, subtitle } = copy.header.sections.experiences

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences
}) => (
  <Section sectionId={id} title={title} subtitle={subtitle}>
    <div className="mt-8">
      <ExperienceList experiences={experiences} />
    </div>
  </Section>
)
