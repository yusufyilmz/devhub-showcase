'use client'

import { IFramePreview } from '../../../ui/IFramePreview'
import { Typography, Card, CardContent, Link } from '@mui/material'
import { ProjectWithCompanyAndSkills } from '@shared/lib/types'
import Divider from '@mui/material/Divider'
import { useRef, useEffect } from 'react'
import { SkillItem } from '../../skill/SkillItem/SkillItem'

interface ProjectItemProps {
  project: ProjectWithCompanyAndSkills
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = window.location.hash?.substring(1)

    if (id) {
      const element = document.getElementById(id)
      if (element && cardRef.current) {
        cardRef.current?.focus()
      }
    }
  }, [])

  return (
    <Card
      ref={cardRef}
      tabIndex={-1}
      id={project.id}
      className="parallax section-card referral-card"
    >
      <CardContent className="flex gap-4 flex-col text-left">
        {project?.link && <IFramePreview url={project.link} />}
        <div className="flex flex-col gap-3">
          <Typography
            variant="h5"
            align="left"
            className="font-semibold text-main-white text-2xl"
          >
            {project.title}
          </Typography>

          <Typography
            variant="h4"
            align="left"
            className="text-lg font-semibold text-textColor-secondary"
          >
            {project.role}
          </Typography>
          <Divider className="bg-main-light-slate mb-6 mt-0" />
          <Typography
            variant="body2"
            align="left"
            color="textSecondary"
            className="text-textColor-lightSlate font-light"
          >
            {project?.description}
          </Typography>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, index) =>
              skill.name ? <SkillItem key={index} name={skill.name} /> : null
            )}
          </div>
        </div>
      </CardContent>
      <CardContent>
        {project.company && (
          <Typography
            variant="h5"
            align="center"
            className="text-sm mt-6 text-textColor-slate"
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
      </CardContent>
    </Card>
  )
}
