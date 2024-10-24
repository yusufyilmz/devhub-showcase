import { Education } from '@prisma/client'
import { PageHeader } from '../../ui/PageHeader'
import { EducationItem } from '../EducationItem/EducationItem'
import { Grid } from '@mui/material'

interface EducationsSectionProps {
  educations: Education[]
}

export const EducationsSection: React.FC<EducationsSectionProps> = ({
  educations
}) => {
  return (
    <section className="w-full px-page-px-sm md:px-page-px" id="education">
      <div className="text-center">
        <PageHeader
          title="Education & Credentials"
          subtitle="Academic Background and Achievements"
        />
        <div className="w-full gap-8 flex flex-row place-items-stretch items-stretch content-stretch place-content-stretch">
          {educations.map(education => (
            <EducationItem key={education.id} education={education} />
          ))}
        </div>
      </div>
    </section>
  )
}
