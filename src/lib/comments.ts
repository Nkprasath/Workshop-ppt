// Review comments, client side.
//
// Comments are written to the API (a Vercel function holding the database credential
// server side) and mirrored into localStorage. The mirror is not a cache for speed: it
// is what keeps the reviewer's work if the API is unreachable, unset, or slow, so a
// dropped connection never loses a comment somebody has just typed.
//
// Nothing secret lives here. API_BASE is a public URL.

// Injected at build time from REVIEW_API_BASE. Empty means local-only, which is the
// state the pages ship in so they work before anything is deployed.
export const API_BASE: string = process.env.REVIEW_API_BASE ?? "";

const KEY = "dpdp-review-comments-v1";
const AUTHOR_KEY = "dpdp-review-author";
const PENDING_KEY = "dpdp-review-pending";

export interface Comment {
  id: string;
  target: string;
  targetLabel: string;
  text: string;
  author: string;
  at: string;
}

export type Store = Record<string, Comment[]>;

export type Sync = "local" | "syncing" | "synced" | "offline";

// ------------------------------------------------------------------ storage

function readKey<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeKey(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or full storage. The comment is still on screen and, if the API
    // is configured, already sent.
  }
}

export function load(): Store {
  return readKey<Store>(KEY, {});
}

function save(store: Store): void {
  writeKey(KEY, store);
}

export function forTarget(target: string): Comment[] {
  return load()[target] ?? [];
}

export function count(): number {
  return Object.values(load()).reduce((n, l) => n + l.length, 0);
}

export function all(): Comment[] {
  return Object.values(load())
    .flat()
    .sort((a, b) => a.at.localeCompare(b.at));
}

export function getAuthor(): string {
  try {
    return window.localStorage.getItem(AUTHOR_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setAuthor(name: string): void {
  try {
    window.localStorage.setItem(AUTHOR_KEY, name);
  } catch {
    // Not worth failing over.
  }
}

function put(comment: Comment): void {
  const store = load();
  const list = store[comment.target] ?? [];
  if (list.some((c) => c.id === comment.id)) return;
  store[comment.target] = [...list, comment];
  save(store);
}

// ---------------------------------------------------------------------- api

function url(): string | null {
  return API_BASE ? `${API_BASE.replace(/\/$/, "")}/api/comments` : null;
}

export function isRemote(): boolean {
  return Boolean(url());
}

// Comments written while the API was unreachable, retried on the next successful call.
function pending(): Comment[] {
  return readKey<Comment[]>(PENDING_KEY, []);
}

function setPending(list: Comment[]): void {
  writeKey(PENDING_KEY, list);
}

async function send(comment: Comment): Promise<boolean> {
  const endpoint = url();
  if (!endpoint) return false;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function add(
  target: string,
  targetLabel: string,
  text: string
): Promise<{ comment: Comment; sync: Sync }> {
  const comment: Comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    target,
    targetLabel,
    text: text.trim(),
    author: getAuthor() || "Reviewer",
    at: new Date().toISOString(),
  };

  // Stored first, always. Whatever the network does, the comment is not lost.
  put(comment);

  if (!isRemote()) return { comment, sync: "local" };

  const ok = await send(comment);
  if (!ok) {
    setPending([...pending(), comment]);
    return { comment, sync: "offline" };
  }
  return { comment, sync: "synced" };
}

export async function remove(target: string, id: string): Promise<void> {
  const store = load();
  store[target] = (store[target] ?? []).filter((c) => c.id !== id);
  if (store[target].length === 0) delete store[target];
  save(store);

  const endpoint = url();
  if (!endpoint) return;
  try {
    await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  } catch {
    // The local copy is gone either way; a stale row on the server is harmless.
  }
}

// Pulls everything the server holds and merges it in, so a second person reviewing on a
// different machine sees the first person's comments. Also flushes anything queued.
export async function sync(): Promise<Sync> {
  const endpoint = url();
  if (!endpoint) return "local";

  const queued = pending();
  if (queued.length > 0) {
    const stillQueued: Comment[] = [];
    for (const c of queued) {
      const ok = await send(c);
      if (!ok) stillQueued.push(c);
    }
    setPending(stillQueued);
  }

  try {
    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return "offline";
    const data = (await res.json()) as { comments?: Comment[] };
    for (const c of data.comments ?? []) {
      if (c && c.id && c.target) put(c);
    }
    return "synced";
  } catch {
    return "offline";
  }
}

// ------------------------------------------------------------------- export

export function toMarkdown(): string {
  const list = all();
  if (list.length === 0) return "No comments.";

  const grouped = new Map<string, Comment[]>();
  for (const c of list) {
    grouped.set(c.target, [...(grouped.get(c.target) ?? []), c]);
  }

  const out: string[] = [
    `Review comments (${list.length})`,
    new Date().toISOString().slice(0, 10),
    "",
  ];
  for (const [, comments] of grouped) {
    out.push(`## ${comments[0].targetLabel}`, "");
    for (const c of comments) out.push(`- ${c.text} — ${c.author}`);
    out.push("");
  }
  return out.join("\n");
}

export function downloadJson(): void {
  const blob = new Blob([JSON.stringify(load(), null, 2)], {
    type: "application/json",
  });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = `review-comments-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 0);
}
