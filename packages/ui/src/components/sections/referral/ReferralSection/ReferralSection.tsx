import { copy } from '@shared/content'
import type { Referral } from '@shared/lib/types'
import type React from 'react'
import { List, ListItem, Section } from '../../../../components'
import { ReferralItem } from '../ReferralItem'

const { id, title, subtitle } = copy.header.sections.referrals

export const ReferralSection: React.FC<{
  referrals: Referral[]
}> = ({ referrals }) => {
  if (!referrals.length) return null
  return (
    <Section
      className="referral-section"
      sectionId={id}
      title={title}
      subtitle={subtitle}
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
