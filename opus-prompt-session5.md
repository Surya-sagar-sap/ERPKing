# Opus Prompt — SAPKing Content Session 5 (FINAL)
# Modules: SAP BTP (Business Technology Platform) + SAP SuccessFactors (Cloud HR)
# Copy everything below the line and paste into Opus

---

You are writing seed data for a production SAP learning platform called SAPKing. The platform teaches complete beginners SAP using story-first lessons, interactive flowcharts, and quizzes.

## YOUR TASK

Write TypeScript seed code for **8 new lessons** for each of these 2 modules:
1. SAP BTP (Business Technology Platform)
2. SAP SuccessFactors (Cloud HR Suite)

That is 16 new lessons total.

---

## EXISTING LESSONS (DO NOT DUPLICATE THESE)

### BTP module (variable: `btpModule`, color: `#0EA5E9`, icon: ☁️)
- `"what-is-btp"` (order 1) → "What is SAP BTP?" — covers BTP as SAP's cloud platform, 4 pillars (Application Development, Integration, Analytics, AI), subaccounts/global accounts, BTP cockpit, trial account
- `"extending-sap-with-btp"` (order 2) → "Extending SAP with BTP" — covers Side-by-Side vs In-App extensions, SAP Cloud Application Programming Model (CAP), SAP Build Apps (low-code), BTP for clean core strategy

### SuccessFactors module (variable: `sfModule`, color: `#9333EA`, icon: 👔)
- `"successfactors-employee-central"` (order 1) → "SuccessFactors & Employee Central" — covers EC as the core HR system of record, Position Management, org chart, SF vs on-premise HCM, MDF (Metadata Framework), people profile
- `"talent-lifecycle"` (order 2) → "The Talent Lifecycle" — covers Recruiting (RCM), Onboarding, Performance & Goals (PM/GM), Learning (LMS), Succession & Development, Compensation — the full hire-to-retire flow in SF

---

## TOPICS TO COVER (choose the 8 most important topics per module not already covered)

### BTP — suggested topics (pick 8):
- SAP Integration Suite — Cloud Integration (iFlows), API Management, connecting SAP and non-SAP systems
- SAP Analytics Cloud (SAC) on BTP — stories, planning, predictive analytics
- SAP Build Process Automation — workflow automation, robotic process automation (RPA) on BTP
- BTP Security — users, role collections, identity providers (IAS, IPS)
- SAP HANA Cloud on BTP — the database-as-a-service, difference from on-premise HANA
- BTP Kyma / Cloud Foundry runtimes — when to use each
- SAP Event Mesh — event-driven architecture, connecting microservices
- BTP for Developers — SAP Business Application Studio (BAS), MTA deployment
- BTP Subscriptions and Services — service marketplace, booster, entitlements
- AI Services on BTP — Document Information Extraction, Business AI, Joule
- SAP Build Work Zone — the portal/launchpad for business users on BTP
- BTP Multi-Cloud strategy — AWS, Azure, GCP support

### SuccessFactors — suggested topics (pick 8):
- SF Employee Central Payroll — how payroll works in SuccessFactors (different from HCM payroll)
- Recruiting (RCM) in depth — job requisitions, career site, candidate pipeline, offer management
- Performance & Goals module — goal setting, continuous performance, review forms, calibration
- Learning Management System (LMS) — course catalog, assignments, completion tracking, compliance training
- Succession & Development — succession plans, talent pools, 9-box grid, development goals
- Compensation Management in SF — salary planning, merit increases, bonus plans
- SF Integration with S/4HANA / HCM — Employee Central as master, replication to payroll
- Workforce Analytics & Planning in SF — headcount reports, workforce planning scenarios
- SF Mobile app — what employees and managers can do on mobile
- SF Admin basics — Provisioning, Admin Center, role-based permissions (RBP)
- SF Onboarding 2.0 — new hire portal, tasks, paperwork, buddy assignment
- SF People Analytics — embedded reporting, Canvas reports, Story Reports

