import { env } from "@/env";

/** Opt-in local test sign-in. All checks must pass on the server. */
export function localTestLoginEnabled(
  environment: Partial<
    Pick<NodeJS.ProcessEnv, "NODE_ENV" | "LOCAL_TEST_LOGIN" | "NEXT_PUBLIC_SUPABASE_URL">
  > = env,
): boolean {
  if (environment.NODE_ENV !== "development" || environment.LOCAL_TEST_LOGIN !== "true")
    return false;
  const supabaseUrl = environment.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;
  try {
    const url = new URL(supabaseUrl);
    return (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1")
    );
  } catch {
    return false;
  }
}

function isLoopbackHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

/** Requires a matching local Origin as well as a local URL, never forwarded headers. */
export function localTestLoginRequestAllowed(request: Request): boolean {
  if (!localTestLoginEnabled()) return false;
  try {
    const requestUrl = new URL(request.url);
    const origin = request.headers.get("origin");
    if (requestUrl.protocol !== "http:" || !isLoopbackHost(requestUrl.hostname)) return false;
    if (!origin || new URL(origin).origin !== requestUrl.origin) return false;
    return isLoopbackHost(new URL(origin).hostname);
  } catch {
    return false;
  }
}
