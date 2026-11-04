import {
  changePublication,
  publicationStatus,
} from "@/features/portfolio/publication/publication-api";

type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, context: Context) {
  return publicationStatus((await context.params).id);
}
export async function POST(request: Request, context: Context) {
  return changePublication(request, (await context.params).id);
}
