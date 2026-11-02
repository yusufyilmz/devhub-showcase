import type * as React from "react";

import { cn } from "cn";

import { alertStyles, alertVariants } from "./styles";
import type { AlertOptions } from "./types";

function Alert({ className, variant, ...props }: AlertOptions) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(alertStyles.alertTitle, className)} data-slot="alert-title" {...props} />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(alertStyles.alertDescription, className)}
      data-slot="alert-description"
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
