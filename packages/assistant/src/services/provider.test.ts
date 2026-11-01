import { afterEach, describe, expect, it, vi } from "vitest";

import type OpenAI from "openai";

import { AssistantService } from "./provider";

describe("AssistantService", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("uses saved instructions without inheriting tools or provider storage", async () => {
    vi.stubEnv("OPENAI_EDITOR_AGENT_ID", "agent_studio");
    const retrieve = vi.fn().mockResolvedValue({
      instructions: "Saved instructions",
      model: "configured-model",
      tools: [{ type: "web_search" }],
    });
    const create = vi.fn().mockResolvedValue({ output_text: "{}", status: "completed" });
    const service = new AssistantService({
      beta: { agents: { retrieve } },
      responses: { create },
    } as unknown as OpenAI);
    await service.generate("EDITOR", {
      input: "draft",
      model: "old",
      store: false,
      text: { format: { type: "text" } },
    });
    expect(retrieve).toHaveBeenCalledWith("agent_studio", { signal: undefined });
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      instructions: "Saved instructions",
      model: "configured-model",
      store: false,
    });
    expect(create.mock.calls[0]?.[0].tools).toBeUndefined();
  });
  it("fails closed on a configured agent lookup failure", async () => {
    vi.stubEnv("OPENAI_CHAT_AGENT_ID", "agent_public");
    const create = vi.fn();
    const service = new AssistantService({
      beta: { agents: { retrieve: vi.fn().mockRejectedValue(new Error("Unavailable")) } },
      responses: { create },
    } as unknown as OpenAI);
    await expect(
      service.generate("CHAT", { input: "question", model: "fallback" }),
    ).rejects.toThrow("Unavailable");
    expect(create).not.toHaveBeenCalled();
  });
});
