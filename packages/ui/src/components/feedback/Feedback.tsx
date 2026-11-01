/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
import type { ReactNode } from "react";

const variants = {
  danger: "border-red-500/40 bg-red-500/10",
  info: "border-sky-500/40 bg-sky-500/10",
  success: "border-emerald-500/40 bg-emerald-500/10",
  warning: "border-amber-400/40 bg-amber-400/10",
};

export function Feedback({
  variant = "info",
  title,
  description,
  children,
  onClose,
}: {
  variant?: keyof typeof variants;
  title?: string;
  description?: string;
  children?: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className={`flex w-full gap-3 rounded-xl border p-4 text-textColor-primary ${variants[variant]}`}
      role="alert"
    >
      <div className="flex-1">
        {title ? <p className="font-medium">{title}</p> : null}
        {description ? <p className="text-sm text-textColor-secondary">{description}</p> : null}
        {children}
      </div>
      {onClose ? (
        <button
          aria-label="Dismiss"
          className="text-textColor-secondary"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
