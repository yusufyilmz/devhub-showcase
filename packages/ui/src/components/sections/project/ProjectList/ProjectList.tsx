"use client";

import type React from "react";
import { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  ArrowDownwardIcon,
  ExternalLinkIcon,
  Typography,
} from "../../../../components";

type ProjectListProps = {
  projects: { id: string; title: string; description?: string }[];
};

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion className="animate-mount">
      <AccordionHeader
        isOpen={isOpen}
        onClick={toggleOpen}
        expandIcon={
          <ArrowDownwardIcon className="text-textColor-light animate-bounce ml-2 mr-1" />
        }
        className="bg-transparent border-textColor-light mx-auto"
        aria-controls="panel2-content"
      >
        <Typography className="text-textColor-light">Projects</Typography>
      </AccordionHeader>
      <AccordionBody isOpen={isOpen}>
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <div
              key={project.id}
              id={project.id}
              className="flex items-center gap-1 text-sm text-main-light-slate hover:underline hover:text-button-primary transition-colors duration-200"
            >
              <ExternalLinkIcon className="w-4 h-4 text-main-light-slate" />
              <span>
                {project.title}
                {project.description ? `: ${project.description}` : ""}
              </span>
            </div>
          ))}
        </div>
      </AccordionBody>
    </Accordion>
  );
};
