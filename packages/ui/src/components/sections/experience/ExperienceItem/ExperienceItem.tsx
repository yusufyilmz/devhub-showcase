import React from 'react'
import { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import Link from 'next/link'
import {
  Card,
  Typography,
  CardBody,
  TimelineItem,
  TimelineBody,
  TimelineIcon,
  TimelineHeader,
  Divider,
  List,
  ListItem
} from '../../../../components'

import { CARD_IDS } from '../../../../constants'
import { SkillItem } from '../../skill/SkillItem/SkillItem'
import { formatDateRange } from '@shared/lib/utils'
import { ProjectList } from '../../project/ProjectList/ProjectList'

type ExperienceProps = {
  experience: ExperienceWithCompanyProjectAndSkills
}

export const ExperienceItem: React.FC<ExperienceProps> = ({ experience }) => {
  const skills = experience.projects.flatMap(project => project.skills)
  const uniqueSkills = new Set(skills.map(skill => skill.name))

  return (
    <TimelineItem className="w-full">
      <TimelineHeader className="h-4">
        <TimelineIcon />
        <Typography className="text-xs font-light pb-0 text-main-light-slate mt-2">
          {formatDateRange(experience.startedAt, experience.finishedAt)}
        </Typography>
      </TimelineHeader>
      <TimelineBody className="ml-0 mr-0 my-8 md:mx-8">
        <Card
          id={CARD_IDS.experience}
          className="section-card experience-card group p-0 md:px-4 flex flex-col gap-4 md:gap-0"
        >
          <CardBody className="pb-0 flex flex-col gap-2">
            <Typography
              variant="h3"
              className="text-2xl font-bold text-textColor-light group-hover:underline group-hover:text-main-blue"
            >
              <Link
                href={experience.company?.link ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="focus:outline-none"
              >
                {experience.company?.name}
              </Link>
            </Typography>
            <Typography
              variant="h4"
              className="font-semibold text-textColor-secondary"
            >
              {experience.role}
            </Typography>
          </CardBody>

          <Divider className="bg-main-light-slate" />
          <CardBody className="pt-0">
            <List className="list-disc list-inside text-main-white">
              {experience.achievements.map((achievement, idx) => (
                <ListItem key={idx}>
                  <Typography
                    variant="overline"
                    className="text-textColor-lightSlate font-light"
                  >
                    {achievement}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardBody>
          <CardBody className="pt-0">
            <div className="flex justify-start flex-wrap gap-2">
              {[...uniqueSkills].map(
                skill => skill && <SkillItem key={skill} name={skill} />
              )}
            </div>
          </CardBody>
          <CardBody className="pt-0 pl-0">
            <ProjectList projects={experience.projects} />
          </CardBody>
        </Card>
      </TimelineBody>
    </TimelineItem>
  )
}
