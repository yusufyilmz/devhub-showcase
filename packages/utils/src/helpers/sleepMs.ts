export function sleepMs(durationMs: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, durationMs);
  });
}
