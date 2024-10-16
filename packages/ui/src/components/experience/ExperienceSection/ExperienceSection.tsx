import { PageHeader } from '../../ui/PageHeader'
import { ExperienceList } from '../ExperienceList'
import { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'

interface ExperienceSectionProps {
  experiences: ExperienceWithCompanyProjectAndSkills[]
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences
}) => {
  return (
    <section className="w-full px-page-px-sm" id="experiences">
      <div className="text-center">
        <PageHeader
          title="Professional Experience"
          subtitle="A Summary of My Roles, Companies, and Projects"
        />
        <ExperienceList experiences={experiences} />
      </div>
    </section>
  )
}
