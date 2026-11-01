import type { Task } from "@/lib/domain/task";
export interface TaskRepository {
  insertAll(userId: string, tasks: Task[]): Promise<void>;
  list(userId: string): Promise<Task[]>;
}
