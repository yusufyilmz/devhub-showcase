"use client";

import { useEffect, useRef, useState } from "react";

import { Bell, Dumbbell, PencilLine, Plus, ShoppingBasket, Sparkles } from "lucide-react";

import { urls } from "@shared/config/urls";
import { TaskService } from "@shared/lib/fitness";
import type { Task, Workspace } from "@shared/lib/types";
import type { NotificationMessage } from "@shared/notifications";
import { Alert, AlertDescription } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { NativeSelect } from "@shared/ui/native-select";

import {
  type FitnessAssistantRequest,
  fitnessProposalSchema,
  reminderProposalSchema,
  taskEditProposalSchema,
  type WorkoutProposal,
  workoutProposalSchema,
} from "../../models/fitness-assistant-contract";
import {
  canSuggestSubtasks,
  planTasks,
  reminderTarget,
  workoutTarget,
} from "../../services/fitness-context";
import { appendWorkoutDraft } from "../../services/workout-draft";
import { ChatComposer } from "../chat/index";
import { NotificationNow, ShoppingDraft } from "./assistant-utilities";
import { TrainingProposal } from "./training-proposal";
import type { TaskEditorTarget } from "./types";

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
  request: typeof fetch;
  notify: (message: NotificationMessage) => Promise<boolean>;
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
  const [chat, setChat] = useState(0);
  return <AssistantForm {...props} key={chat} onReset={() => setChat((current) => current + 1)} />;
}

const starters = [
  {
    icon: Dumbbell,
    label: "Build a workout",
    mode: "WORKOUT",
    prompt: "Help me build a workout for my available equipment.",
  },
  { icon: PencilLine, label: "Edit a task", mode: "TASK_EDIT", prompt: "" },
  { icon: ShoppingBasket, label: "Make a shopping list", mode: "SHOPPING", prompt: "" },
  { icon: Bell, label: "Plan a reminder", mode: "NOTIFICATIONS", prompt: "" },
] as const;

type Turn = { id: string; prompt: string; revision: number; result: Result };

function targetsFor(mode: Mode, subtree: Task[]) {
  if (mode === "WORKOUT") return subtree.filter(workoutTarget);
  if (mode === "NOTIFICATIONS") return subtree.filter(reminderTarget);
  if (mode === "TASK_EDIT") return subtree.filter((task) => task.kind !== "day");
  return [];
}

