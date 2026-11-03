// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

import { TemplatePicker } from "./template-picker";

describe("template selection", () => {
  afterEach(cleanup);
  it("previews separately and changes only presentation after explicit selection", () => {
    const onChange = vi.fn();
    render(<TemplatePicker onChange={onChange} profile={profile} />);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole("link", { name: /Preview/ })).toHaveLength(9);
    fireEvent.click(screen.getByRole("button", { name: "Use photographer template" }));
    expect(onChange.mock.calls[0]?.[0].projects).toBe(profile.projects);
    expect(onChange.mock.calls[0]?.[0].cvLayout).toBe(profile.cvLayout);
    expect(onChange.mock.calls[0]?.[0].sectionSettings.projects.renderer).toBe("project-carousel");
  });
});
