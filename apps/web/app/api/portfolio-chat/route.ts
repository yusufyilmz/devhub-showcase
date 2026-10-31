import { sameOrigin } from "@/lib/admin-auth";
import { answerPremiumChat } from "@/lib/premium-chat";
export const maxDuration = 60;
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 8000)
      return Response.json({ error: "Message too large." }, { headers, status: 413 });
    const result = await answerPremiumChat(
      JSON.parse(raw),
      AbortSignal.any([request.signal, AbortSignal.timeout(45000)]),
    );
    return Response.json(result, { headers });
  } catch {
    return Response.json(
      { error: "Chat is unavailable or its allowance has been reached. Please try later." },
      { headers, status: 503 },
    );
  }
}
