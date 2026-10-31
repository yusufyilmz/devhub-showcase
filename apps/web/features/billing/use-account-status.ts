"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { billingSummarySchema } from "@shared/lib/billing";
import { z } from "zod";

import type { AccountStatus } from "./account-overview";

const billingResponse = billingSummarySchema.extend({ aiConfigured: z.boolean() });
const profileResponse = z.object({ id: z.string().min(1), isPublic: z.boolean() });
export function useAccountStatus() {
  const [data, setData] = useState<AccountStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const request = useRef<AbortController | null>(null);
  const refresh = useCallback(() => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");
    Promise.all([
      fetch("/api/admin/profile", { cache: "no-store", signal: controller.signal }),
      fetch("/api/admin/billing", { cache: "no-store", signal: controller.signal }),
    ])
      .then(async ([profile, billing]) => {
        if (!profile.ok || !billing.ok) throw new Error("Unavailable");
        const [p, b] = await Promise.all([profile.json(), billing.json()]);
        const parsed = billingResponse.parse(b);
        if (!controller.signal.aborted)
          setData({
            aiConfigured: parsed.aiConfigured,
            billing: parsed,
            profile: profileResponse.parse(p),
          });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setData(null);
        setError(
          "Could not load your plan and usage. Refresh status to retry. If this continues, contact the site administrator.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return controller;
  }, []);
  useEffect(() => {
    const controller = refresh();
    return () => controller.abort();
  }, [refresh]);
  return { data, error, loading, refresh };
}
