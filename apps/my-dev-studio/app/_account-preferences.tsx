"use client";

import { useEffect, useState } from "react";

import { accountPreferenceSession, cleanThemePreferences } from "@shared/runtime/storage";
import { useThemeStore } from "@shared/runtime/user";

function themeValues(values: Record<string, unknown>) {
  const mode = values.mode;
  return {
    activeMode: mode === "light" || mode === "dark" || mode === "system" ? mode : null,
    themePreferences: cleanThemePreferences(
      Object.fromEntries(
        Object.entries(values)
          .filter(([key]) => key.startsWith("theme:"))
          .map(([key, value]) => [key.slice(6), value]),
      ),
    ),
  } as const;
}

type Theme = ReturnType<typeof useThemeStore.getState>;
function themePatch(next: Theme, previous: Theme) {
  const patch: Record<string, unknown> = {};
  if (next.activeMode !== previous.activeMode) patch.mode = next.activeMode;
  for (const key of new Set([
    ...Object.keys(previous.themePreferences),
    ...Object.keys(next.themePreferences),
  ])) {
    const name = key as keyof typeof next.themePreferences;
    if (next.themePreferences[name] !== previous.themePreferences[name])
      patch[`theme:${key}`] = next.themePreferences[name] ?? null;
  }
  return patch;
}

export function AccountPreferences() {
  const [saveError, setSaveError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let accountId: string | undefined;
    let pending: Record<string, unknown> = {};
    let writing = false;
    let refreshing = false;
    let applying = false;

    const reportError = (failed: boolean) => {
      if (!controller.signal.aborted) setSaveError(failed);
    };

    async function save() {
      if (writing || !accountId || !Object.keys(pending).length) return;
      const patch = pending;
      pending = {};
      writing = true;
      try {
        const response = await fetch("/api/account-preferences", {
          body: JSON.stringify({ accountId, preferences: patch }),
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          method: "PATCH",
        });
        if (!response.ok) throw new Error("Preferences were not saved");
        reportError(false);
      } catch {
        pending = { ...patch, ...pending };
        reportError(true);
        return;
      } finally {
        writing = false;
      }
      save();
    }

    function queue(patch: Record<string, unknown>) {
      pending = { ...pending, ...patch };
      save();
    }

    const hasChanges = () => writing || Object.keys(pending).length > 0;
    const canApply = () => !controller.signal.aborted && !hasChanges();

    async function refresh() {
      if (refreshing || hasChanges()) return;
      refreshing = true;
      try {
        const response = await fetch("/api/account-preferences", { signal: controller.signal });
        if (!response.ok || !canApply()) return;
        const data = await response.json();
        if (!canApply()) return;
        accountId = data.accountId;
        applying = true;
        accountPreferenceSession.load(data.preferences);
        useThemeStore.setState(themeValues(data.preferences));
      } catch {
        // Guest preferences stay available if the account endpoint cannot be reached.
      } finally {
        applying = false;
        refreshing = false;
      }
    }

    const stopCompanion = accountPreferenceSession.onChange(queue);
    const stopTheme = useThemeStore.subscribe((next, previous) => {
      if (!accountId || applying) return;
      const patch = themePatch(next, previous);
      if (Object.keys(patch).length) queue(patch);
    });

    function onFocus() {
      if (Object.keys(pending).length) save();
      else refresh();
    }
    refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      controller.abort();
      stopTheme();
      stopCompanion();
      window.removeEventListener("focus", onFocus);
      if (accountId) {
        accountPreferenceSession.load(undefined);
        useThemeStore.persist.rehydrate();
      }
    };
  }, []);

  return saveError ? (
    <p role="status">Account preferences could not sync. Return to this tab to retry.</p>
  ) : null;
}
