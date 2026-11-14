"use client";
import type { Workspace } from "@shared/lib/types";

import { AgentCompanion } from "../chat/agent-companion";
import { fitnessGuide } from "./fitness-guide";

export function FitnessCompanion({
  editing,
  onOpen,
  readOnly,
  reminder,
  request,
  tab,
  workspace,
}: {
  editing: boolean;
  onOpen: () => void;
  readOnly: boolean;
  reminder?: { key: string; taskTitle: string; url: string };
  request: typeof fetch;
  tab: string;
  workspace: Workspace;
}) {
  if (readOnly) return null;
  const paused = tab === "Assistant" || editing;
  return (
    <div hidden={paused}>
      <AgentCompanion
        agent="fitness"
        className="fitness-agent-companion max-[700px]:[--agent-companion-bottom:calc(76px_+_env(safe-area-inset-bottom))]"
        guide={fitnessGuide(workspace, tab, paused, request)}
        label="Fitness assistant"
        notice={
          reminder
            ? {
                action: { href: reminder.url, label: "View activity" },
                id: reminder.key,
                message: reminder.taskTitle,
                title: "Activity reminder",
              }
            : undefined
        }
        onOpen={onOpen}
      />
    </div>
  );
}
