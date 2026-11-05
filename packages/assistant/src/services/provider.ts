import OpenAI from "openai";
import type { ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses";

import { assertTextInputBudget } from "./token-budget";

export type AssistantTask = "CHAT" | "EDITOR" | "CV" | "FITNESS" | "NOTIFICATIONS" | "JOB";
export type ResponseDelta = (text: string) => void;

export function createAssistantClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 0, timeout: 45000 });
}

export class AssistantService {
  constructor(private readonly client = createAssistantClient()) {}

  async generate(
    task: AssistantTask,
    parameters: ResponseCreateParamsNonStreaming,
    signal?: AbortSignal,
    onDelta?: ResponseDelta,
  ) {
    const agentId = process.env[`OPENAI_${task}_AGENT_ID`];
    let instructions = process.env[`OPENAI_${task}_INSTRUCTIONS`];
    let configuration = parameters;
    if (agentId) {
      if (!/^agent_[a-zA-Z0-9]+$/.test(agentId)) throw new Error("Invalid agent configuration.");
      const agent = await this.client.beta.agents.retrieve(agentId, { signal });
      if (!agent.instructions?.trim()) throw new Error("Agent instructions are required.");
      instructions = agent.instructions;
      configuration = {
        ...parameters,
        model: process.env[`OPENAI_${task}_MODEL`] || agent.model,
      };
    }
    if (instructions?.trim()) {
      configuration = {
        ...configuration,
        instructions: [instructions, parameters.instructions].filter(Boolean).join("\n\n"),
      };
    }
    assertTextInputBudget(task, configuration);
    if (!onDelta) return this.client.responses.create(configuration, { signal });
    const stream = this.client.responses.stream({ ...configuration, stream: true }, { signal });
    stream.on("response.output_text.delta", (event) => onDelta(event.delta));
    return stream.finalResponse();
  }
}
