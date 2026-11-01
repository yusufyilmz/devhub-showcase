"use client";
import { useState } from "react";

import { seedWorkspace } from "@shared/services/db/seed";

import { HttpWorkspaceGateway } from "@/features/task-workspace/gateway";
import { TaskWorkspace } from "@/features/task-workspace/task-workspace";
import { useTaskWorkspace } from "@/features/task-workspace/use-task-workspace";

export function FitnessApp({ readOnly = false }: { readOnly?: boolean }) {
  const [initial] = useState(seedWorkspace);
  const [gateway] = useState(() => new HttpWorkspaceGateway(readOnly));
  const controller = useTaskWorkspace(gateway, initial);
  if (controller.loading)
    return (
      <main className="login">
        <h1>Getting your tasks ready…</h1>
      </main>
    );
  if (!controller.ready)
    return (
      <main className="login">
        <h1>Could not load your workspace.</h1>
        <p role="alert">{controller.error}</p>
        <button className="primary" onClick={() => location.reload()} type="button">
          Retry
        </button>
        <a className="text-btn space-top" href="/login">
          Owner sign in
        </a>
      </main>
    );
  return <TaskWorkspace controller={controller} />;
}
