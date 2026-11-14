"use client";
import { useState } from "react";

import { Plus, X } from "lucide-react";

import { TaskService } from "@shared/lib/fitness";
import type { Workspace } from "@shared/lib/types";
import { Button as LibraryButton } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { NativeSelect as LibraryNativeSelect } from "@shared/ui/native-select";

import { FitnessNotificationSettings } from "@/features/notifications/settings";
import { signOut } from "@/lib/browser-session";

import { disableFitnessDevice } from "../notifications/browser";

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
    <div className="settings-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:20px] [&_>_.card]:[margin:0] [&_.task]:[gap:10px] [padding:16px_0] [&_.task-icon]:[width:35px] [height:35px] [border-radius:8px] [&_h2]:[margin-bottom:12px] [&_p]:[margin:14px_0] [font-size:12px] [&_.section-heading]:[margin:0] [&_dl]:[display:grid] [grid-template-columns:1fr_1fr] [gap:18px] [margin:20px_0] [&_dt]:[font-size:12px] [color:var(--muted)] [&_dd]:[margin:0] [text-align:right] [overflow-wrap:anywhere] max-[950px]:[grid-template-columns:1fr]">
      <Card
        asChild
        className="fitness-settings-card [padding:clamp(16px,_3vw,_28px)] [&_h2]:[margin-bottom:12px] [&_>_p]:[margin-bottom:14px]"
        interaction="static"
        layout="plain"
      >
        <section>
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
            <LibraryLabel unstyled>
              Name
              <LibraryInput
                defaultValue={workspace.settings.name}
                disabled={disabled}
                name="name"
                required
                unstyled
              />
            </LibraryLabel>
            <LibraryLabel unstyled>
              Timezone
              <LibraryInput
                defaultValue={workspace.settings.timezone}
                disabled={disabled}
                name="timezone"
                required
                unstyled
              />
            </LibraryLabel>
            <LibraryLabel unstyled>
              Diet rotation starts
              <LibraryInput
                defaultValue={workspace.settings.rotationStart}
                disabled={disabled}
                name="start"
                required
                type="date"
                unstyled
              />
            </LibraryLabel>
            <p className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)]">
              Rotation sequence
            </p>
            {rotation.map((id, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: These are editable rotation slots; the same diet can appear in multiple positions.
              <div
                className="row [display:flex] [gap:10px] [align-items:center] rotation-step [margin-bottom:10px] [&_select]:[margin:0]"
                key={index}
              >
                <span>{index + 1}</span>
                <LibraryNativeSelect
                  aria-label={`Rotation step ${index + 1}`}
                  disabled={disabled}
                  onChange={(e) =>
                    setRotation(rotation.map((value, i) => (i === index ? e.target.value : value)))
                  }
                  unstyled
                  value={id}
                >
                  {diets.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </LibraryNativeSelect>
                <LibraryButton
                  aria-label={`Remove rotation step ${index + 1}`}
                  className="icon-btn [display:inline-flex] [align-items:center] [justify-content:center] [min-width:34px] [min-height:34px] [padding:8px] [color:var(--muted)] [background:transparent] [border:0] [border-radius:6px] hover:[background:var(--surface-soft)] hover:[color:var(--accent)] [background:var(--surface-soft)]"
                  disabled={disabled || rotation.length === 1}
                  onClick={() => setRotation(rotation.filter((_, i) => i !== index))}
                  type="button"
                  variant="unstyled"
                >
                  <X size={16} />
                </LibraryButton>
              </div>
            ))}
            <LibraryButton
              className="text-btn [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:32px] [padding:4px_0] [font-size:12px] [font-weight:550] [color:var(--ink)] [background:transparent] [border:0] max-[700px]:[font-size:11px] [color:var(--accent)]"
              disabled={disabled || diets.length === 0}
              onClick={() => {
                const diet = diets[0];
                if (diet) setRotation([...rotation, diet.id]);
              }}
              type="button"
              variant="unstyled"
            >
              <Plus size={15} />
              Add rotation step
            </LibraryButton>
            <div className="form-grid [display:grid] [grid-template-columns:1fr_1fr] [gap:15px]">
              <LibraryLabel unstyled>
                Water target (ml)
                <LibraryInput
                  defaultValue={workspace.settings.waterTarget}
                  disabled={disabled}
                  max="20000"
                  min="250"
                  name="water"
                  required
                  type="number"
                  unstyled
                />
              </LibraryLabel>
              <LibraryLabel unstyled>
                Protein target (g)
                <LibraryInput
                  defaultValue={workspace.settings.proteinTarget}
                  disabled={disabled}
                  max="500"
                  min="1"
                  name="protein"
                  required
                  type="number"
                  unstyled
                />
              </LibraryLabel>
            </div>
            <LibraryLabel unstyled>
              Reminder lead (minutes)
              <LibraryInput
                defaultValue={workspace.settings.leadMinutes}
                disabled={disabled}
                max="120"
                min="0"
                name="lead"
                required
                type="number"
                unstyled
              />
            </LibraryLabel>
            <LibraryButton
              className="primary [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [color:var(--on-primary)] [background:var(--green)] [border:1px_solid_var(--green)] hover:[background:var(--accent)] [background:var(--accent)] [border-color:var(--accent)] [filter:brightness(1.1)] full [width:100%]"
              disabled={disabled}
              type="submit"
              variant="unstyled"
            >
              Save preferences
            </LibraryButton>
          </form>
        </section>
      </Card>
      <Card
        asChild
        className="fitness-settings-card [padding:clamp(16px,_3vw,_28px)] [&_h2]:[margin-bottom:12px] [&_>_p]:[margin-bottom:14px]"
        interaction="static"
        layout="plain"
      >
        <section>
          <h2>Reminders</h2>
          <p>
            Reminders for meal, supplement, water and workout tasks. Enable this device below for
            background delivery; open-app reminders also work while this page stays open.
          </p>
          <LibraryButton
            className="outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]"
            disabled={disabled}
            onClick={() => {
              update(
                (s) => ({
                  ...s,
                  settings: { ...s.settings, reminders: !s.settings.reminders },
                }),
                "Reminder preference saved",
              );
            }}
            type="button"
            variant="unstyled"
          >
            {workspace.settings.reminders ? "Disable" : "Enable"} reminders
          </LibraryButton>
          <FitnessNotificationSettings disabled={disabled} />
          <h2 className="space-top [margin-top:30px]">Weight history</h2>
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
            <LibraryLabel unstyled>
              Weight for {date} (kg)
              <LibraryInput
                disabled={disabled}
                max="400"
                min="20"
                name="weight"
                required
                step="0.1"
                type="number"
                unstyled
              />
            </LibraryLabel>
            <LibraryButton
              className="outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]"
              disabled={disabled}
              type="submit"
              variant="unstyled"
            >
              Log weight
            </LibraryButton>
          </form>
          {workspace.weights
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 8)
            .map((w) => (
              <div
                className="row [display:flex] [gap:10px] [align-items:center] weight-entry [padding:10px_0] [border-bottom:1px_solid_var(--line)] [&_strong]:[margin-left:auto]"
                key={w.date}
              >
                <span>{w.date}</span>
                <strong>{w.value} kg</strong>
                <LibraryButton
                  aria-label={`Remove weight ${w.date}`}
                  className="icon-btn [display:inline-flex] [align-items:center] [justify-content:center] [min-width:34px] [min-height:34px] [padding:8px] [color:var(--muted)] [background:transparent] [border:0] [border-radius:6px] hover:[background:var(--surface-soft)] hover:[color:var(--accent)] [background:var(--surface-soft)]"
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
                  variant="unstyled"
                >
                  <X size={14} />
                </LibraryButton>
              </div>
            ))}
        </section>
      </Card>
      <Card
        asChild
        className="fitness-settings-card [padding:clamp(16px,_3vw,_28px)] [&_h2]:[margin-bottom:12px] [&_>_p]:[margin-bottom:14px]"
        interaction="static"
        layout="plain"
      >
        <section>
          <h2>Your data</h2>
          <p>
            {readOnly
              ? "This demo uses fictional activities. Sign in to track your own routine."
              : "Only your account can open, update, or export this workspace."}
          </p>
          <LibraryButton
            className="outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]"
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
            variant="unstyled"
          >
            Export backup
          </LibraryButton>
          {!readOnly && (
            <LibraryButton
              className="text-btn [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:32px] [padding:4px_0] [font-size:12px] [font-weight:550] [color:var(--ink)] [background:transparent] [border:0] max-[700px]:[font-size:11px] [color:var(--accent)] space-top [margin-top:30px]"
              onClick={async () => {
                try {
                  await disableFitnessDevice().catch(() => undefined);
                  await signOut();
                  location.replace("/login");
                } catch (error) {
                  onError((error as Error).message);
                }
              }}
              type="button"
              variant="unstyled"
            >
              Sign out
            </LibraryButton>
          )}
        </section>
      </Card>
    </div>
  );
}
