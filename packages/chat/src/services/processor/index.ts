import type { ChatMessage, CVCategoryType } from '@shared/lib/types'
import { ChatRole } from '@shared/lib/types'
import {
  CATEGORY_PROMPT_CATEGORY_KEY,
  CATEGORY_PROMPT_DATA_KEY,
  GPT_PROMPT_TEMPLATE_COMPLETE,
  GPT_PROMPT_TEMPLATE_WITH_CATEGORY
} from '../../models/gpt-prompt'
import { ClassifierService } from '../classifier/index'
import { ChatGPTService } from '../gpt/index'
import { Logger } from 'pino'
import { copy } from '@shared/content'
import { ReferralService } from '../referral'
import { ResourceManager, CacheStore } from '@shared/lib/services'
import { ChatCategory } from '../../types'

export class MessageProcessor {
  classifier: ClassifierService;
  gptService: ChatGPTService;
  logger: Logger;
  referralService: ReferralService;
  resourceManager: ResourceManager;
  cacheStore: CacheStore;

  constructor(logger: Logger) {
    this.logger = logger;
    this.classifier = new ClassifierService(logger);
    this.gptService = new ChatGPTService(logger);
    this.referralService = new ReferralService(logger);
    this.resourceManager = new ResourceManager(logger);
    this.cacheStore = new CacheStore({
      ttl: 3600,  // Cache for 1 hour
    });
  }

  /**
   * Handles sending a message and processing it through casual response checks,
   * classification, and fallback to GPT.
   */
  public async processUserMessage(userMessage: ChatMessage): Promise<ChatMessage> {
    try {
      this.logger.info({ userMessage }, 'User message received.');

      if (userMessage.type === 'referral') {
        return this.referralService.createReferralMessage(userMessage);
      }

      const messageCategory = this.classifier.classify(userMessage.content);
      this.logger.info({ category: messageCategory.category }, 'Message classified.');

      if (this.isCasualCategory(messageCategory.category)) {
        return this.createCasualResponse(messageCategory, userMessage);
      }

      // Check Redis Cache First
      const cacheKey = this.getCacheKey(messageCategory.category, userMessage.content);
      const cachedResponse = await this.cacheStore.get(cacheKey);

      if (cachedResponse) {
        this.logger.info('Returning cached response.');
        return JSON.parse(cachedResponse);
      }

      // Handle structured CV categories or unknown messages
      let promptWithModel: string;
      if (messageCategory.category === 'unknown') {
        promptWithModel = await this.handleUnknownMessage(userMessage);
      } else {
        promptWithModel = await this.createPromptWithCachedModel(messageCategory.category as CVCategoryType);
      }

      const gptResponse = await this.gptService.generateResponse(userMessage.content, promptWithModel);
      this.logger.info({ gptResponse }, 'GPT response:');

      const response = this.createAssistantResponse(gptResponse, userMessage, messageCategory.category);

      // Cache the response
      await this.cacheStore.set(cacheKey, JSON.stringify(response));  // Cache for 1 hour

      return response;

    } catch (error) {
      this.logger.error({ error }, 'Error processing user message');
      return this.createErrorMessage();
    }
  }

  private getCacheKey(category: string, content: string): string {
    return `message:${category}:${content}`;
  }

  private isCasualCategory(category: string): boolean {
    const casualCategories = ['outOfTopic', 'greeting', 'simpleResponse', 'end'];
    return casualCategories.includes(category);
  }

  private createCasualResponse(classifiedMessage: ChatCategory, userMessage: ChatMessage): ChatMessage {
    return {
      role: ChatRole.Assistant,
      content: (classifiedMessage.model as ChatMessage).content,
      timestamp: Date.now(),
      category: classifiedMessage.category,
      type: userMessage.type,
    };
  }

  private async handleUnknownMessage(userMessage: ChatMessage): Promise<string> {
    if (!this.classifier.isMeaningfulInput(userMessage.content)) {
      return copy.chatMessages.notMeaningfulMessage.content;
    }

    const model = await this.getModelFromCacheOrCreate('unknown');
    return GPT_PROMPT_TEMPLATE_COMPLETE.replace(CATEGORY_PROMPT_DATA_KEY, model);
  }

  private async createPromptWithCachedModel(category: CVCategoryType): Promise<string> {
    const model = await this.getModelFromCacheOrCreate(category);
    return GPT_PROMPT_TEMPLATE_WITH_CATEGORY.replace(CATEGORY_PROMPT_CATEGORY_KEY, category).replace(CATEGORY_PROMPT_DATA_KEY, model);
  }

  private async getModelFromCacheOrCreate(category: CVCategoryType | 'unknown'): Promise<string> {
    const cacheKey = `model:${category}`;
    const cachedModel = await this.cacheStore.get(cacheKey);

    this.logger.info(`cachedModel: ${cachedModel}`);

    if (cachedModel) {
      this.logger.info(`Returning cached model for category: ${category}`);
      return cachedModel;
    }

    if(category === 'unknown') {
      return copy.chatMessages.unknownMessage.content;
    }
    
    const model = await this.resourceManager.createCvModalForCategory(category);
    await this.cacheStore.set(cacheKey, model);  // Cache the model

    return model;
  }

  private createAssistantResponse(content: string, userMessage: ChatMessage, category: string): ChatMessage {
    return {
      role: ChatRole.Assistant,
      content,
      timestamp: Date.now(),
      type: userMessage.type,
      category,
    };
  }

  private createErrorMessage(): ChatMessage {
    return {
      ...copy.chatMessages.processErrorMessage,
      timestamp: Date.now(),
    };
  }
}
