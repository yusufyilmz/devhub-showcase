import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  published: vi.fn(),
  render: vi.fn(),
}));
vi.mock("@shared/lib/published-profile", () => ({
  readPublicProfile: mocks.published,
}));
vi.mock("../../../api/cv/_response", () => ({ cvResponse: mocks.render }));

vi.mock("../../../[username]/access/_session", () => ({
  readProtectedProfile: vi.fn().mockResolvedValue(null),
}));

import { GET } from "./route";

describe("CvPdf", () => {
  beforeEach(() => vi.resetAllMocks());

  it("does not render a private or missing public CV and never uses the main profile as fallback", async () => {
    mocks.published.mockResolvedValue(null);
    expect(
      (
        await GET(new Request("https://example.com/p/bob/cv.pdf"), {
          params: Promise.resolve({ id: "bob" }),
        })
      ).status,
    ).toBe(404);
    expect(mocks.published).toHaveBeenCalledWith("bob", "cv");
    expect(mocks.render).not.toHaveBeenCalled();
  });
});
