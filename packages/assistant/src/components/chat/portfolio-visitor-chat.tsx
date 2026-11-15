"use client";

import { useEffect, useRef, useState } from "react";

import type { ChatIdentity } from "@shared/runtime/chat";
import { chatStorage, type VisitorMessage } from "@shared/runtime/storage";

import { streamPortfolioAnswer } from "../../client/portfolio-stream";
import { PublishedSources } from "../portfolio/index";
import { StudioChatScreen } from "./index";

export function PortfolioVisitorChat({
  identity,
  answerPremiumChat,
  isMainPortfolio,
  sources,
  username,
}: {
  answerPremiumChat: (
    username: string,
    message: string,
    sessionId: string,
    requestId: string,
  ) => Promise<string>;
  identity: ChatIdentity;
  isMainPortfolio: boolean;
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
  const key = chatStorage.visitorKey(identity);

  useEffect(() => {
    setMessages(chatStorage.readVisitor(key));
    setSession(crypto.randomUUID());
    return () => {
      const active = request.current;
      request.current = null;
      active?.abort();
    };
  }, [key]);

  useEffect(() => {
    if (session) chatStorage.writeVisitor(key, messages);
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
      const answer = isMainPortfolio
        ? await streamPortfolioAnswer(
            username,
            session,
            text,
            (delta) => {
              if (!controller.signal.aborted) setPartial((current) => current + delta);
            },
            controller.signal,
          )
        : await answerPremiumChat(username, text, session, crypto.randomUUID());
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
