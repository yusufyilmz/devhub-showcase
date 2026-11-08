import { z } from "zod";

import type { PortfolioProfile } from "@shared/config";

export const assistantTaskSchema = z.discriminatedUnion("kind", [
  z
    .object({
      field: z.enum(["summary", "projects", "experiences"]),
      itemId: z.string().max(100).optional(),
      kind: z.literal("writing"),
      length: z.enum(["concise", "standard", "detailed"]),
      tone: z.enum(["professional", "friendly", "direct"]),
    })
    .strict(),
  z.object({ kind: z.literal("feedback") }).strict(),
]);
export type AssistantTaskOptions = z.infer<typeof assistantTaskSchema>;
export function writingSource(
  profile: PortfolioProfile,
  task: Extract<AssistantTaskOptions, { kind: "writing" }>,
) {
  if (task.field === "summary") return { context: { title: profile.title }, text: profile.summary };
  if (task.field === "projects") {
    const item = profile.projects.find((entry) => entry.id === task.itemId);
    if (!item) throw new Error("Select an existing project.");
    return { context: { name: item.name }, text: item.description };
  }
  const item = profile.experiences.find((entry) => entry.id === task.itemId);
  if (!item) throw new Error("Select an existing experience.");
  return {
    context: { company: item.company, position: item.position },
    text: item.achievements.join("\n"),
  };
}
export function writingProposal(
  profile: PortfolioProfile,
  task: Extract<AssistantTaskOptions, { kind: "writing" }>,
  text: string,
) {
  if (!text.trim() || text.length > 6000) throw new Error("Invalid writing suggestion.");
  const source = writingSource(profile, task).text;
  const facts = (value: string): string[] =>
    value.match(/https?:\/\/[^\s]+|\b\d[\d.,%/+:-]*\b/g) ?? [];
  const allowed = new Set(facts(source));
  if (facts(text).some((fact) => !allowed.has(fact)))
    throw new Error("Suggestion introduced unsupported metrics, dates or links.");
  if (facts(source).some((fact) => !facts(text).includes(fact)))
    throw new Error("Suggestion omitted protected metrics, dates or links.");
  const field = task.field;
  let value: unknown = text;
  if (field === "projects")
    value = profile.projects.map((item) =>
      item.id === task.itemId ? { ...item, description: text } : item,
    );
  if (field === "experiences")
    value = profile.experiences.map((item) =>
      item.id === task.itemId
        ? {
            ...item,
            achievements: text
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
          }
        : item,
    );
  return {
    changes: [
      {
        field,
        reason: `${task.tone} tone; ${task.length} length. Only the selected source text is rewritten.`,
        value: JSON.stringify(value),
      },
    ],
    summary: "Review this writing alternative. Check every fact before accepting.",
  };
}
