'use client'

import { IFramePreview } from '../../ui/IFramePreview'
import { Chip, Typography, Card, CardContent, Link } from '@mui/material'
import { ProjectTitle } from '../../ui/buttons/ProjectTitle'
import { ProjectWithCompany } from '@shared/lib'

interface ProjectItemProps {
  project: ProjectWithCompany
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  return (
    <Card className="bg-backgroundColor-card rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
      <CardContent className="text-left">
        {project?.link && (
          <div className="relative">
            <IFramePreview url={project.link} />
          </div>
        )}

        <div className="p-4 flex flex-col gap-4">
          <ProjectTitle title={project.title} link={project.link} />
          <Typography variant="body2" align="left" className="text-gray-600">
            {project.role}
          </Typography>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                className="bg-main-silver text-main-black"
              />
            ))}
          </div>

          <Typography
            variant="body2"
            align="left"
            color="textSecondary"
            className="text-gray-700"
          >
            {project?.description}
          </Typography>
          {project.company && (
            <Typography
              variant="h6"
              align="center"
              className="text-main-black mt-6"
            >
              <small>
                <i>belongs to </i>
              </small>
              <Link href={project.company.url} target="_blank">
                <b>{project.company?.name.toUpperCase()}</b>
              </Link>
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
