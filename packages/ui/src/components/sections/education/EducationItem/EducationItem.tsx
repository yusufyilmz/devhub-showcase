import type { Education } from '@shared/lib/types'
import { formatDateRange } from '@shared/lib/utils'
import Link from 'next/link'
import type React from 'react'
import {
  Card,
  CardBody,
  Divider,
  TimelineBody,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  Typography
} from '../../../../components'

type EducationProps = {
  education: Education
}

export const EducationItem: React.FC<EducationProps> = ({ education }) => {
  return (
    <TimelineItem>
      <TimelineHeader>
        <TimelineIcon />
        <Typography className="text-xs font-light text-main-light-slate mt-2">
          {formatDateRange(education.startedAt, education.finishedAt)}
        </Typography>
      </TimelineHeader>
      <TimelineBody className="ml-0 mr-4 my-8 md:mx-8">
        <Link
          href={education.institutionLink ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card className="section-card education-card w-full">
            <CardBody className="flex flex-col gap-1">
              <Typography
                variant="h3"
                className="font-semibold text-main-white text-left"
              >
                {education.institution}
              </Typography>
              <Typography
                variant="h4"
                className="font-semibold text-textColor-secondary mb-3 text-left"
              >
                {education.degree} in {education.fieldOfStudy}
              </Typography>

              <Divider className="bg-main-light-slate mb-6 mt-0" />
              <Typography
                variant="overline"
                className="font-extralight text-sm text-textColor-lightSlate"
              >
                {education.description}
              </Typography>
            </CardBody>
          </Card>
        </Link>
      </TimelineBody>
    </TimelineItem>
  )
}
