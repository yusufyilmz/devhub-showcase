"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { z } from "zod";

import { urls } from "@shared/config/urls";

import type { AccountStatus } from "../components/account-overview";
import { billingSummarySchema } from "../features/premium-status";
import type { BillingRequest } from "../types";

export const defaultBillingRequest: BillingRequest = (input, init) => fetch(input, init);

const BillingContext = createContext<BillingRequest | null>(null);

export function BillingProvider({
  children,
  request,
}: {
  children: React.ReactNode;
  request?: BillingRequest;
}) {
  const value = useMemo(() => request ?? defaultBillingRequest, [request]);
  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBillingRequest(): BillingRequest {
  const request = useContext(BillingContext);
  return request ?? defaultBillingRequest;
}

const billingResponse = billingSummarySchema.extend({ aiConfigured: z.boolean() });
const profileResponse = z.object({ id: z.string().min(1), isPublic: z.boolean() });

export function useAccountStatus() {
  const request = useBillingRequest();
  const [data, setData] = useState<AccountStatus | null>(null);
  const [error, showError] = useState("");
  const [loading, setLoading] = useState(true);
  const current = useRef<AbortController | null>(null);
  const refresh = useCallback(() => {
    current.current?.abort();
    const controller = new AbortController();
    current.current = controller;
    setLoading(true);
    showError("");
    Promise.all([
      request(urls.studio.profile(), { cache: "no-store", signal: controller.signal }),
      request(urls.billing.root(), { cache: "no-store", signal: controller.signal }),
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
        showError(
          "Could not load your plan and usage. Refresh status to retry. If this continues, contact the site administrator.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return controller;
  }, [request]);
  useEffect(() => {
    const controller = refresh();
    return () => controller.abort();
  }, [refresh]);
  return { data, error, loading, refresh };
}
