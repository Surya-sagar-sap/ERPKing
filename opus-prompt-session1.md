# Opus Prompt — ERPKing Content Session 1
# Modules: Foundation, FICO, MM, SD
# Copy everything below the line and paste into Opus

---

You are writing seed data for a production SAP learning platform called ERPKing. The platform teaches complete beginners SAP using story-first lessons, interactive flowcharts, and quizzes.

## YOUR TASK

Write TypeScript seed code for **6 new lessons** for each of these 4 modules:
1. SAP Foundation
2. SAP FICO
3. SAP MM
4. SAP SD

That's 24 new lessons total.

---

## EXISTING LESSONS (DO NOT DUPLICATE THESE)

### Foundation (foundationModule variable)
- "what-is-sap" → "What is SAP?"
- "sap-modules-overview" → "SAP Modules: The Big Map"

### FICO (ficoModule variable)
- "chart-of-accounts" → "Chart of Accounts"
- "vendor-invoice-fb60" → "Posting a Vendor Invoice"

### MM (mmModule variable)
- "procure-to-pay" → "Procure-to-Pay Overview"

### SD (sdModule variable)
- "order-to-cash" → "Order-to-Cash Process"
- "sales-order-structure" → "Sales Order Structure"

---

## TOPICS TO COVER (Opus: choose the 6 most important beginner topics per module not already covered)

### Foundation — suggested topics (pick best 6):
- SAP Navigation & T-codes (how to use the system)
- SAP Organizational Structure (Company Code, Plant, Storage Location)
- SAP Master Data (what it is, why it matters)
- SAP Transaction Codes explained
- SAP Document Principle (every posting = a document)
- SAP Roles & Authorization
- SAP Reporting basics (how to find data)
- S/4HANA vs ECC — what changed

### FICO — suggested topics (pick best 6):
- General Ledger (G/L) Accounts explained
- Cost Centers and Profit Centers
- Accounts Payable (AP) process end-to-end
- Accounts Receivable (AR) process end-to-end
- Asset Accounting basics
- Month-end closing process
- Financial statements in SAP (balance sheet, P&L)
- Internal Orders vs Cost Centers
- Bank Reconciliation in SAP

### MM — suggested topics (pick best 6):
- Material Master — what it is and why it matters
- Vendor Master — how suppliers are set up
- Purchase Requisition to Purchase Order
- Goods Receipt (MIGO) explained
- Invoice Verification (MIRO)
- Inventory Management basics
- Stock types in SAP (unrestricted, blocked, in-transit)
- Material valuation — how SAP prices stock
- Outline Agreements (contracts and scheduling agreements)

### SD — suggested topics (pick best 6):
- Customer Master Data setup
- Pricing procedure basics
- Delivery process (VL01N)
- Billing and invoicing (VF01)
- Returns and credit memos
- Availability Check in SD
- SD-MM integration (how sales affects stock)
- SD-FI integration (how billing posts to finance)
- Quotation to Sales Order

---

## WRITING RULES (CRITICAL — follow these exactly)

1. **Story first** — every lesson starts with a relatable business story (3-5 sentences) about a real person facing a real problem. Make it feel human and real. Use Indian names or universal business scenarios.

2. **Beginner-friendly** — no jargon without explanation. When you use a technical term, immediately explain it in plain English. Use analogies from everyday life.

3. **Content length** — each lesson content should be 400-600 words with headers, tables where useful, and examples.

4. **Flowcharts** — create meaningful process flows (5-8 nodes) that show HOW the process works step by step. Use emojis in node labels. Positions should be logical (left to right or top to bottom).

5. **Quizzes** — 3 questions per lesson. One should test understanding (not memorization). Include a real explanation for why the answer is correct.

6. **XP rewards** — use 50 for basic lessons, 75 for intermediate concepts.

7. **Estimated minutes** — be realistic: 8-12 min for most lessons.

---

## EXACT CODE FORMAT

Use this EXACT TypeScript format. Do not change variable names or structure.

```typescript
// ─── FOUNDATION: NEW LESSONS ───────────────────────────────────────────────

// LESSON 1.3: [Title Here]
const lesson1_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "your-slug-here" } },
  update: {},
  create: {
    moduleId: foundationModule.id,
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

// Flowchart for lesson 1.3
const flowchart1_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson1_3.id },
  update: {},
  create: {
    lessonId: lesson1_3.id,
    title: "Flowchart Title",
    nodes: [
      { id: "node1", type: "default", position: { x: 100, y: 100 }, data: { label: "📋 Step One" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "node2", type: "default", position: { x: 100, y: 220 }, data: { label: "⚙️ Step Two" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "node3", type: "default", position: { x: 100, y: 340 }, data: { label: "✅ Step Three" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
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
    { flowchartId: flowchart1_3.id, nodeId: "node1", title: "Step One Title", description: "What happens at this step. Explain in 2-3 sentences.", tCode: "T-CODE here or N/A", tips: "Practical tip a consultant would give." },
    { flowchartId: flowchart1_3.id, nodeId: "node2", title: "Step Two Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
    { flowchartId: flowchart1_3.id, nodeId: "node3", title: "Step Three Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
  ],
});

// Quiz for lesson 1.3
await prisma.quiz.upsert({
  where: { lessonId: lesson1_3.id },
  update: {},
  create: {
    lessonId: lesson1_3.id,
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

- Foundation module: `foundationModule`
- FICO module: `ficoModule`
- MM module: `mmModule`
- SD module: `sdModule`

## LESSON NUMBERING

- Foundation new lessons: lesson1_3, lesson1_4, lesson1_5, lesson1_6, lesson1_7, lesson1_8 (orders 3-8)
- FICO new lessons: lesson2_3, lesson2_4, lesson2_5, lesson2_6, lesson2_7, lesson2_8 (orders 3-8)
- MM new lessons: lesson3_2, lesson3_3, lesson3_4, lesson3_5, lesson3_6, lesson3_7 (orders 2-7)
- SD new lessons: lesson4_3, lesson4_4, lesson4_5, lesson4_6, lesson4_7, lesson4_8 (orders 3-8)

## FLOWCHART NUMBERING

Same pattern: flowchart1_3, flowchart1_4 ... flowchart4_8

---

## OUTPUT FORMAT

Output ONLY the TypeScript code. No explanation, no markdown fences, no comments outside the code.

Start with:
```
// ─── FOUNDATION: NEW LESSONS ───────────────────────────────────────────────
```

Then write all Foundation lessons, then FICO, then MM, then SD.

After you write all 24 lessons, end with:
```
// ─── END OF SESSION 1 ───────────────────────────────────────────────────────
```
