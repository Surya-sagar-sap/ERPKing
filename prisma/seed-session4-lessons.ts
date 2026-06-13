// ─── FIORI: NEW LESSONS ───────────────────────────────────────────────────────
// LESSON 12.3: Fiori App Types
const lesson12_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-app-types" } },
  update: {},
  create: {
    moduleId: fioriModule.id,
    title: "Fiori App Types",
    slug: "fiori-app-types",
    order: 3,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Ananya, a new SAP consultant, opens her company's Fiori Launchpad and sees dozens of colorful tiles. Some let her create a purchase order, some show a dashboard with charts, and one shows everything about a single customer. Her manager says, "Those are different app types — know which is which." Ananya wonders why SAP made several kinds and how to tell them apart.

Understanding Fiori app types is the map that makes the whole Launchpad make sense.`,
    content: `## Why Different App Types?

SAP Fiori apps aren't all the same — they're built for different jobs. Knowing the type tells you instantly what an app is *for*: doing work, analyzing numbers, or looking up details. There are three classic types.

## The Three Classic Fiori App Types

| App Type | Purpose | Everyday analogy |
|----------|---------|------------------|
| **Transactional** | Do a task / change data | Filling in a form |
| **Analytical** | See KPIs, trends, charts | A car's dashboard |
| **Factsheet** | View all details of one object | A contact card |

### 1. Transactional Apps
These let you **perform business tasks** — create a sales order, approve a leave request, change a material. They read and write data. Example: "Create Purchase Order." If an app has buttons like Save, Submit, or Edit, it's transactional.

### 2. Analytical Apps
These show **insights** — real-time KPIs, charts, and trends, often powered by HANA and CDS views. They help you *understand*, not edit. Example: "Overdue Receivables" with a live chart. Numbers you can drill into, not forms you fill.

### 3. Factsheet Apps
These give a **360° view of a single object** — one customer, one material, one order — and let you navigate to related objects. Example: a Customer factsheet showing addresses, recent orders, and open invoices, with links to each.

## How They Work Together

The three types complement each other. A manager might:
1. Open an **Analytical** app and spot rising overdue invoices.
2. Drill into a **Factsheet** for the worst customer.
3. Launch a **Transactional** app to put their account on credit hold.

This "insight to action" flow is a core Fiori idea.

## A Note on Modern Apps

Newer Fiori apps often blend types — an **Overview Page** shows many small cards (mini analytics) that link to actions, and **List Report / Object Page** apps combine browsing a list with editing details. But the three classic categories are still the mental model SAP teaches.

## A Real Example

Ananya's tiles, decoded:
- **"Manage Purchase Orders"** → Transactional (create/edit).
- **"Cash Flow Analysis"** → Analytical (charts/KPIs).
- **"Customer – 360° View"** → Factsheet (one customer, all details).

Now the Launchpad isn't a random wall of tiles — she can predict what each app does before clicking.

## Why It Matters

Recognizing app types helps users, consultants, and developers alike. Users know what to expect; consultants pick the right app for a task; developers choose the right template to build. It's the foundation for navigating and designing the Fiori experience.`,
    keyConceptTitle: "Three Fiori App Types: Transactional, Analytical, Factsheet",
    keyConceptBody: `- **Transactional** apps do work — create/change data (forms with Save/Submit).
- **Analytical** apps show KPIs, charts, and trends (insight, not editing), often via HANA/CDS.
- **Factsheet** apps give a 360° view of one object with links to related items. Together they enable an "insight → action" flow.`,
  },
});
// Flowchart for lesson 12.3
const flowchart12_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson12_3.id },
  update: {},
  create: {
    lessonId: lesson12_3.id,
    title: "Insight-to-Action Across App Types",
    nodes: [
      { id: "node1", type: "default", position: { x: 80, y: 120 }, data: { label: "📊 Analytical App (Spot Issue)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 320, y: 120 }, data: { label: "🪪 Factsheet (360° View)" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 560, y: 120 }, data: { label: "📝 Transactional (Take Action)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 320, y: 260 }, data: { label: "🔗 Navigation Links Connect Them" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node4", target: "node2", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart12_3.id, nodeId: "node1", title: "Analytical App", description: "Shows real-time KPIs and charts so a user can spot a problem or trend — like rising overdue invoices. Built for insight, not data entry.", tCode: "Fiori Launchpad", tips: "Analytical apps are often powered by CDS views on HANA for live numbers." },
    { flowchartId: flowchart12_3.id, nodeId: "node2", title: "Factsheet App", description: "Gives a 360° view of a single object (one customer, material, or order) and links to related objects for deeper exploration.", tCode: "Fiori Launchpad", tips: "Factsheets are read-focused; use them to investigate before acting." },
    { flowchartId: flowchart12_3.id, nodeId: "node3", title: "Transactional App", description: "Lets the user perform the actual business task — create, edit, approve. This is where data changes happen.", tCode: "Fiori Launchpad", tips: "If an app has Save/Submit/Edit buttons, it's transactional." },
    { flowchartId: flowchart12_3.id, nodeId: "node4", title: "Navigation Links", description: "Fiori's intent-based navigation connects the app types, so a user flows smoothly from insight to detail to action without hunting for transactions.", tCode: "N/A", tips: "Seamless cross-app navigation is a key reason Fiori feels more modern than SAP GUI." },
  ],
});
// Quiz for lesson 12.3
await prisma.quiz.upsert({
  where: { lessonId: lesson12_3.id },
  update: {},
  create: {
    lessonId: lesson12_3.id,
    title: "Fiori App Types — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "An app shows a live dashboard of KPIs and trend charts but does not let you change data. Which Fiori app type is it?",
          explanation: "Analytical apps present KPIs, charts, and trends for insight — they help you understand data rather than edit it. Transactional apps change data; factsheets show one object's details.",
          options: {
            create: [
              { text: "Analytical", isCorrect: true },
              { text: "Transactional", isCorrect: false },
              { text: "Factsheet", isCorrect: false },
              { text: "Launchpad", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which app type would you use to create and submit a new purchase order?",
          explanation: "Transactional apps are built for performing business tasks that read and write data — like creating, editing, or approving documents. A purchase order creation app is transactional.",
          options: {
            create: [
              { text: "Transactional", isCorrect: true },
              { text: "Analytical", isCorrect: false },
              { text: "Factsheet", isCorrect: false },
              { text: "Theme Designer", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A manager spots rising overdue invoices in a dashboard, opens a single customer's full profile, then places them on credit hold. How do the app types support this flow?",
          explanation: "This is the 'insight to action' flow: an Analytical app reveals the issue, a Factsheet gives the 360° view of the customer, and a Transactional app performs the action. The three types complement each other.",
          options: {
            create: [
              { text: "Analytical reveals it, Factsheet shows details, Transactional acts", isCorrect: true },
              { text: "All three are the same app doing one thing", isCorrect: false },
              { text: "Only the Transactional app is involved", isCorrect: false },
              { text: "Factsheets are used to edit and submit data", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 12.4: The Fiori Apps Library
const lesson12_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-apps-library" } },
  update: {},
  create: {
    moduleId: fioriModule.id,
    title: "The Fiori Apps Library",
    slug: "fiori-apps-library",
    order: 4,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `A business user tells Rahul, "I want a Fiori app to manage my sales orders — does one exist, and what does our system need to run it?" Rahul doesn't want to guess. There are thousands of standard Fiori apps, and each has specific technical requirements. Where does he look it up?

The SAP Fiori Apps Library is the official catalog that answers exactly these questions — what apps exist and what each one needs to run.`,
    content: `## The Problem: Thousands of Apps

SAP delivers **thousands** of standard Fiori apps across every module. Before configuring or building anything, you need to know: does a standard app already exist for this need, and what does my system require to run it? Guessing wastes time. The **Fiori Apps Library** is the answer.

## What Is the Fiori Apps Library?

The **SAP Fiori Apps Library** is the official online catalog of all standard Fiori apps. For each app it documents what it does, who it's for, and the exact technical prerequisites to make it work. It's a website (fioriappslibrary.hana.ondemand.com), not a transaction in your system.

## What You Find Per App

| Information | Why it matters |
|-------------|----------------|
| **App ID** | Unique identifier (e.g. F0842) to reference the app |
| **App type** | Transactional / Analytical / Factsheet |
| **Business role / line of business** | Who uses it (e.g. Accounts Payable) |
| **Required back-end components** | The software versions/Notes needed |
| **OData services** | The service(s) the app calls |
| **Front-end / UI technology** | SAPUI5, Fiori Elements, etc. |
| **Implementation info** | Catalogs, technical names, configuration steps |

## App ID — The Key Reference

Each app has a unique **App ID** (often like F**nnnn**). It's how consultants, documentation, and support refer to a specific app unambiguously. When someone says "activate F0842," they mean exactly one app in the library.

## The Implementation Tab

The most useful part for a consultant is the **Implementation Information**. It lists the technical pieces to activate the app: the OData service to enable, the business catalog, the back-end and front-end components, and any prerequisite SAP Notes. This is your checklist before configuration.

## How It Fits the Workflow

1. **Search** the library by app name, role, or line of business.
2. **Read** the app's purpose and confirm it fits the need.
3. **Check prerequisites** — does your system meet the required components?
4. **Use the implementation info** to activate and assign the app.

## A Real Example

Rahul's sales order request:
- He searches the **Fiori Apps Library** for "Manage Sales Orders."
- He finds the app, notes its **App ID**, confirms it's a transactional app for the Internal Sales Rep role.
- The **Implementation** tab lists the required OData service and back-end component versions.
- He verifies the system meets them, then proceeds to configure it — no guesswork.

## Why It Matters

The Fiori Apps Library prevents reinventing the wheel and avoids failed activations. It tells you what already exists and exactly what each app needs — the essential first stop before configuring or building any Fiori app.`,
    keyConceptTitle: "The Apps Library Is SAP's Official Catalog of Standard Fiori Apps",
    keyConceptBody: `- The **SAP Fiori Apps Library** is an online catalog listing every standard Fiori app, its purpose, type, and business role.
- Each app has a unique **App ID** (e.g. F0842) and an **Implementation Information** section listing required OData services, components, and SAP Notes.
- Always check the library first to confirm an app exists and that your system meets its prerequisites before configuring it.`,
  },
});
// Flowchart for lesson 12.4
const flowchart12_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson12_4.id },
  update: {},
  create: {
    lessonId: lesson12_4.id,
    title: "Finding an App in the Library",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🔍 Search by Name / Role" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 120 }, data: { label: "📖 Read Purpose & App ID" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 120 }, data: { label: "✅ Check Prerequisites" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 500, y: 260 }, data: { label: "🛠️ Use Implementation Info" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart12_4.id, nodeId: "node1", title: "Search by Name / Role", description: "Use the Fiori Apps Library website to search for an app by name, business role, or line of business to see what SAP already provides.", tCode: "Fiori Apps Library (web)", tips: "Filter by line of business (e.g. Finance) to quickly narrow thousands of apps." },
    { flowchartId: flowchart12_4.id, nodeId: "node2", title: "Read Purpose & App ID", description: "Confirm the app does what you need and note its unique App ID, the unambiguous way to reference it in docs and with support.", tCode: "N/A", tips: "Record the App ID — it's the precise identifier everyone uses to refer to the app." },
    { flowchartId: flowchart12_4.id, nodeId: "node3", title: "Check Prerequisites", description: "Verify your system meets the required back-end and front-end components, OData services, and any prerequisite SAP Notes.", tCode: "N/A", tips: "Mismatched component versions are the top cause of an app failing to launch." },
    { flowchartId: flowchart12_4.id, nodeId: "node4", title: "Use Implementation Info", description: "The Implementation Information section is your checklist: which OData service to activate, which business catalog to assign, and configuration steps.", tCode: "/IWFND/MAINT_SERVICE", tips: "Follow the library's implementation steps in order to avoid missing a dependency." },
  ],
});
// Quiz for lesson 12.4
await prisma.quiz.upsert({
  where: { lessonId: lesson12_4.id },
  update: {},
  create: {
    lessonId: lesson12_4.id,
    title: "The Fiori Apps Library — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the SAP Fiori Apps Library?",
          explanation: "It's the official online catalog of all standard Fiori apps, documenting each app's purpose, type, business role, and technical prerequisites. It's a website, not a transaction in your SAP system.",
          options: {
            create: [
              { text: "An online catalog of all standard Fiori apps and their requirements", isCorrect: true },
              { text: "A transaction that runs inside your SAP system", isCorrect: false },
              { text: "A programming language for Fiori", isCorrect: false },
              { text: "A type of database table", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is an App ID (e.g. F0842) used for?",
          explanation: "The App ID is a unique identifier for a specific Fiori app. It lets consultants, documentation, and support refer to exactly one app without ambiguity — essential when discussing or activating apps.",
          options: {
            create: [
              { text: "To uniquely identify and reference a specific Fiori app", isCorrect: true },
              { text: "To set the app's background color", isCorrect: false },
              { text: "To log into the SAP system", isCorrect: false },
              { text: "To calculate the app's price", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why should a consultant check the library's Implementation Information before configuring an app?",
          explanation: "The Implementation Information lists the exact prerequisites — required OData services, back-end/front-end components, business catalogs, and SAP Notes. Checking it first prevents failed activations caused by missing dependencies.",
          options: {
            create: [
              { text: "It lists the exact prerequisites, preventing failed activations", isCorrect: true },
              { text: "It shows the app's user reviews", isCorrect: false },
              { text: "It is required to log off SAP", isCorrect: false },
              { text: "It deletes apps that aren't needed", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 12.5: Configuring the Fiori Launchpad
const lesson12_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-launchpad-configuration" } },
  update: {},
  create: {
    moduleId: fioriModule.id,
    title: "Configuring the Fiori Launchpad",
    slug: "fiori-launchpad-configuration",
    order: 5,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Meena, a Fiori consultant, activated a great app — but when the sales team logs in, their Launchpad is empty. The app exists, yet nobody can see it. Her lead asks, "Did you put it in a catalog and assign it through a role?" Meena realizes that making an app *appear* for the right people is a separate job from activating it.

Launchpad configuration is how the right tiles reach the right users — through catalogs, groups, and roles.`,
    content: `## Activating an App Is Only Half the Job

Getting an app to *run* is one thing; getting it to *appear* for the right users is another. Fiori controls visibility through a layered model: **catalogs**, **groups**, **spaces/pages**, and **roles**. Get this right and each user sees exactly the tiles they need — the heart of Fiori's role-based design.

## The Building Blocks

| Element | What it does | Analogy |
|---------|--------------|---------|
| **Catalog** | A collection of apps a user is *allowed* to access | A menu of available dishes |
| **Group / Page** | Apps *arranged* on the home screen | The plate you actually serve |
| **Space / Page** | Modern grouping that organizes pages by role | A themed section of the menu |
| **Role (PFCG)** | Bundles catalogs + groups and assigns to users | The membership that unlocks it |

The key distinction: a **catalog** controls *what a user may launch* (authorization), while a **group/page** controls *what appears arranged on screen* (visibility/layout).

## How They Fit Together

1. Apps are placed into a **business catalog**.
2. Catalogs (and groups/pages) are assigned to a **PFCG role**.
3. The role is assigned to **users**.
4. At logon, users see the tiles their roles grant — neatly arranged.

This means two users can log into the *same* system and see completely different Launchpads, tailored to their jobs.

## Classic vs Spaces & Pages

- **Classic (groups):** apps shown as groups of tiles on a scrollable home page.
- **Spaces & Pages (modern):** the current SAP standard — a **space** (per role) contains **pages** that organize sections of tiles, giving a cleaner, structured home. SAP is steering customers toward Spaces and Pages.

## The Tools

| Tool | Purpose |
|------|---------|
| **Fiori Launchpad Designer** | Classic tool to build catalogs and groups |
| **Launchpad / Spaces & Pages manager** | Manage modern spaces and pages |
| **PFCG** | Create roles, attach catalogs/groups, assign to users |

## A Real Example

Meena's empty Launchpad fix:
- She adds the app to a **business catalog** (so the sales team is *authorized*).
- She adds it to a **group/page** (so it *appears* arranged).
- She attaches both to a **PFCG role** and assigns that role to the sales team.
- Now the team logs in and sees the app tile exactly where expected.

## Why It Matters

Launchpad configuration is what delivers Fiori's promise of a clean, role-based experience. Without it, apps exist but no one can find them. With it, every user gets a tailored home screen showing only the apps relevant to their role — the difference between a usable system and a frustrating one.`,
    keyConceptTitle: "Catalogs Authorize, Groups/Pages Display, Roles Deliver",
    keyConceptBody: `- A **catalog** controls what apps a user *may* launch (authorization); a **group/page** controls what *appears* arranged on the home screen.
- **Roles (PFCG)** bundle catalogs and groups/pages and assign them to users, so each user sees a tailored Launchpad.
- Modern SAP uses **Spaces & Pages** (replacing classic groups) for a cleaner, role-based home; build it with the Launchpad Designer/manager and PFCG.`,
  },
});
// Flowchart for lesson 12.5
const flowchart12_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson12_5.id },
  update: {},
  create: {
    lessonId: lesson12_5.id,
    title: "From App to User's Tile",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📦 Add App to Catalog (Authorize)" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "🗂️ Add to Group / Page (Display)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 540, y: 120 }, data: { label: "🎭 Attach to Role (PFCG)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 540, y: 260 }, data: { label: "👤 Assign Role to Users" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 320, y: 260 }, data: { label: "✅ User Sees the Tile" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart12_5.id, nodeId: "node1", title: "Add App to Catalog", description: "A business catalog is the set of apps a user is authorized to launch. Adding the app to a catalog grants the ability to use it.", tCode: "Fiori Launchpad Designer", tips: "Catalog = authorization. Without it, the app won't run even if it appears." },
    { flowchartId: flowchart12_5.id, nodeId: "node2", title: "Add to Group / Page", description: "Groups (classic) or pages (modern) arrange the app's tile on the home screen so users can actually see and click it.", tCode: "Launchpad Designer / Pages", tips: "Group/page = display. An app in a catalog but no group is authorized but hidden." },
    { flowchartId: flowchart12_5.id, nodeId: "node3", title: "Attach to Role (PFCG)", description: "A PFCG role bundles the catalog and group/page (or space). The role is the package that ties authorization and layout together.", tCode: "PFCG", tips: "Build roles per job function so each role grants a coherent set of apps." },
    { flowchartId: flowchart12_5.id, nodeId: "node4", title: "Assign Role to Users", description: "Assigning the role to users grants them the catalog and arranges the tiles. Different roles produce different Launchpads.", tCode: "PFCG / SU01", tips: "Run user comparison so the assignment takes effect for the user." },
    { flowchartId: flowchart12_5.id, nodeId: "node5", title: "User Sees the Tile", description: "At logon, the user's Launchpad shows exactly the tiles their roles grant, neatly arranged — Fiori's role-based experience delivered.", tCode: "Fiori Launchpad", tips: "If a tile is missing, check the catalog (authorization) and group/page (display) separately." },
  ],
});
// Quiz for lesson 12.5
await prisma.quiz.upsert({
  where: { lessonId: lesson12_5.id },
  update: {},
  create: {
    lessonId: lesson12_5.id,
    title: "Configuring the Fiori Launchpad — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the difference between a catalog and a group in the Fiori Launchpad?",
          explanation: "A catalog controls what a user is authorized to launch, while a group (or page) controls what actually appears arranged on the home screen. An app needs to be in both — authorized AND displayed.",
          options: {
            create: [
              { text: "A catalog authorizes apps; a group/page displays them on screen", isCorrect: true },
              { text: "They are identical and interchangeable", isCorrect: false },
              { text: "A catalog sets colors; a group sets fonts", isCorrect: false },
              { text: "A group authorizes; a catalog only displays", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "An app is activated and runs, but the sales team's Launchpad is empty. What is the most likely cause?",
          explanation: "Activation makes an app runnable, but visibility requires placing it in a catalog and group/page and assigning those via a PFCG role to the users. If that wasn't done, the app exists but no one sees it.",
          options: {
            create: [
              { text: "The app wasn't assigned to users via a catalog/group in a role", isCorrect: true },
              { text: "The app must be deleted and rebuilt", isCorrect: false },
              { text: "Fiori does not support sales apps", isCorrect: false },
              { text: "The users need new computers", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why can two users in the same system see completely different Launchpads?",
          explanation: "Fiori is role-based: each user's tiles come from the catalogs and groups/pages attached to their assigned roles. Different roles grant different apps, so each user gets a Launchpad tailored to their job.",
          options: {
            create: [
              { text: "Their assigned roles grant different catalogs and pages", isCorrect: true },
              { text: "The system randomly assigns tiles", isCorrect: false },
              { text: "Only administrators can see any tiles", isCorrect: false },
              { text: "Launchpads are identical for everyone", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 12.6: Fiori Elements vs Freestyle SAPUI5
const lesson12_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-elements-vs-freestyle" } },
  update: {},
  create: {
    moduleId: fioriModule.id,
    title: "Fiori Elements vs Freestyle",
    slug: "fiori-elements-vs-freestyle",
    order: 6,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A developer, Karthik, is asked to build two Fiori apps: a standard "list and edit" app for purchase orders, and a unique, highly custom app with a special layout for the shop floor. He starts hand-coding both from scratch — and his lead stops him: "Use Fiori Elements for the standard one; you'll save weeks." Karthik learns there are two very different ways to build Fiori apps.

Choosing between Fiori Elements and freestyle SAPUI5 is one of the most important decisions in Fiori development.`,
    content: `## Two Ways to Build a Fiori App

Not every Fiori app is hand-coded. SAP offers two approaches, and picking the right one saves enormous effort:

- **Fiori Elements** — template-driven apps generated from metadata. Little to no UI coding.
- **Freestyle SAPUI5** — fully hand-coded apps using the SAPUI5 framework for complete control.

## Fiori Elements — Templates Do the Work

**Fiori Elements** provides ready-made app **templates** (floorplans) that build the UI automatically from your data model and **annotations** (metadata that describes how fields should look and behave). You define *what* the app shows; the template handles *how* it's rendered.

Common floorplans:

| Floorplan | Use |
|-----------|-----|
| **List Report / Object Page** | Browse a list, drill into details, edit |
| **Overview Page** | Cards summarizing an area |
| **Analytical List Page** | Combine charts and a list |
| **Worklist** | A list of items to act on |

Because the UI comes from annotations (often on a CDS view), you write very little JavaScript. SAP also keeps the look consistent and up to date automatically.

## Freestyle SAPUI5 — Full Control

**Freestyle** means building the app yourself with SAPUI5 — custom XML views, controllers, and JavaScript logic. You control every pixel and behavior. This is the choice when the requirement doesn't fit a standard floorplan.

## Comparing the Two

| Aspect | Fiori Elements | Freestyle SAPUI5 |
|--------|----------------|------------------|
| Coding effort | Low (metadata/annotations) | High (full code) |
| Flexibility | Limited to floorplans | Unlimited |
| Consistency | Automatic, SAP-standard | Up to the developer |
| Maintenance | Easier (SAP updates templates) | More manual |
| Best for | Standard list/edit/analytical apps | Unique, complex UIs |

## The Guiding Principle

**Use Fiori Elements whenever a floorplan fits; go freestyle only when it truly doesn't.** Most business apps (browse, view, edit, approve) fit a floorplan — so Fiori Elements covers the majority, faster and more consistently. Reserve freestyle for genuinely special interfaces.

## A Real Example

Karthik's two apps:
- **Purchase order list/edit** → fits the **List Report / Object Page** floorplan perfectly. He builds it with **Fiori Elements** using annotations on a CDS view — done in days, not weeks, with a standard look.
- **Custom shop-floor app** → no floorplan fits its unique layout, so he builds it **freestyle** in SAPUI5 for full control.

## Why It Matters

Choosing the right build approach is a core Fiori skill. Fiori Elements delivers standard apps fast and keeps them consistent and low-maintenance; freestyle gives unlimited flexibility for the rare special case. Knowing when to use each saves time, ensures consistency, and reduces long-term maintenance.`,
    keyConceptTitle: "Fiori Elements for Standard Apps; Freestyle for Unique Ones",
    keyConceptBody: `- **Fiori Elements** generates apps from **templates (floorplans)** and **annotations** — minimal coding, automatic consistency, easy maintenance.
- **Freestyle SAPUI5** is fully hand-coded for complete control — used when no floorplan fits a unique requirement.
- The rule: use **Fiori Elements when a floorplan fits** (most apps), and go **freestyle only when it doesn't**.`,
  },
});
// Flowchart for lesson 12.6
const flowchart12_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson12_6.id },
  update: {},
  create: {
    lessonId: lesson12_6.id,
    title: "Choosing How to Build a Fiori App",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 40 }, data: { label: "🎯 New Fiori App Needed" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 160 }, data: { label: "❓ Does a Floorplan Fit?" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 100, y: 290 }, data: { label: "🧩 Yes → Fiori Elements" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 500, y: 290 }, data: { label: "🛠️ No → Freestyle SAPUI5" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 100, y: 410 }, data: { label: "🏷️ Annotations Drive UI" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart12_6.id, nodeId: "node1", title: "New Fiori App Needed", description: "A requirement for a new app arrives. Before coding, decide the build approach — it shapes effort, consistency, and maintenance.", tCode: "BAS (Business Application Studio)", tips: "The build decision is architectural; making it early avoids wasted hand-coding." },
    { flowchartId: flowchart12_6.id, nodeId: "node2", title: "Does a Floorplan Fit?", description: "Check whether the requirement matches a standard floorplan (List Report/Object Page, Overview Page, Analytical List Page, Worklist).", tCode: "N/A", tips: "Most browse/view/edit/approve apps fit a floorplan — so the answer is usually yes." },
    { flowchartId: flowchart12_6.id, nodeId: "node3", title: "Yes → Fiori Elements", description: "Use a Fiori Elements template. The UI is generated from the data model and annotations, so you write minimal JavaScript.", tCode: "BAS / Fiori Elements", tips: "Faster to build, consistent by default, and SAP maintains the template over time." },
    { flowchartId: flowchart12_6.id, nodeId: "node4", title: "No → Freestyle SAPUI5", description: "Hand-build the app with SAPUI5 (custom views, controllers, JS) for full control over a unique layout or behavior.", tCode: "BAS / SAPUI5", tips: "Reserve freestyle for genuinely special UIs — it's more code and more maintenance." },
    { flowchartId: flowchart12_6.id, nodeId: "node5", title: "Annotations Drive UI", description: "In Fiori Elements, annotations (often on a CDS view) describe how fields and sections appear, so the template renders the right UI.", tCode: "CDS annotations / local annotations", tips: "Learn annotations well — they're how you customize a Fiori Elements app without coding the UI." },
  ],
});
// Quiz for lesson 12.6
await prisma.quiz.upsert({
  where: { lessonId: lesson12_6.id },
  update: {},
  create: {
    lessonId: lesson12_6.id,
    title: "Fiori Elements vs Freestyle — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What primarily drives the UI in a Fiori Elements app?",
          explanation: "Fiori Elements generates the UI from templates (floorplans) plus annotations — metadata (often on a CDS view) that describes how fields and sections should appear. You write little to no UI JavaScript.",
          options: {
            create: [
              { text: "Templates (floorplans) plus annotations/metadata", isCorrect: true },
              { text: "Thousands of lines of hand-written JavaScript", isCorrect: false },
              { text: "The printer configuration", isCorrect: false },
              { text: "The user's password", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "When is freestyle SAPUI5 the right choice over Fiori Elements?",
          explanation: "Freestyle is for apps whose requirements don't fit any standard floorplan — unique layouts or special behavior needing full control. When a floorplan fits, Fiori Elements is faster and more consistent.",
          options: {
            create: [
              { text: "When the requirement doesn't fit any standard floorplan", isCorrect: true },
              { text: "For every app, always", isCorrect: false },
              { text: "Only for analytical dashboards", isCorrect: false },
              { text: "Never — freestyle is not allowed", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does SAP recommend using Fiori Elements whenever a floorplan fits?",
          explanation: "Fiori Elements apps are faster to build (little coding), automatically consistent with SAP's design, and easier to maintain since SAP updates the templates. This covers the majority of standard business apps efficiently.",
          options: {
            create: [
              { text: "Faster to build, consistent by default, and easier to maintain", isCorrect: true },
              { text: "It is the only technology that exists", isCorrect: false },
              { text: "Freestyle apps cannot connect to data", isCorrect: false },
              { text: "Floorplans make apps run without a backend", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 12.7: My Inbox & Approvals
const lesson12_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-my-inbox-approvals" } },
  update: {},
  create: {
    moduleId: fioriModule.id,
    title: "My Inbox & Approvals",
    slug: "fiori-my-inbox-approvals",
    order: 7,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `Sunita, a department manager, used to approve purchase orders by digging through SAP GUI transactions or chasing emails. Now her phone buzzes: a tile says "My Inbox (3)." She taps it, reads a purchase requisition, and approves it from the train. She wonders: how did that approval task get there, and what happens after she taps Approve?

My Inbox is where SAP workflow tasks land so managers can approve them anywhere, on any device.`,
    content: `## The Problem Approvals Solve

In any company, things need approval: purchase orders, leave requests, invoices, hiring. Traditionally that meant logging into SAP GUI, finding the right transaction, or relying on email. **Fiori My Inbox** brings all approval tasks into one simple, mobile-friendly place.

## What Is My Inbox?

**My Inbox** is a standard Fiori app that displays a user's **workflow tasks** — items waiting for their decision. From one inbox, a manager can approve or reject many kinds of requests, each shown with the details and action buttons they need.

Think of it like an **email inbox, but for decisions**: each item is a task you can act on, not just read.

## Where Tasks Come From: SAP Workflow

Behind My Inbox is **SAP Business Workflow** (or the modern workflow engine). A workflow is a defined sequence of steps that routes a request to the right person automatically.

The flow:
1. A user submits a request (e.g. a purchase requisition).
2. **Workflow** determines who must approve it (based on rules — amount, department, hierarchy).
3. A **work item** (task) is created and sent to that approver's **My Inbox**.
4. The approver acts; the workflow continues to the next step or completes.

## What an Approver Sees and Does

In My Inbox, each task shows:
- A **title and description** (what's being requested),
- The **details** (e.g. amount, requester, line items),
- **Action buttons** — Approve, Reject, often with a comment,
- Sometimes the ability to forward or request more info.

Acting on the task sends the decision back to the workflow, which moves the process forward.

## Why It's Powerful

| Benefit | Why it matters |
|---------|----------------|
| **One place** | All approvals across modules in a single inbox |
| **Mobile** | Approve from a phone or tablet, anywhere |
| **Faster cycles** | No hunting for transactions; decisions happen quickly |
| **Audit trail** | Workflow records who approved what and when |

## A Real Example

Sunita's purchase requisition:
- An employee submits a requisition for ₹2 lakh.
- **Workflow** rules say a manager must approve amounts over ₹1 lakh, so a **work item** is routed to Sunita's **My Inbox**.
- She gets a notification, taps the tile, reviews the details on her phone, adds a comment, and taps **Approve**.
- The workflow records her approval and proceeds — the requisition becomes a purchase order.

## Why It Matters

My Inbox plus workflow is how modern SAP makes approvals fast, mobile, and traceable. It turns scattered, slow approval processes into a single streamlined inbox — a flagship example of Fiori improving everyday work. For consultants, understanding the workflow-to-inbox link is key to configuring approval scenarios.`,
    keyConceptTitle: "My Inbox Surfaces Workflow Tasks for Quick Approval",
    keyConceptBody: `- **My Inbox** is a Fiori app showing a user's **workflow tasks** (approvals) in one mobile-friendly place, each with details and Approve/Reject actions.
- Tasks are created by **SAP Workflow**, which routes a submitted request to the right approver based on rules (amount, department, hierarchy).
- Acting on a task returns the decision to the workflow, which continues the process — giving fast, anywhere approvals with a full audit trail.`,
  },
});
// Flowchart for lesson 12.7
const flowchart12_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson12_7.id },
  update: {},
  create: {
    lessonId: lesson12_7.id,
    title: "How an Approval Reaches My Inbox",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📝 User Submits Request" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 120 }, data: { label: "🔀 Workflow Routes It" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 490, y: 120 }, data: { label: "📥 Task Lands in My Inbox" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 710, y: 60 }, data: { label: "✅ Approve / Reject" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 710, y: 180 }, data: { label: "➡️ Workflow Continues" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart12_7.id, nodeId: "node1", title: "User Submits Request", description: "An employee submits something needing approval — a purchase requisition, leave request, or invoice — often from another Fiori app.", tCode: "Fiori app / workflow start", tips: "The submitting app triggers the workflow automatically; the user doesn't choose the approver." },
    { flowchartId: flowchart12_7.id, nodeId: "node2", title: "Workflow Routes It", description: "SAP Workflow applies rules (amount thresholds, department, org hierarchy) to decide who must approve and creates a work item.", tCode: "SWDD (Workflow Builder)", tips: "Approval rules live in the workflow definition — that's where consultants configure who approves what." },
    { flowchartId: flowchart12_7.id, nodeId: "node3", title: "Task Lands in My Inbox", description: "The work item appears as a task in the approver's My Inbox, with the request's details and action buttons, plus a notification.", tCode: "My Inbox (Fiori)", tips: "My Inbox consolidates tasks from many processes into one list across all modules." },
    { flowchartId: flowchart12_7.id, nodeId: "node4", title: "Approve / Reject", description: "The approver reviews the details and taps Approve or Reject (often with a comment), even from a mobile device.", tCode: "My Inbox", tips: "Mobile approval is a headline Fiori benefit — decisions happen without a desktop." },
    { flowchartId: flowchart12_7.id, nodeId: "node5", title: "Workflow Continues", description: "The decision is sent back to the workflow, which moves to the next step (e.g. next approver) or completes the process and records the outcome.", tCode: "SWI1 (work item monitor)", tips: "The workflow log gives a full audit trail of who approved what and when." },
  ],
});
// Quiz for lesson 12.7
await prisma.quiz.upsert({
  where: { lessonId: lesson12_7.id },
  update: {},
  create: {
    lessonId: lesson12_7.id,
    title: "My Inbox & Approvals — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does the Fiori My Inbox app display?",
          explanation: "My Inbox shows a user's workflow tasks — items waiting for their decision (approvals) — in one place, each with details and action buttons like Approve/Reject.",
          options: {
            create: [
              { text: "A user's workflow tasks waiting for approval", isCorrect: true },
              { text: "The user's email from Outlook", isCorrect: false },
              { text: "A list of all SAP tables", isCorrect: false },
              { text: "The system's background jobs", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What decides which approver a submitted request is routed to?",
          explanation: "SAP Workflow applies defined rules — such as amount thresholds, department, or org hierarchy — to determine the correct approver and create a work item for them. The submitter doesn't pick the approver.",
          options: {
            create: [
              { text: "SAP Workflow rules (amount, department, hierarchy)", isCorrect: true },
              { text: "The submitter manually chooses anyone", isCorrect: false },
              { text: "It is always the CEO", isCorrect: false },
              { text: "A random assignment each time", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "After a manager taps Approve in My Inbox, what happens next?",
          explanation: "The decision is returned to the workflow, which advances to the next step (e.g. the next approver) or completes the process — and records the action for the audit trail. The approval isn't an isolated click; it drives the process forward.",
          options: {
            create: [
              { text: "The workflow continues to the next step or completes the process", isCorrect: true },
              { text: "Nothing — the approval is just stored privately", isCorrect: false },
              { text: "The SAP system shuts down", isCorrect: false },
              { text: "The request is permanently deleted", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 12.8: Responsive Design in Fiori
const lesson12_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-responsive-design" } },
  update: {},
  create: {
    moduleId: fioriModule.id,
    title: "Responsive Design in Fiori",
    slug: "fiori-responsive-design",
    order: 8,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Vikram approves orders on his laptop at the office, on a tablet in meetings, and on his phone while traveling — using the same Fiori app each time. He notices it always looks right: full columns on the laptop, a simpler view on the phone. He wonders how one app adapts to every screen without separate versions.

Responsive design is how a single Fiori app reshapes itself to fit any device — a core promise of Fiori.`,
    content: `## One App, Every Device

A key Fiori design principle is "**run anywhere**." Instead of building separate apps for desktop, tablet, and phone, a single Fiori app **adapts** its layout to the screen it's running on. This is **responsive design**, and SAPUI5 has it built in.

## Why It Matters

People work across devices — a desktop at their desk, a tablet in meetings, a phone on the move. Responsive design means they get a usable, good-looking app everywhere, with no retraining and no separate mobile app to maintain.

## How Fiori Adapts: Breakpoints

SAPUI5 defines screen-size **breakpoints** and adjusts the layout at each:

| Device size | Typical behavior |
|-------------|------------------|
| **Desktop (L/XL)** | Full layout, multiple columns, more data visible |
| **Tablet (M)** | Condensed layout, some elements collapse |
| **Phone (S)** | Single column, menus tuck into icons, simplified |

The app detects the screen and rearranges — columns stack, tables become scrollable or switch to a card view, and navigation collapses into a menu.

## Responsive Controls

SAPUI5 provides controls designed to adapt automatically, for example:
- **Responsive Table** — shows all columns on desktop; hides or pops less-important ones into a details popup on a phone.
- **Flexible Column Layout** — shows list + detail side by side on wide screens, but one column at a time on narrow ones.
- **Grid / Form layouts** — reflow fields into fewer columns on smaller screens.

Developers use these instead of fixed pixel layouts, so adaptation is automatic.

## Designing Mobile-Friendly

Good responsive apps follow habits like:
- Prioritize the most important information first (it stays visible on small screens),
- Use touch-friendly targets,
- Avoid relying on hover (phones have no mouse),
- Keep tasks focused (Fiori's "simple" principle helps here).

## A Real Example

Vikram's approval app:
- On his **laptop**, the Flexible Column Layout shows the list of orders and the selected order's details side by side, with a full responsive table of line items.
- On his **phone**, the same app shows one column at a time, the line-item table collapses less-important columns into a details view, and navigation tucks into a menu icon.
- It's the **same app and data** — just reshaped for each screen.

## Why It Matters

Responsive design delivers Fiori's "run anywhere" promise with a single codebase. Users get a consistent, comfortable experience on any device, and companies avoid building and maintaining separate mobile apps. Using responsive controls (not fixed layouts) is essential to building proper Fiori apps.`,
    keyConceptTitle: "One Fiori App Adapts to Desktop, Tablet, and Phone",
    keyConceptBody: `- **Responsive design** lets a single Fiori app reshape its layout for any screen — no separate mobile version needed.
- SAPUI5 uses **breakpoints** (S/M/L sizes) and **responsive controls** (Responsive Table, Flexible Column Layout) that collapse, stack, or hide elements automatically.
- Build with adaptive controls, prioritize key info, and design touch-friendly — delivering Fiori's "run anywhere" promise.`,
  },
});
// Flowchart for lesson 12.8
const flowchart12_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson12_8.id },
  update: {},
  create: {
    lessonId: lesson12_8.id,
    title: "How One App Fits Every Screen",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 40 }, data: { label: "🎨 One Fiori App (SAPUI5)" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 160 }, data: { label: "📐 Detect Screen Size (Breakpoint)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 80, y: 290 }, data: { label: "🖥️ Desktop: Full Layout" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 290 }, data: { label: "📱 Tablet: Condensed" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 510, y: 290 }, data: { label: "📲 Phone: Single Column" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart12_8.id, nodeId: "node1", title: "One Fiori App", description: "A single SAPUI5 app serves all devices. There's no separate desktop or mobile version to build and maintain.", tCode: "SAPUI5", tips: "One codebase for all screens is a major maintenance and cost advantage." },
    { flowchartId: flowchart12_8.id, nodeId: "node2", title: "Detect Screen Size", description: "SAPUI5 detects the device's screen width against defined breakpoints (S/M/L) and chooses the appropriate layout automatically.", tCode: "SAPUI5 (Device API)", tips: "Breakpoints, not device names, drive the layout — so it adapts to window resizing too." },
    { flowchartId: flowchart12_8.id, nodeId: "node3", title: "Desktop: Full Layout", description: "On large screens the app shows its full layout — multiple columns, side-by-side list and detail, and complete tables.", tCode: "N/A", tips: "Flexible Column Layout shines here, showing list and detail at once." },
    { flowchartId: flowchart12_8.id, nodeId: "node4", title: "Tablet: Condensed", description: "On medium screens the layout condenses — some elements collapse and spacing tightens while keeping key functions visible.", tCode: "N/A", tips: "Test on real tablet widths; the medium breakpoint behavior is easy to overlook." },
    { flowchartId: flowchart12_8.id, nodeId: "node5", title: "Phone: Single Column", description: "On small screens the app shows one column, tucks navigation into a menu, and collapses less-important table columns into a details view.", tCode: "N/A", tips: "Prioritize the most important fields so they remain visible on a phone." },
  ],
});
// Quiz for lesson 12.8
await prisma.quiz.upsert({
  where: { lessonId: lesson12_8.id },
  update: {},
  create: {
    lessonId: lesson12_8.id,
    title: "Responsive Design in Fiori — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "How does Fiori support desktop, tablet, and phone users?",
          explanation: "A single Fiori app uses responsive design to adapt its layout to each screen size automatically. There's no need for separate apps per device — one codebase reshapes itself.",
          options: {
            create: [
              { text: "One app adapts its layout responsively to each screen", isCorrect: true },
              { text: "A separate app is built for each device", isCorrect: false },
              { text: "Phones cannot run Fiori apps", isCorrect: false },
              { text: "Users must resize windows manually for it to work", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does a SAPUI5 Responsive Table do on a small phone screen?",
          explanation: "A Responsive Table shows all columns on a wide screen but hides or moves less-important columns into a details popup on a phone, keeping the most important information visible without horizontal scrolling.",
          options: {
            create: [
              { text: "Hides or collapses less-important columns into a details view", isCorrect: true },
              { text: "Shows every column squeezed tiny and unreadable", isCorrect: false },
              { text: "Refuses to display on phones", isCorrect: false },
              { text: "Converts data into an image", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why should a Fiori developer use responsive controls instead of fixed pixel layouts?",
          explanation: "Responsive controls (like Responsive Table and Flexible Column Layout) adapt automatically across breakpoints, so the same app works well on any device. Fixed pixel layouts don't reflow and break on screens they weren't designed for.",
          options: {
            create: [
              { text: "Responsive controls adapt automatically across all screen sizes", isCorrect: true },
              { text: "Fixed layouts are required by SAP", isCorrect: false },
              { text: "Pixel layouts load faster on every device", isCorrect: false },
              { text: "Responsive controls only work on desktops", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 12.9: Fiori Extensibility (Key User Tools)
const lesson12_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-key-user-extensibility" } },
  update: {},
  create: {
    moduleId: fioriModule.id,
    title: "Fiori Extensibility (Key User Tools)",
    slug: "fiori-key-user-extensibility",
    order: 9,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `The finance team loves a standard Fiori app but says, "We need one extra field on this screen, and a couple of columns we never use should be hidden." In the past this meant a developer changing code. Pooja, a business analyst (not a developer), is told, "You can do that yourself with the Key User tools — no coding, and it won't break upgrades."

Key user extensibility lets business experts safely adapt standard Fiori apps without touching code.`,
    content: `## Adapting Apps Without Developers

Standard Fiori apps rarely fit every company perfectly — a team may want an extra field, a hidden column, or a renamed label. Traditionally that required a developer and code changes. **Key User Extensibility** lets trained business users ("key users") make these adaptations themselves, through the browser, with **no coding** — and in an **upgrade-safe** way.

## What "Key User" Means

A **key user** is a business expert with special authorization to adapt apps — not a professional ABAP/UI5 developer. SAP gives them in-browser tools to tailor apps to the business, keeping changes separate from SAP's standard code (the "clean core" idea).

## What Key Users Can Do

| Adaptation | Example |
|------------|---------|
| **Adapt UI (layout)** | Hide fields, rename labels, move/reorder fields, add a custom field to the screen |
| **Add custom fields** | Create a new field and place it on apps, tables, and reports |
| **Custom logic (limited)** | Add simple validations or determinations via low-code tools |
| **Manage Launchpad** | Adjust catalogs, groups/pages, tiles |
| **Custom CDS / queries** | Build custom analytical queries (in some tools) |

## The Two Big Tools

1. **Adapt UI (UI Adaptation at runtime)** — opens the app in an editing mode where the key user drags, hides, renames, and adds fields directly on the screen. Changes are saved as a **layer on top** of the standard app.
2. **Custom Fields and Logic** (a Fiori app itself) — create new fields once and publish them to multiple apps, tables, and even OData services, plus add simple logic.

## Why It's Upgrade-Safe

The crucial point: key-user changes are stored **separately** from SAP's delivered objects, as adaptation layers and registered custom fields. When SAP ships an upgrade, the standard app updates and your adaptations sit cleanly on top — they don't conflict. This is very different from modifying standard code.

## Key User vs Developer Extensibility

| | Key User | Developer (BTP/side-by-side) |
|--|----------|------------------------------|
| Who | Business expert | Professional developer |
| Coding | None / low-code | Full code |
| Scope | UI tweaks, custom fields, simple logic | Complex apps and logic |
| Where | In the browser, in the app | BTP / development tools |

For deeper needs, developers extend on **BTP** (side-by-side) — but many everyday tweaks need only key-user tools.

## A Real Example

Pooja's request:
- She opens the app, enters **Adapt UI** mode, **hides** the unused columns and **renames** a confusing label — saved instantly as an adaptation.
- For the extra field, she uses **Custom Fields and Logic** to create it once and add it to the app (and its table/report).
- No developer, no code, and the next SAP upgrade applies cleanly over her changes.

## Why It Matters

Key user extensibility empowers business teams to tailor SAP quickly and safely, reducing reliance on developers and protecting upgrade-readiness. It's a core part of modern SAP's "clean core" strategy — adapt through approved tools, never by modifying standard code.`,
    keyConceptTitle: "Key Users Adapt Standard Apps Without Code, Upgrade-Safe",
    keyConceptBody: `- **Key User Extensibility** lets business experts adapt standard Fiori apps (hide/rename/move fields, add custom fields, simple logic) **in the browser, no coding**.
- The main tools are **Adapt UI** (runtime layout changes) and **Custom Fields and Logic** (add fields/logic across apps).
- Changes are stored **separately** from SAP's standard objects, so they're **upgrade-safe** — central to the "clean core" approach; deeper needs use developer/BTP extensibility.`,
  },
});
// Flowchart for lesson 12.9
const flowchart12_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson12_9.id },
  update: {},
  create: {
    lessonId: lesson12_9.id,
    title: "Adapting an App as a Key User",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📋 Business Needs a Tweak" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 60 }, data: { label: "🎨 Adapt UI (Hide/Rename/Move)" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 280, y: 180 }, data: { label: "➕ Custom Fields & Logic" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 120 }, data: { label: "🗂️ Saved as Separate Layer" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 740, y: 120 }, data: { label: "✅ Upgrade-Safe" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node4", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart12_9.id, nodeId: "node1", title: "Business Needs a Tweak", description: "A team wants a small change to a standard app — an extra field, a hidden column, a clearer label — not a whole new app.", tCode: "N/A", tips: "Many such requests need only key-user tools, no developer involvement." },
    { flowchartId: flowchart12_9.id, nodeId: "node2", title: "Adapt UI", description: "The key user opens the app in adaptation mode and hides, renames, moves, or adds fields directly on the screen — no code.", tCode: "Adapt UI (runtime)", tips: "Changes can be made for all users or specific roles, depending on the adaptation." },
    { flowchartId: flowchart12_9.id, nodeId: "node3", title: "Custom Fields & Logic", description: "A dedicated Fiori app lets key users create a custom field once and publish it to apps, tables, and OData, plus add simple logic.", tCode: "Custom Fields and Logic (Fiori app)", tips: "Define a field once and reuse it across the UI, database, and reports." },
    { flowchartId: flowchart12_9.id, nodeId: "node4", title: "Saved as Separate Layer", description: "Adaptations and custom fields are stored separately from SAP's standard objects, as layers and registered extensions.", tCode: "N/A", tips: "Because changes are separate, they never overwrite delivered code." },
    { flowchartId: flowchart12_9.id, nodeId: "node5", title: "Upgrade-Safe", description: "When SAP upgrades the standard app, the key-user changes sit cleanly on top and keep working — no modification conflicts.", tCode: "N/A", tips: "This 'clean core' approach protects your ability to take upgrades smoothly." },
  ],
});
// Quiz for lesson 12.9
await prisma.quiz.upsert({
  where: { lessonId: lesson12_9.id },
  update: {},
  create: {
    lessonId: lesson12_9.id,
    title: "Fiori Extensibility — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Who performs key user extensibility, and how much coding is involved?",
          explanation: "A key user is a business expert (not a professional developer) with special authorization to adapt apps through in-browser tools — with no coding (or only low-code). It empowers business teams to tailor apps themselves.",
          options: {
            create: [
              { text: "A business expert, with no coding required", isCorrect: true },
              { text: "Only ABAP developers, with heavy coding", isCorrect: false },
              { text: "The database administrator, using SQL", isCorrect: false },
              { text: "No one — apps can't be changed", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why are key-user adaptations upgrade-safe?",
          explanation: "Key-user changes (adaptation layers, registered custom fields) are stored separately from SAP's delivered objects. When SAP upgrades the standard app, the adaptations sit on top without conflicting — unlike modifying standard code.",
          options: {
            create: [
              { text: "Changes are stored separately from SAP's standard objects", isCorrect: true },
              { text: "Upgrades never change any apps", isCorrect: false },
              { text: "The changes are deleted before each upgrade", isCorrect: false },
              { text: "Key users copy the standard app", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A team wants to hide unused columns and add one new field to a standard app, without a developer. Which approach fits?",
          explanation: "Hiding columns is done with Adapt UI, and adding a field is done with Custom Fields and Logic — both key-user tools requiring no coding and producing upgrade-safe changes. A full developer/BTP extension would be overkill here.",
          options: {
            create: [
              { text: "Key user tools: Adapt UI and Custom Fields and Logic", isCorrect: true },
              { text: "Modify the standard SAP code directly", isCorrect: false },
              { text: "Rebuild the entire app from scratch in freestyle", isCorrect: false },
              { text: "It is impossible without SAP's help", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 12.10: Fiori Theming (Theme Designer)
const lesson12_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-theming" } },
  update: {},
  create: {
    moduleId: fioriModule.id,
    title: "Fiori Theming (Theme Designer)",
    slug: "fiori-theming",
    order: 10,
    isPublished: true,
    estimatedMinutes: 9,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `A company's brand team says, "When employees open SAP, it should feel like *our* company — our logo, our blue, not generic SAP grey." Nisha, on the Fiori team, is asked to make the Launchpad match the corporate brand. She wonders whether that means editing every app's code.

Theming lets you rebrand all of Fiori at once — colors, logo, and styling — without touching any app code.`,
    content: `## Why Theming Exists

Out of the box, Fiori uses SAP's standard themes. But companies want SAP to reflect **their brand** — corporate colors, logo, and a familiar look that builds trust and recognition. **Theming** changes the visual styling across *all* Fiori apps at once, centrally, without modifying any individual app.

## What Is a Theme?

A **theme** is a set of visual styles — colors, fonts, logo, backgrounds — applied consistently across the Fiori Launchpad and every app. Because Fiori apps share a common styling system, changing the theme restyles them all together.

## SAP's Standard Themes

SAP ships built-in themes that evolve over time, for example:

| Theme | Note |
|-------|------|
| **SAP Horizon** | The current modern default theme |
| **SAP Quartz (Light/Dark)** | Previous-generation themes |
| **Belize / Blue Crystal** | Older themes |

Users can often switch between allowed themes (including dark mode) in their settings, improving comfort and accessibility.

## Custom Branding: The Theme Designer

The **UI Theme Designer** is SAP's tool to create a **custom theme** by adjusting a standard one:
- Change the **primary/brand colors**,
- Add the **company logo**,
- Tweak backgrounds, fonts, and other styling.

You base a custom theme on a current SAP theme (e.g. Horizon), make brand adjustments, then **build and assign** it so users see the branded experience. Crucially, this is **styling only** — it doesn't change app behavior or code.

## Why Theme Centrally?

| Benefit | Why it matters |
|---------|----------------|
| **Consistency** | Every app shares the brand instantly |
| **No code changes** | Apps are untouched; only styling differs |
| **Easy to update** | Rebrand once, applies everywhere |
| **Accessibility** | Offer high-contrast / dark themes |

## A Note on Restraint

Good theming is light-touch — apply brand colors and the logo, but keep Fiori's clean, usable design. Over-styling can hurt readability and fight SAP's design guidelines, so most companies adjust colors and logo and leave the rest.

## A Real Example

Nisha's branding task:
- She opens the **UI Theme Designer**, bases a new theme on **SAP Horizon**.
- She sets the **brand blue** as the primary color and uploads the **company logo**.
- She builds and assigns the theme to users.
- Now every Fiori app and the Launchpad show the corporate colors and logo — and not a single app's code was changed.

## Why It Matters

Theming delivers a branded, consistent, accessible SAP experience without per-app effort. The Theme Designer lets companies align SAP with their identity centrally, and supports comfort features like dark mode — all as pure styling, separate from app logic and upgrade-safe.`,
    keyConceptTitle: "Theming Rebrands All Fiori Apps Centrally, No Code",
    keyConceptBody: `- A **theme** is a shared set of visual styles (colors, fonts, logo) applied across the Launchpad and all Fiori apps at once.
- SAP ships standard themes (current default **SAP Horizon**, plus dark mode); the **UI Theme Designer** creates a custom branded theme based on a standard one.
- Theming is **styling only** — it changes look, not behavior or code — so it's consistent, easy to update, and upgrade-safe.`,
  },
});
// Flowchart for lesson 12.10
const flowchart12_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson12_10.id },
  update: {},
  create: {
    lessonId: lesson12_10.id,
    title: "Creating a Branded Theme",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🎨 Open UI Theme Designer" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 120 }, data: { label: "📑 Base on Standard Theme (Horizon)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 530, y: 120 }, data: { label: "🖌️ Set Colors & Logo" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 530, y: 260 }, data: { label: "🏗️ Build & Assign Theme" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 260 }, data: { label: "✨ All Apps Rebranded" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart12_10.id, nodeId: "node1", title: "Open UI Theme Designer", description: "The UI Theme Designer is SAP's central tool for creating and editing themes that apply across all Fiori apps.", tCode: "UI Theme Designer", tips: "Theming is central — you don't edit individual apps to rebrand them." },
    { flowchartId: flowchart12_10.id, nodeId: "node2", title: "Base on Standard Theme", description: "Start from a current SAP theme like Horizon, so you inherit a clean, accessible, up-to-date design and only adjust the brand parts.", tCode: "UI Theme Designer", tips: "Basing on the latest theme keeps you aligned with SAP's design improvements." },
    { flowchartId: flowchart12_10.id, nodeId: "node3", title: "Set Colors & Logo", description: "Adjust the primary brand colors and add the company logo. Keep it light-touch to preserve Fiori's readability.", tCode: "UI Theme Designer", tips: "Don't over-style — brand colors and logo are usually enough; respect the design guidelines." },
    { flowchartId: flowchart12_10.id, nodeId: "node4", title: "Build & Assign Theme", description: "Build the custom theme and assign it so users see it. Themes can be set as default and offered alongside dark mode.", tCode: "UI Theme Designer / Launchpad settings", tips: "Offer a dark or high-contrast variant for accessibility and comfort." },
    { flowchartId: flowchart12_10.id, nodeId: "node5", title: "All Apps Rebranded", description: "Because apps share the styling system, the new theme restyles the Launchpad and every app at once — with no app code changed.", tCode: "N/A", tips: "Styling only: behavior and logic are untouched, so theming is upgrade-safe." },
  ],
});
// Quiz for lesson 12.10
await prisma.quiz.upsert({
  where: { lessonId: lesson12_10.id },
  update: {},
  create: {
    lessonId: lesson12_10.id,
    title: "Fiori Theming — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does applying a custom theme to Fiori change?",
          explanation: "A theme changes the visual styling — colors, fonts, logo, backgrounds — across the Launchpad and all apps at once. It does not change app behavior or logic; it's purely visual.",
          options: {
            create: [
              { text: "The visual styling (colors, logo) across all apps, not behavior", isCorrect: true },
              { text: "The business logic inside each app", isCorrect: false },
              { text: "The database tables", isCorrect: false },
              { text: "The user's authorizations", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which SAP tool is used to create a custom branded theme?",
          explanation: "The UI Theme Designer lets you base a custom theme on a standard SAP theme (like Horizon), adjust brand colors and add a logo, then build and assign it — all centrally, without editing apps.",
          options: {
            create: [
              { text: "The UI Theme Designer", isCorrect: true },
              { text: "The ABAP Editor (SE38)", isCorrect: false },
              { text: "The Transport Organizer (SE10)", isCorrect: false },
              { text: "Spool Administration (SPAD)", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why can a company rebrand all its Fiori apps by changing one theme, without editing each app?",
          explanation: "Fiori apps share a common styling system, so the theme defines the look centrally. Changing the theme restyles every app at once — which is also why theming is upgrade-safe (no app code is modified).",
          options: {
            create: [
              { text: "Apps share a common styling system the theme controls centrally", isCorrect: true },
              { text: "Each app secretly copies the others' code", isCorrect: false },
              { text: "Themes rewrite every app's source code", isCorrect: false },
              { text: "Only one app exists, so it's easy", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── S/4HANA: NEW LESSONS ─────────────────────────────────────────────────────
// LESSON 13.3: The Universal Journal (ACDOCA)
const lesson13_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "universal-journal-acdoca" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "The Universal Journal (ACDOCA)",
    slug: "universal-journal-acdoca",
    order: 3,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `In the old ECC system, Anjali the accountant constantly ran "reconciliation" jobs to make sure Financial Accounting and Controlling agreed — because they lived in different tables and could drift apart. It wasted hours every month-end. When her company moved to S/4HANA, her manager said, "Forget reconciliation between FI and CO — it's one table now." Anjali was skeptical until she saw ACDOCA.

The Universal Journal is the single table that unified SAP finance — and it's the heart of S/4HANA.`,
    content: `## The Old Problem: Many Tables, Constant Reconciliation

In ECC, financial data was scattered across many tables: separate totals tables, line-item tables, and different tables for FI (Financial Accounting) and CO (Controlling). Because the same business event was recorded in multiple places, they could disagree — so teams ran **reconciliation** jobs to align them. Slow and error-prone.

## The Solution: One Table — ACDOCA

S/4HANA introduced the **Universal Journal**, stored in a single table called **ACDOCA**. Every financial posting — FI, CO, asset accounting, material ledger, profitability — is recorded as line items in this one table.

Think of it as **one giant, detailed ledger** that everyone reads from, instead of many separate books that must be matched.

## What This Changes

| Aspect | ECC (old) | S/4HANA (ACDOCA) |
|--------|-----------|------------------|
| FI and CO | Separate tables | Unified in one table |
| Reconciliation | Required, periodic | Eliminated — single source |
| Detail level | Aggregated totals tables | Full line-item detail |
| Reporting | Often after batch jobs | Real-time on live data |
| Currencies | Limited | Many parallel currencies |

## The Single Source of Truth

Because FI and CO share the same line items in ACDOCA, there's **one version of financial truth**. A cost posting and its financial impact are the *same* record viewed different ways — they can't drift apart. This is why reconciliation between FI and CO largely disappears.

## Extra Power: Detail and Currencies

ACDOCA stores rich detail per line — cost center, profit center, segment, customer, and more — plus **multiple currencies** and **multiple ledgers** (e.g. for different accounting standards) side by side. Reports can slice finance by many dimensions instantly, on live data, thanks to the HANA database underneath.

## Totals Tables Become Views

Old totals tables (like the General Ledger totals) still appear to exist for compatibility — but in S/4HANA many are **compatibility views** that read from ACDOCA on the fly. So legacy reports keep working while the real data lives in one place.

## A Real Example

Anjali's month-end:
- A goods issue posts cost of goods sold. In ACDOCA, that single line carries the G/L account (FI view), the cost center and profit center (CO view), the segment, and amounts in multiple currencies.
- Finance and controlling reports both read the **same** line — no reconciliation job needed.
- She runs a real-time P&L by profit center directly on ACDOCA. Month-end is dramatically faster.

## Why It Matters

The Universal Journal is the foundation of S/4HANA finance. By unifying FI and CO into one line-item table, it eliminates reconciliation, provides a single source of truth, and enables real-time, multi-dimensional reporting. Understanding ACDOCA is essential to understanding why S/4HANA finance is a leap forward.`,
    keyConceptTitle: "ACDOCA Unifies FI and CO into One Line-Item Table",
    keyConceptBody: `- The **Universal Journal (table ACDOCA)** records every financial posting — FI, CO, assets, material ledger — as line items in **one table**.
- Because FI and CO share the same records, there's a **single source of truth** and **reconciliation between them is eliminated**.
- ACDOCA stores rich detail (cost/profit center, segment) and **multiple currencies/ledgers**, enabling real-time, multi-dimensional reporting on HANA.`,
  },
});
// Flowchart for lesson 13.3
const flowchart13_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_3.id },
  update: {},
  create: {
    lessonId: lesson13_3.id,
    title: "From Many Tables to One Universal Journal",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 60 }, data: { label: "📚 ECC: Separate FI Tables" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 60, y: 180 }, data: { label: "📚 ECC: Separate CO Tables" }, style: { background: "#94A3B8", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 120 }, data: { label: "🔁 Reconciliation Needed" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 120 }, data: { label: "🚀 S/4HANA: ACDOCA (One Table)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 760, y: 60 }, data: { label: "✅ Single Source of Truth" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 760, y: 180 }, data: { label: "📊 Real-Time Reporting" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node3", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_3.id, nodeId: "node1", title: "ECC: Separate FI Tables", description: "In ECC, Financial Accounting used its own line-item and totals tables (e.g. BSEG, GLT0). They held the external accounting view.", tCode: "ECC (BSEG, etc.)", tips: "Knowing the old table sprawl explains why reconciliation was such a burden." },
    { flowchartId: flowchart13_3.id, nodeId: "node2", title: "ECC: Separate CO Tables", description: "Controlling kept its own tables (e.g. COEP) for internal cost data, distinct from FI — a parallel set of numbers.", tCode: "ECC (COEP, etc.)", tips: "Two sources for one truth is exactly what ACDOCA later solved." },
    { flowchartId: flowchart13_3.id, nodeId: "node3", title: "Reconciliation Needed", description: "Because FI and CO data lived separately, periodic reconciliation was required to ensure they matched — slow and error-prone.", tCode: "ECC reconciliation jobs", tips: "Reconciliation effort was a classic month-end pain point in ECC." },
    { flowchartId: flowchart13_3.id, nodeId: "node4", title: "S/4HANA: ACDOCA", description: "The Universal Journal records every posting as line items in one table — FI, CO, assets, material ledger — with full detail and multiple currencies.", tCode: "Table ACDOCA", tips: "ACDOCA is the most important table to know in S/4HANA finance." },
    { flowchartId: flowchart13_3.id, nodeId: "node5", title: "Single Source of Truth", description: "FI and CO read the same records, so they can't disagree — reconciliation between them is eliminated.", tCode: "N/A", tips: "One record viewed multiple ways = no drift between finance and controlling." },
    { flowchartId: flowchart13_3.id, nodeId: "node6", title: "Real-Time Reporting", description: "On HANA, reports run directly on ACDOCA's detailed line items across many dimensions, with no waiting for batch totals.", tCode: "Fiori analytical apps", tips: "Multi-dimensional, live finance reporting is a direct payoff of the Universal Journal." },
  ],
});
// Quiz for lesson 13.3
await prisma.quiz.upsert({
  where: { lessonId: lesson13_3.id },
  update: {},
  create: {
    lessonId: lesson13_3.id,
    title: "The Universal Journal (ACDOCA) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the Universal Journal in S/4HANA?",
          explanation: "The Universal Journal is the single table (ACDOCA) that records every financial posting — FI, CO, asset accounting, material ledger — as line items, replacing the many separate finance tables of ECC.",
          options: {
            create: [
              { text: "A single table (ACDOCA) holding all financial postings as line items", isCorrect: true },
              { text: "A printed accounting diary", isCorrect: false },
              { text: "A type of Fiori app", isCorrect: false },
              { text: "The user logon screen", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does reconciliation between FI and CO largely disappear in S/4HANA?",
          explanation: "Because FI and CO postings share the same line items in ACDOCA, they are literally the same records viewed different ways — so they can't drift apart, removing the need to reconcile them.",
          options: {
            create: [
              { text: "FI and CO share the same line items, so they can't disagree", isCorrect: true },
              { text: "CO was removed from S/4HANA", isCorrect: false },
              { text: "Reconciliation is done manually in Excel instead", isCorrect: false },
              { text: "FI and CO are never used together", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Old totals tables still appear to exist in S/4HANA for compatibility. How do they actually work now?",
          explanation: "Many former totals tables are now compatibility views that read from ACDOCA on the fly. This lets legacy reports keep working while the real, single source of data lives in the Universal Journal.",
          options: {
            create: [
              { text: "They are compatibility views that read from ACDOCA", isCorrect: true },
              { text: "They still store fully duplicated data", isCorrect: false },
              { text: "They were deleted and break old reports", isCorrect: false },
              { text: "They are stored on the user's PC", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.4: The Business Partner (BP)
const lesson13_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "business-partner-concept" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "The Business Partner (BP)",
    slug: "business-partner-concept",
    order: 4,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `In ECC, Ramesh maintained customers in one transaction (XD01) and vendors in another (XK01) — and when a company was *both* a customer and a supplier, he created two unrelated records with duplicated address data that constantly got out of sync. In S/4HANA his trainer says, "Use BP for everything now — one record, many roles." Ramesh wonders how a single object can be both a customer and a vendor.

The Business Partner is S/4HANA's unified way to manage everyone the company deals with.`,
    content: `## The Old Problem: Separate Customer and Vendor Masters

In ECC, customers and vendors were maintained separately:
- **Customers** via XD01/XD02/XD03,
- **Vendors** via XK01/XK02/XK03.

If one company was both your customer *and* your supplier, you kept **two separate records** with duplicated name and address data — which drifted out of sync and caused errors.

## The Solution: One Business Partner

S/4HANA makes the **Business Partner (BP)** the single, central way to manage any party you deal with — customers, vendors, employees, contacts. There's **one transaction: BP**. The customer and vendor master transactions (XD01/XK01) are obsolete; they redirect to BP.

Think of the BP as **one contact card** for an organization, to which you add different **roles** depending on the relationship.

## The Key Idea: BP Roles

A single Business Partner can hold multiple **roles**:

| BP Role | Means |
|---------|-------|
| **Business Partner (General)** | Core data: name, address, communication |
| **FI Customer** | The customer/receivables view (old XD data) |
| **FI Vendor** | The vendor/payables view (old XK data) |
| **Contact Person** | An individual contact |

So a company that is both customer and supplier is **one BP** with both the customer role and the vendor role — general data entered **once**, shared by all roles.

## BP Categories and Grouping

A BP has a **category** — Organization, Person, or Group — describing what it is. A **BP grouping** controls the number range (internal/external numbering). These set up the BP correctly for its purpose.

## Customer/Vendor Integration (CVI)

Behind the scenes, **Customer/Vendor Integration (CVI)** keeps the BP synchronized with the underlying customer and vendor tables that other processes still use. So SD and MM continue to work with customer/vendor numbers, while BP is the single maintenance point on top. During migration to S/4HANA, CVI is a mandatory step to convert old masters into BPs.

## A Real Example

Ramesh's dual company:
- He creates **one Business Partner** for "Acme Corp."
- He enters the **general data** (name, address) once.
- He adds the **FI Customer** role (so Acme can buy from him) and the **FI Vendor** role (so Acme can supply him).
- One record, both relationships, no duplicated address — and CVI keeps the customer/vendor tables in sync for SD and MM.

## Why It Matters

The Business Partner ends the duplication and sync problems of separate customer/vendor masters. One record with multiple roles means cleaner data, less maintenance, and a true single view of each party — a core simplification of S/4HANA and a mandatory concept for anyone working with master data.`,
    keyConceptTitle: "One Business Partner, Many Roles — Replacing XD01/XK01",
    keyConceptBody: `- In S/4HANA the **Business Partner (transaction BP)** is the single way to manage customers, vendors, and contacts; XD01/XK01 are obsolete.
- One BP holds **multiple roles** (e.g. FI Customer and FI Vendor) with **general data entered once** — ending duplicated, out-of-sync masters.
- **Customer/Vendor Integration (CVI)** keeps the BP synced with the customer/vendor tables SD and MM still use; CVI is mandatory during migration.`,
  },
});
// Flowchart for lesson 13.4
const flowchart13_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_4.id },
  update: {},
  create: {
    lessonId: lesson13_4.id,
    title: "One BP with Multiple Roles",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 40 }, data: { label: "🤝 Business Partner (One Record)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 160 }, data: { label: "🪪 General Data Entered Once" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 80, y: 290 }, data: { label: "🛒 FI Customer Role" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 290 }, data: { label: "🏭 FI Vendor Role" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 520, y: 290 }, data: { label: "🔄 CVI Syncs Cust/Vendor Tables" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_4.id, nodeId: "node1", title: "Business Partner (One Record)", description: "The single central object for any party you deal with — maintained via transaction BP. It replaces separate customer and vendor master transactions.", tCode: "BP", tips: "XD01/XK01 are obsolete in S/4HANA and redirect to BP." },
    { flowchartId: flowchart13_4.id, nodeId: "node2", title: "General Data Entered Once", description: "Core data like name, address, and communication is maintained a single time and shared by every role the BP takes on.", tCode: "BP (General)", tips: "Entering address once is what ends the duplication problem of the old masters." },
    { flowchartId: flowchart13_4.id, nodeId: "node3", title: "FI Customer Role", description: "Adding the customer role gives the BP the receivables/SD view — equivalent to the old XD customer master data.", tCode: "BP (FI Customer role)", tips: "A party can be a customer, a vendor, or both — just add the roles you need." },
    { flowchartId: flowchart13_4.id, nodeId: "node4", title: "FI Vendor Role", description: "Adding the vendor role gives the BP the payables/MM view — equivalent to the old XK vendor master data.", tCode: "BP (FI Vendor role)", tips: "Both roles on one BP means a company that's customer and supplier is a single record." },
    { flowchartId: flowchart13_4.id, nodeId: "node5", title: "CVI Syncs Tables", description: "Customer/Vendor Integration keeps the BP in sync with the underlying customer/vendor tables that SD and MM still use behind the scenes.", tCode: "CVI", tips: "CVI is a mandatory setup/migration step so downstream processes still find customer/vendor numbers." },
  ],
});
// Quiz for lesson 13.4
await prisma.quiz.upsert({
  where: { lessonId: lesson13_4.id },
  update: {},
  create: {
    lessonId: lesson13_4.id,
    title: "The Business Partner — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In S/4HANA, how do you maintain customers and vendors?",
          explanation: "Both are maintained through the single Business Partner transaction (BP). The old separate transactions XD01 (customer) and XK01 (vendor) are obsolete and redirect to BP.",
          options: {
            create: [
              { text: "Through the single Business Partner (BP) transaction", isCorrect: true },
              { text: "XD01 for customers and XK01 for vendors, as before", isCorrect: false },
              { text: "In two completely separate systems", isCorrect: false },
              { text: "Customers and vendors are no longer tracked", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A company is both your customer and your supplier. How is this handled with Business Partner?",
          explanation: "You create one Business Partner with both the FI Customer role and the FI Vendor role. The general data (name, address) is entered once and shared, ending the duplication of two separate masters.",
          options: {
            create: [
              { text: "One BP with both the customer role and the vendor role", isCorrect: true },
              { text: "Two unrelated records with duplicated addresses", isCorrect: false },
              { text: "It is not allowed in S/4HANA", isCorrect: false },
              { text: "A third 'hybrid' master transaction", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the purpose of Customer/Vendor Integration (CVI)?",
          explanation: "CVI keeps the Business Partner synchronized with the underlying customer and vendor tables that SD and MM still rely on. It's a mandatory step during migration so downstream processes continue to work with customer/vendor numbers.",
          options: {
            create: [
              { text: "It keeps the BP in sync with the customer/vendor tables SD and MM use", isCorrect: true },
              { text: "It deletes all old customers", isCorrect: false },
              { text: "It prints customer statements", isCorrect: false },
              { text: "It calculates depreciation", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.5: Embedded Analytics (CDS & the Virtual Data Model)
const lesson13_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "embedded-analytics-vdm" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "Embedded Analytics & the VDM",
    slug: "embedded-analytics-vdm",
    order: 5,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Lakshmi, a finance manager, used to wait until the next morning for reports: data was copied overnight into a separate reporting system, so her numbers were always a day old. On S/4HANA she opens a Fiori tile and sees today's figures, live, and drills in instantly. She asks, "How is the reporting system this fast and current?" The answer: there's no separate reporting system — analytics run right inside S/4HANA.

Embedded Analytics brings live reporting into the operational system itself, powered by CDS views.`,
    content: `## The Old Way: A Separate Reporting System

Traditionally, you didn't report directly on the live ERP — heavy reports would slow it down. Instead, data was copied (often overnight) into a separate **data warehouse**. The downside: reports were always somewhat **out of date**, and you needed extra systems.

## The New Way: Analytics Inside S/4HANA

Because **HANA** is fast enough to run analytics and transactions together, S/4HANA offers **Embedded Analytics** — real-time reporting **inside the operational system**, on live data. No overnight copy, no separate system for many needs.

## The Engine: CDS Views and the VDM

Embedded Analytics is built on **CDS views (Core Data Services)** — database-level views that define and shape data with joins, calculations, and rich metadata (annotations). SAP delivers thousands of standard CDS views organized into the **Virtual Data Model (VDM)**.

The VDM is **layered**:

| VDM Layer | Role |
|-----------|------|
| **Basic / Interface views** | Clean, reusable building blocks over tables |
| **Composite views** | Combine basic views, add calculations |
| **Consumption views** | Ready for reporting/UI (queries, analytics) |

This layering means analytics reuse a consistent, governed data model instead of everyone querying raw tables differently.

## How Users Consume It

Embedded Analytics surfaces through tools business users already have:

| Tool | What it does |
|------|--------------|
| **Analytical Fiori apps / KPI tiles** | Prebuilt dashboards and live KPI tiles |
| **Query Browser** | Run analytical CDS queries directly |
| **View Browser** | Find available CDS views |
| **Multidimensional Reports / Design Studio / SAC** | Slice-and-dice and richer dashboards |

A user can drill from a KPI down to the underlying line items — all live.

## Real-Time and Multidimensional

Because it runs on ACDOCA and other live tables via CDS, reporting is **real-time** and **multidimensional** — slice by profit center, region, product, time, all instantly. The same data the business is transacting on is the data you analyze.

## A Real Example

Lakshmi's live finance:
- She opens an **Analytical Fiori app** built on a **consumption CDS view** over ACDOCA.
- It shows today's revenue and margin by profit center — **live**, not yesterday's copy.
- She drills from a KPI into the underlying journal line items in seconds.
- No overnight load, no separate warehouse for this analysis.

## Why It Matters

Embedded Analytics, powered by CDS and the VDM, turns S/4HANA into its own real-time reporting platform. It gives business users current, drillable insights inside the system they already use, on a governed data model — eliminating delays and reducing the need for separate reporting systems for operational reporting.`,
    keyConceptTitle: "Embedded Analytics: Real-Time Reporting Inside S/4HANA via CDS",
    keyConceptBody: `- **Embedded Analytics** runs reporting **inside** S/4HANA on live data (thanks to HANA) — no overnight copy to a separate warehouse for operational reporting.
- It's powered by **CDS views** organized into the layered **Virtual Data Model (VDM)**: basic → composite → consumption views.
- Users consume it via **analytical Fiori apps, KPI tiles, and the Query Browser**, getting real-time, multidimensional, drillable insights.`,
  },
});
// Flowchart for lesson 13.5
const flowchart13_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_5.id },
  update: {},
  create: {
    lessonId: lesson13_5.id,
    title: "How Embedded Analytics Serves Live Insight",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🗄️ Live Tables (e.g. ACDOCA)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 120 }, data: { label: "🧱 CDS Views (VDM Layers)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 520, y: 120 }, data: { label: "📈 Consumption View / Query" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 740, y: 60 }, data: { label: "📱 Analytical Fiori App / KPI Tile" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 740, y: 180 }, data: { label: "🔎 Drill to Live Details" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_5.id, nodeId: "node1", title: "Live Tables", description: "Operational data (like the Universal Journal ACDOCA) is read directly — no overnight copy to a warehouse for operational reporting.", tCode: "Table ACDOCA", tips: "HANA's speed is what makes reporting on live transactional tables feasible." },
    { flowchartId: flowchart13_5.id, nodeId: "node2", title: "CDS Views (VDM)", description: "CDS views form the Virtual Data Model in layers (basic → composite → consumption), shaping raw tables into a clean, reusable model.", tCode: "View Browser", tips: "Reusing the VDM means consistent definitions instead of everyone querying tables differently." },
    { flowchartId: flowchart13_5.id, nodeId: "node3", title: "Consumption View / Query", description: "Consumption-level CDS views (analytical queries) are ready for reporting, with annotations that drive charts, KPIs, and drill-downs.", tCode: "Query Browser", tips: "The Query Browser lets users run these analytical queries directly." },
    { flowchartId: flowchart13_5.id, nodeId: "node4", title: "Analytical Fiori App / KPI Tile", description: "Business users see live dashboards and KPI tiles built on the consumption views — current numbers, no waiting.", tCode: "Fiori Launchpad", tips: "KPI tiles can show a live metric right on the home screen." },
    { flowchartId: flowchart13_5.id, nodeId: "node5", title: "Drill to Live Details", description: "From a KPI or chart, users drill down to the underlying line items in real time — insight straight to detail.", tCode: "N/A", tips: "Real-time drill-down is a key advantage over day-old warehouse reports." },
  ],
});
// Quiz for lesson 13.5
await prisma.quiz.upsert({
  where: { lessonId: lesson13_5.id },
  update: {},
  create: {
    lessonId: lesson13_5.id,
    title: "Embedded Analytics & the VDM — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What makes S/4HANA Embedded Analytics different from traditional reporting?",
          explanation: "Embedded Analytics runs reporting inside the operational S/4HANA system on live data (enabled by HANA's speed), instead of copying data overnight into a separate data warehouse and reporting on day-old data.",
          options: {
            create: [
              { text: "It reports on live data inside S/4HANA, with no overnight copy", isCorrect: true },
              { text: "It only works on data that is at least a week old", isCorrect: false },
              { text: "It requires printing every report", isCorrect: false },
              { text: "It runs entirely on the user's phone offline", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the Virtual Data Model (VDM)?",
          explanation: "The VDM is SAP's layered organization of CDS views — basic/interface views, composite views, and consumption views — that shapes raw tables into a clean, reusable, governed data model for analytics.",
          options: {
            create: [
              { text: "A layered set of CDS views (basic, composite, consumption)", isCorrect: true },
              { text: "A backup of the database", isCorrect: false },
              { text: "A printer driver", isCorrect: false },
              { text: "A user authorization role", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is building analytics on the layered VDM better than each report querying raw tables directly?",
          explanation: "The VDM provides consistent, reusable, governed definitions. Reports built on it share the same logic and meaning, whereas everyone writing their own raw-table queries leads to inconsistent, duplicated, and conflicting definitions.",
          options: {
            create: [
              { text: "It gives consistent, reusable definitions instead of conflicting ad-hoc queries", isCorrect: true },
              { text: "Raw tables cannot be queried at all", isCorrect: false },
              { text: "It makes the database slower on purpose", isCorrect: false },
              { text: "It hides all data from users", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.6: The Material Ledger in S/4HANA
const lesson13_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "material-ledger-s4hana" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "The Material Ledger in S/4HANA",
    slug: "material-ledger-s4hana",
    order: 6,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Arjun's company imports raw materials priced in US dollars but reports in rupees, and the exchange rate keeps moving. His CFO wants to know the *true* cost of inventory in multiple currencies, and how purchase price differences should flow into the cost of finished goods. In ECC this was an optional add-on; in S/4HANA, Arjun's trainer says, "The Material Ledger is always on now."

The Material Ledger gives accurate, multi-currency inventory valuation — and it's mandatory in S/4HANA.`,
    content: `## What Is the Material Ledger?

The **Material Ledger (ML)** is the part of SAP that values inventory with precision — tracking material costs in **multiple currencies** and supporting **actual costing** (the real cost of materials over a period, not just a fixed standard price). In **S/4HANA, the Material Ledger is mandatory** (active for all valuated materials), whereas in ECC it was optional.

## Two Big Capabilities

### 1. Multiple Currency Valuation
Inventory value can be held in **several currencies in parallel** — e.g. company currency (INR), group currency (USD), and more. This matters for global companies that must report inventory under different currencies and accounting standards, all kept consistent.

### 2. Actual Costing (Optional but Powerful)
Most companies value materials at a **standard price** (a planned cost) during the period for simplicity. But real costs differ — exchange rates move, purchase prices vary, production costs fluctuate. **Actual Costing** collects these **variances** and, at period-end, calculates the **actual cost** (a Periodic Unit Price), then can revalue inventory and roll differences up through the production chain to finished goods.

## Standard Price vs Actual Cost

| | Standard Price | Actual Costing (ML) |
|--|----------------|---------------------|
| During period | Fixed planned price | Postings at standard, variances collected |
| Period-end | Variances sit in price-difference accounts | Variances rolled into a real Periodic Unit Price |
| Inventory value | Planned | Revalued to actual |
| Insight | Limited | True cost, including price/rate changes |

## Why "Mandatory" in S/4HANA?

Making ML always-on standardizes inventory valuation and unlocks parallel-currency inventory for everyone, fitting the Universal Journal's single-source-of-truth design. Note: **mandatory Material Ledger ≠ mandatory Actual Costing** — ML (multi-currency valuation) is always on; **Actual Costing is still an optional choice** a company activates if it wants period-end actual costs.

## Where It Lives Now

In S/4HANA, material ledger data is integrated with the Universal Journal, so inventory valuation and its currencies sit alongside the rest of finance in one consistent model.

## A Real Example

Arjun's imported materials:
- The Material Ledger holds inventory value in **INR and USD** in parallel — the CFO sees both.
- The company activates **Actual Costing**: during the month, goods are received at standard price and the dollar-rate and purchase-price **variances** are collected.
- At month-end, ML computes the **actual (periodic) unit price**, revalues inventory, and rolls the differences into the cost of finished goods — revealing the true cost.

## Why It Matters

The Material Ledger gives accurate, multi-currency inventory valuation and, with Actual Costing, the true cost of materials and products. Because it's mandatory in S/4HANA, every consultant must understand it — and must know the nuance that ML is always on while Actual Costing remains an optional activation.`,
    keyConceptTitle: "Material Ledger: Multi-Currency Valuation, Mandatory in S/4HANA",
    keyConceptBody: `- The **Material Ledger (ML)** values inventory in **multiple currencies** in parallel and supports **Actual Costing** (real period costs vs a fixed standard price).
- In **S/4HANA the ML is mandatory** (always on) — but **Actual Costing remains optional**; companies activate it to get period-end actual unit prices.
- Actual Costing collects variances during the period, then computes a **Periodic Unit Price**, revalues inventory, and rolls differences up to finished goods.`,
  },
});
// Flowchart for lesson 13.6
const flowchart13_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_6.id },
  update: {},
  create: {
    lessonId: lesson13_6.id,
    title: "Actual Costing with the Material Ledger",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🏷️ Post at Standard Price" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 120 }, data: { label: "📊 Collect Variances (Price/Rate)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 120 }, data: { label: "🧮 Period-End: Actual Price (ML)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 510, y: 260 }, data: { label: "💱 Inventory in Multiple Currencies" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 740, y: 120 }, data: { label: "✅ Revalue & Roll to Finished Goods" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node5", type: "default" },
      { id: "e4", source: "node3", target: "node4", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_6.id, nodeId: "node1", title: "Post at Standard Price", description: "During the period, goods movements are valued at a fixed standard price for simplicity and stable day-to-day reporting.", tCode: "MM postings", tips: "Standard price keeps operational postings simple; the truth is reconciled at period-end." },
    { flowchartId: flowchart13_6.id, nodeId: "node2", title: "Collect Variances", description: "Differences between standard and real costs — purchase price variances and exchange-rate differences — are collected by the Material Ledger.", tCode: "Material Ledger", tips: "These variances are exactly what makes the actual cost differ from the standard." },
    { flowchartId: flowchart13_6.id, nodeId: "node3", title: "Period-End: Actual Price", description: "With Actual Costing active, the ML calculates the Periodic Unit Price — the real average cost for the period including all variances.", tCode: "CKMLCP (costing cockpit)", tips: "Actual Costing is optional; ML's multi-currency valuation is always on in S/4HANA." },
    { flowchartId: flowchart13_6.id, nodeId: "node4", title: "Inventory in Multiple Currencies", description: "The ML holds inventory value in parallel currencies (e.g. INR and USD), so global reporting is consistent across currencies.", tCode: "Material Ledger", tips: "Parallel-currency inventory is a key reason ML is mandatory for all valuated materials." },
    { flowchartId: flowchart13_6.id, nodeId: "node5", title: "Revalue & Roll Up", description: "At period-end the actual cost revalues remaining inventory and rolls variances up through the production chain into finished-goods cost.", tCode: "CKMLCP", tips: "Rolling variances to finished goods reveals the true cost of what you produced and sold." },
  ],
});
// Quiz for lesson 13.6
await prisma.quiz.upsert({
  where: { lessonId: lesson13_6.id },
  update: {},
  create: {
    lessonId: lesson13_6.id,
    title: "The Material Ledger — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the status of the Material Ledger in S/4HANA compared to ECC?",
          explanation: "In ECC the Material Ledger was optional; in S/4HANA it is mandatory (always active for valuated materials), standardizing inventory valuation and enabling parallel-currency valuation for everyone.",
          options: {
            create: [
              { text: "It is mandatory in S/4HANA, whereas it was optional in ECC", isCorrect: true },
              { text: "It was removed in S/4HANA", isCorrect: false },
              { text: "It is still optional and rarely used", isCorrect: false },
              { text: "It only works in ECC", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is a key capability the Material Ledger provides for a global company?",
          explanation: "The Material Ledger holds inventory value in multiple currencies in parallel (e.g. company and group currency), which is essential for global companies reporting under different currencies and standards.",
          options: {
            create: [
              { text: "Inventory valuation in multiple currencies in parallel", isCorrect: true },
              { text: "Automatic hiring of employees", isCorrect: false },
              { text: "Printing customer invoices", isCorrect: false },
              { text: "Scheduling production orders", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A consultant says 'the Material Ledger is mandatory, so Actual Costing is always used.' Why is this statement inaccurate?",
          explanation: "Mandatory Material Ledger is not the same as mandatory Actual Costing. ML (multi-currency valuation) is always on in S/4HANA, but Actual Costing — the period-end calculation of actual unit prices — remains an optional feature a company chooses to activate.",
          options: {
            create: [
              { text: "ML is always on, but Actual Costing is still an optional activation", isCorrect: true },
              { text: "Actual Costing was deleted from SAP", isCorrect: false },
              { text: "The Material Ledger is actually optional", isCorrect: false },
              { text: "Standard price is illegal in S/4HANA", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.7: Central Finance
const lesson13_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "central-finance" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "Central Finance",
    slug: "central-finance",
    order: 7,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A large group runs three different ERP systems from past acquisitions — two old SAP ECC systems and one non-SAP system. The CFO can't get a single, consolidated view of finances without weeks of spreadsheet work. The group isn't ready to rip out and replace everything. A consultant suggests, "Use Central Finance — bring all the financial postings into one S/4HANA system, without replacing the source systems yet."

Central Finance is a way to unify financial reporting across many systems as a first step toward S/4HANA.`,
    content: `## The Problem: Many ERPs, No Single View

Big organizations often run **multiple ERP systems** — several SAP systems plus non-SAP ones, often from mergers and acquisitions. Getting consolidated, real-time group financials is painful, and a full "rip and replace" migration to one system is risky and slow.

## What Is Central Finance?

**Central Finance (CFIN)** is a deployment option of S/4HANA that creates **one central S/4HANA Finance system** which **replicates financial postings** from all the source systems in **real time**. The source ERPs keep running; their financial documents are mirrored into the central system, giving one unified financial picture.

Think of it as a **financial hub**: the source systems keep operating, but every financial posting also flows into a central S/4HANA where consolidated reporting and processes live.

## How It Works

| Step | What happens |
|------|--------------|
| **Source systems run** | ECC, other SAP, or non-SAP ERPs keep operating normally |
| **Replication (SLT)** | SAP Landscape Transformation (SLT) replicates postings in real time |
| **Mapping** | Different charts of accounts, cost centers, etc. are mapped to central definitions |
| **Central S/4HANA** | Receives postings into the Universal Journal — one consolidated view |

A key challenge is **mapping**: source systems may use different account numbers, company codes, or cost center IDs, so CFIN maps them to harmonized central values.

## Why Companies Use It

- **Single source of financial truth** across a diverse landscape — for group reporting and analytics.
- **Non-disruptive** — no need to replace source ERPs immediately.
- **A stepping stone** — start getting S/4HANA finance value now; migrate source systems later.
- Enables **central processes** (e.g. central payments, central reporting) over time.

## What It Is *Not*

Central Finance is primarily about **finance replication and reporting** — it doesn't run the source systems' logistics. It's a finance-focused convergence approach, not a full operational migration. Many companies use it as **phase one** of a longer S/4HANA journey.

## A Real Example

The group's three ERPs:
- Two ECC systems and one non-SAP ERP keep running their daily operations.
- **SLT** replicates every financial posting from all three into a **central S/4HANA Finance** system in real time.
- Differing account numbers are **mapped** to one harmonized chart of accounts.
- The CFO now sees **consolidated, real-time group financials** in one place — and the group plans to migrate the source systems to S/4HANA later, with CFIN as the foundation.

## Why It Matters

Central Finance solves a very common enterprise problem: unifying finance across many systems without a risky big-bang replacement. It delivers a single financial truth and central processes now, while serving as a low-risk first step toward full S/4HANA — making it a strategically important deployment option to understand.`,
    keyConceptTitle: "Central Finance Unifies Financials from Many Systems in Real Time",
    keyConceptBody: `- **Central Finance (CFIN)** is an S/4HANA deployment that **replicates financial postings** from multiple source ERPs (SAP and non-SAP) into one central S/4HANA, in real time via **SLT**.
- Source systems keep running (non-disruptive); a key task is **mapping** different accounts/cost centers to harmonized central values.
- It delivers a **single source of financial truth** for group reporting and is often **phase one** of a broader S/4HANA journey — focused on finance, not full operational migration.`,
  },
});
// Flowchart for lesson 13.7
const flowchart13_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_7.id },
  update: {},
  create: {
    lessonId: lesson13_7.id,
    title: "How Central Finance Consolidates Postings",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 60 }, data: { label: "🏢 Source: ECC System" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 60, y: 170 }, data: { label: "🏢 Source: Non-SAP ERP" }, style: { background: "#94A3B8", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 280, y: 120 }, data: { label: "🔄 Real-Time Replication (SLT)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 500, y: 120 }, data: { label: "🗺️ Map Accounts / Cost Centers" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 730, y: 120 }, data: { label: "🚀 Central S/4HANA Finance" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 730, y: 260 }, data: { label: "📊 Consolidated Group Reporting" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node3", type: "default" },
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
    { flowchartId: flowchart13_7.id, nodeId: "node1", title: "Source: ECC System", description: "An existing SAP ECC system keeps running its full operations; its financial postings will be replicated to the central system.", tCode: "ECC", tips: "Source systems are undisturbed — Central Finance is non-intrusive to daily operations." },
    { flowchartId: flowchart13_7.id, nodeId: "node2", title: "Source: Non-SAP ERP", description: "Central Finance can also ingest postings from non-SAP systems, making it useful for mixed landscapes from acquisitions.", tCode: "N/A (3rd-party adapters)", tips: "Non-SAP sources usually need an interface/adapter to feed postings in." },
    { flowchartId: flowchart13_7.id, nodeId: "node3", title: "Real-Time Replication (SLT)", description: "SAP Landscape Transformation (SLT) replicates financial documents from the sources into Central Finance in real time.", tCode: "SLT", tips: "Real-time replication is what makes the central view current, not a nightly batch." },
    { flowchartId: flowchart13_7.id, nodeId: "node4", title: "Map Accounts / Cost Centers", description: "Source systems use different account numbers and org IDs, so CFIN maps them to harmonized central master data. This mapping is a major project effort.", tCode: "CFIN mapping (MDG)", tips: "Mapping quality makes or breaks Central Finance — plan it carefully." },
    { flowchartId: flowchart13_7.id, nodeId: "node5", title: "Central S/4HANA Finance", description: "The central system receives mapped postings into the Universal Journal, providing one consolidated finance system over many sources.", tCode: "S/4HANA (ACDOCA)", tips: "Because it lands in ACDOCA, central data gets all the Universal Journal benefits." },
    { flowchartId: flowchart13_7.id, nodeId: "node6", title: "Consolidated Group Reporting", description: "With all financials in one place, the group gets real-time consolidated reporting and can run central finance processes.", tCode: "Fiori analytics", tips: "This single financial truth is the main reason companies adopt Central Finance." },
  ],
});
// Quiz for lesson 13.7
await prisma.quiz.upsert({
  where: { lessonId: lesson13_7.id },
  update: {},
  create: {
    lessonId: lesson13_7.id,
    title: "Central Finance — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does Central Finance do?",
          explanation: "Central Finance replicates financial postings from multiple source ERP systems (SAP and non-SAP) into one central S/4HANA Finance system in real time, giving a single consolidated financial view while the source systems keep running.",
          options: {
            create: [
              { text: "Replicates financial postings from many systems into one central S/4HANA", isCorrect: true },
              { text: "Deletes all source ERP systems immediately", isCorrect: false },
              { text: "Runs the logistics of every source system", isCorrect: false },
              { text: "Is a Fiori theming tool", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why is Central Finance considered a non-disruptive, stepping-stone approach?",
          explanation: "The source systems keep operating normally while their financials are mirrored centrally. Companies gain consolidated S/4HANA finance value immediately without a risky big-bang replacement, and can migrate the source systems later.",
          options: {
            create: [
              { text: "Source systems keep running while finance is unified centrally", isCorrect: true },
              { text: "It forces an immediate full system replacement", isCorrect: false },
              { text: "It only works if you have a single ERP already", isCorrect: false },
              { text: "It disables reporting until migration is complete", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is data mapping a major part of a Central Finance project?",
          explanation: "Different source systems use different account numbers, company codes, and cost center IDs. CFIN must map these to harmonized central values so the consolidated data is consistent and meaningful — poor mapping undermines the whole solution.",
          options: {
            create: [
              { text: "Sources use different accounts/IDs that must be harmonized centrally", isCorrect: true },
              { text: "Mapping changes the source systems' currencies", isCorrect: false },
              { text: "Mapping is only about choosing screen colors", isCorrect: false },
              { text: "There is no mapping needed at all", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.8: S/4HANA Cloud vs On-Premise
const lesson13_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4hana-cloud-vs-onpremise" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "S/4HANA Cloud vs On-Premise",
    slug: "s4hana-cloud-vs-onpremise",
    order: 8,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `A company is choosing how to run S/4HANA. One executive wants the freedom to customize everything and control the upgrade timing; another wants SAP to manage everything and deliver innovations automatically. Priya, advising them, explains there isn't one "S/4HANA" — there are different editions with real trade-offs between control and simplicity.

Understanding Cloud vs On-Premise is essential to choosing the right S/4HANA and setting the right expectations.`,
    content: `## Not One Product — A Spectrum

"S/4HANA" comes in deployment options that trade **control** against **simplicity and speed of innovation**. The two ends are **On-Premise** and **Public Cloud**, with **Private Cloud** in between (often via RISE with SAP).

## The Main Options

| Option | Who runs it | Customization | Upgrades |
|--------|-------------|---------------|----------|
| **On-Premise** | You (your data center / IaaS) | Maximum — full code access | You decide when (yearly cycle) |
| **Private Cloud** | SAP-managed, dedicated to you | High — close to on-premise | SAP-managed, more guided |
| **Public Cloud** | SAP-managed, shared (SaaS) | Limited — extend via BTP | Automatic, frequent (e.g. quarterly) |

## On-Premise: Maximum Control

You install and run S/4HANA (in your own data center or on cloud infrastructure you manage). You get the **fullest scope** and can modify deeply, and you choose **when to upgrade** (typically a yearly release). The trade-off: **you** carry the work of operations, maintenance, and upgrades.

## Public Cloud: Maximum Simplicity

A true **SaaS** offering: SAP runs and maintains everything, and delivers **automatic, frequent updates** (so you always have the latest innovation). The trade-off: **standardized scope** and **limited in-system customization** — you adapt via **key-user tools and BTP extensions**, keeping a "clean core." It's faster to adopt and lower-maintenance, but you fit your processes closer to SAP standard.

## Private Cloud: The Middle Ground

**Private Cloud** (commonly delivered through **RISE with SAP**) gives a dedicated, SAP-managed environment with **on-premise-like flexibility** but cloud operations. It's popular with companies that want cloud benefits without giving up the broader customization and migration path of on-premise.

## The Core Trade-Off

| You value... | Lean toward |
|--------------|-------------|
| Deep customization, control of timing | On-Premise / Private Cloud |
| Lowest maintenance, automatic innovation | Public Cloud |
| Cloud ops but rich flexibility | Private Cloud (RISE) |

There's no universally "best" — it depends on how much a company needs to customize versus how much it values simplicity and continuous innovation.

## A Real Example

Priya's advice to the two executives:
- The one wanting **deep customization and control of upgrade timing** → lean **On-Premise** (or Private Cloud for managed ops).
- The one wanting **SAP to manage everything with automatic innovation** → lean **Public Cloud**, adapting via key-user tools and BTP.
- She notes **Private Cloud via RISE** as a middle path that many choose.

## Why It Matters

The deployment choice shapes cost, customization, upgrade cadence, and who does the heavy lifting. Knowing the differences — and that Public Cloud favors standardization with BTP extensions while On-Premise favors control — lets you set correct expectations and guide a sound S/4HANA strategy.`,
    keyConceptTitle: "Cloud vs On-Premise Trades Simplicity for Control",
    keyConceptBody: `- **On-Premise**: you run it, with maximum customization and control over upgrade timing — but you carry operations and maintenance.
- **Public Cloud (SaaS)**: SAP manages everything with automatic, frequent updates, but scope is standardized and you extend via **key-user tools and BTP** (clean core).
- **Private Cloud (often RISE with SAP)** is the middle ground: SAP-managed operations with near on-premise flexibility. The choice trades simplicity/innovation against control/customization.`,
  },
});
// Flowchart for lesson 13.8
const flowchart13_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_8.id },
  update: {},
  create: {
    lessonId: lesson13_8.id,
    title: "Choosing an S/4HANA Deployment",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 40 }, data: { label: "🚀 How to Run S/4HANA?" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 60, y: 180 }, data: { label: "🏛️ On-Premise (Max Control)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 180 }, data: { label: "🏢 Private Cloud (RISE)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 540, y: 180 }, data: { label: "☁️ Public Cloud (SaaS)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 540, y: 300 }, data: { label: "🧩 Extend via Key User + BTP" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node1", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_8.id, nodeId: "node1", title: "How to Run S/4HANA?", description: "The deployment decision balances control and customization against simplicity and speed of innovation. There's no one-size-fits-all answer.", tCode: "N/A", tips: "Frame the choice around how much the business must customize versus how much it values low maintenance." },
    { flowchartId: flowchart13_8.id, nodeId: "node2", title: "On-Premise (Max Control)", description: "You run S/4HANA yourself with the fullest scope and deep customization, choosing your own upgrade timing — but you own operations and maintenance.", tCode: "N/A", tips: "Best when deep customization and control of upgrade timing matter most." },
    { flowchartId: flowchart13_8.id, nodeId: "node3", title: "Private Cloud (RISE)", description: "A dedicated, SAP-managed environment with near on-premise flexibility but cloud operations — commonly delivered via RISE with SAP.", tCode: "RISE with SAP", tips: "Popular middle path: cloud operations without giving up broad customization." },
    { flowchartId: flowchart13_8.id, nodeId: "node4", title: "Public Cloud (SaaS)", description: "SAP runs and maintains everything and pushes automatic, frequent updates. Scope is standardized; you adapt within guardrails.", tCode: "N/A", tips: "Fastest to adopt and lowest maintenance, but expect to fit closer to SAP standard." },
    { flowchartId: flowchart13_8.id, nodeId: "node5", title: "Extend via Key User + BTP", description: "In Public Cloud you don't modify the core; you extend with key-user tools and side-by-side BTP apps, keeping a clean core for smooth updates.", tCode: "BTP / Key User tools", tips: "Clean-core extensibility is the cloud way to customize without blocking auto-updates." },
  ],
});
// Quiz for lesson 13.8
await prisma.quiz.upsert({
  where: { lessonId: lesson13_8.id },
  update: {},
  create: {
    lessonId: lesson13_8.id,
    title: "S/4HANA Cloud vs On-Premise — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the core trade-off between S/4HANA Public Cloud and On-Premise?",
          explanation: "Public Cloud offers simplicity and automatic innovation (SAP manages it, frequent updates) but standardized scope and limited in-system customization. On-Premise offers maximum control and customization but you carry operations and upgrade work. It's simplicity vs control.",
          options: {
            create: [
              { text: "Cloud gives simplicity/auto-innovation; On-Premise gives control/customization", isCorrect: true },
              { text: "Cloud allows more customization than On-Premise", isCorrect: false },
              { text: "On-Premise updates automatically every week", isCorrect: false },
              { text: "They are identical in every way", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "In S/4HANA Public Cloud, how do you customize since you can't modify the core?",
          explanation: "Public Cloud keeps a clean core, so you adapt using key-user extensibility tools and side-by-side extensions on SAP BTP — not by changing the standard code. This keeps automatic updates flowing smoothly.",
          options: {
            create: [
              { text: "Through key-user tools and BTP side-by-side extensions", isCorrect: true },
              { text: "By rewriting SAP's standard source code", isCorrect: false },
              { text: "Customization is completely impossible", isCorrect: false },
              { text: "By switching to On-Premise temporarily", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A company wants cloud-managed operations but still needs broad customization and a familiar migration path. Which option fits best?",
          explanation: "Private Cloud (commonly via RISE with SAP) is the middle ground: SAP manages operations while the company retains near on-premise flexibility and customization — ideal when both cloud ops and broad customization are required.",
          options: {
            create: [
              { text: "Private Cloud (e.g. via RISE with SAP)", isCorrect: true },
              { text: "Public Cloud only", isCorrect: false },
              { text: "Neither — it's impossible", isCorrect: false },
              { text: "A spreadsheet instead of SAP", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.9: SAP Activate Methodology
const lesson13_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "sap-activate-methodology" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "SAP Activate Methodology",
    slug: "sap-activate-methodology",
    order: 9,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Karthik is joining his first S/4HANA implementation project. He's heard horror stories of projects that dragged on for years and missed their goals. His project manager reassures him: "We follow SAP Activate — a proven, phased methodology with ready-made best practices, so we don't start from a blank page." Karthik wonders what those phases are and how they keep a project on track.

SAP Activate is the standard framework that structures how S/4HANA projects are delivered.`,
    content: `## Why a Methodology?

Implementing an ERP is complex and risky. A **methodology** gives a proven, repeatable structure — phases, deliverables, and accelerators — so teams don't reinvent the approach or get lost. **SAP Activate** is SAP's official implementation methodology for S/4HANA.

## The Three Pillars of SAP Activate

SAP Activate rests on three things working together:

| Pillar | What it provides |
|--------|------------------|
| **SAP Best Practices** | Ready-made standard processes and configuration to start from |
| **Guided Configuration** | Tools to adopt and adjust those processes |
| **A phased methodology** | The project roadmap (the phases below) |

The big idea: **start from SAP Best Practices** (a working baseline) rather than a blank system, then adjust — this is **fit-to-standard**, not endless custom build.

## The Phases

SAP Activate runs in clear phases:

| Phase | Purpose |
|-------|---------|
| **Discover** | Explore S/4HANA value, trial system, build the business case |
| **Prepare** | Plan the project, set up the team, initial environment |
| **Explore** | Fit-to-standard workshops: see best practices, identify gaps |
| **Realize** | Configure, build, test in iterative sprints |
| **Deploy** | Final prep, cutover, go-live |
| **Run** | Operate, optimize, adopt new innovations |

## Fit-to-Standard, Not Fit-to-Gap

A defining shift: in **Explore**, teams run **fit-to-standard** workshops — they look at how SAP Best Practices already do a process and adapt the business to it where sensible, capturing only genuine **gaps** for extension. This contrasts with old "blueprint from scratch" approaches and supports a **clean core**.

## Agile and Iterative

The **Realize** phase is **agile** — configuration and testing happen in iterative **sprints** with regular feedback, rather than one giant build at the end. This catches issues early and keeps the business involved.

## A Real Example

Karthik's project:
- **Discover/Prepare**: business case made, team and trial system set up.
- **Explore**: fit-to-standard workshops show the SAP Best Practice order-to-cash; the team confirms most of it fits and logs a couple of true gaps.
- **Realize**: they configure and test in sprints, building only the agreed gap extensions on BTP.
- **Deploy**: cutover and go-live. **Run**: optimize and adopt the next innovations.
- The phased, best-practice-first approach keeps the project focused and on schedule.

## Why It Matters

SAP Activate makes S/4HANA projects faster and lower-risk by starting from best practices, working agile, and following proven phases. Understanding the phases and the fit-to-standard mindset is essential for anyone joining an S/4HANA implementation — it's the shared language of how the project runs.`,
    keyConceptTitle: "SAP Activate: Phased, Best-Practice-First, Agile Delivery",
    keyConceptBody: `- **SAP Activate** is SAP's implementation methodology built on three pillars: **SAP Best Practices**, **Guided Configuration**, and a **phased roadmap**.
- Its phases are **Discover → Prepare → Explore → Realize → Deploy → Run**, with the Realize phase run **agile (sprints)**.
- The defining mindset is **fit-to-standard** — start from working best practices and adapt the business to them, capturing only true gaps (supporting a clean core).`,
  },
});
// Flowchart for lesson 13.9
const flowchart13_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_9.id },
  update: {},
  create: {
    lessonId: lesson13_9.id,
    title: "The SAP Activate Phases",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 120 }, data: { label: "🔍 Discover" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 110, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 180, y: 120 }, data: { label: "📋 Prepare" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 110, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 320, y: 120 }, data: { label: "🧭 Explore (Fit-to-Standard)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 500, y: 120 }, data: { label: "🛠️ Realize (Agile Sprints)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 680, y: 120 }, data: { label: "🚀 Deploy" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 110, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 810, y: 120 }, data: { label: "🔧 Run" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 100, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart13_9.id, nodeId: "node1", title: "Discover", description: "Explore S/4HANA's value with a trial system and build the business case for the project before committing.", tCode: "N/A", tips: "A trial/sandbox in Discover helps stakeholders see the value firsthand." },
    { flowchartId: flowchart13_9.id, nodeId: "node2", title: "Prepare", description: "Plan the project: set up the team, governance, initial system/environment, and project standards.", tCode: "N/A", tips: "Solid project setup here prevents confusion and rework later." },
    { flowchartId: flowchart13_9.id, nodeId: "node3", title: "Explore (Fit-to-Standard)", description: "Run fit-to-standard workshops to see how SAP Best Practices handle each process, adapt the business to them, and capture only genuine gaps.", tCode: "N/A", tips: "Fit-to-standard, not blueprint-from-scratch, is the modern, faster approach." },
    { flowchartId: flowchart13_9.id, nodeId: "node4", title: "Realize (Agile Sprints)", description: "Configure, build any agreed gap extensions, and test iteratively in sprints with regular business feedback.", tCode: "N/A", tips: "Iterative sprints catch issues early instead of at one big-bang test phase." },
    { flowchartId: flowchart13_9.id, nodeId: "node5", title: "Deploy", description: "Complete final preparation, data migration cutover, and go-live, moving the solution into production.", tCode: "N/A", tips: "A well-rehearsed cutover plan is critical to a smooth go-live." },
    { flowchartId: flowchart13_9.id, nodeId: "node6", title: "Run", description: "Operate and continuously optimize the live system, and adopt new innovations SAP delivers over time.", tCode: "N/A", tips: "Run isn't the end — it's ongoing improvement and innovation adoption." },
  ],
});
// Quiz for lesson 13.9
await prisma.quiz.upsert({
  where: { lessonId: lesson13_9.id },
  update: {},
  create: {
    lessonId: lesson13_9.id,
    title: "SAP Activate Methodology — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the correct order of the main SAP Activate phases?",
          explanation: "SAP Activate runs Discover → Prepare → Explore → Realize → Deploy → Run. This phased roadmap structures the whole S/4HANA implementation from business case to ongoing operation.",
          options: {
            create: [
              { text: "Discover → Prepare → Explore → Realize → Deploy → Run", isCorrect: true },
              { text: "Realize → Discover → Deploy → Prepare → Run", isCorrect: false },
              { text: "Prepare → Deploy → Explore → Run → Discover", isCorrect: false },
              { text: "Run → Deploy → Realize → Explore → Prepare", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does the 'fit-to-standard' approach in the Explore phase mean?",
          explanation: "Fit-to-standard means starting from SAP Best Practices (a working baseline) and adapting the business to them where sensible, capturing only genuine gaps for extension — rather than designing every process from a blank page. It supports a clean core.",
          options: {
            create: [
              { text: "Start from SAP Best Practices and adapt the business, logging only true gaps", isCorrect: true },
              { text: "Build every process from scratch with no templates", isCorrect: false },
              { text: "Skip all configuration entirely", isCorrect: false },
              { text: "Customize the SAP standard code heavily", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does the Realize phase use agile sprints instead of one big build at the end?",
          explanation: "Iterative sprints with regular business feedback catch issues early and keep stakeholders involved, reducing the risk of discovering major problems only at a final big-bang test. It makes delivery faster and lower-risk.",
          options: {
            create: [
              { text: "Iterative sprints catch issues early and keep the business involved", isCorrect: true },
              { text: "Agile means there is no testing at all", isCorrect: false },
              { text: "It is required to skip the Deploy phase", isCorrect: false },
              { text: "Sprints remove the need for any configuration", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.10: The Clean Core Concept
const lesson13_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "clean-core-concept" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "The Clean Core Concept",
    slug: "clean-core-concept",
    order: 10,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `An old SAP system Meena worked on was so heavily modified that every upgrade took months of fixing broken custom code — and the business was terrified to touch anything. Moving to S/4HANA, her architect insists, "This time we keep a clean core. Custom stuff goes on BTP, not inside the core." Meena wonders what exactly counts as "clean" and how you still meet custom needs without modifying the core.

Clean Core is the modern principle that keeps S/4HANA standard, stable, and easy to upgrade.`,
    content: `## The Pain Clean Core Solves

Older SAP systems were often **heavily modified** — custom code changed standard behavior everywhere. The result: **painful upgrades** (modifications conflict with new code), instability, and a business afraid to change anything. **Clean Core** is the principle that prevents this on S/4HANA.

## What "Clean Core" Means

A **clean core** means keeping the S/4HANA core **as close to standard as possible** — minimal modifications to delivered code and data — while still meeting custom needs through **approved, separated extension methods**. The core stays standard, upgradeable, and stable; your customizations live cleanly alongside it.

## The Five Dimensions of Clean Core

Clean core is broader than just code. SAP describes several dimensions:

| Dimension | Keep clean by... |
|-----------|------------------|
| **Software / Code** | Extend via released APIs and side-by-side, not core modifications |
| **Extensions** | Use key-user and developer extensibility, on stable extension points |
| **Data** | Keep master data clean and archive what's not needed |
| **Configuration** | Use standard configuration, avoid unsupported tweaks |
| **Integration** | Use released APIs and standard integration, not point hacks |
| **Processes** | Adopt standard best-practice processes (fit-to-standard) |

## How You Still Customize

Clean core doesn't mean "no customization" — it means customizing the **right way**:

- **Key-user extensibility** — in-app tweaks and custom fields (no code).
- **Developer / side-by-side extensibility on BTP** — build custom apps and logic **outside** the core, connecting via **released APIs**.
- **Released (whitelisted) APIs and extension points** — only use the stable, supported hooks SAP guarantees across upgrades.

This is the same philosophy behind ABAP Cloud, BAdIs, and BTP extensions you've seen.

## Why It Matters Strategically

| Benefit | Result |
|---------|--------|
| **Easy upgrades** | Standard core updates cleanly; extensions keep working |
| **Stability** | Fewer custom-code conflicts and surprises |
| **Faster innovation** | You can adopt SAP's new features quickly |
| **Lower cost** | Less rework and maintenance over time |

Clean core is essentially what makes **continuous innovation** (especially in the cloud) possible — you can't take frequent automatic updates if your core is full of conflicting modifications.

## A Real Example

Meena's clean-core approach:
- The team adopts **standard best-practice processes** (fit-to-standard) instead of recreating old customizations.
- A needed custom approval app is built **side-by-side on BTP**, calling S/4HANA through **released APIs** — not by editing core code.
- Small field additions use **key-user tools**.
- When SAP ships an upgrade, the **standard core updates cleanly** and the BTP extensions keep working — no months of fixing broken modifications.

## Why It Matters

Clean Core is the guiding principle of modern SAP. By keeping the core standard and pushing customization to approved, separated methods (key-user tools and BTP), it delivers easy upgrades, stability, and fast innovation. It ties together everything — fit-to-standard, BTP, key-user extensibility — into one strategy, and is essential knowledge for any S/4HANA project.`,
    keyConceptTitle: "Keep the Core Standard; Extend the Right Way",
    keyConceptBody: `- **Clean Core** means keeping S/4HANA's core as close to **standard** as possible — minimal modifications — so upgrades are easy and the system stays stable.
- You still customize, but the **right way**: **key-user extensibility**, **side-by-side BTP extensions**, and only **released APIs / extension points**.
- It spans dimensions (code, extensions, data, configuration, integration, processes) and is what enables **continuous innovation**, especially in the cloud.`,
  },
});
// Flowchart for lesson 13.10
const flowchart13_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_10.id },
  update: {},
  create: {
    lessonId: lesson13_10.id,
    title: "Customizing Without Touching the Core",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📋 Custom Requirement" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 50 }, data: { label: "🎨 Key-User Tools (No Code)" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 290, y: 180 }, data: { label: "☁️ Side-by-Side on BTP" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 120 }, data: { label: "🔌 Connect via Released APIs" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 750, y: 120 }, data: { label: "🚀 Clean Core: Easy Upgrades" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_10.id, nodeId: "node1", title: "Custom Requirement", description: "The business needs something beyond standard. Clean core asks: meet it without modifying the delivered core code or data.", tCode: "N/A", tips: "First try fit-to-standard; only extend for genuine, valuable gaps." },
    { flowchartId: flowchart13_10.id, nodeId: "node2", title: "Key-User Tools (No Code)", description: "For small adaptations — custom fields, hidden columns, simple logic — use in-app key-user extensibility with no coding.", tCode: "Custom Fields and Logic / Adapt UI", tips: "Key-user changes are stored separately, so they're upgrade-safe." },
    { flowchartId: flowchart13_10.id, nodeId: "node3", title: "Side-by-Side on BTP", description: "For bigger needs, build custom apps and logic on SAP BTP — outside the core — so the core stays standard.", tCode: "BTP", tips: "Side-by-side keeps complex custom logic away from the core entirely." },
    { flowchartId: flowchart13_10.id, nodeId: "node4", title: "Connect via Released APIs", description: "Extensions interact with S/4HANA only through released (whitelisted) APIs and stable extension points that SAP guarantees across upgrades.", tCode: "SAP API Business Hub", tips: "Using released APIs is what makes extensions survive upgrades cleanly." },
    { flowchartId: flowchart13_10.id, nodeId: "node5", title: "Clean Core: Easy Upgrades", description: "Because the core was never modified, SAP's updates apply cleanly and the extensions keep working — enabling continuous innovation.", tCode: "N/A", tips: "Clean core is the prerequisite for taking frequent cloud updates without pain." },
  ],
});
// Quiz for lesson 13.10
await prisma.quiz.upsert({
  where: { lessonId: lesson13_10.id },
  update: {},
  create: {
    lessonId: lesson13_10.id,
    title: "The Clean Core Concept — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does keeping a 'clean core' mean in S/4HANA?",
          explanation: "Clean core means keeping the S/4HANA core as close to standard as possible — with minimal modifications to delivered code and data — while meeting custom needs through approved, separated extension methods. This keeps the system stable and upgradeable.",
          options: {
            create: [
              { text: "Keeping the core standard and customizing via approved separate methods", isCorrect: true },
              { text: "Never customizing anything at all", isCorrect: false },
              { text: "Modifying the core code as much as needed", isCorrect: false },
              { text: "Deleting the core and rebuilding it", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How do you meet a complex custom requirement while keeping a clean core?",
          explanation: "Build it side-by-side on SAP BTP — outside the core — and connect to S/4HANA through released APIs. The core stays standard, and the extension survives upgrades. Modifying core code would violate clean core.",
          options: {
            create: [
              { text: "Build it on BTP and connect via released APIs", isCorrect: true },
              { text: "Modify the standard core code directly", isCorrect: false },
              { text: "Avoid meeting the requirement entirely", isCorrect: false },
              { text: "Edit the database tables by hand", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is a clean core essential for continuous innovation, especially in the cloud?",
          explanation: "Frequent automatic updates only apply smoothly if the core isn't full of conflicting modifications. A clean core lets SAP's updates apply cleanly while extensions keep working — so you can adopt new innovations quickly instead of fixing broken custom code each time.",
          options: {
            create: [
              { text: "Updates apply cleanly when the core has no conflicting modifications", isCorrect: true },
              { text: "Cloud systems never receive updates", isCorrect: false },
              { text: "Innovation requires modifying the core heavily", isCorrect: false },
              { text: "A clean core blocks all new features", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 4 COMPLETE: 16 lessons written ──────────────────────────────────



