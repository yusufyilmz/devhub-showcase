"use client";

import type React from "react";

import { ExternalLinkIcon } from "../../display/icons";
import { Typography } from "../../display/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../layout/accordion";
import { projectListStyles } from "./styles";
import type { ProjectListProps } from "./types";

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <Accordion className={projectListStyles.element1} collapsible type="single">
      <AccordionItem value="projects">
        <AccordionTrigger className={projectListStyles.element2}>
          <Typography className={projectListStyles.element3}>Projects</Typography>
        </AccordionTrigger>
        <AccordionContent>
          <div className={projectListStyles.element4}>
            {projects.map((project) => (
              <div className={projectListStyles.element5} id={project.id} key={project.id}>
                <ExternalLinkIcon className={projectListStyles.element6} />
                <span>
                  {project.title}
                  {project.description ? `: ${project.description}` : ""}
                </span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
