import { beforeEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

const mocks = vi.hoisted(() => ({ available: vi.fn(), read: vi.fn() }));
vi.mock("@shared/services/published-profile", () => ({
  readPublicProfileByUsername: mocks.read,
}));
vi.mock("@/features/chat/premium-chat", () => ({ premiumChatAvailable: mocks.available }));
vi.mock("@/features/chat/portfolio-visitor-chat", () => ({ PortfolioVisitorChat: () => null }));

import PortfolioChatPage from "./page";

const snapshot = {
  id: "owner-id",
  isPublic: true,
  profile: { ...profile, name: "Alice" },
  revision: 3,
  username: "alice",
};

const openChat = () => PortfolioChatPage({ params: Promise.resolve({ username: "alice" }) });

describe("Portfolio chat page", () => {
  beforeEach(() => vi.resetAllMocks());

  it.each([
    null,
    { ...snapshot, isPublic: false },
    { ...snapshot, profile: { ...snapshot.profile, publicationVisibility: "password" } },
  ])("denies access to an unavailable publication", async (publication) => {
    mocks.read.mockResolvedValue(publication);
    await expect(openChat()).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(mocks.available).not.toHaveBeenCalled();
  });

  it("opens the legacy portfolio assistant", async () => {
    mocks.read.mockResolvedValue({ ...snapshot, id: "main" });
    const page = await openChat();
    expect(page.props).toMatchObject({
      identity: { id: "main", name: "Alice", revision: 3 },
      legacy: true,
      username: "alice",
    });
    expect(mocks.available).not.toHaveBeenCalled();
  });

  it("requires the visitor chat entitlement for other portfolios", async () => {
    mocks.read.mockResolvedValue(snapshot);
    mocks.available.mockResolvedValue(false);
    await expect(openChat()).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(mocks.available).toHaveBeenCalledWith(snapshot.id);

    mocks.available.mockResolvedValue(true);
    const page = await openChat();
    expect(page.props).toMatchObject({ legacy: false, username: "alice" });
    expect(page.props.sources.length).toBeGreaterThan(0);
    for (const source of page.props.sources) expect(source.href).toMatch(/^\/alice#/);
  });
});
