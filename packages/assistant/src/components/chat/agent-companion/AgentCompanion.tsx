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
      className="agent-notice [&_a:focus-visible]:[outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]:2px_solid_var(--agent-accent)] [outline-offset:3px] [&_button:focus-visible]:[outline after:[position:absolute] [inset-block-end:-0.32rem] [inset-inline-end:1.75rem] [width:0.6rem] [height:0.6rem] [pointer-events:none] [content:''] [background:inherit] [border:solid_var(--border)] [border-width:0_1px_1px_0] [rotate:45deg] [&_strong]:[font-size:0.8125rem] [font-weight:650] [&_a]:[font-size:0.8125rem] [&_p]:[margin:0.25rem_0_0] [font-size:0.75rem] [line-height:1.45] [color:var(--muted-foreground)] [&_a]:[width:fit-content] [color:inherit] [text-decoration:underline] [text-underline-offset:0.15rem] [&_.agent-notice-dismiss]:[position:absolute] [inset-block-start:0.25rem] [inset-inline-end:0.25rem] [display:grid] [place-items:center] [width:1.75rem] [height:1.75rem] [min-height:0] [padding:0] [cursor:pointer] [background:transparent] [border:0] [border-radius:0.375rem] [&_.agent-notice-dismiss:hover]:[background:var(--secondary)]"
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
        {tip && (
          <span className="agent-tip-kicker [display:block] [font-size:0.7rem] [font-weight:600] [color:var(--muted-foreground)]">
            Feature tip
          </span>
        )}
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
      className={cn(
        "agent-companion [&[data-placement='floating']]:[--agent-size:min(_var(--agent-custom-size,_var(--agent-launcher-size,_8.375rem)),_max(48px,_calc(100dvh_-_100px))_)] [&[data-placement='floating']_.agent-launcher]:[width:var(--agent-size)] [&[data-dragging]_.agent-launcher]:[cursor:grabbing] [&[data-dragging]_.agent-launcher-label]:[visibility:hidden] [&[data-dragging]_.agent-notice]:[visibility:hidden] [&[data-placement='floating']_.agent-notice]:[--agent-notice-width:min(17.5rem,_calc(100vw_-_32px))] [&[data-upper]_.agent-notice]:[inset-block-start:calc(100%_+_0.5rem)] [&[data-upper]_.agent-launcher-label]:[inset-block-start:calc(100%_+_0.5rem)] [&[data-placement='floating']_.agent-notice::after]:[display:none] [&[data-side='left']_.agent-launcher-label]:[inset-inline:0_auto] motion-safe:[&[data-side='left']_.agent-notice]:[transform-origin:bottom_left] [&[data-placement='composer']]:[--agent-launcher-size:3.75rem] [&[data-placement='composer']_.agent-launcher]:[cursor:default] [&[data-activity='listening']_.agent-avatar]:[rotate:-8deg] [&[data-activity='thinking']_.agent-arm]:[transform:translate(-10px,_-13px)_rotate(-20deg)] [&[data-activity='error']_.agent-avatar]:[rotate:6deg] motion-safe:[&:not([data-activity='idle'])_.agent-avatar]:[animation:none] motion-safe:[&:not([data-activity='idle'])_.agent-arm]:[animation:none] motion-safe:[&[data-activity='listening']_.agent-avatar]:[animation:agent-attentive_2.4s_ease-in-out_infinite] motion-safe:[&[data-activity='thinking']_.agent-avatar]:[animation:agent-ponder_2.8s_ease-in-out_infinite] motion-safe:[&[data-activity='thinking']_.agent-thoughts]:[animation:agent-thought_1.5s_ease-in-out_infinite] motion-safe:[&[data-activity='writing']_.agent-avatar]:[animation:agent-attentive_1s_ease-in-out_infinite] motion-safe:[&[data-activity='writing']_.agent-pencil]:[transform-origin:59px_60px] motion-safe:[&[data-activity='writing']_.agent-arm]:[transform-origin:59px_60px] motion-safe:[&[data-activity='happy']_.agent-avatar]:[animation:agent-cheer_650ms_ease-out_2] motion-safe:[&[data-activity='happy']_.agent-arm]:[animation:agent-wave_1.8s_ease-in-out_2] motion-safe:[&[data-activity='error']_.agent-avatar]:[animation:agent-concern_450ms_ease-in-out]",
        className,
      )}
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
        <span
          aria-label={`${label}: ${activity}`}
          className="agent-launcher hover:[&_.agent-launcher-label]:[visibility:visible] focus-visible:[&_.agent-launcher-label]:[visibility:visible]"
          role="img"
        >
          <AgentAvatar activity={activity} agent={agent} />
        </span>
      ) : (
        <Button
          aria-label={label}
          className="agent-launcher hover:[&_.agent-launcher-label]:[visibility:visible] focus-visible:[&_.agent-launcher-label]:[visibility:visible]"
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
          {currentBubble && (
            <span
              aria-hidden="true"
              className="agent-notice-dot [position:absolute] [inset-block-start:0.4rem] [inset-inline-end:0.4rem] [width:0.625rem] [height:0.625rem] [background:var(--agent-accent)] [border:2px_solid_var(--card)] [border-radius:50%]"
            />
          )}
          {!currentBubble && (
            <span
              aria-hidden="true"
              className="agent-launcher-label [position:absolute] [inset-block-end:calc(100%_+_0.35rem)] [inset-inline-end:0] [visibility:hidden] [padding:0.25rem_0.5rem] [font-size:0.6875rem] [white-space:nowrap] [pointer-events:none] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:0.375rem]"
            >
              {label}
            </span>
          )}
        </Button>
      )}
      <div className="agent-companion-controls [&:empty [padding:40px] [font-size:12px] [color:var(--muted)] [text-align:center]]:[display:none] [display:flex] [gap:2px] [justify-self:center]">
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
