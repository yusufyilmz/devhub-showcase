import type React from "react";

import { getPortfolioCopy, type Language } from "@shared/content";
import type { ProjectWithCompanyAndSkills } from "@shared/lib/types";

import { List } from "../../../ui/List/List";
import { ListItem } from "../../../ui/List/ListItem";
import { Section } from "../../../ui/Section/Section";
import { ProjectItem } from "../ProjectItem/ProjectItem";

interface ProjectsSectionProps {
  language?: Language;
  projects: ProjectWithCompanyAndSkills[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = [],
  language = "en",
}) => {
  const text = getPortfolioCopy(language);
  return (
    <Section
      className="mt-8"
      eyebrow={text.projects}
      sectionId="projects"
      subtitle={text.projectsSubtitle}
      title={text.projects}
    >
      <div className="flex h-full no-scrollbar">
        <List className="overflow-y-auto mt-2 md:mt-8 no-scrollbar w-full" divider>
          {projects.map((project) => (
            <ListItem className="pl-0 md:pl-4 py-8" key={project.id}>
              <ProjectItem language={language} project={project} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  );
};
