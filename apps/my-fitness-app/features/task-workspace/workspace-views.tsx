"use client";
import type { ReactNode } from "react";

import {
  ArrowUpRight,
  CalendarDays,
  Droplets,
  Home,
  Info,
  Layers,
  Plus,
  Settings2,
  ShoppingBasket,
} from "lucide-react";

import { TaskService } from "@shared/services/fitness/task";
import type { AgendaEvent } from "@shared/services/schedule";
import { ScheduleService } from "@shared/services/schedule";
import type { Workspace } from "@shared/services/types";
import { createTask, dateLabel, shiftDate, type Task } from "@shared/services/types";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Badge } from "@shared/ui/badge";
import { Button as LibraryButton } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { Progress } from "@shared/ui/progress";
import { ThemeToggle } from "@shared/ui/theme";

import { DayAgenda } from "@/features/agenda/day-agenda";
import { TaskDetails } from "@/features/agenda/task-details";
import type { TaskEditorTarget } from "@/features/task-editor/task-editor";
import { WeeklyPlanner } from "@/features/weekly-planner/weekly-planner";

import { CalendarView } from "./calendar-view";
import { SettingsView } from "./settings-view";
import { TaskPlans } from "./task-plans";
import type { WorkspaceController } from "./use-task-workspace";

const navigation = [
  { icon: Home, name: "Today" },
  { icon: Layers, name: "Tasks" },
  { icon: ShoppingBasket, name: "Week" },
  { icon: CalendarDays, name: "Calendar" },
  { icon: Settings2, name: "More" },
];
const scheduleService = new ScheduleService();
const taskService = new TaskService();

type Update = WorkspaceController["update"];
type TreeProps = {
  busy: boolean;
  onAdd: (parent: Task) => void;
  onEdit: (task: Task) => void;
  onSet: (task: Task, reps: number, weight: number) => void;
  onStatus: (task: Task, status: Task["status"]) => void;
  readOnly: boolean;
};

export function WorkspaceFrame({
  assistant,
  busy,
  children,
  date,
  error,
  name,
  overlay,
  onDismissError,
  readOnly,
  selectedTitle,
  setDate,
  setTab,
  tab,
  taskId,
  today,
}: {
  assistant?: ReactNode;
  busy: boolean;
  children: ReactNode;
  date: string;
  error: string;
  name: string;
  overlay?: ReactNode;
  onDismissError: () => void;
  readOnly: boolean;
  selectedTitle?: string;
  setDate: (date: string) => void;
  setTab: (tab: string) => void;
  tab: string;
  taskId: string | null;
  today: string;
}) {
  return (
    <div className="app">
      <WorkspaceSidebar name={name} readOnly={readOnly} setTab={setTab} tab={tab} />
      <main className="main">
        <WorkspaceTopbar assistant={assistant} busy={busy} readOnly={readOnly} tab={tab} />
        {readOnly ? <ReadOnlyBanner /> : null}
        {tab !== "Assistant" && (
          <PageHeading
            date={date}
            name={name}
            selectedTitle={selectedTitle}
            setDate={setDate}
            tab={tab}
            taskId={taskId}
            today={today}
          />
        )}
        {error ? <ErrorBanner message={error} onDismiss={onDismissError} /> : null}
        {children}
        {tab !== "Assistant" && <footer>My Fitness Studio · A little better, every day.</footer>}
      </main>
      {overlay}
    </div>
  );
}

export function WorkspacePanels({
  busy,
  date,
  day,
  onAdd,
  onEventStatus,
  onMove,
  openDay,
  openTask,
  readOnly,
  selectedTask,
  setDate,
  setError,
  setTarget,
  setTemplateRoot,
  state,
  tab,
  taskId,
  templateRoot,
  treeProps,
  update,
}: {
  busy: boolean;
  date: string;
  day: Workspace;
  onAdd: (parent: Task) => void;
  onEventStatus: (event: AgendaEvent) => void;
  onMove: (id: string, from: string, to: string, time: string | null) => Promise<void>;
  openDay: (date: string) => void;
  openTask: (date: string, taskId: string) => void;
  readOnly: boolean;
  selectedTask: Task | null;
  setDate: (date: string) => void;
  setError: (message: string) => void;
  setTarget: (target: TaskEditorTarget | null) => void;
  setTemplateRoot: (id: string | null) => void;
  state: Workspace;
  tab: string;
  taskId: string | null;
  templateRoot: string | null;
  treeProps: TreeProps;
  update: Update;
}) {
  if (tab === "Today" && !taskId) {
    return (
      <TodayView
        busy={busy}
        date={date}
        day={day}
        onAdd={onAdd}
        onEventStatus={onEventStatus}
        openTask={openTask}
        readOnly={readOnly}
        setDate={setDate}
        state={state}
        update={update}
      />
    );
  }
  if (tab === "Today") {
    return (
      <TodayActivity
        date={date}
        day={day}
        onMove={onMove}
        openDay={openDay}
        selectedTask={selectedTask}
        treeProps={treeProps}
      />
    );
  }
  if (tab === "Tasks") {
    return (
      <TaskPlans
        onCreate={() => setTarget({})}
        selected={templateRoot}
        setSelected={setTemplateRoot}
        state={state}
        tree={treeProps}
      />
    );
  }
  if (tab === "Week") {
    return (
      <WeeklyPlanner
        busy={busy}
        date={date}
        readOnly={readOnly}
        update={update}
        workspace={state}
      />
    );
  }
  if (tab === "Calendar") {
    return (
      <CalendarView
        busy={busy}
        date={date}
        onMove={onMove}
        onOpen={openTask}
        onStatus={onEventStatus}
        openDay={openDay}
        readOnly={readOnly}
        setDate={setDate}
        update={update}
        workspace={state}
      />
    );
  }
  if (tab === "More") {
    return (
      <SettingsView
        busy={busy}
        date={date}
        onError={setError}
        readOnly={readOnly}
        update={update}
        workspace={state}
      />
    );
  }
  return null;
}

