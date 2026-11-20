"use client";

import { useState } from "react";

import { Sparkles } from "lucide-react";

import { chatStorage } from "@shared/runtime/storage";
import { Button } from "@shared/ui/button";
import { Section } from "@shared/ui/layout";

import { ChatComposer } from "../chat-composer/ChatComposer";
import { studioChatSuggestions } from "../studio-chat-screen/copy";
import { chatLauncherStyles } from "./styles";

export function HomeChatLauncher() {
  const [message, setMessage] = useState("");
  function open() {
    if (message.trim()) chatStorage.setPending(message.trim());
    window.location.assign("/studio/chat");
  }
  return (
    <Section asChild>
      <section aria-labelledby="home-chat-title" className={chatLauncherStyles.section}>
        <div className={chatLauncherStyles.panel}>
          <span aria-hidden="true" className={chatLauncherStyles.mark}>
            <Sparkles />
          </span>
          <div className={chatLauncherStyles.identity}>
            <p className={chatLauncherStyles.eyebrow}>A little help, a lot of possibility</p>
            <h2 className={chatLauncherStyles.title} id="home-chat-title">
              Where would you like to start?
            </h2>
          </div>
          <div className={chatLauncherStyles.composer}>
            <ChatComposer
              onChange={setMessage}
              onSubmit={open}
              placeholder="What would you like to create?"
              value={message}
            />
          </div>
          <fieldset className={chatLauncherStyles.suggestions}>
            <legend className="sr-only">Starter prompts</legend>
            {studioChatSuggestions.map((suggestion) => (
              <Button
                aria-pressed={message === suggestion}
                className={chatLauncherStyles.suggestion}
                key={suggestion}
                onClick={() => setMessage(suggestion)}
                type="button"
                variant="unstyled"
              >
                {suggestion}
              </Button>
            ))}
          </fieldset>
          <p className={chatLauncherStyles.note}>
            Shape your portfolio and CV with Studio. You review every change.
          </p>
        </div>
      </section>
    </Section>
  );
}
