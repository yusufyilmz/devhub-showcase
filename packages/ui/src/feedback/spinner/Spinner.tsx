"use client";

import type React from "react";

import { cn } from "cn";

import { spinnerStyles } from "./styles";
import type { SpinnerProps } from "./types";

export const Spinner = ({ size = 24, className }: SpinnerProps) => {
  const style: React.CSSProperties = {
    height: size,
    width: size,
  };
  return (
    <div
      aria-label="loading"
      className={cn(spinnerStyles.spinner, className)}
      role="status"
      style={style}
    />
  );
};

export type { SpinnerProps } from "./types";
