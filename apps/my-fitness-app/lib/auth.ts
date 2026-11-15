import { supabaseConfigured } from "@shared/auth/config";
import { createClient, createRequestClient } from "@shared/auth/server";

import { env } from "@/env";

export const configured = supabaseConfigured;

export function fitnessUser<T extends { email_confirmed_at?: string; is_anonymous?: boolean }>(
  user: T | null,
) {
  return user?.email_confirmed_at && !user.is_anonymous ? user : null;
}

export async function requestIdentity<Database = unknown>(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
  if (token) {
    const client = createRequestClient<Database>(token);
    const { data, error } = await client.auth.getUser(token);
    return { client, user: error ? null : data.user };
  }
  try {
    const client = await createClient<Database>();
    const { data, error } = await client.auth.getUser();
    return { client, user: error ? null : data.user };
  } catch {
    return { client: createRequestClient<Database>(), user: null };
  }
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return false;
  return [env.APP_URL, env.FITNESS_ADDITIONAL_ORIGIN].some(
    (allowed) => allowed?.replace(/\/$/, "") === origin,
  );
}
