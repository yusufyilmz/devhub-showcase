import { timingSafeEqual } from "node:crypto";

import { env } from "../../../../env";
import { jobsServiceClient } from "../../jobs/_config";
import { runJobDiscovery, sendJobAlerts } from "../../jobs/_discovery-worker";

export const maxDuration = 60;
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  const secret = env.CRON_SECRET;
  const supplied = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (
    !secret ||
    secret.length < 32 ||
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return Response.json({ error: "Access denied." }, { headers, status: 403 });
  }
  try {
    const client = jobsServiceClient();
    const discovery = await runJobDiscovery(client).then(
      (completed) => ({ completed }),
      () => ({ error: "Discovery unavailable." }),
    );
    const delivery = await sendJobAlerts(client).catch(() => ({
      error: "Push delivery unavailable.",
    }));
    const ok = !("error" in discovery) && !(delivery && "error" in delivery);
    return Response.json({ delivery, discovery }, { headers, status: ok ? 200 : 503 });
  } catch {
    return Response.json({ error: "Worker unavailable." }, { headers, status: 503 });
  }
}