function AssistantForm({
  request: transport,
  notify,
  busy,
  date,
  initialPlanId,
  onReset,
  onReview,
  onSave,
  onWeek,
  revision,
  workspace,
}: AssistantProps & { onReset: () => void }) {
  const templates = workspace.tasks.filter((task) => task.scope === "template");
  const plans = tasks.children(templates, null);
  const [planId, setPlanId] = useState(initialPlanId);
  const plan = plans.find((item) => item.id === planId) ?? plans[0];
  const [mode, setMode] = useState<Mode>(plan && canSuggestSubtasks(plan) ? "FITNESS" : "SHOPPING");
  const [taskId, setTaskId] = useState("");
  const [goal, setGoal] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [submitted, setSubmitted] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const request = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    return () => {
      const active = request.current;
      request.current = null;
      active?.abort();
    };
  }, []);
  const subtree = plan ? planTasks(templates, plan) : [];
  const targets = targetsFor(mode, subtree);
  const task = targets.find((item) => item.id === taskId) ?? targets[0];
  const utility = mode === "SHOPPING" || mode === "SEND";
  const needsTarget = ["WORKOUT", "NOTIFICATIONS", "TASK_EDIT"].includes(mode);
  const ready = Boolean(
    !busy &&
      goal.trim() &&
      plan &&
      (mode !== "FITNESS" || canSuggestSubtasks(plan)) &&
      (!needsTarget || task),
  );

  async function saveTraining(target: Task, proposal: WorkoutProposal) {
    try {
      const draft = appendWorkoutDraft(workspace, target.id, proposal);
      return await onSave(draft, "Workout sets added");
    } catch {
      return false;
    }
  }

  function chooseMode(next: Mode, prompt = "") {
    setMode(next);
    setTaskId("");
    setGoal(prompt);
    setError("");
  }

  async function generate() {
    if (request.current || !plan || utility || !ready) return;

    const controller = new AbortController();
    const prompt = goal.trim();
    request.current = controller;
    setSubmitted(prompt);
    setError("");
    setPending(true);
    try {
      const result = await fetchProposal(
        { goal: prompt, mode, planId: plan.id, revision, taskId: task?.id },
        plan,
        task,
        controller.signal,
        transport,
      );
      controller.signal.throwIfAborted();
      const turn = { id: crypto.randomUUID(), prompt, result, revision };
      setTurns((previous) => [...previous.slice(-11), turn]);
      setGoal("");
    } catch (failure) {
      if (controller.signal.aborted) return;
      setError(failure instanceof Error ? failure.message : "Could not generate a proposal.");
    } finally {
      if (request.current === controller) {
        request.current = null;
        setPending(false);
      }
    }
  }

  function stop() {
    request.current?.abort();
    request.current = null;
    setPending(false);
  }

  const started = turns.length > 0 || pending || Boolean(error);

  return (
    <section aria-label="Fitness assistant" className="fitness-assistant-page">
      <div className="fitness-assistant-page-actions">
        <Button disabled={busy} onClick={onReset} type="button" variant="ghost">
          <Plus aria-hidden="true" />
          New chat
        </Button>
      </div>
      <div className="fitness-assistant-thread" data-started={started || undefined}>
        <header className="fitness-assistant-welcome">
          {!started && <Sparkles aria-hidden="true" />}
          <h1 ref={heading} tabIndex={-1}>
            {started ? "Fitness assistant" : "What are we working on today?"}
          </h1>
          {!started && <p>Plan a workout, make a shopping list, or set a reminder.</p>}
        </header>
        <Conversation
          error={error}
          onReview={onReview}
          onSaveTraining={saveTraining}
          pending={pending}
          revision={revision}
          submitted={submitted}
          timezone={workspace.settings.timezone}
          turns={turns}
        />
        <div className="fitness-assistant-compose">
          <FitnessComposer
            busy={busy}
            error={error}
            goal={goal}
            hasReply={turns.length > 0}
            mode={mode}
            modes={availableModes(plans)}
            needsTarget={needsTarget}
            onGoal={setGoal}
            onMode={chooseMode}
            onPlan={(id) => {
              setPlanId(id);
              setTaskId("");
            }}
            onStop={stop}
            onSubmit={generate}
            onTask={setTaskId}
            pending={pending}
            plan={plan}
            plans={plans}
            ready={ready}
            targets={targets}
            task={task}
            utility={utility}
          />
          <AssistantUtility
            date={date}
            mode={mode}
            notify={notify}
            onSave={onSave}
            onWeek={onWeek}
            workspace={workspace}
          />
          {!started && <StarterActions modes={availableModes(plans)} onChoose={chooseMode} />}
          <p className="fitness-assistant-caption">
            AI requests use the selected plan. Review proposals before saving.
          </p>
        </div>
      </div>
    </section>
  );
}

