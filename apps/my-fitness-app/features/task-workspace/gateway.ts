import { urls } from "@shared/config/urls";
import type { NotificationMessage } from "@shared/notifications";
import type { Workspace } from "@shared/services/types";
import type { WorkspaceSnapshot } from "@shared/services/workspace";

import { subscribeFitnessNotifications } from "@/features/notifications/browser";
import { authorizationHeaders } from "@/lib/browser-session";

import { demoWorkspace } from "./starter";
export interface WorkspaceGateway {
  load(signal?: AbortSignal): Promise<WorkspaceSnapshot>;
  readonly readOnly: boolean;
  save(state: Workspace, revision: number): Promise<number>;
  subscribe?(handlers: {
    revision: (revision: number) => void;
    message: (message: NotificationMessage) => void;
  }): () => void;
}
export class HttpWorkspaceGateway implements WorkspaceGateway {
  private workspaceId: string | null = null;
  get readOnly() {
    return !this.workspaceId;
  }
  constructor(
    private readonly auth: () => Promise<Record<string, string>> = authorizationHeaders,
  ) {}
  subscribe(handlers: {
    revision: (revision: number) => void;
    message: (message: NotificationMessage) => void;
  }) {
    return subscribeFitnessNotifications(handlers);
  }
  async load(signal?: AbortSignal) {
    const response = await fetch(urls.fitness.state(), {
      cache: "no-store",
      credentials: "same-origin",
      headers: await this.auth(),
      signal,
    });
    signal?.throwIfAborted();
    if (!response.ok) {
      this.workspaceId = null;
      if (response.status === 401) window.location.replace("/login");
      const result = await response
        .json()
        .catch(() => ({ error: "Could not load your workspace." }));
      throw new Error(result.error);
    }
    const { canEdit, workspaceId, ...snapshot } = await response.json();
    signal?.throwIfAborted();
    if (canEdit !== true || typeof workspaceId !== "string" || !workspaceId) {
      this.workspaceId = null;
      throw new Error("Could not verify your workspace. Reload to reconnect.");
    }
    this.workspaceId = workspaceId;
    return snapshot as WorkspaceSnapshot;
  }
  async save(state: Workspace, revision: number) {
    const workspaceId = this.workspaceId;
    if (!workspaceId) throw new Error("Sign in to make changes to your workspace.");
    const response = await fetch(urls.fitness.state(), {
      body: JSON.stringify({ revision, state, workspaceId }),
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...(await this.auth()) },
      method: "PUT",
    });
    if (!response.ok) {
      if (response.status === 401) {
        this.workspaceId = null;
        window.location.replace("/login");
      }
      const result = await response
        .json()
        .catch(() => ({ error: "Save failed. Changes were not applied." }));
      throw new Error(result.error);
    }
    return (await response.json()).revision as number;
  }
}

export class DemoWorkspaceGateway implements WorkspaceGateway {
  readonly readOnly = true;
  async load() {
    return { revision: 0, state: demoWorkspace() };
  }
  async save(): Promise<number> {
    throw new Error("The demo is read-only.");
  }
}
