import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  gate: vi.fn(),
  protectedRead: vi.fn(),
  read: vi.fn(),
  redirect: vi.fn(),
  resolve: vi.fn(),
}));
vi.mock("@shared/services/published-profile", () => ({
  readPortfolioAccessStatus: mocks.gate,
  readPublicProfile: vi.fn(),
  readPublicProfileByUsername: mocks.read,
  resolvePublishedUsername: mocks.resolve,
}));
vi.mock("../access/server-access", () => ({ readProtectedProfile: mocks.protectedRead }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found");
  },
  permanentRedirect: (path: string) => {
    mocks.redirect(path);
    throw new Error("redirect");
  },
  redirect: (path: string) => {
    mocks.redirect(path);
    throw new Error("redirect");
  },
}));

import { getUsernameProfile } from "./public-profile";

describe("canonical portfolio aliases", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.read.mockResolvedValue(null);
    mocks.gate.mockResolvedValue(null);
  });
  it("preserves resource suffixes and resolves directly to the current canonical username", async () => {
    mocks.resolve.mockResolvedValue({ id: "same-profile", username: "current-owner" });
    for (const suffix of ["", "/cv.pdf", "/icon.svg", "/share.png"] as const) {
      await expect(getUsernameProfile("old-owner", suffix)).rejects.toThrow("redirect");
      expect(mocks.redirect).toHaveBeenLastCalledWith(`/current-owner${suffix}`);
    }
  });
  it("does not redirect an unavailable destination or a self-referential lookup", async () => {
    mocks.resolve
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "same-profile", username: "old-owner" });
    await expect(getUsernameProfile("withdrawn-owner")).rejects.toThrow("not-found");
    await expect(getUsernameProfile("old-owner")).rejects.toThrow("not-found");
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
  it("redirects locked pages to a generic gate but never redirects locked assets", async () => {
    mocks.gate.mockResolvedValue({ id: "protected-id", username: "alice" });
    mocks.protectedRead.mockResolvedValue(null);
    await expect(getUsernameProfile("alice")).rejects.toThrow("redirect");
    expect(mocks.redirect).toHaveBeenCalledWith("/alice/access");
    mocks.redirect.mockClear();
    for (const suffix of ["/cv.pdf", "/icon.svg", "/share.png"] as const)
      await expect(getUsernameProfile("alice", suffix)).rejects.toThrow("not-found");
    expect(mocks.redirect).not.toHaveBeenCalled();
    expect(mocks.resolve).not.toHaveBeenCalled();
  });
  it("returns only the verified snapshot for a protected username", async () => {
    mocks.gate.mockResolvedValue({ id: "protected-id", username: "alice" });
    mocks.protectedRead.mockResolvedValue({ id: "protected-id", revision: 7 });
    expect(await getUsernameProfile("alice")).toEqual({ id: "protected-id", revision: 7 });
    expect(mocks.protectedRead).toHaveBeenCalledWith("protected-id");
  });
});
