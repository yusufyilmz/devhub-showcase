"use client";

import { useState } from "react";

import { Button } from "../../buttons/button";
import { ChatInput } from "../../display/chat/ChatInput";

export function HomeChatLauncher() {
  const [message, setMessage] = useState("");
  function open() {
    if (message.trim()) sessionStorage.setItem("studio-assistant-pending", message.trim());
    window.location.assign("/admin/chat");
  }
  return (
    <div className="home-chat-launcher">
      <ChatInput
        maxLength={4000}
        onChange={setMessage}
        onSend={open}
        placeholder="What would you like to create?"
        showCharacterCount={false}
        showClearButton={false}
        value={message}
      />
      <Button href="/admin/chat" variant="link">
        Open Studio assistant →
      </Button>
      <p>Shape your portfolio and CV. Review every change before saving.</p>
    </div>
  );
}
