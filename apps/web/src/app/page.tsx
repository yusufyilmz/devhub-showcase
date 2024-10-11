import { ProjectsSection, CVSection } from '@shared/ui/components'
import { db } from '@/lib/db'
import { cache } from 'react'

export const experimental_ppr = true

export const getProjects = cache(async () => {
  const posts = await db.project.findMany()
  

  return posts
})

export default async function Home() {
  const projects = await getProjects()

  return (
    <>
      <section className="w-full" id="projects">
        <ProjectsSection projects={projects} />
      </section>
      <section className="w-full py-16 bg-main-light" id="cv">
        <CVSection />
      </section>
    </>
  )
}
