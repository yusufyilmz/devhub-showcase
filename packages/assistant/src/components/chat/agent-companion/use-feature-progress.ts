"use client";

import { useCallback, useEffect, useState } from "react";

import type { AgentFeature, AgentGuide } from "./types";

type Progress = {
  completed: string[];
  features: AgentFeature[];
  scope?: string;
};
const empty: Progress = { completed: [], features: [] };

export function useFeatureProgress(guide?: AgentGuide) {
  const href = guide?.progressHref;
  const requestProgress = guide?.progressRequest ?? fetch;
  const observed = guide?.observed;
  const [progress, setProgress] = useState<Progress>(empty);
  const [loadedAttempt, setLoadedAttempt] = useState(-1);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const loaded = loadedAttempt === retry;

  useEffect(() => {
    if (!href) return;
    const request = new AbortController();
    setError(false);
    void requestProgress(href, { cache: "no-store", signal: request.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Feature progress is unavailable");
        const next = (await response.json()) as Progress;
        setProgress(next);
        setLoadedAttempt(retry);
      })
      .catch(() => {
        if (!request.signal.aborted) setError(true);
      });
    return () => request.abort();
  }, [href, requestProgress, retry]);

  const complete = useCallback(
    async (ids: readonly string[]) => {
      if (!href || !loaded || !ids.length) return;
      try {
        const response = await requestProgress(href, {
          body: JSON.stringify({ ids }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        if (!response.ok) throw new Error("Feature progress is unavailable");
        setProgress((previous) => ({
          ...previous,
          completed: [...new Set([...previous.completed, ...ids])],
        }));
        setError(false);
      } catch {
        setError(true);
      }
    },
    [href, loaded, requestProgress],
  );

  // Observations come from saved data or a feature the user actually opened.
  const pending = observed?.filter((id) => !progress.completed.includes(id)).join(",") ?? "";
  useEffect(() => {
    if (loaded && pending) void complete(pending.split(","));
  }, [complete, loaded, pending]);

  return {
    complete: (id: string) => complete([id]),
    completed: progress.completed,
    error,
    features: progress.features,
    loaded,
    retry: () => setRetry((value) => value + 1),
    scope: progress.scope,
  };
}
