import { ChatMessage, ChatRole, ReferralMessage } from '@shared/lib/types'

export const cvWelcomeMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Welcome to Yusuf’s DevHub Chat Assistant',
  category: 'greeting',
  type: 'cv',
  content:
    'Hey there! I’m the assistant here to help you with any questions about Yusuf Yılmaz’s experience, skills, or projects. Feel free to ask about his background or anything you’re curious to know!'
}

export const referralWelcomeMessage: ReferralMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Welcome to Yusuf’s Referral Chat Assistant',
  content: `Hello! Thank you for taking the time to provide feedback. Your insights will be incredibly helpful in showcasing Yusuf’s experience. Please share your thoughts on working with Yusuf—whether it’s about his projects, teamwork, or any other aspects of your collaboration. If you want to start please simply say "hi"`,
  type: 'referral',
  category: 'greeting'
}

export const referralFinishMessage: ReferralMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  content: `Thank you so much for your feedback! It’s greatly appreciated and will be invaluable for showcasing Yusuf’s professional experience.`,
  type: 'referral',
  category: 'end'
}

export const failureMessage: ChatMessage = {
  role: ChatRole.System,
  type: 'cv',
  timestamp: Date.now(),
  category: 'error',
  title: 'Oops!',
  content:
    'Sorry! I had trouble processing your request. Could you try again or ask something else?'
}

export const processErrorMessage: ChatMessage = {
  type: 'cv',
  role: ChatRole.System,
  timestamp: Date.now(),
  category: 'error',
  title: 'Oops!',
  content:
    'I didn’t quite understand that. Could you rephrase it or ask a different question?'
}

export const goodbyeMessage: ChatMessage = {
  type: 'cv',
  role: ChatRole.System,
  timestamp: Date.now(),
  category: 'end',
  title: 'Goodbye!',
  content: 'Thanks for chatting with me! Have a great day!'
}

export const outOfTopicMessage: ChatMessage = {
  type: 'cv',
  role: ChatRole.System,
  category: 'outOfTopic',
  timestamp: Date.now(),
  content: `It seems like your question isn’t related to Yusuf’s experience or skills. Feel free to ask anything about his projects, background, or career!`
}

export const greetingMessage: ChatMessage = {
  type: 'cv',
  role: ChatRole.System,
  timestamp: Date.now(),
  category: 'greeting',
  content:
    'Hi there! What would you like to know about Yusuf Yılmaz? I’m here to help!'
}

export const unknownMessage: ChatMessage = {
  type: 'cv',
  role: ChatRole.System,
  category: 'unknown',
  content: ''
}

export const notMeaningfulMessage: ChatMessage = {
  type: 'cv',
  role: ChatRole.System,
  category: 'notMeaningful',
  timestamp: Date.now(),
  content: `It seems like your message isn’t related to Yusuf’s experience. Feel free to ask about his skills, projects, or professional background!`
}

export const simpleResponseMessage: ChatMessage = {
  type: 'cv',
  role: ChatRole.System,
  category: 'simpleResponse',
  timestamp: Date.now(),
  content: `Got it! Let me know if you have any more questions or need more details.`
}

export const chatMessages = {
  welcomeMessage: {
    cv: cvWelcomeMessage,
    referral: referralWelcomeMessage
  },
  failureMessage: failureMessage,
  goodbyeMessage: goodbyeMessage,
  referralGoodbyeMessage: referralFinishMessage,
  outOfTopicMessage: outOfTopicMessage,
  greetingMessage: greetingMessage,
  unknownMessage,
  processErrorMessage,
  notMeaningfulMessage,
  simpleResponseMessage
}
