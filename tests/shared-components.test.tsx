// @vitest-environment jsdom

import { useState } from "react";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { CollectionEditor, moveItem } from "../packages/components/src/collection-editor";
import { Field } from "../packages/components/src/fields";
import { LoginPanel } from "../packages/components/src/login-panel";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("configures the same login panel for a fitness app without portfolio endpoints", () => {
  render(
    <LoginPanel
      description="Keep your training in sync"
      googleAction="/fitness/google"
      sessionEndpoint="/fitness/session"
      successPath="/fitness/dashboard"
      title="Fitness account"
    />,
  );
  expect(screen.getByRole("heading").textContent).toBe("Fitness account");
  expect(
    screen
      .getByRole("button", { name: "Continue with Google" })
      .closest("form")
      ?.getAttribute("action"),
  ).toBe("/fitness/google");
  expect(screen.getByLabelText("Password").getAttribute("autoComplete")).toBe("current-password");
});
it("submits password credentials to the configured app and retains an accessible error", async () => {
  const fetcher = vi.fn().mockResolvedValue({
    json: async () => ({ error: "Check your fitness account" }),
    ok: false,
  });
  vi.stubGlobal("fetch", fetcher);
  render(
    <LoginPanel
      description="Sign in"
      googleAction="/fitness/google"
      sessionEndpoint="/fitness/session"
      successPath="/fitness"
      title="Fitness"
    />,
  );
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "synthetic" },
  });
  fireEvent.submit(screen.getByLabelText("Password").closest("form") as HTMLFormElement);
  expect((await screen.findByRole("alert")).textContent).toBe("Check your fitness account");
  expect(fetcher.mock.calls[0]?.[0]).toBe("/fitness/session");
});
function WorkoutEditor() {
  const [items, setItems] = useState([
    { id: "a", name: "Squat" },
    { id: "b", name: "Row" },
  ]);
  return (
    <CollectionEditor
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
it("uses the collection editor with workout data and supports ordering, edits and confirmed removal", () => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
  render(<WorkoutEditor />);
  fireEvent.click(screen.getByRole("button", { name: "Move Row up" }));
  expect(screen.getAllByRole("heading", { level: 3 }).map((x) => x.textContent)).toEqual([
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
it("keeps collection order for invalid indices", () => {
  const items = ["first", "second"];
  expect(moveItem(items, -1, 0)).toBe(items);
  expect(moveItem(items, 0, 9)).toBe(items);
  expect(moveItem(items, 1, 0)).toEqual(["second", "first"]);
});
