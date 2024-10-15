'use client'

import { IFramePreview } from '../../ui/IFramePreview'
import { Chip, Typography, Card, CardContent, Link } from '@mui/material'
import { ProjectWithCompany } from '@shared/lib/types'
import Divider from '@mui/material/Divider';


interface ProjectItemProps {
  project: ProjectWithCompany
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  return (
    <Card className="bg-backgroundColor-card flex flex-col justify-around h-full rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 referral card p-6 min-w-96">
      <CardContent className="flex gap-4 flex-col text-left">
        {project?.link && (
          <div className="relative">
            <IFramePreview url={project.link} />
            <Divider />
          </div>
        )}
        <div className="p-4 flex flex-col gap-3">
          <Typography
            variant="h5"
            align="left"
            className="font-semibold text-main-black text-2xl"
          >
            {project.title}
          </Typography>
          <h4 className="text-lg font-semibold text-textColor-secondary">
            {project.role}
          </h4>
          <Divider />
          <Typography
            variant="body2"
            align="left"
            color="textSecondary"
            className="text-gray-700 font-light"
          >
            {project?.description}
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
        </div>
      </CardContent>
      <CardContent>
        {project.company && (
          <Typography
            variant="h5"
            align="center"
            className="text-sm text-main-black mt-6"
          >
            <small>
              <i>This project is owned by </i>
            </small>
            <Link href={project.company.url} target="_blank">
              <b>{project.company?.name.toUpperCase()}</b>
            </Link>
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
