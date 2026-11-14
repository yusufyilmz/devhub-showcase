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

import { TaskService } from "@shared/lib/fitness";
import type { AgendaEvent } from "@shared/lib/schedule";
import { ScheduleService } from "@shared/lib/schedule";
import type { Workspace } from "@shared/lib/types";
import { createTask, dateLabel, shiftDate, type Task } from "@shared/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Badge } from "@shared/ui/badge";
import { Button as LibraryButton } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { Progress } from "@shared/ui/progress";
import { ThemeToggle } from "@shared/ui/theme";
import { Eyebrow } from "@shared/ui/typography";

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
    <div className="app [min-height:100vh]">
      <WorkspaceSidebar name={name} readOnly={readOnly} setTab={setTab} tab={tab} />
      <main className="main [max-width:1530px] [padding:0_46px] [margin-left:244px] min-[1600px]:[margin-right:auto] max-[1200px]:[padding:0_28px] [margin-left:205px] max-[950px]:[padding:0_23px] [margin-left:170px] max-[700px]:[padding:0_20px_70px] [margin:0]">
        <WorkspaceTopbar busy={busy} readOnly={readOnly} tab={tab} />
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
    <aside className="sidebar [position:fixed] [inset:0_auto_0_0] [z-index:20] [display:flex] [flex-direction:column] [width:244px] [padding:38px_25px] [background:var(--surface)] [border-right:1px_solid_var(--line)] [&_nav]:[display:grid] [gap:7px] [&_nav_button]:[display:flex] [gap:13px] [align-items:center] [justify-content:flex-start] [min-height:44px] [padding:10px_14px] [font-weight:550] [color:var(--muted)] [text-align:left] [background:transparent] [border:0] [border-radius:9px] [&_nav_button.active]:[color:var(--ink)] [background:var(--surface-soft)] max-[1200px]:[width:205px] [padding:32px_18px] max-[950px]:[width:170px] max-[700px]:[inset:auto_0_0] [width:100%] [height:calc(68px_+_env(safe-area-inset-bottom))] [padding:0_5px_env(safe-area-inset-bottom)] [border-top:1px_solid_var(--line)] [border-right:0] [backdrop-filter:blur(20px)] max-[700px]:[&_>_.brand]:[display:none] max-[700px]:[&_nav]:[display:grid] [grid-template-columns:repeat(5,_1fr)] [gap:0] max-[700px]:[&_nav_button]:[display:flex] [gap:5px] [padding:12px_3px_8px] [font-size:9px] [border-radius:0] max-[700px]:[&_nav_button.active]:[color:var(--ink)] max-[700px]:[&_nav_svg]:[width:20px] [height:20px] [&_nav_button.active]:[color:var(--accent)] [background:var(--accent-soft)] [&_nav_button:hover]:[color:var(--accent)] max-[700px]:[background:color-mix(in_srgb,_var(--surface)_94%,_transparent)] max-[700px]:[&_nav_button.active]:[color:var(--accent)] max-[700px]:[&_nav_button]:[justify-content:center] [height:100%] [min-height:56px] [border-radius:10px]">
      <a
        className="brand [font-family:var(--font-geist-sans),_sans-serif] [display:flex] [gap:8px] [align-items:center] [font-size:20px] [font-weight:800] [line-height:1.15] [letter-spacing:-0.6px] [&_>_span:first-child]:[display:grid] [flex:0_0_33px] [place-items:center] [width:33px] [height:33px] [font-size:28px] [color:var(--muted)] [background:var(--green)] [border-radius:9px] max-[950px]:[font-size:19px] [&_>_span:first-child]:[color:var(--accent)] [background:var(--accent-soft)] [border:1px_solid_var(--line)]"
        href={readOnly ? "/preview" : "/"}
      >
        <span aria-hidden="true">↗</span>
        <span>My Fitness Studio</span>
      </a>
      <span className="eyebrow [font-size:10px] [font-weight:700] [color:var(--muted)] [letter-spacing:1.8px] nav-label [margin:58px_12px_18px] max-[700px]:[display:none]">
        YOUR DAILY PRACTICE
      </span>
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
      <div className="sidebar-bottom [margin-top:auto] max-[700px]:[display:none]">
        <div className="side-note [display:flex] [justify-content:space-between] [padding:25px_17px_35px] [font-family:var(--font-geist-sans),_sans-serif] [font-size:19px] [font-weight:600] [line-height:1.5] [color:var(--muted)] [letter-spacing:-0.5px] [color:var(--accent)]">
          Small steps.
          <br />
          Lasting change.
          <ArrowUpRight />
        </div>
        <div className="profile [display:flex] [gap:12px] [align-items:center] [padding:23px_5px_0] [border-top:1px_solid_var(--line)] [&_strong]:[display:block] [font-size:13px] [&_small]:[display:block] [margin-top:4px] [font-size:10px] [color:var(--muted)]">
          <span className="avatar [display:grid] [place-items:center] [width:37px] [height:37px] [font-weight:600] [background:var(--surface-soft)] [border-radius:100%] [color:var(--accent)] [background:var(--accent-soft)]">
            {name.slice(0, 1)}
          </span>
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
    <Alert className="fitness-demo-banner [margin-top:20px] [&_a]:[margin-top:6px]">
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
  busy,
  readOnly,
  tab,
}: {
  busy: boolean;
  readOnly: boolean;
  tab: string;
}) {
  return (
    <header className="topbar [display:flex] [align-items:center] [justify-content:space-between] [height:86px] [font-size:11px] [border-bottom:1px_solid_var(--line)] max-[700px]:[height:58px]">
      <span className="breadcrumb [color:var(--muted)] [&_span]:[margin:0_13px] max-[700px]:[font-size:10px]">
        My Fitness Studio / {tab}
      </span>
      <div className="topbar-actions [display:flex] [gap:16px] [align-items:center] max-[700px]:[gap:10px]">
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
    <div className="page-heading [display:flex] [gap:20px] [align-items:center] [justify-content:space-between] [margin:37px_0_30px] [&_.eyebrow]:[margin-bottom:10px] [&_p:last-child]:[margin-top:10px] [font-size:13px] max-[950px]:[&_h1]:[font-size:29px] max-[700px]:[margin:27px_0_24px] max-[700px]:[&_h1]:[font-size:29px] [letter-spacing:-1px] max-[700px]:[&_.eyebrow]:[margin-bottom:8px] [font-size:8px] max-[700px]:[&_p:last-child]:[margin-top:8px] [font-size:11px] max-[700px]:[flex-wrap:wrap]">
      <div>
        <Eyebrow>ONE ROUTINE. SMALL STEPS.</Eyebrow>
        <h1>{headingTitle({ date, name, selectedTitle, tab, taskId, today })}</h1>
        <p>{headingSummary(tab)}</p>
      </div>
      {tab !== "Tasks" && (
        <LibraryLabel
          className="date-control [min-width:145px] [font-size:10px] max-[700px]:[width:100%] [max-width:190px] [margin:0] max-[700px]:[&_input]:[padding:8px] [margin-top:4px] [&_[data-slot='input']]:[color:var(--ink)]"
          unstyled
        >
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
    <Alert
      className="floating-error [position:relative] [z-index:60] max-[700px]:[position:fixed] [top:10px] [right:20px] [left:20px] [z-index:70]"
      variant="destructive"
    >
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
      <div className="overview [display:grid] [grid-template-columns:1fr_290px] [gap:20px] [margin-bottom:34px] max-[1200px]:[grid-template-columns:1fr_230px] max-[950px]:[grid-template-columns:1fr_210px] max-[700px]:[grid-template-columns:1fr] [gap:12px] [margin-bottom:27px] [grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[700px]:[grid-template-columns:minmax(0,_1fr)]">
        <Card
          asChild
          className="fitness-metric [padding:clamp(16px,_3vw,_28px)] [display:grid] [gap:14px] [align-content:start] [min-width:0] [&_p]:[font-size:13px]"
          interaction="static"
          layout="plain"
        >
          <section aria-labelledby="daily-progress-title">
            <div className="fitness-metric-heading [display:flex] [flex-wrap:wrap] [gap:8px] [align-items:center] [justify-content:space-between] [min-height:34px] [&_h2]:[display:flex] [gap:7px] [font-size:16px]">
              <h2 id="daily-progress-title">Daily progress</h2>
              <Badge variant="outline">{dateLabel(date)}</Badge>
            </div>
            <div className="fitness-metric-value [display:flex] [flex-wrap:wrap] [gap:8px] [align-items:baseline] [font-size:clamp(30px,_4vw,_44px)] [font-weight:700] [font-variant-numeric:tabular-nums] [line-height:1] [color:var(--ink)] [letter-spacing:-0.045em] [&_small]:[font-size:14px] [font-weight:500] [color:var(--muted)] [letter-spacing:0]">
              {percent}
              <small>% complete</small>
            </div>
            <Progress aria-label="Daily tasks completed" value={percent} />
            <p>
              {progress.done} of {progress.total} tasks complete · {progress.skipped} skipped
            </p>
          </section>
        </Card>
        <Card
          asChild
          className="fitness-metric [padding:clamp(16px,_3vw,_28px)] [display:grid] [gap:14px] [align-content:start] [min-width:0] [&_p]:[font-size:13px]"
          interaction="static"
          layout="plain"
        >
          <section aria-labelledby="hydration-title">
            <div className="fitness-metric-heading [display:flex] [flex-wrap:wrap] [gap:8px] [align-items:center] [justify-content:space-between] [min-height:34px] [&_h2]:[display:flex] [gap:7px] [font-size:16px]">
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
            <div className="fitness-metric-value [display:flex] [flex-wrap:wrap] [gap:8px] [align-items:baseline] [font-size:clamp(30px,_4vw,_44px)] [font-weight:700] [font-variant-numeric:tabular-nums] [line-height:1] [color:var(--ink)] [letter-spacing:-0.045em] [&_small]:[font-size:14px] [font-weight:500] [color:var(--muted)] [letter-spacing:0]">
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
      <div className="section-heading [position:sticky] [top:118px] [align-self:start] [&_.eyebrow]:[margin-bottom:12px] [&_h2]:[margin-bottom:16px] [font-size:30px] [font-weight:600] [line-height:1.25] [letter-spacing:-0.04em] [&_>_p:last-child]:[font-size:13px] [line-height:1.7] [color:var(--muted-foreground)] max-[767px]:[position:static] max-[767px]:[&_h2]:[margin-bottom:8px] [font-size:26px] [display:flex] [gap:14px] [align-items:center] [justify-content:space-between] [margin-bottom:20px] [&_h2]:[display:flex] [gap:8px] max-[700px]:[margin-bottom:16px] max-[700px]:[&_h2]:[font-size:17px]">
        <h2>Your daily agenda</h2>
        <div className="row [display:flex] [gap:10px] [align-items:center] fitness-agenda-actions [--agenda-action-hover:color-mix(in_srgb,_var(--surface)_75%,_var(--accent-soft))] [[data-theme='dark']_&]:[--agenda-action-hover:color-mix(in_srgb,_var(--accent-soft)_88%,_var(--ink))] [&_[data-slot='button']]:[color:var(--ink)] [&_[data-variant='secondary']]:[background-color:var(--accent-soft)] [&_[data-slot='button']:enabled:hover]:[background-color:var(--agenda-action-hover)]">
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
            variant="secondary"
          >
            <Plus aria-hidden="true" size={16} />
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
      <p className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)] space-top [margin-top:30px]">
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
      <section className="card [padding:24px] [margin-bottom:20px] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:12px] max-[700px]:[padding:18px] [box-shadow:0_2px_10px_var(--shadow-color)]">
        <p>This activity is no longer on this date. It may have been moved or regenerated.</p>
        <LibraryButton
          className="outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]"
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
