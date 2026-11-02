"use client";

import "./studio-chat.css";

import { useEffect, useRef } from "react";

import { MessageSquare, PanelLeftClose, Plus } from "lucide-react";

import { Button } from "../../buttons/button";
import { ThemeToggle } from "../../theme";
import { ChatComposer } from "./ChatComposer";
import { studioChatScreenStyles } from "./styles";
import type { StudioChatScreenOptions } from "./types";

export function StudioChatScreen({
  message,
  onMessageChange,
  onSubmit,
  onReset,
  onStop,
  busy,
  disabled,
  messages,
  review,
  notice,
  error,
  status,
  actions,
  editorHref,
}: StudioChatScreenOptions) {
  const started = messages.length > 0;
  const thread = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length === 0) return;
    const node = thread.current;
    if (node) node.scrollTo({ behavior: "instant", top: node.scrollHeight });
  }, [messages]);
  return (
    <main className={studioChatScreenStyles.element1} id="admin-content">
      <aside className={studioChatScreenStyles.element2}>
        <a className={studioChatScreenStyles.element3} href="/">
          mydevstudio<span>.</span>
        </a>
        <Button disabled={busy} onClick={onReset} variant="ghost">
          <Plus size={18} /> New chat
        </Button>
        <p className={studioChatScreenStyles.element4}>YOUR WORKSPACE</p>
        <span className={studioChatScreenStyles.element5}>
          <MessageSquare size={16} /> Portfolio & CV
        </span>
        <a href={editorHref}>Open portfolio editor ↗</a>
        <a href="/">Back to home</a>
        <p className={studioChatScreenStyles.element6}>
          Your draft stays private until you choose to publish.
        </p>
      </aside>
      <section
        aria-label="Studio assistant conversation"
        className={studioChatScreenStyles.element7}
      >
        <header className={studioChatScreenStyles.element8}>
          <span>
            Studio <span className={studioChatScreenStyles.element9}>Portfolio & CV</span>
          </span>
          <div>
            {actions}
            <ThemeToggle />
          </div>
        </header>
        <details className={studioChatScreenStyles.element10}>
          <summary>
            <PanelLeftClose size={18} /> Workspace
          </summary>
          <Button disabled={busy} onClick={onReset} variant="ghost">
            New chat
          </Button>
          <a href={editorHref}>Portfolio editor ↗</a>
          <a href="/">Home</a>
        </details>
        <div className={studioChatScreenStyles.element11} data-started={started}>
          {started ? (
            <div
              aria-busy={busy}
              aria-label="Conversation"
              aria-live="polite"
              className={studioChatScreenStyles.element12}
              ref={thread}
              role="log"
            >
              {messages.map((item) => (
                <article
                  className={studioChatScreenStyles.element13}
                  data-role={item.role}
                  key={item.id}
                >
                  <span className={studioChatScreenStyles.element14}>
                    {item.role === "user" ? "You" : "Studio"}
                  </span>
                  <p>{item.text}</p>
                </article>
              ))}
              {busy && (
                <p className={studioChatScreenStyles.element15} role="status">
                  Preparing your proposal…
                </p>
              )}
              {review}
            </div>
          ) : (
            <div className={studioChatScreenStyles.element16}>
              <span className={studioChatScreenStyles.element17}>YOUR STORY, NEXT CHAPTER</span>
              <h1>What would you like to create?</h1>
              <p>A portfolio that sounds like you. A CV that goes with it.</p>
            </div>
          )}
          <div className={studioChatScreenStyles.element18}>
            {error && (
              <p className={studioChatScreenStyles.element19} role="alert">
                {error}
              </p>
            )}
            {status && <p role="status">{status}</p>}
            <ChatComposer
              busy={busy}
              disabled={disabled}
              onChange={onMessageChange}
              onStop={onStop}
              onSubmit={onSubmit}
              value={message}
            />
            {!started && (
              <div className={studioChatScreenStyles.element20}>
                {[
                  "Refine my professional summary",
                  "Make my project descriptions clearer",
                  "Help organize my portfolio",
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    onClick={() => onMessageChange(suggestion)}
                    variant="ghost"
                  >
                    {suggestion} <span aria-hidden="true">↗</span>
                  </Button>
                ))}
              </div>
            )}
            <div className={studioChatScreenStyles.element21}>{notice}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
