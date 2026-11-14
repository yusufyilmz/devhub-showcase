"use client";

import "../studio-chat.css";

import { useId, useState } from "react";

import { ArrowUp, Square } from "lucide-react";

import { Button } from "@shared/ui/button";
import { Label as LibraryLabel } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";

import { AgentCompanion } from "../agent-companion/AgentCompanion";
import { chatComposerStyles } from "../styles";
import type { ChatComposerOptions } from "../types";

function composerActivity(
  busy: boolean,
  focused: boolean,
  activity: ChatComposerOptions["companion"],
) {
  if (busy) return activity?.activity === "writing" ? "writing" : "thinking";
  if (focused) return "listening";
  return activity?.activity ?? "idle";
}

export function ChatComposer({
  companion,
  controls,
  maxLength = 4000,
  value,
  onChange,
  onSubmit,
  busy = false,
  disabled = false,
  onStop,
  placeholder = "Ask Studio to help with your portfolio…",
}: ChatComposerOptions) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const activity = composerActivity(busy, focused, companion);
  return (
    <div className={companion ? "studio-chat-composer-row" : undefined}>
      {companion && (
        <AgentCompanion
          activity={activity}
          agent={companion.agent}
          label="Assistant"
          placement="composer"
        />
      )}
      <form
        className={chatComposerStyles.element1}
        data-busy={busy || undefined}
        data-has-controls={controls ? true : undefined}
        onSubmit={(event) => {
          event.preventDefault();
          if (!busy && !disabled && value.trim()) onSubmit();
        }}
      >
        <LibraryLabel className={chatComposerStyles.element2} htmlFor={id} unstyled>
          Your message
        </LibraryLabel>
        <Textarea
          disabled={busy}
          id={id}
          maxLength={maxLength}
          onBlur={() => setFocused(false)}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              if (!busy && !disabled && value.trim()) onSubmit();
            }
          }}
          placeholder={placeholder}
          rows={1}
          value={value}
        />
        {controls && (
          <div className="studio-chat-composer-controls [display:flex] [flex-wrap:wrap] [gap:var(--spacing-xs)] [align-items:center] [min-width:0]">
            {controls}
          </div>
        )}
        <Button
          aria-label={busy ? "Stop generating" : "Send message"}
          className={chatComposerStyles.element3}
          disabled={busy ? !onStop : disabled || !value.trim()}
          onClick={busy ? onStop : undefined}
          type={busy ? "button" : "submit"}
        >
          {busy ? (
            <Square aria-hidden="true" size={16} />
          ) : (
            <ArrowUp aria-hidden="true" size={20} />
          )}
        </Button>
      </form>
    </div>
  );
}
