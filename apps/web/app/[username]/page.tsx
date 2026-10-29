import { copy } from '@shared/content'
import { getPortfolioResources } from '@shared/lib/portfolio'
import {
  AboutMeSection,
  ChatSection,
  EducationsSection,
  ExperienceSection,
  Footer,
  Header,
  ProjectsSection,
  ReferralSection,
  ScrollButton,
  SkillSection,
  SummarySection
} from '@shared/ui/components'
import type { Metadata } from 'next'
import { OwnerEditLink } from '../../features/admin/owner-edit-link'
import { PortfolioLayout } from '../../features/portfolio/portfolio-layout'
import { loadPageResources } from '../../lib/portfolio-resources'
import { getUsernameProfile } from '../../lib/public-profile'
import { handleSendMessageAction } from '../actions'

type Props = { params: Promise<{ username: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profile } = await getUsernameProfile((await params).username)
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://yusufdevhub.vercel.app'
  const canonical = `${base.replace(/\/$/, '')}/${(await params).username}`
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
  const { username } = await params
  const { profile: saved, id } = await getUsernameProfile(username)
  if (saved.portfolioType && saved.portfolioType !== 'engineer')
    return (
      <>
        <OwnerEditLink username={username} />
        <PortfolioLayout profile={saved} username={username} />
      </>
    )
  const original = id === 'main'
  const referrals = original ? (await loadPageResources()).referrals : []
  const profile = {
    ...saved,
    cvUrl:
      !saved.cvUrl || saved.cvUrl === '/cv.pdf'
        ? `/${username}/cv.pdf`
        : saved.cvUrl
  }
  const { experiences, projects, skills, educations } =
    getPortfolioResources(profile)
  return (
    <>
      <Header profile={profile} />
      <OwnerEditLink username={username} />
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
          {original && <ReferralSection referrals={referrals} />}
        </div>
      </main>
      {original && (
        <>
          <ScrollButton
            sectionIds={Object.values(copy.navbar).map(
              (item) => item.id.split('#')[1] ?? ''
            )}
          />
          <ChatSection handleSendMessage={handleSendMessageAction} />
        </>
      )}
      <Footer profile={profile} />
    </>
  )
}
