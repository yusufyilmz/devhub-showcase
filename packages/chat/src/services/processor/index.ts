import type { ChatMessage } from "@shared/lib/types";
import { ChatRole } from "@shared/lib/types";
import type { Logger } from "pino";

import { notMeaningfulMessage, processErrorMessage } from "../../messages";
import {
  CATEGORY_PROMPT_CATEGORY_KEY,
  CATEGORY_PROMPT_DATA_KEY,
  GPT_PROMPT_TEMPLATE_COMPLETE,
  GPT_PROMPT_TEMPLATE_WITH_CATEGORY,
} from "../../models/gpt-prompt";
import type { CVModel } from "../../types";
import { ClassifierService } from "../classifier/index";
import { formatAllCV, formatCVCategory } from "../formatter/index";
import { ChatGPTService } from "../gpt/index";
import { ReferralService } from "../referral";

export class MessageProcessor {
  classifier: ClassifierService;
  gptService: ChatGPTService;
  logger: Logger;
  referralService: ReferralService;

  constructor(
    logger: Logger,
    private readonly cvModel: CVModel,
  ) {
    this.logger = logger;
    this.classifier = new ClassifierService(logger, cvModel);
    this.gptService = new ChatGPTService(logger);
    this.referralService = new ReferralService(logger);
  }

  /**
   * Handles sending a message and processing it through casual response checks,
   * classification, and fallback to GPT.
   */
  public async processUserMessage(userMessage: ChatMessage): Promise<ChatMessage> {
    try {
      if (userMessage.type === "referral") {
        return this.referralService.createReferralMessage(userMessage);
      }

      // Step 1: Do message classification with the NLP classification model
      const classifiedMessage = this.classifier.classify(userMessage.content);

      this.logger.info({ category: classifiedMessage.category }, "Message classified.");

      // Step 2: if result is a casual question or greeting, return a casual response
      if (
        classifiedMessage?.category === "outOfTopic" ||
        classifiedMessage?.category === "greeting" ||
        classifiedMessage?.category === "simpleResponse" ||
        classifiedMessage?.category === "end"
      ) {
        return {
          category: classifiedMessage.category,
          content: (classifiedMessage.model as ChatMessage).content,
          role: ChatRole.Assistant,
          timestamp: Date.now(),
          type: userMessage.type,
        };
      }

      let promptWithModel: string;
      if (classifiedMessage?.category === "unknown") {
        if (!this.classifier.isMeaningfulInput(userMessage.content)) {
          return {
            ...notMeaningfulMessage,
            timestamp: Date.now(),
          };
        }

        // Step 3: if result is a unknown question send all the data to GPT for a response
        const formattedModel = formatAllCV(this.cvModel);
        promptWithModel = GPT_PROMPT_TEMPLATE_COMPLETE.replace(
          CATEGORY_PROMPT_DATA_KEY,
          formattedModel,
        );
      } else {
        // Step 3: format the model data and send it to GPT for a response

        const formattedModel = formatCVCategory(
          classifiedMessage.category as keyof CVModel,
          classifiedMessage.model as CVModel[keyof CVModel],
        );

        promptWithModel = GPT_PROMPT_TEMPLATE_WITH_CATEGORY.replace(
          CATEGORY_PROMPT_CATEGORY_KEY,
          classifiedMessage.category,
        ).replace(CATEGORY_PROMPT_DATA_KEY, formattedModel);
      }

      // Step 5: send the user message with the prompt and model data to GPT for a response

      const gptResponse = await this.gptService.generateResponse(
        userMessage.content,
        promptWithModel,
      );

      return {
        category: classifiedMessage.category,
        content: gptResponse,
        role: ChatRole.Assistant,
        timestamp: Date.now(),
        type: userMessage.type,
      };
    } catch {
      this.logger.error("Portfolio message processing failed");
      // Step 6: If an error occurs, return a default error message
      return {
        ...processErrorMessage,
        timestamp: Date.now(),
      };
    }
  }
}
