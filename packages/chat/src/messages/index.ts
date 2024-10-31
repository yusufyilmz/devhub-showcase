import { copy } from '@shared/content'
import { ChatMessage, ChatRole, ReferralMessage } from '@shared/lib/types'

export const cvWelcomeMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Welcome to Yusuf’s DevHub Chat Assistant',
  category: 'greeting',
  type: 'cv',
  content: copy.chatMessages.cvWelcomeMessage
}

export const referralWelcomeMessage: ReferralMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Welcome to Yusuf’s Referral Chat Assistant',
  content: copy.chatMessages.referralWelcomeMessage,
  type: 'referral',
  category: 'greeting'
}

export const referralFinishMessage: ReferralMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  content: copy.chatMessages.referralFinishMessage,
  type: 'referral',
  category: 'end'
}

export const failureMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Oops!',
  category: 'error',
  type: 'cv',
  content: copy.chatMessages.failureMessage
}

export const processErrorMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Oops!',
  category: 'error',
  type: 'cv',
  content: copy.chatMessages.processErrorMessage
}

export const goodbyeMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Goodbye!',
  category: 'end',
  type: 'cv',
  content: copy.chatMessages.goodbyeMessage
}

export const outOfTopicMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  category: 'outOfTopic',
  type: 'cv',
  content: copy.chatMessages.outOfTopicMessage
}

export const greetingMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  category: 'greeting',
  type: 'cv',
  content: copy.chatMessages.greetingMessage
}

export const unknownMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  category: 'unknown',
  type: 'cv',
  content: copy.chatMessages.unknownMessage
}

export const notMeaningfulMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  category: 'notMeaningful',
  type: 'cv',
  content: copy.chatMessages.notMeaningfulMessage
}

export const simpleResponseMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  category: 'simpleResponse',
  type: 'cv',
  content: copy.chatMessages.simpleResponseMessage
}
