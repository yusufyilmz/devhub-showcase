"use server";

import {
  createCVModel,
  failureMessage,
  MessageProcessor,
  PortfolioChatModel,
} from "@shared/assistant";
import { type ChatMessage, ChatRole } from "@shared/lib/types";
import { isCategoryReferralCategory } from "@shared/lib/utils";
import { logger } from "@shared/utils/logger";

import {
  assertCurrentPublication,
  portfolioChatInput,
  requireLegacyChat,
} from "@/features/chat/portfolio-chat";
import { answerPremiumChat } from "@/features/chat/premium-chat";
import { savePortfolioReferral } from "@/features/portfolio/portfolio-reviews";

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
    if (input.type === "referral" && isCategoryReferralCategory(normalizedMessage.category)) {
      await savePortfolioReferral(normalizedMessage.category, normalizedMessage.content, sessionId);
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
