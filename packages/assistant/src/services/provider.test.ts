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
      instructions: "Local task instructions",
      model: "old",
      store: false,
      text: { format: { type: "text" } },
    });
    expect(retrieve).toHaveBeenCalledWith("agent_studio", { signal: undefined });
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      instructions: "Saved instructions\n\nLocal task instructions",
      model: "configured-model",
      store: false,
    });
    expect(create.mock.calls[0]?.[0].tools).toBeUndefined();
  });
  it("rejects oversized text before streaming or generating", async () => {
    vi.stubEnv("OPENAI_CHAT_AGENT_ID", "");
    const create = vi.fn();
    const stream = vi.fn();
    const service = new AssistantService({ responses: { create, stream } } as unknown as OpenAI);

    await expect(
      service.generate("CHAT", { input: " hello".repeat(33_000), model: "gpt-4.1-mini" }),
    ).rejects.toThrow("exceeds its token budget");
    await expect(
      service.generate(
        "CHAT",
        { input: " hello".repeat(33_000), model: "gpt-4.1-mini" },
        undefined,
        vi.fn(),
      ),
    ).rejects.toThrow("exceeds its token budget");
    expect(create).not.toHaveBeenCalled();
    expect(stream).not.toHaveBeenCalled();
  });

  it("budgets CV instructions and text without tokenizing file bytes", async () => {
    vi.stubEnv("OPENAI_CV_AGENT_ID", "");
    const create = vi.fn().mockResolvedValue({ status: "completed" });
    const service = new AssistantService({ responses: { create } } as unknown as OpenAI);
    const file = {
      file_data: "aB9/".repeat(40_000),
      filename: "fixture.pdf",
      type: "input_file" as const,
    };

    await service.generate("CV", {
      input: [{ content: [{ text: "Extract this CV", type: "input_text" }, file], role: "user" }],
      model: "configured-model",
    });
    expect(create).toHaveBeenCalledOnce();
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
