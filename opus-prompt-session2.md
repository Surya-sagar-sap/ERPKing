# Opus Prompt — SAPKing Content Session 2
# Modules: SAP PP (Production Planning) + SAP HCM (Human Capital Management)
# Copy everything below the line and paste into Opus

---

You are writing seed data for a production SAP learning platform called SAPKing. The platform teaches complete beginners SAP using story-first lessons, interactive flowcharts, and quizzes.

## YOUR TASK

Write TypeScript seed code for **8 new lessons** for each of these 2 modules:
1. SAP PP (Production Planning)
2. SAP HCM (Human Capital Management)

That is 16 new lessons total.

---

## EXISTING LESSONS (DO NOT DUPLICATE THESE)

### PP module (variable: `ppModule`, color: `#059669`, icon: 🏭)
- `"production-planning-basics"` (order 1) → "How Manufacturing Works in SAP" — covers BOM, Routing, MRP run, Planned Orders, Production Orders, MTS vs MTO
- `"production-order-lifecycle"` (order 2) → "The Production Order Lifecycle" — covers CRTD→REL→Goods Issue (261)→Confirm (CO11N)→Goods Receipt (101)→Settlement (KO88), status codes

### HCM module (variable: `hcmModule`, color: `#7C3AED`, icon: 👥)
- `"infotypes-master-data"` (order 1) → "Employee Data & Infotypes" — covers infotypes (0002,0006,0007,0008,0009,0001), PERNR, PA30/PA20/PA40, time-based data
- `"org-management-payroll"` (order 2) → "Org Structure & Payroll Basics" — covers Org Units, Positions, Jobs, org management T-codes, payroll run overview

---

## TOPICS TO COVER (choose the 8 most important topics per module not already covered)

### PP — suggested topics (pick 8):
- Demand Management & Sales and Operations Planning (SOP)
- Capacity Planning & Work Centers
- Repetitive Manufacturing vs Discrete Manufacturing
- Shop Floor Control & Production Execution
- Subcontracting in PP (sending materials to an external vendor to process)
- Batch Management in production
- PP-MM Integration (how PP triggers procurement)
- PP-CO Integration (production cost analysis)
- MRP Planning Strategies (strategy groups, planning modes)
- Backflush & Automatic Goods Movements
- Process Orders (for process industries like chemicals/pharma)
- Variant Configuration basics

### HCM — suggested topics (pick 8):
- Personnel Actions (hiring, transfer, promotion, termination) — PA40
- Time Management in SAP (work schedules, absences, attendances, IT0007)
- Payroll Process in detail (payroll run, payroll areas, PC00_M99_CALC)
- Wage Types — how salary components are structured
- Leave Management (leave types, leave quota, IT2006)
- Travel Management in HCM
- ESS/MSS (Employee Self-Service / Manager Self-Service)
- HCM Reporting — standard HR reports, logical databases
- Organizational Management (Org Units, Positions, Jobs, reporting structure) — if not already covered
- Benefits Administration in SAP HCM
- HCM-FI Integration (how payroll posts to accounting)
- Training & Event Management (HCM learning module)

---

## WRITING RULES (CRITICAL — follow these exactly)

1. **Story first** — every lesson starts with a relatable business story (3-5 sentences) about a real person facing a real problem. Make it feel human and real. Use Indian names or universal business scenarios.

2. **Beginner-friendly** — no jargon without explanation. When you use a technical term, immediately explain it in plain English. Use analogies from everyday life.

3. **Content length** — each lesson content should be 400-600 words with headers, tables where useful, and examples.

4. **Flowcharts** — create meaningful process flows (5-8 nodes) that show HOW the process works step by step. Use emojis in node labels. Positions should be logical (left to right or top to bottom). Use the module color (`#059669` for PP, `#7C3AED` for HCM) for the key/main node; use other colors for supporting nodes.

5. **Quizzes** — 3 questions per lesson. One should test understanding (not memorization). Include a real explanation for why the answer is correct.

6. **XP rewards** — use 50 for basic/beginner lessons, 75 for intermediate concepts.

7. **Estimated minutes** — be realistic: 8-12 min for most lessons.

---

## EXACT CODE FORMAT

