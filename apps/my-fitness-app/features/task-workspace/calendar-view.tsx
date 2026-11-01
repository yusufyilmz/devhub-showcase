"use client";
import { ScheduleService } from "@shared/services/schedule";
import type { Workspace } from "@shared/services/types";
import { dateLabel } from "@shared/services/types";

import { CalendarGrid, type CalendarGridProps } from "@/features/calendar/calendar-grid";

const schedule = new ScheduleService();
interface Props {
  busy: boolean;
  date: string;
  onMove: CalendarGridProps["onMove"];
  onOpen: CalendarGridProps["onOpen"];
  onStatus: CalendarGridProps["onStatus"];
  openDay: (date: string) => void;
  readOnly: boolean;
  setDate: (date: string) => void;
  update: (fn: (s: Workspace) => Workspace, label?: string) => void;
  workspace: Workspace;
}
export function CalendarView({
  workspace,
  date,
  setDate,
  readOnly,
  busy,
  update,
  openDay,
  onOpen,
  onStatus,
  onMove,
}: Props) {
  const override = workspace.overrides.find((o) => o.date === date);
  const selectedDiet = schedule.dietFor(workspace, date);
  const selectedWorkout =
    override?.workoutTaskId ??
    workspace.schedules.find(
      (s) =>
        s.weekdays.includes(new Date(`${date}T12:00Z`).getUTCDay()) &&
        workspace.tasks.find((t) => t.id === s.taskId)?.kind === "workout",
    )?.taskId ??
    "";
  return (
    <>
      <CalendarGrid
        {...{
          busy,
          date,
          onMove,
          onOpen,
          onStatus,
          openDay,
          readOnly,
          setDate,
          workspace,
        }}
      />
      <section className="card">
        <div className="section-heading">
          <h2>{dateLabel(date)}</h2>
          <button className="outline" onClick={() => openDay(date)} type="button">
            Open day
          </button>
        </div>
        <form
          key={date + selectedDiet + selectedWorkout}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            update(
              (s) =>
                schedule.changeDay(
                  s,
                  date,
                  String(f.get("diet")),
                  String(f.get("workout")) || null,
                ),
              "Day plan updated",
            );
          }}
        >
          <div className="form-grid">
            <label>
              Diet task
              <select defaultValue={selectedDiet} disabled={readOnly || busy} name="diet">
                {workspace.tasks
                  .filter((t) => t.scope === "template" && t.kind === "diet" && !t.archived)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Gym subtask
              <select
                defaultValue={override ? (override.workoutTaskId ?? "") : selectedWorkout}
                disabled={readOnly || busy}
                name="workout"
              >
                <option value="">Rest day</option>
                {workspace.tasks
                  .filter((t) => t.scope === "template" && t.kind === "workout" && !t.archived)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          <button className="primary" disabled={readOnly || busy} type="submit">
            Save this day
          </button>
          <p className="hint">
            This override does not restart the rotation. Days with existing logs cannot be replaced.
          </p>
        </form>
      </section>
    </>
  );
}
