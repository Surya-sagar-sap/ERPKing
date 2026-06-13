# Opus Prompt — SAPKing UI Overhaul
# Goal: Transform generic SaaS UI → premium EdTech product feel
# Pages: Landing, Dashboard, Module List, Lesson Page
# Copy everything below the line and paste into Opus

---

You are a senior product designer and frontend engineer. You are redesigning **SAPKing** — a SAP learning platform for beginners — to look and feel like a premium EdTech product.

## YOUR TASK

Rewrite the UI/JSX for these 4 pages. Keep ALL data fetching, auth, and Prisma logic exactly as-is. Change ONLY the JSX structure and Tailwind className values.

Output complete replacement TSX files — not diffs, not partial snippets.

---

## TECH STACK (do not add new dependencies)

- Next.js 14 App Router (Server Components)
- Tailwind CSS (shadcn/ui CSS variable tokens: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border`, `primary`, etc.)
- lucide-react (already installed — use any icons from it)
- No new npm packages. No framer-motion, no new UI libraries.
- Dark mode supported via CSS variables (already wired up)

---

## DESIGN DIRECTION

Study these products for inspiration:
- **Linear** — clean dark UI, strong typography hierarchy, polished micro-interactions
- **Duolingo** — gamification cues, streak fire, XP, badges feel exciting not flat
- **Vercel dashboard** — premium dark card design, subtle gradients, glows
- **Notion** — readable content layout, clean sidebar, good information hierarchy

**What's wrong with the current UI:**
- Too generic — looks like every shadcn starter template
- Hero section has no visual impact, no product screenshot, no emotional pull
- Dashboard stats are flat boxes with no personality
- Module cards are plain rectangles
- No visual brand identity beyond the "S" logo
- Progress indicators are boring 1.5px bars

**What to achieve:**
1. **Landing page**: Hero that stops you. Use a large decorative element (gradient orb/glow, abstract SAP module grid, or code-like visual). Make the value prop visceral. Show social proof numbers (111 lessons, 12 modules, XP system). CTA should feel urgent but friendly.
2. **Dashboard**: Feel like a personal command center. Stats cards with glow/gradient accents per color. "Continue Learning" card should be the dominant element — big, bold, hard to miss. Module grid should feel like a game map, not a table.
3. **Module list**: Visual, scannable. Each module row should feel like a course catalog entry (like Udemy but 10x cleaner). The module color should dominate each row's accent.
4. **Lesson page**: The reading experience needs to feel premium. Good typography via the `prose` class. The sidebar should feel like a chapter navigator. The flowchart section and quiz section should each feel like distinct, well-designed "chapters" of the lesson.

---

## CURRENT CODE (what you are replacing)

### PAGE 1: `app/page.tsx` (Landing Page)

```tsx
import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Trophy, BarChart3, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const modules = [
    { name: "SAP FICO", desc: "Finance & Controlling", color: "#2563EB", lessons: 8 },
    { name: "SAP MM", desc: "Materials Management", color: "#16A34A", lessons: 8 },
    { name: "SAP SD", desc: "Sales & Distribution", color: "#EA580C", lessons: 8 },
    { name: "SAP PP", desc: "Production Planning", color: "#7C3AED", lessons: 7 },
    { name: "SAP HCM", desc: "Human Capital Management", color: "#DB2777", lessons: 7 },
    { name: "SAP BASIS", desc: "System Administration", color: "#6B7280", lessons: 6 },
  ];

  const features = [
    { icon: <BookOpen className="w-6 h-6" />, title: "Story-First Learning", desc: "Every lesson starts with a real business scenario before introducing any SAP concept." },
    { icon: <Zap className="w-6 h-6" />, title: "Interactive Flowcharts", desc: "Click through every SAP process step-by-step. See T-codes, tips, and explanations." },
    { icon: <Trophy className="w-6 h-6" />, title: "Gamified Progress", desc: "Earn XP, badges, and level up as you complete lessons. Keep your streak alive." },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Track Everything", desc: "Dashboard shows exactly where you are across all 16 SAP modules." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b sticky top-0 bg-background/90 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 flex items-center h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl">SAPKing</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-8">
            <a href="#features" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">Features</a>
            <a href="#modules" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">Modules</a>
            <a href="#method" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">How it works</a>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">Sign in</Link>
            <Link href="/register" className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Get started free</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span>🎯</span> 16 SAP modules · 55+ lessons · Interactive flowcharts
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          Learn SAP the way it <span className="text-primary">actually makes sense</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          No jargon. No walls of text. Every concept starts with a real business story, shown as a visual flowchart, explained in plain English.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors">
            Start learning free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/learn" className="flex items-center gap-2 border px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-muted transition-colors">Browse modules</Link>
        </div>
      </section>

      {/* features, modules, how it works, CTA, footer sections follow — all generic cards/grids */}
    </div>
  );
}
```

---

### PAGE 2: `app/(dashboard)/dashboard/page.tsx` (Dashboard — UI portion only)

Key data available (already fetched, keep these variables):
- `dbUser` → `{ name, xp, level, streak }`
- `completedCount`, `totalLessons` 
- `continueLesson` → `{ title, slug, moduleSlug, moduleTitle, moduleColor, estimatedMinutes }`
- `modules[]` → each has `{ id, title, slug, color, icon, lessons[] }` with progress calc
- `userBadges[]`, `allBadges[]`
- `xpPct`, `xpToNextLevel`, `xpIntoLevel`

The current UI uses:
- Small flat stat cards (BookOpen/Star/Flame/Trophy)
- Plain progress bar for level XP
- Basic continue-learning card
- Module grid with thin progress bars
- Badge grid with lock icons

**Upgrade goals:**
- XP level bar should be prominent, with level number and % shown dramatically
- Stats should use colored gradient cards, not plain white boxes
- "Continue Learning" must be the most visually dominant element on the page
- Module cards: show the module icon large, progress arc or thick bar, module color as dominant accent
- Badges: earned badges should glow/celebrate, locked ones should be clearly but elegantly greyed

---

### PAGE 3: `app/(dashboard)/learn/page.tsx` (Module List — UI portion only)

Key data:
- `modules[]` → each has `{ id, title, slug, description, color, icon, lessons[] }`
- Per module: `completedCount`, `totalLessons`, `totalMinutes`, `pct`, `isStarted`

Current UI: plain list of rows with border, icon, title, description, thin progress bar, lesson/time counts, chevron.

**Upgrade goals:**
- Make each module feel like a rich course card
- Module color should bleed into the left edge or top accent of each card
- Large icon + module number + strong title hierarchy
- Progress should feel alive — consider thicker bars with glow matching module color
- "In Progress" / "Complete" badges should feel polished
- Add total XP available per module as a motivating stat

---

### PAGE 4: Lesson page sidebar + key concept + story section (partial)

The lesson page at `app/(dashboard)/learn/[moduleSlug]/[lessonSlug]/page.tsx` has these sections:
1. Sticky navbar with breadcrumb
2. Lesson progress strip (thin bar at top)
3. Two-column layout: main content (left) + sidebar (right, sticky)
4. Main content has: Story section, Content section (markdown), Key Concept card, Flowchart section, Complete button
5. Sidebar has: module progress %, list of all lessons in module with completion status

**Upgrade goals:**
- Story section: Make it feel like an opening act — use a quote-style card with a left accent border in module color, italic story text, and a "💼 Real scenario" label
- Key concept card: Should feel like a highlighted callout — gradient background, bold title, clear body
- Sidebar: chapter-by-chapter feel — current lesson highlighted with module color background, completed ones with checkmarks, future ones slightly dimmed
- Lesson progress strip at top: thicker, more visible, animated fill
- Prev/Next navigation at bottom: big, card-like buttons

---

## OUTPUT FORMAT

Output 4 complete TSX files in order. For each file:
1. Start with a comment: `// ─── FILE: app/page.tsx ───`
2. Include ALL imports (keep existing data-fetching imports unchanged, add any new lucide icons needed)
3. Keep ALL server-side logic, data fetching, Prisma calls, redirects exactly as-is
4. Only change the JSX return block
5. End each file with `// ─── END FILE ───`

After all 4 files, end with:
```
// ─── UI OVERHAUL COMPLETE ─────────────────────────────────────────────────────
```

---

## CONSTRAINTS

- No new npm packages — only lucide-react, tailwind classes, and inline styles where needed
- Module-specific colors can be used as inline `style={{ backgroundColor: mod.color }}` or with opacity e.g. `style={{ backgroundColor: mod.color + '20' }}`
- Keep `"use client"` directives only where they already exist (server components stay server)
- Prose content sections use the existing `@tailwindcss/typography` `prose` class
- Dark mode must still work (use CSS variable-based tokens where possible, avoid hardcoded light-only colors)
- The flowchart and quiz are separate client components (`<FlowchartViewer>`, quiz component) — don't touch their internals, just the wrapper/container styling

