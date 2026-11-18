import { changePublication, publicationStatus } from "@/services/publication/get-handlers";
export async function GET() {
  return publicationStatus();
}
export async function POST(request: Request) {
  return changePublication(request);
}
