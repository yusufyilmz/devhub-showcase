"use client";

import { useState } from "react";

import type { WorkoutProposal } from "@shared/assistant/fitness-contract";
import type { Task } from "@shared/services/types";
import { Button } from "@shared/ui/button";

export function TrainingProposal({
  onSave,
  proposal,
  task,
}: {
  onSave: (task: Task, proposal: WorkoutProposal) => Promise<boolean>;
  proposal: WorkoutProposal;
  task: Task;
}) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const valid =
    proposal.exercises.length > 0 &&
    (task.kind !== "exercise" || proposal.exercises.length === 1) &&
    (task.kind !== "gym" || Boolean(proposal.workoutTitle));

  async function save() {
    setPending(true);
    setFailed(false);
    if (!(await onSave(task, proposal))) {
      setPending(false);
      setFailed(true);
    }
  }

  return (
    <section aria-label="Workout proposal" className="fitness-assistant-proposal">
      <p>{proposal.summary}</p>
      {task.kind === "gym" && proposal.workoutTitle && <h3>{proposal.workoutTitle}</h3>}
      <ul>
        {proposal.exercises.map((exercise, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Generated exercises form a single immutable preview.
          <li key={index}>
            <strong>{task.kind === "exercise" ? task.title : exercise.title}</strong>
            {task.kind !== "exercise" && exercise.notes && <p>{exercise.notes}</p>}
            <ol>
              {exercise.sets.map((set, setIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Generated sets are immutable within a preview.
                <li key={setIndex}>
                  {set.reps} target reps{set.notes && ` · ${set.notes}`}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
      {failed && (
        <p role="alert">The draft was not saved. Check the workspace status and try again.</p>
      )}
      {valid && (
        <Button disabled={pending} onClick={save} type="button" variant="outline">
          {pending ? "Saving…" : "Add proposed sets"}
        </Button>
      )}
    </section>
  );
}
