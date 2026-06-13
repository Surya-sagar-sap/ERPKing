// ─── BASIS: NEW LESSONS ──────────────────────────────────────────────────────
// LESSON 10.3: User Administration (SU01)
const lesson10_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "user-administration-su01" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "User Administration (SU01)",
    slug: "user-administration-su01",
    order: 3,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `On Meena's first day as a BASIS trainee, ten new hires need SAP access by lunchtime. Her manager says, "Create their user IDs in SU01 and assign the right roles." Meena freezes — she has never created an SAP user and doesn't know what fields matter or how a login even works.

User administration is the BASIS gatekeeper job: every person who touches SAP needs an account, and getting it right keeps the system both usable and secure.`,
    content: `## Why User Administration Matters

Every person who logs into SAP needs a **user master record** — their account. BASIS administrators create, change, lock, and delete these accounts. It's the front door of the system: do it well and people work smoothly and securely; do it badly and you get lockouts or security holes.

## The Main Tool: SU01

**SU01** is the transaction to manage a single user. A user record is organized into tabs:

| Tab | What it holds |
|-----|---------------|
| **Address** | Name, email, department |
| **Logon Data** | User type, password, validity dates |
| **Roles** | The roles (access) assigned to the user |
| **Profiles** | Authorization profiles (usually filled via roles) |
| **Parameters** | Default values to speed up data entry |

## User Types — Not Everyone Is a Person

The **Logon Data** tab sets the **user type**, which controls how the account behaves:

| User Type | Use |
|-----------|-----|
| **Dialog (A)** | A real person logging in interactively |
| **System (B)** | Background jobs, system-to-system |
| **Communication (C)** | RFC connections without dialog logon |
| **Service (S)** | Shared, anonymous access (use carefully) |
| **Reference (L)** | A template to grant extra rights |

## Mass Creation: SU10

Creating ten users one by one in SU01 is slow. **SU10** lets you maintain **many users at once** — for example, locking 50 accounts or adding a role to a whole group in one action.

## The Lifecycle of a User

A user account is created, used, sometimes **locked** (temporarily blocked, e.g. on leave or after wrong passwords), and finally **deleted** or set to expire when the person leaves. Locking is reversible; deletion is not.

## Key User Admin T-Codes

| T-Code | Purpose |
|--------|---------|
| **SU01** | Create/change one user |
| **SU10** | Mass user maintenance |
| **SU01D** | Display a user (read-only) |
| **SUIM** | User information system (who has what) |

## A Real Example

Meena's ten new hires:
- She opens **SU01**, creates each as a **Dialog** user, fills the Address and Logon Data, sets an initial password, and assigns roles on the Roles tab.
- Realizing they all need one common role, she switches to **SU10** and adds it to all ten at once.
- A user on long leave is **locked** rather than deleted, so the account returns when they're back.

## Why It Matters

User administration is the foundation of SAP access and security. The right user type, valid dates, and locking/deletion discipline keep the system secure and auditable — while SU10 keeps the admin workload manageable at scale.`,
    keyConceptTitle: "SU01 Manages User Accounts; SU10 Does It in Bulk",
    keyConceptBody: `- **SU01** creates and maintains one user master record (Address, Logon Data, Roles, Parameters); **SU10** maintains many users at once.
- The **user type** (Dialog, System, Communication, Service, Reference) controls how the account can be used.
- Accounts can be **locked** (reversible) or **deleted/expired** (permanent); SUIM reports who has which access.`,
  },
});
// Flowchart for lesson 10.3
const flowchart10_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_3.id },
  update: {},
  create: {
    lessonId: lesson10_3.id,
    title: "Creating an SAP User",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🆕 Open SU01" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 110 }, data: { label: "📇 Address & Logon Data" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 460, y: 110 }, data: { label: "🎭 Assign Roles" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 650, y: 110 }, data: { label: "🔑 Set Initial Password" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 450, y: 250 }, data: { label: "👥 Bulk Changes (SU10)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart10_3.id, nodeId: "node1", title: "Open SU01", description: "Start the user maintenance transaction, enter a user ID, and choose Create. This begins a new user master record.", tCode: "SU01", tips: "Follow a naming convention for user IDs so accounts are easy to identify and audit." },
    { flowchartId: flowchart10_3.id, nodeId: "node2", title: "Address & Logon Data", description: "Fill the person's details (name, email) and the Logon Data tab, where you set the user type and validity dates.", tCode: "SU01 (Address / Logon Data)", tips: "Pick the correct user type — Dialog for people, System/Communication for technical accounts." },
    { flowchartId: flowchart10_3.id, nodeId: "node3", title: "Assign Roles", description: "On the Roles tab, assign the roles that grant the access the user needs for their job.", tCode: "SU01 (Roles tab)", tips: "Assign roles, not raw profiles — roles are the maintainable, auditable way to grant access." },
    { flowchartId: flowchart10_3.id, nodeId: "node4", title: "Set Initial Password", description: "Set a temporary initial password the user must change at first logon, then save the account.", tCode: "SU01", tips: "Initial passwords should be one-time; the system forces a change on first login." },
    { flowchartId: flowchart10_3.id, nodeId: "node5", title: "Bulk Changes (SU10)", description: "When many users need the same change (add a role, lock accounts), SU10 applies it to all of them at once.", tCode: "SU10", tips: "SU10 is a huge time-saver for onboarding groups or org-wide role changes." },
  ],
});
// Quiz for lesson 10.3
await prisma.quiz.upsert({
  where: { lessonId: lesson10_3.id },
  update: {},
  create: {
    lessonId: lesson10_3.id,
    title: "User Administration (SU01) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction creates and maintains a single SAP user account?",
          explanation: "SU01 is the transaction for creating and maintaining one user master record (address, logon data, roles). SU10 is for mass maintenance of many users at once.",
          options: {
            create: [
              { text: "SU01", isCorrect: true },
              { text: "SE11", isCorrect: false },
              { text: "SM37", isCorrect: false },
              { text: "ST22", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A background job needs its own SAP account that no person logs into interactively. Which user type fits best?",
          explanation: "A System (type B) user is designed for background processing and system-to-system communication — it isn't used for interactive (dialog) logon. A Dialog user is for real people logging in.",
          options: {
            create: [
              { text: "System (B)", isCorrect: true },
              { text: "Dialog (A)", isCorrect: false },
              { text: "Reference (L)", isCorrect: false },
              { text: "Service (S)", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "An employee goes on three months of leave. Why is locking their account better than deleting it?",
          explanation: "Locking is reversible — the account (with its roles and settings) is simply blocked and can be unlocked when they return. Deleting is permanent and would require recreating everything from scratch.",
          options: {
            create: [
              { text: "Locking is reversible, so the account returns intact when they're back", isCorrect: true },
              { text: "Locking pays the employee while away", isCorrect: false },
              { text: "Deleting is impossible in SAP", isCorrect: false },
              { text: "There is no difference between the two", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.4: Roles & Authorizations (PFCG)
const lesson10_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "roles-authorizations-pfcg" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "Roles & Authorizations (PFCG)",
    slug: "roles-authorizations-pfcg",
    order: 4,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A user calls Arjun, a BASIS admin: "I keep getting 'You are not authorized' when I try to post an invoice!" The user has a valid account, so why is SAP blocking them? Arjun knows the account is only half the story — what a user can actually DO depends on their authorizations.

Roles and authorizations are SAP's security engine: they decide not just who logs in, but exactly which transactions and data each person may touch.`,
    content: `## Account vs Authorization

Having a user account lets you *log in*. **Authorizations** decide what you can *do* once inside. The two are separate: a valid user with the wrong authorizations gets the dreaded "not authorized" error.

## How Authorization Works (The Layers)

SAP security is built from nested pieces. From the ground up:

| Layer | What it is |
|-------|-----------|
| **Authorization Field** | A single data point, e.g. company code |
| **Authorization Object** | A group of fields checked together, e.g. F_BKPF_BUK (post in company code) |
| **Authorization** | An object with specific allowed values |
| **Role (Profile)** | A bundle of authorizations + the menu of transactions |
| **User** | Gets roles assigned (SU01) |

When a user runs a transaction, SAP performs an **authorization check** against the relevant authorization objects. If their role doesn't grant the needed values, access is denied.

## The Main Tool: PFCG

**PFCG** (Profile Generator) is where roles are built. A role contains:
- A **menu** (the transactions/apps the user sees),
- **Authorizations** (auto-derived from the menu, then refined),
- A generated **profile** (the technical object actually checked at runtime).

Steps: add transactions to the role menu → maintain authorization field values → **generate the profile** → assign the role to users.

## Single vs Composite & Derived Roles

| Role type | Purpose |
|-----------|---------|
| **Single role** | One job function's access |
| **Composite role** | A bundle of single roles (e.g. "AP Clerk" = several singles) |
| **Derived role** | Copies a master role but changes org values (e.g. same access, different company code) |

## Troubleshooting: SU53 and ST01

When a user hits "not authorized," BASIS diagnoses it:
- **SU53** — shows the *last failed authorization check* for that user (the missing object and values).
- **ST01 / STAUTHTRACE** — a live authorization trace for deeper analysis.

The fix is usually to add the missing authorization to their role in PFCG.

## A Real Example

Arjun's blocked user:
- Runs **SU53** for them → sees the failed object **F_BKPF_BUK** for company code 1000.
- The user's role allowed posting only in company code 2000.
- In **PFCG**, Arjun adds company code 1000 to the role, regenerates the profile, and the user can now post.

## Why It Matters

Authorizations are SAP's security backbone — they enforce that people can only see and do what their job requires (least privilege). Mastering PFCG and SU53 means you can grant exactly the right access and quickly resolve the access errors that fill every BASIS admin's inbox.`,
    keyConceptTitle: "Roles Bundle Authorizations; PFCG Builds Them",
    keyConceptBody: `- **Authorizations** (built from authorization objects and fields) decide what a logged-in user can do; SAP runs an **authorization check** on each action.
- **Roles** bundle authorizations plus a transaction menu and generate a **profile**; they're built in **PFCG** and assigned to users.
- **SU53** shows the last failed authorization check — the go-to tool for fixing "not authorized" errors.`,
  },
});
// Flowchart for lesson 10.4
const flowchart10_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_4.id },
  update: {},
  create: {
    lessonId: lesson10_4.id,
    title: "How Authorization Works",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🏗️ Build Role (PFCG)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 260, y: 110 }, data: { label: "🔐 Maintain Auth Objects" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 110 }, data: { label: "⚙️ Generate Profile" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 670, y: 110 }, data: { label: "👤 Assign Role to User" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 470, y: 250 }, data: { label: "🚫 Access Denied? Run SU53" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node1", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart10_4.id, nodeId: "node1", title: "Build Role (PFCG)", description: "In PFCG you create a role and add the transactions/apps to its menu — defining what the user can navigate to.", tCode: "PFCG", tips: "Adding a transaction to the menu auto-proposes the authorizations it needs." },
    { flowchartId: flowchart10_4.id, nodeId: "node2", title: "Maintain Auth Objects", description: "Refine the authorization objects and their field values (e.g. which company codes) so access is precise — neither too broad nor too narrow.", tCode: "PFCG (Authorizations tab)", tips: "Yellow/red traffic lights in PFCG mean some authorization values still need maintaining." },
    { flowchartId: flowchart10_4.id, nodeId: "node3", title: "Generate Profile", description: "PFCG generates the technical authorization profile — the object SAP actually checks at runtime. A role isn't active until generated.", tCode: "PFCG (Generate)", tips: "Always regenerate after changing authorizations, or your edits won't take effect." },
    { flowchartId: flowchart10_4.id, nodeId: "node4", title: "Assign Role to User", description: "Assign the role to users (in PFCG's User tab or via SU01). They now inherit its access. A user comparison updates the profile assignment.", tCode: "PFCG / SU01", tips: "Run user master comparison so the generated profile actually reaches the user." },
    { flowchartId: flowchart10_4.id, nodeId: "node5", title: "Access Denied? Run SU53", description: "If a user is blocked, SU53 shows the last failed authorization check — the exact object and values missing — guiding the fix in PFCG.", tCode: "SU53 / STAUTHTRACE", tips: "Ask the user to run SU53 immediately after the error so it captures the right failed check." },
  ],
});
// Quiz for lesson 10.4
await prisma.quiz.upsert({
  where: { lessonId: lesson10_4.id },
  update: {},
  create: {
    lessonId: lesson10_4.id,
    title: "Roles & Authorizations (PFCG) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A user can log in but gets 'You are not authorized' when posting an invoice. What does this tell you?",
          explanation: "The account is valid (they logged in), but their authorizations don't permit that action. Logging in and being authorized to do something are separate — the role lacks the needed authorization values.",
          options: {
            create: [
              { text: "Their account is valid but their role lacks the needed authorization", isCorrect: true },
              { text: "Their password has expired", isCorrect: false },
              { text: "The SAP system is down", isCorrect: false },
              { text: "They need a faster computer", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which transaction is used to build and maintain roles in SAP?",
          explanation: "PFCG (the Profile Generator) is where roles are built — adding transactions to the menu, maintaining authorization objects, and generating the profile that SAP checks at runtime.",
          options: {
            create: [
              { text: "PFCG", isCorrect: true },
              { text: "SU53", isCorrect: false },
              { text: "SE38", isCorrect: false },
              { text: "SP01", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "After changing a role's authorizations in PFCG, a user still can't access the function. What was most likely missed?",
          explanation: "The profile must be regenerated (and the user master compared/updated) for changes to take effect. Editing authorizations without generating the profile means the runtime check still uses the old values.",
          options: {
            create: [
              { text: "The profile wasn't regenerated after the change", isCorrect: true },
              { text: "The user needs a new keyboard", isCorrect: false },
              { text: "Roles never affect access", isCorrect: false },
              { text: "Authorizations only work on weekends", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.5: Client Administration (SCC4)
const lesson10_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "client-administration-scc4" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "Client Administration (SCC4)",
    slug: "client-administration-scc4",
    order: 5,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Priya logs into the training system and types client "100" — then realizes there's also a client "200" and "300" on the same server. She wonders: what exactly is a client, why are there several, and why does the team insist that "you must never change config in client 100"?

Client administration is about these self-contained business worlds inside one SAP system — and the settings that protect them from accidental damage.`,
    content: `## What Is a Client?

A **client** is a self-contained business unit within one SAP system, identified by a 3-digit number (e.g. 100, 200). Each client has its **own data** — master data, transaction data, and user accounts — kept separate from other clients on the same server.

Think of one SAP system as an **apartment building** and each client as a separate **apartment**: same building (and shared structure/code), but each apartment's furniture and residents are independent.

## Client-Specific vs Cross-Client Data

| Data type | Scope |
|-----------|-------|
| **Client-specific** | Customizing, master & transaction data, users — separate per client |
| **Cross-client** | Repository objects (ABAP programs), some system settings — shared by all clients |

This is why you can have a "config" client and a "test" client side by side: their business data is independent, but they share the same programs.

## Why Multiple Clients?

A single system often hosts several clients for different purposes — for example a customizing client, a unit-test client, and a sandbox — so teams can work without disturbing each other.

## The Key Tool: SCC4

**SCC4** maintains client settings. Two critical controls protect each client:

| Setting | What it controls |
|---------|------------------|
| **Client role** | Production, Customizing, Test, etc. |
| **Changes to client-specific objects** | Whether customizing can be changed here |
| **Changes to cross-client objects** | Whether shared objects can be changed |
| **Client copy / comparison protection** | Restricts overwriting |

Setting a production client to "**no changes allowed**" is what stops someone accidentally editing config directly in PRD — changes must come through transports instead.

## Client Copy — Duplicating a Client

To set up a new client or refresh test data, BASIS performs a **client copy**:

| T-Code | Use |
|--------|-----|
| **SCCL** | Local client copy (same system) |
| **SCC8** | Client export (to another system) |
| **SCC9** | Remote client copy |
| **SCC4** | Maintain client settings |

A **copy profile** (e.g. SAP_ALL, SAP_CUST) decides whether you copy everything or just customizing.

## A Real Example

Priya's landscape:
- **Client 100** — customizing client, set in SCC4 to allow changes (this is where config is built).
- **Client 200** — test client, set to "no changes," refreshed periodically from 100 via **SCCL**.
- The **production** client is locked in SCC4 so no one can change config directly — protecting the live business.

## Why It Matters

Client administration keeps multiple independent business environments running safely on one system. SCC4 settings prevent accidental changes to production, and client copies let teams create and refresh test environments — both essential to a controlled, reliable SAP landscape.`,
    keyConceptTitle: "A Client Is a Self-Contained Data World; SCC4 Protects It",
    keyConceptBody: `- A **client** (3-digit, e.g. 100) is a self-contained unit with its own master/transaction data and users; programs are **cross-client** (shared).
- **SCC4** sets each client's role and change options — e.g. locking production so config can't be edited directly (only via transports).
- **Client copy** (SCCL local, SCC8/SCC9 remote) duplicates a client to create or refresh environments, using copy profiles like SAP_ALL or SAP_CUST.`,
  },
});
// Flowchart for lesson 10.5
const flowchart10_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_5.id },
  update: {},
  create: {
    lessonId: lesson10_5.id,
    title: "Clients & Client Copy",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🏢 One SAP System" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 50 }, data: { label: "🚪 Client 100 (Customizing)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 250, y: 170 }, data: { label: "🚪 Client 200 (Test)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 460, y: 110 }, data: { label: "🛡️ SCC4 Sets Change Rules" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 680, y: 110 }, data: { label: "📋 Client Copy (SCCL) to Refresh" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart10_5.id, nodeId: "node1", title: "One SAP System", description: "A single SAP system can host several clients. They share the same programs (cross-client) but keep separate business data.", tCode: "N/A", tips: "Think building (system) with separate apartments (clients) — shared structure, independent contents." },
    { flowchartId: flowchart10_5.id, nodeId: "node2", title: "Client 100 (Customizing)", description: "The client where configuration is built. SCC4 allows changes here so consultants can do customizing.", tCode: "SCC4", tips: "Config is created in the customizing client of DEV, then transported onward." },
    { flowchartId: flowchart10_5.id, nodeId: "node3", title: "Client 200 (Test)", description: "A separate client for testing with its own data, typically locked against config changes and refreshed periodically.", tCode: "SCC4", tips: "Keeping test data separate lets QA test without touching the config client." },
    { flowchartId: flowchart10_5.id, nodeId: "node4", title: "SCC4 Sets Change Rules", description: "SCC4 defines each client's role and whether client-specific and cross-client changes are allowed — the safety switch.", tCode: "SCC4", tips: "Lock production in SCC4 so config can only arrive via transports, never direct edits." },
    { flowchartId: flowchart10_5.id, nodeId: "node5", title: "Client Copy (SCCL)", description: "A client copy duplicates one client's data into another to create or refresh environments, using a copy profile (e.g. SAP_CUST).", tCode: "SCCL / SCC8 / SCC9", tips: "Choose the right copy profile — SAP_ALL copies everything; SAP_CUST copies just customizing." },
  ],
});
// Quiz for lesson 10.5
await prisma.quiz.upsert({
  where: { lessonId: lesson10_5.id },
  update: {},
  create: {
    lessonId: lesson10_5.id,
    title: "Client Administration (SCC4) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is a 'client' in an SAP system?",
          explanation: "A client is a self-contained business unit within one SAP system, with its own master data, transaction data, and users. Multiple clients can run on the same system while keeping their business data separate.",
          options: {
            create: [
              { text: "A self-contained data unit with its own data and users", isCorrect: true },
              { text: "A customer who buys products", isCorrect: false },
              { text: "A type of ABAP program", isCorrect: false },
              { text: "A printer attached to SAP", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why is a production client typically set in SCC4 to 'no changes to client-specific objects'?",
          explanation: "Locking the production client prevents anyone from editing configuration directly in the live system. Changes must instead come through tested transports (DEV → QAS → PRD), protecting business operations.",
          options: {
            create: [
              { text: "So config can't be edited directly in production — only via transports", isCorrect: true },
              { text: "To stop users from logging in", isCorrect: false },
              { text: "To delete the client's data nightly", isCorrect: false },
              { text: "Because production clients have no data", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A team needs a test client refreshed with a copy of the customizing client's settings. Which tool do they use?",
          explanation: "A client copy duplicates one client's data into another. SCCL performs a local client copy (within the same system), and a copy profile like SAP_CUST controls that only customizing is copied.",
          options: {
            create: [
              { text: "A client copy (e.g. SCCL) with an appropriate copy profile", isCorrect: true },
              { text: "SU01 user creation", isCorrect: false },
              { text: "ST22 dump analysis", isCorrect: false },
              { text: "SP01 spool management", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.6: The Transport System in Depth (STMS)
const lesson10_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "transport-system-stms" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "The Transport System in Depth (STMS)",
    slug: "transport-system-stms",
    order: 6,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A developer finishes a change in the DEV system and tells Ramesh, the BASIS admin, "It's ready — move it to quality and then production." Ramesh knows changes never get re-typed in each system; they travel in a container. But how exactly does that container get created, released, and imported safely?

The transport system is the controlled pipeline that carries every change from DEV → QAS → PRD — and STMS is the control tower.`,
    content: `## Why Transports Exist

You already know changes flow **DEV → QAS → PRD** and are never built directly in production. The **transport system** is the machinery that moves them. It guarantees that exactly the same change tested in QAS is what reaches PRD — no manual re-keying, no surprises.

## What Is a Transport Request?

A **transport request (TR)** is a container that records changes (config and/or code) made in DEV. It has:
- A **10-character ID** like DEVK900123,
- One or more **tasks** (usually one per developer),
- A list of the objects changed.

Two main types:

| Type | Carries |
|------|---------|
| **Workbench request** | Cross-client repository objects (ABAP programs, DDIC) |
| **Customizing request** | Client-specific configuration |

## The Transport Lifecycle

1. **Create & record** — when you change something in DEV, it's captured in a transport request (and your task).
2. **Release** — once done, you release the task and then the request (**SE10 / SE09**). Releasing exports the changes to the transport directory at the OS level.
3. **Import to QAS** — BASIS imports the released request into QAS (**STMS import queue**) and the change is tested.
4. **Import to PRD** — after sign-off, the same request is imported into production.

Imports happen in the **right sequence** so dependent changes apply in order.

## STMS — The Control Tower

**STMS** (Transport Management System) configures and runs transports across the landscape:
- Defines the **transport routes** (which system flows to which),
- Shows the **import queue** per system,
- Lets BASIS import requests and review logs/return codes.

A transport's **return code** tells you the result: **0** = success, **4** = warnings, **8+** = errors to investigate.

## Key Transport T-Codes

| T-Code | Purpose |
|--------|---------|
| **SE10 / SE09** | Transport Organizer (create, release requests) |
| **STMS** | Manage transport routes & import queues |
| **STMS_IMPORT** | Import queue of a system |
| **SE03** | Transport tools (search, lock objects) |

## A Real Example

Ramesh's change:
- The developer's work in DEV is recorded in request **DEVK900123**; they release their task, then the request (**SE10**).
- In **STMS**, Ramesh sees DEVK900123 in the QAS import queue and imports it; testers verify it.
- After sign-off, he imports the *same* request into PRD. The import log shows **return code 0** — clean success.

## Why It Matters

The transport system is the backbone of safe change management in SAP. It ensures consistency across DEV/QAS/PRD, enforces testing before production, and gives a full audit trail of who changed what and when — which is exactly why direct changes in PRD are forbidden.`,
    keyConceptTitle: "Transports Carry Changes DEV→QAS→PRD via STMS",
    keyConceptBody: `- A **transport request** (10-char ID, e.g. DEVK900123) is a container of changes — **Workbench** (code/DDIC) or **Customizing** (config).
- The lifecycle is **create/record → release (SE10/SE09) → import to QAS → import to PRD**, in the correct sequence.
- **STMS** manages transport routes and import queues; the **return code** (0 success, 4 warning, 8+ error) shows the import result.`,
  },
});
// Flowchart for lesson 10.6
const flowchart10_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_6.id },
  update: {},
  create: {
    lessonId: lesson10_6.id,
    title: "Transport Request Lifecycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "✏️ Change in DEV → Recorded in TR" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 110 }, data: { label: "📤 Release Request (SE10)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 110 }, data: { label: "📥 Import to QAS (STMS)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 510, y: 250 }, data: { label: "🧪 Test & Sign Off" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 720, y: 250 }, data: { label: "🚀 Import to PRD" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart10_6.id, nodeId: "node1", title: "Change Recorded in TR", description: "When you change config or code in DEV, the change is captured in a transport request and your task within it.", tCode: "SE10 / SE09", tips: "Use clear request descriptions so anyone can tell what a transport contains later." },
    { flowchartId: flowchart10_6.id, nodeId: "node2", title: "Release Request (SE10)", description: "Releasing the task and then the request exports the changes from DEV to the transport directory, ready to import elsewhere.", tCode: "SE10 / SE09", tips: "Release the task first, then the request — both must be released before import." },
    { flowchartId: flowchart10_6.id, nodeId: "node3", title: "Import to QAS (STMS)", description: "BASIS imports the released request from the QAS import queue in STMS so the change can be tested with realistic data.", tCode: "STMS / STMS_IMPORT", tips: "Import requests in the order they were released to preserve dependencies." },
    { flowchartId: flowchart10_6.id, nodeId: "node4", title: "Test & Sign Off", description: "Testers validate the change in QAS. Only after sign-off does the same request proceed to production.", tCode: "N/A", tips: "Never skip QAS — it's the safety gate that protects the live system." },
    { flowchartId: flowchart10_6.id, nodeId: "node5", title: "Import to PRD", description: "The identical request is imported into production. The import log's return code confirms success (0) or flags issues (4/8).", tCode: "STMS_IMPORT", tips: "A return code of 8 or higher needs investigation before users rely on the change." },
  ],
});
// Quiz for lesson 10.6
await prisma.quiz.upsert({
  where: { lessonId: lesson10_6.id },
  update: {},
  create: {
    lessonId: lesson10_6.id,
    title: "The Transport System (STMS) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is a transport request?",
          explanation: "A transport request is a container (with a 10-character ID) that records the config and/or code changes made in DEV, so they can be moved consistently to QAS and PRD without re-typing.",
          options: {
            create: [
              { text: "A container that records changes to move them between systems", isCorrect: true },
              { text: "A truck that delivers servers", isCorrect: false },
              { text: "A user's login session", isCorrect: false },
              { text: "A type of printer queue", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why is the SAME transport request imported into PRD that was tested in QAS, rather than re-creating the change?",
          explanation: "Reusing the identical request guarantees that exactly what was tested in QAS is what reaches production — no manual re-keying, no divergence. This consistency is the whole point of the transport system.",
          options: {
            create: [
              { text: "To guarantee production gets exactly what was tested in QAS", isCorrect: true },
              { text: "Because re-typing is faster", isCorrect: false },
              { text: "PRD cannot accept transports", isCorrect: false },
              { text: "To create a different version for production", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "After importing a transport, the log shows return code 8. What does this mean?",
          explanation: "Return codes indicate the import result: 0 = success, 4 = warnings, and 8 or higher = errors that need investigation. A return code of 8 means something failed and must be checked before relying on the change.",
          options: {
            create: [
              { text: "Errors occurred — the import needs investigation", isCorrect: true },
              { text: "Perfect success, nothing to do", isCorrect: false },
              { text: "The transport was deleted", isCorrect: false },
              { text: "8 users imported it", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.7: Support Packages & SAP Notes (SPAM / SNOTE)
const lesson10_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "support-packages-notes" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "Support Packages & SAP Notes",
    slug: "support-packages-notes",
    order: 7,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A user reports a bug in a standard SAP report. The developer checks and finds it's not a company mistake — it's a known SAP issue. Lakshmi, the BASIS admin, is told, "There's an SAP Note for that; apply it." She also hears the system is "behind on support packages." She wonders: how do you fix SAP's own code without breaking everything?

Support packages and SAP Notes are how SAP delivers fixes and improvements — and BASIS is responsible for applying them safely.`,
    content: `## SAP Ships Fixes — You Apply Them

SAP's standard software occasionally has bugs or needs legal/functional updates. SAP delivers these as **SAP Notes** (individual fixes) and **Support Packages** (bundles of fixes). BASIS applies them to keep the system correct and up to date.

## SAP Notes — Individual Fixes

An **SAP Note** is a documented solution for a specific issue, published on the SAP Support Portal. A Note can contain instructions, and often **code corrections** that can be applied automatically.

- **SNOTE** (Note Assistant) downloads and implements Notes, handling dependencies and creating the necessary transport.
- Notes are the fast way to fix a single known problem without waiting for a full support package.

## Support Packages — Bundles of Corrections

A **Support Package (SP)** is a collection of many corrections (including many Notes) for a component, released periodically. Applying support packages keeps the system on a current, supported patch level.

- **SPAM** (Support Package Manager) imports support packages for the core.
- **SAINT** (Add-On Installation Tool) installs/updates add-ons.
- A **Support Package Stack** is a set of SPs across components that SAP tested together — applying a stack is the recommended, consistent way to patch.

## Notes vs Support Packages

| | SAP Note | Support Package |
|--|----------|-----------------|
| Scope | One specific fix | Many fixes bundled |
| Tool | SNOTE | SPAM (SAINT for add-ons) |
| When | Urgent single issue | Periodic maintenance |
| Size | Small | Large |

## Doing It Safely

Patching follows the same landscape discipline:
1. Apply in **DEV** first, test.
2. The changes are captured in transports and moved to **QAS**, tested again.
3. Finally applied/imported into **PRD**.

You also watch for **modification adjustments** (SPDD for dictionary, SPAU for repository) — if your company changed standard objects, SAP's update may conflict and you must reconcile them.

## Key T-Codes

| T-Code | Purpose |
|--------|---------|
| **SNOTE** | Implement individual SAP Notes |
| **SPAM** | Apply support packages (core) |
| **SAINT** | Install/update add-ons |
| **SPAU / SPDD** | Adjust modifications after updates |

## A Real Example

Lakshmi's bug:
- She finds the relevant **SAP Note**, downloads and implements it via **SNOTE** in DEV, tests the fix, and transports it through QAS to PRD.
- Separately, the system is behind on patches, so she schedules a **support package stack** via **SPAM**, applying it DEV → QAS → PRD and running **SPAU** to adjust a few modified objects.

## Why It Matters

Notes and support packages keep SAP correct, secure, and supported. Knowing when to apply a quick Note versus a full support package — and doing it through the landscape with modification adjustments — is core BASIS maintenance work.`,
    keyConceptTitle: "Notes Fix One Issue; Support Packages Bundle Many",
    keyConceptBody: `- An **SAP Note** is a single documented fix, applied with **SNOTE**; a **Support Package** bundles many corrections, applied with **SPAM** (SAINT for add-ons).
- Patches follow the landscape (**DEV → QAS → PRD**) and use **Support Package Stacks** for components tested together.
- After updates, **SPDD/SPAU** reconcile any company modifications to standard objects.`,
  },
});
// Flowchart for lesson 10.7
const flowchart10_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_7.id },
  update: {},
  create: {
    lessonId: lesson10_7.id,
    title: "Applying Notes & Support Packages",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🐞 Issue or Patch Needed" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 50 }, data: { label: "📝 SAP Note (SNOTE)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 250, y: 170 }, data: { label: "📦 Support Package (SPAM)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 470, y: 110 }, data: { label: "🔧 Apply in DEV & Adjust (SPAU)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 690, y: 110 }, data: { label: "🚀 Transport DEV→QAS→PRD" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart10_7.id, nodeId: "node1", title: "Issue or Patch Needed", description: "Either a specific bug appears (needs a Note) or the system is behind on patches (needs support packages).", tCode: "N/A", tips: "Search the SAP Support Portal first — many issues already have a published Note." },
    { flowchartId: flowchart10_7.id, nodeId: "node2", title: "SAP Note (SNOTE)", description: "For a single known issue, SNOTE downloads and implements the Note's code corrections, managing dependencies automatically.", tCode: "SNOTE", tips: "SNOTE is the quick, targeted fix — ideal when you can't wait for a full support package." },
    { flowchartId: flowchart10_7.id, nodeId: "node3", title: "Support Package (SPAM)", description: "For periodic maintenance, SPAM applies bundles of corrections (SAINT for add-ons), ideally as a tested support package stack.", tCode: "SPAM / SAINT", tips: "Apply a stack rather than random individual SPs — stacks are tested together by SAP." },
    { flowchartId: flowchart10_7.id, nodeId: "node4", title: "Apply in DEV & Adjust", description: "Apply first in DEV. If your company modified standard objects, SPDD (dictionary) and SPAU (repository) reconcile the conflicts.", tCode: "SPDD / SPAU", tips: "Skipping modification adjustments can silently reintroduce old bugs or break custom changes." },
    { flowchartId: flowchart10_7.id, nodeId: "node5", title: "Transport DEV→QAS→PRD", description: "Changes are captured in transports and moved through QAS testing into production — same discipline as any change.", tCode: "STMS", tips: "Never patch production directly; let it flow through the tested landscape." },
  ],
});
// Quiz for lesson 10.7
await prisma.quiz.upsert({
  where: { lessonId: lesson10_7.id },
  update: {},
  create: {
    lessonId: lesson10_7.id,
    title: "Support Packages & SAP Notes — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the difference between an SAP Note and a Support Package?",
          explanation: "An SAP Note is a single documented fix for a specific issue (applied with SNOTE), while a Support Package bundles many corrections for periodic maintenance (applied with SPAM). Notes are small and urgent; SPs are large and scheduled.",
          options: {
            create: [
              { text: "A Note is one specific fix; a Support Package bundles many fixes", isCorrect: true },
              { text: "They are identical", isCorrect: false },
              { text: "A Note is larger than a Support Package", isCorrect: false },
              { text: "A Support Package fixes only one bug", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which transaction is used to implement an individual SAP Note's code corrections?",
          explanation: "SNOTE (the Note Assistant) downloads and implements individual SAP Notes, handling dependencies and creating the transport. SPAM is for support packages; SAINT is for add-ons.",
          options: {
            create: [
              { text: "SNOTE", isCorrect: true },
              { text: "SPAM", isCorrect: false },
              { text: "SU01", isCorrect: false },
              { text: "SP01", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "After applying a support package, why might you need to run SPAU/SPDD?",
          explanation: "If your company previously modified standard SAP objects, an update can conflict with those changes. SPDD (dictionary) and SPAU (repository) let you reconcile your modifications with the new SAP code so neither is lost.",
          options: {
            create: [
              { text: "To reconcile company modifications to standard objects with the new code", isCorrect: true },
              { text: "To create new users", isCorrect: false },
              { text: "To print the support package", isCorrect: false },
              { text: "To delete all transports", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.8: Performance Monitoring (ST05, ST03)
const lesson10_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "performance-monitoring" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "Performance Monitoring & Tuning",
    slug: "performance-monitoring",
    order: 8,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Users flood the helpdesk: "A report that used to take 5 seconds now takes 3 minutes!" Sanjay, the BASIS admin, can't just guess. Is it the database? A bad program? Too many users at once? Pointing at the wrong cause wastes hours and fixes nothing.

Performance monitoring gives Sanjay the evidence: tools that show exactly where time is being spent so he can fix the real bottleneck instead of guessing.`,
    content: `## Why Performance Monitoring Matters

A slow system frustrates users and costs money. But "it's slow" isn't a diagnosis. BASIS uses **performance tools** to measure *where* time goes — database, application, or contention — and fix the true cause.

## The Big Question: Where Is the Time Going?

A transaction's response time splits into parts. The key insight: a slow program is usually either **database-heavy** (too many/expensive reads) or **CPU-heavy** (lots of processing). Different tools reveal different parts.

## The Core Tools

| Tool | What it reveals | Use when |
|------|-----------------|----------|
| **ST05** (SQL/Performance Trace) | The exact database calls a program makes | A program seems slow on the DB |
| **ST03 / ST03N** (Workload Monitor) | System-wide response times by transaction | Spotting which transactions are slow overall |
| **SE30 / SAT** (Runtime Analysis) | Where ABAP code spends time | Pinpointing slow code blocks |
| **SM50 / SM66** (Work Processes) | What each process is doing right now | The system feels overloaded |
| **SM04 / AL08** (User sessions) | Who is logged on and active | Too many concurrent users |
| **DB02** | Database space and growth | DB capacity concerns |

## ST05 — The Detective's Magnifying Glass

**ST05** records every database call a transaction makes — which tables, how long each took, and crucially whether an **index** was used. The classic culprit: a SELECT scanning a huge table with no suitable index. ST05's trace shows it, and the fix is often a better-written query or a new index.

## ST03 — The Big Picture

**ST03N** aggregates workload statistics — average response times, top transactions by total time, and the database/CPU split. It's where you start to find *which* transactions to investigate before zooming in with ST05.

## A Tuning Workflow

1. **ST03N** — identify the slowest / most expensive transactions.
2. **ST05** — trace one of them to see expensive SQL (missing index? full table scan?).
3. **SE30/SAT** — if it's CPU-bound, find the slow code.
4. **SM50/SM66** — check whether contention or lack of free work processes is the issue.
5. Apply the fix (index, code change, parameter tuning) through the landscape.

## A Real Example

Sanjay's slow report:
- **ST03N** confirms that transaction's average response time jumped, and most of it is **database time**.
- **ST05** trace shows a SELECT on a 50-million-row table with **no index used** — a full table scan.
- The fix: add a secondary index (via DDIC, transported). Response time drops back to seconds.

## Why It Matters

Performance monitoring turns "it's slow" into a precise diagnosis. By measuring where time is spent — DB vs CPU vs contention — BASIS fixes the actual bottleneck, keeps users productive, and avoids costly guesswork or unnecessary hardware spend.`,
    keyConceptTitle: "Measure Where Time Goes: DB (ST05) vs Overall (ST03)",
    keyConceptBody: `- Don't guess at slowness — **measure** it. **ST03N** shows system-wide response times to find slow transactions; **ST05** traces a program's exact database calls.
- A slow program is usually **database-heavy** (e.g. a full table scan with no index) or **CPU-heavy** (use SE30/SAT for code).
- **SM50/SM66** reveal live work-process load/contention; fix the real bottleneck (index, code, parameters) through the landscape.`,
  },
});
// Flowchart for lesson 10.8
const flowchart10_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_8.id },
  update: {},
  create: {
    lessonId: lesson10_8.id,
    title: "Performance Tuning Workflow",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🐌 Users Report Slowness" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 260, y: 110 }, data: { label: "📊 ST03N: Find Slow Transaction" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 480, y: 110 }, data: { label: "🔍 ST05: Trace DB Calls" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 480, y: 250 }, data: { label: "🧩 Find Cause (No Index? Bad Code?)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 700, y: 250 }, data: { label: "✅ Apply Fix via Landscape" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart10_8.id, nodeId: "node1", title: "Users Report Slowness", description: "A vague complaint ('it's slow') is the starting point — not a diagnosis. Performance tools turn it into measurable facts.", tCode: "N/A", tips: "Get specifics: which transaction, when, and how slow — it narrows the search fast." },
    { flowchartId: flowchart10_8.id, nodeId: "node2", title: "ST03N: Find Slow Transaction", description: "The workload monitor aggregates response times by transaction and shows the DB vs CPU split, pointing you to the worst offenders.", tCode: "ST03 / ST03N", tips: "Sort by total time, not just average — a frequent medium-slow transaction can hurt more than a rare slow one." },
    { flowchartId: flowchart10_8.id, nodeId: "node3", title: "ST05: Trace DB Calls", description: "An SQL/performance trace records every database call a program makes, how long each took, and whether an index was used.", tCode: "ST05", tips: "Switch the trace on, run the slow action once, switch it off — keep traces short and targeted." },
    { flowchartId: flowchart10_8.id, nodeId: "node4", title: "Find the Cause", description: "Common findings: a full table scan with no index (DB-bound) or heavy loops in ABAP (CPU-bound, use SE30/SAT). Contention shows in SM50/SM66.", tCode: "SE30 / SAT / SM50", tips: "A SELECT with no suitable index on a big table is the most common performance killer." },
    { flowchartId: flowchart10_8.id, nodeId: "node5", title: "Apply Fix via Landscape", description: "Whether it's a new index, rewritten query, or parameter change, the fix is built in DEV and transported through QAS to PRD.", tCode: "STMS", tips: "Re-measure after the fix to confirm the bottleneck is actually gone." },
  ],
});
// Quiz for lesson 10.8
await prisma.quiz.upsert({
  where: { lessonId: lesson10_8.id },
  update: {},
  create: {
    lessonId: lesson10_8.id,
    title: "Performance Monitoring — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A program is slow and you suspect the database. Which tool shows the exact SQL calls it makes and whether an index was used?",
          explanation: "ST05 (the SQL/Performance Trace) records every database call, its duration, and whether an index was used — perfect for spotting a full table scan. ST03N gives the system-wide picture but not call-level SQL detail.",
          options: {
            create: [
              { text: "ST05", isCorrect: true },
              { text: "SU01", isCorrect: false },
              { text: "SP01", isCorrect: false },
              { text: "PFCG", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why is 'the system is slow' not enough to start fixing a performance problem?",
          explanation: "Slowness can come from the database, the ABAP code (CPU), or contention from too many concurrent processes. Without measuring where time is actually spent, you risk fixing the wrong thing and wasting effort.",
          options: {
            create: [
              { text: "The cause could be database, code, or contention — you must measure first", isCorrect: true },
              { text: "Slowness is always the user's internet", isCorrect: false },
              { text: "You should just buy more hardware immediately", isCorrect: false },
              { text: "SAP is never actually slow", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "An ST05 trace shows a SELECT scanning a 50-million-row table with no index used. What is the likely fix?",
          explanation: "A full table scan with no suitable index is a classic bottleneck. Adding an appropriate index (or rewriting the query to use one) lets the database find rows directly instead of reading the whole table — dramatically faster.",
          options: {
            create: [
              { text: "Add a suitable index (or rewrite the query to use one)", isCorrect: true },
              { text: "Delete the table", isCorrect: false },
              { text: "Lock all users out permanently", isCorrect: false },
              { text: "Increase the user's password length", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.9: Spool & Print Management (SP01)
const lesson10_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "spool-print-management" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "Spool & Print Management (SP01)",
    slug: "spool-print-management",
    order: 9,
    isPublished: true,
    estimatedMinutes: 9,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `The finance team needs to print 500 invoices before the day ends — but nothing comes out of the printer. They call Nisha in BASIS: "SAP says it printed, but the paper tray is empty!" Nisha knows the documents didn't vanish; they're sitting in SAP's print queue waiting. She needs to find them and figure out why they're stuck.

Spool and print management is how SAP turns on-screen output into paper or PDF — and how BASIS rescues print jobs when they get stuck.`,
    content: `## How Printing Works in SAP

When you print in SAP, the output doesn't go straight to the printer. It first becomes a **spool request** — a stored copy of the output held in SAP. The spool request is then sent to a printer (or PDF) as an **output request**. BASIS manages this queue.

Think of the spool as a **waiting room**: documents line up there, then get called to the printer one by one.

## Two Requests, Two Stages

| Request | Meaning |
|---------|---------|
| **Spool request** | The generated output stored in SAP (the document itself) |
| **Output request** | The attempt to actually print/send that spool request |

A spool request can have several output requests — e.g. if the first print attempt failed and you retry, the document (spool) stays, and a new output request is created.

## The Key Tool: SP01

**SP01** is the spool request monitor. It lists spool requests with their status, and lets you:
- **Display** the output on screen,
- **Print** (create an output request),
- **Check status** — completed, waiting, or in error,
- **Delete** old requests.

A status in **error** (often shown red) is exactly what Nisha needs to find when prints don't appear.

## Output Devices (Printers)

Printers are defined as **output devices** in **SPAD** (Spool Administration). Each output device specifies the device type (driver), the access method (how SAP reaches the printer), and the host spooler. If a printer is wrongly configured or offline, output requests pile up in error.

## Common Causes of Stuck Prints

- Printer offline or out of paper (host-side).
- Wrong output device / access method configuration (SPAD).
- Spool work process overloaded.

## Key Spool T-Codes

| T-Code | Purpose |
|--------|---------|
| **SP01** | Spool request monitor (find/print/delete) |
| **SP02** | Your own spool requests |
| **SPAD** | Spool administration (define printers) |
| **SM50** | Check the spool work process |

## A Real Example

Nisha's missing invoices:
- In **SP01**, she finds 500 spool requests with output requests in **error (red)**.
- Checking the output device in **SPAD**, she sees the printer's access method points to an offline server.
- The host printer is brought back online; she reprints the spool requests from SP01, and the invoices come out — the documents were safe in the spool all along.

## Why It Matters

Spool management ensures business documents — invoices, payslips, delivery notes — actually reach paper or PDF. Because the spool stores output safely, BASIS can diagnose and reprint stuck jobs without anyone losing or re-creating documents.`,
    keyConceptTitle: "Output Becomes a Spool Request, Then Prints via SP01",
    keyConceptBody: `- SAP output first becomes a **spool request** (stored in SAP), then an **output request** sends it to a printer or PDF.
- **SP01** is the monitor to view, print, check status, and delete spool requests; errors (red) show stuck jobs.
- Printers are configured as **output devices** in **SPAD**; because the spool stores output, stuck jobs can be reprinted without losing the document.`,
  },
});
// Flowchart for lesson 10.9
const flowchart10_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_9.id },
  update: {},
  create: {
    lessonId: lesson10_9.id,
    title: "SAP Printing Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🖨️ User Prints Document" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 260, y: 110 }, data: { label: "🗂️ Spool Request Created" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 110 }, data: { label: "📤 Output Request → Printer" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 690, y: 60 }, data: { label: "✅ Printed / PDF" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 690, y: 170 }, data: { label: "🚨 Error → Check SP01/SPAD" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart10_9.id, nodeId: "node1", title: "User Prints Document", description: "A user prints output (invoice, report). SAP doesn't send it straight to the printer — it stores it first.", tCode: "N/A", tips: "What the user chooses as the output device determines where the spool will try to print." },
    { flowchartId: flowchart10_9.id, nodeId: "node2", title: "Spool Request Created", description: "The output is stored in SAP as a spool request — a safe copy of the document held in the system.", tCode: "SP01 / SP02", tips: "Because the document is stored, you can reprint it later without regenerating it." },
    { flowchartId: flowchart10_9.id, nodeId: "node3", title: "Output Request → Printer", description: "An output request is the actual attempt to send the spool request to a printer or PDF via the configured output device.", tCode: "SP01", tips: "One spool request can spawn multiple output requests if you reprint." },
    { flowchartId: flowchart10_9.id, nodeId: "node4", title: "Printed / PDF", description: "On success, the document is produced on paper or as a PDF and the output request shows completed.", tCode: "SP01", tips: "Completed (green) status confirms the output actually reached the device." },
    { flowchartId: flowchart10_9.id, nodeId: "node5", title: "Error → Check SP01/SPAD", description: "If the output request errors (red), BASIS checks SP01 for status and SPAD for the output device configuration (offline printer, wrong access method).", tCode: "SP01 / SPAD", tips: "Fix the device in SPAD, then simply reprint the stored spool request — no document is lost." },
  ],
});
// Quiz for lesson 10.9
await prisma.quiz.upsert({
  where: { lessonId: lesson10_9.id },
  update: {},
  create: {
    lessonId: lesson10_9.id,
    title: "Spool & Print Management — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "When a user prints in SAP, what is created first before anything reaches the printer?",
          explanation: "SAP first creates a spool request — a stored copy of the output held in the system. An output request then attempts to send that spool request to a printer or PDF.",
          options: {
            create: [
              { text: "A spool request (stored output in SAP)", isCorrect: true },
              { text: "A purchase order", isCorrect: false },
              { text: "A new user account", isCorrect: false },
              { text: "A transport request", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Prints aren't coming out, but SAP shows the documents were generated. Why are the documents not lost?",
          explanation: "The output is safely stored as spool requests in SAP. The printing (output request) failed, but the documents remain in the spool, so BASIS can fix the printer and simply reprint them.",
          options: {
            create: [
              { text: "They're stored as spool requests and can be reprinted once the printer is fixed", isCorrect: true },
              { text: "They are permanently deleted on a failed print", isCorrect: false },
              { text: "They were emailed to the vendor instead", isCorrect: false },
              { text: "They never existed", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Where are printers defined and configured in SAP?",
          explanation: "Printers are defined as output devices in SPAD (Spool Administration), specifying the device type, access method, and host spooler. A misconfigured output device is a common cause of stuck print jobs.",
          options: {
            create: [
              { text: "As output devices in SPAD", isCorrect: true },
              { text: "In the Chart of Accounts", isCorrect: false },
              { text: "In PFCG roles", isCorrect: false },
              { text: "Printers cannot be configured in SAP", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.10: System Parameters (RZ10 / RZ11)
const lesson10_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "system-parameters-rz10" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "System Parameters (RZ10 / RZ11)",
    slug: "system-parameters-rz10",
    order: 10,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Users complain that SAP logs them out too quickly, and the team also wants more memory allocated to background jobs. Ramesh, the BASIS admin, is told, "Adjust the profile parameters." He wonders: where do these system-wide settings live, how do you change them safely, and which ones need a restart?

Profile parameters are the configuration knobs of the SAP system — and RZ10/RZ11 are how BASIS reads and tunes them.`,
    content: `## What Are Profile Parameters?

**Profile parameters** are settings that control how the SAP system behaves — memory sizes, number of work processes, logon timeouts, security rules, and more. They're stored in **profiles** (files read when the system starts) and define the system's "personality."

Think of them as the **settings menu** of the SAP system — but powerful enough that wrong values can slow or even prevent startup.

## The Profile Types

| Profile | Scope |
|---------|-------|
| **Default profile (DEFAULT.PFL)** | Settings shared by all application servers |
| **Instance profile** | Settings for one specific instance/server |
| **Start profile** | How the instance starts up (historically) |

## RZ10 vs RZ11

| T-Code | Purpose |
|--------|---------|
| **RZ10** | **Maintain** profiles — edit parameter values, save a new version, activate |
| **RZ11** | **Display** a single parameter — its current value, meaning, and whether a restart is needed |

So you use **RZ11** to look up what a parameter does and its current value, and **RZ10** to actually change it.

## Static vs Dynamic Parameters

A crucial distinction:

| Type | Takes effect | Example |
|------|--------------|---------|
| **Dynamic** | Immediately (can change at runtime) | Some trace/log settings |
| **Static** | Only after a **system restart** | Memory and work-process counts |

RZ11 tells you whether a parameter is dynamically switchable. Many important parameters are **static**, so the change is planned for the next maintenance window.

## Common Parameters You'll Hear About

| Parameter | Controls |
|-----------|----------|
| **rdisp/max_wprun_time** | Max runtime of a dialog work process |
| **rdisp/wp_no_dia** | Number of dialog work processes |
| **login/system_client** | Default client at login |
| **login/fails_to_user_lock** | Failed logons before lock |
| **abap/heap_area_total** | Memory available to processes |

## Changing a Parameter Safely

1. Look it up in **RZ11** (value, meaning, dynamic or static).
2. Edit it in **RZ10** in the right profile; save and activate the new profile version.
3. If **static**, schedule a restart so it takes effect.
4. Verify the new value after restart (RZ11 / RSPFPAR).

## A Real Example

Ramesh's two requests:
- **Logout too fast:** he checks the relevant timeout parameter in RZ11, edits it in RZ10, and (since it's static) plans a restart.
- **More memory for background:** he adjusts the memory/work-process parameters in the instance profile via RZ10, activates the new version, and restarts in the maintenance window. Afterward RZ11 confirms the new values.

## Why It Matters

Profile parameters tune the whole system — performance, capacity, and security all depend on them. Knowing RZ10 (change) vs RZ11 (inspect), and static vs dynamic, lets BASIS adjust the system safely without causing startup failures or unplanned downtime.`,
    keyConceptTitle: "RZ10 Changes Parameters; RZ11 Inspects Them",
    keyConceptBody: `- **Profile parameters** control system behavior (memory, work processes, timeouts, security) and live in **profiles** read at startup.
- Use **RZ11** to look up a parameter's value, meaning, and whether it's dynamic; use **RZ10** to edit and activate profile changes.
- **Static** parameters (e.g. memory, process counts) need a **restart** to take effect; **dynamic** ones apply immediately.`,
  },
});
// Flowchart for lesson 10.10
const flowchart10_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_10.id },
  update: {},
  create: {
    lessonId: lesson10_10.id,
    title: "Changing a Profile Parameter",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🔎 Look Up Parameter (RZ11)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 110 }, data: { label: "✏️ Edit in Profile (RZ10)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 490, y: 110 }, data: { label: "💾 Save & Activate Profile" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 490, y: 250 }, data: { label: "🔁 Static? Restart System" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 700, y: 250 }, data: { label: "✅ Verify New Value" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart10_10.id, nodeId: "node1", title: "Look Up Parameter (RZ11)", description: "RZ11 shows a single parameter's current value, documentation, and whether it can be changed dynamically or needs a restart.", tCode: "RZ11", tips: "Always read the parameter doc in RZ11 before changing — wrong values can break startup." },
    { flowchartId: flowchart10_10.id, nodeId: "node2", title: "Edit in Profile (RZ10)", description: "RZ10 maintains profiles. You edit the parameter in the correct profile (default or instance) for the change to apply where intended.", tCode: "RZ10", tips: "Choose the right profile — instance profile for one server, default for all servers." },
    { flowchartId: flowchart10_10.id, nodeId: "node3", title: "Save & Activate", description: "Saving creates a new profile version; activating makes it the one used at the next startup.", tCode: "RZ10", tips: "RZ10 keeps profile versions, so you can revert if a change causes problems." },
    { flowchartId: flowchart10_10.id, nodeId: "node4", title: "Static? Restart System", description: "Static parameters (memory, work-process counts) only take effect after a restart, so schedule one in a maintenance window. Dynamic ones apply immediately.", tCode: "RZ11 (check dynamic flag)", tips: "Confirm static vs dynamic in RZ11 first so you know whether downtime is needed." },
    { flowchartId: flowchart10_10.id, nodeId: "node5", title: "Verify New Value", description: "After activation (and restart if needed), confirm the parameter holds the new value using RZ11 or the parameter report RSPFPAR.", tCode: "RZ11 / RSPFPAR", tips: "Always verify — a typo in RZ10 can silently leave the old value in effect." },
  ],
});
// Quiz for lesson 10.10
await prisma.quiz.upsert({
  where: { lessonId: lesson10_10.id },
  update: {},
  create: {
    lessonId: lesson10_10.id,
    title: "System Parameters (RZ10/RZ11) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the difference in purpose between RZ10 and RZ11?",
          explanation: "RZ11 is for displaying/inspecting a single parameter (value, meaning, dynamic flag), while RZ10 is for maintaining (editing and activating) profiles. You inspect with RZ11, then change with RZ10.",
          options: {
            create: [
              { text: "RZ11 inspects a parameter; RZ10 edits and activates profiles", isCorrect: true },
              { text: "They are identical", isCorrect: false },
              { text: "RZ10 creates users; RZ11 prints documents", isCorrect: false },
              { text: "RZ11 deletes the system; RZ10 restores it", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "You change a static profile parameter (like memory allocation). When does it take effect?",
          explanation: "Static parameters only take effect after a system restart. That's why such changes are planned for a maintenance window, unlike dynamic parameters which apply immediately at runtime.",
          options: {
            create: [
              { text: "Only after a system restart", isCorrect: true },
              { text: "Immediately, with no restart", isCorrect: false },
              { text: "Never — static parameters can't change", isCorrect: false },
              { text: "Only on weekends automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why should you check a parameter in RZ11 before changing it in RZ10?",
          explanation: "RZ11 shows the parameter's documentation, current value, and whether it's dynamic or static. Understanding this first prevents setting a harmful value or assuming a change is instant when it actually needs a restart.",
          options: {
            create: [
              { text: "To learn its meaning, current value, and whether a restart is needed", isCorrect: true },
              { text: "Because RZ10 is only for printing", isCorrect: false },
              { text: "RZ11 pays for the change", isCorrect: false },
              { text: "There is no reason to check first", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── ABAP: NEW LESSONS ───────────────────────────────────────────────────────
// LESSON 11.3: Internal Tables
const lesson11_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-internal-tables" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "Internal Tables",
    slug: "abap-internal-tables",
    order: 3,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Ravi's first real ABAP task: read 10,000 customer records, filter the ones from Mumbai, and print them. He knows how to SELECT from a database table, but where does he put thousands of rows while the program works on them? Storing them one variable at a time is impossible.

Internal tables are the answer — they hold many rows in memory so a program can collect, filter, sort, and process data. They're the workhorse of nearly every ABAP program.`,
    content: `## What Is an Internal Table?

An **internal table** is a variable that holds **multiple rows** of data in memory while a program runs — like a temporary, in-memory spreadsheet. Database data is read *into* internal tables, processed there, then displayed or saved.

Think of it as a **stack of index cards** the program holds in its hands: it can add cards, flip to one, sort them, and read each in turn.

## Declaring Internal Tables

Modern ABAP uses inline or explicit declarations:

\`\`\`abap
" Explicit: define a type, then a table of it
TYPES: BEGIN OF ty_cust,
         kunnr TYPE kna1-kunnr,
         name1 TYPE kna1-name1,
         ort01 TYPE kna1-ort01,
       END OF ty_cust.
DATA lt_cust TYPE STANDARD TABLE OF ty_cust.
DATA ls_cust TYPE ty_cust.   " work area (one row)
\`\`\`

An internal table needs a **work area** (or field symbol) — a single-row variable used to read or build rows.

## Filling and Reading Rows

| Operation | Statement | Meaning |
|-----------|-----------|---------|
| Bulk read from DB | \`SELECT ... INTO TABLE lt_cust\` | Load many rows at once |
| Add a row | \`APPEND ls_cust TO lt_cust\` | Add the work area as a new row |
| Read one row | \`READ TABLE lt_cust INTO ls_cust WITH KEY kunnr = '100'\` | Find a specific row |
| Loop all rows | \`LOOP AT lt_cust INTO ls_cust. ... ENDLOOP.\` | Process every row |
| Count rows | \`lines( lt_cust )\` | How many rows |

## Table Types — Pick the Right One

| Type | Behavior | Best for |
|------|----------|----------|
| **STANDARD** | Rows in insertion order; index access | General use |
| **SORTED** | Always kept sorted by key | Fast key reads, ordered data |
| **HASHED** | Unique key, near-instant single-row access | Large lookups by exact key |

## Performance: Read Smart

After \`READ TABLE\`, check **sy-subrc** (0 = found). For repeated lookups in big tables, a **SORTED** or **HASHED** table is dramatically faster than scanning a standard table each time. Use **field symbols** (\`ASSIGNING <fs>\`) in loops to avoid copying each row.

## A Real Example

Ravi's task:
\`\`\`abap
SELECT kunnr, name1, ort01 FROM kna1 INTO TABLE @lt_cust.
LOOP AT lt_cust INTO ls_cust WHERE ort01 = 'Mumbai'.
  WRITE: / ls_cust-kunnr, ls_cust-name1.
ENDLOOP.
\`\`\`
He loads all customers into \`lt_cust\`, then loops only the Mumbai rows and prints them — exactly the collect-filter-process pattern.

## Why It Matters

Internal tables are the backbone of ABAP. Almost every report, interface, and program reads database data into internal tables, manipulates it in memory, and outputs the result. Knowing how to fill, read, loop, and choose the right table type is fundamental to writing efficient ABAP.`,
    keyConceptTitle: "Internal Tables Hold Many Rows in Memory for Processing",
    keyConceptBody: `- An **internal table** stores multiple rows in memory; you read DB data into it with \`SELECT ... INTO TABLE\`, then process it.
- Core operations: \`APPEND\` (add), \`READ TABLE ... WITH KEY\` (find one, check sy-subrc), \`LOOP AT\` (process all).
- Choose the **table type** — STANDARD (general), SORTED (ordered/fast key reads), HASHED (instant unique-key lookups) — for performance.`,
  },
});
// Flowchart for lesson 11.3
const flowchart11_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_3.id },
  update: {},
  create: {
    lessonId: lesson11_3.id,
    title: "Working with an Internal Table",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "📐 Declare Table & Work Area" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 110 }, data: { label: "📥 SELECT INTO TABLE" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 490, y: 110 }, data: { label: "🔁 LOOP AT / READ TABLE" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 490, y: 250 }, data: { label: "✔️ Check sy-subrc" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 700, y: 110 }, data: { label: "🖥️ Output / Save Result" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_3.id, nodeId: "node1", title: "Declare Table & Work Area", description: "Define the row structure (TYPES), an internal table of that type (DATA ... TYPE TABLE OF), and a work area for a single row.", tCode: "SE80 / SE38", tips: "Type the table from a DDIC structure so its fields match the database automatically." },
    { flowchartId: flowchart11_3.id, nodeId: "node2", title: "SELECT INTO TABLE", description: "Read many database rows at once into the internal table — far faster than reading row by row in a loop.", tCode: "SE38", tips: "Select only the fields and rows you need; avoid SELECT * on huge tables." },
    { flowchartId: flowchart11_3.id, nodeId: "node3", title: "LOOP AT / READ TABLE", description: "LOOP AT processes every row (optionally with WHERE); READ TABLE finds one row by key. Use field symbols in loops to avoid copying.", tCode: "SE38", tips: "For repeated key lookups, a SORTED or HASHED table beats scanning a STANDARD table." },
    { flowchartId: flowchart11_3.id, nodeId: "node4", title: "Check sy-subrc", description: "After READ TABLE, sy-subrc = 0 means the row was found. Always check it before using the work area's contents.", tCode: "SE38", tips: "Acting on a 'not found' READ without checking sy-subrc is a classic source of bugs." },
    { flowchartId: flowchart11_3.id, nodeId: "node5", title: "Output / Save Result", description: "The processed rows are written to the screen (WRITE/ALV) or saved back to the database (INSERT/UPDATE/MODIFY).", tCode: "SE38", tips: "Most real programs end by displaying the internal table in an ALV grid." },
  ],
});
// Quiz for lesson 11.3
await prisma.quiz.upsert({
  where: { lessonId: lesson11_3.id },
  update: {},
  create: {
    lessonId: lesson11_3.id,
    title: "Internal Tables — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is an internal table in ABAP?",
          explanation: "An internal table is a variable that holds multiple rows of data in memory while the program runs — like a temporary spreadsheet. Database data is read into it, processed, then output or saved.",
          options: {
            create: [
              { text: "A variable that holds multiple rows of data in memory at runtime", isCorrect: true },
              { text: "A permanent database table", isCorrect: false },
              { text: "A printer queue", isCorrect: false },
              { text: "A user authorization object", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "You must repeatedly look up single rows by an exact unique key in a very large internal table. Which table type is most efficient?",
          explanation: "A HASHED table provides near-instant access by unique key, regardless of size, because it uses a hash algorithm rather than scanning. A STANDARD table would scan rows, which is slow for repeated lookups in big tables.",
          options: {
            create: [
              { text: "HASHED table", isCorrect: true },
              { text: "STANDARD table", isCorrect: false },
              { text: "A database table only", isCorrect: false },
              { text: "It makes no difference", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is `SELECT ... INTO TABLE` generally better than selecting rows one at a time inside a loop?",
          explanation: "Reading all needed rows into an internal table in a single database call is far faster than many individual database round-trips inside a loop (a SELECT-in-loop anti-pattern). One bulk read minimizes expensive database communication.",
          options: {
            create: [
              { text: "One bulk read avoids many slow database round-trips", isCorrect: true },
              { text: "It uses more database calls, which is faster", isCorrect: false },
              { text: "Loops cannot read databases at all", isCorrect: false },
              { text: "It automatically sorts the database", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.4: Modularization (Subroutines & Function Modules)
const lesson11_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-modularization" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "Modularization & Function Modules",
    slug: "abap-modularization",
    order: 4,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Anita wrote a 2,000-line ABAP program. The same tax-calculation logic appears in five places, copy-pasted. When the tax rule changed, she had to fix it in all five — and missed one, causing a bug. Her mentor says, "Don't repeat code. Put it in a function module and call it."

Modularization is how ABAP avoids repetition: break logic into reusable building blocks so you write it once and call it everywhere.`,
    content: `## Why Modularize?

Copy-pasting code is dangerous: a fix in one copy misses the others. **Modularization** means splitting a program into reusable units, so each piece of logic lives in **one place** and is **called** wherever needed. The benefits: less duplication, easier maintenance, and clearer programs.

## The Main Modularization Units

| Unit | Scope | Reusable across programs? |
|------|-------|---------------------------|
| **Subroutine (FORM)** | Within one program (older style) | No |
| **Function Module** | Stored centrally, called anywhere | Yes |
| **Method (class)** | OO building block (later lesson) | Yes |

## Subroutines (FORM ... ENDFORM)

A **subroutine** is a block of code inside a program, defined with FORM and called with PERFORM:

\`\`\`abap
PERFORM calculate_tax USING lv_amount CHANGING lv_tax.

FORM calculate_tax USING p_amount TYPE p
                   CHANGING p_tax TYPE p.
  p_tax = p_amount * '0.18'.
ENDFORM.
\`\`\`

Subroutines are **local** to the program. They're considered older style today (methods are preferred), but you'll still see them everywhere.

## Function Modules — Reusable Across the System

A **Function Module (FM)** is a self-contained procedure stored centrally in the **Function Builder (SE37)** and grouped into **function groups**. Any program can call it. FMs have a clear interface:

| Parameter type | Purpose |
|----------------|---------|
| **IMPORTING** | Inputs passed in |
| **EXPORTING** | Outputs passed back |
| **CHANGING** | Passed in and back |
| **TABLES** | Internal tables (legacy) |
| **EXCEPTIONS** | Error conditions |

\`\`\`abap
CALL FUNCTION 'Z_CALCULATE_TAX'
  EXPORTING  iv_amount = lv_amount
  IMPORTING  ev_tax    = lv_tax
  EXCEPTIONS invalid_amount = 1.
\`\`\`

## RFC-Enabled Function Modules

A function module can be marked **RFC-enabled**, meaning it can be called **remotely** from another SAP or external system. This makes FMs the foundation of system-to-system integration (and BAPIs, in a later lesson).

## Choosing Between Them

- Logic used **only in this program** → a subroutine (or local method).
- Logic reused **across programs**, or callable **remotely** → a function module.
- Modern, object-oriented design → **methods** in classes.

## A Real Example

Anita's tax logic:
- She creates a function module **Z_CALCULATE_TAX** in **SE37** with IMPORTING amount and EXPORTING tax.
- She replaces all five copy-pasted blocks with one \`CALL FUNCTION 'Z_CALCULATE_TAX'\`.
- Now a tax-rule change is made in **one** place, and every program that calls it is instantly correct.

## Why It Matters

Modularization is the difference between maintainable and unmaintainable code. Function modules give reusable, centrally managed, even remotely callable logic — eliminating duplication and the bugs it causes. It's a core skill every ABAP developer needs.`,
    keyConceptTitle: "Write Logic Once, Call It Everywhere",
    keyConceptBody: `- **Modularization** splits code into reusable units so logic lives in one place: **subroutines (FORM/PERFORM)** are local to a program; **function modules (SE37)** are reusable system-wide.
- Function modules have a defined interface (**IMPORTING/EXPORTING/CHANGING/TABLES/EXCEPTIONS**) and can be **RFC-enabled** for remote calls.
- Centralizing logic means a change is made once and every caller benefits — eliminating copy-paste bugs.`,
  },
});
// Flowchart for lesson 11.4
const flowchart11_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_4.id },
  update: {},
  create: {
    lessonId: lesson11_4.id,
    title: "Calling Reusable Logic",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "📄 Main Program" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 50 }, data: { label: "🔁 PERFORM (Subroutine)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 250, y: 170 }, data: { label: "📞 CALL FUNCTION (FM)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 470, y: 170 }, data: { label: "🧩 Function Builder (SE37)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 680, y: 170 }, data: { label: "🌐 RFC: Call Remotely" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart11_4.id, nodeId: "node1", title: "Main Program", description: "The program that needs some logic. Instead of writing it inline (and repeating it), it calls reusable units.", tCode: "SE38 / SE80", tips: "If you find yourself copy-pasting a block, that's the signal to modularize it." },
    { flowchartId: flowchart11_4.id, nodeId: "node2", title: "PERFORM (Subroutine)", description: "Calls a FORM routine defined within the same program. Good for logic used only locally, though methods are now preferred.", tCode: "SE38 (FORM/PERFORM)", tips: "Subroutines are local only — they can't be reused by other programs." },
    { flowchartId: flowchart11_4.id, nodeId: "node3", title: "CALL FUNCTION (FM)", description: "Invokes a function module via its interface (IMPORTING/EXPORTING/etc.), running centrally stored logic any program can reuse.", tCode: "SE38 (CALL FUNCTION)", tips: "Handle EXCEPTIONS after the call and check sy-subrc to react to errors." },
    { flowchartId: flowchart11_4.id, nodeId: "node4", title: "Function Builder (SE37)", description: "Where function modules are created and maintained, grouped into function groups. The FM's interface defines its inputs, outputs, and exceptions.", tCode: "SE37", tips: "Search existing FMs first — SAP ships thousands; you rarely need to write one from scratch." },
    { flowchartId: flowchart11_4.id, nodeId: "node5", title: "RFC: Call Remotely", description: "An RFC-enabled function module can be called from another SAP or external system, making it the basis of cross-system integration.", tCode: "SE37 (RFC attribute)", tips: "RFC-enabled FMs underpin BAPIs and most SAP integration scenarios." },
  ],
});
// Quiz for lesson 11.4
await prisma.quiz.upsert({
  where: { lessonId: lesson11_4.id },
  update: {},
  create: {
    lessonId: lesson11_4.id,
    title: "Modularization — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the main problem that modularization solves?",
          explanation: "Modularization eliminates code duplication by putting logic in one reusable place. Without it, the same logic is copy-pasted in many spots, so a fix must be repeated everywhere — and missing one causes bugs.",
          options: {
            create: [
              { text: "Code duplication — logic lives in one place and is called everywhere", isCorrect: true },
              { text: "It makes programs run without a database", isCorrect: false },
              { text: "It removes the need for users", isCorrect: false },
              { text: "It deletes old programs automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the key advantage of a function module over a subroutine (FORM)?",
          explanation: "A function module is stored centrally and can be reused by any program (and even called remotely if RFC-enabled). A subroutine is local to the single program it's defined in.",
          options: {
            create: [
              { text: "It can be reused by any program, and remotely if RFC-enabled", isCorrect: true },
              { text: "It runs faster than everything else always", isCorrect: false },
              { text: "It cannot have any parameters", isCorrect: false },
              { text: "It only works inside one program", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A developer centralizes tax logic into one function module called from five programs. The tax rate later changes. What's the benefit?",
          explanation: "Because all five programs call the same function module, the change is made in one place and every caller is instantly correct. This is exactly the maintenance benefit modularization provides — no missed copies.",
          options: {
            create: [
              { text: "The change is made once and all five programs are instantly correct", isCorrect: true },
              { text: "The change must still be made five times", isCorrect: false },
              { text: "The programs stop working", isCorrect: false },
              { text: "Tax can no longer be calculated", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.5: ALV Reports
const lesson11_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-alv-reports" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "ALV Reports",
    slug: "abap-alv-reports",
    order: 5,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Vivek built a report with WRITE statements. It works, but users complain: "We can't sort it, can't filter it, can't export to Excel, and it looks ugly." Every new request means more WRITE code. His lead says, "Use ALV — you get sorting, filtering, and export for free."

ALV is SAP's standard way to display tabular reports: a professional, interactive grid that gives users powerful features without you coding them.`,
    content: `## The Problem with Plain WRITE

A report built with **WRITE** is just static text on screen. Users can't sort columns, filter rows, total numbers, or export to Excel — and every formatting tweak means more code. **ALV** solves all of this.

## What Is ALV?

**ALV (ABAP List Viewer / SAP List Viewer)** is a standard tool for displaying internal table data in a rich, interactive grid. Out of the box, users get:

- Column **sorting** and **filtering**,
- **Subtotals and totals** on numeric columns,
- **Export** to Excel / local file,
- Rearranging and hiding columns,
- Saving a **layout** (variant) for next time.

You provide the data; ALV provides the interactivity.

## The Two Ingredients

To build an ALV, you supply:

1. **The data** — an internal table of rows to display.
2. **The field catalog** — metadata describing each column (field name, heading, length, whether it's a sum, etc.). The field catalog tells ALV *how* to present each column.

\`\`\`abap
" Classic function-module ALV
CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
  EXPORTING  it_fieldcat = lt_fcat
  TABLES     t_outtab    = lt_data.
\`\`\`

## ALV Flavors (Old to New)

| Approach | Notes |
|----------|-------|
| **REUSE_ALV_GRID_DISPLAY** | Classic function-module ALV (very common in legacy code) |
| **CL_GUI_ALV_GRID** | Control-based, screen-embedded ALV |
| **CL_SALV_TABLE** | Modern object-oriented ALV — cleaner, less code |
| **Fiori / SADL** | Web-based lists in modern SAP |

Modern development favors **CL_SALV_TABLE**, which can build a simple grid in just a few lines and often generates the field catalog automatically.

## The Field Catalog Is Key

The **field catalog** controls headings, column order, alignment, currency/quantity references, and which columns total. Get it right and the report looks professional; many ALV questions and bugs revolve around it. Tools like the DDIC structure or \`LVC_FIELDCATALOG_MERGE\` can build it for you.

## A Real Example

Vivek's report:
- He fills an internal table \`lt_orders\` with the data he already had.
- Builds a field catalog (or lets CL_SALV_TABLE derive it from the structure).
- Calls ALV to display the grid.
- Users now sort by amount, filter by region, total the values, and export to Excel — all without Vivek writing any of those features.

## Why It Matters

ALV is the standard for SAP reporting output. It gives users a consistent, powerful, Excel-like experience while saving developers from reinventing sorting, filtering, and export. Almost every production report uses ALV, so it's essential ABAP knowledge.`,
    keyConceptTitle: "ALV Gives Interactive Grids from an Internal Table + Field Catalog",
    keyConceptBody: `- **ALV** displays internal-table data as an interactive grid with built-in sorting, filtering, totals, and Excel export — no extra coding.
- You supply two things: the **data** (internal table) and the **field catalog** (column metadata: headings, order, sums).
- Classic ALV uses **REUSE_ALV_GRID_DISPLAY**; modern ABAP uses **CL_SALV_TABLE**, which can auto-build the field catalog.`,
  },
});
// Flowchart for lesson 11.5
const flowchart11_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_5.id },
  update: {},
  create: {
    lessonId: lesson11_5.id,
    title: "Building an ALV Report",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "📥 Fill Internal Table (Data)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 110 }, data: { label: "🏷️ Build Field Catalog" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 110 }, data: { label: "🖥️ Call ALV Display" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 700, y: 60 }, data: { label: "🔀 User Sorts / Filters" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 700, y: 170 }, data: { label: "📤 Export to Excel" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_5.id, nodeId: "node1", title: "Fill Internal Table", description: "Gather the rows to display into an internal table — the same internal-table data you'd build for any report.", tCode: "SE38 / SE80", tips: "ALV simply displays an internal table, so all your data-gathering skills carry over." },
    { flowchartId: flowchart11_5.id, nodeId: "node2", title: "Build Field Catalog", description: "Describe each column: technical field name, heading, length, alignment, and whether it totals. This metadata drives the grid's appearance.", tCode: "LVC_FIELDCATALOG_MERGE", tips: "Let tools or the DDIC structure build the field catalog to save effort and avoid typos." },
    { flowchartId: flowchart11_5.id, nodeId: "node3", title: "Call ALV Display", description: "Pass the data and field catalog to ALV (REUSE_ALV_GRID_DISPLAY or CL_SALV_TABLE) to render the interactive grid.", tCode: "REUSE_ALV_GRID_DISPLAY", tips: "CL_SALV_TABLE can display a simple grid in just a few lines and auto-build the catalog." },
    { flowchartId: flowchart11_5.id, nodeId: "node4", title: "User Sorts / Filters", description: "End users sort columns, filter rows, and create subtotals interactively — features ALV provides without extra code.", tCode: "N/A", tips: "Users can save their preferred arrangement as a layout/variant for next time." },
    { flowchartId: flowchart11_5.id, nodeId: "node5", title: "Export to Excel", description: "ALV lets users export the grid to Excel or a local file with a click — a top reason users love ALV reports.", tCode: "N/A", tips: "Because export is built in, you rarely need custom download code." },
  ],
});
// Quiz for lesson 11.5
await prisma.quiz.upsert({
  where: { lessonId: lesson11_5.id },
  update: {},
  create: {
    lessonId: lesson11_5.id,
    title: "ALV Reports — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What two ingredients do you provide to display an ALV report?",
          explanation: "You supply the data (an internal table of rows) and the field catalog (metadata describing each column — heading, length, totals). ALV uses these to render the interactive grid.",
          options: {
            create: [
              { text: "The data (internal table) and the field catalog", isCorrect: true },
              { text: "A printer and a user role", isCorrect: false },
              { text: "A transport request and a client", isCorrect: false },
              { text: "Two database tables only", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why do developers prefer ALV over building reports with plain WRITE statements?",
          explanation: "ALV provides sorting, filtering, totals, and Excel export out of the box, giving users a consistent, interactive experience — features that would each require significant extra code with WRITE.",
          options: {
            create: [
              { text: "ALV gives sorting, filtering, totals, and export for free", isCorrect: true },
              { text: "WRITE cannot display any data", isCorrect: false },
              { text: "ALV requires no data at all", isCorrect: false },
              { text: "WRITE is only for printing checks", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What does the field catalog control in an ALV report?",
          explanation: "The field catalog defines how each column is presented — headings, column order, alignment, currency/quantity references, and which columns are totaled. It's the metadata that shapes the grid's appearance.",
          options: {
            create: [
              { text: "How each column is presented (headings, order, totals)", isCorrect: true },
              { text: "Which users may log in", isCorrect: false },
              { text: "The system's memory size", isCorrect: false },
              { text: "The transport route", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.6: ABAP Debugging
const lesson11_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-debugging" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "ABAP Debugging",
    slug: "abap-debugging",
    order: 6,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Kiran's program produces the wrong total — but the code "looks fine." He's been adding WRITE statements everywhere to print values, then removing them, for two hours. His mentor watches and says, "Stop guessing. Set a breakpoint and step through it — watch the variables change line by line."

The ABAP Debugger lets you pause a running program and inspect exactly what's happening inside — the fastest way to find why code misbehaves.`,
    content: `## Why a Debugger Beats Guessing

When a program misbehaves, sprinkling WRITE statements is slow and messy. The **ABAP Debugger** lets you **pause execution** and watch the program from the inside — variable values, internal table contents, and the exact path the code takes. You see reality instead of guessing.

## Breakpoints — Pausing the Program

A **breakpoint** tells the debugger to stop at a specific line. Ways to set one:

| Method | How |
|--------|-----|
| **Static breakpoint** | Write BREAK-POINT. in code (or BREAK username.) |
| **Session breakpoint** | Double-click a line in the editor/debugger (set on the fly) |
| **External breakpoint** | Stops a program triggered from outside (e.g. a web/RFC call) |

When execution hits a breakpoint, the debugger opens and you take control.

## Stepping Through Code

Once paused, you control execution line by line:

| Action | Key | Meaning |
|--------|-----|---------|
| **Step Into (F5)** | Enter a called routine/method |
| **Step Over (F6)** | Run a call without going inside |
| **Step Out (F7)** | Finish the current routine and return |
| **Continue (F8)** | Run to the next breakpoint |

As you step, you watch variables update — pinpointing the exact line where a value goes wrong.

## Watchpoints — Stop When Data Changes

A **watchpoint** is a conditional breakpoint on *data*: "stop when \`lv_total\` becomes negative" or "when \`lv_count\` > 100." Instead of stepping through thousands of loop passes, the debugger halts exactly when the condition is met — perfect for catching when a value goes bad.

## Inspecting Data

In the debugger you can view and even temporarily **change** variables, expand **internal tables** row by row, and see the **call stack** (which routine called which). Changing a value mid-run lets you test "what if" without editing code.

## The New (OO) Debugger

Modern systems use the **new ABAP Debugger** — a two-window, tool-based UI with tabs for variables, tables, breakpoints, and the stack. It handles object-oriented code (objects, methods, references) far better than the classic debugger.

## A Real Example

Kiran's wrong total:
- He sets a **breakpoint** at the loop that sums amounts.
- Stepping with **F6**, he watches \`lv_total\` and spots that one iteration **subtracts** instead of adds due to a sign error.
- He confirms by setting a **watchpoint** on \`lv_total\` going negative. Fix made — no random WRITE statements needed.

## Why It Matters

Debugging is how developers find the truth about running code. Breakpoints, stepping, and watchpoints turn hours of guesswork into minutes of precise investigation — making it one of the most valuable everyday skills in ABAP.`,
    keyConceptTitle: "Pause, Step, and Watch to Find Bugs",
    keyConceptBody: `- The **ABAP Debugger** pauses a running program so you can inspect variables, internal tables, and the call stack — instead of guessing with WRITE.
- Set **breakpoints** (static BREAK-POINT, or double-click a line) to stop; then **step** with F5 (into), F6 (over), F7 (out), F8 (continue).
- A **watchpoint** stops execution when a data condition is met (e.g. a value goes negative) — ideal for catching when data turns bad.`,
  },
});
// Flowchart for lesson 11.6
const flowchart11_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_6.id },
  update: {},
  create: {
    lessonId: lesson11_6.id,
    title: "Debugging a Program",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🐞 Wrong Result Observed" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 270, y: 110 }, data: { label: "🔴 Set Breakpoint" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 110 }, data: { label: "👣 Step Through (F5/F6)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 470, y: 250 }, data: { label: "👁️ Watch Variables / Tables" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 690, y: 250 }, data: { label: "✅ Pinpoint & Fix Bug" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_6.id, nodeId: "node1", title: "Wrong Result Observed", description: "A program produces an incorrect value or behaves unexpectedly, even though the code looks correct.", tCode: "N/A", tips: "Reproduce the problem with specific input so you know exactly what to investigate." },
    { flowchartId: flowchart11_6.id, nodeId: "node2", title: "Set Breakpoint", description: "Place a breakpoint where you suspect the issue — a static BREAK-POINT in code or by double-clicking a line in the editor.", tCode: "SE38 (double-click line)", tips: "Session breakpoints are cleared at logoff; static BREAK-POINTs stay in code, so remove them before transport." },
    { flowchartId: flowchart11_6.id, nodeId: "node3", title: "Step Through", description: "When execution pauses, step line by line: F5 into routines, F6 over calls, F7 out, F8 to the next breakpoint.", tCode: "ABAP Debugger", tips: "Use F6 to skip over trusted calls and F5 only when you need to go inside one." },
    { flowchartId: flowchart11_6.id, nodeId: "node4", title: "Watch Variables / Tables", description: "Inspect variable values and internal table contents as they change, and use a watchpoint to stop when a value meets a condition.", tCode: "ABAP Debugger (Watchpoint)", tips: "A watchpoint on a variable going bad saves stepping through thousands of loop iterations." },
    { flowchartId: flowchart11_6.id, nodeId: "node5", title: "Pinpoint & Fix Bug", description: "Once you see the exact line where data goes wrong, you understand the cause and can fix the code confidently.", tCode: "SE38", tips: "You can even change a variable mid-debug to test a fix before editing the code." },
  ],
});
// Quiz for lesson 11.6
await prisma.quiz.upsert({
  where: { lessonId: lesson11_6.id },
  update: {},
  create: {
    lessonId: lesson11_6.id,
    title: "ABAP Debugging — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does a breakpoint do in the ABAP Debugger?",
          explanation: "A breakpoint tells the debugger to pause execution at a specific line, opening the debugger so you can inspect variables and step through the code from that point.",
          options: {
            create: [
              { text: "It pauses program execution at a specific line", isCorrect: true },
              { text: "It deletes the program", isCorrect: false },
              { text: "It speeds the program up", isCorrect: false },
              { text: "It prints the program to a spool", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "You need to stop a loop exactly when a running total first becomes negative, without stepping through thousands of iterations. What's the best tool?",
          explanation: "A watchpoint is a conditional breakpoint on data — it halts execution precisely when a condition is met (e.g. the total goes negative), so you don't have to step through every loop pass manually.",
          options: {
            create: [
              { text: "A watchpoint that triggers when the value goes negative", isCorrect: true },
              { text: "Adding WRITE statements to every line", isCorrect: false },
              { text: "Deleting the loop", isCorrect: false },
              { text: "Restarting the SAP system", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "While paused at a routine call, you want to execute it without going inside it line by line. Which step action do you use?",
          explanation: "Step Over (F6) executes a called routine or method as a single step without entering it, keeping you at the current level. Step Into (F5) would go inside the call line by line.",
          options: {
            create: [
              { text: "Step Over (F6)", isCorrect: true },
              { text: "Step Into (F5)", isCorrect: false },
              { text: "Continue to next breakpoint (F8) only", isCorrect: false },
              { text: "There is no way to do this", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.7: BAPIs & RFC
const lesson11_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-bapi-rfc" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "BAPIs & RFC",
    slug: "abap-bapi-rfc",
    order: 7,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A new e-commerce website needs to create sales orders in SAP automatically whenever a customer checks out. Meena, an ABAP developer, is told, "Don't write directly to the SAP tables — use the BAPI." She wonders why she can't just INSERT into the order tables, and how an outside system can safely create a real SAP order.

BAPIs and RFC are SAP's official, safe doors for programs (inside or outside SAP) to read and change business data without breaking anything.`,
    content: `## The Danger of Writing Tables Directly

A sales order isn't one table — it's spread across many (header, items, schedule lines, pricing) with complex rules. Writing to them directly would bypass SAP's business logic and corrupt data. SAP provides **BAPIs** as the safe, supported way to perform business operations.

## What Is a BAPI?

A **BAPI (Business Application Programming Interface)** is a standardized **method of a Business Object** that performs a business operation correctly — applying all of SAP's validations and logic. Examples:

| BAPI | Does |
|------|------|
| **BAPI_SALESORDER_CREATEFROMDAT2** | Create a sales order |
| **BAPI_PO_CREATE1** | Create a purchase order |
| **BAPI_MATERIAL_SAVEDATA** | Create/update a material |
| **BAPI_TRANSACTION_COMMIT** | Save the changes (commit) |

Technically, most BAPIs are **RFC-enabled function modules** with a standardized interface — so they can be called locally or remotely.

## RFC — Calling Across Systems

**RFC (Remote Function Call)** is SAP's protocol for one system to call a function module in another system (or for an external program to call SAP). An **RFC-enabled** function module can be invoked remotely; the connection details live in **SM59** (RFC destinations).

This is how an external website, a middleware tool, or another SAP system can run a BAPI to create that order.

## The BAPI Commit Pattern (Critical)

BAPIs don't automatically save. You must follow the pattern:

\`\`\`abap
CALL FUNCTION 'BAPI_SALESORDER_CREATEFROMDAT2'
  EXPORTING order_header_in = ls_header
  IMPORTING salesdocument   = lv_vbeln
  TABLES    order_items_in  = lt_items
            return          = lt_return.

" Check lt_return for errors, then:
IF NOT error_found.
  CALL FUNCTION 'BAPI_TRANSACTION_COMMIT' EXPORTING wait = 'X'.
ELSE.
  CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
ENDIF.
\`\`\`

Always inspect the **RETURN** table for messages (type E = error). Commit only if there are no errors; otherwise roll back.

## Key Tools

| T-Code | Purpose |
|--------|---------|
| **BAPI** | Business Object Repository / BAPI Explorer |
| **SE37** | View the BAPI's function module interface |
| **SM59** | Define RFC destinations |
| **BD87** | Monitor IDocs (often paired with BAPIs for integration) |

## A Real Example

Meena's website integration:
- The website calls **BAPI_SALESORDER_CREATEFROMDAT2** via **RFC** through an SM59 destination.
- The BAPI validates customer, materials, pricing, and credit — exactly as a manual VA01 order would.
- She checks the **RETURN** table; no errors, so she calls **BAPI_TRANSACTION_COMMIT**. A real, correct sales order is created.

## Why It Matters

BAPIs and RFC are the foundation of safe SAP integration. They let programs perform business operations with full validation, and let external systems talk to SAP remotely — without ever touching tables directly. Knowing the commit/return pattern is essential to using them correctly.`,
    keyConceptTitle: "BAPIs Are Safe Business APIs; RFC Calls Them Remotely",
    keyConceptBody: `- A **BAPI** is a standardized method that performs a business operation with full SAP validation — never write to business tables directly.
- Most BAPIs are **RFC-enabled** function modules, so they can be called remotely (external systems use **SM59** destinations).
- Follow the pattern: call the BAPI, check the **RETURN** table for errors, then **BAPI_TRANSACTION_COMMIT** (or ROLLBACK on error).`,
  },
});
// Flowchart for lesson 11.7
const flowchart11_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_7.id },
  update: {},
  create: {
    lessonId: lesson11_7.id,
    title: "Creating an Order via BAPI",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🌐 External System / Program" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 110 }, data: { label: "🔌 RFC Call (SM59)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 110 }, data: { label: "🧰 BAPI Runs with Validation" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 500, y: 250 }, data: { label: "📋 Check RETURN Table" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 720, y: 250 }, data: { label: "💾 COMMIT or ROLLBACK" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_7.id, nodeId: "node1", title: "External System / Program", description: "A website, middleware, or another SAP system needs to perform a business action in SAP — like creating an order.", tCode: "N/A", tips: "The caller never touches SAP tables directly; it goes through the official BAPI." },
    { flowchartId: flowchart11_7.id, nodeId: "node2", title: "RFC Call (SM59)", description: "Remote Function Call lets the external program invoke an RFC-enabled function module in SAP, using a connection defined in SM59.", tCode: "SM59", tips: "SM59 stores the target system, logon, and connection type for the remote call." },
    { flowchartId: flowchart11_7.id, nodeId: "node3", title: "BAPI Runs with Validation", description: "The BAPI executes the business operation applying all of SAP's checks (customer, pricing, credit) — exactly like the manual transaction would.", tCode: "BAPI / SE37", tips: "Using a BAPI means you inherit SAP's full business logic for free — no reinventing rules." },
    { flowchartId: flowchart11_7.id, nodeId: "node4", title: "Check RETURN Table", description: "Every BAPI returns a RETURN table of messages. Inspect it for type E (error) before deciding whether to save.", tCode: "SE37 (RETURN parameter)", tips: "Never assume success — always read RETURN; a missing field can silently fail." },
    { flowchartId: flowchart11_7.id, nodeId: "node5", title: "COMMIT or ROLLBACK", description: "If RETURN has no errors, call BAPI_TRANSACTION_COMMIT to save; otherwise BAPI_TRANSACTION_ROLLBACK to discard.", tCode: "BAPI_TRANSACTION_COMMIT", tips: "Forgetting the COMMIT is the #1 reason a BAPI 'ran' but nothing was saved." },
  ],
});
// Quiz for lesson 11.7
await prisma.quiz.upsert({
  where: { lessonId: lesson11_7.id },
  update: {},
  create: {
    lessonId: lesson11_7.id,
    title: "BAPIs & RFC — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why should you use a BAPI to create a sales order instead of writing directly to the order tables?",
          explanation: "A sales order spans many tables with complex rules. A BAPI applies all of SAP's validations and business logic, keeping data consistent. Writing tables directly bypasses that logic and can corrupt data.",
          options: {
            create: [
              { text: "The BAPI applies SAP's full validation and keeps data consistent", isCorrect: true },
              { text: "Direct table writes are faster and always safe", isCorrect: false },
              { text: "BAPIs don't actually create anything", isCorrect: false },
              { text: "Tables can only be read, never written, in SAP", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does RFC enable?",
          explanation: "RFC (Remote Function Call) lets one system call a function module in another system — so an external program or another SAP system can invoke an RFC-enabled BAPI remotely. Destinations are configured in SM59.",
          options: {
            create: [
              { text: "Calling a function module in another system remotely", isCorrect: true },
              { text: "Printing documents to a local printer", isCorrect: false },
              { text: "Creating users in bulk", isCorrect: false },
              { text: "Locking the production client", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A developer calls BAPI_SALESORDER_CREATEFROMDAT2, sees no errors in RETURN, but the order is not saved. What did they most likely forget?",
          explanation: "BAPIs don't save automatically. After a clean RETURN, you must call BAPI_TRANSACTION_COMMIT to persist the changes. Forgetting the commit means the work is discarded when the program ends.",
          options: {
            create: [
              { text: "To call BAPI_TRANSACTION_COMMIT after a successful RETURN", isCorrect: true },
              { text: "To delete the customer master", isCorrect: false },
              { text: "To run the report in the background", isCorrect: false },
              { text: "To log off and on again", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.8: Enhancements & BADIs
const lesson11_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-enhancements-badis" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "Enhancements & BADIs",
    slug: "abap-enhancements-badis",
    order: 8,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A company wants SAP to add a custom check whenever a sales order is saved: block orders over ₹10 lakh for new customers. Arjun, the developer, could edit SAP's standard code — but his lead warns, "If you modify standard SAP, every upgrade becomes a nightmare and support may refuse to help." So how do you add custom behavior without touching SAP's code?

Enhancements and BADIs are SAP's official "hooks" — designated places where you can plug in your own logic safely, leaving the standard code untouched.`,
    content: `## The Golden Rule: Don't Modify Standard SAP

Changing SAP's delivered code is a **modification** — and it's dangerous: upgrades overwrite or conflict with your changes, and you take on support risk. Instead, SAP provides **enhancement technologies**: official extension points where your code runs alongside the standard, without altering it.

## The Enhancement Options (Old to New)

| Technology | What it is |
|------------|-----------|
| **User Exits** | Early predefined empty routines (often in includes) you fill in |
| **Customer Exits (CMOD/SMOD)** | Enhancement projects with function-module, screen, and menu exits |
| **BAdIs** | Business Add-Ins — object-oriented, multiple implementations |
| **Enhancement Framework** | Implicit/explicit enhancement points to inject code |

Modern development favors **BAdIs** and the **Enhancement Framework**.

## BAdIs — The Modern Hook

A **BAdI (Business Add-In)** is a predefined enhancement point, defined as an interface. SAP calls the BAdI at a certain moment (e.g. "when a sales order is saved"); you provide an **implementation** (a class) with your custom logic. Because BAdIs are object-oriented, several implementations can coexist.

- **SE18** — BAdI Definition (see where the hook is).
- **SE19** — BAdI Implementation (write your logic).

## The Enhancement Framework

The **Enhancement Framework** lets you add code at **enhancement points**:
- **Explicit** — points SAP deliberately placed for you,
- **Implicit** — standard spots (e.g. start/end of a method or FORM) where you may inject code.

You wrap your code in an **enhancement implementation**, so it's cleanly separated from standard code and survives upgrades.

## Customer Exits (CMOD/SMOD)

The classic approach: SAP defines exits (function modules like EXIT_SAPxxxx) grouped into an **enhancement** (SMOD); you activate a **project** (CMOD) and write code in the exit's include. Still widely seen in older areas.

## Choosing an Approach

- A **BAdI exists** for your need → implement it (SE19). Preferred.
- No BAdI, but an **enhancement point** fits → use the Enhancement Framework.
- Legacy area with a **customer exit** → use CMOD/SMOD.
- Avoid raw modifications unless absolutely unavoidable (and registered).

## A Real Example

Arjun's order check:
- He finds a **BAdI** that triggers when a sales order is saved.
- In **SE19**, he creates an implementation class and writes: "if customer is new and value > ₹10 lakh, raise an error message."
- The standard SAP order-save code is **untouched**; his logic runs at the right moment and survives the next upgrade.

## Why It Matters

Enhancements and BAdIs let you tailor SAP to the business **without modifying standard code** — preserving upgrade safety and support. Knowing to reach for a BAdI (SE18/SE19) or the Enhancement Framework instead of editing SAP's code is a hallmark of a professional ABAP developer.`,
    keyConceptTitle: "Extend SAP with Hooks, Don't Modify Standard Code",
    keyConceptBody: `- Modifying standard SAP code breaks upgrade safety; instead use **enhancement technologies** that run your code alongside the standard.
- A **BAdI** (SE18 definition / SE19 implementation) is the modern object-oriented hook — SAP calls it at a defined moment and you supply an implementation class.
- The **Enhancement Framework** (implicit/explicit points) and older **customer exits (CMOD/SMOD)** are other options; prefer BAdIs when available.`,
  },
});
// Flowchart for lesson 11.8
const flowchart11_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_8.id },
  update: {},
  create: {
    lessonId: lesson11_8.id,
    title: "Adding Custom Logic Safely",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "📝 Custom Requirement" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 260, y: 110 }, data: { label: "🔎 Find a BAdI (SE18)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 110 }, data: { label: "✍️ Implement It (SE19)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 470, y: 250 }, data: { label: "🪝 SAP Calls Your Code at Runtime" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 700, y: 250 }, data: { label: "✅ Standard Code Untouched (Upgrade-Safe)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_8.id, nodeId: "node1", title: "Custom Requirement", description: "The business needs behavior SAP doesn't provide out of the box — e.g. a special validation when an order is saved.", tCode: "N/A", tips: "First ask: is there config for this? Only enhance with code when standard config can't do it." },
    { flowchartId: flowchart11_8.id, nodeId: "node2", title: "Find a BAdI (SE18)", description: "Search for a Business Add-In at the right point. SE18 shows the BAdI definition — the interface SAP will call.", tCode: "SE18", tips: "Many programs list available BAdIs in their documentation or via the enhancement info system." },
    { flowchartId: flowchart11_8.id, nodeId: "node3", title: "Implement It (SE19)", description: "Create a BAdI implementation (a class) in SE19 and write your custom logic in its method(s).", tCode: "SE19", tips: "Because BAdIs are OO, multiple implementations can coexist without conflict." },
    { flowchartId: flowchart11_8.id, nodeId: "node4", title: "SAP Calls Your Code", description: "At the defined moment (e.g. order save), the standard program calls the BAdI, which runs your implementation's logic.", tCode: "N/A", tips: "Your code executes at exactly the point SAP intended — no need to find and edit the standard code." },
    { flowchartId: flowchart11_8.id, nodeId: "node5", title: "Standard Code Untouched", description: "Because your logic lives in an implementation, SAP's delivered code is never modified — so upgrades apply cleanly.", tCode: "N/A", tips: "Upgrade-safety is the whole point: enhancements survive support packages and version upgrades." },
  ],
});
// Quiz for lesson 11.8
await prisma.quiz.upsert({
  where: { lessonId: lesson11_8.id },
  update: {},
  create: {
    lessonId: lesson11_8.id,
    title: "Enhancements & BADIs — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why is modifying SAP's standard code discouraged?",
          explanation: "Modifications conflict with upgrades and support packages (which can overwrite them) and increase support risk. Enhancement technologies let you add custom logic without changing the standard code, keeping the system upgrade-safe.",
          options: {
            create: [
              { text: "It breaks upgrade-safety and support — enhancements avoid that", isCorrect: true },
              { text: "Standard code can never be changed at all", isCorrect: false },
              { text: "It makes programs run faster", isCorrect: false },
              { text: "There is no downside to modifying it", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which transactions are used to define and implement a BAdI?",
          explanation: "SE18 displays the BAdI definition (the interface SAP calls), and SE19 is where you create your implementation class with custom logic. Together they let you plug into SAP's hooks.",
          options: {
            create: [
              { text: "SE18 (definition) and SE19 (implementation)", isCorrect: true },
              { text: "SU01 and PFCG", isCorrect: false },
              { text: "SP01 and SPAD", isCorrect: false },
              { text: "ST05 and ST03", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A developer implements a BAdI to add a custom order-save check. Why will this survive the next SAP upgrade?",
          explanation: "The custom logic lives in a separate implementation that SAP's standard code calls at a defined point. Because the delivered code itself is never modified, an upgrade replaces standard code cleanly while the enhancement keeps working.",
          options: {
            create: [
              { text: "The custom logic is in a separate implementation, not in standard code", isCorrect: true },
              { text: "Upgrades never change any code", isCorrect: false },
              { text: "BAdIs delete themselves before upgrades", isCorrect: false },
              { text: "The developer copied the standard program", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.9: Object-Oriented ABAP
const lesson11_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-object-oriented" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "Object-Oriented ABAP",
    slug: "abap-object-oriented",
    order: 9,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Priya keeps seeing modern SAP code that looks different from the old reports she learned: words like CLASS, METHOD, and lo_object->do_something( ). Her team lead says, "All new ABAP should be object-oriented — BAdIs, CDS, and most frameworks expect it." Priya feels left behind and wants to understand what classes and objects actually are.

Object-Oriented ABAP organizes code into reusable, self-contained 'objects' — the modern foundation that nearly all current SAP development is built on.`,
    content: `## From Procedures to Objects

Classic ABAP is **procedural** — programs, subroutines, and function modules. **Object-Oriented ABAP (ABAP Objects)** organizes code into **classes** and **objects**, bundling data and the logic that works on it together. It's now the standard style, and frameworks like BAdIs and CDS rely on it.

## The Core Idea: Classes and Objects

- A **class** is a blueprint — it defines **attributes** (data) and **methods** (actions).
- An **object** is an **instance** of a class — a concrete thing created from the blueprint.

Analogy: a class is the **blueprint for a car**; each actual car you build from it is an **object**. The blueprint defines wheels and a start() action; each car has its own wheels and can be started independently.

\`\`\`abap
CLASS lcl_car DEFINITION.
  PUBLIC SECTION.
    METHODS: start, set_speed IMPORTING iv_kmh TYPE i.
  PRIVATE SECTION.
    DATA: mv_speed TYPE i.
ENDCLASS.

DATA lo_car TYPE REF TO lcl_car.
CREATE OBJECT lo_car.
lo_car->start( ).
lo_car->set_speed( iv_kmh = 60 ).
\`\`\`

## Key OO Concepts (Beginner View)

| Concept | Meaning |
|---------|---------|
| **Encapsulation** | Hide internal data (PRIVATE); expose only methods (PUBLIC) |
| **Inheritance** | A class can extend another, reusing its features |
| **Interface** | A contract of methods a class must implement |
| **Instance vs Static** | Instance members belong to an object; static (CLASS-DATA/CLASS-METHODS) belong to the class itself |

## Visibility Sections

- **PUBLIC** — accessible from outside (the object's interface).
- **PROTECTED** — accessible to the class and its subclasses.
- **PRIVATE** — internal only.

Encapsulation means outsiders use **methods**, not the raw data — keeping objects safe and self-contained.

## Where You Build Classes

| Tool | Purpose |
|------|---------|
| **SE24** | Class Builder (global classes) |
| **SE80** | Object Navigator (classes, includes, everything) |
| **Local classes** | Defined inside a program with CLASS ... ENDCLASS |

Global classes (often named **CL_** or **ZCL_**) are reusable system-wide, like function modules but object-oriented.

## A Real Example

Priya's understanding clicks:
- She creates a class **ZCL_INVOICE** in **SE24** with a private attribute for the amount and public methods \`add_line( )\` and \`get_total( )\`.
- Code that uses it does \`CREATE OBJECT lo_invoice\`, then \`lo_invoice->add_line( ... )\` — never touching the internal total directly.
- This same object style is exactly what BAdI implementations and CDS-based logic use.

## Why It Matters

Object-Oriented ABAP is the modern standard. BAdIs, the Enhancement Framework, ALV (CL_SALV_TABLE), and S/4HANA development are all object-oriented. Understanding classes, objects, methods, and encapsulation is essential for working in any current SAP codebase.`,
    keyConceptTitle: "Classes Are Blueprints; Objects Are Instances",
    keyConceptBody: `- **Object-Oriented ABAP** bundles data (**attributes**) and logic (**methods**) into **classes**; an **object** is an instance created from a class.
- **Encapsulation** hides internal data (PRIVATE) and exposes behavior through PUBLIC methods; **inheritance** and **interfaces** enable reuse and contracts.
- Build classes in **SE24** (or locally); modern frameworks (BAdIs, ALV CL_SALV_TABLE, CDS, S/4HANA) are all object-oriented.`,
  },
});
// Flowchart for lesson 11.9
const flowchart11_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_9.id },
  update: {},
  create: {
    lessonId: lesson11_9.id,
    title: "From Class to Object to Method Call",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "📐 Define Class (Blueprint)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 60 }, data: { label: "🔒 Attributes (Data)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 290, y: 170 }, data: { label: "⚙️ Methods (Actions)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 500, y: 110 }, data: { label: "🆕 CREATE OBJECT (Instance)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 720, y: 110 }, data: { label: "📞 Call Method (obj->method)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_9.id, nodeId: "node1", title: "Define Class", description: "A class is the blueprint that declares what data and behavior its objects will have, organized into visibility sections (public/protected/private).", tCode: "SE24 / SE80", tips: "Global classes (CL_/ZCL_) are reusable system-wide; local classes live inside one program." },
    { flowchartId: flowchart11_9.id, nodeId: "node2", title: "Attributes (Data)", description: "Attributes are the variables an object holds. Making them PRIVATE protects them — outsiders can't change them directly.", tCode: "SE24 (Attributes)", tips: "Encapsulation: keep data private and expose it only through methods." },
    { flowchartId: flowchart11_9.id, nodeId: "node3", title: "Methods (Actions)", description: "Methods are the actions an object can perform, with importing/exporting parameters like function modules — but tied to the object.", tCode: "SE24 (Methods)", tips: "Public methods form the object's interface — the safe way others interact with it." },
    { flowchartId: flowchart11_9.id, nodeId: "node4", title: "CREATE OBJECT", description: "CREATE OBJECT instantiates the class, producing a concrete object referenced by a TYPE REF TO variable. Each object has its own data.", tCode: "SE38 (CREATE OBJECT)", tips: "Modern syntax: DATA(lo) = NEW zcl_invoice( ) creates and references in one line." },
    { flowchartId: flowchart11_9.id, nodeId: "node5", title: "Call Method", description: "You invoke behavior with obj->method( ). The object runs the logic using its own attribute values.", tCode: "SE38", tips: "Many objects from the same class run independently, each with its own state." },
  ],
});
// Quiz for lesson 11.9
await prisma.quiz.upsert({
  where: { lessonId: lesson11_9.id },
  update: {},
  create: {
    lessonId: lesson11_9.id,
    title: "Object-Oriented ABAP — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the relationship between a class and an object in ABAP?",
          explanation: "A class is the blueprint that defines attributes and methods; an object is a concrete instance created from that blueprint (with CREATE OBJECT). Like a car blueprint versus individual cars built from it.",
          options: {
            create: [
              { text: "A class is the blueprint; an object is an instance of it", isCorrect: true },
              { text: "A class is an instance of an object", isCorrect: false },
              { text: "They are the same thing", isCorrect: false },
              { text: "An object is a database table", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does 'encapsulation' mean in object-oriented ABAP?",
          explanation: "Encapsulation means hiding an object's internal data (declaring it PRIVATE) and exposing behavior only through PUBLIC methods. Outsiders interact via methods, not by touching the raw data — keeping objects safe and self-contained.",
          options: {
            create: [
              { text: "Hiding internal data and exposing behavior through methods", isCorrect: true },
              { text: "Copying code into many programs", isCorrect: false },
              { text: "Printing reports to a spool", isCorrect: false },
              { text: "Deleting unused classes", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is learning object-oriented ABAP important for modern SAP development?",
          explanation: "Modern frameworks — BAdIs, the Enhancement Framework, the ALV class CL_SALV_TABLE, and S/4HANA development — are all object-oriented. Working in current SAP codebases requires understanding classes, objects, and methods.",
          options: {
            create: [
              { text: "Modern frameworks (BAdIs, CL_SALV_TABLE, S/4HANA) are object-oriented", isCorrect: true },
              { text: "Procedural code no longer runs in SAP", isCorrect: false },
              { text: "OO ABAP is only used for printing", isCorrect: false },
              { text: "It has no practical use today", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.10: CDS Views (Core Data Services)
const lesson11_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-cds-views" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "CDS Views (Core Data Services)",
    slug: "abap-cds-views",
    order: 10,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Karthik's old report SELECTs from five tables, joins them in ABAP, and loops to calculate totals — and on S/4HANA it's slower than expected. A senior architect tells him, "Push the logic down to the database with a CDS view. Let HANA do the heavy lifting." Karthik has only ever written SELECTs in ABAP and wonders what a CDS view even is.

CDS Views are the modern, database-level way to define and shape data in S/4HANA — the foundation of fast reporting and Fiori apps.`,
    content: `## The Shift: Push Logic Down to HANA

Traditional ABAP pulls raw rows from the database, then joins and calculates in the application layer. With the fast **HANA** database, the modern principle is **code pushdown** — do joins, filters, and calculations **in the database** so it returns finished results. **CDS Views (Core Data Services)** are how you define this data-level logic.

## What Is a CDS View?

A **CDS View** is a richer kind of database view defined in source code (in ABAP Development Tools / Eclipse, or SE80 in newer releases). It can join tables, calculate fields, aggregate, and carry **semantic annotations** (extra metadata). It's reusable, stackable, and lives close to the data.

\`\`\`abap
@AbapCatalog.sqlViewName: 'ZVSALESSUM'
define view ZSalesSummary as
  select from vbak
    inner join vbap on vbak.vbeln = vbap.vbeln
  {
    key vbak.vbeln,
        vbak.kunnr,
        sum( vbap.netwr ) as total_value
  }
  group by vbak.vbeln, vbak.kunnr
\`\`\`

## Why CDS Is Powerful

| Capability | Benefit |
|------------|---------|
| **Code pushdown** | Joins/aggregations run in HANA — fast |
| **Reusable** | Views build on other views (a virtual data model) |
| **Annotations** | Add metadata for UI, analytics, OData |
| **OData exposure** | A CDS view can be published as an OData service for Fiori |
| **Consumed in ABAP** | You can SELECT from a CDS view like a table |

## Annotations — Metadata That Does Work

CDS **annotations** (starting with @) tell SAP extra things about the view — for example \`@OData.publish: true\` to expose it as an OData service, or UI and analytics annotations. This is what links CDS to **Fiori** apps and embedded analytics with minimal extra code.

## CDS in the Modern Stack

CDS sits at the heart of S/4HANA's **Virtual Data Model (VDM)**: layered CDS views (basic → composite → consumption) provide a clean, reusable data model. Fiori apps and analytical reports read from CDS views via OData — the standard modern architecture.

## CDS vs Classic Approaches

- **Classic DB view (SE11)** — simple joins, limited features.
- **ABAP SELECT with ABAP-side calculation** — logic in the app layer (slower on big data).
- **CDS view** — rich logic pushed to the database, reusable, annotation-driven. Preferred in S/4HANA.

## A Real Example

Karthik's slow report:
- He replaces the five-table ABAP join + loop with a **CDS view** that joins the tables and uses \`sum(...)\` to total values **in the database**.
- His ABAP simply does \`SELECT FROM zsales_summary\` — the heavy work already done by HANA.
- Adding an OData annotation, the same CDS view powers a Fiori analytical tile. The report is now fast and reusable.

## Why It Matters

CDS Views are the cornerstone of modern S/4HANA development. They make reporting fast through code pushdown, provide a reusable virtual data model, and feed Fiori and analytics via OData. For any current or future SAP work, CDS is essential ABAP knowledge.`,
    keyConceptTitle: "CDS Views Push Data Logic Down to HANA",
    keyConceptBody: `- **CDS Views** define joins, calculations, and aggregations in source code that run **in the HANA database** (code pushdown) — fast and reusable.
- They support **annotations** (e.g. @OData.publish) that expose views as OData services for **Fiori** and analytics, and can be consumed in ABAP like a table.
- Layered CDS views form S/4HANA's **Virtual Data Model**, the modern standard replacing app-layer joins and simple SE11 views.`,
  },
});
// Flowchart for lesson 11.10
const flowchart11_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_10.id },
  update: {},
  create: {
    lessonId: lesson11_10.id,
    title: "How a CDS View Serves Data",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🗄️ HANA Tables" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 110 }, data: { label: "🧱 CDS View (Joins + Calc)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 110 }, data: { label: "🏷️ Annotations (@OData, UI)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 690, y: 50 }, data: { label: "📱 Fiori App (via OData)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 690, y: 170 }, data: { label: "💻 ABAP SELECT from CDS" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart11_10.id, nodeId: "node1", title: "HANA Tables", description: "The underlying database tables (e.g. VBAK, VBAP). On HANA, it's fastest to process data where it lives rather than hauling raw rows to the app layer.", tCode: "SE11", tips: "Code pushdown means the database does the joining and aggregating, not ABAP." },
    { flowchartId: flowchart11_10.id, nodeId: "node2", title: "CDS View", description: "Defines joins, calculated fields, and aggregations in source code that execute in HANA. Views can build on other views to form a reusable model.", tCode: "ADT (Eclipse) / SE80", tips: "Layer views: basic → composite → consumption, for a clean virtual data model." },
    { flowchartId: flowchart11_10.id, nodeId: "node3", title: "Annotations", description: "Metadata starting with @ adds capabilities — exposing the view as OData, or describing UI and analytics behavior — with little extra code.", tCode: "ADT", tips: "@OData.publish: true turns a CDS view into a ready-to-consume OData service." },
    { flowchartId: flowchart11_10.id, nodeId: "node4", title: "Fiori App (via OData)", description: "A CDS view published as OData feeds Fiori apps and analytical tiles, connecting modern UIs directly to the data model.", tCode: "Fiori / OData", tips: "CDS + OData + Fiori is the standard modern S/4HANA application stack." },
    { flowchartId: flowchart11_10.id, nodeId: "node5", title: "ABAP SELECT from CDS", description: "ABAP programs can SELECT from a CDS view just like a table, receiving the already-joined, already-calculated result.", tCode: "SE38", tips: "Replacing app-layer joins with a CDS SELECT often dramatically speeds up reports." },
  ],
});
// Quiz for lesson 11.10
await prisma.quiz.upsert({
  where: { lessonId: lesson11_10.id },
  update: {},
  create: {
    lessonId: lesson11_10.id,
    title: "CDS Views — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the core principle behind CDS Views on HANA?",
          explanation: "CDS Views embody 'code pushdown' — joins, filters, and calculations are defined to run in the HANA database, which returns finished results, instead of pulling raw rows and processing them in the ABAP application layer.",
          options: {
            create: [
              { text: "Code pushdown — do joins and calculations in the database", isCorrect: true },
              { text: "Move all logic into the user's browser", isCorrect: false },
              { text: "Avoid using the database entirely", isCorrect: false },
              { text: "Print data instead of querying it", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does a CDS annotation like @OData.publish: true do?",
          explanation: "Annotations add metadata/capabilities to a CDS view. @OData.publish exposes the view as an OData service, making it directly consumable by Fiori apps and analytics — with minimal extra code.",
          options: {
            create: [
              { text: "Exposes the CDS view as an OData service for Fiori/analytics", isCorrect: true },
              { text: "Deletes the underlying tables", isCorrect: false },
              { text: "Locks the view from being read", isCorrect: false },
              { text: "Converts the view into a printer", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A report joins five tables and totals values in an ABAP loop, running slowly on S/4HANA. Why does moving this into a CDS view help?",
          explanation: "A CDS view performs the joins and aggregation in the HANA database (code pushdown), returning the finished totals. This avoids hauling many raw rows into ABAP and looping over them, which is the slow part on large data sets.",
          options: {
            create: [
              { text: "The database does the joins and totals, returning finished results fast", isCorrect: true },
              { text: "CDS views skip reading the data altogether", isCorrect: false },
              { text: "It moves the loop to the user's PC", isCorrect: false },
              { text: "It has no effect on performance", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 3 COMPLETE: 16 lessons written ──────────────────────────────────



