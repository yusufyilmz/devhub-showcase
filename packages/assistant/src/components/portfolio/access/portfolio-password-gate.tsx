"use client";

import { PasswordGate } from "../index";

export function PortfolioPasswordGate({ username }: { username: string }) {
  return (
    <PasswordGate
      unlock={async (password) => {
        const response = await fetch(`/api/portfolio-access/${encodeURIComponent(username)}`, {
          body: JSON.stringify({ password }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        if (!response.ok) {
          const result: unknown = await response.json();
          const message =
            result &&
            typeof result === "object" &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "Could not unlock this portfolio.";
          throw new Error(message);
        }
        window.location.replace(`/${encodeURIComponent(username)}`);
      }}
    />
  );
}
