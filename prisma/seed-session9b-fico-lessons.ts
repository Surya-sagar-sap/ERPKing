// ─── FICO: CONFIG FUNDAMENTALS (Session 9B) ───────────────────────────────────
// LESSON 2.25: Document Types & Number Ranges
const lesson2_25 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "document-types-number-ranges" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Document Types & Number Ranges",
    slug: "document-types-number-ranges",
    order: 25,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `It is 9 a.m. on the first working day of the new fiscal year. Rajesh, a FICO consultant, gets a panicked call from the AP team: every vendor invoice they try to post in \`FB60\` throws the same red error — "Document number range not found." Postings are completely frozen, and invoices are piling up.

Rajesh knows this error by heart. During cutover, someone configured document types and number ranges for the old fiscal year but forgot to extend the year-dependent number range intervals into the new one. Five minutes in \`FBN1\` to add the new year's interval, and the AP team is posting again. This lesson is about the two-character key behind every FI document — the document type — and the number ranges that give each document its identity.`,
    content: `## What a Document Type Actually Is

Every single posting in FI — a vendor invoice, a customer payment, a manual journal — carries a **document type**: a two-character key that classifies the document and controls how it behaves. It is the first thing SAP looks at when you start a posting, because it decides the rules of the game before you enter a single amount.

## The Document Types Every FICO Consultant Must Know

These keys are near-universal across SAP systems, so memorise them — they appear in almost every transaction and error message you will ever touch:

| Type | Meaning | Typical source |
|------|---------|----------------|
| \`SA\` | G/L account document (manual JV) | Manual entry |
| \`KR\` | Vendor invoice | \`FB60\` / MM |
| \`KZ\` | Vendor payment | \`F-53\` / \`F110\` |
| \`KG\` | Vendor credit memo | \`FB65\` |
| \`DR\` | Customer invoice | \`FB70\` / SD |
| \`DZ\` | Customer payment | \`F-28\` |
| \`DG\` | Customer credit memo | \`FB75\` |
| \`AB\` | Accounting document (intercompany, corrections) | Manual / clearing |
| \`WA\` / \`WE\` | Goods issue / Goods receipt | MM |
| \`RV\` | Billing document | SD |

## What the Document Type Controls

A document type is not just a label. Configured in \`OBA7\`, it governs four things:

- **Number range** — which interval supplies the document number.
- **Account types allowed** — whether the document may post to vendors (K), customers (D), G/L (S), assets (A), or materials (M). A \`KR\` document, for example, permits vendor and G/L lines but blocks a direct customer line.
- **Reversal document type** — the type used when this document is reversed.
- **Required fields** — e.g. whether a reference or document header text is mandatory.

This is why a customer invoice and a manual JV behave so differently even though both are "FI documents": their document types carry different rules.

## Number Ranges — Giving Each Document an Identity

Every document type is assigned a **number range**, which decides what number the document gets. Number ranges come in two flavours:

| Type | Who supplies the number | Use |
|------|------------------------|-----|
| **Internal** | SAP assigns the next number automatically | Most FI documents |
| **External** | The user (or interface) enters the number | Legacy migration, external systems |

Number ranges are maintained in \`FBN1\`, **per company code and per fiscal year**. This is the crucial detail behind Rajesh's go-live disaster.

## Year-Dependent Number Ranges

When you define an interval in \`FBN1\`, you tie it to a fiscal year. A **year-dependent** range must have a fresh interval created for *each* new fiscal year. If you would rather not maintain it every year, you can enter the year as \`9999\`, making the range effectively **non-year-dependent** — it rolls forward indefinitely.

The classic production failure is exactly Rajesh's: the team configured intervals for the current year only, and on 1 April the next year's interval did not exist. SAP cannot find a number to assign, so it refuses the posting with "number range interval not found." The fix is always the same — open \`FBN1\` and add the missing year's interval.

## Why This Matters

Document types and number ranges are the plumbing under every FI posting. They enforce what can be posted where, give auditors clean number sequences per transaction class, and — if neglected at year-end — bring postings to a dead stop. A consultant who checks \`FBN1\` before every fiscal-year rollover never gets that 9 a.m. phone call.`,
    keyConceptTitle: "Document Type Sets the Rules; Number Range Gives the Document Its Number",
    keyConceptBody: `- A **document type** is a 2-character key on every FI posting (e.g. \`KR\` vendor invoice, \`DR\` customer invoice, \`SA\` G/L JV) configured in \`OBA7\`.
- It controls the **number range**, the **account types allowed** (vendor/customer/G/L/asset), the **reversal document type**, and **required fields**.
- Each document type is assigned a **number range** (\`FBN1\`): **internal** = SAP assigns the number, **external** = user enters it. Maintained per company code and fiscal year.
- **Year-dependent** ranges need a new interval for each fiscal year (or use year \`9999\` for non-year-dependent). Missing the new year's interval = "number range not found" error at go-live.`,
  },
});
const flowchart2_25 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_25.id },
  update: {},
  create: {
    lessonId: lesson2_25.id,
    title: "How a Document Type Drives an FI Posting",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "📝 User starts a posting (e.g. FB60)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "🔑 Document Type selected (KR)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 60, y: 230 }, data: { label: "✅ Account types allowed (K, S)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 230 }, data: { label: "📋 Required fields enforced" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 530, y: 230 }, data: { label: "🔢 Number range looked up (FBN1)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 530, y: 340 }, data: { label: "📆 Interval for this fiscal year?" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 320, y: 450 }, data: { label: "💾 Document number assigned & saved" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 600, y: 450 }, data: { label: "❌ Error: number range not found" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default", label: "yes" },
      { id: "e7", source: "node6", target: "node8", type: "default", label: "no" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_25.id, nodeId: "node1", title: "User Starts a Posting", description: "A user opens an FI transaction such as FB60 (vendor invoice) or F-02 (general posting) and begins entering a document.", tCode: "FB60", tips: "The document type is often defaulted by the transaction (FB60 defaults KR) but can be changed in the header." },
    { flowchartId: flowchart2_25.id, nodeId: "node2", title: "Document Type Selected", description: "The 2-character document type (here KR for a vendor invoice) is set in the header. It immediately drives the rest of the posting rules.", tCode: "OBA7", tips: "OBA7 is where you define and inspect document types and their attributes." },
    { flowchartId: flowchart2_25.id, nodeId: "node3", title: "Account Types Allowed", description: "The document type restricts which account types may be used. KR allows vendor (K) and G/L (S) lines but not a direct customer line.", tCode: "OBA7", tips: "If you get 'account type not allowed', the document type is the first thing to check." },
    { flowchartId: flowchart2_25.id, nodeId: "node4", title: "Required Fields Enforced", description: "The document type can make header fields like reference or document header text mandatory, ensuring clean, auditable documents.", tCode: "OBA7", tips: "Tightening required fields here is a cheap way to improve data quality at source." },
    { flowchartId: flowchart2_25.id, nodeId: "node5", title: "Number Range Looked Up", description: "SAP reads the number range assigned to the document type and finds the relevant interval for this company code and fiscal year.", tCode: "FBN1", tips: "FBN1 maintains FI number ranges per company code and fiscal year." },
    { flowchartId: flowchart2_25.id, nodeId: "node6", title: "Interval for This Fiscal Year?", description: "A year-dependent range must have an interval defined for the current fiscal year. If it is missing, SAP cannot assign a number.", tCode: "FBN1", tips: "Use year 9999 to make a range non-year-dependent and avoid yearly maintenance." },
    { flowchartId: flowchart2_25.id, nodeId: "node7", title: "Document Number Assigned & Saved", description: "With a valid interval, SAP assigns the next internal number (or accepts the external number) and posts the document.", tCode: null, tips: "Internal numbering is the norm; reserve external numbering for migrations and interfaces." },
    { flowchartId: flowchart2_25.id, nodeId: "node8", title: "Error: Number Range Not Found", description: "If no interval exists for the document type's range in this year, the posting fails — the classic go-live and year-rollover incident.", tCode: "FBN1", tips: "The fix is always to open FBN1 and add the missing year's interval — no transport usually needed." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_25.id },
  update: {},
  create: {
    lessonId: lesson2_25.id,
    title: "Document Types & Number Ranges — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which document type is used for a standard vendor invoice in FI?",
          explanation: "KR is the vendor invoice document type. KZ is a vendor payment, DR is a customer invoice, and SA is a manual G/L journal. These keys are near-universal across SAP systems.",
          options: {
            create: [
              { text: "KR", isCorrect: true },
              { text: "DR", isCorrect: false },
              { text: "SA", isCorrect: false },
              { text: "KZ", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the difference between an internal and an external number range?",
          explanation: "With an internal range SAP assigns the next number automatically; with an external range the user or interface enters the number. External ranges are mainly used for legacy data migration and external systems.",
          options: {
            create: [
              { text: "Internal = SAP assigns the number automatically; external = the user or interface enters the number", isCorrect: true },
              { text: "Internal = numbers used inside the company; external = numbers shown to customers", isCorrect: false },
              { text: "Internal ranges are year-dependent; external ranges are never year-dependent", isCorrect: false },
              { text: "Internal ranges are for G/L only; external ranges are for vendors only", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "On the first day of the new fiscal year, every posting fails with 'number range interval not found'. What is the most likely cause and fix?",
          explanation: "Year-dependent number ranges need a new interval for each fiscal year. The team configured the prior year only and never extended the interval. The fix is to add the new year's interval in FBN1 (or use year 9999 to make it non-year-dependent).",
          options: {
            create: [
              { text: "The year-dependent number range has no interval for the new fiscal year — add it in FBN1", isCorrect: true },
              { text: "The chart of accounts was deleted — recreate it in OB13", isCorrect: false },
              { text: "The document type was removed — recreate it in OBA7", isCorrect: false },
              { text: "The posting period is closed — open it in OB52", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.26: Posting Keys
const lesson2_26 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "posting-keys" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Posting Keys",
    slug: "posting-keys",
    order: 26,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A junior consultant, Sneha, is testing a manual journal in \`F-02\` for a client. The business wants the "Assignment" field filled on every line for reconciliation, but no matter what she does, the field simply does not appear on the entry screen. She has already checked the G/L account's field status group three times and it clearly says the field is optional. She is convinced SAP is broken.

Her mentor asks one question: "Did you check the posting key?" Sneha hadn't. The posting key she was using had the Assignment field set to *suppressed*, and the rule in SAP is brutally simple — when two field-status settings disagree, the stricter one wins, and suppressed is the strictest of all. This lesson is about the small two-digit key that sits on every line item and quietly decides debit-or-credit, account type, and which fields you even get to see.`,
    content: `## The Key on Every Line Item

While the document type governs the whole document, the **posting key** governs each individual line. It is a two-digit key entered before every line item, and it answers three questions at once: is this line a **debit or a credit**, what **account type** does it post to, and which **fields** are shown, required, or hidden on the screen.

## The Posting Keys to Memorise

You will type these constantly. The pattern is worth learning rather than memorising blindly: G/L uses 40/50, customers use the 0x/1x range, vendors the 2x/3x range, and assets 70/75.

| Key | Action | Account type |
|-----|--------|--------------|
| \`40\` | Debit | G/L account |
| \`50\` | Credit | G/L account |
| \`01\` | Debit (invoice) | Customer |
| \`11\` | Credit (credit memo) | Customer |
| \`31\` | Credit (invoice) | Vendor |
| \`21\` | Debit (payment) | Vendor |
| \`70\` | Debit | Asset |
| \`75\` | Credit | Asset |

A handy memory aid: a customer **invoice** debits the customer (\`01\`) because they now owe you; a vendor **invoice** credits the vendor (\`31\`) because you now owe them.

## What a Posting Key Controls

Configured in \`OB41\`, each posting key carries:

- a **debit/credit indicator** (which side of the ledger the line hits),
- an **account type** (D customer, K vendor, S G/L, A asset, M material),
- a **field status** — for every field, whether it is *required*, *optional*, or *suppressed* on the posting screen.

## The Field Status Rule That Trips Everyone Up

Here is the concept that solves Sneha's mystery. A field's final behaviour on the screen is determined by **two** field-status sources combined:

1. the **posting key** field status (\`OB41\`), and
2. the **G/L account** field status group (\`FS00\` → Field Status Group, defined in \`OBC4\`).

SAP merges them, and **the stricter setting wins**. The priority order is:

| Combination | Result |
|-------------|--------|
| One says Suppressed | **Suppressed** (field hidden) |
| One says Required, other Optional | **Required** |
| Both Optional | Optional |

So if the posting key suppresses a field, it does not matter that the G/L account marks it optional — the field disappears. (Note: a hard conflict, like one source forcing *required* while the other forces *suppressed*, throws a configuration error rather than picking silently.)

## Diagnosing the Classic "Missing Field" Problem

When a user complains "field X is not appearing on the posting screen," a senior consultant checks **both** sources, not one:

1. \`OB41\` — is the field suppressed on the **posting key**?
2. \`FS00\` → Field Status Group → \`OBC4\` — is the field suppressed on the **G/L account**?

Whichever one is set to *suppressed* is the culprit. In Sneha's case it was the posting key, which is exactly why checking only the G/L account three times never revealed the problem.

## Why This Matters

Posting keys are tiny but they are doing heavy lifting on every document: they enforce double-entry direction, route each line to the correct subledger, and shape the data-entry screen. Understanding that field status is a *combination* of posting key and G/L account — resolved by the strictest setting — is one of the most practically useful pieces of FI configuration knowledge a consultant can carry.`,
    keyConceptTitle: "Posting Key Sets Debit/Credit, Account Type, and (with the G/L) Field Status",
    keyConceptBody: `- A **posting key** is a 2-digit key on every line item (e.g. \`40\` debit G/L, \`50\` credit G/L, \`01\` debit customer, \`31\` credit vendor, \`70\` debit asset) configured in \`OB41\`.
- It controls the **debit/credit indicator**, the **account type** (D/K/S/A/M), and a **field status** for the screen.
- Final field status = **posting key field status (\`OB41\`) combined with G/L account field status group (\`FS00\`/\`OBC4\`)** — the **stricter** setting wins; suppressed beats optional.
- To fix "field not appearing on the posting screen", check **both** \`OB41\` (posting key) and the G/L field status group — whichever sets the field to suppressed is hiding it.`,
  },
});
const flowchart2_26 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_26.id },
  update: {},
  create: {
    lessonId: lesson2_26.id,
    title: "How Field Status Is Resolved for a Line Item",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🧾 Line item entered with posting key" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 110, y: 130 }, data: { label: "⬆️⬇️ Debit/Credit + account type set" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 100, y: 250 }, data: { label: "🔑 Posting key field status (OB41)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 510, y: 250 }, data: { label: "📒 G/L field status group (FS00/OBC4)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 305, y: 360 }, data: { label: "⚖️ Combine — stricter setting wins" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 110, y: 470 }, data: { label: "🙈 Suppressed → field hidden" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 510, y: 470 }, data: { label: "✅ Required/Optional → field shown" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node1", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
      { id: "e6", source: "node5", target: "node6", type: "default", label: "if suppressed" },
      { id: "e7", source: "node5", target: "node7", type: "default", label: "otherwise" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_26.id, nodeId: "node1", title: "Line Item Entered with Posting Key", description: "Every FI line item begins with a 2-digit posting key that classifies the line before any amount is entered.", tCode: "F-02", tips: "In F-02 you type the posting key, then the account, on each new line." },
    { flowchartId: flowchart2_26.id, nodeId: "node2", title: "Debit/Credit + Account Type Set", description: "The posting key immediately fixes whether the line is a debit or credit and which account type (D/K/S/A/M) it targets.", tCode: "OB41", tips: "40/50 = G/L debit/credit, 01/11 = customer, 31/21 = vendor, 70/75 = asset." },
    { flowchartId: flowchart2_26.id, nodeId: "node3", title: "Posting Key Field Status (OB41)", description: "Each posting key carries a field status saying, per field, whether it is required, optional, or suppressed on the screen.", tCode: "OB41", tips: "This is the source people forget to check when a field goes missing." },
    { flowchartId: flowchart2_26.id, nodeId: "node4", title: "G/L Field Status Group (FS00/OBC4)", description: "The G/L account's field status group provides the second field-status source. Maintained on the account (FS00) and defined in OBC4.", tCode: "FS00", tips: "FS00 shows the field status group; OBC4 is where the groups themselves are configured." },
    { flowchartId: flowchart2_26.id, nodeId: "node5", title: "Combine — Stricter Setting Wins", description: "SAP merges the posting key and G/L field statuses. The stricter rule prevails: suppressed beats optional, required beats optional.", tCode: null, tips: "A direct required-vs-suppressed clash raises a config error rather than guessing." },
    { flowchartId: flowchart2_26.id, nodeId: "node6", title: "Suppressed → Field Hidden", description: "If either source suppresses the field, it disappears from the screen — the cause of most 'field not appearing' tickets.", tCode: null, tips: "Check OB41 first if the G/L field status group already looks correct." },
    { flowchartId: flowchart2_26.id, nodeId: "node7", title: "Required/Optional → Field Shown", description: "If neither source suppresses it, the field appears — as mandatory if either marks it required, otherwise optional.", tCode: null, tips: "Set a field to required on the field status group to enforce clean reconciliation data." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_26.id },
  update: {},
  create: {
    lessonId: lesson2_26.id,
    title: "Posting Keys — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which posting key is used to debit a G/L account?",
          explanation: "Posting key 40 debits a G/L account and 50 credits it. 01 debits a customer, and 31 credits a vendor. The 40/50 pair is the most frequently used in manual journals.",
          options: {
            create: [
              { text: "40", isCorrect: true },
              { text: "50", isCorrect: false },
              { text: "01", isCorrect: false },
              { text: "31", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How is the final field status of a line item determined?",
          explanation: "The final field status combines the posting key field status (OB41) with the G/L account's field status group (FS00/OBC4), and the stricter setting wins — suppressed beats optional, required beats optional.",
          options: {
            create: [
              { text: "By combining the posting key field status and the G/L account field status group, with the stricter setting winning", isCorrect: true },
              { text: "By the posting key alone, ignoring the G/L account", isCorrect: false },
              { text: "By the G/L account alone, ignoring the posting key", isCorrect: false },
              { text: "By the document type's required-field setting only", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A field is optional on the G/L account's field status group, yet it never appears on the posting screen. What should you check?",
          explanation: "Field status is a combination of two sources, and suppressed always wins. If the G/L account marks the field optional but it is still hidden, the posting key (OB41) must be suppressing it. Always check both sources.",
          options: {
            create: [
              { text: "The posting key field status in OB41 — it is likely suppressing the field", isCorrect: true },
              { text: "The number range in FBN1", isCorrect: false },
              { text: "The document type in OBA7", isCorrect: false },
              { text: "The posting period variant in OB52", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.27: Automatic Account Determination
const lesson2_27 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "automatic-account-determination" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Automatic Account Determination",
    slug: "automatic-account-determination",
    order: 27,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `During a UAT cycle, the finance controller of a consumer-goods firm raises an urgent defect: "Our SD billing is posting all revenue to a single 'Sales — General' account. We need premium products in one revenue account and standard products in another, automatically — the team will never key the right G/L by hand on 4,000 invoices a day."

The consultant, Karthik, knows no human will ever pick those accounts. This is the job of **automatic account determination** — the engine that lets SAP decide the correct G/L account on its own, using a few configuration keys. The fix lives in \`VKOA\`, and once Karthik wires the account assignment groups correctly, premium and standard revenue split themselves on every invoice with zero user effort. This lesson explains how SAP "just knows" which account to post to.`,
    content: `## SAP Posting to the Right Account, By Itself

**Automatic account determination** means SAP decides which G/L account a posting should hit *without* the user entering it. Whole categories of postings are generated by the system rather than typed by a person, and they all rely on this mechanism:

- tax postings
- bank charges
- exchange-rate differences
- GR/IR clearing
- cash discount
- rounding differences

If users had to choose the G/L for every one of these on every document, finance would grind to a halt and errors would be everywhere. Account determination removes the human from the loop.

## The General Logic

Across SAP, automatic account determination follows one pattern. A combination of keys resolves to a single G/L account:

\`\`\`
Transaction key (event)  +  Account modifier  +  Chart of accounts  +  Valuation class  →  G/L account
\`\`\`

The **transaction key** (sometimes called an event or process key) names *what is happening* — "cash discount taken", "exchange-rate loss", "inventory posting". You then assign a G/L account to that key within your chart of accounts. When the event occurs, SAP looks up the key and posts to the assigned account.

## Key FI Transaction Keys (\`OB40\`)

In core FI, automatic postings are configured in \`OB40\`. The ones a consultant meets most often:

| Key | Event |
|-----|-------|
| \`ZSK\` | Cash discount **taken** (discount you receive from a vendor on early payment) |
| \`ZDK\` | Cash discount **granted** (discount you give a customer) |
| \`KDF\` / \`KDG\` | Exchange-rate **loss / gain** on open-item valuation and clearing |
| Bank posting keys | Balance-sheet accounts used by the electronic bank statement |

When you run a payment in \`F110\` and take a vendor discount, you never type the discount account — \`OB40\` already maps \`ZSK\` to it.

## Revenue Account Determination — \`VKOA\`

Karthik's defect lives in the SD-to-FI bridge. When SD creates a billing document, FI must post revenue, and the account is chosen by **\`VKOA\`** using this combination:

\`\`\`
Sales Org  +  Account Assignment Group (customer)  +  Account Assignment Group (material)  +  Account Key  →  G/L account
\`\`\`

The **account key** identifies the *nature* of the amount on each billing line:

| Account key | Posts to |
|-------------|----------|
| \`ERL\` | Revenue |
| \`ERS\` | Sales deductions / discounts |
| \`MWS\` | Output tax |
| \`ERF\` | Freight |

The **account assignment group** on the material master is what splits premium from standard product revenue: assign premium materials to one group and standard to another, then in \`VKOA\` map each group + \`ERL\` to a different revenue account. The split now happens automatically.

## Interest — \`OB09\`

For interest calculation (on overdue items or G/L balances), account determination is maintained in \`OB09\`, mapping the interest indicator to the interest income/expense accounts.

## Diagnosing "Posting to the Wrong Account"

When SD billing posts to the wrong revenue account, walk the \`VKOA\` determination in order:

1. Open \`VKOA\` and find the relevant access (Sales Org + account assignment groups + account key).
2. Confirm the **account key** is right — \`ERL\` for revenue, \`ERS\` for deductions.
3. Verify the **account assignment group** on the **customer master** (\`XD02\` → Billing tab) and the **material master** (Sales Org 2 view) — a missing or wrong group sends the posting down the wrong access.

This is exactly Karthik's fix: the material account assignment group was blank, so every product fell to the same default revenue line.

## Why This Matters

Automatic account determination is what makes high-volume finance possible. It enforces consistent, audit-clean G/L assignment across taxes, discounts, currency differences, and millions of integration postings — and when something lands in the wrong account, the answer is almost always in \`OB40\`, \`VKOA\`, or \`OB09\`, not in the user's hands.`,
    keyConceptTitle: "A Combination of Keys Resolves Automatically to a Single G/L Account",
    keyConceptBody: `- **Automatic account determination** lets SAP pick the G/L account without user input — for tax, bank charges, exchange differences, GR/IR, cash discount, and rounding.
- General pattern: **Transaction key + Account modifier + Chart of accounts + Valuation class → G/L account**.
- Core FI automatic postings live in \`OB40\` (e.g. \`ZSK\` cash discount taken, \`ZDK\` cash discount granted, \`KDF\`/\`KDG\` exchange-rate loss/gain); interest in \`OB09\`.
- SD revenue is determined in \`VKOA\`: **Sales Org + Account Assignment Group (customer) + Account Assignment Group (material) + Account Key → G/L** (keys: \`ERL\` revenue, \`ERS\` deductions, \`MWS\` tax, \`ERF\` freight).`,
  },
});
const flowchart2_27 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_27.id },
  update: {},
  create: {
    lessonId: lesson2_27.id,
    title: "How SAP Resolves the G/L Account Automatically (SD Revenue)",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "📄 Billing document created (VF01)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "🔑 Account key per line (ERL/ERS/MWS)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 60, y: 230 }, data: { label: "🏬 Sales Org" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 250, y: 230 }, data: { label: "👥 Cust. acct assignment group" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 470, y: 230 }, data: { label: "📦 Material acct assignment group" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 340 }, data: { label: "🔎 VKOA lookup (combine keys)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 300, y: 450 }, data: { label: "💰 G/L account posted automatically" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node3", target: "node6", type: "default" },
      { id: "e6", source: "node4", target: "node6", type: "default" },
      { id: "e7", source: "node5", target: "node6", type: "default" },
      { id: "e8", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_27.id, nodeId: "node1", title: "Billing Document Created", description: "SD creates a billing document in VF01. FI must now post revenue, tax and receivables — without anyone keying a G/L account.", tCode: "VF01", tips: "The accounting document is generated automatically once account determination succeeds." },
    { flowchartId: flowchart2_27.id, nodeId: "node2", title: "Account Key per Line", description: "Each billing line carries an account key naming the nature of the amount: ERL revenue, ERS sales deductions, MWS tax, ERF freight.", tCode: "VKOA", tips: "Account keys are assigned to condition types in the SD pricing procedure." },
    { flowchartId: flowchart2_27.id, nodeId: "node3", title: "Sales Organization", description: "The sales org is one of the determination dimensions, letting different selling units post to different revenue accounts.", tCode: null, tips: "Useful when separate sales orgs need separate revenue reporting." },
    { flowchartId: flowchart2_27.id, nodeId: "node4", title: "Customer Account Assignment Group", description: "Set on the customer master (XD02 → Billing tab), it groups customers (e.g. domestic vs export) for revenue determination.", tCode: "XD02", tips: "A blank group on the customer is a common cause of wrong-account postings." },
    { flowchartId: flowchart2_27.id, nodeId: "node5", title: "Material Account Assignment Group", description: "Set on the material master (Sales Org 2 view). This is what splits premium vs standard product revenue into different accounts.", tCode: "MM02", tips: "Assign premium and standard materials to different groups, then map each in VKOA." },
    { flowchartId: flowchart2_27.id, nodeId: "node6", title: "VKOA Lookup", description: "SAP combines Sales Org + customer group + material group + account key and reads VKOA to find the matching G/L account.", tCode: "VKOA", tips: "VKOA uses an access sequence — the most specific matching access wins." },
    { flowchartId: flowchart2_27.id, nodeId: "node7", title: "G/L Account Posted Automatically", description: "The resolved G/L account receives the posting. Premium and standard revenue land in separate accounts with zero manual entry.", tCode: null, tips: "If billing saved but no accounting document appears, suspect a missing VKOA entry." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_27.id },
  update: {},
  create: {
    lessonId: lesson2_27.id,
    title: "Automatic Account Determination — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to configure revenue account determination for SD billing?",
          explanation: "VKOA configures revenue account determination, combining Sales Org, customer and material account assignment groups, and the account key to find the G/L account. OB40 handles core FI automatic postings, and OB09 handles interest.",
          options: {
            create: [
              { text: "VKOA", isCorrect: true },
              { text: "OB40", isCorrect: false },
              { text: "FBN1", isCorrect: false },
              { text: "OB52", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does the account key (e.g. ERL, ERS, MWS) represent in revenue account determination?",
          explanation: "The account key identifies the nature of each billing line — ERL for revenue, ERS for sales deductions, MWS for output tax, ERF for freight — so SAP can route each amount to the correct type of G/L account.",
          options: {
            create: [
              { text: "The nature of the amount on each line (revenue, deduction, tax, freight), used to find the right G/L account", isCorrect: true },
              { text: "The document type assigned to the billing document", isCorrect: false },
              { text: "The number range interval for the invoice", isCorrect: false },
              { text: "The posting period the invoice falls into", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "SD billing is posting all products to one revenue account, but the business needs premium and standard products split. What is the correct fix?",
          explanation: "Assign premium and standard materials to different account assignment groups on the material master (Sales Org 2 view), then in VKOA map each group + the ERL account key to a separate revenue account. The split then happens automatically on every invoice.",
          options: {
            create: [
              { text: "Use different material account assignment groups and map each + ERL to a separate revenue account in VKOA", isCorrect: true },
              { text: "Ask users to manually key the correct revenue account on each invoice", isCorrect: false },
              { text: "Create a new number range for premium invoices in FBN1", isCorrect: false },
              { text: "Change the posting key on the revenue line to 50", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.28: Activity Types (CO-OM)
const lesson2_28 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "activity-types-co-om" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Activity Types (CO-OM)",
    slug: "activity-types-co-om",
    order: 28,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A plant controller, Meena, is reviewing production order costs and notices something wrong: the machining cost center has booked plenty of electricity and depreciation, but the production orders that ran on those machines show almost no machine cost. Product margins look artificially high, and the factory manager is about to make a pricing decision based on numbers that are simply incomplete.

Meena traces it to two missing steps. The activity type for machine hours was never assigned a planned rate in \`KP26\`, and production was not confirming machine hours in PP. Without a rate, an hour of machining costs SAP "nothing", so the cost center's real costs just sit there, never flowing to the orders that consumed them. This lesson is about activity types — the bridge that moves cost-center costs onto the products that actually used the resources.`,
    content: `## What an Activity Type Represents

A cost center collects costs — salaries, electricity, depreciation. But those costs need to reach the products and orders that *consumed* the cost center's services. An **activity type** is the unit of service a cost center provides to others: machine hours, labour hours, setup time, kilowatt-hours of electricity. It is the currency in which a cost center "sells" its work internally.

| Activity type | Represents |
|---------------|-----------|
| \`MACH\` | Machine hours |
| \`LAB\` | Labour hours |
| \`SETUP\` | Setup hours |
| \`ELEC\` | kWh of electricity |

## Creating an Activity Type

An activity type is created in \`KL01\`. The single most important attribute is the linked **cost element category 43 — internal activity allocation**. This secondary cost element is the conduit through which cost flows from the sending cost center to the receiving order. Without category 43, there is no channel for the allocation.

## Planning the Rate — \`KP26\`

A machine hour means nothing financially until it has a **rate** (a cost per hour). The rate comes from planning:

\`\`\`
Planned rate  =  Total planned cost of the cost center  ÷  Planned activity quantity
\`\`\`

In \`KP26\` you plan, for a cost center and activity type, the **quantity** of activity it will produce and its **fixed and variable cost**. SAP then derives the planned rate — say ₹500 per machine hour. This is the figure that will be charged to every order that consumes a machine hour.

It helps to separate the two planning transactions:

| T-code | Plans |
|--------|-------|
| \`KP06\` | Primary **costs** on the cost center (salary, rent, utilities) |
| \`KP26\` | Activity **quantities and rates** (machine/labour hours) |

## Actual Allocation — Costs Start Flowing

Once the rate is planned, the loop closes during execution. Production orders **confirm** actual machine and labour hours in PP (\`CO11N\`). Each confirmed hour pulls cost from the cost center to the order using the **planned rate**: confirm 10 machine hours and ₹5,000 (10 × ₹500) moves from the machining cost center onto the production order. This is internal activity allocation in action — and it is exactly what was missing in Meena's plant.

## Actual Rate & Variance

The planned rate is an estimate. At period-end, \`KSII\` recalculates an **actual rate** by dividing the cost center's *actual* costs by its *actual* activity quantity. The gap between what was charged out (planned rate × actual hours) and the cost center's real costs is the **variance**, which stays on the cost center for analysis.

## Diagnosing "Production Order Costs Not Updating"

When orders are not picking up activity cost, check the two links Meena was missing:

1. Is the activity **confirmed** in PP (\`CO11N\`)? No confirmation means no allocation event.
2. Is the activity **rate planned** in \`KP26\`? A zero or missing rate means each hour allocates ₹0.

Either gap leaves the cost center holding costs that never reach the product.

## Why This Matters

Activity types are what make product costing real. They convert a cost center's lump of expenses into a per-hour rate and push that cost onto the orders that consumed it, so product margins reflect the resources actually used. Skip the rate in \`KP26\` or the confirmation in PP, and you get exactly Meena's problem — flattering, and dangerously wrong, product costs.`,
    keyConceptTitle: "Activity Types Carry Cost-Center Costs to Orders via a Planned Rate",
    keyConceptBody: `- An **activity type** is a service a cost center provides (machine hours, labour hours, setup, kWh), created in \`KL01\` with **cost element category 43** (internal activity allocation).
- **Planned rate = total planned cost of cost center ÷ planned activity quantity**, set up in \`KP26\` (quantities + rates); \`KP06\` plans the primary costs themselves.
- Production confirms actual hours in PP (\`CO11N\`); each confirmed hour moves cost from the cost center to the order at the **planned rate**.
- \`KSII\` recalculates the **actual rate** (actual costs ÷ actual quantity); the gap is **variance**. If order costs are not updating, check the \`CO11N\` confirmation and the \`KP26\` rate.`,
  },
});
const flowchart2_28 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_28.id },
  update: {},
  create: {
    lessonId: lesson2_28.id,
    title: "How Activity Types Move Cost from Cost Center to Order",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🏭 Cost center collects costs (KP06)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "⚙️ Activity type created (KL01, cat 43)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 220 }, data: { label: "📐 Plan quantity & rate (KP26)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 320 }, data: { label: "🛠️ Production confirms hours (CO11N)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 420 }, data: { label: "➡️ Cost flows to order at planned rate" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 70, y: 420 }, data: { label: "📊 KSII recalculates actual rate" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 70, y: 520 }, data: { label: "⚖️ Variance stays on cost center" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default", label: "period-end" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_28.id, nodeId: "node1", title: "Cost Center Collects Costs", description: "Primary costs (salary, electricity, depreciation) accumulate on the cost center and are planned in KP06.", tCode: "KP06", tips: "These are the costs that must eventually reach the products that consumed the cost center's services." },
    { flowchartId: flowchart2_28.id, nodeId: "node2", title: "Activity Type Created", description: "An activity type (e.g. MACH for machine hours) is created in KL01 and linked to cost element category 43 — internal activity allocation.", tCode: "KL01", tips: "Without category 43 there is no channel for cost to flow from cost center to order." },
    { flowchartId: flowchart2_28.id, nodeId: "node3", title: "Plan Quantity & Rate", description: "In KP26 you plan the activity quantity and fixed/variable cost; SAP derives the planned rate = total planned cost ÷ planned quantity.", tCode: "KP26", tips: "A missing KP26 rate means each hour allocates zero cost — a classic mistake." },
    { flowchartId: flowchart2_28.id, nodeId: "node4", title: "Production Confirms Hours", description: "During execution, production orders confirm actual machine/labour hours in PP via CO11N, triggering the allocation event.", tCode: "CO11N", tips: "No confirmation means no allocation — orders stay empty of activity cost." },
    { flowchartId: flowchart2_28.id, nodeId: "node5", title: "Cost Flows to Order at Planned Rate", description: "Each confirmed hour pulls cost from the cost center to the order using the planned rate (e.g. 10 hrs × ₹500 = ₹5,000).", tCode: null, tips: "This is internal activity allocation — the heart of accurate product costing." },
    { flowchartId: flowchart2_28.id, nodeId: "node6", title: "KSII Recalculates Actual Rate", description: "At period-end KSII splits the cost center's actual costs by its actual activity quantity to compute the true actual rate.", tCode: "KSII", tips: "Run KSII as part of the CO period-end close after all confirmations are posted." },
    { flowchartId: flowchart2_28.id, nodeId: "node7", title: "Variance Stays on Cost Center", description: "The difference between cost charged out at the planned rate and the cost center's actual costs remains on the cost center as variance.", tCode: null, tips: "Analyse this variance to refine next period's KP26 planned rate." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_28.id },
  update: {},
  create: {
    lessonId: lesson2_28.id,
    title: "Activity Types (CO-OM) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which cost element category must an activity type be linked to?",
          explanation: "Activity types use cost element category 43 — internal activity allocation. This secondary cost element is the channel through which cost flows from the sending cost center to the receiving order. Category 42 is for assessment.",
          options: {
            create: [
              { text: "Category 43 — internal activity allocation", isCorrect: true },
              { text: "Category 42 — assessment", isCorrect: false },
              { text: "Category 1 — primary costs", isCorrect: false },
              { text: "Category 11 — revenue", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How is the planned activity rate calculated?",
          explanation: "The planned rate = total planned cost of the cost center ÷ planned activity quantity, configured in KP26. This rate is charged to every order that consumes an hour of the activity.",
          options: {
            create: [
              { text: "Total planned cost of the cost center ÷ planned activity quantity", isCorrect: true },
              { text: "Actual cost of the order ÷ number of orders", isCorrect: false },
              { text: "Total revenue ÷ total machine hours sold", isCorrect: false },
              { text: "Planned quantity × standard material price", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A cost center has booked costs but its production orders show no machine cost. What two things should you check first?",
          explanation: "For activity cost to reach orders, the activity must be confirmed in PP (CO11N) and a rate must be planned in KP26. A missing confirmation means no allocation event; a missing rate means each hour allocates zero. Both leave costs stranded on the cost center.",
          options: {
            create: [
              { text: "Whether the activity is confirmed in CO11N and whether the rate is planned in KP26", isCorrect: true },
              { text: "Whether the number range exists in FBN1 and the period is open in OB52", isCorrect: false },
              { text: "Whether VKOA has a revenue account and the customer group is set", isCorrect: false },
              { text: "Whether the document type allows asset postings in OBA7", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.29: Allocation Cycles — Assessment & Distribution
const lesson2_29 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "allocation-cycles-assessment-distribution" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Allocation Cycles — Assessment & Distribution",
    slug: "allocation-cycles-assessment-distribution",
    order: 29,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `At month-end, a business-unit head emails the controller, Arvind, with a complaint: "My department's cost center suddenly shows ₹8 lakh of costs we never posted. Where did this come from?" He is convinced someone made a wrong entry against his unit.

Arvind opens \`KSB1\` (cost center line items) and sees the answer immediately: the costs came from an **assessment cycle** that allocates shared IT and facilities costs out to every department at period-end. Nobody keyed those entries — a cycle did, automatically, splitting central overhead by headcount. This lesson is about exactly that machinery: allocation cycles, and the crucial difference between **distribution** (which keeps the original cost detail) and **assessment** (which rolls everything into one overhead figure).`,
    content: `## Why Allocations Exist

Some cost centers exist only to serve others — IT, HR, facilities, a central power plant. Their costs must be shared out to the business units that actually benefit. **Period-end allocations** move costs from **sender** cost centers (shared services) to **receiver** cost centers (business units, or even orders). SAP offers two methods, and choosing the right one is the heart of this topic.

## Distribution — Keep the Detail

**Distribution** moves **primary costs** exactly as they are: the original cost element is *preserved* on the receiver. If the central plant distributes electricity, each receiving department sees "electricity" on its own cost center — the cost type survives the move.

Use distribution when receivers genuinely need to know *what kind* of cost they are getting. The transactions:

| T-code | Action |
|--------|--------|
| \`KSV1\` | Create distribution cycle |
| \`KSV2\` | Change distribution cycle |
| \`KSV5\` | Execute distribution |

## Assessment — Roll It Up

**Assessment** moves costs using a **secondary cost element** (an **assessment cost element, category 42**). All the original primary cost elements are combined into this single secondary element — the detail is *lost* on the receiver, which simply sees "IT overhead" or "HR overhead".

Use assessment for overheads where the receiver does not need the breakdown. The transactions mirror distribution:

| T-code | Action |
|--------|--------|
| \`KSU1\` | Create assessment cycle |
| \`KSU2\` | Change assessment cycle |
| \`KSU5\` | Execute assessment |

## Distribution vs Assessment at a Glance

| Aspect | Distribution | Assessment |
|--------|--------------|-----------|
| Cost element on receiver | Original primary cost element preserved | Single secondary (category 42) element |
| Detail visible to receiver | Yes — sees the real expense type | No — sees combined overhead |
| Typical use | Electricity, rent split where type matters | IT, HR, admin overhead |
| Create / execute | \`KSV1\` / \`KSV5\` | \`KSU1\` / \`KSU5\` |

## Inside a Cycle — Sender, Tracing Factor, Receiver

Both methods share the same structure:

\`\`\`
Sender (cost center + cost elements)  →  Tracing factor (how to split)  →  Receivers (cost centers / orders)
\`\`\`

The **tracing factor** decides *how* the cost is divided among receivers. Common choices:

- **statistical key figures** — headcount, square metres, number of PCs
- **fixed percentages** — e.g. 40% / 35% / 25%
- **posted amounts** — split in proportion to costs already on the receivers

Splitting IT cost by number of PCs, or HR cost by headcount, is the classic pattern.

## Iterative Cycles

When service departments serve *each other* — IT supports HR, and HR supports IT — a single pass cannot settle the mutual exchange. Setting the **iterative** flag makes SAP repeat the allocation until the amounts converge, so each department ends up correctly charged for the other's services.

## Diagnosing "Costs I Never Posted"

Arvind's case is the canonical one. When a cost center shows unexpected month-end costs:

1. Open \`KSB1\` (cost center line items) and look at the document type / business transaction.
2. An assessment or distribution posting reveals a cycle ran and pushed shared-service costs in.
3. Trace back to the cycle (\`KSU2\`/\`KSV2\`) to see the sender and tracing factor.

The "phantom" costs are simply the department's fair share of central overhead.

## Why This Matters

Allocation cycles are how SAP turns shared-service spending into a fair, automatic charge against the units that consume it — the basis of honest departmental P&Ls. Knowing when to preserve detail (distribution) versus summarise (assessment), and how the tracing factor drives the split, is core period-end controlling knowledge.`,
    keyConceptTitle: "Distribution Keeps the Cost Element; Assessment Rolls It into One Overhead",
    keyConceptBody: `- Period-end allocations move costs from **sender** (shared-service) to **receiver** cost centers/orders.
- **Distribution** (\`KSV1\` create / \`KSV5\` execute) moves **primary costs** and **preserves the original cost element** on the receiver — use when the expense type matters.
- **Assessment** (\`KSU1\` create / \`KSU5\` execute) moves costs via a **secondary cost element (category 42)**, **combining** the detail into one overhead line — use for IT/HR/admin overhead.
- A cycle = **sender → tracing factor (statistical key figures, fixed %, posted amounts) → receivers**; use the **iterative** flag when services charge each other. To find unexpected month-end costs, check \`KSB1\`.`,
  },
});
const flowchart2_29 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_29.id },
  update: {},
  create: {
    lessonId: lesson2_29.id,
    title: "Allocation Cycle Flow — Distribution vs Assessment",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🏢 Sender cost center (shared service)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "📏 Tracing factor (headcount, %, amounts)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 305, y: 220 }, data: { label: "🔀 Choose method" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 70, y: 330 }, data: { label: "📦 Distribution (KSV5) — keep cost element" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 520, y: 330 }, data: { label: "🧮 Assessment (KSU5) — secondary elem (42)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 305, y: 440 }, data: { label: "🎯 Receiver cost centers / orders" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 305, y: 540 }, data: { label: "🔁 Iterative if services cross-charge" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default", label: "detail needed" },
      { id: "e4", source: "node3", target: "node5", type: "default", label: "overhead" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node5", target: "node6", type: "default" },
      { id: "e7", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_29.id, nodeId: "node1", title: "Sender Cost Center", description: "A shared-service cost center (IT, HR, facilities, power plant) whose costs must be shared out to the units that benefit.", tCode: null, tips: "Senders are typically service departments that exist only to support the business." },
    { flowchartId: flowchart2_29.id, nodeId: "node2", title: "Tracing Factor", description: "Defines how the sender's cost is split among receivers — statistical key figures (headcount, sq m), fixed percentages, or posted amounts.", tCode: "KK01", tips: "Statistical key figures like headcount are entered with KB31N / KP46 for the period." },
    { flowchartId: flowchart2_29.id, nodeId: "node3", title: "Choose Method", description: "Decide whether receivers need to see the real expense type (distribution) or just a combined overhead figure (assessment).", tCode: null, tips: "If a receiver asks 'what is this cost?', distribution may be the better fit." },
    { flowchartId: flowchart2_29.id, nodeId: "node4", title: "Distribution (KSV5)", description: "Moves primary costs with the original cost element preserved on the receiver. Created in KSV1, executed in KSV5.", tCode: "KSV5", tips: "Use when receivers must see the actual expense type, e.g. electricity." },
    { flowchartId: flowchart2_29.id, nodeId: "node5", title: "Assessment (KSU5)", description: "Moves costs via a secondary assessment cost element (category 42), combining detail into one overhead line. Created in KSU1, executed in KSU5.", tCode: "KSU5", tips: "Use for IT/HR/admin overhead where the breakdown is not needed downstream." },
    { flowchartId: flowchart2_29.id, nodeId: "node6", title: "Receiver Cost Centers / Orders", description: "The business units or orders that receive their share of the sender's cost, split according to the tracing factor.", tCode: "KSB1", tips: "KSB1 on a receiver shows exactly which cycle posted the allocated cost." },
    { flowchartId: flowchart2_29.id, nodeId: "node7", title: "Iterative If Services Cross-Charge", description: "When senders also receive from each other (IT↔HR), the iterative flag repeats the allocation until amounts converge.", tCode: null, tips: "Set the iterative flag on the cycle header when mutual services exist." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_29.id },
  update: {},
  create: {
    lessonId: lesson2_29.id,
    title: "Allocation Cycles — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction executes an assessment cycle?",
          explanation: "KSU5 executes an assessment cycle (KSU1 creates it). KSV5 executes a distribution cycle. Assessment uses a secondary cost element of category 42, while distribution preserves the original primary cost element.",
          options: {
            create: [
              { text: "KSU5", isCorrect: true },
              { text: "KSV5", isCorrect: false },
              { text: "KP26", isCorrect: false },
              { text: "KSII", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the key difference between distribution and assessment?",
          explanation: "Distribution preserves the original primary cost element on the receiver, so the expense type is still visible. Assessment combines costs into a single secondary cost element (category 42), hiding the detail — suited to overhead allocations.",
          options: {
            create: [
              { text: "Distribution preserves the original cost element; assessment combines costs into one secondary (category 42) cost element", isCorrect: true },
              { text: "Distribution is for revenue; assessment is for costs", isCorrect: false },
              { text: "Distribution runs at year-end only; assessment runs monthly", isCorrect: false },
              { text: "Distribution uses tracing factors; assessment never does", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A department head says their cost center shows month-end costs nobody posted. What is the most likely explanation and where do you confirm it?",
          explanation: "An allocation cycle (assessment or distribution) automatically pushed shared-service costs onto the receiver. You confirm it in KSB1 (cost center line items), where the assessment/distribution posting and its source cycle are visible.",
          options: {
            create: [
              { text: "An allocation cycle posted shared-service costs to the receiver — confirm in KSB1", isCorrect: true },
              { text: "A number range overflowed — confirm in FBN1", isCorrect: false },
              { text: "The posting period was reopened — confirm in OB52", isCorrect: false },
              { text: "A duplicate document type was created — confirm in OBA7", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.30: FI-MM Integration
const lesson2_30 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fi-mm-integration" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "FI-MM Integration",
    slug: "fi-mm-integration",
    order: 30,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A new raw-material category goes live, and within a day the FI team flags a problem: goods receipts for the new material are landing in the wrong inventory G/L account — finished-goods inventory instead of raw-material inventory. The balance sheet is being quietly distorted with every receipt.

The consultant, Deepak, doesn't touch a single FI posting. He goes straight to \`OBYC\`, opens transaction key **BSX** (inventory posting), and finds the cause in seconds: the new material was created with the wrong **valuation class**, which routed BSX to the finished-goods account. One master-data correction and the receipts post correctly. This lesson explains FI-MM integration — how every goods movement in MM silently creates an FI accounting document, and how \`OBYC\` decides which accounts it hits.`,
    content: `## Every Goods Movement Becomes an Accounting Document

The first thing to internalise: in SAP, you almost never post inventory in FI by hand. **Every goods movement in MM automatically generates an FI accounting document.** A storeperson receiving stock, a planner issuing material to production — each click in MM creates a balanced FI document behind the scenes. This automatic bridge *is* FI-MM integration.

## The Key Integration Points

Four movements cover most of what a FICO consultant needs to recognise:

| Event | Movement | FI posting |
|-------|----------|-----------|
| **Goods Receipt** (\`MIGO\`) | 101 | Inventory account **DR** / GR/IR clearing **CR** |
| **Invoice Verification** (\`MIRO\`) | — | GR/IR clearing **DR** / Vendor account **CR** |
| **Goods Issue to production** | 261 | Cost of production **DR** / Inventory **CR** |
| **Goods Issue to cost center** | 201 | Cost center expense **DR** / Inventory **CR** |

Notice that goods receipt and invoice verification both touch a single bridging account — the GR/IR clearing account.

## The GR/IR Clearing Account — the Bridge

Goods usually arrive *before* the supplier's invoice. So SAP needs a temporary home for the liability between receiving the goods and receiving the bill. That is the **GR/IR clearing account** (Goods Receipt / Invoice Receipt):

- At **goods receipt**, SAP credits GR/IR (we owe *something*, even before the invoice).
- At **invoice verification**, SAP debits GR/IR (the invoice confirms the amount) and credits the vendor.

When the GR quantity and the invoiced quantity match, the two postings cancel and the account nets to zero. **At month-end, a healthy GR/IR account should be near zero** — leftover balances mean goods received but not invoiced, or vice versa.

## Account Determination — \`OBYC\`

Which G/L accounts these movements hit is *not* hard-coded. It is driven by **\`OBYC\`** (automatic account determination for MM), using **transaction/event keys**:

| Key | Controls |
|-----|----------|
| \`BSX\` | Inventory posting (the inventory G/L) |
| \`WRX\` | GR/IR clearing account |
| \`GBB\` | Offsetting entry for goods issues (consumption) |
| \`PRD\` | Price differences |

The account chosen also depends on the **valuation class** on the material master. The rule is:

\`\`\`
Valuation class (material)  +  Transaction key (OBYC)  →  G/L account
\`\`\`

This is precisely Deepak's bug: the material carried the wrong valuation class, so \`BSX\` resolved to the finished-goods inventory account instead of raw materials.

## Price Differences & MR11

If the PO price differs from the material's standard price, the difference cannot sit in inventory (which is valued at standard) — it is posted to the **price difference account (\`PRD\`)**. The CO account assignment for that difference is steered by \`OKB9\`.

Quantities don't always match either. If you receive 100 units but are invoiced for 98, a residual sits in GR/IR. **\`MR11\`** is the GR/IR clearing maintenance transaction used to write off and clear these small quantity/value differences so the account returns to zero.

## Diagnosing "Goods Receipt Posting to the Wrong Inventory Account"

The textbook investigation, and Deepak's exact path:

1. Open \`OBYC\` and select transaction key **\`BSX\`**.
2. Check which G/L account is assigned for each **valuation class**.
3. Compare against the **valuation class on the material master** — a wrong class on the material is the usual culprit.

## Why This Matters

FI-MM integration is what keeps inventory on the balance sheet accurate without finance lifting a finger. Understanding that goods movements auto-post via \`OBYC\`, that valuation class + transaction key choose the account, and that GR/IR must clear to zero, lets a consultant trace any inventory mis-posting straight to its configuration or master-data root cause.`,
    keyConceptTitle: "Goods Movements Auto-Post to FI via OBYC; Valuation Class + Transaction Key Pick the Account",
    keyConceptBody: `- Every MM goods movement automatically creates an FI document. Key points: GR (\`MIGO\`, mvt 101) = Inventory **DR** / GR/IR **CR**; IV (\`MIRO\`) = GR/IR **DR** / Vendor **CR**.
- The **GR/IR clearing account** bridges goods receipt and invoice receipt; at month-end it should net to **zero** when GRs and invoices match.
- Account determination is in **\`OBYC\`** via transaction keys: **\`BSX\`** inventory, **\`WRX\`** GR/IR, **\`GBB\`** goods-issue offset, **\`PRD\`** price differences. The account = **valuation class (material) + transaction key**.
- Price variances (PO ≠ standard) hit **\`PRD\`** (CO assignment via \`OKB9\`); **\`MR11\`** clears GR/IR quantity/value differences. Wrong inventory account → check \`OBYC\` \`BSX\` vs the material's valuation class.`,
  },
});
const flowchart2_30 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_30.id },
  update: {},
  create: {
    lessonId: lesson2_30.id,
    title: "The Procure-to-Pay FI Postings (GR → IV)",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "📥 Goods Receipt (MIGO, mvt 101)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "📒 Inventory DR / GR-IR CR" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 60, y: 120 }, data: { label: "🔧 OBYC: BSX + valuation class" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 230 }, data: { label: "🔁 GR/IR clearing (bridge)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 340 }, data: { label: "🧾 Invoice Verification (MIRO)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 440 }, data: { label: "📕 GR-IR DR / Vendor CR" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 70, y: 440 }, data: { label: "✅ GR/IR nets to zero (MR11 if not)" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node3", target: "node2", type: "default", label: "determines acct" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default", label: "later" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_30.id, nodeId: "node1", title: "Goods Receipt (MIGO)", description: "Stock is received against a purchase order using movement type 101 in MIGO. This automatically triggers an FI accounting document.", tCode: "MIGO", tips: "No FI user is involved — the goods movement itself creates the financial posting." },
    { flowchartId: flowchart2_30.id, nodeId: "node2", title: "Inventory DR / GR-IR CR", description: "The goods receipt debits the inventory account (asset increases) and credits GR/IR clearing (a provisional liability).", tCode: null, tips: "Inventory is valued at standard or moving average per the material's price control." },
    { flowchartId: flowchart2_30.id, nodeId: "node3", title: "OBYC: BSX + Valuation Class", description: "The inventory account is chosen by transaction key BSX in OBYC, combined with the material's valuation class.", tCode: "OBYC", tips: "Wrong valuation class on the material = wrong inventory account. Start here for mis-postings." },
    { flowchartId: flowchart2_30.id, nodeId: "node4", title: "GR/IR Clearing (Bridge)", description: "The GR/IR clearing account temporarily holds the liability between receiving goods and receiving the invoice.", tCode: null, tips: "GR/IR is governed by transaction key WRX in OBYC." },
    { flowchartId: flowchart2_30.id, nodeId: "node5", title: "Invoice Verification (MIRO)", description: "When the vendor invoice arrives, MIRO matches it to the PO and goods receipt and posts the second half of the cycle.", tCode: "MIRO", tips: "Three-way match (PO, GR, invoice) is what protects against overpayment." },
    { flowchartId: flowchart2_30.id, nodeId: "node6", title: "GR-IR DR / Vendor CR", description: "Invoice verification debits GR/IR (clearing the provisional liability) and credits the vendor (the real payable).", tCode: null, tips: "Now the vendor open item is ready for payment via F110." },
    { flowchartId: flowchart2_30.id, nodeId: "node7", title: "GR/IR Nets to Zero", description: "When GR and invoice quantities match, GR/IR clears to zero. Residual differences are cleared with MR11 at period-end.", tCode: "MR11", tips: "A large GR/IR balance at month-end signals goods received but not invoiced (or vice versa)." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_30.id },
  update: {},
  create: {
    lessonId: lesson2_30.id,
    title: "FI-MM Integration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "At a goods receipt (movement type 101), what is the FI posting?",
          explanation: "A goods receipt debits the inventory account (the asset grows) and credits the GR/IR clearing account (a provisional liability until the invoice arrives). The vendor is only credited later, at invoice verification.",
          options: {
            create: [
              { text: "Inventory account DR / GR/IR clearing CR", isCorrect: true },
              { text: "GR/IR clearing DR / Vendor CR", isCorrect: false },
              { text: "Vendor DR / Inventory CR", isCorrect: false },
              { text: "Cost center expense DR / Inventory CR", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why should the GR/IR clearing account be near zero at month-end?",
          explanation: "GR/IR bridges goods receipt and invoice receipt. When the quantity received matches the quantity invoiced, the credit at GR and the debit at IV cancel out. A non-zero balance means goods received but not invoiced (or vice versa).",
          options: {
            create: [
              { text: "Because matching goods receipts and invoices cancel each other; a balance means goods received but not invoiced (or vice versa)", isCorrect: true },
              { text: "Because GR/IR is a revenue account that must be emptied monthly", isCorrect: false },
              { text: "Because SAP deletes the account if it holds a balance", isCorrect: false },
              { text: "Because the vendor account is always zero at month-end", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Goods receipts for a new material are posting to the wrong inventory G/L account. Where do you investigate?",
          explanation: "The inventory account is determined by transaction key BSX in OBYC, combined with the material's valuation class. A wrong valuation class on the material master routes BSX to the wrong account, so compare OBYC BSX assignments against the material's valuation class.",
          options: {
            create: [
              { text: "OBYC → transaction key BSX → compare the G/L per valuation class against the material master's valuation class", isCorrect: true },
              { text: "VKOA → account key ERL → check the customer account assignment group", isCorrect: false },
              { text: "FBN1 → check the document number range for the fiscal year", isCorrect: false },
              { text: "OB41 → check the posting key field status", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.31: FI-SD Integration
const lesson2_31 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fi-sd-integration" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "FI-SD Integration",
    slug: "fi-sd-integration",
    order: 31,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `On go-live morning, the sales team is delighted — billing documents are saving fine in \`VF01\`. But the FI controller, Lakshmi, is staring at an empty revenue account. The billing documents exist, yet not a single accounting document has been created. Revenue for the day is invisible to finance.

Lakshmi has seen this before. A billing document that saves without an accounting document almost always means one of two things: the posting is blocked by the billing document type, or revenue account determination (\`VKOA\`) has no matching entry, so SAP cannot decide where to post. This lesson covers FI-SD integration — how a sales invoice automatically becomes a finance document, and why "billing saved but no accounting document" is one of the most common go-live tickets.`,
    content: `## Sales Invoices Become Finance Documents Automatically

Just as MM goods movements post to FI, **SD billing creates FI documents automatically**. When the business issues a customer invoice, finance does not key anything — revenue, taxes, and the customer receivable all post on their own. The trigger is simple:

\`\`\`
VF01 (create billing document)  →  Accounting document created automatically in FI
\`\`\`

## What a Billing Document Posts

A single customer invoice generates a balanced FI document with several lines:

| Line | Side | Account |
|------|------|---------|
| Customer (AR) | **Debit** | Customer reconciliation account |
| Revenue | **Credit** | Revenue account (from \`VKOA\`) |
| Output tax | **Credit** | Tax account (from condition type \`MWST\`) |
| Sales deduction | **Debit** | Discount account (if any) |

The customer is debited because they now owe you; revenue and tax are credited. The whole thing balances to the invoice total.

## VKOA — Revenue Account Determination

The central configuration is **\`VKOA\`**, which decides the revenue (and deduction/tax/freight) accounts using this combination:

\`\`\`
Chart of Accounts  +  Sales Org  +  Account Assignment Group (customer)  +  Account Assignment Group (material)  +  Account Key  →  G/L account
\`\`\`

The **account key** identifies the type of each line:

| Account key | Posts to |
|-------------|----------|
| \`ERL\` | Revenue |
| \`ERS\` | Sales deductions |
| \`MWS\` | Tax |
| \`ERF\` | Freight |

## The Account Assignment Group — Two Places to Set It

The **account assignment group** is the most common culprit in revenue mis-postings, because it must be maintained in two master records:

- **Customer master** — \`XD02\` → Billing tab (e.g. domestic vs export customers).
- **Material master** — Sales Org 2 view (e.g. premium vs standard products).

If either is blank, the \`VKOA\` access fails to find the intended account and either falls to a default or — if no fallback exists — blocks the posting.

## The Reconciliation Account

The customer master carries a **reconciliation account** — a G/L control account. Every posting to that customer's subledger simultaneously updates this reconciliation G/L, so the general ledger always agrees with the sum of customer balances. You never post directly to a reconciliation account; the subledger drives it.

## Credit Memos

An SD **credit memo** (e.g. for a return or price correction) creates the mirror FI document: it **reverses revenue and AR** — crediting the customer and debiting revenue — so both the customer balance and reported sales are reduced.

## Diagnosing "Billing Saved but No Accounting Document"

Lakshmi's go-live ticket has a standard checklist:

1. **Billing document type / output** — is posting to accounting blocked? Some billing types are set to require manual release to accounting (\`VF02\` → release to accounting).
2. **\`VKOA\` entry missing** — if no account can be determined, FI posting fails. Check that the Sales Org + account assignment groups + account key combination has a G/L assigned.
3. **Account assignment group** — verify it is set on both the customer (\`XD02\`) and the material (Sales Org 2).

Work that list and the empty revenue account fills in.

## Why This Matters

FI-SD integration is what lets a company invoice thousands of customers a day without finance touching a journal. Knowing that \`VKOA\` drives the accounts, that the account assignment group lives on both customer and material masters, and that a blocked billing type or missing \`VKOA\` entry is behind the classic "no accounting document" ticket, makes a consultant the person who fixes order-to-cash on go-live day.`,
    keyConceptTitle: "SD Billing Auto-Posts AR, Revenue & Tax via VKOA",
    keyConceptBody: `- SD billing (\`VF01\`) automatically creates an FI document: **Customer (AR) DR**, **Revenue CR** (from \`VKOA\`), **Output tax CR** (condition \`MWST\`), **Sales deduction DR** (if any).
- **\`VKOA\`** determines accounts from **Chart of Accounts + Sales Org + Account Assignment Group (customer) + Account Assignment Group (material) + Account Key** (\`ERL\` revenue, \`ERS\` deductions, \`MWS\` tax, \`ERF\` freight).
- The **account assignment group** must be set on both the **customer master** (\`XD02\` → Billing) and the **material master** (Sales Org 2 view); the customer's **reconciliation account** keeps the G/L in step with the AR subledger.
- "Billing saved but no accounting document" → check the **billing type / release-to-accounting block** and a **missing \`VKOA\` entry**; an SD credit memo reverses revenue and AR.`,
  },
});
const flowchart2_31 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_31.id },
  update: {},
  create: {
    lessonId: lesson2_31.id,
    title: "From Sales Invoice to FI Document",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🧾 Billing document created (VF01)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "🚦 Posting to accounting allowed?" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 580, y: 120 }, data: { label: "❌ Blocked → no FI doc (release in VF02)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 305, y: 230 }, data: { label: "🔎 VKOA determines accounts" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 70, y: 340 }, data: { label: "👤 Customer (AR) DR" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 340 }, data: { label: "💰 Revenue CR (ERL)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 520, y: 340 }, data: { label: "🧮 Output tax CR (MWS)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 305, y: 450 }, data: { label: "✅ Balanced FI document posted" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default", label: "no" },
      { id: "e3", source: "node2", target: "node4", type: "default", label: "yes" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node4", target: "node7", type: "default" },
      { id: "e7", source: "node5", target: "node8", type: "default" },
      { id: "e8", source: "node6", target: "node8", type: "default" },
      { id: "e9", source: "node7", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_31.id, nodeId: "node1", title: "Billing Document Created", description: "The sales team creates a customer invoice in VF01. This is the SD event that should trigger an automatic FI posting.", tCode: "VF01", tips: "VF04 (billing due list) is used for mass billing across many deliveries." },
    { flowchartId: flowchart2_31.id, nodeId: "node2", title: "Posting to Accounting Allowed?", description: "The billing document type controls whether the FI posting happens automatically or is blocked pending manual release.", tCode: "VOFA", tips: "Some billing types deliberately require release to accounting for control." },
    { flowchartId: flowchart2_31.id, nodeId: "node3", title: "Blocked → No FI Document", description: "If posting is blocked, the billing document saves but no accounting document is created — the classic go-live ticket. Release it in VF02.", tCode: "VF02", tips: "VF02 → 'Release to accounting' posts the FI document for a blocked invoice." },
    { flowchartId: flowchart2_31.id, nodeId: "node4", title: "VKOA Determines Accounts", description: "SAP combines Chart of Accounts, Sales Org, customer and material account assignment groups, and the account key to find each G/L.", tCode: "VKOA", tips: "A missing VKOA entry stops the FI posting entirely." },
    { flowchartId: flowchart2_31.id, nodeId: "node5", title: "Customer (AR) Debit", description: "The customer reconciliation account is debited because the customer now owes the invoice amount.", tCode: null, tips: "The reconciliation account on the customer master keeps the G/L aligned with the AR subledger." },
    { flowchartId: flowchart2_31.id, nodeId: "node6", title: "Revenue Credit (ERL)", description: "Revenue is credited to the account found via VKOA using account key ERL, split by customer/material group if configured.", tCode: "VKOA", tips: "Use material account assignment groups to split premium vs standard revenue." },
    { flowchartId: flowchart2_31.id, nodeId: "node7", title: "Output Tax Credit (MWS)", description: "Output tax from condition type MWST is credited to the tax account via account key MWS.", tCode: null, tips: "Tax accounts here must reconcile to the statutory output-tax return." },
    { flowchartId: flowchart2_31.id, nodeId: "node8", title: "Balanced FI Document Posted", description: "The debits (customer, deductions) and credits (revenue, tax) balance to the invoice total, completing FI-SD integration.", tCode: null, tips: "An SD credit memo posts the mirror image, reversing revenue and AR." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_31.id },
  update: {},
  create: {
    lessonId: lesson2_31.id,
    title: "FI-SD Integration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "When an SD billing document posts to FI, which account is debited?",
          explanation: "The customer (AR) reconciliation account is debited because the customer now owes the invoice amount. Revenue and output tax are credited, and the document balances to the invoice total.",
          options: {
            create: [
              { text: "The customer (AR) reconciliation account", isCorrect: true },
              { text: "The revenue account", isCorrect: false },
              { text: "The output tax account", isCorrect: false },
              { text: "The GR/IR clearing account", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "On which two master records must the account assignment group be maintained for revenue determination?",
          explanation: "The account assignment group is set on the customer master (XD02 → Billing tab) and the material master (Sales Org 2 view). VKOA combines both groups to determine the revenue account, so a blank group on either causes mis-postings.",
          options: {
            create: [
              { text: "The customer master (Billing tab) and the material master (Sales Org 2 view)", isCorrect: true },
              { text: "The vendor master and the G/L account master", isCorrect: false },
              { text: "The cost center master and the activity type master", isCorrect: false },
              { text: "The company code and the controlling area", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A billing document saved successfully but no accounting document was created. What are the two most likely causes?",
          explanation: "Either the billing document type blocks automatic posting to accounting (release it in VF02), or VKOA has no matching entry so SAP cannot determine the revenue account. Both stop the FI document from being created even though the billing document saved.",
          options: {
            create: [
              { text: "The billing type blocks posting to accounting, or VKOA has no matching account-determination entry", isCorrect: true },
              { text: "The GR/IR account is non-zero, or MR11 was not run", isCorrect: false },
              { text: "The activity rate is missing in KP26, or CO11N was not confirmed", isCorrect: false },
              { text: "The number range is exhausted, or the posting key is suppressed", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.32: Cost Center Planning (CO-OM)
const lesson2_32 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "cost-center-planning-co-om" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Cost Center Planning (CO-OM)",
    slug: "cost-center-planning-co-om",
    order: 32,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `The new finance director asks her controller, Suresh, for the one report every CFO lives by: planned versus actual cost by department. Suresh runs \`S_ALR_87013611\`, and the result is alarming — every single cost center shows 100% variance. It looks as if the whole company has blown its budget overnight.

Suresh exhales, because he knows this is not a spending problem. The cost centers have plenty of *actual* costs, but the *plan* column is all zeros — \`KP06\` was never run, so there is no budget to compare against. A report comparing real costs to a blank plan will always show 100% variance. This lesson is about cost center planning: how you lay down the plan that turns the most-used report in CO from noise into insight.`,
    content: `## Why Planning Exists

Management reporting in CO rests on one idea: comparing what you *planned* to spend against what you *actually* spent. **Cost center planning** lays down that plan, cost center by cost center. Without it, actual costs have nothing to be measured against — and the variance report becomes meaningless, as Suresh discovered.

## The Two Planning Transactions

There are two planning activities, and they are easy to confuse:

| T-code | Plans |
|--------|-------|
| \`KP06\` | **Primary costs** on a cost center — salary, rent, utilities — by cost element and period |
| \`KP26\` | **Activity quantities and rates** — machine hours, labour hours |

\`KP06\` is the one that fills the "plan" column of the classic variance report. \`KP26\` (covered with activity types) feeds product costing. Both feed the bigger picture, but for plan-vs-actual cost reporting, \`KP06\` is the essential step.

## The Planning Layout

Planning data is entered through a **planning layout** — an Excel-like grid with cost centers in the rows, cost elements in the columns, and periods spread across. It feels like a spreadsheet, which makes it approachable: you simply type the planned amount for each cost element and period. Layouts can be tailored so each planner sees only the rows and columns relevant to them.

## Planning Versions

Plans live in **versions**:

- **Version 0** is the **operative plan** — the official budget used for actual-vs-plan reporting. This is the version the variance report reads.
- Other versions (1, 2, …) hold **scenarios** — best case, worst case, a re-forecast — without disturbing the official plan.

This separation lets controllers model "what if" cases while leaving Version 0, the number everyone is measured against, untouched.

## Tools That Speed Up Planning

A few transactions make planning less manual:

- **\`KP97\` — copy planning**: copy a plan from one version or year to another as a starting baseline, then adjust. Far faster than typing from scratch each year.
- **Top-down distribution**: plan a lump sum at company or division level, then have SAP distribute it down to individual cost centers by a chosen basis.
- **Integrated planning**: CO plan data can flow into FI (profit center planning, balance sheet planning) so financial and managerial plans stay aligned.

## The Most-Used Report — \`S_ALR_87013611\`

The report Suresh ran, **\`S_ALR_87013611\`**, is the single most-used CO report. It shows, per cost center and cost element, **planned vs actual vs variance**. It is the backbone of monthly management reviews — which is exactly why a missing plan is so visible.

## Diagnosing "100% Variance Everywhere"

The textbook cause, and Suresh's exact situation:

1. The variance report shows 100% variance across all cost centers.
2. Actual costs exist, but the plan column is zero.
3. **\`KP06\` was never executed** — there is no plan to compare against.

The fix is to enter the plan in \`KP06\` (in Version 0, for the right fiscal year), after which the report shows meaningful variances.

## Why This Matters

Cost center planning is what gives every actual cost a yardstick. Run \`KP06\` in Version 0 and the company's most important CO report comes alive with real variances managers can act on; skip it and the same report screams a crisis that does not exist. Knowing the difference between a planning gap and a spending problem is what makes a controller trustworthy.`,
    keyConceptTitle: "KP06 in Version 0 Gives Actuals a Yardstick for the Variance Report",
    keyConceptBody: `- **Cost center planning** lays down the budget that actual costs are compared against; without it, plan-vs-actual reporting is meaningless.
- \`KP06\` plans **primary costs** (salary, rent, utilities) by cost element and period; \`KP26\` plans **activity quantities and rates**. \`KP06\` fills the plan column of the variance report.
- Plans live in **versions**: **Version 0 = operative plan** used for actual-vs-plan reporting; other versions hold scenarios. \`KP97\` copies plans; top-down distribution and integrated planning speed and align planning.
- **\`S_ALR_87013611\`** is the most-used CO report (planned vs actual vs variance). **100% variance everywhere** = \`KP06\` was never run, so plan is zero — enter the plan in Version 0.`,
  },
});
const flowchart2_32 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_32.id },
  update: {},
  create: {
    lessonId: lesson2_32.id,
    title: "The Cost Center Planning Cycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "📝 Open planning layout (grid)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "🗂️ Choose Version 0 (operative)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 220 }, data: { label: "💵 Plan primary costs (KP06)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 70, y: 220 }, data: { label: "⚙️ Plan activity rates (KP26)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 320 }, data: { label: "📥 Actual costs post during period" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 300, y: 420 }, data: { label: "📊 Plan vs Actual report (S_ALR_87013611)" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 580, y: 420 }, data: { label: "⚠️ No KP06 → 100% variance" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default", label: "if plan = 0" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_32.id, nodeId: "node1", title: "Open Planning Layout", description: "Planning is entered through an Excel-like grid — cost centers in rows, cost elements in columns, periods across — making it approachable.", tCode: "KP06", tips: "Layouts can be tailored so each planner sees only their relevant rows and columns." },
    { flowchartId: flowchart2_32.id, nodeId: "node2", title: "Choose Version 0", description: "Version 0 is the operative plan read by the variance report. Other versions hold scenarios without disturbing the official budget.", tCode: null, tips: "Always plan in Version 0 for numbers that should appear in actual-vs-plan reporting." },
    { flowchartId: flowchart2_32.id, nodeId: "node3", title: "Plan Primary Costs (KP06)", description: "Enter planned salary, rent, utilities and other primary costs by cost element and period. This fills the plan column of the variance report.", tCode: "KP06", tips: "This is the step most often skipped — and the cause of 100% variance reports." },
    { flowchartId: flowchart2_32.id, nodeId: "node4", title: "Plan Activity Rates (KP26)", description: "KP26 plans activity quantities and rates (machine/labour hours) for product costing — complementary to primary-cost planning.", tCode: "KP26", tips: "KP06 plans costs; KP26 plans activity quantities and the resulting rate." },
    { flowchartId: flowchart2_32.id, nodeId: "node5", title: "Actual Costs Post During Period", description: "Through the month, real costs accumulate on cost centers from FI postings, allocations and activity confirmations.", tCode: "KSB1", tips: "KSB1 shows the actual line items that the report will compare against plan." },
    { flowchartId: flowchart2_32.id, nodeId: "node6", title: "Plan vs Actual Report", description: "S_ALR_87013611, the most-used CO report, shows planned vs actual vs variance per cost center and cost element.", tCode: "S_ALR_87013611", tips: "This report is the backbone of monthly management reviews." },
    { flowchartId: flowchart2_32.id, nodeId: "node7", title: "No KP06 → 100% Variance", description: "If KP06 was never run, the plan column is zero, so the report shows 100% variance everywhere — a planning gap, not a spending problem.", tCode: "KP06", tips: "Fix by entering the plan in KP06 (Version 0, correct fiscal year)." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson2_32.id },
  update: {},
  create: {
    lessonId: lesson2_32.id,
    title: "Cost Center Planning (CO-OM) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to plan primary costs (salary, rent, utilities) on a cost center?",
          explanation: "KP06 plans primary costs on a cost center by cost element and period, filling the plan column of the variance report. KP26 plans activity quantities and rates, and KP97 copies plans between versions or years.",
          options: {
            create: [
              { text: "KP06", isCorrect: true },
              { text: "KP26", isCorrect: false },
              { text: "KP97", isCorrect: false },
              { text: "KSU5", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the role of Version 0 in cost center planning?",
          explanation: "Version 0 is the operative plan — the official budget read by the actual-vs-plan variance report. Other versions hold scenarios (best/worst case, re-forecasts) without affecting the official number everyone is measured against.",
          options: {
            create: [
              { text: "It is the operative plan used for actual-vs-plan reporting; other versions hold scenarios", isCorrect: true },
              { text: "It is a test version that is never used in reporting", isCorrect: false },
              { text: "It stores only activity rates, not costs", isCorrect: false },
              { text: "It is automatically deleted at year-end", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "The report S_ALR_87013611 shows 100% variance on every cost center, yet actual costs clearly exist. What happened?",
          explanation: "A 100% variance with real actuals means the plan column is zero — KP06 was never executed for those cost centers (in Version 0, for that fiscal year). It is a planning gap, not a spending problem. Entering the plan in KP06 fixes the report.",
          options: {
            create: [
              { text: "KP06 was never run, so the plan is zero — enter the plan in Version 0 for the correct fiscal year", isCorrect: true },
              { text: "An assessment cycle posted to every cost center — reverse it in KSU5", isCorrect: false },
              { text: "The GR/IR account is unbalanced — clear it in MR11", isCorrect: false },
              { text: "The number range for CO documents is missing — add it in FBN1", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 9B COMPLETE: FICO Config Fundamentals — 195 total lessons ─────────
