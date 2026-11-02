export function scrollToTopClassName(...values: unknown[]): string {
  return `fixed right-4 bottom-4 z-40 rounded-full bg-button-primary px-4 py-3 text-sm text-button-light shadow-lg transition ${values[0]}`;
}
