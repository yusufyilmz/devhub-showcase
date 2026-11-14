"use client";
import { useEffect, useState } from "react";

import { starterWorkspace } from "@shared/lib/workspace-defaults";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Skeleton } from "@shared/ui/skeleton";

import { initializeFitnessNotifications } from "@/features/notifications/browser";
import { DemoWorkspaceGateway, HttpWorkspaceGateway } from "@/features/task-workspace/gateway";
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
      <main
        aria-busy="true"
        className="fitness-state [display:grid] [gap:18px] [justify-items:start] [width:min(100%_-_32px,_32rem)] [margin:clamp(2rem,_12vh,_8rem)_auto_0] [&_>_*]:[width:100%]"
      >
        <Card
          className="fitness-state-card [padding:clamp(16px,_3vw,_28px)] [&_h1]:[font-size:clamp(22px,_5vw,_30px)] [letter-spacing:-0.035em]"
          interaction="static"
        >
          <h1>Getting your tasks ready…</h1>
          <Skeleton className="fitness-loading-placeholder [width:70%] [height:12px]" />
        </Card>
      </main>
    );
  if (!controller.ready)
    return (
      <main className="fitness-state [display:grid] [gap:18px] [justify-items:start] [width:min(100%_-_32px,_32rem)] [margin:clamp(2rem,_12vh,_8rem)_auto_0] [&_>_*]:[width:100%]">
        <Alert variant="destructive">
          <AlertTitle>Could not load your workspace</AlertTitle>
          <AlertDescription>{controller.error}</AlertDescription>
        </Alert>
        <div className="row [display:flex] [gap:10px] [align-items:center]">
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
