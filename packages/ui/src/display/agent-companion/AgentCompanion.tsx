"use client";

import "../../styles/components/display/agent-companion.css";

import { type CSSProperties, type RefObject, useMemo, useRef, useState } from "react";

import { cn } from "cn";
import { ArrowLeftRight, X } from "lucide-react";

import { Button } from "../../buttons/button";
import { ChatBubble } from "../chat-bubble";
import { FeatureAction, FeatureGuide } from "./FeatureGuide";
import type { AgentCompanionProps, AgentFeature, AgentGuide, AgentNotice } from "./types";
import { useCompanionDock } from "./use-companion-dock";
import { useFeatureProgress } from "./use-feature-progress";
import { useFeatureTips } from "./use-feature-tips";

function AgentAvatar({ agent }: Pick<AgentCompanionProps, "agent">) {
  return (
    <svg aria-hidden="true" className="agent-avatar" viewBox="0 0 88 88">
      {agent === "studio" && (
        <g className="agent-accent">
          <path d="M44 21V12" />
          <circle cx="44" cy="9" r="3" />
        </g>
      )}
      {agent === "portfolio" && (
        <path className="agent-accent" d="M13 34V23h11m40 0h11v11M13 51v11h11m40 0h11V51" />
      )}
      {agent === "fitness" && (
        <path className="agent-accent" d="M9 41h8m54 0h8M11 35v12m66-12v12" />
      )}
      <rect className="agent-body" height="22" rx="10" width="36" x="26" y="55" />
      <path className="agent-limbs" d="m29 60-7 7M36 74v5m16-5v5" />
      <rect className="agent-body" height="40" rx="17" width="54" x="17" y="20" />
      <rect className="agent-face" height="27" rx="11" width="42" x="23" y="27" />
      <g className="agent-eyes">
        <path d="M31 40q4 5 8 0m10 0q4 5 8 0" />
      </g>
      {agent === "studio" && <path className="agent-mark" d="m35 64 4 3-4 3m9 0h8" />}
      {agent === "portfolio" && <path className="agent-mark" d="M38 64h12m-12 5h8" />}
      {agent === "fitness" && <path className="agent-mark" d="M33 67h5l3-4 4 8 3-4h7" />}
      <path className="agent-limbs agent-arm" d="m59 60 7 7" />
    </svg>
  );
}

function NoticeBubble({
  notice,
  dismiss,
  tip,
  bubble,
}: {
  notice: AgentNotice | AgentFeature;
  dismiss: () => void;
  tip: boolean;
  bubble: RefObject<HTMLDivElement | null>;
}) {
  return (
    <ChatBubble
      className="agent-notice"
      enableHover={false}
      maxWidth="none"
      ref={bubble}
      size="sm"
      variant="received"
    >
      <div
        className="agent-notice-copy"
        role={
          !tip && ("announce" in notice ? notice.announce !== false : true) ? "status" : undefined
        }
      >
        {tip && <span className="agent-tip-kicker">Feature tip</span>}
        <strong>{notice.title}</strong>
        <p>{notice.message}</p>
      </div>
      {notice.action && (
        <FeatureAction action={notice.action} onSelect={tip ? dismiss : undefined} />
      )}
      <Button
        aria-label={tip ? "Dismiss feature tip" : "Dismiss notification"}
        className="agent-notice-dismiss"
        onClick={dismiss}
        type="button"
        variant="unstyled"
      >
        <X aria-hidden="true" size={16} />
      </Button>
    </ChatBubble>
  );
}

const noFeatures: readonly AgentFeature[] = [];

