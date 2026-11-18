export const listItemStyles = {
  element1: "w-full text-left",
} as const;

export function listClassName(...values: unknown[]): string {
  return values
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");
}

export function listItemClassName(...values: unknown[]): string {
  return `p-2 cursor-pointer transition duration-200 ${values[0]}`;
}
