import { createElement, useEffect, useState } from "react";

import { ChatContext, createChatStore } from "@shared/runtime/chat";
import { chatStorage } from "@shared/runtime/storage";

import type { PortfolioChatProviderOptions, PortfolioChatScopeOptions } from "./types";

export function PortfolioChatScope({ identity, children }: PortfolioChatScopeOptions) {
  const [store] = useState(() => createChatStore(identity));
  useEffect(() => {
    store.persist.rehydrate();
  }, [store]);
  return createElement(ChatContext.Provider, { value: store }, children);
}

export function PortfolioChatProvider(props: PortfolioChatProviderOptions) {
  return createElement(PortfolioChatScope, {
    ...props,
    key: chatStorage.portfolioKey(props.identity),
  });
}
