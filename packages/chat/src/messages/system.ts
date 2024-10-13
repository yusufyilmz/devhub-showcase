import { ChatMessage, ChatRole } from '@shared/lib'

export const WELCOME_MESSAGE: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Welcome to Yusuf’s DevHub Chat',
  content:
    'Hey, I’m Yusuf! Feel free to ask me anything about my experience, skills, projects, or anything else you’d like to know about my career.'
}

export const FAILURE_MESSAGE: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Oops!',
  content: 'Sorry, I am having trouble processing your request!'
}

export const GOODBYE_MESSAGE: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  title: 'Goodbye!',
  content: 'Thanks for chatting with me! Have a great day!'
}

export const UNRELATED_MESSAGE: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  content: `Sorry, I am here to help you about Yusuf's CV. Please ask me a question related to my CV.`
}

export const GREETING_MESSAGE: ChatMessage = {
  role: ChatRole.System,
  timestamp: Date.now(),
  content: 'Hey there! How can I help you today'
}

export const UNKNOWN_MESSAGE: ChatMessage = {
  role: ChatRole.System,
  content: ''
}