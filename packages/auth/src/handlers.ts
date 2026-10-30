import { z } from "zod";

import { AuthAccessError, type AuthClient, requireConfirmedUser, sameOrigin } from "./index";

export interface AuthHandlerOptions<Client extends AuthClient> {
  accessErrorCode?: string;
  accessErrorMessage?: string;
  /** App-specific provisioning/authorization; called only after verified identity. */
  afterSignIn?: (client: Client) => Promise<unknown>;
  callbackPath?: string;
  createClient: () => Promise<Client>;
  isAccessError?: (error: unknown) => boolean;
  loginPath?: string;
  setupErrorMessage?: string;
  successPath?: string;
}
function appPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\"))
    throw new Error("Auth paths must be local application paths.");
  return path;
}
/** Routes are app configuration, never read from query parameters or forwarded hosts. */
export function createAuthHandlers<Client extends AuthClient>(options: AuthHandlerOptions<Client>) {
  const login = appPath(options.loginPath ?? "/login");
  const success = appPath(options.successPath ?? "/dashboard");
  const callback = appPath(options.callbackPath ?? "/auth/callback");
  const isAccessError = (error: unknown) =>
    error instanceof AuthAccessError || Boolean(options.isAccessError?.(error));
  const redirect = (origin: string, path: string) =>
    new Response(null, {
      headers: {
        "Cache-Control": "no-store",
        Location: new URL(path, origin).href,
        "Referrer-Policy": "no-referrer",
      },
      status: 303,
    });
  const failurePath = (code: string) =>
    `${login}${login.includes("?") ? "&" : "?"}error=${encodeURIComponent(code)}`;
  const json = (body: unknown, status = 200) =>
    Response.json(body, {
      headers: { "Cache-Control": "private, no-store" },
      status,
    });
  const verify = async (client: Client) => {
    await requireConfirmedUser(client);
    await options.afterSignIn?.(client);
  };
  const signInFailure = (reason: unknown) =>
    json(
      {
        error: isAccessError(reason)
          ? (options.accessErrorMessage ?? "Confirm your account before continuing.")
          : (options.setupErrorMessage ?? "Sign in is unavailable. Check setup or try again."),
      },
      isAccessError(reason) ? 403 : 503,
    );
  const verifyOrSignOut = async (client: Client) => {
    try {
      await verify(client);
    } catch (reason) {
      await client.auth.signOut({ scope: "local" });
      throw reason;
    }
  };
  return {
    async callback(request: Request) {
      const url = new URL(request.url);
      const code = url.searchParams.get("code");
      if (!code || url.searchParams.has("error"))
        return redirect(url.origin, failurePath("google_failed"));
      try {
        const client = await options.createClient();
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (error) return redirect(url.origin, failurePath("google_failed"));
        try {
          await verify(client);
        } catch (reason) {
          await client.auth.signOut({ scope: "local" });
          return redirect(
            url.origin,
            failurePath(
              isAccessError(reason) ? (options.accessErrorCode ?? "unconfirmed") : "setup",
            ),
          );
        }
        return redirect(url.origin, success);
      } catch {
        return redirect(url.origin, failurePath("google_failed"));
      }
    },
    async google(request: Request) {
      if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
      const origin = new URL(request.url).origin;
      try {
        const client = await options.createClient();
        const { data, error } = await client.auth.signInWithOAuth({
          options: {
            queryParams: { prompt: "select_account" },
            redirectTo: `${origin}${callback}`,
            skipBrowserRedirect: true,
          },
          provider: "google",
        });
        if (error || !data.url) throw new Error("Could not start Google sign in");
        // OAuth destination comes from the configured Supabase SDK, never a request parameter.
        const response = new Response(null, {
          headers: { "Cache-Control": "no-store", Location: data.url },
          status: 303,
        });
        return response;
      } catch {
        return redirect(origin, failurePath("google_failed"));
      }
    },
    async signIn(request: Request) {
      if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
      const body = await request.text();
      if (body.length > 10000) return json({ error: "The sign in request is too large." }, 413);
      let input: unknown;
      try {
        input = JSON.parse(body);
      } catch {
        return json({ error: "Enter your email and password." }, 400);
      }
      const parsed = z
        .object({ email: z.email(), password: z.string().min(1).max(300) })
        .safeParse(input);
      if (!parsed.success) return json({ error: "Enter your email and password." }, 400);
      try {
        const client = await options.createClient();
        const { error } = await client.auth.signInWithPassword(parsed.data);
        if (error)
          return json(
            {
              error: "Could not sign in. Check your credentials or try again later.",
            },
            401,
          );
        await verifyOrSignOut(client);
        return json({ ok: true });
      } catch (reason) {
        return signInFailure(reason);
      }
    },
    async signOut(request: Request) {
      if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
      try {
        const client = await options.createClient();
        const { error } = await client.auth.signOut({ scope: "local" });
        if (error) throw error;
        return json({ ok: true });
      } catch {
        return json({ error: "Could not sign out. Try again." }, 503);
      }
    },
  };
}
