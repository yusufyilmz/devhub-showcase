"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

import { Sparkles } from "lucide-react";

import {
  type FitnessAssistantRequest,
  fitnessProposalSchema,
  reminderProposalSchema,
  taskEditProposalSchema,
  type WorkoutProposal,
  workoutProposalSchema,
} from "@shared/assistant/fitness-contract";
import { urls } from "@shared/config/urls";
import { TaskService } from "@shared/services/fitness/task";
import type { Task, Workspace } from "@shared/services/types";
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

import { NotificationNow, ShoppingDraft } from "./assistant-utilities";
import { canSuggestSubtasks, planTasks, reminderTarget, workoutTarget } from "./plan-context";
import { TrainingProposal } from "./training-proposal";
import { appendWorkoutDraft } from "./workout-draft";

type Mode = FitnessAssistantRequest["mode"] | "SHOPPING" | "SEND";
type Result =
  | { mode: "FITNESS"; proposal: ReturnType<typeof fitnessProposalSchema.parse>; plan: Task }
  | { mode: "NOTIFICATIONS"; proposal: ReturnType<typeof reminderProposalSchema.parse>; task: Task }
  | { mode: "WORKOUT"; proposal: WorkoutProposal; task: Task }
  | { mode: "TASK_EDIT"; proposal: ReturnType<typeof taskEditProposalSchema.parse>; task: Task };

const assistantModes: { id: Mode; label: string }[] = [
  { id: "FITNESS", label: "Fitness Planner" },
  { id: "WORKOUT", label: "Workout sets" },
  { id: "TASK_EDIT", label: "Edit a task" },
  { id: "NOTIFICATIONS", label: "Notification Coach" },
  { id: "SHOPPING", label: "Shopping list" },
  { id: "SEND", label: "Send a notification" },
];

function availableModes(plans: Task[]) {
  if (!plans.length) return assistantModes.filter(({ id }) => id === "SHOPPING" || id === "SEND");
  return plans.some(canSuggestSubtasks)
    ? assistantModes
    : assistantModes.filter(({ id }) => id !== "FITNESS");
}

const tasks = new TaskService();

type AssistantProps = {
  busy: boolean;
  date: string;
  initialPlanId: string | null;
  onReview: (target: TaskEditorTarget) => void;
  onSave: (workspace: Workspace, label: string) => Promise<boolean>;
  onWeek: () => void;
  revision: number;
  workspace: Workspace;
};

