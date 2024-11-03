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
      <TimelineBody className="ml-0 mr-4 my-8 md:mx-8">
        <Card
          id={CARD_IDS.experience}
          className="section-card experience-card group p-0"
        >
          <CardBody className="pt-4 pb-0 flex flex-col gap-2">
            <Link href={experience.company?.link ?? ''} target="_blank">
              <h3 className="text-2xl font-bold text-textColor-light group-hover:underline group-hover:text-main-blue">
                {experience.company?.name}
              </h3>
            </Link>
            <h4 className="text-lg font-semibold text-textColor-secondary">
              {experience.role}
            </h4>
          </CardBody>
          <Divider className="bg-main-light-slate" />
          <CardBody className="pt-0 mt-6">
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
          <CardBody className="pt-0">
            <ProjectList projects={experience.projects} />
          </CardBody>
        </Card>
      </TimelineBody>
    </TimelineItem>
  )
}
