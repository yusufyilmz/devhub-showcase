import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const versionPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 32, { maxmem: 64 * 1024 * 1024, N: 32768, p: 3, r: 8 }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}
export async function hashPortfolioPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt-v1$${salt}$${(await derive(password, salt)).toString("hex")}`;
}
export async function verifyPortfolioPassword(password: string, digest: string) {
  if (!/^scrypt-v1\$[0-9a-f]{32}\$[0-9a-f]{64}$/.test(digest)) return false;
  const [, salt, expected] = digest.split("$");
  if (!salt || !expected) return false;
  return timingSafeEqual(await derive(password, salt), Buffer.from(expected, "hex"));
}
function signingKey(secret: string) {
  return createHmac("sha256", secret).update("mydevstudio:portfolio-access:key:v1").digest();
}
function signature(id: string, version: string, expires: string, secret: string) {
  return createHmac("sha256", signingKey(secret))
    .update(`${id}|${version}|${expires}`)
    .digest("base64url");
}
export const portfolioGrantCookie = (id: string) => `mds-portfolio-access-${id}`;
export function issuePortfolioGrant(id: string, version: string, secret: string, now = Date.now()) {
  const expires = String(Math.floor(now / 1000) + 3600);
  return `${version}.${expires}.${signature(id, version, expires, secret)}`;
}
export function verifyPortfolioGrant(id: string, value: string, secret: string, now = Date.now()) {
  const [version, expires, received, extra] = value.split(".");
  if (
    !version ||
    !versionPattern.test(version) ||
    !expires ||
    !/^\d{10}$/.test(expires) ||
    !received ||
    extra
  )
    return null;
  const seconds = Math.floor(now / 1000);
  if (Number(expires) <= seconds || Number(expires) > seconds + 3600) return null;
  const expected = Buffer.from(signature(id, version, expires, secret));
  const actual = Buffer.from(received);
  return expected.length === actual.length && timingSafeEqual(expected, actual) ? version : null;
}
export function accessAttemptBucket(profileId: string, address: string, secret: string) {
  return createHmac("sha256", signingKey(secret))
    .update(`attempt|${profileId}|${address.slice(0, 200)}`)
    .digest("hex");
}
