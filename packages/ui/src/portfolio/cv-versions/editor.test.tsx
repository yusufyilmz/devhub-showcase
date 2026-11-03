// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";
import { createCvVariant } from "@shared/lib/profiles";

import { CvVersionsEditor } from "./editor";

describe("CV versions editor", () => {
  afterEach(cleanup);
  it("keeps version edits after a failed save and leaves the source untouched", async () => {
    const load = vi
      .fn()
      .mockResolvedValue({ revision: 1, variants: [createCvVariant(profile, 3, "Default")] });
    const save = vi.fn().mockRejectedValue(new Error("Conflict: reload before saving."));
    render(
      <CvVersionsEditor
        downloadHref={(id) => `/private/${id}`}
        load={load}
        profile={profile}
        save={save}
        sourceRevision={3}
      />,
    );
    await waitFor(() =>
      expect(
        screen
          .getByRole("button", { name: "Create fresh version from profile" })
          .hasAttribute("disabled"),
      ).toBe(false),
    );
    fireEvent.click(screen.getByRole("button", { name: "Create fresh version from profile" }));
    fireEvent.change(screen.getByRole("textbox", { name: /Version title/ }), {
      target: { value: "Independent draft" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Include phone on cv" }));
    expect(screen.queryByRole("checkbox", { name: "Include phone on website" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Save CV versions" }));
    const library = save.mock.calls[0]?.[0];
    expect(library.variants.at(-1).profile.cvFields.phone).toBe(false);
    expect(library.variants[0].profile.cvFields).toBe(profile.cvFields);
    await screen.findByRole("alert");
    expect(screen.getByRole("textbox", { name: /Version title/ }).getAttribute("value")).toBe(
      "Independent draft",
    );
    expect(profile.title).not.toBe("Independent draft");
    expect(screen.queryByRole("link", { name: "Download saved version" })).toBeNull();
  });
});
