import {
  type GoogleProfileCategory,
  googleProfilePermissions,
} from "@shared/auth/google-profile-scopes";
import { reviewGooglePerson } from "@shared/lib/google-profile";

export function googleProfileClientId() {
  const value = process.env.GOOGLE_PROFILE_CLIENT_ID || "";
  return /^[a-zA-Z0-9-]+\.apps\.googleusercontent\.com$/.test(value) ? value : null;
}
export async function boundedText(source: Pick<Request, "body">, limit: number) {
  const reader = source.body?.getReader();
  if (!reader) throw new SyntaxError("Missing body");
  let length = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    length += chunk.value.byteLength;
    if (length > limit) {
      await reader.cancel();
      throw new RangeError("Too large");
    }
    chunks.push(chunk.value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
export async function readGoogleProfile(
  token: string,
  categories: GoogleProfileCategory[],
  signal: AbortSignal,
) {
  const fields = categories.flatMap((category) => googleProfilePermissions[category].fields);
  const url = new URL("https://people.googleapis.com/v1/people/me");
  url.searchParams.set("personFields", fields.join(","));
  url.searchParams.set("sources", "READ_SOURCE_TYPE_PROFILE");
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    redirect: "error",
    signal,
  });
  if (!response.ok) throw new Error("Google profile unavailable");
  const raw = JSON.parse(await boundedText(response, 65536));
  return reviewGooglePerson(Object.fromEntries(fields.map((field) => [field, raw[field]])));
}
