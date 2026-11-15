import type { z } from "zod";

import type { scheduleSchema, workspaceSchema } from "../schemas/workspace";

export type Workspace = z.infer<typeof workspaceSchema>;
export type TaskSchedule = z.infer<typeof scheduleSchema>;
