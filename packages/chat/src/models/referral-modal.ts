import { ReferralQuestionCategory } from '@shared/lib/types'

export const REFERRAL_MODAL: Record<
  ReferralQuestionCategory,
  {
    question: string
  }
> = {
  name: {
    question: 'Can you please provide your name to display in the testimonials?'
  },
  relationship: {
    question:
      'What was your relationship with Yusuf? Please mention your role and the company where you worked together.'
  },
  feedback: {
    question:
      'Could you provide your feedback on Yusuf’s skills, strengths, and any key achievements or highlights from your time working with him?'
  },
  recommendation: {
    question:
      'Would you recommend Yusuf to others? Please provide any specific reasons for your recommendation or areas where he excels.'
  },
  contactInfo: {
    question:
      'Please provide your contact information (email, phone, or LinkedIn) for any follow-up or verification.'
  },
  error: {
    question: ''
  },
  greeting: {
    question: ''
  },
  end: {
    question: ''
  }
}
