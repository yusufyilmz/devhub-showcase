"use client";

import "./portfolio-chat.css";

import { useEffect, useId, useRef, useState } from "react";

import { chatStorage, type VisitorMessage } from "@shared/runtime/storage";
import { Button as LibraryButton } from "@shared/ui/button";

import { PublishedSources } from "../../portfolio/index";
import { ChatPanel } from "../assistant-chat/chat-panel";

export type PortfolioChatProps = {
  sources?: { label: string; href: string }[];
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
function ChatDialog({
  sources = [],
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
  const key = chatStorage.visitorKey({ id: identity, revision });
  const [messages, setMessages] = useState<VisitorMessage[]>([]);
  const [session, setSession] = useState("");
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    dialog.current?.showModal();
    setMessages(chatStorage.readVisitor(key));
    setSession(crypto.randomUUID());
    return () => controller.current?.abort();
  }, [key]);
  useEffect(() => {
    if (session) chatStorage.writeVisitor(key, messages);
  }, [key, messages, session]);
  async function submit(text: string) {
    if (busy || !text.trim() || !session) return;
    setBusy(true);
    setError("");
    setQuestion("");
    setMessages((previous) =>
      [...previous, { id: crypto.randomUUID(), role: "user" as const, text }].slice(-20),
    );
    controller.current = new AbortController();
    try {
      const answer = await send(text, session, controller.current.signal);
      setMessages((previous) =>
        [...previous, { id: crypto.randomUUID(), role: "assistant" as const, text: answer }].slice(
          -20,
        ),
      );
    } catch {
      if (!controller.current.signal.aborted)
        setError(
          "The assistant is unavailable, the published portfolio changed, or its allowance was reached. Reload this page to refresh published information, or try later.",
        );
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog aria-labelledby={label} className="portfolio-chat-panel" onCancel={close} ref={dialog}>
      <PublishedSources sources={sources} />
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
