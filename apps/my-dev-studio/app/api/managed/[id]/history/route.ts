import { readProfileHistory } from "@/features/portfolio/publication/profile-history-api";
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return readProfileHistory(request, (await context.params).id);
}
