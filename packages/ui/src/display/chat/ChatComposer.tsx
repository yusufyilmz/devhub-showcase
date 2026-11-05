"use client";

import "./studio-chat.css";

import { useId } from "react";

import { ArrowUp, Square } from "lucide-react";

import { Button } from "../../buttons/button";
import { Label as LibraryLabel } from "../../forms/label/Label";
import { Textarea } from "../../forms/textarea";
import { chatComposerStyles } from "./styles";
import type { ChatComposerOptions } from "./types";

export function ChatComposer({
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
  return (
    <form
      className={chatComposerStyles.element1}
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
        onChange={(event) => onChange(event.target.value)}
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
      {controls && <div className="studio-chat-composer-controls">{controls}</div>}
      <Button
        aria-label={busy ? "Stop generating" : "Send message"}
        className={chatComposerStyles.element3}
        disabled={busy ? !onStop : disabled || !value.trim()}
        onClick={busy ? onStop : undefined}
        type={busy ? "button" : "submit"}
      >
        {busy ? <Square aria-hidden="true" size={16} /> : <ArrowUp aria-hidden="true" size={20} />}
      </Button>
    </form>
  );
}
