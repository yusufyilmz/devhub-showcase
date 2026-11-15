"use client";
import { useState } from "react";

import {
  Check,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  RotateCcw,
  SkipForward,
} from "lucide-react";

import { TaskService } from "@shared/lib/fitness";
import { quantityLabel } from "@shared/lib/meal";
import type { Task, Workspace } from "@shared/lib/types";
import { Button as LibraryButton } from "@shared/ui/button";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { Eyebrow } from "@shared/ui/typography";

const service = new TaskService();
export interface TaskTreeProps {
  busy: boolean;
  depth?: number;
  onAdd: (parent: Task) => void;
  onEdit: (task: Task) => void;
  onSet: (task: Task, reps: number, weight: number) => void;
  onStatus: (task: Task, status: Task["status"]) => void;
  parentId: string | null;
  readOnly: boolean;
  workspace: Workspace;
}
export function TaskTree(props: TaskTreeProps) {
  return (
    <div className="task-tree [display:grid] [gap:12px] [&_+_.hint]:[margin-bottom:20px]">
      {service
        .children(props.workspace.tasks, props.parentId)
        .sort((a, b) =>
          a.scope === "template"
            ? a.position - b.position
            : (a.time ?? "99:99").localeCompare(b.time ?? "99:99") || a.position - b.position,
        )
        .map((task) => (
          <TaskBranch {...props} key={task.id} task={task} />
        ))}
    </div>
  );
}
export function TaskBranch(props: TaskTreeProps & { task: Task }) {
  const { task, workspace, readOnly, busy, onEdit, onAdd, onStatus, onSet, depth = 0 } = props;
  const [expanded, setExpanded] = useState(depth < 2);
  const children = service.children(workspace.tasks, task.id);
  const status = service.status(workspace.tasks, task.id);
  return (
    <article className={`tree-node kind-${task.kind} status-${status}`}>
      <div className="tree-row [display:flex] [gap:10px] [align-items:flex-start] [padding:18px] max-[700px]:[gap:5px] [padding:13px_10px]">
        <ExpandControl
          expanded={expanded}
          hasChildren={children.length > 0}
          onToggle={() => setExpanded(!expanded)}
          title={task.title}
        />
        <TaskSummary task={task} />
        <TaskActions
          busy={busy}
          canAdd={task.scope !== "generated" && !["set", "supplement", "water"].includes(task.kind)}
          childCount={children.length}
          onAdd={() => onAdd(task)}
          onEdit={() => onEdit(task)}
          onStatus={onStatus}
          progress={service.progress(workspace.tasks, task.id)}
          readOnly={readOnly}
          status={status}
          task={task}
        />
      </div>
      {task.kind === "set" && task.details.type === "set" ? (
        <SetLog
          busy={busy}
          onSet={onSet}
          previous={service.previousSet(workspace, task)}
          readOnly={readOnly}
          task={task}
        />
      ) : null}
      {task.scope !== "template" && children.length === 0 ? (
        <LeafActions busy={busy} onStatus={onStatus} readOnly={readOnly} task={task} />
      ) : null}
      {expanded && children.length > 0 ? (
        <div className="tree-children [padding:0_15px_15px_28px] [&_.tree-node]:[background:var(--surface-soft)] [border-radius:8px] max-[700px]:[padding:0_7px_10px_11px] [box-shadow:none]">
          <TaskTree {...props} depth={depth + 1} parentId={task.id} />
        </div>
      ) : null}
    </article>
  );
}

