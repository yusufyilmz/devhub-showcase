import { z } from "zod";

import { supabaseConfigured } from "./supabase/config";
import { createSupabaseRequestClient } from "./supabase/server";
export const configured = supabaseConfigured;
export function workspaceOwnerId() {
  const owner = z.uuid().safeParse(process.env.WORKSPACE_OWNER_ID);
  if (!owner.success) throw new Error("Set WORKSPACE_OWNER_ID to your Supabase Auth user UUID.");
  return owner.data;
}
export async function requestIdentity(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
  const client = createSupabaseRequestClient(token);
  if (!token) return { client, user: null };
  const { data, error } = await client.auth.getUser(token);
  return { client, user: error ? null : data.user };
}
export function sameOrigin(request: Request) {
  const expected = process.env.APP_URL?.replace(/\/$/, "");
  return Boolean(expected && request.headers.get("origin") === expected);
}
