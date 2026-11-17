import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

type Purpose = "oauth" | "connection";

export function sealGoogleSession(
  key: string,
  owner: string,
  purpose: Purpose,
  value: string,
  ttl: number,
) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv);
  cipher.setAAD(Buffer.from(`${purpose}:${owner}`));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify({ expires: Date.now() + ttl * 1000, value }), "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64url")).join(".");
}

export function openGoogleSession(key: string, owner: string, purpose: Purpose, cookie?: string) {
  if (!cookie) return undefined;
  const [iv, tag, input, extra] = cookie.split(".");
  if (!iv || !tag || !input || extra !== undefined) return undefined;
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "base64url"),
      { authTagLength: 16 },
    );
    decipher.setAAD(Buffer.from(`${purpose}:${owner}`));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(input, "base64url")),
      decipher.final(),
    ]);
    const { expires, value } = JSON.parse(decrypted.toString("utf8"));
    return typeof value === "string" && typeof expires === "number" && expires > Date.now()
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}
