import { randomUUID } from "node:crypto";

const tasks = new Map();

export async function calendarFixture(request, response, url, owner) {
  if (url.pathname !== "/rest/v1/studio_calendar_tasks") return false;
  if (!owner) {
    response.writeHead(403).end(JSON.stringify({ code: "42501" }));
    return true;
  }
  const userId = owner.owner_id;
  const { method } = request;
  const filters = url.searchParams;
  if (method === "GET") {
    const from = filters
      .getAll("day")
      .find((value) => value.startsWith("gte."))
      ?.slice(4);
    const to = filters
      .getAll("day")
      .find((value) => value.startsWith("lt."))
      ?.slice(3);
    const rows = [...tasks.values()].filter(
      (task) => task.user_id === userId && task.day >= from && task.day < to,
    );
    response.end(JSON.stringify(rows));
    return true;
  }
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString() || "{}");
  if (method === "POST") {
    const id = randomUUID();
    tasks.set(id, { ...input, id, revision: 1, user_id: userId });
    response.writeHead(201).end(JSON.stringify({ id }));
    return true;
  }
  const id = filters.get("id")?.slice(3);
  const current = tasks.get(id);
  const match = current?.user_id === userId && filters.get("revision") === `eq.${current.revision}`;
  if (match && method === "PATCH") tasks.set(id, { ...current, ...input });
  if (match && method === "DELETE") tasks.delete(id);
  response.end(JSON.stringify(match ? [{ id }] : []));
  return true;
}
