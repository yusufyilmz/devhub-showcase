// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { CalendarItem } from "../schemas/calendar";
import { AgendaItem, DayAgenda } from "./day-agenda";

const date = "2026-10-19";
const event: CalendarItem = {
  date,
  id: "event",
  source: "google-calendar",
  title: "Workout",
  type: "event",
};

describe("DayAgenda", () => {
  afterEach(cleanup);

  it("groups custom rows by hour in chronological order, followed by untimed items", () => {
    const items = [
      { ...event, id: "notes", title: "Notes" },
      { ...event, id: "dinner", time: "17:15", title: "Dinner" },
      { ...event, id: "coffee", time: "08:50", title: "Coffee" },
      { ...event, id: "breakfast", time: "08:20", title: "Breakfast" },
    ];
    render(
      <DayAgenda date={date} items={items} renderItem={(item) => <span>{item.title}</span>} />,
    );

    expect(screen.getAllByRole("heading").map((heading) => heading.textContent)).toEqual([
      "08:00",
      "17:00",
      "No time set",
    ]);
    expect(
      screen.getAllByText(/^(Breakfast|Coffee|Dinner|Notes)$/).map((row) => row.textContent),
    ).toEqual(["Breakfast", "Coffee", "Dinner", "Notes"]);
  });

  it("renders an empty message supplied by the app", () => {
    render(<DayAgenda date={date} emptyMessage="No demo activities." items={[]} />);
    expect(screen.getByText("No demo activities.")).toBeTruthy();
  });

  it("shows sources and permits safe links in the default row", () => {
    const url = "https://calendar.google.com/calendar/";
    const { rerender } = render(<AgendaItem item={{ ...event, href: url }} />);

    const link = screen.getByRole("link", { name: event.title });
    expect(link.getAttribute("href")).toBe(url);
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.getByText("Google Calendar")).toBeTruthy();

    rerender(
      <AgendaItem
        item={{
          ...event,
          href: "java\tscript:alert(1)",
          sourceLabel: "Personal calendar",
        }}
      />,
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(event.title)).toBeTruthy();
    expect(screen.getByText("Personal calendar")).toBeTruthy();
  });
});
