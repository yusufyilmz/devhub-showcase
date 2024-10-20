import { ChatRole } from './roles'

export type ChatType = 'referral' | 'cv'

export type ChatMessageCommonFields = {
  role: ChatRole
  content: string
  title?: string
  timestamp?: number
}

export type ReferralQuestionCategory =
  | 'greeting'
  | 'contactInfo'
  | 'feedback'
  | 'relationship'
  | 'recommendation'
  | 'name'
  | 'end'
  | 'error'

export const validReferralCategories: ReferralQuestionCategory[] = [
  'name',
  'relationship',
  'feedback',
  'recommendation',
  'contactInfo'
]

export type ChatCategoryType =
  | 'greeting'
  | 'end'
  | 'error'
  | 'outOfTopic'
  | 'greeting'
  | 'unknown'
  | 'simpleResponse'
  | 'notMeaningful'
  | 'personalInformation'
  | 'overview'
  | 'contact'
  | 'skills'
  | 'projects'
  | 'education'
  | 'experience'
  | 'languages'
  | 'certifications'
  | 'referrals'
  | 'achievements'
  | 'characteristic'
  | 'technicalChallenges'
  | 'workPreferences'

export type CVCategoryType =
  | 'contact'
  | 'skills'
  | 'projects'
  | 'education'
  | 'experience'
  | 'languages'
  | 'certifications'
  | 'referrals'
  | 'achievements'
  | 'characteristic'

export type CVChatMessage = ChatMessageCommonFields & {
  type: 'cv'
  category: ChatCategoryType
}

export type ReferralMessage = ChatMessageCommonFields & {
  type: 'referral'
  category: ReferralQuestionCategory
}

export type ChatMessage = CVChatMessage | ReferralMessage
