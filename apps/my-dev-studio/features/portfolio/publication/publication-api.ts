import { ZodError, z } from "zod";

import { validatePublicProfile } from "@shared/lib/profiles";
import { ProfileAccessError } from "@shared/services/profile";

import { requireWorkspace, sameOrigin } from "@/features/admin/admin-auth";
import { managedRepository } from "@/features/management/managed-portfolios";

const headers = { "Cache-Control": "private, no-store" };
const inputSchema = z.object({ publish: z.boolean(), revision: z.number().int().min(1) }).strict();
async function workspace(id?: string) {
  return id ? managedRepository(id) : requireWorkspace();
}
export async function publicationStatus(id?: string) {
  try {
    const { client, repository } = await workspace(id);
    const snapshot = await repository.read();
    if (!snapshot?.id)
      return Response.json({ error: "Profile unavailable." }, { headers, status: 404 });
    const result = await client
      .from("portfolio_publications")
      .select("revision,username,updated_at,document")
      .eq("id", snapshot.id)
      .maybeSingle();
    if (result.error) throw new Error("storage");
    const cv = await client
      .from("portfolio_public_cvs")
      .select("document")
      .eq("id", snapshot.id)
      .maybeSingle();
    if (cv.error) throw new Error("storage");
    const published = result.data
      ? {
          profile: validatePublicProfile(result.data.document),
          revision: result.data.revision,
          updated_at: result.data.updated_at,
          username: result.data.username,
        }
      : null;
    return Response.json(
      {
        currentRevision: snapshot.revision,
        published,
        publishedCv: cv.data ? validatePublicProfile(cv.data.document) : null,
      },
      { headers },
    );
  } catch (error) {
    return failure(error);
  }
}
export async function changePublication(request: Request, id?: string) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const { client, repository } = await workspace(id);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 1024)
      return Response.json({ error: "Request too large." }, { headers, status: 413 });
    const input = inputSchema.parse(JSON.parse(raw));
    // Identity comes from the authorized workspace, never from the request body.
    const snapshot = await repository.read();
    if (!snapshot?.id)
      return Response.json({ error: "Profile unavailable." }, { headers, status: 404 });
    const result = await client.rpc("set_portfolio_publication", {
      expected_revision: input.revision,
      profile_id: snapshot.id,
      publish: input.publish,
    });
    if (result.error?.code === "40001" || result.error?.code === "23505")
      return Response.json(
        {
          error:
            "The saved revision or public URL changed. Refresh publication status before trying again.",
        },
        { headers, status: 409 },
      );
    if (result.error?.code === "42501") throw new ProfileAccessError();
    if (result.error) throw new Error("storage");
    return Response.json({ isPublic: input.publish, revision: result.data }, { headers });
  } catch (error) {
    return failure(error);
  }
}
function failure(error: unknown) {
  if (error instanceof ProfileAccessError)
    return Response.json({ error: "Publication access denied." }, { headers, status: 403 });
  if (error instanceof ZodError || error instanceof SyntaxError)
    return Response.json({ error: "Invalid publication request." }, { headers, status: 400 });
  return Response.json(
    { error: "Publication storage is unavailable. Your saved draft is unchanged." },
    { headers, status: 503 },
  );
}
