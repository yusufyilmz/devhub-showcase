import { getPortfolioCopy, type Language } from '@shared/content'
import type { ProjectWithCompanyAndSkills } from '@shared/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { RevealCard } from '../../../ui/RevealCard/RevealCard'
import { SkillItem } from '../../skill/SkillItem/SkillItem'

export function ProjectItem({
  project,
  language = 'en'
}: {
  language?: Language
  project: ProjectWithCompanyAndSkills
}) {
  const text = getPortfolioCopy(language)
  return (
    <RevealCard
      language={language}
      id={project.id}
      title={project.title}
      brief={project.description}
      className="project-card"
      heading={
        <>
          <h3>{project.title}</h3>
          {project.role && <p className="reveal-subtitle">{project.role}</p>}
        </>
      }
    >
      {project.imageUrl && (
        <div className="relative aspect-video mb-5">
          <Image
            fill
            className="object-contain"
            alt={`${project.title} project image`}
            src={project.imageUrl}
          />
        </div>
      )}
      <p className="reveal-description">{project.description}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {project.skills.map(
          (skill) =>
            skill.name && <SkillItem key={skill.name} name={skill.name} />
        )}
      </div>
      <div className="flex gap-4 mt-5">
        {project.link && (
          <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-main-blue underline"
          >
            {text.visitProject}
          </Link>
        )}
        {project.sourceUrl && (
          <Link
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-main-blue underline"
          >
            {text.sourceGithub}
          </Link>
        )}
      </div>
      {project.company && (
        <p className="reveal-credit">
          {text.credit}{' '}
          <Link
            href={project.company.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.company.name}
          </Link>
        </p>
      )}
    </RevealCard>
  )
}
