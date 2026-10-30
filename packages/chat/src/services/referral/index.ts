import {
  ChatRole,
  type ReferralMessage,
  type ReferralQuestionCategory,
  validReferralCategories,
} from "@shared/lib/types";
import type { Logger } from "pino";

import { failureMessage, referralFinishMessage } from "../../messages";
import { REFERRAL_MODAL } from "../../models/referral-modal";

export class ReferralService {
  constructor(private readonly logger: Logger) {}

  private getNextReferralQuestion(
    category: ReferralQuestionCategory,
  ): ReferralQuestionCategory | undefined {
    const currentIndex = validReferralCategories.indexOf(category);

    return currentIndex < validReferralCategories.length - 1
      ? validReferralCategories[currentIndex + 1]
      : undefined;
  }

  createReferralMessage(userMessage: ReferralMessage): ReferralMessage {
    try {
      const nextCategory = this.getNextReferralQuestion(userMessage.category);

      if (!nextCategory) {
        return referralFinishMessage;
      }

      return {
        category: nextCategory,
        content: REFERRAL_MODAL[nextCategory].question,
        role: ChatRole.System,
        timestamp: Date.now(),
        type: "referral",
      };
    } catch (error) {
      this.logger.info({ error }, "Error processing user message.");
      return {
        ...failureMessage,
        category: "error",
        type: "referral",
      };
    }
  }
}
