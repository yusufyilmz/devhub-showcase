import { describe, expect, it } from "vitest";

import type { AgentFeature } from "./types";
import { selectFeatureTip } from "./use-feature-tips";

const feature = (id: string, context?: string): AgentFeature => ({
  context,
  group: "Example",
  id,
  message: id,
  title: id,
});

describe("selectFeatureTip", () => {
  const features = [feature("a"), feature("b", "today"), feature("c", "today")];
  it("picks the current page's unfinished, unseen feature first", () => {
    expect(selectFeatureTip(features, [], ["b"], [], "today")?.id).toBe("c");
    expect(selectFeatureTip(features, [], ["b"], ["c"], "today")?.id).toBe("a");
  });
  it("can offer a draft improvement even when every catalog feature is complete", () => {
    expect(
      selectFeatureTip(features, [feature("missing-title")], ["a", "b", "c"], [], "today")?.id,
    ).toBe("missing-title");
    expect(selectFeatureTip(features, [], ["a", "b", "c"], [], "today")).toBeUndefined();
  });
});
