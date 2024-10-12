import type { ChatMessage } from '@shared/lib'
import { ChatRole } from '@shared/lib'
import { CV_MODEL } from '../../models/cv-model'
import {
  CATEGORY_PROMPT_CATEGORY_KEY,
  CATEGORY_PROMPT_DATA_KEY,
  GPT_PROMPT_TEMPLATE_COMPLETE,
  GPT_PROMPT_TEMPLATE_WITH_CATEGORY
} from '../../models/gpt-prompt'
import { ClassifierService } from '../classifier/index'
import { ChatGPTService } from '../gpt/index'
import { ERROR_MESSAGE_ANSWER } from '../constants/errors'
import { formatAllCV, formatters } from '../formatter/index'
import {
  CVCategory,
  CVModel,
  CVModelValue,
  MessageWithoutModel
} from '../../types'

export class MessageProcessor {
  classifier: ClassifierService
  gptService: ChatGPTService

  constructor() {
    // private readonly gptService = new ChatGPTService() // private readonly classifier = new ClassifierService(),
    this.classifier = new ClassifierService()
    this.gptService = new ChatGPTService()
  }

  /**
   * Handles sending a message and processing it through casual response checks,
   * classification, and fallback to GPT.
   */
  public async processUserMessage(userMessage: string): Promise<ChatMessage> {
    try {
      console.log('User message:', userMessage)

      // Step 1: Do message classification with the NLP classification model
      const messageClassification = this.classifier.classify(userMessage)

      // Step 2: if result is a casual question or greeting, return a casual response
      if (
        messageClassification?.category === CVCategory.OutOfTopic ||
        messageClassification?.category === CVCategory.Greetings
      ) {
        return {
          role: ChatRole.Assistant,
          content: (messageClassification.model as ChatMessage).content,
          timestamp: Date.now()
        }
      }

      console.log('User message:', messageClassification)

      let promptWithModel: string

      if (messageClassification?.category === CVCategory.Unknown) {
        // Step 3: if result is a unknown question send all the data to GPT for a response
        const formattedModel = formatAllCV(CV_MODEL)
        promptWithModel = GPT_PROMPT_TEMPLATE_COMPLETE.replace(
          CATEGORY_PROMPT_DATA_KEY,
          formattedModel
        )
      } else {
        // Step 3: format the model data and send it to GPT for a response

        const formattedModel = formatters[
          messageClassification.category as keyof typeof CV_MODEL
        ](messageClassification.model as CVModel[keyof CVModelValue])

        promptWithModel = GPT_PROMPT_TEMPLATE_WITH_CATEGORY.replace(
          CATEGORY_PROMPT_CATEGORY_KEY,
          messageClassification.category
        ).replace(CATEGORY_PROMPT_DATA_KEY, formattedModel)
      }

      console.log('Prompt with model:', promptWithModel)
      // Step 5: send the user message with the prompt and model data to GPT for a response

      // const gptResponse = await this.gptService.generateResponse(
      //   userMessage,
      //   promptWithModel
      // )

      return {
        role: ChatRole.Assistant,
        content: 'gptResponse',
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Error processing user message:', error)
      // Step 6: If an error occurs, return a default error message
      return {
        role: ChatRole.Assistant,
        content: ERROR_MESSAGE_ANSWER,
        timestamp: Date.now()
      }
    }
  }
}
