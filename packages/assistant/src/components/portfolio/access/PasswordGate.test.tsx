// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PasswordGate } from "./PasswordGate";

describe("portfolio password screen", () => {
  afterEach(cleanup);
  it("preserves retry after denial and clears the password only after successful verification", async () => {
    const unlock = vi
      .fn()
      .mockRejectedValueOnce(new Error("Could not unlock this portfolio."))
      .mockResolvedValue(undefined);
    render(<PasswordGate unlock={unlock} />);
    const input = screen.getByLabelText("Portfolio password");
    const button = screen.getByRole("button", { name: "Unlock portfolio" });
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.change(input, { target: { value: "fictional-password" } });
    fireEvent.submit(input.closest("form") as HTMLFormElement);
    await screen.findByRole("alert");
    expect((input as HTMLInputElement).value).toBe("fictional-password");
    fireEvent.submit(input.closest("form") as HTMLFormElement);
    await waitFor(() => expect((input as HTMLInputElement).value).toBe(""));
    expect(unlock).toHaveBeenCalledTimes(2);
  });
});
