"use client";
import { useRef, useState } from "react";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import type { TaskEditProposal } from "@shared/assistant/fitness-contract";
import type { TaskEditorTarget } from "@shared/assistant/fitness-ui";
import { TaskService } from "@shared/lib/fitness";
import type { Workspace } from "@shared/lib/types";
import { createTask, defaultDetails, type Task, type TaskKind } from "@shared/lib/types";
import { Alert, AlertDescription } from "@shared/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@shared/ui/alert-dialog";
import { Button as LibraryButton } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { NativeSelect as LibraryNativeSelect } from "@shared/ui/native-select";
import { Textarea as LibraryTextarea } from "@shared/ui/textarea";

export type { TaskEditorTarget } from "@shared/assistant/fitness-ui";

import { IngredientEditor } from "./ingredient-editor";

interface Props {
  busy: boolean;
  error: string;
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
function initializeEdit(task: Task, edit?: TaskEditProposal, time?: string): Task {
  const details =
    task.details.type === "set" && edit?.targetReps != null
      ? { ...task.details, targetReps: edit.targetReps }
      : task.details;
  return {
    ...task,
    details,
    notes: edit?.notes ?? task.notes,
    time: time ?? task.time,
    title: edit?.title ?? task.title,
  };
}

export function TaskEditor({ workspace, target, busy, error, onClose, onSave, onError }: Props) {
  const [draft, setDraft] = useState<Task>(() =>
    target.task
      ? initializeEdit(target.task, target.editDraft, target.scheduleDraft?.time)
      : createTask({
          date: target.parent?.date ?? null,
          details: defaultDetails(nextKind(target.parent)),
          id: crypto.randomUUID(),
          kind: nextKind(target.parent),
          notes: target.suggestion?.notes ?? "",
          parentId: target.parent?.id ?? null,
          position: tasks.children(workspace.tasks, target.parent?.id ?? null).length,
          scope: target.parent?.scope ?? "template",
          title: target.suggestion?.title ?? "",
        }),
  );
  const [ingredients, setIngredients] = useState(
    workspace.ingredients.filter((i) => i.mealTaskId === draft.id),
  );
  const schedule = workspace.schedules.find((s) => s.taskId === draft.id);
  const [days, setDays] = useState(target.scheduleDraft?.weekdays ?? schedule?.weekdays ?? []);
  const previousFocus = useRef<HTMLElement | null>(null);
  const heading = target.task ? "Edit task" : target.parent ? "Add subtask" : "New task";
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
    <Dialog
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
      open
    >
      <DialogContent
        className="fitness-dialog fitness-task-editor"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          previousFocus.current?.focus();
        }}
        onOpenAutoFocus={() => {
          previousFocus.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
      >
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>
            Set the details for this task and save it to your routine.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={submit}>
          <LibraryLabel unstyled>
            Title
            <LibraryInput
              maxLength={200}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              required
              unstyled
              value={draft.title}
            />
          </LibraryLabel>
          <div className="form-grid">
            <LibraryLabel unstyled>
              Type
              <LibraryNativeSelect
                disabled={!!target.task}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    details: defaultDetails(e.target.value as TaskKind),
                    kind: e.target.value as TaskKind,
                  })
                }
                unstyled
                value={draft.kind}
              >
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </LibraryNativeSelect>
            </LibraryLabel>
            <LibraryLabel unstyled>
              Time
              <LibraryInput
                onChange={(e) => setDraft({ ...draft, time: e.target.value || null })}
                type="time"
                unstyled
                value={draft.time ?? ""}
              />
            </LibraryLabel>
          </div>
          <LibraryLabel unstyled>
            Instructions / rest / drop-set notes
            <LibraryTextarea
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={3}
              unstyled
              value={draft.notes}
            />
          </LibraryLabel>
          {draft.details.type === "meal" && (
            <LibraryLabel unstyled>
              Water with meal (ml)
              <LibraryInput
                max="10000"
                min="0"
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    details: { type: "meal", waterMl: Number(e.target.value) },
                  })
                }
                type="number"
                unstyled
                value={draft.details.waterMl}
              />
            </LibraryLabel>
          )}
          {draft.details.type === "water" && (
            <LibraryLabel unstyled>
              Water (ml)
              <LibraryInput
                max="10000"
                min="0"
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    details: { ml: Number(e.target.value), type: "water" },
                  })
                }
                type="number"
                unstyled
                value={draft.details.ml}
              />
            </LibraryLabel>
          )}
          {draft.details.type === "set" && (
            <LibraryLabel unstyled>
              Target reps
              <LibraryInput
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
                unstyled
                value={draft.details.targetReps}
              />
            </LibraryLabel>
          )}
          {draft.details.type === "dose" && (
            <div className="form-grid">
              <LibraryLabel unstyled>
                Amount
                <LibraryInput
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
                  unstyled
                  value={draft.details.amount}
                />
              </LibraryLabel>
              <LibraryLabel unstyled>
                Unit
                <LibraryInput
                  onChange={(e) => {
                    if (draft.details.type === "dose")
                      setDraft({
                        ...draft,
                        details: { ...draft.details, unit: e.target.value },
                      });
                  }}
                  unstyled
                  value={draft.details.unit}
                />
              </LibraryLabel>
            </div>
          )}
          {draft.scope === "template" &&
            ["workout", "supplement", "water"].includes(draft.kind) && (
              <>
                <p className="hint">Repeat on weekdays</p>
                <div className="days-picker">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, i) => (
                    <LibraryLabel key={label} unstyled>
                      <LibraryInput
                        checked={days.includes(i)}
                        onChange={(e) =>
                          setDays(e.target.checked ? [...days, i] : days.filter((d) => d !== i))
                        }
                        type="checkbox"
                        unstyled
                      />
                      {label}
                    </LibraryLabel>
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
          <LibraryButton className="fitness-primary" disabled={busy} size="lg" type="submit">
            Save task
          </LibraryButton>
        </form>
        {target.task && (
          <div className="sheet-actions">
            <div className="row">
              <LibraryButton
                disabled={busy}
                onClick={async () => {
                  if (await onSave(tasks.reorder(workspace, draft.id, -1), "Task moved")) onClose();
                }}
                type="button"
                variant="outline"
              >
                <ArrowUp size={15} />
                Move up
              </LibraryButton>
              <LibraryButton
                disabled={busy}
                onClick={async () => {
                  if (await onSave(tasks.reorder(workspace, draft.id, 1), "Task moved")) onClose();
                }}
                type="button"
                variant="outline"
              >
                <ArrowDown size={15} />
                Move down
              </LibraryButton>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <LibraryButton disabled={busy} type="button" variant="destructive">
                  <Trash2 aria-hidden="true" size={15} />
                  Archive
                </LibraryButton>
              </AlertDialogTrigger>
              <AlertDialogContent className="fitness-dialog fitness-confirmation">
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive this task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This also archives its subtasks. Saved instances remain unchanged.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="fitness-primary"
                    onClick={async () => {
                      try {
                        if (await onSave(tasks.archive(workspace, draft.id), "Task archived"))
                          onClose();
                      } catch (e) {
                        onError((e as Error).message);
                      }
                    }}
                  >
                    Archive task
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
