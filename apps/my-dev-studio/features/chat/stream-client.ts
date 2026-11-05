"use client";

function consumeEvent(line: string, onDelta: (text: string) => void): string | undefined {
  const event = JSON.parse(line);
  if (event.type === "error") throw new Error("Chat unavailable. Please try later.");
  if (event.type === "delta" && typeof event.text === "string") onDelta(event.text);
  if (event.type === "done" && typeof event.answer === "string") return event.answer;
  return undefined;
}

export async function streamPortfolioAnswer(
  username: string,
  sessionId: string,
  message: string,
  onDelta: (text: string) => void,
  signal?: AbortSignal,
) {
  const deadline = AbortSignal.timeout(50000);
  const response = await fetch("/api/chat/stream", {
    body: JSON.stringify({ message, sessionId, username }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
    signal: signal ? AbortSignal.any([signal, deadline]) : deadline,
  });
  if (!response.ok || !response.body) throw new Error("Chat unavailable. Please try later.");
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let answer: string | undefined;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      buffer += part.value;
      let boundary = buffer.indexOf("\n");
      while (boundary >= 0) {
        const completed = consumeEvent(buffer.slice(0, boundary), onDelta);
        buffer = buffer.slice(boundary + 1);
        if (completed !== undefined) answer = completed;
        boundary = buffer.indexOf("\n");
      }
    }
    if (!answer) throw new Error("The response was interrupted. Please try again.");
    return answer;
  } finally {
    await reader.cancel();
  }
}
