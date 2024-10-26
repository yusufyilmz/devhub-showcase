import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material'
import { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import Link from 'next/link'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ExternalLink from '@mui/icons-material/Link'

import Divider from '@mui/material/Divider'
import { CARD_IDS } from '../../../constants/cards'
import { SkillItem } from '../../skill/SkillItem/SkillItem'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import { formatDateRange } from '@shared/lib/utils'

type ExperienceProps = {
  experience: ExperienceWithCompanyProjectAndSkills
}

export const ExperienceItem: React.FC<ExperienceProps> = ({ experience }) => {
  const skills = experience.projects.flatMap(project => project.skills)
  const uniqueSkills = new Set(skills.map(skill => skill.name))

  return (
    <TimelineItem className="w-full mt-8">
      <TimelineOppositeContent
        sx={{ m: 'auto 0' }}
        align="right"
        variant="body2"
        color="text.secondary"
        className="w-full max-w-12 md:max-w-48"
      >
        <Typography className="text-xs font-light pb-0 text-textColor-secondary mt-2">
          {formatDateRange(experience.startedAt, experience.finishedAt)}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot></TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Card
          variant="elevation"
          id={CARD_IDS.experience}
          className="section-card experience-card ml-1 md:ml-4"
        >
          <Link
            href={experience.company?.link ?? ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardContent className="pt-4 pb-0 flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-textColor-light hover:underline">
                {experience.company?.name}
              </h3>
              <h4 className="text-lg font-semibold text-textColor-secondary">
                {experience.role}
              </h4>
            </CardContent>
          </Link>
          <Divider className="bg-main-light-slate mb-6 mt-0" />

          <CardContent className="pt-0">
            <Typography
              variant="body2"
              align="left"
              className="text-textColor-lightSlate font-light"
            >
              {experience.description}
            </Typography>
          </CardContent>
          <CardContent className="pt-0">
            <div className="flex justify-start flex-wrap gap-2">
              {[...uniqueSkills].map(
                skill => skill && <SkillItem key={skill} name={skill} />
              )}
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Accordion className="bg-transparent">
              <AccordionSummary
                className="bg-transparent border-textColor-light  mx-auto"
                expandIcon={
                  <ArrowDropDownIcon className="text-textColor-light animate-bounce" />
                }
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography className="text-textColor-light m-0 p-0">
                  Projects
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="">
                <Box className="flex flex-col gap-2">
                  {experience.projects.map((project, index) => (
                    <a
                      key={index}
                      href={`#${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-textColor-lightSlate hover:underline hover:text-button-primary transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4 text-button-primary" />
                      <span>{project.title}</span>
                    </a>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}
