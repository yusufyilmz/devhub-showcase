export function noop(): void {
  // Do nothing
}

export async function noopAsync(): Promise<void> {
  return Promise.resolve();
}
