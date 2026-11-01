import { urls } from "@shared/config/urls";
import type { Workspace } from "@shared/services/types";
import type { WorkspaceSnapshot } from "@shared/services/workspace";

import { authorizationHeaders } from "@/lib/browser-session";
export interface WorkspaceGateway {
  load(): Promise<WorkspaceSnapshot>;
  readonly readOnly: boolean;
  save(state: Workspace, revision: number): Promise<number>;
}
export class HttpWorkspaceGateway implements WorkspaceGateway {
  private writable = false;
  get readOnly() {
    return !this.writable;
  }
  constructor(
    private readonly forceReadOnly = false,
    private readonly auth: () => Promise<Record<string, string>> = authorizationHeaders,
  ) {}
  async load() {
    const response = await fetch(urls.next.fitness.state(), {
      cache: "no-store",
      credentials: this.forceReadOnly ? "omit" : "same-origin",
      headers: this.forceReadOnly ? {} : await this.auth(),
    });
    if (!response.ok) {
      const result = await response
        .json()
        .catch(() => ({ error: "Could not load the shared workspace." }));
      throw new Error(result.error);
    }
    const { canEdit, ...snapshot } = await response.json();
    this.writable = !this.forceReadOnly && canEdit === true;
    return snapshot as WorkspaceSnapshot;
  }
  async save(state: Workspace, revision: number) {
    if (this.readOnly)
      throw new Error("This workspace is read-only. Sign in as the owner to make changes.");
    const response = await fetch(urls.next.fitness.state(), {
      body: JSON.stringify({ revision, state }),
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...(await this.auth()) },
      method: "PUT",
    });
    if (!response.ok) {
      if (response.status === 403) this.writable = false;
      const result = await response
        .json()
        .catch(() => ({ error: "Save failed. Changes were not applied." }));
      throw new Error(result.error);
    }
    return (await response.json()).revision as number;
  }
}
