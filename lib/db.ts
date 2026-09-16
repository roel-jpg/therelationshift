// Tiny database layer with two backends:
//  - Postgres (production, via `pg`) when DATABASE_URL starts with "postgres"
//  - SQLite (local development, via Node's built-in `node:sqlite`) otherwise
// Column types are kept simple (TEXT/INTEGER, JSON as text, ISO timestamps) so the same SQL works on both.
import programJson from '@/content/program.json';
import productsJson from '@/content/products.json';

type Row = Record<string, unknown>;

interface Backend {
  query(sql: string, params?: unknown[]): Promise<Row[]>;
}

// Accept the variable names used by Neon, Vercel Postgres and Supabase integrations.
const connectionString =
  [process.env.DATABASE_URL, process.env.POSTGRES_URL, process.env.POSTGRES_PRISMA_URL, process.env.DATABASE_URL_UNPOOLED]
    .find((v) => v && /^postgres(ql)?:/.test(v)) ?? null;
const isPostgres = connectionString !== null;

async function createBackend(): Promise<Backend> {
  if (!isPostgres && process.env.VERCEL) {
    throw new Error('No Postgres database configured. Add a Neon/Postgres database to the Vercel project (Storage tab) and redeploy.');
  }
  if (isPostgres) {
    const { Pool } = await import('pg');
    const local = /localhost|127\.0\.0\.1/.test(connectionString!);
    const pool = new Pool({
      connectionString: connectionString!,
      ssl: local ? undefined : { rejectUnauthorized: false },
      max: 5,
    });
    return {
      async query(sql, params = []) {
        const res = await pool.query(sql, params);
        return res.rows as Row[];
      },
    };
  }
  // SQLite fallback (Node >= 22.13)
  const sqliteModule = 'node:sqlite';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { DatabaseSync } = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ sqliteModule)) as any;
  const { mkdirSync } = await import('node:fs');
  const file = (process.env.DATABASE_URL ?? 'file:./data/dev.db').replace(/^file:/, '');
  mkdirSync(file.substring(0, file.lastIndexOf('/')) || '.', { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  return {
    async query(sql, params = []) {
      // $1, $2 … → ?  (we never reuse a placeholder, so positional order is preserved)
      const converted = sql.replace(/\$(\d+)/g, '?');
      const stmt = db.prepare(converted);
      const args = params.map((p) => (p === undefined ? null : p)) as (string | number | null)[];
      if (/^\s*(select|with)/i.test(sql) || /returning/i.test(sql)) return stmt.all(...args) as Row[];
      stmt.run(...args);
      return [];
    },
  };
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  entitlement TEXT NOT NULL DEFAULT 'FREE',
  is_admin INTEGER NOT NULL DEFAULT 0,
  couple_id TEXT,
  created_at TEXT NOT NULL,
  last_login_at TEXT
);
CREATE TABLE IF NOT EXISTS couples (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS invites (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  sender_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  accepted_at TEXT
);
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY,
  day INTEGER NOT NULL UNIQUE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  goal TEXT NOT NULL,
  how_to TEXT NOT NULL,
  data TEXT,
  background TEXT,
  articles TEXT,
  products TEXT,
  image_url TEXT,
  audio_url TEXT,
  duration_min INTEGER
);
CREATE TABLE IF NOT EXISTS answers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exercise_id INTEGER NOT NULL,
  data TEXT,
  reflection TEXT,
  rating INTEGER,
  shared INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (user_id, exercise_id)
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  author TEXT,
  for_who TEXT
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

let ready: Promise<Backend> | null = null;

async function init(): Promise<Backend> {
  const backend = await createBackend();
  for (const stmt of SCHEMA.split(';').map((s) => s.trim()).filter(Boolean)) {
    await backend.query(stmt);
  }
  await migrate(backend);
  await seedIfEmpty(backend);
  return backend;
}

// Columns added after the first release; both backends throw when the column is already there.
async function migrate(backend: Backend) {
  const steps = ['ALTER TABLE answers ADD COLUMN shared INTEGER NOT NULL DEFAULT 0'];
  for (const sql of steps) {
    try { await backend.query(sql); } catch { /* already applied */ }
  }
  // Probe, so a migration that did not land shows up in the logs instead of breaking a page later.
  try { await backend.query('SELECT shared FROM answers LIMIT 1'); }
  catch (err) { console.error('[db] migration check failed: answers.shared is missing', err); }
}

// Upserts the program content on every cold start, so edits to content/*.json go live on deploy.
async function seedIfEmpty(backend: Backend) {
  // Imported statically so the content is bundled into the serverless function (reading from disk fails on Vercel).
  const program = programJson as unknown as SeedExercise[];
  const products = productsJson as unknown as SeedProduct[];
  const DURATIONS: Record<string, number> = { 'noop-audio': 20, 'single-audio': 15, 'multiple-match-category': 20 };
  for (const e of program) {
    await backend.query(
      `INSERT INTO exercises (id, day, slug, title, type, goal, how_to, data, background, articles, products, image_url, audio_url, duration_min)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET day=excluded.day, slug=excluded.slug, title=excluded.title, type=excluded.type, goal=excluded.goal,
         how_to=excluded.how_to, data=excluded.data, background=excluded.background, articles=excluded.articles, products=excluded.products,
         image_url=excluded.image_url, audio_url=excluded.audio_url, duration_min=excluded.duration_min`,
      [
        e.day, e.day, e.slug, e.title, e.type, e.goal, e.howTo,
        e.data == null ? null : JSON.stringify(e.data),
        e.background ?? null,
        JSON.stringify(e.articles ?? []),
        JSON.stringify(e.products ?? []),
        e.imageUrl ?? null,
        e.exerciseAudioUrl ?? null,
        DURATIONS[e.type] ?? 15,
      ],
    );
  }
  for (const p of products) {
    await backend.query(
      `INSERT INTO products (id, name, url, author, for_who) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET name=excluded.name, url=excluded.url, author=excluded.author, for_who=excluded.for_who`,
      [p.id, p.name, p.url, p.author ?? null, p.for ?? null],
    );
  }
}

type SeedExercise = {
  day: number; slug: string; title: string; type: string; goal: string; howTo: string; data?: unknown;
  background?: string | null; articles?: unknown[]; products?: unknown[]; imageUrl?: string | null; exerciseAudioUrl?: string | null;
};
type SeedProduct = { id: number; name: string; url: string; author?: string | null; for?: string | null };

export async function db(): Promise<Backend> {
  if (!ready) ready = init().catch((err) => { ready = null; throw err; });
  return ready;
}

export async function query<T = Row>(sql: string, params: unknown[] = []): Promise<T[]> {
  const b = await db();
  return (await b.query(sql, params)) as T[];
}

export async function one<T = Row>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export const now = () => new Date().toISOString();

export function parseJson<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v !== 'string') return v as T;
  try { return JSON.parse(v) as T; } catch { return fallback; }
}
