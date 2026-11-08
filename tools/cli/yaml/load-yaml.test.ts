import { describe, expect, it } from "vitest";

import { loadYaml } from "./load-yaml";

describe("js-yaml v5 configuration migration", () => {
  it("retains YAML 1.2 scalars and empty-input behavior", () => {
    expect(loadYaml(" ")).toBeUndefined();
    expect(loadYaml("name: hello\nenabled: true\nlegacy: yes\ncount: 3")).toEqual({
      count: 3,
      enabled: true,
      legacy: "yes",
      name: "hello",
    });
  });
  it("supports anchors and merge keys in existing configuration", () => {
    expect(loadYaml("defaults: &base\n  enabled: true\nconfig:\n  <<: *base\n  count: 2")).toEqual({
      config: { count: 2, enabled: true },
      defaults: { enabled: true },
    });
  });
  it("preserves timestamp parsing", () => {
    const parsed = loadYaml("createdAt: 2025-01-01T00:00:00.000Z") as {
      createdAt: Date;
    };
    expect(parsed.createdAt).toBeInstanceOf(Date);
  });
  it("rejects duplicate keys and multiple documents", () => {
    expect(() => loadYaml("name: first\nname: second", "config.yml")).toThrow();
    expect(() => loadYaml("---\na: 1\n---\nb: 2")).toThrow();
  });
});
