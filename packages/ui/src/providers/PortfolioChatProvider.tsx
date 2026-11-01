import { createElement, type ReactNode, useEffect, useState } from "react";

import {
  ChatContext,
  type ChatIdentity,
  chatStorageKey,
  createChatStore,
} from "@shared/runtime/chat";

export function PortfolioChatScope({
  identity,
  children,
}: {
  identity: ChatIdentity;
  children: ReactNode;
}) {
  const [store] = useState(() => createChatStore(identity));
  useEffect(() => {
    store.persist.rehydrate();
  }, [store]);
  return createElement(ChatContext.Provider, { value: store }, children);
}

export function PortfolioChatProvider(props: { identity: ChatIdentity; children: ReactNode }) {
  return createElement(PortfolioChatScope, {
    ...props,
    key: chatStorageKey(props.identity),
  });
}