function ExpandControl({
  expanded,
  hasChildren,
  onToggle,
  title,
}: {
  expanded: boolean;
  hasChildren: boolean;
  onToggle: () => void;
  title: string;
}) {
  if (!hasChildren)
    return (
      <span className="leaf-dot [flex-shrink:0] [width:7px] [height:7px] [margin:7px_8px] [background:var(--accent)] [border-radius:100%]" />
    );
  return (
    <LibraryButton
      aria-expanded={expanded}
      aria-label={`${expanded ? "Collapse" : "Expand"} ${title}`}
      className="icon-btn [display:inline-flex] [align-items:center] [justify-content:center] [min-width:34px] [min-height:34px] [padding:8px] [color:var(--muted)] [background:transparent] [border:0] [border-radius:6px] hover:[background:var(--surface-soft)] hover:[color:var(--accent)] [background:var(--surface-soft)]"
      onClick={onToggle}
      type="button"
      variant="unstyled"
    >
      {expanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
    </LibraryButton>
  );
}

function TaskSummary({ task }: { task: Task }) {
  return (
    <div className="tree-title [display:flex] [flex:1] [flex-direction:column] [gap:7px] [min-width:0] [&_strong]:[font-family:var(--font-geist-sans),_sans-serif] [font-size:15px] [&_p]:[font-size:11px] [line-height:1.7] [white-space:pre-line] [&_>_span:not(.eyebrow)]:[font-size:11px] [color:var(--muted)] [&_.eyebrow]:[font-size:8px] [letter-spacing:1.3px] max-[700px]:[&_strong]:[font-size:12px] max-[700px]:[&_p]:[font-size:10px]">
      <Eyebrow as="span">
        {task.kind.replace("_", " ")}
        {task.time ? ` · ${task.time}` : ""}
      </Eyebrow>
      <strong>{task.title}</strong>
      {task.notes ? <p>{task.notes}</p> : null}
      <TaskFacts task={task} />
    </div>
  );
}

export function TaskFacts({ task }: { task: Task }) {
  if (task.details.type === "dose") {
    return (
      <span>
        {task.details.amount} {task.details.unit}
      </span>
    );
  }
  if (task.details.type === "water") return <span>{task.details.ml} ml</span>;
  if (task.details.type === "meal" && task.details.waterMl > 0) {
    return (
      <span className="water-label [display:flex] [gap:7px] [align-items:center] [margin:5px_0_15px] [font-size:11px] [color:var(--muted)] [color:var(--accent)]">
        Includes {task.details.waterMl} ml water
      </span>
    );
  }
  if (task.details.type === "shopping") return <ShoppingFacts task={task} />;
  if (task.details.type === "cook") return <CookFacts task={task} />;
  return null;
}

function ShoppingFacts({ task }: { task: Task }) {
  if (task.details.type !== "shopping") return null;
  return (
    <>
      <b>{quantityLabel(task.details.quantityMin, task.details.quantityMax, task.details.unit)}</b>
      <span>
        {task.details.occurrences} meal occurrence
        {task.details.occurrences === 1 ? "" : "s"}
      </span>
      {task.details.warnings.map((warning) => (
        <p
          className="ingredient-warning [font-size:10px] [color:var(--muted)] [color:var(--warning)]"
          key={warning}
        >
          {warning}
        </p>
      ))}
    </>
  );
}

function CookFacts({ task }: { task: Task }) {
  if (task.details.type !== "cook") return null;
  return (
    <>
      <ul className="ingredient-lines [padding-left:17px] [margin:0] [font-size:11px] [line-height:1.9] [color:var(--muted)]">
        {task.details.lines.map((line, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Generated instruction lines form an immutable snapshot with no row state.
          <li key={index}>{line}</li>
        ))}
      </ul>
      {task.details.warnings.length > 0 ? (
        <p className="ingredient-warning [font-size:10px] [color:var(--muted)] [color:var(--warning)]">
          Some choices or quantities need review.
        </p>
      ) : null}
    </>
  );
}

function TaskActions({
  busy,
  canAdd,
  childCount,
  onAdd,
  onEdit,
  onStatus,
  progress,
  readOnly,
  status,
  task,
}: {
  busy: boolean;
  canAdd: boolean;
  childCount: number;
  onAdd: () => void;
  onEdit: () => void;
  onStatus: (task: Task, status: Task["status"]) => void;
  progress: { done: number; total: number };
  readOnly: boolean;
  status: Task["status"];
  task: Task;
}) {
  return (
    <div className="tree-actions [display:flex] [flex-wrap:wrap] [gap:5px] [align-items:center] [justify-content:flex-end] max-[700px]:[gap:0] [max-width:85px] max-[700px]:[&_.icon-btn]:[min-width:29px] [min-height:34px] [padding:5px]">
      {childCount > 0 && task.scope !== "template" ? (
        <span className="count [padding:4px_7px] [font-family:var(--font-geist-sans),_sans-serif] [font-size:10px] [color:var(--muted)] [letter-spacing:0] [background:var(--surface-soft)] [border-radius:5px] [color:var(--accent)] [background:var(--accent-soft)]">
          {progress.done}/{progress.total}
        </span>
      ) : null}
      {canAdd ? (
        <LibraryButton
          aria-label={`Add subtask to ${task.title}`}
          className="icon-btn [display:inline-flex] [align-items:center] [justify-content:center] [min-width:34px] [min-height:34px] [padding:8px] [color:var(--muted)] [background:transparent] [border:0] [border-radius:6px] hover:[background:var(--surface-soft)] hover:[color:var(--accent)] [background:var(--surface-soft)]"
          disabled={readOnly || busy}
          onClick={onAdd}
          type="button"
          variant="unstyled"
        >
          <Plus aria-hidden="true" size={16} />
        </LibraryButton>
      ) : null}
      {task.scope !== "generated" && task.kind !== "day" ? (
        <LibraryButton
          aria-label={`Edit ${task.title}`}
          className="icon-btn [display:inline-flex] [align-items:center] [justify-content:center] [min-width:34px] [min-height:34px] [padding:8px] [color:var(--muted)] [background:transparent] [border:0] [border-radius:6px] hover:[background:var(--surface-soft)] hover:[color:var(--accent)] [background:var(--surface-soft)]"
          disabled={readOnly || busy}
          onClick={onEdit}
          type="button"
          variant="unstyled"
        >
          <Pencil aria-hidden="true" size={15} />
        </LibraryButton>
      ) : null}
      {task.scope !== "template" && task.kind !== "set" ? (
        <LibraryButton
          aria-label={`Complete ${task.title}`}
          className={`check ${status === "done" ? "checked" : ""}`}
          disabled={readOnly || busy}
          onClick={() => onStatus(task, status === "done" ? "pending" : "done")}
          type="button"
          variant="unstyled"
        >
          <Check size={17} />
        </LibraryButton>
      ) : null}
    </div>
  );
}

function SetLog({
  busy,
  onSet,
  previous,
  readOnly,
  task,
}: {
  busy: boolean;
  onSet: (task: Task, reps: number, weight: number) => void;
  previous: Task | null;
  readOnly: boolean;
  task: Task;
}) {
  if (task.details.type !== "set") return null;
  const lastWeight = previous?.details.type === "set" ? previous.details.weightKg : undefined;
  return (
    <form
      className="set-log [display:flex] [gap:12px] [align-items:center] [padding:0_20px_14px_43px] [&_>_span]:[flex:1] [font-size:12px] [&_small]:[display:block] [margin-top:5px] [font-size:10px] [color:var(--muted)] [&_label]:[width:70px] [margin:0] [&_input]:[padding:8px] [margin-top:4px] max-[700px]:[flex-wrap:wrap] [gap:8px] [padding:0_12px_12px_19px] max-[700px]:[&_label]:[width:58px] max-[700px]:[&_>_span]:[font-size:10px]"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        onSet(task, Number(form.get("reps")), Number(form.get("weight")));
      }}
    >
      <span>
        Target: {task.details.targetReps} reps
        {previous?.details.type === "set" ? (
          <small>
            Last: {previous.details.actualReps} × {previous.details.weightKg} kg
          </small>
        ) : null}
      </span>
      {task.scope === "template" ? null : (
        <>
          <LibraryLabel unstyled>
            Reps
            <LibraryInput
              aria-label={`${task.title} reps`}
              defaultValue={task.details.actualReps ?? task.details.targetReps}
              disabled={readOnly || busy}
              max="200"
              min="0"
              name="reps"
              required
              type="number"
              unstyled
            />
          </LibraryLabel>
          <LibraryLabel unstyled>
            kg
            <LibraryInput
              aria-label={`${task.title} weight`}
              defaultValue={task.details.weightKg ?? lastWeight ?? ""}
              disabled={readOnly || busy}
              max="1500"
              min="0"
              name="weight"
              required
              step="0.5"
              type="number"
              unstyled
            />
          </LibraryLabel>
          <LibraryButton
            aria-label={`Log ${task.title}`}
            className={`check ${task.status === "done" ? "checked" : ""}`}
            disabled={readOnly || busy}
            type="submit"
            variant="unstyled"
          >
            <Check size={17} />
          </LibraryButton>
        </>
      )}
    </form>
  );
}

