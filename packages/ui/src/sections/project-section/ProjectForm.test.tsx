// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProjectForm } from "./ProjectForm";

describe("ProjectForm", () => {
  afterEach(cleanup);

  it("keeps an unsaved draft when the form has no initial data and its parent rerenders", () => {
    const onSubmit = vi.fn();
    const { rerender } = render(
      <ProjectForm action="Save project" isSubmitting={false} onSubmit={onSubmit} />,
    );
    fireEvent.change(screen.getByLabelText("Project Title"), { target: { value: "Atlas" } });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Research archive" },
    });
    fireEvent.change(screen.getByLabelText("Project Link"), {
      target: { value: "https://example.com" },
    });

    rerender(<ProjectForm action="Save project" isSubmitting={false} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Save project" }));

    expect(onSubmit).toHaveBeenCalledWith({
      description: "Research archive",
      link: "https://example.com",
      title: "Atlas",
    });
  });
});
