// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Input } from "../input/Input";
import { NativeSelect } from "./native-select";

describe("Shared native form semantics", () => {
  afterEach(cleanup);
  it("keeps option groups, events and submitted values", () => {
    const change = vi.fn();
    render(
      <form aria-label="Settings">
        <label>
          Choice
          <NativeSelect defaultValue="a" name="choice" onChange={change} unstyled>
            <optgroup label="Group">
              <option value="a">Alpha</option>
              <option value="b">Beta</option>
            </optgroup>
          </NativeSelect>
        </label>
      </form>,
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Choice" }), { target: { value: "b" } });
    expect(change).toHaveBeenCalledOnce();
    expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("choice")).toBe("b");
  });
  it("keeps checkbox labels and values without text-field styling", () => {
    render(
      <label>
        Enabled
        <Input type="checkbox" unstyled value="yes" />
      </label>,
    );
    const input = screen.getByRole("checkbox", { name: "Enabled" });
    fireEvent.click(input);
    expect((input as HTMLInputElement).checked).toBe(true);
    expect(input.className).not.toContain("ui-input");
  });
});
