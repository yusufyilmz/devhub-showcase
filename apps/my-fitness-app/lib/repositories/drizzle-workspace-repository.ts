import { and, eq, sql } from "drizzle-orm";

import type { Database, Transaction } from "@/lib/db/client";
import {
  dayOverrides,
  mealChoices,
  rotations,
  schedules,
  taskIngredients,
  tasks,
  weights,
  workspaces,
} from "@/lib/db/schema";
import { seedWorkspace } from "@/lib/domain/seed";
import { type Workspace, workspaceSchema } from "@/lib/domain/workspace";

import { DrizzlePlanningRepository } from "./drizzle-planning-repository";
import { DrizzleTaskRepository } from "./drizzle-task-repository";
import { RevisionConflictError, type WorkspaceRepository } from "./workspace-repository";
/** Owner-scoped aggregate transaction. Supabase's pooled postgres role may bypass RLS;
 * every query therefore also filters by the server-verified auth user ID. */
export class DrizzleWorkspaceRepository implements WorkspaceRepository {
  constructor(
    private readonly db: Database,
    private readonly legacy?: (userId: string) => Promise<Workspace | null>,
  ) {}
  async load(userId: string) {
    return this.db.transaction(async (tx) => {
      // Serialize initial import and full-snapshot replacement for this owner only.
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${userId}, 0))`);
      let row = (await tx.select().from(workspaces).where(eq(workspaces.userId, userId)))[0];
      if (!row) {
        const initial = (await this.legacy?.(userId)) ?? seedWorkspace();
        await tx
          .insert(workspaces)
          .values({ revision: 0, userId, ...this.settingsColumns(initial) });
        await this.writeChildren(tx, userId, initial);
        row = (await tx.select().from(workspaces).where(eq(workspaces.userId, userId)))[0];
      }
      if (!row) throw new Error("Workspace row was not created.");
      return this.readSnapshot(tx, userId, row);
    });
  }
  async find(userId: string) {
    return this.db.transaction(
      async (tx) => {
        const row = (await tx.select().from(workspaces).where(eq(workspaces.userId, userId)))[0];
        return row ? this.readSnapshot(tx, userId, row) : null;
      },
      { accessMode: "read only", isolationLevel: "repeatable read" },
    );
  }
  private async readSnapshot(tx: Transaction, userId: string, row: typeof workspaces.$inferSelect) {
    const records = await new DrizzlePlanningRepository(tx).load(userId);
    const taskRows = await new DrizzleTaskRepository(tx).list(userId);
    return {
      revision: row.revision,
      state: workspaceSchema.parse({
        settings: { ...row, rotation: records.rotation },
        tasks: taskRows,
        version: 2,
        ...records,
      }),
    };
  }
  async save(userId: string, state: Workspace, revision: number) {
    return this.db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${userId}, 0))`);
      const updated = await tx
        .update(workspaces)
        .set({
          ...this.settingsColumns(state),
          revision: revision + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(workspaces.userId, userId), eq(workspaces.revision, revision)))
        .returning({ revision: workspaces.revision });
      if (!updated.length) throw new RevisionConflictError();
      // Child rows are replaced atomically; logs remain in the validated task snapshot.
      await tx.delete(rotations).where(eq(rotations.userId, userId));
      await tx.delete(taskIngredients).where(eq(taskIngredients.userId, userId));
      await tx.delete(schedules).where(eq(schedules.userId, userId));
      await tx.delete(mealChoices).where(eq(mealChoices.userId, userId));
      await tx.delete(dayOverrides).where(eq(dayOverrides.userId, userId));
      await tx.delete(weights).where(eq(weights.userId, userId));
      await tx.delete(tasks).where(eq(tasks.userId, userId));
      await this.writeChildren(tx, userId, state);
      const saved = updated[0];
      if (!saved) throw new RevisionConflictError();
      return saved.revision;
    });
  }
  private settingsColumns(state: Workspace) {
    const { rotation, ...settings } = state.settings;
    return settings;
  }
  private async writeChildren(tx: Transaction, userId: string, state: Workspace) {
    await new DrizzleTaskRepository(tx).insertAll(userId, state.tasks);
    await new DrizzlePlanningRepository(tx).replace(userId, {
      ...state,
      rotation: state.settings.rotation,
    });
  }
}
