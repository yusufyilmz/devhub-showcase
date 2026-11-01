"use client";
import { useEffect, useState } from "react";

import { ArrowDown, ArrowUp, Trash2, X } from "lucide-react";

import { createTask, defaultDetails, type Task, type TaskKind } from "@/lib/domain/task";
import type { Workspace } from "@/lib/domain/workspace";
import { TaskService } from "@/lib/services/task-service";

import { IngredientEditor } from "./ingredient-editor";
export interface TaskEditorTarget {
  parent?: Task;
  task?: Task;
}
interface Props {
  busy: boolean;
  onClose: () => void;
  onError: (message: string) => void;
  onSave: (workspace: Workspace, label: string) => Promise<boolean>;
  target: TaskEditorTarget;
  workspace: Workspace;
}
const kinds: TaskKind[] = [
  "category",
  "diet",
  "gym",
  "workout",
  "superset",
  "exercise",
  "set",
  "meal",
  "supplement",
  "water",
];
const nextKind = (parent?: Task): TaskKind =>
  parent?.kind === "gym"
    ? "workout"
    : parent?.kind === "diet"
      ? "meal"
      : parent?.kind === "exercise"
        ? "set"
        : parent?.kind === "workout" || parent?.kind === "superset"
          ? "exercise"
          : "meal";
