"use client";

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
    <div className="fixed right-4 bottom-4 z-[100]">
      <LibraryButton
        className="max-w-[calc(100vw-2rem)] rounded-full border border-slate-500 bg-slate-900 px-4 py-3 text-slate-50 focus-visible:outline-3 focus-visible:outline-offset-[3px] focus-visible:outline-sky-400"
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
    <dialog
      aria-labelledby={label}
      className="fixed inset-auto right-4 bottom-4 m-0 max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-auto rounded-2xl border border-slate-500 bg-slate-900 p-5 text-slate-50 shadow-[0_1rem_3rem_#0006] backdrop:bg-black/50 focus-visible:outline-3 focus-visible:outline-offset-[3px] focus-visible:outline-sky-400 [&_button]:cursor-pointer [&_button]:rounded-lg [&_button]:border [&_button]:border-slate-400 [&_button]:bg-slate-800 [&_button]:px-3 [&_button]:py-2 [&_button]:text-slate-50 [&_button:disabled]:cursor-wait [&_button:disabled]:opacity-50 [&_form]:grid [&_form]:gap-2 [&_h2]:text-[1.15rem] [&_header]:flex [&_header]:items-start [&_header]:justify-between [&_header]:gap-4 [&_p]:my-3 [&_p]:wrap-anywhere [&_p]:whitespace-pre-wrap [&_textarea]:min-h-20 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-slate-400 [&_textarea]:bg-slate-800 [&_textarea]:p-2 [&_textarea]:text-slate-50"
      onCancel={close}
      ref={dialog}
    >
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
