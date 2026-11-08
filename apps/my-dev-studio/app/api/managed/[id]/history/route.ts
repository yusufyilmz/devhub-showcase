import { readProfileHistory } from "../../../profile-history/_handler";
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return readProfileHistory(request, (await context.params).id);
}
