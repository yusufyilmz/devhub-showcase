import React from 'react'
import { Referral } from '@shared/lib/types'
import { ReferralItem } from '../ReferralItem'
import { Section, List, ListItem } from '../../../../components'
import { copy } from '@shared/content'

const { id, title, subtitle } = copy.header.sections.referrals

export const ReferralSection: React.FC<{
  referrals: Referral[]
}> = ({ referrals }) => {
  return (
    <Section
      className="top-32 bottom-32 mb-32"
      sectionId={id}
      title={title}
      subtitle={subtitle}
    >
      <div className="flex items-center h-full md:min-h-[calc(100vh-4rem)]">
        <List divider className="no-scrollbar w-full md:mt-0">
          {referrals.map(referral => (
            <ListItem key={referral.id}>
              <ReferralItem referral={referral} />
            </ListItem>
          ))}
        </List>
      </div>
    </Section>
  )
}
