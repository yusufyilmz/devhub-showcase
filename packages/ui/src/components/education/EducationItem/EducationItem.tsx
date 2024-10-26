import { Card, CardContent, Typography } from '@mui/material'
import { Education } from '@shared/lib/types'
import Link from 'next/link'
import Divider from '@mui/material/Divider'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { formatDateRange } from '@shared/lib/utils'

type EducationProps = {
  education: Education
}

export const EducationItem: React.FC<EducationProps> = ({ education }) => {
  return (
    <TimelineItem className="w-full mt-8">
      <TimelineOppositeContent
        sx={{ m: 'auto 0' }}
        align="right"
        variant="body2"
        color="text.secondary"
        className="w-full max-w-48"
      >
        <Typography className="text-xs font-light pb-0 text-textColor-secondary mt-2">
          {formatDateRange(education.startedAt, education.finishedAt)}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot></TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Card className="section-card ml-4">
          <Link
            href={education.institutionLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardContent className="flex flex-col gap-1">
              <Typography
                variant="h5"
                align="left"
                className="font-semibold text-main-white text-2xl"
              >
                {education.institution}
              </Typography>
              <Typography
                variant="h4"
                align="left"
                className="text-lg font-semibold text-textColor-secondary mb-3"
              >
                {education.degree} in {education.fieldOfStudy}
              </Typography>
              <Divider className="bg-main-light-slate mb-6 mt-0" />
              <p className="font-extralight text-sm text-textColor-lightSlate">
                {education.description}
              </p>
            </CardContent>
          </Link>
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}
