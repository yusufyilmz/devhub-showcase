export const listItemStyles = {
  element1: "w-full text-left",
} as const;

export function listClassName(...values: unknown[]): string {
  return `overflow-y-auto overflow-x-hidden pl-2 rounded-lg shadow-md ${values[0]} ${values[1]}`;
}

export function listItemClassName(...values: unknown[]): string {
  return `p-2 cursor-pointer transition duration-200 ${values[0]}`;
}
