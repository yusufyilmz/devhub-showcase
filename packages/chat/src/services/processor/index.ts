import type { ChatMessage } from '@shared/lib/types'
import { ChatRole } from '@shared/lib/types'
import { CV_MODEL } from '../../models/cv-model'
import {
  CATEGORY_PROMPT_CATEGORY_KEY,
  CATEGORY_PROMPT_DATA_KEY,
  GPT_PROMPT_TEMPLATE_COMPLETE,
  GPT_PROMPT_TEMPLATE_WITH_CATEGORY
} from '../../models/gpt-prompt'
import { ClassifierService } from '../classifier/index'
import { ChatGPTService } from '../gpt/index'
import { formatAllCV, formatters } from '../formatter/index'
import { CVModel, CVModelValue } from '../../types'
import { Logger } from 'pino'
import { copy } from '@shared/content'
import { ReferralService } from '../referral'

export class MessageProcessor {
  classifier: ClassifierService
  gptService: ChatGPTService
  logger: Logger
  referralService: ReferralService

  constructor(logger: Logger) {
    this.logger = logger
    this.classifier = new ClassifierService(logger)
    this.gptService = new ChatGPTService(logger)
    this.referralService = new ReferralService(logger)
  }

  /**
   * Handles sending a message and processing it through casual response checks,
   * classification, and fallback to GPT.
   */
  public async processUserMessage(
    userMessage: ChatMessage
  ): Promise<ChatMessage> {
    try {
      this.logger.info({ userMessage }, 'User message received.')

      if (userMessage.type === 'referral') {
        return this.referralService.createReferralMessage(userMessage)
      }

      // Step 1: Do message classification with the NLP classification model
      const classifiedMessage = this.classifier.classify(userMessage.content)

      this.logger.info(
        { category: classifiedMessage.category },
        'Message classified.'
      )


      // Step 2: if result is a casual question or greeting, return a casual response
      if (
        classifiedMessage?.category === 'outOfTopic' ||
        classifiedMessage?.category === 'greeting' ||
        classifiedMessage?.category === 'simpleResponse' ||
        classifiedMessage?.category === 'end'
      ) {
        return {
          role: ChatRole.Assistant,
          content: (classifiedMessage.model as ChatMessage).content,
          timestamp: Date.now(),
          category: classifiedMessage.category,
          type: userMessage.type
        }
      }

      let promptWithModel: string
      if (classifiedMessage?.category === 'unknown') {
        if (!this.classifier.isMeaningfulInput(userMessage.content)) {
          return {
            ...copy.chatMessages.notMeaningfulMessage,
            timestamp: Date.now()
          }
        }

        // Step 3: if result is a unknown question send all the data to GPT for a response
        const formattedModel = formatAllCV(CV_MODEL)
        promptWithModel = GPT_PROMPT_TEMPLATE_COMPLETE.replace(
          CATEGORY_PROMPT_DATA_KEY,
          formattedModel
        )
      } else {
        // Step 3: format the model data and send it to GPT for a response

        const formattedModel = formatters[
          classifiedMessage.category as keyof typeof CV_MODEL
        ](classifiedMessage.model as CVModel[keyof CVModelValue])

        promptWithModel = GPT_PROMPT_TEMPLATE_WITH_CATEGORY.replace(
          CATEGORY_PROMPT_CATEGORY_KEY,
          classifiedMessage.category
        ).replace(CATEGORY_PROMPT_DATA_KEY, formattedModel)
      }

      // Step 5: send the user message with the prompt and model data to GPT for a response

      const gptResponse = await this.gptService.generateResponse(
        userMessage.content,
        promptWithModel
      )

      this.logger.info({ gptResponse }, 'GPT response:')

      return {
        role: ChatRole.Assistant,
        content: gptResponse,
        timestamp: Date.now(),
        type: userMessage.type,
        category: classifiedMessage.category
      }
    } catch (error) {
      this.logger.error({ error }, 'Error processing user message')
      // Step 6: If an error occurs, return a default error message
      return {
        ...copy.chatMessages.processErrorMessage,
        timestamp: Date.now()
      }
    }
  }
}
