"use client";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Skeleton } from "@shared/ui/skeleton";

import { initializeFitnessNotifications } from "@/features/notifications/browser";
import { DemoWorkspaceGateway, HttpWorkspaceGateway } from "@/features/task-workspace/gateway";
import { starterWorkspace } from "@/features/task-workspace/starter";
import { TaskWorkspace } from "@/features/task-workspace/task-workspace";
import { useTaskWorkspace } from "@/features/task-workspace/use-task-workspace";

export function FitnessApp({ demo = false }: { demo?: boolean }) {
  useEffect(initializeFitnessNotifications, []);
  const [initial] = useState(starterWorkspace);
  const [gateway] = useState(() =>
    demo ? new DemoWorkspaceGateway() : new HttpWorkspaceGateway(),
  );
  const controller = useTaskWorkspace(gateway, initial, demo);
  if (controller.loading)
    return (
      <main aria-busy="true" className="fitness-state">
        <Card className="fitness-state-card" interaction="static">
          <h1>Getting your tasks ready…</h1>
          <Skeleton className="fitness-loading-placeholder" />
        </Card>
      </main>
    );
  if (!controller.ready)
    return (
      <main className="fitness-state">
        <Alert variant="destructive">
          <AlertTitle>Could not load your workspace</AlertTitle>
          <AlertDescription>{controller.error}</AlertDescription>
        </Alert>
        <div className="row">
          <Button onClick={() => location.reload()} type="button">
            Retry
          </Button>
          <Button href="/login" variant="outline">
            Sign in
          </Button>
        </div>
      </main>
    );
  return <TaskWorkspace controller={controller} />;
}
