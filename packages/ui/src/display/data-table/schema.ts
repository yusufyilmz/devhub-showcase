import { z } from "zod";

export const schema = z.object({
  header: z.string(),
  id: z.number(),
  limit: z.string(),
  reviewer: z.string(),
  status: z.string(),
  target: z.string(),
  type: z.string(),
});
