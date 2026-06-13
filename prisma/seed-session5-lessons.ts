// ─── BTP: NEW LESSONS ─────────────────────────────────────────────────────────
// LESSON 14.3: SAP Integration Suite
const lesson14_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "sap-integration-suite" } },
  update: {},
  create: {
    moduleId: btpModule.id,
    title: "SAP Integration Suite",
    slug: "sap-integration-suite",
    order: 3,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Anjali's company runs S/4HANA for finance, Salesforce for sales, and a bank's API for payments. Right now, data is moved between them by hand and nightly spreadsheet uploads — slow and error-prone. Her manager asks, "Can't these systems just talk to each other automatically?"

That is exactly what SAP Integration Suite does: it's the BTP toolkit for connecting SAP and non-SAP systems so data flows between them automatically and reliably.`,
    content: `## The Problem: Systems That Don't Talk

Most companies run many systems — SAP and non-SAP, cloud and on-premise. Without integration, people copy data between them manually, which is slow, error-prone, and not real-time. **SAP Integration Suite** is the BTP service that connects these systems so data flows automatically.

Think of it as a **universal translator and postal service** between applications: it picks up data from one system, transforms it into the format another system expects, and delivers it.

## The Core Capabilities

| Capability | What it does |
|------------|--------------|
| **Cloud Integration** | Builds integration flows ("iFlows") that move and transform data between systems |
| **API Management** | Publishes, secures, and monitors APIs for others to consume |
| **Integration Advisor / Mapping** | Helps map and transform message formats |
| **Open Connectors** | Pre-built connectors to hundreds of third-party apps |
| **Trading Partner Management** | Handles B2B/EDI exchanges with partners |

## iFlows — The Heart of Cloud Integration

An **integration flow (iFlow)** is a visual, step-by-step pipeline: a **sender** system triggers it, the flow **transforms** the data (mapping fields, converting formats like IDoc↔JSON), and a **receiver** system gets the result. You build iFlows graphically, and SAP ships many **pre-packaged integration content** packages so you rarely start from zero.

## API Management — Doors with Guards

**API Management** lets you expose your systems' functions as **APIs** that other apps can call — but safely. It adds security (keys, OAuth), traffic limits (so one caller can't overload you), and analytics (who called what, how often). It's like putting a guarded, monitored front door on your data.

## Why on BTP?

Because Integration Suite runs on BTP, it's cloud-based, scalable, and pre-connected to SAP systems. It supports the **clean core** idea too — integrations live outside the core systems, not bolted into them.

## A Real Example

Anjali's three systems:
- An **iFlow** in Cloud Integration listens for a new sales order in Salesforce.
- It **transforms** the Salesforce format into what S/4HANA expects and creates the order via a released API (BAPI/OData).
- When payment is due, **API Management** exposes a secured payment API the bank calls.
- No more manual spreadsheets — data flows automatically and is monitored end to end.

## Why It Matters

Integration Suite is how modern SAP landscapes connect everything. It replaces fragile manual data transfers with automated, secure, monitored flows — essential when companies run a mix of SAP and non-SAP cloud and on-premise systems. It's one of BTP's most-used services.`,
    keyConceptTitle: "Integration Suite Connects SAP and Non-SAP Systems Automatically",
    keyConceptBody: `- **SAP Integration Suite** is the BTP toolkit for connecting systems so data flows automatically instead of by manual upload.
- **Cloud Integration** builds visual **iFlows** (sender → transform → receiver), with pre-packaged content to avoid starting from scratch.
- **API Management** safely exposes functions as APIs with security, rate limits, and analytics; running on BTP keeps integrations outside the core (clean core).`,
  },
});
// Flowchart for lesson 14.3
const flowchart14_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson14_3.id },
  update: {},
  create: {
    lessonId: lesson14_3.id,
    title: "How an iFlow Connects Two Systems",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📤 Sender System (e.g. Salesforce)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 120 }, data: { label: "☁️ iFlow: Transform & Map" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 520, y: 120 }, data: { label: "🔌 Released API of Receiver" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 740, y: 120 }, data: { label: "🚀 Receiver System (S/4HANA)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 290, y: 260 }, data: { label: "🛡️ API Management Secures & Monitors" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node5", target: "node3", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart14_3.id, nodeId: "node1", title: "Sender System", description: "The system where the data originates — for example a new sales order created in Salesforce — triggers the integration.", tCode: "N/A", tips: "A sender can be SAP or non-SAP; Integration Suite connects both." },
    { flowchartId: flowchart14_3.id, nodeId: "node2", title: "iFlow: Transform & Map", description: "The integration flow converts the sender's data format and maps fields into what the receiver expects (e.g. JSON to IDoc).", tCode: "Cloud Integration", tips: "Use pre-packaged integration content where possible instead of building iFlows from scratch." },
    { flowchartId: flowchart14_3.id, nodeId: "node3", title: "Released API of Receiver", description: "The transformed data is delivered through the receiver's released API (OData/BAPI), so the core stays standard and upgrade-safe.", tCode: "SAP API Business Hub", tips: "Always integrate through released APIs, never by writing directly to tables." },
    { flowchartId: flowchart14_3.id, nodeId: "node4", title: "Receiver System", description: "The target system (e.g. S/4HANA) receives the data and creates the record — automatically, with no manual upload.", tCode: "S/4HANA", tips: "End-to-end automation removes the spreadsheet step entirely." },
    { flowchartId: flowchart14_3.id, nodeId: "node5", title: "API Management", description: "When you expose your own functions as APIs, API Management adds security (keys/OAuth), rate limits, and usage analytics.", tCode: "API Management", tips: "Rate limits protect your systems from being overwhelmed by a single caller." },
  ],
});
// Quiz for lesson 14.3
await prisma.quiz.upsert({
  where: { lessonId: lesson14_3.id },
  update: {},
  create: {
    lessonId: lesson14_3.id,
    title: "SAP Integration Suite — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is an iFlow (integration flow) in SAP Integration Suite?",
          explanation: "An iFlow is a visual pipeline that takes data from a sender system, transforms/maps it, and delivers it to a receiver system. It's how Cloud Integration moves data automatically between systems.",
          options: {
            create: [
              { text: "A visual pipeline that moves and transforms data between systems", isCorrect: true },
              { text: "A type of financial report", isCorrect: false },
              { text: "A user login screen", isCorrect: false },
              { text: "A database backup job", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does API Management add when you expose a system's functions as an API?",
          explanation: "API Management wraps APIs with security (keys/OAuth), traffic/rate limits, and usage analytics — like a guarded, monitored front door — so APIs can be shared safely without overloading or exposing the backend.",
          options: {
            create: [
              { text: "Security, rate limits, and usage analytics around the API", isCorrect: true },
              { text: "It deletes the underlying system", isCorrect: false },
              { text: "It prints the API to paper", isCorrect: false },
              { text: "It makes the API impossible to call", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is connecting systems through Integration Suite better than manual spreadsheet uploads between them?",
          explanation: "Integration Suite automates the data exchange — it's real-time (or scheduled), reliable, monitored, and secure — eliminating the slow, error-prone manual copying. It also keeps integration logic outside the core systems.",
          options: {
            create: [
              { text: "It's automated, reliable, monitored, and removes manual errors", isCorrect: true },
              { text: "Spreadsheets are faster and more accurate", isCorrect: false },
              { text: "It stops the systems from working", isCorrect: false },
              { text: "It requires no data at all", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 14.4: SAP HANA Cloud on BTP
const lesson14_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "hana-cloud-on-btp" } },
  update: {},
  create: {
    moduleId: btpModule.id,
    title: "SAP HANA Cloud on BTP",
    slug: "hana-cloud-on-btp",
    order: 4,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Karthik's team is building a custom app on BTP to track field-service jobs. They need a fast, reliable database to store the data — but they don't want to buy servers, install software, or hire a DBA to patch it. His architect says, "Use SAP HANA Cloud — it's the database as a service on BTP. SAP runs it; you just use it."

HANA Cloud gives you the power of the HANA database without any of the hardware or maintenance burden.`,
    content: `## Every App Needs a Database

The custom apps you build on BTP need somewhere to store data. **SAP HANA Cloud** is BTP's **database-as-a-service (DBaaS)** — the in-memory HANA database, delivered as a managed cloud service. You provision it in minutes and use it; SAP handles the servers, patching, and backups.

Think of it like electricity from the grid versus running your own generator: you get the power without owning and maintaining the machinery.

## On-Premise HANA vs HANA Cloud

| Aspect | On-Premise HANA | HANA Cloud |
|--------|-----------------|------------|
| Who manages it | You (install, patch, back up) | SAP (fully managed) |
| Provisioning | Buy hardware, install | Minutes, in the BTP cockpit |
| Scaling | Buy more hardware | Adjust capacity on demand |
| Cost model | Capital + ops | Subscription |
| Use | Run on your servers | Cloud, integrated with BTP |

Same powerful in-memory engine — but no infrastructure to own.

## Key Capabilities

- **In-memory speed** — data lives in RAM and is column-stored, so queries and analytics are very fast (the core HANA advantage).
- **Elastic scaling** — grow or shrink compute and storage as your app needs change.
- **Multi-model** — beyond tables, it handles JSON documents, graph, spatial, and vector data.
- **Data federation** — it can query data in other sources without copying it all in.

## Where It Fits in BTP

HANA Cloud is the standard database behind BTP apps:
- A **CAP** (Cloud Application Programming) app stores its data in HANA Cloud.
- Analytics and CDS-based models run on it.
- It connects to other BTP services and can be accessed by SAP Analytics Cloud.

## Provisioning Is Easy

In the BTP cockpit, you create a HANA Cloud **instance**, choose its size, and it's ready shortly. You can **stop/start** it to save cost (e.g. pause non-production instances overnight). No operating system, no manual patching.

## A Real Example

Karthik's field-service app:
- In the **BTP cockpit**, he provisions a **HANA Cloud** instance in minutes — no hardware order.
- His **CAP** app stores jobs, technicians, and parts in it, querying with full in-memory speed.
- As usage grows, he **scales up** the instance with a few clicks; SAP handles patching and backups.
- He stops the dev instance at night to save money.

## Why It Matters

HANA Cloud lets teams build data-driven BTP apps with enterprise-grade, in-memory database power — without buying hardware, installing software, or maintaining a database team. It's the managed data foundation for modern SAP development and a core BTP service.`,
    keyConceptTitle: "HANA Cloud Is the In-Memory Database as a Managed Service",
    keyConceptBody: `- **SAP HANA Cloud** is BTP's **database-as-a-service** — the in-memory HANA engine, fully managed by SAP (no hardware, patching, or backups for you).
- Versus on-premise HANA, it's provisioned in minutes, **scales on demand**, and is multi-model (tables, JSON, graph, spatial, vector).
- It's the standard data store behind BTP apps (e.g. CAP) and analytics; you can stop/start instances to save cost.`,
  },
});
// Flowchart for lesson 14.4
const flowchart14_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson14_4.id },
  update: {},
  create: {
    lessonId: lesson14_4.id,
    title: "Using HANA Cloud for a BTP App",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🖱️ Provision Instance in BTP Cockpit" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "📐 Choose Size / Capacity" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 520, y: 120 }, data: { label: "💾 App Stores Data (CAP)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 740, y: 60 }, data: { label: "⚡ In-Memory Queries / Analytics" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 740, y: 180 }, data: { label: "🔧 SAP Manages Patching/Backup" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart14_4.id, nodeId: "node1", title: "Provision Instance", description: "In the BTP cockpit you create a HANA Cloud instance in minutes — no hardware purchase or software install required.", tCode: "BTP Cockpit", tips: "Provisioning is self-service; you don't wait weeks for infrastructure." },
    { flowchartId: flowchart14_4.id, nodeId: "node2", title: "Choose Size / Capacity", description: "Select the compute and storage your app needs. You can scale it up or down later as demand changes.", tCode: "BTP Cockpit", tips: "Start modest and scale elastically — you're not locked into a fixed server." },
    { flowchartId: flowchart14_4.id, nodeId: "node3", title: "App Stores Data", description: "Your BTP app (e.g. a CAP service) uses HANA Cloud as its database, reading and writing business data.", tCode: "CAP / BAS", tips: "CAP apps map cleanly to HANA Cloud, making it the natural default database." },
    { flowchartId: flowchart14_4.id, nodeId: "node4", title: "In-Memory Queries", description: "Because data is in memory and column-stored, queries and analytics run very fast — the core HANA advantage available to your app.", tCode: "N/A", tips: "In-memory speed lets your custom app do real-time analytics on its own data." },
    { flowchartId: flowchart14_4.id, nodeId: "node5", title: "SAP Manages Operations", description: "SAP handles patching, upgrades, and backups for the managed service, so your team focuses on the app, not the database.", tCode: "N/A", tips: "Stop non-production instances overnight to reduce cost." },
  ],
});
// Quiz for lesson 14.4
await prisma.quiz.upsert({
  where: { lessonId: lesson14_4.id },
  update: {},
  create: {
    lessonId: lesson14_4.id,
    title: "SAP HANA Cloud on BTP — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is SAP HANA Cloud?",
          explanation: "HANA Cloud is BTP's database-as-a-service — the in-memory HANA database delivered as a fully managed cloud service. You provision and use it while SAP handles the servers, patching, and backups.",
          options: {
            create: [
              { text: "The in-memory HANA database delivered as a managed cloud service", isCorrect: true },
              { text: "A word processor for SAP documents", isCorrect: false },
              { text: "A Fiori theming tool", isCorrect: false },
              { text: "A payroll module", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is a key difference between on-premise HANA and HANA Cloud?",
          explanation: "With HANA Cloud, SAP manages the infrastructure (install, patch, back up) and you provision in minutes and scale on demand. On-premise HANA requires you to buy hardware and maintain the database yourself.",
          options: {
            create: [
              { text: "HANA Cloud is fully managed by SAP; on-premise you maintain yourself", isCorrect: true },
              { text: "HANA Cloud cannot store any data", isCorrect: false },
              { text: "On-premise HANA needs no hardware", isCorrect: false },
              { text: "They are completely unrelated products", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A startup wants a fast database for a new BTP app but has no budget for servers or a DBA team. Why does HANA Cloud fit?",
          explanation: "HANA Cloud removes the hardware and maintenance burden: it's provisioned in minutes, scales on demand, and SAP manages patching and backups. The team gets enterprise in-memory power as a subscription, with no infrastructure to own.",
          options: {
            create: [
              { text: "It needs no hardware/DBA — SAP manages it, and it scales on demand", isCorrect: true },
              { text: "It forces them to buy a data center", isCorrect: false },
              { text: "It can only be used after hiring 10 DBAs", isCorrect: false },
              { text: "It runs only on the user's laptop", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 14.5: SAP Build Process Automation
const lesson14_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "build-process-automation" } },
  update: {},
  create: {
    moduleId: btpModule.id,
    title: "SAP Build Process Automation",
    slug: "build-process-automation",
    order: 5,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Every time a new vendor is onboarded at Meena's company, the same tedious chain happens: someone fills a form, emails a manager for approval, then manually re-types the data into SAP and a spreadsheet. It's slow, gets forgotten, and people copy data by hand. Meena asks, "Can't we automate this whole approval-and-data-entry chain?"

SAP Build Process Automation lets business teams automate workflows and repetitive tasks — often with little or no coding.`,
    content: `## Automating the Boring, Repetitive Work

Many business processes are chains of forms, approvals, and copy-paste steps done by hand. **SAP Build Process Automation** (part of the low-code **SAP Build** family on BTP) lets you automate these — combining **workflow** (routing approvals and tasks) and **RPA** (robotic process automation — software bots that mimic human clicks/typing).

## Two Core Ingredients

| Ingredient | What it automates | Example |
|------------|-------------------|---------|
| **Workflow** | Routing tasks, approvals, decisions between people | Send a vendor request to a manager to approve |
| **RPA (bots)** | Repetitive UI/data tasks a human would do | Re-type data into a legacy screen automatically |

Together they handle both the **human decision** parts and the **mechanical data** parts of a process.

## Building Blocks

- **Process** — the overall flow you design visually (steps, conditions, approvals).
- **Forms** — screens to capture input or show information to a user.
- **Approvals** — built-in steps that route to approvers (appearing in their inbox/Build Work Zone).
- **Automations (bots)** — sequences that interact with apps/UIs or call APIs to move data.
- **Decisions** — business rules ("if amount > X, route to senior manager").

## Low-Code, Business-Friendly

A big point: this is **low-code/no-code**. Business experts ("citizen developers") build automations using a visual designer and prebuilt **content packages**, without deep programming. It includes prebuilt bots and process templates to start fast.

## How It Connects

Process Automation runs on BTP and connects to SAP and non-SAP systems through released APIs and connectors — so an automated process can read/write S/4HANA, send emails, update spreadsheets, and more, all in one flow. It supports the clean-core idea: automation sits outside the core systems.

## A Real Example

Meena's vendor onboarding:
- A **form** captures the new vendor details.
- A **decision** rule routes it: small vendors to one approver, large to two.
- An **approval** step lands in the manager's inbox; they approve on mobile.
- An **automation (bot)** then creates the vendor via a released API and updates the tracking sheet — no manual re-typing.
- The whole chain runs automatically, with nothing forgotten.

## Why It Matters

Build Process Automation removes slow, error-prone manual work by combining workflow and RPA in a low-code tool business teams can use themselves. It speeds up processes, reduces mistakes, and frees people for higher-value work — a flagship example of BTP empowering the business, not just developers.`,
    keyConceptTitle: "Automate Workflows + Repetitive Tasks, Low-Code, on BTP",
    keyConceptBody: `- **SAP Build Process Automation** combines **workflow** (routing approvals/tasks between people) and **RPA bots** (automating repetitive UI/data work).
- It's **low-code**: business experts build processes visually using forms, approvals, decisions, and automations, with prebuilt content to start fast.
- Running on BTP, it connects SAP and non-SAP systems via released APIs — automating end-to-end chains while keeping a clean core.`,
  },
});
// Flowchart for lesson 14.5
const flowchart14_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson14_5.id },
  update: {},
  create: {
    lessonId: lesson14_5.id,
    title: "An Automated Approval Process",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📝 Form Captures Request" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 120 }, data: { label: "🔀 Decision Rule Routes It" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 120 }, data: { label: "✅ Approval Step (Manager)" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 720, y: 60 }, data: { label: "🤖 Bot Creates Record (API)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 720, y: 180 }, data: { label: "🎉 Process Complete, No Manual Entry" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart14_5.id, nodeId: "node1", title: "Form Captures Request", description: "A user-friendly form collects the request data (e.g. new vendor details) to start the process — no email chain needed.", tCode: "Build Process Automation", tips: "Forms are built visually; no front-end coding required." },
    { flowchartId: flowchart14_5.id, nodeId: "node2", title: "Decision Rule Routes It", description: "Business rules decide the path automatically — for example, small requests need one approver, large ones need two.", tCode: "Decisions (Business Rules)", tips: "Keep decision logic in rules, not buried in code, so business users can change it." },
    { flowchartId: flowchart14_5.id, nodeId: "node3", title: "Approval Step", description: "The request routes to the right approver, appearing in their task inbox (e.g. via Build Work Zone or My Inbox), often actionable on mobile.", tCode: "Build Process Automation", tips: "Approvals integrate with inboxes so managers act in one place." },
    { flowchartId: flowchart14_5.id, nodeId: "node4", title: "Bot Creates Record", description: "An automation (bot) takes the approved data and creates the record in the target system via a released API — replacing manual re-typing.", tCode: "Automations / APIs", tips: "Prefer calling released APIs; use UI bots only for systems without APIs." },
    { flowchartId: flowchart14_5.id, nodeId: "node5", title: "Process Complete", description: "The end-to-end chain finishes automatically — captured, approved, and entered — with nothing forgotten and no manual data entry.", tCode: "N/A", tips: "Automation gives consistency and an audit trail the old email-and-spreadsheet method lacked." },
  ],
});
// Quiz for lesson 14.5
await prisma.quiz.upsert({
  where: { lessonId: lesson14_5.id },
  update: {},
  create: {
    lessonId: lesson14_5.id,
    title: "SAP Build Process Automation — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What two kinds of automation does SAP Build Process Automation combine?",
          explanation: "It combines workflow (routing approvals and tasks between people) and RPA — robotic process automation (bots that perform repetitive UI/data tasks a human would otherwise do). Together they automate both decisions and mechanical steps.",
          options: {
            create: [
              { text: "Workflow (approvals/tasks) and RPA bots (repetitive tasks)", isCorrect: true },
              { text: "Payroll and recruiting", isCorrect: false },
              { text: "Database backups and printing", isCorrect: false },
              { text: "Theming and translation", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Who is SAP Build Process Automation primarily designed for, given it is part of SAP Build?",
          explanation: "As part of the low-code SAP Build family, it's designed so business experts ('citizen developers') can build automations visually with little or no coding, using prebuilt content and a visual designer.",
          options: {
            create: [
              { text: "Business experts using low-code/no-code tools", isCorrect: true },
              { text: "Only expert ABAP developers", isCorrect: false },
              { text: "Database administrators exclusively", isCorrect: false },
              { text: "No one — it cannot be used by people", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "In an automated onboarding process, why use a bot (or API automation) for the final data-entry step instead of a person?",
          explanation: "The bot performs the repetitive data entry automatically, consistently, and without the errors or delays of manual re-typing. This is exactly the mechanical work RPA/automation removes, completing the chain end to end.",
          options: {
            create: [
              { text: "It enters the data automatically, consistently, and without manual errors", isCorrect: true },
              { text: "Bots are slower than humans on purpose", isCorrect: false },
              { text: "People are not allowed to use SAP at all", isCorrect: false },
              { text: "It deletes the data after entering it", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 14.6: BTP Security (Users, Roles, Identity)
const lesson14_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "btp-security-identity" } },
  update: {},
  create: {
    moduleId: btpModule.id,
    title: "BTP Security & Identity",
    slug: "btp-security-identity",
    order: 6,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Rohan built a great app on BTP, but now faces real questions: how do employees log in without yet another password, and how do we make sure only authorized people can use it? His security lead says, "Connect it to our corporate login through IAS, and control access with role collections." Rohan realizes that securing a cloud app is its own discipline.

BTP security is about who can log in (identity) and what they're allowed to do (authorizations) — done the cloud way.`,
    content: `## Two Questions: Who Are You, and What Can You Do?

Securing a BTP app comes down to two things:
- **Authentication** — proving *who* the user is (login).
- **Authorization** — deciding *what* that user is allowed to do.

BTP handles both with dedicated services, so apps don't each invent their own logins.

## Identity: IAS and IPS

| Service | Role |
|---------|------|
| **SAP Cloud Identity Services – Identity Authentication (IAS)** | The login service — authenticates users, supports single sign-on (SSO) and multi-factor authentication (MFA) |
| **Identity Provisioning (IPS)** | Syncs/provisions user accounts between systems automatically |

**IAS** is the front door: it can connect to your **corporate identity provider** (e.g. your company's Active Directory/Azure AD) so employees log in once with their normal corporate credentials — **single sign-on**. **IPS** keeps user accounts in sync across systems so you don't create users by hand everywhere.

## Authorization: Role Collections

BTP authorizations are built bottom-up:

| Layer | Meaning |
|-------|---------|
| **Scopes** | Fine-grained permissions an app defines |
| **Role templates / Roles** | App-defined bundles of scopes |
| **Role Collection** | A group of roles assigned to users/groups |
| **User / Group** | Receives role collections |

The key BTP concept is the **role collection** — you assign role collections (not individual roles) to users or to groups coming from the identity provider. So access is granted by bundling roles and mapping them to corporate groups.

## Trust and SSO

You establish **trust** between your BTP subaccount and the identity provider (IAS or a corporate IdP). Once trust is set, users authenticate centrally and BTP knows who they are — enabling SSO and consistent security across all your BTP apps.

## A Real Example

Rohan's app security:
- He sets up **trust** so **IAS** connects to the company's corporate directory.
- Employees now log in with their **normal corporate credentials (SSO)** — no new password — with **MFA** for safety.
- He creates a **role collection** bundling the app's roles and maps it to the "Field Service" corporate group.
- **IPS** keeps the user list in sync automatically.
- Only Field Service staff can use the app, and onboarding a new hire to it is automatic.

## Why It Matters

BTP security ensures cloud apps are protected and convenient: users get single sign-on with corporate credentials (via IAS), accounts stay in sync (via IPS), and access is cleanly controlled through role collections. Getting identity and authorization right is essential before any BTP app goes live.`,
    keyConceptTitle: "IAS Handles Login (SSO); Role Collections Grant Access",
    keyConceptBody: `- BTP security splits into **authentication** (who you are) and **authorization** (what you can do).
- **Identity Authentication (IAS)** is the login service — connect it to your corporate identity provider for **single sign-on** and MFA; **IPS** provisions/syncs user accounts.
- Authorizations are assigned via **role collections** (bundles of roles) mapped to users or corporate groups, after establishing **trust** with the identity provider.`,
  },
});
// Flowchart for lesson 14.6
const flowchart14_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson14_6.id },
  update: {},
  create: {
    lessonId: lesson14_6.id,
    title: "Login and Access on BTP",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "👤 User Logs In" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 120 }, data: { label: "🔐 IAS Authenticates (SSO/MFA)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 60 }, data: { label: "🏢 Trust to Corporate IdP" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 470, y: 180 }, data: { label: "🎭 Role Collection Grants Access" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 710, y: 120 }, data: { label: "✅ Authorized to Use the App" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart14_6.id, nodeId: "node1", title: "User Logs In", description: "A user tries to open a BTP app. Before anything, BTP must confirm who they are and what they may do.", tCode: "N/A", tips: "Never let an app handle raw passwords itself — delegate login to the identity service." },
    { flowchartId: flowchart14_6.id, nodeId: "node2", title: "IAS Authenticates", description: "Identity Authentication (IAS) verifies the user, supporting single sign-on and multi-factor authentication for stronger security.", tCode: "SAP Cloud Identity (IAS)", tips: "Enable MFA in IAS for an extra layer of protection beyond passwords." },
    { flowchartId: flowchart14_6.id, nodeId: "node3", title: "Trust to Corporate IdP", description: "IAS can trust the company's existing identity provider (e.g. Azure AD), so employees use their normal corporate login — true SSO.", tCode: "Trust configuration", tips: "Establishing trust is what enables one corporate login across all BTP apps." },
    { flowchartId: flowchart14_6.id, nodeId: "node4", title: "Role Collection Grants Access", description: "Authorizations are assigned through role collections (bundles of roles) mapped to users or corporate groups — controlling what they can do.", tCode: "BTP Cockpit (Role Collections)", tips: "Map role collections to corporate groups so access updates automatically as group membership changes." },
    { flowchartId: flowchart14_6.id, nodeId: "node5", title: "Authorized to Use the App", description: "With identity confirmed and a role collection assigned, the user can access exactly the app functions their role allows.", tCode: "N/A", tips: "If a user can log in but can't do something, check their role collection, not their login." },
  ],
});
// Quiz for lesson 14.6
await prisma.quiz.upsert({
  where: { lessonId: lesson14_6.id },
  update: {},
  create: {
    lessonId: lesson14_6.id,
    title: "BTP Security & Identity — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the role of Identity Authentication (IAS) on BTP?",
          explanation: "IAS is the login (authentication) service. It verifies who the user is and supports single sign-on and multi-factor authentication, and can connect to a corporate identity provider so employees use their normal credentials.",
          options: {
            create: [
              { text: "It authenticates users (login), supporting SSO and MFA", isCorrect: true },
              { text: "It stores the company's financial data", isCorrect: false },
              { text: "It designs Fiori themes", isCorrect: false },
              { text: "It runs payroll", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How are authorizations assigned to users on BTP?",
          explanation: "Through role collections — bundles of roles assigned to users or to groups from the identity provider. You don't assign raw scopes individually; you group roles into role collections and map them to users/groups.",
          options: {
            create: [
              { text: "By assigning role collections (bundles of roles) to users or groups", isCorrect: true },
              { text: "By giving everyone full admin access", isCorrect: false },
              { text: "Authorizations cannot be controlled on BTP", isCorrect: false },
              { text: "By printing a paper permission slip", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is establishing trust between BTP (IAS) and the corporate identity provider valuable for employees?",
          explanation: "With trust established, employees log in using their existing corporate credentials (single sign-on) across all BTP apps — no separate passwords to create or remember — while security stays centrally managed.",
          options: {
            create: [
              { text: "Employees get single sign-on with their existing corporate login", isCorrect: true },
              { text: "It forces a new password for every app", isCorrect: false },
              { text: "It removes all security from the apps", isCorrect: false },
              { text: "It deletes the corporate directory", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 14.7: BTP Runtimes (Cloud Foundry & Kyma)
const lesson14_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "btp-runtimes-cf-kyma" } },
  update: {},
  create: {
    moduleId: btpModule.id,
    title: "BTP Runtimes: Cloud Foundry & Kyma",
    slug: "btp-runtimes-cf-kyma",
    order: 7,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Priya's team wrote a custom BTP app and is ready to deploy it — but they hit a choice: "Cloud Foundry or Kyma runtime?" Nobody on the team is sure what the difference is or which to pick. Choosing wrong could mean rework later.

A runtime is simply the environment where your app actually runs on BTP. BTP offers a few, and knowing when to use each is a practical, important decision.`,
    content: `## What Is a "Runtime"?

A **runtime** is the environment where your application actually executes — it provides the engine, scaling, and plumbing so your code can run as a live service. On BTP you choose a runtime when you deploy an app. The two main ones are **Cloud Foundry** and **Kyma** (the older **ABAP environment** also exists for ABAP Cloud).

Think of runtimes as different kinds of **kitchens**: all let you cook, but they're set up differently and suit different cooks and dishes.

## Cloud Foundry — The Mainstream Choice

**Cloud Foundry (CF)** is BTP's most widely used runtime. You package your app (in a supported language like Node.js, Java, Python) and **push** it; CF handles running, scaling, and binding it to services like HANA Cloud. It's straightforward and well-integrated with SAP tooling (e.g. CAP apps deploy here easily as MTAs).

Best when: you want a managed, simple way to run standard cloud apps without managing infrastructure details.

## Kyma — Kubernetes-Based, Container Power

**Kyma** is BTP's **Kubernetes-based** runtime. Kubernetes is the industry standard for running **containers** (self-contained packaged apps) at scale. Kyma gives more control and power — ideal for **microservices**, event-driven apps, and teams already skilled in Kubernetes/containers.

Best when: you need container flexibility, microservice architectures, or you're bringing existing containerized workloads.

## Quick Comparison

| Aspect | Cloud Foundry | Kyma |
|--------|---------------|------|
| Based on | Cloud Foundry PaaS | Kubernetes |
| Style | Push an app, it runs | Deploy containers/microservices |
| Control vs simplicity | Simpler, managed | More control, more complexity |
| Best for | Standard cloud apps, CAP | Microservices, container teams |
| Skills needed | App developer | Kubernetes/container know-how |

## They Can Coexist

A BTP subaccount can enable more than one runtime. Many companies use **Cloud Foundry** for most business apps and **Kyma** where they need container/microservice power — picking per workload rather than one-size-fits-all.

## A Real Example

Priya's deployment choice:
- Her app is a standard CAP service with a HANA Cloud database and no special container needs → she deploys to **Cloud Foundry**, pushing it as an MTA. Simple and fully managed.
- Later, the team builds an event-driven microservice that must scale independently and reuse an existing container image → they deploy that one to **Kyma** for Kubernetes-level control.
- Both run in the same BTP account, each on the runtime that fits.

## Why It Matters

Choosing the right runtime affects how easily an app is built, deployed, scaled, and maintained. Cloud Foundry offers simplicity for typical apps; Kyma offers Kubernetes power for microservices and container-savvy teams. Knowing the difference lets you match each workload to the best environment.`,
    keyConceptTitle: "Cloud Foundry for Simplicity, Kyma for Kubernetes/Containers",
    keyConceptBody: `- A **runtime** is the environment where your BTP app actually runs; the two main ones are **Cloud Foundry** and **Kyma**.
- **Cloud Foundry**: push-an-app simplicity, well-integrated with SAP (e.g. CAP) — best for standard cloud apps.
- **Kyma**: **Kubernetes-based** for containers and microservices — more control and power for teams with container skills; both can coexist in one subaccount.`,
  },
});
// Flowchart for lesson 14.7
const flowchart14_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson14_7.id },
  update: {},
  create: {
    lessonId: lesson14_7.id,
    title: "Choosing a BTP Runtime",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 40 }, data: { label: "📦 App Ready to Deploy" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 160 }, data: { label: "❓ Need Container/Microservice Power?" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 80, y: 290 }, data: { label: "🚀 No → Cloud Foundry" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 290 }, data: { label: "🧩 Yes → Kyma (Kubernetes)" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 410 }, data: { label: "✅ App Runs on BTP" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart14_7.id, nodeId: "node1", title: "App Ready to Deploy", description: "Your application is built and you're ready to run it on BTP. First you choose the runtime that will host it.", tCode: "BAS / BTP Cockpit", tips: "Decide the runtime early — it influences how you package and deploy." },
    { flowchartId: flowchart14_7.id, nodeId: "node2", title: "Need Container/Microservice Power?", description: "Ask whether the app needs container-level control, independent microservice scaling, or reuse of container images.", tCode: "N/A", tips: "Most standard business apps don't need this — so the answer is often 'no'." },
    { flowchartId: flowchart14_7.id, nodeId: "node3", title: "No → Cloud Foundry", description: "For standard apps, Cloud Foundry lets you push the app and it runs, with easy binding to services like HANA Cloud. Simple and managed.", tCode: "Cloud Foundry (cf push / MTA)", tips: "CAP apps deploy smoothly to Cloud Foundry as multi-target applications (MTAs)." },
    { flowchartId: flowchart14_7.id, nodeId: "node4", title: "Yes → Kyma", description: "For microservices and container workloads, Kyma's Kubernetes base gives fine-grained control, independent scaling, and event-driven patterns.", tCode: "Kyma (Kubernetes)", tips: "Choose Kyma when your team has Kubernetes skills and genuine container needs." },
    { flowchartId: flowchart14_7.id, nodeId: "node5", title: "App Runs on BTP", description: "Whichever runtime you pick, the app runs as a managed service on BTP; a subaccount can host both runtimes for different workloads.", tCode: "BTP Cockpit", tips: "Mix runtimes per workload rather than forcing everything into one." },
  ],
});
// Quiz for lesson 14.7
await prisma.quiz.upsert({
  where: { lessonId: lesson14_7.id },
  update: {},
  create: {
    lessonId: lesson14_7.id,
    title: "BTP Runtimes — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is a 'runtime' on BTP?",
          explanation: "A runtime is the environment where your application actually executes — providing the engine, scaling, and plumbing to run your code as a live service. Cloud Foundry and Kyma are the two main BTP runtimes.",
          options: {
            create: [
              { text: "The environment where your app actually runs", isCorrect: true },
              { text: "A report showing how long the system has been up", isCorrect: false },
              { text: "A type of user authorization", isCorrect: false },
              { text: "The login screen", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which BTP runtime is based on Kubernetes and suited to microservices and containers?",
          explanation: "Kyma is BTP's Kubernetes-based runtime, ideal for containers, microservices, and event-driven apps. Cloud Foundry is the simpler push-an-app runtime for standard cloud applications.",
          options: {
            create: [
              { text: "Kyma", isCorrect: true },
              { text: "Cloud Foundry", isCorrect: false },
              { text: "HANA Cloud", isCorrect: false },
              { text: "Integration Suite", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A team has a standard CAP app with a HANA Cloud database and no special container needs. Which runtime is the sensible default, and why?",
          explanation: "Cloud Foundry is the sensible default: it's simpler and well-integrated with SAP tooling, letting you push the CAP app (as an MTA) and bind it to HANA Cloud without managing Kubernetes complexity you don't need.",
          options: {
            create: [
              { text: "Cloud Foundry — simpler and well-integrated for standard CAP apps", isCorrect: true },
              { text: "Kyma — because every app needs Kubernetes", isCorrect: false },
              { text: "Neither — CAP apps can't be deployed", isCorrect: false },
              { text: "It must use both at once always", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 14.8: AI Services & Joule on BTP
const lesson14_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "btp-ai-services-joule" } },
  update: {},
  create: {
    moduleId: btpModule.id,
    title: "AI Services & Joule on BTP",
    slug: "btp-ai-services-joule",
    order: 8,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Anjali's accounts-payable team manually reads hundreds of supplier invoices each week, typing the vendor, amount, and date into SAP by hand. It's slow and full of typos. Her manager asks, "Can't AI read these invoices for us?" And separately, employees keep asking, "Why can't I just ask SAP a question in plain English?"

BTP's AI services answer both: ready-made AI for tasks like reading documents, and Joule, SAP's AI copilot.`,
    content: `## Bringing AI into SAP — Without Being a Data Scientist

BTP offers **AI services** so companies can add intelligence to processes without building AI from scratch. There are two flavors: **ready-made business AI services** for specific tasks, and the **platform to build/run custom AI**, plus **Joule**, SAP's generative-AI copilot.

## Ready-Made AI Services

These are pre-trained services you simply call via API:

| Service | What it does |
|---------|--------------|
| **Document Information Extraction** | Reads documents (e.g. invoices) and extracts fields like vendor, amount, date |
| **Data Attribute Recommendation** | Suggests classifications/attributes for records |
| **Business Entity Recognition** | Finds business entities in text |
| **Translation / Document Translation** | Translates content |

For example, **Document Information Extraction** turns a scanned invoice into structured data automatically — no manual typing.

## SAP AI Core & AI Launchpad

For custom AI, **SAP AI Core** runs and manages machine-learning models (training and inference) in a standardized way, and **AI Launchpad** is the cockpit to manage them. This is where data scientists operationalize models, and where access to large language models is managed (the **generative AI hub**).

## Joule — SAP's AI Copilot

**Joule** is SAP's generative-AI **copilot** embedded across SAP applications. Users interact in **natural language** — ask a question, request a task — and Joule responds with answers or actions drawn from SAP data and processes. It's like having an assistant inside SAP that understands plain English and knows your business context.

## Business AI Built In

Increasingly, SAP embeds AI directly into business processes (sometimes called **Business AI**) — for example, intelligent **cash application** (matching incoming payments to invoices automatically) or predictive suggestions. These often run on the BTP AI foundation.

## A Real Example

Anjali's two needs:
- **Invoice reading:** an automated process calls **Document Information Extraction** to read each supplier invoice and pull out vendor, amount, and date — then creates the entry via a released API. No manual typing, far fewer errors.
- **Plain-English questions:** employees use **Joule** to ask things like "show my open purchase orders" and get answers/actions in natural language, without hunting through screens.

## Why It Matters

BTP's AI services let companies add real intelligence — document reading, recommendations, and a natural-language copilot — without building AI infrastructure themselves. Ready-made services solve common tasks instantly, AI Core supports custom models, and Joule makes SAP conversational. It's how SAP delivers the "Intelligent Enterprise" in practice.`,
    keyConceptTitle: "Ready-Made AI Services, Custom AI (AI Core), and Joule",
    keyConceptBody: `- BTP offers **ready-made AI services** you call via API — e.g. **Document Information Extraction** reads invoices and extracts fields automatically.
- **SAP AI Core / AI Launchpad** run and manage custom ML models (and access to generative AI) in a standardized way.
- **Joule** is SAP's generative-AI **copilot**: users ask in natural language and get answers/actions from SAP data — bringing AI into everyday work.`,
  },
});
// Flowchart for lesson 14.8
const flowchart14_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson14_8.id },
  update: {},
  create: {
    lessonId: lesson14_8.id,
    title: "AI Reading an Invoice on BTP",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📄 Scanned Invoice Arrives" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 120 }, data: { label: "🤖 Document Information Extraction" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 520, y: 120 }, data: { label: "📋 Structured Fields (Vendor, Amount)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 760, y: 60 }, data: { label: "🚀 Posted via Released API" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 760, y: 180 }, data: { label: "💬 Joule: Ask in Plain English" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart14_8.id, nodeId: "node1", title: "Scanned Invoice Arrives", description: "A supplier invoice comes in as a PDF or scan — unstructured data a human would normally read and re-type.", tCode: "N/A", tips: "Document AI is most valuable where high volumes of similar documents arrive." },
    { flowchartId: flowchart14_8.id, nodeId: "node2", title: "Document Information Extraction", description: "This ready-made BTP AI service reads the document and identifies the relevant fields — no model training needed by you.", tCode: "Document Information Extraction (API)", tips: "You consume it as an API; SAP maintains the underlying AI model." },
    { flowchartId: flowchart14_8.id, nodeId: "node3", title: "Structured Fields", description: "The service returns structured data — vendor, amount, date, line items — ready for processing instead of manual entry.", tCode: "N/A", tips: "Always allow a human review step for low-confidence extractions." },
    { flowchartId: flowchart14_8.id, nodeId: "node4", title: "Posted via Released API", description: "An automation creates the SAP document (e.g. the invoice) through a released API, completing the touchless flow.", tCode: "Released API / Process Automation", tips: "Combine AI extraction with Build Process Automation for end-to-end automation." },
    { flowchartId: flowchart14_8.id, nodeId: "node5", title: "Joule: Ask in Plain English", description: "Separately, Joule lets users ask questions and trigger actions in natural language, drawing on SAP data and context.", tCode: "Joule", tips: "Joule is embedded across SAP apps — it's a copilot, not a separate place to go." },
  ],
});
// Quiz for lesson 14.8
await prisma.quiz.upsert({
  where: { lessonId: lesson14_8.id },
  update: {},
  create: {
    lessonId: lesson14_8.id,
    title: "AI Services & Joule on BTP — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does the Document Information Extraction service do?",
          explanation: "It's a ready-made BTP AI service that reads documents (like invoices) and extracts structured fields such as vendor, amount, and date — replacing manual reading and typing. You call it via API; SAP maintains the model.",
          options: {
            create: [
              { text: "Reads documents and extracts structured fields automatically", isCorrect: true },
              { text: "Designs the company logo", isCorrect: false },
              { text: "Backs up the database", isCorrect: false },
              { text: "Schedules production orders", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is Joule?",
          explanation: "Joule is SAP's generative-AI copilot embedded across SAP applications. Users interact in natural language to get answers or trigger actions, drawing on SAP data and business context — like an assistant inside SAP.",
          options: {
            create: [
              { text: "SAP's generative-AI copilot you interact with in natural language", isCorrect: true },
              { text: "A type of database index", isCorrect: false },
              { text: "A printer driver", isCorrect: false },
              { text: "A unit of cloud storage", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is using a ready-made AI service like Document Information Extraction attractive for a company with no data scientists?",
          explanation: "Ready-made services are pre-trained and consumed via API — the company gets working AI for a common task instantly, without building, training, or hosting models. SAP maintains the AI; the company just calls it.",
          options: {
            create: [
              { text: "It's pre-trained and called via API — no need to build or train models", isCorrect: true },
              { text: "It requires hiring 50 data scientists first", isCorrect: false },
              { text: "It only works on paper, not digitally", isCorrect: false },
              { text: "It cannot connect to SAP", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 14.9: SAP Build Work Zone
const lesson14_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "build-work-zone" } },
  update: {},
  create: {
    moduleId: btpModule.id,
    title: "SAP Build Work Zone",
    slug: "build-work-zone",
    order: 9,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Employees at Rohan's company are confused: SAP apps are here, the HR portal is there, company news is in email, and approvals are somewhere else. People waste time hunting for the right link. His manager asks, "Can we give everyone one home page that brings it all together?"

SAP Build Work Zone is exactly that — a single, branded digital workplace on BTP where employees find all their apps, content, and tasks in one place.`,
    content: `## The Problem: Scattered Tools

In a typical company, work is spread across many places — SAP apps, third-party tools, documents, news, and tasks. Employees waste time finding the right link and logging into different systems. **SAP Build Work Zone** solves this by providing a single **digital workplace** — one entry point for everything.

Think of it as the **company's home page for work**: like a well-organized intranet portal that also launches all your apps.

## What It Provides

| Feature | What it gives users |
|---------|---------------------|
| **Central launchpad** | One place with tiles to launch all apps (SAP and non-SAP) |
| **Content & pages** | Company news, links, documents, widgets |
| **Workflow tasks** | Approvals and to-dos surfaced in one inbox |
| **Branding** | A look-and-feel matching the company |
| **Mobile access** | Available on phone and desktop |

## Built on the Fiori Launchpad Idea — Extended

Build Work Zone builds on the Fiori Launchpad concept (tiles, role-based access, spaces and pages) but adds **portal capabilities**: rich content pages, news, document spaces, and the ability to bring together apps from **many sources** — S/4HANA, SuccessFactors, third-party tools — into one branded site.

## Two Editions (Briefly)

- **Standard edition** — a central launchpad to aggregate apps and simple content.
- **Advanced edition** — fuller portal/intranet features: richer pages, workspaces, content management, and collaboration.

(You don't need to memorize the split as a beginner — just know it ranges from a unified launchpad to a full digital-workplace portal.)

## Role-Based, Like Fiori

Just like the Fiori Launchpad, what each user sees is **role-based** — employees see their apps and content, managers see theirs. This keeps the workplace relevant and uncluttered per person.

## A Real Example

Rohan's unified workplace:
- He sets up **SAP Build Work Zone** as the company home page.
- It aggregates tiles for **S/4HANA** apps, **SuccessFactors** HR, and a couple of third-party tools — all launchable from one place.
- It shows **company news**, useful links, and each employee's **approval tasks** in one inbox.
- It's **branded** with company colors and works on mobile.
- Employees stop hunting for links — everything starts from one home page.

## Why It Matters

SAP Build Work Zone turns scattered tools into one cohesive, branded digital workplace. It boosts productivity (no more hunting for the right system), improves adoption (a single, friendly entry point), and unifies apps, content, and tasks across SAP and non-SAP sources — a key BTP service for the end-user experience.`,
    keyConceptTitle: "Build Work Zone Is the Unified Digital Workplace on BTP",
    keyConceptBody: `- **SAP Build Work Zone** gives employees one branded home page that aggregates apps (SAP and non-SAP), content/news, and workflow tasks.
- It extends the Fiori Launchpad concept with **portal capabilities** (pages, news, document spaces) and is **role-based**, so each user sees relevant content.
- It comes in Standard (central launchpad) and Advanced (full intranet/portal) editions, available on desktop and mobile.`,
  },
});
// Flowchart for lesson 14.9
const flowchart14_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson14_9.id },
  update: {},
  create: {
    lessonId: lesson14_9.id,
    title: "One Home Page for All Work",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 60 }, data: { label: "🚀 S/4HANA Apps" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 60, y: 160 }, data: { label: "👔 SuccessFactors HR" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 60, y: 260 }, data: { label: "🔗 Third-Party Tools" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 320, y: 160 }, data: { label: "☁️ SAP Build Work Zone" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 580, y: 100 }, data: { label: "🏠 One Branded Home Page" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 580, y: 220 }, data: { label: "👤 Role-Based per User" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node4", type: "default" },
      { id: "e2", source: "node2", target: "node4", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart14_9.id, nodeId: "node1", title: "S/4HANA Apps", description: "Fiori apps from S/4HANA are surfaced as tiles in the Work Zone so users launch them without going to a separate system.", tCode: "N/A", tips: "Work Zone aggregates content providers like S/4HANA rather than replacing them." },
    { flowchartId: flowchart14_9.id, nodeId: "node2", title: "SuccessFactors HR", description: "HR apps and links from SuccessFactors can also appear, so employees reach HR tasks from the same home page.", tCode: "N/A", tips: "Bringing HR into the same workplace reduces 'which system do I use?' confusion." },
    { flowchartId: flowchart14_9.id, nodeId: "node3", title: "Third-Party Tools", description: "Non-SAP tools and external links can be included too, making Work Zone a true single entry point for all work.", tCode: "N/A", tips: "Aggregating non-SAP tools is what makes it a real digital workplace, not just an SAP launchpad." },
    { flowchartId: flowchart14_9.id, nodeId: "node4", title: "SAP Build Work Zone", description: "The BTP service that aggregates apps, content, news, and tasks from many sources into one branded portal/launchpad.", tCode: "SAP Build Work Zone", tips: "Standard edition = central launchpad; Advanced = fuller intranet/portal features." },
    { flowchartId: flowchart14_9.id, nodeId: "node5", title: "One Branded Home Page", description: "Users get a single, company-branded home page with everything they need — apps, news, links, and tasks.", tCode: "N/A", tips: "A clean, branded entry point boosts adoption and reduces support questions." },
    { flowchartId: flowchart14_9.id, nodeId: "node6", title: "Role-Based per User", description: "Like the Fiori Launchpad, content is role-based, so each employee sees only what's relevant to their job.", tCode: "N/A", tips: "Role-based content keeps the workplace uncluttered and personalized." },
  ],
});
// Quiz for lesson 14.9
await prisma.quiz.upsert({
  where: { lessonId: lesson14_9.id },
  update: {},
  create: {
    lessonId: lesson14_9.id,
    title: "SAP Build Work Zone — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the main purpose of SAP Build Work Zone?",
          explanation: "It provides a single, branded digital workplace — one home page that aggregates apps (SAP and non-SAP), content, news, and workflow tasks — so employees don't have to hunt across scattered systems.",
          options: {
            create: [
              { text: "To give employees one branded home page for all apps, content, and tasks", isCorrect: true },
              { text: "To replace the company's database", isCorrect: false },
              { text: "To write ABAP code", isCorrect: false },
              { text: "To calculate payroll taxes", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How does Build Work Zone relate to the Fiori Launchpad?",
          explanation: "It builds on the Fiori Launchpad concept (tiles, role-based access, spaces/pages) and extends it with portal capabilities — rich content pages, news, document spaces — and aggregates apps from many sources into one site.",
          options: {
            create: [
              { text: "It extends the Fiori Launchpad with portal/content capabilities", isCorrect: true },
              { text: "It has nothing to do with the Launchpad", isCorrect: false },
              { text: "It deletes the Fiori Launchpad", isCorrect: false },
              { text: "It only works without any apps", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does role-based content make a digital workplace more effective?",
          explanation: "Role-based content means each employee sees only the apps and information relevant to their job, keeping the workplace uncluttered and personalized — so people find what they need quickly instead of wading through everything.",
          options: {
            create: [
              { text: "Each user sees only relevant apps/content, staying uncluttered", isCorrect: true },
              { text: "Everyone sees every app in the company, which is faster", isCorrect: false },
              { text: "It hides all apps from everyone", isCorrect: false },
              { text: "It randomly changes content each day", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 14.10: SAP Analytics Cloud on BTP
const lesson14_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "analytics-cloud-on-btp" } },
  update: {},
  create: {
    moduleId: btpModule.id,
    title: "SAP Analytics Cloud on BTP",
    slug: "analytics-cloud-on-btp",
    order: 10,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Lakshmi's finance team builds reports in spreadsheets, plans next year's budget in another spreadsheet, and guesses at forecasts. The data is stale, versions conflict, and nobody trusts the numbers. Her CFO asks for "one tool where we can see live dashboards, plan the budget, and get AI forecasts — all together."

SAP Analytics Cloud (SAC) on BTP is that single tool: business intelligence, planning, and predictive analytics in one cloud product.`,
    content: `## One Tool for BI, Planning, and Prediction

Traditionally companies used separate tools for dashboards, for budgeting/planning, and for forecasting — leading to disconnected, stale data. **SAP Analytics Cloud (SAC)** combines all three in one cloud product on BTP:

| Capability | What it does |
|------------|--------------|
| **Business Intelligence (BI)** | Live dashboards and visualizations ("stories") |
| **Planning** | Budgeting, forecasting, what-if scenarios |
| **Predictive** | AI/smart forecasts and insights |

Because they're in one tool on the same data, your dashboards, your plans, and your forecasts stay connected.

## Stories — Interactive Dashboards

A **story** is SAC's interactive dashboard/report — charts, tables, and visualizations that users explore, filter, and drill into. Stories connect to live data so the numbers are current, not yesterday's export.

## Live vs Import Connections

SAC connects to data two ways:
- **Live connection** — queries the source (e.g. S/4HANA, HANA Cloud) in real time; data stays in the source.
- **Import connection** — copies data into SAC for analysis.

Live connections mean dashboards reflect the latest data without copying it around — great for governance and freshness.

## Planning Built In

Unlike pure BI tools, SAC does **planning**: teams enter budget figures, run **what-if** scenarios, and compare plan vs actual — in the same place they view dashboards. Finance can plan and report without exporting to spreadsheets.

## Predictive & Smart Features

SAC includes **predictive** capabilities — smart forecasting, "Smart Insights" that explain what's driving a number, and natural-language querying — bringing AI-assisted analysis to business users without data-science skills.

## Where It Fits with BTP and S/4HANA

SAC is part of the BTP analytics pillar. It pairs naturally with **S/4HANA embedded analytics and CDS views** (live connection to operational data) and with **HANA Cloud**. In fact, SAC technology also powers analytics embedded inside other SAP products.

## A Real Example

Lakshmi's unified analytics:
- A **live connection** to S/4HANA feeds a **story** showing this month's revenue and margin — current, not a stale export.
- The team does next year's **budget planning** in SAC and compares **plan vs actual** live.
- They run a **predictive forecast** for cash flow and use Smart Insights to see what's driving variances.
- Dashboards, plans, and forecasts all live together, on trusted live data.

## Why It Matters

SAP Analytics Cloud unifies BI, planning, and prediction in one BTP tool connected to live data — ending the disconnected-spreadsheets problem. It gives finance and business teams trusted, current dashboards plus integrated planning and AI forecasting, making it the analytics centerpiece of the SAP cloud portfolio.`,
    keyConceptTitle: "SAC Unifies BI, Planning, and Predictive on Live Data",
    keyConceptBody: `- **SAP Analytics Cloud (SAC)** combines **Business Intelligence (stories/dashboards)**, **Planning** (budgets, what-if), and **Predictive** (smart forecasts) in one BTP tool.
- It connects via **live** (real-time, data stays in source like S/4HANA/HANA Cloud) or **import** connections; live keeps dashboards current.
- It pairs with **S/4HANA embedded analytics/CDS views**, replacing disconnected spreadsheets with one trusted, integrated analytics platform.`,
  },
});
// Flowchart for lesson 14.10
const flowchart14_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson14_10.id },
  update: {},
  create: {
    lessonId: lesson14_10.id,
    title: "BI, Planning & Predictive in One Tool",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🔗 Live Connection (S/4HANA / HANA Cloud)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 320, y: 120 }, data: { label: "☁️ SAP Analytics Cloud" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 560, y: 40 }, data: { label: "📊 BI: Stories / Dashboards" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 560, y: 140 }, data: { label: "📈 Planning: Budget & What-If" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 560, y: 240 }, data: { label: "🔮 Predictive: Smart Forecast" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart14_10.id, nodeId: "node1", title: "Live Connection", description: "SAC connects live to sources like S/4HANA or HANA Cloud, querying current data without copying it — so dashboards are always fresh.", tCode: "SAC Connections", tips: "Use live connections for governance and real-time accuracy; import when you must blend/cache data." },
    { flowchartId: flowchart14_10.id, nodeId: "node2", title: "SAP Analytics Cloud", description: "The single cloud tool that hosts BI, planning, and predictive together on the connected data — no separate tools per capability.", tCode: "SAP Analytics Cloud", tips: "Having all three in one tool keeps dashboards, plans, and forecasts consistent." },
    { flowchartId: flowchart14_10.id, nodeId: "node3", title: "BI: Stories", description: "Stories are interactive dashboards — charts and tables users explore, filter, and drill into, on live data.", tCode: "SAC Stories", tips: "Stories replace static spreadsheet reports with interactive, current visuals." },
    { flowchartId: flowchart14_10.id, nodeId: "node4", title: "Planning", description: "Teams enter budgets, run what-if scenarios, and compare plan vs actual in the same tool as their dashboards.", tCode: "SAC Planning", tips: "Integrated planning ends the export-to-spreadsheet budgeting cycle." },
    { flowchartId: flowchart14_10.id, nodeId: "node5", title: "Predictive", description: "Smart forecasting and Smart Insights bring AI-assisted analysis — projecting trends and explaining drivers — to business users.", tCode: "SAC Predictive / Smart Predict", tips: "Predictive features need no data-science background to use." },
  ],
});
// Quiz for lesson 14.10
await prisma.quiz.upsert({
  where: { lessonId: lesson14_10.id },
  update: {},
  create: {
    lessonId: lesson14_10.id,
    title: "SAP Analytics Cloud on BTP — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What three capabilities does SAP Analytics Cloud combine in one tool?",
          explanation: "SAC unifies Business Intelligence (dashboards/stories), Planning (budgeting, what-if), and Predictive (smart forecasting) — capabilities that traditionally lived in separate tools — on connected data.",
          options: {
            create: [
              { text: "Business Intelligence, Planning, and Predictive", isCorrect: true },
              { text: "Payroll, Recruiting, and Learning", isCorrect: false },
              { text: "Cloud Foundry, Kyma, and ABAP", isCorrect: false },
              { text: "Backup, Restore, and Archiving", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the advantage of a 'live connection' in SAC?",
          explanation: "A live connection queries the source (e.g. S/4HANA or HANA Cloud) in real time, so the data stays in the source and dashboards reflect the latest figures without copying data around — good for freshness and governance.",
          options: {
            create: [
              { text: "Dashboards reflect real-time source data without copying it", isCorrect: true },
              { text: "It permanently deletes the source data", isCorrect: false },
              { text: "It only works offline", isCorrect: false },
              { text: "It makes data a week old on purpose", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is having BI, planning, and prediction in one tool better than using separate spreadsheets for each?",
          explanation: "In one tool on connected live data, dashboards, plans, and forecasts stay consistent and trusted — eliminating the stale, conflicting, version-clashing data that separate spreadsheets produce. Teams can report, plan, and forecast without disconnected exports.",
          options: {
            create: [
              { text: "Data stays connected and consistent, ending stale, conflicting spreadsheets", isCorrect: true },
              { text: "Spreadsheets are always more accurate and current", isCorrect: false },
              { text: "It prevents anyone from seeing the data", isCorrect: false },
              { text: "It removes the need for any data source", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SUCCESSFACTORS: NEW LESSONS ──────────────────────────────────────────────
// LESSON 15.3: Recruiting (RCM) In Depth
const lesson15_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-recruiting-rcm" } },
  update: {},
  create: {
    moduleId: sfModule.id,
    title: "Recruiting (RCM) In Depth",
    slug: "sf-recruiting-rcm",
    order: 3,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Priya, a recruiter, juggles hiring across spreadsheets, her email inbox, and sticky notes. Candidates fall through the cracks, hiring managers don't know who's in the pipeline, and great applicants get a slow, clunky experience. She asks, "Isn't there one system to run hiring from job posting to offer?"

SAP SuccessFactors Recruiting (RCM) is that system — managing the whole hiring journey in one place.`,
    content: `## What Recruiting Manages

**SuccessFactors Recruiting (RCM)** runs the entire hiring process — from a manager realizing they need a new person, through advertising the job, managing applicants, to making the offer. It replaces scattered spreadsheets and email with one structured, trackable flow.

## The Hiring Journey

| Step | What happens |
|------|--------------|
| **Job Requisition** | The formal request to hire for a role (title, department, requirements), usually approved |
| **Job Posting** | The requisition is posted to the career site and job boards |
| **Career Site** | Where candidates discover and apply for jobs |
| **Candidate Pipeline** | Applicants move through stages (applied → screened → interviewed → selected) |
| **Interviews & Assessments** | Evaluate candidates, capture feedback |
| **Offer Management** | Create, approve, and send the job offer |
| **Hire** | The accepted candidate flows into Onboarding and Employee Central |

## Job Requisition — The Starting Point

A **job requisition** is the formal, approved record of an open role. It defines the title, department, location, and requirements, and typically goes through an **approval** before posting. Everything in Recruiting hangs off the requisition.

## The Career Site and Candidate Experience

Candidates discover jobs on the **career site** (the company's branded jobs page) and apply, creating a profile. A good candidate experience — easy apply, clear status — helps attract talent. SuccessFactors also supports posting to external **job boards** from the requisition.

## The Pipeline — Tracking Applicants

Applicants move through a **pipeline** of stages. Recruiters and hiring managers can see exactly who is at which stage, capture interview **feedback**, and move candidates forward or reject them — all visible in one place, so nobody is forgotten.

## Offer Management

When a candidate is selected, **offer management** generates the offer (often from a template), routes it for **approval**, and sends it. Once accepted, the new hire flows into **Onboarding** and becomes an employee in **Employee Central** — no re-keying.

## A Real Example

Priya's streamlined hiring:
- A manager raises a **job requisition** for a Sales Analyst; it's **approved**.
- It's **posted** to the career site and a job board.
- Applicants land in the **pipeline**; Priya screens them, schedules interviews, and captures feedback in the system.
- The chosen candidate gets an **offer** (approved and sent from SF); on acceptance, they flow into **Onboarding** and **Employee Central**.
- Nothing lives in spreadsheets, and everyone sees the same pipeline.

## Why It Matters

Recruiting brings the whole hiring process into one structured system — improving the candidate experience, giving recruiters and managers shared visibility, and feeding new hires straight into onboarding and the HR core. It's the front door of the talent lifecycle, turning chaotic hiring into a managed, trackable flow.`,
    keyConceptTitle: "Recruiting Runs Hiring from Requisition to Offer in One Place",
    keyConceptBody: `- **SuccessFactors Recruiting (RCM)** manages the full hiring journey: **job requisition → posting/career site → candidate pipeline → interviews → offer → hire**.
- The **job requisition** is the approved starting record; the **career site** and job boards attract applicants, who move through a tracked **pipeline**.
- **Offer management** generates and routes offers; accepted candidates flow into **Onboarding** and **Employee Central** with no re-keying.`,
  },
});
// Flowchart for lesson 15.3
const flowchart15_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson15_3.id },
  update: {},
  create: {
    lessonId: lesson15_3.id,
    title: "The Recruiting Journey",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 120 }, data: { label: "📋 Job Requisition (Approved)" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 240, y: 120 }, data: { label: "🌐 Post to Career Site" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 440, y: 120 }, data: { label: "👥 Candidate Pipeline" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 640, y: 120 }, data: { label: "📝 Offer Management" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 540, y: 260 }, data: { label: "🎉 Hire → Onboarding & EC" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart15_3.id, nodeId: "node1", title: "Job Requisition", description: "The formal, approved request to hire for a role — title, department, location, requirements. Everything in Recruiting hangs off it.", tCode: "SF Recruiting", tips: "Requisitions usually need approval before posting, controlling headcount spend." },
    { flowchartId: flowchart15_3.id, nodeId: "node2", title: "Post to Career Site", description: "The approved requisition is posted to the branded career site and external job boards so candidates can discover and apply.", tCode: "SF Recruiting (Career Site)", tips: "A clean, easy career site materially improves application completion rates." },
    { flowchartId: flowchart15_3.id, nodeId: "node3", title: "Candidate Pipeline", description: "Applicants move through stages (applied → screened → interviewed → selected). Recruiters and managers share one view and capture feedback.", tCode: "SF Recruiting", tips: "A shared pipeline stops candidates from falling through the cracks." },
    { flowchartId: flowchart15_3.id, nodeId: "node4", title: "Offer Management", description: "For the selected candidate, an offer is generated (from a template), routed for approval, and sent.", tCode: "SF Recruiting (Offer)", tips: "Templated, approved offers keep them consistent and compliant." },
    { flowchartId: flowchart15_3.id, nodeId: "node5", title: "Hire → Onboarding & EC", description: "Once the offer is accepted, the new hire flows into Onboarding and becomes an employee record in Employee Central — no re-keying.", tCode: "SF Onboarding / EC", tips: "Seamless handoff to onboarding is a big advantage over disconnected hiring tools." },
  ],
});
// Quiz for lesson 15.3
await prisma.quiz.upsert({
  where: { lessonId: lesson15_3.id },
  update: {},
  create: {
    lessonId: lesson15_3.id,
    title: "Recruiting (RCM) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is a job requisition in SuccessFactors Recruiting?",
          explanation: "A job requisition is the formal, usually approved record of an open role (title, department, requirements). Everything in Recruiting — posting, pipeline, offer — hangs off the requisition.",
          options: {
            create: [
              { text: "The formal, approved record of an open role that drives the hiring process", isCorrect: true },
              { text: "A candidate's resume", isCorrect: false },
              { text: "The final paycheck", isCorrect: false },
              { text: "A performance review form", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What happens after a candidate accepts their offer in SuccessFactors?",
          explanation: "The accepted candidate flows into Onboarding and becomes an employee record in Employee Central — no manual re-keying. This seamless handoff connects Recruiting to the rest of the talent lifecycle.",
          options: {
            create: [
              { text: "They flow into Onboarding and Employee Central automatically", isCorrect: true },
              { text: "Their data is deleted", isCorrect: false },
              { text: "Nothing — recruiting ends in a spreadsheet", isCorrect: false },
              { text: "They must reapply from scratch", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does a shared candidate pipeline improve hiring compared to recruiters using personal spreadsheets and email?",
          explanation: "A shared pipeline gives recruiters and hiring managers one real-time view of who is at which stage, with feedback captured in one place. This prevents candidates from being forgotten and keeps everyone aligned — unlike scattered personal spreadsheets.",
          options: {
            create: [
              { text: "Everyone sees the same real-time stages, so candidates aren't lost", isCorrect: true },
              { text: "Spreadsheets show more candidates than the system can", isCorrect: false },
              { text: "It hides candidates from the hiring manager", isCorrect: false },
              { text: "It removes the need to interview anyone", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 15.4: Performance & Goals
const lesson15_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-performance-goals" } },
  update: {},
  create: {
    moduleId: sfModule.id,
    title: "Performance & Goals",
    slug: "sf-performance-goals",
    order: 4,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `At Arjun's company, goals are set once a year in a forgotten document, and the annual review is a stressful scramble where nobody remembers what happened months ago. Ratings feel unfair and inconsistent across teams. His HR director wants "clear goals people actually track, ongoing feedback, and fair, consistent ratings."

SuccessFactors Performance & Goals turns vague annual rituals into a continuous, structured process.`,
    content: `## Two Connected Modules

**SuccessFactors Performance & Goals** is really two linked capabilities:
- **Goal Management (GM)** — setting and tracking what people should achieve.
- **Performance Management (PM)** — evaluating how they did, via review forms.

Together they connect day-to-day work to fair, documented evaluation.

## Goal Management — Clear, Aligned Targets

**Goal Management** lets employees and managers set **goals** that are specific and measurable, and **cascade/align** them — a company objective flows down into team and individual goals. So everyone can see how their work supports the bigger picture. Progress is tracked through the year, not forgotten after January.

A common framework is **SMART** goals (Specific, Measurable, Achievable, Relevant, Time-bound), and goals can be aligned to higher-level objectives so the organization pulls in one direction.

## Continuous Performance Management

Beyond the annual form, SF supports **Continuous Performance Management** — regular check-ins between manager and employee, capturing **achievements** and **feedback** throughout the year. This means the annual review is based on a year of recorded evidence, not faded memory.

## Performance Reviews — The Form

The **review form** is where formal evaluation happens. It typically gathers goal achievement and competency ratings, **self-evaluation**, **manager evaluation**, and sometimes peer/multi-rater feedback. The form routes through a defined process (employee → manager → completion) and produces an **overall rating**.

## Calibration — Fairness Across Teams

A standout feature is **calibration**: managers compare ratings across employees and teams in a session to ensure consistency and fairness — preventing one lenient manager's "top" rating from meaning something different than another's. Calibration reduces bias and keeps ratings comparable.

## How It Connects

Performance ratings feed other modules: they influence **Compensation** (merit/bonus) and **Succession** (identifying talent). So a fair rating process has real downstream impact.

## A Real Example

Arjun's improved cycle:
- Employees set **SMART goals** aligned to company objectives at the start of the year.
- Managers hold **continuous check-ins**, logging achievements and feedback.
- At review time, the **form** gathers self- and manager evaluations and an overall rating — grounded in the year's recorded evidence.
- A **calibration** session aligns ratings across teams for fairness.
- The ratings then inform **compensation** and **succession** decisions.

## Why It Matters

Performance & Goals turns performance management from a once-a-year scramble into a continuous, evidence-based, and fair process. Aligned goals focus effort, continuous feedback keeps it real, and calibration ensures ratings are consistent — and those ratings drive pay and talent decisions across the suite.`,
    keyConceptTitle: "Aligned Goals + Continuous Feedback + Calibrated Ratings",
    keyConceptBody: `- **Goal Management** sets specific, aligned (cascaded) goals — often **SMART** — tracked through the year, not forgotten.
- **Continuous Performance Management** captures check-ins and feedback year-round, so the **review form** is based on recorded evidence.
- **Calibration** compares ratings across teams for fairness/consistency; ratings then feed **Compensation** and **Succession**.`,
  },
});
// Flowchart for lesson 15.4
const flowchart15_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson15_4.id },
  update: {},
  create: {
    lessonId: lesson15_4.id,
    title: "The Performance & Goals Cycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 120 }, data: { label: "🎯 Set Aligned SMART Goals" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 120 }, data: { label: "🔄 Continuous Check-Ins" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 460, y: 120 }, data: { label: "📝 Review Form (Self + Manager)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 690, y: 120 }, data: { label: "⚖️ Calibration (Fair Ratings)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 690, y: 260 }, data: { label: "➡️ Feeds Comp & Succession" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart15_4.id, nodeId: "node1", title: "Set Aligned SMART Goals", description: "Employees and managers set specific, measurable goals aligned (cascaded) to company objectives, so everyone's work supports the bigger picture.", tCode: "SF Goal Management", tips: "Align individual goals to higher objectives so the whole org pulls in one direction." },
    { flowchartId: flowchart15_4.id, nodeId: "node2", title: "Continuous Check-Ins", description: "Throughout the year, managers and employees hold check-ins, recording achievements and feedback rather than waiting for the annual review.", tCode: "SF Continuous Performance", tips: "Year-round notes mean the review reflects reality, not just the last few weeks." },
    { flowchartId: flowchart15_4.id, nodeId: "node3", title: "Review Form", description: "The formal form gathers self-evaluation, manager evaluation (and sometimes peers), goal achievement, and competencies into an overall rating.", tCode: "SF Performance Management", tips: "Base the form on the year's recorded evidence to keep it fair and specific." },
    { flowchartId: flowchart15_4.id, nodeId: "node4", title: "Calibration", description: "Managers compare ratings across employees/teams in a calibration session to ensure consistency and reduce bias.", tCode: "SF Calibration", tips: "Calibration is what makes a 'top' rating mean the same thing across different managers." },
    { flowchartId: flowchart15_4.id, nodeId: "node5", title: "Feeds Comp & Succession", description: "Final ratings flow to Compensation (merit/bonus) and Succession (talent identification), giving the process real downstream impact.", tCode: "SF Compensation / Succession", tips: "Because ratings drive pay and talent moves, fairness in calibration really matters." },
  ],
});
// Quiz for lesson 15.4
await prisma.quiz.upsert({
  where: { lessonId: lesson15_4.id },
  update: {},
  create: {
    lessonId: lesson15_4.id,
    title: "Performance & Goals — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does 'cascading' or aligning goals achieve in Goal Management?",
          explanation: "Aligning/cascading goals flows a company objective down into team and individual goals, so everyone can see how their work supports the bigger picture and the organization pulls in one direction.",
          options: {
            create: [
              { text: "It links individual goals to company objectives so effort is aligned", isCorrect: true },
              { text: "It deletes goals at year-end", isCorrect: false },
              { text: "It hides goals from managers", isCorrect: false },
              { text: "It sets everyone's salary automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the purpose of calibration in performance management?",
          explanation: "Calibration compares ratings across employees and teams in a session to ensure consistency and fairness — so one lenient or strict manager doesn't make ratings incomparable. It reduces bias and keeps ratings meaningful.",
          options: {
            create: [
              { text: "To make ratings consistent and fair across managers and teams", isCorrect: true },
              { text: "To calculate the company's revenue", isCorrect: false },
              { text: "To post payroll to accounting", isCorrect: false },
              { text: "To translate reviews into other languages", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does Continuous Performance Management lead to fairer annual reviews?",
          explanation: "Capturing check-ins, achievements, and feedback throughout the year means the annual review is based on a full year of recorded evidence — not just faded memory or recent events — making evaluations more accurate and fair.",
          options: {
            create: [
              { text: "The review is based on a year of recorded evidence, not faded memory", isCorrect: true },
              { text: "It removes the need for any review at all", isCorrect: false },
              { text: "It only records the last week of work", isCorrect: false },
              { text: "It lets employees rate themselves only", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 15.5: Learning Management System (LMS)
const lesson15_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-learning-lms" } },
  update: {},
  create: {
    moduleId: sfModule.id,
    title: "Learning Management (LMS)",
    slug: "sf-learning-lms",
    order: 5,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `An auditor asks Meena in HR, "Prove that every employee handling food completed the mandatory safety training this year." Meena's training records are scattered across emails and spreadsheets — she can't quickly prove compliance, and some staff never even knew they were assigned training. This is a real risk.

SuccessFactors Learning (LMS) solves this: it delivers training, assigns it, and tracks completion — with the records auditors need.`,
    content: `## What an LMS Does

A **Learning Management System (LMS)** delivers and tracks employee learning — online courses, classroom sessions, certifications, and especially **compliance training**. SuccessFactors **Learning** is SAP's LMS. It answers three questions: what training is available, who must take what, and who has completed it.

## Core Building Blocks

| Element | What it is |
|---------|-----------|
| **Course Catalog** | The library of available learning (online and instructor-led) |
| **Learning Items** | Individual courses/content units |
| **Assignments** | Training given to specific people or groups, often with due dates |
| **Curricula** | A bundle of required learning (e.g. an onboarding or compliance set) |
| **Completion Records** | Proof that a person finished, with dates |

## Assignments and Curricula — Driving Compliance

The power for compliance is in **assignments** and **curricula**. You can assign required training to roles or groups automatically (e.g. "everyone in food handling must complete Food Safety annually"), with **due dates** and reminders. A **curriculum** groups required items and can require periodic **re-certification**, so the system knows when training expires and re-assigns it.

## Tracking and Reporting

The LMS keeps **completion records** — who completed what and when — and reports on outstanding/overdue training. This is exactly what proves compliance to auditors and regulators. Managers can see their team's status; admins can report across the company.

## Types of Learning Supported

- **Online courses** (e-learning), often SCORM/AICC content.
- **Instructor-led training** (classroom or virtual), with scheduling and rosters.
- **Certifications** and external learning records.
- Increasingly, modern learning experiences and content marketplaces.

## How It Connects

Learning links to the rest of SuccessFactors: development goals from **Performance & Goals** can recommend courses, **Onboarding** can assign new-hire curricula, and learning data feeds **People Analytics**. So skills development is part of the whole talent lifecycle.

## A Real Example

Meena's compliance fix:
- She builds a **Food Safety** course in the **catalog** and a **curriculum** that requires it **annually**.
- It's **assigned automatically** to everyone in food-handling roles, with due dates and reminders.
- Employees complete it; the LMS stores **completion records**.
- When the auditor asks, Meena runs a report showing exactly who completed it and when — instant proof — and the system already flags anyone overdue.

## Why It Matters

The LMS ensures employees get the training they need and that the company can prove it — critical for compliance, safety, and skills. Automated assignments and curricula remove the guesswork, and completion records turn training from scattered spreadsheets into auditable, reliable evidence.`,
    keyConceptTitle: "LMS Delivers, Assigns, and Tracks Learning — Including Compliance",
    keyConceptBody: `- **SuccessFactors Learning (LMS)** delivers training (online and instructor-led) and tracks who completed what, when.
- **Assignments** and **curricula** push required learning to roles/groups with due dates and **re-certification**, automating compliance training.
- **Completion records** provide auditable proof of compliance; Learning connects to Performance (development), Onboarding, and People Analytics.`,
  },
});
// Flowchart for lesson 15.5
const flowchart15_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson15_5.id },
  update: {},
  create: {
    lessonId: lesson15_5.id,
    title: "From Course to Compliance Proof",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 120 }, data: { label: "📚 Course in Catalog" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 240, y: 120 }, data: { label: "📌 Assign via Curriculum (Due Dates)" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 120 }, data: { label: "✅ Employee Completes" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 670, y: 120 }, data: { label: "🗂️ Completion Record Stored" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 670, y: 260 }, data: { label: "📊 Compliance Report for Auditor" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart15_5.id, nodeId: "node1", title: "Course in Catalog", description: "Learning content (e-learning or instructor-led) is created in the course catalog — the library employees can access.", tCode: "SF Learning (Catalog)", tips: "Catalog structure and search make it easy for employees to find relevant learning." },
    { flowchartId: flowchart15_5.id, nodeId: "node2", title: "Assign via Curriculum", description: "Required training is assigned to roles/groups, often bundled in a curriculum with due dates and periodic re-certification.", tCode: "SF Learning (Curricula)", tips: "Automated, role-based assignment is what makes compliance training reliable." },
    { flowchartId: flowchart15_5.id, nodeId: "node3", title: "Employee Completes", description: "Employees take the assigned learning; the system records progress and completion, with reminders for what's due.", tCode: "SF Learning", tips: "Reminders and clear due dates reduce overdue training significantly." },
    { flowchartId: flowchart15_5.id, nodeId: "node4", title: "Completion Record Stored", description: "The LMS stores a durable record of who completed what and when — the basis for proof and re-certification timing.", tCode: "SF Learning", tips: "Completion records replace scattered spreadsheets with one reliable source." },
    { flowchartId: flowchart15_5.id, nodeId: "node5", title: "Compliance Report", description: "Admins run reports showing completion and overdue status across the company — instant evidence for auditors and regulators.", tCode: "SF Learning / People Analytics", tips: "Being able to prove compliance on demand is a major reason companies adopt an LMS." },
  ],
});
// Quiz for lesson 15.5
await prisma.quiz.upsert({
  where: { lessonId: lesson15_5.id },
  update: {},
  create: {
    lessonId: lesson15_5.id,
    title: "Learning Management (LMS) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What three things does a Learning Management System primarily do?",
          explanation: "An LMS delivers training, assigns who must take what, and tracks completion. SuccessFactors Learning answers what's available, who needs it, and who has completed it — essential for compliance.",
          options: {
            create: [
              { text: "Deliver training, assign it to people, and track completion", isCorrect: true },
              { text: "Calculate payroll, taxes, and bonuses", isCorrect: false },
              { text: "Build databases, apps, and integrations", isCorrect: false },
              { text: "Post invoices, payments, and receipts", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How does the LMS make recurring compliance training reliable?",
          explanation: "By using curricula and automated assignments to roles/groups with due dates and periodic re-certification. The system assigns required training, reminds people, and knows when it expires — removing reliance on manual tracking.",
          options: {
            create: [
              { text: "Curricula auto-assign required training with due dates and re-certification", isCorrect: true },
              { text: "It emails a spreadsheet once a year and hopes for the best", isCorrect: false },
              { text: "It requires employees to find training themselves with no tracking", isCorrect: false },
              { text: "It deletes training records after completion", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "An auditor demands proof that all relevant staff completed mandatory safety training. How does the LMS help?",
          explanation: "The LMS stores completion records (who completed what and when) and can report completion and overdue status across the company. This provides instant, auditable proof of compliance instead of scattered spreadsheets.",
          options: {
            create: [
              { text: "It provides completion records and reports as auditable proof", isCorrect: true },
              { text: "It hides the records from auditors", isCorrect: false },
              { text: "It cannot track who completed training", isCorrect: false },
              { text: "It pays a fine automatically instead", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 15.6: Compensation Management
const lesson15_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-compensation-management" } },
  update: {},
  create: {
    moduleId: sfModule.id,
    title: "Compensation Management",
    slug: "sf-compensation-management",
    order: 6,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Every year, annual raises at Vikram's company are chaos: managers email salary suggestions in spreadsheets, budgets get blown, top performers sometimes get less than average ones, and HR spends weeks consolidating it all. The CFO wants raises tied to performance and kept within budget; managers want a simple way to propose them.

SuccessFactors Compensation Management turns this messy annual exercise into a controlled, fair, performance-linked process.`,
    content: `## What Compensation Management Does

**SuccessFactors Compensation** manages the process of planning and awarding employee pay changes — annual **merit increases**, **bonuses**, and other rewards — in a controlled, budgeted, performance-linked way. It replaces error-prone salary spreadsheets with a governed workflow.

## The Core Pieces

| Element | What it does |
|---------|--------------|
| **Compensation Plan** | The annual program defining eligibility, budget, and rules |
| **Budgets / Guidelines** | How much money is available and the recommended ranges |
| **Worksheets** | Where managers propose increases for their team |
| **Merit / Bonus components** | The types of pay change being awarded |
| **Approvals** | Routing proposals up for sign-off |

## Manager Worksheets — Proposing Pay

Managers plan pay on a **worksheet** — a controlled screen listing their team with current pay, performance rating, and recommended increase ranges. The worksheet enforces the **budget** and shows **guidelines**, so a manager can't blow the budget or wildly over/under-pay. This is far safer than free-form spreadsheets.

## Pay-for-Performance

A defining capability is **pay-for-performance**: compensation guidelines can be **driven by performance ratings** (from Performance & Goals). For example, a top-rated employee gets a higher recommended merit range than an average one. This makes raises fair and tied to contribution — the link the CFO wanted.

## Budgets and Guidelines Keep Control

The plan sets a **budget** (total money available) and **guidelines** (recommended increase by rating, salary range position, etc.). The system tracks spend against budget in real time as managers plan, and flags violations — keeping the whole exercise within financial limits.

## Approvals and Rollout

Completed worksheets route through **approvals** (e.g. manager → senior manager → HR). Once approved, the results can flow to **Employee Central** (updating pay) and on to **payroll** — so the awarded changes actually take effect without re-keying.

## A Real Example

Vikram's controlled cycle:
- HR creates the **compensation plan** with a **budget** and **guidelines** linked to performance ratings.
- Each manager opens a **worksheet**, sees their team with ratings and recommended ranges, and proposes merit and bonus within budget.
- Proposals route through **approvals**; the system tracks budget spend live.
- Approved increases update **Employee Central** and flow to **payroll** — no spreadsheet consolidation, raises tied to performance, budget respected.

## Why It Matters

Compensation Management makes the annual pay process fair, controlled, and efficient. Worksheets with budgets and guidelines prevent overspending and inconsistency, pay-for-performance ties rewards to contribution, and integration pushes approved changes straight into payroll — transforming a chaotic spreadsheet scramble into a governed, trusted process.`,
    keyConceptTitle: "Compensation: Budgeted, Performance-Linked Pay Planning",
    keyConceptBody: `- **SuccessFactors Compensation** manages merit increases, bonuses, and rewards through a controlled **compensation plan**, not spreadsheets.
- Managers use **worksheets** that enforce **budgets** and **guidelines**; **pay-for-performance** ties recommended increases to performance ratings.
- Proposals route through **approvals**, then approved changes flow to **Employee Central** and **payroll** — fair, in-budget, and re-keying-free.`,
  },
});
// Flowchart for lesson 15.6
const flowchart15_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson15_6.id },
  update: {},
  create: {
    lessonId: lesson15_6.id,
    title: "The Compensation Planning Cycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 120 }, data: { label: "📋 Plan: Budget & Guidelines" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 120 }, data: { label: "📊 Manager Worksheet (Ratings)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 120 }, data: { label: "✅ Approvals" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 130, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 640, y: 120 }, data: { label: "🏛️ Update Employee Central" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 640, y: 260 }, data: { label: "💵 Flows to Payroll" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart15_6.id, nodeId: "node1", title: "Plan: Budget & Guidelines", description: "HR defines the compensation plan — eligibility, the total budget, and guidelines (e.g. recommended increase ranges by performance rating).", tCode: "SF Compensation", tips: "Linking guidelines to performance ratings is what enables pay-for-performance." },
    { flowchartId: flowchart15_6.id, nodeId: "node2", title: "Manager Worksheet", description: "Managers propose merit and bonus on a worksheet showing each team member's pay, rating, and recommended range — within budget.", tCode: "SF Compensation (Worksheet)", tips: "The worksheet enforces budget and guidelines, preventing overspend and inconsistency." },
    { flowchartId: flowchart15_6.id, nodeId: "node3", title: "Approvals", description: "Completed worksheets route up for approval (manager → senior manager → HR), with budget spend tracked live.", tCode: "SF Compensation", tips: "Approval routing gives oversight while keeping the process moving." },
    { flowchartId: flowchart15_6.id, nodeId: "node4", title: "Update Employee Central", description: "Approved pay changes update the employee's record in Employee Central — the single source of truth for HR data.", tCode: "SF Employee Central", tips: "Because EC is updated, downstream processes use the new pay automatically." },
    { flowchartId: flowchart15_6.id, nodeId: "node5", title: "Flows to Payroll", description: "From Employee Central, the new pay flows to payroll so the awarded increases actually appear in paychecks — no re-keying.", tCode: "EC Payroll / integration", tips: "End-to-end flow means the raise the manager approved is exactly what gets paid." },
  ],
});
// Quiz for lesson 15.6
await prisma.quiz.upsert({
  where: { lessonId: lesson15_6.id },
  update: {},
  create: {
    lessonId: lesson15_6.id,
    title: "Compensation Management — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is a manager worksheet in SuccessFactors Compensation?",
          explanation: "A worksheet is the controlled screen where a manager proposes pay changes for their team, showing current pay, performance ratings, and recommended ranges — while enforcing the budget and guidelines.",
          options: {
            create: [
              { text: "A controlled screen for proposing team pay within budget and guidelines", isCorrect: true },
              { text: "A printed copy of the company's revenue", isCorrect: false },
              { text: "A training course catalog", isCorrect: false },
              { text: "A recruiting job requisition", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does 'pay-for-performance' mean in Compensation Management?",
          explanation: "Compensation guidelines can be driven by performance ratings (from Performance & Goals), so higher-rated employees get higher recommended increases. This ties rewards to contribution, making raises fairer.",
          options: {
            create: [
              { text: "Recommended increases are tied to employees' performance ratings", isCorrect: true },
              { text: "Everyone gets exactly the same raise regardless of performance", isCorrect: false },
              { text: "Pay is decided randomly", isCorrect: false },
              { text: "Only the CEO receives any pay", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is using budgeted worksheets better than managers emailing salary spreadsheets?",
          explanation: "Worksheets enforce the budget and guidelines in real time and route through approvals, preventing overspend, inconsistency, and lost data. Free-form spreadsheets allow budget overruns, unfair gaps, and weeks of manual consolidation.",
          options: {
            create: [
              { text: "They enforce budget/guidelines and approvals, preventing overspend and errors", isCorrect: true },
              { text: "Spreadsheets automatically follow the budget", isCorrect: false },
              { text: "Worksheets remove the need for any budget", isCorrect: false },
              { text: "Email is more secure and auditable", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 15.7: Succession & Development
const lesson15_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-succession-development" } },
  update: {},
  create: {
    moduleId: sfModule.id,
    title: "Succession & Development",
    slug: "sf-succession-development",
    order: 7,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `When the head of operations suddenly resigned at Anjali's company, panic followed — there was no ready replacement, and it took months to fill the role. The CEO asked, "Why didn't we know who could step up? And are we developing people for the future?" The company had no plan for its critical roles.

SuccessFactors Succession & Development answers exactly this: identifying future leaders and growing people to fill key roles.`,
    content: `## Planning for the Future of Talent

**SuccessFactors Succession & Development** helps a company ensure it has the right people ready for **critical roles** in the future — and actively **develops** employees to get there. It turns "we'll worry about it when someone leaves" into a deliberate plan.

## Two Connected Capabilities

- **Succession Planning** — identifying critical positions and the **successors** ready (or being readied) to fill them.
- **Development** — growing employees' skills and careers through **development goals** and plans, so successors actually become ready.

## Succession Planning — Who Can Step Up?

For each **critical role**, you identify potential **successors** and how ready they are (e.g. "ready now," "ready in 1–2 years"). This creates a **succession plan** so that when a key person leaves, the company already knows who can step up — no panic, no long gap.

**Talent pools** group high-potential employees (e.g. "future leaders") so they can be developed and considered across multiple roles, not just one.

## The 9-Box Grid — A Key Tool

The **9-box grid** plots employees on two axes — **performance** (how they're doing now) and **potential** (how far they could grow) — into nine boxes. It's a visual way to spot, for example, "high performance + high potential" stars to prioritize for succession and development, versus those needing support. It's a staple of talent reviews.

## Development — Making Successors Ready

Identifying a successor isn't enough; they must be **developed**. **Development goals** (often linked to Performance & Goals and Learning) target the skills a person needs for their next role. **Career development plans** map a path, and the LMS can supply the courses. This closes the loop: a "ready in 2 years" successor follows a development plan to become "ready now."

## How It Connects

Succession & Development draws on data from across the suite: **performance ratings** (from PM/GM) feed the 9-box and readiness; **Learning** delivers development; **Employee Central** provides the org and role data. It's where the talent lifecycle looks ahead.

## A Real Example

Anjali's company, planning ahead:
- They mark the head-of-operations role as **critical** and identify two **successors**, rating readiness.
- A **9-box** talent review highlights a high-performance/high-potential manager as a strong successor.
- That manager gets a **development plan** with goals and LMS courses to close skill gaps.
- A year later, when planning a transition, a ready successor already exists — no panic, no long vacancy.

## Why It Matters

Succession & Development protects the company against losing critical talent and builds its future leaders deliberately. Succession plans ensure continuity for key roles, the 9-box focuses attention on the right people, and development turns potential into readiness — making talent a planned asset rather than a gamble.`,
    keyConceptTitle: "Plan Successors for Critical Roles, Then Develop Them",
    keyConceptBody: `- **Succession Planning** identifies critical roles and **successors** (with readiness) and groups high-potentials into **talent pools** — so there's no gap when key people leave.
- The **9-box grid** plots **performance vs potential** to focus attention on the right people in talent reviews.
- **Development** (goals, career plans, LMS courses) turns successors from "ready later" into "ready now," drawing on performance and learning data across the suite.`,
  },
});
// Flowchart for lesson 15.7
const flowchart15_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson15_7.id },
  update: {},
  create: {
    lessonId: lesson15_7.id,
    title: "Succession and Development Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 120 }, data: { label: "🎯 Identify Critical Roles" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 240, y: 120 }, data: { label: "🔲 9-Box: Performance × Potential" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 120 }, data: { label: "👥 Name Successors / Talent Pools" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 470, y: 260 }, data: { label: "📈 Development Plan + Learning" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 700, y: 260 }, data: { label: "✅ Successor Becomes Ready" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart15_7.id, nodeId: "node1", title: "Identify Critical Roles", description: "Determine which positions are critical to the business — roles where a sudden vacancy would cause serious disruption.", tCode: "SF Succession", tips: "Focus succession effort on truly critical roles, not every position." },
    { flowchartId: flowchart15_7.id, nodeId: "node2", title: "9-Box Review", description: "Plot employees on performance vs potential to spot high-potential talent and inform succession and development decisions.", tCode: "SF Succession (9-Box)", tips: "The 9-box is a talent-review staple for focusing attention on the right people." },
    { flowchartId: flowchart15_7.id, nodeId: "node3", title: "Name Successors / Talent Pools", description: "Assign potential successors to critical roles with a readiness level, and group high-potentials into talent pools for broader consideration.", tCode: "SF Succession", tips: "Track readiness ('ready now' vs 'ready in 1–2 years') so you know where gaps remain." },
    { flowchartId: flowchart15_7.id, nodeId: "node4", title: "Development Plan + Learning", description: "Successors get development goals and a career plan, with LMS courses to close skill gaps — turning potential into readiness.", tCode: "SF Development / Learning", tips: "Link development goals to specific skills the next role requires." },
    { flowchartId: flowchart15_7.id, nodeId: "node5", title: "Successor Becomes Ready", description: "As development completes, a 'ready later' successor becomes 'ready now', so transitions happen smoothly without long vacancies.", tCode: "SF Succession", tips: "A pipeline of ready successors is what prevents the panic of a sudden departure." },
  ],
});
// Quiz for lesson 15.7
await prisma.quiz.upsert({
  where: { lessonId: lesson15_7.id },
  update: {},
  create: {
    lessonId: lesson15_7.id,
    title: "Succession & Development — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does the 9-box grid plot employees against?",
          explanation: "The 9-box grid plots employees on two axes — performance (how they're doing now) and potential (how far they could grow) — into nine boxes, helping identify high-potential talent for succession and development.",
          options: {
            create: [
              { text: "Performance versus potential", isCorrect: true },
              { text: "Salary versus age", isCorrect: false },
              { text: "Department versus location", isCorrect: false },
              { text: "Hire date versus tenure", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why isn't naming a successor enough on its own?",
          explanation: "A named successor may only be 'ready in 1–2 years'. Development — goals, career plans, and learning — is needed to close their skill gaps and turn potential into actual readiness, so they can step up when needed.",
          options: {
            create: [
              { text: "Successors must be developed to actually become ready for the role", isCorrect: true },
              { text: "Naming a successor instantly makes them fully qualified", isCorrect: false },
              { text: "Successors never need any new skills", isCorrect: false },
              { text: "Development is unrelated to succession", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "How does Succession & Development help avoid the panic of a key person suddenly leaving?",
          explanation: "By identifying critical roles in advance and maintaining a pipeline of developed, ready successors, the company already knows who can step up — turning a sudden departure into a smooth transition instead of a months-long scramble.",
          options: {
            create: [
              { text: "A ready successor pipeline is already in place for critical roles", isCorrect: true },
              { text: "It prevents anyone from ever resigning", isCorrect: false },
              { text: "It hires an external replacement automatically", isCorrect: false },
              { text: "It deletes the critical role entirely", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 15.8: SF Admin & Role-Based Permissions
const lesson15_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-admin-rbp" } },
  update: {},
  create: {
    moduleId: sfModule.id,
    title: "SF Admin & Permissions (RBP)",
    slug: "sf-admin-rbp",
    order: 8,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A new admin, Rohan, is told to "give managers access to their team's data — but not other teams', and definitely not salary fields for everyone." He also needs to turn on a new feature. He opens SuccessFactors and finds two different admin areas and a permissions system that decides exactly who sees what. Getting this wrong could expose sensitive HR data.

SF administration and Role-Based Permissions (RBP) are how you safely control access and configure the system.`,
    content: `## Administering SuccessFactors

Running SuccessFactors involves two kinds of admin work: **configuring** what the system does, and **controlling who can see and do what**. Because HR data is sensitive (salaries, performance, personal info), getting access control right is critical.

## Two Admin Areas: Provisioning vs Admin Center

| Area | Who uses it | What it's for |
|------|-------------|---------------|
| **Provisioning** | SAP / implementation partners (back-end) | Deep, sensitive setup — enabling modules, core switches |
| **Admin Center** | Customer administrators (day-to-day) | Everyday configuration, user management, permissions |

**Provisioning** is the powerful back-end tool, restricted to partners/SAP because mistakes there are serious. **Admin Center** is where customer admins do daily work — managing users, settings, and permissions. As a customer admin, you live mostly in **Admin Center**.

## Role-Based Permissions (RBP)

**Role-Based Permissions (RBP)** is SuccessFactors' security model — it decides exactly **who can access what data and functions**. It has two key parts:

| Part | Answers |
|------|---------|
| **Permission Role** | *What* can be done/seen (the permissions) |
| **Permission Group** | *Who* the role applies to (a group of users) |
| **Target Population** | *Whose data* they can act on |

The crucial concept is the **target population**: a permission role granted to a permission group also defines **whose data** they can see. So "managers" (group) can "view compensation" (role) but only for "their direct reports" (target population) — not everyone.

## Granted vs Target — The Key Idea

- **Granted population** — the people who *have* the permission (e.g. all managers).
- **Target population** — the people whose data they can *act on* (e.g. only their team).

This separation is what lets a manager see their own team's salaries but not another team's — precise, secure access.

## Putting It Together

To set up access you: define a **permission role** (the rights), assign it to a **permission group** (the users), and set the **target population** (whose data). RBP then enforces it everywhere in the system.

## A Real Example

Rohan's access task:
- He creates a **permission role** "Manager – View Comp" granting access to compensation fields.
- He assigns it to the **permission group** "All People Managers."
- He sets the **target population** to "the manager's direct reports."
- Result: each manager sees their *own* team's compensation, not other teams' — exactly the secure access required. Separately, deep feature switches would be done in **Provisioning** by the partner.

## Why It Matters

SF admin and RBP keep sensitive HR data secure while giving people the access they need. Understanding the split between Provisioning (deep setup) and Admin Center (daily work), and mastering RBP's granted-vs-target-population model, is essential — it's how you prevent data leaks and run SuccessFactors safely.`,
    keyConceptTitle: "RBP Controls Who Sees Whose Data; Admin Center vs Provisioning",
    keyConceptBody: `- SuccessFactors has two admin areas: **Provisioning** (deep back-end setup, partner/SAP only) and **Admin Center** (daily customer admin).
- **Role-Based Permissions (RBP)** controls access via **permission roles** (what), **permission groups** (who), and a **target population** (whose data).
- The **granted vs target population** split lets managers see only their own team's sensitive data — precise, secure access enforced system-wide.`,
  },
});
// Flowchart for lesson 15.8
const flowchart15_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson15_8.id },
  update: {},
  create: {
    lessonId: lesson15_8.id,
    title: "Setting Up Role-Based Permissions",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 120 }, data: { label: "🛡️ Define Permission Role (What)" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 270, y: 120 }, data: { label: "👥 Assign to Permission Group (Who)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 120 }, data: { label: "🎯 Set Target Population (Whose Data)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 510, y: 260 }, data: { label: "🔒 RBP Enforces Access" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 270, y: 260 }, data: { label: "⚙️ Done in Admin Center" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node5", target: "node1", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart15_8.id, nodeId: "node1", title: "Define Permission Role", description: "A permission role specifies WHAT can be done or seen — the set of permissions (e.g. view compensation, edit personal data).", tCode: "Admin Center (RBP)", tips: "Design roles around job functions so they're reusable and easy to audit." },
    { flowchartId: flowchart15_8.id, nodeId: "node2", title: "Assign to Permission Group", description: "A permission group is WHO the role applies to — a defined set of users (e.g. all people managers).", tCode: "Admin Center (RBP)", tips: "Groups can be dynamic (rule-based), so membership updates automatically." },
    { flowchartId: flowchart15_8.id, nodeId: "node3", title: "Set Target Population", description: "The target population defines WHOSE data the granted users can act on — e.g. only their direct reports, not everyone.", tCode: "Admin Center (RBP)", tips: "The granted vs target distinction is the heart of RBP — it limits data exposure precisely." },
    { flowchartId: flowchart15_8.id, nodeId: "node4", title: "RBP Enforces Access", description: "SuccessFactors enforces these rules everywhere, so users only see and do what their role and target population allow.", tCode: "RBP", tips: "Test with a sample user (proxy) to confirm they see exactly what's intended." },
    { flowchartId: flowchart15_8.id, nodeId: "node5", title: "Done in Admin Center", description: "Day-to-day permission and configuration work happens in Admin Center; deep back-end switches are in Provisioning (partner/SAP).", tCode: "Admin Center / Provisioning", tips: "Most admin tasks are in Admin Center; Provisioning is restricted for safety." },
  ],
});
// Quiz for lesson 15.8
await prisma.quiz.upsert({
  where: { lessonId: lesson15_8.id },
  update: {},
  create: {
    lessonId: lesson15_8.id,
    title: "SF Admin & Permissions (RBP) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the difference between Provisioning and Admin Center in SuccessFactors?",
          explanation: "Provisioning is the powerful back-end tool for deep, sensitive setup, restricted to SAP/implementation partners. Admin Center is where customer administrators do day-to-day configuration, user management, and permissions.",
          options: {
            create: [
              { text: "Provisioning is restricted deep setup; Admin Center is daily customer admin", isCorrect: true },
              { text: "They are the same screen with two names", isCorrect: false },
              { text: "Admin Center is only for employees, not admins", isCorrect: false },
              { text: "Provisioning is used by every employee daily", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "In Role-Based Permissions, what does the 'target population' define?",
          explanation: "The target population defines WHOSE data the granted users can act on. Combined with a permission role (what) and permission group (who), it lets you say managers can view comp, but only for their own direct reports.",
          options: {
            create: [
              { text: "Whose data the permitted users are allowed to act on", isCorrect: true },
              { text: "The company's revenue target", isCorrect: false },
              { text: "The number of training courses", isCorrect: false },
              { text: "The payroll run date", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "How does RBP let a manager see their own team's salaries but not another team's?",
          explanation: "RBP separates the granted population (who has the permission — all managers) from the target population (whose data they can see — only their direct reports). So each manager's access is scoped to their own team, protecting other teams' sensitive data.",
          options: {
            create: [
              { text: "The granted vs target population split scopes access to their own team", isCorrect: true },
              { text: "All managers can see everyone's salary by default", isCorrect: false },
              { text: "Salaries are never visible to any manager", isCorrect: false },
              { text: "It randomly decides who sees what", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 15.9: EC Payroll & Integration
const lesson15_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-ec-payroll-integration" } },
  update: {},
  create: {
    moduleId: sfModule.id,
    title: "EC Payroll & Integration",
    slug: "sf-ec-payroll-integration",
    order: 9,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Lakshmi's company keeps employee data in SuccessFactors Employee Central but still runs payroll in an SAP payroll system. New hires, pay changes, and terminations entered in EC must reach payroll accurately and on time — and right now they're partly re-keyed by hand, causing errors in paychecks. She asks, "How do these two systems stay in sync, and how does payroll actually run?"

This lesson covers SuccessFactors Employee Central Payroll and how EC integrates with payroll and finance.`,
    content: `## EC as the Master, Payroll Downstream

In a SuccessFactors world, **Employee Central (EC)** is the **system of record** for employee data — the master. Payroll consumes that data to calculate pay. The key idea: maintain data **once in EC**, and it flows to payroll automatically, rather than being re-keyed.

## What Is Employee Central Payroll (ECP)?

**Employee Central Payroll (ECP)** is SAP's payroll engine for SuccessFactors. Importantly, it's based on the **proven SAP HCM payroll engine** (the same robust calculation logic), but delivered as a managed service and **tightly integrated with EC**. So you get mature payroll calculation with EC as the front-end master data source.

| | Classic SAP HCM Payroll | EC Payroll (ECP) |
|--|------------------------|------------------|
| Master data source | SAP HCM infotypes | Employee Central |
| Engine | SAP payroll engine | Same proven engine |
| Delivery | On-premise | Managed, EC-integrated |

## The Integration: EC → Payroll

A **point-to-point integration** replicates employee and payroll-relevant data from **EC to ECP** (or to a third-party payroll). When a new hire, pay change, or termination is saved in EC, it flows to payroll — so payroll always works from current, accurate data without manual re-entry.

Data flowing includes: personal data, organizational assignment, pay components, bank details, and time/absence data needed for pay.

## The Payroll Run (Briefly)

Once data is in ECP, payroll runs much like SAP HCM payroll: a controlled run calculates gross-to-net (earnings minus deductions and taxes), produces payslips, and then **posts results to finance** and generates bank payments. (The detailed HCM payroll mechanics are covered in the HCM module; here the point is EC feeds it.)

## Integration with Finance and Other Systems

After payroll calculates, results **post to accounting** (FI/CO) — salary expense, tax and statutory payables, charged to the right cost centers. SuccessFactors and ECP also integrate with **S/4HANA / SAP ERP** so HR, payroll, and finance stay connected end to end.

## A Real Example

Lakshmi's sync problem solved:
- A pay change is entered **once in Employee Central**.
- The **EC → ECP integration** replicates it to payroll automatically — no re-keying.
- Payroll **runs** in ECP using the proven SAP engine, producing correct paychecks.
- Results **post to finance** and flow as bank payments; cost lands on the right cost centers.
- One source of truth (EC), accurate paychecks, connected finance.

## Why It Matters

EC Payroll and its integration ensure that the single source of HR truth (Employee Central) drives accurate, on-time pay using SAP's mature payroll engine — eliminating error-prone re-keying between systems. Understanding that EC is the master and payroll/finance are downstream is key to how modern SAP HR landscapes fit together.`,
    keyConceptTitle: "Employee Central Is the Master; EC Payroll Runs on the Proven Engine",
    keyConceptBody: `- **Employee Central (EC)** is the system of record; data is maintained once and **replicated to payroll**, avoiding re-keying.
- **EC Payroll (ECP)** uses SAP's **proven HCM payroll engine**, delivered as a managed, EC-integrated service.
- A point-to-point **EC → payroll integration** keeps data in sync; payroll then **posts results to finance (FI/CO)** and generates bank payments.`,
  },
});
// Flowchart for lesson 15.9
const flowchart15_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson15_9.id },
  update: {},
  create: {
    lessonId: lesson15_9.id,
    title: "From Employee Central to Paycheck",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 120 }, data: { label: "🏛️ Employee Central (Master Data)" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 270, y: 120 }, data: { label: "🔄 EC → Payroll Integration" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 490, y: 120 }, data: { label: "⚙️ EC Payroll Run (Proven Engine)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 720, y: 60 }, data: { label: "💵 Payslips & Bank Payments" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 720, y: 180 }, data: { label: "📊 Post to Finance (FI/CO)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart15_9.id, nodeId: "node1", title: "Employee Central (Master)", description: "EC is the single source of truth for employee data — hires, pay changes, terminations, org assignment. Data is maintained here once.", tCode: "SF Employee Central", tips: "Because EC is the master, accurate EC data is the foundation of accurate pay." },
    { flowchartId: flowchart15_9.id, nodeId: "node2", title: "EC → Payroll Integration", description: "A point-to-point integration replicates payroll-relevant data from EC to EC Payroll (or third-party payroll) automatically, eliminating re-keying.", tCode: "EC-Payroll integration", tips: "Replication keeps payroll working from current data the moment EC is updated." },
    { flowchartId: flowchart15_9.id, nodeId: "node3", title: "EC Payroll Run", description: "ECP uses SAP's proven payroll engine to calculate gross-to-net (earnings minus deductions and taxes) for all employees.", tCode: "ECP (payroll run)", tips: "It's the same robust SAP payroll engine, just fed by EC and delivered as a service." },
    { flowchartId: flowchart15_9.id, nodeId: "node4", title: "Payslips & Bank Payments", description: "The run produces payslips and generates bank payment files so employees are paid the correct net amount.", tCode: "ECP", tips: "Always verify the run (e.g. simulation) before payments go out." },
    { flowchartId: flowchart15_9.id, nodeId: "node5", title: "Post to Finance (FI/CO)", description: "Payroll results post to accounting — salary expense and payables charged to the right cost centers — connecting HR to finance.", tCode: "FI/CO posting", tips: "This is the same payroll-to-finance link covered in the HCM module." },
  ],
});
// Quiz for lesson 15.9
await prisma.quiz.upsert({
  where: { lessonId: lesson15_9.id },
  update: {},
  create: {
    lessonId: lesson15_9.id,
    title: "EC Payroll & Integration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In a SuccessFactors landscape, which system is the master source of employee data?",
          explanation: "Employee Central (EC) is the system of record — the master. Payroll and other systems consume EC's data. Maintaining data once in EC and replicating it avoids error-prone re-keying.",
          options: {
            create: [
              { text: "Employee Central (EC)", isCorrect: true },
              { text: "The payroll system", isCorrect: false },
              { text: "The recruiting career site", isCorrect: false },
              { text: "The LMS course catalog", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is notable about the engine behind Employee Central Payroll (ECP)?",
          explanation: "ECP is based on SAP's proven HCM payroll engine — the same mature calculation logic — but delivered as a managed service and tightly integrated with Employee Central as the master data source.",
          options: {
            create: [
              { text: "It uses SAP's proven HCM payroll engine, integrated with EC", isCorrect: true },
              { text: "It is a brand-new untested engine unrelated to SAP payroll", isCorrect: false },
              { text: "It cannot calculate taxes", isCorrect: false },
              { text: "It only works on paper", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does replicating data from EC to payroll improve paycheck accuracy?",
          explanation: "When a hire, pay change, or termination is entered once in EC and automatically replicated to payroll, payroll always works from current, accurate data — eliminating the manual re-keying between systems that causes errors in paychecks.",
          options: {
            create: [
              { text: "Payroll uses current EC data automatically, removing manual re-keying errors", isCorrect: true },
              { text: "Replication makes payroll ignore the data", isCorrect: false },
              { text: "It pays everyone the same amount", isCorrect: false },
              { text: "It deletes pay changes before payroll runs", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 15.10: People Analytics
const lesson15_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-people-analytics" } },
  update: {},
  create: {
    moduleId: sfModule.id,
    title: "People Analytics",
    slug: "sf-people-analytics",
    order: 10,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `The HR director asks Anjali, "What's our attrition rate by department this year, how diverse is our workforce, and where are our skill gaps?" The data exists across recruiting, performance, learning, and Employee Central — but it's scattered, and pulling it together by hand takes days. By then the questions have moved on.

SuccessFactors People Analytics brings all that HR data together into reports and dashboards that answer workforce questions fast.`,
    content: `## Turning HR Data into Insight

SuccessFactors holds rich data — who you hired, how they perform, what they've learned, who's leaving. **People Analytics** is the reporting and analytics capability that turns this scattered data into **insight**: headcount, attrition, diversity, time-to-hire, skill gaps, and more — to support better workforce decisions.

## Why HR Needs Its Own Analytics

HR questions span **multiple modules** — recruiting, performance, learning, compensation, Employee Central. People Analytics can combine data **across** these into one report, which manual spreadsheet-pulling can't do quickly or reliably. It gives leaders answers while the questions are still relevant.

## The Main Reporting Tools

SuccessFactors People Analytics includes different report types (the names have evolved over time):

| Report type | Best for |
|-------------|----------|
| **Story Reports** | Modern, interactive dashboards and visualizations (the current direction) |
| **Table / List Reports** | Detailed operational lists (e.g. all employees with a field set) |
| **Canvas Reports** | Older flexible reports combining tables and charts |
| **Tiles / Dashboards** | At-a-glance KPIs on the home page |

The modern direction is **Story Reports**, which provide rich, interactive dashboards — and notably are powered by **SAP Analytics Cloud (SAC)** technology embedded into SuccessFactors.

## Operational vs Strategic

- **Operational reporting** answers "who/what right now" — e.g. a list of employees missing a required document.
- **Strategic analytics** answers trends and big questions — attrition over time, diversity, workforce planning scenarios.

People Analytics supports both, and **Workforce Planning** extends it to model future scenarios (e.g. headcount needs).

## Real-Time and Embedded

Because reporting is built into SuccessFactors (and Story Reports use SAC tech), insights are based on the **live HR data** in the system, not stale exports. Managers and HR can drill from a KPI into detail.

## A Real Example

Anjali's questions answered:
- A **Story Report** dashboard shows **attrition by department** over the year, with a chart she can filter and drill into.
- A **diversity** report breaks the workforce down by the dimensions HR tracks.
- A **skills/learning** report (combining Learning and EC data) highlights skill gaps.
- All from live data, in minutes — not days of spreadsheet work — so HR acts while the questions still matter.

## Why It Matters

People Analytics turns SuccessFactors' rich, cross-module HR data into fast, trustworthy insight — attrition, diversity, skills, and workforce planning. With Story Reports powered by SAC technology, HR gets interactive, real-time dashboards instead of slow manual reports, enabling data-driven people decisions. It's where the whole talent lifecycle's data pays off.`,
    keyConceptTitle: "People Analytics Turns Cross-Module HR Data into Fast Insight",
    keyConceptBody: `- **People Analytics** combines data across recruiting, performance, learning, compensation, and EC to answer workforce questions (attrition, diversity, skills) quickly.
- It offers report types from **Table/List** (operational) to **Story Reports** (modern interactive dashboards, powered by **SAP Analytics Cloud** technology).
- It supports both **operational** ("who now") and **strategic** (trends, **Workforce Planning**) needs, on live HR data — enabling data-driven people decisions.`,
  },
});
// Flowchart for lesson 15.10
const flowchart15_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson15_10.id },
  update: {},
  create: {
    lessonId: lesson15_10.id,
    title: "How People Analytics Answers HR Questions",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 60 }, data: { label: "🏛️ Employee Central Data" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 40, y: 170 }, data: { label: "🧩 Recruiting / Perf / Learning Data" }, style: { background: "#94A3B8", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 120 }, data: { label: "📊 People Analytics (Story Reports)" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 560, y: 60 }, data: { label: "📈 Attrition / Diversity / Skills" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 560, y: 180 }, data: { label: "🧭 Workforce Planning Scenarios" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node3", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart15_10.id, nodeId: "node1", title: "Employee Central Data", description: "Core HR data — org, headcount, demographics, pay — comes from Employee Central, the system of record.", tCode: "SF Employee Central", tips: "Clean EC data is the foundation of trustworthy analytics." },
    { flowchartId: flowchart15_10.id, nodeId: "node2", title: "Recruiting / Perf / Learning Data", description: "Other modules add data — hiring metrics, performance ratings, learning completions — that People Analytics can combine.", tCode: "SF modules", tips: "Cross-module combination is exactly what manual spreadsheets struggle to do." },
    { flowchartId: flowchart15_10.id, nodeId: "node3", title: "People Analytics", description: "The reporting layer combines the data into reports and dashboards. Story Reports (powered by SAC tech) give modern, interactive visuals.", tCode: "SF People Analytics / Story Reports", tips: "Story Reports are the modern direction — interactive and SAC-powered." },
    { flowchartId: flowchart15_10.id, nodeId: "node4", title: "Attrition / Diversity / Skills", description: "Strategic insights like attrition trends, workforce diversity, and skill gaps are surfaced for leaders to act on.", tCode: "SF People Analytics", tips: "Drill from a KPI down to the underlying detail to investigate further." },
    { flowchartId: flowchart15_10.id, nodeId: "node5", title: "Workforce Planning Scenarios", description: "Workforce Planning extends analytics to model future scenarios — projected headcount needs, gaps, and supply/demand.", tCode: "SF Workforce Planning", tips: "Planning turns backward-looking analytics into forward-looking decisions." },
  ],
});
// Quiz for lesson 15.10
await prisma.quiz.upsert({
  where: { lessonId: lesson15_10.id },
  update: {},
  create: {
    lessonId: lesson15_10.id,
    title: "People Analytics — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why does HR benefit from People Analytics rather than pulling data from each module by hand?",
          explanation: "HR questions span multiple modules (recruiting, performance, learning, EC). People Analytics combines this cross-module data into reports quickly and reliably, giving leaders answers while the questions are still relevant — manual spreadsheet pulls are slow and error-prone.",
          options: {
            create: [
              { text: "It combines cross-module data into fast, reliable reports", isCorrect: true },
              { text: "It deletes data from the modules", isCorrect: false },
              { text: "It only works on one module at a time, like spreadsheets", isCorrect: false },
              { text: "It prevents HR from seeing any data", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What technology powers the modern Story Reports in SuccessFactors People Analytics?",
          explanation: "Story Reports — the modern, interactive dashboard direction — are powered by SAP Analytics Cloud (SAC) technology embedded into SuccessFactors, bringing rich visualization to HR reporting.",
          options: {
            create: [
              { text: "SAP Analytics Cloud (SAC) technology", isCorrect: true },
              { text: "A spreadsheet macro", isCorrect: false },
              { text: "The payroll engine", isCorrect: false },
              { text: "The recruiting career site", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the difference between operational reporting and strategic analytics in People Analytics?",
          explanation: "Operational reporting answers 'who/what right now' (e.g. a list of employees missing a document), while strategic analytics answers trends and big-picture questions (attrition over time, diversity, workforce planning). People Analytics supports both.",
          options: {
            create: [
              { text: "Operational answers 'who now'; strategic answers trends and big questions", isCorrect: true },
              { text: "They are identical", isCorrect: false },
              { text: "Operational is about payroll only; strategic about printing", isCorrect: false },
              { text: "Strategic analytics cannot use HR data", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 5 COMPLETE: ALL MODULES DONE — 111 total lessons ────────────────



