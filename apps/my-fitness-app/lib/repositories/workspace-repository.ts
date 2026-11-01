import type { Workspace } from "@/lib/domain/workspace";
export interface WorkspaceSnapshot {
  revision: number;
  state: Workspace;
}
export interface WorkspaceRepository {
  load(userId: string): Promise<WorkspaceSnapshot>;
  save(userId: string, state: Workspace, revision: number): Promise<number>;
}
export class RevisionConflictError extends Error {
  constructor() {
    super("Your workspace changed in another tab. Reload before saving.");
  }
}
