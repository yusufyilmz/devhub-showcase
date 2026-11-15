"use client";

import "./agent-companion.css";

import { type CSSProperties, type RefObject, useMemo, useRef, useState } from "react";

import { cn } from "cn";
import { ArrowLeftRight, MoveDiagonal, X } from "lucide-react";

import { Button } from "@shared/ui/button";

import { ChatBubble } from "../chat-bubble/index";
import { AgentAvatar } from "./AgentAvatar";
import { FeatureAction, FeatureGuide } from "./FeatureGuide";
import type { AgentCompanionProps, AgentFeature, AgentGuide, AgentNotice } from "./types";
import { useCompanionDock } from "./use-companion-dock";
import { useFeatureProgress } from "./use-feature-progress";
import { useFeatureTips } from "./use-feature-tips";

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

function CompanionResize({ dock }: { dock: ReturnType<typeof useCompanionDock> }) {
  return (
    <Button
      aria-label="Resize companion"
      className="agent-resize-toggle"
      onClick={(event) => {
        if (!dock.suppressDragClick(event)) dock.resizeBy(16);
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        event.preventDefault();
        dock.resizeBy(event.key === "ArrowUp" ? 16 : -16);
      }}
      onLostPointerCapture={dock.cancel}
      onPointerCancel={dock.cancel}
      onPointerDown={(event) => dock.start(event, true)}
      onPointerMove={dock.move}
      onPointerUp={dock.finish}
      title="Drag up to enlarge or down to shrink. Use Up and Down arrow keys to resize."
      type="button"
      variant="unstyled"
    >
      <MoveDiagonal aria-hidden="true" size={15} />
    </Button>
  );
}

function floatingPosition(floating: boolean, dock: ReturnType<typeof useCompanionDock>) {
  if (!floating) return {};
  const { size, x, y } = dock.current;
  return {
    "data-side": dock.side,
    "data-upper": y < 0.45 ? "" : undefined,
    style: {
      "--agent-custom-size": size && `${size}px`,
      "--agent-x": x,
      "--agent-y": y,
    } as CSSProperties,
  };
}

export function AgentCompanion({
  agent,
  activity = "idle",
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
      data-activity={activity}
      data-agent={agent}
      data-dragging={dock.moving || undefined}
      data-placement={placement}
      {...floatingPosition(floating, dock)}
      ref={dock.container}
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
      {placement === "composer" ? (
        <span aria-label={`${label}: ${activity}`} className="agent-launcher" role="img">
          <AgentAvatar activity={activity} agent={agent} />
        </span>
      ) : (
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
          onPointerDown={(event) => dock.start(event)}
          onPointerMove={dock.move}
          onPointerUp={dock.finish}
          type={href ? undefined : "button"}
          variant="unstyled"
        >
          <AgentAvatar activity={activity} agent={agent} />
          {currentBubble && <span aria-hidden="true" className="agent-notice-dot" />}
          {!currentBubble && (
            <span aria-hidden="true" className="agent-launcher-label">
              {label}
            </span>
          )}
        </Button>
      )}
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
        {floating && <CompanionResize dock={dock} />}
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
