// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { dateLabel } from "@shared/utils/date";

import { CalendarGrid } from "./calendar-grid";
import type { CalendarItem } from "./model";

const date = "2026-10-19";
const nextDay = "2026-10-20";
const workout: CalendarItem = {
  date,
  id: "workout",
  source: "fitness",
  time: "08:35",
  title: "Morning workout",
  type: "event",
};
const getItems = (day: string) => (day === date ? [workout] : []);

function dragTransfer() {
  const data = new Map<string, string>();
  return {
    dropEffect: "",
    effectAllowed: "",
    setData: (type: string, value: string) => data.set(type, value),
    get types() {
      return [...data.keys()];
    },
  };
}

describe("CalendarGrid", () => {
  afterEach(cleanup);

  it("selects days and pages by month or week", () => {
    const onDateChange = vi.fn();
    render(
      <CalendarGrid date={date} getItems={getItems} onDateChange={onDateChange} today={nextDay} />,
    );

    const month = screen.getByRole("region", { name: "Month calendar" });
    const selectedDay = screen.getByRole("region", { name: "Selected day items" });
    expect(within(month).getByText(workout.title)).toBeTruthy();
    expect(within(selectedDay).getByText(workout.title)).toBeTruthy();
    expect(
      within(month)
        .getByRole("button", { name: `Select ${dateLabel(date)}` })
        .getAttribute("aria-description"),
    ).toBe("1 item");
    const today = screen.getByRole("button", { name: `Select ${dateLabel(nextDay)}` });
    expect(today.getAttribute("aria-current")).toBe("date");
    fireEvent.click(today);
    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    fireEvent.click(screen.getByRole("button", { name: "Week" }));
    fireEvent.click(screen.getByRole("button", { name: "Next week" }));
    fireEvent.click(screen.getByRole("button", { name: "Today" }));

    expect(onDateChange.mock.calls).toEqual([[nextDay], ["2026-09-01"], ["2026-10-26"], [nextDay]]);
  });

  it("uses the day link for modified clicks and calls the open handler for ordinary clicks", () => {
    const onOpenDay = vi.fn();
    render(
      <CalendarGrid
        date={date}
        dayHref={(day) => `#${day}`}
        getItems={getItems}
        onDateChange={vi.fn()}
        onOpenDay={onOpenDay}
        today={date}
      />,
    );

    const link = screen.getByRole("link", { name: `Open ${dateLabel(nextDay)}` });
    expect(link.getAttribute("href")).toBe(`#${nextDay}`);
    fireEvent.click(link, { ctrlKey: true });
    expect(onOpenDay).not.toHaveBeenCalled();
    fireEvent.click(link);
    expect(onOpenDay).toHaveBeenCalledWith(nextDay);
  });

  it("previews another day's items from its compact count without leaving the calendar", () => {
    const onOpenDay = vi.fn();
    const walk = { ...workout, date: nextDay, id: "walk", title: "Evening walk" };
    render(
      <CalendarGrid
        date={date}
        getItems={(day) => (day === nextDay ? [walk] : getItems(day))}
        onDateChange={vi.fn()}
        onOpenDay={onOpenDay}
        today={date}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: `Show 1 item for ${dateLabel(nextDay)}` }));
    const preview = within(screen.getByRole("region", { name: "Selected day items" }));
    expect(preview.getByText(walk.title)).toBeTruthy();
    expect(preview.queryByText(workout.title)).toBeNull();
    expect(onOpenDay).not.toHaveBeenCalled();
  });

  it("keeps the exact time in Month view and sets or clears it in Week view", () => {
    const onMove = vi.fn();
    render(
      <CalendarGrid
        date={date}
        getItems={getItems}
        onDateChange={vi.fn()}
        onMove={onMove}
        renderItem={(item) => <span>{item.title}</span>}
        today={date}
      />,
    );

    function drop(target: Element, region: string) {
      const dataTransfer = dragTransfer();
      const calendar = screen.getByRole("region", { name: region });
      const item = within(calendar).getByText(workout.title);
      fireEvent.dragStart(item, { dataTransfer });
      expect(fireEvent.dragOver(target, { dataTransfer })).toBe(false);
      fireEvent.drop(target, { dataTransfer });
      fireEvent.drop(target, { dataTransfer });
    }

    drop(
      screen.getByRole("button", { name: `Select ${dateLabel(nextDay)}` }),
      "Selected day items",
    );
    fireEvent.click(screen.getByRole("button", { name: "Week" }));
    drop(screen.getByTitle(`${dateLabel(nextDay)} 14:00`), "Week calendar");
    drop(screen.getByTitle(`${dateLabel(nextDay)} No time`), "Week calendar");

    expect(onMove.mock.calls).toEqual([
      [workout.id, date, nextDay, "08:35"],
      [workout.id, date, nextDay, "14:00"],
      [workout.id, date, nextDay, undefined],
    ]);
  });

  it("ignores drags when canMove rejects the item", () => {
    const onMove = vi.fn();
    render(
      <CalendarGrid
        canMove={() => false}
        date={date}
        getItems={getItems}
        onDateChange={vi.fn()}
        onMove={onMove}
        today={date}
      />,
    );

    const dataTransfer = dragTransfer();
    const target = screen.getByRole("button", { name: `Select ${dateLabel(nextDay)}` });
    const calendar = screen.getByRole("region", { name: "Month calendar" });
    fireEvent.dragStart(within(calendar).getByText(workout.title), { dataTransfer });
    expect(fireEvent.dragOver(target, { dataTransfer })).toBe(true);
    fireEvent.drop(target, { dataTransfer });
    expect(onMove).not.toHaveBeenCalled();
  });
});
