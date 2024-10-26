import { Card, CardContent } from '@mui/material'
import { Referral } from '@shared/lib/types'

const Comment = ({ comment }: { comment: string }) => (
  <blockquote className="relative border-l-4 border-blue-500 italic text-textColor-lightSlate p-4  whitespace-pre-wrap">
    <span className="font-serif absolute top-0 left-0 text-6xl text-gray-300 -mt-4 ml-2">
      “
    </span>
    {comment}
  </blockquote>
)

export const ReferralItem: React.FC<{
  referral: Referral
}> = ({ referral }) => {
  return (
    <Card className="section-card referral-card">
      <CardContent>
        {referral.feedback && <Comment comment={referral.feedback} />}
        {referral.recommendation && (
          <Comment comment={referral.recommendation} />
        )}
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-textColor-light ">
            {referral.name || 'Anonymous'}
          </h3>
          <p className="text-sm text-textColor-secondary font-light">
            {referral.relationship || 'No relationship provided'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
