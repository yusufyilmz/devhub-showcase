import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  publicRead: vi.fn(),
  render: vi.fn(),
}));
vi.mock("@shared/services/published-profile", () => ({
  readPublicProfileByUsername: mocks.publicRead,
}));
vi.mock("@/features/portfolio/cv-response", () => ({ cvResponse: mocks.render }));

import { GET } from "./route";

describe("CvPdf", () => {
  beforeEach(() => vi.resetAllMocks());

  it("does not render a private or nonexistent username PDF", async () => {
    mocks.publicRead.mockResolvedValue(null);
    const response = await GET(new Request("https://example.com/alice/cv.pdf"), {
      params: Promise.resolve({ username: "alice" }),
    });
    expect(response.status).toBe(404);
    expect(mocks.render).not.toHaveBeenCalled();
  });
});
