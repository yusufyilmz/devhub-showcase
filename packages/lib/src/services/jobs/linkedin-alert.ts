import { createHash } from "node:crypto";

const linkedinHosts = new Set(["www.linkedin.com", "linkedin.com"]);
const jobPath = /^\/(?:comm\/)?jobs\/view\/(?:[\w%-]+-)?(\d{1,20})\/?$/i;
const entities: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

function decode(value: string) {
  return value.replace(/&(amp|apos|gt|lt|nbsp|quot|#39);/gi, (_, key: string) =>
    key === "#39" ? "'" : (entities[key.toLowerCase()] ?? ""),
  );
}

function jobLink(input: string) {
  const parsed = URL.parse(decode(input));
  if (
    parsed?.protocol !== "https:" ||
    !linkedinHosts.has(parsed.hostname) ||
    parsed.username ||
    parsed.password ||
    parsed.port
  )
    return null;
  const id = jobPath.exec(parsed.pathname)?.[1];
  return id ? { id, url: `https://www.linkedin.com/jobs/view/${id}/` } : null;
}

export function extractLinkedInAlert(text: string, html: string) {
  const jobs = new Map<
    string,
    { id: string; listing: { sourceId: string; title: string; url: string } }
  >();
  function add(url: string, label = "") {
    const link = jobLink(url);
    if (!link || jobs.has(link.id) || jobs.size >= 25) return;
    const title = decode(label.replace(/<[^>]*>/g, " "))
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180);
    jobs.set(link.id, {
      id: createHash("sha256").update(`linkedin:${link.id}`).digest("hex"),
      listing: {
        sourceId: link.id,
        title: title && !/^(view|apply|see|https:)/i.test(title) ? title : "",
        url: link.url,
      },
    });
  }
  for (const anchor of html.matchAll(
    /<a\b[^<>]{0,4096}?\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')[^<>]{0,4096}>([\s\S]{0,1200}?)<\/a\s*>/gi,
  )) {
    add(anchor[1] ?? anchor[2] ?? "", anchor[3]);
  }
  for (const url of text.matchAll(/https:\/\/[^\s<>"()[\]]+/gi)) add(url[0]);
  return [...jobs.values()];
}
