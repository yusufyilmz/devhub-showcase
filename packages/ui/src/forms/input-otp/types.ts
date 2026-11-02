import type * as React from "react";

import type { OTPInput } from "input-otp";

export type InputOTPOptions = React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
};

export type InputOTPSlotOptions = React.ComponentProps<"div"> & {
  index: number;
};
