import { z } from "zod";

import { PortfolioChatModel } from "@shared/assistant";

import { sameOrigin } from "@/features/admin/admin-auth";
import { requireLegacyChat } from "@/features/chat/portfolio-chat";
import { operationSpan } from "@/features/platform/operation-monitoring";

export const maxDuration = 60;
const inputSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  sessionId: z.uuid(),
  username: z.string().max(100),
});

export async function POST(request: Request) {
  const span = operationSpan("ai.chat");
  const headers = { "Cache-Control": "private, no-store", "X-Request-ID": span.requestId };
  if (!sameOrigin(request)) {
    await span.finish(403);
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  }
  const controller = new AbortController();
  const signal = AbortSignal.any([request.signal, controller.signal, AbortSignal.timeout(45000)]);
  try {
    if (Number(request.headers.get("content-length")) > 12000) throw new Error("Too large");
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 12000) {
        await reader.cancel();
        throw new Error("Too large");
      }
      chunks.push(part.value);
    }
    const input = inputSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    const { knowledge } = await requireLegacyChat(input.username, input.sessionId);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      cancel() {
        controller.abort();
        return span.finish(499, true);
      },
      start(output) {
        const send = (event: unknown) => {
          if (!signal.aborted) output.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        };
        new PortfolioChatModel()
          .answer(knowledge, input.message, signal, (text) => send({ text, type: "delta" }))
          .then(async (answer) => {
            send({ answer, type: "done" });
            await span.finish(200, signal.aborted);
          })
          .catch(async () => {
            send({
              error: `Chat unavailable. Please try again. Reference: ${span.requestId}`,
              requestId: span.requestId,
              type: "error",
            });
            await span.finish(503, request.signal.aborted || controller.signal.aborted);
          })
          .finally(() => {
            if (!controller.signal.aborted) output.close();
          });
      },
    });
    return new Response(stream, {
      headers: { ...headers, "Content-Type": "application/x-ndjson", "X-Accel-Buffering": "no" },
    });
  } catch {
    await span.finish(400, request.signal.aborted);
    return Response.json(
      { error: "Chat unavailable or request invalid." },
      { headers, status: 400 },
    );
  }
}
