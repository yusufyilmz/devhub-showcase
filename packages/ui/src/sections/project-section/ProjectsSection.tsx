import type React from "react";

import { getPortfolioCopy } from "@shared/config";

import { List, ListItem } from "../../display/list";
import { Section } from "../../layout/section";
import { ProjectItem } from "./ProjectItem";
import { projectsSectionStyles } from "./styles";
import type { ProjectsSectionProps } from "./types";

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = [],
  language = "en",
}) => {
  const text = getPortfolioCopy(language);
  return (
    <Section
      className={projectsSectionStyles.element1}
      eyebrow={text.projects}
      sectionId="projects"
      subtitle={text.projectsSubtitle}
      title={text.projects}
    >
      <div className={projectsSectionStyles.element2}>
        <List className={projectsSectionStyles.element3} divider>
          {projects.map((project) => (
            <ListItem className={projectsSectionStyles.element4} key={project.id}>
              <ProjectItem language={language} project={project} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  );
};
