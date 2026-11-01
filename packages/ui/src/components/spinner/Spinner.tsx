"use client";

import type React from "react";

import { cn } from "cn";

export type SpinnerProps = {
  size?: number;
  className?: string;
};

export const Spinner = ({ size = 24, className }: SpinnerProps) => {
  const style: React.CSSProperties = {
    height: size,
    width: size,
  };
  return (
    <div
      aria-label="loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-gray-300 border-t-blue-500",
        className,
      )}
      role="status"
      style={style}
    />
  );
};
