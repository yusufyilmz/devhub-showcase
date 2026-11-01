"use client";

import type React from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@shared/ui/accordion";
import { ExternalLinkIcon } from "@shared/ui/icons";
import { Typography } from "@shared/ui/typography";

type ProjectListProps = {
  projects: { id: string; title: string; description?: string }[];
};

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <Accordion className="animate-mount" collapsible type="single">
      <AccordionItem value="projects">
        <AccordionTrigger className="bg-transparent">
          <Typography className="text-textColor-light">Projects</Typography>
        </AccordionTrigger>
        <AccordionContent>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
