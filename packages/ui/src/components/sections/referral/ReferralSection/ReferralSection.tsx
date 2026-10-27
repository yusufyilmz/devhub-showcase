import { copy } from '@shared/content'
import type { Referral } from '@shared/lib/types'
import type React from 'react'
import { List, ListItem, Section } from '../../../../components'
import { ReferralItem } from '../ReferralItem'

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
