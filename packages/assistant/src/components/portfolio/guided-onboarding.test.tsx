// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

import { GuidedOnboarding, SetupNavigation } from "./guided-onboarding";

describe("guided onboarding", () => {
  afterEach(cleanup);
  it("recommends a layout for a profession while retaining existing content", () => {
    const onChange = vi.fn();
    render(
      <GuidedOnboarding
        managed={false}
        onChange={onChange}
        onContinue={vi.fn()}
        onGoogleImport={vi.fn()}
        onImport={vi.fn()}
        profile={{ ...profile, portfolioType: undefined }}
      />,
    );
    fireEvent.change(screen.getByRole("combobox", { name: "What kind of work do you do?" }), {
      target: { value: "designer" },
    });
    expect(onChange).toHaveBeenCalledWith({ ...profile, portfolioType: "designer" });
  });
  it("keeps skip, back and review actions separate from saving or publishing", () => {
    const onStep = vi.fn();
    const onManual = vi.fn();
    const onImport = vi.fn();
    render(
      <SetupNavigation onImport={onImport} onManual={onManual} onStep={onStep} step="details" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Skip import · enter manually" }));
    fireEvent.click(screen.getByRole("button", { name: "Back to layout" }));
    fireEvent.click(screen.getByRole("button", { name: "Review draft" }));
    expect(onManual).toHaveBeenCalledOnce();
    expect(onImport).not.toHaveBeenCalled();
    expect(onStep.mock.calls).toEqual([["template"], ["review"]]);
  });
});
