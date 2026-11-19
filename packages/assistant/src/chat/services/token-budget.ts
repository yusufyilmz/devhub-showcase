import { getEncoding, getEncodingNameForModel, type TiktokenModel } from "js-tiktoken";
import type { ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses";

import type { AssistantTask } from "./provider";

const textInputLimits: Record<AssistantTask, number> = {
  CHAT: 32_000,
  CV: 16_000,
  EDITOR: 64_000,
  FITNESS: 8_000,
  JOB: 12_000,
  NOTIFICATIONS: 4_000,
};
const encoders = new Map<string, ReturnType<typeof getEncoding>>();

function encodingName(model: string): ReturnType<typeof getEncodingNameForModel> {
  try {
    return getEncodingNameForModel(model as TiktokenModel);
  } catch {
    return "o200k_base";
  }
}

export function countTextTokens(text: string, model: string) {
  const encoding = encodingName(model);
  let encoder = encoders.get(encoding);
  if (!encoder) {
    encoder = getEncoding(encoding);
    encoders.set(encoding, encoder);
  }
  return encoder.encode(text, [], []).length;
}

function* inputText(input: ResponseCreateParamsNonStreaming["input"]) {
  if (typeof input === "string") {
    yield input;
    return;
  }
  for (const item of input ?? []) {
    if (!("content" in item)) continue;
    if (typeof item.content === "string") {
      yield item.content;
      continue;
    }
    for (const part of item.content ?? []) {
      if ("text" in part) yield part.text;
    }
  }
}

export function assertTextInputBudget(
  task: AssistantTask,
  parameters: ResponseCreateParamsNonStreaming,
) {
  const count = (text: string) => countTextTokens(text, parameters.model ?? "");
  let tokens = count(parameters.instructions ?? "");
  if (parameters.text?.format?.type === "json_schema") {
    tokens += count(JSON.stringify(parameters.text.format));
  }
  for (const text of inputText(parameters.input)) tokens += count(text);
  // Attachments are handled by the upload size limits and the provider.
  if (tokens > textInputLimits[task]) {
    throw new RangeError("Assistant text input exceeds its token budget.");
  }
}
