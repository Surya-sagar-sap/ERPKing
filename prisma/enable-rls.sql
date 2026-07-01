-- ─── Enable Row Level Security on all public tables ───
-- WHY: Supabase exposes an auto-generated REST API on every public table using
-- the public anon key (which ships in the browser). With RLS OFF, anyone can
-- read/write these tables directly. Enabling RLS with NO policies = deny-all for
-- the anon/PostgREST API.
--
-- SAFE FOR THIS APP: all data access goes through Prisma, which connects as the
-- table OWNER (postgres) and bypasses RLS. The Supabase client is used ONLY for
-- auth, never for table reads/writes. So the app keeps working; only the public
-- REST API is locked down. This clears all 14 Security Advisor errors.
--
-- HOW TO RUN: Supabase Dashboard → SQL Editor → paste all of this → Run.

alter table public.users                   enable row level security;
alter table public.modules                 enable row level security;
alter table public.lessons                 enable row level security;
alter table public.flowcharts              enable row level security;
alter table public.flowchart_node_details  enable row level security;
alter table public.quizzes                 enable row level security;
alter table public.quiz_questions          enable row level security;
alter table public.quiz_options            enable row level security;
alter table public.badges                  enable row level security;
alter table public.user_badges             enable row level security;
alter table public.user_progress           enable row level security;
alter table public.glossary_terms          enable row level security;
alter table public.certificates            enable row level security;
alter table public.pricing_plans           enable row level security;

-- Verify (should list all 14 with rowsecurity = true):
-- select tablename, rowsecurity from pg_tables where schemaname = 'public' order by tablename;
