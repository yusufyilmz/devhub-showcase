import { copy } from "@shared/content"
import { ChatMessage, ChatRole, ReferralMessage } from "@shared/lib/types"

export const referralWelcomeMessage: ReferralMessage = {
    role: ChatRole.System,
    timestamp: Date.now(),
    title: 'Welcome to Yusuf’s Referral Chat Assistant',
    content: copy.chatMessages.referralWelcomeMessage,
    type: 'referral',
    category: 'greeting'
}

export const cvWelcomeMessage: ChatMessage = {
    role: ChatRole.System,
    timestamp: Date.now(),
    title: 'Welcome to Yusuf’s DevHub Chat Assistant',
    category: 'greeting',
    type: 'cv',
    content: copy.chatMessages.cvWelcomeMessage
}

export const failureMessage: ChatMessage = {
    role: ChatRole.System,
    timestamp: Date.now(),
    title: 'Oops!',
    category: 'error',
    type: 'cv',
    content: copy.chatMessages.failureMessage
  }
  