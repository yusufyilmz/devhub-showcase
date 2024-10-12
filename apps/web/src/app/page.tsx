import { ProjectsSection, CVSection, Chat } from '@shared/ui/components'
import type { Project } from '@prisma/client'
import { db } from '@/lib/db'

// export const experimental_ppr = true

export const getProjects = async (): Promise<Project[]> => {
  const posts = await db.project.findMany()

  return posts
}

export default async function Home(): Promise<JSX.Element> {
  const projects = await getProjects()

  return (
    <>
      <section id="chat">
        <Chat />
      </section>
      <section className="w-full" id="projects">
        <ProjectsSection projects={projects} />
      </section>
      <section className="w-full py-16 bg-main-light" id="cv">
        <CVSection />
      </section>
    </>
  )
}
