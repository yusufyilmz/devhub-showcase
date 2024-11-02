import { Education } from '@shared/lib/types'
import Link from 'next/link'
import {
  Divider,
  Card,
  CardBody,
  Typography,
  TimelineBody,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineItem
} from '../../../../components'
import { formatDateRange } from '@shared/lib/utils'

type EducationProps = {
  education: Education
}

export const EducationItem: React.FC<EducationProps> = ({ education }) => {
  return (
    <TimelineItem className="w-full">
      <TimelineConnector color="white" />
      <TimelineHeader className="h-4">
        <TimelineIcon color="white" />
        <Typography className="text-xs font-light pb-0 text-main-light-slate mt-2">
          {formatDateRange(education.startedAt, education.finishedAt)}
        </Typography>
      </TimelineHeader>
      <TimelineBody className="ml-0 mr-4 my-8 md:mx-8">
        <Card className="section-card education-card w-full">
          <Link
            href={education.institutionLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardBody className="flex flex-col gap-1">
              <Typography
                variant="h3"
                className="font-semibold text-main-white text-2xl text-left"
              >
                {education.institution}
              </Typography>
              <Typography
                variant="h4"
                className="text-lg font-semibold text-textColor-secondary mb-3 text-left"
              >
                {education.degree} in {education.fieldOfStudy}
              </Typography>
              <Divider className="bg-main-light-slate mb-6 mt-0" />
              <p className="font-extralight text-sm text-textColor-lightSlate">
                {education.description}
              </p>
            </CardBody>
          </Link>
        </Card>
      </TimelineBody>
    </TimelineItem>
  )
}
