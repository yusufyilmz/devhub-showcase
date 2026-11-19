"use client";

import type { ReactNode } from "react";

import { ArrowLeft } from "lucide-react";

import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";

import { ScheduleFields } from "./task-form";

export interface AgendaDetailsProps {
  backHref: string;
  children: ReactNode;
  date: string;
  disabled?: boolean;
  formKey?: string;
  generatedMessage?: string;
  onBack: () => void;
  onReschedule?: (date: string, time: string | null) => void;
  rescheduleDate?: string;
  rescheduleTime?: string;
  timeLabel: string;
}

export function AgendaDetails({
  backHref,
  children,
  date,
  disabled,
  formKey,
  generatedMessage,
  onBack,
  onReschedule,
  rescheduleDate,
  rescheduleTime,
  timeLabel,
}: AgendaDetailsProps) {
  return (
    <section aria-label="Activity details">
      <div className="section-heading [position:sticky] [top:118px] [align-self:start] [&_.eyebrow]:[margin-bottom:12px] [&_h2]:[margin-bottom:16px] [font-size:30px] [font-weight:600] [line-height:1.25] [letter-spacing:-0.04em] [&_>_p:last-child]:[font-size:13px] [line-height:1.7] [color:var(--muted-foreground)] max-[767px]:[position:static] max-[767px]:[&_h2]:[margin-bottom:8px] [font-size:26px] [display:flex] [gap:14px] [align-items:center] [justify-content:space-between] [margin-bottom:20px] [&_h2]:[display:flex] [gap:8px] max-[700px]:[margin-bottom:16px] max-[700px]:[&_h2]:[font-size:17px]">
        <a
          className="text-btn [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:32px] [padding:4px_0] [font-size:12px] [font-weight:550] [color:var(--ink)] [background:transparent] [border:0] max-[700px]:[font-size:11px] [color:var(--accent)]"
          href={backHref}
          onClick={(event) => {
            event.preventDefault();
            onBack();
          }}
        >
          <ArrowLeft size={16} />
          Back to day agenda
        </a>
        <span className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)]">
          {date} · {timeLabel}
        </span>
      </div>
      {children}
      {onReschedule && (
        <Card asChild className="mt-5 grid gap-4 p-4 sm:p-5" interaction="static" layout="plain">
          <form
            key={formKey}
            onSubmit={(event) => {
              event.preventDefault();
              const fields = new FormData(event.currentTarget);
              onReschedule(String(fields.get("date")), String(fields.get("time")) || null);
            }}
          >
            <div className="grid gap-1">
              <h2 className="text-base font-semibold">Reschedule this occurrence</h2>
              <p className="text-sm text-muted-foreground">
                Only this activity moves. The recurring plan stays the same. Reopen completed or
                skipped items before moving them.
              </p>
            </div>
            <ScheduleFields
              date={rescheduleDate ?? date}
              disabled={disabled}
              time={rescheduleTime}
            />
            <Button className="justify-self-start" disabled={disabled} type="submit">
              Save date and time
            </Button>
          </form>
        </Card>
      )}
      {generatedMessage && (
        <p className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)] space-top [margin-top:30px]">
          {generatedMessage}
        </p>
      )}
    </section>
  );
}
