import { ExperienceList } from '../ExperienceList'
import { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import { Section } from '../../ui/Section'
import { copy } from '@shared/content'

interface ExperienceSectionProps {
  experiences: ExperienceWithCompanyProjectAndSkills[]
}

const { id, title, subtitle } = copy.header.sections.experiences

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences
}) => (
  <Section sectionId={id} title={title} subtitle={subtitle}>
    <ExperienceList experiences={experiences} />
  </Section>
)
