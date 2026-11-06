"use client";

import { type RefObject, useEffect, useState } from "react";

import type { AgentFeature, AgentGuide } from "./types";

const firstDelay = 18000;
const repeatDelay = 75000;
const visibleDuration = 16000;
const empty: readonly AgentFeature[] = [];

export function selectFeatureTip(
  features: readonly AgentFeature[],
  suggestions: readonly AgentFeature[],
  completed: readonly string[],
  shown: readonly string[],
  context: string | undefined,
) {
  const unseen = (feature: AgentFeature) => !shown.includes(feature.id);
  const unfinished = features.filter((feature) => !completed.includes(feature.id));
  return (
    suggestions.find(unseen) ??
    unfinished.find((feature) => feature.context === context && unseen(feature)) ??
    unfinished.find(unseen)
  );
}

type TipSettings = { enabled: boolean; seen: string[]; last: number; day?: string };
const currentDay = () => new Date().toDateString();
const defaults: TipSettings = { enabled: true, last: 0, seen: [] };

function readSettings(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TipSettings>;
    return {
      day: parsed.day,
      enabled: parsed.enabled !== false,
      last: Number(parsed.last) || 0,
      seen:
        parsed.day === currentDay() && Array.isArray(parsed.seen)
          ? parsed.seen.filter((id) => typeof id === "string")
          : [],
    };
  } catch {
    return null;
  }
}

function saveSettings(key: string, value: TipSettings) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The current companion still works when storage is disabled.
  }
}

export function useFeatureTips({
  guide,
  completed,
  blocked,
  bubble,
}: {
  guide?: AgentGuide;
  completed: readonly string[];
  blocked: boolean;
  bubble: RefObject<HTMLDivElement | null>;
}) {
  const key = guide && `agent-companion:${guide.id}:feature-tips`;
  const { context, features = empty, suggestions = empty, paused } = guide ?? {};
  const [settings, setSettings] = useState(defaults);
  const [readyKey, setReadyKey] = useState<string>();
  const [foreground, setForeground] = useState(false);
  const [active, setActive] = useState<{ id: string; context?: string }>();

  useEffect(() => {
    if (!key) return;
    const refresh = () => setSettings(readSettings(key) ?? defaults);
    const visibility = () => {
      const visible = document.visibilityState === "visible";
      setForeground(visible);
      if (visible) refresh();
    };
    const storage = (event: StorageEvent) => {
      if (event.key === key) refresh();
    };
    visibility();
    setReadyKey(key);
    window.addEventListener("storage", storage);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("storage", storage);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [key]);

  const candidate = [...suggestions, ...features].find((feature) => feature.id === active?.id);
  const available = Boolean(
    key && key === readyKey && foreground && settings.enabled && !paused && !blocked,
  );
  const tip =
    available && active?.context === context && !completed.includes(active?.id ?? "")
      ? candidate
      : undefined;

  useEffect(() => {
    if (!tip) setActive(undefined);
  }, [tip]);

  useEffect(() => {
    if (!key || !available || tip) return;
    if (!selectFeatureTip(features, suggestions, completed, settings.seen, context)) return;
    const wait = Math.max(
      firstDelay,
      Math.min(repeatDelay, settings.last + repeatDelay - Date.now()),
    );
    const timer = window.setTimeout(() => {
      if (document.visibilityState !== "visible") return;
      const latest = readSettings(key) ?? settings;
      if (!latest.enabled || Date.now() - latest.last < repeatDelay) {
        setSettings(latest);
        return;
      }
      const next = selectFeatureTip(features, suggestions, completed, latest.seen, context);
      if (!next) return;
      const updated = {
        ...latest,
        day: currentDay(),
        last: Date.now(),
        seen: [...latest.seen, next.id],
      };
      saveSettings(key, updated);
      setSettings(updated);
      setActive({ context, id: next.id });
    }, wait);
    return () => window.clearTimeout(timer);
  }, [available, completed, context, features, key, settings, suggestions, tip]);

  useEffect(() => {
    if (!tip) return;
    const timer = window.setInterval(() => {
      if (!bubble.current?.matches(":hover, :focus-within")) setActive(undefined);
    }, visibleDuration);
    return () => window.clearInterval(timer);
  }, [bubble, tip]);

  return {
    dismiss: () => setActive(undefined),
    enabled: settings.enabled,
    setEnabled(enabled: boolean) {
      if (!key) return;
      const updated = { ...(readSettings(key) ?? settings), enabled };
      saveSettings(key, updated);
      setSettings(updated);
      if (!enabled) setActive(undefined);
    },
    tip,
  };
}
