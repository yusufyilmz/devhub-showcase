import { z } from "zod";

export const addProjectSchema = z.object({
  description: z.string(),
  link: z.string().url("Invalid URL"),
  role: z.string(),
  skills: z.array(z.string()).optional().default([]),
  title: z.string().min(1, "Title is required"),
});

export const updateProjectSchema = z.object({
  description: z.string().optional(),
  link: z.string().url("Invalid URL").optional(),
  role: z.string().optional(),
  skills: z.array(z.string()).optional().default([]),
  title: z.string().optional(),
});
