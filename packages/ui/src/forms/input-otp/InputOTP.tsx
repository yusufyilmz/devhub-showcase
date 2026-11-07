"use client";

import React from "react";

import { cn } from "cn";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { inputOTPStyles } from "./styles";
import type { InputOTPOptions, InputOTPSlotOptions } from "./types";

function InputOTP({ className, containerClassName, ...props }: InputOTPOptions) {
  return (
    <OTPInput
      className={cn(inputOTPStyles.inputOTP, className)}
      containerClassName={cn(inputOTPStyles.inputOTP2, containerClassName)}
      data-slot="input-otp"
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(inputOTPStyles.inputOTPGroup, className)}
      data-slot="input-otp-group"
      {...props}
    />
  );
}

function InputOTPSlot({ index, className, ...props }: InputOTPSlotOptions) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      className={cn(inputOTPStyles.inputOTPSlot, className)}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className={inputOTPStyles.element1}>
          <div className={inputOTPStyles.element2} />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div aria-hidden data-slot="input-otp-separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
