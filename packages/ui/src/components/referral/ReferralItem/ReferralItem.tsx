import { Card, CardActions, CardContent } from '@mui/material'
import { Referral } from '@prisma/client'

const Comment = ({ comment }: { comment: string }) => (
  <blockquote className="relative border-l-4 border-blue-500 italic text-gray-600 p-4  whitespace-pre-wrap">
    <span className="absolute top-0 left-0 text-6xl text-gray-300 -mt-4 ml-2">
      “
    </span>
    {comment}
  </blockquote>
)

export const ReferralItem: React.FC<{
  referral: Pick<
    Referral,
    'name' | 'feedback' | 'recommendation' | 'relationship'
  >
  children?: React.ReactElement
}> = ({ referral, children }) => {
  return (
    <Card className="max-w-sm md:max-w-xl card-base referral-card p-6">
      <CardContent>
        {referral.feedback && <Comment comment={referral.feedback} />}
        {referral.recommendation && (
          <Comment comment={referral.recommendation} />
        )}
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {referral.name || 'Anonymous'}
          </h3>
          <p className="text-sm text-gray-600 font-light">
            {referral.relationship || 'No relationship provided'}
          </p>
        </div>
      </CardContent>
      <CardActions>{children}</CardActions>
    </Card>
  )
}
