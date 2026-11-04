import {
  changePublication,
  publicationStatus,
} from "@/features/portfolio/publication/publication-api";
export async function GET() {
  return publicationStatus();
}
export async function POST(request: Request) {
  return changePublication(request);
}
