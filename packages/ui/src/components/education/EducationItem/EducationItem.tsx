import { Card, CardContent } from '@mui/material'
import { Education } from '@prisma/client'

type EducationProps = {
  education: Education
}

export const EducationItem: React.FC<EducationProps> = ({ education }) => {
  return (
    <Card className="w-8/12 education-card p-2 bg-backgroundColor-card rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
      <CardContent>
        <h6 className="text-xl font-semibold">{education.institution}</h6>
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
    </Card>
  )
}
