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
  | 'references'
  | 'achievements'
  | 'character'
  | 'technicalChallenges'
  | 'workPreferences'

export type CVChatMessage = ChatMessageCommonFields & {
  type: 'cv'
  category: CVCategoryType
}

export type ReferralMessage = ChatMessageCommonFields & {
  type: 'referral'
  category: ReferralQuestionCategory
}

export type ChatMessage = CVChatMessage | ReferralMessage
