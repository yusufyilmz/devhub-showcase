// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AgendaDetails } from "./agenda-details";
import { EventRow } from "./event-row";

describe("calendar agenda controls", () => {
  afterEach(cleanup);

  it("opens an event row without following the link", () => {
    const onOpen = vi.fn();
    const onToggle = vi.fn();
    render(
      <EventRow
        busy={false}
        completed={false}
        detail="workout"
        href="?date=2026-10-19&view=day&task=workout"
        onOpen={onOpen}
        onToggle={onToggle}
        readOnly={false}
        time="08:20"
        title="Morning workout"
      />,
    );

    fireEvent.click(screen.getByRole("link", { name: /Morning workout/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Complete Morning workout" }));

    expect(onOpen).toHaveBeenCalledOnce();
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("reschedules one occurrence from the details form", () => {
    const onReschedule = vi.fn();
    render(
      <AgendaDetails
        backHref="?date=2026-10-19&view=day"
        date="2026-10-19"
        onBack={vi.fn()}
        onReschedule={onReschedule}
        rescheduleDate="2026-10-19"
        rescheduleTime="08:20"
        timeLabel="08:20"
      >
        <p>Workout details</p>
      </AgendaDetails>,
    );

    fireEvent.submit(screen.getByRole("button", { name: "Save date and time" }).closest("form")!);

    expect(onReschedule).toHaveBeenCalledWith("2026-10-19", "08:20");
  });
});
