export function timelineClassName(...values: unknown[]): string {
  return `relative border-l border-gray-200 dark:border-gray-700 pl-3 md:pl-6 ${values[0]}`;
}

export function timelineClassName2(...values: unknown[]): string {
  return `mb-10 ${values[0]}`;
}

export function timelineClassName3(...values: unknown[]): string {
  return `flex items-center ps-5 ${values[0]}`;
}

export function timelineClassName4(...values: unknown[]): string {
  return `absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 ${values[0]} ${values[1]}`;
}

export function timelineClassName5(...values: unknown[]): string {
  return `absolute w-0.5 h-full ${values[0]} ${values[1]}`;
}

export function timelineClassName6(...values: unknown[]): string {
  return `my-4 ml-1 ${values[0]}`;
}
