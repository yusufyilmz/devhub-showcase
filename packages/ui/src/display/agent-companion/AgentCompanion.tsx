"use client";

import "./agent-companion.css";

import { type CSSProperties, useState } from "react";

import { cn } from "cn";
import { ArrowLeftRight, X } from "lucide-react";

import { Button } from "../../buttons/button";
import { ChatBubble } from "../chat-bubble";
import type { AgentCompanionProps, AgentNotice } from "./types";
import { useCompanionDock } from "./use-companion-dock";

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

function NoticeBubble({ notice, dismiss }: { notice: AgentNotice; dismiss: () => void }) {
  return (
    <ChatBubble
      className="agent-notice"
      enableHover={false}
      maxWidth="none"
      size="sm"
      variant="received"
    >
      <div className="agent-notice-copy" role={notice.announce === false ? undefined : "status"}>
        <strong>{notice.title}</strong>
        <p>{notice.message}</p>
      </div>
      {notice.action && <a href={notice.action.href}>{notice.action.label}</a>}
      <Button
        aria-label="Dismiss notification"
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

export function AgentCompanion({
  agent,
  className,
  href,
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
      {visibleNotice && (
        <NoticeBubble
          dismiss={() => setDismissedId(visibleNotice.id)}
          key={visibleNotice.id}
          notice={visibleNotice}
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
        {visibleNotice && <span aria-hidden="true" className="agent-notice-dot" />}
        {!visibleNotice && (
          <span aria-hidden="true" className="agent-launcher-label">
            {label}
          </span>
        )}
      </Button>
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
    </div>
  );
}
