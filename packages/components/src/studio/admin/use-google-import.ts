"use client";

import { useEffect, useRef, useState } from "react";

import { z } from "zod";

import {
  type GoogleConsent,
  loadGoogleConsent,
  requestGoogleProfileConsent,
} from "@shared/auth/google-consent";
import type { GoogleProfileCategory } from "@shared/auth/google-profile-scopes";
import { type GoogleProfileReview, googleProfileReviewSchema } from "@shared/lib/google-profile";

import { type StudioRequest, useStudioRequest } from "../context/studio-request";

const setupSchema = z.object({ clientId: z.string().nullable(), enabled: z.boolean() });
export function useGoogleImport() {
  const request = useStudioRequest();
  const [clientId, setClientId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [oauth, setOauth] = useState<GoogleConsent | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, showError] = useState("");
  const [review, setReview] = useState<GoogleProfileReview | null>(null);
  const current = useRef(0);
  const pending = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    request("/api/admin/google-profile", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        return setupSchema.parse(await response.json());
      })
      .then((data) => {
        if (!controller.signal.aborted) setClientId(data.enabled ? data.clientId : null);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          showError("Could not check Google import setup. Try reopening this tab.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });
    return () => {
      mounted.current = false;
      current.current++;
      controller.abort();
      pending.current?.abort();
    };
  }, [request]);
  async function prepare() {
    setPreparing(true);
    showError("");
    try {
      const library = await loadGoogleConsent();
      if (mounted.current) setOauth(library);
    } catch {
      if (mounted.current)
        showError(
          "Google permission screen could not load. Retry, or enter your details manually.",
        );
    } finally {
      if (mounted.current) setPreparing(false);
    }
  }
  function cancel() {
    current.current++;
    pending.current?.abort();
    setBusy(false);
    setReview(null);
  }
  function connect(categories: GoogleProfileCategory[]) {
    if (!oauth || !clientId || busy) return;
    const id = ++current.current;
    showError("");
    setReview(null);
    setBusy(true);
    const fail = (
      message = "Google permission was not completed. You can retry or continue manually.",
    ) => {
      if (id !== current.current || !mounted.current) return;
      setBusy(false);
      showError(message);
    };
    try {
      requestGoogleProfileConsent(oauth, {
        categories,
        clientId,
        onError: fail,
        onToken: (token, granted) => {
          const active = () => id === current.current && mounted.current;
          if (!active()) return;
          const controller = new AbortController();
          pending.current = controller;
          readSelectedDetails(request, token, granted, controller.signal)
            .then((data) => {
              if (active()) setReview(data);
            })
            .catch(() => {
              if (!controller.signal.aborted)
                fail(
                  "Google profile could not be read. Permission may have expired or the site may need People API setup. You can continue manually.",
                );
            })
            .finally(() => {
              if (active()) setBusy(false);
            });
        },
      });
    } catch {
      fail();
    }
  }
  return {
    busy,
    cancel,
    checking,
    clientId,
    connect,
    error,
    oauth,
    prepare,
    preparing,
    review,
    setReview,
  };
}

async function readSelectedDetails(
  request: StudioRequest,
  token: string,
  categories: GoogleProfileCategory[],
  signal: AbortSignal,
) {
  const response = await request("/api/admin/google-profile", {
    body: JSON.stringify({ categories, token }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
    signal,
  });
  if (!response.ok) throw new Error("Unavailable");
  return googleProfileReviewSchema.parse(await response.json());
}
