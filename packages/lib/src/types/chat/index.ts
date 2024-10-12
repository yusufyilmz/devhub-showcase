import { ChatRole } from './roles'

export type ChatMessage = {
  role: ChatRole
  content: string
  title?: string
  timestamp?: number
}
