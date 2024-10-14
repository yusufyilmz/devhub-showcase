import { Card } from '@mui/material'
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
  referral: Referral
}> = ({ referral }) => {
  return (
    <Card className="bg-backgroundColor-card rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 company-card p-6 border mb-6 min-w-[20vw]">
      {referral.feedback && <Comment comment={referral.feedback} />}
      {referral.recommendation && <Comment comment={referral.recommendation} />}
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {referral.name || 'Anonymous'}
        </h3>
        <p className="text-sm text-gray-600 font-light">
          {referral.relationship || 'No relationship provided'}
        </p>
      </div>
    </Card>
  )
}
