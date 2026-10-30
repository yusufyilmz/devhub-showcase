import { copy } from "@shared/content";
import { type ChatMessage, ChatRole, type ReferralMessage } from "@shared/lib/types";

export const cvWelcomeMessage: ChatMessage = {
  category: "greeting",
  content: copy.chatMessages.cvWelcomeMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  title: "Welcome to Yusuf’s DevHub Chat Assistant",
  type: "cv",
};

export const referralWelcomeMessage: ReferralMessage = {
  category: "greeting",
  content: copy.chatMessages.referralWelcomeMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  title: "Welcome to Yusuf’s Referral Chat Assistant",
  type: "referral",
};

export const referralFinishMessage: ReferralMessage = {
  category: "end",
  content: copy.chatMessages.referralFinishMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  type: "referral",
};

export const failureMessage: ChatMessage = {
  category: "error",
  content: copy.chatMessages.failureMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  title: "Oops!",
  type: "cv",
};

export const processErrorMessage: ChatMessage = {
  category: "error",
  content: copy.chatMessages.processErrorMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  title: "Oops!",
  type: "cv",
};

export const goodbyeMessage: ChatMessage = {
  category: "end",
  content: copy.chatMessages.goodbyeMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  title: "Goodbye!",
  type: "cv",
};

export const outOfTopicMessage: ChatMessage = {
  category: "outOfTopic",
  content: copy.chatMessages.outOfTopicMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  type: "cv",
};

export const greetingMessage: ChatMessage = {
  category: "greeting",
  content: copy.chatMessages.greetingMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  type: "cv",
};

export const unknownMessage: ChatMessage = {
  category: "unknown",
  content: copy.chatMessages.unknownMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  type: "cv",
};

export const notMeaningfulMessage: ChatMessage = {
  category: "notMeaningful",
  content: copy.chatMessages.notMeaningfulMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  type: "cv",
};

export const simpleResponseMessage: ChatMessage = {
  category: "simpleResponse",
  content: copy.chatMessages.simpleResponseMessage,
  role: ChatRole.System,
  timestamp: Date.now(),
  type: "cv",
};
