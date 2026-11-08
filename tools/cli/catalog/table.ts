/** Keep generated tables deterministic and safe for Markdown/lookup table parsing. */
export function table(columns: string[], rows: string[][]): string {
  const cells = [columns, ...rows].map((row) =>
    row.map((cell) => cell.replace(/\|/g, "\\|").replace(/\r?\n/g, " ")),
  );
  const widths = columns.map((_, index) =>
    Math.max(3, ...cells.map((row) => (row[index] ?? "").length)),
  );
  const line = (row: string[]) =>
    `| ${row.map((cell, index) => cell.padEnd(widths[index] ?? 3)).join(" | ")} |`;
  return [
    line(cells[0] ?? []),
    line(widths.map((width) => "-".repeat(width))),
    ...cells.slice(1).map(line),
  ].join("\n");
}
export function code(value: string): string {
  const runs = value.match(/`+/g) ?? [];
  const delimiter = "`".repeat(Math.max(1, ...runs.map((run) => run.length + 1)));
  const padding = value.startsWith("`") || value.endsWith("`") ? " " : "";
  return `${delimiter}${padding}${value}${padding}${delimiter}`;
}
