'use client'

import React, { useState } from 'react'
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  ExternalLinkIcon,
  ArrowDownwardIcon
} from '../../../../components'

type ProjectListProps = {
  projects: { id: string; title: string }[]
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Accordion className="animate-mount animate-unmount">
      <AccordionHeader
        isOpen={isOpen}
        onClick={toggleOpen}
        expandIcon={
          <ArrowDownwardIcon className="text-textColor-light animate-bounce mt-2" />
        }
        className="bg-transparent border-textColor-light  mx-auto"
        aria-controls="panel2-content"
      >
        <Typography className="text-textColor-light m-0 p-0">
          Projects
        </Typography>
      </AccordionHeader>
      <AccordionBody isOpen={isOpen}>
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
