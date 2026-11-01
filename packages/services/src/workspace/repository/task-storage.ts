import { eq } from "drizzle-orm";

import type { Transaction } from "../../fitness/db/client";
import { tasks as table } from "../../fitness/db/schema";
import type { Task } from "../../types/task";
import { taskSchema } from "../../types/task";
export interface BaseTaskRepository {
  insertAll(userId: string, tasks: Task[]): Promise<void>;
  list(userId: string): Promise<Task[]>;
}

export class TaskRepository implements BaseTaskRepository {
  constructor(private readonly db: Transaction) {}
  async list(userId: string) {
    return (await this.db.select().from(table).where(eq(table.userId, userId))).map((row) =>
      taskSchema.parse(row),
    );
  }
  async insertAll(userId: string, tasks: Task[]) {
    // Topological batches satisfy parent FK constraints without disabling them.
    const pending = new Map(tasks.map((t) => [t.id, t]));
    const inserted = new Set<string>();
    while (pending.size) {
      const batch = [...pending.values()].filter((t) => !t.parentId || inserted.has(t.parentId));
      if (!batch.length) throw new Error("Task tree has missing parents or a cycle.");
      for (let i = 0; i < batch.length; i += 200)
        await this.db.insert(table).values(batch.slice(i, i + 200).map((t) => ({ ...t, userId })));
      for (const task of batch) {
        pending.delete(task.id);
        inserted.add(task.id);
      }
    }
  }
}
