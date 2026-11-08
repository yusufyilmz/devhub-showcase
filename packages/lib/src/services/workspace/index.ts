import type { BaseWorkspaceRepository } from "../../repositories/workspace/index";
import { updateWorkspaceSchema, validateWorkspace } from "../../schemas/workspace";

export class InvalidWorkspaceError extends Error {}
export class WorkspaceService {
  constructor(private readonly repository: BaseWorkspaceRepository) {}
  load(userId: string) {
    return this.repository.load(userId);
  }
  save(userId: string, input: unknown) {
    const parsed = updateWorkspaceSchema.safeParse(input);
    if (!parsed.success) throw new InvalidWorkspaceError("Invalid task workspace data.");
    try {
      validateWorkspace(parsed.data.state);
    } catch (e) {
      throw new InvalidWorkspaceError((e as Error).message);
    }
    return this.repository.save(userId, parsed.data.state, parsed.data.revision);
  }
}

export * from "../../repositories/workspace/index";
export * from "./access";
