'use client'

import { useState } from 'react'
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  ExternalLinkIcon,
  ArrowDownwardIcon
} from '@shared/ui/components'

type ProjectListProps = {
  projects: { id: string; title: string }[]
}

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 }
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <Accordion
      animate={CUSTOM_ANIMATION}
      icon={
        <ArrowDownwardIcon className="text-textColor-light animate-bounce mt-2" />
      }
      open={open}
    >
      <AccordionHeader
        onClick={handleOpen}
        className="bg-transparent border-textColor-light  mx-auto"
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography className="text-textColor-light m-0 p-0">
          Projects
        </Typography>
      </AccordionHeader>
      <AccordionBody>
        <div className="flex flex-col gap-2">
          {projects.map((project, index) => (
            <a
              key={index}
              href={`#${project.id}`}
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-main-light-slate hover:underline hover:text-button-primary transition-colors duration-200"
            >
              <ExternalLinkIcon className="w-4 h-4 text-main-light-slate" />
              <span>{project.title}</span>
            </a>
          ))}
        </div>
      </AccordionBody>
    </Accordion>
  )
}
