export const ChatRole = {
  Assistant: "assistant",
  System: "system",
  User: "user",
} as const;

export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];
