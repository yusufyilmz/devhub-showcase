"use server";

import {
  createCVModel,
  failureMessage,
  MessageProcessor,
  PortfolioChatModel,
} from "@shared/assistant";
import { createServerClient } from "@shared/lib/supabase";
import {
  type ChatMessage,
  ChatRole,
  type ReviewState,
  type ReviewWithReferrals,
} from "@shared/lib/types";
import { isCategoryReferralCategory } from "@shared/lib/utils";
import { ReferralService, ReviewService } from "@shared/services/studio";
import { logger } from "@shared/utils/logger";

import { requireAdmin } from "@/features/admin/admin-auth";
import {
  assertCurrentPublication,
  portfolioChatInput,
  requireLegacyChat,
} from "@/features/chat/portfolio-chat";
import { answerPremiumChat } from "@/features/chat/premium-chat";

export async function handlePremiumChatAction(
  username: string,
  message: string,
  sessionId: string,
  requestId: string,
): Promise<string> {
  const result = await answerPremiumChat(
    { message, requestId, sessionId, username },
    AbortSignal.timeout(45000),
  );
  return result.answer;
}

export async function handleSendMessageAction(
  username: string,
  message: ChatMessage,
  sessionId: string,
): Promise<ChatMessage> {
  if (!message?.content) return failureMessage;

  try {
    const input = portfolioChatInput.parse(message);
    const { knowledge, snapshot } = await requireLegacyChat(username, sessionId);
    if (input.type === "cv") {
      const content = await new PortfolioChatModel().answer(
        knowledge,
        input.content,
        AbortSignal.timeout(45000),
      );
      await assertCurrentPublication(username, snapshot.id, snapshot.revision);
      return {
        category: "unknown",
        content,
        role: ChatRole.Assistant,
        timestamp: Date.now(),
        type: "cv",
      };
    }
    const normalizedMessage: ChatMessage = {
      ...message,
      content: input.content,
      role: ChatRole.User,
    };
    const messageProcessor = new MessageProcessor(logger, createCVModel(snapshot.profile));
    if (isCategoryReferralCategory(normalizedMessage.category)) {
      const client = await createServerClient();
      const referralService = new ReferralService(logger, client);

      await referralService.saveReferral(
        normalizedMessage.category,
        normalizedMessage.content,
        sessionId,
      );
    }

    const botReply = await messageProcessor.processUserMessage(normalizedMessage);

    return botReply;
  } catch {
    logger.error("Portfolio chat request failed");
    return {
      category: "error",
      content: failureMessage.content,
      role: ChatRole.System,
      timestamp: Date.now(),
      type: message.type === "referral" ? "referral" : "cv",
    };
  }
}

export async function handleSubmitReviewAction(
  referralId: string,
  reviewState: ReviewState,
): Promise<ReviewWithReferrals | undefined> {
  try {
    const { client } = await requireAdmin();
    const reviewService = new ReviewService(logger, client);
    const review = await reviewService.update(referralId, {
      state: reviewState,
    });

    return review;
  } catch (error) {
    logger.error({ error }, "Error on review");

    return undefined;
  }
}
