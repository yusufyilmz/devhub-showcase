import { changePublication, publicationStatus } from "./_handlers";
export async function GET() {
  return publicationStatus();
}
export async function POST(request: Request) {
  return changePublication(request);
}
