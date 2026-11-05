import type { ChatMessage } from "@shared/lib/types";
import { ChatRole } from "@shared/lib/types";

import { countTextTokens } from "../token-budget";

export function summarizeMessages(messages: ChatMessage[]): string {
  return messages
    .map((msg) => {
      return `[${msg.role}] ${msg.content}`;
    })
    .join("\n");
}

export function summarizeQuestions(
  sessionMessages: Pick<ChatMessage, "content" | "role">[],
  model = "gpt-4.1-mini",
): string {
  const prefix = "Previously asked: ";
  const questions: string[] = [];
  let tokens = countTextTokens(prefix, model);

  for (const message of sessionMessages.toReversed()) {
    if (message.role !== ChatRole.User || !message.content.trim()) continue;
    tokens += countTextTokens(`${message.content}\n`, model);
    if (tokens > 1200) break;
    questions.push(message.content);
  }

  return questions.length ? prefix + questions.reverse().join("\n") : "";
}
