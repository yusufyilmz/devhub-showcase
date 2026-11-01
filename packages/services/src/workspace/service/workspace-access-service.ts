import type { WorkspaceSnapshot } from "../repository";
export class OwnerAccessRequiredError extends Error {
  constructor() {
    super("Only the workspace owner can make changes.");
  }
}
export class WorkspaceNotPublishedError extends Error {
  constructor() {
    super("The owner needs to sign in once to initialize the shared workspace.");
  }
}
export interface SharedWorkspaceReader {
  find(userId: string): Promise<WorkspaceSnapshot | null>;
}
export class WorkspaceAccessService {
  constructor(
    private readonly ownerId: string,
    private readonly reader: SharedWorkspaceReader,
  ) {}
  canEdit(userId: string | null | undefined) {
    return userId === this.ownerId;
  }
  requireOwner(userId: string | null | undefined) {
    if (!this.canEdit(userId)) throw new OwnerAccessRequiredError();
    return this.ownerId;
  }
  async readShared() {
    const result = await this.reader.find(this.ownerId);
    if (!result) throw new WorkspaceNotPublishedError();
    return result;
  }
}
