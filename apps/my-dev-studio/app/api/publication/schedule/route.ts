import { publicationSchedule } from "./_handlers";

async function schedule(request: Request) {
  return publicationSchedule(request);
}
export const GET = schedule;
export const POST = schedule;
export const DELETE = schedule;
