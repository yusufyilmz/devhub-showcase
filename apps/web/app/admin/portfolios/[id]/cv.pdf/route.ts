import { cvResponse } from "@/lib/cv-response";
import { managedFailure } from "@/lib/managed-api";
import { managedRepository } from "@/lib/managed-portfolios";
export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { repository } = await managedRepository((await context.params).id);
    const saved = await repository.read();
    if (!saved) return new Response("Not found", { status: 404 });
    return cvResponse(saved);
  } catch (error) {
    return managedFailure(error);
  }
}
