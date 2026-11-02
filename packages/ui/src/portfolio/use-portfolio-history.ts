"use client";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { PortfolioProfile } from "@shared/config";

import type { PortfolioHistoryState } from "./types";

export function usePortfolioHistory(initial: PortfolioProfile, disabled = false) {
  const [history, setHistory] = useState<PortfolioHistoryState>({
    future: [],
    past: [],
    present: initial,
  });
  const current = useRef(history);
  const typing = useRef<{ element: Element | null; at: number }>({ at: 0, element: null });
  const commit = useCallback((next: PortfolioHistoryState) => {
    current.current = next;
    setHistory(next);
  }, []);
  const setDraft: Dispatch<SetStateAction<PortfolioProfile>> = useCallback(
    (action) => {
      const h = current.current;
      const next = typeof action === "function" ? action(h.present) : action;
      if (JSON.stringify(next) === JSON.stringify(h.present)) return;
      const element = document.activeElement;
      const text = element?.matches(
        'textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="file"])',
      );
      const grouped =
        text && element === typing.current.element && Date.now() - typing.current.at < 700;
      typing.current = { at: Date.now(), element: text ? element : null };
      commit({
        future: [],
        past: grouped ? h.past : [...h.past, h.present].slice(-100),
        present: next,
      });
    },
    [commit],
  );
  const resetDraft: Dispatch<SetStateAction<PortfolioProfile>> = useCallback(
    (action) => {
      typing.current = { at: 0, element: null };
      commit({
        future: [],
        past: [],
        present: typeof action === "function" ? action(current.current.present) : action,
      });
    },
    [commit],
  );
  const undo = useCallback(() => {
    const h = current.current;
    const previous = h.past.at(-1);
    if (!previous) return;
    typing.current = { at: 0, element: null };
    commit({ future: [h.present, ...h.future], past: h.past.slice(0, -1), present: previous });
  }, [commit]);
  const redo = useCallback(() => {
    const h = current.current;
    const next = h.future[0];
    if (!next) return;
    typing.current = { at: 0, element: null };
    commit({ future: h.future.slice(1), past: [...h.past, h.present], present: next });
  }, [commit]);
  useEffect(() => {
    if (disabled) return;
    const keydown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        !(event.metaKey || event.ctrlKey) ||
        event.altKey ||
        event.key.toLowerCase() !== "z"
      )
        return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest('input, textarea, [contenteditable="true"], [role="dialog"]')
      )
        return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [disabled, redo, undo]);
  return {
    canRedo: history.future.length > 0,
    canUndo: history.past.length > 0,
    draft: history.present,
    redo,
    resetDraft,
    setDraft,
    undo,
  };
}
