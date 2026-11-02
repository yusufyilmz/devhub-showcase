import type * as React from "react";
import type { DayPicker } from "react-day-picker";

import type { Button } from "../../buttons/button/Button";

export type CalendarChevronOptions = React.ComponentProps<"svg"> & {
  orientation?: "left" | "right" | "up" | "down";
};

export type CalendarRootOptions = React.ComponentProps<"div"> & {
  rootRef?: React.Ref<HTMLDivElement>;
};

export type CalendarOptions = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};
