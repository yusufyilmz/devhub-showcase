import { Card, CardContent } from '@mui/material'
import { Education } from '@prisma/client'
import Link from 'next/link'
import Divider from '@mui/material/Divider'

type EducationProps = {
  education: Education
}

export const EducationItem: React.FC<EducationProps> = ({ education }) => {
  return (
    <Card className="w-full education-card card-base cursor-pointer">
      <Link
        href={education.institutionLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CardContent className="flex flex-col gap-1">
          <h5 className="text-xl font-semibold">{education.institution}</h5>
          <p className="font-normal text-sm italic text-textColor-secondary">
            {education.degree} in {education.fieldOfStudy}
          </p>
          <Divider />
          <p className="font-extralight text-xs mt-4">
            {education.description}
          </p>
          <p className="text-xs font-extralight text-textColor-secondary mt-2">
            {new Date(education.startedAt).toLocaleDateString()} -{' '}
            {education.finishedAt
              ? new Date(education.finishedAt).toLocaleDateString()
              : 'Present'}
          </p>
        </CardContent>
      </Link>
    </Card>
  )
}