function LeafActions({
  busy,
  onStatus,
  readOnly,
  task,
}: {
  busy: boolean;
  onStatus: (task: Task, status: Task["status"]) => void;
  readOnly: boolean;
  task: Task;
}) {
  return (
    <div className="leaf-actions [display:flex] [gap:14px] [padding:0_20px_12px_43px] [&_.text-btn]:[min-height:24px] [font-size:10px] max-[700px]:[padding-left:23px]">
      <LibraryButton
        className="text-btn [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:32px] [padding:4px_0] [font-size:12px] [font-weight:550] [color:var(--ink)] [background:transparent] [border:0] max-[700px]:[font-size:11px] [color:var(--accent)]"
        disabled={readOnly || busy}
        onClick={() => onStatus(task, task.status === "skipped" ? "pending" : "skipped")}
        type="button"
        variant="unstyled"
      >
        <SkipForward size={13} />
        {task.status === "skipped" ? "Unskip" : "Skip"}
      </LibraryButton>
      {task.status === "done" ? (
        <LibraryButton
          className="text-btn [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:32px] [padding:4px_0] [font-size:12px] [font-weight:550] [color:var(--ink)] [background:transparent] [border:0] max-[700px]:[font-size:11px] [color:var(--accent)]"
          disabled={readOnly || busy}
          onClick={() => onStatus(task, "pending")}
          type="button"
          variant="unstyled"
        >
          <RotateCcw size={12} />
          Reopen
        </LibraryButton>
      ) : null}
    </div>
  );
}
