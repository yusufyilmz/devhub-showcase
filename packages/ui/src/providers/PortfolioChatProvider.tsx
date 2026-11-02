import { createElement, useEffect, useState } from "react";

import { ChatContext, chatStorageKey, createChatStore } from "@shared/runtime/chat";

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
    key: chatStorageKey(props.identity),
  });
}
