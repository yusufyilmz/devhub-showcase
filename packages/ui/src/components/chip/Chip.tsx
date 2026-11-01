/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
"use client";

export function Chip({
  label,
  selected = true,
  onRemove,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}) {
  const classes = `inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm ${
    selected
      ? "border-main-green/50 bg-main-green/15 text-main-green"
      : "border-main-lightest text-textColor-secondary"
  }`;
  return (
    <span className={classes}>
      {onClick ? (
        <button className="bg-transparent" onClick={onClick} type="button">
          {label}
        </button>
      ) : (
        label
      )}
      {onRemove ? (
        <button
          aria-label={`Remove ${label}`}
          className="px-1 text-xs"
          onClick={onRemove}
          type="button"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
