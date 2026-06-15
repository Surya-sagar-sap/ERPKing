// ─── MM: DEEP DIVE LESSONS (Session 8A) ──────────────────────────────────────
// LESSON 3.8: Enterprise Structure in MM
const lesson3_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-enterprise-structure" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Enterprise Structure in MM",
    slug: "mm-enterprise-structure",
    order: 8,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Meera is configuring SAP for a manufacturer that just opened a second factory in Pune, in addition to its original plant in Chennai. Both factories buy raw materials, store stock, and run production. Her project lead asks her one deceptively simple question: "When a buyer in Chennai raises a purchase order, how does SAP know which factory it's for, which warehouse the stock lands in, and which company pays the bill?"

The answer lives entirely in the enterprise structure — the skeleton of org units that every MM transaction hangs off. Get it wrong, and stock, costs, and procurement responsibility all end up in the wrong place.`,
    content: `## The Skeleton Behind Every MM Transaction

Before anyone can raise a single purchase order, SAP needs to know *where* procurement happens, *who* is responsible, and *which legal entity* foots the bill. That map of org units is the **enterprise structure**. In MM, four units do almost all the work.

## Plant — the Heart of MM

A **Plant** is the central org unit for MM. It represents a physical location where you produce, procure, and store materials — a factory, a warehouse, a distribution centre. Almost every MM activity (MRP, goods receipt, inventory, costing) happens *at plant level*. A plant is assigned to exactly one **company code** (the legal/accounting entity).

## Storage Location — Where Stock Physically Sits

