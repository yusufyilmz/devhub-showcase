import type { Database, SupabaseDbClient } from "../../types/index";

export type FeatureProgressDatabase = Database;
type App = "studio" | "fitness";
type Identity = { client: SupabaseDbClient; user: { id: string } | null };
type Options = {
  app: App;
  identify: (request: Request) => Promise<Identity>;
  sameOrigin: (request: Request) => boolean;
};
const headers = { "Cache-Control": "private, no-store", Vary: "Authorization, Cookie" };
const response = (status: number) => new Response(null, { headers, status });

function featureIds(input: unknown) {
  if (!input || typeof input !== "object" || !("ids" in input) || !Array.isArray(input.ids))
    return null;
  if (!input.ids.length || input.ids.length > 100) return null;
  if (
    !input.ids.every(
      (id): id is string => typeof id === "string" && /^[a-z][a-z0-9-]{0,79}$/.test(id),
    )
  )
    return null;
  return [...new Set(input.ids)];
}

export function companionProgressHandlers({ app, identify, sameOrigin }: Options) {
  return {
    async GET(request: Request) {
      try {
        const { client, user } = await identify(request);
        if (!user) return response(401);
        const [catalog, completed] = await Promise.all([
          client
            .from("companion_features")
            .select("feature_id,category,title,message,context")
            .eq("app", app)
            .order("position"),
          client
            .from("companion_feature_progress")
            .select("feature_id")
            .eq("user_id", user.id)
            .eq("app", app),
        ]);
        if (catalog.error || completed.error) return response(503);
        return Response.json(
          {
            completed: completed.data.map(({ feature_id }) => feature_id),
            features: catalog.data.map(({ category, context, feature_id, message, title }) => ({
              context: context ?? undefined,
              group: category,
              id: feature_id,
              message,
              title,
            })),
            scope: user.id,
          },
          { headers },
        );
      } catch {
        return response(503);
      }
    },
    async POST(request: Request) {
      if (!sameOrigin(request)) return response(403);
      try {
        const { client, user } = await identify(request);
        if (!user) return response(401);
        const raw = await request.text();
        if (raw.length > 10000) return response(413);
        const input: unknown = (() => {
          try {
            return JSON.parse(raw);
          } catch {
            return null;
          }
        })();
        const ids = featureIds(input);
        if (!ids) return response(400);
        const { error } = await client.from("companion_feature_progress").upsert(
          ids.map((id) => ({ app, feature_id: id, user_id: user.id })),
          { ignoreDuplicates: true, onConflict: "user_id,app,feature_id" },
        );
        if (error) return response(error.code === "23503" ? 400 : 503);
        return response(204);
      } catch {
        return response(503);
      }
    },
  };
}
