# SAPKing — Project Brain
> Read this at the start of every session. Update it at the end of every section.

---

## PROJECT OVERVIEW
**What:** A production-ready SAP learning platform for a client.
**Goal:** Teach SAP to beginners using visual flowcharts, interactive lessons, quizzes, and simulators.
**Deadline:** ~12 days
**Builder:** Vijay (nameisvijay35@gmail.com)
**Reference App:** applygenie.app (same builder, 12 days, similar scale)

---

## TECH STACK
| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Frontend + Backend in one |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first |
| Database | PostgreSQL via Supabase | Free tier |
| ORM | Prisma | Type-safe DB queries |
| Auth | Supabase Auth | Email/password + social |
| Flowcharts | React Flow | Interactive diagrams |
| Email | Resend | Transactional emails |
| Images | Cloudinary | Lesson/flowchart assets |
| Payments | Razorpay | When monetization added |
| Domain | Cloudflare | ~$9/year |
| Hosting | Vercel | Free tier, auto-deploy |

---

## ENVIRONMENT VARIABLES NEEDED
```
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
```

---

## FOLDER STRUCTURE
```
sapking/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   └── learn/
│   │       ├── [moduleSlug]/page.tsx
│   │       └── [moduleSlug]/[lessonSlug]/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── modules/page.tsx
│   │       ├── lessons/page.tsx
│   │       └── quizzes/page.tsx
│   ├── api/
│   │   ├── auth/route.ts
│   │   ├── modules/route.ts
│   │   ├── lessons/route.ts
│   │   ├── quiz/route.ts
│   │   ├── progress/route.ts
│   │   └── admin/route.ts
│   ├── layout.tsx
│   └── page.tsx          ← Landing page
├── components/
│   ├── ui/               ← Reusable buttons, cards, inputs
│   ├── flowchart/        ← React Flow components
│   ├── quiz/             ← Quiz components
│   ├── lesson/           ← Lesson viewer
│   └── admin/            ← Admin panel components
├── lib/
│   ├── supabase.ts       ← Supabase client
│   ├── prisma.ts         ← Prisma client
│   └── utils.ts          ← Helper functions
├── prisma/
│   └── schema.prisma     ← Database schema
├── public/
├── .env.local
├── .env.example
└── brain.md              ← THIS FILE
```

---

## DATABASE SCHEMA (Prisma)
```
User
  - id, email, name, avatar
  - role: ADMIN | LEARNER
  - xp, level, streak, lastActiveDate
  - createdAt

Module
  - id, title, slug, description
  - color (hex for UI theming)
  - icon, order
  - isPublished

Lesson
  - id, moduleId, title, slug
  - story (the opening business scenario)
  - content (main lesson body - MDX)
  - keyConceptTitle, keyConceptBody
  - order, isPublished
  - estimatedMinutes

Flowchart
  - id, lessonId
  - nodes (JSON - React Flow nodes)
  - edges (JSON - React Flow edges)
  - title

FlowchartNode (for click-through detail)
  - id, flowchartId, nodeId
  - title, description, tCode, tips

Quiz
  - id, lessonId, title

QuizQuestion
  - id, quizId, question, explanation
  - order

QuizOption
  - id, questionId, text, isCorrect

UserProgress
  - id, userId, lessonId
  - completed, completedAt
  - quizScore

UserBadge
  - id, userId, badgeId, earnedAt

Badge
  - id, name, description, icon, condition
```

---

## EXECUTION PLAN

### SECTION 1 — Project Scaffold ⬜
**What:** Initialize Next.js project, install all packages, set up folder structure, Prisma schema, Supabase connection, base layout.
**Output:** Running app at localhost:3000 with DB connected.
**Time:** Day 1 AM

### SECTION 2 — Auth System ⬜
**What:** Login, Register, Logout pages. Supabase Auth. Protected routes middleware. User profile in DB.
**Output:** Users can sign up, log in, and be redirected based on role (admin vs learner).
**Time:** Day 1 PM

### SECTION 3 — Database + Seed Data ⬜
**What:** Run Prisma migrations, seed Foundation + FICO modules with real content, test all DB queries.
**Output:** DB has real SAP content ready to serve.
**Time:** Day 2 AM

### SECTION 4 — Admin Panel ⬜
**What:** CRUD for Modules, Lessons, Flowcharts, Quizzes. Rich text editor for lesson content. Protected by ADMIN role.
**Output:** Admin can create/edit/delete all content from browser.
**Time:** Day 2 PM → Day 3

