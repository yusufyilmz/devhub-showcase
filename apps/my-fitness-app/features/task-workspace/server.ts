import { database } from "@shared/services/db/client";
import { loadLegacyWorkspace } from "@shared/services/fitness";
import { WorkspaceRepository, WorkspaceService } from "@shared/services/workspace";

import { starterWorkspace } from "@/features/task-workspace/starter";
import { configured, fitnessUser, requestIdentity } from "@/lib/auth";

export class SignInRequired extends Error {}
export class SetupRequired extends Error {}

export async function workspaceContext(request: Request) {
  if (!configured() || !process.env.SUPABASE_DB_URL)
    throw new SetupRequired("Fitness workspace setup is incomplete.");
  const { user, client } = await requestIdentity(request);
  const account = fitnessUser(user);
  if (!account)
    throw new SignInRequired("Sign in with a confirmed account to open your workspace.");
  const repository = new WorkspaceRepository(
    database(),
    async (id) => (await loadLegacyWorkspace(client, id)) ?? starterWorkspace(),
  );
  return { service: new WorkspaceService(repository), userId: account.id };
}
