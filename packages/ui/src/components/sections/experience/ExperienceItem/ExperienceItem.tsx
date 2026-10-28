import type { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import { formatDateRange } from '@shared/lib/utils'
import Link from 'next/link'
import type React from 'react'
import {
  CardBody,
  Divider,
  List,
  ListItem,
  TimelineBody,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  Typography
} from '../../../../components'
import { RevealCard } from '../../../ui/RevealCard/RevealCard'
import { SkillItem } from '../../skill/SkillItem/SkillItem'

type ExperienceProps = {
  experience: ExperienceWithCompanyProjectAndSkills
}

export const ExperienceItem: React.FC<ExperienceProps> = ({ experience }) => {
  const skills = experience.projects.flatMap((project) => project.skills)
  const uniqueSkills = new Set(skills.map((skill) => skill.name))

  return (
    <TimelineItem className="w-full">
      <TimelineHeader className="h-4">
        <TimelineIcon />
        <Typography className="text-xs font-light pb-0 text-main-light-slate mt-2">
          {formatDateRange(experience.startedAt, experience.finishedAt)}
        </Typography>
      </TimelineHeader>
      <TimelineBody className="ml-0 mr-0 my-8 md:mx-8">
        <RevealCard
          id={`experience-${experience.id}`}
          title={experience.company?.name ?? experience.role}
          brief={experience.achievements[0]}
          className="experience-card group"
          heading={
            <CardBody className="pb-0 flex flex-col gap-2">
              <Typography
                variant="h3"
                className="text-2xl font-bold text-textColor-light group-hover:underline group-hover:text-main-blue"
              >
                <Link
                  href={experience.company?.link ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none focus:ring-2 focus:ring-main-blue"
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
          }
        >
          <Divider className="bg-main-light-slate" />
          <CardBody className="pt-0">
            <List className="list-disc list-inside text-main-white">
              {experience.achievements.map((achievement) => (
                <ListItem key={achievement}>
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
                (skill) => skill && <SkillItem key={skill} name={skill} />
              )}
            </div>
          </CardBody>
          <CardBody className="pt-0 pl-0">
            {experience.projects.length > 0 && (
              <div className="reveal-projects">
                <h4>Selected projects</h4>
                {experience.projects.map((project) => (
                  <div key={project.id}>
                    <h5>{project.title}</h5>
                    <p>{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </RevealCard>
      </TimelineBody>
    </TimelineItem>
  )
}
