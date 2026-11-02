"use client";

import "@shared/ui/portfolio-chat.css";

import { useEffect, useId, useRef, useState } from "react";

import { Button as LibraryButton } from "@shared/ui/button";

import { ChatPanel, type ChatPanelMessage } from "../assistant-chat/chat-panel";

type Message = ChatPanelMessage & { role: "user" | "assistant" };
export type PortfolioChatProps = {
  identity: string;
  revision: number;
  name: string;
  send: (message: string, sessionId: string, signal: AbortSignal) => Promise<string>;
};
export function PortfolioChat(props: PortfolioChatProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="portfolio-chat">
      <LibraryButton
        className="portfolio-chat-launch"
        onClick={() => setOpen(true)}
        type="button"
        variant="unstyled"
      >
        Ask about {props.name}
      </LibraryButton>
      {open && (
        <ChatDialog
          key={`${props.identity}:${props.revision}`}
          {...props}
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
}
function loadMessages(key: string): Message[] {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(key) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Message =>
        Boolean(
          item &&
            typeof item.id === "string" &&
            ["user", "assistant"].includes(item.role) &&
            typeof item.text === "string" &&
            item.text.length <= 12000,
        ),
      )
      .slice(-20);
  } catch {
    return [];
  }
}
function ChatDialog({
  identity,
  revision,
  name,
  send,
  close,
}: PortfolioChatProps & { close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const controller = useRef<AbortController | null>(null);
  const label = useId();
  const inputId = useId();
  const key = `mydevstudio:premium-chat:v1:${encodeURIComponent(identity)}:${revision}`;
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState("");
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    dialog.current?.showModal();
    setMessages(loadMessages(key));
    setSession(crypto.randomUUID());
    return () => controller.current?.abort();
  }, [key]);
  useEffect(() => {
    if (session)
      try {
        sessionStorage.setItem(key, JSON.stringify(messages));
      } catch {
        /* Storage may be disabled. */
      }
  }, [key, messages, session]);
  async function submit(text: string) {
    if (busy || !text.trim() || !session) return;
    setBusy(true);
    setError("");
    setQuestion("");
    setMessages(
      (previous) =>
        [...previous, { id: crypto.randomUUID(), role: "user", text }].slice(-20) as Message[],
    );
    controller.current = new AbortController();
    try {
      const answer = await send(text, session, controller.current.signal);
      setMessages(
        (previous) =>
          [...previous, { id: crypto.randomUUID(), role: "assistant", text: answer }].slice(
            -20,
          ) as Message[],
      );
    } catch {
      if (!controller.current.signal.aborted)
        setError(
          "The assistant is unavailable or its allowance has been reached. Please try later.",
        );
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog aria-labelledby={label} className="portfolio-chat-panel" onCancel={close} ref={dialog}>
      <ChatPanel
        busy={busy}
        closeLabel="Close portfolio assistant"
        emptyDescription={`Ask about ${name}’s experience, skills or projects.`}
        error={error}
        inputId={inputId}
        inputLabel="Your question"
        maxLength={2000}
        messages={messages}
        notice="Answers use published portfolio information. AI can make mistakes. Questions are sent to OpenAI; avoid sharing sensitive information."
        onClear={() => setMessages([])}
        onClose={close}
        onSubmit={submit}
        onValueChange={setQuestion}
        sendLabel="Send question"
        title={`${name}’s portfolio assistant`}
        titleId={label}
        value={question}
      />
    </dialog>
  );
}
