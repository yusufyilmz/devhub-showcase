// Simple metrics helpers to track WebSocket usage for debugging.
// - Tab connections (sessionStorage): number of active WS wrappers in this tab
// - Server connections (localStorage): number of native WebSocket connections (no SharedWorker)
// - Shared flag (localStorage): whether the SharedWorker's server connection is open

import { logger } from "../logger/client";

const TAB_COUNT_KEY = "ws:tab:count";
const SERVER_COUNT_KEY = "ws:server:count";
const SHARED_OPEN_KEY = "ws:shared:open";
const EVENT_NAME = "ws-metrics";
const SHARED_CLIENTS_KEY = "ws:shared:clients";
// Chat/Drawing specific keys
const CHAT_CREATED_KEY = "ws:chat:created";
const DRAW_CREATED_KEY = "ws:drawing:created";
const DRAW_CLIENTS_KEY = "ws:drawing:clients";

function safeParseInt(v: string | null, fallback = 0) {
  const n = Number.parseInt(v || "0", 10);
  return Number.isFinite(n) ? n : fallback;
}

function emit() {
  const detail = {
    serverCount: getServerCount(),
    sharedOpen: getSharedOpen(),
    tabCount: getTabCount(),
  };
  try {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
  } catch {
    logger("wsMetrics").error("Error emitting");
  }
}

export function getTabCount() {
  if (typeof window === "undefined") return 0;
  try {
    return safeParseInt(window.sessionStorage.getItem(TAB_COUNT_KEY));
  } catch {
    return 0;
  }
}

export function getServerCount() {
  if (typeof window === "undefined") return 0;
  try {
    return safeParseInt(window.localStorage.getItem(SERVER_COUNT_KEY));
  } catch {
    return 0;
  }
}

export function getSharedOpen() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SHARED_OPEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function getSharedClients() {
  if (typeof window === "undefined") return 0;
  try {
    return safeParseInt(window.localStorage.getItem(SHARED_CLIENTS_KEY));
  } catch {
    return 0;
  }
}

export function incTabConnections() {
  if (typeof window === "undefined") return;
  try {
    const v = getTabCount() + 1;
    window.sessionStorage.setItem(TAB_COUNT_KEY, String(v));
    emit();
  } catch {
    logger("wsMetrics").error("Error incrementing tab connections");
  }
}

export function decTabConnections() {
  if (typeof window === "undefined") return;
  try {
    const v = Math.max(0, getTabCount() - 1);
    window.sessionStorage.setItem(TAB_COUNT_KEY, String(v));
    emit();
  } catch {
    logger("wsMetrics").error("Error decrementing tab connections");
  }
}

export function resetTabConnections() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(TAB_COUNT_KEY, "0");
    emit();
  } catch {
    logger("wsMetrics").error("Error resetting tab connections");
  }
}

export function incServerConnections() {
  if (typeof window === "undefined") return;
  try {
    const v = getServerCount() + 1;
    window.localStorage.setItem(SERVER_COUNT_KEY, String(v));
    emit();
  } catch {
    logger("Wsmetrics").error("Error incrementing server connections");
  }
}

export function decServerConnections() {
  if (typeof window === "undefined") return;
  try {
    const v = Math.max(0, getServerCount() - 1);
    window.localStorage.setItem(SERVER_COUNT_KEY, String(v));
    emit();
  } catch {
    logger("Wsmetrics").error("Error decrementing server connections");
  }
}

export function resetServerConnections() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SERVER_COUNT_KEY, "0");
    emit();
  } catch {
    logger("Wsmetrics").error("Error resetting server connections");
  }
}

export function setSharedOpen(open: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SHARED_OPEN_KEY, open ? "1" : "0");
    emit();
  } catch {
    logger("Wsmetrics").error("Error setting shared open");
  }
}

export function setSharedClients(count: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SHARED_CLIENTS_KEY, String(Math.max(0, count)));
    emit();
  } catch {
    logger("Wsmetrics").error("Error setting shared clients");
  }
}

export function subscribe(
  handler: (state: { tabCount: number; serverCount: number; sharedOpen: boolean }) => void,
) {
  if (typeof window === "undefined")
    return () => {
      logger("Wsmetrics").error("Error subscribing");
    };

  const onStorage = (e: StorageEvent) => {
    if (
      !e.key ||
      ![
        SERVER_COUNT_KEY,
        SHARED_OPEN_KEY,
        SHARED_CLIENTS_KEY,
        CHAT_CREATED_KEY,
        DRAW_CREATED_KEY,
        DRAW_CLIENTS_KEY,
      ].includes(e.key)
    )
      return;
    handler({
      serverCount: getServerCount(),
      sharedOpen: getSharedOpen(),
      tabCount: getTabCount(),
    });
  };
  const onCustom = (e: any) => {
    handler(
      e.detail || {
        serverCount: getServerCount(),
        sharedOpen: getSharedOpen(),
        tabCount: getTabCount(),
      },
    );
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT_NAME, onCustom as any);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT_NAME, onCustom as any);
  };
}

// Drawing metrics helpers (parallel to chat)
export function setDrawSharedClients(count: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAW_CLIENTS_KEY, String(Math.max(0, count)));
    emit();
  } catch {
    logger("Wsmetrics").error("Error setting draw shared clients");
  }
}
export function getDrawSharedClients() {
  if (typeof window === "undefined") return 0;
  try {
    return safeParseInt(window.localStorage.getItem(DRAW_CLIENTS_KEY));
  } catch {
    return 0;
  }
}

// Created totals (set by workers via page listeners)
export function setChatCreatedTotal(count: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAT_CREATED_KEY, String(Math.max(0, count)));
    emit();
  } catch {
    logger("Wsmetrics").error("Error setting chat created total");
  }
}
export function getChatCreatedTotal() {
  if (typeof window === "undefined") return 0;
  try {
    return safeParseInt(window.localStorage.getItem(CHAT_CREATED_KEY));
  } catch {
    return 0;
  }
}
export function setDrawingCreatedTotal(count: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAW_CREATED_KEY, String(Math.max(0, count)));
    emit();
  } catch {
    logger("Wsmetrics").error("Error setting drawing created total");
  }
}
export function getDrawingCreatedTotal() {
  if (typeof window === "undefined") return 0;
  try {
    return safeParseInt(window.localStorage.getItem(DRAW_CREATED_KEY));
  } catch {
    return 0;
  }
}
