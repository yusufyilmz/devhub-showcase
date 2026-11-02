"use client";

import "./studio-chat.css";

import { type ReactNode, useEffect, useRef } from "react";

import { MessageSquare, PanelLeftClose, Plus } from "lucide-react";

import { Button } from "../../buttons/button";
import { ThemeToggle } from "../../theme";
import { ChatComposer } from "./ChatComposer";

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
}: {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  onStop: () => void;
  busy: boolean;
  disabled: boolean;
  messages: { id: number; role: "user" | "assistant"; text: string }[];
  review?: ReactNode;
  notice?: ReactNode;
  error?: string;
  status?: string;
  actions?: ReactNode;
  editorHref: string;
}) {
  const started = messages.length > 0;
  const thread = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length === 0) return;
    const node = thread.current;
    if (node) node.scrollTo({ behavior: "instant", top: node.scrollHeight });
  }, [messages]);
  return (
    <main className="studio-chat-screen" id="admin-content">
      <aside className="studio-chat-sidebar">
        <a className="studio-chat-brand" href="/">
          mydevstudio<span>.</span>
        </a>
        <Button disabled={busy} onClick={onReset} variant="ghost">
          <Plus size={18} /> New chat
        </Button>
        <p className="studio-chat-sidebar-label">YOUR WORKSPACE</p>
        <span className="studio-chat-current">
          <MessageSquare size={16} /> Portfolio & CV
        </span>
        <a href={editorHref}>Open portfolio editor ↗</a>
        <a href="/">Back to home</a>
        <p className="studio-chat-sidebar-note">
          Your draft stays private until you choose to publish.
        </p>
      </aside>
      <section aria-label="Studio assistant conversation" className="studio-chat-main">
        <header className="studio-chat-topbar">
          <span>
            Studio <span className="studio-chat-subtitle">Portfolio & CV</span>
          </span>
          <div>
            {actions}
            <ThemeToggle />
          </div>
        </header>
        <details className="studio-chat-mobile-nav">
          <summary>
            <PanelLeftClose size={18} /> Workspace
          </summary>
          <Button disabled={busy} onClick={onReset} variant="ghost">
            New chat
          </Button>
          <a href={editorHref}>Portfolio editor ↗</a>
          <a href="/">Home</a>
        </details>
        <div className="studio-chat-body" data-started={started}>
          {started ? (
            <div
              aria-busy={busy}
              aria-label="Conversation"
              aria-live="polite"
              className="studio-chat-thread"
              ref={thread}
              role="log"
            >
              {messages.map((item) => (
                <article className="studio-chat-message" data-role={item.role} key={item.id}>
                  <span className="sr-only">{item.role === "user" ? "You" : "Studio"}</span>
                  <p>{item.text}</p>
                </article>
              ))}
              {busy && (
                <p className="studio-chat-progress" role="status">
                  Preparing your proposal…
                </p>
              )}
              {review}
            </div>
          ) : (
            <div className="studio-chat-welcome">
              <span className="studio-chat-eyebrow">YOUR STORY, NEXT CHAPTER</span>
              <h1>What would you like to create?</h1>
              <p>A portfolio that sounds like you. A CV that goes with it.</p>
            </div>
          )}
          <div className="studio-chat-compose-area">
            {error && (
              <p className="studio-chat-error" role="alert">
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
              <div className="studio-chat-suggestions">
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
            <div className="studio-chat-notice">{notice}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
