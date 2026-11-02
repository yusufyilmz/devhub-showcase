"use client";

import * as React from "react";
import { type DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "cn";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button, buttonVariants } from "../../buttons/button/Button";
import { calendarStyles } from "./styles";
import type { CalendarChevronOptions, CalendarOptions, CalendarRootOptions } from "./types";

function CalendarChevron({ className, orientation, ...props }: CalendarChevronOptions) {
  if (orientation === "left") {
    return <ChevronLeftIcon className={cn(calendarStyles.calendarChevron, className)} {...props} />;
  }

  if (orientation === "right") {
    return (
      <ChevronRightIcon className={cn(calendarStyles.calendarChevron2, className)} {...props} />
    );
  }

  return <ChevronDownIcon className={cn(calendarStyles.calendarChevron3, className)} {...props} />;
}

function CalendarRoot({ className, rootRef, ...props }: CalendarRootOptions) {
  return <div className={cn(className)} data-slot="calendar" ref={rootRef} {...props} />;
}

function CalendarWeekNumber({ children, ...props }: React.ComponentProps<"td">) {
  return (
    <td {...props}>
      <div className={calendarStyles.element1}>{children}</div>
    </td>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: CalendarOptions) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      captionLayout={captionLayout}
      className={cn(
        calendarStyles.calendar,
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      classNames={{
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          calendarStyles.calendar2,
          defaultClassNames.button_next,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          calendarStyles.calendar3,
          defaultClassNames.button_previous,
        ),
        caption_label: cn(
          calendarStyles.calendar4,
          captionLayout === "label" ? calendarStyles.calendar5 : calendarStyles.calendar6,
          defaultClassNames.caption_label,
        ),
        day: cn(calendarStyles.calendar7, defaultClassNames.day),
        disabled: cn(calendarStyles.calendar8, defaultClassNames.disabled),
        dropdown: cn(calendarStyles.calendar9, defaultClassNames.dropdown),
        dropdown_root: cn(calendarStyles.calendar10, defaultClassNames.dropdown_root),
        dropdowns: cn(calendarStyles.calendar11, defaultClassNames.dropdowns),
        hidden: cn(calendarStyles.calendar12, defaultClassNames.hidden),
        month: cn(calendarStyles.calendar13, defaultClassNames.month),
        month_caption: cn(calendarStyles.calendar14, defaultClassNames.month_caption),
        months: cn(calendarStyles.calendar15, defaultClassNames.months),
        nav: cn(calendarStyles.calendar16, defaultClassNames.nav),
        outside: cn(calendarStyles.calendar17, defaultClassNames.outside),
        range_end: cn(calendarStyles.calendar18, defaultClassNames.range_end),
        range_middle: cn(calendarStyles.calendar19, defaultClassNames.range_middle),
        range_start: cn(calendarStyles.calendar20, defaultClassNames.range_start),
        root: cn(calendarStyles.calendar21, defaultClassNames.root),
        table: "w-full border-collapse",
        today: cn(calendarStyles.calendar22, defaultClassNames.today),
        week: cn(calendarStyles.calendar23, defaultClassNames.week),
        week_number: cn(calendarStyles.calendar24, defaultClassNames.week_number),
        week_number_header: cn(calendarStyles.calendar25, defaultClassNames.week_number_header),
        weekday: cn(calendarStyles.calendar26, defaultClassNames.weekday),
        weekdays: cn(calendarStyles.calendar27, defaultClassNames.weekdays),
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        Root: CalendarRoot,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      className={cn(calendarStyles.calendarDayButton, defaultClassNames.day, className)}
      data-day={day.date.toLocaleDateString()}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      ref={ref}
      size="icon"
      variant="ghost"
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
