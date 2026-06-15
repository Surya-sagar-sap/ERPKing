// ─── FICO: DEEP DIVE LESSONS (Session 8B) ─────────────────────────────────────
// LESSON 2.9: Enterprise Structure in FI/CO
const lesson2_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-enterprise-structure" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Enterprise Structure in FI/CO",
    slug: "fico-enterprise-structure",
    order: 9,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Anand is the lead FICO consultant on a green-field project for a textile group that owns three legal companies — one in India, one in Bangladesh, and one trading arm in Dubai. On day one the CFO asks him a question that sounds simple: "I want one consolidated cost report for the whole group, but each company files its own statutory accounts separately. Can SAP do both at once?"

Anand smiles, because the answer lives entirely in the enterprise structure — the org units that decide where financial statements are drawn and where cost reporting rolls up. Get the company code, controlling area, and operating concern relationships right, and the CFO gets group-wide controlling on top of per-entity legal books. Get them wrong, and the whole project is rebuilt from scratch.`,
    content: `## The Skeleton That Decides Where Numbers Live

Every posting in SAP lands somewhere in a hierarchy of org units. In FI/CO that skeleton determines two separate things: where a *legal* financial statement is produced (FI side) and where *cost and profitability* reporting rolls up (CO side). Knowing the difference is what separates a junior from a senior consultant.

## Company vs Company Code

People mix these up constantly. A **Company** is the legal entity used for consolidation — it groups company codes for group reporting. A **Company Code** is the smallest org unit for which you can draw a *complete, balanced* set of financial statements (balance sheet + P&L). Postings happen at company-code level; statutory accounts are filed at company-code level.

| Unit | Purpose |
|------|---------|
| Company | Legal entity for consolidation (group level) |
| Company Code | Smallest unit with a full balance sheet & P&L |

## The CO Side — Controlling Area & Operating Concern

A **Controlling Area** is the umbrella for all CO activity (cost centers, profit centers, internal orders). Crucially, one controlling area can span *multiple* company codes — this is what enables Anand's cross-company cost reporting. The only rule: all the company codes must share the same operating chart of accounts and fiscal year variant.

The **Operating Concern** sits at the very top of CO-PA (profitability analysis). It defines the dimensions — customer, product, region — along which profitability is reported across the whole group.

## Business Area & Credit Control Area

A **Business Area** is a cross-company-code segment used for segment reporting (e.g. "Apparel" vs "Home Textiles"). It is being phased out in S/4HANA in favour of the **Segment** object tied to profit centers. A **Credit Control Area** governs customer credit limits and is linked to company codes for credit management.

## The Hierarchy

