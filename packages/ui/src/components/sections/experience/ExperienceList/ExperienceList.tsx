import React from 'react'
import { ExperienceItem } from '../ExperienceItem/ExperienceItem'
import { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'

import { Timeline } from '../../../../components'

interface ExperienceListProps {
  experiences: ExperienceWithCompanyProjectAndSkills[]
}

export const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences = []
}) => {
  return (
    <Timeline className="w-full">
      {experiences.map(experience => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </Timeline>
  )
}
