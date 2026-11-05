import { type ConnectionState, type NotificationMessage, notificationSchema } from "./index";

/** Framework/backend independent connection. Supply a short-lived authenticated URL, never a service key. */
export function connectNotificationSocket(options: {
  url: () => string | Promise<string>;
  onMessage: (message: NotificationMessage) => void;
  onState?: (state: ConnectionState) => void;
  socket?: (url: string) => WebSocket;
}) {
  let stopped = false;
  let socket: WebSocket | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let attempt = 0;
  const seen = new Set<string>();
  function retry() {
    if (stopped || timer) return;
    options.onState?.("disconnected");
    timer = setTimeout(
      () => {
        timer = undefined;
        connect().catch(retry);
      },
      Math.min(30000, 1000 * 2 ** Math.min(attempt++, 5)) + Math.random() * 250,
    );
  }
  async function connect() {
    if (stopped) return;
    options.onState?.("connecting");
    const url = new URL(await options.url(), location.href);
    if (stopped) return;
    if (
      url.protocol !== "wss:" &&
      !(url.protocol === "ws:" && ["localhost", "127.0.0.1"].includes(url.hostname))
    )
      throw new Error("A secure WebSocket is required.");
    const connection = (options.socket ?? ((value) => new WebSocket(value)))(url.href);
    socket = connection;
    connection.onopen = () => {
      if (stopped || socket !== connection) return;
      attempt = 0;
      options.onState?.("connected");
    };
    connection.onmessage = (event) => {
      if (
        stopped ||
        socket !== connection ||
        typeof event.data !== "string" ||
        event.data.length > 8192
      )
        return;
      let input: unknown;
      try {
        input = JSON.parse(event.data);
      } catch {
        return;
      }
      const parsed = notificationSchema.safeParse(input);
      if (!parsed.success || seen.has(parsed.data.id)) return;
      seen.add(parsed.data.id);
      if (seen.size > 500) seen.delete(seen.values().next().value ?? "");
      options.onMessage(parsed.data);
    };
    connection.onerror = () => connection.close();
    connection.onclose = () => {
      if (socket === connection) retry();
    };
  }
  connect().catch(retry);
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
    if (socket) {
      socket.onclose = null;
      socket.close();
    }
  };
}
