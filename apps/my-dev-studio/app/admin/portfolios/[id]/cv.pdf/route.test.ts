import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileAccessError } from "@shared/services/profile";

const mocks = vi.hoisted(() => ({
  cv: vi.fn(),
  managed: vi.fn(),
}));
vi.mock("@/features/management/managed-portfolios", () => ({
  managedRepository: mocks.managed,
}));
vi.mock("@/features/portfolio/cv-response", () => ({ cvResponse: mocks.cv }));

import { GET } from "./route";

const id = "88888888-8888-4888-8888-888888888888";
const context = { params: Promise.resolve({ id }) };

describe("CvPdf", () => {
  beforeEach(() => vi.resetAllMocks());

  it("blocks ordinary users and signed out users before private PDF reads", async () => {
    mocks.managed.mockRejectedValue(new ProfileAccessError());
    expect((await GET(new Request("https://example.com/cv"), context)).status).toBe(403);
    expect(mocks.cv).not.toHaveBeenCalled();
  });
});
