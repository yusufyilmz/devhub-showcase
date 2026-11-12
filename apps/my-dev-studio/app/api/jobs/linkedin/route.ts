import { timingSafeEqual } from "node:crypto";

import { z } from "zod";

import { extractLinkedInAlert } from "@shared/lib/services/jobs";

import { jobAlertConfig, jobsServiceClient } from "../_config";

const envelope = z.object({
  html: z.string().max(200_000).default(""),
  recipient: z.email().max(254),
  text: z.string().max(100_000).default(""),
  verifiedSender: z.email().max(254),
});
const headers = { "Cache-Control": "private, no-store" };

async function readBounded(request: Request) {
  const reader = request.body?.getReader();
  const decoder = new TextDecoder();
  let raw = "";
  let bytes = 0;
  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 350_000) {
      await reader.cancel();
      return null;
    }
    raw += decoder.decode(value, { stream: true });
  }
  return raw + decoder.decode();
}

export async function POST(request: Request) {
  const config = jobAlertConfig();
  const supplied = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${config?.secret}`);
  if (!config || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return new Response(null, { headers, status: 403 });
  }
  try {
    const raw = await readBounded(request);
    if (raw === null) return new Response(null, { headers, status: 413 });
    const message = envelope.safeParse(JSON.parse(raw));
    if (!message.success) return new Response(null, { headers, status: 400 });
    const [recipient, domain] = message.data.recipient.toLowerCase().split("@");
    const token = z.uuid().safeParse(recipient?.slice("alerts+".length));
    if (domain !== config.domain || !recipient?.startsWith("alerts+") || !token.success) {
      return new Response(null, { headers, status: 202 });
    }
    const candidates = extractLinkedInAlert(message.data.text, message.data.html);
    if (candidates.length) {
      const { error } = await jobsServiceClient().rpc("enqueue_linkedin_alert", {
        address_token: token.data,
        candidates,
        verified_sender: message.data.verifiedSender,
      });
      if (error) return new Response(null, { headers, status: 503 });
    }
    return new Response(null, { headers, status: 202 });
  } catch (error) {
    return new Response(null, { headers, status: error instanceof SyntaxError ? 400 : 503 });
  }
}
