"use client";
import { useEffect, useId, useRef, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; text: string };
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
      <button className="portfolio-chat-launch" onClick={() => setOpen(true)} type="button">
        Ask about {props.name}
      </button>
      {open && (
        <ChatPanel
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
function ChatPanel({
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
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !question.trim() || !session) return;
    const text = question.trim();
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
      <header>
        <h2 id={label}>{name}’s portfolio assistant</h2>
        <button aria-label="Close portfolio assistant" onClick={close} type="button">
          Close
        </button>
      </header>
      <p>
        Answers use published portfolio information. AI can make mistakes. Questions are sent to
        OpenAI; avoid sharing sensitive information.
      </p>
      <div
        aria-label="Conversation"
        aria-live="polite"
        className="portfolio-chat-messages"
        role="log"
      >
        {messages.length === 0 && <p>Ask about {name}’s experience, skills or projects.</p>}
        {messages.map((message) => (
          <p key={message.id}>
            <strong>{message.role === "user" ? "You" : "Assistant"}: </strong>
            {message.text}
          </p>
        ))}
      </div>
      {busy && <p role="status">Preparing an answer…</p>}
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label htmlFor={inputId}>Your question</label>
        <textarea
          disabled={busy}
          id={inputId}
          maxLength={2000}
          onChange={(event) => setQuestion(event.target.value)}
          required
          value={question}
        />
        <button disabled={busy || !session} type="submit">
          Send question
        </button>
      </form>
      <button disabled={busy} onClick={() => setMessages([])} type="button">
        Clear conversation
      </button>
    </dialog>
  );
}
