import { readProfileHistory } from "@/features/portfolio/publication/profile-history-api";
export async function GET(request: Request) {
  return readProfileHistory(request);
}
