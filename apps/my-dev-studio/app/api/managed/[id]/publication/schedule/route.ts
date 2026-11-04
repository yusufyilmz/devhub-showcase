import { publicationSchedule } from "@/features/portfolio/publication/schedule-api";

async function schedule(request: Request, context: { params: Promise<{ id: string }> }) {
  return publicationSchedule(request, (await context.params).id);
}
export const GET = schedule;
export const POST = schedule;
export const DELETE = schedule;