export function PlanAssistant(props: AssistantProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className="fitness-assistant-trigger"
          disabled={props.busy}
          type="button"
          variant="outline"
        >
          <Sparkles aria-hidden="true" />
          Fitness assistant
        </Button>
      </DialogTrigger>
      <DialogContent aria-label="Fitness assistant" className="fitness-dialog fitness-task-editor">
        <DialogHeader>
          <DialogTitle>Fitness assistant</DialogTitle>
          <DialogDescription>
            Plan training, edit tasks, prepare groceries or manage reminders. AI proposals use your
            request and selected plan details.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <AssistantForm
            {...props}
            key={props.revision}
            onClose={() => setOpen(false)}
            onReview={(target) => {
              setOpen(false);
              props.onReview(target);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function targetsFor(mode: Mode, subtree: Task[]) {
  if (mode === "WORKOUT") return subtree.filter(workoutTarget);
  if (mode === "NOTIFICATIONS") return subtree.filter(reminderTarget);
  if (mode === "TASK_EDIT") return subtree.filter((task) => task.kind !== "day");
  return [];
}

function AssistantForm({
  date,
  initialPlanId,
  onClose,
  onReview,
  onSave,
  onWeek,
  revision,
  workspace,
}: AssistantProps & { onClose: () => void }) {
  const templates = workspace.tasks.filter((task) => task.scope === "template");
  const plans = tasks.children(templates, null);
  const [planId, setPlanId] = useState(initialPlanId);
  const plan = plans.find((item) => item.id === planId) ?? plans[0];
  const [mode, setMode] = useState<Mode>(plan && canSuggestSubtasks(plan) ? "FITNESS" : "SHOPPING");
  const [taskId, setTaskId] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<Result>();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const subtree = plan ? planTasks(templates, plan) : [];
  const targets = targetsFor(mode, subtree);
  const task = targets.find((item) => item.id === taskId) ?? targets[0];
  const utility = mode === "SHOPPING" || mode === "SEND";
  const needsTarget = ["WORKOUT", "NOTIFICATIONS", "TASK_EDIT"].includes(mode);
  const ready = Boolean(
    goal.trim() &&
      plan &&
      (mode !== "FITNESS" || canSuggestSubtasks(plan)) &&
      (!needsTarget || task),
  );

  async function saveTraining(target: Task, proposal: WorkoutProposal) {
    try {
      const draft = appendWorkoutDraft(workspace, target.id, proposal);
      if (!(await onSave(draft, "Workout sets added"))) return false;
      onClose();
      return true;
    } catch {
      return false;
    }
  }

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || !plan || utility || !ready) return;

    const controller = new AbortController();
    request.current = controller;
    setResult(undefined);
    setError("");
    setPending(true);
    try {
      setResult(
        await fetchProposal(
          { goal, mode, planId: plan.id, revision, taskId: task?.id },
          plan,
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
            {availableModes(plans).map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </NativeSelect>
        </Label>
        {!utility && (
          <PromptFields
            disabled={pending}
            goal={goal}
            mode={mode}
            needsTarget={needsTarget}
            onGoal={(value) => {
              setGoal(value);
              setResult(undefined);
            }}
            onPlan={(id) => {
              setPlanId(id);
              setTaskId("");
              setResult(undefined);
              setError("");
            }}
            onTask={(id) => {
              setTaskId(id);
              setResult(undefined);
            }}
            plan={plan}
            plans={plans}
            ready={ready}
            targets={targets}
            task={task}
          />
        )}
      </form>
      {mode === "SHOPPING" && (
        <ShoppingDraft
          date={date}
          onSave={onSave}
          onSaved={() => {
            onClose();
            onWeek();
          }}
          workspace={workspace}
        />
      )}
      {mode === "SEND" && <NotificationNow />}
      {error && (
        <Alert role="alert" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {result && (
        <AssistantProposal
          onReview={onReview}
          onSaveTraining={saveTraining}
          result={result}
          timezone={workspace.settings.timezone}
        />
      )}
    </div>
  );
}

function PromptFields({
  disabled,
  goal,
  mode,
  needsTarget,
  onGoal,
  onPlan,
  onTask,
  plan,
  plans,
  ready,
  targets,
  task,
}: {
  disabled: boolean;
  goal: string;
  mode: Mode;
  needsTarget: boolean;
  onGoal: (value: string) => void;
  onPlan: (id: string) => void;
  onTask: (id: string) => void;
  plan?: Task;
  plans: Task[];
  ready: boolean;
  targets: Task[];
  task?: Task;
}) {
  return (
    <>
      <Label unstyled>
        Source plan
        <NativeSelect
          disabled={disabled}
          onChange={(event) => onPlan(event.target.value)}
          unstyled
          value={plan?.id ?? ""}
        >
          {plans.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </NativeSelect>
      </Label>
      {needsTarget && targets.length > 0 && (
        <Label unstyled>
          {mode === "NOTIFICATIONS" ? "Reminder task" : "Target task"}
          <NativeSelect
            disabled={disabled}
            onChange={(event) => onTask(event.target.value)}
            unstyled
            value={task?.id ?? ""}
          >
            {targets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </NativeSelect>
        </Label>
      )}
      {needsTarget && targets.length === 0 && (
        <p>Choose a plan with a task that supports this action.</p>
      )}
      <Label unstyled>
        {goalLabel(mode)}
        <Textarea
          disabled={disabled}
          maxLength={1500}
          onChange={(event) => onGoal(event.target.value)}
          required
          rows={3}
          unstyled
          value={goal}
        />
      </Label>
      <Button className="fitness-new-task" disabled={disabled || !ready} type="submit">
        {disabled ? "Generating…" : "Generate proposal"}
      </Button>
    </>
  );
}

function goalLabel(mode: Mode) {
  if (mode === "NOTIFICATIONS") return "Timing preferences and quiet hours";
  if (mode === "TASK_EDIT") return "What should change?";
  return "Goal and constraints";
}

async function fetchProposal(
  input: FitnessAssistantRequest,
  plan: Task,
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
  if (input.mode === "FITNESS")
    return { mode: "FITNESS", plan, proposal: fitnessProposalSchema.parse(data) };
  if (!task) throw new Error("Choose a target task.");
  if (input.mode === "WORKOUT")
    return { mode: "WORKOUT", proposal: workoutProposalSchema.parse(data), task };
  if (input.mode === "TASK_EDIT")
    return { mode: "TASK_EDIT", proposal: taskEditProposalSchema.parse(data), task };
  return { mode: "NOTIFICATIONS", proposal: reminderProposalSchema.parse(data), task };
}

function AssistantProposal({
  onReview,
  onSaveTraining,
  result,
  timezone,
}: {
  onReview: (target: TaskEditorTarget) => void;
  onSaveTraining: (task: Task, proposal: WorkoutProposal) => Promise<boolean>;
  result: Result;
  timezone: string;
}) {
  if (result.mode === "WORKOUT")
    return (
      <TrainingProposal onSave={onSaveTraining} proposal={result.proposal} task={result.task} />
    );
  if (result.mode === "TASK_EDIT") {
    const { summary, title, notes, targetReps } = result.proposal;
    const reps = result.task.details.type === "set" ? targetReps : null;
    return (
      <section aria-label="Task edit proposal" className="fitness-assistant-proposal">
        <p>{summary}</p>
        {title !== null && <p>New title: {title}</p>}
        {notes !== null && <p>New notes: {notes || "Clear notes"}</p>}
        {reps !== null && <p>New target: {reps} reps</p>}
        {(title !== null || notes !== null || reps !== null) && (
          <Button
            onClick={() => onReview({ editDraft: result.proposal, task: result.task })}
            type="button"
            variant="outline"
          >
            Review task edit
          </Button>
        )}
      </section>
    );
  }
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
              onClick={() => onReview({ parent: result.plan, suggestion })}
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