function WorkspaceSidebar({
  name,
  readOnly,
  setTab,
  tab,
}: {
  name: string;
  readOnly: boolean;
  setTab: (tab: string) => void;
  tab: string;
}) {
  return (
    <aside className="sidebar">
      <a className="brand" href={readOnly ? "/preview" : "/"}>
        <span aria-hidden="true">↗</span>
        <span>My Fitness Studio</span>
      </a>
      <span className="eyebrow nav-label">YOUR DAILY PRACTICE</span>
      <nav aria-label="Fitness workspace">
        {navigation.map(({ name: label, icon: Icon }) => (
          <LibraryButton
            aria-current={tab === label ? "page" : undefined}
            className={tab === label ? "active" : ""}
            key={label}
            onClick={() => setTab(label)}
            type="button"
            variant="ghost"
          >
            <Icon aria-hidden="true" size={20} />
            <span>{label}</span>
          </LibraryButton>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="side-note">
          Small steps.
          <br />
          Lasting change.
          <ArrowUpRight />
        </div>
        <div className="profile">
          <span className="avatar">{name.slice(0, 1)}</span>
          <div>
            <strong>{name}</strong>
            <small>{readOnly ? "Demo workspace" : "Private workspace"}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ReadOnlyBanner() {
  return (
    <Alert className="fitness-demo-banner">
      <Info aria-hidden="true" />
      <AlertTitle>My Fitness Studio demo</AlertTitle>
      <AlertDescription>
        Explore a sample day with fictional activities.
        <LibraryButton href="/" variant="outline">
          Open my workspace
        </LibraryButton>
      </AlertDescription>
    </Alert>
  );
}

function WorkspaceTopbar({
  assistant,
  busy,
  readOnly,
  tab,
}: {
  assistant?: ReactNode;
  busy: boolean;
  readOnly: boolean;
  tab: string;
}) {
  return (
    <header className="topbar">
      <span className="breadcrumb">My Fitness Studio / {tab}</span>
      <div className="topbar-actions">
        {assistant}
        <ThemeToggle />
        <Badge role="status" variant="secondary">
          {syncLabel(readOnly, busy)}
        </Badge>
      </div>
    </header>
  );
}

function syncLabel(readOnly: boolean, busy: boolean) {
  if (readOnly) return "Demo";
  if (busy) return "Saving…";
  return "Private";
}

function PageHeading({
  date,
  name,
  selectedTitle,
  setDate,
  tab,
  taskId,
  today,
}: {
  date: string;
  name: string;
  selectedTitle?: string;
  setDate: (date: string) => void;
  tab: string;
  taskId: string | null;
  today: string;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">ONE ROUTINE. SMALL STEPS.</p>
        <h1>{headingTitle({ date, name, selectedTitle, tab, taskId, today })}</h1>
        <p>{headingSummary(tab)}</p>
      </div>
      {tab !== "Tasks" && (
        <LibraryLabel className="date-control" unstyled>
          Active date
          <LibraryInput
            onChange={(event) => {
              if (event.target.value) setDate(event.target.value);
            }}
            type="date"
            value={date}
          />
        </LibraryLabel>
      )}
    </div>
  );
}

function headingTitle(input: {
  date: string;
  name: string;
  selectedTitle?: string;
  tab: string;
  taskId: string | null;
  today: string;
}) {
  if (input.tab === "Today") return todayTitle(input);
  if (input.tab === "Tasks") return "Tasks";
  if (input.tab === "Week") return "Plan. Prepare. Show up.";
  if (input.tab === "Calendar") return "A little structure.";
  return "Make it yours.";
}

function todayTitle(input: {
  date: string;
  name: string;
  selectedTitle?: string;
  taskId: string | null;
  today: string;
}) {
  if (input.taskId) return input.selectedTitle ?? "Activity details";
  if (input.date === input.today) return `Your day, ${input.name}.`;
  return dateLabel(input.date);
}

function headingSummary(tab: string) {
  if (tab === "Tasks")
    return "Organize the plans you reuse for workouts, meals and daily routines.";
  if (tab === "Week") return "Cooking and groceries, derived from the meals on your calendar.";
  return "A clear plan. A few small wins. You’ve got this.";
}

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <Alert className="floating-error" variant="destructive">
      <AlertTitle>Workspace update</AlertTitle>
      <AlertDescription>
        {message}
        <LibraryButton onClick={onDismiss} type="button" variant="outline">
          Dismiss
        </LibraryButton>
      </AlertDescription>
    </Alert>
  );
}

function TodayView({
  busy,
  date,
  day,
  onAdd,
  onEventStatus,
  openTask,
  readOnly,
  setDate,
  state,
  update,
}: {
  busy: boolean;
  date: string;
  day: Workspace;
  onAdd: (parent: Task) => void;
  onEventStatus: (event: AgendaEvent) => void;
  openTask: (date: string, taskId: string) => void;
  readOnly: boolean;
  setDate: (date: string) => void;
  state: Workspace;
  update: Update;
}) {
  const progress = taskService.progress(day.tasks, `day:${date}`);
  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const water = scheduleService.waterTotal(day, date);
  const dayRoot = day.tasks.find((task) => task.id === `day:${date}`);
  return (
    <>
      <div className="overview">
        <Card asChild className="fitness-metric" interaction="static" layout="plain">
          <section aria-labelledby="daily-progress-title">
            <div className="fitness-metric-heading">
              <h2 id="daily-progress-title">Daily progress</h2>
              <Badge variant="outline">{dateLabel(date)}</Badge>
            </div>
            <div className="fitness-metric-value">
              {percent}
              <small>% complete</small>
            </div>
            <Progress aria-label="Daily tasks completed" value={percent} />
            <p>
              {progress.done} of {progress.total} tasks complete · {progress.skipped} skipped
            </p>
          </section>
        </Card>
        <Card asChild className="fitness-metric" interaction="static" layout="plain">
          <section aria-labelledby="hydration-title">
            <div className="fitness-metric-heading">
              <h2 id="hydration-title">
                <Droplets aria-hidden="true" size={18} /> Hydration
              </h2>
              <LibraryButton
                disabled={readOnly || busy}
                onClick={() => update((current) => logWater(current, date), "250 ml logged")}
                type="button"
                variant="outline"
              >
                <Plus size={15} />
                250 ml water
              </LibraryButton>
            </div>
            <div className="fitness-metric-value">
              {(water / 1000).toFixed(2)}
              <small>/ {state.settings.waterTarget / 1000} L</small>
            </div>
            <Progress
              aria-label="Daily water goal"
              value={Math.min(100, (water / state.settings.waterTarget) * 100)}
            />
            <p>Water logged for this day</p>
          </section>
        </Card>
      </div>
      <div className="section-heading">
        <h2>Your daily agenda</h2>
        <div className="row">
          <LibraryButton
            onClick={() => setDate(shiftDate(date, -1))}
            type="button"
            variant="outline"
          >
            Previous
          </LibraryButton>
          <LibraryButton
            onClick={() => setDate(shiftDate(date, 1))}
            type="button"
            variant="outline"
          >
            Next
          </LibraryButton>
          <LibraryButton
            disabled={readOnly || busy || !dayRoot}
            onClick={() => {
              if (dayRoot) onAdd(dayRoot);
            }}
            size="lg"
            type="button"
          >
            <Plus size={16} />
            Add task
          </LibraryButton>
        </div>
      </div>
      <DayAgenda
        busy={busy}
        date={date}
        onOpen={openTask}
        onStatus={onEventStatus}
        readOnly={readOnly}
        workspace={day}
      />
      <p className="hint space-top">
        Activities are ordered by hour. Open an activity with the arrow to see its details and
        subtasks. Items without a time appear at the end.
      </p>
    </>
  );
}

function logWater(state: Workspace, date: string) {
  const next = structuredClone(scheduleService.ensureDay(state, date));
  next.tasks.push(
    createTask({
      date,
      details: { ml: 250, type: "water" },
      id: crypto.randomUUID(),
      kind: "water",
      parentId: `day:${date}`,
      position: 100,
      scope: "scheduled",
      status: "done",
      title: "Extra water",
    }),
  );
  return next;
}

function TodayActivity({
  date,
  day,
  onMove,
  openDay,
  selectedTask,
  treeProps,
}: {
  date: string;
  day: Workspace;
  onMove: (id: string, from: string, to: string, time: string | null) => Promise<void>;
  openDay: (date: string) => void;
  selectedTask: Task | null;
  treeProps: TreeProps;
}) {
  if (!selectedTask) {
    return (
      <section className="card">
        <p>This activity is no longer on this date. It may have been moved or regenerated.</p>
        <LibraryButton
          className="outline"
          onClick={() => openDay(date)}
          type="button"
          variant="unstyled"
        >
          Back to agenda
        </LibraryButton>
      </section>
    );
  }
  return (
    <TaskDetails
      date={date}
      key={selectedTask.id}
      onBack={() => openDay(date)}
      onMove={onMove}
      task={selectedTask}
      workspace={day}
      {...treeProps}
    />
  );
}
