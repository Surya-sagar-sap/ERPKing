# Opus Prompt — SAPKing Content Session 3
# Modules: SAP BASIS (System Administration) + SAP ABAP (Programming Language)
# Copy everything below the line and paste into Opus

---

You are writing seed data for a production SAP learning platform called SAPKing. The platform teaches complete beginners SAP using story-first lessons, interactive flowcharts, and quizzes.

## YOUR TASK

Write TypeScript seed code for **8 new lessons** for each of these 2 modules:
1. SAP BASIS (System Administration)
2. SAP ABAP (Programming Language)

That is 16 new lessons total.

---

## EXISTING LESSONS (DO NOT DUPLICATE THESE)

### BASIS module (variable: `basisModule`, color: `#64748B`, icon: ⚙️)
- `"basis-system-landscape"` (order 1) → "BASIS & the System Landscape" — covers 3-system landscape (DEV/QAS/PRD), Transport Management System (TMS), BASIS role overview, system architecture
- `"monitoring-background-jobs"` (order 2) → "Monitoring & Background Jobs" — covers SM50/SM66 (work processes), SM37 (background jobs), ST22 (ABAP dumps), AL11 (file system), SM21 (system log)

### ABAP module (variable: `abapModule`, color: `#0EA5E9`, icon: 💻)
- `"abap-fundamentals"` (order 1) → "Your First ABAP Program" — covers ABAP Workbench (SE80), SE38 (ABAP Editor), DATA declarations, WRITE statement, IF/ENDIF, LOOP AT, basic syntax
- `"abap-data-dictionary"` (order 2) → "The ABAP Data Dictionary" — covers SE11 (DDIC), Tables vs Structures vs Data Elements vs Domains, transparent tables, SELECT statement basics, WHERE clause

---

## TOPICS TO COVER (choose the 8 most important topics per module not already covered)

### BASIS — suggested topics (pick 8):
- User Administration (SU01, SU10) — creating and managing user accounts
- Role & Authorization concept (PFCG, SU53, authorization objects)
- Client Administration — what a client is, SCC4, client copy
- Transport System in depth (SE10, STMS) — how changes move DEV → QAS → PRD
- Kernel upgrades and SAP patches (SPAM/SAINT)
- Performance monitoring (ST05, SM04, transaction analysis)
- Spool & Print Management (SP01, printer setup)
- Database administration basics (BRTOOLS, DB02, DB13)
- System parameters (RZ10, RZ11) — profile parameters
- Support Packages and Notes (SNOTE)
- System copy and client refresh concepts
- Solution Manager basics and LMDB

### ABAP — suggested topics (pick 8):
- Internal Tables — TYPES, DATA, APPEND, READ TABLE, LOOP AT
- Modularization — FORM/ENDFORM (subroutines), FUNCTION MODULES (SE37)
- ALV Reports — what ALV is, REUSE_ALV_GRID_DISPLAY, field catalog
- User Exits & BADIs — how to customize SAP without modifying standard code
- SAP Script / SmartForms / Adobe Forms — how output forms work
- BAPI concept — Business APIs, BAPI_SALESORDER_CREATEFROMDAT2, RFC
- Object-Oriented ABAP (Classes, Methods, Interfaces) — beginner introduction
- Dialog Programming — screens (dynpros), PAI/PBO, Module Pool basics
- ABAP Debugging — breakpoints, watchpoints, step through (debugging tool)
- Enhancement Framework — implicit/explicit enhancements, CMOD
- CDS Views (Core Data Services) — modern ABAP for S/4HANA
- Regular Expressions and String handling in ABAP

---

## WRITING RULES (CRITICAL — follow these exactly)

1. **Story first** — every lesson starts with a relatable business story (3-5 sentences) about a real person facing a real problem. Make it feel human and real. Use Indian names or universal business scenarios.

2. **Beginner-friendly** — no jargon without explanation. When you use a technical term, immediately explain it in plain English. Use analogies from everyday life.

3. **Content length** — each lesson content should be 400-600 words with headers, tables where useful, and examples.

4. **Flowcharts** — create meaningful process flows (5-8 nodes) that show HOW the process works step by step. Use emojis in node labels. Positions should be logical (left to right or top to bottom). Use the module color (`#64748B` for BASIS, `#0EA5E9` for ABAP) for the key/main node; use other colors for supporting nodes.

5. **Quizzes** — 3 questions per lesson. One should test understanding (not memorization). Include a real explanation for why the answer is correct.

6. **XP rewards** — use 50 for basic/beginner lessons, 75 for intermediate concepts.

7. **Estimated minutes** — be realistic: 8-12 min for most lessons.

---

## EXACT CODE FORMAT

Use this EXACT TypeScript format. Do not change variable names or structure.

```typescript
// ─── BASIS: NEW LESSONS ──────────────────────────────────────────────────────

// LESSON 10.3: [Title Here]
const lesson10_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "your-slug-here" } },
  update: {},
  create: {
    moduleId: basisModule.id,
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

// Flowchart for lesson 10.3
const flowchart10_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_3.id },
  update: {},
  create: {
    lessonId: lesson10_3.id,
    title: "Flowchart Title",
    nodes: [
      { id: "node1", type: "default", position: { x: 100, y: 100 }, data: { label: "📋 Step One" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart10_3.id, nodeId: "node1", title: "Step One Title", description: "What happens at this step. Explain in 2-3 sentences.", tCode: "T-CODE here or N/A", tips: "Practical tip a consultant would give." },
    { flowchartId: flowchart10_3.id, nodeId: "node2", title: "Step Two Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
    { flowchartId: flowchart10_3.id, nodeId: "node3", title: "Step Three Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
  ],
});

// Quiz for lesson 10.3
await prisma.quiz.upsert({
  where: { lessonId: lesson10_3.id },
  update: {},
  create: {
    lessonId: lesson10_3.id,
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

- BASIS module: `basisModule`
- ABAP module: `abapModule`

## LESSON NUMBERING

- BASIS new lessons: `lesson10_3`, `lesson10_4`, `lesson10_5`, `lesson10_6`, `lesson10_7`, `lesson10_8`, `lesson10_9`, `lesson10_10` (orders 3–10)
- ABAP new lessons: `lesson11_3`, `lesson11_4`, `lesson11_5`, `lesson11_6`, `lesson11_7`, `lesson11_8`, `lesson11_9`, `lesson11_10` (orders 3–10)

## FLOWCHART NUMBERING

Same pattern: `flowchart10_3` … `flowchart10_10`, `flowchart11_3` … `flowchart11_10`

---

## OUTPUT FORMAT

Output ONLY the TypeScript code. No explanation, no markdown fences, no comments outside the code.

Start with:
```
// ─── BASIS: NEW LESSONS ──────────────────────────────────────────────────────
```

Write all 8 BASIS lessons (10.3–10.10), then all 8 ABAP lessons (11.3–11.10).

After all 16 lessons, end with:
```
// ─── SESSION 3 COMPLETE: 16 lessons written ──────────────────────────────────
```

---

## HOW TO INTEGRATE THE OUTPUT

1. Save Opus output as `prisma/seed-session3-lessons.ts`
2. Claude will splice it into `seed.ts` automatically — just paste the file and ask Claude to splice it
