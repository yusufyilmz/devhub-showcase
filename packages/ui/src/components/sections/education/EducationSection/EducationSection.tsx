import { copy } from '@shared/content'
import type { Education } from '@shared/lib/types'
import type React from 'react'
import { Section, Timeline } from '../../../../components'
import { EducationItem } from '../EducationItem/EducationItem'

interface EducationsSectionProps {
  educations: Education[]
}

const { id, title, subtitle } = copy.header.sections.educations

export const EducationsSection: React.FC<EducationsSectionProps> = ({
  educations = []
}) => {
  return (
    <Section sectionId={id} title={title} subtitle={subtitle}>
      <div className="flex items-center md:min-h-[calc(100vh-4rem)]">
        <Timeline>
          {educations.map((education) => (
            <EducationItem key={education.id} education={education} />
          ))}
        </Timeline>
      </div>
    </Section>
  )
}
