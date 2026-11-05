import { z } from "zod";

import { AssistantService, type AssistantTask } from "./provider";

export async function generateStructuredProposal<Schema extends z.ZodType>(
  task: AssistantTask,
  schema: Schema,
  instructions: string,
  context: unknown,
  signal?: AbortSignal,
): Promise<z.output<Schema>> {
  const { $schema, ...format } = z.toJSONSchema(schema, { target: "draft-7" });
  const response = await new AssistantService().generate(
    task,
    {
      input: JSON.stringify(context),
      instructions,
      max_output_tokens: 1200,
      model: process.env[`OPENAI_${task}_MODEL`] || "gpt-6-luna",
      store: false,
      text: {
        format: { name: task.toLowerCase(), schema: format, strict: true, type: "json_schema" },
      },
    },
    signal,
  );
  if (response.status !== "completed" || !response.output_text)
    throw new Error("The proposal could not be completed.");
  return schema.parse(JSON.parse(response.output_text));
}
