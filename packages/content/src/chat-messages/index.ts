import { ChatMessage, ChatRole } from '@shared/lib'

export const welcomeMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Welcome to Yusuf’s DevHub Chat',
  content:
    'Hey, I’m Yusuf! Feel free to ask me anything about my experience, skills, projects, or anything else you’d like to know about my career.'
}

export const failureMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Oops!',
  content: 'Sorry, I am having trouble processing your message! Could you try again or ask me something else.'
}

export const processErrorMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Oops!',
  content:
    'Sorry, I couldn’t understand that. Could you try asking in a different way?'
}

export const goodbyeMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Goodbye!',
  content: 'Thanks for chatting with me! Have a great day!'
}

export const outOfTopicMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  content: `I’m here to help you with questions related to my CV. Please feel free to ask me anything about my experience, skills, or projects.`
}

export const greetingMessage: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  content: 'Hey there! Tell me what you’d like to know, and I’ll be happy to help.'
}

export const unknownMessage: ChatMessage = {
  role: ChatRole.System,
  content: ''
}

export const chatMessages = {
  welcomeMessage: welcomeMessage,
  failureMessage: failureMessage,
  goodbyeMessage: goodbyeMessage,
  outOfTopicMessage: outOfTopicMessage,
  greetingMessage: greetingMessage,
  unknownMessage,
  processErrorMessage
}
