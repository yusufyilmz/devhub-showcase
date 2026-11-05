import { supabaseConfigured } from "@shared/auth/config";
import { createClient, createRequestClient } from "@shared/auth/server";

export const configured = supabaseConfigured;

export function fitnessUser<T extends { email_confirmed_at?: string; is_anonymous?: boolean }>(
  user: T | null,
) {
  return user?.email_confirmed_at && !user.is_anonymous ? user : null;
}

export async function requestIdentity(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
  if (token) {
    const client = createRequestClient(token);
    const { data, error } = await client.auth.getUser(token);
    return { client, user: error ? null : data.user };
  }
  try {
    const client = await createClient();
    const { data, error } = await client.auth.getUser();
    return { client, user: error ? null : data.user };
  } catch {
    return { client: createRequestClient(), user: null };
  }
}

export function sameOrigin(request: Request) {
  const expected = process.env.APP_URL?.replace(/\/$/, "");
  return Boolean(expected && request.headers.get("origin") === expected);
}
