import { z } from "zod";

import { validateWorkspace, workspaceSchema } from "@/lib/domain/workspace";
import type { WorkspaceRepository } from "@/lib/repositories/workspace-repository";

const updateSchema = z.object({
  revision: z.number().int().nonnegative(),
  state: workspaceSchema,
});
export class InvalidWorkspaceError extends Error {}
export class WorkspaceService {
  constructor(private readonly repository: WorkspaceRepository) {}
  load(userId: string) {
    return this.repository.load(userId);
  }
  save(userId: string, input: unknown) {
    const parsed = updateSchema.safeParse(input);
    if (!parsed.success) throw new InvalidWorkspaceError("Invalid task workspace data.");
    try {
      validateWorkspace(parsed.data.state);
    } catch (e) {
      throw new InvalidWorkspaceError((e as Error).message);
    }
    return this.repository.save(userId, parsed.data.state, parsed.data.revision);
  }
}
