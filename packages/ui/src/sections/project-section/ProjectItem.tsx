import Link from "next/link";

import { getPortfolioCopy } from "@shared/config";

import { WorkMedia } from "../../display/media";
import { RevealCard } from "../../layout/reveal-card";
import { SkillItem } from "../skills-section/SkillItem";
import { projectItemStyles } from "./styles";
import type { ProjectItemOptions } from "./types";

export function ProjectItem({ project, language = "en" }: ProjectItemOptions) {
  const text = getPortfolioCopy(language);
  return (
    <RevealCard
      brief={project.description}
      className={projectItemStyles.element1}
      heading={
        <>
          {project.imageUrl && <WorkMedia imageUrl={project.imageUrl} title={project.title} />}
          <h3>{project.title}</h3>
          {project.role && <p className={projectItemStyles.element2}>{project.role}</p>}
        </>
      }
      id={project.id}
      language={language}
      title={project.title}
    >
      <p className={projectItemStyles.element3}>{project.description}</p>
      <div className={projectItemStyles.element4}>
        {project.skills.map(
          (skill) => skill.name && <SkillItem key={skill.name} name={skill.name} />,
        )}
      </div>
      <div className={projectItemStyles.element5}>
        {project.link && (
          <Link
            className={projectItemStyles.element6}
            href={project.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            {text.visitProject}
          </Link>
        )}
        {project.sourceUrl && (
          <Link
            className={projectItemStyles.element7}
            href={project.sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {text.sourceGithub}
          </Link>
        )}
      </div>
      {project.company && (
        <p className={projectItemStyles.element8}>
          {text.credit}{" "}
          <Link href={project.company.link} rel="noopener noreferrer" target="_blank">
            {project.company.name}
          </Link>
        </p>
      )}
    </RevealCard>
  );
}
