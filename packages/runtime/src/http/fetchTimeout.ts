export async function fetchTimeout(
  resource: string,
  options: RequestInit = {},
  timeout = 8000,
): Promise<Response> {
  const signal = AbortSignal.timeout(timeout);

  const response: Response = await fetch(resource, {
    ...options,
    signal,
  });

  return response;
}

export default fetchTimeout;
