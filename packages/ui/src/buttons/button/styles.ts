import { cva } from "class-variance-authority";
import { cn } from "cn";

import type { ButtonOptions } from "./types";

function isOn(value: boolean | "true" | "false" | undefined) {
  return value === true || value === "true";
}

function buttonCursor({
  disabled,
  busy,
  ariaDisabled,
}: {
  disabled?: boolean;
  busy?: ButtonOptions["aria-busy"];
  ariaDisabled?: ButtonOptions["aria-disabled"];
}) {
  if (disabled || isOn(ariaDisabled)) return "cursor-not-allowed";
  if (isOn(busy)) return "cursor-progress";
  return "cursor-pointer";
}

export function buttonClasses({
  variant,
  className,
  size,
  disabled,
  "aria-busy": busy,
  "aria-disabled": ariaDisabled,
}: Pick<
  ButtonOptions,
  "variant" | "className" | "size" | "disabled" | "aria-busy" | "aria-disabled"
>) {
  const cursor = buttonCursor({ ariaDisabled, busy, disabled });
  return variant === "unstyled"
    ? cn(cursor, className)
    : cn(buttonVariants({ className, size, variant }), cursor);
}

export const buttonVariants = cva(
  "ui-button group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow] outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:border-transparent disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-lg": "size-9",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
      },
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "border-destructive bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/30",
        ghost: "text-muted-foreground hover:text-foreground aria-expanded:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "border-border bg-transparent text-foreground hover:bg-foreground/5 aria-expanded:bg-foreground/5",
        text: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground aria-expanded:bg-foreground/5 aria-expanded:text-foreground",
        unstyled: "",
      },
    },
  },
);