Use this EXACT TypeScript format. Do not change variable names or structure.

```typescript
// ─── PP: NEW LESSONS ────────────────────────────────────────────────────────

// LESSON 5.3: [Title Here]
const lesson5_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "your-slug-here" } },
  update: {},
  create: {
    moduleId: ppModule.id,
    title: "Your Title Here",
    slug: "your-slug-here",
    order: 3,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Your story here...`,
    content: `## Header

Your content here...`,
    keyConceptTitle: "Short key concept title",
    keyConceptBody: `Key concept explanation in 2-4 sentences. Use bullet points.`,
  },
});

// Flowchart for lesson 5.3
const flowchart5_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson5_3.id },
  update: {},
  create: {
    lessonId: lesson5_3.id,
    title: "Flowchart Title",
    nodes: [
      { id: "node1", type: "default", position: { x: 100, y: 100 }, data: { label: "📋 Step One" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 100 }, data: { label: "⚙️ Step Two" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 100 }, data: { label: "✅ Step Three" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
    ],
  },
});

await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart5_3.id, nodeId: "node1", title: "Step One Title", description: "What happens at this step. Explain in 2-3 sentences.", tCode: "T-CODE here or N/A", tips: "Practical tip a consultant would give." },
    { flowchartId: flowchart5_3.id, nodeId: "node2", title: "Step Two Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
    { flowchartId: flowchart5_3.id, nodeId: "node3", title: "Step Three Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
  ],
});

// Quiz for lesson 5.3
await prisma.quiz.upsert({
  where: { lessonId: lesson5_3.id },
  update: {},
  create: {
    lessonId: lesson5_3.id,
    title: "Your Title — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Question one?",
          explanation: "Explanation of why the correct answer is right. Be educational.",
          options: {
            create: [
              { text: "Correct answer", isCorrect: true },
              { text: "Wrong answer 1", isCorrect: false },
              { text: "Wrong answer 2", isCorrect: false },
              { text: "Wrong answer 3", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Question two?",
          explanation: "Explanation.",
          options: {
            create: [
              { text: "Correct answer", isCorrect: true },
              { text: "Wrong answer 1", isCorrect: false },
              { text: "Wrong answer 2", isCorrect: false },
              { text: "Wrong answer 3", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Question three?",
          explanation: "Explanation.",
          options: {
            create: [
              { text: "Correct answer", isCorrect: true },
              { text: "Wrong answer 1", isCorrect: false },
              { text: "Wrong answer 2", isCorrect: false },
              { text: "Wrong answer 3", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
```

---

## MODULE VARIABLES (use exactly these variable names)

- PP module: `ppModule`
- HCM module: `hcmModule`

## LESSON NUMBERING

- PP new lessons: `lesson5_3`, `lesson5_4`, `lesson5_5`, `lesson5_6`, `lesson5_7`, `lesson5_8`, `lesson5_9`, `lesson5_10` (orders 3–10)
- HCM new lessons: `lesson6_3`, `lesson6_4`, `lesson6_5`, `lesson6_6`, `lesson6_7`, `lesson6_8`, `lesson6_9`, `lesson6_10` (orders 3–10)

## FLOWCHART NUMBERING

Same pattern: `flowchart5_3` … `flowchart5_10`, `flowchart6_3` … `flowchart6_10`

---

## OUTPUT FORMAT

Output ONLY the TypeScript code. No explanation, no markdown fences, no comments outside the code.

Start with:
```
// ─── PP: NEW LESSONS ────────────────────────────────────────────────────────
```

Write all 8 PP lessons (5.3–5.10), then all 8 HCM lessons (6.3–6.10).

After all 16 lessons, end with:
```
// ─── SESSION 2 COMPLETE: 16 lessons written ──────────────────────────────────
```

---

## HOW TO INTEGRATE THE OUTPUT

1. Open `/prisma/seed.ts`
2. Find the comment `// LESSON 5.2:` and scroll past the HCM section
3. Paste the PP block immediately after the existing `lesson5_2` quiz block (before HCM)
4. Paste the HCM block immediately after the existing `lesson6_2` quiz block
5. Run `npx ts-node prisma/seed.ts` to seed the database
