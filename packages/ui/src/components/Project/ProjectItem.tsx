'use client'

import { Project } from '@prisma/client'
import { IFramePreview } from '../IFramePreview'
import { Chip, Typography, Card, CardContent } from '@mui/material'

interface ProjectItemProps {
  project: Project
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  return (
    <Card
      onClick={() => window.open(project.link)}
      className="bg-backgroundColor-card rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
    >
      <CardContent className="text-left">
        {project?.link && (
          <div className="relative">
            <IFramePreview url={project.link} />
          </div>
        )}

        <div className="p-4">
          <Typography
            variant="h5"
            component="h3"
            align="left"
            className="font-semibold text-main-black mb-2 text-2xl hover:underline"
          >
            {project?.title}
          </Typography>

          <Typography
            variant="body2"
            align="left"
            className="text-gray-600 mb-2"
          >
            {project.role}
          </Typography>

          <div className="flex flex-wrap gap-2 mb-4">
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
        </div>
      </CardContent>
    </Card>
  )
}
