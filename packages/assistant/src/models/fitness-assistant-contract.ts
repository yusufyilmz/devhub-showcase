import { z } from "zod";

export const fitnessSuggestionSchema = z.object({
  notes: z.string().trim().max(1000),
  title: z.string().trim().min(1).max(200),
});
export type FitnessSuggestion = z.infer<typeof fitnessSuggestionSchema>;

export const fitnessProposalSchema = z.object({
  suggestions: z.array(fitnessSuggestionSchema).max(5),
  summary: z.string().trim().min(1).max(800),
});

export const reminderProposalSchema = z.object({
  preview: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(600),
  time: z.iso.time({ precision: -1 }),
  weekdays: z.array(z.number().int().min(0).max(6)).min(1).max(7),
});

export type ReminderProposal = z.infer<typeof reminderProposalSchema>;

export const fitnessAssistantRequest = z.object({
  goal: z.string().trim().min(1).max(1500),
  mode: z.enum(["FITNESS", "NOTIFICATIONS"]),
  planId: z.string().min(1).max(400),
  revision: z.number().int().nonnegative(),
  taskId: z.string().min(1).max(400).optional(),
});
export type FitnessAssistantRequest = z.infer<typeof fitnessAssistantRequest>;
