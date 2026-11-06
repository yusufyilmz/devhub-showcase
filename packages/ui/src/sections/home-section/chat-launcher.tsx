"use client";

import { useState } from "react";

import { chatStorage } from "@shared/runtime/storage";

import { ChatComposer } from "../../display/chat-composer/ChatComposer";
import { Section } from "../../layout/section";
import { chatLauncherStyles } from "./styles";

export function HomeChatLauncher() {
  const [message, setMessage] = useState("");
  function open() {
    if (message.trim()) chatStorage.setPending(message.trim());
    window.location.assign("/admin/chat");
  }
  return (
    <Section asChild>
      <section aria-labelledby="home-chat-title" className={chatLauncherStyles.element1}>
        <p className={chatLauncherStyles.element2}>A LITTLE HELP, A LOT OF POSSIBILITY</p>
        <h2 id="home-chat-title">Where would you like to start?</h2>
        <ChatComposer
          onChange={setMessage}
          onSubmit={open}
          placeholder="What would you like to create?"
          value={message}
        />
        <p>Shape your portfolio and CV with Studio. You review every change.</p>
      </section>
    </Section>
  );
}
