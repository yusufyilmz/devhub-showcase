"use client";

import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { ChatList, ChatListEmpty, ChatListItem } from "./chat-list";
import { ChatTyping } from "./chat-typing";

export type ChatPanelMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

export function ChatPanel({
  title,
  titleId,
  notice,
  messages,
  emptyDescription,
  value,
  onValueChange,
  onSubmit,
  busy = false,
  busyLabel = "Preparing an answer…",
  error,
  inputId,
  inputLabel,
  sendLabel,
  maxLength = 2000,
  onClose,
  closeLabel = "Close",
  onClear,
  clearLabel = "Clear conversation",
}: {
  title: string;
  titleId: string;
  notice?: string;
  messages: ChatPanelMessage[];
  emptyDescription: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
  busy?: boolean;
  busyLabel?: string;
  error?: string;
  inputId: string;
  inputLabel: string;
  sendLabel: string;
  maxLength?: number;
  onClose: () => void;
  closeLabel?: string;
  onClear?: () => void;
  clearLabel?: string;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <header className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold" id={titleId}>
          {title}
        </h2>
        <button aria-label={closeLabel} onClick={onClose} type="button">
          {closeLabel}
        </button>
      </header>
      {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
      <ChatList
        aria-label="Conversation"
        aria-live="polite"
        className="min-h-48 flex-1"
        role="log"
        showScrollButton={false}
      >
        {messages.length === 0 ? (
          <ChatListEmpty description={emptyDescription} title="No messages yet" />
        ) : (
          messages.map((message) => (
            <ChatListItem isOwn={message.role === "user"} key={message.id}>
              <ChatBubble
                className="max-w-[85%]"
                variant={
                  message.role === "user"
                    ? "sent"
                    : message.role === "system"
                      ? "system"
                      : "received"
                }
              >
                {message.text}
              </ChatBubble>
            </ChatListItem>
          ))
        )}
        {busy && (
          <ChatListItem>
            <ChatTyping aria-label={busyLabel} showBubble />
          </ChatListItem>
        )}
      </ChatList>
      {busy && <p role="status">{busyLabel}</p>}
      {error && <p role="alert">{error}</p>}
      <label className="sr-only" htmlFor={inputId}>
        {inputLabel}
      </label>
      <ChatInput
        disabled={busy}
        id={inputId}
        maxLength={maxLength}
        onSubmit={onSubmit}
        onValueChange={onValueChange}
        placeholder={inputLabel}
        sendButtonText={sendLabel}
        value={value}
      />
      {onClear && (
        <button disabled={busy} onClick={onClear} type="button">
          {clearLabel}
        </button>
      )}
    </div>
  );
}
