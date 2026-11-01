import { validateWorkspace } from "../../types/workspace";
import { convertV1Workspace } from "./migrations/convert-v1-workspace";
import { seed as legacySeed } from "./migrations/v1-seed";

export function seedWorkspace() {
  const workspace = convertV1Workspace(legacySeed());
  validateWorkspace(workspace);
  return workspace;
}