---

## WRITING RULES (CRITICAL — follow these exactly)

1. **Story first** — every lesson starts with a relatable business story (3-5 sentences) about a real person facing a real problem. Make it feel human and real. Use Indian names or universal business scenarios.

2. **Beginner-friendly** — no jargon without explanation. When you use a technical term, immediately explain it in plain English. Use analogies from everyday life.

3. **Content length** — each lesson content should be 400-600 words with headers, tables where useful, and examples.

4. **Flowcharts** — create meaningful process flows (5-8 nodes) that show HOW the process works step by step. Use emojis in node labels. Positions should be logical (left to right or top to bottom). Use the module color (`#0EA5E9` for BTP, `#9333EA` for SuccessFactors) for the key/main node; use other colors for supporting nodes.

5. **Quizzes** — 3 questions per lesson. One should test understanding (not memorization). Include a real explanation for why the answer is correct.

6. **XP rewards** — use 50 for basic/beginner lessons, 75 for intermediate concepts.

7. **Estimated minutes** — be realistic: 8-12 min for most lessons.

---

## EXACT CODE FORMAT

Use this EXACT TypeScript format. Do not change variable names or structure.

```typescript
// ─── BTP: NEW LESSONS ─────────────────────────────────────────────────────────

// LESSON 14.3: [Title Here]
const lesson14_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "your-slug-here" } },
  update: {},
  create: {
    moduleId: btpModule.id,
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

// Flowchart for lesson 14.3
const flowchart14_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson14_3.id },
  update: {},
  create: {
    lessonId: lesson14_3.id,
    title: "Flowchart Title",
    nodes: [
      { id: "node1", type: "default", position: { x: 100, y: 100 }, data: { label: "📋 Step One" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart14_3.id, nodeId: "node1", title: "Step One Title", description: "What happens at this step. Explain in 2-3 sentences.", tCode: "T-CODE here or N/A", tips: "Practical tip a consultant would give." },
    { flowchartId: flowchart14_3.id, nodeId: "node2", title: "Step Two Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
    { flowchartId: flowchart14_3.id, nodeId: "node3", title: "Step Three Title", description: "What happens at this step.", tCode: "T-CODE", tips: "Practical tip." },
  ],
});

// Quiz for lesson 14.3
await prisma.quiz.upsert({
  where: { lessonId: lesson14_3.id },
  update: {},
  create: {
    lessonId: lesson14_3.id,
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

- BTP module: `btpModule`
- SuccessFactors module: `sfModule`

## LESSON NUMBERING

- BTP new lessons: `lesson14_3`, `lesson14_4`, `lesson14_5`, `lesson14_6`, `lesson14_7`, `lesson14_8`, `lesson14_9`, `lesson14_10` (orders 3–10)
- SuccessFactors new lessons: `lesson15_3`, `lesson15_4`, `lesson15_5`, `lesson15_6`, `lesson15_7`, `lesson15_8`, `lesson15_9`, `lesson15_10` (orders 3–10)

## FLOWCHART NUMBERING

Same pattern: `flowchart14_3` … `flowchart14_10`, `flowchart15_3` … `flowchart15_10`

---

## OUTPUT FORMAT

Output ONLY the TypeScript code. No explanation, no markdown fences, no comments outside the code.

Start with:
```
// ─── BTP: NEW LESSONS ─────────────────────────────────────────────────────────
```

Write all 8 BTP lessons (14.3–14.10), then all 8 SuccessFactors lessons (15.3–15.10).

After all 16 lessons, end with:
```
// ─── SESSION 5 COMPLETE: ALL MODULES DONE — 111 total lessons ────────────────
```

---

## HOW TO INTEGRATE THE OUTPUT

1. Save Opus output as `prisma/seed-session5-lessons.ts`
2. Claude will splice it into `seed.ts` — just paste the file and say "splice"
