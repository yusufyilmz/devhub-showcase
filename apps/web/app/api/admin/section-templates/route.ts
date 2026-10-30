import { AuthAccessError, requireConfirmedUser } from "@shared/auth";
import { savedSectionTemplateSchema } from "@shared/lib/section-templates";
import { createServerClient } from "@shared/lib/supabase";
import type { Json } from "@shared/lib/types";
import { ZodError, z } from "zod";

import { sameOrigin } from "../../../../lib/admin-auth";

const headers = { "Cache-Control": "private, no-store" };
const librarySchema = z
  .array(savedSectionTemplateSchema)
  .max(5)
  .refine(
    (items) => new Set(items.map(({ id }) => id)).size === items.length,
    "Each template needs a unique ID",
  );
const inputSchema = z
  .object({ revision: z.number().int().min(0), templates: librarySchema })
  .strict();
async function session() {
  const client = await createServerClient();
  const user = await requireConfirmedUser(client);
  return { client, user };
}
export async function GET() {
  try {
    const { client, user } = await session();
    const { data, error } = await client
      .from("portfolio_section_templates")
      .select("templates,revision")
      .eq("owner_id", user.id)
      .maybeSingle();
    if (error) throw new Error("storage");
    return Response.json(
      {
        revision: data?.revision ?? 0,
        templates: librarySchema.parse(data?.templates ?? []),
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
    if (new TextEncoder().encode(raw).length > 800_000)
      return Response.json({ error: "Template library is too large." }, { headers, status: 413 });
    const input = inputSchema.parse(JSON.parse(raw));
    const document = {
      revision: input.revision + 1,
      templates: input.templates as unknown as Json,
      updated_at: new Date().toISOString(),
    };
    const result =
      input.revision === 0
        ? await client
            .from("portfolio_section_templates")
            .insert({ ...document, owner_id: user.id })
            .select("templates,revision")
            .single()
        : await client
            .from("portfolio_section_templates")
            .update(document)
            .eq("owner_id", user.id)
            .eq("revision", input.revision)
            .select("templates,revision")
            .maybeSingle();
    if (result.error?.code === "23505" || (!result.error && !result.data))
      return Response.json(
        {
          error: "Another tab changed your templates. Reload the library before saving.",
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
      { error: "Sign in to access your private template library." },
      { headers, status: 403 },
    );
  return Response.json(
    {
      error: "Could not access the template library. Check setup or try again.",
    },
    { headers, status: 503 },
  );
}