const tasks = new TaskService();
export function TaskEditor({ workspace, target, busy, onClose, onSave, onError }: Props) {
  const [draft, setDraft] = useState<Task>(
    () =>
      target.task ??
      createTask({
        date: target.parent?.date ?? null,
        details: defaultDetails(nextKind(target.parent)),
        id: crypto.randomUUID(),
        kind: nextKind(target.parent),
        parentId: target.parent?.id ?? null,
        position: tasks.children(workspace.tasks, target.parent?.id ?? null).length,
        scope: target.parent?.scope ?? "template",
        title: "",
      }),
  );
  const [ingredients, setIngredients] = useState(
    workspace.ingredients.filter((i) => i.mealTaskId === draft.id),
  );
  const schedule = workspace.schedules.find((s) => s.taskId === draft.id);
  const [days, setDays] = useState(schedule?.weekdays ?? []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      let next = structuredClone(workspace);
      next.ingredients = next.ingredients.filter((i) => i.mealTaskId !== draft.id);
      next.schedules = next.schedules.filter((s) => s.taskId !== draft.id);
      next = tasks.save(next, draft);
      if (draft.kind === "meal") next.ingredients.push(...ingredients);
      if (
        draft.scope === "template" &&
        days.length &&
        ["workout", "supplement", "water"].includes(draft.kind)
      )
        next.schedules.push({
          id: `schedule:${draft.id}`,
          taskId: draft.id,
          time: draft.time ?? "08:00",
          weekdays: days,
        });
      if (await onSave(next, "Task saved")) onClose();
    } catch (e) {
      onError((e as Error).message);
    }
  }
  return (
    <div className="overlay">
      <button
        aria-label="Close task editor"
        className="sheet-backdrop"
        onClick={onClose}
        type="button"
      />
      <section
        aria-label="Task editor"
        aria-modal="true"
        className="sheet wide-sheet"
        role="dialog"
      >
        <div className="section-heading">
          <h2>{target.task ? "Edit task" : "Add subtask"}</h2>
          <button aria-label="Close editor" className="icon-btn" onClick={onClose} type="button">
            <X />
          </button>
        </div>
        <form onSubmit={submit}>
          <label>
            Title
            <input
              maxLength={200}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              required
              value={draft.title}
            />
          </label>
          <div className="form-grid">
            <label>
              Type
              <select
                disabled={!!target.task}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    details: defaultDetails(e.target.value as TaskKind),
                    kind: e.target.value as TaskKind,
                  })
                }
                value={draft.kind}
              >
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Time
              <input
                onChange={(e) => setDraft({ ...draft, time: e.target.value || null })}
                type="time"
                value={draft.time ?? ""}
              />
            </label>
          </div>
          <label>
            Instructions / rest / drop-set notes
            <textarea
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={3}
              value={draft.notes}
            />
          </label>
          {draft.details.type === "meal" && (
            <label>
              Water with meal (ml)
              <input
                max="10000"
                min="0"
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    details: { type: "meal", waterMl: Number(e.target.value) },
                  })
                }
                type="number"
                value={draft.details.waterMl}
              />
            </label>
          )}
          {draft.details.type === "water" && (
            <label>
              Water (ml)
              <input
                max="10000"
                min="0"
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    details: { ml: Number(e.target.value), type: "water" },
                  })
                }
                type="number"
                value={draft.details.ml}
              />
            </label>
          )}
          {draft.details.type === "set" && (
            <label>
              Target reps
              <input
                max="200"
                min="1"
                onChange={(e) => {
                  if (draft.details.type === "set")
                    setDraft({
                      ...draft,
                      details: {
                        ...draft.details,
                        targetReps: Number(e.target.value),
                      },
                    });
                }}
                type="number"
                value={draft.details.targetReps}
              />
            </label>
          )}
          {draft.details.type === "dose" && (
            <div className="form-grid">
              <label>
                Amount
                <input
                  min="0"
                  onChange={(e) => {
                    if (draft.details.type === "dose")
                      setDraft({
                        ...draft,
                        details: {
                          ...draft.details,
                          amount: Number(e.target.value),
                        },
                      });
                  }}
                  step="any"
                  type="number"
                  value={draft.details.amount}
                />
              </label>
              <label>
                Unit
                <input
                  onChange={(e) => {
                    if (draft.details.type === "dose")
                      setDraft({
                        ...draft,
                        details: { ...draft.details, unit: e.target.value },
                      });
                  }}
                  value={draft.details.unit}
                />
              </label>
            </div>
          )}
          {draft.scope === "template" &&
            ["workout", "supplement", "water"].includes(draft.kind) && (
              <>
                <p className="hint">Repeat on weekdays</p>
                <div className="days-picker">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, i) => (
                    <label key={label}>
                      <input
                        checked={days.includes(i)}
                        onChange={(e) =>
                          setDays(e.target.checked ? [...days, i] : days.filter((d) => d !== i))
                        }
                        type="checkbox"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </>
            )}
          {draft.kind === "meal" && (
            <IngredientEditor items={ingredients} mealTaskId={draft.id} onChange={setIngredients} />
          )}
          <p className="hint">
            {draft.scope === "template"
              ? "Template changes affect future days that have not been saved. Weekly lists will be marked for refresh."
              : "This edits only this scheduled task. Its template stays unchanged."}
          </p>
          <button className="primary full" disabled={busy} type="submit">
            Save task
          </button>
        </form>
        {target.task && (
          <div className="sheet-actions">
            <div className="row">
              <button
                className="text-btn"
                disabled={busy}
                onClick={async () => {
                  if (await onSave(tasks.reorder(workspace, draft.id, -1), "Task moved")) onClose();
                }}
                type="button"
              >
                <ArrowUp size={15} />
                Move up
              </button>
              <button
                className="text-btn"
                disabled={busy}
                onClick={async () => {
                  if (await onSave(tasks.reorder(workspace, draft.id, 1), "Task moved")) onClose();
                }}
                type="button"
              >
                <ArrowDown size={15} />
                Move down
              </button>
            </div>
            <button
              className="text-btn danger"
              disabled={busy}
              onClick={async () => {
                if (
                  !confirm("Archive this task and its subtasks? Saved instances remain unchanged.")
                )
                  return;
                try {
                  if (await onSave(tasks.archive(workspace, draft.id), "Task archived")) onClose();
                } catch (e) {
                  onError((e as Error).message);
                }
              }}
              type="button"
            >
              <Trash2 size={15} />
              Archive
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
