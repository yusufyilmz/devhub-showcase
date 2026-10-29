import type { Language } from '@shared/content'
import type { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import type React from 'react'
import { Timeline } from '../../../../components'
import { ExperienceItem } from '../ExperienceItem/ExperienceItem'

interface ExperienceListProps {
  language?: Language
  experiences: ExperienceWithCompanyProjectAndSkills[]
}

export const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences = [],
  language = 'en'
}) => {
  return (
    <Timeline className="w-full">
      {experiences.map((experience) => (
        <ExperienceItem
          key={experience.id}
          experience={experience}
          language={language}
        />
      ))}
    </Timeline>
  )
}
