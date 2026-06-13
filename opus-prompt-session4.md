# Opus Prompt — SAPKing Content Session 4
# Modules: SAP Fiori (Modern UI) + SAP S/4HANA (Next-Gen ERP)
# Copy everything below the line and paste into Opus

---

You are writing seed data for a production SAP learning platform called SAPKing. The platform teaches complete beginners SAP using story-first lessons, interactive flowcharts, and quizzes.

## YOUR TASK

Write TypeScript seed code for **8 new lessons** for each of these 2 modules:
1. SAP Fiori (Modern UI Layer)
2. SAP S/4HANA (Next-Generation ERP)

That is 16 new lessons total.

---

## EXISTING LESSONS (DO NOT DUPLICATE THESE)

### Fiori module (variable: `fioriModule`, color: `#DB2777`, icon: 🎨)
- `"fiori-launchpad"` (order 1) → "Fiori & the Launchpad" — covers what Fiori is, the Launchpad, tile types, Fiori vs SAP GUI, roles/groups/catalogs, Fiori Design Principles (role-based, responsive, simple, coherent, delightful)
- `"sapui5-odata-basics"` (order 2) → "SAPUI5 & OData Basics" — covers SAPUI5 as the framework behind Fiori apps, OData protocol (REST-based), MVC architecture, how frontend talks to SAP backend via OData services, SE80/transaction SEGW (Gateway Service Builder)

### S/4HANA module (variable: `s4Module`, color: `#1E40AF`, icon: 🚀)
- `"what-is-s4hana"` (order 1) → "What is S/4HANA?" — covers SAP HANA in-memory DB, S/4HANA vs ECC, simplified data model (single source of truth), Universal Journal (ACDOCA), real-time analytics, deployment options (cloud/on-prem/hybrid)
- `"migrating-to-s4hana"` (order 2) → "Paths to S/4HANA" — covers Greenfield (new implementation) vs Brownfield (system conversion) vs Bluefield (selective data transition), RISE with SAP, migration tools (SUM, DMLT), key considerations

---

## TOPICS TO COVER (choose the 8 most important topics per module not already covered)

### Fiori — suggested topics (pick 8):
- Fiori App Types — Transactional, Analytical, Factsheet apps explained
- Fiori App Library — how to find apps, app IDs, what's available
- Fiori Configuration — assigning apps to roles, catalogs, groups in Fiori Launchpad Designer
- SAP Business Technology Platform (BTP) and Fiori — how Fiori runs on BTP
- Fiori Elements vs Freestyle SAPUI5 — when each is used
- Responsive Design in Fiori — desktop vs tablet vs mobile behavior
- Fiori for Approvals — how managers approve purchase orders, leave requests via Fiori
- My Inbox in Fiori — workflow tasks and how approvals land in the inbox
- Fiori Extensibility — adapting standard apps without modifying them (Key User Tools)
- Fiori Theming — custom branding, Theme Designer
- Fiori Analytics apps — connecting to embedded analytics and CDS views
- Testing Fiori apps — basic QA concepts for Fiori

### S/4HANA — suggested topics (pick 8):
- Universal Journal (ACDOCA) — the single table that replaced dozens of FI/CO tables
- Material Ledger in S/4HANA — mandatory actuals costing, multi-currency valuation
- Business Partner (BP) concept — replaces Customer and Vendor master data (XD01/XK01 → BP)
- Fiori-first UX in S/4HANA — how SAP GUI is being replaced, key Fiori apps for each module
- Embedded Analytics in S/4HANA — CDS views, Virtual Data Model (VDM), real-time reporting
- S/4HANA for Finance (Central Finance) — consolidating multiple ERP systems into one
- S/4HANA Cloud vs On-Premise feature differences
- SAP BTP Integration — how S/4HANA connects to cloud services via BTP Integration Suite
- Intelligent Enterprise concepts — AI, machine learning in S/4HANA (cash application, etc.)
- S/4HANA for Supply Chain — changes to MM, PP, WM/EWM in S/4HANA
- SAP Activate Methodology — agile implementation approach for S/4HANA projects
- Clean Core concept — keeping S/4HANA standard, using BTP for extensions

