import { Box, Grid, Grid2 } from '@mui/material'
import { Education } from '@prisma/client'
import { PageHeader } from '../../ui/PageHeader'
import { EducationItem } from '../EducationItem/EducationItem'

interface EducationsSectionProps {
  educations: Education[]
}

export const EducationsSection: React.FC<EducationsSectionProps> = ({
  educations
}) => {
  return (
    <section className="w-full px-page-px" id="educations">
      <div className="text-center">
        <PageHeader
          title="Education & Credentials"
          subtitle="Academic Background and Achievements"
        />
        <div className="w-full gap-8 flex flex-row">
          {educations.map(education => (
            <EducationItem key={education.id} education={education} />
          ))}
        </div>
      </div>
    </section>
  )
}