function useAgentGuide(guide: AgentGuide | undefined, blocked: boolean) {
  const [guideOpen, setGuideOpen] = useState(false);
  const bubble = useRef<HTMLDivElement>(null);
  const progress = useFeatureProgress(guide);
  const localFeatures = guide?.features ?? noFeatures;
  const features = useMemo(() => {
    if (!progress.features.length) return localFeatures;
    const local = new Map(localFeatures.map((feature) => [feature.id, feature]));
    return progress.features.map((feature) => ({
      ...local.get(feature.id),
      ...feature,
      action: local.get(feature.id)?.action,
    }));
  }, [localFeatures, progress.features]);
  const done =
    features.length > 0 && features.every((feature) => progress.completed.includes(feature.id));
  const suggestions = useMemo(
    () => [...(guide?.suggestions ?? []), ...(done ? (guide?.followUps ?? []) : [])],
    [done, guide?.followUps, guide?.suggestions],
  );
  const tips = useFeatureTips({
    blocked:
      blocked || guideOpen || Boolean(guide?.progressHref && !progress.loaded && !progress.error),
    bubble,
    completed: progress.completed,
    guide: guide && {
      ...guide,
      features,
      id: progress.scope ? `${guide.id}:${progress.scope}` : guide.id,
      suggestions,
    },
  });
  return { bubble, features, guideOpen, progress, setGuideOpen, tips };
}

export function AgentCompanion({
  agent,
  className,
  href,
  guide,
  label,
  notice,
  onOpen,
  placement = "floating",
}: AgentCompanionProps) {
  const [dismissedId, setDismissedId] = useState<string>();
  const floating = placement === "floating";
  const dock = useCompanionDock(agent, floating);
  const opposite = dock.side === "left" ? "right" : "left";
  const visibleNotice = notice && notice.id !== dismissedId ? notice : undefined;
  const { bubble, features, guideOpen, progress, setGuideOpen, tips } = useAgentGuide(
    guide,
    Boolean(visibleNotice),
  );
  const currentBubble = visibleNotice ?? tips.tip;

  return (
    <div
      className={cn("agent-companion", className)}
      data-agent={agent}
      data-dragging={dock.offset !== undefined || undefined}
      data-placement={placement}
      data-side={floating ? dock.side : undefined}
      style={
        dock.offset === undefined
          ? undefined
          : ({ "--agent-drag-x": `${dock.offset}px` } as CSSProperties)
      }
    >
      {currentBubble && (
        <NoticeBubble
          bubble={bubble}
          dismiss={visibleNotice ? () => setDismissedId(visibleNotice.id) : tips.dismiss}
          key={currentBubble.id}
          notice={currentBubble}
          tip={!visibleNotice}
        />
      )}
      <Button
        aria-label={label}
        className="agent-launcher"
        draggable={false}
        href={href}
        onClick={(event) => {
          if (!dock.suppressDragClick(event)) onOpen?.();
        }}
        onLostPointerCapture={dock.cancel}
        onPointerCancel={dock.cancel}
        onPointerDown={dock.start}
        onPointerMove={dock.move}
        onPointerUp={dock.finish}
        type={href ? undefined : "button"}
        variant="unstyled"
      >
        <AgentAvatar agent={agent} />
        {currentBubble && <span aria-hidden="true" className="agent-notice-dot" />}
        {!currentBubble && (
          <span aria-hidden="true" className="agent-launcher-label">
            {label}
          </span>
        )}
      </Button>
      <div className="agent-companion-controls">
        {floating && (
          <Button
            aria-label={`Move companion to the ${opposite}`}
            className="agent-dock-toggle"
            onClick={() => dock.dock(opposite)}
            title={`Move companion to the ${opposite}`}
            type="button"
            variant="unstyled"
          >
            <ArrowLeftRight aria-hidden="true" size={15} />
          </Button>
        )}
        {guide && (
          <FeatureGuide
            completed={progress.completed}
            enabled={tips.enabled}
            error={progress.error}
            features={features}
            guide={guide}
            loaded={progress.loaded}
            onComplete={progress.complete}
            open={guideOpen}
            retry={progress.retry}
            setEnabled={tips.setEnabled}
            setOpen={setGuideOpen}
          />
        )}
      </div>
    </div>
  );
}
