import { NextResponse } from "next/server";

import { requireConfirmedUser } from "@shared/auth";
import { createServerClient } from "@shared/lib/supabase";

export async function calendarSession() {
  const client = await createServerClient();
  const user = await requireConfirmedUser(client).catch(() => null);
  return { client, user };
}

export function calendarJson(value: unknown, status = 200) {
  return NextResponse.json(value, { headers: { "Cache-Control": "private, no-store" }, status });
}
