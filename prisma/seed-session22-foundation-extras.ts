// ─── FILE: prisma/seed-session22-foundation-extras.ts ───
// Adds 7 beginner-critical lessons to the SAP Foundation module (orders 9–15).
// Idempotent: safe to re-run. Run with:  npx tsx prisma/seed-session22-foundation-extras.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COLORS = ["#2563EB", "#0891B2", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

interface NodeDef { id: string; label: string; color?: string; }
interface DetailDef { nodeId: string; title: string; description: string; tCode?: string; tips?: string; }
interface OptionDef { text: string; correct?: boolean; }
interface QuestionDef { question: string; explanation: string; options: OptionDef[]; }

interface LessonDef {
  slug: string;
  title: string;
  order: number;
  minutes: number;
  importance: "HIGH" | "MEDIUM" | "LOW";
  story: string;
  content: string;
  keyTitle: string;
  keyBody: string;
  flowTitle: string;
  nodes: NodeDef[];
  details: DetailDef[];
  quizTitle: string;
  questions: QuestionDef[];
}

async function createLesson(moduleId: string, L: LessonDef) {
  const lesson = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId, slug: L.slug } },
    update: {},
    create: {
      moduleId,
      title: L.title,
      slug: L.slug,
      order: L.order,
      isPublished: true,
      estimatedMinutes: L.minutes,
      difficulty: "BEGINNER",
      xpReward: 50,
      interviewImportance: L.importance,
      story: L.story,
      content: L.content,
      keyConceptTitle: L.keyTitle,
      keyConceptBody: L.keyBody,
    },
  });

  const nodes = L.nodes.map((n, i) => ({
    id: n.id,
    type: "default",
    position: { x: 250, y: 40 + i * 110 },
    data: { label: n.label },
    style: { background: n.color ?? COLORS[i % COLORS.length], color: "#fff", borderRadius: "8px", padding: "10px 16px" },
  }));
  const edges = L.nodes.slice(1).map((n, i) => ({
    id: `e${i + 1}`,
    source: L.nodes[i].id,
    target: n.id,
    type: "default",
  }));

  const flowchart = await prisma.flowchart.upsert({
    where: { lessonId: lesson.id },
    update: {},
    create: { lessonId: lesson.id, title: L.flowTitle, nodes, edges },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: L.details.map((d) => ({
      flowchartId: flowchart.id,
      nodeId: d.nodeId,
      title: d.title,
      description: d.description,
      tCode: d.tCode ?? null,
      tips: d.tips ?? null,
    })),
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson.id },
    update: {},
    create: {
      lessonId: lesson.id,
      title: L.quizTitle,
      questions: {
        create: L.questions.map((q, qi) => ({
          order: qi + 1,
          question: q.question,
          explanation: q.explanation,
          options: { create: q.options.map((o) => ({ text: o.text, isCorrect: !!o.correct })) },
        })),
      },
    },
  });

  console.log(`✅ ${L.order}. ${L.title}`);
}

