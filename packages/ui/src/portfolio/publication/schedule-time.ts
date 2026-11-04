/** Reject local clock gaps instead of silently shifting a DST time. The review shows UTC too. */
export function scheduledInstant(local: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return null;
  const date = new Date(local);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
  const expected = local.split(/[-T:]/).map(Number);
  return parts.every((part, index) => part === expected[index]) ? date.toISOString() : null;
}
