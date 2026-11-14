"use client";

import type React from "react";
import { useState } from "react";

import { copy } from "@shared/config";
import type { ChatType } from "@shared/lib/types";
import { IconButton } from "@shared/ui/icon-button";
import { SendIcon } from "@shared/ui/icons";
import { Input as LibraryInput } from "@shared/ui/input";

type ChatInputProps = {
  handleSendMessage: (input: string) => void;
  botIsTyping?: boolean;
  chatFinished?: boolean;
  type: ChatType;
};

export const ChatInput: React.FC<ChatInputProps> = ({
  handleSendMessage,
  botIsTyping,
  type,
  chatFinished,
}) => {
  const [input, setInput] = useState("");

  const handleSendButtonClick = () => {
    if (!input || botIsTyping || chatFinished) return;
    handleSendMessage(input);
    setInput("");
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey && input !== "" && !botIsTyping && !chatFinished) {
      e.preventDefault();
      handleSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey && input !== "" && !chatFinished) {
      setInput(input.replace(/\n$/, ""));
      e.preventDefault();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <LibraryInput
        className="grow p-2 border rounded-lg"
        disabled={chatFinished}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder={copy.chat[chatFinished ? "end" : type].placeholder}
        type="text"
        unstyled
        value={input}
      />
      <IconButton
        aria-label="Send message"
        className="icon-button [color:var(--foreground)] px-4 py-2 bg-main-primary text-main-white rounded-lg hover:bg-gray-600 disabled:bg-gray-700 disabled:text-main-white"
        disabled={botIsTyping || chatFinished}
        onClick={handleSendButtonClick}
        type="submit"
      >
        <SendIcon />
      </IconButton>
    </div>
  );
};
