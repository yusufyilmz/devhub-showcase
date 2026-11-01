"use client";

import type { ComponentProps } from "react";

import { PremiumWidget as PremiumWidgetView } from "@shared/assistant/chat";

import { handlePremiumChatAction } from "../../app/actions";

export function PremiumWidget(
  props: Omit<ComponentProps<typeof PremiumWidgetView>, "handleSendMessage"> & {
    username: string;
  },
) {
  const { username, ...rest } = props;
  return (
    <PremiumWidgetView
      username={username}
      {...rest}
      handleSendMessage={(message, sessionId) =>
        handlePremiumChatAction(username, message, sessionId, crypto.randomUUID())
      }
    />
  );
}
