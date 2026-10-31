"use client";
import { PortfolioChat } from "@shared/components/portfolio-chat";
export function PremiumWidget({
  id,
  username,
  name,
  revision,
}: {
  id: string;
  username: string;
  name: string;
  revision: number;
}) {
  return (
    <PortfolioChat
      identity={id}
      name={name}
      revision={revision}
      send={async (message, sessionId, signal) => {
        const result = await fetch("/api/portfolio-chat", {
          body: JSON.stringify({ message, requestId: crypto.randomUUID(), sessionId, username }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
          signal,
        });
        const data = await result.json();
        if (!result.ok || typeof data.answer !== "string") throw new Error("Unavailable");
        return data.answer;
      }}
    />
  );
}
