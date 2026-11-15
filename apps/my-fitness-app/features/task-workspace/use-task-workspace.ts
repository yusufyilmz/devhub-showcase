"use client";
import { useEffect, useRef, useState } from "react";

import { validateWorkspace, type Workspace, workspaceSchema } from "@shared/lib/types";

import { watchSession } from "@/lib/browser-session";

import type { WorkspaceGateway } from "./gateway";
export function useTaskWorkspace(gateway: WorkspaceGateway, initial: Workspace, demo: boolean) {
  const [state, setState] = useState(initial);
  const [revision, setRevision] = useState(0);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [undo, setUndo] = useState<Workspace | null>(null);
  const lock = useRef(false);
  const currentRevision = useRef(0);
  const remoteRevision = useRef(0);
  useEffect(() => {
    const pending = new AbortController();
    let active = true;
    let stopLive: () => void = () => undefined;
    function startLive() {
      if (gateway.readOnly || !gateway.subscribe) return;
      stopLive = gateway.subscribe({
        message: (notification) => {
          if (active) setMessage(notification.body);
        },
        revision: (revision) => {
          if (!active || revision <= currentRevision.current) return;
          remoteRevision.current = revision;
          if (!lock.current)
            setError(
              "Your saved workspace changed on another device. Reload before saving; your current view has not been overwritten.",
            );
        },
      });
    }
    async function load() {
      try {
        const r = await gateway.load(pending.signal);
        if (active) {
          setState(r.state);
          setRevision(r.revision);
          currentRevision.current = r.revision;
          startLive();
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
    function openSession(userId: string | null) {
      active = false;
      pending.abort();
      stopLive();
      setReady(false);
      setLoading(true);
      window.location.replace(userId ? window.location.href : "/login");
    }
    const stopSessionWatch = demo ? () => undefined : watchSession(openSession);
    const restorePage = (event: PageTransitionEvent) => {
      if (!demo && event.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", restorePage);
    return () => {
      active = false;
      pending.abort();
      window.removeEventListener("pageshow", restorePage);
      stopSessionWatch();
      stopLive();
    };
  }, [demo, gateway]);
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
      currentRevision.current = r;
      setMessage(label);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
      lock.current = false;
      if (remoteRevision.current > currentRevision.current)
        setError("Your saved workspace changed on another device. Reload before saving.");
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
