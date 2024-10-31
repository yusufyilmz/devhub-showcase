import { Box, List, ListItem } from '@mui/material'
import { Referral } from '@shared/lib/types'
import { ReferralItem } from '../ReferralItem'
import { Section } from '../../../ui/Section'
import { copy } from '@shared/content'

const { id, title, subtitle } = copy.header.sections.referrals

export const ReferralSection: React.FC<{
  referrals: Referral[]
}> = ({ referrals }): JSX.Element => {
  return (
    <Section
      className="top-32 bottom-32 mb-32"
      sectionId={id}
      title={title}
      subtitle={subtitle}
    >
      <Box className="md:pl-40 flex items-center h-full md:min-h-[calc(100vh-4rem)]">
        <List className="overflow-y-auto no-scrollbar w-full mt-32 md:mt-0">
          {referrals.map(referral => (
            <ListItem key={referral.id}>
              <ReferralItem referral={referral} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Section>
  )
}
