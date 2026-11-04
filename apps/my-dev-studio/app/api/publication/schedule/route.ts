import { monitored } from "@/features/platform/operation-monitoring";
import { publicationSchedule } from "@/features/portfolio/publication/schedule-api";

async function schedule(request: Request) {
  return publicationSchedule(request);
}
export const GET = schedule;
export const POST = monitored("publication.schedule", schedule);
export const DELETE = monitored("publication.schedule", schedule);
