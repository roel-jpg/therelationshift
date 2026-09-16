# The Relationshift

A 21-day online relationship workout for couples. Rebuild (2026) of the original 2016 platform.

## Stack

- Next.js (App Router, TypeScript) — website, works on phones, installable later as PWA
- Postgres in production (via `pg`), SQLite (Node's built-in `node:sqlite`) for local development — same SQL, see `lib/db.ts`
- Hosted on Vercel; database on Neon (or Vercel Postgres)
- No other dependencies: passwords are hashed with Node's scrypt, sessions are signed cookies
- Tables are created and the program content is seeded automatically on first request

## Local development

```bash
npm install
npm run dev                  # http://localhost:3000 — uses a local SQLite file in ./data/
```
Set `DATABASE_URL` to a Postgres connection string to run against Postgres instead.

## Deploying on Vercel

1. Import the GitHub repository in Vercel (Framework: Next.js, defaults are fine).
2. Storage → create a Postgres database (Neon). Vercel adds `DATABASE_URL` automatically.
3. Settings → Environment Variables: add `SESSION_SECRET` (long random string) and
   `NEXT_PUBLIC_SITE_URL` (e.g. `https://therelationshift.com`).
4. Deploy. Tables and content are created automatically on the first request.
5. Domains → add `therelationshift.com` and follow the DNS instructions.

## Content

- `content/program.json` — the 21 exercises (goal, how-to, interactive data, background, products). Seeded once when the `exercises` table is empty; to re-seed after edits, empty that table (an admin screen is on the to-do list).
- `content/products.json` — shop products (shop not built yet).
- `content/pages.json` — About, Our beliefs, Privacy texts.
- `public/media/` — images and audio (see README there).

## Product decisions

- Free for everyone now; `User.entitlement` (FREE/PREMIUM) is ready for a paid tier later.
- English only.
- Day 1 can be done without an account; other days need a free account.
- Shop: data model and products exist, no shop pages yet.
- Mobile app: later, as a wrapper around this web app.

## Not yet built (next steps)

- Password reset and email notifications (needs an email provider such as Resend)
- Daily reminder emails
- Uploading photos/audio as part of an answer (day 1, 5, 13, 19)
- Admin screen to edit exercises in the browser
- Shop and blog pages
