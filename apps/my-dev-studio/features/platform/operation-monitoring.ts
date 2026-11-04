import { createHmac } from "node:crypto";

import { logger } from "@shared/utils/logger";
import { type Operation, type OperationEvent, startOperation } from "@shared/utils/monitoring";

async function report(event: OperationEvent) {
  if (event.outcome === "failure") logger.error(event, "Operation failed");
  else logger.info(event, "Operation completed");
  if (event.outcome !== "failure") return;
  const endpoint = process.env.MONITORING_WEBHOOK_URL;
  const secret = process.env.MONITORING_WEBHOOK_SECRET;
  if (!endpoint || !secret) return;
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" || url.username || url.password || secret.length < 32)
      throw new Error("Invalid monitoring configuration");
    const body = JSON.stringify(event);
    const response = await fetch(url, {
      body,
      headers: {
        "Content-Type": "application/json",
        "X-Monitoring-Signature": createHmac("sha256", secret).update(body).digest("hex"),
      },
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(2000),
    });
    await response.body?.cancel();
    if (!response.ok) throw new Error("Delivery failed");
  } catch {
    logger.warn(
      { event: "monitoring.delivery_failed", requestId: event.requestId },
      "Monitoring delivery failed",
    );
  }
}
export function operationSpan(operation: Operation) {
  return startOperation(operation, report);
}

export function monitored<Args extends unknown[]>(
  operation: Operation,
  handler: (...args: Args) => Response | Promise<Response>,
) {
  return async (...args: Args): Promise<Response> => {
    const span = operationSpan(operation);
    let response: Response;
    try {
      response = await handler(...args);
    } catch {
      response = Response.json(
        { error: "Operation unavailable. Please try again." },
        { headers: { "Cache-Control": "private, no-store" }, status: 500 },
      );
    }
    await span.finish(response.status, args[0] instanceof Request && args[0].signal.aborted);
    const headers = new Headers(response.headers);
    headers.set("X-Request-ID", span.requestId);
    if (
      response.status >= 500 &&
      response.headers.get("content-type")?.includes("application/json")
    ) {
      const data: unknown = await response
        .clone()
        .json()
        .catch(() => null);
      if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
        headers.delete("Content-Length");
        return Response.json(
          {
            ...data,
            error: `${data.error} Reference: ${span.requestId}`,
            requestId: span.requestId,
          },
          { headers, status: response.status },
        );
      }
    }
    return new Response(response.body, {
      headers,
      status: response.status,
      statusText: response.statusText,
    });
  };
}
