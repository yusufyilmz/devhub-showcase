"use client";

import "../../styles/components/display/studio-chat.css";

import { useEffect, useRef } from "react";

import { MessageSquare, PanelLeftClose, Plus } from "lucide-react";

import { Button } from "../../buttons/button";
import { ThemeToggle } from "../../theme";
import { studioChatScreenStyles } from "../chat/styles";
import type { StudioChatScreenOptions } from "../chat/types";
import { ChatComposer } from "../chat-composer/ChatComposer";

function screenCopy(visitor: StudioChatScreenOptions["visitor"]) {
  if (visitor) {
    return {
      description: "Ask about published experience, projects and skills.",
      eyebrow: "PORTFOLIO ASSISTANT",
      heading: `What would you like to know about ${visitor.name}?`,
      label: "Portfolio assistant",
      maxLength: 2000,
      mobileLink: "Back to portfolio",
      name: visitor.name,
      placeholder: "Ask about this portfolio…",
      sidebarLink: "Back to portfolio",
      sidebarNote: "Answers use published portfolio information.",
      suggestions: [
        "What projects are featured?",
        "What experience is listed?",
        "Which skills are highlighted?",
      ],
      working: "Preparing your answer…",
    };
  }
  return {
    description: "A portfolio that sounds like you. A CV that goes with it.",
    eyebrow: "YOUR STORY, NEXT CHAPTER",
    heading: "What would you like to create?",
    label: "Studio",
    mobileLink: "Portfolio editor ↗",
    name: "Portfolio & CV",
    sidebarLink: "Open portfolio editor ↗",
    sidebarNote: "Your draft stays private until you choose to publish.",
    suggestions: [
      "Refine my professional summary",
      "Make my project descriptions clearer",
      "Help organize my portfolio",
    ],
    working: "Preparing your proposal…",
  };
}

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
  visitor,
}: StudioChatScreenOptions) {
  const started = messages.length > 0;
  const workspaceHref = visitor?.href ?? editorHref ?? "/";
  const copy = screenCopy(visitor);
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
          <MessageSquare size={16} /> {copy.name}
        </span>
        <a href={workspaceHref}>{copy.sidebarLink}</a>
        <a href="/">Back to home</a>
        <p className={studioChatScreenStyles.element6}>{copy.sidebarNote}</p>
      </aside>
      <section
        aria-label={visitor ? "Portfolio assistant conversation" : "Studio assistant conversation"}
        className={studioChatScreenStyles.element7}
      >
        <header className={studioChatScreenStyles.element8}>
          <span>
            {copy.label} <span className={studioChatScreenStyles.element9}>{copy.name}</span>
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
          <a href={workspaceHref}>{copy.mobileLink}</a>
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
                    {item.role === "user" ? "You" : copy.label}
                  </span>
                  <p>{item.text}</p>
                </article>
              ))}
              {busy && (
                <p className={studioChatScreenStyles.element15} role="status">
                  {copy.working}
                </p>
              )}
              {review}
            </div>
          ) : (
            <div className={studioChatScreenStyles.element16}>
              <span className={studioChatScreenStyles.element17}>{copy.eyebrow}</span>
              <h1>{copy.heading}</h1>
              <p>{copy.description}</p>
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
              maxLength={copy.maxLength}
              onChange={onMessageChange}
              onStop={onStop}
              onSubmit={onSubmit}
              placeholder={copy.placeholder}
              value={message}
            />
            {!started && (
              <div className={studioChatScreenStyles.element20}>
                {copy.suggestions.map((suggestion) => (
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
