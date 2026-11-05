// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { connectNotificationSocket } from "./websocket";

function fakeSocket() {
  return {
    close: vi.fn(),
    onclose: null,
    onerror: null,
    onmessage: null,
    onopen: null,
  } as unknown as WebSocket;
}
describe("instant notification socket", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it("reconnects with fresh credentials, deduplicates and ignores malformed messages", async () => {
    vi.useFakeTimers();
    const sockets: WebSocket[] = [];
    const url = vi.fn(() => "wss://example.test/live");
    const onMessage = vi.fn();
    const onState = vi.fn();
    const stop = connectNotificationSocket({
      onMessage,
      onState,
      socket: () => {
        const next = fakeSocket();
        sockets.push(next);
        return next;
      },
      url,
    });
    await Promise.resolve();
    const first = sockets[0]!;
    first.onopen?.call(first, new Event("open"));
    const emit = (text: string) =>
      first.onmessage?.call(first, new MessageEvent("message", { data: text }));
    emit("bad json");
    emit(JSON.stringify({ id: "incomplete" }));
    emit(JSON.stringify({ id: "one", title: "Hello" }));
    emit(JSON.stringify({ id: "one", title: "Hello" }));
    expect(onMessage).toHaveBeenCalledTimes(1);
    first.onclose?.call(first, new CloseEvent("close"));
    await vi.advanceTimersByTimeAsync(1300);
    expect(url).toHaveBeenCalledTimes(2);
    expect(onState).toHaveBeenCalledWith("connected");
    emit(JSON.stringify({ id: "stale", title: "Ignore old connection" }));
    expect(onMessage).toHaveBeenCalledTimes(1);
    stop();
    await vi.advanceTimersByTimeAsync(60000);
    expect(sockets).toHaveLength(2);
    expect(sockets[1]?.close).toHaveBeenCalled();
  });
  it("never opens an insecure remote connection and can dispose during authentication", async () => {
    vi.useFakeTimers();
    const socket = vi.fn();
    const stop = connectNotificationSocket({
      onMessage: vi.fn(),
      socket,
      url: () => "ws://example.test/",
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(socket).not.toHaveBeenCalled();
    stop();
    let resolve!: (url: string) => void;
    const pending = connectNotificationSocket({
      onMessage: vi.fn(),
      socket,
      url: () =>
        new Promise<string>((done) => {
          resolve = done;
        }),
    });
    pending();
    resolve("wss://example.test");
    await Promise.resolve();
    expect(socket).not.toHaveBeenCalled();
  });
});
