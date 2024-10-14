import { Card, CardContent } from '@mui/material'
import { Education } from '@prisma/client'
import Link from 'next/link'

type EducationProps = {
  education: Education
}

export const EducationItem: React.FC<EducationProps> = ({ education }) => {
  return (
    <Card className="w-8/12 education-card p-2 bg-backgroundColor-card rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer">
      <Link
        href={education.institutionLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CardContent>
          <h5 className="text-xl font-semibold">{education.institution}</h5>
          <p className="font-normal text-sm italic text-textColor-secondary">
            {education.degree} in {education.fieldOfStudy}
          </p>
          <p className="text-xs font-extralight text-textColor-secondary mt-2">
            {new Date(education.startedAt).toLocaleDateString()} -{' '}
            {education.finishedAt
              ? new Date(education.finishedAt).toLocaleDateString()
              : 'Present'}
          </p>

          <p className="font-extralight text-xs mt-4">
            {education.description}
          </p>
        </CardContent>
      </Link>
    </Card>
  )
}
