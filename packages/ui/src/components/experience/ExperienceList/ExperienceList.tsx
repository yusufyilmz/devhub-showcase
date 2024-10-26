import { ExperienceItem } from '../ExperienceItem/ExperienceItem'
import { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import Timeline from '@mui/lab/Timeline'

import { timelineItemClasses } from '@mui/lab/TimelineItem'

interface ExperienceListProps {
  experiences: ExperienceWithCompanyProjectAndSkills[]
}

export const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences
}) => {
  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0
        }
      }}
      className="overflow-y-auto no-scrollbar w-full"
    >
      {experiences.map(experience => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </Timeline>
  )
}
