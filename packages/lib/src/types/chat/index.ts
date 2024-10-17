import { ChatRole } from './roles'

export type ChatMessageType = 'referral' | 'cv'

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

export type CVCategoryType =
  | 'skills'
  | 'projects'
  | 'education'
  | 'experience'
  | 'languages'
  | 'certifications'
  | 'referrals'
  | 'achievements'
  | 'characteristic'
  | 'challenges'
  | 'workPreferences'

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
  | CVCategoryType

  
export type CVChatMessage = ChatMessageCommonFields & {
  type: 'cv'
  category: ChatCategoryType
}

export type ReferralMessage = ChatMessageCommonFields & {
  type: 'referral'
  category: ReferralQuestionCategory
}

export type ChatMessage = CVChatMessage | ReferralMessage
