"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

import { Sparkles } from "lucide-react";

import {
  type FitnessAssistantRequest,
  fitnessProposalSchema,
  reminderProposalSchema,
} from "@shared/assistant/fitness-contract";
import { urls } from "@shared/config/urls";
import type { Task } from "@shared/services/types";
import { Alert, AlertDescription } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shared/ui/dialog";
import { Label } from "@shared/ui/label";
import { NativeSelect } from "@shared/ui/native-select";
import { Textarea } from "@shared/ui/textarea";

import type { TaskEditorTarget } from "@/features/task-editor/task-editor";
import { authorizationHeaders } from "@/lib/browser-session";

import { canSuggestSubtasks, reminderTasks } from "./plan-context";

type Mode = FitnessAssistantRequest["mode"];
type Result =
  | { mode: "FITNESS"; proposal: ReturnType<typeof fitnessProposalSchema.parse> }
  | {
      mode: "NOTIFICATIONS";
      proposal: ReturnType<typeof reminderProposalSchema.parse>;
      task: Task;
    };

export function PlanAssistant({
  busy,
  onReview,
  plan,
  revision,
  templates,
  timezone,
}: {
  busy: boolean;
  onReview: (target: TaskEditorTarget) => void;
  plan: Task;
  revision: number;
  templates: Task[];
  timezone: string;
}) {
  const [open, setOpen] = useState(false);
  const reminders = reminderTasks(templates, plan);
  const plannerAvailable = canSuggestSubtasks(plan);

  if (!plannerAvailable && !reminders.length) return null;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={busy} type="button" variant="outline">
          <Sparkles aria-hidden="true" />
          Plan assistant
        </Button>
      </DialogTrigger>
      <DialogContent aria-label="Plan assistant" className="fitness-dialog fitness-task-editor">
        <DialogHeader>
          <DialogTitle>Plan assistant</DialogTitle>
          <DialogDescription>
            Generate a draft for {plan.title}. Your request and relevant plan details are sent to
            the AI provider. You review any changes in the task editor.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <AssistantForm
            key={revision}
            onReview={(target) => {
              setOpen(false);
              onReview(target);
            }}
            plan={plan}
            plannerAvailable={plannerAvailable}
            reminders={reminders}
            revision={revision}
            timezone={timezone}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AssistantForm({
  onReview,
  plan,
  plannerAvailable,
  reminders,
  revision,
  timezone,
}: {
  onReview: (target: TaskEditorTarget) => void;
  plan: Task;
  plannerAvailable: boolean;
  reminders: Task[];
  revision: number;
  timezone: string;
}) {
  const [mode, setMode] = useState<Mode>(plannerAvailable ? "FITNESS" : "NOTIFICATIONS");
  const [taskId, setTaskId] = useState(reminders[0]?.id ?? "");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<Result>();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const task = mode === "NOTIFICATIONS" ? reminders.find((item) => item.id === taskId) : undefined;

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || !goal.trim()) return;

    const controller = new AbortController();
    request.current = controller;
    setResult(undefined);
    setError("");
    setPending(true);
    try {
      setResult(
        await fetchProposal(
          { goal, mode, planId: plan.id, revision, taskId: task?.id },
          task,
          controller.signal,
        ),
      );
    } catch (failure) {
      if (!controller.signal.aborted)
        setError(failure instanceof Error ? failure.message : "Could not generate a proposal.");
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setPending(false);
    }
  }

  return (
    <div className="fitness-assistant-form">
      <form onSubmit={generate}>
        <Label unstyled>
          Assistant
          <NativeSelect
            disabled={pending}
            onChange={(event) => {
              setMode(event.target.value as Mode);
              setGoal("");
              setResult(undefined);
              setError("");
            }}
            unstyled
            value={mode}
          >
            {plannerAvailable && <option value="FITNESS">Fitness Planner</option>}
            {reminders.length > 0 && <option value="NOTIFICATIONS">Notification Coach</option>}
          </NativeSelect>
        </Label>
        {mode === "NOTIFICATIONS" && (
          <Label unstyled>
            Reminder task
            <NativeSelect
              disabled={pending}
              onChange={(event) => {
                setTaskId(event.target.value);
                setResult(undefined);
              }}
              unstyled
              value={taskId}
            >
              {reminders.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </NativeSelect>
          </Label>
        )}
        <Label unstyled>
          {mode === "FITNESS" ? "Goal and constraints" : "Timing preferences and quiet hours"}
          <Textarea
            disabled={pending}
            maxLength={1500}
            onChange={(event) => {
              setGoal(event.target.value);
              setResult(undefined);
            }}
            required
            rows={3}
            unstyled
            value={goal}
          />
        </Label>
        <Button
          className="fitness-new-task"
          disabled={pending || !goal.trim() || (mode === "NOTIFICATIONS" && !task)}
          type="submit"
        >
          {pending ? "Generating…" : "Generate proposal"}
        </Button>
      </form>
      {error && (
        <Alert role="alert" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {result && (
        <AssistantProposal onReview={onReview} plan={plan} result={result} timezone={timezone} />
      )}
    </div>
  );
}

async function fetchProposal(
  input: FitnessAssistantRequest,
  task: Task | undefined,
  signal: AbortSignal,
): Promise<Result> {
  const response = await fetch(urls.next.fitness.assistant(), {
    body: JSON.stringify(input),
    headers: { "Content-Type": "application/json", ...(await authorizationHeaders()) },
    method: "POST",
    signal,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not generate a proposal.");
  return task
    ? { mode: "NOTIFICATIONS", proposal: reminderProposalSchema.parse(data), task }
    : { mode: "FITNESS", proposal: fitnessProposalSchema.parse(data) };
}

function AssistantProposal({
  onReview,
  plan,
  result,
  timezone,
}: {
  onReview: (target: TaskEditorTarget) => void;
  plan: Task;
  result: Result;
  timezone: string;
}) {
  if (result.mode === "NOTIFICATIONS") {
    const { preview, time, weekdays } = result.proposal;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <section aria-label="Reminder proposal" className="fitness-assistant-proposal">
        <p>{result.proposal.summary}</p>
        <p>
          <strong>
            {time} ({timezone})
          </strong>{" "}
          ·{" "}
          {[...new Set(weekdays)]
            .sort()
            .map((day) => days[day])
            .join(", ")}
        </p>
        <p>Example notification: {preview}</p>
        <p>The app uses its standard notification text for saved reminders.</p>
        <Button
          onClick={() =>
            onReview({
              scheduleDraft: { time, weekdays: [...new Set(weekdays)] },
              task: result.task,
            })
          }
          type="button"
          variant="outline"
        >
          Review schedule
        </Button>
      </section>
    );
  }
  return (
    <section aria-label="Plan proposal" className="fitness-assistant-proposal">
      <p>{result.proposal.summary}</p>
      <ul>
        {result.proposal.suggestions.map((suggestion, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Proposal rows are replaced together and do not hold state.
          <li key={index}>
            <strong>{suggestion.title}</strong>
            <p>{suggestion.notes}</p>
            <Button
              onClick={() => onReview({ parent: plan, suggestion })}
              type="button"
              variant="outline"
            >
              Review {suggestion.title}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
