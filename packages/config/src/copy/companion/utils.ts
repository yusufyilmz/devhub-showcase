type FeatureEntry = [
  id: string,
  title: string,
  message: string,
  context?: string,
  href?: string,
  label?: string,
];

export function groupEntries(name: string, entries: FeatureEntry[]) {
  return entries.map(([id, title, message, context, href, label]) => ({
    action: href && label ? { href, label } : undefined,
    context,
    group: name,
    id,
    message,
    title,
  }));
}
