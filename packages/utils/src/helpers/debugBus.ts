// Lightweight debug event bus for dev-time instrumentation
// Emits CustomEvents on window so any component (e.g., DebugPanel) can subscribe.

type WsDir = "in" | "out";
type HttpDir = "out" | "in";
type DataWorkerDir = "in" | "out";

export interface WsLog {
  data?: unknown;
  dir: WsDir;
  raw?: string;
  source?: "chat" | "video" | "other";
  ts: string;
}

export interface HttpLog {
  dir: HttpDir;
  method?: string;
  ok?: boolean;
  req?: unknown;
  res?: unknown;
  status?: number;
  ts: string;
  url?: string;
}

export interface DataWorkerLog {
  action?: string;
  data?: unknown;
  dir: DataWorkerDir;
  error?: unknown;
  message?: string;
  payload?: unknown;
  requestId?: string;
  ts: string;
  type?: string;
}

const dispatch = (name: string, detail: any) => {
  try {
    if (typeof window === "undefined" || !window.dispatchEvent) return;
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } catch {
    // no-op in SSR or if CustomEvent not available
  }
};

export const emitWsOut = (data: unknown, raw?: string) => {
  dispatch("dbg:ws-log", { data, dir: "out", raw, ts: new Date().toISOString() } as WsLog);
};

export const emitWsIn = (raw: string, data?: unknown) => {
  dispatch("dbg:ws-log", { data, dir: "in", raw, ts: new Date().toISOString() } as WsLog);
};

// Video WebSocket specific emitters (separate channel)
export const emitVideoWsOut = (data: unknown, raw?: string) => {
  dispatch("dbg:video-ws-log", {
    data,
    dir: "out",
    raw,
    source: "video",
    ts: new Date().toISOString(),
  } as WsLog);
};

export const emitVideoWsIn = (raw: string, data?: unknown) => {
  dispatch("dbg:video-ws-log", {
    data,
    dir: "in",
    raw,
    source: "video",
    ts: new Date().toISOString(),
  } as WsLog);
};

export const emitHttpOut = (url: string, init?: RequestInit) => {
  const method = (init?.method || "GET").toUpperCase();
  const req: any = {
    // body preview (if string)
    body: typeof init?.body === "string" ? (init.body as string).slice(0, 1000) : undefined,
    headers:
      init?.headers instanceof Headers
        ? Object.fromEntries(Object.entries(init.headers))
        : init?.headers,
  };
  dispatch("dbg:http-log", {
    dir: "out",
    method,
    req,
    ts: new Date().toISOString(),
    url,
  } as HttpLog);
};

export const emitHttpIn = async (url: string, method: string, res: Response) => {
  try {
    const clone = res.clone();
    let body: string | undefined;
    try {
      body = await clone.text();
      if (body) body = body.slice(0, 2000);
    } catch {
      // ignore body read errors
    }
    const headers: Record<string, string> = {};
    try {
      clone.headers.forEach((v, k) => {
        headers[k] = v;
      });
    } catch {
      // ignore
    }
    dispatch("dbg:http-log", {
      dir: "in",
      method: method.toUpperCase(),
      ok: res.ok,
      res: { body, headers },
      status: res.status,
      ts: new Date().toISOString(),
      url,
    } as HttpLog);
  } catch {
    // swallow
  }
};

export const emitDataWorkerOut = (detail: {
  action: string;
  requestId?: string;
  payload?: unknown;
}) => {
  dispatch("dbg:dw-log", {
    dir: "out",
    ts: new Date().toISOString(),
    ...detail,
  } as DataWorkerLog);
};

export const emitDataWorkerIn = (detail: {
  type: string;
  requestId?: string;
  message?: string;
  data?: unknown;
  payload?: unknown;
  error?: unknown;
}) => {
  dispatch("dbg:dw-log", {
    dir: "in",
    ts: new Date().toISOString(),
    ...detail,
  } as DataWorkerLog);
};

// Optional: globally instrument window.fetch to capture all client-side HTTP traffic
export const installHttpFetchDebug = (): (() => void) | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const w = window as unknown as {
      __httpDebugInstalled: boolean;
      __originalFetch: typeof window.fetch;
    };
    if (w.__httpDebugInstalled)
      return () => {
        // ignore
      };
    const originalFetch = window.fetch.bind(window);
    w.__originalFetch = originalFetch;
    w.__httpDebugInstalled = true;

    window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      // Normalize URL and method for logging
      let url: string;
      let method = (init?.method || "GET").toUpperCase();
      if (typeof input === "string") {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else {
        url = input?.url || "";
        method = (input as Request)?.method?.toUpperCase?.() || method;
      }

      try {
        emitHttpOut(url, init);
      } catch {
        // ignore
      }

      const resPromise = originalFetch(input as unknown as RequestInfo | URL, init);

      // Side-effect logging on resolve/reject without changing behavior
      resPromise
        .then((res) => {
          emitHttpIn(url, method, res).catch(() => {
            // ignore
          });
        })
        .catch((err) => {
          try {
            dispatch("dbg:http-log", {
              dir: "in",
              method: method.toUpperCase(),
              ok: false,
              res: { error: String(err?.message || err) },
              status: -1,
              ts: new Date().toISOString(),
              url,
            } as HttpLog);
          } catch {
            // ignore
          }
        });

      return resPromise;
    };

    return () => {
      try {
        if (w.__httpDebugInstalled && w.__originalFetch) {
          window.fetch = w.__originalFetch;
          (w as any).__originalFetch = undefined;
          (w as any).__httpDebugInstalled = undefined;
          (w as any).__originalFetch = undefined;
        }
      } catch {
        // no-op
      }
    };
  } catch {
    // ignore
  }

  return undefined;
};
