import { describe, expect, it, vi } from "vitest";

import { runPremiumOperation, type PremiumFeature } from "./index";

const features: PremiumFeature[] = ["portfolio_chat", "studio_assistant"];

describe("Premium operation accounting", () => {
  function setup(feature: PremiumFeature, signal?: AbortSignal) {
    const usage = {
      finish: vi.fn().mockResolvedValue(undefined),
      reserve: vi.fn().mockResolvedValue(true),
    };
    const input = {
      accountId: "11111111-1111-4111-8111-111111111111",
      feature,
      profileId: "alpha",
      requestId: crypto.randomUUID(),
      signal,
    };
    const operation = vi.fn().mockResolvedValue("answer");
    return { input, operation, usage };
  }

  describe.each(features)("%s", (feature) => {
    it("does not reserve or call the provider for an already aborted request", async () => {
      const { input, operation, usage } = setup(feature, AbortSignal.abort());
      await expect(runPremiumOperation(usage, input, operation)).rejects.toThrow();
      expect(usage.reserve).not.toHaveBeenCalled();
      expect(operation).not.toHaveBeenCalled();
      expect(usage.finish).not.toHaveBeenCalled();
    });

    it("records failure without calling the provider if cancellation wins reservation", async () => {
      const controller = new AbortController();
      const { input, operation, usage } = setup(feature, controller.signal);
      usage.reserve.mockImplementation(async () => {
        controller.abort();
        return true;
      });
      await expect(runPremiumOperation(usage, input, operation)).rejects.toThrow();
      expect(operation).not.toHaveBeenCalled();
      expect(usage.finish).toHaveBeenCalledExactlyOnceWith(input.requestId, "failed");
    });

    it("rejects a late provider result after the deadline expires", async () => {
      const controller = new AbortController();
      const { input, operation, usage } = setup(feature, controller.signal);
      operation.mockImplementation(async () => {
        controller.abort(new DOMException("Deadline exceeded", "TimeoutError"));
        return "late answer";
      });
      await expect(runPremiumOperation(usage, input, operation)).rejects.toThrow("Deadline exceeded");
      expect(operation).toHaveBeenCalledTimes(1);
      expect(usage.finish).toHaveBeenCalledExactlyOnceWith(input.requestId, "failed");
    });

    it("fails closed on allowance denial or unavailable reservation storage", async () => {
      const { input, operation, usage } = setup(feature);
      usage.reserve.mockResolvedValue(false);
      await expect(runPremiumOperation(usage, input, operation)).rejects.toThrow();
      usage.reserve.mockRejectedValue(new Error("Storage unavailable"));
      await expect(runPremiumOperation(usage, input, operation)).rejects.toThrow("Storage unavailable");
      expect(operation).not.toHaveBeenCalled();
      expect(usage.finish).not.toHaveBeenCalled();
    });

    it("preserves provider errors even when outcome storage fails, without retrying", async () => {
      const { input, operation, usage } = setup(feature);
      const failure = new Error("Provider failed");
      operation.mockRejectedValue(failure);
      usage.finish.mockRejectedValue(new Error("Outcome unavailable"));
      await expect(runPremiumOperation(usage, input, operation)).rejects.toBe(failure);
      expect(operation).toHaveBeenCalledTimes(1);
      expect(usage.finish).toHaveBeenCalledExactlyOnceWith(input.requestId, "failed");
    });

    it("returns a successful result even when outcome storage fails", async () => {
      const { input, operation, usage } = setup(feature);
      usage.finish.mockRejectedValue(new Error("Outcome unavailable"));
      await expect(runPremiumOperation(usage, input, operation)).resolves.toBe("answer");
      expect(operation).toHaveBeenCalledTimes(1);
      expect(usage.finish).toHaveBeenCalledExactlyOnceWith(input.requestId, "succeeded");
    });
  });
});
