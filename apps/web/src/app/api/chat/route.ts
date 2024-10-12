import { MessageProcessor } from '@shared/chat'
import { z } from 'zod'
import { errorHandling, ValidationError } from '@shared/lib'

const messageProcessor = new MessageProcessor()

const userChatMessageSchema = z.object({
  userMessage: z.string()
})

export const POST = async (req: Request): Promise<Response> => {
  try {
    const parsedResult = userChatMessageSchema.safeParse(await req.json())

    if (!parsedResult.success) {
      throw new ValidationError('Invalid user message')
    }

    const botReply = await messageProcessor.processUserMessage(
      parsedResult.data.userMessage
    )

    return Response.json({ success: true, data: botReply })
  } catch (error) {
    return errorHandling(error)
  }
}
