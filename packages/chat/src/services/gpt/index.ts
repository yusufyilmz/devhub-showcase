import type { ChatMessage } from '@shared/lib'
import { ChatRole } from '@shared/lib'
import OpenAI from 'openai'
import { summarizeQuestions } from '../summarizer/index'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ''

export class ChatGPTService {
  constructor(
    private readonly openai: OpenAI = new OpenAI({ apiKey: OPENAI_API_KEY })
  ) {}

  async generateResponse(
    message: string,
    systemMessage = '',
    sessionMessages: ChatMessage[] = []
  ): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        { role: ChatRole.System, content: systemMessage },
        { role: ChatRole.User, content: summarizeQuestions(sessionMessages) },
        { role: ChatRole.User, content: message }
      ]

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 150
      })

      const responseMessage = response.choices[0]?.message?.content

      if (!responseMessage) {
        throw new Error('GPT response is empty')
      }

      return responseMessage
    } catch (error) {
      console.error(error)

      throw error
    }
  }
}
