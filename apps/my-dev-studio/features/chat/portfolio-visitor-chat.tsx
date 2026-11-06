"use client";

import { useEffect, useRef, useState } from "react";

import type { ChatIdentity } from "@shared/runtime/chat";
import { StudioChatScreen } from "@shared/ui/display";
import { PublishedSources } from "@shared/ui/portfolio";

import { handlePremiumChatAction } from "../../app/actions";
import { streamPortfolioAnswer } from "./stream-client";
import { loadVisitorHistory, type VisitorMessage, visitorHistoryKey } from "./visitor-chat-history";

export function PortfolioVisitorChat({
  identity,
  legacy,
  sources,
  username,
}: {
  identity: ChatIdentity;
  legacy: boolean;
  sources: { href: string; label: string }[];
  username: string;
}) {
  const [messages, setMessages] = useState<VisitorMessage[]>([]);
  const [partial, setPartial] = useState("");
  const [question, setQuestion] = useState("");
  const [session, setSession] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  const key = visitorHistoryKey(identity);

  useEffect(() => {
    setMessages(loadVisitorHistory(identity));
    setSession(crypto.randomUUID());
    return () => {
      const active = request.current;
      request.current = null;
      active?.abort();
    };
  }, [identity]);

  useEffect(() => {
    if (!session) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(messages));
    } catch {
      // Storage can be disabled.
    }
  }, [key, messages, session]);

  async function submit() {
    const text = question.trim();
    if (request.current || !session || !text) return;
    const controller = new AbortController();
    request.current = controller;
    setError("");
    setQuestion("");
    setPending(true);
    const outgoing = { id: crypto.randomUUID(), role: "user", text } as const;
    setMessages((previous) => [...previous.slice(-19), outgoing]);
    try {
      const answer = legacy
        ? await streamPortfolioAnswer(
            username,
            session,
            text,
            (delta) => {
              if (!controller.signal.aborted) setPartial((current) => current + delta);
            },
            controller.signal,
          )
        : await handlePremiumChatAction(username, text, session, crypto.randomUUID());
      controller.signal.throwIfAborted();
      const incoming = { id: crypto.randomUUID(), role: "assistant", text: answer } as const;
      setMessages((previous) => [...previous.slice(-19), incoming]);
    } catch {
      if (!controller.signal.aborted)
        setError(
          "The assistant is unavailable right now. Reload the portfolio or try again later.",
        );
    } finally {
      if (request.current === controller) {
        request.current = null;
        setPartial("");
        setPending(false);
      }
    }
  }

  function stop() {
    request.current?.abort();
    request.current = null;
    setPartial("");
    setPending(false);
  }

  return (
    <StudioChatScreen
      busy={pending}
      disabled={!session}
      error={error}
      message={question}
      messages={
        partial
          ? [...messages, { id: "pending-answer", role: "assistant", text: partial }]
          : messages
      }
      notice={
        <>
          <p>
            AI can make mistakes. Questions are sent to OpenAI. Avoid sharing sensitive information.
          </p>
          <PublishedSources sources={sources} />
        </>
      }
      onMessageChange={setQuestion}
      onReset={() => {
        setMessages([]);
        setQuestion("");
        setError("");
      }}
      onStop={stop}
      onSubmit={submit}
      visitor={{ href: `/${encodeURIComponent(username)}`, name: identity.name }}
    />
  );
}
