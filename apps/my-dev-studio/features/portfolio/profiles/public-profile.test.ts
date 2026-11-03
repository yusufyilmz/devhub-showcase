import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ read: vi.fn(), redirect: vi.fn(), resolve: vi.fn() }));
vi.mock("@shared/services/published-profile", () => ({
  readPublicProfile: vi.fn(),
  readPublicProfileByUsername: mocks.read,
  resolvePublishedUsername: mocks.resolve,
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found");
  },
  permanentRedirect: (path: string) => {
    mocks.redirect(path);
    throw new Error("redirect");
  },
}));

import { getUsernameProfile } from "./public-profile";

describe("canonical portfolio aliases", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.read.mockResolvedValue(null);
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
});
