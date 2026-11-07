"use client";

import "../../styles/components/display/studio-chat.css";

import { useEffect, useRef } from "react";

import { ArrowUpRight, Menu, Plus, Sparkles } from "lucide-react";

import { Button } from "../../buttons/button";
import { ThemeToggle } from "../../theme";
import { studioChatScreenStyles } from "../chat/styles";
import type { StudioChatScreenOptions } from "../chat/types";
import { ChatComposer } from "../chat-composer/ChatComposer";
import { studioChatSuggestions } from "./copy";

function screenCopy(visitor: StudioChatScreenOptions["visitor"]) {
  if (visitor) {
    return {
      description: "Ask about published experience, projects and skills.",
      eyebrow: "PORTFOLIO ASSISTANT",
      heading: `What would you like to know about ${visitor.name}?`,
      label: "Portfolio assistant",
      maxLength: 2000,
      name: visitor.name,
      placeholder: "Ask about this portfolio…",
      suggestions: [
        "What projects are featured?",
        "What experience is listed?",
        "Which skills are highlighted?",
      ],
      working: "Preparing your answer…",
      workspaceLink: "Back to portfolio",
    };
  }
  return {
    description: "A portfolio that sounds like you. A CV that goes with it.",
    eyebrow: "YOUR STORY, NEXT CHAPTER",
    heading: "What would you like to create?",
    label: "Studio assistant",
    name: "Portfolio & CV",
    suggestions: studioChatSuggestions,
    working: "Preparing your proposal…",
    workspaceLink: "Portfolio editor ↗",
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
      <section
        aria-label={visitor ? "Portfolio assistant conversation" : "Studio assistant conversation"}
        className={studioChatScreenStyles.element7}
      >
        <header className={studioChatScreenStyles.element8}>
          <div className={studioChatScreenStyles.element2}>
            <a className={studioChatScreenStyles.element3} href="/">
              mydevstudio<span>.</span>
            </a>
            <span className={studioChatScreenStyles.element9}>{copy.name}</span>
          </div>
          <div className={studioChatScreenStyles.element4}>
            <div className={studioChatScreenStyles.element5}>
              <Button href={workspaceHref} size="sm" variant="ghost">
                {copy.workspaceLink}
              </Button>
              <Button disabled={busy} onClick={onReset} size="sm" type="button" variant="outline">
                <Plus aria-hidden="true" size={16} /> New chat
              </Button>
            </div>
            <details className={studioChatScreenStyles.element10}>
              <summary>
                <Menu aria-hidden="true" size={16} /> Workspace
              </summary>
              <div className={studioChatScreenStyles.element6}>
                <Button disabled={busy} onClick={onReset} type="button" variant="ghost">
                  <Plus aria-hidden="true" size={16} /> New chat
                </Button>
                <Button href={workspaceHref} variant="ghost">
                  {copy.workspaceLink}
                </Button>
              </div>
            </details>
            {actions}
            <ThemeToggle />
          </div>
        </header>
        <div className={studioChatScreenStyles.element11} data-started={started}>
          {started ? (
            <>
              <h1 className={studioChatScreenStyles.element22}>{copy.label}</h1>
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
            </>
          ) : (
            <div className={studioChatScreenStyles.element16}>
              <Sparkles aria-hidden="true" className={studioChatScreenStyles.element23} />
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
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {suggestion} <ArrowUpRight aria-hidden="true" size={14} />
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
