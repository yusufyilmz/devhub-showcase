import { Education } from '@shared/lib/types'
import { EducationItem } from '../EducationItem/EducationItem'
import { Section } from '../../ui/Section'
import { copy } from '@shared/content'
import Timeline from '@mui/lab/Timeline'
import { timelineItemClasses } from '@mui/lab/TimelineItem'

interface EducationsSectionProps {
  educations: Education[]
}

const { id, title, subtitle } = copy.header.sections.educations

export const EducationsSection: React.FC<EducationsSectionProps> = ({
  educations
}) => {
  return (
    <Section className="my-32" sectionId={id} title={title} subtitle={subtitle}>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0
          }
        }}
        className="overflow-y-auto no-scrollbar w-full mt-32"
      >
        {educations.map(education => (
          <EducationItem key={education.id} education={education} />
        ))}
      </Timeline>
    </Section>
  )
}
