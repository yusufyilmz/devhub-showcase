"use client";

import { useState } from "react";

import { Sparkles } from "lucide-react";

import { chatStorage } from "@shared/runtime/storage";
import { Button } from "@shared/ui/button";
import { Section } from "@shared/ui/section";

import { ChatComposer } from "../../chat/chat-composer/ChatComposer";
import { studioChatSuggestions } from "../../chat/studio-chat-screen/copy";
import { studioChatScreenStyles } from "../../chat/styles";
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
        <Sparkles aria-hidden="true" className="size-7 text-primary" />
        <p className={chatLauncherStyles.element2}>A LITTLE HELP, A LOT OF POSSIBILITY</p>
        <h2 id="home-chat-title">Where would you like to start?</h2>
        <ChatComposer
          onChange={setMessage}
          onSubmit={open}
          placeholder="What would you like to create?"
          value={message}
        />
        <fieldset className={studioChatScreenStyles.element20}>
          <legend className="sr-only">Starter prompts</legend>
          {studioChatSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              onClick={() => setMessage(suggestion)}
              size="sm"
              type="button"
              variant="outline"
            >
              {suggestion}
            </Button>
          ))}
        </fieldset>
        <p>Shape your portfolio and CV with Studio. You review every change.</p>
      </section>
    </Section>
  );
}
