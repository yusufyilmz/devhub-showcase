"use client";
import { useState } from "react";

import { Plus, X } from "lucide-react";

import { TaskService } from "@shared/services/fitness/task";
import type { Workspace } from "@shared/services/types";

import { signOut } from "@/lib/browser-session";

interface Props {
  busy: boolean;
  date: string;
  onError: (message: string) => void;
  readOnly: boolean;
  update: (fn: (s: Workspace) => Workspace, label?: string) => void;
  workspace: Workspace;
}
export function SettingsView({ workspace, readOnly, busy, update, onError, date }: Props) {
  const [rotation, setRotation] = useState(workspace.settings.rotation);
  const diets = workspace.tasks.filter(
    (t) => t.scope === "template" && t.kind === "diet" && !t.archived,
  );
  const disabled = readOnly || busy;
  return (
    <div className="settings-grid">
      <section className="card">
        <h2>Your routine</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            update((s) => {
              const next = structuredClone(s);
              next.settings = {
                ...next.settings,
                leadMinutes: Number(f.get("lead")),
                name: String(f.get("name")),
                proteinTarget: Number(f.get("protein")),
                rotation,
                rotationStart: String(f.get("start")),
                timezone: String(f.get("timezone")),
                waterTarget: Number(f.get("water")),
              };
              new TaskService().markWeeklyPlansStale(next);
              return next;
            }, "Preferences saved");
          }}
        >
          <label>
            Name
            <input
              defaultValue={workspace.settings.name}
              disabled={disabled}
              name="name"
              required
            />
          </label>
          <label>
            Timezone
            <input
              defaultValue={workspace.settings.timezone}
              disabled={disabled}
              name="timezone"
              required
            />
          </label>
          <label>
            Diet rotation starts
            <input
              defaultValue={workspace.settings.rotationStart}
              disabled={disabled}
              name="start"
              required
              type="date"
            />
          </label>
          <p className="hint">Rotation sequence</p>
          {rotation.map((id, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: These are editable rotation slots; the same diet can appear in multiple positions.
            <div className="row rotation-step" key={index}>
              <span>{index + 1}</span>
              <select
                aria-label={`Rotation step ${index + 1}`}
                disabled={disabled}
                onChange={(e) =>
                  setRotation(rotation.map((value, i) => (i === index ? e.target.value : value)))
                }
                value={id}
              >
                {diets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
              <button
                aria-label={`Remove rotation step ${index + 1}`}
                className="icon-btn"
                disabled={disabled || rotation.length === 1}
                onClick={() => setRotation(rotation.filter((_, i) => i !== index))}
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            className="text-btn"
            disabled={disabled}
            onClick={() => {
              const diet = diets[0];
              if (diet) setRotation([...rotation, diet.id]);
            }}
            type="button"
          >
            <Plus size={15} />
            Add rotation step
          </button>
          <div className="form-grid">
            <label>
              Water target (ml)
              <input
                defaultValue={workspace.settings.waterTarget}
                disabled={disabled}
                max="20000"
                min="250"
                name="water"
                required
                type="number"
              />
            </label>
            <label>
              Protein target (g)
              <input
                defaultValue={workspace.settings.proteinTarget}
                disabled={disabled}
                max="500"
                min="1"
                name="protein"
                required
                type="number"
              />
            </label>
          </div>
          <label>
            Reminder lead (minutes)
            <input
              defaultValue={workspace.settings.leadMinutes}
              disabled={disabled}
              max="120"
              min="0"
              name="lead"
              required
              type="number"
            />
          </label>
          <button className="primary full" disabled={disabled} type="submit">
            Save preferences
          </button>
        </form>
      </section>
      <section className="card">
        <h2>Reminders</h2>
        <p>
          Open-app reminders for meal, supplement, water and workout tasks. They stop when the app
          is closed.
        </p>
        <button
          className="outline"
          disabled={disabled}
          onClick={async () => {
            if (!("Notification" in window)) {
              onError("This browser does not support notifications.");
              return;
            }
            if (
              !workspace.settings.reminders &&
              (await Notification.requestPermission()) !== "granted"
            ) {
              onError("Allow notifications in your browser settings.");
              return;
            }
            update(
              (s) => ({
                ...s,
                settings: { ...s.settings, reminders: !s.settings.reminders },
              }),
              "Reminder preference saved",
            );
          }}
          type="button"
        >
          {workspace.settings.reminders ? "Disable" : "Enable"} reminders
        </button>
        <h2 className="space-top">Weight history</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            update(
              (s) => ({
                ...s,
                weights: [
                  ...s.weights.filter((w) => w.date !== date),
                  { date, value: Number(f.get("weight")) },
                ],
              }),
              "Weight saved",
            );
          }}
        >
          <label>
            Weight for {date} (kg)
            <input
              disabled={disabled}
              max="400"
              min="20"
              name="weight"
              required
              step="0.1"
              type="number"
            />
          </label>
          <button className="outline" disabled={disabled} type="submit">
            Log weight
          </button>
        </form>
        {workspace.weights
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 8)
          .map((w) => (
            <div className="row weight-entry" key={w.date}>
              <span>{w.date}</span>
              <strong>{w.value} kg</strong>
              <button
                aria-label={`Remove weight ${w.date}`}
                className="icon-btn"
                disabled={disabled}
                onClick={() => {
                  if (confirm("Delete this weight entry?"))
                    update(
                      (s) => ({
                        ...s,
                        weights: s.weights.filter((x) => x.date !== w.date),
                      }),
                      "Weight removed",
                    );
                }}
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          ))}
      </section>
      <section className="card">
        <h2>Your data</h2>
        <p>
          {readOnly
            ? "You are viewing the owner’s live workspace. Sign in as the owner to edit."
            : "Task records and logs are saved in your Supabase project."}
        </p>
        <button
          className="outline"
          onClick={() => {
            const url = URL.createObjectURL(
              new Blob([JSON.stringify(workspace, null, 2)], {
                type: "application/json",
              }),
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = `fitness-tasks-${date}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          type="button"
        >
          Export backup
        </button>
        {!readOnly && (
          <button
            className="text-btn space-top"
            onClick={async () => {
              try {
                await signOut();
                location.href = "/";
              } catch (error) {
                onError((error as Error).message);
              }
            }}
            type="button"
          >
            Sign out
          </button>
        )}
      </section>
    </div>
  );
}
