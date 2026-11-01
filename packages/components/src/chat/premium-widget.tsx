"use client";

import { PortfolioChat } from "./portfolio-chat";

export function PremiumWidget({
  id,
  name,
  revision,
  handleSendMessage,
}: {
  id: string;
  name: string;
  revision: number;
  handleSendMessage: (message: string, sessionId: string) => Promise<string>;
}) {
  return (
    <PortfolioChat
      identity={id}
      name={name}
      revision={revision}
      send={async (message: string, sessionId: string, signal: AbortSignal) => {
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        const answer = await handleSendMessage(message, sessionId);
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        return answer;
      }}
    />
  );
}
