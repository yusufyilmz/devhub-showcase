import { readProfileHistory } from "@/services/profile-history/get-handler";
export async function GET(request: Request) {
  return readProfileHistory(request);
}