function FitnessComposer({
  busy,
  error,
  hasReply,
  goal,
  mode,
  modes,
  needsTarget,
  onGoal,
  onMode,
  onPlan,
  onStop,
  onSubmit,
  onTask,
  pending,
  plan,
  plans,
  ready,
  targets,
  task,
  utility,
}: Omit<Parameters<typeof PromptContext>[0], "disabled"> & {
  busy: boolean;
  goal: string;
  error: string;
  hasReply: boolean;
  modes: typeof assistantModes;
  onGoal: (goal: string) => void;
  onMode: (mode: Mode) => void;
  onStop: () => void;
  onSubmit: () => void;
  pending: boolean;
  ready: boolean;
  utility: boolean;
}) {
  const disabled = pending || busy;
  const picker = (
    <Label unstyled>
      <span className="sr-only">Assistant</span>
      <NativeSelect
        disabled={disabled}
        onChange={(event) => onMode(event.target.value as Mode)}
        unstyled
        value={mode}
      >
        {modes.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </NativeSelect>
    </Label>
  );
  if (utility) return <div className="fitness-assistant-toolbar">{picker}</div>;

  return (
    <>
      <ChatComposer
        busy={pending}
        companion={{ activity: error ? "error" : hasReply ? "happy" : "idle", agent: "fitness" }}
        controls={
          <div className="fitness-assistant-toolbar">
            {picker}
            <PromptContext
              disabled={disabled}
              mode={mode}
              needsTarget={needsTarget}
              onPlan={onPlan}
              onTask={onTask}
              plan={plan}
              plans={plans}
              targets={targets}
              task={task}
            />
          </div>
        }
        disabled={!ready}
        maxLength={1500}
        onChange={onGoal}
        onStop={onStop}
        onSubmit={onSubmit}
        placeholder={goalLabel(mode)}
        value={goal}
      />
      {needsTarget && !targets.length && (
        <p className="fitness-assistant-caption">
          Choose a plan with a task that supports this action.
        </p>
      )}
    </>
  );
}

function StarterActions({
  modes,
  onChoose,
}: {
  modes: typeof assistantModes;
  onChoose: (mode: Mode, prompt?: string) => void;
}) {
  return (
    <fieldset aria-label="Starter actions" className="fitness-assistant-starters">
      {starters
        .filter((starter) => modes.some(({ id }) => id === starter.mode))
        .map(({ icon: Icon, label, mode, prompt }) => (
          <Button key={mode} onClick={() => onChoose(mode, prompt)} type="button" variant="outline">
            <Icon aria-hidden="true" />
            {label}
          </Button>
        ))}
    </fieldset>
  );
}

function AssistantUtility({
  notify,
  date,
  mode,
  onSave,
  onWeek,
  workspace,
}: Pick<AssistantProps, "date" | "onSave" | "onWeek" | "workspace" | "notify"> & { mode: Mode }) {
  if (mode === "SHOPPING")
    return <ShoppingDraft date={date} onSave={onSave} onSaved={onWeek} workspace={workspace} />;
  if (mode === "SEND") return <NotificationNow notify={notify} />;
  return null;
}

function Conversation({
  error,
  onReview,
  onSaveTraining,
  pending,
  revision,
  submitted,
  timezone,
  turns,
}: {
  error: string;
  onReview: (target: TaskEditorTarget) => void;
  onSaveTraining: (task: Task, proposal: WorkoutProposal) => Promise<boolean>;
  pending: boolean;
  revision: number;
  submitted: string;
  timezone: string;
  turns: Turn[];
}) {
  const tail = useRef<HTMLDivElement>(null);
  const latest = turns.at(-1);
  useEffect(() => {
    if (latest || pending || error) tail.current?.scrollIntoView({ block: "nearest" });
  }, [latest, pending, error]);

  return (
    <div aria-label="Conversation" className="fitness-assistant-messages" role="log">
      {turns.map((turn) => (
        <article className="fitness-assistant-turn" key={turn.id}>
          <p className="fitness-assistant-user">{turn.prompt}</p>
          <div className="fitness-assistant-reply">
            {turn === latest && turn.revision === revision && !pending ? (
              <AssistantProposal
                onReview={onReview}
                onSaveTraining={onSaveTraining}
                result={turn.result}
                timezone={timezone}
              />
            ) : (
              <p>{turn.result.proposal.summary}</p>
            )}
          </div>
        </article>
      ))}
      {(pending || error) && <p className="fitness-assistant-user">{submitted}</p>}
      {pending && <p role="status">Preparing your proposal…</p>}
      {error && (
        <Alert role="alert" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div ref={tail} />
    </div>
  );
}

function PromptContext({
  disabled,
  mode,
  needsTarget,
  onPlan,
  onTask,
  plan,
  plans,
  targets,
  task,
}: {
  disabled: boolean;
  mode: Mode;
  needsTarget: boolean;
  onPlan: (id: string) => void;
  onTask: (id: string) => void;
  plan?: Task;
  plans: Task[];
  targets: Task[];
  task?: Task;
}) {
  return (
    <>
      <Label unstyled>
        <span className="sr-only">Source plan</span>
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
          <span className="sr-only">
            {mode === "NOTIFICATIONS" ? "Reminder task" : "Target task"}
          </span>
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
    </>
  );
}

function goalLabel(mode: Mode) {
  if (mode === "NOTIFICATIONS") return "Timing preferences and quiet hours";
  if (mode === "TASK_EDIT") return "What should change?";
  return "Ask about your fitness plan…";
}

async function fetchProposal(
  input: FitnessAssistantRequest,
  plan: Task,
  task: Task | undefined,
  signal: AbortSignal,
  request: typeof fetch,
): Promise<Result> {
  const response = await request(urls.fitness.assistant(), {
    body: JSON.stringify(input),
    headers: { "Content-Type": "application/json" },
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
