// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

import { FieldVisibilityEditor } from "./field-visibility";

describe("independent output fields", () => {
  afterEach(cleanup);
  it("changes only the chosen output and keeps original authored values", () => {
    const onChange = vi.fn();
    render(<FieldVisibilityEditor onChange={onChange} profile={profile} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Include email on website" }));
    const next = onChange.mock.calls[0]?.[0];
    expect(next.websiteFields.email).toBe(false);
    expect(next.email).toBe(profile.email);
    expect(next.cvFields).toBe(profile.cvFields);
  });
  it("keeps the legacy CV contact toggle aligned with field choices", () => {
    const onChange = vi.fn();
    render(<FieldVisibilityEditor onChange={onChange} profile={profile} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Include phone on cv" }));
    const next = onChange.mock.calls[0]?.[0];
    expect(next.cvFields.phone).toBe(false);
    expect(next.cvSettings.showPhone).toBe(false);
    expect(next.websiteFields).toBe(profile.websiteFields);
  });
});
