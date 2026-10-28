import type { Education } from '@shared/lib/types'
import { formatDateRange } from '@shared/lib/utils'
import Link from 'next/link'
import {
  TimelineBody,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  Typography
} from '../../../../components'
import { RevealCard } from '../../../ui/RevealCard/RevealCard'

export function EducationItem({ education }: { education: Education }) {
  return (
    <TimelineItem>
      <TimelineHeader>
        <TimelineIcon />
        <Typography className="text-xs font-light text-main-light-slate mt-2">
          {formatDateRange(education.startedAt, education.finishedAt)}
        </Typography>
      </TimelineHeader>
      <TimelineBody className="ml-0 mr-4 my-8 md:mx-8">
        <RevealCard
          title={education.institution}
          brief={education.description}
          className="education-card"
          heading={
            <>
              <h3>{education.institution}</h3>
              <p className="reveal-subtitle">
                {education.degree} in {education.fieldOfStudy}
              </p>
            </>
          }
        >
          <p className="reveal-description">{education.description}</p>
          {education.institutionLink && (
            <Link
              href={education.institutionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-main-blue underline inline-block mt-4"
            >
              Visit institution
            </Link>
          )}
        </RevealCard>
      </TimelineBody>
    </TimelineItem>
  )
}
