import { getPortfolioCopy, type Language } from '@shared/content'
import type { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import { Section } from '../../../../components'
import { ExperienceList } from '../ExperienceList'
export function ExperienceSection({
  experiences,
  language = 'en'
}: {
  experiences: ExperienceWithCompanyProjectAndSkills[]
  language?: Language
}) {
  const text = getPortfolioCopy(language)
  return (
    <Section
      sectionId="experiences"
      title={text.experience}
      subtitle={text.experienceSubtitle}
      eyebrow={text.experience}
    >
      <div className="mt-8">
        <ExperienceList experiences={experiences} language={language} />
      </div>
    </Section>
  )
}
