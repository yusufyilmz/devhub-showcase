// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  channel: vi.fn(),
  getSession: vi.fn(),
  headers: vi.fn(),
  removeChannel: vi.fn(),
}));
vi.mock("@/lib/browser-session", () => ({
  authorizationHeaders: mocks.headers,
  browserAuth: () => ({
    auth: { getSession: mocks.getSession },
    channel: mocks.channel,
    removeChannel: mocks.removeChannel,
  }),
}));

import { fitnessLiveState, subscribeFitnessNotifications } from "./browser";

describe("authenticated Fitness OS realtime adapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });
  it("filters owner and application events, resyncs after connection, and cleans up", async () => {
    const revision = vi.fn();
    const message = vi.fn();
    let incoming!: (event: { new: Record<string, unknown> }) => void;
    let connection!: (status: string) => void;
    const on = vi.fn((_type, _filter, handler) => {
      incoming = handler;
      return channel;
    });
    const subscribe = vi.fn((handler) => {
      connection = handler;
      return channel;
    });
    const channel = { on, subscribe };
    mocks.getSession.mockResolvedValue({ data: { session: { user: { id: "owner" } } } });
    mocks.channel.mockReturnValue(channel);
    mocks.removeChannel.mockResolvedValue(undefined);
    mocks.headers.mockResolvedValue({ Authorization: "Bearer fixture" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ revision: 7 })));
    const stop = subscribeFitnessNotifications({ message, revision });
    await vi.waitFor(() => expect(subscribe).toHaveBeenCalled());
    expect(on).toHaveBeenCalledWith(
      "postgres_changes",
      expect.objectContaining({ filter: "user_id=eq.owner", table: "notification_events" }),
      expect.any(Function),
    );
    connection("SUBSCRIBED");
    await vi.waitFor(() => expect(revision).toHaveBeenCalledWith(7));
    expect(fitnessLiveState()).toBe("connected");
    const row = {
      app_id: "fitness-os",
      kind: "invalidate",
      message: { revision: 8 },
      topic: "workspace",
      user_id: "owner",
    };
    incoming({ new: { ...row, user_id: "other" } });
    incoming({ new: { ...row, app_id: "other-app" } });
    expect(revision).toHaveBeenCalledTimes(1);
    incoming({ new: row });
    expect(revision).toHaveBeenLastCalledWith(8);
    incoming({ new: { ...row, kind: "notification", message: { id: "one", title: "Hello" } } });
    expect(message).toHaveBeenCalledWith(expect.objectContaining({ title: "Hello" }));
    connection("CHANNEL_ERROR");
    expect(fitnessLiveState()).toBe("reconnecting");
    stop();
    expect(mocks.removeChannel).toHaveBeenCalledWith(channel);
    incoming({ new: row });
    expect(revision).toHaveBeenCalledTimes(2);
    expect(fitnessLiveState()).toBe("disconnected");
  });
});
