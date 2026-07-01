# Learn ERP — Handoff Guide

An online SAP learning platform. Visual, story-driven lessons with quizzes, XP/badges,
completion certificates, and paid subscriptions.

- **Live:** https://learnerp.app
- **Repo:** https://github.com/Surya-sagar-sap/ERPKing
- **Hosting:** Vercel (auto-deploys on push to `main`)

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router, server components + route handlers) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| DB | Supabase PostgreSQL via Prisma ORM |
| Auth | Supabase Auth (email/password) |
| Payments | Razorpay Subscriptions (live) |
| Rate limiting | Upstash Redis (optional, gated on env) |

## Environment variables

All required vars are documented in `.env.example`. Copy it to `.env` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (pooler, port 6543), `DIRECT_URL` (direct, port 5432 — used for migrations/seeds)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_SECRET`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_WEBHOOK_SECRET`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (optional — enables rate limiting)

**The same vars must be set in Vercel → Project → Settings → Environment Variables.**

## Local development

```bash
npm install
npx prisma generate
npm run dev          # http://localhost:3000
```

## Database

- Schema: `prisma/schema.prisma`. Apply changes with **`npx prisma db push`** (this project uses
  `db push`, not `migrate dev`).
- Row Level Security is enabled on all public tables (`prisma/enable-rls.sql`). The app reads/writes
  via Prisma as the table owner (bypasses RLS); the Supabase client is used only for auth. If you add
  a new table, enable RLS on it too.
- Content is seeded from `prisma/seed*.ts` files, run with `npx tsx prisma/<file>.ts`.

## Auth (Supabase)

- Email/password. Flows: `/register`, `/login`, `/forgot-password`, `/reset-password`.
- **Required config:** Authentication → URL Configuration → Redirect URLs must include
  `https://learnerp.app/auth/callback` and `https://learnerp.app/reset-password`.
- **Email:** configure a custom SMTP provider (Auth → Emails) for reliable delivery at volume; the
  built-in Supabase mailer is rate-limited.

### Make a user an admin

```bash
curl -X POST https://learnerp.app/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","secret":"<ADMIN_SECRET>"}'
```

Admins get the `/admin` panel (modules, lessons, quizzes, certificates, users, pricing, analytics).

## Payments (Razorpay)

- Model: Razorpay **Plans + Subscriptions** (not one-off orders).
- Plans/pricing seeded by `prisma/seed-razorpay-pricing.ts` (idempotent — reuses existing plan IDs).
  Current: Free ₹0; Pro ₹399/mo, ₹2,999/yr; Business ₹1,499/mo, ₹11,999/yr.
- Admin can change prices at `/admin/pricing` — this auto-creates a new Razorpay plan (existing
  subscribers keep their old rate; Razorpay plans are immutable).
- Flow: `/pricing` → create-subscription → Razorpay checkout → verify-payment (upgrades user) →
  `/dashboard?payment=success`. Webhook is the backup source of truth.
- **Webhook:** Razorpay Dashboard → Webhooks → `https://learnerp.app/api/razorpay/webhook`,
  events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`,
  `subscription.completed`, `subscription.halted`. Copy the signing secret to `RAZORPAY_WEBHOOK_SECRET`.
- Content gating: first 5 lessons of every module are free; the rest require Pro/Business. Admins bypass.

## Deploy

Push to `main` → Vercel builds and deploys automatically (`next build` runs `prisma generate` first).
Env var changes require a redeploy to take effect.

## Recommended next steps (optional hardening)

- Error monitoring: `npx @sentry/wizard@latest -i nextjs`.
- Rate limiting: create an Upstash Redis DB and set the two `UPSTASH_*` vars.
- GST/tax invoicing if turnover requires it.
