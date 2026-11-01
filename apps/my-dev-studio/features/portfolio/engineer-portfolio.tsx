"use client";

import type { ComponentProps } from "react";

import { EngineerPortfolio as EngineerPortfolioView } from "@shared/components/portfolio";

import { handleSendMessageAction } from "../../app/actions";

export function EngineerPortfolio(
  props: Omit<ComponentProps<typeof EngineerPortfolioView>, "handleSendMessage">,
) {
  const username = props.chatIdentity?.username;
  return (
    <EngineerPortfolioView
      {...props}
      handleSendMessage={(message, sessionId) => {
        if (!username) return Promise.reject(new Error("Chat is unavailable"));
        return handleSendMessageAction(username, message, sessionId);
      }}
    />
  );
}
