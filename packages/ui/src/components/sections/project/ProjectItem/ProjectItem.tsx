import Link from 'next/link'
import Image from 'next/image'

import { ProjectWithCompanyAndSkills } from '@shared/lib/types'
import { SkillItem } from '../../skill/SkillItem/SkillItem'
import { Typography, Divider, CardBody, Card } from '@shared/ui/components'

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
          <Typography
            variant="h3"
            className="font-semibold text-main-white text-2xl group-hover:text-main-blue"
          >
            {project.title}
          </Typography>

          <Typography
            variant="h4"
            className="text-lg font-semibold text-textColor-secondary"
          >
            {project.role}
          </Typography>
          <Divider className="bg-main-light-slate mb-6 mt-0" />
          <Typography
            variant="small"
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
            variant="h4"
            className="tex-left text-sm mt-6 text-textColor-slate"
          >
            <small>
              <i>Project and all rights reserved by </i>
            </small>
            <Link
              href={project.company.link}
              className="text-textColor-slate"
              target="_blank"
            >
              <b>{project.company?.name.toUpperCase()}</b>
            </Link>
          </Typography>
        )}
      </CardBody>
    </Card>
  )
}
