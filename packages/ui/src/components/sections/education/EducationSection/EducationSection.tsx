import React from 'react'
import { Education } from '@shared/lib/types'
import { EducationItem } from '../EducationItem/EducationItem'
import { copy } from '@shared/content'
import { Timeline, Section } from '../../../../components'

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
          {educations.map(education => (
            <EducationItem key={education.id} education={education} />
          ))}
        </Timeline>
      </div>
    </Section>
  )
}
