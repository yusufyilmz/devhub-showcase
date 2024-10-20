import { Grid } from '@mui/material'
import { Referral } from '@prisma/client'
import { PageHeader } from '../../ui/PageHeader'
import { ReferralItem } from '../ReferralItem'
import { ScrollableContainer } from '../../ui/ScrollableContainer/ScrollableContainer'

export const ReferralSection: React.FC<{
  referrals: Referral[]
}> = ({ referrals }): JSX.Element => {
  return (
    <section className="w-full px-page-px-sm" id="referrals">
      <PageHeader
        title="Referrals & Testimonials"
        subtitle="Feedback and Recommendations from Colleagues and Clients"
      />

      <ScrollableContainer category="referrals">
        {referrals.map(referral => (
          <Grid key={referral.id} item>
            <ReferralItem referral={referral} />
          </Grid>
        ))}
      </ScrollableContainer>
    </section>
  )
}
