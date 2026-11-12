"use client";

import "./portfolio-setup.css";

import { type ReactNode, useEffect, useRef, useState } from "react";

import type { PortfolioProfile, PortfolioType } from "@shared/config";
import { Dialog, DialogContent } from "@shared/ui/dialog";

import { SetupActions } from "./portfolio-setup/actions";
import { SetupHeader } from "./portfolio-setup/header";
import { SetupStageContent } from "./portfolio-setup/stage-content";
import type { SetupPosition } from "./portfolio-setup/steps";

export type { SetupPosition } from "./portfolio-setup/steps";

function basicsComplete(profile: PortfolioProfile) {
  return Boolean(
    profile.name.trim() &&
      profile.name.trim() !== "Your name" &&
      profile.title.trim() &&
      profile.title.trim() !== "Add your professional title",
  );
}

export function PortfolioSetup({
  position,
  onPosition,
  profile,
  onChange,
  profession,
  onProfession,
  preview,
  assistant,
  recovery,
  onCancel,
  onSave,
  busy,
  stale,
  error,
}: {
  position: SetupPosition;
  onPosition: (position: SetupPosition) => void;
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
  profession: PortfolioType;
  onProfession: (profession: PortfolioType) => void;
  preview: ReactNode;
  assistant?: ReactNode;
  recovery: ReactNode;
  onCancel?: () => void;
  onSave: () => void;
  busy: boolean;
  stale: boolean;
  error: string;
}) {
  const { stage, section } = position;
  const body = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const sectionHeading = useRef<HTMLHeadingElement>(null);
  const [cvApplied, setCvApplied] = useState(false);
  const ready = basicsComplete(profile);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset focus and scrolling on each stage or section change.
  useEffect(() => {
    body.current?.scrollTo?.({ top: 0 });
    (sectionHeading.current ?? heading.current)?.focus({ preventScroll: true });
  }, [stage, section]);

  function go(next: number, detail = 0) {
    onPosition({ section: detail, stage: next });
  }

  return (
    <Dialog open>
      <DialogContent
        className="setup-dialog portfolio-setup"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        showCloseButton={false}
      >
        <SetupHeader heading={heading} stage={stage} />
        <div className="portfolio-setup-body" ref={body}>
          {recovery}
          <SetupStageContent
            assistant={assistant}
            busy={busy}
            go={go}
            onApplyCv={(next) => {
              onChange(next);
              setCvApplied(true);
            }}
            onChange={onChange}
            onProfession={onProfession}
            position={position}
            preview={preview}
            profession={profession}
            profile={profile}
            sectionHeading={sectionHeading}
          />
        </div>
        <SetupActions
          busy={busy}
          cvApplied={cvApplied}
          error={error}
          go={go}
          onCancel={onCancel}
          onSave={onSave}
          position={position}
          ready={ready}
          stale={stale}
        />
      </DialogContent>
    </Dialog>
  );
}
