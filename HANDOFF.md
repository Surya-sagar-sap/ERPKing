# Learn ERP — Handoff Guide

An online SAP learning platform. Visual, story-driven lessons with quizzes, XP/badges,
completion certificates, and one-time lifetime module purchases.

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
| Payments | Razorpay Orders — one-time lifetime purchases (live) |
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

- Model: **one-time, lifetime** purchases via Razorpay **Orders** (no subscriptions).
- **Pricing lives in code** — `lib/tiers.ts`. To change a price, edit that file and redeploy:
  - Single module — ₹199
  - Any 2 modules — ₹299
  - All modules (current + future) — ₹599
- **Free content:** the whole **SAP Foundation** module is free (see `FREE_MODULE_SLUGS` in `lib/tiers.ts`).
  For every other module, the first 5 lessons are free previews.
- **Entitlements** are on the `User` row: `ownedModules` (String[] of module IDs) and `hasAllAccess` (Boolean).
  Grant logic is in `lib/entitlements.ts`.
- Flow: `/pricing` (pick tier + modules) → `create-order` → Razorpay checkout → `verify-order`
  (grants access) → `/dashboard?purchase=success`. The webhook is the backup source of truth.
- **Webhook:** Razorpay Dashboard → Webhooks → `https://learnerp.app/api/razorpay/webhook`,
  subscribe to the **`order.paid`** event. Copy the signing secret to `RAZORPAY_WEBHOOK_SECRET`.
- Content gating (`app/(dashboard)/learn/.../page.tsx`): free module → open; else first 5 lessons free;
  else must own the module or have all-access. Admins bypass everything.
- `/admin/pricing` is an **info page** (prices are in code, not the DB).
- Note: some old subscription-era files remain unused and can be deleted safely —
  `components/PricingToggle.tsx`, `components/RazorpayButton.tsx`, `prisma/seed-razorpay-pricing.ts`,
  and the deprecated `app/api/razorpay/{create-subscription,verify-payment,cancel-subscription}` stubs.

## Deploy

Push to `main` → Vercel builds and deploys automatically (`next build` runs `prisma generate` first).
Env var changes require a redeploy to take effect.

## Recommended next steps (optional hardening)

- Error monitoring: `npx @sentry/wizard@latest -i nextjs`.
- Rate limiting: create an Upstash Redis DB and set the two `UPSTASH_*` vars.
- GST/tax invoicing if turnover requires it.
