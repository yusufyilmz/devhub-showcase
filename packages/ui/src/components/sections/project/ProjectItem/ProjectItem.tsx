import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { ProjectWithCompanyAndSkills } from '@shared/lib/types'
import { SkillItem } from '../../skill/SkillItem/SkillItem'
import { Typography, Divider, CardBody, Card } from '../../../../components'

interface ProjectItemProps {
  project: ProjectWithCompanyAndSkills
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  return (
    // <Link
    //   href={project.link ?? '#'}
    //   target="_blank"
    // >
    <Card
      tabIndex={-1}
      id={project.id}
      className="parallax section-card referral-card group flex flex-col gap-4 p-4 md:p-8 justify-between"
    >
      {project?.imageUrl && (
        <CardBody className="relative min-h-96">
          <Image
            fill
            alt={`${project.title} project image`}
            src={project.imageUrl}
          />
        </CardBody>
      )}
      <CardBody className="flex gap-4 flex-col text-left">
        <div className="flex flex-col gap-3">
          {project?.link ? (
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none"
            >
              <Typography
                variant="h3"
                className="font-semibold text-main-white text-2xl group-hover:text-main-blue"
              >
                {project.title}
              </Typography>
            </Link>
          ) : (
            <Typography
              variant="h3"
              className="font-semibold text-main-white text-2xl"
            >
              {project.title}
            </Typography>
          )}
          <Typography
            variant="h4"
            className="font-semibold text-textColor-secondary"
          >
            {project.role}
          </Typography>
          <Divider className="bg-main-light-slate mb-6 mt-0" />
          <Typography
            variant="overline"
            className="text-textColor-lightSlate font-light"
          >
            {project?.description}
          </Typography>
        </div>
      </CardBody>
      <div className="flex justify-start flex-wrap gap-2">
        {project.skills.map(
          skill =>
            skill.name && <SkillItem key={skill.name} name={skill.name} />
        )}
      </div>
      <CardBody>
        {project.company && (
          <Typography
            variant="caption"
            className="tex-left text-sm mt-6 text-textColor-slate italic"
          >
            Project and all rights reserved by
            <Link
              href={project.company.link}
              className="text-textColor-slate font-bold"
              target="_blank"
            >
              {' '}
              {project.company?.name.toUpperCase()}
            </Link>
          </Typography>
        )}
      </CardBody>
    </Card>
  )
}