---

## WRITING RULES (CRITICAL — follow these exactly)

1. **Story first** — every lesson starts with a relatable business story (3-5 sentences) about a real person facing a real problem. Make it feel human and real. Use Indian names or universal business scenarios.

2. **Beginner-friendly** — no jargon without explanation. When you use a technical term, immediately explain it in plain English. Use analogies from everyday life.

3. **Content length** — each lesson content should be 400-600 words with headers, tables where useful, and examples.

4. **Flowcharts** — create meaningful process flows (5-8 nodes) that show HOW the process works step by step. Use emojis in node labels. Positions should be logical (left to right or top to bottom). Use the module color (`#DB2777` for Fiori, `#1E40AF` for S/4HANA) for the key/main node; use other colors for supporting nodes.

5. **Quizzes** — 3 questions per lesson. One should test understanding (not memorization). Include a real explanation for why the answer is correct.

6. **XP rewards** — use 50 for basic/beginner lessons, 75 for intermediate concepts.

7. **Estimated minutes** — be realistic: 8-12 min for most lessons.

---

## EXACT CODE FORMAT

Use this EXACT TypeScript format. Do not change variable names or structure.

```typescript
// ─── FIORI: NEW LESSONS ───────────────────────────────────────────────────────

// LESSON 12.3: [Title Here]
const lesson12_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "your-slug-here" } },
  update: {},
  create: {
    moduleId: fioriModule.id,
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

// Flowchart for lesson 12.3
const flowchart12_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson12_3.id },
  update: {},
  create: {
    lessonId: lesson12_3.id,
    title: "Flowchart Title",
    nodes: [
      { id: "node1", type: "default", position: { x: 100, y: 100 }, data: { label: "📋 Step One" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 100 }, data: { label: "⚙️ Step Two" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 100 }, data: { label: "✅ Step Three" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart12_3.id, nodeId: "node1", title: "Step One Title", description: "What happens at this step. Explain in 2-3 sentences.", tCode: "T-CODE here or N/A", tips: "Practical tip a consultant would give." },
    { flowchartId: flowchart12_3.id, nodeId: "node2", title: "Step Two Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
    { flowchartId: flowchart12_3.id, nodeId: "node3", title: "Step Three Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
  ],
});

// Quiz for lesson 12.3
await prisma.quiz.upsert({
  where: { lessonId: lesson12_3.id },
  update: {},
  create: {
    lessonId: lesson12_3.id,
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

- Fiori module: `fioriModule`
- S/4HANA module: `s4Module`

## LESSON NUMBERING

- Fiori new lessons: `lesson12_3`, `lesson12_4`, `lesson12_5`, `lesson12_6`, `lesson12_7`, `lesson12_8`, `lesson12_9`, `lesson12_10` (orders 3–10)
- S/4HANA new lessons: `lesson13_3`, `lesson13_4`, `lesson13_5`, `lesson13_6`, `lesson13_7`, `lesson13_8`, `lesson13_9`, `lesson13_10` (orders 3–10)

## FLOWCHART NUMBERING

Same pattern: `flowchart12_3` … `flowchart12_10`, `flowchart13_3` … `flowchart13_10`

---

## OUTPUT FORMAT

Output ONLY the TypeScript code. No explanation, no markdown fences, no comments outside the code.

Start with:
```
// ─── FIORI: NEW LESSONS ───────────────────────────────────────────────────────
```

Write all 8 Fiori lessons (12.3–12.10), then all 8 S/4HANA lessons (13.3–13.10).

After all 16 lessons, end with:
```
// ─── SESSION 4 COMPLETE: 16 lessons written ──────────────────────────────────
```

---

## HOW TO INTEGRATE THE OUTPUT

1. Save Opus output as `prisma/seed-session4-lessons.ts`
2. Claude will splice it into `seed.ts` — just paste the file and ask Claude to splice it
