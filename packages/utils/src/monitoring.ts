import { randomUUID } from "node:crypto";

export type Operation =
  | "publication.change"
  | "publication.schedule"
  | "publication.worker"
  | "billing.checkout"
  | "billing.portal"
  | "billing.webhook"
  | "ai.edit"
  | "ai.chat"
  | "ai.premium_chat";
export type OperationEvent = {
  event: "operation.completed";
  requestId: string;
  operation: Operation;
  outcome: "success" | "rejected" | "failure" | "cancelled";
  status: number;
  durationMs: number;
};
export type OperationSink = (event: OperationEvent) => void | Promise<void>;

// This API deliberately accepts no request, body, identity or exception context.
export function startOperation(operation: Operation, sink: OperationSink) {
  const requestId = randomUUID();
  const started = performance.now();
  let recorded = false;
  return {
    async finish(status: number, cancelled = false) {
      if (recorded) return;
      recorded = true;
      const outcome = cancelled
        ? "cancelled"
        : status >= 500
          ? "failure"
          : status >= 400
            ? "rejected"
            : "success";
      try {
        await sink({
          durationMs: Math.max(0, Math.round(performance.now() - started)),
          event: "operation.completed",
          operation,
          outcome,
          requestId,
          status,
        });
      } catch {
        // Monitoring must never change the operation result or trigger a business retry.
      }
    },
    requestId,
  };
}