### SECTION 5 — Learner UI: Core Pages ⬜
**What:** Landing page, Module listing, Lesson viewer, Breadcrumb nav, Progress bar per lesson.
**Output:** Learner can browse modules, open a lesson, read it.
**Time:** Day 4

### SECTION 6 — Interactive Flowcharts ⬜
**What:** React Flow integration. Clickable nodes that show T-codes, descriptions, tips in a sidebar panel.
**Output:** Each lesson has a live interactive process diagram.
**Time:** Day 5

### SECTION 7 — Quiz System ⬜
**What:** Quiz component, answer submission, score display, explanation reveal, save score to DB.
**Output:** Users complete quizzes and see their score.
**Time:** Day 6 AM

### SECTION 8 — Progress + Dashboard ⬜
**What:** Mark lessons complete, % progress per module, user dashboard with stats, XP system, streak tracking.
**Output:** User dashboard shows progress across all modules.
**Time:** Day 6 PM

### SECTION 9 — Gamification ⬜
**What:** XP points on lesson completion, badges (FICO Starter, etc.), level system, streak counter.
**Output:** Users earn XP and badges as they learn.
**Time:** Day 7

### SECTION 10 — SAP Content (All Modules) ⬜
**What:** Write and seed all lesson content — Foundation, FICO, MM, SD, PP, HCM, PM, QM, WM, BASIS, ABAP, Fiori, S/4HANA, BTP, SuccessFactors, SAC. Flowchart data for each process.
**Output:** Platform has complete real SAP learning content.
**Time:** Days 8–10

### SECTION 11 — Polish ⬜
**What:** SEO meta tags, loading states, error pages (404, 500), mobile responsiveness check, dark mode, performance audit.
**Output:** Platform feels production-ready, no rough edges.
**Time:** Day 11 AM

### SECTION 12 — Deploy ⬜
**What:** Push to GitHub, connect Vercel, set env vars, connect Cloudflare domain, run production build, smoke test.
**Output:** sapking.com is live.
**Time:** Day 11 PM → Day 12

---

## PROGRESS TRACKER

| Section | Status | Completed On | Notes |
|---|---|---|---|
| 1. Project Scaffold | ✅ Done | 2026-06-08 | Next.js 14 + Prisma + Supabase + Tailwind |
| 2. Auth System | ✅ Done | 2026-06-08 | Route Handlers (not Server Actions) with explicit cookie injection. `@supabase/ssr` upgraded 0.3.0→0.12.0 (critical fix). Force-confirm emails via admin API. |
| 3. Database + Seed | ✅ Done | 2026-06-11 | 3 modules, 5 lessons, 5 flowcharts w/ node details, 5 quizzes (15 Qs), 6 badges, 12 glossary terms |
| 4. Admin Panel | ✅ Done | 2026-06-11 | Sidebar layout, overview stats, modules CRUD (create/publish/delete), lessons CRUD with module filter, quizzes list, users list with role management, make-admin API route |
| 5. Learner UI | ✅ Done | 2026-06-11 | /learn listing, /learn/[module] with progress bar + lesson list, /learn/[module]/[lesson] with story/markdown/key-concept/prev-next nav, markLessonComplete server action with XP+streak+badge logic, LessonContent (react-markdown), CompleteButton client component |
| 6. Flowcharts | ✅ Done | 2026-06-11 | FlowchartViewer (React Flow, clickable nodes, pan/zoom), NodeDetailPanel (T-code copy, description, tips), integrated into lesson page between content and key concept |
| 7. Quiz System | ✅ Done | 2026-06-11 | Quiz page at /quiz, QuizClient (question-by-question, instant feedback, explanation reveal, score summary), saveQuizScore server action (saves to DB, awards Quiz Ace badge on 100%, +25 XP bonus) |
| 8. Progress + Dashboard | ✅ Done | 2026-06-11 | Dashboard rewritten with per-module progress bars, level XP bar, "Continue Learning" hero card, stats grid, admin badge for admin users |
| 9. Gamification | ✅ Done | 2026-06-11 | Badges grid (earned vs locked with 🔒 overlay), XP level system with progress bar (XP % toward next 500 threshold), streak flame counter in navbar, perfect quiz badge notification, all integrated into single dashboard page |
| 10. SAP Content | ✅ Done | 2026-06-11 | All 16 modules seeded: added SD, PP, HCM, PM, QM, WM, BASIS, ABAP, Fiori, S/4HANA, BTP, SuccessFactors, SAC. 31 lessons / 31 flowcharts / 31 quizzes (93 Qs) total. |
| 11. Polish | ✅ Done | 2026-06-11 | 404 page, global error.tsx, loading skeletons for dashboard/learn/module/lesson pages, SEO metadata on learn page, viewport meta + themeColor in root layout |
| 12. Deploy | ⬜ Not Started | — | — |

