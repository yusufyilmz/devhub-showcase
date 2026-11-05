/** Serve this from a same-origin JavaScript route at the desired worker scope. No app data is cached. */
export function notificationWorker(options: {
  cacheName: string;
  offlineUrl: string;
  icon: string;
  title: string;
}) {
  for (const path of [options.offlineUrl, options.icon]) {
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\"))
      throw new Error("Worker assets must use local paths.");
  }
  return `"use strict";
const config = ${JSON.stringify(options)};
let serial = Promise.resolve();
const memory = new Map();
function localUrl(value) {
  let url; try { url = new URL(typeof value === "string" ? value : "/", self.location.origin); } catch { return self.location.origin + "/"; }
  return url.origin === self.location.origin && ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : self.location.origin + "/";
}
function database() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(config.cacheName + "-receipts", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("displayed");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Storage unavailable"));
  });
}
async function receipt(id, write = false) {
  let db;
  try {
    db = await database();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction("displayed", write ? "readwrite" : "readonly");
      const store = transaction.objectStore("displayed");
      const request = write ? store.put(Date.now(), id) : store.get(id);
      transaction.oncomplete = () => resolve(write ? false : Boolean(request.result && Date.now() - request.result < 86400000));
      transaction.onerror = () => reject(new Error("Storage unavailable"));
      if (write) {
        const cursor = store.openCursor();
        cursor.onsuccess = () => { const row = cursor.result; if (!row) return; if (row.value < Date.now() - 86400000) row.delete(); row.continue(); };
      }
    });
  } catch { return !write && memory.has(id) && Date.now() - memory.get(id) < 86400000; }
  finally { if (db) db.close(); }
}
async function display(input, pushed) {
  const value = input && typeof input === "object" ? input : {};
  const id = typeof value.id === "string" && value.id.length > 0 && value.id.length <= 200 ? value.id : crypto.randomUUID();
  if ((await receipt(id)) && !pushed) return;
  const title = typeof value.title === "string" ? value.title.slice(0,100) : config.title;
  const body = typeof value.body === "string" ? value.body.slice(0,300) : "Open the app to view your reminder.";
  await self.registration.showNotification(title || config.title, {
    body, icon: config.icon, tag: typeof value.tag === "string" ? value.tag.slice(0,200) : id,
    renotify: false, data: { id, url: localUrl(value.url) }
  });
  memory.set(id, Date.now()); if (memory.size > 500) memory.delete(memory.keys().next().value);
  await receipt(id, true);
}
function enqueue(value, pushed = false) {
  const result = serial.then(() => display(value, pushed));
  serial = result.catch(() => undefined); return result;
}
self.addEventListener("install", event => {
  event.waitUntil(caches.open(config.cacheName).then(cache => cache.add(config.offlineUrl)));
});
self.addEventListener("activate", event => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", event => {
  if (event.request.mode !== "navigate" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).catch(async () => (await caches.match(config.offlineUrl)) || Response.error()));
});
self.addEventListener("push", event => {
  let value;
  try { const text = event.data ? event.data.text() : ""; value = text.length <= 8192 ? JSON.parse(text) : {}; } catch { value = {}; }
  event.waitUntil(enqueue(value, true));
});
self.addEventListener("message", event => {
  if (!event.source || new URL(event.source.url).origin !== self.location.origin || event.data?.type !== "show-notification") return;
  event.waitUntil(enqueue(event.data.message).then(() => event.ports[0]?.postMessage({ok:true}), () => event.ports[0]?.postMessage({ok:false})));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = localUrl(event.notification.data?.url);
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const client = windows.find(item => new URL(item.url).origin === self.location.origin);
    if (client) { await client.navigate(url); await client.focus(); } else await self.clients.openWindow(url);
  })());
});`;
}
