import type { ChatMessage } from "@shared/lib/types";
import { ChatRole } from "@shared/lib/types";
import OpenAI from "openai";
import type { Logger } from "pino";

import { summarizeQuestions } from "../summarizer/index";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

export class ChatGPTService {
  openai: OpenAI;

  constructor(private readonly logger: Logger) {
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  }

  async generateResponse(
    message: string,
    systemMessage = "",
    sessionMessages: ChatMessage[] = [],
  ): Promise<string> {
    try {
      const messages = [
        { content: systemMessage, role: ChatRole.System },
        sessionMessages.length
          ? {
              content: summarizeQuestions(sessionMessages),
              role: ChatRole.User,
            }
          : undefined,
        { content: message, role: ChatRole.User },
      ].filter(Boolean) as ChatMessage[];

      const response = await this.openai.chat.completions.create({
        max_tokens: 150,
        messages,
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      });

      const responseMessage = response.choices[0]?.message?.content;

      if (!responseMessage) {
        throw new Error("GPT response is empty");
      }

      return responseMessage;
    } catch (error) {
      this.logger.error("Portfolio model request failed");

      throw error;
    }
  }
}
