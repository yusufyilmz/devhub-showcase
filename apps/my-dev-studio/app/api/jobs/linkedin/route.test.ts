import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(async () => ({ error: null })),
  secret: "fictional-relay-secret-at-least-32-characters",
}));
vi.mock("../_config", () => ({
  jobAlertConfig: () => ({ domain: "jobs.example.test", secret: mocks.secret }),
  jobsServiceClient: () => ({ rpc: mocks.rpc }),
}));

import { POST } from "./route";

function relay(body: object, token = mocks.secret) {
  return new Request("https://app.example.test/api/jobs/linkedin", {
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${token}` },
    method: "POST",
  });
}

const email = {
  recipient: "alerts+4f98492f-e7f9-4e11-bcaa-b045e32d8240@jobs.example.test",
  text: "See https://www.linkedin.com/comm/jobs/view/123?trk=alert",
  verifiedSender: "person@example.test",
};

describe("LinkedIn email relay endpoint", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects unsigned requests", async () => {
    expect((await POST(relay(email, "incorrect"))).status).toBe(403);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("sends only normalized listing data to the database", async () => {
    expect((await POST(relay(email))).status).toBe(202);
    expect(mocks.rpc).toHaveBeenCalledWith("enqueue_linkedin_alert", {
      address_token: "4f98492f-e7f9-4e11-bcaa-b045e32d8240",
      candidates: [
        {
          id: expect.stringMatching(/^[0-9a-f]{64}$/),
          listing: { sourceId: "123", title: "", url: "https://www.linkedin.com/jobs/view/123/" },
        },
      ],
      verified_sender: "person@example.test",
    });
  });
});
