export function bannerClassName(...values: unknown[]): string {
  return `flex w-full items-center justify-center gap-3 bg-button-primary px-4 py-2 text-center text-sm font-medium text-button-light ${values[0]}`;
}
