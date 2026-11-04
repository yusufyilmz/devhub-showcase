"use client";

import { AccountSupport, type SupportProps } from "@shared/ui/support";

const endpoint = "/api/support";
async function response(request: Promise<Response>) {
  const result = await request;
  if (!result.ok) throw new Error("Support unavailable");
  return result.json();
}
const load: SupportProps["load"] = (after) =>
  response(
    fetch(after ? `${endpoint}?after=${encodeURIComponent(after)}` : endpoint, {
      cache: "no-store",
    }),
  );
const inspect: SupportProps["inspect"] = (account) =>
  response(fetch(`${endpoint}?account=${encodeURIComponent(account)}`, { cache: "no-store" }));
const disable: SupportProps["disable"] = async (account, reason, requestId) => {
  await response(
    fetch(endpoint, {
      body: JSON.stringify({
        account,
        action: "disable_visitor_chat",
        confirmed: true,
        reason,
        requestId,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
  );
};
export function SupportClient() {
  return <AccountSupport disable={disable} inspect={inspect} load={load} />;
}