Within a plant, a **Storage Location** is a physical spot where stock is kept — \`WH01\` (main store), \`WH02\` (shop floor), \`COLD\` (cold storage). Inventory is managed at storage-location level, so when you do a goods receipt you must say *which* storage location the stock lands in.

## Purchasing Organization — Who Is Allowed to Buy

A **Purchasing Organization** is the unit legally responsible for procurement — it negotiates terms and owns purchasing conditions with vendors. It can be set up three ways:

| Model | Meaning |
|-------|---------|
| Plant-specific | One purch org serves one plant |
| Company-code level | One purch org buys for all plants in a company code |
| Cross-company (central) | One purch org buys for plants across multiple company codes |

## Purchasing Group — the Buyer or Buying Team

A **Purchasing Group** is the buyer or team of buyers responsible for a category of materials (e.g. "electronics buyers", "packaging buyers"). Unlike the others, it is *not* assigned in the org structure — it's a free key used for reporting and workload assignment.

## The Hierarchy

The org units stack into a clear hierarchy:

\`\`\`
Client → Company → Controlling Area → Company Code → Plant → Storage Location
\`\`\`

The **Client** is the top — the entire SAP system / organisation. A **Controlling Area** groups company codes for cost accounting. The key MM relationships: a plant belongs to one company code; a storage location belongs to one plant.

## Practical Realities

- **One company code can have many plants.** Meera's company code holds both the Chennai and Pune plants.
- **One purchasing org can serve many plants.** A single central purch org can buy for both factories, consolidating vendor negotiations for better pricing.
- **A plant can be served by more than one purchasing org** if procurement is split (e.g. local vs central buying).

These many-to-one and many-to-many links are exactly what trip up new consultants — always confirm the assignments before building POs.

## Where You Configure It

Everything is set in customizing:

\`\`\`
SPRO → Enterprise Structure → Definition / Assignment → Logistics - General
\`\`\`

You first **define** each unit (create the plant, storage locations, purch org), then **assign** them (plant → company code, storage location → plant, purch org → plant/company code).

## Why It Matters

The enterprise structure decides the accounting and inventory consequences of every transaction. A purchase order's plant determines which factory's stock and which company code's books are affected; the storage location decides which shelf the stock appears on. Misassign a plant to the wrong company code and finance reconciliation breaks. This skeleton is invisible day-to-day, but every PO, GR, and invoice silently depends on it.`,
    keyConceptTitle: "Plant Is the Heart; Everything Hangs Off the Hierarchy",
    keyConceptBody: `- A **Plant** is the central MM org unit (production, procurement, inventory) and is assigned to exactly one **company code**.
- A **Storage Location** is a physical place for stock *within* a plant; inventory is managed at this level.
- A **Purchasing Organization** is legally responsible for buying (can be plant-specific, company-code, or cross-company); a **Purchasing Group** is the buyer/team and is just a reporting key.
- Hierarchy: **Client → Company Code → Plant → Storage Location**, configured under SPRO → Enterprise Structure → Logistics - General.`,
  },
});
const flowchart3_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_8.id },
  update: {},
  create: {
    lessonId: lesson3_8.id,
    title: "The MM Enterprise Structure Hierarchy",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🌐 Client" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 110 }, data: { label: "🏢 Company Code (legal entity)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 140, y: 210 }, data: { label: "🏭 Plant — Chennai" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 460, y: 210 }, data: { label: "🏭 Plant — Pune" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 140, y: 310 }, data: { label: "📦 Storage Locs (WH01/WH02)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 460, y: 310 }, data: { label: "📦 Storage Locs (WH01/WH02)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 420 }, data: { label: "🛒 Purchasing Org (serves both plants)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 300, y: 510 }, data: { label: "👤 Purchasing Group (buyer team)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node7", target: "node3", type: "default", label: "buys for" },
      { id: "e7", source: "node7", target: "node4", type: "default", label: "buys for" },
      { id: "e8", source: "node8", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_8.id, nodeId: "node1", title: "Client", description: "The top of the hierarchy — the entire SAP system and organisation. All company codes and configuration live under one client.", tCode: null, tips: "You log into a specific client number; data in one client is isolated from another." },
    { flowchartId: flowchart3_8.id, nodeId: "node2", title: "Company Code", description: "The legal and accounting entity where the books are kept. Every plant is assigned to exactly one company code, so financial postings flow to the right legal entity.", tCode: "OX02", tips: "If a PO's plant is in the wrong company code, finance reconciliation breaks — always verify the assignment." },
    { flowchartId: flowchart3_8.id, nodeId: "node3", title: "Plant — Chennai", description: "The central MM org unit: production, procurement, MRP, inventory, and costing all happen at plant level. Assigned to one company code.", tCode: "OX10", tips: "One company code can hold many plants — Chennai and Pune both sit under the same legal entity here." },
    { flowchartId: flowchart3_8.id, nodeId: "node4", title: "Plant — Pune", description: "A second factory under the same company code. It has its own stock, MRP, and goods movements but shares the legal entity.", tCode: "OX10", tips: "Each plant keeps its own valuated stock — material valuation is at plant (valuation area) level." },
    { flowchartId: flowchart3_8.id, nodeId: "node5", title: "Storage Locations", description: "Physical places within a plant where stock sits (main store, shop floor, cold storage). Inventory is managed at this level.", tCode: "OX09", tips: "At goods receipt you must name the storage location — it decides which shelf the stock appears on in MMBE." },
    { flowchartId: flowchart3_8.id, nodeId: "node6", title: "Storage Locations (Pune)", description: "Pune's own storage locations. The same codes (WH01/WH02) can exist in different plants and are kept separate by plant.", tCode: "OX09", tips: "Storage location codes are not globally unique — they are unique only within a plant." },
    { flowchartId: flowchart3_8.id, nodeId: "node7", title: "Purchasing Organization", description: "The unit legally responsible for procurement and vendor conditions. A single central purch org can buy for multiple plants to consolidate negotiating power.", tCode: "OX08", tips: "Cross-company purch orgs enable centralised buying — great for volume discounts across factories." },
    { flowchartId: flowchart3_8.id, nodeId: "node8", title: "Purchasing Group", description: "The buyer or team of buyers responsible for a material category. Unlike the others, it is not assigned in the org structure — it's a free reporting key.", tCode: null, tips: "Use purchasing groups to split workload and report on buyer performance by category." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_8.id },
  update: {},
  create: {
    lessonId: lesson3_8.id,
    title: "Enterprise Structure in MM — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which org unit is the central unit for MM, where procurement, inventory, and MRP take place?",
          explanation: "The Plant is the heart of MM. Production, procurement, MRP, inventory management, and costing all happen at plant level, and each plant is assigned to exactly one company code.",
          options: {
            create: [
              { text: "Plant", isCorrect: true },
              { text: "Purchasing Group", isCorrect: false },
              { text: "Controlling Area", isCorrect: false },
              { text: "Storage Location", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the key difference between a Purchasing Organization and a Purchasing Group?",
          explanation: "A Purchasing Organization is legally responsible for procurement and is assigned in the enterprise structure. A Purchasing Group is just the buyer/team — a free reporting key that is not assigned to plants or company codes in the org structure.",
          options: {
            create: [
              { text: "The purch org is legally responsible and assigned in the structure; the purch group is the buyer/team and is just a reporting key", isCorrect: true },
              { text: "The purch group is legally responsible; the purch org is only for reporting", isCorrect: false },
              { text: "They are two names for the same thing", isCorrect: false },
              { text: "The purch org sits below the storage location", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Meera's company runs two factories (Chennai and Pune) and wants to negotiate one set of vendor prices for both. How should the purchasing org be set up?",
          explanation: "A single cross-plant (central or company-code-level) purchasing org that serves both plants consolidates procurement, so one set of negotiated conditions applies across both factories — giving better volume pricing.",
          options: {
            create: [
              { text: "One central purchasing org assigned to serve both plants", isCorrect: true },
              { text: "A separate purchasing org per storage location", isCorrect: false },
              { text: "No purchasing org — use only purchasing groups", isCorrect: false },
              { text: "One purchasing org per material, regardless of plant", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.9: Movement Types
const lesson3_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-movement-types" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Movement Types",
    slug: "mm-movement-types",
    order: 9,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Karthik, an MM consultant, gets an angry call from the finance team. A warehouse clerk returned faulty material to a vendor, but instead of the rejection hitting the GR/IR clearing account, it dumped value into the cost of goods sold. The finance team's month-end now doesn't balance, and everyone is pointing fingers at "the SAP system."

Karthik checks one thing first: the movement type the clerk used. He finds they posted \`201\` (goods issue to cost centre) instead of \`122\` (return to vendor). The "SAP bug" was really a three-digit code chosen by mistake — and that tiny number quietly rewrote the accounting.`,
    content: `## The Most Important Concept in MM Inventory

Every single goods movement in SAP — a receipt, an issue, a transfer, a scrapping — is controlled by a **3-digit movement type**. The movement type is the master switch: it tells SAP whether stock goes up or down, which stock type is affected, and — crucially — **which G/L accounts the value hits**. Choose the wrong one and the accounting is wrong, even though the physical stock looks fine.

## The Movement Types Every Consultant Must Know

| Mvt Type | What It Does |
|----------|--------------|
| \`101\` / \`102\` | Goods Receipt for a PO / its reversal |
| \`122\` | Return delivery to vendor |
| \`201\` / \`202\` | Goods Issue to a cost centre / reversal |
| \`261\` / \`262\` | Goods Issue for a production order / reversal |
| \`301\` / \`303\` / \`305\` | Stock transfer plant-to-plant (one-step / two-step) |
| \`311\` / \`312\` | Transfer posting storage location to storage location |
| \`321\` | Quality inspection stock → unrestricted (release) |
| \`501\` | Receipt without a PO (unplanned) |
| \`551\` | Scrapping |

A useful mental model: the **first digit gives the family** (1xx = receipts, 2xx = issues/consumption, 3xx = transfers, 5xx = other receipts/scrap), and adding **1** to an even base usually gives its reversal (\`101\`→\`102\`, \`201\`→\`202\`).

## Why the Same Material Can Hit Different Accounts

The movement type, not the material, decides the offsetting entry. The same steel plate:

- received on a PO (\`101\`) → debits inventory, credits **GR/IR clearing**;
- issued to a cost centre (\`201\`) → credits inventory, debits a **consumption/expense** account;
- scrapped (\`551\`) → credits inventory, debits a **scrapping loss** account.

Each movement type is linked to a G/L account through **account determination (OBYC)** via a transaction/event key. So Karthik's clerk picking \`201\` instead of \`122\` literally routed value to the wrong account.

## One-Step vs Two-Step

Some movements come in one-step and two-step flavours. A plant-to-plant transfer with \`301\` is **one-step** — stock leaves the source and arrives at the destination in a single posting. The two-step variant (\`303\` issue, then \`305\` receipt) is used when material is in transit and you want to track it leaving before it arrives.

## How to Check What Happened

When a movement looks wrong, two reports are your friends:

- \`MB51\` — **Material Document List**: every movement for a material, with its movement type. This is where Karthik spotted the rogue \`201\`.
- \`MB52\` — **Warehouse Stocks**: current stock on hand by material, plant, and storage location.

Goods movements themselves are posted in \`MIGO\`, where you choose the movement type before posting.

## A Real Example

Karthik's fix:
1. Reverse the wrong issue with \`202\` (reversal of \`201\`).
2. Re-post the return correctly with \`122\` against the original PO.
3. Now the value lands in GR/IR clearing, the vendor return is reflected, and month-end balances again.

## Why It Matters

A wrong movement type means a wrong accounting entry — and finance escalates fast, because their books no longer tie out. Movement types are the bridge between the warehouse floor and the general ledger. Knowing the common ones cold, and knowing that each one carries an accounting consequence, is what separates a confident MM consultant from someone who "just posts goods."`,
    keyConceptTitle: "A 3-Digit Code Controls Both Stock and Accounting",
    keyConceptBody: `- Every goods movement is driven by a **3-digit movement type** that decides stock direction, stock type, and which **G/L accounts** are posted (via OBYC).
- Know the staples: \`101/102\` (GR/reversal), \`122\` (return to vendor), \`201/202\` (issue to cost centre), \`261/262\` (issue to production order), \`301/303/305\` (stock transfer), \`311/312\` (transfer posting), \`321\` (QI → unrestricted), \`501\` (receipt w/o PO), \`551\` (scrapping).
- Check movements with \`MB51\` (material document list) and stock with \`MB52\`; post them in \`MIGO\`. The **wrong movement type = wrong accounting**.`,
  },
});
const flowchart3_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_9.id },
  update: {},
  create: {
    lessonId: lesson3_9.id,
    title: "Movement Type Families & Their Accounting Impact",
    nodes: [
      { id: "node1", type: "default", position: { x: 280, y: 20 }, data: { label: "📦 Goods Movement in MIGO" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 40, y: 140 }, data: { label: "1xx Receipts (101 GR)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 230, y: 140 }, data: { label: "2xx Issues (201, 261)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 420, y: 140 }, data: { label: "3xx Transfers (301, 311)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 610, y: 140 }, data: { label: "5xx Other (501, 551)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 230, y: 270 }, data: { label: "🔗 OBYC Account Determination" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 230, y: 390 }, data: { label: "📒 FI Document (correct G/L)" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node1", target: "node4", type: "default" },
      { id: "e4", source: "node1", target: "node5", type: "default" },
      { id: "e5", source: "node2", target: "node6", type: "default" },
      { id: "e6", source: "node3", target: "node6", type: "default" },
      { id: "e7", source: "node4", target: "node6", type: "default" },
      { id: "e8", source: "node5", target: "node6", type: "default" },
      { id: "e9", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_9.id, nodeId: "node1", title: "Goods Movement in MIGO", description: "Every physical movement is entered in MIGO, where you select a movement type before posting. That choice drives everything downstream.", tCode: "MIGO", tips: "Always confirm the movement type on the MIGO header before posting — it's the single most consequential field." },
    { flowchartId: flowchart3_9.id, nodeId: "node2", title: "1xx — Receipts", description: "Receipts increase stock. 101 is goods receipt for a PO; 102 reverses it. First digit 1 signals a receipt family.", tCode: "MIGO / MB51", tips: "Add 1 to the base (101→102) for the reversal — a handy pattern across most movement types." },
    { flowchartId: flowchart3_9.id, nodeId: "node3", title: "2xx — Issues & Consumption", description: "Issues decrease stock. 201 issues to a cost centre, 261 issues components to a production order; 202/262 reverse them.", tCode: "MIGO / MB1A", tips: "201 hits a consumption/expense account — never use it for a vendor return (that's 122)." },
    { flowchartId: flowchart3_9.id, nodeId: "node4", title: "3xx — Transfers", description: "Transfers move stock without changing total ownership. 301 = plant-to-plant one-step; 311/312 = storage location to storage location.", tCode: "MIGO / MB1B", tips: "Use 303/305 (two-step) when you need to track stock in transit between plants." },
    { flowchartId: flowchart3_9.id, nodeId: "node5", title: "5xx — Other Receipts & Scrap", description: "501 is an unplanned receipt without a PO; 551 scraps stock, posting a loss. These are exceptions to the normal PO-driven flow.", tCode: "MIGO", tips: "551 should be tightly controlled — it writes off value, so most clients restrict who can scrap." },
    { flowchartId: flowchart3_9.id, nodeId: "node6", title: "OBYC Account Determination", description: "Each movement type maps to a transaction/event key, which OBYC uses to find the right G/L account given the valuation class.", tCode: "OBYC", tips: "When value lands in the wrong account, trace the movement type → transaction key → OBYC entry." },
    { flowchartId: flowchart3_9.id, nodeId: "node7", title: "FI Document", description: "The movement posts a material document and a matching accounting (FI) document with the correct debits and credits.", tCode: "MB51 / FB03", tips: "Every goods movement creates both a material doc and an FI doc — check both when reconciling." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_9.id },
  update: {},
  create: {
    lessonId: lesson3_9.id,
    title: "Movement Types — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which movement type is used for a goods receipt against a purchase order?",
          explanation: "101 posts a goods receipt for a PO, increasing stock and crediting the GR/IR clearing account. 102 reverses it.",
          options: {
            create: [
              { text: "101", isCorrect: true },
              { text: "551", isCorrect: false },
              { text: "311", isCorrect: false },
              { text: "201", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why can the same material post to different G/L accounts depending on the movement type used?",
          explanation: "The movement type maps to a transaction/event key, and OBYC uses that key (plus the valuation class) to find the offsetting G/L account. So a receipt, an issue, and a scrapping of the same material each hit different accounts.",
          options: {
            create: [
              { text: "Because each movement type maps via OBYC to a different transaction key and offsetting G/L account", isCorrect: true },
              { text: "Because the material master randomly picks an account", isCorrect: false },
              { text: "Because the storage location decides the account", isCorrect: false },
              { text: "Because only finance can choose the account at posting time", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A clerk returned faulty material to a vendor but posted 201 (issue to cost centre) instead of 122. What is the cleanest fix?",
          explanation: "Reverse the wrong issue with 202 (the reversal of 201), then re-post the vendor return correctly with 122 against the original PO. This routes the value to GR/IR clearing instead of consumption, restoring the correct accounting.",
          options: {
            create: [
              { text: "Reverse with 202, then post the return correctly with 122", isCorrect: true },
              { text: "Leave it — the stock figure is fine so accounting doesn't matter", isCorrect: false },
              { text: "Post another 201 to balance it out", isCorrect: false },
              { text: "Delete the material master to clear the entry", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.10: RFQ & Quotation Comparison
const lesson3_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-rfq-quotation-comparison" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "RFQ & Quotation Comparison",
    slug: "mm-rfq-quotation-comparison",
    order: 10,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Sneha's company is buying a custom CNC machine worth ₹40 lakh — a one-off capital purchase with no standing contract. Her CFO is clear: "I want at least three vendors to quote, and I want to see them compared side by side before we commit a single rupee."

For routine items Sneha just raises a PO against an info record. But for this, she needs a formal, auditable bidding process. That's exactly what the RFQ and quotation comparison flow in SAP gives her — a documented competition that produces a defensible "why we picked this vendor."`,
    content: `## When You Need a Formal Bid

For standard, repeat purchases you usually buy straight from a contract or info record. But for **capital goods, projects, and non-standard procurement**, companies want competition: several vendors quoting, compared fairly, with a paper trail. SAP supports this with the **Request for Quotation (RFQ)** and **quotation comparison** process.

An **RFQ** is a formal request asking vendors to quote their price and terms for a specified material, quantity, and delivery date.

## The End-to-End Flow

| Step | T-code | What Happens |
|------|--------|--------------|
| Create RFQ | \`ME41\` | Enter material, quantity, delivery date, validity period; send to each vendor |
| Maintain quotations | \`ME47\` | Record each vendor's quoted price and terms |
| Compare prices | \`ME49\` | SAP ranks vendors automatically, colour-coded |
| Reject losers | \`ME47\` | Flag losing quotations as rejected |
| Create PO | \`ME21N\` | Raise the PO from the winning quotation |

## Step 1: Create the RFQ (ME41)

In \`ME41\` you build the RFQ document: the material(s), quantities, the delivery date you need, and a **validity period** (how long the quote must remain valid). You create one RFQ per vendor, often using a common **collective number** so they're grouped for comparison later.

## Step 2: Maintain Quotations (ME47)

As vendors respond, you enter each one's quoted price, discounts, and delivery terms in \`ME47\` against their RFQ. The RFQ effectively *becomes* the quotation once prices are filled in.

## Step 3: Price Comparison (ME49)

This is the star of the show. \`ME49\` (the **price comparison list**) lines up all the quotations for the collective number and ranks them automatically — the **best price shows in green**. It can compare on net price, effective price, and even a "market price" reference, so you're not fooled by a low headline price that hides high freight.

## Step 4: Reject and Award

You flag the losing quotations as **rejected** in \`ME47\`. If **output determination** is configured, SAP can automatically send **rejection letters** to the unsuccessful vendors. You then create the PO from the winning quote.

## A Quiet but Powerful Side Effect

The winning quotation can **update the Purchase Info Record** — so the negotiated price and lead time are stored for next time. Future POs for that material/vendor then pull the price automatically, turning a one-off bid into reusable master data.

## A Real Example

Sneha's CNC machine:
1. \`ME41\` — creates three RFQs (one per shortlisted vendor) under one collective number.
2. \`ME47\` — enters each vendor's quote as it arrives.
3. \`ME49\` — sees Vendor B in green on effective price (lower freight tips the balance).
4. Rejects A and C; SAP issues rejection letters.
5. \`ME21N\` — raises the PO from Vendor B's quote, and the info record updates.

The CFO gets a clean, auditable trail.

## Why It Matters

Most companies *skip* RFQs for everyday items — contracts and info records are faster. But for big-ticket, project, or non-standard buys, the RFQ process gives transparency, competitive pricing, and an audit trail that protects the buyer. Knowing when to use it (and when not to) is a mark of procurement maturity.`,
    keyConceptTitle: "RFQ Drives a Documented, Comparable Bidding Process",
    keyConceptBody: `- An **RFQ** (\`ME41\`) formally asks vendors to quote price and terms for a material, quantity, and delivery date over a validity period.
- Flow: \`ME41\` create → \`ME47\` maintain quotations → \`ME49\` price comparison (best price in green) → reject losers → \`ME21N\` PO from the winner.
- The winning quote can **update the Purchase Info Record**, and rejection letters can be sent automatically via output determination.
- Use RFQs for **capital goods, projects, and non-standard buys**; skip them for standard items covered by contracts/info records.`,
  },
});
const flowchart3_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_10.id },
  update: {},
  create: {
    lessonId: lesson3_10.id,
    title: "The RFQ to Award Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 60 }, data: { label: "📝 Create RFQ (ME41)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 270, y: 60 }, data: { label: "📨 Send to Vendors" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 60 }, data: { label: "💬 Maintain Quotes (ME47)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 470, y: 190 }, data: { label: "📊 Compare Prices (ME49)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 270, y: 190 }, data: { label: "❌ Reject Losers (ME47)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 60, y: 190 }, data: { label: "🛒 Create PO (ME21N)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 60, y: 310 }, data: { label: "🗂️ Update Info Record" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_10.id, nodeId: "node1", title: "Create RFQ", description: "Build the RFQ document with material, quantity, delivery date, and a validity period. Create one per vendor, grouped under a common collective number.", tCode: "ME41", tips: "Use a collective number so ME49 can compare all the quotes together later." },
    { flowchartId: flowchart3_10.id, nodeId: "node2", title: "Send to Vendors", description: "The RFQ is transmitted to each shortlisted vendor (print, email, or EDI via output determination) inviting them to quote.", tCode: "ME9A", tips: "Configure output determination so RFQs and later rejection letters go out automatically." },
    { flowchartId: flowchart3_10.id, nodeId: "node3", title: "Maintain Quotations", description: "Enter each vendor's quoted price, discounts, and delivery terms against their RFQ. The RFQ becomes the quotation once filled in.", tCode: "ME47", tips: "Capture freight and discounts too — the cheapest headline price isn't always the cheapest effective price." },
    { flowchartId: flowchart3_10.id, nodeId: "node4", title: "Compare Prices", description: "The price comparison list ranks all quotations for the collective number automatically, highlighting the best price in green.", tCode: "ME49", tips: "Compare on effective price (incl. freight/discounts), not just net price." },
    { flowchartId: flowchart3_10.id, nodeId: "node5", title: "Reject Losers", description: "Flag the losing quotations as rejected. With output determination, SAP can issue rejection letters to those vendors automatically.", tCode: "ME47", tips: "Recording rejections cleanly is what makes the process auditable for the CFO." },
    { flowchartId: flowchart3_10.id, nodeId: "node6", title: "Create PO", description: "Raise the purchase order from the winning quotation, carrying its price and terms straight into the PO.", tCode: "ME21N", tips: "Referencing the quotation keeps the link between the bid and the final order." },
    { flowchartId: flowchart3_10.id, nodeId: "node7", title: "Update Info Record", description: "The winning quote can update the Purchase Info Record, storing the negotiated price/lead time so future POs price automatically.", tCode: "ME11 / ME12", tips: "Letting the quote update the info record turns a one-off bid into reusable master data." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_10.id },
  update: {},
  create: {
    lessonId: lesson3_10.id,
    title: "RFQ & Quotation Comparison — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction produces the price comparison list that ranks vendor quotations?",
          explanation: "ME49 is the price comparison list. It lines up all quotations for a collective number and ranks them automatically, showing the best price in green.",
          options: {
            create: [
              { text: "ME49", isCorrect: true },
              { text: "ME41", isCorrect: false },
              { text: "ME21N", isCorrect: false },
              { text: "MIGO", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why might the vendor with the lowest net price in ME49 not actually be the best choice?",
          explanation: "ME49 can compare on effective price, which includes freight, discounts, and other conditions. A vendor with a low headline net price but high freight may have a higher effective price than a competitor — so you compare on effective, not just net.",
          options: {
            create: [
              { text: "Because the effective price (incl. freight and discounts) can rank vendors differently from net price", isCorrect: true },
              { text: "Because ME49 always picks the most expensive vendor", isCorrect: false },
              { text: "Because net price is never shown in SAP", isCorrect: false },
              { text: "Because the lowest price vendor is automatically rejected", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Sneha is buying routine packaging material she already has a contract for. Should she run a full RFQ process?",
          explanation: "No. RFQs add value for capital goods, projects, and non-standard buys where competitive, auditable bidding matters. For routine items already covered by a contract or info record, raising a PO directly is faster and the RFQ would be unnecessary overhead.",
          options: {
            create: [
              { text: "No — for routine items covered by a contract/info record, raise the PO directly; reserve RFQs for capital/non-standard buys", isCorrect: true },
              { text: "Yes — every PO must start with an RFQ in SAP", isCorrect: false },
              { text: "Yes — RFQs are mandatory for all standard materials", isCorrect: false },
              { text: "No — but only because RFQs are not supported in SAP", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.11: Source List & Purchase Info Records
const lesson3_11 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-source-list-info-records" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Source List & Purchase Info Records",
    slug: "mm-source-list-info-records",
    order: 11,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Arjun, a buyer, raises a PO for a bearing and notices SAP fills in the price, delivery time, and tax code by itself — he barely types anything. The next day a colleague raises a PO for a regulated chemical, and SAP refuses to let him pick a vendor that isn't pre-approved. Same system, two very different behaviours.

The magic behind the first is the **Purchase Info Record**; the control behind the second is the **Source List**. Together they decide what price SAP knows and which vendors it will even allow.`,
    content: `## Two Pieces of Master Data That Quietly Run Purchasing

Behind smooth, controlled purchasing sit two records: the **Purchase Info Record** (the vendor-material relationship and its pricing) and the **Source List** (the rules for which vendors are allowed). Knowing both is essential, because together they drive automatic pricing and source control.

## Purchase Info Record (PIR)

A **Purchase Info Record** stores the relationship between a *specific vendor* and a *specific material* — including pricing history. When you create a PO for that vendor/material, SAP **auto-populates the price and lead time** from the info record. That's why Arjun barely had to type.

| PIR Detail | Example |
|------------|---------|
| Vendor & Material | Vendor 1001 supplies bearing B-200 |
| Purchasing Org | Which purch org the conditions apply to |
| Price | Net price + condition records |
| Delivery time | Planned delivery days |
| Tolerance & tax code | Over/under-delivery %, tax handling |

T-codes: \`ME11\` (create), \`ME12\` (change), \`ME13\` (display).

Info records come in **types** matching the procurement scenario: **standard**, **subcontracting**, **consignment**, and **pipeline**. The type tells SAP what kind of relationship the price applies to.

## Source List

A **Source List** (\`ME01\`) defines *which vendors are allowed — or mandatory — to supply a material* in a plant. It's the gatekeeper that stopped Arjun's colleague from choosing an unapproved vendor for the chemical.

Each source-list entry can be marked:

- **Fixed source** — this is the single allowed vendor for the period (others are blocked).
- **Blocked source** — this vendor is explicitly excluded.
- **MRP relevant** — MRP can create a purchase requisition (or schedule line) directly to this vendor.

## How They Work Together

- The **info record** answers *"what price and lead time?"* and enables **automatic price determination** on the PO.
- The **source list** answers *"which vendor is allowed?"* and enforces **source control**.

For regulated or audited materials, source lists can be made **mandatory** in customizing, so a PO simply cannot be raised against a vendor that isn't listed.

## A Real Example

Arjun's two scenarios:
- **Bearing** — a standard info record exists, so \`ME21N\` pulls price and delivery automatically; no source list enforced, so any approved vendor works.
- **Regulated chemical** — a source list marks Vendor X as the only fixed source. Picking anyone else is blocked, guaranteeing the company buys only from the qualified supplier.

## Why It Matters

Info records are **mandatory in practice for automatic price determination** — without one, buyers key prices by hand and errors creep in. Source lists are used wherever **vendor selection must be controlled or audited** — regulated industries, quality-critical components, or compliance-sensitive spend. Used together, they make purchasing both fast (auto-pricing) and safe (source control).`,
    keyConceptTitle: "Info Records Price the PO; Source Lists Control the Vendor",
    keyConceptBody: `- A **Purchase Info Record** (\`ME11/ME12/ME13\`) stores the vendor-material relationship — price, lead time, tolerances, tax — and drives **automatic price determination** on POs. Types: standard, subcontracting, consignment, pipeline.
- A **Source List** (\`ME01\`) defines which vendors are allowed/mandatory for a material in a plant, using **fixed**, **blocked**, and **MRP-relevant** flags.
- Info records make purchasing fast (auto-pricing); source lists make it controlled/auditable (only approved vendors). Source lists can be made mandatory in config.`,
  },
});
const flowchart3_11 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_11.id },
  update: {},
  create: {
    lessonId: lesson3_11.id,
    title: "How Info Records & Source Lists Drive a PO",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 40 }, data: { label: "🗂️ Info Record (ME11)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 60, y: 170 }, data: { label: "📋 Source List (ME01)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 320, y: 40 }, data: { label: "💰 Price & Lead Time Auto-filled" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 320, y: 170 }, data: { label: "🔒 Vendor Allowed? (fixed/blocked)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 600, y: 105 }, data: { label: "🛒 Purchase Order (ME21N)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 320, y: 300 }, data: { label: "🧠 MRP creates PR to fixed source" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node3", type: "default" },
      { id: "e2", source: "node2", target: "node4", type: "default" },
      { id: "e3", source: "node3", target: "node5", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node2", target: "node6", type: "default", label: "MRP-relevant" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_11.id, nodeId: "node1", title: "Purchase Info Record", description: "Master data linking a vendor and material — price, planned delivery time, tolerances, and tax code. SAP reads it to price POs automatically.", tCode: "ME11 / ME12 / ME13", tips: "Choose the right info record type (standard/subcontracting/consignment/pipeline) to match the procurement scenario." },
    { flowchartId: flowchart3_11.id, nodeId: "node2", title: "Source List", description: "Defines which vendors may (or must) supply a material in a plant, using fixed, blocked, and MRP-relevant flags.", tCode: "ME01", tips: "Make the source list mandatory in config for regulated or quality-critical materials." },
    { flowchartId: flowchart3_11.id, nodeId: "node3", title: "Price & Lead Time Auto-filled", description: "When the PO is created, SAP pulls the net price and delivery time from the info record, so buyers don't key them manually.", tCode: "ME21N", tips: "If price doesn't auto-fill, the info record is usually missing or for the wrong purchasing org." },
    { flowchartId: flowchart3_11.id, nodeId: "node4", title: "Vendor Allowed?", description: "The source list checks whether the chosen vendor is permitted. A fixed source blocks all others; a blocked entry excludes that vendor.", tCode: "ME01 / ME0M", tips: "A 'vendor not in source list' error means the source list is mandatory and the vendor isn't listed." },
    { flowchartId: flowchart3_11.id, nodeId: "node5", title: "Purchase Order", description: "The PO is created with the auto-determined price (from the info record) for an allowed vendor (per the source list).", tCode: "ME21N", tips: "Together the two records make the PO both fast to raise and compliant." },
    { flowchartId: flowchart3_11.id, nodeId: "node6", title: "MRP to Fixed Source", description: "When a source-list entry is MRP-relevant, MRP can automatically create a purchase requisition (or schedule line) to that vendor.", tCode: "MD04", tips: "Mark exactly one fixed, MRP-relevant source so MRP knows unambiguously who to buy from." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_11.id },
  update: {},
  create: {
    lessonId: lesson3_11.id,
    title: "Source List & Info Records — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does a Purchase Info Record primarily enable when a PO is created?",
          explanation: "The info record stores the vendor-material price and lead time, so SAP auto-populates them on the PO — this is automatic price determination.",
          options: {
            create: [
              { text: "Automatic price and delivery-time determination on the PO", isCorrect: true },
              { text: "Blocking all vendors except one", isCorrect: false },
              { text: "Posting the goods receipt accounting entry", isCorrect: false },
              { text: "Defining the company code hierarchy", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does marking a vendor as a 'fixed source' in the source list do?",
          explanation: "A fixed source designates that vendor as the single allowed supplier for the material in that period; other vendors are effectively blocked, enforcing controlled sourcing.",
          options: {
            create: [
              { text: "Makes that vendor the only allowed supplier for the period; others are blocked", isCorrect: true },
              { text: "Sets the vendor's price to zero", isCorrect: false },
              { text: "Deletes the info record", isCorrect: false },
              { text: "Allows any vendor to supply the material", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "For a regulated chemical, the company must guarantee buyers can only purchase from one qualified vendor. What's the right setup?",
          explanation: "Make the source list mandatory and mark the qualified vendor as the fixed source. SAP will then block any PO raised against a vendor not in the source list, guaranteeing compliant sourcing.",
          options: {
            create: [
              { text: "Make the source list mandatory and mark the qualified vendor as the fixed source", isCorrect: true },
              { text: "Create info records for many vendors and hope buyers pick the right one", isCorrect: false },
              { text: "Delete all other vendor master records", isCorrect: false },
              { text: "Set a very high price for unwanted vendors", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.12: Outline Agreements — Contracts & Scheduling Agreements
const lesson3_12 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-outline-agreements" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Outline Agreements — Contracts & Scheduling Agreements",
    slug: "mm-outline-agreements",
    order: 12,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Priya manages procurement for an auto-parts maker. For steel coils, she's negotiated with a mill: "We'll buy 10,000 tonnes over the year at a locked price." For the gaskets that feed the assembly line, she needs something different — daily deliveries on a fixed schedule, with no time to raise a fresh PO each morning.

These are two flavours of the same idea: a long-term arrangement with a vendor. SAP calls them **outline agreements** — and choosing between a **contract** and a **scheduling agreement** is one of the most practical decisions an MM consultant makes.`,
    content: `## Long-Term Arrangements, Not One-Off POs

An **outline agreement** is a longer-term purchasing arrangement with a vendor — you commit to buy over a period, instead of negotiating each order from scratch. SAP has two kinds: **contracts** and **scheduling agreements**. The difference is *how you call off deliveries against them*.

## Contracts (ME31K)

A **contract** commits to a total quantity or value over a time period; you then issue **release orders** (POs that reference the contract) whenever you actually need material.

| Contract Type | Commitment | Doc Type |
|---------------|-----------|----------|
| Quantity contract | Buy X units in total | \`MK\` |
| Value contract | Spend X amount in total | \`WK\` |

- Create with \`ME31K\`.
- Each time you need material, you raise a **release order** — \`ME21N\` with reference to the contract. The contract's price and terms flow into the PO, and the released quantity counts down against the total.

## Scheduling Agreements (ME31L)

A **scheduling agreement** is a long-term delivery plan with **scheduled delivery lines** — specific dates and quantities built right into the agreement. There's **no separate PO** for each delivery; the schedule lines *are* the call-offs.

- Create with \`ME31L\` (doc type \`LPA\`).
- Line items are **delivery schedule lines** (date + quantity).
- **MRP can create the schedule lines automatically**, which is why scheduling agreements dominate automotive and manufacturing JIT (just-in-time) supply.

## The Key Practical Difference

| | Contract | Scheduling Agreement |
|--|----------|---------------------|
| Commitment | Total quantity or value | Long-term delivery plan |
| Call-off | A **release PO** each time | Pre-planned **schedule lines** |
| Best for | Irregular needs, framework pricing | Regular/JIT deliveries |
| MRP role | Creates release-order PRs | Creates schedule lines directly |

In short: a **contract needs a release PO each time**; a **scheduling agreement already has the delivery lines** — no separate PO needed.

## A Real Example

Priya's two cases:
- **Steel coils** — irregular, large draws → a **quantity contract** (\`ME31K\`, type \`MK\`) for 10,000 tonnes. She raises release orders as production demands, each pulling the locked price.
- **Gaskets** — daily, predictable line feed → a **scheduling agreement** (\`ME31L\`, type \`LPA\`). MRP generates schedule lines automatically, and the vendor delivers to the dates with no daily PO.

## Why It Matters

Outline agreements lock in pricing and reduce transactional overhead — buyers don't renegotiate or re-key every order. Picking the right type matters: use **contracts** when needs are lumpy and you just want framework pricing with release orders; use **scheduling agreements** when deliveries are regular and you want MRP to drive call-offs automatically. Getting this wrong means either drowning in manual POs or losing the flexibility of release-on-demand.`,
    keyConceptTitle: "Contracts Need Release POs; Scheduling Agreements Have Built-in Delivery Lines",
    keyConceptBody: `- An **outline agreement** is a long-term arrangement with a vendor. Two types: **contracts** and **scheduling agreements**.
- A **contract** (\`ME31K\`) commits to a total **quantity** (\`MK\`) or **value** (\`WK\`); you call off with **release orders** (\`ME21N\` referencing the contract).
- A **scheduling agreement** (\`ME31L\`, type \`LPA\`) is a delivery plan with **schedule lines** (date + qty) — **no separate PO**; MRP can create the lines automatically (common in automotive JIT).
- Rule of thumb: contracts = release PO each time; scheduling agreements = pre-planned delivery lines.`,
  },
});
const flowchart3_12 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_12.id },
  update: {},
  create: {
    lessonId: lesson3_12.id,
    title: "Contract vs Scheduling Agreement",
    nodes: [
      { id: "node1", type: "default", position: { x: 280, y: 20 }, data: { label: "🤝 Outline Agreement" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 80, y: 140 }, data: { label: "📄 Contract (ME31K)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 480, y: 140 }, data: { label: "📆 Scheduling Agreement (ME31L)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 80, y: 270 }, data: { label: "🛒 Release Order PO (ME21N)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 480, y: 270 }, data: { label: "📋 Delivery Schedule Lines" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 480, y: 390 }, data: { label: "🧠 MRP auto-creates lines" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 280, y: 400 }, data: { label: "📦 Goods Receipt (MIGO 101)" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default", label: "call-off" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node6", target: "node5", type: "default" },
      { id: "e6", source: "node4", target: "node7", type: "default" },
      { id: "e7", source: "node5", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_12.id, nodeId: "node1", title: "Outline Agreement", description: "A long-term purchasing arrangement with a vendor, replacing repeated one-off negotiations. Splits into contracts and scheduling agreements.", tCode: null, tips: "Decide the type by how you'll call off: irregular release orders vs a fixed delivery schedule." },
    { flowchartId: flowchart3_12.id, nodeId: "node2", title: "Contract", description: "Commits to a total quantity (MK) or value (WK) over a period. The commitment is the ceiling; you draw against it with release orders.", tCode: "ME31K / ME32K", tips: "Use a value contract (WK) for services/varied items, a quantity contract (MK) for a defined material." },
    { flowchartId: flowchart3_12.id, nodeId: "node3", title: "Scheduling Agreement", description: "A delivery plan with schedule lines (dates + quantities). No separate PO is needed — the lines are the call-offs.", tCode: "ME31L / ME38", tips: "Ideal for JIT supply where deliveries are frequent and predictable." },
    { flowchartId: flowchart3_12.id, nodeId: "node4", title: "Release Order PO", description: "A PO created with reference to the contract. It pulls the contract's price/terms and reduces the remaining open quantity or value.", tCode: "ME21N", tips: "Each draw is a release order — that's the extra step a contract requires vs a scheduling agreement." },
    { flowchartId: flowchart3_12.id, nodeId: "node5", title: "Delivery Schedule Lines", description: "Date-and-quantity lines inside the scheduling agreement that tell the vendor exactly when and how much to deliver.", tCode: "ME38", tips: "Schedule lines remove the need for a daily PO — the vendor just delivers to the plan." },
    { flowchartId: flowchart3_12.id, nodeId: "node6", title: "MRP Auto-creates Lines", description: "MRP can generate the schedule lines directly against the scheduling agreement, automating call-offs from demand.", tCode: "MD04", tips: "This automation is why automotive plants live on scheduling agreements." },
    { flowchartId: flowchart3_12.id, nodeId: "node7", title: "Goods Receipt", description: "Either path ends in a goods receipt against the release order or the schedule line, posting stock with movement type 101.", tCode: "MIGO", tips: "GR references the release order (contract) or the schedule line (scheduling agreement)." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_12.id },
  update: {},
  create: {
    lessonId: lesson3_12.id,
    title: "Outline Agreements — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to create a purchasing contract?",
          explanation: "ME31K creates a contract (quantity type MK or value type WK). ME31L creates a scheduling agreement.",
          options: {
            create: [
              { text: "ME31K", isCorrect: true },
              { text: "ME31L", isCorrect: false },
              { text: "MIGO", isCorrect: false },
              { text: "ME01", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the key operational difference between a contract and a scheduling agreement?",
          explanation: "A contract requires a release order (PO referencing the contract) each time you need material. A scheduling agreement has pre-planned delivery schedule lines, so no separate PO is needed for each delivery.",
          options: {
            create: [
              { text: "A contract needs a release PO each time; a scheduling agreement has built-in delivery schedule lines (no separate PO)", isCorrect: true },
              { text: "A scheduling agreement needs a release PO each time; a contract doesn't", isCorrect: false },
              { text: "Contracts can only be used for services", isCorrect: false },
              { text: "There is no difference — they are interchangeable", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Priya needs daily gasket deliveries to feed the assembly line, driven automatically by demand. Which outline agreement fits best?",
          explanation: "A scheduling agreement (ME31L, type LPA) suits regular JIT deliveries: MRP can create the schedule lines automatically, and the vendor delivers to the plan without a daily PO — perfect for assembly-line feed.",
          options: {
            create: [
              { text: "A scheduling agreement, with MRP creating the schedule lines automatically", isCorrect: true },
              { text: "A quantity contract, raising a release PO every morning", isCorrect: false },
              { text: "A value contract with no delivery dates", isCorrect: false },
              { text: "A fresh standalone PO for each day", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.13: Release Strategies (PO/PR Approval Workflows)
const lesson3_13 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-release-strategies" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Release Strategies (PO/PR Approval Workflows)",
    slug: "mm-release-strategies",
    order: 13,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `During a project go-live, the finance controller corners the MM consultant, Rohan, with a hard question: "A junior buyer just created a ₹50 lakh purchase order and it went straight to the vendor. Who approved that?" The honest answer is nobody — there was no approval workflow. Finance is horrified.

Rohan's fix is the **release strategy** — SAP's built-in approval workflow for purchase requisitions and purchase orders. It's the difference between "anyone can spend the company's money" and "the right people sign off at the right thresholds."`,
    content: `## Approval Workflow Built Into Purchasing

A **release strategy** is SAP's approval workflow for **Purchase Requisitions (PRs)** and **Purchase Orders (POs)**. It exists for one reason: **financial control**. A junior buyer shouldn't be able to commit ₹50 lakh alone — the strategy routes the document through the right approvers before it can be processed or sent to the vendor.

## The Building Blocks

Release strategies are built from a handful of configured pieces:

| Element | What It Does |
|---------|--------------|
| Release class & characteristics | The *rules* that decide which strategy applies — based on value, plant, material group, account assignment |
| Release codes | An identifier for each approver (e.g. \`A1\` = supervisor, \`A2\` = manager, \`A3\` = CFO) |
| Release levels | The sequence — \`A1\` must release before \`A2\` can act |
| Release indicator | Controls whether the document can still be changed after a partial release |

**Characteristics** are the inputs SAP evaluates (e.g. "total net value"); the **release class** groups them; together they select the right **release strategy** for a given PR/PO.

## How a Strategy Is Picked

When a PO is saved, SAP reads its characteristics — say, total value ₹50 lakh, plant 1000, account assignment K — and matches them against the configured strategies. The matching strategy defines *which codes must release and in what order*. A ₹5,000 PO might need only one approval; a ₹50 lakh PO might need four.

## Sequential Levels

Release levels are **sequential**: level \`A1\` (team lead) must release before \`A2\` (manager) even sees it, then \`A3\` (finance), then \`A4\` (CPO). Only when *all* required codes have released is the PO "fully released" and allowed to go to the vendor.

## The Release Indicator

The **release indicator** governs changeability. It can:
- block changes once a release has started, or
- reset releases if the value changes after partial approval (so a buyer can't get a small PO approved and then quietly inflate it).

## How to Release

- \`ME28\` — **collective release**: an approver works through all documents awaiting their code.
- \`ME29N\` — **individual release**: release (or cancel release of) a single PO.
- (For PRs: \`ME54N\`/\`ME55\`.)

## A Real Example

Rohan configures value-based thresholds:
- Up to ₹1 lakh → \`A1\` (team lead) only.
- ₹1–10 lakh → \`A1\` then \`A2\` (manager).
- ₹10 lakh–₹1 crore → \`A1\`, \`A2\`, \`A3\` (finance).
- Above ₹1 crore → add \`A4\` (CPO).

Now that ₹50 lakh PO can't reach the vendor until the team lead, manager, and finance have each released it in \`ME29N\`. The release indicator resets approvals if anyone bumps the value.

## Why It Matters

Most clients run **3–4 release levels** keyed to value thresholds: team lead → manager → finance → CPO. Release strategies are pure governance — they enforce segregation of duties and spending limits that auditors insist on. Configuration lives under \`SPRO → MM → Purchasing → Purchase Order → Release Procedure\`. Get it right and finance sleeps at night; get it wrong (or skip it) and large spend escapes control.`,
    keyConceptTitle: "Release Strategies Route PRs/POs Through Value-Based Approvals",
    keyConceptBody: `- A **release strategy** is the approval workflow for PRs and POs, existing for financial control (segregation of duties, spending limits).
- Built from **release class & characteristics** (rules: value, plant, material group, account assignment), **release codes** (per approver), **release levels** (sequential order), and the **release indicator** (changeability after partial release).
- Release via \`ME29N\` (individual) or \`ME28\` (collective); a PO reaches the vendor only when **fully released**.
- Typical setup: 3–4 levels by value (team lead → manager → finance → CPO). Config: SPRO → MM → Purchasing → PO → Release Procedure.`,
  },
});
const flowchart3_13 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_13.id },
  update: {},
  create: {
    lessonId: lesson3_13.id,
    title: "A PO Through a Multi-Level Release Strategy",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 60 }, data: { label: "🛒 PO Created (ME21N)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 270, y: 60 }, data: { label: "🎯 Strategy Picked (characteristics)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 60 }, data: { label: "✅ A1 Team Lead Release" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 500, y: 180 }, data: { label: "✅ A2 Manager Release" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 500, y: 300 }, data: { label: "✅ A3 Finance Release" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 270, y: 300 }, data: { label: "🔓 Fully Released → Vendor" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 270, y: 180 }, data: { label: "🔁 Value changed → resets release" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node7", target: "node3", type: "default", label: "indicator resets" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_13.id, nodeId: "node1", title: "PO Created", description: "A buyer creates the PO. Before it can go to the vendor, the release strategy determines whether (and by whom) it must be approved.", tCode: "ME21N", tips: "A PO subject to release is blocked from output/printing until fully released." },
    { flowchartId: flowchart3_13.id, nodeId: "node2", title: "Strategy Picked", description: "SAP reads the PO's characteristics (value, plant, material group, account assignment) and matches them to a configured release strategy.", tCode: "SPRO (config)", tips: "If no strategy is found, the PO needs no approval — verify characteristic values when a PO unexpectedly skips approval." },
    { flowchartId: flowchart3_13.id, nodeId: "node3", title: "A1 — Team Lead Release", description: "The first release code releases the document. Levels are sequential, so A1 must act before A2 can.", tCode: "ME29N / ME28", tips: "Use ME28 for an approver to clear a whole queue of documents awaiting their code." },
    { flowchartId: flowchart3_13.id, nodeId: "node4", title: "A2 — Manager Release", description: "The next level in sequence. The PO is still not released to the vendor until every required code has signed off.", tCode: "ME29N", tips: "Sequential levels enforce a clear approval chain — no skipping ahead." },
    { flowchartId: flowchart3_13.id, nodeId: "node5", title: "A3 — Finance Release", description: "Higher-value POs add finance (and sometimes a CPO) as later levels, matching the company's spending-authority matrix.", tCode: "ME29N", tips: "Map release codes to your delegation-of-authority policy so config mirrors real sign-off rules." },
    { flowchartId: flowchart3_13.id, nodeId: "node6", title: "Fully Released", description: "Once all required codes have released, the PO is fully released and can be transmitted to the vendor.", tCode: "ME29N", tips: "Only a fully released PO can be printed/sent — this is the control point finance cares about." },
    { flowchartId: flowchart3_13.id, nodeId: "node7", title: "Release Indicator / Reset", description: "The release indicator controls changeability; if the value changes after partial release, approvals can reset so the new amount is re-approved.", tCode: "SPRO (config)", tips: "Reset-on-change stops a buyer getting a small PO approved then inflating it." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_13.id },
  update: {},
  create: {
    lessonId: lesson3_13.id,
    title: "Release Strategies — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the primary purpose of a release strategy in MM?",
          explanation: "Release strategies provide financial control — they route PRs/POs through the right approvers based on value and other rules, enforcing spending limits and segregation of duties.",
          options: {
            create: [
              { text: "Financial control — approval workflow for PRs/POs before they are processed", isCorrect: true },
              { text: "To calculate the net purchase price", isCorrect: false },
              { text: "To post the goods receipt to the G/L", isCorrect: false },
              { text: "To define storage locations", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What determines which release strategy applies to a given PO?",
          explanation: "The release class and its characteristics (such as total value, plant, material group, account assignment) are evaluated against the PO. The matching set of characteristic values selects the strategy and its required release codes/levels.",
          options: {
            create: [
              { text: "The release class characteristics — value, plant, material group, account assignment", isCorrect: true },
              { text: "The vendor's bank account number", isCorrect: false },
              { text: "The storage location of the material", isCorrect: false },
              { text: "The movement type chosen at GR", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A buyer gets a small PO approved at level A1, then edits it up to a much higher value. What should a well-configured release indicator do?",
          explanation: "The release indicator can be set so that a value change after partial release resets the approvals, forcing the higher amount to go back through the required levels. This prevents circumventing controls by inflating an already-approved PO.",
          options: {
            create: [
              { text: "Reset the releases so the higher value must be re-approved through the required levels", isCorrect: true },
              { text: "Keep the original approval and send the inflated PO to the vendor", isCorrect: false },
              { text: "Delete the PO automatically", isCorrect: false },
              { text: "Lower the value back to the approved amount silently", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.14: Item Categories in MM
const lesson3_14 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-item-categories" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Item Categories in MM",
    slug: "mm-item-categories",
    order: 14,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `Deepa, a new MM consultant, is shadowing a senior buyer. She watches him raise three POs in a row that look completely different: one has no quantity at all, just a value limit; another links to a service master and asks for a "service entry sheet"; a third sends components out to a vendor. "They're all POs," she says, confused. "Why do they behave so differently?"

The senior buyer points to one field on each line: the **item category**. That single dropdown reshapes the entire PO — which fields appear, whether there's a goods receipt, and how the invoice works.`,
    content: `## One Field That Reshapes the Whole Line

The **item category** controls *how a purchasing line item is processed* — whether it triggers a goods receipt, whether it needs an invoice, what fields appear, and which downstream steps are required. It's chosen at the **PO line level**, so a single PO can mix categories.

## The Categories You Must Know

| Item Cat | Name | Behaviour |
|----------|------|-----------|
| (blank) | Standard | Normal stock item — triggers GR and IV |
| \`B\` | Blanket PO | No quantity, no GR — only a validity period and a value limit |
| \`D\` | Service | Linked to a service master; requires a **Service Entry Sheet (SES)** before invoice |
| \`K\` | Consignment | Vendor-owned stock at your site; invoice on consumption |
| \`L\` | Subcontracting | Send components to a vendor, receive a finished product |
| \`U\` | Stock Transfer | Move material between plants using an STO |

## Walking Through the Behaviours

**Standard (blank)** is the everyday stock item: you receive goods (GR), then verify the invoice (IV) — the classic three-way match.

**Blanket PO (\`B\`)** has *no quantity* and *no goods receipt*. You set a validity period and a value limit, and invoices are charged directly against the limit. Perfect for low-value, high-frequency sundry purchases where a GR for every item would be wasteful.

**Service (\`D\`)** links to a service master and demands a **Service Entry Sheet** to confirm the work was done before any invoice can be processed — because there's no physical good to receive.

**Consignment (\`K\`)** brings in vendor-owned material; you only owe money when you *consume* it, not when it arrives.

**Subcontracting (\`L\`)** sends your components out and receives a finished product back — the PO line carries the components to be provided.

**Stock Transfer (\`U\`)** moves stock between plants via a Stock Transport Order rather than buying from an external vendor.

## Item Category + Account Assignment

The item category often works hand-in-hand with the **account assignment category** (next lesson). The item category decides *what kind of procurement* it is; the account assignment decides *where the cost goes*. For example, a service item (\`D\`) is frequently combined with account assignment \`K\` (cost centre), so the service expense lands on the right cost centre.

## A Real Example

Deepa's three POs decoded:
- **No quantity, value limit** → item category \`B\` (blanket) for miscellaneous spend.
- **Service master + SES** → item category \`D\` (service) for a maintenance contract.
- **Components sent out** → item category \`L\` (subcontracting) for outsourced assembly.

Same transaction (\`ME21N\`), three behaviours — all driven by one field.

## Why It Matters

The item category is a small dropdown with huge consequences: it decides whether you'll do a goods receipt, whether you need an SES, and how the invoice clears. Choosing the wrong one means the process breaks downstream — a service item without \`D\` won't let you enter an SES, and a blanket need set as standard will demand goods receipts you can't post. Mastering item categories is core MM literacy.`,
    keyConceptTitle: "Item Category Controls How Each PO Line Behaves",
    keyConceptBody: `- The **item category** is set at PO line level and controls whether a line triggers a GR/IV, which fields appear, and what downstream steps are required.
- Key categories: **blank** = standard stock (GR + IV); **B** = blanket (no qty/GR, value limit); **D** = service (needs a Service Entry Sheet); **K** = consignment (invoice on consumption); **L** = subcontracting (send components, get finished goods); **U** = stock transfer (STO).
- The item category (what kind of procurement) works with the **account assignment category** (where the cost goes).`,
  },
});
const flowchart3_14 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_14.id },
  update: {},
  create: {
    lessonId: lesson3_14.id,
    title: "Item Categories and Their Process Paths",
    nodes: [
      { id: "node1", type: "default", position: { x: 280, y: 20 }, data: { label: "🛒 PO Line — choose Item Category" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 20, y: 150 }, data: { label: "⬜ Standard → GR + IV" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 190, y: 150 }, data: { label: "🅱️ Blanket (B) → value limit, no GR" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 380, y: 150 }, data: { label: "🔧 Service (D) → SES" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 550, y: 150 }, data: { label: "📦 Consignment (K) → pay on use" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 150, y: 290 }, data: { label: "🏭 Subcontracting (L) → send components" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 420, y: 290 }, data: { label: "🔁 Stock Transfer (U) → STO" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node1", target: "node4", type: "default" },
      { id: "e4", source: "node1", target: "node5", type: "default" },
      { id: "e5", source: "node1", target: "node6", type: "default" },
      { id: "e6", source: "node1", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_14.id, nodeId: "node1", title: "Choose Item Category", description: "Set on each PO line, the item category decides the entire processing path — GR, IV, SES, components — for that line.", tCode: "ME21N", tips: "A single PO can mix categories line by line; check each line, not just the header." },
    { flowchartId: flowchart3_14.id, nodeId: "node2", title: "Standard (blank)", description: "The normal stock item: goods receipt then invoice verification, the classic three-way match.", tCode: "MIGO / MIRO", tips: "Most stock purchases use the blank standard category." },
    { flowchartId: flowchart3_14.id, nodeId: "node3", title: "Blanket PO (B)", description: "No quantity and no goods receipt — just a validity period and a value limit. Invoices charge directly against the limit.", tCode: "ME21N", tips: "Great for low-value sundry spend where a GR per item is wasteful." },
    { flowchartId: flowchart3_14.id, nodeId: "node4", title: "Service (D)", description: "Linked to a service master; a Service Entry Sheet confirms the work was done before the invoice can be processed.", tCode: "ML81N", tips: "No SES, no invoice — services are confirmed via the SES, not a goods receipt." },
    { flowchartId: flowchart3_14.id, nodeId: "node5", title: "Consignment (K)", description: "Vendor-owned stock at your premises; no liability until you consume it, then settlement creates the invoice.", tCode: "MIGO / MRKO", tips: "Stock arrives without an FI posting — value is recognised only at consumption." },
    { flowchartId: flowchart3_14.id, nodeId: "node6", title: "Subcontracting (L)", description: "You send components to a vendor who manufactures and returns the finished product; the PO line lists the components.", tCode: "ME21N / ME2O", tips: "Pair with a subcontracting info record and (optionally) a BOM to determine components." },
    { flowchartId: flowchart3_14.id, nodeId: "node7", title: "Stock Transfer (U)", description: "Moves material between plants via a Stock Transport Order instead of buying from an external vendor.", tCode: "ME21N (UB)", tips: "Used for intra-/inter-company plant-to-plant movements — see the STO lesson." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_14.id },
  update: {},
  create: {
    lessonId: lesson3_14.id,
    title: "Item Categories in MM — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which item category is used for a blanket PO with only a validity period and value limit, and no goods receipt?",
          explanation: "Item category B (blanket) has no quantity and no GR — invoices are charged directly against a value limit over a validity period. It suits low-value, high-frequency sundry purchases.",
          options: {
            create: [
              { text: "B — Blanket", isCorrect: true },
              { text: "L — Subcontracting", isCorrect: false },
              { text: "K — Consignment", isCorrect: false },
              { text: "(blank) — Standard", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does a service item (category D) require a Service Entry Sheet instead of a goods receipt?",
          explanation: "A service has no physical goods to receive, so confirmation that the work was performed is recorded via a Service Entry Sheet (ML81N). The SES, once approved, is what the invoice is verified against.",
          options: {
            create: [
              { text: "Because there's no physical good to receive — the SES confirms the work was done", isCorrect: true },
              { text: "Because services are free and need no confirmation", isCorrect: false },
              { text: "Because SAP cannot process service invoices", isCorrect: false },
              { text: "Because services always use movement type 101", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A buyer needs to send raw components to a vendor who will assemble and return a finished product. Which item category applies?",
          explanation: "Item category L (subcontracting) is for exactly this: you provide the components, the vendor manufactures, and you receive the finished goods. The PO line carries the components to be supplied.",
          options: {
            create: [
              { text: "L — Subcontracting", isCorrect: true },
              { text: "B — Blanket", isCorrect: false },
              { text: "D — Service", isCorrect: false },
              { text: "U — Stock Transfer", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.15: Account Assignment Categories
const lesson3_15 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-account-assignment-categories" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Account Assignment Categories",
    slug: "mm-account-assignment-categories",
    order: 15,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `The finance controller, Nandini, is reviewing the month's purchases and spots a problem: a batch of new laptops was bought, but the cost hit a generic expense account instead of being capitalised as a fixed asset. "These should be on the balance sheet, not the P&L," she says. "Who decided where this cost goes?"

The answer is a single PO field: the **account assignment category**. It tells SAP *where* the cost of a purchase should be charged — to a cost centre, an asset, a project, an order, or to stock. Pick the wrong one and finance posts to the wrong place.`,
    content: `## Where Does the Cost Go?

Every purchase has to land somewhere in the books. The **account assignment category** is the PO field that tells SAP **where the cost of a purchase should be charged**. It's the difference between "add this to inventory," "expense it to a cost centre," and "capitalise it as an asset."

## The Categories You Must Know

| Category | Charged To | Typical Use |
|----------|-----------|-------------|
| \`K\` | Cost Centre | Indirect materials, office supplies (most common) |
| \`A\` | Asset | Fixed assets, posted to asset under construction |
| \`P\` | Project (WBS) | Cost assigned to a project WBS element |
| \`F\` | Order | Internal order or production order |
| \`C\` | Sales Order | Make-to-order — cost tied to a sales order |
| \`N\` | No assignment | Stock item — goes to inventory |

## Stock vs Cost Object

The crucial mental split:

- **\`N\` (or blank for stock)** → the material is **received into inventory**. There's a goods receipt to stock and the value sits on the balance sheet as inventory until consumed.
- **\`K\`, \`A\`, \`P\`, \`F\`, \`C\`** → the cost hits the **cost object directly**. There's **no goods receipt to valuated stock**; the expense (or asset) is recognised against the cost centre, asset, project, order, or sales order at receipt.

This is why account assignment matters so much: it decides whether you're building inventory or consuming/capitalising immediately.

## How It Pairs With Item Category

Account assignment works alongside the **item category** (previous lesson). The item category says *what kind of procurement* (stock, service, blanket…); the account assignment says *where the cost goes*. A service line (\`D\`) with account assignment \`K\` charges the service to a cost centre; the same service with \`P\` charges it to a project.

## A Real Example

Nandini's review, fixed going forward:
- **Laptops (IT equipment)** → category \`A\` (asset), so they're capitalised to an asset under construction and appear on the balance sheet — not expensed.
- **Office supplies** → category \`K\` (cost centre), expensed to the admin cost centre.
- **Project-specific steel** → category \`P\` (WBS), charged to the project so project costing is accurate.
- **Raw material for the warehouse** → \`N\`/stock, received into inventory.

## Why It Matters

Account assignment is where MM hands the baton to finance and controlling. Choosing \`A\` vs \`K\` changes whether spend is capitalised or expensed — a real financial-statement difference auditors care about. Choosing \`P\` vs \`K\` changes whether project costing is accurate. The MM consultant who understands account assignment can talk fluently to FI and CO colleagues and keep procurement spend landing exactly where the business intends.`,
    keyConceptTitle: "Account Assignment Decides Where the Cost Lands",
    keyConceptBody: `- The **account assignment category** (PO field) tells SAP **where the cost of a purchase is charged**.
- Key categories: **K** = cost centre (most common indirect spend), **A** = asset (capitalised), **P** = project/WBS, **F** = internal/production order, **C** = sales order (make-to-order), **N** = no assignment (stock to inventory).
- With **K/A/P/F/C** there's **no GR to valuated stock** — the cost hits the cost object directly; with stock (**N**) the material goes into inventory.
- It pairs with the **item category**: item category = what kind of procurement; account assignment = where the cost goes.`,
  },
});
const flowchart3_15 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_15.id },
  update: {},
  create: {
    lessonId: lesson3_15.id,
    title: "Account Assignment — Routing the Cost",
    nodes: [
      { id: "node1", type: "default", position: { x: 290, y: 20 }, data: { label: "🛒 PO Line — Account Assignment" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 60, y: 150 }, data: { label: "🏢 K → Cost Centre" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 230, y: 150 }, data: { label: "🏗️ A → Asset" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 130, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 390, y: 150 }, data: { label: "📐 P → Project (WBS)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 570, y: 150 }, data: { label: "🧾 F → Order / C → Sales Order" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 100, y: 290 }, data: { label: "📦 N → Stock (inventory, GR to stock)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 420, y: 290 }, data: { label: "💸 K/A/P/F/C → cost hits object, no stock" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node1", target: "node4", type: "default" },
      { id: "e4", source: "node1", target: "node5", type: "default" },
      { id: "e5", source: "node2", target: "node7", type: "default" },
      { id: "e6", source: "node3", target: "node7", type: "default" },
      { id: "e7", source: "node4", target: "node7", type: "default" },
      { id: "e8", source: "node5", target: "node7", type: "default" },
      { id: "e9", source: "node1", target: "node6", type: "default", label: "stock" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_15.id, nodeId: "node1", title: "Account Assignment", description: "A PO line field that tells SAP where the cost should be charged. It is evaluated together with the item category.", tCode: "ME21N", tips: "If unsure, ask finance: is this stock, an expense, or a capital asset? That answers the category." },
    { flowchartId: flowchart3_15.id, nodeId: "node2", title: "K — Cost Centre", description: "The most common category for indirect materials and supplies. The cost is expensed to a cost centre at receipt.", tCode: "ME21N", tips: "Use K for consumables and office supplies that are used up, not stocked." },
    { flowchartId: flowchart3_15.id, nodeId: "node3", title: "A — Asset", description: "For fixed-asset purchases. The value is capitalised (often to an asset under construction) and appears on the balance sheet.", tCode: "ME21N / AS01", tips: "Laptops, machinery, and equipment usually belong here — capitalised, not expensed." },
    { flowchartId: flowchart3_15.id, nodeId: "node4", title: "P — Project (WBS)", description: "Charges the cost to a project's WBS element, so project costing reflects the spend accurately.", tCode: "ME21N / CJ20N", tips: "Use P for project-specific material so costs roll up to the project, not a generic cost centre." },
    { flowchartId: flowchart3_15.id, nodeId: "node5", title: "F — Order / C — Sales Order", description: "F charges an internal or production order; C ties the cost to a sales order in make-to-order scenarios.", tCode: "ME21N", tips: "C is typical in engineer-to-order/make-to-order where cost must follow the customer's sales order." },
    { flowchartId: flowchart3_15.id, nodeId: "node6", title: "N — Stock", description: "No special account assignment — the material is received into valuated inventory and sits on the balance sheet until consumed.", tCode: "MIGO", tips: "Stock procurement is the only path with a goods receipt to valuated stock." },
    { flowchartId: flowchart3_15.id, nodeId: "node7", title: "Cost Object Directly", description: "For K/A/P/F/C there is no GR to valuated stock — the cost (or asset value) is recognised against the cost object at receipt.", tCode: null, tips: "Remember: account-assigned POs consume/capitalise immediately; only stock POs build inventory." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_15.id },
  update: {},
  create: {
    lessonId: lesson3_15.id,
    title: "Account Assignment Categories — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which account assignment category charges a purchase to a cost centre?",
          explanation: "Category K assigns the cost to a cost centre — the most common choice for indirect materials and office supplies.",
          options: {
            create: [
              { text: "K — Cost Centre", isCorrect: true },
              { text: "A — Asset", isCorrect: false },
              { text: "P — Project", isCorrect: false },
              { text: "N — No assignment", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What happens differently at goods receipt when a category like K, A, or P is used instead of stock procurement?",
          explanation: "With K/A/P/F/C there is no goods receipt to valuated stock; the cost (or asset value) hits the cost object directly. Only stock procurement receives the material into inventory on the balance sheet.",
          options: {
            create: [
              { text: "There is no GR to valuated stock — the cost hits the cost object directly", isCorrect: true },
              { text: "The material is always received into inventory", isCorrect: false },
              { text: "No accounting document is ever created", isCorrect: false },
              { text: "The vendor is paid automatically without an invoice", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "New laptops were expensed to a generic cost account, but finance wants them capitalised on the balance sheet. Which account assignment category should the PO have used?",
          explanation: "Category A (asset) capitalises the purchase — the value posts to an asset (often asset under construction) and appears on the balance sheet, rather than being expensed to the P&L.",
          options: {
            create: [
              { text: "A — Asset, so the laptops are capitalised on the balance sheet", isCorrect: true },
              { text: "K — Cost Centre, to expense them faster", isCorrect: false },
              { text: "N — Stock, so they sit in inventory forever", isCorrect: false },
              { text: "C — Sales Order, to bill a customer", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.16: Stock Transfer Orders (STO)
const lesson3_16 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-stock-transfer-orders" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Stock Transfer Orders (STO)",
    slug: "mm-stock-transfer-orders",
    order: 16,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A retail chain runs a central distribution centre that supplies 200 stores. Vikram, the MM lead, needs stock to flow from the DC to stores cleanly — tracked while in transit, valued correctly, and (for stores in a different legal entity) properly invoiced between companies. A plain goods movement won't cut it; he needs a documented, plannable transfer.

The tool is the **Stock Transport Order (STO)** — a purchase order whose "vendor" is another plant. It turns internal stock movement into a controlled, trackable, sometimes cross-company process.`,
    content: `## Moving Stock Between Plants, Properly

An **STO (Stock Transport Order)** is how SAP moves stock **between plants** — within the same company or across company codes — in a controlled, document-driven way. Instead of a quick transfer posting, you raise a PO-like document so the movement is planned, trackable, and (when needed) billed.

There are two fundamental flavours.

## Intra-company STO (same company code)

The simpler case: source and destination plants belong to the **same company code**.

- Create with \`ME21N\`, document type \`UB\`.
- Movement types: \`301\` for **one-step**, or \`303\`/\`305\` for **two-step**.

## Inter-company STO (across company codes)

Here the transfer **crosses company codes**, so it's effectively a sale between two legal entities. This pulls in **SD**: the delivering plant raises an **intercompany invoice**, and the receiving company's MIRO pays it.

| | Intra-company | Inter-company |
|--|---------------|---------------|
| Company codes | Same | Different |
| SD involved? | Optional | Yes (delivery + billing) |
| Billing | None | Intercompany invoice |
| Doc type | \`UB\` | \`NB\` (often) |

## One-Step vs Two-Step

- **One-step (\`301\`)**: stock leaves the source plant and arrives at the destination in a **single MIGO posting**. Simple, but there's no "in transit" visibility.
- **Two-step**: \`303\` posts the **goods issue** from the source (stock now "in transit"), then \`105\` posts the **goods receipt** at the destination. This allows for **transit time** — useful when the truck takes days to arrive.

## STO With Delivery (SD Involved)

For larger or cross-company flows you use the delivery-based process:

\`\`\`
UB/NB PO → Outbound Delivery (VL10B) → PGI (post goods issue) → GR at receiving plant
\`\`\`

The outbound delivery and **PGI (Post Goods Issue)** are SD steps; the receiving plant then does a goods receipt. This gives full logistics visibility (picking, packing, delivery docs) and, for inter-company, triggers the billing.

## A Real Example

Vikram's retail flows:
- **DC → store, same company** → \`UB\` STO, two-step (\`303\` then \`105\`) so stock-in-transit is visible while the truck is on the road.
- **DC → store in a different legal entity** → inter-company STO with an outbound delivery (\`VL10B\`), PGI, an **intercompany invoice** from the supplying company, and MIRO at the receiving company.

## Why It Matters

STOs are everywhere in **retail** (DC-to-store) and **manufacturing** (plant A makes, plant B uses). They give you planning (the PO can be MRP-driven), in-transit tracking (two-step), correct valuation across plants, and — for inter-company — clean legal-entity billing. A simple transfer posting can't do any of that. Knowing when to reach for one-step vs two-step, and intra- vs inter-company, is a hallmark of a capable MM consultant.`,
    keyConceptTitle: "STOs Move Stock Between Plants as a Controlled, Trackable Document",
    keyConceptBody: `- An **STO** moves stock between plants via a PO-like document. **Intra-company** (same company code): doc type \`UB\`, movement \`301\` (one-step) or \`303\`/\`305\` (two-step).
- **Inter-company** (different company codes) involves **SD**: outbound delivery, PGI, and an **intercompany invoice** the receiving company pays via MIRO.
- **One-step (301)** = issue and receipt in a single posting (no transit visibility); **two-step** = \`303\` goods issue (in transit) then \`105\` goods receipt (allows transit time).
- Delivery-based flow: \`UB/NB PO → VL10B delivery → PGI → GR\`. Heavy use in retail (DC→store) and manufacturing.`,
  },
});
const flowchart3_16 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_16.id },
  update: {},
  create: {
    lessonId: lesson3_16.id,
    title: "Stock Transport Order — Two-Step & Inter-company Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 40 }, data: { label: "📝 STO PO (ME21N, UB/NB)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 40 }, data: { label: "🚚 Outbound Delivery (VL10B)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 540, y: 40 }, data: { label: "📤 PGI / GI 303 (in transit)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 540, y: 170 }, data: { label: "🛣️ Stock In Transit" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 290, y: 170 }, data: { label: "📦 GR 105 at Destination" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 60, y: 170 }, data: { label: "🧾 Intercompany Invoice (if cross-CC)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 60, y: 300 }, data: { label: "💳 Receiving Co. MIRO" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node3", target: "node6", type: "default", label: "inter-company" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_16.id, nodeId: "node1", title: "STO PO", description: "A PO-like document whose supplier is another plant. Doc type UB for intra-company, NB for inter-company. Can be MRP-driven.", tCode: "ME21N", tips: "Choosing UB vs NB sets whether the transfer is within one company code or across legal entities." },
    { flowchartId: flowchart3_16.id, nodeId: "node2", title: "Outbound Delivery", description: "In the delivery-based flow, the supplying plant creates an SD outbound delivery to pick and ship the stock.", tCode: "VL10B", tips: "The delivery brings full logistics (picking/packing) and is required for inter-company billing." },
    { flowchartId: flowchart3_16.id, nodeId: "node3", title: "PGI / Goods Issue", description: "Post Goods Issue (or movement 303) issues stock from the source plant. In two-step, the stock becomes 'in transit'.", tCode: "VL02N / MIGO", tips: "Two-step (303) separates issue from receipt so transit time is visible." },
    { flowchartId: flowchart3_16.id, nodeId: "node4", title: "Stock In Transit", description: "Between issue and receipt, the stock is tracked as in-transit — owned but not yet on the destination shelf.", tCode: "MB5T", tips: "Use MB5T to monitor stock-in-transit; lingering balances mean receipts aren't being posted." },
    { flowchartId: flowchart3_16.id, nodeId: "node5", title: "GR at Destination", description: "The receiving plant posts a goods receipt (movement 105 in two-step), bringing the stock into its inventory.", tCode: "MIGO", tips: "One-step (301) skips the in-transit stage and posts issue + receipt together." },
    { flowchartId: flowchart3_16.id, nodeId: "node6", title: "Intercompany Invoice", description: "For cross-company STOs, the supplying company raises an intercompany invoice to the receiving company.", tCode: "VF01", tips: "This billing step only exists for inter-company transfers — intra-company has no invoice." },
    { flowchartId: flowchart3_16.id, nodeId: "node7", title: "Receiving Co. MIRO", description: "The receiving company verifies and settles the intercompany invoice via invoice verification.", tCode: "MIRO", tips: "Inter-company STO closes the loop like a normal P2P between the two legal entities." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_16.id },
  update: {},
  create: {
    lessonId: lesson3_16.id,
    title: "Stock Transfer Orders — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which document type is typically used for an intra-company stock transport order?",
          explanation: "Doc type UB is used for intra-company STOs (same company code). Inter-company STOs often use NB, since they behave like a purchase from another legal entity.",
          options: {
            create: [
              { text: "UB", isCorrect: true },
              { text: "MK", isCorrect: false },
              { text: "LPA", isCorrect: false },
              { text: "WK", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the advantage of a two-step STO (303 then 105) over a one-step (301) transfer?",
          explanation: "Two-step separates the goods issue (303) from the goods receipt (105), so stock is tracked as 'in transit' between the plants. This allows for transit time and visibility while the material is on the road. One-step posts both at once with no in-transit stage.",
          options: {
            create: [
              { text: "It tracks stock as 'in transit' between issue and receipt, allowing for transit time", isCorrect: true },
              { text: "It skips the goods receipt entirely", isCorrect: false },
              { text: "It avoids creating any material document", isCorrect: false },
              { text: "It is the only way to transfer within one plant", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A distribution centre ships stock to a store that belongs to a different company code. What extra step does this inter-company STO require?",
          explanation: "Because it crosses company codes, the transfer is effectively a sale between legal entities. The supplying company raises an intercompany invoice (via SD billing) and the receiving company settles it with MIRO — a step that intra-company STOs don't need.",
          options: {
            create: [
              { text: "An intercompany invoice from the supplying company, settled by the receiving company's MIRO", isCorrect: true },
              { text: "Nothing extra — it's identical to an intra-company transfer", isCorrect: false },
              { text: "A physical inventory count at both plants", isCorrect: false },
              { text: "Deleting the material master at the source", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.17: Pricing Procedure in Purchasing (Condition Technique for Buying)
const lesson3_17 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-pricing-procedure-purchasing" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Pricing Procedure in Purchasing",
    slug: "mm-pricing-procedure-purchasing",
    order: 17,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A buyer, Imran, swears the info record says ₹100 per unit, but the PO shows a net effective price of ₹112. He's convinced SAP has a bug. His MM consultant, Lakshmi, opens the PO's condition tab and walks him through it: ₹100 gross, minus a 5% vendor discount, plus ₹10 freight, plus a customs duty. The ₹112 isn't a bug — it's the **pricing procedure** doing its job.

In MM, the price on a PO is rarely just one number. A whole calculation schema — the **pricing procedure** — assembles it from conditions. Understanding it is what lets an MM consultant explain (and control) every rupee on a PO.`,
    content: `## MM Has Its Own Condition Technique

Pricing in SAP uses the **condition technique** — and MM has its **own** pricing procedure, separate from SD's sales pricing. The purchasing **pricing procedure** (a standard example is \`RM0000\`) defines *how the net price of a PO is calculated*: which conditions apply, in what order, and how they add up.

## Key Condition Types in Purchasing

| Condition | Meaning |
|-----------|---------|
| \`PB00\` | Gross price (with possible discounts), determined via access sequence |
| \`PBXX\` | Gross price entered manually |
| \`RA01\` | Vendor discount (percentage) |
| \`FRA1\` | Freight (absolute amount) |
| \`ZA00\` | Customs duty (project/client-specific) |
| \`NAVS\` / \`NAVM\` | Non-deductible tax |

\`PB00\` is *automatically* determined (via the access sequence); \`PBXX\` is the manual counterpart you key in when there's no condition record.

## The Access Sequence — Where the Base Price Comes From

A condition type like \`PB00\` uses an **access sequence**: an ordered search for the right price record. For purchasing it typically checks, in order:

1. the **info record** price,
2. then the **contract** price,
3. then the **last PO** price.

The first hit wins. This is why a PO can quietly pick up a price even when the buyer types nothing — SAP found a condition record along the access sequence.

## How the Effective Price Is Built

The procedure layers conditions to reach the net/effective price:

\`\`\`
Effective price = Gross price − Discounts + Freight + Duties + Taxes
\`\`\`

So Imran's PO: ₹100 (gross PB00) − ₹5 (RA01 5% discount) + ₹10 (FRA1 freight) + ₹7 (ZA00 duty) = ₹112. Each line in the condition tab corresponds to a step in the procedure.

## Why the PO Price ≠ Info Record Price

This is the crux: the info record holds the *gross* price, but the pricing procedure applies **all** the other conditions on top. Freight, discounts, duty, and tax can move the final number well away from the headline price — exactly what confused Imran.

## A Real Example

Lakshmi's explanation, in the condition tab:
- \`PB00\` ₹100 — pulled from the info record via the access sequence.
- \`RA01\` −₹5 — a 5% vendor discount.
- \`FRA1\` +₹10 — freight to the plant.
- \`ZA00\` +₹7 — customs duty.
- Net effective price: **₹112**.

No bug — just a transparent build-up the buyer can now read line by line.

## Why It Matters

The purchasing pricing procedure is how MM controls and explains every component of a PO price. It separates negotiated base price from freight, discounts, and taxes, so finance and procurement can analyse cost drivers. When someone challenges a PO price, the answer is always in the condition tab — and the consultant who can read the procedure can resolve the dispute in minutes instead of blaming "the system."`,
    keyConceptTitle: "A Pricing Procedure Assembles the PO Price From Conditions",
    keyConceptBody: `- MM has its **own** purchasing pricing procedure (e.g. \`RM0000\`), separate from SD, built on the **condition technique**.
- Key conditions: \`PB00\` (gross, auto-determined) / \`PBXX\` (manual gross), \`RA01\` (discount %), \`FRA1\` (freight), \`ZA00\` (customs duty), \`NAVS/NAVM\` (non-deductible tax).
- The **access sequence** for purchasing checks **info record → contract → last PO** price; the first match wins.
- **Effective price = gross − discounts + freight + duties + taxes** — which is why the PO price often differs from the info record price.`,
  },
});
const flowchart3_17 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_17.id },
  update: {},
  create: {
    lessonId: lesson3_17.id,
    title: "Building the PO Net Price",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 40 }, data: { label: "🔎 Access Sequence (info→contract→last PO)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 360, y: 40 }, data: { label: "💲 PB00 Gross Price" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 360, y: 160 }, data: { label: "➖ RA01 Discount" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 360, y: 270 }, data: { label: "➕ FRA1 Freight" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 360, y: 380 }, data: { label: "➕ ZA00 Duty + NAVS Tax" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 90, y: 380 }, data: { label: "🧮 Net Effective Price on PO" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_17.id, nodeId: "node1", title: "Access Sequence", description: "An ordered search for the base price record. Purchasing typically checks the info record, then the contract, then the last PO price — first hit wins.", tCode: "M/06 (config)", tips: "If a PO picks up an unexpected price, the access sequence found a condition record earlier in the search." },
    { flowchartId: flowchart3_17.id, nodeId: "node2", title: "PB00 Gross Price", description: "The gross price condition, determined automatically via the access sequence. PBXX is the manual equivalent when no record exists.", tCode: "ME21N (conditions)", tips: "PB00 = automatic; PBXX = you keyed it in manually." },
    { flowchartId: flowchart3_17.id, nodeId: "node3", title: "RA01 Discount", description: "A percentage vendor discount subtracted from the gross price as part of the procedure.", tCode: "ME21N (conditions)", tips: "Discounts reduce the base before freight and taxes are added." },
    { flowchartId: flowchart3_17.id, nodeId: "node4", title: "FRA1 Freight", description: "An absolute freight amount added to bring the goods to the plant. One of several delivery-cost conditions.", tCode: "ME21N (conditions)", tips: "Freight is a real cost driver — compare effective prices including freight when sourcing." },
    { flowchartId: flowchart3_17.id, nodeId: "node5", title: "Duty & Tax", description: "Customs duty (e.g. ZA00) and non-deductible taxes (NAVS/NAVM) are layered on per the procedure.", tCode: "ME21N (conditions)", tips: "Non-deductible taxes increase the inventory/expense value, unlike deductible input tax." },
    { flowchartId: flowchart3_17.id, nodeId: "node6", title: "Net Effective Price", description: "The procedure totals everything: gross − discounts + freight + duties + taxes = the effective price shown on the PO.", tCode: "ME21N", tips: "Read the condition tab line by line to explain any PO price to a sceptical buyer." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_17.id },
  update: {},
  create: {
    lessonId: lesson3_17.id,
    title: "Pricing Procedure in Purchasing — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which condition type represents the automatically-determined gross price in purchasing?",
          explanation: "PB00 is the gross price condition determined automatically via the access sequence. PBXX is its manual counterpart, keyed in when no condition record is found.",
          options: {
            create: [
              { text: "PB00", isCorrect: true },
              { text: "FRA1", isCorrect: false },
              { text: "RA01", isCorrect: false },
              { text: "NAVS", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "In what order does the purchasing access sequence typically search for a base price?",
          explanation: "Purchasing access sequences usually check the info record first, then the contract, then the last PO price. The first condition record found wins, which is why POs can auto-populate prices.",
          options: {
            create: [
              { text: "Info record → contract → last PO price", isCorrect: true },
              { text: "Last PO price → tax code → vendor name", isCorrect: false },
              { text: "Storage location → plant → company code", isCorrect: false },
              { text: "Movement type → valuation class → G/L account", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A buyer insists the PO price (₹112) is wrong because the info record says ₹100. What's the most likely explanation?",
          explanation: "The pricing procedure layers conditions on top of the gross price: a discount, freight, customs duty, and non-deductible tax. The info record holds only the gross price; the effective PO price is gross − discounts + freight + duties + taxes, so ₹112 can be entirely correct.",
          options: {
            create: [
              { text: "The pricing procedure added freight, duty, and tax (and applied a discount) on top of the ₹100 gross price", isCorrect: true },
              { text: "SAP has a calculation bug in the PO", isCorrect: false },
              { text: "The info record price is always ignored", isCorrect: false },
              { text: "The buyer must manually overwrite it to ₹100", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.18: Valuation & Account Determination (OBYC)
const lesson3_18 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-valuation-obyc" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Valuation & Account Determination (OBYC)",
    slug: "mm-valuation-obyc",
    order: 18,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A goods receipt posts, and finance asks the MM consultant, Farah, why the inventory value landed in the wrong G/L account for one material group. Every other material posts correctly; just this one is off. The buyers blame the warehouse, the warehouse blames SAP, and finance blames the consultant.

Farah knows exactly where to look. Every goods movement triggers a finance posting, and the rules that pick the G/L accounts live in one place: **OBYC**. Nine times out of ten, "why did this movement post to the wrong account?" is answered by tracing the OBYC configuration.`,
    content: `## Every Goods Movement Becomes a Finance Posting

In SAP, MM and FI are joined at the hip: **every goods movement triggers an FI posting**. The configuration that decides *which G/L accounts* are hit is **OBYC** — automatic account determination. When inventory value lands in the wrong account, OBYC is where you investigate.

## Transaction / Event Keys

Each movement type links (via its value string) to one or more **transaction/event keys**. The key represents the *kind* of posting, and OBYC maps each key to a G/L account. The ones to know:

| Key | Posting |
|-----|---------|
| \`BSX\` | Inventory posting (the stock account) |
| \`WRX\` | GR/IR clearing account — the bridge between GR and invoice |
| \`GBB\` | Offsetting entry for goods issues (consumption, COGS, scrapping) |
| \`PRD\` | Price differences (when PO price ≠ standard price) |
| \`KON\` | Consignment / pipeline liabilities |

\`WRX\` is the famous **GR/IR clearing** account: the goods receipt credits it (liability for goods received), and the invoice (MIRO) debits it to clear — the heart of the three-way match.

## The Account-Determination Formula

OBYC doesn't just map a key to one account. The full lookup combines several inputs:

\`\`\`
Chart of Accounts + Valuation Area + Valuation Class + Transaction Key → G/L Account
\`\`\`

- **Chart of accounts** — the account framework for the company code.
- **Valuation area** — usually the plant (where stock is valued).
- **Valuation class** — a key on the **material master** that groups materials by accounting treatment (e.g. raw materials vs finished goods).
- **Transaction key** — the kind of posting (BSX, WRX…).

The **valuation class on the material master** is the swing factor: it's how two different materials, with the same movement type, can post to different inventory accounts.

## A Real Example

Farah's investigation:
1. The misposting affects only one material group → suspect the **valuation class**.
2. She checks the material master: those materials carry a valuation class pointing (in OBYC) to the wrong \`BSX\` account.
3. She corrects the OBYC entry for that valuation class + \`BSX\` so inventory posts to the right stock account.
4. New goods receipts now post correctly; finance is happy.

Had the problem been on GR/IR, she'd have traced \`WRX\`; on a consumption issue, \`GBB\`; on a standard-price mismatch, \`PRD\`.

## Why It Matters

OBYC is the silent translator between the warehouse and the general ledger. Get it right and thousands of postings flow correctly with zero manual effort; get one valuation-class/key combination wrong and finance chases mis-stated inventory for weeks. For an MM consultant, "trace it through OBYC" is the standard, confident answer to *any* "why did this post to the wrong account?" question — and that diagnostic skill is exactly what clients pay for.`,
    keyConceptTitle: "OBYC Maps Movement Keys to G/L Accounts",
    keyConceptBody: `- Every goods movement triggers an FI posting; **OBYC** configures which **G/L accounts** are hit via transaction/event keys.
- Key keys: \`BSX\` (inventory), \`WRX\` (GR/IR clearing — bridge between GR and IV), \`GBB\` (offsetting for goods issues/COGS/scrapping), \`PRD\` (price differences), \`KON\` (consignment payables).
- Account-determination formula: **Chart of Accounts + Valuation Area + Valuation Class + Transaction Key → G/L account**.
- The **valuation class on the material master** is why two materials with the same movement type can post to different accounts. Wrong account? → trace OBYC.`,
  },
});
const flowchart3_18 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_18.id },
  update: {},
  create: {
    lessonId: lesson3_18.id,
    title: "How OBYC Finds the G/L Account",
    nodes: [
      { id: "node1", type: "default", position: { x: 280, y: 20 }, data: { label: "📦 Goods Movement (MIGO)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 130 }, data: { label: "🔑 Transaction Key (BSX/WRX/GBB)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 60, y: 250 }, data: { label: "🏷️ Valuation Class (material master)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 290, y: 250 }, data: { label: "🏭 Valuation Area (plant)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 500, y: 250 }, data: { label: "📚 Chart of Accounts" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 250, y: 370 }, data: { label: "⚙️ OBYC Lookup" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 250, y: 480 }, data: { label: "📒 Correct G/L Account" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node6", type: "default" },
      { id: "e3", source: "node3", target: "node6", type: "default" },
      { id: "e4", source: "node4", target: "node6", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_18.id, nodeId: "node1", title: "Goods Movement", description: "Any movement posted in MIGO generates a material document and triggers a matching FI posting that OBYC has to route.", tCode: "MIGO", tips: "Every movement = a finance posting; OBYC decides the accounts automatically." },
    { flowchartId: flowchart3_18.id, nodeId: "node2", title: "Transaction Key", description: "The movement type maps to transaction/event keys (BSX inventory, WRX GR/IR, GBB offsetting, PRD price diff, KON consignment) that name the kind of posting.", tCode: "OMWN / OBYC", tips: "Identify the key first — it tells you which OBYC area to check." },
    { flowchartId: flowchart3_18.id, nodeId: "node3", title: "Valuation Class", description: "A material-master key grouping materials by accounting treatment. It's the main reason two materials post to different inventory accounts.", tCode: "MM02 (Accounting view)", tips: "Wrong account for one material group? Check its valuation class first." },
    { flowchartId: flowchart3_18.id, nodeId: "node4", title: "Valuation Area", description: "The level at which stock is valued — usually the plant. Part of the OBYC lookup key.", tCode: "OX14", tips: "Most clients value at plant level, so the valuation area equals the plant." },
    { flowchartId: flowchart3_18.id, nodeId: "node5", title: "Chart of Accounts", description: "The G/L account framework for the company code, defining the accounts OBYC can post to.", tCode: "OB13", tips: "OBYC entries are maintained per chart of accounts." },
    { flowchartId: flowchart3_18.id, nodeId: "node6", title: "OBYC Lookup", description: "OBYC combines chart of accounts + valuation area + valuation class + transaction key to resolve the exact G/L account.", tCode: "OBYC", tips: "This four-part key is the formula to memorise for account-determination questions." },
    { flowchartId: flowchart3_18.id, nodeId: "node7", title: "Correct G/L Account", description: "The resolved account receives the posting (e.g. inventory debit, GR/IR credit), keeping MM and FI in sync automatically.", tCode: "FB03", tips: "Verify in the FI document that the expected accounts were hit." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_18.id },
  update: {},
  create: {
    lessonId: lesson3_18.id,
    title: "Valuation & Account Determination — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which OBYC transaction key represents the GR/IR clearing account?",
          explanation: "WRX is the GR/IR clearing account — credited at goods receipt and debited at invoice receipt to clear, forming the bridge in the three-way match. BSX is inventory, GBB is offsetting for issues.",
          options: {
            create: [
              { text: "WRX", isCorrect: true },
              { text: "BSX", isCorrect: false },
              { text: "GBB", isCorrect: false },
              { text: "PRD", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which four elements combine in OBYC to determine the G/L account?",
          explanation: "Account determination uses Chart of Accounts + Valuation Area + Valuation Class + Transaction Key. Together they resolve the exact account, which is why the same movement type can post to different accounts for different materials.",
          options: {
            create: [
              { text: "Chart of accounts + valuation area + valuation class + transaction key", isCorrect: true },
              { text: "Company code + vendor + purchasing group + tax code", isCorrect: false },
              { text: "Plant + storage location + movement reason + batch", isCorrect: false },
              { text: "Sales org + distribution channel + division + plant", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Only materials in one material group post their inventory value to the wrong account; all others are fine. Where should you look first?",
          explanation: "When only one group is affected, the differentiator is almost always the valuation class on those materials' master records, and its mapping in OBYC for the BSX (inventory) key. Correcting that valuation-class/BSX entry fixes the misposting.",
          options: {
            create: [
              { text: "The valuation class on those materials and its OBYC entry for BSX", isCorrect: true },
              { text: "The warehouse clerk's login", isCorrect: false },
              { text: "The vendor's bank details", isCorrect: false },
              { text: "The PO output determination", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.19: Physical Inventory
const lesson3_19 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-physical-inventory" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Physical Inventory",
    slug: "mm-physical-inventory",
    order: 19,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `It's year-end, and Suresh, the warehouse manager, has a hard deadline: finance cannot close the books until physical stock is counted and reconciled with SAP. His team walks the aisles with scanners, but he's worried — receipts and issues are still happening while they count, and last year a mismatch threw off the entire closing.

The discipline that keeps this honest is **physical inventory** in SAP — a structured count-and-reconcile process that freezes book stock, records the count, and posts the difference so SAP's numbers match reality.`,
    content: `## Counting Reality vs the Book

**Physical inventory** is the process of *counting actual stock* and *reconciling it with SAP's book stock*. Systems drift from reality — breakage, mis-picks, theft, unrecorded movements — so periodically you must count and correct. Most companies are **legally required** to do a full physical inventory at least once a year.

## The Three-Step Process

| Step | T-code | What Happens |
|------|--------|--------------|
| Create document | \`MI01\` | List the materials to be counted (the count sheet) |
| Enter count | \`MI04\` | Record the quantities actually counted |
| Post difference | \`MI07\` | Adjust book stock to match the count |

**Step 1 — \`MI01\`:** create the **physical inventory document** listing the materials/storage locations to count.

**Step 2 — \`MI04\`:** the counters' results are entered against that document.

**Step 3 — \`MI07\`:** post the **inventory difference**. This adjusts the book quantity to the counted quantity and creates an FI posting via movement types **\`701\`** (gain) / **\`702\`** (loss).

## Freezing the Book Inventory

The danger Suresh worries about: stock keeps moving while you count. To prevent distortion, you can **freeze the book inventory** before counting — the system snapshots the book quantity so parallel receipts and issues don't corrupt the comparison. The count is then judged against the frozen figure, not a moving target.

## Counting Methods

There's more than one way to organise counts:

- **Periodic** — count everything at a point in time (classic year-end stocktake; operations often pause).
- **Continuous** — count different materials throughout the year so the workload is spread.
- **Cycle counting** — count high-value/fast-moving items (A items) more frequently than low-value ones (C items), using ABC classification.

## A Real Example

Suresh's year-end:
1. \`MI01\` — generates count documents per storage location; **book inventory frozen**.
2. Teams count; results entered in \`MI04\`.
3. Differences reviewed; a shelf shows 95 counted vs 100 book.
4. \`MI07\` — posts the −5 difference (movement \`702\`), book stock now reads 95, FI takes the loss.
5. Counts complete → finance can close the books.

## Why It Matters

Physical inventory is where the warehouse and the ledger are forced to agree. During **year-end closing, finance needs the physical inventory complete before the books can close** — an incomplete count blocks the whole company's closing. Freezing book inventory keeps the count honest while operations continue, and choosing the right method (periodic vs cycle counting) balances accuracy against disruption. For an MM consultant, owning this process cleanly is what makes year-end go smoothly instead of becoming a fire drill.`,
    keyConceptTitle: "Count, Compare, and Post the Difference",
    keyConceptBody: `- **Physical inventory** counts actual stock and reconciles it with SAP book stock; a full count is usually legally required annually.
- Three steps: \`MI01\` create the inventory document → \`MI04\` enter counted quantities → \`MI07\` post the difference (movement \`701\` gain / \`702\` loss), which adjusts book stock and posts to FI.
- **Freeze book inventory** before counting so parallel receipts/issues don't distort the comparison.
- Methods: **periodic** (count all at once), **continuous** (spread over the year), **cycle counting** (count A items more often than C items). Year-end closing depends on completed physical inventory.`,
  },
});
const flowchart3_19 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_19.id },
  update: {},
  create: {
    lessonId: lesson3_19.id,
    title: "The Physical Inventory Cycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 60 }, data: { label: "📄 Create PI Doc (MI01)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 60 }, data: { label: "🧊 Freeze Book Inventory" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 520, y: 60 }, data: { label: "🔢 Count & Enter (MI04)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 190 }, data: { label: "⚖️ Compare Count vs Book" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 290, y: 190 }, data: { label: "📝 Post Difference (MI07)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 60, y: 190 }, data: { label: "📒 FI Posting (701/702)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 60, y: 320 }, data: { label: "✅ Book = Reality → Close Books" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_19.id, nodeId: "node1", title: "Create PI Document", description: "Generate the physical inventory document listing the materials and storage locations to be counted — the count sheet.", tCode: "MI01", tips: "Create documents per storage location to keep counting teams organised." },
    { flowchartId: flowchart3_19.id, nodeId: "node2", title: "Freeze Book Inventory", description: "Snapshot the book quantity before counting so parallel receipts/issues don't distort the comparison.", tCode: "MI01 (indicator)", tips: "Freezing keeps the count honest while the warehouse keeps operating." },
    { flowchartId: flowchart3_19.id, nodeId: "node3", title: "Count & Enter", description: "Physical counts are performed and the actual quantities are entered against the inventory document.", tCode: "MI04", tips: "Enter counts promptly — stale count data invites errors at reconciliation." },
    { flowchartId: flowchart3_19.id, nodeId: "node4", title: "Compare Count vs Book", description: "SAP compares the counted quantity with the (frozen) book quantity to reveal differences.", tCode: "MI20", tips: "Review differences before posting — large variances may signal a counting or process error." },
    { flowchartId: flowchart3_19.id, nodeId: "node5", title: "Post Difference", description: "Posting the difference adjusts book stock to the counted quantity, writing the gain or loss.", tCode: "MI07", tips: "Once posted, book stock equals the count — there's no undo without a reversal." },
    { flowchartId: flowchart3_19.id, nodeId: "node6", title: "FI Posting (701/702)", description: "The adjustment posts via movement type 701 (gain) or 702 (loss), hitting an inventory-difference G/L account.", tCode: "MB51", tips: "701/702 carry an accounting impact — finance reviews material inventory differences at close." },
    { flowchartId: flowchart3_19.id, nodeId: "node7", title: "Books Can Close", description: "With book stock reconciled to reality, finance can complete year-end closing confidently.", tCode: null, tips: "Incomplete physical inventory blocks closing — finish counts before the close deadline." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_19.id },
  update: {},
  create: {
    lessonId: lesson3_19.id,
    title: "Physical Inventory — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction posts the inventory difference to adjust book stock to the counted quantity?",
          explanation: "MI07 posts the difference, adjusting book stock to match the count and creating an FI posting via movement type 701 (gain) or 702 (loss). MI01 creates the document and MI04 records the count.",
          options: {
            create: [
              { text: "MI07", isCorrect: true },
              { text: "MI01", isCorrect: false },
              { text: "MI04", isCorrect: false },
              { text: "MIGO", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why do you freeze the book inventory before counting?",
          explanation: "Freezing snapshots the book quantity so that receipts and issues happening in parallel during the count don't distort the comparison. The count is then judged against the frozen figure rather than a moving target.",
          options: {
            create: [
              { text: "So parallel receipts/issues during the count don't distort the count-vs-book comparison", isCorrect: true },
              { text: "To stop the warehouse from ever moving stock again", isCorrect: false },
              { text: "To delete old material documents", isCorrect: false },
              { text: "Because counting is impossible otherwise", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A company wants to count its highest-value, fast-moving items far more often than low-value items, without a full annual shutdown. Which method fits?",
          explanation: "Cycle counting uses ABC classification to count high-value/fast-moving A items frequently and low-value C items rarely, spreading the work and focusing effort where accuracy matters most — without a single big periodic shutdown.",
          options: {
            create: [
              { text: "Cycle counting (count A items more often than C items)", isCorrect: true },
              { text: "Periodic counting only, with a full annual shutdown", isCorrect: false },
              { text: "Never counting, and trusting the book values", isCorrect: false },
              { text: "Scrapping all stock and starting over", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.20: Subcontracting Process
const lesson3_20 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-subcontracting" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Subcontracting Process",
    slug: "mm-subcontracting",
    order: 20,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A garment manufacturer designs and cuts fabric in-house but outsources the stitching to a specialist workshop. Their MM consultant, Anil, has to model this in SAP: the company sends cut fabric and thread to the workshop, the workshop stitches finished shirts, and the company receives the shirts back. The fabric never stops belonging to the company — it's just at the vendor's premises.

This is **subcontracting**, and getting the stock and accounting right depends on a precise sequence of movement types that quietly track components leaving, sitting at the vendor, and being consumed.`,
    content: `## Outsourcing the Work, Keeping the Materials

**Subcontracting** is when you **send components to a vendor, the vendor manufactures, and you receive finished goods back**. The vendor provides labour (and sometimes extra materials); you provide the key components, which remain *your* stock even while physically at the vendor.

## The Process Flow

| Step | T-code | Movement | What Happens |
|------|--------|----------|--------------|
| Create subcontract PO | \`ME21N\` | — | PO with item category **\`L\`**; lists components to provide |
| Provide components | \`MB1B\` | \`541\` | Transfer components to "stock provided to vendor" |
| Receive finished goods | \`MIGO\` | \`101\` (+ auto \`543\`) | GR of the finished product; components consumed automatically |

**Step 1 — Subcontract PO (\`ME21N\`, item cat \`L\`):** the PO is for the *finished* material, and underneath it lists the **components** the vendor needs.

**Step 2 — Provide components (\`MB1B\`, movement \`541\`):** you transfer the components to a special stock category — **stock provided to vendor**. The stock is still yours; it's just flagged as "at the subcontractor."

**Step 3 — Goods receipt (\`MIGO\`, \`101\`):** when finished goods come back, you post a GR with \`101\`. SAP **automatically posts \`543\`** to consume the components from the vendor-provided stock — so the finished good's value absorbs the components plus the subcontracting (service) charge.

## Subcontracting Info Record

A **subcontracting info record** defines which components go to which vendor for which finished material, and the subcontracting price (the vendor's labour charge). It's the master data that makes the PO price right.

## BOM Is Optional but Powerful

You can attach a **Bill of Materials (BOM)** to the finished material. If you do, SAP can **explode the BOM** to determine the required components automatically when you create the PO — no manual component entry. Without a BOM you list components by hand.

## Monitoring Stock at the Vendor

Because your stock is sitting elsewhere, visibility matters. **\`ME2O\`** — the **subcontracting cockpit** — shows what components are at the vendor versus what's been consumed, so you can spot shortfalls before the vendor runs out.

## A Real Example

Anil's garment flow:
1. \`ME21N\` (item cat \`L\`) — PO for "finished shirt"; BOM explodes to fabric + thread.
2. \`MB1B\` \`541\` — sends fabric and thread to the workshop as vendor-provided stock.
3. Workshop stitches; shirts arrive.
4. \`MIGO\` \`101\` — receives shirts; SAP auto-posts \`543\` to consume the fabric and thread.
5. \`ME2O\` — Anil checks no fabric is unaccounted for at the vendor.

## Why It Matters

Subcontracting is **very common in textile, electronics, and pharma**, where companies outsource labour-intensive steps but keep ownership and control of key materials. The movement-type choreography (\`541\` out, \`543\` auto-consumed at \`101\`) is what keeps inventory and costs accurate while the goods are off-site. An MM consultant who can set this up — info record, optional BOM, and the cockpit for monitoring — handles one of the most frequently tested real-world processes.`,
    keyConceptTitle: "Send Components (541), Receive Finished Goods (101 + auto 543)",
    keyConceptBody: `- **Subcontracting**: you send components to a vendor who manufactures, then receive finished goods — the components remain your stock while at the vendor.
- Flow: \`ME21N\` PO with item category **\`L\`** → \`MB1B\` movement **\`541\`** (provide components to vendor) → \`MIGO\` **\`101\`** GR of finished goods, with automatic **\`543\`** consuming the components.
- A **subcontracting info record** sets components and the vendor's labour price; an optional **BOM** lets SAP explode components automatically.
- Monitor stock at the vendor with **\`ME2O\`** (subcontracting cockpit). Common in textile, electronics, pharma.`,
  },
});
const flowchart3_20 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_20.id },
  update: {},
  create: {
    lessonId: lesson3_20.id,
    title: "The Subcontracting Movement Choreography",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 50 }, data: { label: "🛒 Subcontract PO (ME21N, item cat L)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 330, y: 50 }, data: { label: "🧩 BOM explodes components" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 580, y: 50 }, data: { label: "📤 Provide Components (MB1B, 541)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 580, y: 180 }, data: { label: "🏭 Stock Provided to Vendor" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 330, y: 180 }, data: { label: "📦 GR Finished Goods (MIGO 101)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 330, y: 310 }, data: { label: "♻️ Auto 543 — components consumed" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 60, y: 180 }, data: { label: "🔍 Monitor at Vendor (ME2O)" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node4", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_20.id, nodeId: "node1", title: "Subcontract PO", description: "A PO for the finished material using item category L. Underneath, it lists the components you'll supply to the vendor.", tCode: "ME21N", tips: "Item category L is the trigger that turns a PO into a subcontracting order." },
    { flowchartId: flowchart3_20.id, nodeId: "node2", title: "BOM Explosion", description: "If the finished material has a BOM, SAP explodes it to determine the components automatically; otherwise you list them by hand.", tCode: "CS01 / ME21N", tips: "Maintain a BOM to avoid manual component entry and reduce errors." },
    { flowchartId: flowchart3_20.id, nodeId: "node3", title: "Provide Components", description: "Movement 541 transfers components to 'stock provided to vendor'. They remain your inventory, just flagged as at the subcontractor.", tCode: "MB1B", tips: "541 doesn't expense the components — ownership stays with you until consumption." },
    { flowchartId: flowchart3_20.id, nodeId: "node4", title: "Stock Provided to Vendor", description: "A special stock category showing your components physically at the vendor's premises, awaiting use.", tCode: "MMBE", tips: "MMBE shows this as a distinct stock segment — watch it to avoid vendor shortfalls." },
    { flowchartId: flowchart3_20.id, nodeId: "node5", title: "GR Finished Goods", description: "When finished goods return, post a 101 goods receipt. The finished material's value includes the components plus the subcontracting charge.", tCode: "MIGO", tips: "The PO's subcontracting price (from the info record) is the vendor's labour charge added at GR." },
    { flowchartId: flowchart3_20.id, nodeId: "node6", title: "Auto 543 Consumption", description: "At the 101 GR, SAP automatically posts 543 to consume the provided components from vendor stock, keeping inventory accurate.", tCode: "MIGO (auto)", tips: "You don't post 543 manually — it fires automatically with the finished-goods receipt." },
    { flowchartId: flowchart3_20.id, nodeId: "node7", title: "Monitor at Vendor", description: "The subcontracting cockpit shows what's at the vendor versus consumed, so you can replenish components before they run short.", tCode: "ME2O", tips: "Run ME2O regularly — a component shortfall at the vendor stalls finished-goods receipts." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_20.id },
  update: {},
  create: {
    lessonId: lesson3_20.id,
    title: "Subcontracting Process — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which movement type transfers components to the subcontracting vendor as 'stock provided to vendor'?",
          explanation: "Movement 541 (posted via MB1B) moves components to stock provided to vendor. The components remain your inventory while physically at the subcontractor.",
          options: {
            create: [
              { text: "541", isCorrect: true },
              { text: "101", isCorrect: false },
              { text: "701", isCorrect: false },
              { text: "301", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "When you post the 101 goods receipt for the finished product, what happens to the provided components?",
          explanation: "SAP automatically posts movement 543 to consume the components from the vendor-provided stock at the moment of the 101 GR. You don't post it manually — it fires automatically, so the finished good's value absorbs the components.",
          options: {
            create: [
              { text: "SAP automatically posts 543 to consume them from vendor stock", isCorrect: true },
              { text: "They stay at the vendor forever as your stock", isCorrect: false },
              { text: "You must scrap them with 551", isCorrect: false },
              { text: "They are returned to the warehouse with 101", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A garment company wants SAP to determine the fabric and thread needed for each finished shirt PO automatically. What should they set up?",
          explanation: "Maintaining a BOM for the finished material lets SAP explode it to determine the components automatically when the subcontract PO is created — no manual component entry. A subcontracting info record additionally sets the vendor and labour price.",
          options: {
            create: [
              { text: "A BOM for the finished shirt, so SAP explodes the components automatically", isCorrect: true },
              { text: "A physical inventory document for the workshop", isCorrect: false },
              { text: "A release strategy on the components", isCorrect: false },
              { text: "A value contract for thread", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.21: Consignment Process in MM
const lesson3_21 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-consignment" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Consignment Process in MM",
    slug: "mm-consignment",
    order: 21,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `An industrial gases supplier parks cylinders at a factory's site. The factory only pays for the gas it actually uses — the full cylinders sitting in the corner still belong to the vendor. The factory's MM consultant, Reema, has to model this so that stock is visible but unvaluated, and the company is billed only on consumption.

This is **consignment** — vendor-owned goods on your premises that you don't own (or pay for) until you use them. It flips the usual "receive, then owe" logic, and the accounting timing is what trips people up.`,
    content: `## You Hold It, but You Don't Own It Yet

**Consignment** in MM means **the vendor's goods sit at your plant, but you don't own them until you consume them**. The vendor manages stock at your site; you only incur a liability when you withdraw goods for use. It's the opposite of normal procurement, where receiving creates the liability.

## The Four Steps

| Step | T-code | Movement | What Happens |
|------|--------|----------|--------------|
| Consignment PO | \`ME21N\` | — | Item category **\`K\`**; no invoice yet |
| Consignment GR | \`MIGO\` | \`101 K\` | Goods into **consignment stock** (not valuated) |
| Withdrawal | \`MB1A\` | \`201 K\` / \`261 K\` | Consume goods → liability created |
| Settlement | \`MRKO\` | — | SAP auto-creates the invoice for consumed quantity |

**Step 1 — Consignment PO (item cat \`K\`):** orders consignment stock; crucially **no invoice** is expected at this stage.

**Step 2 — Consignment GR (\`101 K\`):** goods are received into **consignment stock** — visible, available, but **not yet valuated** (no FI posting). It's the vendor's value sitting on your shelf.

**Step 3 — Withdrawal (\`201 K\` to a cost centre, or \`261 K\` to a production order):** when you consume the goods, ownership transfers and a **liability to the vendor is created** at the consignment price.

**Step 4 — Settlement (\`MRKO\`):** SAP **automatically creates the invoice** for the consumed quantities. There's no manual MIRO — \`MRKO\` settles consignment liabilities in bulk.

## Stock Visibility and Financial Timing

- **Stock visibility:** \`MMBE\` shows consignment stock **separately, under the vendor number** — so you can see whose stock it is.
- **Financial impact:** **no FI posting at GR**; the posting happens only **at withdrawal**. This is the single most important point: value is recognised on use, not on receipt.

## A Real Example

Reema's gas scenario:
1. \`ME21N\` (item cat \`K\`) — consignment PO for nitrogen.
2. Vendor delivers cylinders; \`MIGO\` \`101 K\` — stock into consignment, **no value posted**.
3. Production draws gas; \`MB1A\` \`261 K\` — consumption creates a liability at the consignment price.
4. Month-end: \`MRKO\` — SAP raises the settlement invoice for exactly what was consumed.

The full cylinders still show as the vendor's stock in \`MMBE\`; the factory pays only for gas used.

## Why It Matters

Consignment is common for **chemicals, gases, and spare parts**, where the vendor manages replenishment and the customer pays on use — improving cash flow and reducing the risk of holding unused stock. The accounting timing (no posting at GR, posting at withdrawal) and the special \`K\` movement variants are exactly what interviewers probe, because consultants who confuse consignment with normal procurement post liabilities at the wrong moment and throw off the vendor's payables.`,
    keyConceptTitle: "Vendor-Owned Stock; Pay Only on Consumption",
    keyConceptBody: `- **Consignment**: the vendor's goods sit at your plant; you own and pay for them only when you **consume** them.
- Four steps: \`ME21N\` PO (item cat **\`K\`**, no invoice) → \`MIGO\` **\`101 K\`** GR into **unvaluated consignment stock** → \`MB1A\` **\`201 K\`/\`261 K\`** withdrawal (creates the liability) → **\`MRKO\`** settlement (auto-creates the invoice).
- **No FI posting at GR**; the financial posting happens at **withdrawal**. \`MMBE\` shows consignment stock separately under the vendor number.
- Common for chemicals, gases, and spare parts — vendor manages replenishment, you pay on use.`,
  },
});
const flowchart3_21 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_21.id },
  update: {},
  create: {
    lessonId: lesson3_21.id,
    title: "The Four Steps of Consignment",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 50 }, data: { label: "🛒 Consignment PO (ME21N, K)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 310, y: 50 }, data: { label: "📦 GR 101 K → Consignment Stock" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 570, y: 50 }, data: { label: "🚫 No FI Posting at GR" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 310, y: 190 }, data: { label: "🔧 Withdrawal 201 K / 261 K" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 570, y: 190 }, data: { label: "💰 Liability Created" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 310, y: 320 }, data: { label: "🧾 Settlement (MRKO)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 60, y: 190 }, data: { label: "👁️ MMBE shows stock under vendor" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node2", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_21.id, nodeId: "node1", title: "Consignment PO", description: "A PO with item category K for consignment stock. No invoice is expected at this stage — that's the defining difference from standard procurement.", tCode: "ME21N", tips: "A consignment info record (type consignment) supplies the consignment price used later at settlement." },
    { flowchartId: flowchart3_21.id, nodeId: "node2", title: "GR 101 K", description: "Goods are received into consignment stock — available to use but not yet valuated on your books.", tCode: "MIGO", tips: "The K variant of 101 routes the stock to the consignment segment, not own stock." },
    { flowchartId: flowchart3_21.id, nodeId: "node3", title: "No FI Posting at GR", description: "Because the stock is still the vendor's, the goods receipt creates no accounting document. This is the key timing point.", tCode: null, tips: "If you see an FI posting at consignment GR, something is misconfigured — there shouldn't be one." },
    { flowchartId: flowchart3_21.id, nodeId: "node4", title: "Withdrawal", description: "Consuming consignment stock (201 K to a cost centre or 261 K to a production order) transfers ownership and triggers the liability.", tCode: "MB1A / MIGO", tips: "The withdrawal movement is when value finally enters your books — at the consignment price." },
    { flowchartId: flowchart3_21.id, nodeId: "node5", title: "Liability Created", description: "At withdrawal, a liability to the vendor is recorded for the consumed quantity at the agreed consignment price.", tCode: null, tips: "Liability tracks consumption precisely — you owe only for what you used." },
    { flowchartId: flowchart3_21.id, nodeId: "node6", title: "Settlement (MRKO)", description: "MRKO automatically settles consignment liabilities, creating the vendor invoice for consumed quantities — no manual MIRO.", tCode: "MRKO", tips: "Run MRKO periodically (often monthly) to settle all consumption at once." },
    { flowchartId: flowchart3_21.id, nodeId: "node7", title: "Stock Under Vendor", description: "MMBE displays consignment stock separately, tagged with the vendor number, so it's clear whose stock is on your shelf.", tCode: "MMBE", tips: "Use MMBE to reconcile what's physically present against what the vendor expects." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_21.id },
  update: {},
  create: {
    lessonId: lesson3_21.id,
    title: "Consignment Process — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction settles consignment liabilities by automatically creating the vendor invoice for consumed quantities?",
          explanation: "MRKO settles consignment — it automatically creates the invoice for consumed quantities. There's no manual MIRO for consignment consumption.",
          options: {
            create: [
              { text: "MRKO", isCorrect: true },
              { text: "MIRO", isCorrect: false },
              { text: "MI07", isCorrect: false },
              { text: "ME2O", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "At what point in the consignment process does the financial (FI) posting occur?",
          explanation: "There is no FI posting at goods receipt because the stock is still the vendor's. The posting happens at withdrawal (consumption), when ownership transfers and a liability is created at the consignment price.",
          options: {
            create: [
              { text: "At withdrawal/consumption, not at goods receipt", isCorrect: true },
              { text: "At goods receipt, immediately", isCorrect: false },
              { text: "When the PO is created", isCorrect: false },
              { text: "Never — consignment is always free", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A gas vendor keeps full cylinders at a factory; the factory wants to pay only for gas actually used. Why is consignment the right model here?",
          explanation: "With consignment, the cylinders remain the vendor's (unvaluated) stock on the factory's site, visible in MMBE under the vendor. A liability — and eventual settlement via MRKO — arises only when gas is withdrawn for use, so the factory pays purely on consumption.",
          options: {
            create: [
              { text: "Stock stays vendor-owned and unvaluated until withdrawn; the factory only incurs a liability on consumption", isCorrect: true },
              { text: "Because the factory must pay for all cylinders on delivery", isCorrect: false },
              { text: "Because consignment stock can never be counted", isCorrect: false },
              { text: "Because it avoids ever creating an invoice", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.22: Service Procurement (MM-SRV)
const lesson3_22 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-service-procurement" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Service Procurement (MM-SRV)",
    slug: "mm-service-procurement",
    order: 22,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A company outsources its facility cleaning and a chunk of its IT support. There's nothing to put on a shelf — no goods arrive — yet the vendors still have to be paid accurately for work performed. The MM consultant, Tarun, can't use a normal goods receipt, because there are no goods. So how does SAP confirm that the cleaning actually happened before the invoice is paid?

The answer is **service procurement (MM-SRV)**, where a **Service Entry Sheet** replaces the goods receipt as proof the work was done.`,
    content: `## Buying Work, Not Goods

**Service procurement** is buying **services** — maintenance, consulting, cleaning, contract labour — instead of physical goods. The whole flow has to handle the fact that **nothing is received into stock**. Confirmation of delivery comes from a **Service Entry Sheet (SES)**, not a goods receipt.

## The Process Flow

| Step | T-code | What Happens |
|------|--------|--------------|
| Service PO | \`ME21N\` | Item category **\`D\`**; lines reference services |
| Vendor performs work | — | The actual service is delivered |
| Service Entry Sheet | \`ML81N\` | Record and **approve** the work performed |
| Invoice verification | \`MIRO\` | Invoice checked against the **approved SES** |

**Step 1 — Service PO (item cat \`D\`):** the PO lines reference services rather than materials, with quantities in service units (hours, square metres, etc.).

**Step 2 — Work is performed:** the vendor does the cleaning, support, or labour.

**Step 3 — Service Entry Sheet (\`ML81N\`):** you create an SES recording exactly what was done, and it must be **approved**. The approved SES is the service-world equivalent of a goods receipt — it's the proof that triggers the liability.

**Step 4 — Invoice Verification (\`MIRO\`):** the invoice is matched against the **approved SES**, not against a GR. No SES, no payable.

## Service Master Record

A **service master record (\`AC03\`)** defines standard services — a description and a unit of measure (e.g. "AC servicing, per unit" or "consulting, per hour"). Using service masters keeps service POs consistent and reportable, much like material masters do for goods.

## Limit Items

Not every service is predictable. **Limit items** are blanket-style service lines with a **value limit** and **no service master** — you just cap the spend and let the vendor bill against it. They're the services counterpart of a blanket PO, ideal for ad-hoc or unpredictable work.

## Approval Workflow

Because there's no physical proof of delivery, control comes from approvals: the **SES typically needs to be approved before the invoice can be processed**. This is the segregation-of-duties safeguard — the person confirming the work isn't necessarily the one paying for it.

## A Real Example

Tarun's outsourced cleaning:
1. \`ME21N\` (item cat \`D\`) — service PO referencing "office cleaning, per month," 12 months.
2. Vendor cleans for the month.
3. \`ML81N\` — Tarun's facilities lead creates and approves an SES for that month's service.
4. \`MIRO\` — the vendor's invoice is verified against the approved SES and paid.

For unpredictable handyman work, Tarun instead uses a **limit item** with a ₹50,000 cap and no service master.

## Why It Matters

Service procurement covers **IT outsourcing, facility management, and contract labour** — a huge and growing slice of corporate spend. The SES is the linchpin: it provides the proof-of-delivery and approval control that a goods receipt gives for physical goods. An MM consultant who understands item category \`D\`, the SES/approval step, service masters, and limit items can set up clean, auditable service spend — and avoid the classic mistake of trying to do a goods receipt for something that was never a good.`,
    keyConceptTitle: "Services Are Confirmed by a Service Entry Sheet, Not a GR",
    keyConceptBody: `- **Service procurement (MM-SRV)** buys services (maintenance, consulting, cleaning, labour) — no goods are received, so a **Service Entry Sheet (SES)** replaces the goods receipt.
- Flow: \`ME21N\` service PO (item category **\`D\`**) → vendor performs work → \`ML81N\` create & **approve** the SES → \`MIRO\` invoice verified against the **approved SES**.
- A **service master (\`AC03\`)** defines standard services with units; **limit items** are blanket service lines with a value limit and no service master.
- The SES usually needs **approval before invoicing** (segregation of duties). Covers IT outsourcing, facility management, contract labour.`,
  },
});
const flowchart3_22 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_22.id },
  update: {},
  create: {
    lessonId: lesson3_22.id,
    title: "Service Procurement — PO to Payment",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 50 }, data: { label: "🛒 Service PO (ME21N, item cat D)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 330, y: 50 }, data: { label: "📇 Service Master (AC03)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 570, y: 50 }, data: { label: "🧹 Vendor Performs Work" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 570, y: 180 }, data: { label: "📝 Service Entry Sheet (ML81N)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 330, y: 180 }, data: { label: "✅ SES Approved" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 90, y: 180 }, data: { label: "💳 Invoice vs SES (MIRO)" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 330, y: 310 }, data: { label: "🅱️ Limit Item (no master, value cap)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node2", target: "node1", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node1", target: "node7", type: "default", label: "ad-hoc" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_22.id, nodeId: "node1", title: "Service PO", description: "A PO whose lines reference services (item category D), with quantities in service units like hours or square metres. No goods will be received.", tCode: "ME21N", tips: "Item category D is what tells SAP this is a service line needing an SES, not a GR." },
    { flowchartId: flowchart3_22.id, nodeId: "node2", title: "Service Master", description: "Master data (AC03) defining standard services with a description and unit of measure, keeping service POs consistent and reportable.", tCode: "AC03", tips: "Use service masters for recurring services; reserve limit items for one-off work." },
    { flowchartId: flowchart3_22.id, nodeId: "node3", title: "Vendor Performs Work", description: "The vendor delivers the service — cleaning, support, consulting — over the agreed period.", tCode: null, tips: "Capture what was actually done; the SES should reflect real performance, not just the PO plan." },
    { flowchartId: flowchart3_22.id, nodeId: "node4", title: "Service Entry Sheet", description: "The SES records the services actually performed against the PO. It is the service-world equivalent of a goods receipt.", tCode: "ML81N", tips: "No SES means no basis for an invoice — the SES is the proof of delivery." },
    { flowchartId: flowchart3_22.id, nodeId: "node5", title: "SES Approved", description: "The SES must be approved before invoicing — the segregation-of-duties control that replaces physical proof of delivery.", tCode: "ML81N", tips: "Approval is the control point auditors check for service spend." },
    { flowchartId: flowchart3_22.id, nodeId: "node6", title: "Invoice vs SES", description: "The vendor's invoice is verified against the approved SES (not a GR) before payment.", tCode: "MIRO", tips: "Match invoice to the approved SES — quantities and value should align." },
    { flowchartId: flowchart3_22.id, nodeId: "node7", title: "Limit Item", description: "A blanket-style service line with a value limit and no service master, for ad-hoc or unpredictable work billed against the cap.", tCode: "ME21N", tips: "Use limit items when you can't predict the exact service in advance — just cap the spend." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_22.id },
  update: {},
  create: {
    lessonId: lesson3_22.id,
    title: "Service Procurement (MM-SRV) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What replaces the goods receipt as proof of delivery in service procurement?",
          explanation: "A Service Entry Sheet (ML81N) records and confirms the work performed. Since no physical goods are received, the approved SES is the proof of delivery that the invoice is verified against.",
          options: {
            create: [
              { text: "The Service Entry Sheet (SES)", isCorrect: true },
              { text: "Movement type 101", isCorrect: false },
              { text: "A physical inventory document", isCorrect: false },
              { text: "A stock transport order", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why must the Service Entry Sheet typically be approved before the invoice can be processed?",
          explanation: "Because there's no physical good to inspect, approval provides the control: it confirms the work was genuinely performed and supports segregation of duties (the approver isn't necessarily the payer) before any money goes out.",
          options: {
            create: [
              { text: "It confirms the work was actually performed and provides segregation-of-duties control before payment", isCorrect: true },
              { text: "Because SAP cannot create invoices without it for any PO", isCorrect: false },
              { text: "Because approval automatically lowers the price", isCorrect: false },
              { text: "Because services are always free until approved", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A company needs ad-hoc handyman work where the exact tasks can't be predicted, but spend must be capped at ₹50,000. What's the best fit?",
          explanation: "A limit item is a blanket-style service line with a value limit and no service master. The vendor bills against the cap for whatever ad-hoc work is done, which suits unpredictable tasks better than fixed service-master lines.",
          options: {
            create: [
              { text: "A limit item with a ₹50,000 value cap and no service master", isCorrect: true },
              { text: "A standard stock PO with movement type 101", isCorrect: false },
              { text: "A consignment PO with item category K", isCorrect: false },
              { text: "A scheduling agreement with daily schedule lines", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.23: MM Integration — FI, SD, PP
const lesson3_23 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-integration-fi-sd-pp" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "MM Integration — FI, SD, PP",
    slug: "mm-integration-fi-sd-pp",
    order: 23,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `In a steering-committee meeting, a client executive challenges the MM consultant, Priyanka: "You keep talking about MM, but a single customer order touches planning, purchasing, the warehouse, finance, and production. How do I know it all hangs together?" It's a fair question — MM never works alone.

Priyanka's answer is to trace one sales order end to end, showing how MM hands off to FI, SD, PP, and QM at each step. Understanding these integration points is what separates a module specialist from a consultant who can speak to the whole business process.`,
    content: `## MM Doesn't Work in Isolation

Every goods movement, every PO, every invoice in MM connects to another module. Mastering MM means knowing its **integration points** — the hand-offs to **FI** (finance), **SD** (sales), **PP** (production), and **QM** (quality).

## MM → FI (the constant companion)

This is the tightest link. **Every MIGO posting creates an accounting document** (OBYC decides the G/L accounts). The classic chain:

- Goods receipt → creates the **GR/IR liability** (credit GR/IR clearing).
- Invoice (\`MIRO\`) → **clears GR/IR** (debit GR/IR, credit vendor).

That GR-creates / IV-clears handshake on the GR/IR account is the **three-way match** in accounting form. MM and FI are effectively inseparable.

## MM → SD (stock transport with billing)

When an **inter-company STO** is used, the delivering plant raises an **outbound delivery (SD)** and issues an **intercompany invoice**; the receiving plant's **\`MIRO\`** pays it. Here MM and SD cooperate to move goods between legal entities with proper billing — MM on the buying side, SD on the selling side.

## MM → PP (planning drives procurement)

When **MRP** runs, it creates **planned orders** (for in-house production) or **Purchase Requisitions** (for external procurement). A buyer converts the PR into a **PO**; the **goods receipt** against that PO feeds **components into production**. So PP's plan literally generates MM's purchasing work, and MM's receipts feed PP's shop floor.

## MM → QM (quality gates the stock)

A goods receipt can **trigger quality inspection** (movement type \`101\` posts into **QI stock**). QM then either **releases** the stock to unrestricted (movement \`321\`) or **rejects** it back to the vendor (return \`122\`). Quality sits between receipt and usable stock.

## The Big Picture: One Order, Five Modules

In a production company, a single sales order can ripple across everything:

\`\`\`
Sales Order → MRP (PP) → PR (MM) → PO (MM) → GR (MM→FI)
→ GI to production (MM→PP→CO) → Invoice (MM→FI→AP)
\`\`\`

| Hand-off | What Flows |
|----------|-----------|
| MM → FI | Every movement posts to the G/L; GR/IR match |
| MM → SD | Inter-company STO delivery + intercompany invoice |
| MM → PP | MRP creates PRs; GR feeds production components |
| MM → QM | GR → QI stock; release (321) or reject (122) |

## A Real Example

Priyanka traces it live: a sales order for finished pumps triggers MRP, which raises PRs for castings. A buyer converts them to POs; goods receipts post to FI (GR/IR) and route through QM inspection. Released stock issues to the production order (feeding CO costing), and the vendor invoice clears GR/IR in MIRO. Five modules, one continuous thread — and MM is the procurement backbone running through it.

## Why It Matters

Integration is where consultants earn their keep. When something breaks — stock stuck in QI, GR/IR not clearing, MRP not creating PRs — the fix usually lies at a *boundary* between modules. A consultant who understands these hand-offs can diagnose cross-module issues, talk credibly to FI/SD/PP/QM colleagues, and design processes that flow cleanly end to end instead of stalling at the seams.`,
    keyConceptTitle: "MM Is the Procurement Backbone Wired to FI, SD, PP, and QM",
    keyConceptBody: `- **MM → FI:** every MIGO posting creates an accounting document (OBYC); GR creates the **GR/IR liability**, \`MIRO\` clears it — the three-way match.
- **MM → SD:** inter-company STOs use an SD **outbound delivery + intercompany invoice**, paid by the receiving plant's \`MIRO\`.
- **MM → PP:** **MRP** creates **planned orders** (in-house) or **PRs** (external); PRs become POs, and GRs feed production components.
- **MM → QM:** GR can post to **QI stock**; QM **releases** (\`321\`) or **rejects** (\`122\`). One sales order can flow: SO → MRP(PP) → PR/PO(MM) → GR(MM→FI) → GI to production(PP/CO) → invoice(FI/AP).`,
  },
});
const flowchart3_23 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_23.id },
  update: {},
  create: {
    lessonId: lesson3_23.id,
    title: "One Sales Order Across Five Modules",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 40 }, data: { label: "🛍️ Sales Order (SD)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 40 }, data: { label: "🧠 MRP → PR (PP)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 40 }, data: { label: "🛒 PO (MM)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 500, y: 170 }, data: { label: "📦 GR → QI Stock (QM)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 280, y: 170 }, data: { label: "✅ Release 321 / Reject 122 (QM)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 60, y: 170 }, data: { label: "📒 GR/IR Posting (FI)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 280, y: 300 }, data: { label: "🏭 GI to Production (PP/CO)" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 60, y: 300 }, data: { label: "💳 Invoice clears GR/IR (MIRO→FI)" }, style: { background: "#B45309", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
      { id: "e7", source: "node6", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_23.id, nodeId: "node1", title: "Sales Order (SD)", description: "A customer order in SD is the trigger. Its demand cascades into planning and procurement across modules.", tCode: "VA01", tips: "The sales order is where the cross-module thread begins in a make-to-order company." },
    { flowchartId: flowchart3_23.id, nodeId: "node2", title: "MRP → PR (PP)", description: "MRP nets demand and creates planned orders for in-house production or purchase requisitions for external materials.", tCode: "MD01 / MD04", tips: "MRP is the PP→MM bridge — PRs are how planning hands work to purchasing." },
    { flowchartId: flowchart3_23.id, nodeId: "node3", title: "PO (MM)", description: "A buyer converts the PR into a purchase order to the vendor — pure MM territory.", tCode: "ME21N / ME59N", tips: "Use ME59N to convert PRs to POs in bulk when MRP generates many." },
    { flowchartId: flowchart3_23.id, nodeId: "node4", title: "GR → QI Stock (QM)", description: "Goods receipt with 101 can route material into quality-inspection stock if QM is active for the material.", tCode: "MIGO / QA32", tips: "QI stock isn't available for use until QM releases it — plan lead time for inspection." },
    { flowchartId: flowchart3_23.id, nodeId: "node5", title: "Release / Reject (QM)", description: "QM moves passing stock to unrestricted with 321, or returns failing stock to the vendor with 122.", tCode: "QA32 / QA11", tips: "A usage decision in QM is what frees stock for production — track it to avoid stalls." },
    { flowchartId: flowchart3_23.id, nodeId: "node6", title: "GR/IR Posting (FI)", description: "The goods receipt creates an FI document: inventory debit, GR/IR clearing credit — the liability for goods received.", tCode: "FB03", tips: "GR/IR is the account that must later be cleared by the invoice — watch it for open items." },
    { flowchartId: flowchart3_23.id, nodeId: "node7", title: "GI to Production (PP/CO)", description: "Components are issued (261) to the production order, feeding the shop floor and posting consumption to CO costing.", tCode: "MIGO / CO27", tips: "Goods issue to production is the MM→PP→CO hand-off where material cost enters the order." },
    { flowchartId: flowchart3_23.id, nodeId: "node8", title: "Invoice Clears GR/IR (FI)", description: "MIRO verifies the vendor invoice and clears the GR/IR account, completing the three-way match and creating the payable.", tCode: "MIRO", tips: "If GR/IR won't clear, compare GR quantity/value against the invoice — that's the three-way match in action." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson3_23.id },
  update: {},
  create: {
    lessonId: lesson3_23.id,
    title: "MM Integration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In the MM → FI integration, what does the invoice posting in MIRO do to the GR/IR clearing account?",
          explanation: "The goods receipt credits GR/IR clearing (creating the liability); MIRO then debits GR/IR to clear it and credits the vendor. This GR-creates / IV-clears handshake is the accounting form of the three-way match.",
          options: {
            create: [
              { text: "It clears (debits) GR/IR, which the goods receipt had credited", isCorrect: true },
              { text: "It creates a new GR/IR liability", isCorrect: false },
              { text: "It posts to the asset account directly", isCorrect: false },
              { text: "It has no effect on GR/IR", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How does MM integrate with PP when MRP is run?",
          explanation: "MRP creates planned orders for in-house production and purchase requisitions for externally procured materials. The PRs are converted to POs by a buyer, and goods receipts against those POs feed components into production — the PP↔MM link.",
          options: {
            create: [
              { text: "MRP creates planned orders or purchase requisitions; PRs become POs and GRs feed production", isCorrect: true },
              { text: "PP directly posts vendor invoices", isCorrect: false },
              { text: "MM and PP never interact", isCorrect: false },
              { text: "MRP only creates sales orders", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Stock from a goods receipt is sitting in quality-inspection stock and production can't use it. Which module and action releases it?",
          explanation: "QM gates the stock. A usage decision in QM releases passing stock to unrestricted use via movement type 321 (or rejects it back to the vendor with 122). Until QM releases it, the QI stock isn't available to production.",
          options: {
            create: [
              { text: "QM releases it to unrestricted stock with movement type 321 (or rejects with 122)", isCorrect: true },
              { text: "FI releases it by posting an invoice", isCorrect: false },
              { text: "SD releases it via a sales order", isCorrect: false },
              { text: "It releases automatically after 24 hours with no action", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 8A COMPLETE: SAP MM Deep Dive — 159 total lessons ────────────────
