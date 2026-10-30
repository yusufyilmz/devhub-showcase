"use client";

import type React from "react";
import { useState } from "react";

import { Accordion } from "../../../ui/Accordion/Accordion";
import { AccordionBody } from "../../../ui/Accordion/AccordionBody";
import { AccordionHeader } from "../../../ui/Accordion/AccordionHeader";
import { ArrowDownwardIcon, ExternalLinkIcon } from "../../../ui/Icons/Icons";
import { Typography } from "../../../ui/Typography/Typography";

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
        aria-controls="panel2-content"
        className="bg-transparent border-textColor-light mx-auto"
        expandIcon={<ArrowDownwardIcon className="text-textColor-light animate-bounce ml-2 mr-1" />}
        isOpen={isOpen}
        onClick={toggleOpen}
      >
        <Typography className="text-textColor-light">Projects</Typography>
      </AccordionHeader>
      <AccordionBody isOpen={isOpen}>
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <div
              className="flex items-center gap-1 text-sm text-main-light-slate hover:underline hover:text-button-primary transition-colors duration-200"
              id={project.id}
              key={project.id}
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
