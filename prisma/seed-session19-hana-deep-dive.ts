// ─── FILE: prisma/seed-session19-hana-deep-dive.ts ───
// Session 19 — SAP HANA deep-dive (9 new lessons, bringing module total to 15).
// Idempotent: re-running upserts by slug.
//
// Run with:  npx tsx prisma/seed-session19-hana-deep-dive.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Diff = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type Imp = "HIGH" | "MEDIUM" | "LOW";

const PALETTE = ["#0891B2", "#2563EB", "#7C3AED", "#D97706", "#059669", "#64748B", "#DC2626"];
function node(id: string, x: number, y: number, label: string, color: string, bold = false) {
  return {
    id,
    type: "default",
    position: { x, y },
    data: { label },
    style: {
      background: color,
      color: "#fff",
      borderRadius: "8px",
      padding: "12px",
      width: 165,
      fontSize: "12px",
      textAlign: "center" as const,
      fontWeight: bold ? "bold" : "normal",
    },
  };
}
function edge(source: string, target: string) {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    animated: true,
    style: { stroke: "#334155", strokeWidth: 1.5 },
  };
}

interface NodeDetail { nodeId: string; title: string; description: string; tCode?: string; tips?: string; }
interface QA { q: string; e: string; opts: [string, boolean][]; }
interface LessonInput {
  moduleId: string;
  slug: string;
  title: string;
  order: number;
  minutes: number;
  difficulty: Diff;
  xp: number;
  importance?: Imp;
  story: string;
  content: string;
  keyTitle: string;
  keyBody: string;
  flowchart?: { title: string; nodes: object[]; edges: object[]; details: NodeDetail[] };
  questions: QA[];
}

async function makeLesson(o: LessonInput) {
  const lesson = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: o.moduleId, slug: o.slug } },
    update: {},
    create: {
      moduleId: o.moduleId,
      title: o.title,
      slug: o.slug,
      order: o.order,
      isPublished: true,
      estimatedMinutes: o.minutes,
      difficulty: o.difficulty,
      xpReward: o.xp,
      interviewImportance: o.importance ?? "MEDIUM",
      story: o.story,
      content: o.content,
      keyConceptTitle: o.keyTitle,
      keyConceptBody: o.keyBody,
    },
  });

  if (o.flowchart) {
    const fc = await prisma.flowchart.upsert({
      where: { lessonId: lesson.id },
      update: {},
      create: {
        lessonId: lesson.id,
        title: o.flowchart.title,
        nodes: o.flowchart.nodes,
        edges: o.flowchart.edges,
      },
    });
    if (o.flowchart.details.length) {
      await prisma.flowchartNodeDetail.createMany({
        skipDuplicates: true,
        data: o.flowchart.details.map((d) => ({ flowchartId: fc.id, ...d })),
      });
    }
  }

  await prisma.quiz.upsert({
    where: { lessonId: lesson.id },
    update: {},
    create: {
      lessonId: lesson.id,
      title: `${o.title} Quiz`,
      questions: {
        create: o.questions.map((q, i) => ({
          order: i + 1,
          question: q.q,
          explanation: q.e,
          options: { create: q.opts.map(([text, isCorrect]) => ({ text, isCorrect })) },
        })),
      },
    },
  });

  console.log(`  ✓ ${o.title}`);
  return lesson;
}

