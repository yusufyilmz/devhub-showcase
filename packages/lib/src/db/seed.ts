import { validateWorkspace } from "../schemas/workspace";
import { convertV1Workspace } from "./migrations/convert-v1-workspace";
import { seed as v1Seed } from "./migrations/v1-seed";

export function seedWorkspace() {
  const workspace = convertV1Workspace(v1Seed());
  validateWorkspace(workspace);
  return workspace;
}
