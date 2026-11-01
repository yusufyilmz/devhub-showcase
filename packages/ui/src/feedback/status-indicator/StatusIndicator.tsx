/** Adapted from Once UI (MIT). Copyright (c) 2024-2025 Once UI. */
const sizes = { l: "size-3", m: "size-2.5", s: "size-2" };
const colors: Record<string, string> = {
  blue: "bg-sky-500",
  gray: "bg-slate-400",
  green: "bg-emerald-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  yellow: "bg-amber-400",
};

export function StatusIndicator({
  size = "m",
  color = "green",
  ariaLabel,
}: {
  size?: keyof typeof sizes;
  color?: keyof typeof colors;
  ariaLabel?: string;
}) {
  return (
    <span
      aria-label={ariaLabel ?? `${color} status indicator`}
      className={`inline-block rounded-full ${sizes[size]} ${colors[color] ?? colors.gray}`}
      role="img"
    />
  );
}
