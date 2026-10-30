import type { Metadata } from 'next'
import { OwnerEditLink } from '../../features/admin/owner-edit-link'
import { EngineerPortfolio } from '../../features/portfolio/engineer-portfolio'
import { PortfolioLayout } from '../../features/portfolio/portfolio-layout'
import { portfolioMetadata } from '../../lib/portfolio-metadata'
import { loadPageResources } from '../../lib/portfolio-resources'
import { getUsernameProfile } from '../../lib/public-profile'

type Props = { params: Promise<{ username: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profile } = await getUsernameProfile((await params).username)
  return portfolioMetadata(profile, (await params).username)
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
  return (
    <EngineerPortfolio
      profile={profile}
      ownerLink={<OwnerEditLink username={username} />}
      referrals={referrals}
      extras={original}
    />
  )
}