async function main() {
  console.log("Session 19 — SAP HANA deep-dive (lessons 7–15)…");

  const hana = await prisma.module.findUnique({ where: { slug: "hana" } });
  if (!hana) throw new Error("HANA module not found — run seed-session18 first.");

  // ════════════════════════════════════════════════
  // LESSON 7 — HANA Architecture: Services & Layers
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-architecture-services",
    title: "HANA Architecture: Services & Layers",
    order: 7,
    minutes: 12,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story: `An admin is called to fix a HANA system that's throwing errors. The error log says "Index Server not responding." She knows HANA isn't one big process — it's several specialized services, each responsible for one thing. Knowing which service does what tells her exactly where to look.`,
    content: `## HANA is not one monolith

SAP HANA runs as a set of **cooperating services** (OS processes). Each has a specific job. Together they form the HANA engine.

## The key services

| Service | What it does |
|---|---|
| **Index Server** | The heart — handles SQL, manages in-memory tables, query execution, transactions |
| **Name Server** | Knows the topology: which hosts exist, which tenant runs where (in MDC systems) |
| **Statistics Server** | Collects and stores HANA's own health metrics and alert history |
| **XS Engine / XSA** | Hosts HANA-native web apps (classic XS or the newer XS Advanced runtime) |
| **Preprocessor** | Text and search pre-processing for full-text search features |
| **Compile Server** | Compiles SQLScript procedures so the Index Server can execute them |

In a **single-host** system, all these run on one machine. In a **scale-out** cluster, multiple hosts share the load — worker nodes run Index Servers; the coordinator routes queries.

## The two storage layers

Even though HANA is "in-memory," it has **two persistence layers** underneath:

1. **In-memory store (main + delta)** — the live working data in RAM. Column store has a *main* (read-optimized, compressed) and a *delta* (write buffer). The **delta merge** periodically compresses new writes into main.
2. **Persistence layer (disk)** — data pages and redo log written to disk for durability. On restart, HANA replays the log to recover the in-memory state.

## The delta merge

When rows are inserted/updated they go into the **delta store** first (row-oriented, fast writes). Periodically a **delta merge** integrates them into the compressed main store. This is automatic but you can trigger it manually and monitor it.

## Why this matters

Understanding services tells you where to check logs when something fails. Understanding main/delta explains why HANA sometimes needs a "delta merge" tuning action, and why a fresh restart rebuilds state from disk into memory.`,
    keyTitle: "Index Server + Name Server + Persistence = HANA Architecture",
    keyBody: `HANA runs as **separate services**: the **Index Server** handles SQL and in-memory tables; the **Name Server** knows the topology; the **Statistics Server** tracks health. Column store data lives in a **main store** (compressed, read-optimized) and a **delta store** (write buffer) — the **delta merge** periodically integrates writes. All data is also written to disk for durability and replayed on restart.`,
    flowchart: {
      title: "Inside a HANA System",
      nodes: [
        node("client", 360, 20, "🖥️ Client\nSQL / JDBC / OData", PALETTE[5], true),
        node("idx", 360, 140, "🧠 Index Server\nSQL, Memory, Txns", PALETTE[0], true),
        node("name", 80, 260, "📋 Name Server\nTopology & Tenants", PALETTE[1]),
        node("stats", 280, 260, "📊 Statistics Server\nHealth & Alerts", PALETTE[3]),
        node("compile", 480, 260, "⚙️ Compile Server\nSQLScript compile", PALETTE[2]),
        node("persist", 360, 390, "💾 Persistence Layer\nDisk: pages + redo log", PALETTE[4], true),
      ],
      edges: [
        edge("client", "idx"),
        edge("idx", "name"),
        edge("idx", "stats"),
        edge("idx", "compile"),
        edge("idx", "persist"),
      ],
      details: [
        { nodeId: "client", title: "Clients connect via SQL/JDBC", description: "Applications, HANA Studio, SAP systems, and reporting tools all connect to HANA through SQL interfaces — JDBC, ODBC, or the HANA Database Client.", tCode: "HANA Cockpit / Studio", tips: "All connections ultimately reach the Index Server." },
        { nodeId: "idx", title: "Index Server — the core", description: "Manages the in-memory column and row store, processes SQL queries, handles transactions and locking, runs SQLScript. The most critical service.", tCode: "indexserver", tips: "If the Index Server is down, the database is down. Check its trace logs first." },
        { nodeId: "name", title: "Name Server", description: "Maintains the topology — which hosts are in the system, which tenants exist (MDC), and where each service runs. Acts as the directory.", tCode: "nameserver", tips: "In scale-out, the Name Server also coordinates routing." },
        { nodeId: "stats", title: "Statistics Server", description: "Continuously collects internal HANA metrics and stores alert history. Powers the 'Alerts' view in HANA Cockpit.", tCode: "statisticsserver", tips: "Check the Statistics Server alerts view first when diagnosing performance issues." },
        { nodeId: "compile", title: "Compile Server", description: "Compiles SQLScript procedures into an executable format. Separating compilation means the Index Server isn't blocked waiting for compilation.", tCode: "compileserver", tips: "Errors in procedure compilation surface here." },
        { nodeId: "persist", title: "Persistence layer", description: "HANA writes data pages and a redo log to disk continuously. On restart, it replays the redo log to rebuild the in-memory state — providing durability without sacrificing speed.", tCode: "Data volumes & log volumes", tips: "Data and log volumes should be on separate fast storage (SSD/NVMe)." },
      ],
    },
    questions: [
      { q: "Which HANA service is responsible for SQL execution and managing in-memory tables?", e: "The Index Server is the core of HANA — it handles all SQL processing, manages the in-memory column/row store, and controls transactions.", opts: [["Index Server", true], ["Name Server", false], ["Statistics Server", false], ["Compile Server", false]] },
      { q: "What is the purpose of the HANA delta merge?", e: "New writes go into the fast delta store (row-oriented buffer). The delta merge periodically integrates those writes into the main store, which is compressed and read-optimized.", opts: [["Integrating new writes from the delta store into the compressed main store", true], ["Merging two HANA systems into one", false], ["Deleting old data from disk", false], ["Synchronizing passwords", false]] },
      { q: "How does HANA ensure data is not lost if the server restarts?", e: "HANA continuously writes data pages and a redo log to disk. On restart, it replays the redo log to rebuild the in-memory state, providing durability.", opts: [["It writes data pages and a redo log to disk and replays on restart", true], ["It emails a backup every hour", false], ["Data is only in RAM and is lost on restart", false], ["It copies data to another country", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // LESSON 8 — HANA Multi-Tenancy (MDC)
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-multi-tenancy-mdc",
    title: "HANA Multi-Tenancy (MDC)",
    order: 8,
    minutes: 10,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "HIGH",
    story: `A company runs three SAP systems — development, quality, and production — and wants each on HANA but doesn't want to pay for three separate servers. The HANA architect says: "One HANA installation, three isolated tenant databases." That's **Multi-tenant Database Containers (MDC)**.`,
    content: `## One HANA, many databases

**MDC** (Multi-tenant Database Containers) lets a single HANA installation host **multiple completely isolated databases** called **tenant databases**.

Each tenant has its own:
- Data and schema (completely isolated)
- Users and authorizations
- Backup and recovery schedule
- Configuration settings

From the outside, each tenant looks like its own independent HANA database.

## System DB vs Tenant DB

Every MDC installation has exactly **one System DB** and one or more **Tenant DBs**:

| | System DB | Tenant DB |
|---|---|---|
| Purpose | Administers the whole MDC landscape | Runs actual application data |
| Who uses it | HANA admins only | Application users (SAP, custom apps) |
| Contains data? | Only system/admin metadata | Yes — application data |
| Can be dropped? | No | Yes |

**Rule**: application users never log into the System DB. Admins use it to create, start, stop, and monitor tenants.

## Why MDC matters

Before MDC, running dev/QA/prod on one server meant sharing schemas — messy and risky. MDC gives **true isolation**: a runaway query in one tenant cannot crash another. You can also snapshot and restore individual tenants without touching others.

## Connecting to a tenant

Each tenant listens on its **own port**:
- System DB: port 3**X**13 (where X = instance number, e.g. 30013)
- Tenant DB: port 3**X**15 onwards (auto-assigned or configurable)

Connection strings point to the specific tenant port. SAP systems store the tenant connection in their database layer configuration.

## MDC and licensing

HANA Cloud always runs MDC. On-premise HANA has used MDC as the standard since HANA 2.0. Single-container (one DB per installation) is legacy and no longer recommended.`,
    keyTitle: "MDC = One HANA, Multiple Isolated Tenant Databases",
    keyBody: `**MDC** lets one HANA installation host many **tenant databases**, each fully isolated (data, users, backups). The **System DB** is admin-only — it manages tenants but holds no application data. **Tenant DBs** hold the actual application data (dev, QA, prod, etc.). Each tenant connects on its own port. MDC is the standard since HANA 2.0 and is mandatory in HANA Cloud.`,
    flowchart: {
      title: "MDC: System DB + Tenant DBs",
      nodes: [
        node("hana", 360, 20, "🗄️ HANA Installation\n(one server / cloud)", PALETTE[0], true),
        node("sys", 360, 140, "🔧 System DB\nAdmin only", PALETTE[3], true),
        node("dev", 80, 280, "💻 Tenant: DEV\nDevelopment", PALETTE[1]),
        node("qas", 360, 280, "🧪 Tenant: QAS\nQuality", PALETTE[2]),
        node("prd", 640, 280, "🚀 Tenant: PRD\nProduction", PALETTE[4], true),
      ],
      edges: [
        edge("hana", "sys"),
        edge("sys", "dev"),
        edge("sys", "qas"),
        edge("sys", "prd"),
      ],
      details: [
        { nodeId: "hana", title: "One HANA installation", description: "A single HANA system (hardware or cloud instance) hosts all tenant databases, sharing memory and CPU but isolating data.", tCode: "HANA Cockpit → System Overview", tips: "Resources (RAM, CPU) are shared but data is fully isolated between tenants." },
        { nodeId: "sys", title: "System DB — admin control plane", description: "The System DB is the administrative hub: create/drop/start/stop tenants, set global config, manage backups. Application data never lives here.", tCode: "hdbsql -n host:30013", tips: "Never give application users access to the System DB." },
        { nodeId: "dev", title: "DEV tenant", description: "Isolated development database. Developers can experiment freely without risking QA or production data.", tCode: "port 30015 (example)", tips: "Transport routes run DEV → QAS → PRD, same as in ABAP." },
        { nodeId: "qas", title: "QAS tenant", description: "Quality Assurance tenant for testing. Gets its own backup schedule and can be refreshed from PRD for realistic test data.", tCode: "port 30017 (example)", tips: "Tenant copy/refresh lets you clone PRD into QAS for testing." },
        { nodeId: "prd", title: "PRD tenant", description: "Production tenant with the live business data. Full isolation means a crash or runaway query in DEV cannot impact PRD.", tCode: "port 30041 (example)", tips: "PRD gets its own dedicated backup and monitoring alert thresholds." },
      ],
    },
    questions: [
      { q: "In an MDC system, what is the role of the System DB?", e: "The System DB is admin-only — it manages tenants (create, start, stop, configure) but holds no application data. Application users log into tenant databases, not the System DB.", opts: [["Admin control plane for managing tenants — no application data", true], ["It stores all production business data", false], ["It is the development tenant", false], ["It handles internet connectivity", false]] },
      { q: "What key advantage does MDC provide over running all systems in one database schema?", e: "MDC gives true isolation — each tenant has its own data, users, and backups. A problem in one tenant cannot affect another.", opts: [["True isolation: data, users, and backups are completely separate per tenant", true], ["Cheaper licensing per tenant", false], ["Faster internet speed", false], ["Shared passwords across all systems", false]] },
      { q: "Which statement about HANA Cloud and MDC is correct?", e: "HANA Cloud always runs MDC — it is the mandatory architecture. On-premise HANA has used MDC as the standard since HANA 2.0.", opts: [["HANA Cloud always runs MDC — it is mandatory", true], ["HANA Cloud uses single-container only", false], ["MDC is only for on-premise HANA", false], ["MDC was removed in HANA 2.0", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // LESSON 9 — HANA Table Partitioning
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-table-partitioning",
    title: "HANA Table Partitioning",
    order: 9,
    minutes: 10,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "MEDIUM",
    story: `A billing table has grown to 2 billion rows. Queries that filter by year are scanning the entire table. The DBA suggests partitioning. After splitting the table by year, the same queries touch only the relevant partition — and finish 10× faster. Partitioning is how HANA handles tables that grow beyond what a single chunk can efficiently serve.`,
    content: `## What is partitioning?

**Partitioning** splits one large table into smaller, independent **partitions** stored separately. HANA can skip partitions that don't match a query's filter — this is called **partition pruning** and is the key performance benefit.

## The three main partition types

### 1. Range partitioning
Split rows based on a **value range** of one column (most common for date/time fields):
\`\`\`sql
PARTITION BY RANGE (YEAR)
  PARTITION 2022 VALUES = '2022',
  PARTITION 2023 VALUES = '2023',
  PARTITION 2024 VALUES = '2024',
  PARTITION OTHERS
\`\`\`
A query \`WHERE YEAR = 2023\` reads **only** the 2023 partition. Other partitions are skipped entirely.

### 2. Hash partitioning
Distribute rows evenly across N partitions by **hashing a key column** (e.g. customer ID):
\`\`\`sql
PARTITION BY HASH (CUSTOMER_ID) PARTITIONS 8
\`\`\`
No pruning benefit, but helps in **scale-out** systems by spreading load across multiple HANA hosts.

### 3. Round-Robin partitioning
Rows are distributed evenly in a **rotating sequence** across partitions:
\`\`\`sql
PARTITION BY ROUNDROBIN PARTITIONS 4
\`\`\`
Purely for even data distribution — no pruning possible.

## Combining types (Multi-Level)

You can combine: e.g. **Range by year → Hash by customer** within each year partition. This gives both pruning and load distribution.

## When to partition

- Table exceeds **~1 billion rows** or **~2 billion cells** (HANA's column store limit per partition)
- Query patterns consistently filter on a date/range column → **Range**
- Scale-out and need to spread load → **Hash**
- Insert-heavy with no selective filter → **Round-Robin**

## Important notes

- Partitioning is **transparent to the application** — SQL stays the same
- Each partition has its own delta store and main store
- Delta merge happens per partition independently`,
    keyTitle: "Partitioning Splits Large Tables for Pruning & Scale-Out",
    keyBody: `**Range partitioning** splits by value ranges (e.g. year) — queries filter only the matching partition (**partition pruning**). **Hash partitioning** distributes rows evenly by hashing a key — spreads load in scale-out but no pruning. **Round-Robin** distributes evenly in rotation. Partition when a table nears HANA's ~2B cell limit or query filters consistently hit a range column. The SQL interface is unchanged.`,
    flowchart: {
      title: "Partition Types & When to Use Them",
      nodes: [
        node("big", 360, 20, "📦 Large Table\n> 1B rows", PALETTE[5], true),
        node("q", 360, 140, "❓ Query filters by\ndate / range?", PALETTE[3], true),
        node("range", 80, 280, "📅 Range Partition\nby date/value", PALETTE[0], true),
        node("hash", 360, 280, "🔀 Hash Partition\nby key column", PALETTE[1]),
        node("rr", 640, 280, "🔁 Round-Robin\ninsert spread", PALETTE[2]),
        node("prune", 80, 400, "✂️ Partition Pruning\nSkip irrelevant parts", PALETTE[4], true),
      ],
      edges: [
        edge("big", "q"),
        edge("q", "range"),
        edge("q", "hash"),
        edge("q", "rr"),
        edge("range", "prune"),
      ],
      details: [
        { nodeId: "big", title: "When to consider partitioning", description: "HANA column store has a ~2 billion cell limit per partition. Large tables that grow toward this limit, or that have hot-spot query patterns, are candidates.", tCode: "ALTER TABLE ... PARTITION BY", tips: "Check row counts with SELECT COUNT(*) before and monitor M_CS_TABLES." },
        { nodeId: "q", title: "Choose based on access pattern", description: "Range works when queries have selective filters on a column (date, fiscal year). Hash works for scale-out distribution. Round-Robin for write-heavy tables with no selective filter.", tips: "The wrong partition type gives no benefit — match type to workload." },
        { nodeId: "range", title: "Range partitioning", description: "Splits by value ranges on one column (typically a date or year). Most powerful for time-series data where queries filter by period.", tCode: "PARTITION BY RANGE (YEAR)", tips: "Always add a PARTITION OTHERS to catch values outside defined ranges." },
        { nodeId: "hash", title: "Hash partitioning", description: "Distributes rows by hashing a key column into N buckets. Useful in scale-out to spread data and work across hosts. No pruning — all partitions may be read.", tCode: "PARTITION BY HASH (KEY) PARTITIONS N", tips: "Choose N as a multiple of your scale-out host count." },
        { nodeId: "rr", title: "Round-Robin partitioning", description: "Rows are assigned to partitions in rotation — purely for even distribution. No selective filtering possible.", tCode: "PARTITION BY ROUNDROBIN PARTITIONS N", tips: "Use when insert speed and even distribution matter more than query filtering." },
        { nodeId: "prune", title: "Partition pruning", description: "When a WHERE clause matches the partition key, HANA reads only the matching partitions. This is the main performance benefit of range partitioning.", tips: "Verify pruning is working by checking the query execution plan — look for 'Partition Pruning' steps." },
      ],
    },
    questions: [
      { q: "What is 'partition pruning' in HANA?", e: "Partition pruning means HANA skips partitions that cannot contain rows matching the query's WHERE clause, reading only the relevant partitions instead of the full table.", opts: [["Skipping partitions that don't match the query filter", true], ["Deleting old partitions automatically", false], ["Merging all partitions into one", false], ["Compressing partition data to disk", false]] },
      { q: "Which partition type is best for a query that always filters by fiscal year?", e: "Range partitioning on the fiscal year column means a query filtering by year reads only that partition — all other years are skipped via partition pruning.", opts: [["Range partitioning by fiscal year", true], ["Round-Robin partitioning", false], ["Hash partitioning on customer ID", false], ["No partitioning needed", false]] },
      { q: "A table has 3 billion rows. What HANA limitation makes partitioning necessary?", e: "HANA's column store has a limit of approximately 2 billion cells per partition. Tables exceeding this must be partitioned so each partition stays within the limit.", opts: [["HANA column store has a ~2 billion cell limit per partition", true], ["HANA cannot store more than 10 rows", false], ["Partitioning is only for reporting tables", false], ["HANA requires partitioning for every table", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // LESSON 10 — HANA Security & Authorizations
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-security-authorizations",
    title: "HANA Security & Authorizations",
    order: 10,
    minutes: 12,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story: `A new developer joins and needs read access to the sales schema. The HANA admin doesn't give her the SYSTEM user password — that would be like handing over the master key. Instead, she creates a role with exactly the right object privileges and assigns it to the developer's personal user. That's HANA security: least privilege through roles.`,
    content: `## Authentication vs Authorization

- **Authentication** — *who are you?* (password, SSO, SAML, Kerberos, X.509 certificates)
- **Authorization** — *what can you do?* (privileges)

HANA separates both cleanly.

## The four privilege types

### 1. System Privileges
Control **administrative actions** — not tied to any specific object:
- \`BACKUP ADMIN\` — run backups
- \`CATALOG READ\` — read system views
- \`USER ADMIN\` — create/drop users
- \`MONITOR ADMIN\` — view performance metrics

### 2. Object Privileges
Control access to **specific database objects** (schemas, tables, views, procedures):
- \`SELECT ON SCHEMA sales\` — read all tables in a schema
- \`INSERT ON sales.orders\` — write to one table
- \`EXECUTE ON procedures.calculate_vat\` — call a procedure

### 3. Analytic Privileges
Unique to HANA — restrict **which rows** a user sees in a Calculation View, based on attribute values. Example: a regional manager sees only their region's data, even from the same view.

### 4. Package/Application Privileges
Control access to HANA XS/XSA objects (content packages, application functions).

## Roles: group and reuse privileges

Always assign privileges **through roles**, never directly to users:

\`\`\`sql
-- Create a role
CREATE ROLE SALES_ANALYST;

-- Grant privileges to the role
GRANT SELECT ON SCHEMA SALES TO SALES_ANALYST;
GRANT SELECT ON SCHEMA PRODUCTS TO SALES_ANALYST;

-- Assign role to user
GRANT SALES_ANALYST TO USER maya;
\`\`\`

When Maya changes teams, you revoke the role — one action, all privileges removed.

## The SYSTEM user — never use in production

HANA's built-in \`SYSTEM\` user has all privileges and cannot be audited properly. Best practice: create named admin users with only the privileges they need, and **lock the SYSTEM user** after initial setup.

## Auditing

HANA has a built-in **Audit Policy** engine:
\`\`\`sql
CREATE AUDIT POLICY log_select_sales
  AUDITING SUCCESSFUL SELECT ON SCHEMA SALES
  LEVEL INFO;
ALTER AUDIT POLICY log_select_sales ENABLE;
\`\`\`
Audit logs go to the \`AUDIT_LOG\` system view — critical for compliance (SOC 2, GDPR).`,
    keyTitle: "Four Privilege Types + Roles = HANA Least-Privilege Security",
    keyBody: `HANA has four privilege types: **System** (admin actions), **Object** (table/schema/procedure access), **Analytic** (row-level filter in Calculation Views), **Package** (XS app content). Always grant via **roles**, never directly to users — roles make bulk assignment and revocation clean. Never use the **SYSTEM user** in production. Use **Audit Policies** to log sensitive data access for compliance.`,
    flowchart: {
      title: "HANA Security Model",
      nodes: [
        node("user", 360, 20, "👤 DB User\n(named account)", PALETTE[5], true),
        node("role", 360, 140, "🎭 Role\n(bundle of privileges)", PALETTE[0], true),
        node("sys", 60, 280, "🔧 System\nPrivileges\n(admin actions)", PALETTE[3]),
        node("obj", 240, 280, "📄 Object\nPrivileges\n(tables, views)", PALETTE[1]),
        node("analytic", 440, 280, "🔍 Analytic\nPrivileges\n(row-level filter)", PALETTE[2]),
        node("pkg", 640, 280, "📦 Package\nPrivileges\n(XS apps)", PALETTE[4]),
      ],
      edges: [
        edge("user", "role"),
        edge("role", "sys"),
        edge("role", "obj"),
        edge("role", "analytic"),
        edge("role", "pkg"),
      ],
      details: [
        { nodeId: "user", title: "Named database users", description: "Each person or application gets their own named user with a personal credential. Never share passwords or use the SYSTEM user for regular work.", tCode: "CREATE USER / ALTER USER", tips: "Lock SYSTEM after initial setup: ALTER USER SYSTEM DEACTIVATE USER NOW." },
        { nodeId: "role", title: "Roles", description: "A role is a named bundle of privileges. Grant roles to users — when requirements change, update the role and all users pick up the change automatically.", tCode: "CREATE ROLE / GRANT ROLE TO USER", tips: "Build a role hierarchy: base roles → composite roles → user assignment." },
        { nodeId: "sys", title: "System privileges", description: "Admin-level actions not tied to specific objects: backup, user management, monitoring, catalog reads. Restrict these to admin roles only.", tCode: "GRANT BACKUP ADMIN TO ROLE", tips: "CATALOG READ is needed to query M_ system monitoring views." },
        { nodeId: "obj", title: "Object privileges", description: "Control access to specific schemas, tables, views, and procedures: SELECT, INSERT, UPDATE, DELETE, EXECUTE. Grant at schema level where possible.", tCode: "GRANT SELECT ON SCHEMA sales TO ROLE", tips: "Schema-level grants are easier to maintain than table-by-table grants." },
        { nodeId: "analytic", title: "Analytic privileges", description: "Row-level security for Calculation Views. Different users see different data from the same view based on attribute values (e.g. country, region).", tCode: "CREATE ANALYTIC PRIVILEGE", tips: "Used heavily in BW/4HANA and reporting scenarios for data-level access control." },
        { nodeId: "pkg", title: "Package privileges", description: "Control access to XS/XSA application packages and their content. Relevant when building HANA-native applications.", tCode: "GRANT APPLICATION PRIVILEGE", tips: "Less relevant in modern HANA Cloud / CAP development." },
      ],
    },
    questions: [
      { q: "What type of HANA privilege controls which rows a user can see in a Calculation View?", e: "Analytic Privileges provide row-level security for Calculation Views — different users see different subsets of data based on attribute filters (e.g. only their region).", opts: [["Analytic Privilege", true], ["System Privilege", false], ["Object Privilege", false], ["Package Privilege", false]] },
      { q: "Why should HANA privileges always be granted through roles rather than directly to users?", e: "Roles let you bundle related privileges and assign them to many users at once. When requirements change, you update the role and all users are affected — no need to touch each user individually.", opts: [["Roles bundle privileges for reuse and make bulk changes easy", true], ["Direct grants are not allowed in HANA", false], ["Roles are faster to create", false], ["Roles bypass authentication", false]] },
      { q: "What is the recommended action for the HANA SYSTEM user after initial setup?", e: "The SYSTEM user has all privileges and cannot be properly audited. Best practice is to create named admin users with appropriate privileges and lock the SYSTEM user.", opts: [["Lock it and use named admin users instead", true], ["Give it to all developers", false], ["Use it for all application connections", false], ["Change its password monthly but keep using it", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // LESSON 11 — HANA Data Provisioning (SLT & SDI)
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-data-provisioning",
    title: "HANA Data Provisioning: SLT & SDI",
    order: 11,
    minutes: 11,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "MEDIUM",
    story: `A company wants real-time reporting in HANA on their existing ECC system. But the data is in ECC — not HANA. They need a pipeline that continuously copies new and changed records to HANA without disrupting the live ECC system. This is the job of **data provisioning tools**.`,
    content: `## The challenge: getting data into HANA

HANA is the analytics engine, but the source data often lives elsewhere: SAP ECC, third-party databases, flat files, cloud APIs. You need a way to load that data — and ideally keep it in sync in **real time**.

## Tool 1: SAP Landscape Transformation (SLT)

**SLT** is the go-to tool for **real-time replication from SAP systems** (ECC, S/4HANA, BW) into HANA.

**How it works:**
1. SLT installs a small **trigger-based mechanism** on the source SAP system
2. Every INSERT, UPDATE, DELETE in the source is captured
3. SLT replicates those changes to the target HANA table in near-real-time
4. The source system keeps running normally — SLT overhead is minimal

**Key features:**
- Near-real-time (seconds of latency)
- Selective table replication (choose exactly which tables)
- Transformations possible during replication
- Works source → HANA or source → S/4HANA

**Transaction:** \`LTRC\` (SLT Cockpit) in the source SAP system

## Tool 2: SAP HANA Smart Data Integration (SDI)

**SDI** is HANA's **universal connectivity framework** — it connects HANA to virtually any source (non-SAP databases, cloud apps, files) through **adapters**.

- **Data Provisioning Agent** — a lightweight agent installed near the source that hosts the adapters
- **Adapters** — connectors for Oracle, SQL Server, Hadoop, Salesforce, file systems, and more
- **Virtual Tables** — expose source data as if it were a HANA table (no copying — query on demand)
- **Remote Subscriptions** — real-time replication from source into HANA tables (copying)

## Choosing between them

| | SLT | SDI |
|---|---|---|
| Best for | SAP source → HANA | Non-SAP sources or cloud |
| Latency | Near-real-time | Near-real-time or on-demand |
| Setup | In SAP system (LTRC) | Agent + adapter on source side |
| Transformation | Basic | Rich (flowgraphs in HANA Studio/WebIDE) |

## HANA Cloud Data Lake

For very large historical datasets, **HANA Cloud Data Lake** (HCDL) stores cold data cheaply alongside HANA's hot in-memory data — accessed transparently.`,
    keyTitle: "SLT for SAP Sources, SDI for Everything Else",
    keyBody: `**SLT** (SAP Landscape Transformation) replicates tables from SAP systems (ECC, S/4) to HANA in near-real-time via trigger-based capture — configured in transaction **LTRC**. **SDI** (Smart Data Integration) connects HANA to non-SAP sources through **adapters** installed in a lightweight **Data Provisioning Agent** — supports both **virtual tables** (query-on-demand) and **remote subscriptions** (real-time copy).`,
    flowchart: {
      title: "SLT vs SDI: Data Flows into HANA",
      nodes: [
        node("ecc", 60, 140, "🏭 SAP ECC/S4\nSource System", PALETTE[3]),
        node("slt", 60, 280, "🔄 SLT\nReal-time replication\n(LTRC)", PALETTE[0], true),
        node("other", 640, 140, "🌐 Non-SAP Source\nOracle / Salesforce / Files", PALETTE[5]),
        node("agent", 640, 280, "🔌 SDI Agent\n+ Adapters", PALETTE[1]),
        node("hana", 350, 420, "🗄️ SAP HANA\nTarget", PALETTE[2], true),
      ],
      edges: [
        edge("ecc", "slt"),
        edge("slt", "hana"),
        edge("other", "agent"),
        edge("agent", "hana"),
      ],
      details: [
        { nodeId: "ecc", title: "SAP source systems", description: "ECC, S/4HANA, and BW are classic SLT sources. SLT is purpose-built for the SAP table structures and replication protocol.", tCode: "LTRC (SLT Cockpit)", tips: "SLT runs in the source SAP system — minimal additional infrastructure." },
        { nodeId: "slt", title: "SLT replication", description: "SLT captures every data change (INSERT/UPDATE/DELETE) in near-real-time and applies it to the HANA target table — keeping them in sync continuously.", tCode: "Transaction LTRC", tips: "You choose tables selectively — don't replicate everything, only what reports need." },
        { nodeId: "other", title: "Non-SAP sources", description: "Any database (Oracle, SQL Server, DB2, Hadoop), cloud app (Salesforce, Google BigQuery), or file system can be a source for SDI.", tips: "SDI has 30+ adapter types. Check SAP Help for the adapter list." },
        { nodeId: "agent", title: "SDI Data Provisioning Agent", description: "A lightweight Java agent installed close to the source. It hosts the adapters and manages the connection to HANA. The agent communicates securely with HANA.", tCode: "HANA Studio → Provisioning", tips: "Install the agent close to the source (low latency) not on the HANA server." },
        { nodeId: "hana", title: "HANA as the target", description: "Data arrives in HANA tables — either replicated (SDI remote subscriptions, SLT) or queried as virtual tables (SDI). Once in HANA, it's available for Calculation Views, reporting, and analytics.", tips: "Plan the HANA target schema carefully — match business keys and data types from the source." },
      ],
    },
    questions: [
      { q: "Which tool is the standard choice for real-time replication from SAP ECC into HANA?", e: "SLT (SAP Landscape Transformation) is purpose-built for replicating SAP tables in near-real-time. It is configured with transaction LTRC in the source SAP system.", opts: [["SLT — SAP Landscape Transformation", true], ["SDI — Smart Data Integration", false], ["BODS — Business Objects Data Services", false], ["ABAP BAPI calls", false]] },
      { q: "What is an SDI Virtual Table?", e: "An SDI Virtual Table exposes source data as if it were a native HANA table, but the data is not copied — it is queried from the source on demand when the virtual table is accessed.", opts: [["A table that queries the source on demand without copying data", true], ["A temporary table stored in memory", false], ["A backup copy of a HANA table", false], ["A table used only for system monitoring", false]] },
      { q: "A company needs to load data from Salesforce into HANA in real time. Which tool should they use?", e: "SDI (Smart Data Integration) connects HANA to non-SAP sources including cloud apps like Salesforce through its adapter framework. SLT is for SAP sources only.", opts: [["SDI with a Salesforce adapter", true], ["SLT", false], ["ABAP OData service", false], ["HANA Studio import wizard only", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // LESSON 12 — HANA Performance Monitoring
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-performance-monitoring",
    title: "HANA Performance Monitoring",
    order: 12,
    minutes: 12,
    difficulty: "ADVANCED",
    xp: 100,
    importance: "HIGH",
    story: `Users are complaining that a key report is "slower than last week." The HANA admin logs in not to guess, but to look at the data HANA records about itself. Within minutes she's found the expensive SQL statement, the session it came from, and the table it was scanning without compression. HANA's monitoring views give you x-ray vision into the system.`,
    content: `## HANA monitors itself

HANA continuously collects performance data and exposes it through **system views** — SQL-queryable tables in the \`SYS\` and \`_SYS_STATISTICS\` schemas. No external monitoring agent needed for the basics.

## The M_ views (Monitoring Views)

Views starting with **\`M_\`** are live, in-memory snapshots of what HANA is doing right now:

| View | What it shows |
|---|---|
| \`M_CONNECTIONS\` | Active database connections and their state |
| \`M_EXPENSIVE_STATEMENTS\` | SQL statements that exceeded a cost threshold |
| \`M_LOAD_HISTORY_SERVICE\` | CPU, memory, I/O over time per service |
| \`M_CS_TABLES\` | Column store table stats (size, row count, delta size) |
| \`M_DELTA_MERGES\` | History of delta merge operations |
| \`M_BACKUP_CATALOG\` | All backups and their status |
| \`M_ALERTS\` | Active system alerts from the Statistics Server |

Example — find the current top CPU consumers:
\`\`\`sql
SELECT TOP 10 CONNECTION_ID, USER_NAME, STATEMENT_STRING,
       DURATION_MICROSEC / 1000 AS DURATION_MS
FROM M_EXPENSIVE_STATEMENTS
ORDER BY DURATION_MICROSEC DESC;
\`\`\`

## Expensive Statement Trace

The **Expensive Statement Trace** captures SQL that runs longer than a threshold (default 1 second). Enable it in HANA Cockpit or with:
\`\`\`sql
ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM')
  SET ('expensive_statement','enable') = 'true',
      ('expensive_statement','threshold_duration_microseconds') = '1000000';
\`\`\`
Then query \`M_EXPENSIVE_STATEMENTS\` to see what's slow.

## SQL Plan Cache

\`M_SQL_PLAN_CACHE\` stores the execution plan for every recent SQL statement — including how many times it ran, total CPU, total duration, and parameter values. Use it to find frequently-run but slow statements.

## HANA Cockpit (GUI monitoring)

**HANA Cockpit** is the web-based admin UI. Key dashboards:
- **System Overview** — memory usage, CPU, services health
- **Performance Monitor** — live CPU, memory, disk I/O charts
- **Threads** — what every session thread is doing right now
- **SQL Monitor** — expensive statements, plan cache

## Memory is king

HANA's performance depends on data fitting in memory. Watch:
- **Used Memory** vs **Allocation Limit** (if used > ~90%, performance degrades)
- **Column Store** size vs available RAM
- **Delta size** — large deltas mean a merge is needed`,
    keyTitle: "M_ Views + HANA Cockpit = Performance Visibility",
    keyBody: `HANA exposes live performance data via **M_ monitoring views** queryable with SQL — key ones: \`M_EXPENSIVE_STATEMENTS\` (slow SQL), \`M_CS_TABLES\` (column store sizes), \`M_CONNECTIONS\` (active sessions), \`M_ALERTS\` (system alerts). Enable the **Expensive Statement Trace** to capture SQL above a duration threshold. Watch **used memory vs allocation limit** — if HANA runs out of memory, performance drops sharply. **HANA Cockpit** provides the same data in a web GUI.`,
    flowchart: {
      title: "Finding a Slow Query in HANA",
      nodes: [
        node("cockpit", 40, 60, "🖥️ HANA Cockpit\nAlerts / Overview", PALETTE[1]),
        node("alert", 40, 200, "🚨 Alert fired\nor user complains", PALETTE[6], true),
        node("exp", 280, 200, "🔍 M_EXPENSIVE\n_STATEMENTS\nFind slow SQL", PALETTE[0], true),
        node("plan", 520, 200, "📋 M_SQL_PLAN\n_CACHE\nExecution plan", PALETTE[2]),
        node("table", 280, 360, "📊 M_CS_TABLES\nCheck delta size\n& compression", PALETTE[3]),
        node("fix", 520, 360, "✅ Fix: index /\npartition / merge", PALETTE[4], true),
      ],
      edges: [
        edge("cockpit", "alert"),
        edge("alert", "exp"),
        edge("exp", "plan"),
        edge("exp", "table"),
        edge("plan", "fix"),
        edge("table", "fix"),
      ],
      details: [
        { nodeId: "cockpit", title: "HANA Cockpit — first stop", description: "The web UI shows a live system overview with memory, CPU, active alerts, and threads. Start here for a quick health check.", tCode: "https://host:4300 (HANA Cockpit)", tips: "Pin the 'System Overview' tile — it shows the most critical metrics at a glance." },
        { nodeId: "alert", title: "Alert or complaint", description: "Performance problems usually surface as a user complaint ('report is slow') or a Statistics Server alert (high memory, lock waits, long-running statements).", tips: "Check M_ALERTS for active alerts — they often point directly at the problem." },
        { nodeId: "exp", title: "M_EXPENSIVE_STATEMENTS", description: "Lists SQL that exceeded the configured duration threshold. Shows statement text, user, duration, CPU, and memory used — the fastest way to find the culprit.", tCode: "SELECT * FROM M_EXPENSIVE_STATEMENTS ORDER BY DURATION_MICROSEC DESC", tips: "Enable the trace if it's off: set expensive_statement/enable = true in global.ini." },
        { nodeId: "plan", title: "M_SQL_PLAN_CACHE", description: "Stores execution plans for recent statements. Shows total executions, average duration, and CPU — great for finding frequently-slow statements, not just the single worst.", tCode: "SELECT * FROM M_SQL_PLAN_CACHE ORDER BY TOTAL_ELAPSED_TIME DESC", tips: "A high execution count × high avg duration = high cumulative pain for users." },
        { nodeId: "table", title: "M_CS_TABLES", description: "Shows each column store table's main size, delta size, row count, and compression ratio. A large delta compared to main means a delta merge is overdue.", tCode: "SELECT * FROM M_CS_TABLES WHERE DELTA_SIZE > 100000000", tips: "Trigger a merge: MERGE DELTA OF <table>." },
        { nodeId: "fix", title: "Fix and verify", description: "Apply the fix (add index, partition, trigger merge, tune SQL) and re-run the expensive statement query to confirm improvement.", tips: "Always verify after fixing — gut feeling is not a performance test." },
      ],
    },
    questions: [
      { q: "Which HANA system view would you query first to find slow SQL statements?", e: "M_EXPENSIVE_STATEMENTS captures SQL that ran longer than the configured threshold, showing the statement text, duration, user, and resource usage — the primary tool for identifying slow queries.", opts: [["M_EXPENSIVE_STATEMENTS", true], ["M_BACKUP_CATALOG", false], ["M_DELTA_MERGES", false], ["M_ALERTS", false]] },
      { q: "What does a very large delta store in M_CS_TABLES indicate?", e: "The delta store is the write buffer for new/changed rows. A very large delta relative to the main store means a delta merge is overdue — rows haven't been compressed into the main store yet, making reads slower.", opts: [["A delta merge is overdue — rows haven't been compressed into main", true], ["The table has too many indexes", false], ["The table is fully optimized", false], ["Backups have not run recently", false]] },
      { q: "Why is HANA memory utilization critical to monitor?", e: "HANA is an in-memory database — its performance depends on working data fitting in RAM. If used memory approaches the allocation limit, HANA starts evicting data to disk, sharply degrading performance.", opts: [["HANA's speed depends on data fitting in RAM — near-limit usage causes eviction to disk", true], ["High memory usage deletes data automatically", false], ["Memory only affects user authentication", false], ["HANA stops working at exactly 50% memory", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // LESSON 13 — HANA Backup & Recovery
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-backup-recovery",
    title: "HANA Backup & Recovery",
    order: 13,
    minutes: 11,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "HIGH",
    story: `At 2am, a HANA tenant database crashes due to hardware failure. The on-call admin needs to restore it. She knows the last full backup ran Sunday night and log backups run every 15 minutes. She can recover to within 15 minutes of the crash — not because she's lucky, but because the backup strategy was designed for exactly this scenario.`,
    content: `## Why HANA backup is different

HANA is in-memory — if a server restarts, it replays the **redo log** to recover the in-memory state automatically (crash recovery). But if data is corrupted, or if you need to go back in time, you need a **full backup**.

## Three backup types

### 1. Complete (Full) Data Backup
A snapshot of all database pages at a point in time. The starting point for any recovery.

\`\`\`sql
BACKUP DATA USING FILE ('backup_path/PRD_full');
\`\`\`
**Run**: weekly or nightly depending on RPO

### 2. Differential Data Backup
Only pages that **changed since the last full backup**. Faster than full, smaller size.
\`\`\`sql
BACKUP DATA DIFFERENTIAL USING FILE ('backup_path/PRD_diff');
\`\`\`

### 3. Incremental Data Backup
Only pages changed **since the last backup of any type** (full or incremental).

### 4. Log Backup
HANA's **redo log** records every transaction. Log backups capture these continuously and are critical for **point-in-time recovery**.
\`\`\`sql
BACKUP LOG USING FILE ('log_path/PRD_log');
\`\`\`
**Configure log backup interval**: every 15–60 minutes depending on RPO

## Recovery scenarios

| Scenario | What to restore |
|---|---|
| Complete loss | Full backup + all differential/incremental + all logs |
| Point-in-time recovery | Full backup + logs up to the target time |
| Single tenant corruption | Recover that tenant only (MDC advantage) |
| System DB loss | Restore System DB, then tenants register themselves |

## Backup catalog

HANA tracks every backup in the **backup catalog**:
\`\`\`sql
SELECT * FROM M_BACKUP_CATALOG ORDER BY SYS_START_TIME DESC;
\`\`\`
Recovery uses the catalog to find which backup files to apply. **Never delete backup files manually** — always use HANA's backup catalog management to delete old entries safely.

## Backup destinations

- **File system** (local or NFS)
- **Backint** — HANA's API for third-party backup tools (Commvault, NetBackup, AWS Backup)
- **Azure Blob / GCP / AWS S3** (via Backint-certified cloud agents)

## Key concepts: RPO and RTO

- **RPO** (Recovery Point Objective) — maximum acceptable data loss. Drives backup frequency (15-min log backups → RPO of 15 min)
- **RTO** (Recovery Time Objective) — maximum acceptable downtime. Drives infrastructure choices (fast storage, HANA System Replication)`,
    keyTitle: "Full + Log Backups = Point-in-Time Recovery",
    keyBody: `HANA has three data backup types: **Full** (all pages), **Differential** (changed since last full), **Incremental** (changed since last backup). **Log backups** capture the redo log continuously — essential for **point-in-time recovery**. Track all backups via **M_BACKUP_CATALOG** (never delete files manually). Define **RPO** (data loss tolerance → drives log frequency) and **RTO** (downtime tolerance → drives infrastructure). In MDC, tenants can be recovered independently.`,
    flowchart: {
      title: "HANA Backup & Recovery Strategy",
      nodes: [
        node("full", 40, 60, "📦 Full Backup\nSunday night", PALETTE[0], true),
        node("diff", 280, 60, "📋 Differential\nNightly Mon–Sat", PALETTE[1]),
        node("log", 520, 60, "📜 Log Backup\nEvery 15 min", PALETTE[2], true),
        node("crash", 520, 220, "💥 Failure\nat 3:47am", PALETTE[6], true),
        node("recover", 280, 360, "🔄 Recovery\nFull + Diff + Logs", PALETTE[4], true),
        node("rpo", 40, 360, "⏱️ RPO = 15 min\nMax data loss", PALETTE[3]),
      ],
      edges: [
        edge("full", "diff"),
        edge("diff", "log"),
        edge("log", "crash"),
        edge("crash", "recover"),
        edge("full", "recover"),
        edge("diff", "recover"),
        edge("recover", "rpo"),
      ],
      details: [
        { nodeId: "full", title: "Full backup — the foundation", description: "A complete snapshot of all database pages. Recovery always starts from the most recent full backup. Typically weekly or nightly.", tCode: "BACKUP DATA USING FILE (...)", tips: "Test your full backup restore regularly — an untested backup is not a backup." },
        { nodeId: "diff", title: "Differential backup", description: "Captures pages changed since the last full backup. Faster and smaller than another full. Recovery needs: full + latest differential.", tCode: "BACKUP DATA DIFFERENTIAL USING FILE (...)", tips: "Differential reduces nightly backup window compared to full every night." },
        { nodeId: "log", title: "Log backup — enables point-in-time", description: "The redo log records every committed transaction. Log backups let you recover to any minute, not just a backup point.", tCode: "BACKUP LOG USING FILE (...)", tips: "Configure automatic log backup with: ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM') SET ('persistence','log_backup_timeout_s')." },
        { nodeId: "crash", title: "Failure scenario", description: "Hardware failure, data corruption, or accidental delete — the event that triggers recovery. The closer your last log backup is to the failure, the less data you lose.", tips: "Log the exact failure time — recovery targets this timestamp." },
        { nodeId: "recover", title: "Recovery process", description: "Apply: 1) most recent full backup, 2) most recent differential (if used), 3) all log backups up to the target time. HANA Cockpit and HDBSQL both support guided recovery.", tCode: "RECOVER DATABASE UNTIL TIMESTAMP '2025-06-23 03:47:00'", tips: "Recovery can target the last consistent point (no timestamp needed) or a specific time." },
        { nodeId: "rpo", title: "RPO drives log frequency", description: "RPO is the maximum acceptable data loss. 15-minute log backups → RPO of 15 minutes. Define RPO with the business, then size log backup frequency accordingly.", tips: "RTO (Recovery Time Objective) drives how fast you can restore — fast storage and HANA System Replication help." },
      ],
    },
    questions: [
      { q: "Which backup type is essential for point-in-time recovery in HANA?", e: "Log backups capture the HANA redo log continuously. By applying a full backup plus log backups up to a specific timestamp, you can recover to any point in time — not just a backup snapshot.", opts: [["Log backup", true], ["Full data backup only", false], ["Differential backup", false], ["System DB backup", false]] },
      { q: "What is RPO and how does it relate to HANA backup frequency?", e: "RPO (Recovery Point Objective) is the maximum acceptable data loss. If your RPO is 15 minutes, you must run log backups every 15 minutes so that in a worst case you lose at most 15 minutes of data.", opts: [["RPO is the max acceptable data loss — drives how often log backups run", true], ["RPO is how fast the system restarts", false], ["RPO is the maximum number of backups allowed", false], ["RPO only applies to full backups", false]] },
      { q: "Why should you never delete HANA backup files manually from the file system?", e: "HANA tracks all backups in its backup catalog. Deleting files without updating the catalog leaves orphan entries — HANA may try to use them in recovery and fail. Always use HANA's catalog management to expire old backups.", opts: [["HANA's backup catalog tracks files — deleting them leaves broken catalog entries", true], ["Manual deletes immediately crash HANA", false], ["Backup files are locked by the OS", false], ["Manual deletes corrupt the database", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // LESSON 14 — HANA Advanced Analytics
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-advanced-analytics",
    title: "HANA Advanced Analytics: PAL, Text & Spatial",
    order: 14,
    minutes: 11,
    difficulty: "ADVANCED",
    xp: 100,
    importance: "MEDIUM",
    story: `A retail company wants to predict which customers will churn next month — using the transaction data already in HANA. A data scientist says: "I don't need to extract the data to Python. HANA can run the prediction algorithm right here, on the live data." HANA's advanced analytics libraries let you bring machine learning and specialized analysis to the data, not the other way around.`,
    content: `## Beyond SQL: analytics built into HANA

HANA isn't just a fast SQL database. It ships with three specialized analytics engines you call directly from SQL — no data export needed.

## 1. Predictive Analysis Library (PAL)

**PAL** is a library of **machine learning algorithms** built into HANA — callable via SQL procedures:

- **Classification**: Decision Trees, Random Forest, Naive Bayes, Logistic Regression
- **Regression**: Linear, Polynomial
- **Clustering**: K-Means, DBSCAN
- **Time Series**: Auto ARIMA, Exponential Smoothing, Trend Analysis
- **Recommendation**: Collaborative Filtering (useful for product recommendations)

\`\`\`sql
-- Example: K-Means clustering on customer data
CALL _SYS_AFL.PAL_KMEANS(
  IN_DATA    => customer_features,
  PARAM_DATA => (SELECT * FROM pal_kmeans_params),
  OUT_DATA   => cluster_assignments
);
\`\`\`

**Key benefit**: the algorithm runs *inside HANA*, on live data — no ETL to a Python environment and back.

## 2. Text Analysis & Full-Text Search

HANA's **Text Analysis** engine processes unstructured text in HANA tables:

- **Full-text search**: \`CONTAINS\` predicate for Google-like search across text columns
- **Text Mining**: entity extraction (dates, people, places, topics) from free text
- **Sentiment Analysis**: classify text as positive/negative/neutral
- **Text Rules**: custom extraction rules using a rule-based language

\`\`\`sql
-- Full-text search example
SELECT * FROM customer_notes
WHERE CONTAINS(notes, 'delivery problem', FUZZY(0.8));
\`\`\`

## 3. Spatial Engine

HANA has a native **Spatial Engine** (OGC-compliant) for geographic data:

- Store **points, lines, polygons** in \`ST_POINT\`, \`ST_GEOMETRY\` columns
- Functions: distance, intersection, containment, buffer zones
- Coordinate system transformations (WGS84, etc.)
- Visualize on maps in SAP Analytics Cloud

\`\`\`sql
-- Find all stores within 5km of a customer
SELECT store_name
FROM stores
WHERE location.ST_Distance(
  NEW ST_POINT(longitude, latitude), 'meter'
) < 5000;
\`\`\`

## When to use each

| Capability | Use when |
|---|---|
| PAL | Predictive models, clustering, time-series forecasts |
| Text Analysis | Searching or mining free-text data (notes, emails, tickets) |
| Spatial | Location-based analysis, routing, territory planning |

## SAP AI & HANA Cloud

In HANA Cloud, these capabilities are extended with **SAP HANA Cloud, ML Foundation** and integration to **SAP AI Core** for deploying trained models — the evolution of in-database analytics toward full MLOps.`,
    keyTitle: "PAL (ML in-database) + Text Analysis + Spatial = HANA Advanced Analytics",
    keyBody: `**PAL** (Predictive Analysis Library) runs machine learning algorithms (clustering, classification, time series) directly inside HANA via SQL procedure calls — no data export needed. **Text Analysis** enables full-text search (\`CONTAINS\`), entity extraction, and sentiment analysis on text columns. The **Spatial Engine** stores and queries geographic data (points, polygons, distances) using OGC-standard SQL functions. All three run where the data lives — in HANA's memory.`,
    flowchart: {
      title: "HANA Advanced Analytics Engines",
      nodes: [
        node("data", 360, 20, "🗄️ HANA Data\n(live, in-memory)", PALETTE[0], true),
        node("pal", 80, 180, "🤖 PAL\nMachine Learning\n(K-Means, ARIMA…)", PALETTE[2], true),
        node("text", 360, 180, "📝 Text Analysis\nSearch, Entities\nSentiment", PALETTE[1], true),
        node("spatial", 640, 180, "🗺️ Spatial Engine\nGeo queries\nDistance, Polygons", PALETTE[4], true),
        node("out", 360, 340, "📊 Results\nReports / SAC / App", PALETTE[3], true),
      ],
      edges: [
        edge("data", "pal"),
        edge("data", "text"),
        edge("data", "spatial"),
        edge("pal", "out"),
        edge("text", "out"),
        edge("spatial", "out"),
      ],
      details: [
        { nodeId: "data", title: "In-memory data advantage", description: "All three analytics engines operate directly on data already in HANA's memory — no extract, transform, load to an external tool. This is 'bring the algorithm to the data'.", tips: "No data movement = no latency and no synchronization problem." },
        { nodeId: "pal", title: "Predictive Analysis Library (PAL)", description: "A library of 100+ ML algorithms callable via SQL stored procedures. Covers classification, regression, clustering, time series, and recommendation. Called via the _SYS_AFL schema.", tCode: "CALL _SYS_AFL.PAL_KMEANS(...)", tips: "PAL is best for structured data. For unstructured or deep learning, integrate SAP AI Core." },
        { nodeId: "text", title: "Text Analysis", description: "Processes unstructured text stored in HANA columns. CONTAINS() provides fuzzy full-text search; text mining extracts entities, topics, and sentiment from large text fields.", tCode: "CONTAINS(column, 'search term', FUZZY(0.8))", tips: "Text Analysis is pre-configured for many languages — specify LANGUAGE 'EN' for English." },
        { nodeId: "spatial", title: "Spatial Engine", description: "OGC-standard geographic SQL functions: store coordinates, compute distances, find intersections, check containment, buffer zones. Used for territory management, logistics, and location analytics.", tCode: "ST_Distance(), ST_Intersects(), ST_Contains()", tips: "HANA spatial data integrates with SAP Analytics Cloud's geo maps for visualization." },
        { nodeId: "out", title: "Results consumed by apps", description: "PAL predictions, text analysis results, and spatial query outputs are returned as HANA tables — consumed by SAP Analytics Cloud, Fiori apps, or any BI tool connected to HANA.", tips: "Wrap PAL calls in Calculation Views or stored procedures for clean consumption by reporting tools." },
      ],
    },
    questions: [
      { q: "What is the key advantage of using PAL (HANA's Predictive Analysis Library) over exporting data to Python?", e: "PAL runs ML algorithms inside HANA on live in-memory data — no data export, no synchronization, no round-trip latency. The algorithm runs where the data already lives.", opts: [["Algorithms run inside HANA on live data — no data export needed", true], ["PAL is always faster than Python", false], ["PAL supports more algorithms than Python libraries", false], ["PAL automatically deploys to mobile apps", false]] },
      { q: "What does the CONTAINS() function with FUZZY enable in HANA?", e: "CONTAINS with FUZZY enables full-text search that tolerates spelling variations and approximate matches — similar to a search engine, applied to text columns in a HANA table.", opts: [["Full-text search with approximate/fuzzy matching on text columns", true], ["Checking if a number is within a range", false], ["Finding geographic intersections", false], ["Checking user authorization", false]] },
      { q: "A logistics company wants to find all delivery stops within 10km of a warehouse. Which HANA capability should they use?", e: "The HANA Spatial Engine supports geographic queries including distance calculations (ST_Distance) on stored location data — exactly the right tool for proximity queries.", opts: [["HANA Spatial Engine with ST_Distance", true], ["PAL K-Means clustering", false], ["Text Analysis entity extraction", false], ["HANA delta merge", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // LESSON 15 — HANA in the SAP Ecosystem
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-in-the-sap-ecosystem",
    title: "HANA in the SAP Ecosystem",
    order: 15,
    minutes: 10,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story: `A consultant joins an SAP project and sees several products mentioned in the architecture diagram: S/4HANA, BW/4HANA, SAP Analytics Cloud, DataSphere. They all say "HANA" or connect to it. She wants to understand: what is HANA's role in each, and how do they all fit together? Understanding this map is what separates a narrow specialist from someone who can see the whole picture.`,
    content: `## HANA is the platform, not the product

SAP HANA is the **database and platform layer** underneath multiple SAP products. Each product uses HANA differently.

## The SAP product family on HANA

### SAP S/4HANA
The **ERP suite** (Finance, Procurement, Sales, Manufacturing). Runs *exclusively* on HANA. HANA's speed powers its embedded analytics and simplified data model (ACDOCA replaces dozens of ECC tables). Every S/4HANA system is a HANA tenant database.

### SAP BW/4HANA
The **Data Warehouse** optimized for HANA. Successor to SAP BW. Stores integrated data from multiple source systems for enterprise reporting. BW/4HANA uses HANA's in-memory engine and columnar storage to replace what used to require separate aggregates and cubes.

### SAP Analytics Cloud (SAC)
The **cloud BI and planning tool** (dashboards, stories, planning). SAC does not host data itself — it connects *to* HANA Live (direct SQL read from S/4HANA's CDS views) or to BW/4HANA / DataSphere for analytics. The "HANA Live" connection gives real-time analytics on S/4HANA data.

### SAP Datasphere (formerly Data Warehouse Cloud)
SAP's **next-generation unified data layer** in the cloud. Combines HANA Cloud as its engine with data federation, data marketplace, and business semantic modeling. Designed to replace BW/4HANA over time.

### SAP HANA Cloud
**HANA as a managed cloud service** (available on AWS, Azure, GCP via SAP BTP). No hardware to manage. Used as the engine for Datasphere, for custom applications on BTP, and as a migration target for on-premise HANA systems.

## How they connect

\`\`\`
Source Systems (ECC, 3rd-party)
   → SLT / SDI / BTP Integration
      → S/4HANA (live transactions, ACDOCA)
      → BW/4HANA / Datasphere (integrated warehouse)
         → SAP Analytics Cloud (dashboards, planning)
\`\`\`

## HANA's role in each

| Product | HANA's role |
|---|---|
| S/4HANA | Mandatory transaction DB + embedded analytics engine |
| BW/4HANA | Optimized warehouse engine — replaces aggregates |
| Datasphere | Cloud data platform engine |
| SAC | None (SAC is cloud-native) — connects to HANA via SQL/HANA Live |
| BTP | Hosts HANA Cloud for custom app development |

## What this means for your career

Understanding this map means you can explain *why* something is designed the way it is. "Why does SAC query S/4HANA directly?" — because HANA is fast enough to serve live analytical queries without a copy. "Why replace BW with Datasphere?" — because HANA Cloud removes the hardware and simplifies the stack.`,
    keyTitle: "HANA is the Engine Under S/4HANA, BW/4HANA, Datasphere & HANA Cloud",
    keyBody: `**S/4HANA** is the ERP — HANA is its mandatory database and analytics engine. **BW/4HANA** is the enterprise data warehouse optimized for HANA — replaces old aggregates with in-memory speed. **SAP Analytics Cloud (SAC)** connects *to* HANA for live reporting but doesn't host data itself. **Datasphere** is SAP's cloud data platform built on **HANA Cloud** — the managed cloud service available on AWS/Azure/GCP. HANA is the shared engine powering all of them.`,
    flowchart: {
      title: "SAP Products Built on HANA",
      nodes: [
        node("hana", 360, 400, "🗄️ SAP HANA\n(the engine)", PALETTE[0], true),
        node("s4", 40, 220, "🏢 S/4HANA\nERP Suite", PALETTE[1], true),
        node("bw", 200, 100, "📊 BW/4HANA\nData Warehouse", PALETTE[2]),
        node("ds", 400, 100, "🌐 Datasphere\nCloud Data Platform", PALETTE[3]),
        node("hc", 620, 220, "☁️ HANA Cloud\nManaged Service", PALETTE[4], true),
        node("sac", 360, 20, "📈 SAP Analytics Cloud\nDashboards & Planning", PALETTE[5]),
      ],
      edges: [
        edge("hana", "s4"),
        edge("hana", "bw"),
        edge("hana", "ds"),
        edge("hana", "hc"),
        edge("bw", "sac"),
        edge("ds", "sac"),
        edge("s4", "sac"),
      ],
      details: [
        { nodeId: "hana", title: "SAP HANA — the shared engine", description: "HANA is the database and platform layer shared across the SAP product family. Whether on-premise or as HANA Cloud, it provides the in-memory, columnar engine that powers all the above products.", tips: "Understanding HANA is understanding the foundation of modern SAP." },
        { nodeId: "s4", title: "S/4HANA", description: "The next-generation ERP — Finance, Procurement, Manufacturing, and more — that runs exclusively on HANA. Uses HANA's embedded analytics to serve live reports from the same tables as transactions.", tCode: "S/4HANA 2023/2024", tips: "Every active SAP customer is migrating to S/4HANA — it's the biggest transformation in SAP's history." },
        { nodeId: "bw", title: "BW/4HANA", description: "SAP's enterprise data warehouse product, rebuilt to leverage HANA fully. Consolidates data from many SAP and non-SAP sources for enterprise-wide integrated reporting.", tCode: "BW/4HANA 2.0", tips: "BW/4HANA is being superseded by Datasphere for new implementations, but many customers still run it." },
        { nodeId: "ds", title: "SAP Datasphere", description: "SAP's cloud-native, unified data platform (successor to Data Warehouse Cloud). Built on HANA Cloud with added federation, data marketplace, and semantic modeling capabilities.", tCode: "datasphere.cloud.sap.com", tips: "Datasphere is the strategic direction for new data warehouse projects from 2024 onward." },
        { nodeId: "hc", title: "HANA Cloud", description: "HANA as a fully managed cloud service on SAP BTP (deployable on AWS, Azure, or GCP). No infrastructure management — SAP handles patching, backups, and scaling.", tCode: "SAP BTP → HANA Cloud", tips: "HANA Cloud is the default for new CAP and Datasphere projects." },
        { nodeId: "sac", title: "SAP Analytics Cloud", description: "SAP's cloud-native BI, visualization, and planning tool. Connects to S/4HANA via Live Connection (real-time CDS views), to BW/4HANA, or to Datasphere. Does not store analytical data itself.", tCode: "analytics.sap.com", tips: "Live Connection to S/4HANA means dashboards always show current data — no overnight ETL." },
      ],
    },
    questions: [
      { q: "Which SAP product uses HANA as its mandatory, exclusive database engine?", e: "S/4HANA runs only on SAP HANA — it is a design requirement, unlike legacy ECC which supported Oracle, DB2, and others. HANA's speed enables S/4HANA's simplified data model and embedded analytics.", opts: [["SAP S/4HANA", true], ["SAP ECC", false], ["SAP Analytics Cloud", false], ["SAP Ariba", false]] },
      { q: "What is the relationship between SAP Analytics Cloud (SAC) and SAP HANA?", e: "SAC is a cloud-native BI tool that connects to HANA (via Live Connection to S/4HANA or BW/4HANA) for data. SAC does not host or store the analytical data — HANA does.", opts: [["SAC connects to HANA for data but doesn't store data itself", true], ["SAC runs on HANA as its database engine", false], ["SAC and HANA are the same product", false], ["SAC replaces HANA for analytics", false]] },
      { q: "What is SAP Datasphere and how does it relate to HANA?", e: "Datasphere is SAP's cloud-native unified data platform built on HANA Cloud. It adds data federation, marketplace, and semantic modeling on top of HANA Cloud's engine — and is the strategic successor to BW/4HANA for new data warehouse projects.", opts: [["SAP's cloud data platform built on HANA Cloud — successor to BW/4HANA", true], ["A mobile app for viewing HANA data", false], ["HANA's on-premise backup tool", false], ["A replacement for SAP S/4HANA", false]] },
    ],
  });

  console.log("\n✅ Session 19 complete — 9 lessons added to SAP HANA (total: 15)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
