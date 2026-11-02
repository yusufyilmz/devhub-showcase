import Link from "next/link";

import { getPortfolioCopy, type Language } from "@shared/config";
import type { ProjectWithCompanyAndSkills } from "@shared/lib/types";

import { WorkMedia } from "../../display/media";
import { RevealCard } from "../../layout/reveal-card";
import { SkillItem } from "../skills-section/SkillItem";

export function ProjectItem({
  project,
  language = "en",
}: {
  language?: Language;
  project: ProjectWithCompanyAndSkills;
}) {
  const text = getPortfolioCopy(language);
  return (
    <RevealCard
      brief={project.description}
      className="project-card"
      heading={
        <>
          {project.imageUrl && <WorkMedia imageUrl={project.imageUrl} title={project.title} />}
          <h3>{project.title}</h3>
          {project.role && <p className="reveal-subtitle">{project.role}</p>}
        </>
      }
      id={project.id}
      language={language}
      title={project.title}
    >
      <p className="reveal-description">{project.description}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {project.skills.map(
          (skill) => skill.name && <SkillItem key={skill.name} name={skill.name} />,
        )}
      </div>
      <div className="flex gap-4 mt-5">
        {project.link && (
          <Link
            className="text-main-blue underline"
            href={project.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            {text.visitProject}
          </Link>
        )}
        {project.sourceUrl && (
          <Link
            className="text-main-blue underline"
            href={project.sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {text.sourceGithub}
          </Link>
        )}
      </div>
      {project.company && (
        <p className="reveal-credit">
          {text.credit}{" "}
          <Link href={project.company.link} rel="noopener noreferrer" target="_blank">
            {project.company.name}
          </Link>
        </p>
      )}
    </RevealCard>
  );
}
