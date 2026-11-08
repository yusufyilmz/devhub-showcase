import { ZodError } from "zod";

import { AuthAccessError, requireConfirmedUser } from "@shared/auth";
import {
  cvLibraryWriteSchema as inputSchema,
  cvLibrarySchema as librarySchema,
} from "@shared/lib/profiles";
import { createServerClient } from "@shared/lib/supabase";

import { sameOrigin } from "@/features/admin/admin-auth";

import type { Json } from "../../../../../packages/lib/src/types";

const headers = { "Cache-Control": "private, no-store" };
async function session() {
  const client = await createServerClient();
  const user = await requireConfirmedUser(client);
  return { client, user };
}
export async function GET() {
  try {
    const { client, user } = await session();
    const { data, error } = await client
      .from("portfolio_cv_variants")
      .select("variants,revision")
      .eq("owner_id", user.id)
      .maybeSingle();
    if (error) throw new Error("storage");
    return Response.json(
      {
        revision: data?.revision ?? 0,
        variants: librarySchema.parse(data?.variants ?? []),
      },
      { headers },
    );
  } catch (error) {
    return failure(error);
  }
}
export async function PUT(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const { client, user } = await session();
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 2_000_000)
      return Response.json({ error: "CV version library is too large." }, { headers, status: 413 });
    const input = inputSchema.parse(JSON.parse(raw));
    const document = {
      revision: input.revision + 1,
      updated_at: new Date().toISOString(),
      variants: input.variants as unknown as Json,
    };
    const result =
      input.revision === 0
        ? await client
            .from("portfolio_cv_variants")
            .insert({ ...document, owner_id: user.id })
            .select("variants,revision")
            .single()
        : await client
            .from("portfolio_cv_variants")
            .update(document)
            .eq("owner_id", user.id)
            .eq("revision", input.revision)
            .select("variants,revision")
            .maybeSingle();
    if (result.error?.code === "23505" || (!result.error && !result.data))
      return Response.json(
        {
          error: "Another tab changed your variants. Reload the library before saving.",
        },
        { headers, status: 409 },
      );
    if (result.error) throw new Error("storage");
    return Response.json(result.data, { headers });
  } catch (error) {
    return failure(error);
  }
}
function failure(error: unknown) {
  if (error instanceof ZodError)
    return Response.json(
      {
        error: error.issues
          .slice(0, 5)
          .map((issue) => issue.message)
          .join("\n"),
      },
      { headers, status: 400 },
    );
  if (error instanceof SyntaxError)
    return Response.json({ error: "Invalid JSON." }, { headers, status: 400 });
  if (error instanceof AuthAccessError)
    return Response.json(
      { error: "Sign in to access your private CV version library." },
      { headers, status: 403 },
    );
  return Response.json(
    {
      error: "Could not access the CV version library. Check setup or try again.",
    },
    { headers, status: 503 },
  );
}
