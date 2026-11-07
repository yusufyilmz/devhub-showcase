// @vitest-environment jsdom

import { useState } from "react";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Field } from "../../forms";
import { CollectionEditor, moveItem } from "./collection-editor";

function WorkoutEditor({ collapsible = false }: { collapsible?: boolean }) {
  const [items, setItems] = useState([
    { id: "a", name: "Squat" },
    { id: "b", name: "Row" },
  ]);
  return (
    <CollectionEditor
      collapsible={collapsible}
      create={() => ({ id: "c", name: "Walk" })}
      getTitle={(item) => item.name}
      items={items}
      onChange={setItems}
      render={(item, change) => (
        <Field
          label="Workout name"
          onChange={(name) => change({ ...item, name })}
          value={item.name}
        />
      )}
      title="Workouts"
    />
  );
}

describe("CollectionEditor", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });
  it("uses the collection editor with workout data and supports ordering, edits and confirmed removal", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<WorkoutEditor />);
    fireEvent.click(screen.getByRole("button", { name: "Move Row up" }));
    expect(screen.getAllByRole("heading", { level: 3 }).map((item) => item.textContent)).toEqual([
      "Row",
      "Squat",
    ]);
    fireEvent.change(screen.getAllByLabelText("Workout name")[0] as HTMLInputElement, {
      target: { value: "Pull up" },
    });
    expect(screen.getByRole("heading", { name: "Pull up" })).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Remove" })[0] as HTMLButtonElement);
    expect(screen.queryByRole("heading", { name: "Pull up" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "+ Add workouts" }));
    expect(screen.getByRole("heading", { name: "Walk" })).toBeTruthy();
  });
  it("opens only the chosen entry, retains edits and opens a newly added entry", () => {
    render(<WorkoutEditor collapsible />);
    const row = screen.getByRole("button", { name: "Edit Row" });
    fireEvent.click(row);
    expect(row.getAttribute("aria-expanded")).toBe("true");
    fireEvent.change(screen.getAllByLabelText("Workout name")[1]!, {
      target: { value: "Pull up" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Edit Squat" }));
    expect(screen.getByRole("button", { name: "Edit Pull up" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
    fireEvent.click(screen.getByRole("button", { name: "+ Add workouts" }));
    expect(screen.getByRole("button", { name: "Close Walk" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Workout name" }).getAttribute("value")).toBe(
      "Walk",
    );
  });
  it("keeps collection order for invalid indices", () => {
    const items = ["first", "second"];
    expect(moveItem(items, -1, 0)).toBe(items);
    expect(moveItem(items, 0, 9)).toBe(items);
    expect(moveItem(items, 1, 0)).toEqual(["second", "first"]);
  });
});