---

## CHANGELOG
> Every time a section completes, log what was built and any decisions made here.

| Date | Section | What Was Done | Key Decisions |
|---|---|---|---|
| 2026-06-08 | 1. Scaffold | package.json, tsconfig, next.config, tailwind, postcss, prisma schema (User/Module/Lesson/Flowchart/Quiz/Progress/Badge/Glossary), supabase client+server, prisma client, utils, middleware, root layout, landing page, globals.css, .gitignore, .env.example | Full DB schema done upfront; middleware handles auth redirect; React Flow for flowcharts |
| 2026-06-08 | 2. Auth | Route Handlers `/api/auth/login` and `/api/auth/register`. Native `method="POST"` forms (no React state). `@supabase/ssr` 0.3.0→0.12.0 upgrade was the decisive fix. Force-confirm emails via `supabaseAdmin.auth.admin.updateUserById`. Explicit `cookiesToSet` array injected onto redirect response. | Server Actions dropped — failed to flush cookies before redirect on Next.js 14.2.x |
| 2026-06-11 | 4. Admin Panel | Admin layout (ADMIN role guard), overview stats page, modules CRUD (create form + publish toggle + delete), lessons CRUD (module filter + create form + publish toggle + delete), quizzes read-only list, users list with promote/demote, `/api/admin/make-admin` bootstrap route, `ADMIN_SECRET` env var | Server Actions for all mutations (no separate API routes needed); quiz editing deferred to Section 7 |
| 2026-06-11 | 3. Database Seed | `prisma/seed.ts` written. Foundation module (2 lessons: What is SAP, SAP Modules Map). FICO module (2 lessons: Chart of Accounts, Vendor Invoice FB60). MM module (1 lesson: Procure-to-Pay overview). Each lesson has story, content, key concept, React Flow flowchart with node details, and quiz with 3 Qs. 6 badges, 12 glossary terms. | Used `upsert` throughout so seed is idempotent (safe to re-run) |
| 2026-06-11 | 10. SAP Content | Added 13 modules to `prisma/seed.ts` (each 2 lessons w/ story, MDX content, key concept, React Flow flowchart + node details, 3-Q quiz): SD (O2C, sales order structure), PP (planning basics, production order lifecycle), HCM (infotypes, OM+payroll), PM (PM basics, maintenance order), QM (inspection, notifications), WM (warehouse structure, putaway/picking), BASIS (landscape, monitoring/jobs), ABAP (fundamentals, data dictionary), Fiori (launchpad, SAPUI5+OData), S/4HANA (overview, migration), BTP (overview, extensibility), SuccessFactors (EC, talent lifecycle), SAC (overview, planning/predictive). Orders 4–16. `tsc --noEmit` passes. | Kept exact seed format (upsert + createMany); reused glossary anchor for incremental inserts; beginner-first analogies per project rule. Badges/glossary unchanged. |
| 2026-06-11 | 8+9. Dashboard+Gamification | Dashboard fully rebuilt: parallel data fetch (modules+progress+badges+allBadges), per-module colored progress bars, level XP bar (xp % toward 500), "Continue Learning" hero card (first incomplete lesson across all modules), 4-stat grid, badge grid (earned=colored / locked=greyed 50%+lock icon). Streak flame + XP in navbar, admin badge for ADMIN users. Sections 8 & 9 treated as one unified page. | All data fetched server-side in one Promise.all for performance; XP_PER_LEVEL=500 constant shared with markLessonComplete action |

---

## CURRENT SESSION
**Working On:** Section 12 — Deploy
**Blocked By:** Nothing
**Next Action:** Push to GitHub → connect Vercel → set env vars → connect Cloudflare domain → smoke test production

---

## RULES FOR UPDATING THIS FILE
1. Mark section ✅ in Progress Tracker when complete
2. Add a row to Changelog with date + what changed
3. Update "CURRENT SESSION" block with what's next
4. Never delete old changelog entries
5. If a decision changes the schema or stack, update those sections too
