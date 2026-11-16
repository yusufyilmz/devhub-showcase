import { safeLink } from "@shared/utils";

export function isSectionImage(url: string | undefined): url is string {
  return Boolean(url && (safeLink(url) || /^\/(?![\\/])/.test(url)));
}
