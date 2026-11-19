"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { draftStorage } from "@shared/runtime/storage";

import { readRecovery } from "./storage";
import type { RecoveryOptions, RecoveryRecord, RecoveryStatus } from "./types";

export function useDraftRecovery(options: RecoveryOptions) {
  const { storageKey, revision, value, dirty } = options;
  const latest = useRef(options);
  latest.current = options;
  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [candidate, setCandidate] = useState<RecoveryRecord | null>(null);
  const [remoteRevision, setRemoteRevision] = useState(revision);
  const ready = useRef(false);
  const paused = useRef(false);
  const serialized = JSON.stringify(value);
  useEffect(() => {
    ready.current = false;
    paused.current = false;
    setCandidate(null);
    setRemoteRevision(latest.current.revision);
    if (!storageKey) return;
    const raw = draftStorage.read(storageKey);
    const record = readRecovery(raw ?? null);
    if (record && JSON.stringify(record.value) !== JSON.stringify(latest.current.value)) {
      paused.current = true;
      setCandidate(record);
    }
    const available =
      raw !== undefined && (!raw || paused.current || draftStorage.remove(storageKey));
    setStatus(available ? "idle" : "failed");
    ready.current = true;
    const channel = revisionChannel(storageKey);
    const received = (event: MessageEvent) => {
      if (Number.isInteger(event.data) && event.data > latest.current.revision)
        setRemoteRevision(event.data);
    };
    channel?.addEventListener("message", received);
    return () => channel?.close();
  }, [storageKey]);
  const write = useCallback(() => {
    if (!ready.current || paused.current) return;
    const current = latest.current;
    if (!current.dirty && current.value.step === "done") return;
    setStatus("saving");
    try {
      const raw = JSON.stringify({
        at: Date.now(),
        revision: current.revision,
        value: current.value,
        version: 1,
      });
      setStatus(
        raw.length <= 250000 && draftStorage.write(current.storageKey, raw) ? "saved" : "failed",
      );
    } catch {
      setStatus("failed");
    }
  }, []);
  useEffect(() => {
    if (!storageKey || !ready.current || paused.current || (!dirty && value.step === "done"))
      return;
    if (serialized.length > 250000) {
      setStatus("failed");
      return;
    }
    setStatus("pending");
    const timer = setTimeout(write, 500);
    return () => clearTimeout(timer);
  }, [storageKey, serialized, dirty, value.step, write]);
  useEffect(() => {
    window.addEventListener("pagehide", write);
    return () => {
      window.removeEventListener("pagehide", write);
      write();
    };
  }, [write]);
  const discard = () => {
    if (!draftStorage.remove(storageKey)) {
      setStatus("failed");
      return;
    }
    paused.current = false;
    setCandidate(null);
    setStatus("idle");
  };
  const saved = (nextRevision: number) => {
    discard();
    setRemoteRevision(nextRevision);
    const channel = revisionChannel(storageKey);
    try {
      channel?.postMessage(nextRevision);
    } catch {
      /* Optional notification; server revision checks remain authoritative. */
    } finally {
      channel?.close();
    }
  };
  const stale = remoteRevision > revision || Boolean(candidate && candidate.revision !== revision);
  return {
    candidate,
    conflict: () => setRemoteRevision(revision + 1),
    discard,
    restore: () => {
      if (!candidate || stale) return;
      options.onRestore(candidate.value);
      paused.current = false;
      setCandidate(null);
      setStatus("saved");
    },
    retry: write,
    saved,
    stale,
    status,
    stop: () => {
      paused.current = true;
      ready.current = false;
    },
  };
}

function revisionChannel(key: string): BroadcastChannel | null {
  try {
    return typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(key);
  } catch {
    return null;
  }
}
