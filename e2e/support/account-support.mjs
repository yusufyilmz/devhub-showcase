// Isolated transport fixture. Real RPC permissions and atomic audit behavior are tested with SQL.
const states = new Map();
export async function supportRpcRequest(request, response, owner, url) {
  const method = url.pathname.split("/").at(-1);
  if (
    !["support_accounts", "support_account_summary", "support_disable_visitor_chat"].includes(
      method,
    )
  )
    return false;
  if (!owner?.manager) {
    response.writeHead(403).end(JSON.stringify({ code: "42501" }));
    return true;
  }
  let raw = "";
  for await (const chunk of request) raw += chunk;
  const input = JSON.parse(raw || "{}");
  const id = `77777777-7777-4777-8777-77777777777${owner.owner_id.at(-1)}`;
  if (!states.has(owner.owner_id)) states.set(owner.owner_id, { audit: [], enabled: true });
  const state = states.get(owner.owner_id);
  const account = { confirmed: true, created_at: "2026-11-04T10:00:00Z", id };
  let data;
  if (method === "support_accounts") data = [account];
  else if (input.target_account !== id) {
    response.writeHead(404).end(JSON.stringify({ code: "P0002" }));
    return true;
  } else if (method === "support_account_summary")
    data = {
      ...account,
      audit: state.audit,
      billing: {
        active: true,
        chatEnabled: state.enabled,
        chatLimit: 100,
        chatUsed: 2,
        editorLimit: 10,
        editorUsed: 1,
        plan: "pro",
        status: "active",
      },
      profiles: [
        { cvPublished: false, id: "fictional-profile", revision: 7, websitePublished: true },
      ],
    };
  else {
    let entry = state.audit.find((value) => value.request_id === input.request_id);
    if (entry && entry.reason !== input.reason) {
      response.writeHead(403).end(JSON.stringify({ code: "42501" }));
      return true;
    }
    if (!entry) {
      entry = {
        action: "disable_visitor_chat",
        actor_id: owner.owner_id,
        after_enabled: false,
        before_enabled: state.enabled,
        created_at: new Date().toISOString(),
        reason: input.reason,
        request_id: input.request_id,
      };
      state.audit.push(entry);
      state.enabled = false;
    }
    data = { changed: entry.before_enabled, requestId: entry.request_id };
  }
  response.end(JSON.stringify(data));
  return true;
}
