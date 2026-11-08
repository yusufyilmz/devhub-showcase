import { ZodError, z } from "zod";

import { validatePublicProfile } from "../../schemas/profile/index";
import type { PortfolioAccessServer, PortfolioWorkspace } from "../../types/portfolio";
import { ProfileAccessError } from "../profile/index";
import { accessAttemptBucket, hashPortfolioPassword } from "./password";

type PortfolioPublicationServiceDependencies = {
  workspace: (id?: string) => Promise<PortfolioWorkspace>;
  sameOrigin: (request: Request) => boolean;
  portfolioAccessServer: () => PortfolioAccessServer;
};

const headers = { "Cache-Control": "private, no-store" };
const inputSchema = z
  .object({
    password: z.string().min(12).max(128).optional(),
    publish: z.boolean(),
    revision: z.number().int().min(1),
  })
  .strict();

class PortfolioPublicationService {
  constructor(private readonly dependencies: PortfolioPublicationServiceDependencies) {}

  async publicationStatus(id?: string) {
    try {
      const { client, repository } = await this.dependencies.workspace(id);
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
      return this.failure(error);
    }
  }

  async changePublication(request: Request, id?: string) {
    if (!this.dependencies.sameOrigin(request))
      return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
    try {
      const { client, repository } = await this.dependencies.workspace(id);
      const raw = await request.text();
      if (new TextEncoder().encode(raw).length > 1024)
        return Response.json({ error: "Request too large." }, { headers, status: 413 });
      const input = inputSchema.parse(JSON.parse(raw));
      // Identity comes from the authorized workspace, never from the request body.
      const snapshot = await repository.read();
      if (!snapshot?.id)
        return Response.json({ error: "Profile unavailable." }, { headers, status: 404 });
      if (
        input.password &&
        (!input.publish || snapshot.profile.publicationVisibility !== "password")
      )
        return Response.json(
          { error: "Save password access mode before setting a publication password." },
          { headers, status: 400 },
        );
      if (input.password && snapshot.revision !== input.revision)
        return Response.json(
          { error: "The saved revision changed. Refresh before publishing." },
          { headers, status: 409 },
        );
      let digest: string | undefined;
      if (input.password) {
        const server = this.dependencies.portfolioAccessServer();
        const reserved = await server.client.rpc("reserve_portfolio_access_attempt", {
          request_bucket: accessAttemptBucket(snapshot.id, "owner-publication", server.secret),
        });
        if (reserved.error) throw new Error("storage");
        if (reserved.data !== true)
          return Response.json(
            { error: "Too many password changes. Try again later." },
            { headers: { ...headers, "Retry-After": "300" }, status: 429 },
          );
        digest = await hashPortfolioPassword(input.password);
      }
      const result = digest
        ? await client.rpc("publish_portfolio_with_password", {
            expected_revision: input.revision,
            password_digest: digest,
            profile_id: snapshot.id,
          })
        : await client.rpc("set_portfolio_publication", {
            expected_revision: input.revision,
            profile_id: snapshot.id,
            publish: input.publish,
          });
      return this.publicationResult(result, input.publish);
    } catch (error) {
      return this.failure(error);
    }
  }

  failure(error: unknown) {
    if (error instanceof ProfileAccessError)
      return Response.json({ error: "Publication access denied." }, { headers, status: 403 });
    if (error instanceof ZodError || error instanceof SyntaxError)
      return Response.json({ error: "Invalid publication request." }, { headers, status: 400 });
    return Response.json(
      { error: "Publication storage is unavailable. Your saved draft is unchanged." },
      { headers, status: 503 },
    );
  }

  publicationResult(result: { data: unknown; error: { code?: string } | null }, publish: boolean) {
    if (result.error?.code === "22023")
      return Response.json(
        { error: "A publication password is required. Use 12–128 characters." },
        { headers, status: 400 },
      );
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
    return Response.json({ isPublic: publish, revision: result.data }, { headers });
  }
}

export function createPublicationHandlers(dependencies: PortfolioPublicationServiceDependencies) {
  const service = new PortfolioPublicationService(dependencies);
  return {
    changePublication: service.changePublication.bind(service),
    publicationStatus: service.publicationStatus.bind(service),
  };
}
