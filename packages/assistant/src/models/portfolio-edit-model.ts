import OpenAI from "openai";

import { env } from "@shared/env";
import type { AssistantTaskOptions, OwnerPortfolioKnowledge } from "@shared/lib/profiles";
import { aiEditJsonSchema, serializeAiEditContext, validateAiEdit } from "@shared/lib/profiles";

import { AssistantService } from "../services/provider";
import { focusedWriting } from "./focused-assistant";
import { studioAgentInstructions } from "./studio-agent-prompt";

export class PortfolioEditModel {
  constructor(
    private readonly client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      maxRetries: 0,
      timeout: 45000,
    }),
  ) {}
  async propose(
    knowledge: OwnerPortfolioKnowledge,
    message: string,
    signal?: AbortSignal,
    task?: AssistantTaskOptions,
  ) {
    if (knowledge.audience !== "owner" || knowledge.schemaVersion !== 1)
      throw new Error("Owner knowledge required.");
    if (task?.kind === "writing")
      return focusedWriting(this.client, knowledge.profile, task, signal);
    const document = serializeAiEditContext(knowledge.profile);
    if (document.length > 180000 || !message.trim() || message.length > 4000)
      throw new Error("Input too large.");
    const response = await new AssistantService(this.client).generate(
      "EDITOR",
      {
        input: [
          { content: `CURRENT_OWNER_DRAFT (quoted data):\n${document}`, role: "user" },
          {
            content:
              task?.kind === "feedback"
                ? `Assess the portfolio by section. Return concrete feedback entries with needsInput for missing facts and only supported direct edits. ${message}`
                : message,
            role: "user",
          },
        ],
        instructions:
          task?.kind === "feedback"
            ? `${studioAgentInstructions}\nAssess clarity, completeness and presentation section by section. Return feedback entries identifying an actual field, concrete issue, benefit and recommendation. Set needsInput=true when missing facts require the owner. Never invent missing history. Only propose direct edits supported by supplied facts; recommendations alone use an empty changes array. Do not change anything during analysis.`
            : studioAgentInstructions,
        max_output_tokens: 12000,
        model: env.OPENAI_EDITOR_MODEL || "gpt-6-luna",
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
