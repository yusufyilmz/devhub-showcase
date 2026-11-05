import OpenAI from "openai";
import type { Logger } from "pino";

import type { ChatMessage } from "@shared/lib/types";

import { AssistantService } from "../provider";
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
      const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
      const history = summarizeQuestions(sessionMessages, model);
      const input = [history, message]
        .filter(Boolean)
        .map((content) => ({ content, role: "user" as const }));

      const response = await new AssistantService(this.openai).generate("CHAT", {
        input,
        instructions: systemMessage,
        max_output_tokens: 150,
        model,
        store: false,
      });

      const responseMessage = response.status === "completed" ? response.output_text : "";

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
