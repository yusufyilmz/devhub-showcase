"use client";
import { useEffect, useRef, useState } from "react";

import { validateWorkspace, type Workspace, workspaceSchema } from "@shared/services/types";

import { watchSession } from "@/lib/browser-session";

import type { WorkspaceGateway } from "./gateway";
export function useTaskWorkspace(gateway: WorkspaceGateway, initial: Workspace) {
  const [state, setState] = useState(initial);
  const [revision, setRevision] = useState(0);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [undo, setUndo] = useState<Workspace | null>(null);
  const lock = useRef(false);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const r = await gateway.load();
        if (active) {
          setState(r.state);
          setRevision(r.revision);
          setReady(true);
          setError("");
        }
      } catch (e) {
        if (active) setError((e as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    }
    run(load());
    const refresh = () => {
      if (gateway.readOnly && !lock.current && !document.hidden) run(load());
    };
    const authChanged = (event: StorageEvent) => {
      if (event.key === null || event.key.includes("-auth-token")) run(load());
    };
    const stopSessionWatch = watchSession(() => run(load()));
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("storage", authChanged);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("storage", authChanged);
      stopSessionWatch();
    };
  }, [gateway]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);
  async function save(next: Workspace, label = "Saved", remember = true) {
    if (gateway.readOnly || lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const parsed = workspaceSchema.parse(next);
      validateWorkspace(parsed);
      const r = await gateway.save(parsed, revision);
      setUndo(remember ? state : null);
      setState(parsed);
      setRevision(r);
      setMessage(label);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
      lock.current = false;
    }
  }
  function update(action: (state: Workspace) => Workspace, label = "Saved") {
    if (gateway.readOnly || lock.current) return;
    try {
      run(save(action(state), label));
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return {
    busy,
    error,
    loading,
    message,
    readOnly: gateway.readOnly,
    ready,
    revision,
    save,
    setError,
    state,
    undo: undo ? () => run(save(undo, "Change undone", false)) : null,
    update,
  };
}
export type WorkspaceController = ReturnType<typeof useTaskWorkspace>;

function run(work: Promise<unknown>) {
  work.catch(() => undefined);
}