const LESSONS: LessonDef[] = [
  // ── 9. Data Dictionary (SE11) ──
  {
    slug: "sap-data-dictionary",
    title: "The Data Dictionary (SE11)",
    order: 9,
    minutes: 10,
    importance: "HIGH",
    story: `Priya, a new consultant, is asked: "Where does SAP actually store a customer's name?" She assumes it's just a field on a screen. Her mentor smiles and opens transaction SE11.

Suddenly Priya sees the machinery behind every SAP screen — tables, fields, and the reusable definitions that keep data consistent everywhere. This is the Data Dictionary, and once you understand it, SAP stops feeling like magic and starts feeling like a well-organized library.`,
    content: `## What Is the Data Dictionary?

The **ABAP Dictionary** (or **DDIC**), opened with T-code **SE11**, is where SAP defines *all* its data structures — every table, field, and data type in the system. Think of it as the **master blueprint** of the database.

Every screen field you see (like "Customer Name") is ultimately backed by a **table** and a **field** defined here.

## Tables, Fields & Keys

A **table** stores data in rows and columns, just like a spreadsheet.

| Term | Meaning | Example |
|------|---------|---------|
| Table | A set of related records | \`KNA1\` (customer master) |
| Field | One column in a table | \`NAME1\` (customer name) |
| Key field | Uniquely identifies a row | \`KUNNR\` (customer number) |

Some tables you'll hear constantly: **MARA** (material master), **KNA1** (customers), **LFA1** (vendors), **BKPF/BSEG** (accounting documents).

## Domains and Data Elements — Reuse, Not Repeat

SAP avoids defining the same thing twice using two layers:

| Object | What it defines | Analogy |
|--------|-----------------|---------|
| **Domain** | The technical type + length + allowed values (e.g. CHAR 10) | The *rules* for a value |
| **Data Element** | The business meaning + field label (e.g. "Customer Number") | The *label* users see |

A field uses a **data element**, which points to a **domain**. Change the domain once and every field using it stays consistent — like updating one style that every document inherits.

## Why This Matters

When a report needs data, a developer looks up the **table and field names** in SE11. When you hear "the data is in table MARA," that's the Dictionary talking. Understanding DDIC is the difference between guessing where data lives and knowing.`,
    keyTitle: "SE11 Defines Every Table, Field & Type in SAP",
    keyBody: `- **SE11** (ABAP Dictionary) is the blueprint of all SAP data structures.
- **Tables** hold data; **fields** are columns; **key fields** uniquely identify each row.
- **Domains** define the technical rules; **data elements** add business meaning + labels — reused everywhere for consistency.`,
    flowTitle: "How SAP Defines a Field",
    nodes: [
      { id: "n1", label: "🗄️ Table (e.g. KNA1)" },
      { id: "n2", label: "🔤 Field (e.g. KUNNR)" },
      { id: "n3", label: "🏷️ Data Element (business meaning)" },
      { id: "n4", label: "📐 Domain (type, length, values)" },
      { id: "n5", label: "🖥️ Shown on the SAP screen" },
    ],
    details: [
      { nodeId: "n1", title: "Table", description: "A table stores records in rows and columns. Every business object (customer, material, invoice) has one or more tables behind it.", tCode: "SE11", tips: "KNA1 = customers, MARA = materials, LFA1 = vendors — memorize a few common ones." },
      { nodeId: "n2", title: "Field", description: "A field is a single column in a table, such as KUNNR (customer number) or NAME1 (name).", tCode: "SE11", tips: "Key fields (marked with a tick) uniquely identify each row." },
      { nodeId: "n3", title: "Data Element", description: "Defines the business meaning of a field and the label users see. Multiple fields can reuse the same data element.", tCode: "SE11", tips: "Double-click a field in SE11 to drill into its data element." },
      { nodeId: "n4", title: "Domain", description: "Defines the technical type (e.g. CHAR 10), length, and any allowed value list. Data elements point to a domain.", tCode: "SE11", tips: "Change a domain once and every field using it updates — that's how SAP stays consistent." },
      { nodeId: "n5", title: "On the Screen", description: "The field finally appears on a transaction screen with the label from its data element.", tCode: "N/A", tips: "Press F1 on any field, then the technical-info button, to see its table + data element." },
    ],
    quizTitle: "Data Dictionary — Check Your Understanding",
    questions: [
      {
        question: "Which transaction opens the ABAP Data Dictionary?",
        explanation: "SE11 is the ABAP Dictionary, where all tables, data elements, and domains are defined.",
        options: [
          { text: "SE11", correct: true },
          { text: "SU01" },
          { text: "ME21N" },
          { text: "STMS" },
        ],
      },
      {
        question: "What is the difference between a domain and a data element?",
        explanation: "A domain defines the technical rules (type, length, allowed values); a data element adds the business meaning and field label and points to a domain.",
        options: [
          { text: "The domain defines the technical type/length; the data element adds business meaning and the label", correct: true },
          { text: "They are two names for the same thing" },
          { text: "A domain is a table and a data element is a field" },
          { text: "A data element stores data; a domain stores reports" },
        ],
      },
      {
        question: "A colleague says \"the customer name is in table KNA1, field NAME1.\" Where would you confirm that field's definition?",
        explanation: "SE11 lets you open table KNA1 and inspect every field, including NAME1 and its data element/domain.",
        options: [
          { text: "In SE11 by displaying table KNA1", correct: true },
          { text: "By guessing from the screen layout" },
          { text: "In the user's authorization roles" },
          { text: "In the transport request log" },
        ],
      },
    ],
  },

  // ── 10. System Landscape & Clients ──
  {
    slug: "sap-system-landscape-clients",
    title: "System Landscape & Clients",
    order: 10,
    minutes: 9,
    importance: "HIGH",
    story: `On his first project, Rahul proudly says he "made a change in SAP." His lead immediately asks: "Which system? And which client?" Rahul freezes — he didn't realize there were several SAP systems, not one.

That question — which system, which client — is asked on every SAP project, every day. This lesson makes sure you never freeze on it.`,
    content: `## Not One System — Usually Three

Companies don't build and test directly on the live system. They use a **three-system landscape**:

| System | Purpose | Nickname |
|--------|---------|----------|
| **Development (DEV)** | Where changes are built and configured | "Dev" |
| **Quality Assurance (QAS)** | Where changes are tested | "Q" / "Test" |
| **Production (PRD)** | The live system real users work in | "Prod" |

A change flows **DEV → QAS → PRD**, never the other way. This protects the live system: nothing reaches production untested.

## What Is a Client?

Inside a single system, a **client** is a self-contained business environment with its own data. The client number is those 3 digits you type at login (e.g. **100**).

Think of one SAP system as an **apartment building**, and each client as a **separate apartment** — same building, but the furniture (data) inside each is separate.

- The technical field for client is **MANDT** — it's the first key field of almost every table.
- Two clients in the same system can have completely different master data.

## Client-Dependent vs Client-Independent

| Type | Stored per client? | Example |
|------|--------------------|---------|
| Client-dependent | Yes — separate per client | Customer master, invoices |
| Client-independent | No — shared across all clients | ABAP programs, some system settings |

## Why This Matters

"I changed it in SAP" means nothing without **which system + which client**. Configuration done in the wrong client (or directly in production) is one of the most common — and most dangerous — beginner mistakes.`,
    keyTitle: "Three Systems (DEV→QAS→PRD), Many Clients Inside Each",
    keyBody: `- SAP runs as a **landscape**: Development → Quality → Production. Changes only flow forward.
- A **client** (login number, field **MANDT**) is a self-contained data environment inside a system.
- **Client-dependent** data is separate per client; **client-independent** objects (like programs) are shared.`,
    flowTitle: "How a Change Moves Through the Landscape",
    nodes: [
      { id: "n1", label: "🛠️ DEV — build the change" },
      { id: "n2", label: "🧪 QAS — test the change" },
      { id: "n3", label: "🚀 PRD — go live" },
      { id: "n4", label: "👤 Client (e.g. 100) inside a system" },
    ],
    details: [
      { nodeId: "n1", title: "Development (DEV)", description: "Where consultants configure settings and developers write code. Every change starts here and is captured in a transport request.", tCode: "SPRO (config)", tips: "Never build the same change twice — build in DEV, then transport it onward." },
      { nodeId: "n2", title: "Quality (QAS)", description: "A copy-like system used purely to test changes with realistic data before they reach users.", tCode: "N/A", tips: "If it isn't tested in QAS, it isn't ready for production." },
      { nodeId: "n3", title: "Production (PRD)", description: "The live system real business users work in. Direct changes here are heavily restricted.", tCode: "N/A", tips: "Configuration is normally locked in PRD — changes must be transported in." },
      { nodeId: "n4", title: "Client (MANDT)", description: "A self-contained data environment inside a system, chosen at login by its 3-digit number. MANDT is the first key field of most tables.", tCode: "SCC4 (client admin)", tips: "Always confirm which client you're in before making changes." },
    ],
    quizTitle: "System Landscape & Clients — Check Your Understanding",
    questions: [
      {
        question: "In a standard SAP landscape, in which order does a change move?",
        explanation: "Changes are built in Development, tested in Quality, and only then released to Production — always forward, never backward.",
        options: [
          { text: "DEV → QAS → PRD", correct: true },
          { text: "PRD → QAS → DEV" },
          { text: "QAS → DEV → PRD" },
          { text: "Changes are made directly in PRD" },
        ],
      },
      {
        question: "What does a 'client' represent in SAP?",
        explanation: "A client is a self-contained business data environment within a system, selected by its number at login. The technical field is MANDT.",
        options: [
          { text: "A self-contained data environment inside a system, chosen at login", correct: true },
          { text: "A customer who buys from the company" },
          { text: "The desktop app used to log in" },
          { text: "A type of transaction code" },
        ],
      },
      {
        question: "Which of these is typically client-independent (shared across all clients)?",
        explanation: "ABAP programs are client-independent — they exist once per system. Business data like customers and invoices is client-dependent.",
        options: [
          { text: "ABAP programs", correct: true },
          { text: "Customer master data" },
          { text: "Posted invoices" },
          { text: "Sales orders" },
        ],
      },
    ],
  },

  // ── 11. Transport Requests & TMS ──
  {
    slug: "sap-transport-requests",
    title: "Transport Requests & TMS",
    order: 11,
    minutes: 9,
    importance: "HIGH",
    story: `Meera finishes configuring a new document type in DEV. It works perfectly. The next morning her lead asks, "Did you release the transport?" Meera didn't — so the change never reached the test system, and testing is blocked.

Transports are how every SAP change travels between systems. Miss this step and your work is invisible to everyone else. Let's make sure that never happens to you.`,
    content: `## Why Transports Exist

Remember the landscape: changes are built in **DEV** but must run in **QAS** and **PRD**. A **Transport Request (TR)** is the *package* that carries those changes from one system to the next.

Think of it like a **shipping box**: you put your changes inside, seal it (release), and it's shipped down the line DEV → QAS → PRD.

## What's Inside a Transport

| Type of change | Goes into |
|----------------|-----------|
| Configuration (customizing) | A **Customizing** request |
| Programs, DDIC objects | A **Workbench** request |

A request has a **header** and one or more **tasks** (usually one per person working on it).

## The Transport Lifecycle

1. **Create/assign** — when you make a change, SAP asks for a transport request (or you create one).
2. **Work** — your changes attach to your task inside the request.
3. **Release** — you release your task, then the request. This "seals the box."
4. **Import** — a Basis admin imports it into QAS, then PRD, using **STMS**.

| T-code | Use |
|--------|-----|
| **SE09 / SE10** | Your Transport Organizer — see and release your requests |
| **STMS** | Transport Management System — import requests between systems |

## Why This Matters

A change that isn't in a released transport **stays trapped in DEV**. "Release your transport" is one of the most common instructions you'll hear — and forgetting it silently blocks the whole team.`,
    keyTitle: "Transports Carry Changes DEV → QAS → PRD",
    keyBody: `- A **Transport Request** packages your changes so they can move between systems.
- **Customizing** requests carry config; **Workbench** requests carry programs/DDIC objects.
- You **release** requests in **SE09/SE10**; Basis **imports** them via **STMS**. Unreleased = stuck in DEV.`,
    flowTitle: "The Transport Lifecycle",
    nodes: [
      { id: "n1", label: "✏️ Make a change in DEV" },
      { id: "n2", label: "📦 Change captured in a Transport Request" },
      { id: "n3", label: "🔒 Release the request (SE09/SE10)" },
      { id: "n4", label: "📥 Import to QAS (STMS)" },
      { id: "n5", label: "🚀 Import to PRD (STMS)" },
    ],
    details: [
      { nodeId: "n1", title: "Make a Change", description: "You configure a setting or a developer edits an object in the Development system.", tCode: "SPRO / SE80", tips: "SAP prompts for a transport request the moment you save a transportable change." },
      { nodeId: "n2", title: "Captured in a TR", description: "The change is recorded in a transport request (customizing or workbench), under your task.", tCode: "SE09", tips: "Give requests clear descriptions — you'll thank yourself when tracking them later." },
      { nodeId: "n3", title: "Release", description: "Release your task, then the request. This finalizes the contents so it can be moved.", tCode: "SE09 / SE10", tips: "Release the task first, then the request — order matters." },
      { nodeId: "n4", title: "Import to QAS", description: "A Basis administrator imports the released request into the Quality system for testing.", tCode: "STMS", tips: "If your change isn't in QAS, check whether the transport was actually released." },
      { nodeId: "n5", title: "Import to PRD", description: "After successful testing, the same request is imported into Production so users get the change.", tCode: "STMS", tips: "The exact same transport moves forward — never rebuild the change in each system." },
    ],
    quizTitle: "Transport Requests — Check Your Understanding",
    questions: [
      {
        question: "What is the purpose of a transport request?",
        explanation: "A transport request packages changes made in DEV so they can be moved to QAS and PRD in a controlled way.",
        options: [
          { text: "To carry changes from one system to the next (DEV→QAS→PRD)", correct: true },
          { text: "To log a user into SAP" },
          { text: "To create a purchase order" },
          { text: "To back up the database" },
        ],
      },
      {
        question: "You configured a change in DEV but nobody can see it in QAS. What did you most likely forget?",
        explanation: "If a change isn't in a released transport, it stays in DEV. Releasing the request (SE09/SE10) is required before it can be imported to QAS.",
        options: [
          { text: "To release the transport request", correct: true },
          { text: "To log off and back on" },
          { text: "To create a new user" },
          { text: "To run a report" },
        ],
      },
      {
        question: "Which tool does a Basis admin use to import transports between systems?",
        explanation: "STMS (Transport Management System) is used to import released requests from DEV into QAS and PRD.",
        options: [
          { text: "STMS", correct: true },
          { text: "SE11" },
          { text: "VA01" },
          { text: "FB60" },
        ],
      },
    ],
  },

  // ── 12. Users, Roles & Authorizations ──
  {
    slug: "sap-users-roles-authorizations",
    title: "Users, Roles & Authorizations",
    order: 12,
    minutes: 9,
    importance: "HIGH",
    story: `A new joiner, Sana, tries to post an invoice and gets a blunt red message: "You are not authorized." She has a valid SAP login — so why is she blocked?

Because a login alone grants nothing. What you can *do* in SAP is controlled by roles and authorizations. This lesson explains the system that decides who can do what.`,
    content: `## A Login Is Not Access

Your **user** (created in **SU01**) lets you log in. But what you can *do* is granted separately through **roles**. No role, no access — even for a valid user.

## Users, Roles, Authorizations

| Layer | What it is | T-code |
|-------|-----------|--------|
| **User** | Your personal login account | **SU01** |
| **Role** | A bundle of permissions for a job | **PFCG** |
| **Authorization** | A single permission inside a role | (inside PFCG) |

Think of it like a building: your **user** is your ID badge, a **role** is the set of doors your badge opens, and each **authorization** is one specific door.

## How a Role Grants Access

A role contains **authorization objects** — each with fields that define *exactly* what's allowed. For example, an object might allow:

- **Activity**: Create (01), Change (02), Display (03)
- **Company code**: 1000 only

So a role could let someone *display* invoices in company code 1000 but not *post* them — fine-grained control.

## The Authority Check

When you run a transaction, SAP performs an **authority check**: does your user (via its roles) have the required authorization? If not, you get the "not authorized" message.

| T-code | Use |
|--------|-----|
| **SU01** | Create/maintain users, assign roles |
| **PFCG** | Build roles and their authorizations |
| **SU53** | Show *why* the last authorization failed |

## Why This Matters

Security follows **least privilege**: give people only what their job needs. Understanding users vs roles vs authorizations is essential — and "run SU53 to see what's missing" is advice you'll give and receive often.`,
    keyTitle: "Users Log In; Roles Grant What They Can Do",
    keyBody: `- A **user** (SU01) is a login; it grants no access on its own.
- **Roles** (PFCG) bundle **authorizations** — the actual permissions — and are assigned to users.
- SAP runs an **authority check** on each action; **SU53** shows what authorization was missing.`,
    flowTitle: "How SAP Decides If You Can Act",
    nodes: [
      { id: "n1", label: "👤 User logs in (SU01)" },
      { id: "n2", label: "🎭 Roles assigned to the user (PFCG)" },
      { id: "n3", label: "🔑 Authorizations inside the roles" },
      { id: "n4", label: "🛂 Authority check on the action" },
      { id: "n5", label: "✅ Allowed  /  ⛔ Not authorized" },
    ],
    details: [
      { nodeId: "n1", title: "User", description: "The login account created in SU01. It identifies you but grants no business permissions by itself.", tCode: "SU01", tips: "A brand-new user with no roles can log in but do almost nothing." },
      { nodeId: "n2", title: "Roles", description: "Roles are built in PFCG and assigned to users. Each role is a bundle of permissions for a particular job.", tCode: "PFCG", tips: "Users usually get several roles — one per area of responsibility." },
      { nodeId: "n3", title: "Authorizations", description: "Inside a role are authorization objects with fields like Activity (create/change/display) and org values (e.g. company code).", tCode: "PFCG", tips: "This is where 'display only' vs 'create' is decided." },
      { nodeId: "n4", title: "Authority Check", description: "When you launch a transaction, SAP checks whether your roles grant the required authorization.", tCode: "N/A", tips: "Failing a check produces the classic 'You are not authorized' message." },
      { nodeId: "n5", title: "Result", description: "If authorized, the action proceeds; if not, it's blocked. SU53 shows exactly which authorization was missing.", tCode: "SU53", tips: "Run SU53 right after a failure and send the screenshot to your security team." },
    ],
    quizTitle: "Users, Roles & Authorizations — Check Your Understanding",
    questions: [
      {
        question: "A user has a valid login but gets 'not authorized' when posting an invoice. Why?",
        explanation: "A login only identifies the user. The ability to perform actions comes from roles/authorizations, which this user is missing for posting invoices.",
        options: [
          { text: "Their user has no role granting that authorization", correct: true },
          { text: "SAP is down for everyone" },
          { text: "They typed the wrong password" },
          { text: "Invoices can never be posted in SAP" },
        ],
      },
      {
        question: "Which transaction is used to build roles and their authorizations?",
        explanation: "PFCG (the Profile Generator) is where roles and their authorization objects are created and maintained.",
        options: [
          { text: "PFCG", correct: true },
          { text: "SU01" },
          { text: "SE11" },
          { text: "MIGO" },
        ],
      },
      {
        question: "After an authorization failure, which transaction shows what was missing?",
        explanation: "SU53 displays the last failed authorization check for your user, showing exactly which object/value was missing.",
        options: [
          { text: "SU53", correct: true },
          { text: "STMS" },
          { text: "VA01" },
          { text: "SM37" },
        ],
      },
    ],
  },

  // ── 13. Table Data Browsing (SE16N) ──
  {
    slug: "sap-table-data-se16n",
    title: "Browsing Table Data (SE16N)",
    order: 13,
    minutes: 8,
    importance: "MEDIUM",
    story: `A manager asks Dev, "Can you quickly check how many materials we have of type FERT?" Dev doesn't know a report for it — but his mentor says, "Just look in the table with SE16N."

SE16N is the Swiss-army knife for peeking directly at SAP data. It won't change anything — it just lets you look — and it's one of the most-used tools in daily SAP life.`,
    content: `## From Dictionary to Actual Data

SE11 shows how a table is *defined*. **SE16N** (the Data Browser) shows the *actual rows* stored inside it — the real records.

Think of SE11 as the **blueprint** and SE16N as **walking into the finished building** to look around.

## Using SE16N

1. Enter the **table name** (e.g. \`MARA\` for materials).
2. Add **selection criteria** to filter (e.g. material type = FERT).
3. Execute — SAP lists the matching rows.

| Feature | What it does |
|---------|--------------|
| Selection fields | Filter which rows you see |
| Number of entries | Count rows without listing them |
| Layout / columns | Choose which fields to display |
| Export | Send results to a spreadsheet |

## SE16N vs SE16 vs SE11

| T-code | Purpose |
|--------|---------|
| **SE11** | Define/inspect the table structure |
| **SE16 / SE16N** | View the data (rows) in a table |

SE16N is the newer, friendlier data browser. It's for **viewing** — not a place to edit production data.

## A Word on Safety

SE16N is mainly a **read** tool. Some systems allow edit modes, but changing table data directly bypasses SAP's business logic and is dangerous. As a beginner: **use it to look, not to change.**

## Why This Matters

When someone says "check the table," they usually mean SE16N. Being able to find a record, count entries, and confirm what SAP actually stored is a daily, practical skill — and a fast way to answer questions without waiting for a custom report.`,
    keyTitle: "SE16N Lets You Look Directly at Table Rows",
    keyBody: `- **SE16N** (Data Browser) shows the actual records stored in a table; **SE11** only shows its structure.
- Enter a table name, add filters, and execute to see or count matching rows; results can be exported.
- Treat it as a **read** tool — never edit production table data directly, as it bypasses business logic.`,
    flowTitle: "Looking Up Data with SE16N",
    nodes: [
      { id: "n1", label: "⌨️ Open SE16N" },
      { id: "n2", label: "🗄️ Enter table name (e.g. MARA)" },
      { id: "n3", label: "🔎 Add selection filters" },
      { id: "n4", label: "📋 Execute — view/count rows" },
      { id: "n5", label: "📤 Export to spreadsheet (optional)" },
    ],
    details: [
      { nodeId: "n1", title: "Open SE16N", description: "The General Table Display / Data Browser. It opens a screen asking which table you want to look at.", tCode: "SE16N", tips: "SE16 is the older version; SE16N is friendlier and more common." },
      { nodeId: "n2", title: "Enter Table", description: "Type the table's technical name, such as MARA (materials) or KNA1 (customers).", tCode: "SE16N", tips: "Not sure of the table? Find it via SE11 or F1 → technical info on a field." },
      { nodeId: "n3", title: "Add Filters", description: "Fill selection fields to narrow results — e.g. material type = FERT — so you don't pull millions of rows.", tCode: "SE16N", tips: "Use 'Number of Entries' to count matches before listing them." },
      { nodeId: "n4", title: "Execute", description: "SAP lists the matching records. You can rearrange and choose columns via the layout.", tCode: "SE16N", tips: "Sort and filter within the result list to zero in on what you need." },
      { nodeId: "n5", title: "Export", description: "Results can be exported to Excel for sharing or further analysis.", tCode: "SE16N", tips: "Great for quick data checks without building a formal report." },
    ],
    quizTitle: "Browsing Table Data — Check Your Understanding",
    questions: [
      {
        question: "What does SE16N let you do?",
        explanation: "SE16N (the Data Browser) displays the actual rows stored in a table, with filtering and export — primarily for viewing data.",
        options: [
          { text: "View the actual records stored in a table", correct: true },
          { text: "Write ABAP programs" },
          { text: "Release transport requests" },
          { text: "Create new users" },
        ],
      },
      {
        question: "What's the difference between SE11 and SE16N?",
        explanation: "SE11 defines/inspects a table's structure (the blueprint); SE16N shows the actual data (the rows) inside it.",
        options: [
          { text: "SE11 shows the table's structure; SE16N shows its data", correct: true },
          { text: "They are the same transaction" },
          { text: "SE11 is for users; SE16N is for vendors" },
          { text: "SE16N deletes tables" },
        ],
      },
      {
        question: "What's the safe way for a beginner to use SE16N?",
        explanation: "SE16N should be treated as a read/view tool. Editing table data directly bypasses SAP's business logic and can corrupt data.",
        options: [
          { text: "Use it to view and count data, not to edit it directly", correct: true },
          { text: "Use it to edit production records whenever convenient" },
          { text: "Use it to log in to other systems" },
          { text: "Use it to grant authorizations" },
        ],
      },
    ],
  },

  // ── 14. Background Jobs & Variants ──
  {
    slug: "sap-background-jobs-variants",
    title: "Background Jobs & Variants",
    order: 14,
    minutes: 8,
    importance: "MEDIUM",
    story: `Every night at 2 AM, thousands of invoices are printed and payment files generated in SAP — with nobody sitting at a screen. How? Background jobs.

Karan learns that instead of running a huge report and waiting (and tying up his session), he can schedule it to run on the server, on its own. This is how real SAP work gets done at scale.`,
    content: `## Foreground vs Background

- **Foreground**: you run something and wait while it processes — fine for small tasks.
- **Background**: SAP runs the work on the **server**, without holding your screen — essential for large or scheduled jobs.

Think of foreground as **cooking while you watch the pot**, and background as **setting a timer and walking away**.

## What Is a Background Job?

A **background job** is a scheduled task that runs a program automatically — now, later, or on a repeating schedule (nightly, weekly).

| T-code | Use |
|--------|-----|
| **SM36** | Define/schedule a job |
| **SM37** | Monitor jobs (status, logs, spool) |

A job has a **start condition** (time, event, or periodic) and one or more **steps** (the programs it runs).

## Variants — Saved Input

Most reports need input (dates, company code, etc.). A **variant** is a *saved set of those inputs* so a scheduled job knows what values to use — no human to type them at 2 AM.

Think of a variant as a **saved form** you reuse instead of filling it in every time.

## Job Statuses

| Status | Meaning |
|--------|---------|
| Scheduled / Released | Waiting to run |
| Active | Running now |
| Finished | Completed successfully |
| Cancelled | Failed — check the job log |

## Why This Matters

Payroll runs, invoice printing, payment programs, data loads — the heavy lifting of SAP happens as background jobs, often overnight. Knowing **SM37** to check whether last night's job finished (or why it failed) is a routine, valuable skill.`,
    keyTitle: "Background Jobs Run Work Automatically on the Server",
    keyBody: `- **Background jobs** run programs on the server without tying up your screen — ideal for big or scheduled tasks.
- Schedule in **SM36**, monitor in **SM37** (status, logs, output).
- A **variant** is a saved set of report inputs so scheduled jobs run with the right values, unattended.`,
    flowTitle: "Scheduling & Monitoring a Job",
    nodes: [
      { id: "n1", label: "📝 Create a variant (saved inputs)" },
      { id: "n2", label: "🗓️ Schedule the job (SM36)" },
      { id: "n3", label: "⏰ Start condition: time / periodic" },
      { id: "n4", label: "⚙️ Job runs on the server" },
      { id: "n5", label: "📊 Check status & logs (SM37)" },
    ],
    details: [
      { nodeId: "n1", title: "Create a Variant", description: "Save the report's input values (dates, company code, etc.) as a variant so the job can run with them automatically.", tCode: "SE38 / report screen", tips: "Name variants clearly — e.g. NIGHTLY_INVOICES — so their purpose is obvious." },
      { nodeId: "n2", title: "Schedule the Job", description: "In SM36 you define the job: give it a name, add a step (program + variant), and set when it runs.", tCode: "SM36", tips: "Use a descriptive job name; you'll search for it later in SM37." },
      { nodeId: "n3", title: "Start Condition", description: "Choose immediate, a specific date/time, after an event, or periodic (daily/weekly).", tCode: "SM36", tips: "Periodic jobs are how nightly and month-end processing runs." },
      { nodeId: "n4", title: "Job Runs", description: "SAP executes the program on the application server in the background — no user session needed.", tCode: "N/A", tips: "Because it runs server-side, you can log off and it still completes." },
      { nodeId: "n5", title: "Monitor in SM37", description: "SM37 lists jobs with their status and logs. Open a finished job to see its output (spool) or a cancelled job's error.", tCode: "SM37", tips: "First stop each morning: SM37 to confirm overnight jobs finished." },
    ],
    quizTitle: "Background Jobs & Variants — Check Your Understanding",
    questions: [
      {
        question: "Why run a large report as a background job instead of in the foreground?",
        explanation: "Background jobs run on the server without tying up your screen, and can be scheduled — ideal for large or overnight processing.",
        options: [
          { text: "It runs on the server without tying up your session and can be scheduled", correct: true },
          { text: "Background jobs are the only way to view data" },
          { text: "Foreground processing is not allowed in SAP" },
          { text: "It automatically fixes errors in the data" },
        ],
      },
      {
        question: "What is a variant?",
        explanation: "A variant is a saved set of a report's input values, so a scheduled job can run with the correct parameters without anyone typing them.",
        options: [
          { text: "A saved set of input values for a report/program", correct: true },
          { text: "A type of user account" },
          { text: "A transport request" },
          { text: "A database table" },
        ],
      },
      {
        question: "Which transaction do you use to monitor jobs and see why one failed?",
        explanation: "SM37 lists jobs with their statuses and logs; SM36 is for scheduling them.",
        options: [
          { text: "SM37", correct: true },
          { text: "SM36 only" },
          { text: "SU01" },
          { text: "SE11" },
        ],
      },
    ],
  },

  // ── 15. Master vs Transactional Data ──
  {
    slug: "sap-master-vs-transactional-data",
    title: "Master vs Transactional Data",
    order: 15,
    minutes: 8,
    importance: "MEDIUM",
    story: `Two new analysts argue: one says a "customer" is data, the other says a "sales order" is data. They're both right — but they're describing two very different *kinds* of data.

Getting this distinction clear early makes every SAP module easier to understand, because almost everything is either master data or a transaction that uses it.`,
    content: `## Two Kinds of Data

SAP data mostly falls into two buckets:

| Type | What it is | Changes how often? |
|------|-----------|--------------------|
| **Master data** | The relatively stable "things" you do business with | Rarely |
| **Transactional data** | The events/documents that happen using master data | Constantly |

## Master Data — the "Nouns"

Master data describes the core objects that many processes reuse:

- **Customer** (KNA1), **Vendor** (LFA1), **Material** (MARA), **G/L Account**, **Employee**.
- Created once, used by thousands of transactions.

Think of master data as **contacts saved in your phone** — you save them once and reuse them for every call.

## Transactional Data — the "Verbs"

Transactional data records **business events**, and it *references* master data:

- **Sales order**, **Purchase order**, **Goods receipt**, **Invoice**, **Payment**.
- Each transaction points to master data (e.g. a sales order references a customer + materials).

These are like **individual calls or messages** — each one uses your saved contacts.

## Why the Split Matters

Because master data is reused, fixing it once fixes it everywhere. A wrong address in the **customer master** would misprint on *every* invoice — so master data quality is critical.

| If you change... | Effect |
|------------------|--------|
| Master data (once) | Applies to all future transactions |
| One transaction | Affects only that document |

## Why This Matters

Almost every SAP topic is "maintain some master data, then post transactions against it." Recognizing which is which helps you predict where to look, what to fix, and how modules connect — a mental model you'll use every single day.`,
    keyTitle: "Master Data = Stable 'Things'; Transactions = Events Using Them",
    keyBody: `- **Master data** (customers, vendors, materials, accounts) is created once and reused — it changes rarely.
- **Transactional data** (orders, invoices, payments) records events and always references master data.
- Fixing master data once corrects every future transaction — which is why its quality matters so much.`,
    flowTitle: "How Transactions Use Master Data",
    nodes: [
      { id: "n1", label: "👤 Customer master (created once)" },
      { id: "n2", label: "📦 Material master (created once)" },
      { id: "n3", label: "🧾 Sales order references both" },
      { id: "n4", label: "🚚 Delivery & 💰 Invoice follow" },
    ],
    details: [
      { nodeId: "n1", title: "Customer Master", description: "Stable data about who you sell to — name, address, payment terms. Stored in KNA1 and reused by every sales document.", tCode: "XD01 / BP", tips: "Fix an address here once and all future invoices are correct." },
      { nodeId: "n2", title: "Material Master", description: "Stable data about what you sell/stock — description, unit, type. Stored in MARA and reused across modules.", tCode: "MM01", tips: "The material master is shared by MM, SD, PP and more — truly central master data." },
      { nodeId: "n3", title: "Sales Order (Transaction)", description: "A business event that references the customer and materials. It's transactional — created constantly, one per order.", tCode: "VA01", tips: "The order 'borrows' master data; it doesn't store its own copy of the customer." },
      { nodeId: "n4", title: "Follow-on Documents", description: "Delivery, goods issue, and invoice are further transactional documents in the same flow, all tied back to the master data.", tCode: "VL01N / VF01", tips: "A chain of transactions, all pointing at the same master records." },
    ],
    quizTitle: "Master vs Transactional Data — Check Your Understanding",
    questions: [
      {
        question: "Which of these is master data?",
        explanation: "A customer is master data — a stable object created once and reused. A sales order, goods receipt, and payment are transactional events.",
        options: [
          { text: "Customer", correct: true },
          { text: "Sales order" },
          { text: "Goods receipt" },
          { text: "Payment" },
        ],
      },
      {
        question: "Why is master data quality so important?",
        explanation: "Because master data is reused by many transactions, an error (like a wrong address) propagates to every future document that uses it.",
        options: [
          { text: "It's reused by many transactions, so one error affects them all", correct: true },
          { text: "It is deleted after every transaction" },
          { text: "It has no effect on transactions" },
          { text: "It only matters for reporting" },
        ],
      },
      {
        question: "A sales order (VA01) is an example of what?",
        explanation: "A sales order is transactional data — a business event that references master data (customer, materials).",
        options: [
          { text: "Transactional data that references master data", correct: true },
          { text: "Master data that never changes" },
          { text: "A user authorization" },
          { text: "A transport request" },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Seeding SAP Foundation extra lessons (orders 9–15)...");
  const foundationModule = await prisma.module.findUnique({ where: { slug: "foundation" } });
  if (!foundationModule) throw new Error("Foundation module not found — run the main seed first.");

  for (const L of LESSONS) {
    await createLesson(foundationModule.id, L);
  }

  const total = await prisma.lesson.count({ where: { moduleId: foundationModule.id, isPublished: true } });
  console.log(`✅ Done. SAP Foundation now has ${total} published lessons.`);
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
// ─── END FILE ───
