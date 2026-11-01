import type { Workspace } from "@/lib/domain/workspace";
export type PlanningRecords = Pick<
  Workspace,
  "ingredients" | "schedules" | "choices" | "overrides" | "weights"
> & { rotation: string[] };
export interface PlanningRepository {
  load(userId: string): Promise<PlanningRecords>;
  replace(userId: string, data: PlanningRecords): Promise<void>;
}
