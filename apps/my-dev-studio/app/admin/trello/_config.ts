import { env } from "@/env";

export function trelloConfig() {
  const apiKey = env.TRELLO_API_KEY?.trim();
  const token = env.TRELLO_API_TOKEN?.trim();
  if (!apiKey || !token) return null;
  return { apiKey, token, workspaceId: env.TRELLO_WORKSPACE_ID?.trim() || undefined };
}
