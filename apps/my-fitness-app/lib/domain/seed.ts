import { convertV1Workspace } from "@/lib/migrations/convert-v1-workspace";
import { seed as legacySeed } from "@/lib/migrations/v1-seed";

import { validateWorkspace } from "./workspace";
export function seedWorkspace() {
  const workspace = convertV1Workspace(legacySeed());
  validateWorkspace(workspace);
  return workspace;
}