\`\`\`
Client → Company → Company Code → Business Area / Plant   (FI side)
Controlling Area → Cost Center Hierarchy / Operating Concern   (CO side)
\`\`\`

The **Client** is the top of everything. On the FI side numbers roll up through company codes to the company. On the CO side, cost centers roll into the controlling area, and profitability rolls into the operating concern.

## Time Controls — Fiscal Year & Posting Period Variants

Two variants control *when* you can post:

- **Fiscal Year Variant** — defines the financial year. It can be the calendar year (Jan–Dec) or non-calendar (e.g. April–March, common in India). It also defines **special periods** (13–16) used for year-end adjustments and audit entries after period 12 is closed.
- **Posting Period Variant** — controls which periods are currently *open* for posting in each company code. Finance opens and closes periods here to lock prior months.

## Why It Matters

The CFO's request is answered by one design decision: assign all three company codes to **one controlling area**. Each entity still produces its own statutory accounts (company-code level), but cost centers and profitability roll up across all three into a single CO view. This is the classic "group controlling" pattern used wherever a parent wants central cost visibility without merging the legal books. Misjudge it — say, by creating three separate controlling areas — and you can never produce a consolidated cost report without a rebuild.`,
    keyConceptTitle: "Company Code Draws the Legal Books; Controlling Area Spans Them for Cost Reporting",
    keyConceptBody: `- A **Company Code** is the smallest unit with a complete balance sheet & P&L (statutory level); a **Company** groups company codes for legal consolidation.
- A **Controlling Area** is the umbrella for all CO objects and can span **multiple** company codes — this enables cross-company / group cost reporting.
- The **Operating Concern** sits at the top of CO-PA and defines profitability dimensions; **Business Area** (being phased out for Segment) gives cross-company segment reporting.
- **Fiscal Year Variant** defines the year (calendar or April–March) with special periods 13–16; **Posting Period Variant** controls which periods are open for posting.`,
  },
});
const flowchart2_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_9.id },
  update: {},
  create: {
    lessonId: lesson2_9.id,
    title: "The FI/CO Enterprise Structure Hierarchy",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🌐 Client (whole SAP system)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 110 }, data: { label: "🏛️ Company (consolidation)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 90, y: 210 }, data: { label: "🏢 Company Code — India" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 210 }, data: { label: "🏢 Company Code — Bangladesh" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 520, y: 210 }, data: { label: "🏢 Company Code — Dubai" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 320 }, data: { label: "📊 Controlling Area (spans all 3)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 120, y: 420 }, data: { label: "🎯 Cost / Profit Center Hierarchy" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 460, y: 420 }, data: { label: "💹 Operating Concern (CO-PA)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node3", target: "node6", type: "default", label: "assigned to" },
      { id: "e6", source: "node4", target: "node6", type: "default", label: "assigned to" },
      { id: "e7", source: "node5", target: "node6", type: "default", label: "assigned to" },
      { id: "e8", source: "node6", target: "node7", type: "default" },
      { id: "e9", source: "node6", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_9.id, nodeId: "node1", title: "Client", description: "The top of the entire SAP system. All companies, company codes, and configuration live under one client and are isolated from other clients.", tCode: null, tips: "You log into a specific client number — master and transaction data in one client never bleed into another." },
    { flowchartId: flowchart2_9.id, nodeId: "node2", title: "Company", description: "The legal entity used for group consolidation. It groups several company codes so the parent can produce consolidated group financials.", tCode: "OX15", tips: "Company is for consolidation only — you never post directly to it. Postings happen at company-code level." },
    { flowchartId: flowchart2_9.id, nodeId: "node3", title: "Company Code — India", description: "The smallest unit with a complete, balanced balance sheet and P&L. Statutory accounts are filed here. Uses an April–March fiscal year variant.", tCode: "OX02", tips: "If you can't draw a full balance sheet for a unit, it isn't a company code — it's a sub-segment." },
    { flowchartId: flowchart2_9.id, nodeId: "node4", title: "Company Code — Bangladesh", description: "A second legal entity with its own books, currency, and statutory reporting, sitting under the same group company.", tCode: "OX02", tips: "Each company code can have its own local currency and chart of accounts requirements." },
    { flowchartId: flowchart2_9.id, nodeId: "node5", title: "Company Code — Dubai", description: "The trading arm. A separate company code again — but all three will share one controlling area for cost reporting.", tCode: "OX02", tips: "Company codes sharing a controlling area must use the same operating chart of accounts and fiscal year variant." },
    { flowchartId: flowchart2_9.id, nodeId: "node6", title: "Controlling Area", description: "The umbrella for all CO objects. Here it spans all three company codes, enabling a single consolidated cost report across the group.", tCode: "OKKP", tips: "One controlling area covering many company codes is the classic 'group controlling' design — agreed at project start." },
    { flowchartId: flowchart2_9.id, nodeId: "node7", title: "Cost / Profit Center Hierarchy", description: "Cost centers and profit centers roll up through standard hierarchies within the controlling area for management reporting.", tCode: "OKENN", tips: "Because the hierarchy sits in one controlling area, you can report cost centers across all three legal entities together." },
    { flowchartId: flowchart2_9.id, nodeId: "node8", title: "Operating Concern", description: "The top of CO-PA. It defines the characteristics (customer, product, region) and value fields along which group profitability is analysed.", tCode: "KEA0", tips: "One operating concern over the group lets the CFO see margin by product line across all three countries." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_9.id },
  update: {},
  create: {
    lessonId: lesson2_9.id,
    title: "Enterprise Structure in FI/CO — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the smallest organizational unit for which a complete, balanced set of financial statements can be drawn?",
          explanation: "The Company Code is the smallest unit with a full balance sheet and P&L. Statutory accounts are filed at company-code level. A Company (without 'code') is only used to group company codes for consolidation.",
          options: {
            create: [
              { text: "Company Code", isCorrect: true },
              { text: "Controlling Area", isCorrect: false },
              { text: "Business Area", isCorrect: false },
              { text: "Operating Concern", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why can a single Controlling Area cover multiple company codes?",
          explanation: "A controlling area is the umbrella for all CO objects, and it may span several company codes (provided they share the same operating chart of accounts and fiscal year variant). This is what enables group-wide cost and profitability reporting on top of separate legal books.",
          options: {
            create: [
              { text: "Because CO reporting is meant to roll up across legal entities, enabling group-wide cost reporting when company codes share the same chart of accounts and fiscal year variant", isCorrect: true },
              { text: "Because a controlling area must always equal exactly one company code", isCorrect: false },
              { text: "Because company codes have no fiscal year variant of their own", isCorrect: false },
              { text: "Because the operating concern replaces the company code in CO", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Anand's CFO wants separate statutory accounts for three legal entities but ONE consolidated cost report. What is the correct design?",
          explanation: "Keep three company codes (one per legal entity, each with its own statutory books) and assign all three to a single controlling area. Cost centers and profitability then roll up across all three into one CO view, while legal accounts stay separate.",
          options: {
            create: [
              { text: "Three company codes (separate legal books) all assigned to one controlling area", isCorrect: true },
              { text: "One company code with three business areas and three controlling areas", isCorrect: false },
              { text: "Three company codes each with its own separate controlling area", isCorrect: false },
              { text: "One controlling area and one company code for the whole group", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.10: Tax Configuration
const lesson2_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-tax-configuration" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Tax Configuration",
    slug: "fico-tax-configuration",
    order: 10,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Two weeks before go-live, an internal auditor at a pharmaceutical company pulls Priya, the FICO consultant, into a meeting. "Your test vendor invoice posted ₹18,000 of GST to a P&L expense account instead of the input-tax recoverable account," she says. "If that happened in production, we'd lose lakhs of recoverable tax every month — and the GST return would be wrong."

Priya traces it back to a single misconfigured tax code in FTXP. The percentage was right, but the account assignment pointed to the wrong G/L. It's a perfect illustration of why tax configuration is one of the most heavily audited areas in any SAP rollout: a tiny setting controls whether tax is recoverable, where it lands in the books, and whether the statutory return reconciles.`,
    content: `## Two Sides of Every Tax

Tax in SAP always has two directions, and confusing them is a classic beginner error:

| Side | Who pays whom | Treatment |
|------|---------------|-----------|
| **Input Tax** | You pay it to vendors on purchases | Usually *recoverable* — claimed back from the government as a VAT/GST credit |
| **Output Tax** | You charge it to customers on sales | *Payable* — collected on behalf of the government and remitted |

The difference between output tax collected and input tax paid is what you actually owe the tax authority.

## The Tax Procedure — the Framework

Sitting above everything is the **Tax Procedure**, a country-level framework that defines *how* tax is calculated (the condition steps, the sequence, the account keys). Examples are **TAXINN** (condition-based, used in India) and procedures like **TAXEUR** for Europe. You assign one tax procedure per country, and every tax code in that country plugs into it.

## Tax Codes — Where the Real Work Happens

A **tax code** is a two-character key created in \`FTXP\`. Each code carries:

- a **percentage** (e.g. 18% GST, 5% reduced rate, 0% exempt), and
- an **account assignment** — the G/L account the calculated tax posts to.

When Priya posts a vendor invoice in \`FB60\` and selects a tax code, SAP automatically calculates the tax amount and posts it to the linked tax G/L account. The auditor's problem was here: right percentage, wrong G/L.

## Tax Jurisdiction Codes

In countries like the **US**, a single rate isn't enough — tax breaks down by state, county, and city. **Tax jurisdiction codes** capture that breakdown so SAP can split a sale's tax across multiple authorities. They're not used in simple single-rate VAT countries.

## GST in India

India's GST splits one tax into components depending on whether the transaction is intra-state or inter-state:

- **CGST** + **SGST** — for *intra-state* sales (central + state share), and
- **IGST** — for *inter-state* sales.

Each component needs its **own tax code and its own G/L account**, and the company's **GSTIN** (GST registration number) drives reporting. Getting these accounts right is exactly what the auditor was checking.

## Non-Deductible Tax

Not all input tax is recoverable. In some countries (or on certain expense categories like entertainment), part or all of the input tax **cannot** be claimed back. SAP handles this with a **non-deductible** tax code that posts the unrecoverable portion as an *expense* (loaded onto the cost) rather than to the recoverable tax account.

## How Tax Flows in FI

\`\`\`
FB60 invoice → pick tax code → SAP reads tax procedure
   → calculates tax % → posts tax to the G/L in the code's account assignment
\`\`\`

The user never types the tax amount — they only choose the code, and configuration does the rest. That's powerful, and dangerous: one wrong account assignment silently misroutes every invoice using that code.

## Why It Matters

Tax configuration is audited heavily at go-live precisely because it is invisible to end users and automatic. A wrong tax code means the wrong tax account, which means the statutory return won't reconcile and recoverable tax is lost. Priya fixes the account assignment in \`FTXP\`, re-tests with a known invoice, and confirms the input tax now lands in the recoverable G/L. One setting, lakhs of rupees, and a clean audit — that's the weight a tax code carries.`,
    keyConceptTitle: "Tax Codes Drive Both the Rate and the Account — Get Either Wrong and the Return Breaks",
    keyConceptBody: `- Tax has two sides: **Input Tax** (paid to vendors, usually recoverable) and **Output Tax** (charged to customers, payable to the government).
- The **Tax Procedure** (e.g. TAXINN in India) is the country framework; individual **tax codes** are created in \`FTXP\` and carry both a **percentage** and a **G/L account assignment**.
- Posting in \`FB60\` and selecting a tax code makes SAP auto-calculate and post the tax — a wrong account assignment silently misroutes every invoice.
- India's **GST** splits into CGST+SGST (intra-state) and IGST (inter-state), each needing its own code and G/L; **non-deductible** tax posts the unrecoverable portion as expense.`,
  },
});
const flowchart2_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_10.id },
  update: {},
  create: {
    lessonId: lesson2_10.id,
    title: "How Tax Flows From Code to G/L",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🌍 Tax Procedure (TAXINN)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 110 }, data: { label: "🔧 Tax Code in FTXP (% + G/L)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 210 }, data: { label: "🧾 Post Invoice FB60 — pick code" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 310 }, data: { label: "🧮 SAP auto-calculates tax" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 90, y: 420 }, data: { label: "⬅️ Input Tax → recoverable G/L" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 520, y: 420 }, data: { label: "➡️ Output Tax → payable G/L" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 520 }, data: { label: "📑 GST return / VAT report" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default", label: "purchase" },
      { id: "e5", source: "node4", target: "node6", type: "default", label: "sale" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
      { id: "e7", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_10.id, nodeId: "node1", title: "Tax Procedure", description: "The country-level framework defining how tax is calculated — condition steps, sequence, and account keys. India uses the condition-based TAXINN procedure.", tCode: "OBYZ", tips: "One tax procedure is assigned per country; every tax code in that country plugs into it." },
    { flowchartId: flowchart2_10.id, nodeId: "node2", title: "Tax Code (FTXP)", description: "A two-character key carrying a percentage and a G/L account assignment. This is the single most audited tax setting — the account assignment decides where tax lands.", tCode: "FTXP", tips: "Right percentage but wrong account assignment is the classic error — it misroutes every invoice using the code." },
    { flowchartId: flowchart2_10.id, nodeId: "node3", title: "Post Invoice (FB60)", description: "The user posts a vendor invoice and simply selects a tax code. They never type the tax amount — configuration takes over from here.", tCode: "FB60", tips: "Train end users to pick the correct code; the financial consequence is entirely hidden in config." },
    { flowchartId: flowchart2_10.id, nodeId: "node4", title: "Auto-Calculation", description: "SAP reads the tax procedure, applies the code's percentage to the base amount, and determines the tax amount automatically.", tCode: null, tips: "Use the tax calculation simulation in FB60 to preview the amount before posting." },
    { flowchartId: flowchart2_10.id, nodeId: "node5", title: "Input Tax → Recoverable G/L", description: "On purchases, input tax usually posts to a recoverable (asset) G/L and is claimed back from the government as a VAT/GST credit.", tCode: null, tips: "Non-deductible input tax instead posts as expense — use a separate non-deductible tax code for that." },
    { flowchartId: flowchart2_10.id, nodeId: "node6", title: "Output Tax → Payable G/L", description: "On sales, output tax posts to a payable (liability) G/L — money collected on behalf of the government that must be remitted.", tCode: null, tips: "Output minus input tax is your net liability to the tax authority for the period." },
    { flowchartId: flowchart2_10.id, nodeId: "node7", title: "GST / VAT Return", description: "The statutory return draws on these tax G/L balances. If the codes posted to the wrong accounts, the return won't reconcile.", tCode: null, tips: "Reconcile tax G/L balances to the return every period — mismatches signal a config error." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_10.id },
  update: {},
  create: {
    lessonId: lesson2_10.id,
    title: "Tax Configuration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In which transaction are tax codes created, each carrying a percentage and a G/L account assignment?",
          explanation: "Tax codes are created in FTXP. Each two-character code holds the tax percentage and the G/L account assignment that determines where the calculated tax posts.",
          options: {
            create: [
              { text: "FTXP", isCorrect: true },
              { text: "FB60", isCorrect: false },
              { text: "FS00", isCorrect: false },
              { text: "OB52", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the difference between input tax and output tax?",
          explanation: "Input tax is paid to vendors on purchases and is usually recoverable (claimed back as a VAT/GST credit). Output tax is charged to customers on sales and is payable — collected on behalf of the government and remitted.",
          options: {
            create: [
              { text: "Input tax is paid to vendors on purchases (usually recoverable); output tax is charged to customers on sales (payable to the government)", isCorrect: true },
              { text: "Input tax is charged on sales; output tax is paid on purchases", isCorrect: false },
              { text: "They are the same tax viewed from two procedures", isCorrect: false },
              { text: "Input tax is always non-deductible; output tax is always recoverable", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "An auditor finds that input GST on a vendor invoice posted to a P&L expense account instead of the recoverable tax account. What is the most likely cause?",
          explanation: "The tax code's account assignment in FTXP points to the wrong G/L. The percentage can be correct while the account assignment misroutes the tax — causing recoverable tax to be lost and the return to not reconcile.",
          options: {
            create: [
              { text: "The tax code's G/L account assignment in FTXP is wrong, even though the percentage may be correct", isCorrect: true },
              { text: "The user typed the wrong tax amount manually in FB60", isCorrect: false },
              { text: "GST cannot be recovered in SAP, so it must go to expense", isCorrect: false },
              { text: "The company code has no fiscal year variant", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.11: House Banks & Bank Accounting
const lesson2_11 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-house-banks-bank-accounting" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "House Banks & Bank Accounting",
    slug: "fico-house-banks-bank-accounting",
    order: 11,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Rohan, a junior FICO consultant, sits with the finance team of a retail chain that receives thousands of card settlements and supplier payments through its HDFC and SBI accounts every single day. The treasury manager is exhausted: every morning two people spend three hours manually matching the bank's statement to SAP, line by line.

"Why are we doing this by hand?" Rohan asks. The answer is that the house banks were configured, but the Electronic Bank Statement was never switched on. Once Rohan sets up the EBS to import the bank's daily MT940 file, SAP starts auto-reconciling — and those six person-hours a day collapse to a few minutes of reviewing exceptions. This lesson is about that machinery: house banks, bank accounts, and how statements turn into postings.`,
    content: `## What a House Bank Actually Is

A **House Bank** is *your* company's own bank — HDFC, SBI, Citibank — set up in SAP via \`FI12\`. It's the SAP representation of a banking relationship through which you make and receive payments. A company typically has several house banks.

## The Building Blocks

Bank accounting stacks four objects together:

| Object | Meaning |
|--------|---------|
| **House Bank** | Your bank relationship (FI12) |
| **Bank Key** | The bank's routing identifier — IFSC in India, routing number in the US |
| **Bank Account** | A specific account under the house bank (current, savings) |
| **G/L Account** | Every bank transaction posts to this linked G/L |

The chain matters: a house bank has a bank key; under it sit one or more bank accounts; each bank account is linked to a **G/L account** so that every movement of money hits the books.

## Reconciliation — the Daily Pain Point

The whole point of bank accounting is **bank reconciliation**: comparing the balance SAP shows in the bank G/L against what the bank's statement says. The two rarely match instantly, because of:

- **Outstanding checks** — you posted a payment, but the recipient hasn't cashed it yet.
- **Timing differences** — a deposit recorded in SAP that the bank books a day later.

Reconciliation finds and explains every one of these differences.

## Electronic Bank Statement (EBS) — the Automation

This is what Rohan switched on. The bank sends a structured statement file — **MT940** (SWIFT format) or **CAMT.053** (the newer ISO 20022 XML). SAP imports it (\`FF_5\` to upload, \`FEBP\` to post) and **auto-reconciles**: it matches each statement line to open items using rules you configure, then posts the clearing automatically.

\`\`\`
Bank sends MT940 / CAMT.053
   → FF_5 import → FEBP post
   → SAP matches lines to open items
   → auto-clears matched, lists unmatched as exceptions
\`\`\`

Most large companies receive a **daily EBS file** and let SAP do 90%+ of the matching, leaving humans to review only the exceptions.

## Manual Bank Statement (FF67)

When there's no electronic feed — a small bank, or a one-off account — you fall back to \`FF67\`, where a user types the bank transactions in manually to drive the same reconciliation logic. It's the same destination by a slower road.

## Where Configuration Lives

You define the house bank and accounts in \`FI12\`, link each account to its G/L, then configure the EBS interpretation rules (which statement codes mean "incoming payment", "bank charge", "outgoing transfer") so SAP knows how to post each line.

## Why It Matters

Bank accounting is where SAP touches *real cash*, so accuracy is non-negotiable — a mis-mapped bank G/L means the cash position the CFO sees is wrong. And it's where automation pays off hugely: Rohan's EBS setup didn't just save six hours a day, it removed human keying errors and gave treasury a near-real-time cash position every morning. The configuration is fiddly, but the payoff — accurate cash and automated reconciliation — is one of the most visible wins a FICO consultant can deliver.`,
    keyConceptTitle: "House Banks Link Your Bank to a G/L; EBS Auto-Reconciles the Daily Statement",
    keyConceptBody: `- A **House Bank** (set up in \`FI12\`) is your company's own bank; under it sit **bank accounts**, each identified by a **bank key** (IFSC/routing) and linked to a **G/L account**.
- **Bank reconciliation** compares the SAP bank G/L balance to the bank statement; differences are outstanding checks and timing differences.
- The **Electronic Bank Statement (EBS)** imports an **MT940 / CAMT.053** file (\`FF_5\` then \`FEBP\`) and auto-matches statement lines to open items, posting clearings automatically.
- **\`FF67\`** is the manual fallback when there's no electronic feed — same reconciliation, entered by hand.`,
  },
});
const flowchart2_11 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_11.id },
  update: {},
  create: {
    lessonId: lesson2_11.id,
    title: "From Bank Statement to Auto-Reconciliation",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🏦 House Bank (FI12)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 110 }, data: { label: "💳 Bank Account → linked G/L" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 210 }, data: { label: "📨 Bank sends MT940 / CAMT.053" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 310 }, data: { label: "⬆️ Import FF_5 → Post FEBP" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 410 }, data: { label: "🔗 SAP matches lines to open items" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 90, y: 510 }, data: { label: "✅ Auto-cleared (matched)" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 520, y: 510 }, data: { label: "⚠️ Exceptions → manual review" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 300, y: 610 }, data: { label: "📊 Bank reconciliation complete" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default", label: "matched" },
      { id: "e6", source: "node5", target: "node7", type: "default", label: "unmatched" },
      { id: "e7", source: "node6", target: "node8", type: "default" },
      { id: "e8", source: "node7", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_11.id, nodeId: "node1", title: "House Bank (FI12)", description: "Your company's own bank relationship set up in SAP. A company usually has several house banks (e.g. HDFC, SBI) for different purposes.", tCode: "FI12", tips: "In S/4HANA, house banks and accounts are increasingly managed via the Bank Account Management (BAM) app, but FI12 remains the classic config." },
    { flowchartId: flowchart2_11.id, nodeId: "node2", title: "Bank Account → G/L", description: "A specific account (current/savings) under the house bank, identified by a bank key (IFSC/routing) and linked to a G/L account so every movement hits the books.", tCode: "FI12", tips: "The linked G/L is the bank's mirror in SAP — its balance is what you reconcile against the statement." },
    { flowchartId: flowchart2_11.id, nodeId: "node3", title: "Bank Statement File", description: "The bank transmits a structured statement — MT940 (SWIFT) or CAMT.053 (ISO 20022 XML) — usually daily, listing every credit and debit on the account.", tCode: null, tips: "CAMT.053 is the modern XML standard; many banks are migrating to it from MT940." },
    { flowchartId: flowchart2_11.id, nodeId: "node4", title: "Import & Post (FF_5 / FEBP)", description: "FF_5 uploads the statement file into SAP; FEBP posts it. Together they bring the bank's view into the system for matching.", tCode: "FF_5 / FEBP", tips: "Schedule these as a daily background job so the statement is processed automatically each morning." },
    { flowchartId: flowchart2_11.id, nodeId: "node5", title: "Match to Open Items", description: "SAP applies interpretation rules to match each statement line against open items (invoices, payments) and identify what each line represents.", tCode: null, tips: "The quality of your posting rules determines the auto-match rate — invest time tuning them at go-live." },
    { flowchartId: flowchart2_11.id, nodeId: "node6", title: "Auto-Cleared Items", description: "Matched lines are cleared automatically — open items become paid items with no human keystrokes.", tCode: null, tips: "A well-tuned EBS auto-clears 90%+ of lines, collapsing hours of manual work to minutes." },
    { flowchartId: flowchart2_11.id, nodeId: "node7", title: "Exceptions", description: "Lines SAP couldn't confidently match are flagged for a human to review and post manually — outstanding checks, unexpected charges, partial payments.", tCode: "FEBAN", tips: "Use the post-processing workbench (FEBAN) to clear exceptions efficiently." },
    { flowchartId: flowchart2_11.id, nodeId: "node8", title: "Reconciliation Complete", description: "Once matched and exceptions resolved, the SAP bank G/L balance ties to the statement, giving treasury an accurate daily cash position.", tCode: null, tips: "Remaining differences should only be genuine timing items like uncashed checks." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_11.id },
  update: {},
  create: {
    lessonId: lesson2_11.id,
    title: "House Banks & Bank Accounting — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to configure a house bank in SAP?",
          explanation: "FI12 is used to set up house banks and their bank accounts. Each bank account is then linked to a G/L account so that bank transactions post to the books.",
          options: {
            create: [
              { text: "FI12", isCorrect: true },
              { text: "FF67", isCorrect: false },
              { text: "FB60", isCorrect: false },
              { text: "FTXP", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does the Electronic Bank Statement (EBS) actually do once the bank file is imported?",
          explanation: "EBS imports a structured statement file (MT940/CAMT.053) and auto-matches each statement line to open items, posting the clearings automatically. Unmatched lines are listed as exceptions for manual review.",
          options: {
            create: [
              { text: "It auto-matches statement lines to open items and posts clearings automatically, flagging only unmatched lines as exceptions", isCorrect: true },
              { text: "It prints the bank statement for manual filing only", isCorrect: false },
              { text: "It deletes all open items in the bank G/L", isCorrect: false },
              { text: "It creates the house bank master record", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Rohan's treasury team spends three hours every morning manually matching the bank statement to SAP. The bank already sends a daily MT940 file. What should he implement?",
          explanation: "Setting up the Electronic Bank Statement to import the daily MT940 file (FF_5 to import, FEBP to post) lets SAP auto-reconcile most lines, leaving only exceptions for humans — collapsing hours of manual matching into minutes.",
          options: {
            create: [
              { text: "Configure the Electronic Bank Statement to import the daily MT940 and auto-reconcile, reviewing only exceptions", isCorrect: true },
              { text: "Hire a third person to also match the statement by hand", isCorrect: false },
              { text: "Switch all reconciliation to manual entry via FF67", isCorrect: false },
              { text: "Stop reconciling the bank account entirely", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.12: Automatic Payment Run (F110)
const lesson2_12 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-automatic-payment-run-f110" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Automatic Payment Run (F110)",
    slug: "fico-automatic-payment-run-f110",
    order: 12,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `It's payment day at a manufacturing company, and Kavya, the accounts payable manager, has 480 vendor invoices due. In the old company she worked at, this meant cutting cheques one by one for two days. Here, she runs a single transaction — \`F110\` — sets the parameters, reviews what SAP proposes to pay, removes three disputed invoices, and clicks run. Within minutes, 477 payments are created, clearing documents posted, and a bank transfer file generated for the bank.

But Kavya is careful, because she's seen what happens when someone skips the proposal review: a wrong parameter once paid a blocked vendor lakhs of rupees. F110 is powerful precisely because it's automatic — which is exactly why the review step exists. This lesson walks through that machinery end to end.`,
    content: `## Why F110 Exists

\`F110\` — the Automatic Payment Program — is one of the most critical transactions in all of FI. Its job is to pay many vendors at once: select what's due, decide how to pay it, create the payment documents, clear the open items, and produce the output (cheques, advices, bank files). Doing this by hand for hundreds of invoices is unthinkable.

## The Five Stages of a Payment Run

F110 always runs in the same disciplined sequence:

| Stage | What happens |
|-------|--------------|
| **1. Parameters** | Set company code, payment date, payment methods, vendor range |
| **2. Proposal** | SAP lists exactly which open items it intends to pay |
| **3. Edit Proposal** | You review and remove/block items (disputes, holds) |
| **4. Payment Run** | SAP creates payment documents and clears the invoices |
| **5. Print / Output** | Generates payment advices, cheques, and bank transfer files |

The **proposal** stage is the safety net. Nothing leaves the company until a human approves the list — this is what protects Kavya from paying the wrong vendor.

## Payment Methods

A **payment method** is a single-character code for *how* you pay:

- **C** — cheque
- **T** — bank transfer (NEFT / RTGS / wire)
- **W** — bill of exchange

Each method is configured with rules: minimum and maximum amounts, which banks can be used, and which form (cheque layout, advice) to print.

## How SAP Picks the Bank — Ranking & Bank Determination

If a vendor can be paid from several house banks, SAP uses a **ranking order** plus **bank determination** rules to choose. House bank selection is configured per **payment method + currency + amount** — so, for example, large USD transfers might route through your Citibank account while small INR cheques go through HDFC.

\`\`\`
F110 Parameters → Proposal → Edit Proposal
   → Payment Run (create docs + clear) → Print (advices / files)
\`\`\`

## Clearing — the Accounting Heart

The financial substance of F110 is **clearing**. Every unpaid invoice is an *open item* on the vendor account. When F110 pays it, the payment document is matched against the invoice and the open item becomes a **cleared (paid) item**. This is why the vendor's open-item list shrinks after a run — the payment and the invoice are tied together and removed from "outstanding".

## Why Review the Proposal Every Time

Most companies run F110 weekly or twice a month. Because the program acts on *parameters*, a careless entry — too wide a vendor range, a wrong payment date, forgetting a payment block — can pay vendors who shouldn't be paid. The proposal is the moment to catch it: edit out disputed invoices, confirm totals, and only then run. Skipping review is how organisations lose real money.

## Why It Matters

F110 turns days of manual cheque-cutting into minutes of controlled, auditable automation — but the control comes entirely from the proposal review and the payment-method/bank configuration behind it. A FICO consultant's value here is twofold: configuring the payment methods and bank determination correctly so money routes to the right place, and instilling the discipline that no run goes ahead without reviewing the proposal first.`,
    keyConceptTitle: "F110 = Parameters → Proposal → Run → Print; The Proposal Review Is the Safety Net",
    keyConceptBody: `- \`F110\` automates vendor payment in five stages: **Parameters → Proposal → Edit Proposal → Payment Run → Print** (advices, cheques, bank files).
- **Payment methods** define *how* you pay — C (cheque), T (transfer/NEFT/RTGS), W (bill of exchange) — each with min/max amounts, bank determination, and form assignment.
- When a vendor has multiple banks, SAP uses **ranking order** and **bank determination** (per payment method + currency + amount) to pick the house bank.
- The run **clears** open items: paid invoices move from open to cleared. Always **review the proposal** before running — a wrong parameter can pay the wrong vendors.`,
  },
});
const flowchart2_12 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_12.id },
  update: {},
  create: {
    lessonId: lesson2_12.id,
    title: "The F110 Automatic Payment Run",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "⚙️ Set Parameters (co code, date, vendors)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "📋 Proposal — SAP lists what to pay" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 220 }, data: { label: "✏️ Edit Proposal — remove disputes" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 320 }, data: { label: "🏦 Bank determination (rank + method)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 420 }, data: { label: "💸 Payment Run — create docs + clear" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 520 }, data: { label: "🖨️ Print advices / cheques / bank file" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 620 }, data: { label: "✅ Open items now cleared (paid)" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default", label: "approved" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node5", target: "node7", type: "default", label: "clears" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_12.id, nodeId: "node1", title: "Set Parameters", description: "Define the run: company code(s), payment date, posting date, payment methods, and the range of vendors to include. These parameters drive everything that follows.", tCode: "F110", tips: "An overly wide vendor range or wrong date here is the most common cause of paying the wrong items — set parameters tightly." },
    { flowchartId: flowchart2_12.id, nodeId: "node2", title: "Proposal", description: "SAP scans open items against the parameters and produces a proposal — the exact list of invoices it intends to pay, by vendor and amount.", tCode: "F110", tips: "The proposal is read-only output of the parameters; treat it as a 'preview before you spend'." },
    { flowchartId: flowchart2_12.id, nodeId: "node3", title: "Edit Proposal", description: "The human checkpoint. Review the proposed payments and remove or block disputed, held, or incorrect items before any money moves.", tCode: "F110", tips: "This is the single most important control in F110 — never skip it in production." },
    { flowchartId: flowchart2_12.id, nodeId: "node4", title: "Bank Determination", description: "For each payment, SAP selects the house bank using ranking order and rules keyed by payment method, currency, and amount.", tCode: "FBZP", tips: "Bank determination is configured in FBZP — route large transfers and small cheques through the appropriate banks." },
    { flowchartId: flowchart2_12.id, nodeId: "node5", title: "Payment Run", description: "SAP creates payment documents and clears the open items — each paid invoice is matched to its payment and removed from the outstanding list.", tCode: "F110", tips: "Once the run posts, reversing it is painful — which is why the proposal review matters so much." },
    { flowchartId: flowchart2_12.id, nodeId: "node6", title: "Print / Output", description: "Generates the physical and electronic output: payment advices to vendors, printed cheques, and the bank transfer (DME) file for NEFT/RTGS.", tCode: "F110", tips: "The bank file format must match what your bank expects — set up the payment medium workbench (PMW) correctly." },
    { flowchartId: flowchart2_12.id, nodeId: "node7", title: "Items Cleared", description: "The accounting result: invoices that were open items are now cleared (paid) items, and the vendor's outstanding balance drops accordingly.", tCode: "FBL1N", tips: "Check the vendor open-item list (FBL1N) after the run to confirm the right items cleared." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_12.id },
  update: {},
  create: {
    lessonId: lesson2_12.id,
    title: "Automatic Payment Run (F110) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the correct sequence of stages in an F110 payment run?",
          explanation: "F110 runs in a fixed order: set Parameters, generate the Proposal, Edit the proposal, execute the Payment Run (create documents and clear), then Print output (advices, cheques, bank files).",
          options: {
            create: [
              { text: "Parameters → Proposal → Edit Proposal → Payment Run → Print", isCorrect: true },
              { text: "Payment Run → Parameters → Print → Proposal", isCorrect: false },
              { text: "Proposal → Print → Parameters → Payment Run", isCorrect: false },
              { text: "Print → Edit Proposal → Parameters → Proposal", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does 'clearing' mean in the context of an F110 payment run?",
          explanation: "Clearing matches the payment document against the open (unpaid) invoice, turning it into a cleared (paid) item. This is why the vendor's open-item list shrinks after a successful run.",
          options: {
            create: [
              { text: "The payment document is matched against the open invoice, turning the open item into a cleared (paid) item", isCorrect: true },
              { text: "All vendor master records are deleted", isCorrect: false },
              { text: "The bank statement is imported and posted", isCorrect: false },
              { text: "The tax code percentage is recalculated", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Kavya is about to run F110 for 480 invoices but knows three are disputed and should not be paid. What is the correct action?",
          explanation: "She should review the proposal and remove/block the three disputed items in the Edit Proposal stage before executing the payment run. The proposal review is the control that prevents paying items that shouldn't be paid.",
          options: {
            create: [
              { text: "Review the proposal and remove the three disputed items in Edit Proposal before running the payment", isCorrect: true },
              { text: "Run the payment first, then try to reverse the three payments afterward", isCorrect: false },
              { text: "Widen the vendor range so the disputes get netted out automatically", isCorrect: false },
              { text: "Skip the proposal to save time since SAP is automatic", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.13: Special G/L Transactions
const lesson2_13 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-special-gl-transactions" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Special G/L Transactions",
    slug: "fico-special-gl-transactions",
    order: 13,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A real-estate developer signs a contract to build an office tower. The customer pays a 40% advance before a single brick is laid. Suresh, the FICO consultant, faces a question from the auditor: "That ₹4 crore advance isn't revenue and it isn't a normal receivable — the customer owes us nothing, we owe *them* a building. Where does it sit on the balance sheet?"

The answer is a **Special G/L transaction**. Down payments, guarantees, and bills of exchange don't belong with ordinary AR/AP — they need to be tracked separately so the balance sheet tells the truth. Suresh posts the advance as a special G/L item, and when the final invoice comes, he clears the advance against it. This lesson is about that parallel world of "not-quite-normal" postings.`,
    content: `## Why "Special" G/L Exists

Ordinary AP and AR handle invoices: you owe a vendor, or a customer owes you. But some transactions are genuinely different — money changes hands *before* the invoice, or a financial instrument sits between the two parties. **Special G/L (SGL) transactions** let you record these against the vendor/customer account while keeping them *separate* from normal payables and receivables, using a **special G/L indicator** (a single letter).

This separation matters because down payments must appear on a different balance-sheet line than trade receivables/payables — they have a different legal and accounting character.

## Down Payments — the Most Common SGL

There are two mirror-image flows:

| Flow | Posting transactions | SGL indicator |
|------|---------------------|---------------|
| **Customer down payment received** | Request \`F-37\`, post \`F-29\` | "A" |
| **Vendor down payment made** | Request \`F-47\`, post \`F-48\` | "A" |

A **down payment request** (\`F-37\` / \`F-47\`) is a *noted item* — a memo with no accounting impact yet, used to trigger or track the expected advance. The actual **down payment** (\`F-29\` received / \`F-48\` made) is the real posting that moves cash and sits under special G/L indicator "A".

## Clearing the Advance

The advance is temporary. When the **final invoice** arrives, the down payment must be **cleared** against it so the customer/vendor account reflects only the true remaining balance:

- **Vendor**: clear the down payment with \`F-39\`.
- **Customer**: clear the down payment with \`F-32\`.

\`\`\`
Down payment request (noted) → Down payment posted (SGL "A")
   → Final invoice received → Clear advance against invoice
   → Only the net balance remains open
\`\`\`

## Other SGL Indicators

Down payments aren't the only special transactions. Other indicators cover:

- **Guarantees** — a guarantee given or received, tracked as a noted/statistical item.
- **Bills of exchange** — a negotiable payment instrument with its own lifecycle.

Each uses a different SGL indicator so the balance sheet (or the statistical memo) reflects it correctly.

## Balance Sheet Impact

This is the whole point. Down payments **received** are a *liability* (you owe goods/services), shown separately from trade payables. Down payments **made** are an *asset* (you're owed goods/services), shown separately from trade receivables. Lumping them in with normal AR/AP would misstate the financial position — exactly what the auditor is guarding against.

## Why It Matters

In construction, real estate, and large equipment projects, **30–50% advance payments are standard**. Under IFRS, these advances must be presented correctly — as contract liabilities/assets, not revenue and not ordinary receivables. Special G/L is the mechanism that keeps them visible and separate until the underlying performance happens. Suresh's correct SGL posting is the difference between a clean audit and a restated balance sheet.`,
    keyConceptTitle: "Special G/L Keeps Advances and Instruments Separate From Normal AR/AP",
    keyConceptBody: `- **Special G/L (SGL) transactions** record down payments, guarantees, and bills of exchange against a vendor/customer but *separate* from normal payables/receivables, using a one-letter **SGL indicator** ("A" for down payments).
- Customer down payment: request \`F-37\`, post \`F-29\`. Vendor down payment: request \`F-47\`, post \`F-48\`. The request is a **noted item** with no accounting impact; the posting moves cash.
- When the final invoice arrives, **clear** the advance: \`F-39\` (vendor) or \`F-32\` (customer), leaving only the net balance open.
- Advances received are a **liability**, advances made an **asset** — shown separately on the balance sheet, which is critical for IFRS compliance on projects with large advances.`,
  },
});
const flowchart2_13 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_13.id },
  update: {},
  create: {
    lessonId: lesson2_13.id,
    title: "The Down Payment Lifecycle (Special G/L)",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "📝 Down payment request (noted item)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "💰 Post down payment (SGL 'A')" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 90, y: 220 }, data: { label: "📊 Sits separately on balance sheet" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 320 }, data: { label: "🧾 Final invoice received" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 420 }, data: { label: "🔗 Clear advance vs invoice (F-39 / F-32)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 520 }, data: { label: "✅ Only net balance remains open" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default", label: "advance paid" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default", label: "later" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_13.id, nodeId: "node1", title: "Down Payment Request", description: "A noted item (memo) created with F-37 (customer) or F-47 (vendor). It records the expected advance with no accounting impact yet — useful for tracking and for triggering F110.", tCode: "F-37 / F-47", tips: "Noted items don't update the G/L; they're statistical reminders that an advance is due." },
    { flowchartId: flowchart2_13.id, nodeId: "node2", title: "Post Down Payment", description: "The real posting that moves cash, recorded under special G/L indicator 'A'. F-29 for a customer advance received; F-48 for a vendor advance made.", tCode: "F-29 / F-48", tips: "The SGL indicator 'A' is what keeps this off the normal AR/AP line." },
    { flowchartId: flowchart2_13.id, nodeId: "node3", title: "Separate Balance Sheet Line", description: "Advances received show as a liability (you owe goods/services); advances made show as an asset — both presented separately from trade payables/receivables.", tCode: null, tips: "This separation is exactly what auditors check for IFRS contract asset/liability presentation." },
    { flowchartId: flowchart2_13.id, nodeId: "node4", title: "Final Invoice", description: "When goods/services are delivered, the normal invoice is posted. Now the advance and the invoice both sit on the account and must be reconciled.", tCode: "FB70 / FB60", tips: "Until cleared, the customer/vendor account overstates the balance — the advance and invoice are both open." },
    { flowchartId: flowchart2_13.id, nodeId: "node5", title: "Clear the Advance", description: "Transfer/clear the down payment against the final invoice — F-39 for a vendor, F-32 for a customer — so the advance is applied to what's owed.", tCode: "F-39 / F-32", tips: "Forgetting to clear leaves a permanent open advance that distorts AR/AP aging." },
    { flowchartId: flowchart2_13.id, nodeId: "node6", title: "Net Balance Remains", description: "After clearing, only the genuine remaining balance (invoice minus advance) stays open, and the balance sheet reflects the true position.", tCode: null, tips: "Reconcile special G/L balances at month-end to ensure all delivered contracts have had advances cleared." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_13.id },
  update: {},
  create: {
    lessonId: lesson2_13.id,
    title: "Special G/L Transactions — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to post a customer down payment received under special G/L indicator 'A'?",
          explanation: "F-29 posts a customer down payment received (special G/L 'A'). F-37 is only the down payment request (a noted item). For vendors, F-48 posts the advance and F-47 is the request.",
          options: {
            create: [
              { text: "F-29", isCorrect: true },
              { text: "F-32", isCorrect: false },
              { text: "F-48", isCorrect: false },
              { text: "FB70", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why are down payments recorded as special G/L transactions instead of normal AR/AP?",
          explanation: "Down payments have a different accounting character — advances received are a liability, advances made an asset — and must appear separately from trade receivables/payables on the balance sheet. The special G/L indicator keeps them distinct.",
          options: {
            create: [
              { text: "Because advances have a different character (liability/asset for goods owed) and must appear separately from trade AR/AP on the balance sheet", isCorrect: true },
              { text: "Because special G/L postings skip the vendor/customer account entirely", isCorrect: false },
              { text: "Because down payments are revenue and must hit the P&L immediately", isCorrect: false },
              { text: "Because normal AR/AP cannot store any amounts", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A construction firm took a 40% customer advance via F-29. The final invoice is now posted. What must happen so the customer account shows only the true remaining balance?",
          explanation: "The down payment must be cleared against the final invoice using F-32 (customer). Until this clearing happens, both the advance and the invoice sit open and the account overstates the balance.",
          options: {
            create: [
              { text: "Clear the down payment against the invoice using F-32", isCorrect: true },
              { text: "Delete the down payment request", isCorrect: false },
              { text: "Post a second down payment to offset the first", isCorrect: false },
              { text: "Leave both open — SAP nets them automatically at year-end", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.14: Dunning (F150)
const lesson2_14 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-dunning-f150" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Dunning (F150)",
    slug: "fico-dunning-f150",
    order: 14,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `The credit control team at a distribution company is drowning. Customers owe ₹6 crore in overdue invoices, and the team is manually checking spreadsheets to decide who to chase and how sternly. Some chronic late-payers get gentle emails; some good customers get aggressive legal threats by mistake. DSO (Days Sales Outstanding) is creeping up and cash is tight.

Lakshmi, the FICO consultant, configures **dunning**. Now \`F150\` runs every week in the background: it finds overdue invoices, decides how overdue each is, and sends each customer an escalating reminder at the right severity — friendly nudge, firm reminder, warning, or legal notice. The team stops guessing, DSO falls, and cash flow improves. This lesson is about that automated reminder engine.`,
    content: `## What Dunning Is

**Dunning** is the automated process of sending overdue-payment reminders to customers. Instead of staff manually deciding who to chase, SAP scans receivables, identifies overdue items, and generates appropriately worded reminder letters. The program is \`F150\`, and it runs in the background on a schedule.

## Dunning Levels — Escalation

The core idea is escalation. A customer who's a few days late gets a soft nudge; one who's ignored three reminders gets a legal warning. **Dunning levels** capture this:

| Level | Tone |
|-------|------|
| 1 | Friendly reminder |
| 2 | Firm reminder |
| 3 | Warning |
| 4 | Legal action notice |

Each invoice's level depends on how many days overdue it is — and the level *climbs* each time it's dunned again without payment.

## The Dunning Procedure

The brain of the system is the **dunning procedure**, configured in \`FBMP\`. It defines:

- how many levels exist,
- the **days overdue** required to reach each level,
- the **dunning interval** (minimum days between runs),
- whether **interest** is calculated on overdue amounts, and
- which form/text each level uses.

## Two Things Must Be in Place

Dunning only works if it's wired up correctly:

1. **Customer master assignment** — the dunning procedure must be assigned to the customer master (\`XD02\` / FD02). No procedure on the master = that customer is never dunned.
2. **Dunning key** — can be set on a line item to *cap* or *block* its dunning level (e.g. a disputed invoice shouldn't escalate to legal).

A **dunning area** is an optional subdivision of a company code (e.g. by region or division), letting different areas dun independently.

## How a Run Flows

\`\`\`
F150 → select overdue open items → determine dunning level per item
   → check dunning interval & customer procedure
   → generate dunning notices (print / email) → update dunning level on items
\`\`\`

The output is a **dunning notice** per customer — a letter or email listing every overdue invoice with the appropriate escalation text.

## Why It Matters

Credit control teams run dunning weekly because it directly drives **cash flow**. Automated, consistent reminders shorten **DSO (Days Sales Outstanding)** — the average time to collect — which means cash arrives sooner and less working capital is tied up in receivables. Equally important, automation removes the inconsistency Lakshmi's team suffered: good customers no longer get accidental legal threats, and chronic late-payers no longer slip through. Dunning is a small configuration with an outsized effect on the company's cash position — which is why credit controllers love it and CFOs notice the result.`,
    keyConceptTitle: "Dunning Auto-Escalates Overdue Reminders to Cut DSO",
    keyConceptBody: `- **Dunning** (\`F150\`) is the automated process that finds overdue customer invoices and sends escalating reminders (Level 1 friendly → Level 4 legal).
- The **dunning procedure** (configured in \`FBMP\`) defines the levels, days overdue per level, interval between runs, and interest — and must be **assigned to the customer master** (\`XD02\`) for dunning to work.
- A **dunning key** caps/blocks a line item's level (e.g. disputed invoices); a **dunning area** subdivides a company code so regions can dun independently.
- Output is a **dunning notice** per customer; running weekly reduces **DSO** and improves cash flow.`,
  },
});
const flowchart2_14 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_14.id },
  update: {},
  create: {
    lessonId: lesson2_14.id,
    title: "The F150 Dunning Run",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "⚙️ Dunning procedure (FBMP)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "👤 Assigned on customer master (XD02)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 220 }, data: { label: "▶️ Run F150 — scan overdue items" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 320 }, data: { label: "📈 Determine dunning level per item" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 90, y: 430 }, data: { label: "🔑 Dunning key blocks/caps an item" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 460, y: 430 }, data: { label: "✉️ Generate dunning notices" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 530 }, data: { label: "📉 Lower DSO, better cash flow" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default", label: "exclude" },
      { id: "e5", source: "node4", target: "node6", type: "default", label: "include" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_14.id, nodeId: "node1", title: "Dunning Procedure (FBMP)", description: "The brain of dunning. Defines the number of levels, days overdue per level, the interval between runs, interest calculation, and the form/text for each level.", tCode: "FBMP", tips: "Design levels to match your collections policy — most companies use 3–4 escalating levels." },
    { flowchartId: flowchart2_14.id, nodeId: "node2", title: "Customer Master Assignment", description: "The procedure must be assigned on the customer master. Without it, that customer is invisible to the dunning program no matter how overdue.", tCode: "XD02 / FD02", tips: "A common 'why isn't this customer being dunned?' bug is simply a missing procedure on the master." },
    { flowchartId: flowchart2_14.id, nodeId: "node3", title: "Run F150", description: "The dunning program runs (usually weekly, in background), scanning all open receivables for overdue items eligible for dunning.", tCode: "F150", tips: "Schedule it as a recurring background job so collections are consistent and timely." },
    { flowchartId: flowchart2_14.id, nodeId: "node4", title: "Determine Level", description: "For each overdue item, SAP calculates how many days late it is and assigns the appropriate dunning level, escalating from prior runs.", tCode: null, tips: "Levels climb on repeat dunning — a persistently unpaid invoice moves toward the legal-action level." },
    { flowchartId: flowchart2_14.id, nodeId: "node5", title: "Dunning Key", description: "Set on a line item to cap or block its dunning level — e.g. stop a disputed invoice from escalating to a legal notice.", tCode: null, tips: "Use dunning keys for disputes and special arrangements so customers aren't wrongly threatened." },
    { flowchartId: flowchart2_14.id, nodeId: "node6", title: "Generate Notices", description: "SAP produces a dunning notice per customer — printed or emailed — listing every overdue invoice with the level-appropriate wording.", tCode: null, tips: "Email dunning is increasingly standard and far cheaper/faster than printed letters." },
    { flowchartId: flowchart2_14.id, nodeId: "node7", title: "Lower DSO", description: "Consistent, escalating reminders shorten Days Sales Outstanding — cash is collected faster and less working capital is tied up in receivables.", tCode: null, tips: "Track DSO before and after automating dunning — it's the headline metric that proves the value." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_14.id },
  update: {},
  create: {
    lessonId: lesson2_14.id,
    title: "Dunning (F150) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Where is the dunning procedure (levels, days overdue, interval, interest) configured?",
          explanation: "The dunning procedure is configured in FBMP. It defines the dunning levels, the days overdue required for each, the interval between runs, interest, and the forms used. The procedure is then assigned to customer masters.",
          options: {
            create: [
              { text: "FBMP", isCorrect: true },
              { text: "F150", isCorrect: false },
              { text: "XD02", isCorrect: false },
              { text: "FBZP", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the purpose of escalating dunning levels (Level 1 through Level 4)?",
          explanation: "Dunning levels escalate the tone of reminders based on how overdue an item is and how many times it's been dunned — from a friendly reminder (Level 1) up to a legal-action notice (Level 4) — applying appropriate pressure without over-threatening good customers.",
          options: {
            create: [
              { text: "They escalate the reminder's severity as an item stays unpaid — friendly reminder up to legal notice — applying proportionate pressure", isCorrect: true },
              { text: "They define how much tax to charge on overdue invoices", isCorrect: false },
              { text: "They set the customer's credit limit", isCorrect: false },
              { text: "They determine which house bank receives the payment", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Lakshmi runs F150 but one chronically overdue customer is never dunned. What is the most likely cause?",
          explanation: "If a customer is never picked up by dunning, the dunning procedure is almost certainly not assigned on that customer's master record (XD02/FD02). Without the procedure, F150 ignores the customer entirely.",
          options: {
            create: [
              { text: "No dunning procedure is assigned on that customer's master record (XD02)", isCorrect: true },
              { text: "F150 can only dun one customer per run", isCorrect: false },
              { text: "Dunning automatically skips overdue customers", isCorrect: false },
              { text: "The customer's invoices were posted with a tax code", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.15: Foreign Currency Valuation (F.05)
const lesson2_15 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-foreign-currency-valuation" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Foreign Currency Valuation (F.05)",
    slug: "fico-foreign-currency-valuation",
    order: 15,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `An export company posts a USD invoice to a US customer for $100,000 when the rate is ₹80, recording ₹80,00,000 receivable in its books. A month later, at close, the rupee has weakened to ₹83 — that same $100,000 is now worth ₹83,00,000. Deepak, the FICO consultant, gets a pointed question from the auditor: "Your balance sheet still shows ₹80,00,000. Under Ind AS that receivable must be revalued to today's rate. Where's the ₹3,00,000 gain?"

The answer is **Foreign Currency Valuation** — transaction \`F.05\`. At every month-end, open foreign-currency items and bank balances are revalued to the closing rate, and the difference is posted as an unrealized gain or loss. This lesson explains why that revaluation exists, how F.05 does it, and the crucial detail that it reverses itself the next day.`,
    content: `## The Problem: Rates Move, Books Don't

When you post a foreign-currency invoice, SAP records it in local currency at *that day's* exchange rate. But rates move constantly. By month-end, the local-currency value of an open USD receivable, payable, or bank balance is different from what's in the books. **IFRS / Ind AS and local GAAP require** open foreign-currency items to be revalued to the **closing (month-end) exchange rate** so the balance sheet reflects current reality.

## What F.05 Does

\`F.05\` (or **\`FAGL_FC_VAL\`** in S/4HANA / New G/L) is the **foreign currency valuation** program, run at month-end. For each open foreign-currency item and FX bank balance it:

1. takes the **original** booking rate and the **current closing** rate,
2. calculates the difference in local currency, and
3. posts the difference as an **unrealized gain or loss** to a G/L account.

In Deepak's case it posts the ₹3,00,000 unrealized FX gain, lifting the receivable to its current worth.

## The Key Twist: It Reverses

This is the detail that trips people up. The valuation is **unrealized** — the cash hasn't actually changed, the customer still owes exactly $100,000. So F.05 **automatically reverses the posting on the first day of the next period**. The revaluation gives a true month-end picture, then backs out so the original item is intact for the next valuation.

\`\`\`
Month-end: F.05 revalues open FX items to closing rate
   → posts unrealized gain/loss
   → 1st of next month: posting auto-reverses
   → item back to original value, ready for next valuation
\`\`\`

## Unrealized vs Realized

It's important to separate the two:

| Type | When | Posted by |
|------|------|-----------|
| **Unrealized** gain/loss | Month-end revaluation (reverses next period) | \`F.05\` |
| **Realized** gain/loss | When the invoice is actually **paid** | The payment/clearing |

The **realized** gain/loss is the *actual* difference between the rate at invoicing and the rate at payment — locked in when cash settles. Until then, every month-end revaluation is just a temporary estimate.

## Exchange Rate Types

SAP stores rates by **exchange rate type**, configured in \`OB08\`:

- **M** — standard average rate (used for most postings/valuation),
- **B** — bank buying rate,
- **G** — bank selling rate.

The valuation uses the configured rate type's month-end rate to revalue.

## Why It Matters

A company with significant foreign-currency exposure can have its reported profit and balance sheet swing materially on exchange-rate movements. Foreign currency valuation ensures those swings are recognised at each reporting date as required by accounting standards — and the auto-reversal ensures they aren't double-counted or mistaken for realised cash. For Deepak, running F.05 correctly is what turns a non-compliant, understated balance sheet into an audit-ready one that honestly reflects FX exposure.`,
    keyConceptTitle: "F.05 Revalues Open FX Items to Month-End Rate, Then Auto-Reverses",
    keyConceptBody: `- Foreign-currency open items and bank balances are booked at the original rate but must be revalued to the **closing (month-end) rate** under IFRS/Ind AS and local GAAP.
- \`F.05\` (or \`FAGL_FC_VAL\` in S/4HANA) calculates the difference between original and current rate and posts an **unrealized** gain/loss — which **auto-reverses on the 1st of the next period** because the cash hasn't moved.
- **Realized** gain/loss is the actual difference locked in when the invoice is **paid** (booked by the clearing), distinct from the unrealized month-end estimate.
- Exchange rate types (M standard, B buying, G selling) are maintained in \`OB08\`; valuation uses the configured rate.`,
  },
});
const flowchart2_15 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_15.id },
  update: {},
  create: {
    lessonId: lesson2_15.id,
    title: "Foreign Currency Valuation Cycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🧾 FX invoice posted at ₹80" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "📅 Month-end: rate now ₹83" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 220 }, data: { label: "▶️ Run F.05 / FAGL_FC_VAL" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 320 }, data: { label: "💹 Post unrealized FX gain/loss" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 420 }, data: { label: "🔄 Auto-reverse on 1st of next period" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 520 }, data: { label: "💰 Invoice paid → realized gain/loss" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default", label: "unrealized" },
      { id: "e5", source: "node5", target: "node6", type: "default", label: "at settlement" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_15.id, nodeId: "node1", title: "FX Invoice Posted", description: "A foreign-currency invoice is recorded in local currency at the booking-date rate (e.g. $100,000 at ₹80 = ₹80,00,000 receivable).", tCode: "FB70 / FB60", tips: "The local-currency amount is frozen at the posting-date rate until something revalues it." },
    { flowchartId: flowchart2_15.id, nodeId: "node2", title: "Rate Moves by Month-End", description: "Exchange rates change continuously. By close, the same foreign-currency balance is worth a different local-currency amount (₹83 here).", tCode: "OB08", tips: "Maintain the month-end closing rate in OB08 before running valuation — wrong rate, wrong valuation." },
    { flowchartId: flowchart2_15.id, nodeId: "node3", title: "Run F.05", description: "The valuation program (F.05, or FAGL_FC_VAL in S/4HANA) processes all open FX items and bank balances at month-end.", tCode: "F.05 / FAGL_FC_VAL", tips: "Run it as part of the month-end close checklist, after rates are updated." },
    { flowchartId: flowchart2_15.id, nodeId: "node4", title: "Post Unrealized Gain/Loss", description: "The difference between original and closing rate is posted to an unrealized FX gain/loss G/L, adjusting the balance-sheet value to current reality.", tCode: null, tips: "It's 'unrealized' because no cash has moved — it's an accounting estimate at the reporting date." },
    { flowchartId: flowchart2_15.id, nodeId: "node5", title: "Auto-Reversal", description: "On the first day of the next period the valuation posting automatically reverses, restoring the item to its original value ready for the next valuation.", tCode: null, tips: "The reversal prevents double-counting — without it, each month's valuation would pile on top of the last." },
    { flowchartId: flowchart2_15.id, nodeId: "node6", title: "Realized at Payment", description: "When the invoice is actually paid, the true difference between invoice rate and payment rate is the realized FX gain/loss — locked in by the clearing.", tCode: "F-28 / F-53", tips: "Realized gain/loss is the real economic outcome; unrealized valuations were just interim estimates." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_15.id },
  update: {},
  create: {
    lessonId: lesson2_15.id,
    title: "Foreign Currency Valuation (F.05) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does the foreign currency valuation program (F.05 / FAGL_FC_VAL) post at month-end?",
          explanation: "F.05 compares the original booking rate to the month-end closing rate for each open FX item and bank balance, and posts the difference as an unrealized foreign-exchange gain or loss.",
          options: {
            create: [
              { text: "An unrealized FX gain or loss reflecting the difference between the original and closing exchange rates", isCorrect: true },
              { text: "A realized gain that permanently settles the invoice", isCorrect: false },
              { text: "A new customer invoice in foreign currency", isCorrect: false },
              { text: "A tax adjustment to the output tax account", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does the F.05 valuation posting automatically reverse on the first day of the next period?",
          explanation: "The valuation is unrealized — no cash has actually changed hands, the counterparty still owes the same foreign-currency amount. The auto-reversal restores the item to its original value so successive month-end valuations don't double-count.",
          options: {
            create: [
              { text: "Because the gain/loss is unrealized (no cash moved), so it's backed out to avoid double-counting and re-valued fresh next period", isCorrect: true },
              { text: "Because the invoice has been paid in full", isCorrect: false },
              { text: "Because exchange rates are not allowed to change twice", isCorrect: false },
              { text: "Because the valuation creates a permanent realized entry", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Deepak booked a $100,000 receivable at ₹80; at month-end the rate is ₹83. The auditor asks why the balance sheet still shows ₹80,00,000. What should Deepak do?",
          explanation: "He should run foreign currency valuation (F.05/FAGL_FC_VAL), which revalues the open receivable to the ₹83 closing rate and posts the ₹3,00,000 unrealized gain — bringing the balance sheet to its current value as required by Ind AS. The posting auto-reverses next period.",
          options: {
            create: [
              { text: "Run F.05 to revalue the open item to the closing rate, posting the ₹3,00,000 unrealized gain", isCorrect: true },
              { text: "Manually edit the original invoice to ₹83", isCorrect: false },
              { text: "Wait until the customer pays and do nothing at month-end", isCorrect: false },
              { text: "Post a new sales invoice for the ₹3,00,000 difference", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.16: New G/L — Document Splitting & Parallel Ledgers
const lesson2_16 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-new-gl-document-splitting" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "New G/L — Document Splitting & Parallel Ledgers",
    slug: "fico-new-gl-document-splitting",
    order: 16,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A listed Indian manufacturer has two demands that used to require two separate accounting systems. First, the CFO wants a *complete balance sheet for each business segment* — not just a P&L split, but real segment-level assets and liabilities. Second, the company must report under both **Ind AS** (IFRS) for investors and the local Companies Act for statutory filing — with different depreciation and provisions in each.

In classic G/L this was a nightmare of manual allocations and parallel data entry. Anjali, the FICO consultant, solves both with **New G/L**: **document splitting** gives segment-level balance sheets automatically, and **parallel ledgers** maintain both accounting standards in one system without double entry. This lesson unpacks the two features that make New G/L the backbone of modern SAP finance.`,
    content: `## What New G/L Added

The **New General Ledger** (introduced in ECC 6.0, mandatory in S/4HANA) extended the classic G/L with capabilities that previously needed bolt-on tools or manual work. Two features dominate: **document splitting** and **parallel ledgers**.

## Document Splitting — Balance Sheets by Segment

**Document splitting** automatically breaks a G/L line item across dimensions like **profit center** or **segment**, based on configured rules — so each segment ends up with a *complete, balanced* balance sheet (the IFRS 8 / Ind AS 108 segment-reporting requirement).

The classic example: one vendor invoice covers expenses for **two cost centers** in different segments.

\`\`\`
Vendor invoice ₹100  (Cost Center A = Segment X ₹60, Cost Center B = Segment Y ₹40)
   → document splitting splits the vendor payable (credit)
   → ₹60 payable to Segment X, ₹40 payable to Segment Y
   → each segment's balance sheet balances on its own
\`\`\`

Splitting comes in two flavours:

| Type | What it does |
|------|--------------|
| **Active splitting** | Splits the line in real time during posting, using rules |
| **Passive splitting** | Inherits the split from a referenced document, and uses **zero-balance clearing** accounts to make each segment balance to zero |

The zero-balance clearing line is the trick that guarantees each profit center/segment is *internally balanced* — assets = liabilities within the segment.

## Parallel Ledgers — Multiple Books at Once

**Parallel ledgers** let you keep several sets of books simultaneously for different accounting standards, all in one system:

- **Leading ledger (0L)** — the primary book, usually local GAAP.
- **Non-leading / extension ledgers** — IFRS, US GAAP, etc., where things like depreciation methods, asset values, and provisions differ.

Crucially, you don't re-enter every transaction. Common postings hit all ledgers; only the **differences** between standards are posted to the extension ledger as **delta postings**. So Anjali's IFRS depreciation difference is the only thing posted separately — the rest is shared.

## How They Work Together

Document splitting gives Anjali segment balance sheets; parallel ledgers give her IFRS + local GAAP. Both run off the *same* document entry — no parallel systems, no double keying. That single-source design is exactly why New G/L is mandatory in S/4HANA.

## Why It Matters

A listed company *must* satisfy investors (IFRS/Ind AS) and regulators (local Companies Act) at once, and increasingly must present full segment financials. Before New G/L, finance teams ran spreadsheets and special-purpose ledgers to bridge the gap, with all the reconciliation risk that implies. New G/L absorbs both requirements into the core ledger: document splitting produces compliant segment balance sheets in real time, and parallel ledgers produce multiple GAAP views from one set of entries. For a FICO consultant, configuring these correctly is among the highest-value work on any S/4HANA project.`,
    keyConceptTitle: "New G/L: Splitting Gives Segment Balance Sheets; Parallel Ledgers Give Multi-GAAP",
    keyConceptBody: `- **New G/L** (mandatory in S/4HANA) adds **document splitting** and **parallel ledgers** to the classic G/L.
- **Document splitting** auto-splits line items across profit center/segment so each segment has a *complete, balanced* balance sheet — **active** splitting happens at posting; **passive** splitting uses **zero-balance clearing** accounts to keep each segment balanced.
- **Parallel ledgers** maintain multiple GAAPs at once: a **leading ledger (0L)** for local GAAP plus **extension ledgers** for IFRS/US GAAP, with only the **differences** posted as **delta postings** — no double data entry.
- Both run off the same document entry, letting a listed company report Ind AS (IFRS) and local Companies Act, with segment balance sheets, from one source.`,
  },
});
const flowchart2_16 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_16.id },
  update: {},
  create: {
    lessonId: lesson2_16.id,
    title: "Document Splitting & Parallel Ledgers in New G/L",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🧾 Vendor invoice (2 cost centers)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "✂️ Document splitting by segment" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 90, y: 220 }, data: { label: "📊 Segment X balance sheet (balanced)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 220 }, data: { label: "📊 Segment Y balance sheet (balanced)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 330 }, data: { label: "📒 Leading Ledger 0L (local GAAP)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 430 }, data: { label: "📕 Extension Ledger (IFRS) — delta only" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 530 }, data: { label: "✅ Both GAAPs + segment reporting, one entry" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 230, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default", label: "₹60" },
      { id: "e3", source: "node2", target: "node4", type: "default", label: "₹40" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default", label: "delta posting" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_16.id, nodeId: "node1", title: "Vendor Invoice (Multi-Segment)", description: "One invoice whose expense lines belong to two cost centers in different segments — the classic case where the single vendor payable line must be split.", tCode: "FB60", tips: "Without splitting, the whole payable would sit in one segment, breaking segment balance sheets." },
    { flowchartId: flowchart2_16.id, nodeId: "node2", title: "Document Splitting", description: "Configured rules split the vendor payable (and tax) across the segments in proportion to the expense lines, in real time during posting.", tCode: "GSP_RD", tips: "Active splitting applies rules at posting; passive splitting inherits the split from a referenced document." },
    { flowchartId: flowchart2_16.id, nodeId: "node3", title: "Segment X Balance Sheet", description: "Segment X carries its share (₹60) of the payable. Zero-balance clearing ensures the segment is internally balanced — assets equal liabilities within it.", tCode: null, tips: "The zero-balance clearing account is what makes each segment a complete, balanced entity." },
    { flowchartId: flowchart2_16.id, nodeId: "node4", title: "Segment Y Balance Sheet", description: "Segment Y carries its ₹40 share. Now each segment can produce a full balance sheet — the IFRS 8 / Ind AS 108 segment-reporting requirement.", tCode: null, tips: "This is what lets the CFO see assets and liabilities by segment, not just P&L." },
    { flowchartId: flowchart2_16.id, nodeId: "node5", title: "Leading Ledger (0L)", description: "The primary ledger, usually local GAAP. All standard postings hit the leading ledger and form the basis for statutory accounts.", tCode: "FINSC_LEDGER", tips: "There is exactly one leading ledger; all company codes post to it." },
    { flowchartId: flowchart2_16.id, nodeId: "node6", title: "Extension Ledger (IFRS)", description: "A parallel ledger for a different standard (e.g. IFRS). Only the differences from the leading ledger — like different depreciation or provisions — are posted here as delta postings.", tCode: "FINSC_LEDGER", tips: "Delta postings avoid re-entering every transaction — only the GAAP differences are recorded separately." },
    { flowchartId: flowchart2_16.id, nodeId: "node7", title: "One Entry, Multiple Views", description: "From a single document entry, New G/L delivers segment balance sheets and multiple GAAP views — no parallel systems, no double keying.", tCode: null, tips: "This single-source design is the core reason New G/L is mandatory in S/4HANA." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_16.id },
  update: {},
  create: {
    lessonId: lesson2_16.id,
    title: "New G/L — Document Splitting & Parallel Ledgers — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the primary purpose of document splitting in New G/L?",
          explanation: "Document splitting automatically splits line items across dimensions like profit center or segment so that each segment has a complete, balanced balance sheet — satisfying segment-reporting requirements (IFRS 8 / Ind AS 108).",
          options: {
            create: [
              { text: "To split line items across profit centers/segments so each segment has a complete, balanced balance sheet", isCorrect: true },
              { text: "To split a document into multiple company codes for consolidation", isCorrect: false },
              { text: "To divide a payment run into smaller batches", isCorrect: false },
              { text: "To calculate tax on each line separately", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "In a parallel ledger setup, what is posted to an extension (non-leading) ledger such as an IFRS ledger?",
          explanation: "Common transactions hit all ledgers; only the differences between accounting standards (e.g. different depreciation, provisions, asset values) are posted to the extension ledger as delta postings — avoiding double data entry.",
          options: {
            create: [
              { text: "Only the differences between standards (delta postings) — e.g. different depreciation or provisions", isCorrect: true },
              { text: "Every single transaction is re-entered from scratch", isCorrect: false },
              { text: "Nothing — extension ledgers are read-only copies", isCorrect: false },
              { text: "Only tax postings are recorded there", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Anjali's listed company must report under both Ind AS (IFRS) and the local Companies Act, and the CFO wants full balance sheets per segment. How does New G/L meet both needs from one set of entries?",
          explanation: "Document splitting produces complete, balanced segment balance sheets in real time, while parallel ledgers (leading ledger 0L for local GAAP plus an IFRS extension ledger with delta postings) provide both accounting standards — all from the same document entry, with no parallel systems or double keying.",
          options: {
            create: [
              { text: "Document splitting delivers segment balance sheets and parallel ledgers (0L + IFRS extension via delta postings) deliver both GAAPs — all from one document entry", isCorrect: true },
              { text: "By running two completely separate SAP systems and reconciling them manually", isCorrect: false },
              { text: "By posting every transaction twice, once per standard", isCorrect: false },
              { text: "By using foreign currency valuation to convert between standards", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.17: Controlling Area & Cost Elements
const lesson2_17 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-controlling-area-cost-elements" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Controlling Area & Cost Elements",
    slug: "fico-controlling-area-cost-elements",
    order: 17,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Vikram, a finance manager, posts a ₹5,00,000 salary expense in FI and is surprised to see it instantly appear in a cost center report in CO — without anyone re-keying it. "How does the controlling side know about a posting I made in financial accounting?" he asks Neha, the FICO consultant.

Neha draws the bridge: the salary G/L account is also a **primary cost element**, and the posting carries a **cost center**. That single link is the entire FI-CO integration — every expense that flows to a cost object in FI automatically becomes a cost in CO. This lesson explains the controlling area that frames all of CO, and the cost elements that connect financial accounting to management accounting.`,
    content: `## The Controlling Area — CO's Master Org Unit

Everything in Controlling lives inside a **Controlling Area**. Cost centers, profit centers, internal orders — all must belong to exactly one controlling area. It's the boundary within which costs are collected, allocated, and reported.

Its relationship to company codes can be:

| Assignment | Use case |
|------------|----------|
| **1:1** | One controlling area = one company code (simple, single-entity) |
| **Many:1** | One controlling area covers several company codes (group controlling) |

One rule is non-negotiable: the **fiscal year variant** of the controlling area must match that of the assigned company codes — otherwise period postings can't align.

## Cost Elements — the FI-CO Bridge

A **cost element** classifies *what kind* of cost is being incurred. There are two types, and the distinction is fundamental.

### Primary Cost Elements

A **primary cost element** has a direct one-to-one link to an **FI G/L account** — salaries, raw materials, utilities. When you post such an expense in FI *with* a cost object (like a cost center), the amount automatically flows into CO via the primary cost element. This is exactly what surprised Vikram: the FI posting and the CO posting are two views of one event.

### Secondary Cost Elements

A **secondary cost element** exists *only in CO* — it has no FI G/L counterpart. It's used for **internal allocations**: assessments, distributions, settlements, overhead. When CO moves cost from one cost center to another, it uses a secondary cost element so the movement is visible in CO but never touches FI.

## S/4HANA: Cost Elements ARE G/L Accounts

A major S/4HANA change: cost elements are **merged with G/L accounts** into a single master record. A primary cost element is now just a G/L account of type "primary costs/revenue"; a secondary cost element is a G/L account of type "secondary costs". One master record, maintained in \`FS00\`, instead of two parallel ones.

## Cost Element Categories

Each cost element has a **category** that controls how it can be used:

| Category | Meaning |
|----------|---------|
| **1** | Primary costs / cost-reducing revenue |
| **11** | Revenues |
| **21** | Internal settlement |
| **42** | Assessment |
| **43** | Internal activity allocation |

The category tells SAP whether a cost element can receive FI postings (primary) or only internal CO movements (secondary).

\`\`\`
FI: post salary to G/L (primary cost element) + cost center
   → CO: cost appears on the cost center automatically
   → CO internal allocation (secondary cost element) → moves cost between cost centers
\`\`\`

## Why It Matters

The controlling area and cost elements are the plumbing that makes "one number, two perspectives" possible. Finance gets its statutory G/L view; management gets its cost-center and profit-center view — from the *same* postings, with no duplicate entry. Get the controlling-area assignment or the cost-element setup wrong and either CO reports are empty (no primary cost elements) or FI and CO disagree (mismatched fiscal year variants). For Vikram, understanding this link means he can finally trust that his cost reports and his financial statements are telling the same story.`,
    keyConceptTitle: "Primary Cost Elements Bridge FI to CO; Secondary Live Only in CO",
    keyConceptBody: `- The **Controlling Area** is CO's master org unit — all cost/profit centers and orders belong to one; it links to company codes 1:1 or many:1, and the **fiscal year variant must match**.
- **Primary cost elements** have a 1:1 link to FI **G/L accounts** (salaries, materials) — posting such an expense with a cost object flows the cost into CO automatically (the FI-CO integration).
- **Secondary cost elements** exist only in CO for internal allocations (assessment, distribution, settlement) and never touch FI.
- In **S/4HANA**, cost elements are merged into G/L accounts (one master in \`FS00\`); the **cost element category** (1 primary, 11 revenue, 21 settlement, 42 assessment, 43 activity allocation) controls usage.`,
  },
});
const flowchart2_17 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_17.id },
  update: {},
  create: {
    lessonId: lesson2_17.id,
    title: "How Cost Elements Bridge FI and CO",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "📊 Controlling Area (frames all CO)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "🧾 FI posting: salary G/L + cost center" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 220 }, data: { label: "🔗 G/L = Primary Cost Element" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 320 }, data: { label: "🎯 Cost appears on cost center (CO)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 420 }, data: { label: "♻️ Internal allocation (secondary CE)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 520 }, data: { label: "📈 Management cost reports" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default", label: "auto-flows" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_17.id, nodeId: "node1", title: "Controlling Area", description: "CO's master org unit. Every cost center, profit center, and order belongs to exactly one controlling area, whose fiscal year variant must match the company code's.", tCode: "OKKP", tips: "A mismatched fiscal year variant between CO area and company code is a classic blocker — align them first." },
    { flowchartId: flowchart2_17.id, nodeId: "node2", title: "FI Posting With Cost Object", description: "A normal FI expense posting (e.g. salary) that also carries a cost center. The cost object is what pulls the posting into CO.", tCode: "FB50", tips: "If no cost object is entered on an expense line that requires one, SAP errors — CO needs to know where the cost lands." },
    { flowchartId: flowchart2_17.id, nodeId: "node3", title: "G/L = Primary Cost Element", description: "The expense G/L is also a primary cost element (in S/4HANA, the same master record). This dual identity is the FI-CO bridge.", tCode: "FS00", tips: "In S/4HANA you set the G/L account type to 'primary costs/revenue' to make it a primary cost element." },
    { flowchartId: flowchart2_17.id, nodeId: "node4", title: "Cost on Cost Center", description: "The amount automatically appears on the assigned cost center in CO — no re-keying. FI and CO now show the same event from two angles.", tCode: "KSB1", tips: "Use KSB1 (cost center line items) to trace exactly which FI documents fed a cost center." },
    { flowchartId: flowchart2_17.id, nodeId: "node5", title: "Internal Allocation", description: "CO can move cost between cost centers (assessment, distribution, settlement) using secondary cost elements that exist only in CO and never hit FI.", tCode: "KSU5 / KSV5", tips: "Secondary cost elements keep internal reallocations invisible to FI while reshaping management reporting." },
    { flowchartId: flowchart2_17.id, nodeId: "node6", title: "Management Reports", description: "The collected and allocated costs feed cost-center and profit-center reports that managers use — all derived from the same postings as the financial statements.", tCode: "S_ALR_87013611", tips: "Because it's the same data, management and statutory views always reconcile when set up correctly." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_17.id },
  update: {},
  create: {
    lessonId: lesson2_17.id,
    title: "Controlling Area & Cost Elements — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the key difference between a primary and a secondary cost element?",
          explanation: "A primary cost element has a 1:1 link to an FI G/L account (e.g. salaries, materials) and carries FI postings into CO. A secondary cost element exists only in CO for internal allocations (assessment, distribution, settlement) and has no FI G/L counterpart.",
          options: {
            create: [
              { text: "A primary cost element links 1:1 to an FI G/L account; a secondary cost element exists only in CO for internal allocations", isCorrect: true },
              { text: "A secondary cost element links to FI; a primary one is CO-only", isCorrect: false },
              { text: "They are identical and interchangeable", isCorrect: false },
              { text: "Primary cost elements are only used for revenue, secondary only for tax", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "In S/4HANA, how are cost elements represented?",
          explanation: "S/4HANA merges cost elements with G/L accounts into a single master record (maintained in FS00). A primary cost element is a G/L account of type 'primary costs/revenue'; a secondary cost element is one of type 'secondary costs'.",
          options: {
            create: [
              { text: "They are merged into G/L accounts as a single master record, distinguished by account type", isCorrect: true },
              { text: "They are stored in a completely separate system from G/L accounts", isCorrect: false },
              { text: "They no longer exist in S/4HANA", isCorrect: false },
              { text: "They are the same as profit centers", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Vikram posts a salary expense in FI with a cost center and sees it instantly in a CO cost report without re-entry. What makes this happen?",
          explanation: "The salary G/L account is also a primary cost element, and the posting carries a cost object (cost center). That dual identity is the FI-CO integration: an FI expense posted to a cost object automatically flows into CO as a cost.",
          options: {
            create: [
              { text: "The G/L account is a primary cost element and the posting carries a cost center, so the FI expense flows into CO automatically", isCorrect: true },
              { text: "A background job copies all FI documents into CO once a day", isCorrect: false },
              { text: "Someone on the CO team re-keyed the entry", isCorrect: false },
              { text: "Secondary cost elements pull FI postings into CO", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.18: Internal Orders (CO-OM-OPA)
const lesson2_18 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-internal-orders" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Internal Orders (CO-OM-OPA)",
    slug: "fico-internal-orders",
    order: 18,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `The marketing head of a consumer brand is launching a three-month festival campaign and wants one question answered cleanly: "What did this specific campaign cost, and did we stay within the ₹20 lakh budget?" The problem is that the costs — agency fees, printing, event staff, digital ads — are scattered across normal cost centers, making it impossible to isolate the campaign.

Ramesh, the FICO consultant, sets up an **internal order** as a dedicated cost collector for the campaign. Every rupee spent is posted to the order, availability control blocks spending past ₹20 lakh, and at the end the costs are settled to the marketing cost center. The campaign's true cost is now a single, clean number. This lesson is about internal orders — temporary buckets for tracking the cost of a specific event or initiative.`,
    content: `## What an Internal Order Is

An **Internal Order** is a *temporary cost collector* for a specific event, campaign, or small project. Where a cost center is permanent (the "Marketing department" exists forever), an internal order is created for one purpose and closed when it's done. Typical uses: a marketing campaign, an office renovation, a trade fair, a small R&D project.

## The Lifecycle

An internal order moves through a clear cycle:

| Step | Transaction | What happens |
|------|-------------|--------------|
| **Create** | \`KO01\` | Set up the order with its order type |
| **Plan / Budget** | \`KO12\` (plan), \`KO22\` (budget) | Enter planned costs and an approved budget |
| **Post costs** | (various) | Actual costs are charged to the order |
| **Settle** | \`KO88\` | Move accumulated costs to a receiver (cost center, G/L, or asset) |

After settlement the order's balance is **zero** — its costs have been passed on to their permanent home.

## Order Types Control Behaviour

When you create an order you pick an **order type**, which controls the key profiles:

- **Settlement profile** — what the order can settle to and how,
- **Planning profile** — how planning works,
- **Budget profile** — how budgeting and availability control behave.

The order type is the template; the individual order inherits its rules.

## Budget & Availability Control

This is what answers the marketing head's second question. You set a budget with \`KO22\`, and **availability control** monitors actual + committed costs against it. When a posting would breach the budget, SAP can **warn or block** it. That's how Ramesh guarantees the campaign can't quietly overspend its ₹20 lakh.

\`\`\`
KO01 create → KO22 budget (₹20 lakh) → post costs (availability control checks)
   → KO88 settle to marketing cost center → order balance = 0
\`\`\`

## Settlement — Closing the Loop

At the end, **settlement** (\`KO88\`) transfers the costs collected on the order to their final destination: a **cost center** (most common for campaigns), a **G/L account**, or an **asset** (if the order was building something capital, like a renovation). Settlement is what keeps the order temporary — it empties into a permanent object and is then closed.

## Internal Orders vs WBS Elements

A common exam point: when to use an internal order versus a **WBS element** (Project System).

| Internal Order | WBS Element |
|----------------|-------------|
| Shorter, simpler activities | Complex, multi-phase projects |
| One cost collector | Hierarchical project structure |
| Marketing campaign, trade fair | Plant construction, large IT rollout |

Internal orders are the lightweight choice; WBS is for genuine project complexity.

## Why It Matters

Finance teams use internal orders to answer "what did *this thing* cost?" without disturbing normal cost-center reporting. The campaign's spend is tracked in isolation, controlled against budget in real time, and cleanly reported as actual-vs-plan — then settled away so it doesn't permanently clutter the books. For the marketing head, the internal order turns a scattered, unanswerable cost question into a single trustworthy figure, with the comfort that the budget was enforced automatically along the way.`,
    keyConceptTitle: "Internal Orders Are Temporary Cost Collectors — Plan, Budget, Post, Settle",
    keyConceptBody: `- An **Internal Order** is a *temporary* cost collector for a specific event/campaign/small project (vs the permanent cost center).
- Lifecycle: **Create** \`KO01\` → **Plan/Budget** \`KO12\`/\`KO22\` → **post costs** → **Settle** \`KO88\` to a cost center, G/L, or asset, leaving the order balance at zero.
- The **order type** controls the settlement, planning, and budget profiles; **availability control** (\`KO22\`) warns or blocks postings that would exceed the budget.
- Use internal orders for short, simple activities; use **WBS elements** (Project System) for complex, multi-phase projects.`,
  },
});
const flowchart2_18 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_18.id },
  update: {},
  create: {
    lessonId: lesson2_18.id,
    title: "The Internal Order Lifecycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🆕 Create order KO01 (order type)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "💵 Set budget KO22 (₹20 lakh)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 220 }, data: { label: "🧾 Post actual costs to order" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 320 }, data: { label: "🚦 Availability control checks budget" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 420 }, data: { label: "📦 Settle KO88 → cost center / asset" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 520 }, data: { label: "✅ Order balance = 0, true cost known" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default", label: "within budget" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_18.id, nodeId: "node1", title: "Create Order (KO01)", description: "Set up the internal order and assign its order type, which determines the settlement, planning, and budget profiles it will use.", tCode: "KO01", tips: "Choose the right order type up front — it locks in how the order can be budgeted and settled." },
    { flowchartId: flowchart2_18.id, nodeId: "node2", title: "Set Budget (KO22)", description: "Enter the approved budget for the order. This is the figure availability control will police as costs come in.", tCode: "KO22", tips: "KO12 is for planning (expected costs); KO22 is the hard budget that triggers availability control." },
    { flowchartId: flowchart2_18.id, nodeId: "node3", title: "Post Actual Costs", description: "Real costs — agency fees, printing, event staff, ads — are charged to the order instead of being lost across cost centers.", tCode: null, tips: "Reference the internal order on each relevant invoice/posting so the cost lands in the right collector." },
    { flowchartId: flowchart2_18.id, nodeId: "node4", title: "Availability Control", description: "As costs accumulate, SAP checks actual + committed against the budget and can warn or block a posting that would exceed it.", tCode: null, tips: "Configure tolerance levels (e.g. warn at 90%, block at 100%) in the budget profile." },
    { flowchartId: flowchart2_18.id, nodeId: "node5", title: "Settle (KO88)", description: "At completion, accumulated costs are settled to a receiver — a cost center (campaigns), a G/L account, or an asset (capital projects like renovations).", tCode: "KO88", tips: "Settlement to an asset is how an internal order can build an asset under construction before capitalisation." },
    { flowchartId: flowchart2_18.id, nodeId: "node6", title: "Order Closed", description: "After settlement the order balance is zero and its true total cost is known as a single figure, ready for actual-vs-plan reporting.", tCode: "KOB1", tips: "Use KOB1 to review all line items posted to the order before and after settlement." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_18.id },
  update: {},
  create: {
    lessonId: lesson2_18.id,
    title: "Internal Orders (CO-OM-OPA) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to settle an internal order's accumulated costs to a receiver?",
          explanation: "KO88 settles an internal order, transferring its accumulated costs to a receiver (cost center, G/L account, or asset). After settlement the order balance becomes zero.",
          options: {
            create: [
              { text: "KO88", isCorrect: true },
              { text: "KO01", isCorrect: false },
              { text: "KO22", isCorrect: false },
              { text: "KS01", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How does an internal order differ from a cost center?",
          explanation: "A cost center is a permanent organizational unit; an internal order is a temporary cost collector created for a specific event, campaign, or small project and closed (settled to zero) once complete.",
          options: {
            create: [
              { text: "A cost center is permanent; an internal order is a temporary collector for a specific event/project, settled and closed when done", isCorrect: true },
              { text: "An internal order is permanent; a cost center is temporary", isCorrect: false },
              { text: "They are the same object with different names", isCorrect: false },
              { text: "An internal order can only hold revenue, never costs", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "The marketing head wants this campaign's costs isolated AND guaranteed not to exceed ₹20 lakh. How does an internal order deliver both?",
          explanation: "The internal order collects all campaign costs in one place (isolating them from normal cost centers), and availability control on the order's budget (set via KO22) warns or blocks any posting that would exceed ₹20 lakh — enforcing the limit automatically.",
          options: {
            create: [
              { text: "Costs post to the order (isolating them) and availability control on the KO22 budget warns/blocks any spend over ₹20 lakh", isCorrect: true },
              { text: "The order automatically refunds any overspend at month-end", isCorrect: false },
              { text: "The order spreads the costs evenly across all cost centers", isCorrect: false },
              { text: "Internal orders have no budget capability — only WBS elements do", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.19: Product Cost Planning (CO-PC)
const lesson2_19 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-product-cost-planning" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Product Cost Planning (CO-PC)",
    slug: "fico-product-cost-planning",
    order: 19,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A week before go-live at an auto-parts manufacturer, production tries to do a goods receipt for a finished brake disc — and the system refuses, because the material has no valuation price. The plant manager is alarmed: "We can't even receive our own production into stock?" Arjun, the FICO consultant, traces it instantly: no **standard cost estimate** has been released, so SAP has no price to value the goods at.

Product Cost Planning answers a deceptively deep question — *what should it cost to make one unit of this product?* — by adding up materials, labour, and overhead into a standard cost. That standard becomes the material's valuation price. Without a released estimate, production literally cannot post. This lesson explains how CO-PC builds that number and why it's a classic go-live blocker.`,
    content: `## The Question CO-PC Answers

**Product Cost Planning (CO-PC)** calculates: *what should it cost to produce one unit of this product?* The answer — the **standard cost** — drives inventory valuation, variance analysis, and profitability. It's built *before* production from planned data.

## Building the Standard Cost Estimate

The process centres on the **cost estimate**:

| Step | Transaction | What happens |
|------|-------------|--------------|
| **Create estimate** | \`CK11N\` | Calculate the standard cost from BOM + routing |
| **Mark & release** | \`CK24\` | Mark the future price, then release it as the standard price |

\`CK11N\` reads the **bill of materials** (which materials and how much) and the **routing** (which operations, on which work centers, taking how long), then values them to produce the standard cost.

## The Three Cost Components

A standard cost estimate is the sum of three building blocks:

1. **Raw material cost** — quantity from the BOM × material price.
2. **Activity cost** — machine/labour hours from the routing × an **activity rate**.
3. **Overhead** — a surcharge (%) applied via a **costing sheet**.

\`\`\`
Standard cost = raw materials (BOM × price)
              + activities (routing hours × activity rate)
              + overhead (% via costing sheet)
\`\`\`

## Where the Rates Come From

- **Activity rates** are planned in **\`KP26\`** — cost center activity planning. The machine-hour rate, for instance, is *total planned cost ÷ planned hours* for that activity. This is the rate \`CK11N\` multiplies the routing hours by.
- **Overhead** is applied through a **costing sheet** as a percentage surcharge on material or labour cost (e.g. 5% material overhead for procurement/handling).
- The **costing variant** controls *which prices* the estimate uses (planned price, moving average, standard) and how the estimate is structured.

## Releasing Sets the Material Master Price

When you **release** the estimate (\`CK24\`), the result is written to the material master as the **standard price**. From that moment, every goods movement for the material — including goods receipt from production — is valued at this price. Arjun's blocker was simply that this step had never been done.

## Variance Analysis

At period end, the **actual** production cost is compared with the **standard** cost. The difference is a **variance**, broken into types:

- **Price variance** — actual input prices differed from planned,
- **Quantity variance** — more/less material consumed than the BOM,
- **Efficiency variance** — operations took more/less time than the routing.

Variances tell management where reality diverged from the plan and feed into period-end settlement.

## Why It Matters

Without a released standard cost estimate, SAP cannot value goods receipts from production — a hard **go-live blocker**, exactly what stopped the brake-disc receipt. Beyond go-live, the standard cost is the yardstick the whole manufacturing operation is measured against: inventory is valued at it, profitability is calculated against it, and variances reveal inefficiency. For Arjun, marking and releasing the estimate in \`CK24\` is a five-minute fix — but understanding *why* it matters is what makes him a credible CO-PC consultant.`,
    keyConceptTitle: "Standard Cost = Materials + Activities + Overhead; Release It or Production Can't Post",
    keyConceptBody: `- **Product Cost Planning (CO-PC)** computes the standard cost of one unit: create the estimate with \`CK11N\` (from BOM + routing), then **mark and release** with \`CK24\`.
- The estimate sums three components: **raw material cost** (BOM × price), **activity cost** (routing hours × activity rate from \`KP26\`), and **overhead** (% via the costing sheet); the **costing variant** controls which prices are used.
- **Releasing** writes the result to the material master as the **standard price** — the valuation price for all goods movements, including goods receipt from production.
- At period end, **actual vs standard** = **variances** (price, quantity, efficiency). A missing released estimate is a hard **go-live blocker** — production can't value goods receipts.`,
  },
});
const flowchart2_19 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_19.id },
  update: {},
  create: {
    lessonId: lesson2_19.id,
    title: "Building & Releasing a Standard Cost Estimate",
    nodes: [
      { id: "node1", type: "default", position: { x: 90, y: 40 }, data: { label: "🧱 BOM (materials)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 90, y: 140 }, data: { label: "⏱️ Routing (hours)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 90, y: 240 }, data: { label: "💹 Activity rates (KP26)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 350, y: 140 }, data: { label: "🧮 Cost estimate CK11N" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 350, y: 250 }, data: { label: "➕ Overhead (costing sheet)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 600, y: 140 }, data: { label: "✅ Mark & release CK24" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 600, y: 250 }, data: { label: "🏷️ Standard price on material master" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 600, y: 360 }, data: { label: "📊 Period end: actual vs std = variance" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node4", type: "default" },
      { id: "e2", source: "node2", target: "node4", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node5", target: "node4", type: "default" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
      { id: "e7", source: "node7", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_19.id, nodeId: "node1", title: "Bill of Materials", description: "Lists which components and quantities go into the product. Multiplied by material prices, this gives the raw material cost component.", tCode: "CS01", tips: "An inaccurate BOM directly distorts the standard cost — keep it current with engineering changes." },
    { flowchartId: flowchart2_19.id, nodeId: "node2", title: "Routing", description: "Defines the operations, work centers, and standard times to make the product. Drives the activity (labour/machine) cost component.", tCode: "CA01", tips: "Routing times × activity rates = activity cost; both must be realistic for a meaningful standard." },
    { flowchartId: flowchart2_19.id, nodeId: "node3", title: "Activity Rates (KP26)", description: "Planned cost center rates — e.g. machine-hour rate = total planned cost ÷ planned hours. CK11N multiplies routing hours by these rates.", tCode: "KP26", tips: "Plan activity rates before costing — without them, activity costs are zero or blocked." },
    { flowchartId: flowchart2_19.id, nodeId: "node4", title: "Cost Estimate (CK11N)", description: "Pulls the BOM, routing, activity rates, and overhead together and calculates the standard cost of one unit.", tCode: "CK11N", tips: "Review the itemization in CK11N to see exactly how material, activity, and overhead build up the cost." },
    { flowchartId: flowchart2_19.id, nodeId: "node5", title: "Overhead (Costing Sheet)", description: "Applies indirect costs as a percentage surcharge on material or labour cost — e.g. procurement handling or admin overhead.", tCode: "KZS2", tips: "The costing sheet defines the base, the rate, and the credit object for overhead." },
    { flowchartId: flowchart2_19.id, nodeId: "node6", title: "Mark & Release (CK24)", description: "Marking sets the future standard price; releasing makes it active. This is the step that writes the price to the material master.", tCode: "CK24", tips: "This is the step Arjun's project missed — without release, there's no valuation price." },
    { flowchartId: flowchart2_19.id, nodeId: "node7", title: "Standard Price Set", description: "The released cost becomes the material's standard price, used to value every goods movement including goods receipt from production.", tCode: "MM03", tips: "Check the accounting view of the material master to confirm the standard price is populated." },
    { flowchartId: flowchart2_19.id, nodeId: "node8", title: "Variance Analysis", description: "At period end, actual production cost is compared to standard. Differences become price, quantity, and efficiency variances for management.", tCode: "KKS1", tips: "Variances feed period-end settlement and reveal where production diverged from plan." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_19.id },
  update: {},
  create: {
    lessonId: lesson2_19.id,
    title: "Product Cost Planning (CO-PC) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to mark and release a standard cost estimate so it updates the material master price?",
          explanation: "CK24 marks and releases the cost estimate. Releasing writes the calculated standard cost to the material master as the standard price, which then values all goods movements. CK11N only creates the estimate.",
          options: {
            create: [
              { text: "CK24", isCorrect: true },
              { text: "CK11N", isCorrect: false },
              { text: "KP26", isCorrect: false },
              { text: "KKS1", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What three components make up a standard cost estimate?",
          explanation: "A standard cost estimate sums raw material cost (BOM quantity × price), activity cost (routing hours × activity rate from KP26), and overhead (a percentage surcharge applied via the costing sheet).",
          options: {
            create: [
              { text: "Raw material cost + activity cost (hours × rate) + overhead (% via costing sheet)", isCorrect: true },
              { text: "Revenue + discount + freight", isCorrect: false },
              { text: "Input tax + output tax + jurisdiction tax", isCorrect: false },
              { text: "Depreciation + interest + dividends", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "At go-live, production cannot post a goods receipt for a finished product because it has no valuation price. What is the cause and fix?",
          explanation: "No standard cost estimate has been released, so the material has no standard price to value goods at. The fix is to create the estimate (CK11N) and mark/release it (CK24), which writes the standard price to the material master — a classic go-live blocker.",
          options: {
            create: [
              { text: "No released cost estimate exists; create it in CK11N and mark/release in CK24 to set the standard price", isCorrect: true },
              { text: "The plant is closed for posting; open the posting period only", isCorrect: false },
              { text: "The vendor master is missing; create the vendor", isCorrect: false },
              { text: "Foreign currency valuation must be run first", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.20: Profitability Analysis (CO-PA)
const lesson2_20 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-profitability-analysis" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Profitability Analysis (CO-PA)",
    slug: "fico-profitability-analysis",
    order: 20,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `The CFO of an FMCG company drops a question on the finance team that the standard P&L can't answer: "Show me the contribution margin for our snacks line, sold to modern-trade customers, in the North region, for Q3." The general ledger knows total revenue and total COGS — but it has no idea how to slice them by product line, customer type, and region all at once.

Priyanka, the FICO consultant, smiles, because this is exactly what **Profitability Analysis (CO-PA)** is built for. Every billing document and goods issue feeds CO-PA, tagged with characteristics like product, customer, and region, so the margin can be sliced any way the CFO wants. This lesson explains CO-PA — the CFO's favourite tool — and the difference between its two flavours.`,
    content: `## The Question CO-PA Answers

**Profitability Analysis (CO-PA)** answers: *how profitable are we — by product, customer, region, or sales channel?* The standard G/L gives totals; CO-PA gives **multidimensional margin** — revenue minus costs, sliced along any business dimension you choose.

## Two Types of CO-PA

There are two implementations, and knowing the difference is essential:

| Type | Character |
|------|-----------|
| **Costing-based PA** | Uses value fields; faster reporting; more common historically; can show contribution margin before FI posts COGS |
| **Account-based PA** | Uses G/L accounts; always reconciles to FI; **mandatory in S/4HANA** |

Costing-based PA stores amounts in **value fields** and was long the popular choice for speed and flexibility. Account-based PA mirrors FI accounts exactly, so it always ties to the general ledger — which is why S/4HANA standardises on it (often both run together).

## The Two Core Building Blocks

CO-PA is defined by two things:

- **Characteristics** — the *dimensions* you analyse by: customer, material, sales organisation, country, sales representative, region, distribution channel. These are the "slice by" axes.
- **Value fields** — the *amounts*: revenue, COGS, discounts, freight, rebates, contribution margin. (Account-based PA uses G/L accounts instead of value fields.)

A CO-PA record is essentially: "for *this* combination of characteristics, here are *these* amounts."

## How Data Flows In

CO-PA fills automatically from the operational flow:

\`\`\`
SD billing document → CO-PA: revenue + discounts, split by characteristic
Goods issue to sales order → COGS flows to CO-PA
   → margin available by any characteristic combination
\`\`\`

Every **SD billing document** posts revenue and deductions into CO-PA, broken down by the characteristics on the order. Every **goods issue** to a sales order pushes COGS into CO-PA. The result: a complete margin picture tagged with product, customer, region, and more.

## The Operating Concern

The configuration object that defines *which* characteristics and value fields exist is the **operating concern** — the top of the CO-PA structure (and the top of the whole CO hierarchy). Everything you can slice by in CO-PA is defined here.

## Reporting

The classic CO-PA report is the **drilldown report** built in **\`KE30\`**, which lets users analyse profitability by any combination of characteristics — exactly the CFO's "snacks line, modern trade, North, Q3" query. You start broad (region) and drill into detail (product within region within customer type).

## Why It Matters

The general ledger tells you *whether* you made money; CO-PA tells you *where* the money was made and lost. That's why it's the CFO's favourite tool — it turns a flat P&L into a profitability map that drives decisions: which products to push, which customers are unprofitable, which regions to invest in. For Priyanka, designing the operating concern's characteristics and value fields correctly is what determines whether the business can answer questions like the CFO's — or is left staring at totals it can't break down.`,
    keyConceptTitle: "CO-PA Slices Margin by Characteristics; Account-Based PA Is Mandatory in S/4HANA",
    keyConceptBody: `- **Profitability Analysis (CO-PA)** reports margin by product, customer, region, or channel — multidimensional profitability the flat G/L can't provide.
- Two types: **costing-based PA** (uses **value fields**, fast, historically common) and **account-based PA** (uses **G/L accounts**, always reconciles to FI, **mandatory in S/4HANA**).
- Built from **characteristics** (the slice-by dimensions: customer, material, region…) and **value fields** (revenue, COGS, discounts, margin); both are defined in the **operating concern**.
- Data flows in automatically: **SD billing** → revenue/discounts, **goods issue** → COGS; the drilldown report **\`KE30\`** analyses any characteristic combination.`,
  },
});
const flowchart2_20 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_20.id },
  update: {},
  create: {
    lessonId: lesson2_20.id,
    title: "How Data Flows Into CO-PA",
    nodes: [
      { id: "node1", type: "default", position: { x: 90, y: 60 }, data: { label: "🧾 SD billing → revenue + discounts" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 90, y: 180 }, data: { label: "📦 Goods issue → COGS" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 360, y: 120 }, data: { label: "🧩 Tagged with characteristics" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 360, y: 230 }, data: { label: "💹 Stored in value fields / accounts" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 620, y: 120 }, data: { label: "🗂️ Operating Concern (defines all)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 620, y: 240 }, data: { label: "📊 Drilldown report KE30" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 620, y: 350 }, data: { label: "🎯 Margin by product/customer/region" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node3", type: "default" },
      { id: "e2", source: "node2", target: "node4", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node5", target: "node3", type: "default", label: "defines" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_20.id, nodeId: "node1", title: "SD Billing Document", description: "Every customer billing posts revenue and deductions (discounts, rebates) into CO-PA, broken down by the characteristics on the sales order.", tCode: "VF01", tips: "The characteristic values (customer, material, region) are derived from the order/customer/material masters at billing." },
    { flowchartId: flowchart2_20.id, nodeId: "node2", title: "Goods Issue", description: "When goods are issued against a sales order, the cost of goods sold flows to CO-PA, completing the revenue-minus-cost margin picture.", tCode: "VL01N", tips: "COGS in CO-PA is valued from the material's standard price — another reason a released cost estimate matters." },
    { flowchartId: flowchart2_20.id, nodeId: "node3", title: "Characteristics", description: "The dimensions you slice by — customer, material, sales org, country, region, sales rep. Each CO-PA line is tagged with a combination of these.", tCode: "KEA5", tips: "Choose characteristics carefully at design time — adding them later is disruptive." },
    { flowchartId: flowchart2_20.id, nodeId: "node4", title: "Value Fields / Accounts", description: "The amounts: revenue, COGS, discounts, freight, contribution margin. Costing-based PA uses value fields; account-based PA uses G/L accounts.", tCode: "KEA6", tips: "Account-based PA always reconciles to FI; costing-based PA can show margin before FI posts COGS." },
    { flowchartId: flowchart2_20.id, nodeId: "node5", title: "Operating Concern", description: "The configuration object at the top of CO-PA that defines which characteristics and value fields exist. The whole analysis is bounded by it.", tCode: "KEA0", tips: "One operating concern can span the group, giving consolidated profitability across company codes." },
    { flowchartId: flowchart2_20.id, nodeId: "node6", title: "Drilldown Report (KE30)", description: "The classic CO-PA report. Users analyse profitability by any combination of characteristics, drilling from broad (region) into detail (product, customer).", tCode: "KE30", tips: "Build reusable KE30 reports for the questions the CFO asks repeatedly — margin by line, by region, by channel." },
    { flowchartId: flowchart2_20.id, nodeId: "node7", title: "Multidimensional Margin", description: "The payoff: contribution margin viewable by product, customer, region, or channel — the profitability map the flat P&L can't produce.", tCode: null, tips: "This is what turns 'did we make money?' into 'where did we make and lose money?'" },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_20.id },
  update: {},
  create: {
    lessonId: lesson2_20.id,
    title: "Profitability Analysis (CO-PA) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In CO-PA, what is the difference between characteristics and value fields?",
          explanation: "Characteristics are the dimensions you analyse by (customer, material, region, channel) — the 'slice by' axes. Value fields are the amounts (revenue, COGS, discounts, margin). Together they form a record: for this combination of characteristics, here are these amounts.",
          options: {
            create: [
              { text: "Characteristics are the dimensions to slice by (customer, region); value fields are the amounts (revenue, COGS, margin)", isCorrect: true },
              { text: "Characteristics are the amounts; value fields are the dimensions", isCorrect: false },
              { text: "They are two names for the same thing", isCorrect: false },
              { text: "Characteristics store tax codes; value fields store cost centers", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which type of CO-PA always reconciles to FI and is mandatory in S/4HANA?",
          explanation: "Account-based CO-PA uses G/L accounts, so it always reconciles to financial accounting, and it is mandatory in S/4HANA. Costing-based PA uses value fields and is faster/more flexible but does not inherently tie to FI accounts.",
          options: {
            create: [
              { text: "Account-based CO-PA", isCorrect: true },
              { text: "Costing-based CO-PA", isCorrect: false },
              { text: "Ledger-based CO-PA", isCorrect: false },
              { text: "Segment-based CO-PA", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "The CFO wants contribution margin for the snacks line, modern-trade customers, North region, Q3 — which the standard P&L can't give. How does CO-PA answer this?",
          explanation: "CO-PA captures revenue (from SD billing) and COGS (from goods issue) tagged with characteristics like product line, customer type, and region. A KE30 drilldown report can then slice margin by any combination of those characteristics — exactly the CFO's multidimensional question.",
          options: {
            create: [
              { text: "CO-PA tags revenue and COGS with characteristics (product, customer type, region), so a KE30 drilldown slices margin by that exact combination", isCorrect: true },
              { text: "The general ledger trial balance already shows margin by region", isCorrect: false },
              { text: "Foreign currency valuation breaks the margin down by region", isCorrect: false },
              { text: "Document splitting produces the regional margin automatically", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.21: Asset Accounting Deep Dive (FI-AA)
const lesson2_21 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-asset-accounting-deep-dive" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Asset Accounting Deep Dive (FI-AA)",
    slug: "fico-asset-accounting-deep-dive",
    order: 21,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `During a statutory audit, the auditor picks one machine from the fixed-asset register and fires a series of questions at Sunita, the FICO consultant: "What's its book depreciation? Its tax depreciation? Its IFRS value? When was it capitalised, which cost center carries the depreciation, and what happens when we sell it next year?" A single asset, and every answer must come from SAP cleanly.

This is the world of **Asset Accounting (FI-AA)** beyond the basics — where one asset simultaneously depreciates differently for the books, the tax authority, and IFRS, where acquisitions and retirements post precise gains and losses, and where the year-end close in AA must finish before FI can close. This lesson goes deep on the asset lifecycle that auditors scrutinise hardest.`,
    content: `## The Asset Master — One Asset, Many Views

The **asset master** (\`AS01\`) holds everything about a fixed asset: its **depreciation areas**, **useful life**, **cost center**, and **capitalization date**. The crucial idea is that one physical asset is valued *several ways at once* through its depreciation areas.

## Depreciation Areas — Parallel Valuations

A **depreciation area** is one valuation view of the asset. The same machine can carry:

| Area | Purpose |
|------|---------|
| **01** | Book depreciation (local GAAP / statutory) |
| **15** | Tax depreciation (for the tax authority) |
| **30** | IFRS / group depreciation |

Each area can use a **different method and useful life** — this is how Sunita answers "book vs tax vs IFRS" for one asset.

## Depreciation Methods

Common methods include:

- **Straight line (SL)** — equal depreciation each period over the useful life,
- **Declining balance (DB)** — higher depreciation early, tapering off,
- **Units of production** — depreciation tied to actual output.

Different areas often use different methods (e.g. SL for the books, an accelerated method for tax).

## The Asset Lifecycle

\`\`\`
Acquire (F-90 / MIGO / AB01) → Depreciate monthly (AFAB)
   → maybe Transfer (ABUMN) → Retire (ABAVN) → Year-end (AJAB)
\`\`\`

### Acquisition
- **\`F-90\`** — acquisition *with vendor* (integrated with AP),
- **MIGO** — goods receipt for an asset purchase order,
- **\`AB01\`** — manual/direct acquisition posting.

### Depreciation Run
- **\`AFAB\`** — the monthly depreciation batch that posts depreciation to the **cost center** (CO) and the **G/L** (FI). This is the recurring engine of FI-AA.

### Retirement
- **\`ABAVN\`** — retirement *without customer* (scrapping/disposal): removes the asset from the books and posts the **gain or loss on disposal**.

### Transfer
- **\`ABUMN\`** — transfers an asset between cost centers or company codes.

## Assets Under Construction (AuC)

While something is being built, costs accumulate on an **Asset under Construction**. On completion, the AuC is **settled** to the final asset, which then begins normal depreciation. This is how capital projects flow into the asset register.

## Year-End in AA — Sequence Matters

Asset accounting has its own year-end step: **\`AJAB\`** (fiscal year close in AA). Critically, **AJAB must run before the FI year-end close** — you cannot close the financial year while the asset year is still open. This ordering is a frequent exam and project point.

## Why It Matters

Fixed assets are **heavily audited**: every asset must have an asset master, a correct useful life, a documented depreciation method, and a clear audit trail for acquisition and disposal. The parallel depreciation areas are what let a single asset satisfy the books, the tax authority, and IFRS simultaneously — without three separate registers. And the AA year-end-before-FI ordering is exactly the kind of sequencing that, if missed, blocks the entire close. For Sunita, mastering this lifecycle is what lets her answer every one of the auditor's questions from one clean asset record.`,
    keyConceptTitle: "One Asset, Many Depreciation Areas; AA Year-End Closes Before FI",
    keyConceptBody: `- The **asset master** (\`AS01\`) holds depreciation areas, useful life, cost center, and capitalization date; **depreciation areas** (01 book, 15 tax, 30 IFRS) value one asset several ways with different methods/lives.
- Methods include **straight line**, **declining balance**, and **units of production**; **\`AFAB\`** is the monthly depreciation run posting to cost center and G/L.
- Lifecycle: acquire (\`F-90\` with vendor / MIGO / \`AB01\`) → depreciate (\`AFAB\`) → transfer (\`ABUMN\`) → retire (\`ABAVN\`, posts gain/loss); **AuC** accumulates project costs then settles to the final asset.
- **\`AJAB\`** (AA fiscal year close) **must run before the FI year-end close** — a critical sequencing rule.`,
  },
});
const flowchart2_21 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_21.id },
  update: {},
  create: {
    lessonId: lesson2_21.id,
    title: "The Fixed Asset Lifecycle (FI-AA)",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🆕 Asset master AS01 (dep. areas)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "💰 Acquire F-90 / MIGO / AB01" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 90, y: 220 }, data: { label: "🏗️ AuC → settle to final asset" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 220 }, data: { label: "📉 Depreciate monthly AFAB" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 320 }, data: { label: "🔁 Transfer ABUMN / Retire ABAVN" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 420 }, data: { label: "📅 AA year-end close AJAB" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 520 }, data: { label: "✅ Then FI year-end close" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default", label: "if capital project" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node4", type: "default", label: "settled" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
      { id: "e6", source: "node5", target: "node6", type: "default" },
      { id: "e7", source: "node6", target: "node7", type: "default", label: "must precede" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_21.id, nodeId: "node1", title: "Asset Master (AS01)", description: "Holds the asset's depreciation areas, useful life, cost center, and capitalization date. The depreciation areas let one asset be valued for book, tax, and IFRS at once.", tCode: "AS01", tips: "Every fixed asset must have a master record — auditors check this first." },
    { flowchartId: flowchart2_21.id, nodeId: "node2", title: "Acquisition", description: "Bring the asset onto the books: F-90 (with a vendor, integrated to AP), MIGO (goods receipt for an asset PO), or AB01 (manual posting).", tCode: "F-90 / AB01", tips: "Use F-90 when there's a vendor invoice; MIGO when procurement raised an asset PO." },
    { flowchartId: flowchart2_21.id, nodeId: "node3", title: "Asset Under Construction", description: "Costs for an asset being built accumulate on an AuC, then settle to the completed asset, which begins normal depreciation.", tCode: "AIAB / AIBU", tips: "AuC is how capital projects (and settled internal orders) become depreciable assets." },
    { flowchartId: flowchart2_21.id, nodeId: "node4", title: "Depreciation Run (AFAB)", description: "The monthly batch that posts depreciation to the cost center (CO) and the G/L (FI) across all depreciation areas, per their methods.", tCode: "AFAB", tips: "Run AFAB every period; a missed run blocks the depreciation schedule and the close." },
    { flowchartId: flowchart2_21.id, nodeId: "node5", title: "Transfer / Retirement", description: "ABUMN moves an asset between cost centers or company codes; ABAVN retires it (scrap/disposal), removing it from the books and posting a gain or loss.", tCode: "ABUMN / ABAVN", tips: "Retirement posts gain/loss on disposal — confirm the right revenue/scrap value before posting." },
    { flowchartId: flowchart2_21.id, nodeId: "node6", title: "AA Year-End (AJAB)", description: "Closes the fiscal year in Asset Accounting. It validates that depreciation is complete and locks the asset year.", tCode: "AJAB", tips: "AJAB will error if any depreciation is incomplete — clear those before attempting it." },
    { flowchartId: flowchart2_21.id, nodeId: "node7", title: "FI Year-End", description: "Only after AA is closed can the FI year-end close proceed. The ordering — AA before FI — is mandatory.", tCode: null, tips: "Trying to close FI with an open asset year is a classic year-end blocker." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_21.id },
  update: {},
  create: {
    lessonId: lesson2_21.id,
    title: "Asset Accounting Deep Dive (FI-AA) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the purpose of depreciation areas on an asset master?",
          explanation: "Depreciation areas let one asset be valued several ways simultaneously — e.g. area 01 for book depreciation, 15 for tax, 30 for IFRS — each with its own method and useful life, avoiding the need for separate asset registers.",
          options: {
            create: [
              { text: "They let one asset be valued in parallel for different purposes (book, tax, IFRS), each with its own method and useful life", isCorrect: true },
              { text: "They define which warehouse the asset is stored in", isCorrect: false },
              { text: "They set the customer who will buy the asset", isCorrect: false },
              { text: "They are the same as cost elements", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which transaction runs the monthly depreciation posting to the cost center and G/L?",
          explanation: "AFAB is the depreciation run — a periodic batch that posts depreciation to the cost center (CO) and the G/L (FI) across the asset's depreciation areas.",
          options: {
            create: [
              { text: "AFAB", isCorrect: true },
              { text: "AS01", isCorrect: false },
              { text: "ABAVN", isCorrect: false },
              { text: "AJAB", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "At year-end, the team tries to close the FI fiscal year but gets blocked because of asset accounting. What is the likely cause?",
          explanation: "The Asset Accounting fiscal year close (AJAB) must run before the FI year-end close. If AA is still open — or depreciation is incomplete so AJAB hasn't run — FI cannot be closed. The fix is to complete depreciation and run AJAB first.",
          options: {
            create: [
              { text: "AA's fiscal year close (AJAB) hasn't run yet — it must precede the FI year-end close", isCorrect: true },
              { text: "The FI close always runs before AA, so the order is irrelevant", isCorrect: false },
              { text: "Depreciation areas must be deleted before closing", isCorrect: false },
              { text: "The asset master needs a tax code in FTXP", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.22: Financial Statement Versions (FSV)
const lesson2_22 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-financial-statement-versions" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Financial Statement Versions (FSV)",
    slug: "fico-financial-statement-versions",
    order: 22,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A new controller joins a manufacturing company and runs the trial balance — hundreds of G/L accounts in a flat, unreadable list. "I can't hand this to the board," she tells Manoj, the FICO consultant. "I need a proper balance sheet and P&L — assets, liabilities, revenue, expenses — structured the way our auditors expect."

What she's describing is a **Financial Statement Version (FSV)** — the structure that turns a flat list of G/L accounts into a real balance sheet and profit-and-loss statement. Manoj builds one in \`OB58\`, assigns each account to the right node, and suddenly the same data renders as a board-ready financial statement. This lesson explains FSVs — the reporting backbone every company configures at project start.`,
    content: `## What an FSV Is

A **Financial Statement Version (FSV)** defines *how* SAP organises G/L accounts into a structured **balance sheet and P&L** for reporting. Without it, you have a flat list of accounts; with it, you have Assets → Liabilities → Equity and Revenue → Expenses arranged in a readable hierarchy.

## Building One — OB58

You create an FSV in **\`OB58\`** as a **tree of nodes**. The top-level nodes mirror the financial statements:

- Balance sheet side: **Assets**, **Liabilities**, **Equity**,
- P&L side: **Revenue**, **Expenses**.

Under each node you build sub-nodes (Current Assets, Non-current Assets, etc.) and assign the actual G/L accounts to the lowest nodes.

## Account Assignment — Including Multiple FSVs

Each G/L account is **assigned to a node**, which is where its balance appears in the statement. A powerful feature: an account can belong to **multiple FSVs** — so the same accounts can be structured one way for **local GAAP** and another for **IFRS**, each FSV presenting them differently.

## Standard Structures

A typical balance sheet FSV flows:

\`\`\`
Non-current Assets → Current Assets → Equity
   → Non-current Liabilities → Current Liabilities
\`\`\`

A typical P&L FSV flows:

\`\`\`
Revenue → Cost of Sales → Gross Profit → Operating Expenses
   → EBIT → Finance Costs → PBT → Tax → PAT
\`\`\`

This structure is what makes the output recognisable as a real financial statement rather than an account dump.

## Debit/Credit Assignment — the Subtle Part

Each node specifies whether a **debit or credit balance** counts as positive. This matters most for **liabilities and equity**, where a *credit* balance is the "normal" positive value. If you mis-set this, liabilities can show with the wrong sign and the statement won't read correctly. Accounts whose balance can swing either way are handled with separate debit/credit node assignments.

## Reporting With an FSV

The standard report that renders an FSV is **\`S_ALR_87012284\`** (financial statements). You run it for a company code and period, pick the FSV, and SAP produces the structured balance sheet and P&L — exactly what the new controller needs for the board.

## Why It Matters

The FSV is the bridge between the raw G/L and a presentable financial statement. Every company needs at least one FSV matching its **chart of accounts** and **local reporting requirements**, and often more than one (local GAAP + IFRS). It's typically built at **project start** and rarely changed afterwards, because it's the foundation that every financial report sits on. For Manoj, configuring the FSV correctly — right nodes, right account assignments, right debit/credit logic — is what lets the controller produce board-ready statements at the click of a report, instead of wrestling a flat trial balance into shape by hand.`,
    keyConceptTitle: "An FSV Turns a Flat G/L List Into a Structured Balance Sheet & P&L",
    keyConceptBody: `- A **Financial Statement Version (FSV)** organises G/L accounts into a structured **balance sheet and P&L**; it's built as a tree of nodes in **\`OB58\`**.
- Each G/L account is **assigned to a node**, and an account can sit in **multiple FSVs** (e.g. local GAAP and IFRS structured differently).
- Each node sets whether a **debit or credit balance is positive** — critical for liabilities/equity where a credit balance is the normal positive.
- The standard report **\`S_ALR_87012284\`** renders the FSV; every company needs an FSV matching its chart of accounts, usually set up at project start and rarely changed.`,
  },
});
const flowchart2_22 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_22.id },
  update: {},
  create: {
    lessonId: lesson2_22.id,
    title: "From G/L Accounts to a Structured Statement",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "📋 Flat list of G/L accounts" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "🌳 Build FSV tree in OB58" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 90, y: 230 }, data: { label: "🏦 Assets / Liabilities / Equity nodes" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 230 }, data: { label: "💵 Revenue / Expense nodes" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 340 }, data: { label: "🔗 Assign G/L accounts (debit/credit logic)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 440 }, data: { label: "📊 Report S_ALR_87012284" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 540 }, data: { label: "✅ Board-ready balance sheet & P&L" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
      { id: "e6", source: "node5", target: "node6", type: "default" },
      { id: "e7", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_22.id, nodeId: "node1", title: "Flat G/L List", description: "The raw trial balance — hundreds of accounts with balances, in no reporting order. Unusable as a financial statement on its own.", tCode: "F.08", tips: "The trial balance proves the books balance but can't be handed to a board without structure." },
    { flowchartId: flowchart2_22.id, nodeId: "node2", title: "Build FSV (OB58)", description: "Create the Financial Statement Version as a hierarchy of nodes that mirror a real balance sheet and P&L.", tCode: "OB58", tips: "Start from a standard FSV template and adapt it to your chart of accounts to save time." },
    { flowchartId: flowchart2_22.id, nodeId: "node3", title: "Balance Sheet Nodes", description: "Top-level Assets, Liabilities, and Equity nodes, broken into current/non-current sub-nodes following the reporting standard.", tCode: "OB58", tips: "Order matters: Non-current Assets → Current Assets → Equity → Liabilities is the conventional flow." },
    { flowchartId: flowchart2_22.id, nodeId: "node4", title: "P&L Nodes", description: "Revenue and Expense nodes structured as Revenue → Cost of Sales → Gross Profit → Operating Expenses → EBIT → PBT → Tax → PAT.", tCode: "OB58", tips: "Subtotal nodes (Gross Profit, EBIT, PBT) make the P&L readable to management." },
    { flowchartId: flowchart2_22.id, nodeId: "node5", title: "Assign Accounts", description: "Each G/L account is assigned to its node, with debit/credit logic set so balances show with the correct sign (esp. liabilities/equity).", tCode: "OB58", tips: "Mis-set debit/credit on liabilities is the classic FSV bug — a credit balance should read as positive there." },
    { flowchartId: flowchart2_22.id, nodeId: "node6", title: "Run the Report", description: "S_ALR_87012284 renders the FSV for a company code and period, producing the structured statement from live balances.", tCode: "S_ALR_87012284", tips: "Run it after close for a clean board pack; an account assigned to no node shows as 'unassigned' — fix those." },
    { flowchartId: flowchart2_22.id, nodeId: "node7", title: "Board-Ready Statement", description: "The output is a recognisable balance sheet and P&L, ready for management, auditors, and the board.", tCode: null, tips: "Maintain separate FSVs for local GAAP and IFRS so each audience sees the right structure." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_22.id },
  update: {},
  create: {
    lessonId: lesson2_22.id,
    title: "Financial Statement Versions (FSV) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In which transaction do you define a Financial Statement Version?",
          explanation: "OB58 is used to define an FSV — a tree of nodes (Assets, Liabilities, Equity, Revenue, Expenses) to which G/L accounts are assigned, structuring them into a balance sheet and P&L.",
          options: {
            create: [
              { text: "OB58", isCorrect: true },
              { text: "FS00", isCorrect: false },
              { text: "OB52", isCorrect: false },
              { text: "S_ALR_87012284", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does each FSV node specify whether a debit or credit balance is positive?",
          explanation: "For liabilities and equity, a credit balance is the normal positive value, while for assets a debit balance is positive. Setting debit/credit per node ensures balances display with the correct sign so the statement reads correctly.",
          options: {
            create: [
              { text: "So balances show with the correct sign — e.g. a credit balance reads as positive for liabilities and equity", isCorrect: true },
              { text: "To calculate the tax rate on each account", isCorrect: false },
              { text: "To decide which cost center the account belongs to", isCorrect: false },
              { text: "To determine the asset's useful life", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A new controller can only get a flat list of G/L accounts and needs a structured balance sheet and P&L for the board. What should be set up?",
          explanation: "A Financial Statement Version (built in OB58) assigns each G/L account to balance-sheet/P&L nodes, turning the flat account list into a structured statement that can be rendered with S_ALR_87012284 for the board.",
          options: {
            create: [
              { text: "A Financial Statement Version in OB58 that assigns accounts to balance-sheet and P&L nodes, rendered via S_ALR_87012284", isCorrect: true },
              { text: "A new chart of accounts with fewer G/L accounts", isCorrect: false },
              { text: "A foreign currency valuation run", isCorrect: false },
              { text: "An additional controlling area", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.23: Year-End Closing in FI/CO
const lesson2_23 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-year-end-closing" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Year-End Closing in FI/CO",
    slug: "fico-year-end-closing",
    order: 23,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `It's the last week of the fiscal year and the finance team at a manufacturing group is in war-room mode. Coffee, late nights, a whiteboard full of checkboxes. Their FICO consultant, Harish, has one job that matters above all: make sure every step runs in the *right order*. Last year a junior tried to carry forward balances before closing asset accounting, the run errored halfway, and they lost two days untangling it.

Year-end closing isn't hard because any single step is difficult — it's hard because the steps form a strict **sequence**, and getting the order wrong cascades into errors. This lesson lays out the FI year-end sequence, the parallel CO sequence, and the one idea that ties it together: balance sheet accounts carry forward, P&L accounts zero out to retained earnings.`,
    content: `## Why Order Is Everything

Year-end closing is a **strict sequence**. Each step depends on the previous one being complete — run them out of order and the system errors or produces wrong numbers. The consultant's real value is knowing the order cold.

## The FI Year-End Sequence

\`\`\`
1. Clear open items (GR/IR, bank recon)
2. Foreign currency valuation (F.05)
3. Asset depreciation for period 12 (AFAB)
4. Close asset accounting year (AJAB)
5. Post accruals & provisions
6. Run financial statements (trial balance check)
7. Close posting periods for prior year (OB52)
8. Carry forward G/L balances (F.16 / FAGLGVTR)
\`\`\`

| Step | Transaction | Why it's here |
|------|-------------|---------------|
| Clear open items | — | GR/IR and bank must be clean before valuation |
| FC valuation | \`F.05\` | Revalue FX before statements |
| Depreciation P12 | \`AFAB\` | Final month's depreciation |
| Close AA year | \`AJAB\` | **Must precede** carry-forward & FI close |
| Accruals/provisions | — | Recognise expenses in the right year |
| Financial statements | — | Verify the trial balance |
| Close periods | \`OB52\` | Lock the prior year from posting |
| Carry forward G/L | \`F.16\` / \`FAGLGVTR\` | Roll balances into the new year |

Notice AA close (\`AJAB\`) sits **before** the carry-forward — the exact rule the junior broke last year.

## The CO Year-End Sequence

CO has its own parallel sequence:

\`\`\`
1. Repost allocations (assessments, distributions)
2. Calculate WIP (work in process) for production orders
3. Variance calculation (KKS1)
4. Settle production orders (CO88)
5. Close CO periods
6. Carry forward CO plan data
\`\`\`

WIP and variances must be calculated **before** orders are settled (\`CO88\`), because settlement moves those values to their final destination. Order again matters.

## The One Big Idea: Carry Forward

What actually happens to balances at year-end depends on the account type:

- **Balance sheet accounts** (assets, liabilities, equity) **carry forward automatically** — their closing balance becomes the opening balance of the new year.
- **P&L accounts** (revenue, expenses) **zero out to retained earnings** — the year's profit/loss is swept into a retained-earnings balance-sheet account, and the P&L accounts start the new year at zero.

This is why a balance sheet is cumulative while a P&L is "this year only." The carry-forward program (\`F.16\` / \`FAGLGVTR\`) performs exactly this split.

## Why It Matters

Year-end is a **2–4 week process** where finance teams genuinely work weekends, and a single unclosed item — one open PO, one unsettled production order — can block the entire close. The discipline a FICO consultant brings is the sequence: clear, then valuate, then depreciate, then close AA, then carry forward — never skipping ahead. Harish's whole contribution this week is protecting that order, because as last year proved, doing step 8 before step 4 turns a controlled close into a two-day cleanup. Master the sequence and year-end becomes a checklist; ignore it and it becomes a crisis.`,
    keyConceptTitle: "Year-End Is a Strict Sequence; Balance Sheet Carries Forward, P&L Zeros to Retained Earnings",
    keyConceptBody: `- **FI year-end** runs in order: clear open items → FC valuation (\`F.05\`) → depreciation P12 (\`AFAB\`) → **close AA year (\`AJAB\`)** → accruals/provisions → financial statements → close periods (\`OB52\`) → carry forward G/L (\`F.16\` / \`FAGLGVTR\`).
- **CO year-end**: repost allocations → calculate WIP → variances (\`KKS1\`) → **settle production orders (\`CO88\`)** → close CO periods → carry forward plan data (WIP/variances before settlement).
- **Carry forward**: balance sheet accounts roll forward automatically; **P&L accounts zero out to retained earnings**, so the balance sheet is cumulative and the P&L is year-only.
- Order is everything — \`AJAB\` must precede carry-forward, and one unclosed item (PO, production order) can block the whole close.`,
  },
});
const flowchart2_23 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_23.id },
  update: {},
  create: {
    lessonId: lesson2_23.id,
    title: "The FI Year-End Closing Sequence",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "1️⃣ Clear open items (GR/IR, bank)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 110 }, data: { label: "2️⃣ FC valuation F.05" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 200 }, data: { label: "3️⃣ Depreciation P12 AFAB" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 290 }, data: { label: "4️⃣ Close AA year AJAB" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 380 }, data: { label: "5️⃣ Accruals + financial statements" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 470 }, data: { label: "6️⃣ Close periods OB52" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 560 }, data: { label: "7️⃣ Carry forward F.16 / FAGLGVTR" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 300, y: 650 }, data: { label: "✅ BS carries fwd · P&L → retained earnings" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 240, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
      { id: "e7", source: "node7", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_23.id, nodeId: "node1", title: "Clear Open Items", description: "Resolve GR/IR clearing and complete bank reconciliation so balances are clean before anything is valued or closed.", tCode: "F.13 / FF67", tips: "A single unmatched GR/IR or bank item can ripple into later steps — clear these first." },
    { flowchartId: flowchart2_23.id, nodeId: "node2", title: "FC Valuation (F.05)", description: "Revalue open foreign-currency items and bank balances to the year-end closing rate before producing statements.", tCode: "F.05", tips: "Update OB08 rates before running valuation, or the revaluation will use stale rates." },
    { flowchartId: flowchart2_23.id, nodeId: "node3", title: "Depreciation P12 (AFAB)", description: "Run the final period's depreciation so the asset values are complete for the year before closing AA.", tCode: "AFAB", tips: "Period 12 depreciation must post before AJAB will accept the year as complete." },
    { flowchartId: flowchart2_23.id, nodeId: "node4", title: "Close AA Year (AJAB)", description: "Close the asset accounting fiscal year. This must happen before carry-forward and the FI close — the key ordering rule.", tCode: "AJAB", tips: "This is the step the junior skipped last year — never carry forward with AA still open." },
    { flowchartId: flowchart2_23.id, nodeId: "node5", title: "Accruals & Statements", description: "Post accruals and provisions to match expenses to the year, then run financial statements to verify the trial balance.", tCode: "S_ALR_87012284", tips: "Review the trial balance for anomalies here — it's cheaper to fix before periods are locked." },
    { flowchartId: flowchart2_23.id, nodeId: "node6", title: "Close Periods (OB52)", description: "Lock the prior-year posting periods so no further entries can hit the closed year.", tCode: "OB52", tips: "Keep a special period open for audit adjustments if your policy requires post-close entries." },
    { flowchartId: flowchart2_23.id, nodeId: "node7", title: "Carry Forward (F.16)", description: "Roll G/L balances into the new year. Balance sheet accounts carry forward; P&L accounts are swept to retained earnings.", tCode: "F.16 / FAGLGVTR", tips: "In New G/L use FAGLGVTR; the program handles the BS-vs-P&L split automatically." },
    { flowchartId: flowchart2_23.id, nodeId: "node8", title: "New Year Opens", description: "Balance sheet balances become the new year's opening balances; P&L starts at zero with last year's result in retained earnings.", tCode: null, tips: "This split is why the balance sheet is cumulative and the P&L resets each year." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_23.id },
  update: {},
  create: {
    lessonId: lesson2_23.id,
    title: "Year-End Closing in FI/CO — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "At year-end carry-forward, what happens to P&L (revenue and expense) accounts?",
          explanation: "P&L accounts zero out to retained earnings — the year's net profit/loss is swept into a retained-earnings balance-sheet account, and the P&L accounts start the new year at zero. Balance sheet accounts, by contrast, carry their closing balance forward.",
          options: {
            create: [
              { text: "They zero out, with the year's result swept to retained earnings, and start the new year at zero", isCorrect: true },
              { text: "They carry their full balance forward like balance sheet accounts", isCorrect: false },
              { text: "They are deleted permanently", isCorrect: false },
              { text: "They are revalued to the closing exchange rate", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "In the CO year-end sequence, why must WIP and variance calculation happen before settling production orders (CO88)?",
          explanation: "Settlement (CO88) moves WIP and variance values to their final destinations. If WIP and variances aren't calculated first, settlement would have nothing correct to post — so the calculation steps must precede settlement.",
          options: {
            create: [
              { text: "Because settlement moves WIP and variances to their final destination, so they must be calculated first", isCorrect: true },
              { text: "Because CO88 must always run before any calculation", isCorrect: false },
              { text: "Because settlement deletes the production orders", isCorrect: false },
              { text: "Because variances are calculated only after the FI close", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A junior consultant runs the G/L carry-forward before closing the asset accounting year, and the process errors. What was the mistake?",
          explanation: "Asset accounting year-end (AJAB) must be completed before the G/L carry-forward and FI close. Running carry-forward with AA still open violates the required sequence and causes errors — the fix is to close AA first, then carry forward.",
          options: {
            create: [
              { text: "Asset accounting (AJAB) must be closed before carrying forward G/L balances — the sequence was violated", isCorrect: true },
              { text: "Carry-forward should always run first, so there was no real mistake", isCorrect: false },
              { text: "Foreign currency valuation must run after carry-forward", isCorrect: false },
              { text: "The P&L accounts should have been deleted before carry-forward", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.24: Intercompany Accounting
const lesson2_24 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-intercompany-accounting" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Intercompany Accounting",
    slug: "fico-intercompany-accounting",
    order: 24,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A conglomerate has 50+ company codes, and at every monthly close one number refuses to behave: the intercompany balance. Company A's books say company B owes it ₹2 crore; company B's books say it owes only ₹1.9 crore. A ₹10 lakh mismatch, and the entire group close is blocked until someone finds it. The intercompany reconciliation team — five people — spends days chasing differences like this every month.

Geetha, the FICO consultant, explains to the new analyst why this happens and how SAP is meant to prevent it: when two company codes in the same group transact, SAP can post *both sides automatically* using the trading partner field and intercompany accounts. When that's configured right, A and B always agree. This lesson covers intercompany accounting — the discipline of keeping group entities' mutual balances in sync.`,
    content: `## What "Intercompany" Means

When two **company codes within the same corporate group** transact with each other, it's an **intercompany** transaction. The group as a whole hasn't gained or lost anything — value just moved between its own pockets — but each company code must record its side correctly so the books reconcile and consolidate cleanly.

## Two Common Scenarios

### 1. Goods Supply
Company A sells goods to Company B. The result: a **sale** in A and a **purchase** in B, with an **intercompany receivable** in A and an **intercompany payable** in B — created automatically when configured. (When billing comes from SD, this uses intercompany billing.)

### 2. Expense Allocation
Company A pays a shared cost (e.g. central IT or shared services) and allocates a portion to Company B. SAP posts the cost in A and a matching intercompany charge to B, balancing both sides.

## How SAP Balances Both Sides Automatically

The mechanism rests on two things:

- the **trading partner** field — stamped on the posting to identify *which* group company the other side is, and
- **intercompany G/L accounts** — dedicated clearing accounts configured for each company-code pair.

\`\`\`
Company A posts → trading partner = B → intercompany AR in A
   → SAP auto-generates the mirror → intercompany AP in B (trading partner = A)
   → both sides tagged, ready to reconcile and eliminate
\`\`\`

When set up correctly, one entry creates both companies' postings, so they *can't* disagree.

## Document Types

Intercompany postings use specific document types so they're easy to identify:

- **AB** — general intercompany FI posting,
- **IV** — intercompany billing originating from SD.

## Reconciliation — ICR

Despite automation, differences creep in (manual postings, timing, errors). The **Intercompany Reconciliation (ICR)** tool — successor to the old **reconciliation ledger** — matches intercompany AR in one company against intercompany AP in the other and flags differences for investigation. This is exactly the ₹10 lakh hunt Geetha's team runs every month.

## Elimination at Consolidation

Finally, at the group level, **Group Reporting** (or consolidation) **eliminates** intercompany balances — A's receivable from B and B's payable to A cancel out — so the group financials don't double-count internal transactions. Intercompany sales aren't real group revenue; elimination removes them.

## Why It Matters

Large groups with dozens of company codes have **entire teams** managing intercompany reconciliation, because **mismatches block the monthly close** for everyone. The whole point of configuring trading partners and intercompany accounts properly is to make both sides post together and agree by construction — minimising the manual reconciliation that otherwise consumes days. For Geetha, the lesson for the analyst is that intercompany accounting is less about the individual postings and more about the *discipline*: tag every intra-group transaction with its trading partner, let SAP mirror it, reconcile with ICR, and eliminate at consolidation. Get that right across 50 company codes and the close stops being a hunt for ₹10 lakh.`,
    keyConceptTitle: "Intercompany Postings Auto-Mirror via Trading Partner; ICR Reconciles, Consolidation Eliminates",
    keyConceptBody: `- An **intercompany** transaction is between two **company codes in the same group**; each side must record correctly so the books reconcile (goods supply → IC receivable/payable; expense allocation → IC charge).
- SAP balances both sides automatically using the **trading partner** field plus dedicated **intercompany G/L accounts**, so one entry creates both companies' postings.
- Document types **AB** (intercompany FI) and **IV** (intercompany SD billing) identify these postings; **Intercompany Reconciliation (ICR)** (successor to the reconciliation ledger) matches IC AR vs IC AP.
- At group level, **consolidation/Group Reporting eliminates** intercompany balances to avoid double-counting; mismatches block the monthly close.`,
  },
});
const flowchart2_24 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_24.id },
  update: {},
  create: {
    lessonId: lesson2_24.id,
    title: "Intercompany Posting, Reconciliation & Elimination",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🏢 Company A transacts with Company B" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "🏷️ Trading partner stamped on posting" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 90, y: 230 }, data: { label: "📥 IC receivable in A" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 230 }, data: { label: "📤 IC payable in B (auto-mirror)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 340 }, data: { label: "🔍 Reconcile with ICR (AR vs AP)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 440 }, data: { label: "⚠️ Investigate mismatches" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 540 }, data: { label: "✂️ Eliminate at consolidation" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
      { id: "e6", source: "node5", target: "node6", type: "default", label: "if differ" },
      { id: "e7", source: "node5", target: "node7", type: "default", label: "if matched" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_24.id, nodeId: "node1", title: "Intra-Group Transaction", description: "Two company codes in the same group transact — goods supply or an expense allocation. The group nets to zero, but each entity must record its side.", tCode: null, tips: "If both parties are company codes in your group, treat it as intercompany from the start." },
    { flowchartId: flowchart2_24.id, nodeId: "node2", title: "Trading Partner", description: "The posting is stamped with the trading partner field identifying the counterpart company. This tag is what enables automatic mirroring and later elimination.", tCode: "OBA7", tips: "No trading partner = no automatic elimination at consolidation; it's the linchpin field." },
    { flowchartId: flowchart2_24.id, nodeId: "node3", title: "IC Receivable in A", description: "Company A records an intercompany receivable (or sale) against company B, posted to a dedicated intercompany G/L account.", tCode: "FB01", tips: "Intercompany accounts are kept separate from third-party AR/AP so they can be reconciled and eliminated." },
    { flowchartId: flowchart2_24.id, nodeId: "node4", title: "IC Payable in B", description: "SAP auto-generates the mirror posting in company B — an intercompany payable tagged with trading partner A — so both sides exist from one entry.", tCode: null, tips: "Configured intercompany clearing accounts per company-code pair drive this automatic second leg." },
    { flowchartId: flowchart2_24.id, nodeId: "node5", title: "Reconcile (ICR)", description: "The Intercompany Reconciliation tool matches IC receivables in one company against IC payables in the other, surfacing any differences.", tCode: null, tips: "ICR replaces the old reconciliation ledger; run it before close to catch mismatches early." },
    { flowchartId: flowchart2_24.id, nodeId: "node6", title: "Investigate Mismatches", description: "Differences (manual postings, timing, FX, errors) are flagged and chased down by the intercompany team before the close can proceed.", tCode: null, tips: "Most mismatches are timing or manual entries that bypassed the trading partner — fix the process, not just the number." },
    { flowchartId: flowchart2_24.id, nodeId: "node7", title: "Eliminate at Consolidation", description: "At group level, Group Reporting cancels matched intercompany balances so internal transactions aren't double-counted in group financials.", tCode: null, tips: "Elimination is why intercompany sales never inflate true group revenue." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_24.id },
  update: {},
  create: {
    lessonId: lesson2_24.id,
    title: "Intercompany Accounting — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which field is stamped on an intercompany posting to identify the counterpart group company and enable automatic mirroring and elimination?",
          explanation: "The trading partner field identifies which group company is the other side of the transaction. It enables SAP to auto-generate the mirror posting and lets consolidation eliminate the matched balances.",
          options: {
            create: [
              { text: "Trading partner", isCorrect: true },
              { text: "Tax jurisdiction code", isCorrect: false },
              { text: "Dunning key", isCorrect: false },
              { text: "Costing variant", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why are intercompany balances eliminated at consolidation?",
          explanation: "The group as a whole doesn't gain or lose from internal transactions — A's receivable from B and B's payable to A cancel out. Elimination removes these so group financials don't double-count internal sales and balances.",
          options: {
            create: [
              { text: "Because internal transactions net to zero for the group, so they're removed to avoid double-counting in group financials", isCorrect: true },
              { text: "Because intercompany transactions are illegal and must be hidden", isCorrect: false },
              { text: "Because each company code files the same statement", isCorrect: false },
              { text: "Because elimination calculates the group's tax rate", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "In a 50-company-code group, company A shows B owes ₹2 crore but B shows it owes ₹1.9 crore, blocking the close. What is the systematic way to prevent and resolve this?",
          explanation: "Configuring trading partners and intercompany accounts so both sides post automatically (and agree by construction) prevents most mismatches, while the Intercompany Reconciliation (ICR) tool matches IC AR against IC AP each period to surface and resolve any remaining differences before the close.",
          options: {
            create: [
              { text: "Post both sides automatically via trading partner + IC accounts, and reconcile with the ICR tool to find and clear differences before close", isCorrect: true },
              { text: "Pick whichever figure is higher and post the difference to expense", isCorrect: false },
              { text: "Delete one company's intercompany balance entirely", isCorrect: false },
              { text: "Run foreign currency valuation to force the two numbers to match", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 8B COMPLETE: SAP FICO Deep Dive — 175 total lessons ──────────────
