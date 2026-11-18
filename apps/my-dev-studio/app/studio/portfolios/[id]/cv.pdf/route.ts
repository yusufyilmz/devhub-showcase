import { cvResponse } from "@/services/cv/get-response";
import { managedFailure } from "@/services/management/get-api";
import { managedRepository } from "@/services/management/get-portfolios";

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
