import { z } from "zod";

import { requireConfirmedUser, sameOrigin } from "@shared/auth";
import { themeOptions } from "@shared/config/theme";
import { createServerClient } from "@shared/lib/supabase";

const headers = { "Cache-Control": "private, no-store" };
const json = (value: unknown, status = 200) => Response.json(value, { headers, status });
const layout = z.strictObject({
  size: z.number().int().min(48).max(208).optional(),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

function valid(key: string, value: unknown) {
  if (key === "mode")
    return (
      value === null || (typeof value === "string" && ["light", "dark", "system"].includes(value))
    );
  if (key === "layout:studio" || key === "layout:portfolio") return layout.safeParse(value).success;
  if (key === "tips:studio" || key === "tips:portfolio") return typeof value === "boolean";
  if (!key.startsWith("theme:")) return false;
  const name = key.slice(6);
  if (!Object.hasOwn(themeOptions, name)) return false;
  return (
    value === null ||
    (typeof value === "string" &&
      (themeOptions[name as keyof typeof themeOptions] as readonly string[]).includes(value))
  );
}

async function session() {
  const client = await createServerClient();
  const user = await requireConfirmedUser(client, () => new Error("Sign in required")).catch(
    () => null,
  );
  return { client, user };
}

export async function GET() {
  const { client, user } = await session();
  if (!user) return json({ error: "Sign in required." }, 401);
  const { data, error } = await client
    .from("studio_account_preferences")
    .select("key,value")
    .eq("user_id", user.id);
  if (error) return json({ error: "Could not load preferences." }, 503);
  return json({
    accountId: user.id,
    preferences: Object.fromEntries(
      data.filter(({ key, value }) => valid(key, value)).map(({ key, value }) => [key, value]),
    ),
  });
}

const patchSchema = z.strictObject({
  accountId: z.uuid(),
  preferences: z.record(z.string(), z.json()),
});

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  const raw = await request.text();
  if (raw.length > 8192) return json({ error: "Preferences are too large." }, 413);
  const input = patchSchema.safeParse(
    await Promise.resolve(raw)
      .then(JSON.parse)
      .catch(() => null),
  );
  if (!input.success) return json({ error: "Invalid preferences." }, 400);
  const entries = Object.entries(input.data.preferences);
  if (!entries.length || entries.length > 48 || entries.some(([key, value]) => !valid(key, value)))
    return json({ error: "Invalid preferences." }, 400);
  const { client, user } = await session();
  if (!user || user.id !== input.data.accountId) return json({ error: "Sign in required." }, 401);
  const { error } = await client
    .from("studio_account_preferences")
    .upsert(entries.map(([key, value]) => ({ key, user_id: user.id, value })));
  return error ? json({ error: "Could not save preferences." }, 503) : json({ saved: true });
}
