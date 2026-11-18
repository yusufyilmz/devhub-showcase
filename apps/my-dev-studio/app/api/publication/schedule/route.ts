import { publicationSchedule } from "@/services/publication/get-schedule-handlers";

async function schedule(request: Request) {
  return publicationSchedule(request);
}
export const GET = schedule;
export const POST = schedule;
export const DELETE = schedule;
