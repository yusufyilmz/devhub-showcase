// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

import { AssistantFeedback, AssistantTools, PublishedSources } from "./assistant-tools";

describe("assistant tools", () => {
  afterEach(cleanup);
  it("offers selected sources, tone and length without editing the document", () => {
    const onChange = vi.fn();
    render(
      <AssistantTools
        onChange={onChange}
        profile={profile}
        value={{ field: "summary", kind: "writing", length: "standard", tone: "professional" }}
      />,
    );
    fireEvent.change(screen.getByRole("combobox", { name: /^Writing tone/ }), {
      target: { value: "friendly" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ field: "summary", tone: "friendly" }),
    );
  });
  it("distinguishes missing facts from edits and links to the relevant editor tab", () => {
    const onNavigate = vi.fn();
    render(
      <AssistantFeedback
        feedback={[
          {
            field: "experiences",
            issue: "No outcomes supplied",
            needsInput: true,
            recommendation: "Add a factual outcome.",
          },
        ]}
        onNavigate={onNavigate}
      />,
    );
    expect(screen.getByText("Needs your facts or decision")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Edit experiences" }));
    expect(onNavigate).toHaveBeenCalledWith("Experience");
  });
  it("renders only local published-source links, never executable or external URLs", () => {
    render(
      <PublishedSources
        sources={[
          { href: "/alex#skills", label: "Skills" },
          { href: "javascript:alert(1)", label: "Bad" },
          { href: "https://example.test", label: "External" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Skills" }).getAttribute("href")).toBe("/alex#skills");
    expect(screen.queryByRole("link", { name: "Bad" })).toBeNull();
    expect(screen.queryByRole("link", { name: "External" })).toBeNull();
  });
});
