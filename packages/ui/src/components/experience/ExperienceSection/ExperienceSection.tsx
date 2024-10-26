import { ExperienceList } from '../ExperienceList'
import { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import { Section } from '../../ui/Section'
import { copy } from '@shared/content'
import { Box } from '@mui/material'

interface ExperienceSectionProps {
  experiences: ExperienceWithCompanyProjectAndSkills[]
}

const { id, title, subtitle } = copy.header.sections.experiences

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences
}) => (
  <Section sectionId={id} title={title} subtitle={subtitle}>
    <Box>
      <ExperienceList experiences={experiences} />
    </Box>
  </Section>
)
