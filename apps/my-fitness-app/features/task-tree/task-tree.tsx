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

import { TaskService } from "@shared/services/fitness";
import { quantityLabel } from "@shared/services/meal";
import type { Task, Workspace } from "@shared/services/types";
import { Button as LibraryButton } from "@shared/ui/button";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";

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
    <div className="task-tree">
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
      <div className="tree-row">
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
        <div className="tree-children">
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
  if (!hasChildren) return <span className="leaf-dot" />;
  return (
    <LibraryButton
      aria-expanded={expanded}
      aria-label={`${expanded ? "Collapse" : "Expand"} ${title}`}
      className="icon-btn"
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
    <div className="tree-title">
      <span className="eyebrow">
        {task.kind.replace("_", " ")}
        {task.time ? ` · ${task.time}` : ""}
      </span>
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
    return <span className="water-label">Includes {task.details.waterMl} ml water</span>;
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
        <p className="ingredient-warning" key={warning}>
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
      <ul className="ingredient-lines">
        {task.details.lines.map((line, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Generated instruction lines form an immutable snapshot with no row state.
          <li key={index}>{line}</li>
        ))}
      </ul>
      {task.details.warnings.length > 0 ? (
        <p className="ingredient-warning">Some choices or quantities need review.</p>
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
    <div className="tree-actions">
      {childCount > 0 && task.scope !== "template" ? (
        <span className="count">
          {progress.done}/{progress.total}
        </span>
      ) : null}
      {canAdd ? (
        <LibraryButton
          aria-label={`Add subtask to ${task.title}`}
          className="icon-btn"
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
          className="icon-btn"
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
      className="set-log"
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
    <div className="leaf-actions">
      <LibraryButton
        className="text-btn"
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
          className="text-btn"
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
