import { getPortfolioResources } from '@shared/lib/portfolio'
import {
  AboutMeSection,
  EducationsSection,
  ExperienceSection,
  Footer,
  Header,
  ProjectsSection,
  SkillSection,
  SummarySection
} from '@shared/ui/components'
import type { Metadata } from 'next'
import { getPublicProfile } from '../../../lib/public-profile'

type Props = { params: Promise<{ id: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profile } = await getPublicProfile((await params).id)
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://yusufdevhub.vercel.app'
  const canonical = `${base.replace(/\/$/, '')}/p/${(await params).id}`
  const title = `${profile.name} | ${profile.title}`
  return {
    metadataBase: new URL(base),
    openGraph: {
      title,
      description: profile.summary,
      url: canonical,
      type: 'profile'
    },
    twitter: { card: 'summary', title, description: profile.summary },
    title: `${profile.name} | ${profile.title}`,
    description: profile.summary,
    alternates: { canonical }
  }
}
export default async function PublicCvPage({ params }: Props) {
  const { id } = await params
  const { profile: saved } = await getPublicProfile(id)
  const profile = {
    ...saved,
    cvUrl:
      !saved.cvUrl || saved.cvUrl === '/cv.pdf'
        ? `/p/${id}/cv.pdf`
        : saved.cvUrl
  }
  const { experiences, projects, skills, educations } =
    getPortfolioResources(profile)
  return (
    <>
      <Header profile={profile} />
      <main id="main-content" className="portfolio-main">
        <div className="portfolio-inner">
          <SummarySection profile={profile} />
          <AboutMeSection profile={profile} />
          {experiences.length > 0 && (
            <ExperienceSection experiences={experiences} />
          )}
          {projects.length > 0 && <ProjectsSection projects={projects} />}
          {Object.keys(skills).length > 0 && <SkillSection skills={skills} />}
          {educations.length > 0 && (
            <EducationsSection educations={educations} />
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  )
}
