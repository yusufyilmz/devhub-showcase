import { monitored } from "@/features/platform/operation-monitoring";
import {
  changePublication,
  publicationStatus,
} from "@/features/portfolio/publication/publication-api";
export async function GET() {
  return publicationStatus();
}
async function post(request: Request) {
  return changePublication(request);
}

export const POST = monitored("publication.change", post);
