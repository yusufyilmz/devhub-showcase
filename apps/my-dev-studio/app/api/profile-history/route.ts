import { readProfileHistory } from "./_handler";
export async function GET(request: Request) {
  return readProfileHistory(request);
}
