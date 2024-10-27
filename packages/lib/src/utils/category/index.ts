import { ReferralQuestionCategory, validReferralCategories } from '../../types'

export const isCategoryReferralCategory = (
  category: unknown
): category is ReferralQuestionCategory => {
  return (
    typeof category === 'string' &&
    validReferralCategories.includes(category as ReferralQuestionCategory)
  )
}
