import { MongoClient, type Collection } from "mongodb";

// Review comments API, deployed as a Vercel serverless function.
//
// This exists because the deck and the workbook are static pages on GitHub Pages, and a
// browser cannot open a MongoDB connection: there is no driver and no socket. The
// connection string also must never reach the client, because everything the client
// holds is readable by anyone who opens the page. So the secret lives here, in a server
// environment variable, and the pages talk to this over HTTPS instead.
//
// Deploy notes are in README.md. The two variables this needs are MONGODB_URI and,
// optionally, REVIEW_ALLOWED_ORIGIN.

const DB_NAME = "workshop_review";
const COLLECTION = "comments";

// A comment is a sentence or two. Anything much larger is a mistake or an attack.
const MAX_TEXT = 4000;
const MAX_FIELD = 300;
const MAX_RETURNED = 2000;

export interface StoredComment {
  id: string;
  target: string;
  targetLabel: string;
  text: string;
  author: string;
  at: string;
}

// Serverless invocations reuse a warm container, so the client is cached on the module.
// Reconnecting per request exhausts the Atlas connection limit under any real load.
let cached: Promise<MongoClient> | null = null;

function client(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!cached) {
    cached = new MongoClient(uri, { maxPoolSize: 5 }).connect();
  }
  return cached;
}

async function collection(): Promise<Collection<StoredComment>> {
  const c = await client();
  return c.db(DB_NAME).collection<StoredComment>(COLLECTION);
}

function clean(v: unknown, limit: number): string {
  return typeof v === "string" ? v.trim().slice(0, limit) : "";
}

interface Req {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  end(): void;
}

function cors(req: Req, res: Res): void {
  // The pages are served from a different origin to this function, so the browser will
  // preflight every write. An explicit allowed origin is preferred; the wildcard is the
  // fallback so a forgotten variable does not silently break the review.
  const allowed = process.env.REVIEW_ALLOWED_ORIGIN;
  const origin = (req.headers.origin as string) || "";
  res.setHeader(
    "Access-Control-Allow-Origin",
    allowed && origin === allowed ? allowed : allowed || "*"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export default async function handler(req: Req, res: Res): Promise<void> {
  cors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  try {
    const col = await collection();

    if (req.method === "GET") {
      const rows = await col
        .find({}, { projection: { _id: 0 } })
        .sort({ at: 1 })
        .limit(MAX_RETURNED)
        .toArray();
      res.status(200).json({ ok: true, comments: rows });
      return;
    }

    if (req.method === "POST") {
      const body = (
        typeof req.body === "string" ? JSON.parse(req.body) : req.body
      ) as Record<string, unknown> | undefined;

      const text = clean(body?.text, MAX_TEXT);
      const target = clean(body?.target, MAX_FIELD);
      if (!text || !target) {
        res.status(400).json({ ok: false, error: "target and text are required" });
        return;
      }

      const comment: StoredComment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        target,
        targetLabel: clean(body?.targetLabel, MAX_FIELD) || target,
        text,
        author: clean(body?.author, MAX_FIELD) || "Reviewer",
        at: new Date().toISOString(),
      };

      await col.insertOne(comment);
      res.status(201).json({ ok: true, comment });
      return;
    }

    if (req.method === "DELETE") {
      const id = clean((req.body as Record<string, unknown>)?.id, MAX_FIELD);
      if (!id) {
        res.status(400).json({ ok: false, error: "id is required" });
        return;
      }
      await col.deleteOne({ id });
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ ok: false, error: "method not allowed" });
  } catch (err) {
    // The message can carry the connection string, so it is logged and never returned.
    console.error("comments api:", err);
    res.status(500).json({ ok: false, error: "server error" });
  }
}
