import { copy } from "@shared/content";
import { type ChatMessage, ChatRole, type ReferralMessage } from "@shared/lib/types";

export const referralWelcomeMessage: ReferralMessage = {
  category: "greeting",
  content: copy.chatMessages.referralWelcomeMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  title: "Welcome to Yusuf’s Referral Chat Assistant",
  type: "referral",
};

export const cvWelcomeMessage: ChatMessage = {
  category: "greeting",
  content: copy.chatMessages.cvWelcomeMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  title: "Welcome to Yusuf’s DevHub Chat Assistant",
  type: "cv",
};

export const failureMessage: ChatMessage = {
  category: "error",
  content: copy.chatMessages.failureMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  title: "Oops!",
  type: "cv",
};
