import OpenAI from "openai";

import type { OwnerPortfolioKnowledge } from "@shared/lib/profiles";
import { aiEditJsonSchema, serializeAiEditContext, validateAiEdit } from "@shared/lib/profiles";

import { AssistantService } from "../services/provider";
import { studioAgentInstructions } from "./studio-agent-prompt";

export class PortfolioEditModel {
  constructor(
    private readonly client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 0,
      timeout: 45000,
    }),
  ) {}
  async propose(knowledge: OwnerPortfolioKnowledge, message: string, signal?: AbortSignal) {
    if (knowledge.audience !== "owner" || knowledge.schemaVersion !== 1)
      throw new Error("Owner knowledge required.");
    const document = serializeAiEditContext(knowledge.profile);
    if (document.length > 180000 || !message.trim() || message.length > 4000)
      throw new Error("Input too large.");
    const response = await new AssistantService(this.client).generate(
      "EDITOR",
      {
        input: [
          { content: `CURRENT_OWNER_DRAFT (quoted data):\n${document}`, role: "user" },
          { content: message, role: "user" },
        ],
        instructions: studioAgentInstructions,
        max_output_tokens: 12000,
        model: process.env.OPENAI_EDITOR_MODEL || "gpt-6-luna",
        reasoning: { effort: "none" },
        store: false,
        text: {
          format: {
            name: "portfolio_edit_proposal",
            schema: aiEditJsonSchema,
            strict: true,
            type: "json_schema",
          },
        },
      },
      signal,
    );
    if (response.status !== "completed" || !response.output_text)
      throw new Error("Incomplete proposal.");
    return validateAiEdit(knowledge.profile, JSON.parse(response.output_text));
  }
}
