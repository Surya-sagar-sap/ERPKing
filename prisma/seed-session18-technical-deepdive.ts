// ─── FILE: prisma/seed-session18-technical-deepdive.ts ───
// Session 18 — Technical track deep-dive.
// Adds a new SAP HANA module (6 lessons) and extends ABAP, Fiori, S/4HANA and BTP
// with modern, job-relevant lessons. Idempotent: re-running upserts by slug.
//
// Run with:  npx tsx prisma/seed-session18-technical-deepdive.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Diff = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type Imp = "HIGH" | "MEDIUM" | "LOW";

// Compact ReactFlow node/edge builders (match the visual style used in seed.ts).
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
function edge(source: string, target: string, type?: string) {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    animated: true,
    ...(type ? { type } : {}),
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
  console.log("Session 18 — technical deep-dive seeding…");

  // ── Resolve modules ──
  const hana = await prisma.module.upsert({
    where: { slug: "hana" },
    update: {},
    create: {
      title: "SAP HANA",
      slug: "hana",
      description:
        "The in-memory database and platform under modern SAP. Learn its architecture, data modeling, SQLScript, tools, and HANA Cloud.",
      color: "#0891B2",
      icon: "🗄️",
      order: 9,
      isPublished: true,
    },
  });

  const abap = await prisma.module.findUnique({ where: { slug: "abap" } });
  const fiori = await prisma.module.findUnique({ where: { slug: "fiori" } });
  const s4 = await prisma.module.findUnique({ where: { slug: "s4hana" } });
  const btp = await prisma.module.findUnique({ where: { slug: "btp" } });
  if (!abap || !fiori || !s4 || !btp) {
    throw new Error("Base modules (abap/fiori/s4hana/btp) not found — run the main seed first.");
  }

  // ════════════════════════════════════════════════
  // NEW MODULE: SAP HANA
  // ════════════════════════════════════════════════
  console.log("\n⚡ SAP HANA module");

  await makeLesson({
    moduleId: hana.id,
    slug: "what-is-sap-hana",
    title: "What is SAP HANA?",
    order: 1,
    minutes: 10,
    difficulty: "BEGINNER",
    xp: 75,
    importance: "HIGH",
    story: `A finance manager runs a report that used to take 4 hours overnight. On the new system it finishes in 8 seconds — while she's still on the call. The difference isn't a faster report. It's a fundamentally different kind of database underneath: **SAP HANA**.

HANA is the engine that makes S/4HANA, modern Fiori analytics, and "real-time" SAP possible. Before you learn what runs *on* it, you need to understand what it actually is.`,
    content: `## HANA in one sentence

**SAP HANA** (High-performance ANalytic Appliance) is an **in-memory, column-oriented database** and application platform. "In-memory" means the entire dataset lives in RAM, not on spinning disk — so reads are dramatically faster.

## Why in-memory changes everything

Traditional databases store data on disk and load small pieces into memory as needed. Disk is slow. HANA keeps the working data **in RAM**, which is orders of magnitude faster to read.

That single shift removes the old wall between two worlds:

- **OLTP** — transactions (creating orders, posting invoices)
- **OLAP** — analytics (reports, dashboards, aggregations)

Old systems needed a separate data warehouse for analytics because running reports on the live transaction database was too slow. HANA is fast enough to do **both on the same data** — this is the heart of why S/4HANA can show real-time analytics with no overnight batch.

## More than a database

HANA is also a **platform**. It can run application logic close to the data (stored procedures, calculation views, predictive and text functions), so you push work *down to the data* instead of pulling millions of rows up to the application.

## Why it matters for your career

Almost everything modern in SAP assumes HANA: S/4HANA runs only on HANA, CDS views and embedded analytics rely on it, and "code pushdown" in ABAP exists because of it. Understanding HANA is the foundation for the whole modern SAP stack.`,
    keyTitle: "HANA = In-Memory, Columnar Database + Platform",
    keyBody: `**SAP HANA** keeps data **in RAM (in-memory)** and stores it **by column**, making reads extremely fast. That speed lets it handle **transactions (OLTP) and analytics (OLAP) on the same data**, removing the old need for a separate data warehouse for real-time reporting. It's also a **platform** that runs logic close to the data. S/4HANA runs *only* on HANA.`,
    flowchart: {
      title: "Why HANA is Fast",
      nodes: [
        node("disk", 40, 60, "🐌 Traditional DB\nData on disk", PALETTE[5]),
        node("ram", 40, 200, "⚡ HANA\nData in RAM", PALETTE[0], true),
        node("col", 280, 200, "📊 Columnar Storage\nReads only needed columns", PALETTE[1]),
        node("both", 520, 130, "🔀 OLTP + OLAP\nSame data, no warehouse", PALETTE[2], true),
        node("rt", 760, 130, "⏱️ Real-time Analytics\nS/4HANA, Fiori", PALETTE[4], true),
      ],
      edges: [edge("disk", "ram"), edge("ram", "col"), edge("col", "both"), edge("both", "rt")],
      details: [
        { nodeId: "disk", title: "The old way: disk-based", description: "Traditional databases store rows on disk and shuttle blocks into memory. Disk I/O is the bottleneck, so heavy reports run as overnight batch jobs.", tips: "This is why legacy ECC reporting was often 'come back tomorrow'." },
        { nodeId: "ram", title: "In-memory", description: "HANA loads the working data into RAM. Reading from memory is far faster than disk, collapsing report times from hours to seconds.", tips: "RAM is volatile, so HANA still persists data to disk for recovery — but it operates from memory." },
        { nodeId: "col", title: "Columnar storage", description: "HANA mainly stores data by column, not by row. Analytics that scan one column over millions of rows (e.g. SUM of revenue) read only that column — and columns compress extremely well.", tips: "Columnar + compression means less data to scan and less RAM used." },
        { nodeId: "both", title: "OLTP + OLAP together", description: "Because reads are so fast, HANA runs transactions and analytics on the same tables. No separate reporting copy, no nightly ETL to a warehouse for operational reporting.", tips: "This 'no aggregates/no indexes needed' idea is central to S/4HANA's simplified data model." },
        { nodeId: "rt", title: "Real-time outcomes", description: "The result is live dashboards and embedded analytics directly on transactional data — the experience that defines S/4HANA and modern Fiori apps.", tips: "When someone says S/4HANA is 'real-time', this is the mechanism." },
      ],
    },
    questions: [
      { q: "What does 'in-memory' mean for SAP HANA?", e: "HANA keeps the working dataset in RAM rather than reading it from disk on demand. RAM access is far faster than disk, which is the core reason HANA reports are so fast.", opts: [["The working data is held in RAM, not read from disk each time", true], ["It memorizes user passwords", false], ["It only works on laptops with lots of memory", false], ["Data is never saved permanently", false]] },
      { q: "Why can HANA handle both transactions (OLTP) and analytics (OLAP) on the same data?", e: "Because in-memory + columnar reads are fast enough to run analytics directly on live transactional tables — removing the old need for a separate data warehouse copy.", opts: [["It's fast enough to run analytics directly on live transaction data", true], ["It runs two completely separate databases internally", false], ["It disables transactions while reporting", false], ["It copies data to Excel automatically", false]] },
      { q: "Which statement about S/4HANA and HANA is correct?", e: "S/4HANA runs only on the SAP HANA database — that's a defining requirement, unlike legacy ECC which ran on many databases.", opts: [["S/4HANA runs only on the SAP HANA database", true], ["S/4HANA can run on any database like Oracle or DB2", false], ["HANA is just a reporting add-on to ECC", false], ["HANA replaces the need for Fiori", false]] },
    ],
  });

  await makeLesson({
    moduleId: hana.id,
    slug: "hana-row-vs-column-store",
    title: "Row Store vs Column Store",
    order: 2,
    minutes: 10,
    difficulty: "BEGINNER",
    xp: 75,
    importance: "MEDIUM",
    story: `A new developer asks: "If columnar storage is so great, why doesn't HANA store *everything* that way?" Good question — and the answer is the key to understanding how HANA is actually organized. Some tables are still better as rows.`,
    content: `## Two ways to store a table

Imagine a table of sales orders. You can physically store it two ways:

**Row store** — keep each record's fields together:
\`\`\`
[1001, Mumbai, 500] [1002, Delhi, 750] [1003, Pune, 200]
\`\`\`
Great when you read **whole records** frequently (e.g. "open order 1002 and show all its fields").

**Column store** — keep each column's values together:
\`\`\`
IDs:     [1001, 1002, 1003]
Cities:  [Mumbai, Delhi, Pune]
Amounts: [500, 750, 200]
\`\`\`
Great when you read **one column across many rows** (e.g. "sum all amounts").

## When each wins

| | Row store | Column store |
|---|---|---|
| Best for | Single-record reads/writes (OLTP) | Aggregations & scans (OLAP) |
| Reads | Whole row at once | Only the columns you need |
| Compression | Lower | **Very high** (similar values grouped) |
| HANA default | A few system tables | **Most application tables** |

## Why columnar compresses so well

A "City" column has the same values repeated thousands of times (Mumbai, Mumbai, Delhi…). Storing similar values together lets HANA compress aggressively — so it fits more data in RAM and scans less of it.

## The practical takeaway

In HANA, **most business/application tables are column store**, and they're the reason analytics are fast. A small number of write-heavy system tables stay row store. As a modeler or developer you rarely change this — but knowing *why* explains HANA's whole performance story.`,
    keyTitle: "Columns for Analytics, Rows for Single Records",
    keyBody: `**Column store** keeps each column's values together — ideal for scanning/aggregating one column over millions of rows, and it compresses extremely well. **Row store** keeps each record's fields together — ideal for reading or writing single whole records. HANA uses **column store for most application tables** (driving fast analytics) and row store for a few write-heavy system tables.`,
    flowchart: {
      title: "Choosing Row vs Column",
      nodes: [
        node("q", 360, 40, "❓ How is the table read?", PALETTE[5], true),
        node("whole", 120, 180, "📄 Whole records often\n(open one order)", PALETTE[1]),
        node("scan", 600, 180, "📊 Scan/aggregate columns\n(sum revenue)", PALETTE[2]),
        node("row", 120, 320, "🧱 Row Store", PALETTE[6], true),
        node("colr", 600, 320, "📚 Column Store\n+ compression", PALETTE[0], true),
      ],
      edges: [edge("q", "whole"), edge("q", "scan"), edge("whole", "row"), edge("scan", "colr")],
      details: [
        { nodeId: "q", title: "Start with the access pattern", description: "The right storage depends on how the data is read most of the time — whole records, or one column across many rows.", tips: "Access pattern, not table size, drives the choice." },
        { nodeId: "whole", title: "Whole-record access", description: "Transactional work opens and updates one record at a time with all its fields — classic OLTP.", tips: "Think 'display/change this one document'." },
        { nodeId: "scan", title: "Column scans", description: "Analytics read one or a few columns across huge numbers of rows to aggregate — classic OLAP.", tips: "Think 'total sales by region this quarter'." },
        { nodeId: "row", title: "Row store", description: "Stores fields of a record together; efficient for frequent single-record reads/writes. HANA keeps a few system tables here.", tips: "Lower compression than columnar." },
        { nodeId: "colr", title: "Column store", description: "Stores each column together; reads only needed columns and compresses heavily. The default for HANA application tables.", tips: "This is what makes HANA analytics fast." },
      ],
    },
    questions: [
      { q: "Which workload is column store best suited for?", e: "Column store shines at analytics (OLAP): scanning and aggregating one or a few columns across many rows, reading only the needed columns.", opts: [["Aggregations and scans across many rows (analytics)", true], ["Reading one full record at a time", false], ["Storing passwords securely", false], ["Sending emails", false]] },
      { q: "Why does columnar storage compress so well?", e: "A single column holds many similar/repeating values (e.g. the same city repeated), and grouping similar values together lets HANA compress aggressively — fitting more data in RAM.", opts: [["Similar values are stored together and compress efficiently", true], ["It deletes old data automatically", false], ["It stores everything as images", false], ["Columns are always encrypted", false]] },
      { q: "In HANA, what kind of storage do most business application tables use?", e: "Most application tables in HANA are column store — that's what powers fast real-time analytics. Only a few write-heavy system tables stay row store.", opts: [["Column store", true], ["Row store", false], ["They are not stored at all", false], ["Flat CSV files", false]] },
    ],
  });

  await makeLesson({
    moduleId: hana.id,
    slug: "hana-data-modeling-calculation-views",
    title: "Data Modeling: Calculation Views",
    order: 3,
    minutes: 12,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story: `Raw HANA tables are technical — codes, keys, and IDs. Business users want "Net Revenue by Region by Month." Someone has to shape the raw tables into something meaningful and reusable. In HANA, that shaping is done with **Calculation Views**.`,
    content: `## What is a Calculation View?

A **Calculation View** is a virtual data model built *on top of* tables. It defines how to join, filter, calculate and aggregate data — **without copying it**. When a report queries the view, HANA runs the logic in-memory at that moment.

Think of it as a smart, reusable "lens" over your tables that always returns live data.

## The modern modeling artifact

Older HANA had three view types — **Attribute Views** (master data), **Analytic Views** (facts + measures), and **Calculation Views**. Modern HANA **consolidates everything into Calculation Views**; attribute and analytic views are deprecated. So today you build (almost) everything as a Calculation View.

## Two flavors

- **Dimension** — descriptive/master data (customers, materials, regions)
- **Cube (with star join)** — facts plus measures, joined to dimensions, for analytics

## How you build one (graphical modeling)

You assemble **nodes** in a visual editor, data flowing bottom-to-top:

1. **Projection** — pick a table, choose columns, filter rows
2. **Join** — combine tables (inner, left outer, etc.)
3. **Aggregation** — define measures (SUM, COUNT) and group by attributes
4. **Union** — stack results from multiple sources
5. **Semantics** — label fields as **attributes** (group-by) vs **measures** (aggregate), set currencies, hierarchies

## Why models beat copying data

Because the view is **virtual**, there's no duplicated, stale data — it always reflects the live tables. And once built, the same view powers many reports, Fiori analytical apps, and even ABAP CDS consumption.

## Calculation Views vs CDS Views

You'll also hear about **CDS views** (defined in ABAP/HANA as code). Both create virtual models. Rule of thumb: in **S/4HANA, CDS views are the strategic, recommended** approach (they live in the ABAP layer and travel with transports); **graphical Calculation Views** remain common in native HANA / data-warehouse scenarios.`,
    keyTitle: "Calculation Views = Reusable Virtual Data Models",
    keyBody: `A **Calculation View** shapes raw HANA tables into business-meaningful, reusable models (joins, filters, aggregations) **without copying data** — results are computed live in-memory. Modern HANA consolidates the old Attribute/Analytic views into **Calculation Views** (Dimension or Cube). You mark fields as **attributes** (group-by) or **measures** (aggregate). In **S/4HANA, CDS views** are the strategic alternative built in the ABAP layer.`,
    flowchart: {
      title: "Building a Calculation View",
      nodes: [
        node("proj", 40, 200, "1️⃣ Projection\nPick table + filter", PALETTE[0]),
        node("join", 240, 200, "2️⃣ Join\nCombine tables", PALETTE[1]),
        node("agg", 440, 200, "3️⃣ Aggregation\nMeasures + group by", PALETTE[2]),
        node("sem", 640, 200, "4️⃣ Semantics\nAttributes vs measures", PALETTE[3], true),
        node("consume", 840, 200, "📈 Consumed by\nFiori / BW / CDS", PALETTE[4], true),
      ],
      edges: [edge("proj", "join"), edge("join", "agg"), edge("agg", "sem"), edge("sem", "consume")],
      details: [
        { nodeId: "proj", title: "Projection", description: "Selects a source table, the columns you need, and applies row filters. The starting point of the data flow.", tips: "Filter as early as possible so less data flows up the model." },
        { nodeId: "join", title: "Join", description: "Combines tables — e.g. facts to master data. Star joins connect a central fact to multiple dimension sources.", tips: "Choose join type carefully; left outer keeps unmatched facts." },
        { nodeId: "agg", title: "Aggregation", description: "Defines measures (SUM, COUNT, MIN/MAX) and the attributes to group by. This is where numbers get summarized.", tips: "Aggregation happens in-memory at query time, on live data." },
        { nodeId: "sem", title: "Semantics layer", description: "Labels each output field as an attribute (group-by dimension) or a measure (aggregatable number), and sets currency/unit, hierarchies, and descriptions.", tips: "Correct attribute/measure tagging is what makes the view usable by analytics tools." },
        { nodeId: "consume", title: "Consumption", description: "The finished view is queried by Fiori analytical apps, SAP Analytics Cloud, BW, or exposed through CDS/OData — reused across many reports.", tips: "Build once, reuse everywhere — the payoff of virtual modeling." },
      ],
    },
    questions: [
      { q: "What is the main advantage of a Calculation View being 'virtual'?", e: "A virtual view doesn't copy data — it computes results live from the underlying tables at query time, so the data is never stale and there's no duplicate to maintain.", opts: [["It computes live results from source tables without copying data", true], ["It permanently stores a second copy of the data", false], ["It only works offline", false], ["It deletes the source tables", false]] },
      { q: "In modern HANA, which view type are Attribute and Analytic views consolidated into?", e: "Modern HANA deprecates Attribute and Analytic views and consolidates modeling into Calculation Views (Dimension or Cube types).", opts: [["Calculation Views", true], ["Excel pivot tables", false], ["Row store tables", false], ["ABAP reports", false]] },
      { q: "In the semantics layer, what's the difference between an attribute and a measure?", e: "Attributes are descriptive fields you group by (region, month); measures are numeric values you aggregate (revenue, quantity). Tagging them correctly makes the model usable by analytics tools.", opts: [["Attributes are group-by dimensions; measures are aggregatable numbers", true], ["Attributes are numbers; measures are text", false], ["They are identical", false], ["Measures are user passwords", false]] },
    ],
  });

  await makeLesson({
    moduleId: hana.id,
    slug: "hana-sqlscript-procedures",
    title: "SQLScript & Stored Procedures",
    order: 4,
    minutes: 11,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "MEDIUM",
    story: `A graphical Calculation View handles most modeling, but sometimes you need real logic: loops, conditions, multi-step calculations. For that, HANA gives you **SQLScript** — its procedural extension to SQL — and **stored procedures** that run that logic *inside* the database.`,
    content: `## What is SQLScript?

**SQLScript** is HANA's extension to standard SQL. Where plain SQL is a single query, SQLScript lets you write **multi-step logic**: declare variables, build intermediate table results, branch with IF, and combine many statements into one optimized unit.

Its superpower is **pushing logic down to the data**: instead of pulling millions of rows up to an application and looping there, you run the calculation where the data already lives — in HANA's memory.

## Stored Procedures

A **stored procedure** is named, reusable SQLScript logic stored in the database:

\`\`\`sql
CREATE PROCEDURE get_top_customers (IN min_amt DECIMAL, OUT result TABLE(...))
LANGUAGE SQLSCRIPT AS
BEGIN
  result =
    SELECT customer_id, SUM(amount) AS total
    FROM sales
    GROUP BY customer_id
    HAVING SUM(amount) > :min_amt;
END;
\`\`\`

- **IN / OUT** parameters pass data in and results back (\`:min_amt\` references an input)
- Procedures can return **table variables** — intermediate results you build step by step

## Table variables and the golden rule

SQLScript favors **set-based** thinking — operate on whole tables at once:
\`\`\`sql
lt_big = SELECT * FROM orders WHERE amount > 1000;
lt_sum = SELECT region, SUM(amount) FROM :lt_big GROUP BY region;
\`\`\`
Each step produces a table the next step consumes. **Avoid row-by-row loops** (imperative cursors) where a set operation works — the optimizer parallelizes set logic across CPU cores.

## Functions vs Procedures

- **Procedure** — can have multiple outputs and side effects; called with CALL
- **Table function** — returns exactly one table; can be used inside a SELECT/FROM (great for reuse in views)

## Where this fits

SQLScript powers complex Calculation View logic, AMDP methods in ABAP (next module), and any heavy data crunching you want to keep close to the data for speed.`,
    keyTitle: "SQLScript = Procedural SQL That Runs in the Database",
    keyBody: `**SQLScript** extends SQL with variables, conditions and multi-step **table variables**, so you can push complex logic **down into HANA** instead of looping in the application. A **stored procedure** is named, reusable SQLScript with **IN/OUT** parameters; a **table function** returns one table usable inside a SELECT. Prefer **set-based** steps over row-by-row loops so HANA can parallelize.`,
    flowchart: {
      title: "Code Pushdown with SQLScript",
      nodes: [
        node("app", 60, 120, "🐌 Old way\nApp loops over rows", PALETTE[5]),
        node("push", 60, 260, "⚡ Pushdown\nLogic runs in HANA", PALETTE[0], true),
        node("proc", 300, 260, "📦 Stored Procedure\nIN/OUT params", PALETTE[1]),
        node("tabvar", 540, 260, "🧮 Table Variables\nSet-based steps", PALETTE[2]),
        node("fast", 780, 260, "🚀 Parallelized\nResult", PALETTE[4], true),
      ],
      edges: [edge("app", "push"), edge("push", "proc"), edge("proc", "tabvar"), edge("tabvar", "fast")],
      details: [
        { nodeId: "app", title: "The slow pattern", description: "Pulling millions of rows into the application and looping there wastes time moving data over the network and processing it row by row.", tips: "Moving data is often slower than processing it." },
        { nodeId: "push", title: "Code pushdown", description: "SQLScript runs the logic inside HANA, right next to the data in memory — far less data movement, far faster.", tips: "The mantra: 'do the work where the data lives'." },
        { nodeId: "proc", title: "Stored procedure", description: "Named, reusable SQLScript with IN/OUT parameters, invoked with CALL. Encapsulates multi-step logic.", tips: "Table functions are similar but return exactly one table, usable in SELECT." },
        { nodeId: "tabvar", title: "Table variables", description: "Intermediate table results built step by step; each step feeds the next. Encourages set-based processing.", tips: "Reference a previous variable with a colon, e.g. :lt_big." },
        { nodeId: "fast", title: "Parallel execution", description: "Set-based statements let HANA's optimizer split work across CPU cores, unlike sequential row loops.", tips: "Avoid imperative cursors/loops when a set operation will do." },
      ],
    },
    questions: [
      { q: "What is the key idea behind 'code pushdown' in SQLScript?", e: "Pushdown means running the logic inside HANA, close to the data, instead of pulling rows up to the application and processing them there — minimizing data movement and maximizing speed.", opts: [["Run logic inside the database, close to the data", true], ["Push code to a Git repository", false], ["Download the database to the laptop", false], ["Delay processing until midnight", false]] },
      { q: "Why does SQLScript favor set-based steps over row-by-row loops?", e: "Set-based statements let HANA's optimizer parallelize the work across CPU cores; sequential row-by-row cursors run serially and are much slower.", opts: [["Set operations can be parallelized across CPU cores", true], ["Loops are not allowed in any database", false], ["Row loops use more disk space only", false], ["Set operations email the results", false]] },
      { q: "What does a stored procedure's IN/OUT define?", e: "IN and OUT are parameters: IN passes values into the procedure, OUT returns results (often as table variables) back to the caller.", opts: [["Parameters passed into and returned out of the procedure", true], ["The database's network ports", false], ["Which user is logged in", false], ["The screen resolution", false]] },
    ],
  });

  await makeLesson({
    moduleId: hana.id,
    slug: "hana-tools-studio-cockpit",
    title: "HANA Tools: Studio, Web IDE & Cockpit",
    order: 5,
    minutes: 9,
    difficulty: "BEGINNER",
    xp: 70,
    importance: "MEDIUM",
    story: `You know what HANA is and how models and SQLScript work. But where do you actually *do* this work — and who keeps the database healthy? HANA has a small family of tools, each for a different job and a different role.`,
    content: `## The HANA toolset

| Tool | Who uses it | For what |
|------|-------------|----------|
| **HANA Studio** (Eclipse) | Developers/modelers (older) | Modeling, SQL, admin — the classic all-in-one |
| **Web IDE / Business Application Studio** | Developers (modern) | Browser-based development, HDI/CAP projects |
| **Database Explorer** | Developers | Browse catalog, run SQL, inspect objects |
| **HANA Cockpit** | Administrators | Monitor health, performance, backups, users |
| **HDBSQL** | Anyone (CLI) | Command-line SQL access |

## The shift to browser-based

Older HANA used **HANA Studio**, a desktop Eclipse application. Modern HANA (especially **HANA Cloud**) has moved to **browser-based** tools — the **Web IDE / SAP Business Application Studio** for development and **Database Explorer** for catalog browsing and SQL.

## HANA Cockpit — the admin home

**HANA Cockpit** is the web console administrators use to:

- Monitor system health, memory and CPU usage
- Review **performance** (expensive statements, threads)
- Manage **backups & recovery**
- Administer **users, roles and privileges**
- Configure system settings

## Roles, at a glance

- A **HANA developer/modeler** builds Calculation Views, writes SQLScript, and develops apps (Web IDE / BAS, Database Explorer).
- A **HANA administrator** (often overlapping with BASIS) keeps the database healthy, secure and backed up (HANA Cockpit).

## Why know all of these

In interviews and on the job, you'll be asked "where would you do X?" — knowing that **modeling/dev lives in Web IDE/Database Explorer** while **monitoring/backups live in HANA Cockpit** signals you understand how a real HANA landscape is operated.`,
    keyTitle: "Right Tool for the Job: Dev vs Admin",
    keyBody: `HANA development/modeling happens in **HANA Studio** (older, Eclipse) or the modern **Web IDE / Business Application Studio** plus **Database Explorer** (run SQL, browse the catalog). Database administration — health, performance, **backups**, users — happens in **HANA Cockpit**. Modern HANA, especially **HANA Cloud**, is browser-based rather than desktop.`,
    flowchart: {
      title: "HANA Tools by Role",
      nodes: [
        node("dev", 80, 60, "👩‍💻 Developer / Modeler", PALETTE[1], true),
        node("admin", 80, 300, "🛠️ Administrator", PALETTE[3], true),
        node("webide", 380, 30, "🌐 Web IDE / BAS\nBuild apps & models", PALETTE[0]),
        node("dbx", 380, 130, "🔎 Database Explorer\nSQL + catalog", PALETTE[2]),
        node("cockpit", 380, 300, "📟 HANA Cockpit\nHealth, backups, users", PALETTE[4]),
      ],
      edges: [edge("dev", "webide"), edge("dev", "dbx"), edge("admin", "cockpit")],
      details: [
        { nodeId: "dev", title: "Developer / modeler", description: "Builds Calculation Views, writes SQLScript, and develops HANA/CAP applications.", tips: "Increasingly works in the browser, not desktop Eclipse." },
        { nodeId: "admin", title: "Administrator", description: "Keeps the database healthy: monitoring, tuning, backup/recovery, and security. Often overlaps with the BASIS role.", tips: "On HANA Cloud, much infrastructure admin is handled by SAP." },
        { nodeId: "webide", title: "Web IDE / Business Application Studio", description: "Browser-based development environment for HANA (HDI) and CAP projects — the modern successor to HANA Studio for dev work.", tips: "BAS is the same tool used for Fiori development." },
        { nodeId: "dbx", title: "Database Explorer", description: "Browse the HANA catalog (tables, views, procedures) and run SQL interactively.", tips: "Your go-to for ad-hoc SQL and inspecting objects." },
        { nodeId: "cockpit", title: "HANA Cockpit", description: "The web admin console: monitor memory/CPU, analyze expensive statements, manage backups and users.", tips: "If a question is about monitoring or backups, the answer is Cockpit." },
      ],
    },
    questions: [
      { q: "Which tool do administrators use to monitor health and manage backups?", e: "HANA Cockpit is the web-based administration console for monitoring system health/performance, managing backups and recovery, and administering users.", opts: [["HANA Cockpit", true], ["Database Explorer", false], ["Microsoft Excel", false], ["SE38", false]] },
      { q: "How has HANA tooling evolved in modern HANA / HANA Cloud?", e: "It has shifted from the desktop Eclipse-based HANA Studio to browser-based tools — Web IDE / Business Application Studio for development and Database Explorer for SQL/catalog.", opts: [["From desktop (HANA Studio) toward browser-based tools", true], ["From browser tools back to punch cards", false], ["It removed all development tools", false], ["Everything now runs only in Excel", false]] },
      { q: "Where would a developer run ad-hoc SQL and browse tables/views?", e: "Database Explorer is the developer tool for browsing the HANA catalog and running interactive SQL.", opts: [["Database Explorer", true], ["HANA Cockpit", false], ["PFCG", false], ["The backup scheduler", false]] },
    ],
  });

  await makeLesson({
    moduleId: hana.id,
    slug: "hana-cloud-and-native-dev",
    title: "HANA Cloud & Native Development",
    order: 6,
    minutes: 11,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story: `Your company doesn't want to buy and babysit physical HANA servers anymore. They want the same in-memory power, but as a managed cloud service that scales on demand. That's **SAP HANA Cloud** — and it's where new HANA development increasingly happens.`,
    content: `## What is SAP HANA Cloud?

**SAP HANA Cloud** is the fully-managed, cloud version of HANA, delivered as a service on **SAP BTP**. SAP runs the infrastructure, patching, and high availability; you consume the database and pay for what you use.

Key capabilities:
- **Elastic scaling** — grow compute/memory on demand; storage can tier to cheaper disk
- **Native Storage Extension (NSE)** — keep "warm" data on disk to save RAM cost, hot data in memory
- **Data Lake** — an integrated store for huge volumes of less-frequently-used data
- **Single gateway** — connect to many sources via virtual tables (data federation)

## Native HANA development: HDI

When you build directly on HANA (not through ABAP), you use **HDI — the HANA Deployment Infrastructure**. HDI manages database objects (tables, views, procedures) **as code** in **containers**, so deployments are repeatable and isolated.

A typical native project (in Business Application Studio) contains design-time files:
- \`.hdbtable\` — table definitions
- \`.hdbcalculationview\` — calculation views
- \`.hdbprocedure\` — SQLScript procedures
- \`.hdbrole\` — roles/privileges

These are **deployed** into an HDI container, which creates the runtime objects. Everything is source-controlled and CI/CD-friendly.

## Two development worlds

- **Native HANA (HDI / CAP)** — build apps and models directly on HANA, deployed via BTP. Great for side-by-side extensions and custom data apps.
- **Embedded in S/4HANA (CDS in ABAP)** — model with CDS views in the ABAP layer; the strategic path for extending S/4 itself.

## Why this matters

"HANA on BTP" is the foundation for modern SAP extensions: CAP apps, the SAP Analytics Cloud, and AI services all sit on HANA Cloud. Knowing that HANA development is now **code-based, container-deployed and cloud-delivered** puts you in step with where SAP is heading.`,
    keyTitle: "HANA Cloud = Managed HANA on BTP, Deployed as Code",
    keyBody: `**SAP HANA Cloud** is the fully-managed HANA service on **BTP**: elastic scaling, **Native Storage Extension** (warm data on disk to save RAM), and an integrated **Data Lake**. Native development uses **HDI (HANA Deployment Infrastructure)** — database objects defined **as code** (\`.hdbtable\`, \`.hdbcalculationview\`, \`.hdbprocedure\`) and deployed into **containers**, typically from Business Application Studio. For extending S/4 itself, **CDS views in ABAP** are the strategic path.`,
    flowchart: {
      title: "Native HANA Development Flow",
      nodes: [
        node("design", 40, 200, "📝 Design-time files\n.hdbtable / .hdbview", PALETTE[1]),
        node("bas", 250, 200, "🌐 Build in BAS\nProject + git", PALETTE[0]),
        node("hdi", 460, 200, "📦 Deploy to HDI\nContainer", PALETTE[2], true),
        node("runtime", 670, 200, "🗄️ Runtime objects\nin HANA Cloud", PALETTE[4], true),
        node("consume", 880, 200, "🔌 Consumed by\nCAP / Fiori / SAC", PALETTE[3]),
      ],
      edges: [edge("design", "bas"), edge("bas", "hdi"), edge("hdi", "runtime"), edge("runtime", "consume")],
      details: [
        { nodeId: "design", title: "Design-time as code", description: "Database objects are defined in source files (.hdbtable, .hdbcalculationview, .hdbprocedure, .hdbrole) rather than clicked into existence — so they're versionable.", tips: "Design-time vs runtime: the file describes it; deployment builds it." },
        { nodeId: "bas", title: "Business Application Studio", description: "The browser IDE where you build the HANA project, connect to git, and manage the build.", tips: "Same tool used for Fiori and CAP development." },
        { nodeId: "hdi", title: "HDI container", description: "The HANA Deployment Infrastructure deploys design-time files into an isolated container, creating runtime objects repeatably.", tips: "Containers isolate schemas so multiple apps/teams don't collide." },
        { nodeId: "runtime", title: "Runtime in HANA Cloud", description: "The actual tables, views and procedures now live in HANA Cloud, managed by SAP with elastic scaling and NSE for cost control.", tips: "Hot data in RAM, warm data on disk via Native Storage Extension." },
        { nodeId: "consume", title: "Consumption", description: "CAP services, Fiori apps, and SAP Analytics Cloud query these objects to deliver the end-user experience.", tips: "HANA Cloud is the data foundation for BTP extensions." },
      ],
    },
    questions: [
      { q: "What is SAP HANA Cloud?", e: "HANA Cloud is the fully-managed, cloud-delivered version of HANA running on SAP BTP, with elastic scaling and features like Native Storage Extension and an integrated data lake.", opts: [["A fully-managed HANA database delivered as a service on BTP", true], ["A desktop app for editing spreadsheets", false], ["A replacement for the Fiori launchpad", false], ["An on-premise-only product with no cloud option", false]] },
      { q: "What does HDI (HANA Deployment Infrastructure) provide?", e: "HDI manages HANA database objects as code in isolated containers, so deployments of tables/views/procedures are repeatable, source-controlled, and isolated between projects.", opts: [["Code-based, container-isolated deployment of HANA database objects", true], ["A way to print reports to PDF", false], ["A payroll calculation engine", false], ["A replacement for ABAP", false]] },
      { q: "What does Native Storage Extension (NSE) help with?", e: "NSE lets you keep less-frequently-used 'warm' data on disk while hot data stays in memory, reducing RAM cost without giving up HANA's performance where it matters.", opts: [["Keeping warm data on disk to reduce in-memory (RAM) cost", true], ["Encrypting user passwords", false], ["Designing Fiori screens", false], ["Sending data to Excel", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // ABAP — modern additions (orders 11–15)
  // ════════════════════════════════════════════════
  console.log("\n💻 ABAP additions");

  await makeLesson({
    moduleId: abap.id,
    slug: "abap-on-hana-amdp",
    title: "ABAP on HANA & Code Pushdown",
    order: 19,
    minutes: 11,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story: `A classic ABAP report pulls 5 million rows into an internal table, then loops to calculate totals. It's slow. On HANA, that's backwards — you're hauling data out of the fastest part of the system to process it in the slowest. The fix is **code pushdown**: let HANA do the heavy lifting.`,
    content: `## The paradigm shift

In traditional ABAP, the golden rule was "keep logic in the application server." On HANA, the rule flips: **push data-intensive logic down to the database**, because HANA processes data in-memory far faster than looping in ABAP.

This is the **"code-to-data"** paradigm.

## Three ways to push down

1. **Open SQL (modern)** — do aggregation/joins in the SELECT itself instead of looping:
\`\`\`abap
SELECT region, SUM( amount ) AS total
  FROM sales
  GROUP BY region
  INTO TABLE @DATA(lt_totals).
\`\`\`
2. **CDS Views** — define reusable, pushed-down models in the ABAP layer (the strategic choice).
3. **AMDP** — for complex logic that needs SQLScript.

## AMDP — ABAP Managed Database Procedures

An **AMDP** lets you write **SQLScript inside an ABAP class method**. The method body runs *as a procedure in HANA*, but it's managed and transported like normal ABAP:

\`\`\`abap
CLASS zcl_sales IMPLEMENTATION.
  METHOD get_totals BY DATABASE PROCEDURE
                    FOR HDB LANGUAGE SQLSCRIPT.
    result = SELECT region, SUM(amount) AS total
             FROM sales GROUP BY region;
  ENDMETHOD.
ENDCLASS.
\`\`\`

- Marked **BY DATABASE PROCEDURE ... FOR HDB LANGUAGE SQLSCRIPT**
- Runs only on HANA (database-specific)
- Use it when CDS isn't enough and you need real SQLScript logic

## When to use what

| Need | Use |
|------|-----|
| Simple aggregation/join | Open SQL (GROUP BY in SELECT) |
| Reusable model consumed everywhere | **CDS View** |
| Complex procedural logic | **AMDP** |
| Row-by-row app logic | Last resort — only if it can't be pushed down |

## The takeaway

On HANA, performance comes from **not** moving data unnecessarily. Replace SELECT-then-LOOP patterns with pushed-down SQL, CDS, or AMDP.`,
    keyTitle: "Code-to-Data: Push Logic Down to HANA",
    keyBody: `On HANA, reverse the old habit of looping in ABAP — **push data-intensive logic to the database** ("code-to-data"). Do it via modern **Open SQL** (aggregations/joins in the SELECT), **CDS views** (the strategic, reusable choice), or **AMDP** (SQLScript inside an ABAP class method, marked \`BY DATABASE PROCEDURE ... FOR HDB LANGUAGE SQLSCRIPT\`) for complex logic. Avoid SELECT-then-LOOP over huge datasets.`,
    flowchart: {
      title: "Choosing a Pushdown Technique",
      nodes: [
        node("need", 360, 40, "❓ What does the logic need?", PALETTE[5], true),
        node("simple", 60, 190, "➕ Simple aggregate/join", PALETTE[1]),
        node("reuse", 360, 190, "♻️ Reusable model", PALETTE[2]),
        node("complex", 660, 190, "🧮 Complex procedural", PALETTE[3]),
        node("osql", 60, 330, "Open SQL\nGROUP BY in SELECT", PALETTE[0], true),
        node("cds", 360, 330, "CDS View", PALETTE[0], true),
        node("amdp", 660, 330, "AMDP (SQLScript)", PALETTE[0], true),
      ],
      edges: [edge("need", "simple"), edge("need", "reuse"), edge("need", "complex"), edge("simple", "osql"), edge("reuse", "cds"), edge("complex", "amdp")],
      details: [
        { nodeId: "need", title: "Start from the requirement", description: "Pick the lightest tool that pushes the work to HANA. Don't reach for AMDP if Open SQL or CDS will do.", tips: "Simplest pushdown that works wins." },
        { nodeId: "simple", title: "Simple aggregation/join", description: "Totals, counts, joins across a few tables.", tips: "Modern Open SQL supports GROUP BY, SUM, CASE, joins." },
        { nodeId: "reuse", title: "Reusable model", description: "Logic many programs/apps will consume and that should travel with transports.", tips: "CDS lives in the ABAP layer and is the strategic choice in S/4." },
        { nodeId: "complex", title: "Complex procedural logic", description: "Multi-step calculations, conditional table building — beyond a single SELECT.", tips: "This is where SQLScript/AMDP earns its place." },
        { nodeId: "osql", title: "Open SQL", description: "Express aggregation and joins directly in the SELECT so HANA computes them — no internal-table loop.", tips: "The first thing to reach for." },
        { nodeId: "cds", title: "CDS view", description: "A named, reusable, pushed-down model defined in ABAP; consumed by reports, OData, Fiori.", tips: "Strategic for S/4HANA extensions." },
        { nodeId: "amdp", title: "AMDP", description: "SQLScript inside an ABAP class method, executed as a HANA procedure but transported like ABAP. HANA-specific.", tips: "Marked BY DATABASE PROCEDURE FOR HDB LANGUAGE SQLSCRIPT." },
      ],
    },
    questions: [
      { q: "What is the 'code-to-data' paradigm on HANA?", e: "Code-to-data means moving data-intensive logic down to the database (close to the data) instead of pulling large datasets into ABAP and looping — the opposite of the classic ABAP rule.", opts: [["Push data-intensive logic down to the database instead of looping in ABAP", true], ["Email code to the data team", false], ["Store ABAP code inside data tables", false], ["Always loop row by row in ABAP", false]] },
      { q: "What is an AMDP?", e: "An ABAP Managed Database Procedure is an ABAP class method whose body is SQLScript, executed as a procedure in HANA but managed/transported like ABAP. It's marked BY DATABASE PROCEDURE FOR HDB LANGUAGE SQLSCRIPT.", opts: [["An ABAP class method containing SQLScript that runs in HANA", true], ["A type of Fiori tile", false], ["A backup tool", false], ["A spreadsheet macro", false]] },
      { q: "For a reusable model consumed by reports, OData and Fiori in S/4HANA, what's the strategic choice?", e: "CDS views are the strategic, reusable pushdown artifact in the ABAP layer — consumed across reports, OData services, and Fiori, and they travel with transports.", opts: [["A CDS view", true], ["A row-by-row LOOP", false], ["A printed report", false], ["An Excel macro", false]] },
    ],
  });

  await makeLesson({
    moduleId: abap.id,
    slug: "abap-odata-gateway",
    title: "Building OData Services",
    order: 20,
    minutes: 11,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story: `Your beautiful Fiori app needs data from SAP. But a browser can't run ABAP or open a database connection — it speaks HTTP and JSON. Something must translate between the SAP backend and the web front-end. That translator is an **OData service**, and SAP Gateway is what exposes it.`,
    content: `## What is OData?

**OData** (Open Data Protocol) is a REST-based standard for exposing data over HTTP. It defines how to **read and change** data using normal web verbs and URLs, returning JSON or XML. It's the contract between SAP backends and Fiori/web/mobile front-ends.

A request looks like a URL:
\`\`\`
GET /sap/opu/odata/sap/ZTRAVEL_SRV/TravelSet?$filter=Status eq 'OPEN'&$top=20
\`\`\`
- **$filter, $top, $orderby, $expand** — query options the client can use
- The service returns matching records as JSON

## SAP Gateway — the front door

**SAP Gateway** is the component that exposes ABAP data as OData services over HTTP. The classic build tool is the **Service Builder (SEGW)**, where you define an **entity** (the data shape) and implement methods like **GET_ENTITYSET** (read a list) and **CREATE_ENTITY**.

## Two ways to build, old vs new

| Approach | How |
|----------|-----|
| **SEGW (classic)** | Model entities in Service Builder, code DPC/MPC methods by hand |
| **CDS + auto-exposure** | Annotate a CDS view (\`@OData.publish: true\`) and SAP generates the service |
| **RAP service binding (modern)** | Bind a RAP business object → OData V2/V4 service |

Modern projects favor **RAP/CDS** over hand-coded SEGW, but SEGW is still common in existing systems and interviews.

## V2 vs V4

OData has two main versions; **V4** is newer, leaner, and the strategic default for new Fiori. (Next-level detail is covered in the Fiori module.)

## The end-to-end picture

Database → CDS/ABAP logic → **OData service (Gateway)** → HTTP/JSON → **Fiori app**. The OData service is the hinge between back-end and front-end.`,
    keyTitle: "OData = The HTTP/JSON Contract Between SAP and the UI",
    keyBody: `**OData** is a REST standard for reading and changing SAP data over HTTP (JSON), with query options like \`$filter\`, \`$top\`, \`$expand\`. **SAP Gateway** exposes ABAP data as OData. Build it classically in **SEGW** (define entities, implement GET_ENTITYSET/CREATE_ENTITY), via **CDS auto-exposure** (\`@OData.publish\`), or — the modern way — a **RAP service binding**. It's the hinge between the SAP back-end and Fiori/web/mobile front-ends.`,
    flowchart: {
      title: "Backend to Fiori via OData",
      nodes: [
        node("db", 40, 200, "🗄️ Data + Logic\nTables / CDS", PALETTE[5]),
        node("build", 250, 200, "🧱 Define Service\nSEGW / CDS / RAP", PALETTE[1]),
        node("gw", 460, 200, "🚪 SAP Gateway\nExpose OData", PALETTE[2], true),
        node("http", 670, 200, "🌐 HTTP + JSON\n$filter, $top", PALETTE[3]),
        node("fiori", 880, 200, "📱 Fiori / Web App", PALETTE[4], true),
      ],
      edges: [edge("db", "build"), edge("build", "gw"), edge("gw", "http"), edge("http", "fiori")],
      details: [
        { nodeId: "db", title: "Data + logic", description: "The data in tables and the ABAP/CDS logic that selects and shapes it.", tips: "Push logic down with CDS where possible." },
        { nodeId: "build", title: "Define the service", description: "Choose how to build: SEGW Service Builder (classic), CDS @OData.publish (auto), or RAP service binding (modern).", tips: "New projects lean RAP/CDS; legacy systems often have SEGW services." },
        { nodeId: "gw", title: "SAP Gateway", description: "The component that publishes the service as OData reachable over HTTP at a /sap/opu/odata/... URL.", tips: "Gateway can be embedded in the backend or run as a hub." },
        { nodeId: "http", title: "HTTP + JSON", description: "Clients call the service with standard web requests and OData query options, getting JSON back.", tips: "$filter, $orderby, $top, $expand are the workhorse options." },
        { nodeId: "fiori", title: "Fiori / web app", description: "The front-end consumes the OData service to read and write business data without knowing any ABAP.", tips: "Same service can feed Fiori, mobile, or external integrations." },
      ],
    },
    questions: [
      { q: "What is OData used for in SAP?", e: "OData is a REST/HTTP standard for exposing SAP data so front-ends (Fiori, web, mobile) can read and change it using URLs and JSON — the contract between backend and UI.", opts: [["A REST/HTTP standard to expose SAP data (JSON) to front-ends", true], ["A database backup format", false], ["A printer driver", false], ["A type of user role", false]] },
      { q: "What is SEGW?", e: "SEGW (Service Builder) is the classic transaction to model OData entities and implement their methods (like GET_ENTITYSET) by hand. Modern alternatives are CDS auto-exposure and RAP service bindings.", opts: [["The classic Service Builder for modelling/coding OData services", true], ["A HANA backup tool", false], ["A Fiori theme designer", false], ["A payroll transaction", false]] },
      { q: "Which OData query option limits how many records are returned?", e: "$top limits the number of records returned (e.g. $top=20). $filter restricts which records, $orderby sorts, $expand pulls in related entities.", opts: [["$top", true], ["$delete", false], ["$login", false], ["$backup", false]] },
    ],
  });

  await makeLesson({
    moduleId: abap.id,
    slug: "abap-data-migration-tools",
    title: "Data Migration: LSMW, LTMC & BDC",
    order: 21,
    minutes: 10,
    difficulty: "INTERMEDIATE",
    xp: 80,
    importance: "MEDIUM",
    story: `Go-live is in three weeks. The client has 80,000 customers, 50,000 materials, and years of open balances sitting in their old system — all of which must land cleanly in SAP. Nobody is typing that in by hand. This is **data migration**, and ABAP developers own the tooling that moves it.`,
    content: `## The problem

Every SAP implementation must load **legacy master and transactional data** (customers, vendors, materials, open items…) into the new system, reliably and in bulk. Doing it through the normal screens manually is impossible at scale.

## The toolbox

| Tool | Era | What it is |
|------|-----|-----------|
| **BDC** | Classic | Batch Data Communication — replays screen entry programmatically (Call Transaction / session) |
| **LSMW** | Classic | Legacy System Migration Workbench — guided mapping + load, low/no code |
| **LTMC / Migration Cockpit** | S/4HANA | Modern, template-driven migration (the current standard) |

## BDC — automating the screens

**BDC** records the keystrokes of a transaction (e.g. XK01 to create a vendor) into a **BDC table**, then replays it for thousands of records:
- **Call Transaction** — runs the transaction directly, returns messages immediately
- **Session method** — queues records into a session processed via SM35 (better error handling)

It's robust but screen-dependent.

## LSMW — the classic workhorse

**LSMW** guides you through a standard sequence: read the source file, **map** its fields to SAP fields, convert values, and import — using standard methods (batch input, BAPI, IDoc) with minimal coding. Hugely popular in ECC.

## Migration Cockpit (LTMC) — the S/4 way

In **S/4HANA**, SAP provides the **Migration Cockpit**: download a pre-built **migration template** (spreadsheet/XML) for each object, fill it, upload, **validate**, and **migrate**. It uses SAP-delivered, BAPI-based load logic, so it's safer and far less manual than BDC/LSMW. This is the recommended tool today.

## The common pattern

Whatever the tool: **Extract → Map/Transform → Validate → Load → Reconcile**. Validation and reconciliation (did every record arrive correctly?) matter as much as the load itself.`,
    keyTitle: "Load Legacy Data in Bulk — Use the Right Tool",
    keyBody: `SAP go-lives require bulk-loading legacy master/transactional data. Classic tools: **BDC** (replays transaction screens via Call Transaction or SM35 sessions) and **LSMW** (guided field mapping + standard load methods, low-code). In **S/4HANA**, the recommended tool is the **Migration Cockpit (LTMC)** — fill SAP-delivered templates, validate, then migrate using BAPI-based logic. The universal pattern is **Extract → Map → Validate → Load → Reconcile**.`,
    flowchart: {
      title: "Data Migration Pipeline",
      nodes: [
        node("extract", 30, 200, "📤 Extract\nLegacy data", PALETTE[5]),
        node("map", 220, 200, "🔗 Map / Transform\nFields → SAP", PALETTE[1]),
        node("validate", 410, 200, "🔍 Validate\nTemplate checks", PALETTE[2], true),
        node("load", 600, 200, "📥 Load\nLTMC / LSMW / BDC", PALETTE[3], true),
        node("recon", 790, 200, "✅ Reconcile\nCounts match?", PALETTE[4], true),
      ],
      edges: [edge("extract", "map"), edge("map", "validate"), edge("validate", "load"), edge("load", "recon")],
      details: [
        { nodeId: "extract", title: "Extract", description: "Pull master/transactional data out of the legacy system into files (CSV/Excel/XML).", tips: "Cleanse obvious junk before mapping — garbage in, garbage out." },
        { nodeId: "map", title: "Map / transform", description: "Map each legacy field to its SAP target field and convert values (units, codes, date formats).", tips: "LSMW and the Migration Cockpit both center on this mapping step." },
        { nodeId: "validate", title: "Validate", description: "Check the data against SAP rules before loading — mandatory fields, valid values, referential integrity.", tips: "The Migration Cockpit validates templates before migrate." },
        { nodeId: "load", title: "Load", description: "Run the chosen tool: Migration Cockpit (S/4, recommended), LSMW (classic), or BDC (screen replay).", tips: "Prefer BAPI-based loads (Cockpit/LSMW-BAPI) over fragile screen replay." },
        { nodeId: "recon", title: "Reconcile", description: "Confirm every record arrived and totals match the source; investigate and reload errors.", tips: "Reconciliation is non-negotiable — auditors will ask." },
      ],
    },
    questions: [
      { q: "In S/4HANA, what is the recommended tool for bulk data migration?", e: "The SAP S/4HANA Migration Cockpit (LTMC) is the modern, template-driven, BAPI-based tool and the recommended approach — replacing the classic LSMW/BDC for most loads.", opts: [["The Migration Cockpit (LTMC)", true], ["Manually typing each record", false], ["HANA Cockpit backups", false], ["The Fiori launchpad", false]] },
      { q: "What does BDC (Batch Data Communication) do?", e: "BDC programmatically replays transaction screen entries for many records — via Call Transaction (immediate) or a session processed in SM35. It's robust but screen-dependent.", opts: [["Replays transaction screen entries programmatically for bulk loads", true], ["Designs Calculation Views", false], ["Encrypts the network", false], ["Creates Fiori tiles", false]] },
      { q: "Which step confirms that every record arrived correctly after loading?", e: "Reconciliation compares loaded results against the source (counts/totals) to confirm completeness and correctness — as important as the load itself.", opts: [["Reconcile", true], ["Extract", false], ["Theme the launchpad", false], ["Delete the source", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // FIORI — modern additions (orders 11–14)
  // ════════════════════════════════════════════════
  console.log("\n🎨 Fiori additions");

  await makeLesson({
    moduleId: fiori.id,
    slug: "fiori-odata-v2-vs-v4",
    title: "OData V2 vs V4 for Fiori",
    order: 11,
    minutes: 9,
    difficulty: "INTERMEDIATE",
    xp: 80,
    importance: "MEDIUM",
    story: `A developer starts a new Fiori app and must choose a data protocol version. An older tutorial says V2; SAP's newest guidance says V4. Picking wrong means rework. Which one, and why does it matter?`,
    content: `## Two generations of OData

OData is the HTTP protocol Fiori uses to talk to SAP. There are two relevant versions:

- **OData V2** — mature, everywhere in existing Fiori apps; verbose payloads
- **OData V4** — newer, leaner, more capable; **SAP's strategic default** for new apps

## What V4 improves

| Aspect | V2 | V4 |
|--------|----|----|
| Payload | Heavier (XML-ish/verbose JSON) | Leaner JSON |
| Querying | Basic | Richer (better \`$filter\`, \`$apply\` for aggregation) |
| Performance | OK | Better (fewer/lighter requests) |
| RAP support | Supported | **Preferred** |
| Future | Maintained | **Strategic direction** |

## How this connects to RAP and Fiori Elements

- A **RAP service binding** lets you publish a business object as **OData V2 or V4**.
- Modern **Fiori Elements** floorplans increasingly expect **V4**.
- New development: choose **V4** unless a constraint (legacy library, existing service) forces V2.

## Practical guidance

- **New app on S/4HANA / BTP** → OData **V4** with RAP.
- **Extending or matching an existing app** → match what's already there (often V2).
- Don't mix versions in one app without reason.

## Why interviewers ask

It's a quick signal of whether you're current. The right answer: "V4 is the strategic default; V2 is still common in existing landscapes, and RAP can expose either."`,
    keyTitle: "Prefer OData V4 for New Fiori; V2 Still Common",
    keyBody: `OData has two generations. **V2** is mature and pervasive in existing Fiori apps but heavier. **V4** is leaner, supports richer queries (\`$apply\` for aggregation), performs better, and is **SAP's strategic default** for new development — and the preferred pairing with **RAP** and modern **Fiori Elements**. Choose **V4** for new apps; use **V2** when matching an existing service.`,
    flowchart: {
      title: "Choosing an OData Version",
      nodes: [
        node("start", 360, 40, "🆕 New Fiori app?", PALETTE[5], true),
        node("newapp", 130, 190, "Yes — greenfield", PALETTE[1]),
        node("existing", 600, 190, "No — extend existing", PALETTE[3]),
        node("v4", 130, 320, "✅ OData V4 + RAP", PALETTE[0], true),
        node("v2", 600, 320, "Match existing (often V2)", PALETTE[2], true),
      ],
      edges: [edge("start", "newapp"), edge("start", "existing"), edge("newapp", "v4"), edge("existing", "v2")],
      details: [
        { nodeId: "start", title: "Start with the scenario", description: "The choice depends on whether you're building new or extending something that already speaks a version.", tips: "Consistency within one app matters." },
        { nodeId: "newapp", title: "Greenfield app", description: "A brand-new app with no legacy protocol constraint.", tips: "Free to pick the strategic option." },
        { nodeId: "existing", title: "Extending existing", description: "Adding to an app or service that already uses a specific OData version.", tips: "Don't fight the existing stack without reason." },
        { nodeId: "v4", title: "OData V4 + RAP", description: "Leaner payloads, richer querying, better performance, and the preferred pairing with RAP and modern Fiori Elements.", tips: "SAP's strategic default for new development." },
        { nodeId: "v2", title: "OData V2", description: "Mature and pervasive; choose it to stay consistent with an existing V2 service or library.", tips: "Still fully supported — just not the strategic direction." },
      ],
    },
    questions: [
      { q: "Which OData version is SAP's strategic default for new Fiori development?", e: "OData V4 is leaner, more capable, and SAP's strategic direction — the preferred choice for new apps, especially with RAP and modern Fiori Elements.", opts: [["OData V4", true], ["OData V1", false], ["OData V2", false], ["There is no V4", false]] },
      { q: "When is OData V2 still the right choice?", e: "V2 makes sense when extending or matching an existing app/service that already uses V2 — consistency avoids needless rework. It's mature and fully supported.", opts: [["When matching/extending an existing V2 service", true], ["Never, under any circumstances", false], ["Only for HANA backups", false], ["Only for payroll apps", false]] },
      { q: "Can a RAP business object be exposed as either OData version?", e: "Yes — a RAP service binding can publish the business object as OData V2 or V4, though V4 is preferred for new development.", opts: [["Yes, via the service binding (V2 or V4)", true], ["No, RAP only supports V1", false], ["No, RAP cannot produce OData", false], ["Only V2 is possible with RAP", false]] },
    ],
  });

  await makeLesson({
    moduleId: fiori.id,
    slug: "fiori-launchpad-spaces-pages",
    title: "Launchpad Spaces & Pages",
    order: 12,
    minutes: 9,
    difficulty: "BEGINNER",
    xp: 75,
    importance: "MEDIUM",
    story: `A warehouse clerk logs into Fiori and sees 60 tiles — most irrelevant to her job — scattered across a wall of groups. She wastes minutes hunting for the three apps she actually uses. SAP's answer to this clutter is the modern **Spaces & Pages** model.`,
    content: `## The launchpad, organized

The **Fiori Launchpad (FLP)** is the home screen — a set of tiles launching apps. How those tiles are organized has evolved.

## Old model: Groups

Originally, tiles were arranged into **groups** shown on one long scrolling home page. Simple, but cluttered as app counts grew.

## New model: Spaces & Pages

The current standard splits organization into two levels:

- **Space** — a role-based work area, shown as a **tab** (e.g. "Procurement", "Warehouse"). A user can have several spaces.
- **Page** — the layout *within* a space: **sections** containing tiles, arranged for that role's workflow.

So a user sees a clean set of tabs (spaces), each opening a curated page of relevant apps — instead of one giant cluttered home.

## How it's assigned

Spaces and pages are **assigned to business roles** (via the role's catalog/role setup). Because they're role-driven, each user automatically gets only the spaces relevant to their job. In **S/4HANA**, Spaces & Pages is the default and **recommended** model; the classic groups model is being phased out.

## Who builds them

- **Administrators / key users** design pages and arrange sections/tiles
- They assign spaces to **roles** so the right people see the right work areas

## Why it matters

Spaces & Pages turns the launchpad from a flat tile-dump into a structured, role-based workspace — better usability and easier governance. Expect interview questions like "how do you organize the modern Fiori Launchpad?" — the answer is **Spaces (tabs) → Pages (sections of tiles), assigned to roles**.`,
    keyTitle: "Spaces (tabs) → Pages (sections of tiles), by Role",
    keyBody: `The modern **Fiori Launchpad** organizes apps with **Spaces & Pages**, replacing the old single-page **groups** model. A **Space** is a role-based work area shown as a **tab**; a **Page** is the layout within it — **sections** of tiles. Spaces/pages are **assigned to business roles**, so users see only what's relevant. In S/4HANA this is the default, recommended model.`,
    flowchart: {
      title: "Modern Launchpad Structure",
      nodes: [
        node("role", 60, 200, "👤 Business Role", PALETTE[5], true),
        node("space", 280, 200, "🗂️ Space (tab)\nWork area", PALETTE[1], true),
        node("page", 500, 200, "📄 Page\nSections", PALETTE[2]),
        node("tiles", 720, 200, "🔲 Tiles\nApps", PALETTE[0]),
      ],
      edges: [edge("role", "space"), edge("space", "page"), edge("page", "tiles")],
      details: [
        { nodeId: "role", title: "Business role", description: "Drives everything — the role a user is assigned determines which spaces (and therefore apps) they see.", tips: "Role-based assignment is what keeps the launchpad relevant per user." },
        { nodeId: "space", title: "Space", description: "A role-based work area rendered as a tab in the launchpad (e.g. Procurement). Users can have multiple.", tips: "Replaces the idea of one giant home page." },
        { nodeId: "page", title: "Page", description: "The layout inside a space: sections that group related tiles for that workflow.", tips: "One space typically has one page in simple setups." },
        { nodeId: "tiles", title: "Tiles", description: "The individual app launchers, arranged within page sections.", tips: "Same Fiori apps as before — just organized better." },
      ],
    },
    questions: [
      { q: "In the modern Fiori Launchpad, what is a 'Space'?", e: "A Space is a role-based work area shown as a tab in the launchpad; within it, a Page lays out sections of tiles. Spaces replace the old single-page groups model.", opts: [["A role-based work area shown as a tab", true], ["A backup of the database", false], ["A single tile", false], ["A type of OData query", false]] },
      { q: "How do users end up seeing only relevant spaces?", e: "Spaces and pages are assigned to business roles, so each user automatically gets the spaces appropriate to their job.", opts: [["Spaces/pages are assigned to business roles", true], ["Every user sees every space always", false], ["Users build their own database", false], ["It's random each login", false]] },
      { q: "What did Spaces & Pages replace?", e: "It replaced the older 'groups' model, where all tiles sat in groups on one long scrolling home page — which became cluttered as app counts grew.", opts: [["The older single-page 'groups' model", true], ["The HANA database", false], ["ABAP programs", false], ["OData entirely", false]] },
    ],
  });

  await makeLesson({
    moduleId: fiori.id,
    slug: "fiori-catalogs-roles-security",
    title: "Fiori Catalogs, Groups & Roles",
    order: 13,
    minutes: 11,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story: `"I can see the tile but clicking it says Not Authorized." It's the most common Fiori support ticket on earth. Understanding why means understanding how Fiori authorizations are actually wired — through **catalogs, groups, and PFCG roles**.`,
    content: `## Two questions every app must answer

For a user to successfully use a Fiori app, two separate things must be true:

1. **Can they SEE the tile?** (front-end / launchpad authorization)
2. **Can they EXECUTE the app's actions?** (back-end authorization — OData/transaction)

A "tile visible but Not Authorized on click" almost always means #1 is granted but #2 is missing.

## The building blocks

- **Catalog** — a collection of apps/tiles a user is *allowed* to access (the authorization pool). Includes the target mappings to launch each app.
- **Group / Page section** — how allowed tiles are *displayed/organized* on the launchpad.
- **Business Role (PFCG role)** — bundles catalogs (and spaces/pages) plus the **back-end authorizations** (OData service access, S_SERVICE, transaction/object authorizations).

Key distinction: **Catalog = what you CAN access; Group/Page = what you SEE arranged.**

## How it fits together

\`\`\`
PFCG Role
 ├─ Catalog(s)        → which apps are authorized (+ target mappings)
 ├─ Space/Page (or Group) → how tiles are organized/shown
 └─ Authorization objects → back-end execution rights (incl. OData S_SERVICE)
\`\`\`
Assign the role to the user → they get the tiles **and** the rights to run them.

## Tools

- **PFCG** — the role maintenance transaction (same one used across SAP security)
- Catalogs/groups are maintained in the **Launchpad Content** tooling; modern S/4 uses **business roles** that wrap all of this.

## The golden troubleshooting rule

Tile visible but app fails → check the **back-end authorization** (OData service / authorization object) in the role, not the catalog. Tile not visible at all → check the **catalog/group (or space/page)** assignment.

## Why it matters

Fiori security is one of the most asked, least understood topics. Knowing that a role bundles **catalog (access) + group/page (display) + back-end auth (execution)** makes you the person who can actually fix the "Not Authorized" ticket.`,
    keyTitle: "Role = Catalog (access) + Page/Group (display) + Back-end Auth",
    keyBody: `Fiori authorization needs two things: seeing the tile (front-end) and running the app (back-end). A **Catalog** defines which apps a user *can* access (the authorization pool + target mappings); a **Group/Page** defines how tiles are *displayed*. A **Business/PFCG role** bundles catalogs, spaces/pages, **and** back-end authorizations (OData S_SERVICE, objects). Troubleshooting: tile missing → catalog/page; "Not Authorized" on click → back-end authorization.`,
    flowchart: {
      title: "Fiori Authorization Wiring",
      nodes: [
        node("role", 360, 40, "🎫 PFCG Business Role", PALETTE[5], true),
        node("cat", 90, 200, "📚 Catalog\nCAN access", PALETTE[1], true),
        node("grp", 360, 200, "🗂️ Group / Page\nHOW shown", PALETTE[2]),
        node("auth", 630, 200, "🔐 Back-end Auth\nOData / objects", PALETTE[3], true),
        node("user", 360, 330, "👤 User can SEE + RUN app", PALETTE[4], true),
      ],
      edges: [edge("role", "cat"), edge("role", "grp"), edge("role", "auth"), edge("cat", "user"), edge("grp", "user"), edge("auth", "user")],
      details: [
        { nodeId: "role", title: "Business / PFCG role", description: "The container assigned to users. It bundles catalogs, spaces/pages (or groups), and back-end authorizations.", tCode: "PFCG", tips: "Assign the role to the user, not the pieces individually." },
        { nodeId: "cat", title: "Catalog", description: "Defines which apps/tiles the user is authorized to access, including the target mappings used to launch them.", tips: "Catalog = the authorization pool (CAN access)." },
        { nodeId: "grp", title: "Group / Page", description: "Controls how the authorized tiles are displayed and organized on the launchpad.", tips: "Group/Page = display (what you SEE arranged)." },
        { nodeId: "auth", title: "Back-end authorization", description: "Grants the right to actually execute the app's OData service and underlying transactions/objects (e.g. S_SERVICE).", tips: "Missing here = 'tile visible but Not Authorized'." },
        { nodeId: "user", title: "User outcome", description: "With catalog + display + back-end auth all granted via the role, the user can both see and successfully run the app.", tips: "All three must align." },
      ],
    },
    questions: [
      { q: "A user can see a Fiori tile but gets 'Not Authorized' when clicking it. What's the most likely cause?", e: "Seeing the tile is front-end (catalog/group) authorization; running it needs back-end authorization (the OData service / authorization objects). 'Not Authorized on click' means the back-end auth is missing.", opts: [["The back-end authorization (OData service / objects) is missing", true], ["The screen resolution is wrong", false], ["The database is in column store", false], ["The tile color is incorrect", false]] },
      { q: "What does a Fiori Catalog define?", e: "A catalog defines which apps/tiles a user is authorized to access (the authorization pool) along with the target mappings to launch them — 'what you CAN access'.", opts: [["Which apps the user is authorized to access", true], ["The HANA backup schedule", false], ["The company's chart of accounts", false], ["The UI5 control library", false]] },
      { q: "What transaction is used to maintain the roles that bundle catalogs and authorizations?", e: "PFCG is the standard role maintenance transaction, used to build business roles bundling catalogs, spaces/pages, and back-end authorizations.", opts: [["PFCG", true], ["MIGO", false], ["SE38", false], ["F110", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // S/4HANA — additions (orders 11–13)
  // ════════════════════════════════════════════════
  console.log("\n🏢 S/4HANA additions");

  await makeLesson({
    moduleId: s4.id,
    slug: "s4hana-output-management",
    title: "Output Management & Situation Handling",
    order: 19,
    minutes: 10,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "MEDIUM",
    story: `When a sales order is saved, the customer should get a PDF order confirmation by email. In ECC this was the old NAST/condition-technique "output determination." S/4HANA introduces a new, cleaner engine — and a related feature that nudges users when something needs attention.`,
    content: `## Output Management — the modern way

**Output Management** decides *what* document (order confirmation, invoice, delivery note) goes out, *how* (print, email, EDI/XML), and *to whom*, when a business document is saved.

S/4HANA's new framework (**BRF+ based Output Management**, sometimes called OM) replaces the classic NAST/condition-technique approach for many objects:

- Rules are defined in **BRF+** (Business Rule Framework plus) — a flexible, decision-table rules engine
- Templates use modern tools (**Adobe Forms / Fiori-friendly forms**)
- Channels: **Print, Email, XML/EDI, IDoc**

Classic output determination still exists for some objects, but new development uses the BRF+ engine.

## How an output is determined

1. Document is saved (e.g. sales order)
2. The OM rules (BRF+) decide **output type**, **channel**, **receiver**, **form template**
3. The output is rendered and dispatched (e.g. PDF emailed to the customer)

## Situation Handling — proactive nudges

**Situation Handling** is a separate S/4HANA feature that **automatically flags conditions that need user attention** — e.g. "a purchase order is overdue" or "a material shortage threatens an order." Instead of users hunting for problems, the system surfaces a **situation** with context and suggested actions, often right in Fiori.

- Configured with templates (conditions + what to show + who to notify)
- Turns reactive firefighting into proactive alerts

## Why they're grouped

Both are about the system **communicating outward**: Output Management sends documents to business partners; Situation Handling sends alerts to internal users. Together they're part of S/4HANA's "intelligent, proactive" story.

## Interview-ready summary

"S/4HANA Output Management uses **BRF+** rules to determine and dispatch documents (print/email/EDI), replacing classic NAST for new objects; **Situation Handling** proactively alerts users to conditions needing attention."`,
    keyTitle: "BRF+ Output Management Sends Docs; Situation Handling Alerts Users",
    keyBody: `S/4HANA **Output Management** determines and dispatches business documents (order confirmations, invoices) via **BRF+** rules and modern form templates, across channels (**print, email, EDI/XML**) — replacing classic NAST output determination for new objects. **Situation Handling** is a separate feature that **proactively flags conditions needing attention** (overdue POs, shortages) and surfaces them with context/actions in Fiori. Both are about the system communicating outward.`,
    flowchart: {
      title: "Output Management Flow",
      nodes: [
        node("save", 40, 200, "💾 Document saved\n(e.g. sales order)", PALETTE[5]),
        node("brf", 250, 200, "📑 BRF+ Rules\nType / channel / receiver", PALETTE[1], true),
        node("form", 470, 200, "🧾 Form Template\nAdobe Forms", PALETTE[2]),
        node("send", 690, 200, "📤 Dispatch\nPrint / Email / EDI", PALETTE[0], true),
        node("situation", 470, 330, "🔔 Situation Handling\nProactive alert", PALETTE[3], true),
      ],
      edges: [edge("save", "brf"), edge("brf", "form"), edge("form", "send"), edge("save", "situation", "smoothstep")],
      details: [
        { nodeId: "save", title: "Trigger", description: "Saving a business document (sales order, invoice, delivery) triggers output determination.", tips: "Output is tied to the document lifecycle." },
        { nodeId: "brf", title: "BRF+ rules", description: "The Business Rule Framework plus evaluates decision tables to pick the output type, channel, receiver, and form.", tips: "BRF+ replaces the classic NAST/condition technique for new objects." },
        { nodeId: "form", title: "Form template", description: "A modern template (often Adobe Forms) renders the document content into a PDF or message.", tips: "Cleaner, more maintainable than SAPscript/Smart Forms." },
        { nodeId: "send", title: "Dispatch", description: "The rendered output is sent via the chosen channel: printed, emailed, or transmitted as EDI/XML/IDoc.", tips: "Email of a PDF order confirmation is the classic example." },
        { nodeId: "situation", title: "Situation Handling", description: "Separately, the system can proactively flag a condition needing attention (overdue PO, shortage) and surface it with context and suggested actions in Fiori.", tips: "Proactive alerts vs users hunting for problems." },
      ],
    },
    questions: [
      { q: "Which rules engine does S/4HANA's modern Output Management use?", e: "S/4HANA Output Management uses BRF+ (Business Rule Framework plus) decision tables to determine output type, channel, and receiver — replacing the classic NAST condition technique for new objects.", opts: [["BRF+ (Business Rule Framework plus)", true], ["Microsoft Word mail-merge", false], ["The HANA backup engine", false], ["PFCG roles", false]] },
      { q: "What does Situation Handling do?", e: "Situation Handling proactively flags conditions that need user attention (e.g. overdue POs, material shortages) and surfaces them with context and suggested actions, rather than making users hunt for problems.", opts: [["Proactively alerts users to conditions needing attention", true], ["Backs up the database nightly", false], ["Designs Fiori themes", false], ["Converts ECC to S/4HANA", false]] },
      { q: "Output Management and Situation Handling are grouped because both…", e: "Both are about the system communicating outward — Output Management dispatches documents to business partners; Situation Handling pushes alerts to internal users.", opts: [["…concern the system communicating outward (documents or alerts)", true], ["…are database backup tools", false], ["…replace the HANA database", false], ["…are only used in payroll", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // BTP — CAP addition (order 11)
  // ════════════════════════════════════════════════
  console.log("\n☁️ BTP addition");

  await makeLesson({
    moduleId: btp.id,
    slug: "btp-cap-model",
    title: "CAP — Cloud Application Programming Model",
    order: 11,
    minutes: 12,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story: `A developer needs to build a brand-new cloud app on BTP — not an extension of S/4, but a fresh service with its own data and API. RAP is for ABAP on the S/4 stack; what's the equivalent for cloud-native development? SAP's answer is **CAP — the Cloud Application Programming model**.`,
    content: `## What is CAP?

**CAP** (Cloud Application Programming model) is SAP's framework for building **business services and apps on BTP**, primarily in **Node.js** or **Java**. Where RAP is the ABAP-stack way to build apps, **CAP is the cloud-native way** — open, lightweight, and runtime-agnostic.

## The CAP philosophy

CAP is **model-driven**: you describe *what* your service is, and CAP generates much of the *how* (the OData API, database tables, generic handlers). You write custom code only where business logic actually needs it.

## The core pieces

- **CDS (Core Data Services)** — CAP's modeling language (a different, lighter CDS than ABAP CDS) to define **data models** and **services**:
\`\`\`cds
entity Books { key ID: Integer; title: String; stock: Integer; }
service CatalogService { entity Books as projection on my.Books; }
\`\`\`
- **Service layer** — CAP auto-exposes your service as **OData (V4)** with CRUD out of the box
- **Custom handlers** — add business logic in **Node.js/Java** for the parts that aren't generic
- **Database** — runs on **SAP HANA Cloud** in production (and SQLite/H2 locally for fast dev)

## What you get "for free"

From a small CDS model, CAP generates: the database schema, an OData V4 service with full CRUD, input validation, and draft handling — so you focus on the unique logic, not plumbing.

## CAP vs RAP — when to use which

| | RAP | CAP |
|---|-----|-----|
| Language | ABAP | Node.js / Java |
| Best for | Extending/building on **S/4HANA** (ABAP stack) | **Cloud-native** apps on BTP |
| Output | OData + Fiori | OData (V4) + Fiori |
| Runs on | ABAP environment | Cloud Foundry / Kyma on BTP |

Both produce OData services consumed by Fiori — they're the two modern app-building frameworks, one per stack.

## Why it matters

CAP is the backbone of side-by-side extensions and standalone BTP apps. Knowing "RAP for ABAP/S4, CAP for cloud-native Node/Java" places you squarely in modern SAP development.`,
    keyTitle: "CAP = Cloud-Native App Framework (Node/Java) on BTP",
    keyBody: `**CAP** (Cloud Application Programming model) is SAP's **model-driven** framework for building cloud-native services on BTP in **Node.js or Java**. You define **data models and services in CDS**, and CAP auto-generates the database schema and an **OData V4** CRUD service; you add **custom handlers** only where needed. It runs on **HANA Cloud** (SQLite locally). Think: **RAP = ABAP/S4 stack; CAP = cloud-native Node/Java** — both produce OData consumed by Fiori.`,
    flowchart: {
      title: "How CAP Builds a Service",
      nodes: [
        node("cds", 40, 200, "📐 CDS Model\nentities + service", PALETTE[1], true),
        node("gen", 250, 200, "⚙️ CAP generates\nschema + OData", PALETTE[0], true),
        node("odata", 470, 120, "🔌 OData V4\nCRUD service", PALETTE[2]),
        node("logic", 470, 300, "✍️ Custom handlers\nNode.js / Java", PALETTE[3]),
        node("hana", 690, 120, "⚡ HANA Cloud", PALETTE[4]),
        node("fiori", 690, 300, "📱 Fiori app", PALETTE[5]),
      ],
      edges: [edge("cds", "gen"), edge("gen", "odata"), edge("gen", "logic"), edge("odata", "hana"), edge("odata", "fiori")],
      details: [
        { nodeId: "cds", title: "CDS model", description: "Define entities (data) and services declaratively in CAP's CDS language — the 'what' of your app.", tips: "CAP CDS is lighter than ABAP CDS and runtime-agnostic." },
        { nodeId: "gen", title: "CAP generation", description: "From the model, CAP generates the database schema and a working OData service with generic CRUD handlers — the boilerplate is automatic.", tips: "Model-driven: describe it, don't hand-code the plumbing." },
        { nodeId: "odata", title: "OData V4 service", description: "The generated RESTful service exposing your entities with create/read/update/delete.", tips: "V4 by default — modern and lean." },
        { nodeId: "logic", title: "Custom handlers", description: "Add business logic in Node.js or Java only where the generic behavior isn't enough (validations, actions, calculations).", tips: "Write code for the unique 20%, not the boilerplate 80%." },
        { nodeId: "hana", title: "HANA Cloud", description: "In production the service persists to SAP HANA Cloud; locally you can use SQLite for fast iteration.", tips: "Same model, different database per environment." },
        { nodeId: "fiori", title: "Fiori app", description: "A Fiori (Elements or freestyle) UI consumes the OData service — same consumption pattern as RAP.", tips: "CAP + Fiori Elements = quick full-stack apps." },
      ],
    },
    questions: [
      { q: "What languages does CAP primarily use?", e: "CAP builds cloud-native services primarily in Node.js or Java — unlike RAP, which is the ABAP-stack framework.", opts: [["Node.js or Java", true], ["Only ABAP", false], ["Only SQL", false], ["COBOL", false]] },
      { q: "In CAP, what do you primarily write by hand versus get generated?", e: "CAP is model-driven: you define data models and services in CDS, and it generates the schema and OData CRUD service automatically — you write custom handlers only where business logic needs it.", opts: [["You write the CDS model + custom handlers; CAP generates schema & OData CRUD", true], ["You hand-code the entire OData service from scratch", false], ["You write only HTML", false], ["Nothing — CAP writes the business logic for you", false]] },
      { q: "How do RAP and CAP relate?", e: "Both are modern SAP app frameworks producing OData consumed by Fiori, but RAP is for the ABAP/S/4HANA stack while CAP is for cloud-native Node.js/Java apps on BTP.", opts: [["RAP = ABAP/S4 stack; CAP = cloud-native Node/Java on BTP; both yield OData", true], ["They are the same tool with two names", false], ["CAP only runs on-premise ECC", false], ["RAP is for spreadsheets, CAP for email", false]] },
    ],
  });

  console.log("\n✅ Session 18 seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
