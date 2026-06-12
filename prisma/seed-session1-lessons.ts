// ─── FOUNDATION: NEW LESSONS ───────────────────────────────────────────────
// LESSON 1.3: SAP Navigation & T-Codes
const lesson1_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-navigation-tcodes" } },
  update: {},
  create: {
    moduleId: foundationModule.id,
    title: "SAP Navigation & T-Codes",
    slug: "sap-navigation-tcodes",
    order: 3,
    isPublished: true,
    estimatedMinutes: 9,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Aarav just logged into SAP for the first time. His trainer says, "Go to ME21N and create a purchase order." Aarav stares at the screen — there are menus everywhere, a strange little box at the top, and nothing called "ME21N" in sight.

He feels lost, like being dropped in a huge airport with no signs. But within an hour, he discovers a shortcut that makes SAP feel like home: the command field. This lesson is that hour, compressed.`,
    content: `## The SAP Easy Access Screen

When you log in, you land on the **SAP Easy Access** menu — a big folder tree of every function, grouped by area (Accounting, Logistics, HR). You *can* click through these folders, but it's slow, like digging through nested drawers.

## The Command Field — Your Shortcut

At the very top-left is a small white box called the **command field**. Type a code here, press Enter, and you jump straight to that screen. This code is called a **Transaction Code** (T-code).

Think of T-codes like **speed-dial numbers** on a phone. Instead of scrolling your contacts, you punch a short number and connect instantly.

| You type | You land on |
|----------|-------------|
| ME21N | Create Purchase Order |
| FB60 | Post Vendor Invoice |
| VA01 | Create Sales Order |
| SU01 | User Maintenance |

## Navigating Between Screens

A few command-field prefixes save huge time:

| Command | What it does |
|---------|--------------|
| /n | Close current transaction, start fresh (e.g. \`/nME21N\`) |
| /o | Open the transaction in a **new window** (e.g. \`/oVA03\`) |
| /nend | Log off SAP |

The toolbar buttons matter too: the green **back arrow** (F3) goes back one screen, the yellow arrow exits the transaction, and the red **X** cancels.

## Favorites — Build Your Own Menu

You don't have to memorize every code. SAP lets you save T-codes to a **Favorites** folder so your most-used screens are one click away — like bookmarking websites.

## Why This Matters

Real SAP consultants almost never use the menu tree. They type T-codes because it's faster and the same across every SAP system worldwide. Learning to navigate confidently is the very first skill that separates a nervous beginner from someone who looks like they belong.

**Quick tip:** To see the T-code of any screen you're already on, look at the bottom status bar or type \`/n\` and watch the field — knowing where you are is half the battle.`,
    keyConceptTitle: "T-Codes Are Shortcuts to Any SAP Screen",
    keyConceptBody: `- A **Transaction Code (T-code)** typed in the command field jumps you straight to a function — like speed-dial.
- Use \`/n\` to start fresh, \`/o\` to open a new window, \`/nend\` to log off.
- Save frequent T-codes to **Favorites** so you never have to dig through menus.`,
  },
});
// Flowchart for lesson 1.3
const flowchart1_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson1_3.id },
  update: {},
  create: {
    lessonId: lesson1_3.id,
    title: "Navigating SAP with T-Codes",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 40 }, data: { label: "🔑 Log In to SAP" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 150 }, data: { label: "🏠 SAP Easy Access Menu" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 260 }, data: { label: "⌨️ Type T-Code in Command Field" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 370 }, data: { label: "📄 Land on the Transaction Screen" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 250, y: 480 }, data: { label: "⭐ Save to Favorites" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart1_3.id, nodeId: "n1", title: "Log In to SAP", description: "Enter your client number, user ID, and password. The client is the specific business environment you're working in (e.g. 100 for training).", tCode: "N/A", tips: "Always confirm which client you're in — config in the wrong client is a classic beginner mistake." },
    { flowchartId: flowchart1_3.id, nodeId: "n2", title: "SAP Easy Access Menu", description: "The home screen showing the menu tree of all functions. You can navigate by folders, but it's slow compared to T-codes.", tCode: "S000", tips: "Right-click the menu tree and choose 'Technical names on' to reveal each item's T-code." },
    { flowchartId: flowchart1_3.id, nodeId: "n3", title: "Type a T-Code", description: "The command field is the small box at the top-left. Type a transaction code and press Enter to jump directly to that screen.", tCode: "ME21N, FB60, VA01...", tips: "Use /n before a code to switch transactions instantly: /nFB60." },
    { flowchartId: flowchart1_3.id, nodeId: "n4", title: "Transaction Screen", description: "You arrive at the function you wanted — creating a PO, posting an invoice, etc. The green back arrow (F3) returns to the previous screen.", tCode: "N/A", tips: "F1 on any field shows help; F4 opens a search/value list — two lifesaving keys." },
    { flowchartId: flowchart1_3.id, nodeId: "n5", title: "Save to Favorites", description: "Drag or add frequently used T-codes into your Favorites folder so they're always one click away.", tCode: "N/A", tips: "A tidy Favorites list tailored to your role makes you noticeably faster day to day." },
  ],
});
// Quiz for lesson 1.3
await prisma.quiz.upsert({
  where: { lessonId: lesson1_3.id },
  update: {},
  create: {
    lessonId: lesson1_3.id,
    title: "SAP Navigation & T-Codes — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the fastest way to open a specific function in SAP?",
          explanation: "Typing the Transaction Code (T-code) in the command field jumps you straight to the function — far faster than clicking through the Easy Access menu tree.",
          options: {
            create: [
              { text: "Type its T-code in the command field", isCorrect: true },
              { text: "Search Google for the screen", isCorrect: false },
              { text: "Click through every menu folder until you find it", isCorrect: false },
              { text: "Call the IT helpdesk each time", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "You are inside FB60 and want to switch directly to VA01 without going back to the menu. What do you type?",
          explanation: "Prefixing a T-code with /n closes the current transaction and opens the new one in the same window. So /nVA01 takes you straight from FB60 to VA01.",
          options: {
            create: [
              { text: "/nVA01", isCorrect: true },
              { text: "VA01 (with no prefix, which only works from the menu)", isCorrect: false },
              { text: "/end VA01", isCorrect: false },
              { text: "back-back-back then click VA01", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why do experienced SAP consultants rarely use the Easy Access menu tree?",
          explanation: "T-codes are faster and identical across every SAP system worldwide. Once memorized, they let a consultant work the same way on any client's system without re-learning menus.",
          options: {
            create: [
              { text: "T-codes are faster and work the same on every SAP system", isCorrect: true },
              { text: "The menu tree is only available to administrators", isCorrect: false },
              { text: "The menu tree costs extra to license", isCorrect: false },
              { text: "T-codes are required to log in", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 1.4: SAP Organizational Structure
const lesson1_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-organizational-structure" } },
  update: {},
  create: {
    moduleId: foundationModule.id,
    title: "SAP Organizational Structure",
    slug: "sap-organizational-structure",
    order: 4,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `Fatima joins a company that runs SAP across three countries and seven factories. On day one her manager says, "We'll post this to Company Code 1000, Plant 1100, Storage Location 0001." Fatima nods politely but has no idea what those numbers mean.

It turns out SAP mirrors the real company as a set of nested boxes — country, factory, shelf. Once Fatima sees the boxes, every cryptic number suddenly makes sense.`,
    content: `## Why SAP Needs an Organizational Structure

A company isn't one blob — it has legal entities, factories, warehouses, sales offices. SAP represents all of this with **organizational units**: standard building blocks that mirror the real business so that data and transactions land in the right place.

## The Key Units (From Big to Small)

| Unit | What it represents | Example |
|------|--------------------|---------|
| **Client** | The entire SAP system / corporate group | 100 |
| **Company Code** | A legal entity that produces its own financial statements | 1000 (India Pvt Ltd) |
| **Plant** | A factory, warehouse, or operational site | 1100 (Pune Factory) |
| **Storage Location** | A specific stock area inside a plant | 0001 (Raw Materials) |

Think of it like an **address**: Client is the country, Company Code is the city, Plant is the building, and Storage Location is the exact room.

## Finance vs Logistics Views

SAP groups org units by purpose:

- **Finance side:** Client → Company Code. The Company Code is where the balance sheet and P&L live. Every financial document belongs to one company code.
- **Logistics side:** Company Code → Plant → Storage Location. This is where materials are made, stored, and moved.

There are sales-specific units too — **Sales Organization**, **Distribution Channel**, and **Division** — which together form the "sales area" used in SD.

## How They Connect

A **Plant** is always assigned to a **Company Code**, so when goods move in a plant, SAP knows which legal entity's books to update. A single company code can own several plants; a single plant can hold many storage locations.

## A Real Example

You receive 500 kg of steel:
- It physically arrives at **Plant 1100**, **Storage Location 0001**.
- Because Plant 1100 belongs to **Company Code 1000**, the financial posting (inventory value increase) hits Company Code 1000's books automatically.

One physical action, correctly placed across the structure, updates both logistics and finance.

## Why It Matters

Get the org structure wrong and everything downstream breaks — reports show the wrong entity, stock sits in the wrong place, taxes calculate incorrectly. This is why org structure is decided very early in every SAP project and rarely changed afterward.`,
    keyConceptTitle: "SAP Mirrors the Company as Nested Org Units",
    keyConceptBody: `- **Client → Company Code → Plant → Storage Location** is like Country → City → Building → Room.
- **Company Code** = legal entity with its own financial statements (finance view).
- **Plant** and **Storage Location** handle where goods are made and stored (logistics view).
- Plants are assigned to Company Codes, so physical movements automatically update the right financial books.`,
  },
});
// Flowchart for lesson 1.4
const flowchart1_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson1_4.id },
  update: {},
  create: {
    lessonId: lesson1_4.id,
    title: "SAP Organizational Structure Hierarchy",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 40 }, data: { label: "🌐 Client (Whole System)" }, style: { background: "#1E293B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 150 }, data: { label: "🏢 Company Code (Legal Entity)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 260 }, data: { label: "🏭 Plant (Factory / Site)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 370 }, data: { label: "📦 Storage Location (Stock Area)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 560, y: 150 }, data: { label: "💰 Financial Statements" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n2", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart1_4.id, nodeId: "n1", title: "Client", description: "The highest level — the entire SAP system and the corporate group. All data and customizing sit within a client. Most companies have one production client.", tCode: "SCC4 (view clients)", tips: "Data in one client is fully separate from another — you can't accidentally mix client 100 and 200 data." },
    { flowchartId: flowchart1_4.id, nodeId: "n2", title: "Company Code", description: "A legal entity that produces its own balance sheet and P&L. Every financial document is posted to exactly one company code.", tCode: "OX02 / OBY6", tips: "If a group has 5 legal companies, expect 5 company codes — each closes its own books." },
    { flowchartId: flowchart1_4.id, nodeId: "n3", title: "Plant", description: "An operational site — a factory, distribution center, or warehouse. Plants are assigned to a company code so movements update the right books.", tCode: "OX10", tips: "Plant is the most-used logistics unit; nearly every MM and PP transaction asks for it." },
    { flowchartId: flowchart1_4.id, nodeId: "n4", title: "Storage Location", description: "A specific stock area within a plant, like a raw-materials store or finished-goods bay. It tells SAP exactly where inventory physically sits.", tCode: "OX09", tips: "Use clear storage location codes so warehouse staff instantly know which area is meant." },
    { flowchartId: flowchart1_4.id, nodeId: "n5", title: "Financial Statements", description: "Because the Company Code is the legal accounting unit, all postings roll up into its balance sheet and P&L automatically.", tCode: "F.01 (Financial Statements)", tips: "When a report looks wrong, first check you selected the correct company code." },
  ],
});
// Quiz for lesson 1.4
await prisma.quiz.upsert({
  where: { lessonId: lesson1_4.id },
  update: {},
  create: {
    lessonId: lesson1_4.id,
    title: "SAP Organizational Structure — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which organizational unit produces its own balance sheet and P&L?",
          explanation: "The Company Code is the legal accounting entity in SAP. Every financial document belongs to one company code, and financial statements are produced at this level.",
          options: {
            create: [
              { text: "Company Code", isCorrect: true },
              { text: "Storage Location", isCorrect: false },
              { text: "Plant", isCorrect: false },
              { text: "Distribution Channel", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Goods are received into Plant 1100, which belongs to Company Code 1000. Whose books does the inventory value update?",
          explanation: "Because a plant is always assigned to a company code, a physical goods movement in Plant 1100 automatically posts the financial impact to Company Code 1000 — one action, correctly placed, updates both logistics and finance.",
          options: {
            create: [
              { text: "Company Code 1000's books", isCorrect: true },
              { text: "No books — goods receipts are not financial", isCorrect: false },
              { text: "Every company code in the client", isCorrect: false },
              { text: "The Storage Location's own separate ledger", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the correct order of org units from largest to smallest?",
          explanation: "The hierarchy runs Client → Company Code → Plant → Storage Location, like Country → City → Building → Room. Each level sits inside the one above it.",
          options: {
            create: [
              { text: "Client → Company Code → Plant → Storage Location", isCorrect: true },
              { text: "Plant → Client → Storage Location → Company Code", isCorrect: false },
              { text: "Storage Location → Plant → Client → Company Code", isCorrect: false },
              { text: "Company Code → Client → Storage Location → Plant", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 1.5: SAP Master Data
const lesson1_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-master-data" } },
  update: {},
  create: {
    moduleId: foundationModule.id,
    title: "SAP Master Data Explained",
    slug: "sap-master-data",
    order: 5,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Rohan keeps typing a customer's name, address, and payment terms into every single sales order — twenty times a day. One afternoon a senior colleague laughs kindly and says, "You know all of that is stored once in the customer master, right? You just enter the customer number."

Rohan had been re-typing data that SAP already remembered. That lightbulb moment — the difference between master data and transaction data — changes how he sees the whole system.`,
    content: `## Two Kinds of Data in SAP

Everything in SAP is one of two types:

- **Master Data** — relatively permanent reference information you set up once and reuse: customers, vendors, materials, G/L accounts.
- **Transaction Data** — the day-to-day business events that *use* master data: sales orders, invoices, goods receipts.

A simple way to remember: **master data is the cast of characters; transaction data is the story they act out.**

## Why Master Data Matters So Much

When you create a sales order, you don't retype the customer's address — you enter the **customer number**, and SAP pulls everything from the customer master. This means:

- **Enter once, reuse everywhere** — no repetitive typing.
- **Consistency** — every document uses the same correct details.
- **Fewer errors** — fix the address in one place and all future documents are correct.

Master data is the foundation; if it's wrong, thousands of transactions inherit the mistake.

## The Big Four Master Data Objects

| Master Data | Used by | Example T-code |
|-------------|---------|----------------|
| **Customer Master** | SD (sales) | BP / XD03 |
| **Vendor Master** | MM (purchasing) | BP / XK03 |
| **Material Master** | MM, PP, SD | MM01 / MM03 |
| **G/L Account Master** | FICO | FS00 |

## Master Data Has "Views"

A single master record is shared by many departments, so it's organized into **views**. The Material Master, for example, has a Sales view, a Purchasing view, an Accounting view, and more — each team maintains its own section of the same record.

Think of it like a shared customer file with tabs: Sales fills in the "how we sell to them" tab, Finance fills in the "how we get paid" tab.

## A Real Example

The material "Steel Rod 10mm" is created once in the Material Master. From then on:
- Purchasing orders it (Purchasing view),
- The warehouse stores it (Plant/Storage view),
- Finance values it (Accounting view),
- Sales sells it (Sales view).

One master record, many uses — no duplication anywhere.

## Why It Matters

Clean master data is the single biggest factor in a healthy SAP system. Companies invest heavily in "master data governance" because every report, every transaction, and every decision ultimately rests on it.`,
    keyConceptTitle: "Master Data Is Set Up Once and Reused Everywhere",
    keyConceptBody: `- **Master data** = permanent reference info (customers, vendors, materials, accounts); **transaction data** = daily events (orders, invoices) that use it.
- Enter master data once, then reference it by number — ensuring consistency and fewer errors.
- Master records have **views** so each department maintains its own part of the same shared record.`,
  },
});
// Flowchart for lesson 1.5
const flowchart1_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson1_5.id },
  update: {},
  create: {
    lessonId: lesson1_5.id,
    title: "How Master Data Feeds Transactions",
    nodes: [
      { id: "n1", type: "default", position: { x: 80, y: 60 }, data: { label: "👤 Customer Master" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 80, y: 180 }, data: { label: "📦 Material Master" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 80, y: 300 }, data: { label: "🏭 Vendor Master" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 420, y: 180 }, data: { label: "📝 Transaction (e.g. Sales Order)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 720, y: 180 }, data: { label: "✅ Accurate, Consistent Document" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n4", type: "default" },
      { id: "e2", source: "n2", target: "n4", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart1_5.id, nodeId: "n1", title: "Customer Master", description: "Stores everything about a customer once: name, addresses, payment terms, tax data. Sales documents reference it by customer number.", tCode: "BP / XD03", tips: "Fix a customer's address in the master and every future order is automatically correct." },
    { flowchartId: flowchart1_5.id, nodeId: "n2", title: "Material Master", description: "The central record for a product or material, organized into department views (Sales, Purchasing, Accounting, Storage).", tCode: "MM01 / MM03", tips: "If a transaction won't accept a material, a required view is probably missing for that plant or sales area." },
    { flowchartId: flowchart1_5.id, nodeId: "n3", title: "Vendor Master", description: "Holds supplier details — bank info, payment terms, purchasing data. Purchase orders and invoices reference it.", tCode: "BP / XK03", tips: "Accurate vendor bank data prevents failed or misdirected payments." },
    { flowchartId: flowchart1_5.id, nodeId: "n4", title: "Transaction Document", description: "Day-to-day events like a sales order pull their details from master data instead of re-typing — fast and consistent.", tCode: "VA01, ME21N, FB60", tips: "You enter a number (customer/material/vendor); SAP fills the rest from the master." },
    { flowchartId: flowchart1_5.id, nodeId: "n5", title: "Clean Result", description: "Because every document reuses the same master data, results stay consistent and error-free across the whole company.", tCode: "N/A", tips: "Most data-quality problems trace back to bad master data, not bad transactions." },
  ],
});
// Quiz for lesson 1.5
await prisma.quiz.upsert({
  where: { lessonId: lesson1_5.id },
  update: {},
  create: {
    lessonId: lesson1_5.id,
    title: "SAP Master Data — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which of these is MASTER data rather than transaction data?",
          explanation: "A vendor master is permanent reference information set up once and reused. A purchase order, goods receipt, or invoice are transactions that use that master data.",
          options: {
            create: [
              { text: "The vendor master record", isCorrect: true },
              { text: "A goods receipt posted today", isCorrect: false },
              { text: "A specific vendor invoice", isCorrect: false },
              { text: "Yesterday's sales order", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A customer changes their billing address. What is the BEST way to handle this in SAP?",
          explanation: "Updating the address once in the customer master means every future document automatically uses the correct address — this is the whole point of master data. Editing each order individually is error-prone and misses the master's purpose.",
          options: {
            create: [
              { text: "Update the address once in the customer master", isCorrect: true },
              { text: "Type the new address manually into each new order", isCorrect: false },
              { text: "Create a brand-new customer for every address change", isCorrect: false },
              { text: "Email the address to the warehouse instead", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is the Material Master organized into 'views'?",
          explanation: "Many departments share one material record, so it's split into views (Sales, Purchasing, Accounting, Storage). Each team maintains its own section of the same record, keeping data unified yet relevant to each function.",
          options: {
            create: [
              { text: "So each department maintains its own section of one shared record", isCorrect: true },
              { text: "Because SAP creates a separate material for each department", isCorrect: false },
              { text: "To make the material harder to find", isCorrect: false },
              { text: "Views are only for printing reports", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 1.6: The SAP Document Principle
const lesson1_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-document-principle" } },
  update: {},
  create: {
    moduleId: foundationModule.id,
    title: "The SAP Document Principle",
    slug: "sap-document-principle",
    order: 6,
    isPublished: true,
    estimatedMinutes: 9,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `During an audit, an inspector asks Lakshmi, "Show me proof of this ₹2,00,000 payment — who entered it, when, and why?" Lakshmi calmly types one document number and the full story appears: the user, the date, the accounts, the source invoice.

In her old company, this would have meant digging through emails and spreadsheets for hours. In SAP, every action leaves a permanent, traceable document. That reliability is no accident — it's a core design rule.`,
    content: `## Every Posting Creates a Document

In SAP there's a golden rule: **nothing is saved without creating a document.** Post an invoice, receive goods, pay a vendor — each action generates a uniquely numbered document that records exactly what happened.

Think of it like a **receipt for every action**. You can always go back, find the receipt, and see the full truth.

## What's in a Document?

Every SAP document has two parts:

| Part | Contains |
|------|----------|
| **Header** | Document number, date, document type, who posted it, company code |
| **Line Items** | The actual details — which accounts, amounts, debits/credits, quantities |

For a financial posting, the line items must always balance (total debits = total credits). SAP refuses to save an unbalanced document — a built-in safety net.

## The Audit Trail

Because every document records **who, what, when, and why**, SAP gives you a complete **audit trail**. This is essential for:

- **Compliance** — auditors can trace any number to its origin.
- **Error fixing** — you never delete a posted document; you **reverse** it with another document, leaving both visible.
- **Transparency** — managers can drill from a report figure down to the exact source document.

## Document Numbers and Types

Each document gets a unique **document number**, and a **document type** tells you what kind it is (e.g. KR = vendor invoice, DR = customer invoice, SA = G/L posting). The type also controls which number range it uses.

## Document Flow — The Chain

In logistics, documents link together in a **document flow**. A sales order → delivery → goods issue → billing document are all connected. From any one document you can see the whole chain, forward and backward.

## A Real Example

You post a vendor invoice in FB60:
- SAP generates document number **1900000045**.
- Later you realize it's wrong. You don't erase it — you post a **reversal** (FB08), creating document **1900000046** that cancels it.
- Both documents remain, so the history stays honest.

## Why It Matters

The document principle is why SAP is trusted by the world's largest companies for financial reporting. Every figure can be proven, every change is recorded, and nothing simply "disappears."`,
    keyConceptTitle: "Every SAP Posting Creates a Traceable Document",
    keyConceptBody: `- Nothing is saved in SAP without generating a uniquely numbered **document** (header + line items).
- Financial documents must balance (debits = credits) or SAP won't save them.
- You never delete a posted document — you **reverse** it, preserving a complete audit trail of who, what, when, and why.`,
  },
});
// Flowchart for lesson 1.6
const flowchart1_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson1_6.id },
  update: {},
  create: {
    lessonId: lesson1_6.id,
    title: "The SAP Document Principle",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 40 }, data: { label: "🖊️ User Posts a Business Action" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 150 }, data: { label: "⚖️ SAP Checks Debits = Credits" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 260 }, data: { label: "🔢 Unique Document Number Created" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 370 }, data: { label: "🗂️ Audit Trail Stored (Who/What/When)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 560, y: 370 }, data: { label: "↩️ Mistake? Post a Reversal" }, style: { background: "#EF4444", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart1_6.id, nodeId: "n1", title: "User Posts an Action", description: "Any business action — invoice, goods receipt, payment — is entered by a user and submitted for posting.", tCode: "FB60, MIGO, VF01...", tips: "Use Simulate before posting financial documents to preview the result." },
    { flowchartId: flowchart1_6.id, nodeId: "n2", title: "Balance Check", description: "For financial documents, SAP verifies total debits equal total credits. An unbalanced document cannot be saved.", tCode: "N/A", tips: "If SAP blocks your posting, an unbalanced or missing line item is usually the cause." },
    { flowchartId: flowchart1_6.id, nodeId: "n3", title: "Document Number Created", description: "SAP assigns a unique number from the relevant number range. This number is the permanent reference for the action.", tCode: "FB03 (Display Document)", tips: "Always note the document number — it's your key for queries, reversals, and audits." },
    { flowchartId: flowchart1_6.id, nodeId: "n4", title: "Audit Trail Stored", description: "The document permanently records who posted it, when, the document type, and all line-item details.", tCode: "FB03", tips: "Auditors love SAP precisely because every figure links back to a stored document." },
    { flowchartId: flowchart1_6.id, nodeId: "n5", title: "Reversal, Not Deletion", description: "To correct a posted document you create a reversal document that cancels it. Both remain visible, keeping history honest.", tCode: "FB08 (Reverse)", tips: "Never look for a 'delete' button on a posted document — reversal is the correct, auditable way." },
  ],
});
// Quiz for lesson 1.6
await prisma.quiz.upsert({
  where: { lessonId: lesson1_6.id },
  update: {},
  create: {
    lessonId: lesson1_6.id,
    title: "The SAP Document Principle — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In SAP, what happens every time you post a business action?",
          explanation: "The document principle means every posting creates a uniquely numbered document recording exactly what happened — this is what gives SAP its complete audit trail.",
          options: {
            create: [
              { text: "A uniquely numbered document is created", isCorrect: true },
              { text: "Nothing is recorded unless you ask SAP to save", isCorrect: false },
              { text: "An email is sent to the auditors", isCorrect: false },
              { text: "The previous document is deleted", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "You posted a vendor invoice with the wrong amount. What is the correct way to fix it?",
          explanation: "Posted documents are never deleted. You post a reversal document (FB08) that cancels the original; both stay visible, preserving the audit trail. Deleting would destroy the financial history.",
          options: {
            create: [
              { text: "Post a reversal document that cancels the original", isCorrect: true },
              { text: "Delete the document from the database", isCorrect: false },
              { text: "Edit the amount directly on the posted document", isCorrect: false },
              { text: "Ignore it — SAP fixes errors automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why won't SAP save a financial document where debits do not equal credits?",
          explanation: "Double-entry accounting requires every posting to balance. SAP enforces this rule as a built-in safety net, preventing inconsistent financial data from ever entering the system.",
          options: {
            create: [
              { text: "Double-entry rules require debits to equal credits — SAP enforces it", isCorrect: true },
              { text: "Because the document number range is full", isCorrect: false },
              { text: "Because only managers can post unbalanced documents", isCorrect: false },
              { text: "It will save it but hide it from reports", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 1.7: SAP Reporting Basics
const lesson1_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-reporting-basics" } },
  update: {},
  create: {
    moduleId: foundationModule.id,
    title: "SAP Reporting Basics",
    slug: "sap-reporting-basics",
    order: 7,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Sneha's manager asks for "all open vendor invoices over ₹50,000, due this month." Sneha panics — she imagines exporting everything to Excel and filtering by hand for an hour. A colleague leans over: "Just run FBL1N, set the filters, and use the layout. Two minutes."

Sneha had no idea SAP could slice and present data so quickly. Learning how to find and shape data is what turns raw SAP into real answers.`,
    content: `## SAP Is Full of Data — Reporting Gets It Out

Every transaction you post becomes data. **Reporting** is how you pull that data back out in a form people can use — lists, totals, and analyses.

## Two Common Report Styles

| Style | What it looks like | Example |
|-------|--------------------|---------|
| **Line item reports** | A list of individual documents | FBL1N (vendor line items) |
| **Balance / summary reports** | Totals grouped by key | FS10N (G/L account balances) |

Many SAP reports use a flexible grid called the **ALV (SAP List Viewer)** — a smart table you can sort, filter, subtotal, and rearrange on the fly.

## The Selection Screen — Asking the Right Question

Before a report runs, you see a **selection screen** where you enter criteria: company code, date range, account, amount, status (open/cleared). This is like filling in a search form. The more precise your criteria, the faster and more useful the result.

**Tip:** Leaving a field blank usually means "all" — so a blank date range can return millions of rows and run slowly. Be specific.

## Shaping Results with the ALV

Once data appears, the ALV lets you:
- **Sort** by any column (e.g. highest amount first),
- **Filter** to narrow rows (e.g. only "open" items),
- **Subtotal** by a column (e.g. total per vendor),
- **Save a layout** so the same arrangement appears next time.

## Saving Time with Variants and Layouts

- A **variant** saves your selection-screen entries, so you can re-run the same report without retyping criteria.
- A **layout** saves your column arrangement and sorting in the results.

Together they turn a fiddly report into a one-click routine.

## Where Reports Live

You can find reports via T-codes (like FBL1N, MB52, VA05), through area menus, or — in modern SAP — via **Fiori analytical apps** with interactive charts. Many companies also use **SAP Analytics Cloud** for dashboards built on this same data.

## A Real Example

To answer "open vendor invoices over ₹50,000 due this month":
1. Run **FBL1N**, select the vendor(s) and "open items."
2. On the ALV, filter Amount > 50,000 and sort by due date.
3. Save it as a layout so next month it's instant.

## Why It Matters

Data only creates value when people can see it. Knowing how to run, filter, and save reports means you can answer business questions in minutes instead of begging IT for a custom extract.`,
    keyConceptTitle: "Reporting = Selection Screen + the Flexible ALV Grid",
    keyConceptBody: `- A **selection screen** lets you specify criteria (company code, dates, status) before the report runs — be specific to stay fast.
- Results often appear in the **ALV grid**, which you can sort, filter, subtotal, and rearrange.
- Save a **variant** (selection criteria) and a **layout** (column setup) to re-run reports in one click.`,
  },
});
// Flowchart for lesson 1.7
const flowchart1_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson1_7.id },
  update: {},
  create: {
    lessonId: lesson1_7.id,
    title: "Running a Report in SAP",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 40 }, data: { label: "🔍 Open a Report (T-code/App)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 150 }, data: { label: "🧾 Enter Selection Criteria" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 260 }, data: { label: "⚙️ Execute (F8)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 370 }, data: { label: "📊 Sort / Filter in ALV Grid" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 560, y: 370 }, data: { label: "💾 Save Variant & Layout" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart1_7.id, nodeId: "n1", title: "Open a Report", description: "Start a report via its T-code, an area menu, or a Fiori analytical app. Each report focuses on a type of data (vendors, stock, sales).", tCode: "FBL1N, MB52, VA05", tips: "If you don't know the T-code, search the SAP menu by keyword like 'vendor line items'." },
    { flowchartId: flowchart1_7.id, nodeId: "n2", title: "Selection Criteria", description: "The selection screen is your search form — company code, date range, account, status. Precise criteria mean faster, more relevant results.", tCode: "N/A", tips: "Avoid leaving date ranges blank on large tables; it can return millions of rows." },
    { flowchartId: flowchart1_7.id, nodeId: "n3", title: "Execute", description: "Press F8 (or the clock/execute icon) to run the report against the database using your criteria.", tCode: "F8", tips: "If a report is slow, tighten your selection rather than waiting — fewer rows run faster." },
    { flowchartId: flowchart1_7.id, nodeId: "n4", title: "Shape in the ALV", description: "The ALV grid lets you sort, filter, subtotal, and rearrange columns live — turning raw rows into the exact view you need.", tCode: "N/A", tips: "Right-click a column header for quick sort, filter, and subtotal options." },
    { flowchartId: flowchart1_7.id, nodeId: "n5", title: "Save Variant & Layout", description: "Save your selection criteria as a variant and your column setup as a layout so the report reruns in one click next time.", tCode: "N/A", tips: "Name shared layouts clearly so your whole team benefits from them." },
  ],
});
// Quiz for lesson 1.7
await prisma.quiz.upsert({
  where: { lessonId: lesson1_7.id },
  update: {},
  create: {
    lessonId: lesson1_7.id,
    title: "SAP Reporting Basics — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the purpose of a report's selection screen?",
          explanation: "The selection screen is where you enter criteria (company code, dates, status) before running the report. It works like a search form — precise criteria give faster, more relevant results.",
          options: {
            create: [
              { text: "To enter criteria that filter what data the report returns", isCorrect: true },
              { text: "To delete old documents", isCorrect: false },
              { text: "To log in to a different client", isCorrect: false },
              { text: "To email the report to your manager", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "You run the same vendor report every month with identical filters. How do you avoid retyping the criteria each time?",
          explanation: "A variant saves your selection-screen entries so you can re-run the report with one click. (A layout, by contrast, saves the column/sort arrangement of the results.)",
          options: {
            create: [
              { text: "Save a variant of the selection criteria", isCorrect: true },
              { text: "Memorize and retype them every month", isCorrect: false },
              { text: "Export to Excel and never use SAP again", isCorrect: false },
              { text: "Ask IT to build a brand-new report monthly", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is it risky to leave the date range blank on a large SAP report?",
          explanation: "A blank field usually means 'all', so an empty date range can pull millions of rows, making the report slow and hard to read. Being specific keeps reports fast and useful.",
          options: {
            create: [
              { text: "It can return a huge number of rows and run very slowly", isCorrect: true },
              { text: "SAP will refuse to run any report at all", isCorrect: false },
              { text: "It automatically deletes data outside the range", isCorrect: false },
              { text: "It changes your user authorizations", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 1.8: S/4HANA vs ECC — What Changed
const lesson1_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "s4hana-vs-ecc" } },
  update: {},
  create: {
    moduleId: foundationModule.id,
    title: "S/4HANA vs ECC — What Changed",
    slug: "s4hana-vs-ecc",
    order: 8,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `Karan keeps seeing two words in every SAP job ad: "S/4HANA" and "ECC." A recruiter asks which one he knows, and he freezes — aren't they the same thing? He's worried he's already behind.

The truth is reassuring: S/4HANA is simply SAP's newer generation, built to be faster and simpler than the older ECC. Understanding what actually changed instantly makes Karan sound informed in any interview.`,
    content: `## Two Generations of SAP

- **SAP ECC** (ERP Central Component) is the older, long-dominant version many companies still run.
- **SAP S/4HANA** is the next generation, launched in 2015, built specifically for the high-speed **HANA** in-memory database.

Think of it like upgrading from an older car to a new electric model: same purpose (get you there), but faster, simpler, and modernized under the hood.

## The Engine: The HANA Database

The biggest change is the database. Traditional databases store data on disk, row by row. **HANA** keeps data **in memory (RAM)** and stores it in **columns**, which makes reading and aggregating data dramatically faster.

Result: reports that once ran overnight can run in seconds, and you can analyze live transactional data without a separate reporting system.

## Key Differences at a Glance

| Topic | ECC | S/4HANA |
|-------|-----|---------|
| Database | Any (Oracle, DB2, etc.) | HANA only |
| User interface | SAP GUI | Fiori (modern, web/mobile) |
| Finance tables | Many separate tables | One **Universal Journal** (ACDOCA) |
| Customers & vendors | Separate masters | Unified **Business Partner** |
| Speed | Disk-based | In-memory, real-time |

## The Universal Journal (ACDOCA)

In ECC, finance data was spread across many tables, and FI and CO had to be reconciled. S/4HANA merges them into **one table called ACDOCA** — a single source of truth that makes reporting faster and reconciliation almost disappear.

## The User Experience: Fiori

ECC's classic SAP GUI is functional but dated. S/4HANA leads with **Fiori** — clean, role-based apps that work on desktop, tablet, and phone, like using a modern website.

## Business Partner

ECC kept customers and vendors as separate master records. S/4HANA uses the **Business Partner (BP)** to manage both in one place, reducing duplication.

## Why Companies Are Moving

SAP plans to end mainstream support for ECC (around 2027, with extended options to 2030). That deadline, plus the speed and simplicity gains, is driving a huge global wave of S/4HANA migrations — which is exactly why the skill is in such demand.

## Why It Matters

As a beginner, you don't need to master every detail today. But knowing *that* S/4HANA is faster (HANA), simpler (ACDOCA, Business Partner), and modern (Fiori) — and *why* companies are migrating — already puts you ahead of many candidates.`,
    keyConceptTitle: "S/4HANA Is SAP's Faster, Simpler New Generation",
    keyConceptBody: `- **ECC** is the older version; **S/4HANA** is the new generation built for the in-memory **HANA** database (much faster).
- S/4HANA simplifies finance with one **Universal Journal (ACDOCA)** and unifies customers/vendors as **Business Partner**.
- It leads with the modern **Fiori** UI, and companies are migrating before ECC support ends (~2027).`,
  },
});
// Flowchart for lesson 1.8
const flowchart1_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson1_8.id },
  update: {},
  create: {
    lessonId: lesson1_8.id,
    title: "From ECC to S/4HANA",
    nodes: [
      { id: "n1", type: "default", position: { x: 80, y: 200 }, data: { label: "🗄️ ECC (Disk DB + SAP GUI)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 400, y: 60 }, data: { label: "⚡ HANA In-Memory Database" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 400, y: 200 }, data: { label: "📒 Universal Journal (ACDOCA)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 400, y: 340 }, data: { label: "🎨 Fiori UI + Business Partner" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 720, y: 200 }, data: { label: "🚀 S/4HANA (Fast + Simple)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n1", target: "n3", type: "default" },
      { id: "e3", source: "n1", target: "n4", type: "default" },
      { id: "e4", source: "n2", target: "n5", type: "default" },
      { id: "e5", source: "n3", target: "n5", type: "default" },
      { id: "e6", source: "n4", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart1_8.id, nodeId: "n1", title: "SAP ECC", description: "The older generation. Runs on any database, uses the classic SAP GUI, and stores finance data across many separate tables.", tCode: "N/A", tips: "Many companies still run ECC today — it's far from dead, but support is winding down." },
    { flowchartId: flowchart1_8.id, nodeId: "n2", title: "HANA Database", description: "An in-memory, column-based database. Holding data in RAM makes reads and aggregations dramatically faster than disk-based databases.", tCode: "N/A", tips: "HANA is the core reason S/4HANA can do real-time analytics on live data." },
    { flowchartId: flowchart1_8.id, nodeId: "n3", title: "Universal Journal (ACDOCA)", description: "S/4HANA merges many finance tables into one. FI and CO share a single source of truth, removing most reconciliation work.", tCode: "Table: ACDOCA", tips: "If asked 'what changed in S/4HANA finance?', ACDOCA is the headline answer." },
    { flowchartId: flowchart1_8.id, nodeId: "n4", title: "Fiori & Business Partner", description: "S/4HANA leads with the modern Fiori UI and unifies customers and vendors into the Business Partner object.", tCode: "BP", tips: "Fiori apps run on mobile — approvals can happen from a phone." },
    { flowchartId: flowchart1_8.id, nodeId: "n5", title: "SAP S/4HANA", description: "The result: a faster, simpler, modern ERP. The combination of HANA, ACDOCA, Business Partner, and Fiori defines the new generation.", tCode: "N/A", tips: "Migration demand (before ECC support ends ~2027) makes S/4HANA skills highly valuable." },
  ],
});
// Quiz for lesson 1.8
await prisma.quiz.upsert({
  where: { lessonId: lesson1_8.id },
  update: {},
  create: {
    lessonId: lesson1_8.id,
    title: "S/4HANA vs ECC — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the single biggest technical change that makes S/4HANA faster than ECC?",
          explanation: "S/4HANA runs only on the HANA in-memory, column-based database. Keeping data in RAM and in columns makes reading and aggregating data far faster than traditional disk-based databases.",
          options: {
            create: [
              { text: "It runs on the HANA in-memory database", isCorrect: true },
              { text: "It uses more hard drives", isCorrect: false },
              { text: "It removes the finance module entirely", isCorrect: false },
              { text: "It only allows one user at a time", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A finance team complains about constantly reconciling FI and CO in ECC. How does S/4HANA address this?",
          explanation: "S/4HANA introduces the Universal Journal (table ACDOCA), merging many finance tables into one source of truth. FI and CO share the same line items, so the old reconciliation effort largely disappears.",
          options: {
            create: [
              { text: "The Universal Journal (ACDOCA) unifies FI and CO into one source of truth", isCorrect: true },
              { text: "It deletes the CO module so there's nothing to reconcile", isCorrect: false },
              { text: "It emails differences to the auditor automatically", isCorrect: false },
              { text: "Reconciliation is impossible in S/4HANA", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "How are customers and vendors handled differently in S/4HANA compared to ECC?",
          explanation: "ECC kept separate customer and vendor master records. S/4HANA uses the Business Partner (BP) to manage both in one unified object, reducing duplication and inconsistency.",
          options: {
            create: [
              { text: "They are unified under the Business Partner object", isCorrect: true },
              { text: "They are removed and replaced by spreadsheets", isCorrect: false },
              { text: "They must be stored in two different systems", isCorrect: false },
              { text: "There is no difference at all", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── FICO: NEW LESSONS ──────────────────────────────────────────────────────
// LESSON 2.3: General Ledger (G/L) Accounts Explained
const lesson2_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "general-ledger-accounts" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "General Ledger (G/L) Accounts Explained",
    slug: "general-ledger-accounts",
    order: 3,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `Anjali knows the Chart of Accounts is the master list, but her manager now says, "Create the G/L account for office rent and assign it to our company code." Anjali wonders: isn't the account already in the chart? Why does she have to do something per company code?

The answer reveals how SAP separates a global account definition from how each legal entity actually uses it — a distinction that trips up nearly every beginner.`,
    content: `## What Is a G/L Account?

A **General Ledger (G/L) account** is a single bucket where transactions of one kind are recorded — for example, "Office Rent Expense" or "Bank Account." All G/L accounts together form the **Chart of Accounts (COA)**.

If the COA is the master list, each **G/L account** is one named drawer in that filing cabinet.

## The Two-Level Structure (The Key Insight)

In SAP, a G/L account has **two segments**:

| Segment | Scope | Holds |
|---------|-------|-------|
| **Chart of Accounts segment** | Global (whole COA) | Account number, name, account group, P&L or Balance Sheet type |
| **Company Code segment** | Per legal entity | Currency, tax category, reconciliation settings, field status |

This is why the same account (e.g. 626000 Rent) is **defined once globally** but must be **extended to each company code** that uses it. The transaction **FS00** lets you maintain both segments together.

## Balance Sheet vs P&L Accounts

Every G/L account is one of two types:

- **Balance Sheet account** — its balance carries forward year to year (e.g. Bank, Assets, Payables).
- **Profit & Loss (P&L) account** — its balance resets each year, closing to retained earnings (e.g. Sales, Rent, Salaries).

SAP needs to know the type so year-end closing handles the balance correctly.

## Account Groups

A **G/L account group** controls two things: the **number range** an account falls into (e.g. expenses 600000–699999) and the **field status** (which fields are required, optional, or hidden). This keeps accounts organized and consistent.

## Reconciliation Accounts — A Special Kind

Some G/L accounts are **reconciliation accounts**. You never post to them directly; instead they're linked to **sub-ledgers** (customers in AR, vendors in AP, assets in AA). When you post a vendor invoice, SAP updates the vendor's sub-ledger AND the linked reconciliation account automatically — keeping detail and summary always in sync.

## A Real Example

Posting office rent of ₹40,000:
- **Debit** G/L 626000 (Rent Expense — a P&L account)
- **Credit** G/L 113100 (Bank — a Balance Sheet account)

Both accounts must exist in the COA and be extended to your company code first.

## Why It Matters

G/L accounts are where every financial number ultimately lands. Understanding the global-vs-company-code split, the balance-sheet-vs-P&L distinction, and reconciliation accounts is the backbone of everything else in FICO.`,
    keyConceptTitle: "G/L Accounts Have a Global Part and a Company-Code Part",
    keyConceptBody: `- A **G/L account** is defined once in the Chart of Accounts segment, then **extended to each company code** that uses it (maintain both via FS00).
- Each account is either a **Balance Sheet** account (carries forward) or a **P&L** account (resets yearly).
- **Reconciliation accounts** link sub-ledgers (customers, vendors, assets) to the G/L and update automatically.`,
  },
});
// Flowchart for lesson 2.3
const flowchart2_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_3.id },
  update: {},
  create: {
    lessonId: lesson2_3.id,
    title: "Structure of a G/L Account",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 40 }, data: { label: "📋 Chart of Accounts (Global List)" }, style: { background: "#1E293B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 150 }, data: { label: "🏷️ COA Segment (Number, Name, Type)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 260 }, data: { label: "🏢 Company Code Segment (Currency, Tax)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 370 }, data: { label: "✍️ Ready to Post (FS00 done)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 560, y: 260 }, data: { label: "🔗 Reconciliation Account → Sub-ledger" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n3", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_3.id, nodeId: "n1", title: "Chart of Accounts", description: "The global master list of all G/L accounts. Every company code using this COA shares the same account numbers and names.", tCode: "OB13", tips: "The standard COA in many systems is 'INT' (International) — a common starting point." },
    { flowchartId: flowchart2_3.id, nodeId: "n2", title: "COA Segment", description: "The global part of a G/L account: number, description, account group, and whether it's a Balance Sheet or P&L account.", tCode: "FS00 (Type/Description tab)", tips: "Set Balance Sheet vs P&L correctly here — it controls how year-end closing treats the balance." },
    { flowchartId: flowchart2_3.id, nodeId: "n3", title: "Company Code Segment", description: "The local part: account currency, tax category, reconciliation settings, and field status — specific to each legal entity.", tCode: "FS00 (Control/Create-Bank tabs)", tips: "An account in the COA still can't be posted to until it's extended to your company code here." },
    { flowchartId: flowchart2_3.id, nodeId: "n4", title: "Ready to Post", description: "Once both segments exist via FS00, the account can be used in postings and appears in financial reports.", tCode: "FS00 / FB50", tips: "Use FS00 'Display' first to confirm an account is set up for your company code before posting." },
    { flowchartId: flowchart2_3.id, nodeId: "n5", title: "Reconciliation Account", description: "A special G/L account linked to a sub-ledger (customers, vendors, assets). You post to the sub-ledger; SAP updates this account automatically.", tCode: "FS00 (Recon. account field)", tips: "You can never post directly to a reconciliation account — only through its sub-ledger." },
  ],
});
// Quiz for lesson 2.3
await prisma.quiz.upsert({
  where: { lessonId: lesson2_3.id },
  update: {},
  create: {
    lessonId: lesson2_3.id,
    title: "G/L Accounts — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "An account exists in the Chart of Accounts but you still can't post to it in your company. Why?",
          explanation: "A G/L account has two segments. The COA segment defines it globally, but it must also be extended with a Company Code segment (currency, tax, field status) via FS00 before that company can post to it.",
          options: {
            create: [
              { text: "It hasn't been extended to your company code yet", isCorrect: true },
              { text: "G/L accounts can never be posted to", isCorrect: false },
              { text: "You must delete and recreate the whole Chart of Accounts", isCorrect: false },
              { text: "Only the CEO can post to G/L accounts", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which type of G/L account has its balance reset to zero at the start of each new fiscal year?",
          explanation: "Profit & Loss (P&L) accounts (like Rent or Sales) close to retained earnings and reset each year. Balance Sheet accounts (like Bank or Payables) carry their balances forward.",
          options: {
            create: [
              { text: "A Profit & Loss (P&L) account", isCorrect: true },
              { text: "A Balance Sheet account", isCorrect: false },
              { text: "A reconciliation account", isCorrect: false },
              { text: "All accounts keep the same balance forever", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why can't you post directly to a reconciliation account?",
          explanation: "Reconciliation accounts are linked to sub-ledgers (customers, vendors, assets). You post to the sub-ledger and SAP updates the reconciliation account automatically, keeping detail and summary perfectly in sync.",
          options: {
            create: [
              { text: "Postings flow through its sub-ledger, which updates it automatically", isCorrect: true },
              { text: "It is locked by the auditors permanently", isCorrect: false },
              { text: "It does not appear in the Chart of Accounts", isCorrect: false },
              { text: "It can only hold foreign currency", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.4: Cost Centers and Profit Centers
const lesson2_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "cost-centers-profit-centers" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Cost Centers and Profit Centers",
    slug: "cost-centers-profit-centers",
    order: 4,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `The finance director asks Vikram a simple-sounding question: "How much did the Marketing department spend last quarter, and is the South region profitable?" Vikram realizes the G/L only tells him total rent or total salaries across the whole company — not who spent it or which region earned it.

The missing piece is Controlling (CO), where Cost Centers and Profit Centers answer exactly those "who" and "where" questions.`,
    content: `## FI Tells You "What"; CO Tells You "Who" and "Where"

Financial Accounting (FI) records *what* was spent — ₹10,00,000 of salaries. **Controlling (CO)** adds the internal view: *which department* incurred the cost and *which area* earned the profit. CO is for internal management; it doesn't change the legal financials.

## Cost Center — "Where Costs Are Incurred"

A **Cost Center** is a unit that *consumes* cost but doesn't directly earn revenue — like Marketing, HR, IT, or Facilities. Whenever you post an expense, you assign a cost center so SAP knows which department to charge.

Think of cost centers as **labeled spending buckets** for each team. At month-end you can ask, "How much did IT spend?" and get an instant answer.

| Example Cost Center | Department |
|---------------------|------------|
| CC-1000 | Marketing |
| CC-2000 | Human Resources |
| CC-3000 | IT |

T-code to create: **KS01**; to view costs: **S_ALR_87013611** (cost center report).

## Profit Center — "Where Profit Is Earned"

A **Profit Center** measures profitability of a part of the business — a product line, region, or business unit. It captures *both* revenue and costs, so you can see if that slice makes money.

Think of a profit center as a **mini company-within-the-company**: South Region, or the Electronics division, each with its own profit picture.

## Cost Center vs Profit Center

| | Cost Center | Profit Center |
|--|-------------|---------------|
| Focus | Costs only | Costs **and** revenue |
| Question answered | "Who spent it?" | "Is this part profitable?" |
| Example | IT department | South region |
| Create T-code | KS01 | KE51 |

## How They Connect to Postings

When you post that office rent in FI, you also enter a **cost center** (e.g. Facilities). SAP simultaneously derives a **profit center** from it. So one posting feeds the legal books (FI) *and* the internal cost/profit view (CO) at the same time — no double entry.

## A Real Example

Marketing runs a ₹2,00,000 campaign:
- FI records the expense on the Advertising G/L account.
- CO charges Cost Center CC-1000 (Marketing).
- The profit center (say, the Consumer division) absorbs it, so divisional profitability reflects the spend.

## Why It Matters

Cost and profit centers turn raw financial totals into management insight. They're how companies budget by department, hold teams accountable, and decide which products or regions to invest in.`,
    keyConceptTitle: "Cost Centers Track Spending; Profit Centers Track Profitability",
    keyConceptBody: `- A **Cost Center** answers "who spent it?" — it collects costs for a department (Marketing, IT) with no revenue.
- A **Profit Center** answers "is this part profitable?" — it tracks both revenue and costs for a region or product line.
- Both live in **Controlling (CO)**; assigning a cost center on a posting updates FI and CO together without double entry.`,
  },
});
// Flowchart for lesson 2.4
const flowchart2_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_4.id },
  update: {},
  create: {
    lessonId: lesson2_4.id,
    title: "How a Cost Flows to CO",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 40 }, data: { label: "🧾 Post Expense in FI" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 150 }, data: { label: "🏷️ Assign a Cost Center" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 260 }, data: { label: "🏬 Profit Center Derived" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 70, y: 380 }, data: { label: "📊 Cost Center Report (Who Spent)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 440, y: 380 }, data: { label: "💹 Profitability Report (Where Profit)" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n2", target: "n4", type: "default" },
      { id: "e4", source: "n3", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_4.id, nodeId: "n1", title: "Post Expense in FI", description: "A cost is recorded on a G/L expense account — this is the legal financial entry that hits the P&L.", tCode: "FB50 / FB60", tips: "Expense postings almost always require a cost object like a cost center." },
    { flowchartId: flowchart2_4.id, nodeId: "n2", title: "Assign a Cost Center", description: "You tell SAP which department incurred the cost. This is what enables 'who spent it?' reporting.", tCode: "KS01 (create), KS03 (display)", tips: "If SAP demands a cost object and you only have a cost center, that's usually the right one to enter." },
    { flowchartId: flowchart2_4.id, nodeId: "n3", title: "Profit Center Derived", description: "Each cost center is linked to a profit center, so SAP automatically captures the profitability view from the same posting.", tCode: "KE51 (create profit center)", tips: "Consistent cost-center-to-profit-center mapping keeps divisional reports accurate." },
    { flowchartId: flowchart2_4.id, nodeId: "n4", title: "Cost Center Report", description: "Month-end reports show total spend per department, supporting budgets and accountability.", tCode: "S_ALR_87013611", tips: "Compare actual vs planned cost center spend to spot overruns early." },
    { flowchartId: flowchart2_4.id, nodeId: "n5", title: "Profitability Report", description: "Profit center reports reveal whether a region or product line is actually making money.", tCode: "S_ALR_87013326", tips: "Profit center data drives investment decisions — which areas to grow or cut." },
  ],
});
// Quiz for lesson 2.4
await prisma.quiz.upsert({
  where: { lessonId: lesson2_4.id },
  update: {},
  create: {
    lessonId: lesson2_4.id,
    title: "Cost Centers and Profit Centers — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A manager wants to know how much the IT department spent last month. Which CO object answers this?",
          explanation: "A Cost Center collects the costs of a department like IT. Assigning a cost center to each expense lets SAP report total spend per department — the 'who spent it?' question.",
          options: {
            create: [
              { text: "A Cost Center", isCorrect: true },
              { text: "A Profit Center", isCorrect: false },
              { text: "A reconciliation account", isCorrect: false },
              { text: "A vendor master", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the key difference between a cost center and a profit center?",
          explanation: "A cost center tracks costs only (departments that spend), while a profit center tracks both revenue and costs to measure profitability of a region or product line.",
          options: {
            create: [
              { text: "A cost center tracks costs only; a profit center tracks revenue and costs", isCorrect: true },
              { text: "They are identical and interchangeable", isCorrect: false },
              { text: "A cost center earns revenue; a profit center only spends", isCorrect: false },
              { text: "Profit centers exist only in FI, cost centers only in MM", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "When you post rent and assign a cost center, why don't you have to enter the data twice for FI and CO?",
          explanation: "A single posting feeds both views: FI records the legal expense while the assigned cost center (and its derived profit center) updates Controlling at the same time — integration means no double entry.",
          options: {
            create: [
              { text: "One integrated posting updates both FI and CO simultaneously", isCorrect: true },
              { text: "CO data is typed separately into a spreadsheet later", isCorrect: false },
              { text: "FI and CO never share any data", isCorrect: false },
              { text: "You must reverse the FI entry to create the CO entry", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.5: Accounts Payable (AP) End-to-End
const lesson2_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "accounts-payable-process" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Accounts Payable End-to-End",
    slug: "accounts-payable-process",
    order: 5,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Meena handles supplier payments. Invoices pile up on her desk, vendors call asking when they'll be paid, and the finance head wants to know the total the company owes right now. She needs one clear process that tracks every invoice from arrival to payment.

That process is Accounts Payable — and in SAP it runs as a clean, traceable cycle from invoice to cleared payment.`,
    content: `## What Is Accounts Payable?

**Accounts Payable (AP)** is the process of managing what your company **owes to vendors** — recording supplier invoices and paying them on time. AP is a **sub-ledger** of FI: each vendor has its own account, all linked to a reconciliation account in the G/L.

## The End-to-End AP Cycle

### 1. Vendor Master (the foundation)
Before anything, the vendor must exist with bank details and payment terms. Created via **BP** (or XK01 in older systems).

### 2. Invoice Entry
The supplier invoice is recorded, creating a liability:
- **FB60** — direct invoice (no purchase order), e.g. rent, utilities
- **MIRO** — invoice with a purchase order (the 3-way match in MM)

The entry: **Credit Vendor** (you owe them) / **Debit Expense or GR/IR**.

### 3. Invoice Sits as an "Open Item"
Until paid, the invoice is an **open item** on the vendor account. You can list open items with **FBL1N**.

### 4. Payment
You pay the vendor and **clear** the open item:
- **F-53** — manual single payment
- **F110** — the **automatic payment run**, which selects all due invoices, picks payment methods, and generates bank files in one batch

The payment entry: **Debit Vendor** (liability gone) / **Credit Bank**.

### 5. Clearing
Once paid, the invoice and payment are **matched and cleared** — the open item becomes a cleared item, and the vendor balance drops.

## The Automatic Payment Program (F110)

For real companies paying hundreds of invoices, **F110** is the workhorse. It runs on a schedule, selects invoices that are due, respects payment terms and cash discounts, and produces the payment file for the bank — all without manual one-by-one payments.

## Key AP T-Codes

| T-Code | Purpose |
|--------|---------|
| FB60 | Enter vendor invoice (no PO) |
| MIRO | Enter invoice (with PO) |
| FBL1N | Display vendor open/cleared items |
| F-53 | Manual outgoing payment |
| F110 | Automatic payment run |
| FK10N | Vendor balance display |

## A Real Example

1. Vendor sends a ₹1,00,000 invoice → posted via FB60 (open item).
2. It appears in FBL1N as open.
3. F110 runs, selects it (due date reached), pays it.
4. The item is cleared; vendor balance returns to zero.

## Why It Matters

AP directly affects cash flow and supplier relationships. A clean AP process means vendors are paid accurately and on time, the company captures early-payment discounts, and management always knows exactly how much is owed.`,
    keyConceptTitle: "AP = Vendor Invoice → Open Item → Payment → Cleared",
    keyConceptBody: `- **Accounts Payable** manages what you owe vendors; it's an FI **sub-ledger** linked to a reconciliation account.
- Record invoices with **FB60** (no PO) or **MIRO** (with PO); they sit as **open items** until paid.
- Pay via **F-53** (single) or the **F110** automatic payment run, which **clears** the open item against the payment.`,
  },
});
// Flowchart for lesson 2.5
const flowchart2_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_5.id },
  update: {},
  create: {
    lessonId: lesson2_5.id,
    title: "Accounts Payable Cycle",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "🏭 Vendor Master Exists" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 140 }, data: { label: "🧾 Enter Invoice (FB60/MIRO)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 250 }, data: { label: "📂 Open Item on Vendor Account" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 360 }, data: { label: "💳 Payment (F-53 / F110)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 250, y: 470 }, data: { label: "✅ Item Cleared, Balance Updated" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_5.id, nodeId: "n1", title: "Vendor Master", description: "The supplier must exist with bank details and payment terms before invoices can be posted or paid.", tCode: "BP / XK01 / FK03", tips: "Verify vendor bank data early — wrong details cause failed or misdirected payments." },
    { flowchartId: flowchart2_5.id, nodeId: "n2", title: "Enter Invoice", description: "Record the supplier invoice: FB60 for direct invoices, MIRO for PO-based invoices (3-way match). This credits the vendor and debits expense/GR-IR.", tCode: "FB60 / MIRO", tips: "Always Simulate before posting to confirm the accounts and amounts are right." },
    { flowchartId: flowchart2_5.id, nodeId: "n3", title: "Open Item", description: "Until paid, the invoice is an open item on the vendor's account, increasing what the company owes.", tCode: "FBL1N", tips: "Use FBL1N filtered to 'open items' to see exactly what's still unpaid per vendor." },
    { flowchartId: flowchart2_5.id, nodeId: "n4", title: "Payment", description: "Pay the vendor with F-53 (single) or the F110 automatic run (batch). This debits the vendor and credits the bank.", tCode: "F-53 / F110", tips: "F110 captures cash discounts automatically when invoices are paid within the discount period." },
    { flowchartId: flowchart2_5.id, nodeId: "n5", title: "Cleared Item", description: "Payment is matched to the invoice; the open item becomes cleared and the vendor balance decreases.", tCode: "FBL1N / FK10N", tips: "If a balance looks wrong, check for unmatched open items that never got cleared." },
  ],
});
// Quiz for lesson 2.5
await prisma.quiz.upsert({
  where: { lessonId: lesson2_5.id },
  update: {},
  create: {
    lessonId: lesson2_5.id,
    title: "Accounts Payable — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "After you post a vendor invoice but before it's paid, what is its status on the vendor account?",
          explanation: "An unpaid posted invoice is an 'open item' on the vendor account — it represents money still owed. Once payment is made and matched, it becomes a cleared item.",
          options: {
            create: [
              { text: "An open item", isCorrect: true },
              { text: "A cleared item", isCorrect: false },
              { text: "A profit center", isCorrect: false },
              { text: "A reconciliation account", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A company must pay 400 vendor invoices that are due this week. What is the most efficient SAP tool?",
          explanation: "F110, the automatic payment program, selects all due invoices in a batch, applies payment methods and discounts, and generates bank files — far faster than paying each one manually with F-53.",
          options: {
            create: [
              { text: "The F110 automatic payment run", isCorrect: true },
              { text: "F-53, paid one invoice at a time", isCorrect: false },
              { text: "FB60 repeated 400 times", isCorrect: false },
              { text: "FS00 for each vendor", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is Accounts Payable described as a 'sub-ledger' of the General Ledger?",
          explanation: "AP keeps detailed records per vendor, all linked to a single reconciliation account in the G/L. The sub-ledger holds the detail; the G/L holds the summary, and SAP keeps them automatically in sync.",
          options: {
            create: [
              { text: "It holds vendor-level detail linked to a G/L reconciliation account", isCorrect: true },
              { text: "It is a completely separate system with no link to FI", isCorrect: false },
              { text: "It only stores customer information", isCorrect: false },
              { text: "It replaces the General Ledger entirely", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.6: Accounts Receivable (AR) End-to-End
const lesson2_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "accounts-receivable-process" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Accounts Receivable End-to-End",
    slug: "accounts-receivable-process",
    order: 6,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Arjun's company has sold ₹50,00,000 of goods this month — but the bank balance is low. His CFO asks, "Great sales, but who actually owes us money, and who's overdue?" Arjun needs to track every customer invoice from the moment it's raised until cash actually arrives.

That tracking is Accounts Receivable — the mirror image of Accounts Payable, focused on money coming in.`,
    content: `## What Is Accounts Receivable?

**Accounts Receivable (AR)** manages what **customers owe your company**. Like AP, it's a **sub-ledger** of FI: each customer has an account, all tied to a reconciliation account in the G/L. AP is money out; AR is money in.

## The End-to-End AR Cycle

### 1. Customer Master (foundation)
The customer must exist with billing address, payment terms, and credit data. Created via **BP** (or XD01 in older systems).

### 2. Invoice / Billing
A receivable is created when the customer is billed:
- In SD, billing (**VF01**) automatically posts to FI: **Debit Customer** / **Credit Revenue**.
- A direct FI customer invoice can be posted with **FB70**.

### 3. Open Item
The unpaid invoice is an **open item** on the customer account — money owed to you. List with **FBL5N**.

### 4. Incoming Payment
When the customer pays, you record it and **clear** the open item:
- **F-28** — post incoming payment.
- Entry: **Debit Bank** / **Credit Customer** (receivable gone).

### 5. Dunning (chasing overdue payments)
If a customer is late, SAP's **dunning program (F150)** automatically generates reminder letters at escalating severity levels — a polite nudge that becomes a firm demand.

## Credit Management

SAP can enforce **credit limits**: if a customer's open receivables exceed their limit, new sales orders can be blocked until they pay. This protects the company from over-extending credit to risky customers.

## Key AR T-Codes

| T-Code | Purpose |
|--------|---------|
| BP / XD01 | Create customer master |
| FB70 | Post customer invoice (FI) |
| VF01 | Create billing document (SD) |
| FBL5N | Display customer open/cleared items |
| F-28 | Post incoming payment |
| F150 | Dunning run |

## A Real Example

1. You bill a customer ₹2,00,000 via VF01 → Debit Customer / Credit Revenue (open item).
2. It shows in FBL5N as open.
3. 30 days later the customer pays; you post F-28 → Debit Bank / Credit Customer.
4. The item clears; the customer balance drops to zero.
5. Had they been late, F150 would have sent dunning letters.

## Why It Matters

AR is about getting paid — the lifeblood of cash flow. Strong AR (timely billing, active dunning, sensible credit limits) means cash arrives faster and bad debts shrink, even when sales are booming.`,
    keyConceptTitle: "AR = Customer Invoice → Open Item → Incoming Payment → Cleared",
    keyConceptBody: `- **Accounts Receivable** manages what customers owe you; it's an FI **sub-ledger** like AP, but for money coming in.
- Billing (**VF01**) or **FB70** posts Debit Customer / Credit Revenue, creating an **open item** (seen in FBL5N).
- Record payment with **F-28** to clear it; use the **dunning run (F150)** to chase overdue customers and credit limits to control risk.`,
  },
});
// Flowchart for lesson 2.6
const flowchart2_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_6.id },
  update: {},
  create: {
    lessonId: lesson2_6.id,
    title: "Accounts Receivable Cycle",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "👤 Customer Master Exists" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 140 }, data: { label: "🧾 Bill Customer (VF01/FB70)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 250 }, data: { label: "📂 Open Item (Customer Owes)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 360 }, data: { label: "💰 Incoming Payment (F-28)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 560, y: 250 }, data: { label: "📨 Overdue? Dunning (F150)" }, style: { background: "#EF4444", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 250, y: 470 }, data: { label: "✅ Item Cleared, Balance Updated" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n3", target: "n5", type: "default" },
      { id: "e5", source: "n4", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_6.id, nodeId: "n1", title: "Customer Master", description: "The customer must exist with billing address, payment terms, and credit data before invoices can be raised.", tCode: "BP / XD01 / FD03", tips: "Accurate payment terms here drive correct due dates and dunning behavior." },
    { flowchartId: flowchart2_6.id, nodeId: "n2", title: "Bill the Customer", description: "Billing in SD (VF01) or a direct FI invoice (FB70) posts Debit Customer / Credit Revenue, creating the receivable.", tCode: "VF01 / FB70", tips: "Most receivables originate in SD billing, which auto-posts to FI." },
    { flowchartId: flowchart2_6.id, nodeId: "n3", title: "Open Item", description: "The unpaid invoice sits as an open item on the customer account — money owed to your company.", tCode: "FBL5N", tips: "Filter FBL5N by due date to find what's overdue versus not yet due." },
    { flowchartId: flowchart2_6.id, nodeId: "n4", title: "Incoming Payment", description: "When the customer pays, F-28 records it and clears the open item: Debit Bank / Credit Customer.", tCode: "F-28", tips: "Match the payment to the correct invoice so the open item clears cleanly." },
    { flowchartId: flowchart2_6.id, nodeId: "n5", title: "Dunning", description: "The dunning program generates escalating reminder letters for overdue customers, automating collections.", tCode: "F150", tips: "Dunning levels let early reminders stay friendly and later ones become firm." },
    { flowchartId: flowchart2_6.id, nodeId: "n6", title: "Cleared Item", description: "Payment matched to the invoice clears the open item and reduces the customer's balance to reflect what's still owed.", tCode: "FBL5N / FD10N", tips: "Regular clearing keeps AR aging reports accurate and trustworthy." },
  ],
});
// Quiz for lesson 2.6
await prisma.quiz.upsert({
  where: { lessonId: lesson2_6.id },
  update: {},
  create: {
    lessonId: lesson2_6.id,
    title: "Accounts Receivable — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "When a billing document is created in SD (VF01), what is the AR accounting entry?",
          explanation: "Billing posts Debit Customer (creating the receivable — they now owe you) and Credit Revenue (recording the sale). This is the moment the receivable appears in AR.",
          options: {
            create: [
              { text: "Debit Customer / Credit Revenue", isCorrect: true },
              { text: "Debit Bank / Credit Vendor", isCorrect: false },
              { text: "Debit Expense / Credit Customer", isCorrect: false },
              { text: "Debit Revenue / Credit Bank", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A customer is 45 days late paying. Which SAP function automatically sends escalating reminder letters?",
          explanation: "The dunning program (F150) generates reminder letters at increasing severity levels for overdue customers, automating the collections process.",
          options: {
            create: [
              { text: "The dunning run (F150)", isCorrect: true },
              { text: "The automatic payment run (F110)", isCorrect: false },
              { text: "Goods receipt (MIGO)", isCorrect: false },
              { text: "Chart of accounts setup (OB13)", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "How does SAP credit management protect a company from risky customers?",
          explanation: "Credit management can block new sales orders when a customer's open receivables exceed their credit limit, preventing the company from extending more credit until existing amounts are paid.",
          options: {
            create: [
              { text: "It can block new sales orders when the customer exceeds their credit limit", isCorrect: true },
              { text: "It automatically forgives unpaid invoices", isCorrect: false },
              { text: "It deletes the customer master after one late payment", isCorrect: false },
              { text: "It pays the customer's invoices for them", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.7: Asset Accounting Basics
const lesson2_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "asset-accounting-basics" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Asset Accounting Basics",
    slug: "asset-accounting-basics",
    order: 7,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Priya's company buys a delivery van for ₹12,00,000. Her manager says, "Don't expense it all this month — capitalize it and depreciate over five years." Priya is confused: the company paid the full amount now, so why spread the cost?

This is the heart of Asset Accounting — recording long-life purchases as assets and spreading their cost over the years they're actually used.`,
    content: `## What Is Asset Accounting?

**Asset Accounting (FI-AA)** manages a company's **fixed assets** — things it owns and uses for years, like buildings, machinery, vehicles, and computers. FI-AA is a **sub-ledger** of FI, tracking each asset's value, depreciation, and eventual disposal.

## Capitalize, Don't Expense

When you buy something used for years, you don't record the whole cost as an expense immediately. Instead you **capitalize** it (record it as an asset) and spread the cost across its useful life through **depreciation**.

Think of it like buying a phone you'll use for three years: it's fairer to count a portion of its cost each year than to take the whole hit on day one.

## The Asset Master and Asset Classes

Each asset has an **asset master record**. Every asset belongs to an **asset class** (e.g. Buildings, Vehicles, IT Equipment) which sets defaults like the depreciation method and useful life, and links to the right G/L accounts.

| Asset Class | Typical Useful Life |
|-------------|---------------------|
| Buildings | 30–40 years |
| Machinery | 10–15 years |
| Vehicles | 5–8 years |
| IT Equipment | 3–5 years |

## Depreciation — Spreading the Cost

**Depreciation** is the systematic reduction of an asset's book value over its useful life. SAP calculates it automatically each period via the **depreciation run (AFAB)** and posts it: **Debit Depreciation Expense / Credit Accumulated Depreciation**.

Common methods: **straight-line** (equal amounts each year) and **declining balance** (more in early years).

## The Asset Lifecycle

1. **Acquisition** — buy the asset (often via MM purchase or **F-90**); it's capitalized.
2. **Depreciation** — value reduces each period via AFAB.
3. **Transfer** — move an asset between cost centers or classes if needed.
4. **Retirement / Disposal** — sell or scrap it (**F-92**), removing it from the books and recording any gain or loss.

## Key Asset T-Codes

| T-Code | Purpose |
|--------|---------|
| AS01 | Create asset master |
| F-90 | Acquire asset with vendor |
| AFAB | Depreciation run |
| AW01N | Asset Explorer (view values) |
| F-92 | Asset retirement (sale) |

## A Real Example

The ₹12,00,000 van (5-year life, straight-line):
- Acquired and capitalized as an asset.
- Each year ₹2,40,000 of depreciation is posted automatically.
- After 5 years the book value is near zero; if sold, F-92 records any gain or loss.

## Why It Matters

Asset Accounting ensures the balance sheet shows the true current value of what the company owns, spreads costs fairly across years, and keeps depreciation compliant with accounting and tax rules.`,
    keyConceptTitle: "Capitalize Long-Life Assets and Depreciate Over Their Useful Life",
    keyConceptBody: `- **Asset Accounting (FI-AA)** records fixed assets (buildings, vehicles, machines) as a sub-ledger of FI.
- Long-life purchases are **capitalized**, not expensed at once; their cost spreads over useful life via **depreciation** (run with AFAB).
- Each asset belongs to an **asset class** that sets useful life, depreciation method, and G/L accounts; the lifecycle is acquire → depreciate → retire.`,
  },
});
// Flowchart for lesson 2.7
const flowchart2_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_7.id },
  update: {},
  create: {
    lessonId: lesson2_7.id,
    title: "Fixed Asset Lifecycle",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "🆕 Create Asset Master (AS01)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 140 }, data: { label: "💵 Acquire / Capitalize (F-90)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 250 }, data: { label: "📉 Depreciation Run (AFAB)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 360 }, data: { label: "🔁 Transfer (Optional)" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 250, y: 470 }, data: { label: "🗑️ Retire / Sell (F-92)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_7.id, nodeId: "n1", title: "Create Asset Master", description: "Set up the asset record under an asset class, which sets defaults like useful life, depreciation method, and linked G/L accounts.", tCode: "AS01", tips: "Choosing the right asset class saves time — it pre-fills most depreciation settings." },
    { flowchartId: flowchart2_7.id, nodeId: "n2", title: "Acquire / Capitalize", description: "Record the purchase against the asset (often via an MM PO or F-90). The cost is capitalized on the balance sheet instead of expensed at once.", tCode: "F-90 / MIGO+MIRO", tips: "Capitalizing spreads the cost fairly over the years the asset is actually used." },
    { flowchartId: flowchart2_7.id, nodeId: "n3", title: "Depreciation Run", description: "AFAB calculates and posts depreciation each period: Debit Depreciation Expense / Credit Accumulated Depreciation, lowering book value.", tCode: "AFAB", tips: "Run AFAB as part of month-end; it's usually scheduled, not run ad hoc." },
    { flowchartId: flowchart2_7.id, nodeId: "n4", title: "Transfer", description: "If an asset moves to another cost center, plant, or asset class, a transfer posting keeps records accurate.", tCode: "ABUMN", tips: "Transfers preserve the asset's history while reassigning where its cost belongs." },
    { flowchartId: flowchart2_7.id, nodeId: "n5", title: "Retire / Sell", description: "When an asset is sold or scrapped, retirement removes it from the books and records any gain or loss versus its remaining value.", tCode: "F-92 / ABAVN", tips: "Selling above book value creates a gain; scrapping usually creates a loss." },
  ],
});
// Quiz for lesson 2.7
await prisma.quiz.upsert({
  where: { lessonId: lesson2_7.id },
  update: {},
  create: {
    lessonId: lesson2_7.id,
    title: "Asset Accounting — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why does SAP capitalize a delivery van and depreciate it instead of expensing the full cost immediately?",
          explanation: "The van is used for several years, so its cost is spread across its useful life via depreciation. This matches the expense to the years the asset actually generates value, rather than taking the whole hit in one month.",
          options: {
            create: [
              { text: "To spread the cost across the years the asset is used", isCorrect: true },
              { text: "Because SAP cannot record large expenses", isCorrect: false },
              { text: "To avoid ever recording the cost at all", isCorrect: false },
              { text: "Because vehicles are not owned by the company", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What accounting entry does the depreciation run (AFAB) typically post?",
          explanation: "Depreciation posts Debit Depreciation Expense (a P&L cost) and Credit Accumulated Depreciation (which reduces the asset's net book value on the balance sheet).",
          options: {
            create: [
              { text: "Debit Depreciation Expense / Credit Accumulated Depreciation", isCorrect: true },
              { text: "Debit Bank / Credit Revenue", isCorrect: false },
              { text: "Debit Vendor / Credit Expense", isCorrect: false },
              { text: "Debit Customer / Credit Revenue", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What does an asset's 'asset class' determine?",
          explanation: "The asset class sets defaults such as useful life, depreciation method, and the G/L accounts the asset posts to. Choosing the right class (Buildings, Vehicles, IT) configures most of the asset automatically.",
          options: {
            create: [
              { text: "Default useful life, depreciation method, and linked G/L accounts", isCorrect: true },
              { text: "The customer who will buy the asset", isCorrect: false },
              { text: "The vendor's bank account", isCorrect: false },
              { text: "Nothing — it is just a label", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 2.8: Month-End Closing
const lesson2_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "month-end-closing" } },
  update: {},
  create: {
    moduleId: ficoModule.id,
    title: "Month-End Closing in SAP",
    slug: "month-end-closing",
    order: 8,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `It's the 1st of the month and Deepak's finance team goes into "close" mode. His manager talks about "closing the period," "running depreciation," "posting accruals," and "GR/IR clearing." Deepak nods but feels like everyone knows a secret checklist he's never seen.

There IS a checklist — month-end closing is a repeatable sequence of steps that locks the old month and produces clean financial statements.`,
    content: `## What Is Month-End Closing?

**Month-end closing** is the process of finalizing all accounting for a period so the books are complete and accurate, then producing financial statements. It's like balancing your accounts at the end of each month — but for an entire company, in a strict order.

## Why a Defined Sequence Matters

If people kept posting to last month while you're reporting on it, the numbers would never settle. Closing **locks the old period** and ensures every required entry is made before reports are finalized.

## The Core Closing Steps

### 1. Stop New Postings — Open/Close Periods
The finance team closes the old posting period so users can no longer post to it (transaction **OB52**). New transactions go into the new month only.

### 2. Recurring Entries & Accruals
- **Accruals** record costs/revenues that belong to the period even if the invoice hasn't arrived (e.g. electricity used but not yet billed).
- **Recurring entries** post regular items like rent automatically.

### 3. Sub-Ledger Reconciliation
Ensure AP, AR, and Asset sub-ledgers agree with the G/L. Run **depreciation (AFAB)** so asset values are current.

### 4. GR/IR Clearing
The **GR/IR account** holds the gap between goods received and invoices received in MM. At close it's analyzed and cleared so it doesn't distort the balance sheet.

### 5. Foreign Currency Valuation
Open items in foreign currencies are revalued at month-end exchange rates so balances reflect current value.

### 6. Reconciliation & Financial Statements
Once everything is posted and balanced, produce the **Balance Sheet** and **P&L** (e.g. **F.01** or Fiori financial statement apps).

## A Typical Closing Checklist

| Order | Task | T-Code |
|-------|------|--------|
| 1 | Close prior posting period | OB52 |
| 2 | Post accruals / recurring entries | FBS1 / F.14 |
| 3 | Run depreciation | AFAB |
| 4 | Clear GR/IR | F.13 / MR11 |
| 5 | Foreign currency valuation | FAGL_FCV |
| 6 | Generate financial statements | F.01 |

## A Real Example

On the 1st, Deepak's team closes June in OB52, posts the electricity accrual, runs AFAB for depreciation, clears GR/IR, revalues foreign-currency invoices, then runs F.01 to publish June's Balance Sheet and P&L. June is now locked and final.

## Why It Matters

Month-end closing is the rhythm of every finance department. A clean, on-time close means management gets reliable numbers quickly, auditors are satisfied, and decisions are based on accurate data.`,
    keyConceptTitle: "Closing Locks the Period After a Fixed Sequence of Steps",
    keyConceptBody: `- **Month-end closing** finalizes a period and produces the Balance Sheet and P&L, following a strict order.
- Key steps: close the period (**OB52**), post accruals, run **depreciation (AFAB)**, clear **GR/IR**, revalue foreign currency, then generate statements (**F.01**).
- The sequence ensures no late postings distort reports — the old month is locked and the numbers settle.`,
  },
});
// Flowchart for lesson 2.8
const flowchart2_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson2_8.id },
  update: {},
  create: {
    lessonId: lesson2_8.id,
    title: "Month-End Closing Sequence",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 20 }, data: { label: "🔒 Close Prior Period (OB52)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 120 }, data: { label: "📝 Post Accruals & Recurring" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 220 }, data: { label: "📉 Run Depreciation (AFAB)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 320 }, data: { label: "🔗 Clear GR/IR" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 250, y: 420 }, data: { label: "💱 Foreign Currency Valuation" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 250, y: 520 }, data: { label: "📊 Generate Financial Statements (F.01)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
      { id: "e5", source: "n5", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart2_8.id, nodeId: "n1", title: "Close Prior Period", description: "Lock the old posting period so users can no longer post to it. New transactions go to the current month only.", tCode: "OB52", tips: "Closing periods prevents late entries from changing numbers you've already reported." },
    { flowchartId: flowchart2_8.id, nodeId: "n2", title: "Accruals & Recurring", description: "Post costs/revenues that belong to the period even without an invoice (accruals), and auto-post regular items like rent (recurring entries).", tCode: "FBS1 / F.14", tips: "Accruals keep the P&L accurate for the period the cost was actually incurred." },
    { flowchartId: flowchart2_8.id, nodeId: "n3", title: "Run Depreciation", description: "AFAB posts the period's depreciation so fixed-asset values on the balance sheet are current.", tCode: "AFAB", tips: "Depreciation is a recurring close step — usually scheduled to run automatically." },
    { flowchartId: flowchart2_8.id, nodeId: "n4", title: "Clear GR/IR", description: "The GR/IR account holds differences between goods received and invoices received. Clearing it prevents distortion of the balance sheet.", tCode: "F.13 / MR11", tips: "Persistent GR/IR balances often signal missing invoices or un-received goods to investigate." },
    { flowchartId: flowchart2_8.id, nodeId: "n5", title: "Foreign Currency Valuation", description: "Open foreign-currency items are revalued at period-end exchange rates so balances reflect current value.", tCode: "FAGL_FCV", tips: "This captures unrealized FX gains/losses required by accounting standards." },
    { flowchartId: flowchart2_8.id, nodeId: "n6", title: "Financial Statements", description: "With everything posted and reconciled, produce the Balance Sheet and P&L for the period.", tCode: "F.01", tips: "A fast, clean close is a sign of a healthy, well-run finance function." },
  ],
});
// Quiz for lesson 2.8
await prisma.quiz.upsert({
  where: { lessonId: lesson2_8.id },
  update: {},
  create: {
    lessonId: lesson2_8.id,
    title: "Month-End Closing — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why is closing the prior posting period (OB52) an important first step in month-end close?",
          explanation: "Closing the period stops users from posting to the old month. Without this lock, late entries could keep changing figures you've already reported, so the numbers would never settle.",
          options: {
            create: [
              { text: "It stops new postings to the old month so reported numbers stay stable", isCorrect: true },
              { text: "It deletes all transactions from the period", isCorrect: false },
              { text: "It pays all open vendor invoices", isCorrect: false },
              { text: "It creates new customers automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "The company used electricity in June but the bill won't arrive until July. How is June's P&L kept accurate?",
          explanation: "An accrual records the estimated cost in June — the period the electricity was actually consumed — even though the invoice hasn't arrived. This matches expenses to the correct period.",
          options: {
            create: [
              { text: "Post an accrual to record the cost in June", isCorrect: true },
              { text: "Ignore it until the bill arrives in July", isCorrect: false },
              { text: "Record it as a fixed asset", isCorrect: false },
              { text: "Reverse June's revenue instead", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What does clearing the GR/IR account during close achieve?",
          explanation: "The GR/IR account temporarily holds the difference between goods received and invoices received in MM. Clearing it at close removes that gap so the balance sheet isn't distorted, and highlights missing invoices or goods to investigate.",
          options: {
            create: [
              { text: "It resolves the gap between goods received and invoices received", isCorrect: true },
              { text: "It calculates employee salaries", isCorrect: false },
              { text: "It sets next year's sales targets", isCorrect: false },
              { text: "It creates the chart of accounts", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── MM: NEW LESSONS ────────────────────────────────────────────────────────
// LESSON 3.2: The Material Master
const lesson3_2 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "material-master" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "The Material Master",
    slug: "material-master",
    order: 2,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `Imran is told to "create the material for the new 10mm steel rod so purchasing can order it." He opens MM01 and is hit with a wall of tabs — Basic Data, Purchasing, Accounting, Storage — and a question: "Which views and which org levels?" He has no idea what to fill where.

The Material Master looks intimidating, but it's really just one shared product record split into department sections. Once Imran sees that, it clicks.`,
    content: `## What Is the Material Master?

The **Material Master** is the central record for every product or material a company makes, buys, stores, or sells. It's the single most important master data in logistics — MM, PP, SD, and FICO all read from it.

Think of it as a **product's complete profile** that every department shares, instead of each team keeping its own list.

## Organized into Views

Because many departments use the same material differently, the record is split into **views**:

| View | Used by | Example fields |
|------|---------|----------------|
| **Basic Data** | Everyone | Description, base unit, weight |
| **Purchasing** | MM | Purchasing group, order unit |
| **Sales** | SD | Sales org data, delivering plant |
| **MRP** | PP | Planning type, reorder point |
| **Accounting** | FICO | Valuation class, standard price |
| **Storage** | WM/IM | Storage conditions, bins |

Each team maintains its own view of the *same* record — like tabs in one shared file.

## Data at Different Org Levels

Material data lives at different organizational levels:

- **Client level** — applies everywhere (e.g. description, base unit of measure).
- **Plant level** — specific to a plant (e.g. MRP, purchasing).
- **Storage location / Sales org level** — even more specific.

So the same material can have different planning settings in Pune than in Chennai, while sharing one global description.

## Material Type — A Key Setting

Every material has a **material type** that controls its behavior and which views are even available:

| Material Type | Meaning |
|---------------|---------|
| **ROH** | Raw material (you buy it) |
| **HALB** | Semi-finished (you make it from raws) |
| **FERT** | Finished good (you sell it) |
| **HAWA** | Trading good (buy and resell) |

A raw material (ROH) gets a Purchasing view but not a Sales view; a finished good (FERT) is the opposite.

## Key Material Master T-Codes

| T-Code | Purpose |
|--------|---------|
| MM01 | Create material |
| MM02 | Change material |
| MM03 | Display material |
| MM60 | Material list/report |

## A Real Example

The 10mm steel rod (material type ROH):
- **Basic Data**: description, unit = KG.
- **Purchasing**: purchasing group, order unit.
- **Accounting**: valuation class, moving average price.
- Created for Plant 1100 so Pune can plan and buy it.

## Why It Matters

If the material master is incomplete (a missing view or wrong org level), transactions fail — you can't order, store, or sell a material until its relevant views exist. Clean material master data is the foundation of all logistics processes.`,
    keyConceptTitle: "The Material Master Is One Shared Product Record with Department Views",
    keyConceptBody: `- The **Material Master** is the central record for a product, shared by MM, PP, SD, and FICO.
- It's split into **views** (Basic, Purchasing, Sales, MRP, Accounting, Storage) and maintained at **org levels** (client, plant, storage location).
- The **material type** (ROH, HALB, FERT, HAWA) controls behavior and which views exist; maintain it with MM01/MM02/MM03.`,
  },
});
// Flowchart for lesson 3.2
const flowchart3_2 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_2.id },
  update: {},
  create: {
    lessonId: lesson3_2.id,
    title: "Anatomy of the Material Master",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "📦 Material Master Record" }, style: { background: "#1E293B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 60, y: 160 }, data: { label: "📄 Basic Data (All)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 280, y: 160 }, data: { label: "🛒 Purchasing (MM)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 500, y: 160 }, data: { label: "💰 Accounting (FICO)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 250, y: 290 }, data: { label: "🏭 Maintained per Org Level (Plant)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 250, y: 400 }, data: { label: "✅ Ready for Transactions" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n1", target: "n3", type: "default" },
      { id: "e3", source: "n1", target: "n4", type: "default" },
      { id: "e4", source: "n2", target: "n5", type: "default" },
      { id: "e5", source: "n3", target: "n5", type: "default" },
      { id: "e6", source: "n4", target: "n5", type: "default" },
      { id: "e7", source: "n5", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_2.id, nodeId: "n1", title: "Material Master Record", description: "The single shared record for a product. MM, PP, SD, and FICO all reference it, so the data is consistent everywhere.", tCode: "MM01 / MM03", tips: "One material number, many uses — never create duplicate materials for the same item." },
    { flowchartId: flowchart3_2.id, nodeId: "n2", title: "Basic Data View", description: "Client-level information that applies everywhere: description, base unit of measure, weight, material group.", tCode: "MM03 (Basic Data)", tips: "Base unit of measure is hard to change later — set it carefully at creation." },
    { flowchartId: flowchart3_2.id, nodeId: "n3", title: "Purchasing View", description: "MM-specific data: purchasing group, order unit, and purchasing-relevant settings used when buying the material.", tCode: "MM03 (Purchasing)", tips: "Without a Purchasing view at the plant, you can't create a PO for the material there." },
    { flowchartId: flowchart3_2.id, nodeId: "n4", title: "Accounting View", description: "FICO data: valuation class and price (standard or moving average) that determine how stock is valued financially.", tCode: "MM03 (Accounting)", tips: "The valuation class links the material to the right inventory G/L accounts." },
    { flowchartId: flowchart3_2.id, nodeId: "n5", title: "Org Levels", description: "Many views are maintained per plant or storage location, so the same material can behave differently across sites.", tCode: "MM01 (org-level popup)", tips: "Extend a material to a new plant before that plant can transact with it." },
    { flowchartId: flowchart3_2.id, nodeId: "n6", title: "Ready for Transactions", description: "Once the relevant views and org levels exist, the material can be purchased, stored, planned, and sold.", tCode: "N/A", tips: "A 'material not extended' error almost always means a missing view or org level." },
  ],
});
// Quiz for lesson 3.2
await prisma.quiz.upsert({
  where: { lessonId: lesson3_2.id },
  update: {},
  create: {
    lessonId: lesson3_2.id,
    title: "The Material Master — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why is the Material Master organized into 'views' like Purchasing, Sales, and Accounting?",
          explanation: "Multiple departments use the same material differently, so the record is split into views. Each team maintains its own section of one shared record, keeping data unified yet relevant to each function.",
          options: {
            create: [
              { text: "So each department maintains its own section of one shared record", isCorrect: true },
              { text: "Because each department needs a separate material number", isCorrect: false },
              { text: "To make materials harder to create", isCorrect: false },
              { text: "Views only control the screen color", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "You try to create a purchase order for a material at Plant 1100 but SAP blocks it. What is the most likely cause?",
          explanation: "The material probably hasn't been extended with a Purchasing view at Plant 1100. A material must have the relevant views at the relevant org level before transactions there can use it.",
          options: {
            create: [
              { text: "The material has no Purchasing view at that plant", isCorrect: true },
              { text: "Purchase orders are illegal in SAP", isCorrect: false },
              { text: "The vendor master was deleted", isCorrect: false },
              { text: "The material number is too short", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A material is set up as type ROH (raw material). Which view would you NOT expect it to need?",
          explanation: "A raw material (ROH) is purchased, not sold, so it needs Purchasing, MRP, and Accounting views but typically not a Sales view. The material type controls which views are relevant.",
          options: {
            create: [
              { text: "The Sales view", isCorrect: true },
              { text: "The Purchasing view", isCorrect: false },
              { text: "The Accounting view", isCorrect: false },
              { text: "The Basic Data view", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.3: The Vendor Master
const lesson3_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "vendor-master" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "The Vendor Master",
    slug: "vendor-master",
    order: 3,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Nisha's company signs up a new supplier. Before any purchase order can be raised, someone says, "Set them up in the vendor master — purchasing and finance both need their data." Nisha wonders why a supplier's details need to live in two places, and what happens if the bank account is wrong.

The vendor master is where a supplier's identity, purchasing terms, and payment details come together — and getting it right protects both buying and paying.`,
    content: `## What Is the Vendor Master?

The **Vendor Master** (called **Business Partner** in S/4HANA) is the central record for every supplier the company buys from. Purchase orders, goods receipts, and invoice payments all reference it.

Think of it as a **supplier's complete profile** — who they are, how you buy from them, and how you pay them.

## Three Data Areas (Shared by Two Teams)

The vendor master is organized into three segments, owned by different teams:

| Segment | Owner | Contains |
|---------|-------|----------|
| **General Data** | Shared | Name, address, contact, tax IDs (client level) |
| **Company Code Data** | Finance (FI) | Payment terms, bank details, reconciliation account |
| **Purchasing Data** | Purchasing (MM) | Purchasing currency, Incoterms, order terms |

This mirrors real life: purchasing cares *how to order*, finance cares *how to pay*, and both share the supplier's basic identity.

## Why Two Org Levels Matter

- **General data** is at client level — the supplier's name and address are the same everywhere.
- **Company code data** means a vendor can have different payment terms or bank accounts per legal entity.
- **Purchasing data** is per purchasing organization.

So one global supplier can be used by several company codes, each with its own payment arrangement.

## The Reconciliation Account Link

Each vendor's company code segment specifies a **reconciliation account** — the G/L account that automatically reflects all that vendor's payables. This is what ties the AP sub-ledger to the General Ledger (the concept from FICO).

## Key Vendor Master T-Codes

| T-Code | Purpose |
|--------|---------|
| BP | Create/maintain Business Partner (S/4HANA) |
| XK01 / XK02 / XK03 | Create / Change / Display (central, older) |
| MK01 | Create (purchasing view) |
| FK01 | Create (finance view) |

## A Real Example

A new steel supplier:
- **General**: name, address, GST number.
- **Purchasing**: currency INR, Incoterms, ordering terms.
- **Company Code 1000**: payment terms (e.g. net 30), bank account, reconciliation account.

Now purchasing can raise POs and finance can pay invoices — all from one consistent record.

## Why It Matters

A complete, accurate vendor master is essential: missing purchasing data blocks POs, and wrong bank or payment data causes failed payments or fraud risk. Companies guard vendor bank changes carefully because that's a common target for payment fraud.`,
    keyConceptTitle: "The Vendor Master Combines Identity, Purchasing, and Payment Data",
    keyConceptBody: `- The **Vendor Master** (Business Partner in S/4HANA) is the central supplier record used by POs, goods receipts, and payments.
- It has three segments: **General** (shared identity), **Purchasing** (MM order terms), and **Company Code** (FI payment terms, bank, reconciliation account).
- The reconciliation account links the AP sub-ledger to the G/L; maintain vendors via BP (or XK01/02/03).`,
  },
});
// Flowchart for lesson 3.3
const flowchart3_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_3.id },
  update: {},
  create: {
    lessonId: lesson3_3.id,
    title: "Structure of the Vendor Master",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "🏭 Vendor / Business Partner" }, style: { background: "#1E293B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 60, y: 160 }, data: { label: "🪪 General Data (Identity)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 300, y: 160 }, data: { label: "🛒 Purchasing Data (MM)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 540, y: 160 }, data: { label: "💰 Company Code Data (FI)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 540, y: 290 }, data: { label: "🔗 Reconciliation Account → G/L" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 200, y: 290 }, data: { label: "✅ Ready: Order & Pay" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n1", target: "n3", type: "default" },
      { id: "e3", source: "n1", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
      { id: "e5", source: "n3", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_3.id, nodeId: "n1", title: "Vendor / Business Partner", description: "The central supplier record. In S/4HANA, vendors are managed through the Business Partner, unifying what used to be separate masters.", tCode: "BP / XK03", tips: "In S/4HANA always use BP; the old XK/FK transactions are redirected to it." },
    { flowchartId: flowchart3_3.id, nodeId: "n2", title: "General Data", description: "Client-level identity: name, address, contacts, and tax IDs. Shared by every company code and purchasing org.", tCode: "BP (General Data)", tips: "Because it's global, an address fix here corrects the supplier everywhere at once." },
    { flowchartId: flowchart3_3.id, nodeId: "n3", title: "Purchasing Data", description: "MM-owned data: order currency, Incoterms, and purchasing terms used when raising POs to this vendor.", tCode: "MK01 / BP (Purchasing)", tips: "Missing purchasing data blocks purchase order creation for the vendor." },
    { flowchartId: flowchart3_3.id, nodeId: "n4", title: "Company Code Data", description: "FI-owned data: payment terms, bank details, and the reconciliation account — specific to each legal entity.", tCode: "FK01 / BP (Company Code)", tips: "A vendor can have different payment terms per company code." },
    { flowchartId: flowchart3_3.id, nodeId: "n5", title: "Reconciliation Account", description: "Links the vendor's payables to a G/L account automatically, connecting the AP sub-ledger to the General Ledger.", tCode: "BP (Recon. account)", tips: "This is the same reconciliation-account concept you saw in G/L accounts." },
    { flowchartId: flowchart3_3.id, nodeId: "n6", title: "Ready to Order & Pay", description: "With all three segments complete, purchasing can raise POs and finance can process payments seamlessly.", tCode: "ME21N / F110", tips: "Guard changes to vendor bank data — it's a common payment-fraud target." },
  ],
});
// Quiz for lesson 3.3
await prisma.quiz.upsert({
  where: { lessonId: lesson3_3.id },
  update: {},
  create: {
    lessonId: lesson3_3.id,
    title: "The Vendor Master — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which vendor master segment contains the payment terms and bank details?",
          explanation: "The Company Code (finance) segment holds payment terms, bank details, and the reconciliation account. General data holds identity, and Purchasing data holds ordering terms.",
          options: {
            create: [
              { text: "The Company Code (finance) segment", isCorrect: true },
              { text: "The General Data segment", isCorrect: false },
              { text: "The Purchasing segment", isCorrect: false },
              { text: "The material master", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why can the same supplier have different payment terms in two different company codes?",
          explanation: "General data (identity) is client-level and shared, but company code data is maintained per legal entity. So one global vendor can carry different payment terms or bank accounts in each company code.",
          options: {
            create: [
              { text: "Company code data is maintained separately per legal entity", isCorrect: true },
              { text: "SAP randomly assigns payment terms", isCorrect: false },
              { text: "It requires creating a duplicate vendor each time", isCorrect: false },
              { text: "Payment terms are stored in the material master", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What role does the reconciliation account in the vendor master play?",
          explanation: "The reconciliation account links all of that vendor's payables to a G/L account automatically, tying the AP sub-ledger to the General Ledger so detail and summary stay in sync.",
          options: {
            create: [
              { text: "It links the vendor's payables to the General Ledger automatically", isCorrect: true },
              { text: "It stores the vendor's product catalog", isCorrect: false },
              { text: "It sets the sales price for customers", isCorrect: false },
              { text: "It has no accounting purpose", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.4: Purchase Requisition to Purchase Order
const lesson3_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "requisition-to-purchase-order" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Purchase Requisition to Purchase Order",
    slug: "requisition-to-purchase-order",
    order: 4,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `Suresh on the shop floor notices the bolts are running low. He can't just call a supplier — company rules require approval first. So he raises an internal request, his manager approves it, and only then does purchasing turn it into an official order to the vendor.

That journey — from "we need this" to "we've officially ordered it" — is the Purchase Requisition to Purchase Order flow, the controlled start of every purchase in SAP.`,
    content: `## Two Documents, Two Purposes

The start of buying in SAP involves two distinct documents:

- **Purchase Requisition (PR)** — an *internal* request: "we need this." It's not seen by the vendor and creates no commitment.
- **Purchase Order (PO)** — an *external*, legally binding order sent to the vendor: "please supply this at this price."

The PR is like writing a shopping list; the PO is actually placing the order with the shop.

## Step 1: Purchase Requisition (ME51N)

Anyone who needs goods can raise a PR specifying material, quantity, and required date. Key points:
- It's internal only.
- It usually needs **approval (release)** before it can become a PO.
- T-codes: **ME51N** (create), **ME52N** (change), **ME53N** (display).

## Step 2: Approval / Release

Many companies route PRs through a **release strategy** — an approval workflow based on value or category. A ₹5,000 PR might need one approver; a ₹5,00,000 PR might need three. Until released, it can't proceed.

## Step 3: Source of Supply

Before converting, purchasing decides *who* to buy from. SAP can help via:
- **Info records** (price history per vendor-material),
- **Source lists** (approved vendors for a material),
- **Outline agreements** (contracts).

## Step 4: Purchase Order (ME21N)

Purchasing converts the approved PR into a **PO**, the legal commitment. The PO carries vendor, material, quantity, price, delivery date, and terms.
- T-codes: **ME21N** (create), **ME22N** (change), **ME23N** (display).
- A PO can be created with reference to a PR, so data flows through automatically.

## The Documents Stay Linked

The PR and PO are connected — from the PO you can trace back to its PR, and onward to goods receipt and invoice. This is SAP's document flow giving full traceability.

## Key T-Codes Summary

| T-Code | Purpose |
|--------|---------|
| ME51N | Create Purchase Requisition |
| ME54N / ME55 | Release (approve) requisition |
| ME21N | Create Purchase Order |
| ME57 | Assign and process requisitions |
| ME23N | Display Purchase Order |

## A Real Example

1. Suresh raises PR for 1,000 bolts (ME51N).
2. His manager releases it (approval).
3. Purchasing picks the approved vendor and converts it to PO via ME21N.
4. The PO — a legal order — is sent to the vendor, ready for goods receipt later.

## Why It Matters

Separating the PR (request) from the PO (commitment) gives companies control: spending is approved before any legal obligation is created, and every purchase has a clear, auditable origin.`,
    keyConceptTitle: "PR Is an Internal Request; PO Is the Legal Order",
    keyConceptBody: `- A **Purchase Requisition (ME51N)** is an internal request to buy — no vendor commitment, usually needs approval.
- After release, purchasing chooses a source and converts it into a **Purchase Order (ME21N)** — the legally binding order sent to the vendor.
- PR and PO stay linked in the document flow, giving controlled, auditable purchasing from request to commitment.`,
  },
});
// Flowchart for lesson 3.4
const flowchart3_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_4.id },
  update: {},
  create: {
    lessonId: lesson3_4.id,
    title: "From Requisition to Purchase Order",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "📝 Raise Requisition (ME51N)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 140 }, data: { label: "✅ Approval / Release" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 250 }, data: { label: "🔎 Choose Source of Supply" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 360 }, data: { label: "📋 Convert to PO (ME21N)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 250, y: 470 }, data: { label: "📤 PO Sent to Vendor" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_4.id, nodeId: "n1", title: "Raise Requisition", description: "An internal request stating what's needed, how much, and by when. It creates no commitment and isn't seen by vendors.", tCode: "ME51N", tips: "PRs can also be generated automatically by MRP when stock falls below the reorder point." },
    { flowchartId: flowchart3_4.id, nodeId: "n2", title: "Approval / Release", description: "A release strategy routes the PR for approval based on value or type. It can't become a PO until released.", tCode: "ME54N / ME55", tips: "Higher-value requisitions typically require more approval levels." },
    { flowchartId: flowchart3_4.id, nodeId: "n3", title: "Source of Supply", description: "Purchasing decides which vendor to buy from using info records, source lists, or contracts.", tCode: "ME57 / ME01", tips: "Info records remember the last price per vendor-material — handy for sourcing decisions." },
    { flowchartId: flowchart3_4.id, nodeId: "n4", title: "Convert to PO", description: "The approved PR is turned into a Purchase Order — the legal commitment — carrying vendor, price, quantity, and delivery terms.", tCode: "ME21N", tips: "Creating the PO with reference to the PR copies data through, reducing errors." },
    { flowchartId: flowchart3_4.id, nodeId: "n5", title: "PO Sent to Vendor", description: "The PO is transmitted to the vendor and becomes the reference for the upcoming goods receipt and invoice.", tCode: "ME23N", tips: "From the PO you can trace forward to goods receipt and invoice via the document flow." },
  ],
});
// Quiz for lesson 3.4
await prisma.quiz.upsert({
  where: { lessonId: lesson3_4.id },
  update: {},
  create: {
    lessonId: lesson3_4.id,
    title: "Requisition to Purchase Order — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the key difference between a Purchase Requisition and a Purchase Order?",
          explanation: "A PR is an internal request with no vendor commitment; a PO is the external, legally binding order sent to the vendor. The PR comes first and, once approved, becomes a PO.",
          options: {
            create: [
              { text: "A PR is an internal request; a PO is the legal order to the vendor", isCorrect: true },
              { text: "A PR is sent to the vendor; a PO is internal only", isCorrect: false },
              { text: "They are the same document", isCorrect: false },
              { text: "A PO must always come before a PR", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why do many companies route purchase requisitions through a release strategy before they become POs?",
          explanation: "A release strategy enforces approval (often by value or category) so spending is authorized before any legal commitment is made. This gives financial control over purchasing.",
          options: {
            create: [
              { text: "To approve spending before a legal commitment is created", isCorrect: true },
              { text: "To send the requisition to the customer", isCorrect: false },
              { text: "To delete the requisition automatically", isCorrect: false },
              { text: "Because POs cannot exist without deleting the PR", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What helps purchasing decide which vendor to source from when converting a requisition?",
          explanation: "Info records (price history per vendor-material), source lists (approved vendors), and outline agreements (contracts) guide the sourcing decision before the PO is created.",
          options: {
            create: [
              { text: "Info records, source lists, and outline agreements", isCorrect: true },
              { text: "The customer master", isCorrect: false },
              { text: "The depreciation run", isCorrect: false },
              { text: "The dunning program", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.5: Goods Receipt (MIGO)
const lesson3_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "goods-receipt-migo" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Goods Receipt with MIGO",
    slug: "goods-receipt-migo",
    order: 5,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `A truck pulls up at the warehouse with the bolts Suresh ordered. Ravi, the storekeeper, has to confirm in SAP that the goods actually arrived. He hears "post a goods receipt with MIGO, movement type 101." Ravi wonders: what does posting actually change, and why does finance suddenly care that a truck arrived?

Goods receipt is the moment a paper order becomes real stock — and SAP updates inventory and accounting in the same instant.`,
    content: `## What Is a Goods Receipt?

A **Goods Receipt (GR)** records the physical arrival of goods against a purchase order. It's the moment "we ordered it" becomes "we have it." The universal transaction is **MIGO**.

## What Happens When You Post a GR

Posting a goods receipt does three things at once:

1. **Increases stock** — inventory of the material goes up at the receiving plant/storage location.
2. **Creates a material document** — recording the movement (what, how much, where).
3. **Creates an accounting document** — because stock has financial value.

The accounting entry: **Debit Inventory (stock value up) / Credit GR/IR (a temporary clearing account)**.

## The GR/IR Account — A Key Idea

The **GR/IR (Goods Receipt / Invoice Receipt)** account is a temporary "holding" account. At goods receipt, SAP credits GR/IR because goods arrived but the invoice hasn't yet. When the invoice is posted later (MIRO), GR/IR is debited to clear it. It's the bridge between receiving goods and receiving the bill.

## Movement Types — The Language of Stock

Every goods movement uses a **movement type**, a 3-digit code telling SAP exactly what kind of movement it is:

| Movement Type | Meaning |
|---------------|---------|
| **101** | Goods receipt against a PO |
| **102** | Reversal of a goods receipt |
| **122** | Return delivery to vendor |
| **103** | GR into blocked stock |

For a standard PO receipt, **101** is the one you'll use most.

## Stock Destination

When receiving, you choose where the stock lands:
- **Unrestricted** — immediately available for use.
- **Quality inspection** — held until QM checks it.
- **Blocked** — not yet usable.

## Key MIGO Facts

- MIGO references the PO number, so it copies the expected materials and quantities.
- You can receive partial quantities (e.g. 600 of 1,000 bolts now).
- It's the trigger for the eventual **3-way match** in invoice verification.

## A Real Example

The 1,000 bolts arrive:
- Ravi opens **MIGO**, references the PO, confirms quantity, movement type **101**, into unrestricted stock.
- SAP increases bolt inventory, creates a material document, and posts: Debit Inventory / Credit GR/IR.
- Stock is now real and available; the GR/IR balance waits for the vendor's invoice.

## Why It Matters

Goods receipt links the physical world (a truck arriving) to the system world (stock and accounting). Skipping or mis-posting a GR breaks inventory accuracy and blocks invoice payment — which is why it's a core MM skill.`,
    keyConceptTitle: "Goods Receipt (MIGO, MvT 101) Updates Stock AND Accounting",
    keyConceptBody: `- A **Goods Receipt** in **MIGO** records that ordered goods physically arrived; the standard movement type is **101**.
- It increases stock, creates a **material document**, and posts an accounting entry: **Debit Inventory / Credit GR/IR**.
- The **GR/IR account** temporarily holds the value until the invoice is posted (MIRO), bridging goods received and invoice received.`,
  },
});
// Flowchart for lesson 3.5
const flowchart3_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_5.id },
  update: {},
  create: {
    lessonId: lesson3_5.id,
    title: "Goods Receipt Posting",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "🚚 Goods Arrive Against PO" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 140 }, data: { label: "📥 Post GR in MIGO (MvT 101)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 60, y: 260 }, data: { label: "📈 Stock Increases" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 280, y: 260 }, data: { label: "📄 Material Document" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 500, y: 260 }, data: { label: "💰 Accounting: Dr Inventory / Cr GR/IR" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 250, y: 380 }, data: { label: "⏳ Awaiting Invoice (MIRO)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n2", target: "n4", type: "default" },
      { id: "e4", source: "n2", target: "n5", type: "default" },
      { id: "e5", source: "n5", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_5.id, nodeId: "n1", title: "Goods Arrive", description: "A delivery shows up referencing a purchase order. The storekeeper checks quantity and quality before confirming in SAP.", tCode: "N/A", tips: "Always check the PO number on the delivery note so you post against the right order." },
    { flowchartId: flowchart3_5.id, nodeId: "n2", title: "Post GR in MIGO", description: "MIGO references the PO and copies expected materials. Movement type 101 records a standard goods receipt against the PO.", tCode: "MIGO (101)", tips: "You can receive partial quantities — SAP tracks what's still open on the PO." },
    { flowchartId: flowchart3_5.id, nodeId: "n3", title: "Stock Increases", description: "Inventory of the material rises at the receiving plant/storage location and stock destination (unrestricted, QI, or blocked).", tCode: "MMBE (Stock Overview)", tips: "Choose 'quality inspection' destination if the material needs a QM check first." },
    { flowchartId: flowchart3_5.id, nodeId: "n4", title: "Material Document", description: "A material document records the movement — material, quantity, movement type, location — for full traceability.", tCode: "MB51 / MIGO display", tips: "The material document number is your reference if you need to reverse the GR (MvT 102)." },
    { flowchartId: flowchart3_5.id, nodeId: "n5", title: "Accounting Document", description: "Because stock has value, SAP posts Debit Inventory / Credit GR/IR automatically — finance updates the instant goods arrive.", tCode: "N/A", tips: "GR/IR is a temporary account cleared later when the invoice is posted." },
    { flowchartId: flowchart3_5.id, nodeId: "n6", title: "Awaiting Invoice", description: "The GR/IR balance sits until the vendor invoice is posted in MIRO, completing the 3-way match.", tCode: "MIRO (next step)", tips: "Open GR/IR items are reviewed at month-end to catch missing invoices." },
  ],
});
// Quiz for lesson 3.5
await prisma.quiz.upsert({
  where: { lessonId: lesson3_5.id },
  update: {},
  create: {
    lessonId: lesson3_5.id,
    title: "Goods Receipt with MIGO — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "When you post a standard goods receipt against a PO in MIGO, which movement type do you use?",
          explanation: "Movement type 101 is the standard goods receipt against a purchase order. 102 reverses it, and 122 is a return to the vendor.",
          options: {
            create: [
              { text: "101", isCorrect: true },
              { text: "601", isCorrect: false },
              { text: "261", isCorrect: false },
              { text: "311", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Posting a goods receipt creates an accounting document. What is the typical entry?",
          explanation: "A goods receipt posts Debit Inventory (stock value increases) and Credit GR/IR (a temporary clearing account that waits for the vendor invoice). This is why receiving goods immediately affects finance.",
          options: {
            create: [
              { text: "Debit Inventory / Credit GR/IR", isCorrect: true },
              { text: "Debit Bank / Credit Revenue", isCorrect: false },
              { text: "Debit Customer / Credit Sales", isCorrect: false },
              { text: "No accounting entry is created", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does SAP use the GR/IR account at goods receipt instead of posting straight to the vendor?",
          explanation: "At goods receipt the goods have arrived but the invoice hasn't, so SAP parks the value in the temporary GR/IR account. When the invoice is later posted (MIRO), GR/IR is cleared — bridging the gap between receiving goods and receiving the bill.",
          options: {
            create: [
              { text: "The goods arrived but the invoice hasn't, so GR/IR holds the value temporarily", isCorrect: true },
              { text: "Because the vendor account does not exist yet", isCorrect: false },
              { text: "To avoid ever recording the inventory", isCorrect: false },
              { text: "GR/IR replaces the need for an invoice entirely", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.6: Invoice Verification (MIRO)
const lesson3_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "invoice-verification-miro" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Invoice Verification with MIRO",
    slug: "invoice-verification-miro",
    order: 6,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `The vendor's invoice for the bolts lands in finance. Before paying, Pooja must check: did we actually order this? Did we receive it? Does the price match? She hears "run MIRO and let the 3-way match do the work." Pooja wonders how SAP can verify all that automatically.

Invoice Verification is where the purchasing cycle meets finance — and where SAP's 3-way match quietly prevents overpayments and fraud.`,
    content: `## What Is Invoice Verification?

**Invoice Verification (MIRO)** is the step where a vendor's invoice is checked against the purchase order and goods receipt, then posted so it can be paid. It's the final logistics step before payment, and it hands off to Accounts Payable.

## The 3-Way Match — The Heart of MIRO

SAP compares **three documents**:

1. **Purchase Order** — what we ordered (item, quantity, price).
2. **Goods Receipt** — what we actually received.
3. **Invoice** — what the vendor is billing.

If all three agree, the invoice posts cleanly. If they don't (e.g. price too high, quantity more than received), SAP **blocks** the invoice for review. This automatic check is what prevents paying for goods you didn't order or receive.

## What Happens When You Post in MIRO

Posting the invoice:
- **Clears the GR/IR account** that the goods receipt credited.
- **Credits the vendor** (creating the payable in AP).

The entry: **Debit GR/IR (clearing it) / Credit Vendor**. So GR/IR, which was credited at goods receipt, is now debited and cleared — the loop closes.

## Tolerances and Blocks

Real invoices rarely match to the paisa. SAP allows **tolerances** — small acceptable differences (e.g. price within 2%). Within tolerance, the invoice posts; outside tolerance, it's **blocked** and must be released by an authorized user (**MRBR**) after investigation.

## Three Documents, One Chain

After MIRO, the full chain exists: **PR → PO → GR → Invoice**, all linked in the document flow. From the invoice you can trace back to the original requisition — complete traceability for audits.

## Key Invoice Verification T-Codes

| T-Code | Purpose |
|--------|---------|
| MIRO | Enter/post vendor invoice (PO-based) |
| MIR4 | Display invoice document |
| MRBR | Release blocked invoices |
| MR8M | Cancel/reverse an invoice |

## A Real Example

The vendor bills ₹50,000 for 1,000 bolts:
- Pooja opens **MIRO**, references the PO.
- SAP checks: PO price ✓, goods received ✓, quantity ✓ → match successful.
- She posts: Debit GR/IR ₹50,000 / Credit Vendor ₹50,000.
- The invoice now sits as an open item in AP, ready for the payment run (F110).

## Why It Matters

MIRO is the control point that protects company money. The 3-way match catches overcharges, duplicate bills, and goods never received — automatically. It also closes the GR/IR loop, keeping the balance sheet clean. It's where MM hands the baton to FICO.`,
    keyConceptTitle: "MIRO Does the 3-Way Match and Clears GR/IR",
    keyConceptBody: `- **Invoice Verification (MIRO)** checks the vendor invoice via the **3-way match**: Purchase Order + Goods Receipt + Invoice.
- A clean match posts **Debit GR/IR / Credit Vendor**, clearing the GR/IR balance and creating the AP payable.
- Differences outside **tolerance** block the invoice (released via MRBR), preventing overpayment — then AP pays it (F110).`,
  },
});
// Flowchart for lesson 3.6
const flowchart3_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_6.id },
  update: {},
  create: {
    lessonId: lesson3_6.id,
    title: "Invoice Verification & 3-Way Match",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "📨 Vendor Invoice Received" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 140 }, data: { label: "⚖️ MIRO: 3-Way Match (PO+GR+Invoice)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 70, y: 270 }, data: { label: "✅ Match OK → Post" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 430, y: 270 }, data: { label: "⛔ Mismatch → Block (MRBR)" }, style: { background: "#EF4444", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 70, y: 390 }, data: { label: "💰 Dr GR/IR / Cr Vendor" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 70, y: 500 }, data: { label: "📂 Open Item in AP → Pay (F110)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n2", target: "n4", type: "default" },
      { id: "e4", source: "n3", target: "n5", type: "default" },
      { id: "e5", source: "n5", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_6.id, nodeId: "n1", title: "Vendor Invoice Received", description: "The supplier sends a bill for the delivered goods. Finance must verify it before it can be paid.", tCode: "N/A", tips: "Match the invoice to the correct PO number to start verification cleanly." },
    { flowchartId: flowchart3_6.id, nodeId: "n2", title: "3-Way Match in MIRO", description: "SAP compares the Purchase Order (ordered), Goods Receipt (received), and Invoice (billed). Agreement means the invoice can post.", tCode: "MIRO", tips: "Reference the PO in MIRO so SAP pulls the expected price and quantity automatically." },
    { flowchartId: flowchart3_6.id, nodeId: "n3", title: "Match OK → Post", description: "When the three documents agree within tolerance, the invoice posts and becomes payable.", tCode: "MIRO (Post)", tips: "Simulate the posting first to confirm the GR/IR clearing and vendor amounts." },
    { flowchartId: flowchart3_6.id, nodeId: "n4", title: "Mismatch → Block", description: "If price or quantity falls outside tolerance, SAP blocks the invoice for payment until an authorized user investigates and releases it.", tCode: "MRBR", tips: "Blocked invoices protect cash — never release one without understanding the difference." },
    { flowchartId: flowchart3_6.id, nodeId: "n5", title: "Dr GR/IR / Cr Vendor", description: "Posting debits and clears the GR/IR account (credited at goods receipt) and credits the vendor, creating the payable.", tCode: "N/A", tips: "This is the entry that closes the GR/IR loop opened at goods receipt." },
    { flowchartId: flowchart3_6.id, nodeId: "n6", title: "Open Item in AP", description: "The posted invoice becomes an open item on the vendor account, ready to be settled by the payment run.", tCode: "FBL1N / F110", tips: "From here it's pure Accounts Payable — the MM-to-FICO handoff is complete." },
  ],
});
// Quiz for lesson 3.6
await prisma.quiz.upsert({
  where: { lessonId: lesson3_6.id },
  update: {},
  create: {
    lessonId: lesson3_6.id,
    title: "Invoice Verification — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which three documents does the 3-way match in MIRO compare?",
          explanation: "The 3-way match compares the Purchase Order (what we ordered), the Goods Receipt (what we received), and the Invoice (what we're billed). All three must agree for the invoice to post cleanly.",
          options: {
            create: [
              { text: "Purchase Order, Goods Receipt, and Invoice", isCorrect: true },
              { text: "Customer, Material, and Bank", isCorrect: false },
              { text: "Balance Sheet, P&L, and Cash Flow", isCorrect: false },
              { text: "Requisition, Delivery, and Dunning letter", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "An invoice price is 20% higher than the PO price, well outside tolerance. What does SAP do?",
          explanation: "When a difference exceeds the allowed tolerance, SAP blocks the invoice for payment. An authorized user must investigate and release it (MRBR) before it can be paid — preventing overpayment.",
          options: {
            create: [
              { text: "It blocks the invoice until someone investigates and releases it", isCorrect: true },
              { text: "It pays the higher amount automatically", isCorrect: false },
              { text: "It deletes the purchase order", isCorrect: false },
              { text: "It emails the customer for approval", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "How does posting the invoice in MIRO affect the GR/IR account?",
          explanation: "At goods receipt, GR/IR was credited. Posting the invoice debits and clears GR/IR (and credits the vendor). This closes the GR/IR loop, leaving a clean payable in AP.",
          options: {
            create: [
              { text: "It debits and clears the GR/IR balance created at goods receipt", isCorrect: true },
              { text: "It has no effect on GR/IR", isCorrect: false },
              { text: "It doubles the GR/IR balance", isCorrect: false },
              { text: "It moves GR/IR into the customer account", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 3.7: Stock Types & Inventory Management
const lesson3_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "stock-types-inventory" } },
  update: {},
  create: {
    moduleId: mmModule.id,
    title: "Stock Types & Inventory Management",
    slug: "stock-types-inventory",
    order: 7,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Kavya checks the stock screen and sees the company has 5,000 units of a part — but production says they "can't use 800 of them." Confused, she looks closer: some stock is free to use, some is being inspected, and some is blocked. The total looked fine, but not all of it is actually available.

Understanding stock types is what stops costly mistakes like promising goods that can't actually be shipped.`,
    content: `## Inventory Management Tracks Quantity and Value

**Inventory Management (IM)** in MM keeps real-time track of stock — how much you have, where it is, and what status it's in. Every goods movement (receipt, issue, transfer) updates it instantly.

But "how much do we have" isn't one number — stock is split into **stock types** based on whether it can actually be used.

## The Main Stock Types

| Stock Type | Can you use it? | Typical reason |
|------------|-----------------|----------------|
| **Unrestricted** | ✅ Yes | Free, available stock |
| **Quality Inspection** | ⏳ Not yet | Awaiting QM check |
| **Blocked** | ❌ No | Damaged, on hold |
| **In Transit** | In motion | Being transferred between plants |

Only **unrestricted** stock counts as truly available for production or sales. This is why a high total can be misleading — some of it may be locked in inspection or blocked.

## Stock by Location

Stock is tracked at multiple levels: **plant**, **storage location**, and (with WM) down to the **bin**. The same material can sit in several storage locations, each with its own quantities and stock types.

## Goods Movements Change Stock

Stock moves through **goods movements**, each with a movement type:

| Movement | Effect |
|----------|--------|
| Goods Receipt (101) | Stock up |
| Goods Issue (201/261) | Stock down (to cost center / production) |
| Transfer Posting (311) | Move between storage locations |
| Stock Transfer (UB/STO) | Move between plants |

## Special Movements

- **Transfer posting** changes a stock's status or location *without* leaving the company — e.g. moving from quality inspection to unrestricted after a passed inspection.
- **Goods issue** removes stock for consumption (production, cost center, or a sales delivery).

## Viewing Stock

| T-Code | Purpose |
|--------|---------|
| MMBE | Stock overview (all locations, all stock types) |
| MB52 | Warehouse stock list |
| MB51 | Material document list (movement history) |
| MB5B | Stock on a specific date |

## A Real Example

Kavya's 5,000 units break down as:
- **4,000 unrestricted** — ready to use.
- **800 in quality inspection** — waiting for QM to pass them.
- **200 blocked** — damaged, pending a decision.

Only 4,000 are truly available. Once QM releases the 800 (a transfer posting to unrestricted), availability rises to 4,800.

## Why It Matters

Knowing stock types prevents over-promising. Planners, salespeople, and buyers must look at *available* (unrestricted) stock, not just the total, or they'll commit goods that physically can't be shipped — a classic, costly beginner error.`,
    keyConceptTitle: "Only Unrestricted Stock Is Truly Available",
    keyConceptBody: `- **Inventory Management** tracks stock quantity, location, and **stock type** in real time; every goods movement updates it.
- The main stock types are **unrestricted** (usable), **quality inspection** (awaiting check), **blocked** (unusable), and **in transit**.
- Only **unrestricted** stock is available for production/sales; use MMBE to see the full breakdown, and transfer postings to move stock between statuses.`,
  },
});
// Flowchart for lesson 3.7
const flowchart3_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson3_7.id },
  update: {},
  create: {
    lessonId: lesson3_7.id,
    title: "Stock Types and Movements",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "📥 Goods Receipt (101)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 140 }, data: { label: "🔬 Quality Inspection Stock" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 60, y: 250 }, data: { label: "✅ Unrestricted (Usable)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 460, y: 250 }, data: { label: "⛔ Blocked (Unusable)" }, style: { background: "#EF4444", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 60, y: 360 }, data: { label: "📤 Goods Issue (Consumed)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n2", target: "n4", type: "default" },
      { id: "e4", source: "n3", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart3_7.id, nodeId: "n1", title: "Goods Receipt", description: "Stock enters the plant, often via a PO receipt (101). At receipt you choose which stock type it lands in.", tCode: "MIGO (101)", tips: "Receiving into quality inspection forces a QM check before the stock becomes usable." },
    { flowchartId: flowchart3_7.id, nodeId: "n2", title: "Quality Inspection Stock", description: "Stock held pending a quality check. It's counted in inventory but not yet available for production or sales.", tCode: "MMBE", tips: "Inspection stock inflates the total — always confirm how much is actually unrestricted." },
    { flowchartId: flowchart3_7.id, nodeId: "n3", title: "Unrestricted Stock", description: "Free, available stock ready for use. This is the number planners and sales should rely on for availability.", tCode: "MMBE / MB52", tips: "A passed QM inspection moves stock here via a transfer posting." },
    { flowchartId: flowchart3_7.id, nodeId: "n4", title: "Blocked Stock", description: "Damaged or on-hold stock that cannot be used until a decision is made (e.g. return to vendor or scrap).", tCode: "MMBE", tips: "Investigate blocked stock promptly — it ties up value while sitting unusable." },
    { flowchartId: flowchart3_7.id, nodeId: "n5", title: "Goods Issue", description: "Unrestricted stock leaves inventory when consumed — issued to production, a cost center, or a customer delivery.", tCode: "MIGO (201/261) / VL02N", tips: "A goods issue reduces stock and posts a corresponding accounting entry." },
  ],
});
// Quiz for lesson 3.7
await prisma.quiz.upsert({
  where: { lessonId: lesson3_7.id },
  update: {},
  create: {
    lessonId: lesson3_7.id,
    title: "Stock Types & Inventory — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A material shows 5,000 units total, but 800 are in quality inspection and 200 are blocked. How many are actually available to use?",
          explanation: "Only unrestricted stock is truly available. 5,000 − 800 (inspection) − 200 (blocked) = 4,000 unrestricted units available for production or sales.",
          options: {
            create: [
              { text: "4,000 (only the unrestricted stock)", isCorrect: true },
              { text: "5,000 (the full total)", isCorrect: false },
              { text: "800 (only the inspection stock)", isCorrect: false },
              { text: "200 (only the blocked stock)", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "After QM passes the 800 units in quality inspection, how do they become available?",
          explanation: "A transfer posting changes the stock status from quality inspection to unrestricted without the goods leaving the company. Availability then rises by 800 units.",
          options: {
            create: [
              { text: "A transfer posting moves them from inspection to unrestricted", isCorrect: true },
              { text: "They are deleted from inventory", isCorrect: false },
              { text: "They are automatically sold", isCorrect: false },
              { text: "They stay locked forever", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Which transaction gives a complete stock overview across locations and stock types?",
          explanation: "MMBE (Stock Overview) shows a material's stock across plants and storage locations, broken down by stock type (unrestricted, inspection, blocked) — the go-to screen for checking real availability.",
          options: {
            create: [
              { text: "MMBE", isCorrect: true },
              { text: "VA01", isCorrect: false },
              { text: "F110", isCorrect: false },
              { text: "FS00", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SD: NEW LESSONS ────────────────────────────────────────────────────────
// LESSON 4.3: Customer Master Data
const lesson4_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "customer-master-data" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Customer Master Data",
    slug: "customer-master-data",
    order: 3,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `A big retailer signs up to buy from Ananya's company. Before she can create a single sales order, someone says, "Set up the customer master — sales and finance both need it." Ananya wonders why a customer's details need sales data AND finance data, and what "sold-to" versus "ship-to" really means.

The customer master is where a buyer's identity, sales terms, and payment details live — and getting it right makes every future order smooth.`,
    content: `## What Is the Customer Master?

The **Customer Master** (the customer side of the **Business Partner** in S/4HANA) is the central record for everyone the company sells to. Sales orders, deliveries, and billing all read from it. It's the SD mirror of the vendor master.

## Three Data Areas (Shared by Two Teams)

Like the vendor master, it's split into segments:

| Segment | Owner | Contains |
|---------|-------|----------|
| **General Data** | Shared | Name, address, contact, tax IDs (client level) |
| **Company Code Data** | Finance (FI) | Payment terms, reconciliation account, dunning |
| **Sales Area Data** | Sales (SD) | Pricing, shipping, billing, partner functions |

Sales cares *how we sell and ship*; finance cares *how we get paid*; both share the customer's identity.

## Partner Functions — One Customer, Many Roles

A single customer can play different roles, called **partner functions**:

| Partner Function | Meaning |
|------------------|---------|
| **Sold-to Party** | Who places the order |
| **Ship-to Party** | Where goods are delivered |
| **Bill-to Party** | Who receives the invoice |
| **Payer** | Who actually pays |

Often all four are the same company. But a large retailer might order centrally (sold-to), ship to many stores (ship-to), and pay from head office (payer). SAP handles all this from one master.

## Sales Area Data Is Key

The **Sales Area** (Sales Org + Distribution Channel + Division) is where SD-specific data lives — pricing procedure, delivering plant, shipping conditions, and the partner functions. A customer must be extended to the relevant sales area before you can sell to them there.

## Key Customer Master T-Codes

| T-Code | Purpose |
|--------|---------|
| BP | Create/maintain Business Partner (S/4HANA) |
| XD01 / XD02 / XD03 | Create / Change / Display (central) |
| VD01 | Create (sales view) |
| FD01 | Create (finance view) |

## A Real Example

The new retailer:
- **General**: name, address, GST number.
- **Sales Area** (Sales Org 1000): pricing procedure, delivering plant, shipping conditions, partner functions.
- **Company Code 1000**: payment terms (net 30), reconciliation account.

Now sales can take orders and finance can manage receivables — all from one record.

## Why It Matters

Incomplete customer master data blocks sales: no sales-area data means no order; wrong payment terms means wrong due dates and dunning. A clean customer master is the foundation of the entire order-to-cash process.`,
    keyConceptTitle: "The Customer Master Combines Identity, Sales, and Payment Data",
    keyConceptBody: `- The **Customer Master** (Business Partner in S/4HANA) is the central record for buyers, used across order-to-cash.
- It has three segments: **General** (identity), **Sales Area** (pricing, shipping, partner functions), and **Company Code** (payment terms, reconciliation account).
- **Partner functions** (sold-to, ship-to, bill-to, payer) let one customer play several roles; maintain it via BP (or XD01/02/03).`,
  },
});
// Flowchart for lesson 4.3
const flowchart4_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_3.id },
  update: {},
  create: {
    lessonId: lesson4_3.id,
    title: "Structure of the Customer Master",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "👤 Customer / Business Partner" }, style: { background: "#1E293B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 60, y: 160 }, data: { label: "🪪 General Data (Identity)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 300, y: 160 }, data: { label: "🛒 Sales Area Data (SD)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 540, y: 160 }, data: { label: "💰 Company Code Data (FI)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 300, y: 290 }, data: { label: "🎭 Partner Functions (Sold-to, Ship-to...)" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 540, y: 290 }, data: { label: "✅ Ready to Sell & Bill" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n1", target: "n3", type: "default" },
      { id: "e3", source: "n1", target: "n4", type: "default" },
      { id: "e4", source: "n3", target: "n5", type: "default" },
      { id: "e5", source: "n4", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_3.id, nodeId: "n1", title: "Customer / Business Partner", description: "The central record for a buyer. In S/4HANA, customers are managed via the Business Partner, unifying older separate masters.", tCode: "BP / XD03", tips: "In S/4HANA always use BP; legacy XD/VD/FD transactions are redirected to it." },
    { flowchartId: flowchart4_3.id, nodeId: "n2", title: "General Data", description: "Client-level identity shared everywhere: name, address, contacts, tax numbers.", tCode: "BP (General)", tips: "Because it's global, one address change updates the customer everywhere." },
    { flowchartId: flowchart4_3.id, nodeId: "n3", title: "Sales Area Data", description: "SD-specific data per sales area: pricing procedure, delivering plant, shipping conditions, and partner functions.", tCode: "VD01 / BP (Sales)", tips: "No sales-area data means no sales order — extend the customer to the right sales area first." },
    { flowchartId: flowchart4_3.id, nodeId: "n4", title: "Company Code Data", description: "FI-owned data: payment terms, reconciliation account, and dunning settings, specific to each legal entity.", tCode: "FD01 / BP (Company Code)", tips: "This links the customer's receivables to the right G/L reconciliation account." },
    { flowchartId: flowchart4_3.id, nodeId: "n5", title: "Partner Functions", description: "Roles a customer plays: sold-to (orders), ship-to (delivery), bill-to (invoice), payer (pays). They can differ for large customers.", tCode: "BP (Partner Functions)", tips: "Set up multiple ship-to parties when one customer delivers to many sites." },
    { flowchartId: flowchart4_3.id, nodeId: "n6", title: "Ready to Sell & Bill", description: "With all segments complete, sales can take orders and finance can manage receivables seamlessly.", tCode: "VA01 / VF01", tips: "A complete customer master is the foundation of smooth order-to-cash." },
  ],
});
// Quiz for lesson 4.3
await prisma.quiz.upsert({
  where: { lessonId: lesson4_3.id },
  update: {},
  create: {
    lessonId: lesson4_3.id,
    title: "Customer Master Data — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A retailer orders centrally but receives goods at 50 different stores. Which partner function represents each store?",
          explanation: "The Ship-to Party identifies where goods are delivered. One sold-to customer (ordering centrally) can have many ship-to parties (the individual stores), all handled from one customer master.",
          options: {
            create: [
              { text: "Ship-to Party", isCorrect: true },
              { text: "Sold-to Party", isCorrect: false },
              { text: "Payer", isCorrect: false },
              { text: "Bill-to Party", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which customer master segment holds the pricing procedure and shipping conditions?",
          explanation: "Sales Area data (Sales Org + Distribution Channel + Division) holds SD-specific settings like pricing, delivering plant, and shipping conditions. Company code data holds finance terms; general data holds identity.",
          options: {
            create: [
              { text: "The Sales Area segment", isCorrect: true },
              { text: "The General Data segment", isCorrect: false },
              { text: "The Company Code segment", isCorrect: false },
              { text: "The material master", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "You try to create a sales order for a customer in a new sales area but SAP blocks it. What's the likely cause?",
          explanation: "The customer hasn't been extended with Sales Area data for that sales area. Just like materials, customers must exist at the relevant org level before transactions there are allowed.",
          options: {
            create: [
              { text: "The customer has no Sales Area data for that sales area", isCorrect: true },
              { text: "Sales orders are not allowed in SAP", isCorrect: false },
              { text: "The vendor master is missing", isCorrect: false },
              { text: "The customer number is too long", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.4: Pricing Procedure Basics
const lesson4_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "pricing-procedure-basics" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Pricing Procedure Basics",
    slug: "pricing-procedure-basics",
    order: 4,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `When Manoj creates a sales order, the net price just appears — base price, a discount, freight, and tax all calculated automatically. He didn't type any of it. He wonders: how does SAP know the price, the discount, and the tax, and in what order does it add them up?

The answer is the pricing procedure — SAP's recipe for building up a price step by step, automatically and consistently.`,
    content: `## How SAP Calculates a Price

When you enter a sales order, SAP doesn't make you type the price. Instead it runs a **pricing procedure** — an ordered recipe of **condition types** that builds the final price: start with a base, add or subtract discounts, surcharges, freight, and taxes.

Think of it like a **restaurant bill**: item price, minus a coupon, plus a service charge, plus tax = total. The pricing procedure is that calculation, defined once and applied to every order.

## Condition Types — The Building Blocks

Each line in the calculation is a **condition type**:

| Condition Type | Role | Example |
|----------------|------|---------|
| **PR00** | Base price | ₹100/unit |
| **K004 / K007** | Discount | −10% |
| **KF00** | Freight surcharge | +₹50 |
| **MWST** | Tax | +18% |

Each condition can be a fixed amount, a percentage, or scale-based (e.g. cheaper per unit at higher quantity).

## Condition Records — Where Prices Are Stored

The actual values live in **condition records**, maintained with **VK11**. For example, "Material X = ₹100" or "Customer Y gets 10% off." When an order is created, SAP looks up the relevant condition records and applies them.

## The Access Sequence — Finding the Right Price

How does SAP pick *which* price? Through an **access sequence** — a search order from most specific to most general. For instance: "Is there a price for this customer + material? No? Then just this material? Use that." This lets you have special prices for key customers while everyone else gets the standard.

## The Pricing Procedure Determines the Order

The **pricing procedure** controls the sequence and logic: which condition types apply, in what order, which are mandatory, and how subtotals build up. It's determined automatically from the sales area, customer, and document type.

## Key Pricing T-Codes

| T-Code | Purpose |
|--------|---------|
| VK11 | Create condition records (prices/discounts) |
| VK12 / VK13 | Change / Display condition records |
| V/08 | Define pricing procedure (config) |

## A Real Example

Manoj's order for 10 units:
- **PR00** base: ₹100 × 10 = ₹1,000
- **K007** customer discount −10% = −₹100
- **KF00** freight +₹50
- **MWST** tax 18% on ₹950 = +₹171
- **Net = ₹1,121**, all calculated automatically.

## Why It Matters

Pricing procedures make pricing consistent, automatic, and auditable. Sales reps can't accidentally misprice; special deals are controlled through condition records; and every figure on the order can be traced to a condition. It's one of the most important — and most asked-about — areas of SD.`,
    keyConceptTitle: "Pricing Procedure = An Ordered Recipe of Condition Types",
    keyConceptBody: `- The **pricing procedure** builds an order's net price step by step from **condition types** (base price PR00, discounts, freight, tax MWST).
- Actual prices live in **condition records** (maintained in VK11); an **access sequence** finds the most specific applicable price.
- The procedure (auto-determined from sales area, customer, document type) controls the order, mandatory steps, and subtotals — making pricing automatic and consistent.`,
  },
});
// Flowchart for lesson 4.4
const flowchart4_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_4.id },
  update: {},
  create: {
    lessonId: lesson4_4.id,
    title: "How a Price Is Built",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 20 }, data: { label: "💲 Base Price (PR00)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 120 }, data: { label: "➖ Apply Discount (K007)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 220 }, data: { label: "➕ Add Freight (KF00)" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 320 }, data: { label: "🧾 Add Tax (MWST)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 250, y: 420 }, data: { label: "✅ Net Price on Order" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 560, y: 120 }, data: { label: "🔎 Access Sequence Finds Price" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
      { id: "e5", source: "n6", target: "n1", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_4.id, nodeId: "n1", title: "Base Price (PR00)", description: "The starting gross price per unit, taken from a condition record for the material (and possibly customer).", tCode: "VK11 (PR00)", tips: "PR00 is the most common base price condition — almost every procedure starts here." },
    { flowchartId: flowchart4_4.id, nodeId: "n2", title: "Apply Discount", description: "Discount conditions (e.g. K007 customer discount, K004 material discount) reduce the price, as a percentage or amount.", tCode: "VK11 (K004/K007)", tips: "Customer-specific discounts reward key accounts without changing the base price for everyone." },
    { flowchartId: flowchart4_4.id, nodeId: "n3", title: "Add Freight", description: "Surcharge conditions like freight (KF00) add cost on top of the net value before tax.", tCode: "VK11 (KF00)", tips: "Freight can be fixed or scale-based depending on order size or weight." },
    { flowchartId: flowchart4_4.id, nodeId: "n4", title: "Add Tax (MWST)", description: "Tax conditions calculate VAT/GST on the taxable subtotal, based on the customer and material tax classification.", tCode: "VK11 (MWST)", tips: "Tax is usually the last step, applied to the net amount after discounts and surcharges." },
    { flowchartId: flowchart4_4.id, nodeId: "n5", title: "Net Price", description: "The pricing procedure totals all conditions into the final net price shown on the order — calculated automatically.", tCode: "VA01 (Conditions tab)", tips: "Click the order's pricing/conditions tab to see every step that built the price." },
    { flowchartId: flowchart4_4.id, nodeId: "n6", title: "Access Sequence", description: "For each condition, the access sequence searches from specific to general (customer+material, then material) to find the right record.", tCode: "V/07 (config)", tips: "Access sequences are why a VIP customer can get a special price while others get standard." },
  ],
});
// Quiz for lesson 4.4
await prisma.quiz.upsert({
  where: { lessonId: lesson4_4.id },
  update: {},
  create: {
    lessonId: lesson4_4.id,
    title: "Pricing Procedure Basics — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is a pricing procedure in SAP SD?",
          explanation: "A pricing procedure is an ordered recipe of condition types (base price, discounts, surcharges, tax) that automatically builds up the net price of a sales order, applied consistently to every order.",
          options: {
            create: [
              { text: "An ordered set of condition types that builds the net price", isCorrect: true },
              { text: "A list of all customers who get discounts", isCorrect: false },
              { text: "The delivery schedule for an order", isCorrect: false },
              { text: "A type of vendor invoice", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A VIP customer should pay ₹90 while everyone else pays ₹100 for the same material. How does SAP pick the right price?",
          explanation: "The access sequence searches from most specific to most general. It first looks for a customer+material price (₹90 for the VIP); if none exists, it falls back to the material-only price (₹100). This enables special deals without changing the standard price.",
          options: {
            create: [
              { text: "The access sequence checks customer+material first, then falls back to material-only", isCorrect: true },
              { text: "SAP always charges the highest price", isCorrect: false },
              { text: "The sales rep types the price manually each time", isCorrect: false },
              { text: "It averages all customers' prices", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Where are the actual prices and discount values stored?",
          explanation: "Condition records (maintained with VK11) hold the actual values — e.g. 'Material X = ₹100' or 'Customer Y = 10% off'. The pricing procedure defines the structure; condition records supply the numbers.",
          options: {
            create: [
              { text: "In condition records (maintained with VK11)", isCorrect: true },
              { text: "In the material's base unit of measure", isCorrect: false },
              { text: "In the dunning program", isCorrect: false },
              { text: "Only in a spreadsheet outside SAP", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.5: The Delivery Process (VL01N)
const lesson4_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "delivery-process" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "The Delivery Process (VL01N)",
    slug: "delivery-process",
    order: 5,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `An order for 200 chairs is confirmed, and now the warehouse has to actually send them. Riya hears, "Create the outbound delivery, pick the stock, then post goods issue." She wonders: isn't the order enough? Why a separate delivery document, and what does "post goods issue" actually do to stock and finance?

The delivery process is where a promise on an order becomes goods physically leaving the building.`,
    content: `## From Order to Shipment

A sales order is a *promise* to deliver. The **delivery process** turns that promise into a physical shipment. The central document is the **outbound delivery**, created with **VL01N**.

## The Three Stages of Delivery

### 1. Create the Outbound Delivery (VL01N)
Created with reference to the sales order, the delivery document collects what's being shipped, when, and from which plant. Only items that are due and available are included.

### 2. Picking
**Picking** means physically gathering the goods from the warehouse. In a WM-managed warehouse, a transfer order directs workers to the right bins. The picked quantity is confirmed on the delivery.

### 3. Post Goods Issue (PGI)
This is the critical moment. **Posting Goods Issue** confirms the goods have left the company. It does two things at once:
- **Reduces stock** — inventory drops by the shipped quantity.
- **Posts to accounting** — Debit Cost of Goods Sold / Credit Inventory.

After PGI, ownership has effectively transferred to the customer, and the delivery is ready to be billed.

## Why a Separate Delivery Document?

The order and delivery are separate because:
- One order might ship in **several deliveries** (partial shipments).
- Several orders might combine into **one delivery** (efficient shipping).
- The warehouse works from deliveries, not orders.

This flexibility is why SD splits "what was promised" (order) from "what was shipped" (delivery).

## Key Delivery T-Codes

| T-Code | Purpose |
|--------|---------|
| VL01N | Create outbound delivery |
| VL02N | Change delivery (pick, PGI) |
| VL03N | Display delivery |
| VL06O | Outbound delivery monitor (worklist) |
| VL09 | Reverse goods issue |

## The Document Flow Continues

Delivery sits in the middle of order-to-cash: **Sales Order → Delivery → Goods Issue → Billing**. From the delivery you can trace back to the order and forward to the invoice.

## A Real Example

The 200 chairs:
- **VL01N** creates the delivery referencing the order.
- The warehouse picks 200 chairs (confirmed on the delivery).
- **Post Goods Issue**: stock drops by 200, and SAP posts Debit COGS / Credit Inventory.
- The delivery is now ready for billing (VF01).

## Why It Matters

Goods issue is the accounting moment a sale becomes real in inventory — stock leaves the books and cost of goods sold is recognized. Getting the delivery process right keeps inventory accurate and ensures customers receive exactly what they ordered, when promised.`,
    keyConceptTitle: "Delivery = Create (VL01N) → Pick → Post Goods Issue",
    keyConceptBody: `- The **outbound delivery (VL01N)**, created from the sales order, drives the physical shipment.
- The stages are **create → pick → Post Goods Issue (PGI)**; PGI reduces stock and posts Debit COGS / Credit Inventory.
- Order and delivery are separate so one order can split into several deliveries (or several orders combine), and the delivery feeds billing next.`,
  },
});
// Flowchart for lesson 4.5
const flowchart4_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_5.id },
  update: {},
  create: {
    lessonId: lesson4_5.id,
    title: "Outbound Delivery Process",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "🛒 Sales Order Confirmed" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 140 }, data: { label: "🚚 Create Delivery (VL01N)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 250 }, data: { label: "📦 Pick Goods from Warehouse" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 250, y: 360 }, data: { label: "📤 Post Goods Issue (Stock ↓)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 560, y: 360 }, data: { label: "💰 Dr COGS / Cr Inventory" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 250, y: 470 }, data: { label: "🧾 Ready for Billing (VF01)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n3", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
      { id: "e5", source: "n4", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_5.id, nodeId: "n1", title: "Sales Order Confirmed", description: "The order promises goods to the customer. Items become due for delivery based on their requested dates and availability.", tCode: "VA01 / VA03", tips: "The availability check on the order determines when items can be delivered." },
    { flowchartId: flowchart4_5.id, nodeId: "n2", title: "Create Delivery (VL01N)", description: "The outbound delivery is created with reference to the order, collecting items that are due and available from a shipping point.", tCode: "VL01N", tips: "Use the delivery due list (VL10) to create deliveries in bulk for many orders." },
    { flowchartId: flowchart4_5.id, nodeId: "n3", title: "Pick Goods", description: "Warehouse staff physically gather the goods. In WM, a transfer order guides picking from specific bins; picked quantity is confirmed.", tCode: "VL02N / LT03", tips: "Picking must be complete before goods issue can be posted." },
    { flowchartId: flowchart4_5.id, nodeId: "n4", title: "Post Goods Issue", description: "PGI confirms goods have left the company: inventory is reduced by the shipped quantity and ownership passes to the customer.", tCode: "VL02N (PGI)", tips: "If you ship the wrong quantity, reverse the goods issue (VL09) before correcting." },
    { flowchartId: flowchart4_5.id, nodeId: "n5", title: "Accounting Entry", description: "PGI posts Debit Cost of Goods Sold / Credit Inventory automatically — the moment the sale hits the P&L as a cost.", tCode: "N/A", tips: "This is the accounting proof that goods physically left, distinct from the later revenue at billing." },
    { flowchartId: flowchart4_5.id, nodeId: "n6", title: "Ready for Billing", description: "Once goods issue is posted, the delivery is due for billing, where the customer invoice and revenue are created.", tCode: "VF01", tips: "Billing typically references the delivery, so accurate delivery quantities drive correct invoices." },
  ],
});
// Quiz for lesson 4.5
await prisma.quiz.upsert({
  where: { lessonId: lesson4_5.id },
  update: {},
  create: {
    lessonId: lesson4_5.id,
    title: "The Delivery Process — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What happens when you Post Goods Issue (PGI) on a delivery?",
          explanation: "PGI confirms goods have left the company: it reduces inventory by the shipped quantity and posts Debit Cost of Goods Sold / Credit Inventory. Ownership effectively transfers to the customer at this moment.",
          options: {
            create: [
              { text: "Stock is reduced and SAP posts Debit COGS / Credit Inventory", isCorrect: true },
              { text: "The customer is automatically paid", isCorrect: false },
              { text: "A purchase order is created", isCorrect: false },
              { text: "Nothing changes until the invoice is paid", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does SAP use a separate delivery document instead of shipping straight from the sales order?",
          explanation: "Separating them gives flexibility: one order can ship in several partial deliveries, or several orders can be combined into one delivery. The warehouse works from deliveries, not orders.",
          options: {
            create: [
              { text: "So one order can split into several deliveries, or several orders combine into one", isCorrect: true },
              { text: "Because sales orders cannot store any data", isCorrect: false },
              { text: "To avoid ever reducing stock", isCorrect: false },
              { text: "Deliveries are only used for returns", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "In the order-to-cash flow, what comes immediately AFTER posting goods issue?",
          explanation: "The flow is Sales Order → Delivery → Goods Issue → Billing. Once goods issue is posted, the delivery is due for billing (VF01), where the customer invoice and revenue are created.",
          options: {
            create: [
              { text: "Billing the customer (VF01)", isCorrect: true },
              { text: "Creating the sales order", isCorrect: false },
              { text: "Raising a purchase requisition", isCorrect: false },
              { text: "Running depreciation", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.6: Billing and Invoicing (VF01)
const lesson4_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "billing-invoicing" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Billing and Invoicing (VF01)",
    slug: "billing-invoicing",
    order: 6,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `The chairs have shipped, and now the company needs to get paid. Vivek is told, "Create the billing document in VF01 — it'll invoice the customer and post the revenue to finance." He's surprised: one transaction both sends the invoice AND updates the accounts? He wants to understand how billing ties sales to finance.

Billing is the step where a shipment turns into revenue and a receivable — the moment SD hands the baton to FICO.`,
    content: `## What Is Billing?

**Billing** creates the customer invoice and records the sale in finance. The document is the **billing document**, created with **VF01**. It's the final SD step in order-to-cash and the bridge to Accounts Receivable.

## What Happens When You Bill

Posting a billing document does two things at once:

1. **Creates the customer invoice** — the document sent to the customer showing what they owe.
2. **Posts to FI automatically** — **Debit Customer (receivable) / Credit Revenue**. (Tax is also posted.)

This is the moment **revenue is recognized** and the customer's receivable appears in AR.

## Billing References the Delivery (Usually)

Most billing is **delivery-related**: you bill what was actually shipped (goods issue posted). This keeps invoices honest — you charge for what left the warehouse. Some scenarios are **order-related** (e.g. services with no physical delivery), billing directly from the order.

## Billing Flexibility

Like deliveries, billing is flexible:
- **One invoice per delivery** (standard).
- **Collective billing** — combine several deliveries into one invoice for a customer.
- **Split billing** — separate invoices when terms differ (e.g. different payers).

## The SD-FI Integration Point

Billing is where SD meets FICO. The revenue posting hits the G/L, the receivable lands in the customer's AR sub-ledger, and tax goes to the tax accounts — all from one billing document. From there, Accounts Receivable takes over (payment via F-28, dunning via F150).

## Key Billing T-Codes

| T-Code | Purpose |
|--------|---------|
| VF01 | Create billing document |
| VF02 | Change billing document |
| VF03 | Display billing document |
| VF04 | Billing due list (worklist) |
| VF11 | Cancel billing document |

## A Real Example

The 200 chairs delivery:
- **VF01** creates the invoice referencing the delivery.
- SAP posts: Debit Customer ₹2,00,000 / Credit Revenue (and tax).
- The invoice is sent to the customer; the receivable now sits in AR.
- When the customer pays, finance clears it with F-28.

## Why It Matters

Billing is how a company actually earns money in the books. Accurate, timely billing means revenue is recognized correctly, receivables are tracked, and cash collection can begin. It's also the cleanest example of SAP integration — one document updates sales and finance together.`,
    keyConceptTitle: "Billing (VF01) Creates the Invoice and Posts Revenue to FI",
    keyConceptBody: `- **Billing (VF01)** creates the customer invoice and automatically posts **Debit Customer / Credit Revenue** (plus tax) to FI.
- Most billing is **delivery-related** (you bill what shipped); it can be collective (combine deliveries) or split.
- Billing is the key **SD-FI integration** point: revenue and the AR receivable are created together, then AR handles payment (F-28).`,
  },
});
// Flowchart for lesson 4.6
const flowchart4_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_6.id },
  update: {},
  create: {
    lessonId: lesson4_6.id,
    title: "Billing and SD-FI Integration",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 30 }, data: { label: "📤 Goods Issue Posted" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 140 }, data: { label: "🧾 Create Billing (VF01)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 60, y: 260 }, data: { label: "📨 Customer Invoice Sent" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 460, y: 260 }, data: { label: "💰 Dr Customer / Cr Revenue (FI)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 460, y: 380 }, data: { label: "📂 Receivable in AR" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 460, y: 490 }, data: { label: "✅ Customer Pays (F-28)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n2", target: "n4", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
      { id: "e5", source: "n5", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_6.id, nodeId: "n1", title: "Goods Issue Posted", description: "Billing usually follows goods issue — you invoice what was actually shipped, keeping the invoice honest.", tCode: "VL02N", tips: "Delivery-related billing prevents charging for goods that never left the warehouse." },
    { flowchartId: flowchart4_6.id, nodeId: "n2", title: "Create Billing (VF01)", description: "The billing document is created (usually referencing the delivery), producing the invoice and triggering the FI posting.", tCode: "VF01 / VF04", tips: "Use the billing due list (VF04) to process many deliveries into invoices at once." },
    { flowchartId: flowchart4_6.id, nodeId: "n3", title: "Customer Invoice", description: "The invoice document is generated for the customer, showing items, prices, taxes, and the amount due.", tCode: "VF03", tips: "Output settings control whether the invoice prints, emails, or sends via EDI." },
    { flowchartId: flowchart4_6.id, nodeId: "n4", title: "FI Posting", description: "SAP automatically posts Debit Customer / Credit Revenue (plus tax) — this is the SD-to-FICO integration in action.", tCode: "N/A", tips: "Revenue is recognized here; the COGS was already posted at goods issue." },
    { flowchartId: flowchart4_6.id, nodeId: "n5", title: "Receivable in AR", description: "The customer now owes money — an open item appears in Accounts Receivable, ready to be collected.", tCode: "FBL5N", tips: "Track open receivables in FBL5N to manage collections and aging." },
    { flowchartId: flowchart4_6.id, nodeId: "n6", title: "Customer Pays", description: "When the customer pays, finance records the incoming payment (F-28) and clears the receivable, completing order-to-cash.", tCode: "F-28", tips: "Overdue receivables can be chased automatically with the dunning run (F150)." },
  ],
});
// Quiz for lesson 4.6
await prisma.quiz.upsert({
  where: { lessonId: lesson4_6.id },
  update: {},
  create: {
    lessonId: lesson4_6.id,
    title: "Billing and Invoicing — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "When you create a billing document in VF01, what FI posting happens automatically?",
          explanation: "Billing posts Debit Customer (creating the receivable) and Credit Revenue (recognizing the sale), plus tax. This is the SD-FI integration — one billing document updates both sales and finance.",
          options: {
            create: [
              { text: "Debit Customer / Credit Revenue", isCorrect: true },
              { text: "Debit Inventory / Credit GR/IR", isCorrect: false },
              { text: "Debit Vendor / Credit Bank", isCorrect: false },
              { text: "Debit Expense / Credit Cash", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Most billing is 'delivery-related'. Why is that a sensible default?",
          explanation: "Billing what was actually delivered (goods issue posted) ensures you only invoice goods that physically left the warehouse — keeping invoices accurate and matching what the customer received.",
          options: {
            create: [
              { text: "You invoice only what was actually shipped, keeping invoices accurate", isCorrect: true },
              { text: "Deliveries are cheaper to store than orders", isCorrect: false },
              { text: "It avoids ever posting revenue", isCorrect: false },
              { text: "Customers prefer not to receive invoices", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Billing is described as the key SD-FI integration point. What does that mean?",
          explanation: "From one billing document, SAP updates SD (the invoice) and FICO (revenue posting, AR receivable, tax) simultaneously. Sales and finance stay in sync without any duplicate entry.",
          options: {
            create: [
              { text: "One billing document updates both sales and finance at the same time", isCorrect: true },
              { text: "Billing only affects the warehouse", isCorrect: false },
              { text: "Finance must re-key the invoice manually", isCorrect: false },
              { text: "SD and FI never share data", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.7: Returns and Credit Memos
const lesson4_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "returns-credit-memos" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Returns and Credit Memos",
    slug: "returns-credit-memos",
    order: 7,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A customer calls Sana: "Twenty of the chairs arrived damaged — we're sending them back, and we were overcharged on freight too." Sana now has to take goods back into the warehouse AND refund some money. She wonders which documents handle a return of goods versus a pure money adjustment.

Returns and credit memos are how SAP runs order-to-cash in reverse — taking goods back and giving money back, cleanly and traceably.`,
    content: `## When Things Go Backward

Not every sale ends with a happy delivery. Goods come back damaged, customers are overcharged, or quantities are wrong. SAP handles these with **returns** (goods come back) and **credit memos** (money goes back). They're essentially order-to-cash run in reverse.

## Two Different Situations

| Situation | What's returned | Document type |
|-----------|-----------------|---------------|
| Goods physically come back | Products | **Returns Order (RE)** |
| Customer was overcharged (no goods back) | Money only | **Credit Memo Request (CR)** → Credit Memo |
| Customer was undercharged | Money owed | **Debit Memo Request (DR)** → Debit Memo |

## The Returns Process (Goods Coming Back)

1. **Returns Order (VA01, type RE)** — created, often referencing the original sales order or invoice.
2. **Returns Delivery (VL01N)** — the goods are received back into the warehouse (a reverse goods movement increases stock, often into a returns/blocked area).
3. **Credit Memo (VF01)** — the customer is credited for the returned goods: **Debit Revenue / Credit Customer** (the reverse of billing).

## The Credit Memo Process (Money Only)

When no goods move (e.g. an overcharge):
1. **Credit Memo Request (VA01, type CR)** — records the amount to refund and why. It often requires **approval (a billing block)** before processing.
2. **Credit Memo (VF01)** — posts the credit: Debit Revenue / Credit Customer, reducing what the customer owes.

## Billing Blocks and Approval

Credit and debit memo requests usually carry a **billing block** so they can't be credited until a manager reviews and releases them — a control that prevents unauthorized refunds.

## Key Returns/Credit T-Codes

| T-Code | Purpose |
|--------|---------|
| VA01 (RE) | Create returns order |
| VL01N | Returns delivery (goods back) |
| VA01 (CR) | Credit memo request |
| VA01 (DR) | Debit memo request |
| VF01 | Create credit/debit memo |
| V.23 | Release blocked billing documents |

## A Real Example

Sana's customer:
- **20 damaged chairs**: a returns order (RE) → returns delivery brings them back into stock → credit memo refunds their value.
- **Freight overcharge**: a credit memo request (CR), approved by a manager (billing block released) → credit memo refunds the freight only.

## Why It Matters

Returns and credit memos keep finances and inventory accurate when things go wrong. Goods coming back must increase stock again; refunds must reduce revenue and the customer's balance. The approval controls protect against fraud and errors — making the reverse process as disciplined as the forward one.`,
    keyConceptTitle: "Returns Bring Goods Back; Credit Memos Give Money Back",
    keyConceptBody: `- A **Returns Order (RE)** handles goods coming back: returns delivery increases stock, then a **credit memo** refunds their value.
- A **Credit Memo Request (CR)** handles money-only refunds (e.g. overcharges); a **Debit Memo Request (DR)** charges more when undercharged.
- Credit/debit memo requests usually carry a **billing block** requiring approval before processing — the credit memo posts Debit Revenue / Credit Customer (the reverse of billing).`,
  },
});
// Flowchart for lesson 4.7
const flowchart4_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_7.id },
  update: {},
  create: {
    lessonId: lesson4_7.id,
    title: "Returns and Credit Memo Flow",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 20 }, data: { label: "📞 Customer Reports a Problem" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 60, y: 140 }, data: { label: "↩️ Returns Order (RE)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 60, y: 250 }, data: { label: "📦 Returns Delivery (Stock ↑)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 460, y: 140 }, data: { label: "💸 Credit Memo Request (CR)" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 460, y: 250 }, data: { label: "🔒 Billing Block → Approval" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n6", type: "default", position: { x: 250, y: 380 }, data: { label: "🧾 Credit Memo (Dr Revenue / Cr Customer)" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n1", target: "n4", type: "default" },
      { id: "e3", source: "n2", target: "n3", type: "default" },
      { id: "e4", source: "n4", target: "n5", type: "default" },
      { id: "e5", source: "n3", target: "n6", type: "default" },
      { id: "e6", source: "n5", target: "n6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_7.id, nodeId: "n1", title: "Customer Reports a Problem", description: "A complaint arrives — damaged goods, wrong quantity, or an overcharge. The right reverse process depends on whether goods come back.", tCode: "N/A", tips: "Clarify first: are goods returning, or is this a money-only adjustment? That decides the document type." },
    { flowchartId: flowchart4_7.id, nodeId: "n2", title: "Returns Order (RE)", description: "Created when goods physically come back, often referencing the original order or invoice to copy items and prices.", tCode: "VA01 (order type RE)", tips: "Referencing the original invoice ensures the credit matches what the customer was charged." },
    { flowchartId: flowchart4_7.id, nodeId: "n3", title: "Returns Delivery", description: "The returned goods are received back into the warehouse via a returns delivery, increasing stock (often into a returns/blocked area for inspection).", tCode: "VL01N", tips: "Inspect returned goods before moving them to unrestricted — they may be damaged." },
    { flowchartId: flowchart4_7.id, nodeId: "n4", title: "Credit Memo Request (CR)", description: "Used for money-only refunds (e.g. an overcharge) where no goods return. It records the amount and reason to be credited.", tCode: "VA01 (order type CR)", tips: "A debit memo request (DR) is the opposite — used when the customer was undercharged." },
    { flowchartId: flowchart4_7.id, nodeId: "n5", title: "Billing Block / Approval", description: "Credit memo requests usually carry a billing block so a manager must approve before any money is credited — a control against unauthorized refunds.", tCode: "V.23", tips: "Never release a billing block without verifying the claim — it's a key financial control." },
    { flowchartId: flowchart4_7.id, nodeId: "n6", title: "Credit Memo", description: "The credit memo posts Debit Revenue / Credit Customer, reducing the customer's balance — the accounting reverse of a normal invoice.", tCode: "VF01", tips: "The credit memo reduces both recognized revenue and the customer's receivable." },
  ],
});
// Quiz for lesson 4.7
await prisma.quiz.upsert({
  where: { lessonId: lesson4_7.id },
  update: {},
  create: {
    lessonId: lesson4_7.id,
    title: "Returns and Credit Memos — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A customer was overcharged on freight but keeps all the goods. Which document handles this?",
          explanation: "Because no goods come back, this is a money-only adjustment handled by a Credit Memo Request (CR), which becomes a credit memo after approval. A returns order is only used when goods physically come back.",
          options: {
            create: [
              { text: "A Credit Memo Request (no goods return)", isCorrect: true },
              { text: "A Returns Order (goods must come back)", isCorrect: false },
              { text: "A purchase order", isCorrect: false },
              { text: "A goods receipt", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "When damaged goods are physically returned, what happens to inventory?",
          explanation: "A returns delivery receives the goods back into the warehouse, increasing stock (often into a returns or blocked area for inspection). It's the reverse of the goods issue that shipped them.",
          options: {
            create: [
              { text: "Stock increases as the goods come back into the warehouse", isCorrect: true },
              { text: "Stock is unaffected by returns", isCorrect: false },
              { text: "Stock decreases further", isCorrect: false },
              { text: "The material master is deleted", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why do credit memo requests usually carry a billing block?",
          explanation: "The billing block prevents the credit from being issued until a manager reviews and releases it. This control stops unauthorized or mistaken refunds — making the reverse process as disciplined as a normal sale.",
          options: {
            create: [
              { text: "So a manager must approve before any refund is issued", isCorrect: true },
              { text: "To permanently stop the customer from ordering", isCorrect: false },
              { text: "Because credit memos are illegal without it", isCorrect: false },
              { text: "To automatically increase the refund amount", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.8: SD-FI Integration
const lesson4_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-fi-integration" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "SD-FI Integration",
    slug: "sd-fi-integration",
    order: 8,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Tara, a finance analyst, notices that whenever the sales team bills a customer, the revenue and receivables appear in her accounts instantly — she never types them in. She wonders: how does the sales side know which revenue account to use, and how does it all land in finance so perfectly?

The secret is SD-FI integration, with a clever bit of automation called account determination working quietly behind the scenes.`,
    content: `## Sales and Finance Are Connected

A sale isn't just a logistics event — it has financial impact. **SD-FI integration** is how selling activities automatically post to Financial Accounting, so revenue, receivables, and costs appear without anyone re-keying them.

## The Two Key Financial Moments in a Sale

| SD Event | FI Posting | Meaning |
|----------|-----------|---------|
| **Goods Issue** (delivery) | Debit COGS / Credit Inventory | Cost of the sale recognized; stock leaves |
| **Billing** (invoice) | Debit Customer / Credit Revenue (+ tax) | Revenue recognized; receivable created |

So one sale touches finance twice: when goods leave (cost) and when the customer is billed (revenue). Notice that **cost and revenue are recorded at different moments** — a key accounting concept.

## Account Determination — The Magic

How does billing know *which* revenue G/L account to use? Through **automatic account determination** (configured via transaction **VKOA**). SAP looks at factors like:
- Sales organization,
- Customer account assignment group,
- Material account assignment group,

…and picks the correct G/L accounts for revenue, discounts, and taxes — automatically, every time. This is why finance never has to choose accounts manually for sales.

## The Customer Master Link

The customer master's company code segment provides the **reconciliation account**, so every customer's receivable rolls into the General Ledger automatically (the AR sub-ledger concept). Pricing conditions provide the amounts; account determination provides the accounts.

## The Full Order-to-Cash, Finance View

1. **Sales Order** — no FI posting yet (just a commitment).
2. **Goods Issue** — Debit COGS / Credit Inventory.
3. **Billing** — Debit Customer / Credit Revenue (+ tax).
4. **Payment (F-28)** — Debit Bank / Credit Customer (receivable cleared).

By the end, inventory, cost, revenue, receivable, and cash have all updated correctly — driven entirely by SD actions.

## Key Integration T-Codes

| T-Code | Purpose |
|--------|---------|
| VKOA | Configure revenue account determination |
| VF03 | Display billing document & its FI document |
| FBL5N | Customer (AR) line items |
| F-28 | Incoming customer payment |

## A Real Example

Selling ₹2,00,000 of chairs:
- Goods issue: Debit COGS ₹1,20,000 / Credit Inventory ₹1,20,000 (assuming that cost).
- Billing: Debit Customer ₹2,00,000 / Credit Revenue ₹2,00,000 (+ tax). Account determination picked the revenue account automatically.
- Payment: Debit Bank / Credit Customer — receivable cleared.

## Why It Matters

SD-FI integration is the backbone of trustworthy financials in a sales-driven company. It guarantees that every sale is reflected accurately in the books, that revenue and cost are recognized at the right moments, and that the right accounts are always used — without manual intervention or reconciliation headaches.`,
    keyConceptTitle: "SD Actions Post to FI Automatically via Account Determination",
    keyConceptBody: `- A sale hits finance twice: **goods issue** posts Debit COGS / Credit Inventory, and **billing** posts Debit Customer / Credit Revenue (+ tax).
- **Account determination (VKOA)** automatically selects the correct revenue, discount, and tax G/L accounts based on sales org, customer, and material groups.
- The customer master's **reconciliation account** rolls receivables into the G/L, completing order-to-cash through to payment (F-28) — no manual re-keying.`,
  },
});
// Flowchart for lesson 4.8
const flowchart4_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_8.id },
  update: {},
  create: {
    lessonId: lesson4_8.id,
    title: "SD-FI Integration in Order-to-Cash",
    nodes: [
      { id: "n1", type: "default", position: { x: 250, y: 20 }, data: { label: "🛒 Sales Order (No FI Yet)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n2", type: "default", position: { x: 250, y: 130 }, data: { label: "📤 Goods Issue → Dr COGS / Cr Inventory" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n3", type: "default", position: { x: 250, y: 240 }, data: { label: "🧾 Billing → Dr Customer / Cr Revenue" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n4", type: "default", position: { x: 560, y: 240 }, data: { label: "🎯 Account Determination (VKOA)" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      { id: "n5", type: "default", position: { x: 250, y: 350 }, data: { label: "💰 Payment → Dr Bank / Cr Customer (F-28)" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", type: "default" },
      { id: "e2", source: "n2", target: "n3", type: "default" },
      { id: "e3", source: "n4", target: "n3", type: "default" },
      { id: "e4", source: "n3", target: "n5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_8.id, nodeId: "n1", title: "Sales Order", description: "The order is a commitment to sell but creates no financial posting yet — finance is only affected once goods move or billing occurs.", tCode: "VA01", tips: "Don't expect FI documents from an order alone; the financial impact comes later." },
    { flowchartId: flowchart4_8.id, nodeId: "n2", title: "Goods Issue (Cost)", description: "When goods ship, SAP posts Debit Cost of Goods Sold / Credit Inventory — recognizing the cost of the sale and reducing stock.", tCode: "VL02N (PGI)", tips: "Cost is recognized at goods issue, which can be before the revenue at billing." },
    { flowchartId: flowchart4_8.id, nodeId: "n3", title: "Billing (Revenue)", description: "Billing posts Debit Customer / Credit Revenue (+ tax), recognizing revenue and creating the receivable in AR.", tCode: "VF01", tips: "This is the moment revenue hits the P&L and the customer balance grows." },
    { flowchartId: flowchart4_8.id, nodeId: "n4", title: "Account Determination", description: "Configured in VKOA, it automatically chooses the correct revenue, discount, and tax G/L accounts based on sales org, customer, and material groups.", tCode: "VKOA", tips: "If revenue posts to the wrong account, VKOA configuration is the first place to check." },
    { flowchartId: flowchart4_8.id, nodeId: "n5", title: "Payment", description: "When the customer pays, F-28 posts Debit Bank / Credit Customer, clearing the receivable and completing order-to-cash.", tCode: "F-28", tips: "After payment, the customer's open item in FBL5N becomes a cleared item." },
  ],
});
// Quiz for lesson 4.8
await prisma.quiz.upsert({
  where: { lessonId: lesson4_8.id },
  update: {},
  create: {
    lessonId: lesson4_8.id,
    title: "SD-FI Integration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In a sale, at which two moments does SAP post to Financial Accounting?",
          explanation: "Finance is hit twice: at goods issue (Debit COGS / Credit Inventory — the cost) and at billing (Debit Customer / Credit Revenue — the revenue). The sales order itself creates no FI posting.",
          options: {
            create: [
              { text: "At goods issue (cost) and at billing (revenue)", isCorrect: true },
              { text: "Only when the sales order is created", isCorrect: false },
              { text: "Only once, at the very end", isCorrect: false },
              { text: "Never — sales don't affect finance", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How does the billing process know which revenue G/L account to post to, without anyone choosing it manually?",
          explanation: "Automatic account determination (configured in VKOA) selects the correct G/L accounts based on factors like sales organization, customer account group, and material account group — so finance never picks accounts by hand for sales.",
          options: {
            create: [
              { text: "Automatic account determination (VKOA) selects the account", isCorrect: true },
              { text: "The sales rep types the G/L account into the order", isCorrect: false },
              { text: "It always uses account number 1", isCorrect: false },
              { text: "Finance manually re-enters every invoice", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is it significant that cost (at goods issue) and revenue (at billing) are recorded at DIFFERENT moments?",
          explanation: "Recognizing cost when goods leave and revenue when the customer is billed reflects the real timing of each event. It's a core accounting principle that keeps the P&L accurate — and SD-FI integration handles both automatically.",
          options: {
            create: [
              { text: "It accurately reflects when cost is incurred versus when revenue is earned", isCorrect: true },
              { text: "It is a system error that should be fixed", isCorrect: false },
              { text: "It means the sale is recorded twice by mistake", isCorrect: false },
              { text: "It has no accounting significance", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── END OF SESSION 1 ───────────────────────────────────────────────────────

