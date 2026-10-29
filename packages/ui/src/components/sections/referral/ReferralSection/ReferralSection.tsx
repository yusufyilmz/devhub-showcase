import { getPortfolioCopy, type Language } from '@shared/content'
import type { Referral } from '@shared/lib/types'
import type React from 'react'
import { List, ListItem, Section } from '../../../../components'
import { ReferralItem } from '../ReferralItem'

export const ReferralSection: React.FC<{
  referrals: Referral[]
  language?: Language
}> = ({ referrals, language = 'en' }) => {
  const text = getPortfolioCopy(language)
  if (!referrals.length) return null
  return (
    <Section
      className="referral-section"
      sectionId="referrals"
      title={text.testimonials}
      eyebrow={text.testimonials}
      subtitle={text.testimonialsSubtitle}
    >
      <div className="referral-content">
        <List divider className="no-scrollbar w-full md:mt-0">
          {referrals.map((referral) => (
            <ListItem key={referral.id}>
              <ReferralItem referral={referral} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  )
}
