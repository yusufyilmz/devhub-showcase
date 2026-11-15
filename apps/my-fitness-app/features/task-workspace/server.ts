import { database } from "@shared/lib/db/client";
import { loadV1Workspace } from "@shared/lib/db/migrations/load-v1-workspace";
import { WorkspaceRepository, WorkspaceService } from "@shared/lib/workspace";
import { starterWorkspace } from "@shared/lib/workspace-defaults";

import { env } from "@/env";
import { configured, fitnessUser, requestIdentity } from "@/lib/auth";

export class SignInRequired extends Error {}
export class SetupRequired extends Error {}

export async function workspaceContext(request: Request) {
  if (!configured() || !env.SUPABASE_DB_URL)
    throw new SetupRequired("Fitness workspace setup is incomplete.");
  const { user, client } = await requestIdentity(request);
  const account = fitnessUser(user);
  if (!account)
    throw new SignInRequired("Sign in with a confirmed account to open your workspace.");
  const repository = new WorkspaceRepository(
    database(),
    async (id) => (await loadV1Workspace(client, id)) ?? starterWorkspace(),
  );
  return { service: new WorkspaceService(repository), userId: account.id };
}
