import { beforeEach, describe, expect, it, vi } from "vitest";

const cacheState = vi.hoisted(() => ({
  stores: [] as Map<unknown, unknown>[],
}));
const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  ensureUserProfile: vi.fn(),
  read: vi.fn(),
  requireConfirmedUser: vi.fn(),
  requireOwner: vi.fn(),
}));

// React's cache is request-scoped in server rendering, but is a pass-through
// when a Vitest test invokes async functions outside React's server dispatcher.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    cache: (fn: (...args: unknown[]) => unknown) => {
      const entries = new Map<unknown, unknown>();
      cacheState.stores.push(entries);
      return (...args: unknown[]) => {
        const key = args.length ? args[0] : null;
        if (!entries.has(key)) entries.set(key, fn(...args));
        return entries.get(key);
      };
    },
  };
});
vi.mock("@shared/auth", () => ({ requireConfirmedUser: mocks.requireConfirmedUser }));
vi.mock("@shared/lib/supabase", () => ({
  createServerClient: mocks.createServerClient,
}));
vi.mock("@shared/lib/user-profile", () => ({ ensureUserProfile: mocks.ensureUserProfile }));
vi.mock("@shared/lib/profile", () => ({
  ProfileAccessError: class extends Error {},
  ProfileService: class {
    requireOwner = mocks.requireOwner;
  },
  SupabaseProfileRepository: class {},
}));

import { readWorkspaceSnapshot, requireAdmin, requireWorkspace } from "./get-auth";

describe("workspace request cache", () => {
  const client = { auth: {} };
  const user = { email_confirmed_at: "2026-11-20", id: "owner-id" };

  beforeEach(() => {
    vi.resetAllMocks();
    for (const entries of cacheState.stores) entries.clear();
    mocks.createServerClient.mockResolvedValue(client);
    mocks.requireConfirmedUser.mockResolvedValue(user);
    mocks.ensureUserProfile.mockResolvedValue({ read: mocks.read });
    mocks.read.mockResolvedValue({ username: "alice" });
    mocks.requireOwner.mockResolvedValue(undefined);
  });

  it("shares one authenticated workspace across callers in the same request", async () => {
    const first = await requireWorkspace();
    const second = await requireWorkspace();

    expect(second).toBe(first);
    expect(mocks.createServerClient).toHaveBeenCalledOnce();
    expect(mocks.requireConfirmedUser).toHaveBeenCalledOnce();
    expect(mocks.ensureUserProfile).toHaveBeenCalledExactlyOnceWith(client, user);
    expect(mocks.requireOwner).toHaveBeenCalledExactlyOnceWith(user.id);
  });

  it("reads one snapshot shared by the layout and editor", async () => {
    await requireWorkspace();
    const first = await readWorkspaceSnapshot();
    const second = await readWorkspaceSnapshot();

    expect(second).toBe(first);
    expect(first).toEqual({ username: "alice" });
    expect(mocks.createServerClient).toHaveBeenCalledOnce();
    expect(mocks.ensureUserProfile).toHaveBeenCalledOnce();
    expect(mocks.read).toHaveBeenCalledOnce();
  });

  it("separates workspace cache entries by provided client", async () => {
    const first = { id: "first" } as NonNullable<Parameters<typeof requireWorkspace>[0]>;
    const second = { id: "second" } as NonNullable<Parameters<typeof requireWorkspace>[0]>;

    await requireWorkspace(first);
    await requireWorkspace(first);
    await requireWorkspace(second);

    expect(mocks.createServerClient).not.toHaveBeenCalled();
    expect(mocks.ensureUserProfile).toHaveBeenCalledTimes(2);
    expect(mocks.ensureUserProfile).toHaveBeenNthCalledWith(1, first, user);
    expect(mocks.ensureUserProfile).toHaveBeenNthCalledWith(2, second, user);
  });

  it("keeps moderation authorization uncached", async () => {
    await requireAdmin();
    await requireAdmin();

    expect(mocks.createServerClient).toHaveBeenCalledTimes(2);
    expect(mocks.requireOwner).toHaveBeenCalledTimes(2);
  });
});
