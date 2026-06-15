// ─── ABAP: ADVANCED LESSONS (Session 6) ──────────────────────────────────────
// LESSON 11.11: ABAP RESTful Application Programming Model (RAP)
const lesson11_11 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-rap-model" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "ABAP RESTful Application Programming Model (RAP)",
    slug: "abap-rap-model",
    order: 11,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Vikram, a senior developer, is asked to build a custom "Travel Request" Fiori app on S/4HANA. His instinct is to hand-build OData with SEGW and a freestyle SAPUI5 app — the way he did in 2018. His architect stops him: "We do RAP now. Define the business object, the system generates the OData V4 service, and Fiori Elements renders the UI from metadata." Vikram realizes the entire app-building paradigm has shifted, and the old SEGW-plus-freestyle approach is now legacy.

RAP is how modern transactional apps are built on S/4HANA — and it's a required skill for any ABAP developer working on current projects.`,
    content: `## What RAP Is

The **ABAP RESTful Application Programming Model (RAP)** is SAP's standard framework for building transactional (create/update/delete) services on S/4HANA and the ABAP Cloud environment. It replaces the older stack of SEGW-generated OData, BOPF, and classic dynpro for new development. RAP produces an **OData V4** service that Fiori Elements consumes directly, so you define behavior in metadata and ABAP rather than hand-coding UI plumbing.

## The Building Blocks

RAP is layered on top of CDS:

| Layer | Artifact | Purpose |
|-------|----------|---------|
| Data model | CDS view entities | Define the data and associations |
| Projection | CDS projection view | Expose a service-specific subset (BO interface vs consumption) |
| Behavior | **Behavior Definition (BDEF)** | Declares what operations are allowed and the logic hooks |
| Implementation | **Behavior Implementation** (ABAP class) | Code for validations, determinations, actions |
| Service | Service Definition + Service Binding | Exposes the BO as an OData V4 service |

A **Business Object (BO)** in RAP is the CDS root entity plus its behavior — one consistent transactional unit.

## Behaviors: Validations, Determinations, Actions

The BDEF is where the power lives. A minimal definition looks like:

\`\`\`abap
managed implementation in class zbp_travel unique;
define behavior for ZI_Travel alias Travel
persistent table ztravel
lock master
{
  create; update; delete;
  field ( readonly ) TravelID;
  validation validateDates on save { field BeginDate, EndDate; }
  determination setStatus on modify { create; }
  action approve result [1] $self;
}
\`\`\`

- **Validations** check data before save and raise messages (e.g. end date after begin date).
- **Determinations** auto-derive fields when data changes (e.g. default a status on create).
- **Actions** are custom operations beyond CRUD (e.g. "Approve") exposed as buttons in Fiori.

**Managed** scenarios let RAP handle persistence automatically; **unmanaged** scenarios wrap existing logic (legacy tables/BAPIs) where you implement the saving yourself.

## Draft Handling

RAP provides built-in **draft** support: a user's half-finished edits are saved to a draft table so they survive navigation and crashes, then become active data on save. You enable it with \`with draft;\` in the BDEF and a draft table — something that took enormous manual effort in older models.

## RAP vs Classic ABAP — When to Use Which

| | RAP | Classic (dynpro / SEGW OData) |
|--|-----|------------------------------|
| UI target | Fiori Elements (OData V4) | SAP GUI / freestyle UI5 |
| Persistence | Managed or unmanaged | Hand-coded |
| Best for | New S/4HANA transactional apps | Legacy maintenance, GUI-only scenarios |
| Cloud-ready | Yes (ABAP Cloud) | No (classic only) |

For any **new** S/4HANA app, RAP is the answer. You still touch classic ABAP when maintaining existing dynpro transactions.

## How It Reaches Fiori

The service binding publishes an OData V4 service. A Fiori Elements app (List Report / Object Page) points at that service and renders the UI from CDS UI annotations — no hand-written controllers. So a RAP developer delivers a full app by writing CDS + BDEF + a behavior class, with zero front-end JavaScript.`,
    keyConceptTitle: "RAP = CDS data model + Behavior Definition → OData V4 → Fiori Elements",
    keyConceptBody: `- RAP is the modern standard for transactional apps on S/4HANA and ABAP Cloud, replacing SEGW/BOPF/dynpro.
- A **Business Object** = CDS root entity + a **Behavior Definition** (validations, determinations, actions) implemented in an ABAP class.
- **Managed** scenarios auto-handle persistence; **unmanaged** wrap legacy logic. Built-in **draft** handling comes nearly for free.
- The service binding exposes OData V4 that Fiori Elements renders from annotations — no hand-coded UI.`,
  },
});
const flowchart11_11 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_11.id },
  update: {},
  create: {
    lessonId: lesson11_11.id,
    title: "RAP Architecture: From Data Model to Fiori",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🗄️ CDS Data Model (Entities + Associations)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 120 }, data: { label: "⚙️ Behavior Definition (BDEF)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 290, y: 260 }, data: { label: "💻 Behavior Implementation (Validations/Actions)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 540, y: 120 }, data: { label: "🔌 Service Definition + Binding (OData V4)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 780, y: 120 }, data: { label: "📱 Fiori Elements App" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_11.id, nodeId: "node1", title: "CDS Data Model", description: "Root and child CDS entities with associations define the structure of the business object and its persistence mapping.", tCode: "ADT (Eclipse)", tips: "Model the root entity around the transactional unit you lock and save together." },
    { flowchartId: flowchart11_11.id, nodeId: "node2", title: "Behavior Definition (BDEF)", description: "Declares allowed operations (create/update/delete), field controls, draft, and the hooks for validations, determinations, and actions.", tCode: "ADT (Behavior Definition)", tips: "Choose 'managed' for new tables; 'unmanaged' to wrap existing BAPIs or legacy persistence." },
    { flowchartId: flowchart11_11.id, nodeId: "node3", title: "Behavior Implementation", description: "An ABAP class implements the logic the BDEF declares — validation checks, field determinations, and custom actions like Approve.", tCode: "ADT (Local Types of behavior pool)", tips: "Keep validations pure checks; use determinations to derive values so logic stays predictable." },
    { flowchartId: flowchart11_11.id, nodeId: "node4", title: "Service Definition + Binding", description: "The service definition selects which entities to expose; the binding publishes them as an OData V4 service (UI or Web API).", tCode: "ADT (Service Binding)", tips: "OData V4 is required for Fiori Elements; V2 bindings are for older consumers." },
    { flowchartId: flowchart11_11.id, nodeId: "node5", title: "Fiori Elements App", description: "A List Report / Object Page app consumes the OData V4 service and renders the UI from CDS UI annotations — no hand-coded controllers.", tCode: "Fiori Elements / BAS", tips: "Most UI behavior is controlled by annotations on the projection view, not JavaScript." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson11_11.id },
  update: {},
  create: {
    lessonId: lesson11_11.id,
    title: "RAP — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In RAP, where do you declare that an entity supports a custom 'Approve' operation beyond standard CRUD?",
          explanation: "Custom operations are declared as actions in the Behavior Definition (BDEF) and implemented in the behavior class. Validations and determinations are also declared in the BDEF.",
          options: {
            create: [
              { text: "In the Behavior Definition (as an action)", isCorrect: true },
              { text: "In the SAPUI5 controller", isCorrect: false },
              { text: "In a SEGW project", isCorrect: false },
              { text: "In the database table definition", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A team must build a brand-new transactional Fiori app on S/4HANA Cloud. Why is RAP the right choice over classic SEGW + freestyle UI5?",
          explanation: "RAP generates an OData V4 service consumed by Fiori Elements, supports managed persistence and draft handling, and is the only approach allowed/strategic in the cloud ABAP environment. SEGW + dynpro is legacy and not cloud-ready.",
          options: {
            create: [
              { text: "RAP is cloud-ready and produces OData V4 for Fiori Elements with managed persistence and drafts", isCorrect: true },
              { text: "Classic SEGW is faster to run at runtime", isCorrect: false },
              { text: "RAP requires writing more JavaScript", isCorrect: false },
              { text: "Only RAP can read database tables", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the difference between a 'managed' and an 'unmanaged' RAP scenario?",
          explanation: "In a managed scenario RAP handles persistence (saving to the database) automatically. In an unmanaged scenario you implement the save/locking yourself — used to wrap existing legacy logic or BAPIs.",
          options: {
            create: [
              { text: "Managed lets RAP handle persistence; unmanaged means you implement saving yourself", isCorrect: true },
              { text: "Managed is for cloud only; unmanaged is for GUI only", isCorrect: false },
              { text: "Managed has no behavior definition", isCorrect: false },
              { text: "They are the same thing with different names", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.12: ABAP Unit Testing & the ABAP Test Cockpit (ATC)
const lesson11_12 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-unit-testing-atc" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "ABAP Unit Testing & the ABAP Test Cockpit (ATC)",
    slug: "abap-unit-testing-atc",
    order: 12,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A consultant, Anjali, changes a pricing routine to fix one customer's bug. Two weeks later, three other customers' invoices are wrong — her fix broke an edge case nobody re-tested. The client demands to know why there were no automated tests. In modern ABAP shops, this is unacceptable: code is expected to ship with unit tests, and transports must pass the ABAP Test Cockpit before release.

Testing discipline is what separates a hobby ABAP developer from a professional one — and it's increasingly enforced by CI/CD pipelines around the SAP system.`,
    content: `## Why Testing Matters in ABAP

ABAP runs the core of the business. A regression in a tax or pricing routine costs real money. Two tools make ABAP safe to change: **ABAP Unit** (automated unit tests embedded in your code) and the **ABAP Test Cockpit (ATC)** (static code checks run before transport release). Together they form the foundation of a CI/CD mindset for ABAP.

## ABAP Unit — Tests That Live in the Code

ABAP Unit tests are written as a **local test class** marked \`FOR TESTING\`, with test methods and assertions:

\`\`\`abap
CLASS ltcl_discount DEFINITION FOR TESTING
  DURATION SHORT RISK LEVEL HARMLESS.
  PRIVATE SECTION.
    METHODS no_discount_under_100 FOR TESTING.
ENDCLASS.

CLASS ltcl_discount IMPLEMENTATION.
  METHOD no_discount_under_100.
    DATA(result) = zcl_pricing=>discount( amount = 90 ).
    cl_abap_unit_assert=>assert_equals(
      exp = 0 act = result msg = 'No discount below 100' ).
  ENDMETHOD.
ENDCLASS.
\`\`\`

Tests run with Ctrl+Shift+F10 in ADT and never execute in production (the test class is ignored at runtime). Key assertions: \`assert_equals\`, \`assert_true\`, \`assert_initial\`, \`assert_not_initial\`.

## Test Doubles & Dependency Injection

The hard part of testing ABAP is its dependencies — database reads, BAPIs, time. **Testable ABAP** isolates these behind interfaces so a test can inject a **test double** (a fake implementation) instead of hitting the real database:

| Technique | Purpose |
|-----------|---------|
| Interface for dependency | Decouple the unit from the real resource |
| Constructor injection | Pass the dependency in, so tests pass a double |
| Test double (stub/mock) | Returns canned data, no DB/RFC call |
| Test seams / test-relevant friends | Access internals for verification |

This is why object-oriented, interface-based design (OO ABAP) and testing go hand in hand — procedural code with hard-coded SELECTs is nearly impossible to unit test.

## The ABAP Test Cockpit (ATC)

ATC runs **static checks** against your code — performance anti-patterns, security issues, syntax, naming, and (crucially) it can run your ABAP Unit tests too. It is typically wired into the transport release so code that fails checks cannot move to QA/PROD.

| ATC capability | What it catches |
|----------------|-----------------|
| Code Inspector checks | SELECT *, nested SELECTs, missing authority checks |
| Custom check variants | Project-specific coding standards |
| Unit test execution | Failing ABAP Unit tests |
| Cloud readiness checks | Use of non-released APIs (for ABAP Cloud migration) |

## CI/CD for ABAP

Modern teams use **abapGit** to put code under version control and pipelines (e.g. gCTS or external CI) that run ATC + ABAP Unit automatically on every change. The principle is the same as any software engineering: every change is tested before it ships. A transport that breaks a test or fails ATC is blocked — which is exactly what would have caught Anjali's regression.`,
    keyConceptTitle: "Ship ABAP with tests: ABAP Unit for logic, ATC as the quality gate",
    keyConceptBody: `- **ABAP Unit** test classes (FOR TESTING) with assertions like assert_equals run in ADT and are ignored in production.
- Testable code isolates DB/RFC dependencies behind interfaces so tests inject **test doubles** — this is why OO/interface design enables testing.
- The **ABAP Test Cockpit (ATC)** runs static checks (SELECT *, security, cloud-readiness) plus unit tests, and is wired into transport release as a quality gate.
- Combined with abapGit and pipelines, this brings a CI/CD mindset that blocks untested changes.`,
  },
});
const flowchart11_12 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_12.id },
  update: {},
  create: {
    lessonId: lesson11_12.id,
    title: "Quality Gate: From Code to Released Transport",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "💻 Write ABAP + Unit Tests" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 120 }, data: { label: "🧪 Run ABAP Unit (inject doubles)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 120 }, data: { label: "🔍 ATC Static Checks + Tests" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 510, y: 260 }, data: { label: "❌ Findings? Fix & Re-run" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 760, y: 120 }, data: { label: "✅ Release Transport (DEV→QAS)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node2", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart11_12.id, nodeId: "node1", title: "Write Code + Tests", description: "Production code and its ABAP Unit test class are written together. Tests document expected behavior and guard against regressions.", tCode: "ADT / SE80", tips: "Write the test for the bug first — it should fail, then your fix makes it pass." },
    { flowchartId: flowchart11_12.id, nodeId: "node2", title: "Run ABAP Unit", description: "Tests execute locally with assertions. Dependencies (DB, RFC) are replaced by injected test doubles so tests are fast and deterministic.", tCode: "ADT (Ctrl+Shift+F10)", tips: "If a unit is hard to test, that's a design smell — extract an interface and inject it." },
    { flowchartId: flowchart11_12.id, nodeId: "node3", title: "ATC Checks", description: "The ABAP Test Cockpit runs static code analysis (performance, security, cloud-readiness) and can execute the unit tests as part of the gate.", tCode: "ATC / SCI", tips: "Use a project check variant so the whole team is measured against the same standards." },
    { flowchartId: flowchart11_12.id, nodeId: "node4", title: "Fix Findings", description: "Priority-1 and 2 ATC findings or failing tests must be resolved before the code can progress.", tCode: "ATC result list", tips: "Treat ATC priority-1 findings as build-breakers, not suggestions." },
    { flowchartId: flowchart11_12.id, nodeId: "node5", title: "Release Transport", description: "Only clean, tested code is released and transported onward, preventing regressions from reaching QA and production.", tCode: "SE10 / gCTS", tips: "Wire ATC into the release step so a failing check blocks the transport automatically." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson11_12.id },
  update: {},
  create: {
    lessonId: lesson11_12.id,
    title: "ABAP Unit & ATC — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why is it hard to unit-test ABAP code that contains hard-coded SELECT statements, and how is it solved?",
          explanation: "Hard-coded database reads make the unit depend on real data, so tests can't run deterministically without a database. Isolating the dependency behind an interface and injecting a test double (a fake) lets the test control the data — which is why OO/interface design enables testing.",
          options: {
            create: [
              { text: "The DB dependency must be isolated behind an interface and replaced with a test double", isCorrect: true },
              { text: "SELECT statements cannot run in ABAP at all", isCorrect: false },
              { text: "You must delete the database before testing", isCorrect: false },
              { text: "Unit tests automatically ignore all database calls", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does the ABAP Test Cockpit (ATC) primarily do?",
          explanation: "ATC runs static code checks (performance anti-patterns, security, cloud-readiness, standards) and can execute ABAP Unit tests, acting as a quality gate typically enforced at transport release.",
          options: {
            create: [
              { text: "Runs static code checks (and can run unit tests) as a pre-release quality gate", isCorrect: true },
              { text: "Replaces the database with test data permanently", isCorrect: false },
              { text: "Compiles ABAP into Java", isCorrect: false },
              { text: "Schedules background jobs", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "An ABAP Unit test class is marked FOR TESTING. What happens when the surrounding program runs in production?",
          explanation: "Test classes marked FOR TESTING are only executed by the ABAP Unit framework (e.g. in ADT). They are ignored during normal production execution, so they add no runtime overhead or risk to live processes.",
          options: {
            create: [
              { text: "The test class is ignored during normal production execution", isCorrect: true },
              { text: "The tests run and could change production data", isCorrect: false },
              { text: "The program refuses to run in production", isCorrect: false },
              { text: "The tests run only on weekends", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.13: Performance Optimization in ABAP
const lesson11_13 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-performance-optimization" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "Performance Optimization in ABAP",
    slug: "abap-performance-optimization",
    order: 13,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A custom report at a logistics company takes 40 minutes to run and times out at month-end. Suresh, brought in to fix it, opens an SQL trace and finds the smoking gun: a SELECT inside a LOOP firing 200,000 separate database calls, each fetching all columns of a huge table. He rewrites it as a single JOIN with explicit columns; runtime drops to 18 seconds. Nothing about the business logic changed — only how the code talks to the database.

On HANA especially, performance is mostly about minimizing and shaping database access. These patterns separate code that scales from code that collapses under real data volumes.`,
    content: `## The Golden Rule: Minimize and Shape Database Access

Most ABAP performance problems are database problems. The application server is fast; the round-trips to the database and the volume of data moved are what hurt. The classic "five golden rules" still apply, sharpened on HANA where you should push work down to the database.

## 1. Never SELECT *

Selecting all columns moves unneeded data over the network and defeats column-store optimization on HANA. Always list the fields you need:

\`\`\`abap
" Bad
SELECT * FROM vbak INTO TABLE @DATA(orders).
" Good
SELECT vbeln, kunnr, netwr FROM vbak INTO TABLE @DATA(orders).
\`\`\`

## 2. Avoid SELECTs Inside Loops

A SELECT inside a LOOP is the single most common killer — it multiplies database round-trips. Replace it with a **JOIN** (let the database combine tables) or **FOR ALL ENTRIES** (one query for a set of keys):

\`\`\`abap
" Anti-pattern: N round-trips
LOOP AT items INTO DATA(item).
  SELECT SINGLE maktx FROM makt INTO @DATA(text) WHERE matnr = @item-matnr.
ENDLOOP.
" Better: one round-trip
SELECT matnr, maktx FROM makt
  FOR ALL ENTRIES IN @items WHERE matnr = @items-matnr
  INTO TABLE @DATA(texts).
\`\`\`

Watch FOR ALL ENTRIES gotchas: an empty driver table reads the whole table, and duplicates must be handled — many teams prefer JOINs or CDS views.

## 3. Use Indexes Wisely

If a WHERE clause can't use the primary key, the database may scan the whole table. A **secondary index** on the filtered columns fixes this — but indexes cost write performance and storage, so add them deliberately based on real access paths (confirmed via SQL trace), not guesswork.

## 4. The Parallel Cursor for Nested Internal-Table Loops

A LOOP-inside-LOOP over internal tables is O(n×m). The **parallel cursor** technique sorts both tables and walks them together with an index, turning it near-linear:

\`\`\`abap
SORT items BY matnr. SORT prices BY matnr.
LOOP AT items INTO DATA(it).
  READ TABLE prices INTO DATA(pr) WITH KEY matnr = it-matnr BINARY SEARCH.
  IF sy-subrc = 0.
    DATA(idx) = sy-tabix.
    LOOP AT prices INTO pr FROM idx.
      IF pr-matnr <> it-matnr. EXIT. ENDIF.
      " process
    ENDLOOP.
  ENDIF.
ENDLOOP.
\`\`\`

## 5. Table Buffering

Small, mostly-read, rarely-changed tables (config/customizing) can be **buffered** in application-server memory, so reads avoid the database entirely. Set buffering in SE11 technical settings — but never buffer large or frequently-changed tables.

## Diagnosis: ST05 and SM50

You don't guess at performance — you measure:

| Tool | Shows |
|------|-------|
| **ST05** (SQL Trace) | Every DB statement, duration, whether an index was used |
| **SE30 / SAT** (Runtime Analysis) | Where ABAP time is spent (DB vs CPU) |
| **SM50 / SM66** | Live work-process state — which process is stuck and on what |

Trace first, then optimize the statement that actually dominates — usually the SELECT * in a loop.`,
    keyConceptTitle: "Performance is database discipline: fewer round-trips, fewer columns, the right index",
    keyConceptBody: `- Never SELECT * — list needed columns so HANA's column store and the network are efficient.
- Eliminate SELECTs inside loops via JOINs, FOR ALL ENTRIES, or CDS views (one round-trip beats N).
- Add **secondary indexes** only for real, traced access paths; use the **parallel cursor** for nested internal-table loops.
- **Buffer** small read-mostly tables; always diagnose with **ST05** (SQL trace) before optimizing.`,
  },
});
const flowchart11_13 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_13.id },
  update: {},
  create: {
    lessonId: lesson11_13.id,
    title: "Diagnose-then-Fix Performance Workflow",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🐌 Slow Program Reported" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 270, y: 120 }, data: { label: "🔍 ST05 SQL Trace" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 60 }, data: { label: "🔁 SELECT in Loop? → JOIN / FAE" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 470, y: 180 }, data: { label: "🗂️ Full Scan? → Add Index" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 700, y: 120 }, data: { label: "⚡ Re-trace & Confirm Gain" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_13.id, nodeId: "node1", title: "Slow Program", description: "A report or job runs too long or times out, usually only visible at production data volumes.", tCode: "N/A", tips: "Reproduce with realistic data; small dev datasets hide the real bottleneck." },
    { flowchartId: flowchart11_13.id, nodeId: "node2", title: "ST05 SQL Trace", description: "Trace the actual database statements: count, duration, and whether an index was used. The dominant statement is your target.", tCode: "ST05", tips: "Sort by total time; a statement executed 200k times is the loop-SELECT smoking gun." },
    { flowchartId: flowchart11_13.id, nodeId: "node3", title: "SELECT in Loop → JOIN/FAE", description: "Replace per-iteration SELECTs with a single JOIN, FOR ALL ENTRIES, or a CDS view to collapse N round-trips into one.", tCode: "ADT / SE11", tips: "Prefer JOIN/CDS over FOR ALL ENTRIES to avoid empty-table and duplicate gotchas." },
    { flowchartId: flowchart11_13.id, nodeId: "node4", title: "Full Scan → Index", description: "If the WHERE clause can't use the primary key and scans the table, add a secondary index on the filtered fields.", tCode: "SE11 (Indexes)", tips: "Indexes slow writes — add them only for proven, frequent access paths." },
    { flowchartId: flowchart11_13.id, nodeId: "node5", title: "Re-trace & Confirm", description: "Run ST05 again to verify the fix actually reduced database time, not just shuffled it elsewhere.", tCode: "ST05 / SAT", tips: "Always measure after the change — assumptions about gains are often wrong." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson11_13.id },
  update: {},
  create: {
    lessonId: lesson11_13.id,
    title: "ABAP Performance — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A program runs a SELECT SINGLE inside a LOOP over 200,000 internal-table rows. What is the core problem and the best fix?",
          explanation: "The SELECT in the loop causes ~200,000 separate database round-trips. Replacing it with a single set-based read — a JOIN or FOR ALL ENTRIES (or a CDS view) — collapses it into one round-trip, which is the dominant performance win.",
          options: {
            create: [
              { text: "It causes N database round-trips; replace with a JOIN/FOR ALL ENTRIES (one read)", isCorrect: true },
              { text: "The loop itself is slow; remove the loop and process nothing", isCorrect: false },
              { text: "SELECT SINGLE is always faster than a JOIN regardless of context", isCorrect: false },
              { text: "Add ten secondary indexes to the internal table", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why should you avoid adding secondary indexes to a table indiscriminately?",
          explanation: "Indexes speed up matching reads but slow down inserts/updates/deletes and consume storage, because every write must maintain the index. Add them deliberately for proven, frequent access paths confirmed via SQL trace — not as a blanket fix.",
          options: {
            create: [
              { text: "Each index slows writes and uses storage, so they must be justified by real access paths", isCorrect: true },
              { text: "Indexes make all SELECTs slower", isCorrect: false },
              { text: "Indexes are illegal on HANA", isCorrect: false },
              { text: "Indexes delete data automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Which table is a good candidate for table buffering, and which is not?",
          explanation: "Buffering keeps a copy in application-server memory, ideal for small, read-mostly, rarely-changed tables (e.g. configuration). Large or frequently-updated tables are poor candidates because the buffer would be huge and constantly invalidated.",
          options: {
            create: [
              { text: "Good: small read-mostly config table; Bad: large frequently-updated table", isCorrect: true },
              { text: "Good: huge transaction table; Bad: tiny config table", isCorrect: false },
              { text: "All tables should always be buffered", isCorrect: false },
              { text: "Buffering only works for empty tables", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.14: ABAP for Output — SmartForms & Adobe Forms
const lesson11_14 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-smartforms-adobe-forms" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "ABAP for Output: SmartForms & Adobe Forms",
    slug: "abap-smartforms-adobe-forms",
    order: 14,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A manufacturing client needs their customer invoices to carry a new legal disclaimer and a QR code for payment. The functional team configures the output condition, but it's Deepa, the developer, who must change the actual printed layout. She discovers the invoice runs on an Adobe Form, fed by a print program that gathers the billing data. To change one line on the paper, she has to understand the whole output chain — data retrieval, form interface, and layout.

Form output is unglamorous but everywhere: every invoice, delivery note, purchase order, and pay slip a company prints flows through this machinery.`,
    content: `## How SAP Produces Printed Output

When SAP prints an invoice or delivery note, three pieces cooperate: a **print/driver program** gathers the data, passes it through a **form interface** into a **form** (the layout), which renders to a spool request and then to paper, PDF, or email. Output determination (a condition technique) decides which form is triggered for which document. As a developer you mostly work on the form and its driver program.

## The Three Technologies (Evolution)

| Tech | Transaction | Status | Notes |
|------|-------------|--------|-------|
| **SAPscript** | SE71 | Legacy | Oldest; still seen in old standard forms |
| **SmartForms** | SMARTFORMS | Mature | Graphical, no main-window coding nightmare |
| **Adobe Forms** | SFP | Strategic | PDF-based, the modern successor |

SAPscript is essentially read-only knowledge now. New work is **SmartForms** or, increasingly, **Adobe Forms (SFP)**.

## SmartForms Structure

A SmartForm is built graphically in transaction SMARTFORMS:

- **Pages** — the physical sheets (e.g. first page, next page) with their layout.
- **Windows** — rectangular areas on a page (main window flows across pages; secondary windows are fixed, e.g. address, totals).
- **Loops & tables** — iterate over line items (invoice rows) inside the main window.
- **Form interface** — the typed parameters the form receives from the driver program.

When you activate a SmartForm, SAP generates a **function module** behind it. The driver program calls that generated function module, passing the data.

## Adobe Forms (SFP) — the Modern Path

**Adobe Forms** uses transaction SFP and Adobe LiveCycle Designer for layout. Advantages: true PDF output, pixel-precise layout, interactive forms (fillable PDFs), and better handling of complex graphics like QR codes. An Adobe Form has two parts: the **interface** (data definition, like the form interface) and the **form layout** (the design). It's the strategic choice for new development and the only forms technology that aligns with the cloud/Fiori direction.

## The Form Interface — Passing Data In

The critical contract is the **form interface**: the structures and tables the driver program fills and the form consumes. For an invoice you'd typically pass the billing document header, the partner/address, and an internal table of line items. Get this contract right and the layout work is straightforward; get it wrong and the form has no data to show.

## Practical: Invoice Output Flow

1. Billing document is created/printed (e.g. VF01/VF03) — output determination finds the output type.
2. The assigned **driver program** runs, selecting billing header, items, customer, and texts.
3. It calls the form's **generated function module** (SmartForm) or the Adobe rendering, passing data via the interface.
4. The form renders pages/windows, looping over line items, and produces a spool request.
5. Spool goes to printer, PDF, or email per the output medium.

Deepa's QR-code change touches step 2 (compute/encode the QR data) and the layout (place it on the form) — a typical "change the printed output" task that requires understanding the whole chain.`,
    keyConceptTitle: "Output = driver program gathers data → form interface → SmartForm/Adobe Form → spool",
    keyConceptBody: `- SAP printed output flows: **print/driver program → form interface → form layout → spool → printer/PDF/email**, triggered by output determination.
- **SAPscript** (SE71) is legacy, **SmartForms** (SMARTFORMS) is mature and generates a callable function module, **Adobe Forms** (SFP, PDF-based) is the strategic successor.
- The **form interface** is the data contract between the driver program and the form — get it right and layout work is easy.
- Changing printed output usually means editing both the driver program (data) and the form (layout).`,
  },
});
const flowchart11_14 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_14.id },
  update: {},
  create: {
    lessonId: lesson11_14.id,
    title: "Invoice Output Chain",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🧾 Billing Doc + Output Determination" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "💻 Driver Program Gathers Data" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 530, y: 120 }, data: { label: "🔗 Form Interface (Data Contract)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 530, y: 260 }, data: { label: "📄 SmartForm / Adobe Form Layout" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 780, y: 260 }, data: { label: "🖨️ Spool → Printer/PDF/Email" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_14.id, nodeId: "node1", title: "Output Determination", description: "When a document like a billing invoice is created, the condition technique determines which output type and form to use, and the medium (print/email).", tCode: "VF03 / NACE", tips: "Functional config picks the output type; the developer owns the program and form behind it." },
    { flowchartId: flowchart11_14.id, nodeId: "node2", title: "Driver Program", description: "The print/driver program selects all data the form needs — header, items, partner, texts — and prepares it for the form.", tCode: "SE38 (print program)", tips: "Most layout bugs are actually missing data — verify the driver fills the interface fully." },
    { flowchartId: flowchart11_14.id, nodeId: "node3", title: "Form Interface", description: "The typed contract of structures and tables the driver passes to the form. Both sides must agree on the parameters.", tCode: "SMARTFORMS / SFP (Interface)", tips: "Define the interface around the document's natural shape: one header structure plus an items table." },
    { flowchartId: flowchart11_14.id, nodeId: "node4", title: "Form Layout", description: "SmartForm pages/windows or Adobe Form layout render the data, looping over line items and placing fixed elements like address and totals.", tCode: "SMARTFORMS / SFP", tips: "Use the main window for the flowing item table; secondary windows for fixed blocks." },
    { flowchartId: flowchart11_14.id, nodeId: "node5", title: "Spool Output", description: "The rendered form becomes a spool request, then is sent to a printer, PDF, or email according to the output medium.", tCode: "SP01", tips: "If output 'didn't print', check SP01 — the document usually rendered but the device failed." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson11_14.id },
  update: {},
  create: {
    lessonId: lesson11_14.id,
    title: "SmartForms & Adobe Forms — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the role of the 'form interface' in SAP output processing?",
          explanation: "The form interface is the data contract — the structures and tables the driver program fills and the form consumes. The driver gathers data; the interface passes it to the form for rendering.",
          options: {
            create: [
              { text: "It is the data contract passing structures/tables from the driver program to the form", isCorrect: true },
              { text: "It is the printer device configuration", isCorrect: false },
              { text: "It is the user's login screen", isCorrect: false },
              { text: "It compiles the form into Java", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which forms technology is the modern, PDF-based, strategic successor for new development?",
          explanation: "Adobe Forms (transaction SFP) is PDF-based, supports pixel-precise and interactive layouts, and is the strategic direction. SAPscript is legacy and SmartForms, while still widely used, predates Adobe Forms.",
          options: {
            create: [
              { text: "Adobe Forms (SFP)", isCorrect: true },
              { text: "SAPscript (SE71)", isCorrect: false },
              { text: "ALV grid", isCorrect: false },
              { text: "Dynpro screens", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "When you activate a SmartForm, what does SAP generate that the driver program then calls?",
          explanation: "Activating a SmartForm generates a function module. The driver program calls this generated function module, passing the data through the form interface — connecting program logic to the layout.",
          options: {
            create: [
              { text: "A function module that the driver program calls", isCorrect: true },
              { text: "A new database table", isCorrect: false },
              { text: "A Fiori app", isCorrect: false },
              { text: "A transport request", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.15: ABAP on BTP — ABAP Cloud & Steampunk
const lesson11_15 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-cloud-steampunk" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "ABAP on BTP: ABAP Cloud & Steampunk",
    slug: "abap-cloud-steampunk",
    order: 15,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A developer, Rohan, joins an S/4HANA Public Cloud project and tries to open SE80 to write a report that reads table VBAK directly. It fails — there is no SE80, and the table isn't accessible. His lead explains: "In ABAP Cloud you only use released APIs, develop in Eclipse, and the core stays clean. The habits from on-premise classic ABAP don't transfer." Rohan has to relearn how he builds, even though it's still ABAP.

ABAP Cloud is the present and future of SAP development. Understanding its rules — and why they exist — is essential for any developer on modern S/4HANA.`,
    content: `## What "ABAP Cloud" Means

**ABAP Cloud** is the development model and restricted language scope used in SAP's cloud ABAP environments — the **S/4HANA Public Cloud ABAP environment** and the standalone **SAP BTP ABAP Environment** (nicknamed **"Steampunk"**). It is still ABAP, but governed by strict rules that keep extensions upgrade-safe and the core "clean." The same ABAP Cloud model is also how you write upgrade-stable extensions in S/4HANA private cloud and on-premise (via "ABAP for Cloud Development").

## The Core Rule: Released APIs Only

In classic ABAP you could read any table or call any function module. In ABAP Cloud you may only use objects SAP has **officially released** as stable APIs (released CDS views, released class/BAPI interfaces, released extension points). You **cannot** SELECT directly from underlying tables like VBAK — you use the released interface view (e.g. I_SalesDocument) instead. SAP guarantees released APIs across upgrades; non-released objects can change without notice, which is exactly why they're blocked.

| | Classic ABAP | ABAP Cloud |
|--|--------------|------------|
| Object access | Anything in the system | Only released APIs |
| Direct table SELECT | Allowed | Blocked (use released CDS) |
| Dynpro / SAPscript | Allowed | Not available |
| UI model | SAP GUI / dynpro | RAP + Fiori only |
| IDE | SE80 (GUI) | Eclipse / BAS only |
| Upgrade safety | Fragile if modified | Guaranteed for released APIs |

## Where You Develop: Eclipse / BAS

There is no SE80 in the cloud. You develop in **ABAP Development Tools (ADT) in Eclipse**, or in **SAP Business Application Studio (BAS)** for the BTP ABAP Environment. Everything — CDS, RAP, classes — is created and managed there.

## Steampunk (SAP BTP ABAP Environment)

**Steampunk** is the standalone ABAP runtime on SAP BTP — a place to build ABAP **side-by-side** extensions and apps that live outside the S/4HANA core but connect to it through released APIs (often via communication arrangements / OData). It's how an ABAP developer builds cloud apps without putting custom code inside the digital core.

## The Three-Tier Extensibility Model

ABAP Cloud fits a layered model that keeps the core clean:

| Tier | Who | How |
|------|-----|-----|
| **Standard** | SAP | Deliver the standard S/4HANA functionality |
| **Key-user extensions** | Business power users | In-app, no-code/low-code (custom fields, logic) |
| **Developer extensions** | ABAP developers | ABAP Cloud: on-stack (in S/4) or side-by-side (Steampunk), via released APIs |

The rule of thumb: extend in the lowest tier that meets the need, and never modify the standard core.

## Why the Restrictions Are a Feature

The restrictions feel painful coming from classic ABAP, but they're the whole point: by forcing released-API usage and forbidding core modification, ABAP Cloud guarantees that extensions survive the frequent automatic upgrades of cloud S/4HANA. The "clean core" you keep is what lets you adopt innovation continuously instead of facing a painful upgrade every few years. Classic ABAP still exists for on-premise legacy maintenance — but new, future-proof development follows ABAP Cloud rules.`,
    keyConceptTitle: "ABAP Cloud = released APIs only, Eclipse/BAS, RAP UI, clean core — upgrade-safe by design",
    keyConceptBody: `- **ABAP Cloud** is the restricted, upgrade-safe development model for S/4HANA Public Cloud and the BTP ABAP Environment ("Steampunk").
- You may use only **released APIs** (e.g. released CDS like I_SalesDocument) — no direct table SELECTs, no SE80, no dynpro/SAPscript; UIs are RAP + Fiori.
- Development happens in **Eclipse (ADT)** or **BAS**; Steampunk hosts **side-by-side** extensions connected via released APIs.
- The three-tier model (standard → key-user → developer extensions) keeps the **clean core**, enabling continuous cloud upgrades.`,
  },
});
const flowchart11_15 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_15.id },
  update: {},
  create: {
    lessonId: lesson11_15.id,
    title: "ABAP Cloud Extensibility & Released APIs",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🧑‍💻 Developer in Eclipse / BAS" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 60 }, data: { label: "🏗️ On-Stack Extension (in S/4)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 180 }, data: { label: "☁️ Side-by-Side (Steampunk/BTP)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 540, y: 120 }, data: { label: "🔌 Released APIs Only (e.g. I_SalesDocument)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 790, y: 120 }, data: { label: "🚀 Clean S/4HANA Core (Upgrade-Safe)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_15.id, nodeId: "node1", title: "Develop in Eclipse / BAS", description: "ABAP Cloud development happens in ADT (Eclipse) or SAP Business Application Studio — there is no classic SE80 GUI editor.", tCode: "ADT / BAS", tips: "All cloud ABAP artifacts (CDS, RAP, classes) are managed in the modern toolset only." },
    { flowchartId: flowchart11_15.id, nodeId: "node2", title: "On-Stack Extension", description: "Developer extensions that run inside the S/4HANA system itself, built with ABAP Cloud rules so they stay upgrade-safe.", tCode: "ADT", tips: "Use on-stack when the extension is tightly coupled to core data and processes." },
    { flowchartId: flowchart11_15.id, nodeId: "node3", title: "Side-by-Side (Steampunk)", description: "The BTP ABAP Environment hosts apps and extensions outside the core, connecting back via released APIs and communication arrangements.", tCode: "BTP ABAP Environment", tips: "Side-by-side keeps heavy or independent logic off the core entirely." },
    { flowchartId: flowchart11_15.id, nodeId: "node4", title: "Released APIs Only", description: "Both extension styles may consume only SAP-released APIs (released CDS, classes, BAPIs). Direct table access is blocked.", tCode: "Released objects (e.g. I_SalesDocument)", tips: "Search the released-objects list; if it isn't released, you can't (and shouldn't) use it." },
    { flowchartId: flowchart11_15.id, nodeId: "node5", title: "Clean, Upgrade-Safe Core", description: "Because nothing modifies the core and everything uses stable APIs, automatic cloud upgrades apply without breaking extensions.", tCode: "N/A", tips: "Clean core is the payoff: continuous innovation instead of painful multi-year upgrades." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson11_15.id },
  update: {},
  create: {
    lessonId: lesson11_15.id,
    title: "ABAP Cloud & Steampunk — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In ABAP Cloud, a developer needs sales order header data. Why can't they just SELECT from table VBAK, and what do they use instead?",
          explanation: "ABAP Cloud forbids direct access to underlying tables because they are not released and can change across upgrades. Developers use the released CDS interface view (e.g. I_SalesDocument) which SAP guarantees as a stable API.",
          options: {
            create: [
              { text: "VBAK isn't a released API; use the released CDS view (e.g. I_SalesDocument) instead", isCorrect: true },
              { text: "VBAK was deleted from S/4HANA", isCorrect: false },
              { text: "Direct SELECTs are slower than CDS by definition", isCorrect: false },
              { text: "You must copy VBAK into a Z-table first", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is 'Steampunk'?",
          explanation: "Steampunk is the nickname for the SAP BTP ABAP Environment — a standalone ABAP runtime on BTP used to build side-by-side ABAP extensions and apps that connect to S/4HANA through released APIs.",
          options: {
            create: [
              { text: "The SAP BTP ABAP Environment — a standalone ABAP runtime for side-by-side extensions", isCorrect: true },
              { text: "A debugging tool in SE80", isCorrect: false },
              { text: "A new database engine replacing HANA", isCorrect: false },
              { text: "A Fiori theme", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why are ABAP Cloud's restrictions (released APIs only, no core modification) considered a benefit rather than just a limitation?",
          explanation: "By preventing core modification and forcing stable released-API usage, extensions remain compatible across SAP's frequent automatic cloud upgrades. This 'clean core' is what enables continuous innovation without disruptive, expensive upgrade projects.",
          options: {
            create: [
              { text: "They keep the core clean so extensions survive continuous automatic upgrades", isCorrect: true },
              { text: "They make ABAP run faster at runtime", isCorrect: false },
              { text: "They remove the need to write any code", isCorrect: false },
              { text: "They allow unlimited modification of standard SAP", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.16: String Processing & Advanced Data Types
const lesson11_16 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-strings-advanced-types" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "String Processing & Advanced Data Types",
    slug: "abap-strings-advanced-types",
    order: 16,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `An integration developer, Sneha, must consume a REST payload from a partner: a JSON document with order data, where material numbers arrive without leading zeros and dates are in ISO format. She has to parse the JSON, normalize the material numbers to SAP's internal format, convert the dates, and validate fields with patterns. Plain CONCATENATE and offset/length tricks won't cut it — she needs ABAP's modern string, regex, conversion-exit, and JSON tools.

In a world of APIs and integrations, string and data-type mastery is daily work, not an edge case.`,
    content: `## Modern String Operations

ABAP has grown well beyond CONCATENATE. Modern string expressions and statements cover most needs:

| Operation | Modern form |
|-----------|-------------|
| Concatenate | String templates: \`|{ a } - { b }|\` or \`&&\` |
| Split | \`SPLIT text AT ',' INTO TABLE itab.\` |
| Replace | \`REPLACE ALL OCCURRENCES OF ...\` |
| Substring | \`substring( val = s off = 0 len = 4 )\` |
| Search | \`FIND ... IN ...\` (with \`MATCH OFFSET\`) |

String templates (\`|...{ var }...|\`) are the readable, preferred way to build text, including formatting options like \`|{ amount NUMBER = USER }|\`.

## Regular Expressions

ABAP supports **regex** in FIND and REPLACE with the \`REGEX\` addition (and the class-based CL_ABAP_REGEX / CL_ABAP_MATCHER for advanced use). Example — validate an email-like pattern and extract digits:

\`\`\`abap
FIND ALL OCCURRENCES OF REGEX '\\d+' IN lv_text RESULTS DATA(matches).
REPLACE ALL OCCURRENCES OF REGEX '\\s+' IN lv_text WITH ' '.
\`\`\`

Regex is invaluable for validating formats (IBANs, postal codes) and cleaning messy inbound data.

## Conversion Exits — SAP's Internal vs Display Formats

A classic gotcha: SAP stores many fields in an **internal format** that differs from what users see. A material number entered as "100" may be stored as "000000000000000100". The bridge is a **conversion exit**, named CONVERSION_EXIT_*INPUT (display → internal) and CONVERSION_EXIT_*OUTPUT (internal → display). For material numbers it's the ALPHA exit:

\`\`\`abap
CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
  EXPORTING input = '100' IMPORTING output = lv_matnr.  " -> 000...100
\`\`\`

When data arrives from an external system, you almost always need the INPUT exit before comparing or selecting — Sneha's leading-zeros problem is exactly this.

## Binary Data, Dates, and Times

- **STRING** is variable-length character; **XSTRING** is variable-length **binary** — used for files, PDFs, images, and encryption.
- Dates (\`D\`, format YYYYMMDD) and times (\`T\`, HHMMSS) are character-like; arithmetic works (\`date + 30\`), and CL_ABAP_TSTMP / time-stamp types handle UTC time stamps for cross-timezone scenarios.
- Convert between binary and string with classes like CL_BCS_CONVERT or codepage handling — relevant when reading uploaded files.

## JSON in Modern ABAP

REST/OData integration runs on JSON. The widely used helper is **/UI2/CL_JSON**, which serializes and deserializes between ABAP structures and JSON in one call:

\`\`\`abap
DATA(json) = /ui2/cl_json=>serialize( data = ls_order ).
/ui2/cl_json=>deserialize( EXPORTING json = lv_payload
                           CHANGING  data = ls_order ).
\`\`\`

It maps ABAP field names to JSON keys (with options for camelCase/pretty printing). For RAP/OData services the framework handles JSON for you, but for custom HTTP calls (CL_HTTP_CLIENT) you serialize/deserialize yourself.

## Putting It Together (Sneha's Flow)

1. Receive the JSON payload over HTTP.
2. **/UI2/CL_JSON=>deserialize** into an ABAP structure/table.
3. Apply **CONVERSION_EXIT_ALPHA_INPUT** to normalize material numbers.
4. Convert ISO dates to ABAP \`D\` format; validate fields with **regex**.
5. Pass the clean data to a BAPI/RAP create.`,
    keyConceptTitle: "Master strings, regex, conversion exits, XSTRING, and JSON for real integration work",
    keyConceptBody: `- Prefer **string templates** (|...{ var }...|) and statements like SPLIT/REPLACE/FIND; use **REGEX** for format validation and cleaning.
- **Conversion exits** (CONVERSION_EXIT_*INPUT/OUTPUT, e.g. ALPHA) bridge SAP's internal vs display formats — essential when data arrives from outside.
- **STRING** is character, **XSTRING** is binary (files/PDFs); date/time types support arithmetic and UTC time stamps.
- **/UI2/CL_JSON** serializes/deserializes ABAP ↔ JSON, the backbone of custom REST/OData integration.`,
  },
});
const flowchart11_16 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_16.id },
  update: {},
  create: {
    lessonId: lesson11_16.id,
    title: "Processing an Inbound JSON Payload",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📥 Inbound JSON over HTTP" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 120 }, data: { label: "🔄 /UI2/CL_JSON Deserialize" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 60 }, data: { label: "🔢 ALPHA Conversion Exit (matnr)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 510, y: 180 }, data: { label: "🔎 Regex Validate / Convert Dates" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 760, y: 120 }, data: { label: "✅ Clean Data → BAPI/RAP Create" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart11_16.id, nodeId: "node1", title: "Inbound JSON", description: "An external system sends a JSON payload (e.g. via CL_HTTP_CLIENT or an inbound service). It must be parsed into ABAP structures.", tCode: "N/A", tips: "Capture and log the raw payload first — most integration bugs are bad input, not bad code." },
    { flowchartId: flowchart11_16.id, nodeId: "node2", title: "Deserialize JSON", description: "/UI2/CL_JSON=>deserialize maps the JSON into an ABAP structure or internal table in one call, handling field-name mapping.", tCode: "/UI2/CL_JSON", tips: "Use the pretty/camelCase options to match the partner's JSON key style." },
    { flowchartId: flowchart11_16.id, nodeId: "node3", title: "Conversion Exit (ALPHA)", description: "CONVERSION_EXIT_ALPHA_INPUT pads material/number fields with leading zeros to SAP's internal format before any SELECT or compare.", tCode: "CONVERSION_EXIT_ALPHA_INPUT", tips: "Skipping this is why 'the material exists but my SELECT finds nothing' — formats don't match." },
    { flowchartId: flowchart11_16.id, nodeId: "node4", title: "Regex & Date Conversion", description: "Validate field formats with regex and convert ISO/external dates to ABAP's internal D (YYYYMMDD) format.", tCode: "FIND/REPLACE ... REGEX", tips: "Validate before posting; rejecting bad data early beats a failed BAPI deep in the flow." },
    { flowchartId: flowchart11_16.id, nodeId: "node5", title: "Create in SAP", description: "The normalized, validated data is passed to a BAPI or RAP create to persist the business document.", tCode: "BAPI / RAP", tips: "Map external errors back to a clear response so the partner knows what to fix." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson11_16.id },
  update: {},
  create: {
    lessonId: lesson11_16.id,
    title: "Strings & Advanced Types — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "An external system sends material number '100', but your SELECT on the material table returns nothing even though the material exists. What's the most likely cause and fix?",
          explanation: "SAP stores material numbers in an internal format with leading zeros ('000...100'). The inbound '100' doesn't match until you run CONVERSION_EXIT_ALPHA_INPUT to convert it to internal format before selecting.",
          options: {
            create: [
              { text: "Internal vs display format mismatch — apply CONVERSION_EXIT_ALPHA_INPUT first", isCorrect: true },
              { text: "The database is corrupted", isCorrect: false },
              { text: "Material numbers can't be selected in ABAP", isCorrect: false },
              { text: "You must SELECT * to find it", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the difference between STRING and XSTRING in ABAP?",
          explanation: "STRING is a variable-length character type; XSTRING is a variable-length binary type used for binary content like files, PDFs, images, and encrypted data.",
          options: {
            create: [
              { text: "STRING is variable-length text; XSTRING is variable-length binary data", isCorrect: true },
              { text: "STRING is for numbers; XSTRING is for dates", isCorrect: false },
              { text: "They are identical", isCorrect: false },
              { text: "XSTRING can only hold 10 characters", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "In modern ABAP integration work, what is /UI2/CL_JSON commonly used for?",
          explanation: "/UI2/CL_JSON serializes ABAP data to JSON and deserializes JSON into ABAP structures/tables — the standard helper for custom REST/HTTP integrations where you handle the payload yourself.",
          options: {
            create: [
              { text: "Serializing/deserializing between ABAP structures and JSON", isCorrect: true },
              { text: "Rendering printed invoices", isCorrect: false },
              { text: "Scheduling background jobs", isCorrect: false },
              { text: "Creating database indexes", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.17: Dialog Programming (Dynpros / Screen Programming)
const lesson11_17 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-dialog-programming" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "Dialog Programming (Dynpros / Screen Programming)",
    slug: "abap-dialog-programming",
    order: 17,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A retailer still runs a heavily customized legacy transaction — a custom module pool where warehouse clerks key in goods movements on a green SAP GUI screen with an editable table grid. The business won't move it to Fiori this year, and it just broke after an upgrade. Karthik, a developer who only ever learned RAP and Fiori, is handed the fix and stares at PBO and PAI modules he's never seen. To maintain the SAP install base, you still need to read and fix dynpro programs.

Dynpro programming is "legacy" but enormous: the majority of classic SAP GUI transactions are built this way, and they're not all disappearing soon.`,
    content: `## What a Dynpro Is

A **dynpro** ("dynamic program") is a SAP GUI screen plus its flow logic, tied to a **module pool** program (type M). It is the classic, pre-Fiori way users interact with SAP — the green screens of transactions like MIGO, VA01, and countless custom Z-transactions. While new development is RAP/Fiori, the installed base is overwhelmingly dynpro, so reading and maintaining it remains a real skill.

## The Two Halves: Layout and Flow Logic

A dynpro has two parts:

1. **Screen layout** — the fields, buttons, and controls, designed in the **Screen Painter (SE51)**.
2. **Flow logic** — special (non-ABAP) statements that call ABAP modules at defined moments.

The flow logic has two key events:

| Event | When it runs | Typical use |
|-------|--------------|-------------|
| **PBO (Process Before Output)** | Just before the screen is displayed | Initialize fields, set dropdowns, show/hide, set GUI status |
| **PAI (Process After Input)** | After the user acts (presses a button/Enter) | Read input, validate, react to the function code (OK_CODE) |

A minimal flow logic looks like:

\`\`\`text
PROCESS BEFORE OUTPUT.
  MODULE status_0100.
PROCESS AFTER INPUT.
  MODULE user_command_0100.
\`\`\`

Each MODULE is implemented in ABAP in the module pool. PBO modules prepare the screen; PAI modules handle what the user did, branching on the **OK_CODE** (the function code of the button pressed).

## The Components You Touch

| Tool | Purpose |
|------|---------|
| **SE51** Screen Painter | Design the screen layout and field attributes |
| **SE41** Menu Painter | Define GUI status (menu bar, toolbar, function keys) |
| **SE80 / SE38** | The module pool program holding PBO/PAI modules |
| **SE93** | Define the transaction code that launches the dynpro |

A working transaction therefore ties together: a screen (SE51), a GUI status (SE41), module-pool ABAP (PBO/PAI), and a transaction code (SE93).

## Table Controls and Step Loops

Editable grids on dynpros are built with **table controls** (the modern option) or older **step loops**. A table control shows a scrollable, multi-row block where each visible line maps to a work area; you loop over the control in PAI to read back what the user changed, and in PBO to fill it. This is how the warehouse clerk's editable goods-movement grid works — and a common source of subtle bugs (line selection, scrolling, field-symbol handling).

## Why It Still Matters

Two reasons. First, **maintenance**: thousands of custom dynpro transactions run production processes and need bug fixes and small enhancements. Second, **understanding standard SAP**: most classic transactions are dynpro-based, so to debug them (set a breakpoint in a PAI module, inspect the OK_CODE) you must understand the PBO/PAI cycle. New strategic UI is Fiori via RAP — but a complete ABAP developer can still navigate and repair the dynpro world Karthik was thrown into.`,
    keyConceptTitle: "Dynpros = screen (SE51) + flow logic (PBO/PAI) in a module pool, launched by a T-code",
    keyConceptBody: `- A **dynpro** is a SAP GUI screen plus flow logic in a module-pool program — the classic, still-vast way users interact with SAP.
- **PBO (Process Before Output)** prepares the screen before display; **PAI (Process After Input)** handles user input and branches on the **OK_CODE**.
- Build with **SE51** (Screen Painter), **SE41** (Menu Painter/GUI status), the module pool ABAP, and **SE93** (transaction code); editable grids use **table controls**.
- New UIs are RAP/Fiori, but dynpro skills are essential for maintaining and debugging the installed base.`,
  },
});
const flowchart11_17 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_17.id },
  update: {},
  create: {
    lessonId: lesson11_17.id,
    title: "The Dynpro PBO / PAI Cycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "▶️ User Calls Transaction (T-code)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "🖥️ PBO: Prepare Screen" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 120 }, data: { label: "⌨️ User Inputs + Presses Button" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 510, y: 260 }, data: { label: "🔁 PAI: Read OK_CODE & Validate" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 760, y: 260 }, data: { label: "✅ Process / Save or Re-display" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node2", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart11_17.id, nodeId: "node1", title: "Call Transaction", description: "A transaction code (defined in SE93) starts the module pool and displays its initial dynpro screen.", tCode: "SE93", tips: "SE93 links the T-code to the program and first screen number." },
    { flowchartId: flowchart11_17.id, nodeId: "node2", title: "PBO: Prepare Screen", description: "Process Before Output runs just before the screen appears — initialize fields, set the GUI status, fill table controls, show/hide elements.", tCode: "SE51 / module pool", tips: "Set the GUI status in PBO (SET PF-STATUS) or the toolbar buttons won't appear." },
    { flowchartId: flowchart11_17.id, nodeId: "node3", title: "User Input", description: "The user types into fields and presses a button or Enter, sending the screen back with a function code.", tCode: "N/A", tips: "Every actionable button carries a function code that lands in OK_CODE." },
    { flowchartId: flowchart11_17.id, nodeId: "node4", title: "PAI: Handle Input", description: "Process After Input reads the entered values and the OK_CODE, validates them, and decides what to do next.", tCode: "SE41 (status) / module pool", tips: "Set a breakpoint in the PAI user_command module to debug what a button actually does." },
    { flowchartId: flowchart11_17.id, nodeId: "node5", title: "Process or Re-display", description: "Based on the OK_CODE, the program saves/navigates, or returns to PBO to re-display the screen (e.g. after a validation error).", tCode: "module pool", tips: "On validation failure, issue an error message in PAI to keep the user on the same screen." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson11_17.id },
  update: {},
  create: {
    lessonId: lesson11_17.id,
    title: "Dialog Programming — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the difference between PBO and PAI in a dynpro?",
          explanation: "PBO (Process Before Output) runs just before the screen is shown, to prepare it (initialize fields, set GUI status, fill table controls). PAI (Process After Input) runs after the user acts, to read input, validate, and react to the OK_CODE.",
          options: {
            create: [
              { text: "PBO prepares the screen before display; PAI handles user input after they act", isCorrect: true },
              { text: "PBO runs only on errors; PAI runs only on success", isCorrect: false },
              { text: "PBO is for printing; PAI is for emailing", isCorrect: false },
              { text: "They are the same event with two names", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A developer wants to debug exactly what happens when a user clicks 'Save' on a custom transaction's screen. Where should they set a breakpoint?",
          explanation: "The button's function code is processed in the PAI user_command module, where the program branches on the OK_CODE. Setting a breakpoint there reveals what the Save action actually does.",
          options: {
            create: [
              { text: "In the PAI module that evaluates the OK_CODE", isCorrect: true },
              { text: "In the database table definition", isCorrect: false },
              { text: "In the Fiori controller", isCorrect: false },
              { text: "Breakpoints don't work in dynpros", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why are dynpro programming skills still relevant even though new UIs are built with RAP/Fiori?",
          explanation: "The vast installed base of classic SAP GUI transactions — both standard and custom Z-transactions — is dynpro-based and requires maintenance, bug fixes, and debugging. Understanding PBO/PAI is necessary to support and troubleshoot them.",
          options: {
            create: [
              { text: "The large installed base of GUI transactions still needs maintenance and debugging", isCorrect: true },
              { text: "RAP cannot read any data", isCorrect: false },
              { text: "Dynpros are faster than HANA", isCorrect: false },
              { text: "Fiori apps are built from dynpros internally", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 11.18: Class-Based Exception Handling
const lesson11_18 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-class-based-exceptions" } },
  update: {},
  create: {
    moduleId: abapModule.id,
    title: "Class-Based Exception Handling",
    slug: "abap-class-based-exceptions",
    order: 18,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A code review flags Priya's new method: after every operation she checks SY-SUBRC with nested IFs, and a division-by-zero deep in a calculation silently produced a wrong result that reached a report. The reviewer asks her to use class-based exceptions: a single TRY/CATCH that handles errors cleanly and can't be ignored. Modern ABAP — and especially RAP and OO ABAP — is built around exceptions, not return codes.

Robust error handling is what separates code that fails loudly and safely from code that quietly produces wrong numbers.`,
    content: `## Why Exceptions Replaced SY-SUBRC

The old style checked the system field **SY-SUBRC** after each statement and branched with IFs. Problems: it's easy to forget a check, errors pass silently, and the logic gets tangled. Some runtime errors (like division by zero or invalid conversions) don't even set SY-SUBRC — they short-dump. **Class-based exceptions** make errors first-class objects you handle in a structured block, and many built-in errors now raise catchable exceptions instead of dumping.

## TRY / CATCH / CLEANUP / ENDTRY

The structure is:

\`\`\`abap
TRY.
    DATA(result) = numerator / denominator.
    process( result ).
  CATCH cx_sy_zerodivide INTO DATA(lx).
    log_error( lx->get_text( ) ).
  CLEANUP.
    " runs if an exception leaves the TRY block (release resources)
ENDTRY.
\`\`\`

- **TRY** wraps the protected code.
- **CATCH** handles a specific exception class (and its subclasses). Multiple CATCH blocks can handle different types.
- **CLEANUP** runs when an exception propagates out, to release locks/resources.
- The exception object (\`lx\`) carries a message via \`get_text( )\` and structured attributes.

## The Exception Class Hierarchy

All exceptions inherit from **CX_ROOT**. Three abstract subclasses define handling rules:

| Class | Must be declared/handled? | Use for |
|-------|---------------------------|---------|
| **CX_STATIC_CHECK** | Yes — compiler enforces declaration in signature | Anticipated, business-level errors |
| **CX_DYNAMIC_CHECK** | Not compiler-checked; dump if uncaught | Errors that "shouldn't" happen if preconditions hold (e.g. zero-divide) |
| **CX_NO_CHECK** | Never declared; always implicitly possible | Severe, pervasive errors (e.g. out of memory) |

Choosing the right base class signals intent: STATIC_CHECK forces callers to deal with it; NO_CHECK is for things you can't reasonably force everyone to handle.

## Raising Your Own Exceptions

You define an exception class (subclass of one of the above) in SE24/ADT and raise it:

\`\`\`abap
IF amount < 0.
  RAISE EXCEPTION TYPE zcx_invalid_amount
    EXPORTING amount = amount.
ENDIF.
\`\`\`

You can also \`RAISE EXCEPTION ... MESSAGE\` to attach a T100 message, integrating with SAP's message infrastructure — important in RAP where failures surface as messages to Fiori.

## Resumable Exceptions

A specialized feature: an exception raised with \`RAISE RESUMABLE EXCEPTION\` can be caught and, if appropriate, execution **resumed** after the raising statement with \`RESUME\`. It's rare but useful when the handler can correct the situation and continue rather than abort.

## Best Practices

- Use **CX_STATIC_CHECK** for expected business errors so callers are forced to handle them.
- Catch **specific** exception classes, not just CX_ROOT, so you don't swallow unrelated errors.
- Use **CLEANUP** to release locks and resources on failure.
- Don't catch-and-ignore: log or rethrow with context. Priya's silent wrong number came precisely from a missing handler — a TRY/CATCH around the division would have caught CX_SY_ZERODIVIDE and failed loudly instead of quietly.`,
    keyConceptTitle: "Handle errors with TRY/CATCH and exception classes, not SY-SUBRC checks",
    keyConceptBody: `- Class-based exceptions make errors structured objects handled in **TRY / CATCH / CLEANUP / ENDTRY** — safer than scattered SY-SUBRC checks that are easy to forget.
- All exceptions extend **CX_ROOT**; the base class (**CX_STATIC_CHECK** = compiler-enforced, **CX_DYNAMIC_CHECK**, **CX_NO_CHECK**) signals how callers must handle it.
- Raise your own with **RAISE EXCEPTION TYPE zcx_...** (optionally with a T100 MESSAGE, which RAP surfaces to Fiori); **CLEANUP** releases resources on failure.
- Catch specific classes, never silently swallow — log or rethrow with context.`,
  },
});
const flowchart11_18 = await prisma.flowchart.upsert({
  where: { lessonId: lesson11_18.id },
  update: {},
  create: {
    lessonId: lesson11_18.id,
    title: "Exception Flow: TRY / CATCH / CLEANUP",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🟦 TRY: Protected Code Runs" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 60 }, data: { label: "✅ No Error → Continue" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 290, y: 180 }, data: { label: "⚠️ Exception Raised (cx_...)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 180 }, data: { label: "🛟 CATCH: Handle by Class" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 520, y: 300 }, data: { label: "🧹 CLEANUP: Release Resources" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 760, y: 180 }, data: { label: "📝 Log / Rethrow with Context" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart11_18.id, nodeId: "node1", title: "TRY Block", description: "The code that might fail runs inside TRY. If nothing goes wrong, execution simply continues past ENDTRY.", tCode: "ABAP", tips: "Keep TRY blocks focused around the risky operation so the handler is meaningful." },
    { flowchartId: flowchart11_18.id, nodeId: "node2", title: "No Error Path", description: "When no exception is raised, the protected code completes normally and the CATCH/CLEANUP blocks are skipped.", tCode: "ABAP", tips: "The happy path stays clean — no SY-SUBRC checks cluttering the logic." },
    { flowchartId: flowchart11_18.id, nodeId: "node3", title: "Exception Raised", description: "A statement raises an exception object (built-in like CX_SY_ZERODIVIDE, or your own ZCX_*), interrupting normal flow.", tCode: "RAISE EXCEPTION TYPE", tips: "Many runtime errors now raise catchable exceptions instead of short-dumping." },
    { flowchartId: flowchart11_18.id, nodeId: "node4", title: "CATCH by Class", description: "The matching CATCH block (by exception class or superclass) handles the error, using the exception object's text and attributes.", tCode: "CATCH cx_... INTO", tips: "Catch specific classes; catching CX_ROOT broadly can hide unrelated bugs." },
    { flowchartId: flowchart11_18.id, nodeId: "node5", title: "CLEANUP", description: "If an exception propagates out of the TRY block, CLEANUP runs first to release locks, close connections, or undo partial work.", tCode: "CLEANUP", tips: "Use CLEANUP to avoid leaving locks (SM12) dangling after a failure." },
    { flowchartId: flowchart11_18.id, nodeId: "node6", title: "Log or Rethrow", description: "Good handlers log the error with context or rethrow a higher-level exception — never silently swallow it.", tCode: "get_text( ) / RAISE", tips: "Silent catch-and-ignore is how wrong numbers reach reports; always surface the error." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson11_18.id },
  update: {},
  create: {
    lessonId: lesson11_18.id,
    title: "Class-Based Exceptions — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why are class-based exceptions preferred over checking SY-SUBRC after each statement?",
          explanation: "SY-SUBRC checks are easy to forget, let errors pass silently, and clutter logic; some runtime errors don't even set SY-SUBRC. Exceptions are structured objects handled in TRY/CATCH that fail loudly and can't be silently skipped, with cleaner separation of the happy path.",
          options: {
            create: [
              { text: "They make errors structured and hard to ignore, with cleaner control flow", isCorrect: true },
              { text: "They run faster than any other code", isCorrect: false },
              { text: "They remove the need to handle errors at all", isCorrect: false },
              { text: "SY-SUBRC does not exist in ABAP", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "You define a business error that callers MUST be forced to handle at compile time. Which base exception class should you extend?",
          explanation: "CX_STATIC_CHECK exceptions are compiler-checked: a method that raises one must declare it, and callers must handle or propagate it. This is ideal for anticipated business errors you want to force callers to deal with.",
          options: {
            create: [
              { text: "CX_STATIC_CHECK", isCorrect: true },
              { text: "CX_NO_CHECK", isCorrect: false },
              { text: "CX_SY_ZERODIVIDE", isCorrect: false },
              { text: "CX_ROOT only", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the purpose of the CLEANUP block in TRY...ENDTRY?",
          explanation: "CLEANUP runs when an exception propagates out of the TRY block, before control leaves it — the place to release resources such as locks or open connections so a failure doesn't leave the system in a bad state.",
          options: {
            create: [
              { text: "To release resources (locks, connections) when an exception leaves the TRY block", isCorrect: true },
              { text: "To run only when there is no error", isCorrect: false },
              { text: "To define the screen layout", isCorrect: false },
              { text: "To permanently delete the exception class", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── S/4HANA: ADVANCED LESSONS (Session 6) ───────────────────────────────────
// LESSON 13.11: Group Reporting & Financial Consolidation
const lesson13_11 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-group-reporting" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "Group Reporting & Financial Consolidation",
    slug: "s4-group-reporting",
    order: 11,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A group CFO needs one consolidated set of financials covering 14 legal entities across 6 countries. Internally, those entities sell to each other constantly, so simply adding up their books would double-count billions in intercompany revenue. Meena, the consolidation consultant, must eliminate intercompany transactions, translate currencies to the group currency, and account for partially-owned subsidiaries — then publish a true group result. In S/4HANA she does this in Group Reporting, not the old BPC or SEM-BCS systems.

Consolidation is where individual company books become the single number the market and regulators see.`,
    content: `## What Consolidation Solves

A corporate group is many legal entities, but investors and regulators want **one** financial picture. You can't just sum the entities' books because they trade with each other — those internal transactions must be removed. **Financial consolidation** combines entity financials into group statements, eliminating internal effects. In S/4HANA, **Group Reporting** is the built-in consolidation solution, replacing the older standalone **SAP BPC** and **SEM-BCS**.

## The Core Adjustments

| Step | What it does | Why |
|------|--------------|-----|
| **Currency translation** | Convert each entity's local-currency figures to the group currency | Entities report in different currencies |
| **Intercompany elimination** | Remove sales/purchases and payables/receivables between group entities | Avoid double-counting internal trade |
| **Investment elimination** | Net the parent's investment against subsidiary equity | A subsidiary isn't an "asset you bought" at group level |
| **Minority interests** | Recognize the share of partly-owned subs not owned by the parent | Reflect true ownership |

Intercompany elimination is the headline: if Company A sells 10 crore to Company B inside the group, group revenue must exclude that 10 crore — it never left the group.

## The Organizational Structure

Group Reporting introduces consolidation-specific units:

- **Consolidation Unit** — an entity included in consolidation (often mapped from a company code).
- **Consolidation Group** — a hierarchy grouping units (e.g. region → division → whole group), so you can consolidate at multiple levels.
- **Financial Statement (FS) items** — the consolidation chart of accounts the entities' G/L accounts map to.

This lets the CFO see a consolidated P&L for "Asia" and for "the whole group" from the same data.

## Integration with ACDOCA: Real-Time vs Periodic

This is the S/4HANA advantage. Group Reporting can read from the **Universal Journal (ACDOCA)** so transactional data flows in with minimal staging — enabling **real-time / continuous consolidation** previews rather than only a slow period-end batch. Companies can still run a controlled periodic close, but the gap between "operational data" and "consolidated view" shrinks dramatically because the data already lives in one place.

| | Old (BPC/BCS) | S/4HANA Group Reporting |
|--|---------------|-------------------------|
| Data source | Separate cube, loaded periodically | ACDOCA + consolidation journals |
| Timing | Periodic, after data load | Real-time previews possible |
| Landscape | Separate system | Embedded in S/4HANA |

## The Close Process and FC10

At period-end the team runs a **data monitor** and **consolidation monitor**: collect/validate data per unit, run currency translation, then execute elimination and consolidation tasks. The classic transaction to drive the **data monitor** is **FC10** (with the consolidation monitor for group tasks). Each task has a status per unit, so the team can see exactly what's collected, validated, translated, and eliminated.

## Why It Matters

Group Reporting is how a multi-entity enterprise produces trustworthy, audit-ready consolidated statements. Mastering eliminations, the consolidation unit/group hierarchy, and the ACDOCA integration is essential for any finance consultant on a group-level S/4HANA project — and it's a high-value, specialized skill.`,
    keyConceptTitle: "Group Reporting consolidates entities: eliminate intercompany, translate currency, embedded in ACDOCA",
    keyConceptBody: `- **Group Reporting** is S/4HANA's built-in consolidation, replacing BPC/SEM-BCS, producing one group result from many legal entities.
- Core adjustments: **currency translation**, **intercompany elimination** (remove internal trade to avoid double-counting), investment elimination, and **minority interests**.
- It uses **consolidation units** and a **consolidation group hierarchy** mapped to FS items, and integrates with **ACDOCA** for real-time (not just periodic) consolidation.
- The close is driven via data/consolidation monitors (e.g. **FC10**), each task tracked per unit.`,
  },
});
const flowchart13_11 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_11.id },
  update: {},
  create: {
    lessonId: lesson13_11.id,
    title: "Consolidation Flow: Entities to Group Result",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🏢 Entity Books (per Consolidation Unit)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 310, y: 120 }, data: { label: "💱 Currency Translation" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 530, y: 120 }, data: { label: "✂️ Intercompany Elimination" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 530, y: 260 }, data: { label: "🧮 Investment Elim + Minority Interest" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 790, y: 120 }, data: { label: "📊 Consolidated Group Statements" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_11.id, nodeId: "node1", title: "Entity Books", description: "Each legal entity is a consolidation unit. Its financial data (often from ACDOCA) is collected and validated in the data monitor.", tCode: "FC10 (Data Monitor)", tips: "Map company codes to consolidation units carefully — it drives everything downstream." },
    { flowchartId: flowchart13_11.id, nodeId: "node2", title: "Currency Translation", description: "Each unit's local-currency figures are translated to the group currency using configured rates and methods.", tCode: "Consolidation Monitor", tips: "Translation differences are themselves posted — they're part of a correct group result." },
    { flowchartId: flowchart13_11.id, nodeId: "node3", title: "Intercompany Elimination", description: "Sales/purchases and payables/receivables between group entities are removed so internal trade isn't counted as group activity.", tCode: "Consolidation Monitor", tips: "Matching intercompany pairs is the hard part; mismatches block a clean elimination." },
    { flowchartId: flowchart13_11.id, nodeId: "node4", title: "Investment Elim + Minorities", description: "The parent's investment is netted against subsidiary equity, and the portion of partly-owned subs not owned by the group is recognized as minority interest.", tCode: "Consolidation Monitor", tips: "Ownership percentages drive minority interest — keep them current." },
    { flowchartId: flowchart13_11.id, nodeId: "node5", title: "Group Statements", description: "After all tasks, consolidated statements are produced at any level of the consolidation group hierarchy (region, division, total).", tCode: "Group Reporting / Fiori", tips: "Because it's embedded in S/4HANA, you can preview consolidation in near real time." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson13_11.id },
  update: {},
  create: {
    lessonId: lesson13_11.id,
    title: "Group Reporting — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Company A (in the group) sells ₹10 crore of goods to Company B (also in the group). Why must this be eliminated in consolidation?",
          explanation: "The sale never left the group — it's internal trade. Including it would double-count revenue and inflate group figures. Intercompany elimination removes such internal transactions so the consolidated statements reflect only activity with the outside world.",
          options: {
            create: [
              { text: "It's internal trade; counting it would double-count and inflate group revenue", isCorrect: true },
              { text: "Intercompany sales are illegal", isCorrect: false },
              { text: "Company B didn't really receive the goods", isCorrect: false },
              { text: "It must be eliminated to lower taxes", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is a key S/4HANA advantage of Group Reporting over the older BPC/SEM-BCS approach?",
          explanation: "Group Reporting is embedded in S/4HANA and can read from the Universal Journal (ACDOCA), enabling real-time/continuous consolidation previews rather than relying solely on periodic data loads into a separate system.",
          options: {
            create: [
              { text: "It's embedded and integrates with ACDOCA for real-time consolidation", isCorrect: true },
              { text: "It eliminates the need for any currency translation", isCorrect: false },
              { text: "It removes the concept of legal entities", isCorrect: false },
              { text: "It only works once per year", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is a 'consolidation group' in Group Reporting?",
          explanation: "A consolidation group is a hierarchy that groups consolidation units (e.g. region → division → whole group), allowing consolidated statements to be produced at multiple levels from the same underlying unit data.",
          options: {
            create: [
              { text: "A hierarchy grouping consolidation units to consolidate at multiple levels", isCorrect: true },
              { text: "A single bank account for the group", isCorrect: false },
              { text: "A type of intercompany invoice", isCorrect: false },
              { text: "The group's IT support team", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.12: Revenue Accounting & Reporting (RAR / IFRS 15)
const lesson13_12 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-revenue-accounting-rar" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "Revenue Accounting & Reporting (RAR / IFRS 15)",
    slug: "s4-revenue-accounting-rar",
    order: 12,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A software company sells a bundle: a 3-year license, 12 months of support, and an implementation service — for one combined price, invoiced upfront. Classic SD billing would recognize the whole amount as revenue when invoiced. But the auditors invoke IFRS 15: revenue must be spread across the distinct promises as they're delivered. Arjun, the finance architect, configures SAP Revenue Accounting & Reporting (RAR) so the system recognizes revenue correctly — which makes the company's reported revenue look very different from what was billed.

Revenue recognition is one of the most scrutinized numbers in any company, and RAR is how S/4HANA gets it right under modern accounting standards.`,
    content: `## The Problem: Billing ≠ Revenue

Intuitively, you'd recognize revenue when you invoice. But accounting standards **IFRS 15** (and the equivalent **ASC 606**) say revenue must be recognized as you **satisfy performance obligations** — the distinct promises in a contract — not simply when cash is billed. For bundles, subscriptions, and multi-element deals, "billed" and "earned" diverge sharply. **SAP Revenue Accounting & Reporting (RAR)** is the S/4HANA solution that applies these rules systematically.

## The 5-Step Model (IFRS 15)

RAR operationalizes the standard's five steps:

| Step | What it means |
|------|---------------|
| 1. Identify the contract | The agreement with the customer |
| 2. Identify performance obligations | The distinct goods/services promised (license, support, service) |
| 3. Determine the transaction price | The total consideration |
| 4. Allocate the price to obligations | Split the price across obligations by **standalone selling price (SSP)** |
| 5. Recognize revenue | As each obligation is satisfied (point-in-time or over time) |

The bundle from the story has three performance obligations; the single price is allocated across them, and each is recognized on its own schedule — the license maybe over 3 years, support over 12 months, the service when delivered.

## How RAR Connects to SD

RAR doesn't replace SD; it sits alongside it and consumes **revenue accounting items (RAIs)** generated by operational documents:

1. A **sales order** in SD creates order RAIs → RAR identifies the contract and performance obligations.
2. **Invoices** create invoice RAIs → RAR knows what was billed (affecting receivables and contract assets/liabilities).
3. **Fulfillment** events (goods issue, service confirmation) create fulfillment RAIs → RAR recognizes revenue for the satisfied obligation.

So the same sales process drives both the operational invoice (SD) and the correct accounting recognition (RAR), but they're decoupled in timing.

## Why Reported Revenue Differs from Billing

This is the practical punchline. With RAR:

- **Billed upfront, earned over time:** invoicing 3 years of license upfront does **not** recognize 3 years of revenue now — it creates a **contract liability** (deferred revenue) that releases to revenue monthly.
- **Earned before billed:** delivering a service before invoicing creates a **contract asset** (accrued revenue).

So a company's income statement revenue under RAR reflects *performance*, while billing reflects *cash timing* — and a CFO must explain the difference to investors. A subscription business can have huge billings but smoothly recognized revenue.

## Practical Impact and Setup

RAR involves configuring how SD items map to performance obligations, how SSP is determined, and the recognition method (point-in-time vs over-time, e.g. straight-line). It posts to FI (often via the Universal Journal) so the recognized revenue, contract assets, and contract liabilities appear in the financials. For consultants, the key competencies are obligation identification, SSP allocation, and reconciling RAR output back to SD billing — a frequent audit and go-live focus.`,
    keyConceptTitle: "RAR applies IFRS 15: recognize revenue as obligations are satisfied, not when billed",
    keyConceptBody: `- **IFRS 15 / ASC 606** require recognizing revenue as **performance obligations** are satisfied, via a **5-step model** (identify contract → obligations → price → allocate by SSP → recognize).
- **SAP RAR** consumes revenue accounting items (RAIs) from SD order/invoice/fulfillment events — it runs alongside SD, decoupling billing timing from recognition.
- Billing upfront for future delivery creates a **contract liability** (deferred revenue); delivering before billing creates a **contract asset** — so reported revenue differs from billings.
- Key consulting skills: obligation identification, standalone-selling-price allocation, and reconciling RAR to SD.`,
  },
});
const flowchart13_12 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_12.id },
  update: {},
  create: {
    lessonId: lesson13_12.id,
    title: "From Sales Order to Recognized Revenue (RAR)",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🛒 SD Sales Order → Order RAIs" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "📑 Identify Performance Obligations" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 540, y: 120 }, data: { label: "⚖️ Allocate Price by SSP" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 540, y: 260 }, data: { label: "🧾 Invoice & Fulfillment RAIs" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 790, y: 120 }, data: { label: "📈 Recognize Revenue Over Time → FI" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node5", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node1", target: "node4", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_12.id, nodeId: "node1", title: "Sales Order → Order RAIs", description: "An SD sales order generates revenue accounting items that RAR uses to identify the contract and its promises.", tCode: "VA01 / RAR inbound", tips: "RAR consumes RAIs; it doesn't replace SD — the operational order still drives logistics and billing." },
    { flowchartId: flowchart13_12.id, nodeId: "node2", title: "Performance Obligations", description: "RAR breaks the contract into distinct performance obligations (e.g. license, support, service), each recognized on its own basis.", tCode: "RAR config", tips: "Correctly splitting a bundle into obligations is the heart of IFRS 15 compliance." },
    { flowchartId: flowchart13_12.id, nodeId: "node3", title: "Allocate by SSP", description: "The single transaction price is allocated across obligations by their standalone selling prices, so each gets its fair share of revenue.", tCode: "RAR (SSP)", tips: "If SSP isn't observable, it must be estimated — a common audit discussion point." },
    { flowchartId: flowchart13_12.id, nodeId: "node4", title: "Invoice & Fulfillment RAIs", description: "Invoices and fulfillment events (goods issue, service confirmation) feed RAR so it knows what's billed versus what's delivered.", tCode: "VF01 / fulfillment", tips: "Billing and fulfillment timing differences create contract assets/liabilities." },
    { flowchartId: flowchart13_12.id, nodeId: "node5", title: "Recognize Revenue → FI", description: "RAR recognizes revenue as obligations are satisfied (over time or point-in-time) and posts to FI, including deferred revenue and accrued revenue.", tCode: "RAR → FI (ACDOCA)", tips: "This is why reported revenue under RAR diverges from raw SD billings." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson13_12.id },
  update: {},
  create: {
    lessonId: lesson13_12.id,
    title: "Revenue Accounting (RAR) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A company invoices a customer upfront for a 3-year software license. Under IFRS 15 / RAR, how is revenue treated?",
          explanation: "Revenue is recognized as the performance obligation is satisfied — here, over the 3 years. Invoicing upfront creates a contract liability (deferred revenue) that releases to revenue over the license period, rather than recognizing it all at invoicing.",
          options: {
            create: [
              { text: "Recognized over the 3 years; the upfront invoice creates deferred revenue (contract liability)", isCorrect: true },
              { text: "Fully recognized at the moment of invoicing", isCorrect: false },
              { text: "Never recognized because it was prepaid", isCorrect: false },
              { text: "Recognized only in the final year", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "In the IFRS 15 five-step model, what is the purpose of allocating the transaction price by standalone selling price (SSP)?",
          explanation: "When a single price covers multiple performance obligations, it must be split across them fairly. Allocating by SSP gives each obligation its proportionate share of the price, so revenue for each is recognized in the right amount on its own schedule.",
          options: {
            create: [
              { text: "To split a bundled price fairly across each distinct performance obligation", isCorrect: true },
              { text: "To calculate the customer's credit limit", isCorrect: false },
              { text: "To set the bank account for payment", isCorrect: false },
              { text: "To eliminate intercompany sales", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "How does RAR relate to standard SD billing?",
          explanation: "RAR runs alongside SD, consuming revenue accounting items generated by SD order, invoice, and fulfillment events. It decouples recognition timing from billing — SD still handles operational billing while RAR handles compliant revenue recognition.",
          options: {
            create: [
              { text: "It runs alongside SD, consuming RAIs from order/invoice/fulfillment events", isCorrect: true },
              { text: "It fully replaces SD billing", isCorrect: false },
              { text: "It has no connection to SD at all", isCorrect: false },
              { text: "It only works without any sales orders", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.13: Treasury & Cash Management in S/4HANA
const lesson13_13 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-treasury-cash-management" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "Treasury & Cash Management in S/4HANA",
    slug: "s4-treasury-cash-management",
    order: 13,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A group treasurer manages 80 bank accounts across 20 banks and must answer every morning: "How much cash do we have, where is it, and what's our position by end of week?" Previously this meant spreadsheets emailed from regional finance teams — always a day late. Lakshmi, implementing S/4HANA, sets up Bank Account Management and Cash Management so the treasurer opens a Fiori "Cash Position" app and sees a live, consolidated view, then plans liquidity and even manages currency hedges in the same platform.

Treasury is about not running out of cash and not taking unintended financial risk — and S/4HANA unified what used to be a scattered landscape.`,
    content: `## What Treasury & Cash Management Covers

Treasury answers three questions: **how much cash do we have and where** (cash positioning), **what will we have** (liquidity planning/forecasting), and **what financial risk are we carrying** (instruments, FX, interest rate). In S/4HANA these capabilities are integrated into the core, simplifying the old, fragmented **SAP FSCM** landscape into a more unified, Fiori-driven solution.

## Bank Account Management (BAM)

**Bank Account Management** is the foundation: a central, governed master of all the company's bank accounts — which bank, currency, signatories, and the connected house bank/G/L. In S/4HANA, BAM (with the **Manage Bank Accounts** Fiori app and a bank account workflow) replaces maintaining bank data scattered in configuration. You can't have a reliable cash position if you don't first have a clean, complete register of bank accounts — BAM provides it.

## Cash Management: Position and Liquidity

| Capability | Question answered | Tool |
|------------|-------------------|------|
| **Cash Position** | How much cash do we have right now, by bank/account/currency? | "Cash Position" Fiori app |
| **Liquidity Forecast** | What cash will we have over the coming days/weeks? | Liquidity planning |
| **Bank statement processing** | Reconcile actual bank movements | Electronic bank statement |

The cash position draws on near-real-time data — bank statements, payments, and AR/AP flows — so the treasurer sees one consolidated number instead of stitched-together spreadsheets. Liquidity forecasting projects future cash from open receivables, payables, and planned flows, flagging shortfalls before they happen.

## Treasury and Risk Management (TRM)

Beyond day-to-day cash, **TRM** manages **financial instruments** and **risk**: money-market deals, FX forwards/options, securities, and **hedging** of currency and interest-rate exposure. A company importing in USD but reporting in INR uses FX hedges to lock in rates; TRM records the deal, values it, and handles hedge accounting. TRM connects to the market-data and accounting layers so positions are valued and posted correctly.

## Fiori and Integration

The user experience is Fiori-first: **My Cash Position**, **Manage Bank Accounts**, **Cash Flow Analyzer**, and liquidity apps give treasurers live, drillable views. Underneath, Cash Management integrates with **FI** (the Universal Journal), **AR/AP** (expected in/outflows), **Bank Communication Management** (sending payments, receiving statements), and TRM (deal cash flows) — so one platform spans accounts, cash, and risk.

## How S/4HANA Simplified It

Previously, cash and liquidity (FSCM Cash & Liquidity Management), in-house cash, and treasury sat as separate, sometimes loosely-coupled components with heavy reconciliation. S/4HANA's in-memory core and the One Exposure data model bring positions together with less staging, and Fiori provides real-time visibility. The practical result for the treasurer in the story: a live morning cash position instead of a day-old spreadsheet, plus integrated liquidity planning and hedging in one system.`,
    keyConceptTitle: "S/4HANA Treasury: BAM register → live Cash Position & liquidity → TRM for risk, all Fiori-driven",
    keyConceptBody: `- **Bank Account Management (BAM)** is the governed central register of all bank accounts — the foundation for any reliable cash view (Manage Bank Accounts app).
- **Cash Management** delivers a near-real-time **cash position** and **liquidity forecast**, drawing on bank statements and AR/AP flows (My Cash Position Fiori app).
- **Treasury & Risk Management (TRM)** handles financial instruments and **hedging** (FX/interest-rate risk), with valuation and hedge accounting.
- S/4HANA unified the old fragmented FSCM landscape into an integrated, Fiori-first solution with real-time visibility.`,
  },
});
const flowchart13_13 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_13.id },
  update: {},
  create: {
    lessonId: lesson13_13.id,
    title: "Treasury & Cash Management Landscape",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🏦 Bank Account Management (Register)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 320, y: 60 }, data: { label: "💧 Cash Position (Fiori, live)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 320, y: 180 }, data: { label: "📅 Liquidity Forecast" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 560, y: 120 }, data: { label: "📈 Treasury & Risk Mgmt (Hedging)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 800, y: 120 }, data: { label: "📒 Posts to FI (Universal Journal)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart13_13.id, nodeId: "node1", title: "Bank Account Management", description: "A central, governed register of all bank accounts (bank, currency, signatories, linked G/L). It's the prerequisite for an accurate cash position.", tCode: "Manage Bank Accounts (Fiori)", tips: "Clean BAM data first — cash visibility is only as good as the account register behind it." },
    { flowchartId: flowchart13_13.id, nodeId: "node2", title: "Cash Position", description: "A near-real-time consolidated view of cash by bank, account, and currency, drawn from statements, payments, and AR/AP flows.", tCode: "My Cash Position (Fiori)", tips: "Live cash position replaces emailed spreadsheets that were always a day late." },
    { flowchartId: flowchart13_13.id, nodeId: "node3", title: "Liquidity Forecast", description: "Projects future cash from open receivables, payables, and planned flows, flagging shortfalls before they occur.", tCode: "Liquidity planning (Fiori)", tips: "Forecasting turns treasury from reactive to proactive — fund gaps before they bite." },
    { flowchartId: flowchart13_13.id, nodeId: "node4", title: "Treasury & Risk Management", description: "Manages financial instruments (money market, FX, securities) and hedges currency/interest-rate exposure, with valuation and hedge accounting.", tCode: "TRM", tips: "Hedging locks in rates for import/export exposure — TRM records, values, and accounts for the deals." },
    { flowchartId: flowchart13_13.id, nodeId: "node5", title: "Posts to FI", description: "Treasury and cash activities post to the Universal Journal, so financial instruments, cash, and risk positions are reflected in the books.", tCode: "FI (ACDOCA)", tips: "Integration with FI is why the cash view and the accounting view stay consistent." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson13_13.id },
  update: {},
  create: {
    lessonId: lesson13_13.id,
    title: "Treasury & Cash Management — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why is Bank Account Management (BAM) the foundation for cash management in S/4HANA?",
          explanation: "An accurate cash position requires a clean, complete register of all bank accounts. BAM provides that governed central register (bank, currency, signatories, linked G/L); without it, the cash position would be incomplete or wrong.",
          options: {
            create: [
              { text: "A reliable cash position needs a complete, governed register of all bank accounts", isCorrect: true },
              { text: "BAM physically transfers the money between banks", isCorrect: false },
              { text: "BAM replaces the general ledger", isCorrect: false },
              { text: "BAM is only for payroll", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does Treasury and Risk Management (TRM) primarily handle, beyond day-to-day cash?",
          explanation: "TRM manages financial instruments (money-market deals, FX forwards/options, securities) and the hedging of currency and interest-rate risk, including valuation and hedge accounting — distinct from daily cash positioning.",
          options: {
            create: [
              { text: "Financial instruments and hedging of FX/interest-rate risk", isCorrect: true },
              { text: "Printing customer invoices", isCorrect: false },
              { text: "Scheduling production orders", isCorrect: false },
              { text: "Maintaining employee master data", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the difference between the cash position and the liquidity forecast?",
          explanation: "The cash position shows how much cash exists right now (by bank/account/currency), while the liquidity forecast projects future cash over coming days/weeks from open receivables, payables, and planned flows — present snapshot vs forward-looking projection.",
          options: {
            create: [
              { text: "Cash position is current cash now; liquidity forecast projects future cash", isCorrect: true },
              { text: "They are the same report", isCorrect: false },
              { text: "Cash position is about the future; liquidity is about the past only", isCorrect: false },
              { text: "Neither uses bank data", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.14: S/4HANA for Procurement — Advanced Topics
const lesson13_14 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-advanced-procurement" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "S/4HANA for Procurement — Advanced Topics",
    slug: "s4-advanced-procurement",
    order: 14,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A multinational runs S/4HANA at headquarters but has 12 subsidiaries, each buying independently — losing volume discounts and visibility. Procurement also wants employees to self-serve everyday purchases without misbuying, and to connect electronically with suppliers instead of emailing POs. Karthik, the procurement architect, designs a landscape using Central Procurement for multi-entity buying, Ariba/SAP Business Network for supplier collaboration and guided buying, and tighter invoice controls. The goal: leverage scale, reduce maverick spend, and digitize supplier interaction.

Modern procurement is less about typing POs and more about networks, guided experiences, and control at scale.`,
    content: `## Beyond Basic Procure-to-Pay

You already know the basic P2P cycle (requisition → PO → goods receipt → invoice). Advanced S/4HANA procurement is about **scale, supplier connectivity, and control**: buying across many entities, collaborating with suppliers over a business network, guiding employee purchases, and tightening invoice handling.

## Ariba & SAP Business Network

The biggest shift is the **SAP Business Network** (formerly Ariba Network) — a cloud network connecting buyers and suppliers. Instead of emailing a PO, you transmit it electronically to the supplier, who returns order confirmations, ship notices, and e-invoices through the network. Related capabilities:

| Capability | What it does |
|------------|--------------|
| **SAP Business Network** | Electronic buyer-supplier document exchange (PO, confirmation, invoice) |
| **Guided Buying** | A consumer-like self-service buying experience that steers employees to preferred catalogs/suppliers and enforces policy |
| **Ariba Sourcing/Contracts** | Strategic sourcing events and contract management |

**Guided Buying** matters for control: it reduces **maverick/off-contract spend** by guiding casual buyers to approved sources, with policies and approvals built in — without forcing them to learn full SAP procurement.

## Central Procurement — Multi-Entity Buying

**Central Procurement** lets one central S/4HANA hub orchestrate buying across multiple connected back-end systems/entities. Two flagship scenarios:

- **Central Requisitioning** — employees in any connected system raise requisitions in the hub; POs are created in the relevant back-end.
- **Central Purchasing/Contracts** — manage purchase orders and central contracts across entities, so the group leverages combined volume and gains visibility.

For the story's multinational, this is how 12 subsidiaries can buy under negotiated group terms with central oversight, while each entity's documents still live in its own system.

## Advanced Returns & Supplier Collaboration

**Advanced Returns Management** handles the reverse flow to suppliers — returning defective or excess goods with proper documentation, refunds/credits, and tracking, integrated with quality and logistics. Combined with supplier collaboration on the Business Network (suppliers see returns, confirmations, and forecasts), the buyer-supplier relationship becomes a two-way digital exchange rather than email tennis.

## Invoice Management: Parking, Blocking, and Rules

On the payables side, advanced **MIRO** scenarios add control:

- **Invoice parking** — save an incomplete/uncertain invoice for later completion or review without posting it.
- **Invoice blocking** — the system blocks payment when an invoice fails the **3-way match** beyond tolerance (price or quantity variance), or for other reasons; blocked invoices are released only after review (MRBR).
- **Tolerance and blocking rules** — configured limits decide what auto-posts versus what gets blocked, balancing efficiency against control.

These ensure the company doesn't overpay or pay for what it didn't receive, even at high invoice volumes.

## Why It Matters

Advanced procurement is where companies capture real value: network-driven supplier collaboration, central buying for scale, guided buying to curb maverick spend, and disciplined invoice controls. For a consultant, integrating S/4HANA with Ariba/Business Network and designing central procurement and invoice-control rules are high-impact, in-demand competencies.`,
    keyConceptTitle: "Advanced procurement = Business Network + Guided Buying + Central Procurement + invoice control",
    keyConceptBody: `- The **SAP Business Network** (ex-Ariba) digitizes buyer-supplier exchange (PO, confirmation, e-invoice); **Guided Buying** gives self-service buying that curbs maverick spend.
- **Central Procurement** orchestrates buying across multiple entities/systems (central requisitioning, central purchasing/contracts) to leverage scale and visibility.
- **Advanced Returns Management** handles supplier returns; supplier collaboration makes the relationship a two-way digital exchange.
- Advanced **invoice management** (parking, blocking on 3-way-match variance, tolerance rules) protects against overpayment at scale.`,
  },
});
const flowchart13_14 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_14.id },
  update: {},
  create: {
    lessonId: lesson13_14.id,
    title: "Advanced Procurement Landscape",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🛍️ Guided Buying (Self-Service)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "🏢 Central Procurement Hub" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 520, y: 120 }, data: { label: "🌐 SAP Business Network (Suppliers)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 260 }, data: { label: "📦 Goods Receipt / Returns" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 780, y: 120 }, data: { label: "🧾 Invoice: 3-Way Match, Block/Park" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_14.id, nodeId: "node1", title: "Guided Buying", description: "A consumer-like self-service interface that steers employees to preferred catalogs/suppliers with built-in policy and approvals, curbing maverick spend.", tCode: "Guided Buying (Ariba)", tips: "Guided buying lets casual buyers comply with policy without learning full SAP procurement." },
    { flowchartId: flowchart13_14.id, nodeId: "node2", title: "Central Procurement Hub", description: "A central S/4HANA hub orchestrates requisitions, POs, and contracts across multiple connected entities/systems for scale and visibility.", tCode: "Central Procurement", tips: "Central requisitioning lets any entity buy under negotiated group terms with oversight." },
    { flowchartId: flowchart13_14.id, nodeId: "node3", title: "SAP Business Network", description: "Buyer and supplier exchange documents electronically — PO, order confirmation, ship notice, e-invoice — instead of emailing PDFs.", tCode: "SAP Business Network", tips: "Network connectivity reduces errors and accelerates the procure-to-pay cycle." },
    { flowchartId: flowchart13_14.id, nodeId: "node4", title: "Goods Receipt / Returns", description: "Goods are received; Advanced Returns Management handles sending defective or excess goods back to suppliers with proper documentation and credits.", tCode: "MIGO / Advanced Returns", tips: "Integrate returns with quality so defects trigger the right supplier credit flow." },
    { flowchartId: flowchart13_14.id, nodeId: "node5", title: "Invoice Control", description: "Invoices undergo the 3-way match; those failing beyond tolerance are blocked for review, and uncertain ones can be parked before posting.", tCode: "MIRO / MRBR", tips: "Tolerance and blocking rules balance auto-posting efficiency against payment control." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson13_14.id },
  update: {},
  create: {
    lessonId: lesson13_14.id,
    title: "Advanced Procurement — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "How does Guided Buying help reduce maverick (off-contract) spend?",
          explanation: "Guided Buying provides a consumer-like self-service experience that steers casual buyers toward preferred catalogs and suppliers with built-in policies and approvals — so employees buy compliantly without needing to learn full SAP procurement, reducing off-contract purchases.",
          options: {
            create: [
              { text: "It steers self-service buyers to approved sources with built-in policy", isCorrect: true },
              { text: "It blocks all purchasing entirely", isCorrect: false },
              { text: "It forces every employee to become a procurement expert", isCorrect: false },
              { text: "It only works for IT hardware", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A group wants subsidiaries to buy under negotiated group terms while keeping documents in their own systems. Which S/4HANA capability fits?",
          explanation: "Central Procurement orchestrates requisitions, POs, and contracts across multiple connected back-end entities from a central hub — leveraging combined volume and giving visibility, while each entity's documents still live in its own system.",
          options: {
            create: [
              { text: "Central Procurement (central requisitioning / purchasing)", isCorrect: true },
              { text: "Advanced Returns Management", isCorrect: false },
              { text: "Invoice parking", isCorrect: false },
              { text: "The Material Ledger", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the difference between invoice 'parking' and invoice 'blocking' in advanced MIRO scenarios?",
          explanation: "Parking saves an incomplete or uncertain invoice for later completion/review without posting it. Blocking applies to a posted invoice that fails the 3-way match beyond tolerance (or other rules), preventing payment until it is reviewed and released. Different mechanisms for different control needs.",
          options: {
            create: [
              { text: "Parking saves an unposted invoice for later; blocking stops payment on a match failure", isCorrect: true },
              { text: "They are the same action", isCorrect: false },
              { text: "Parking deletes the invoice; blocking pays it immediately", isCorrect: false },
              { text: "Both mean the invoice is paid without review", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.15: MRP Live & Production Planning in S/4HANA
const lesson13_15 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-mrp-live-production" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "MRP Live & Production Planning in S/4HANA",
    slug: "s4-mrp-live-production",
    order: 15,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A production planner at an auto-parts maker used to kick off the nightly MRP run (MD01) and wait until morning to see what to make and buy — by which point demand had already shifted. After the S/4HANA upgrade, her architect says MRP now runs in-memory in minutes, classic MD01 is gone, and she works from a new Fiori-based MRP cockpit that highlights only the materials with problems. The planner's daily rhythm changes completely: from batch-and-wait to near-real-time, exception-driven planning.

S/4HANA didn't just speed up MRP — it changed how planners work.`,
    content: `## MRP Live: In-Memory Planning

In ECC, **MRP** (Material Requirements Planning) ran as a heavy batch (transaction MD01), often overnight, because it crunched demand, stock, and BOMs across the database. In S/4HANA, **MRP Live (MD01N)** pushes the calculation down into the HANA database and runs in-memory, so it completes in a fraction of the time and can be run far more frequently — closer to real time. Classic MD01 is effectively replaced; planners run MRP Live and react quickly.

| | ECC MRP (MD01) | S/4HANA MRP Live (MD01N) |
|--|----------------|--------------------------|
| Execution | Batch, often overnight | In-memory, minutes |
| Frequency | Periodic | Frequent / near real-time |
| Calculation | Application-server heavy | Pushed down to HANA |
| Planner workflow | Review long lists next day | Exception-driven cockpit |

## Exception-Driven Planning with Fiori

Speed alone isn't the point — it's how planners work. S/4HANA provides MRP **Fiori apps** (the MRP cockpit: "Monitor Material Coverage", "Manage Material Coverage", etc.) that surface **only the materials with issues** (shortages, excess) and propose **solutions** the planner can accept. Instead of scanning thousands of line items in MD04, the planner focuses on the exceptions that actually need a decision.

## Predictive MRP (pMRP)

**Predictive MRP** is a newer, simulation-oriented capability for medium/long-term planning. It lets planners model demand scenarios (e.g. a forecast surge) and see the impact on capacity and material flow **before** committing, so they can pre-empt bottlenecks. It's about sensing and simulating future demand, complementing the operational MRP Live run.

## Manufacturing Types in S/4HANA

The core manufacturing execution types carry over but are sharpened:

| Type | Use |
|------|-----|
| **Discrete (Production Orders)** | Distinct, variable production runs with full order tracking |
| **Process Orders** | Process industries (chemicals, pharma, food) — recipes, batches |
| **Repetitive Manufacturing** | High-volume, stable line production by rate/backflush |

For complex, constraint-based scheduling, **PP-DS (Production Planning & Detailed Scheduling)** — once a separate APO component — is now **embedded** in S/4HANA. PP-DS does finite, detailed scheduling on critical resources (sequencing, setup optimization) beyond what standard MRP provides, integrated in the same system rather than a bolt-on.

## What Changed for the Planner (ECC → S/4HANA)

1. **No more overnight wait:** run MRP Live in minutes, multiple times a day.
2. **Exception focus:** Fiori MRP cockpit shows only problem materials with proposed fixes.
3. **Simulation upfront:** pMRP to test demand scenarios before they hit.
4. **Embedded detailed scheduling:** PP-DS available in-system for constrained resources.
5. **Same execution types** (discrete/process/repetitive) but faster, in-memory data.

The net effect: planning shifts from reactive batch processing to proactive, near-real-time, exception-based work — exactly the change the planner in the story experiences.`,
    keyConceptTitle: "MRP Live runs in-memory; planners work exception-driven via Fiori, with pMRP and embedded PP-DS",
    keyConceptBody: `- **MRP Live (MD01N)** pushes MRP into HANA to run in minutes (not an overnight batch), replacing classic MD01 and enabling near-real-time planning.
- Planners work **exception-driven** through the Fiori MRP cockpit, which surfaces only problem materials with proposed solutions — not endless MD04 lists.
- **Predictive MRP (pMRP)** simulates demand scenarios for medium/long-term planning before committing.
- Execution types (discrete/process/repetitive) remain; **PP-DS** for finite detailed scheduling is now **embedded** in S/4HANA.`,
  },
});
const flowchart13_15 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_15.id },
  update: {},
  create: {
    lessonId: lesson13_15.id,
    title: "S/4HANA Planning Workflow",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📈 Demand & Stock (Live in HANA)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 310, y: 120 }, data: { label: "⚡ MRP Live (MD01N, in-memory)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 560, y: 60 }, data: { label: "🚨 Fiori MRP Cockpit (Exceptions)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 560, y: 180 }, data: { label: "🔮 pMRP Simulation (What-if)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 810, y: 120 }, data: { label: "🏭 Orders + PP-DS Scheduling" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart13_15.id, nodeId: "node1", title: "Demand & Stock", description: "Demand (orders, forecast) and current stock live in the in-memory HANA database, so planning data is always current.", tCode: "MD04 / Fiori", tips: "Because data is in-memory, MRP can run far more often without an overnight window." },
    { flowchartId: flowchart13_15.id, nodeId: "node2", title: "MRP Live (MD01N)", description: "MRP Live pushes the requirements calculation into HANA, completing in minutes and replacing the classic batch MD01.", tCode: "MD01N", tips: "Run MRP Live multiple times a day; it's fast enough to react to shifting demand." },
    { flowchartId: flowchart13_15.id, nodeId: "node3", title: "Fiori MRP Cockpit", description: "Exception-based apps surface only materials with shortages/excess and propose solutions, so planners focus on real problems.", tCode: "Manage Material Coverage (Fiori)", tips: "Exception-driven planning beats scanning thousands of line items manually." },
    { flowchartId: flowchart13_15.id, nodeId: "node4", title: "Predictive MRP", description: "pMRP simulates demand scenarios for medium/long-term planning, revealing capacity bottlenecks before committing.", tCode: "pMRP (Fiori)", tips: "Use pMRP to pressure-test a forecast surge before it disrupts the line." },
    { flowchartId: flowchart13_15.id, nodeId: "node5", title: "Orders + PP-DS", description: "Planned orders become production/process orders or repetitive runs; embedded PP-DS does finite detailed scheduling on critical resources.", tCode: "CO01 / PP-DS", tips: "PP-DS (once separate APO) is now in-system for constraint-based sequencing." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson13_15.id },
  update: {},
  create: {
    lessonId: lesson13_15.id,
    title: "MRP Live & PP — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What fundamentally changed about how MRP executes in S/4HANA (MRP Live) versus ECC (MD01)?",
          explanation: "MRP Live pushes the calculation down into the HANA in-memory database, so it runs in minutes rather than as a heavy overnight batch. This lets planners run it frequently and plan close to real time, replacing classic MD01.",
          options: {
            create: [
              { text: "It runs in-memory in HANA in minutes, instead of a heavy overnight batch", isCorrect: true },
              { text: "It no longer considers stock or demand", isCorrect: false },
              { text: "It can only run once per year", isCorrect: false },
              { text: "It moved the calculation to the user's PC", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How does the Fiori MRP cockpit change the planner's daily workflow?",
          explanation: "Instead of scanning long lists of all materials, the planner works exception-driven: the cockpit surfaces only materials with issues (shortages/excess) and proposes solutions, so attention goes to the items that actually need a decision.",
          options: {
            create: [
              { text: "It surfaces only problem materials with proposed solutions (exception-driven)", isCorrect: true },
              { text: "It hides all materials from the planner", isCorrect: false },
              { text: "It forces a full review of every material every day", isCorrect: false },
              { text: "It replaces the planner with a robot", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is PP-DS in S/4HANA, and what's notable about it compared to ECC?",
          explanation: "PP-DS (Production Planning & Detailed Scheduling) provides finite, constraint-based detailed scheduling on critical resources. In ECC it was part of the separate APO/SCM system; in S/4HANA it is embedded in the core, available in the same system.",
          options: {
            create: [
              { text: "Finite detailed scheduling, now embedded in S/4HANA (was separate APO in ECC)", isCorrect: true },
              { text: "A payroll calculation engine", isCorrect: false },
              { text: "A replacement for the general ledger", isCorrect: false },
              { text: "A tool that only existed in ECC and was removed", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.16: Intercompany Processes in S/4HANA
const lesson13_16 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-intercompany-processes" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "Intercompany Processes in S/4HANA",
    slug: "s4-intercompany-processes",
    order: 16,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A group has a manufacturing company (Company A) in one country and a sales company (Company B) in another, both in the same S/4HANA client. A customer orders from Company B, but the goods are made and shipped by Company A. Company A must bill Company B (intercompany billing), Company B bills the customer, and at month-end the intercompany payables and receivables between A and B must reconcile and ultimately be eliminated in group reporting. Deepa, the consultant, configures the intercompany sales flow so this all happens cleanly with the right documents and profit attribution.

Intercompany processes are where SD, MM, and FI meet across legal entities — and they're a common source of go-live pain if misconfigured.`,
    content: `## What "Intercompany" Means

In a corporate group, legal entities trade with each other. **Intercompany processes** handle transactions between two company codes in SAP — one sells, the other buys — with the correct documents, pricing, and accounting on both sides. Done right, each entity's books are correct individually, and the internal effects can be eliminated at group level (see Group Reporting).

## Intercompany Sales (SD-MM)

The classic scenario: the customer-facing entity takes the order, but another entity delivers. Using the story:

1. **Company B** (sales org) receives the **customer sales order**; the delivering plant belongs to **Company A**.
2. **Company A** ships the goods (delivery + goods issue from its plant).
3. **Company B** invoices the **external customer** (normal customer billing).
4. **Company A** raises an **intercompany billing** document to Company B for the internal transfer.

So one physical shipment generates two billing relationships: customer-facing (B → customer) and internal (A → B).

## Intercompany Billing — the IV Document

The internal invoice from the delivering company to the selling company uses the **intercompany billing** document type (commonly **IV**). It's priced using **intercompany (transfer) pricing** — often a transfer price or cost-plus condition distinct from the customer price. This is how profit is split between the manufacturing and selling entities, and it's a frequent configuration and tax/transfer-pricing discussion point.

## Intercompany AP/AR Reconciliation

The IV invoice creates a **receivable** in Company A and a corresponding **payable** in Company B (often posted automatically via internal invoice processing / EDI-like mechanisms). At period-end these intercompany **AR and AP balances must reconcile** — A's receivable from B should match B's payable to A. Mismatches (timing, pricing, missing postings) are a classic close headache, and they must be resolved before group elimination can be clean.

## Single-Client vs Cross-System Intercompany

| Scenario | Mechanism |
|----------|-----------|
| Both entities in the **same** SAP client | Direct intercompany config — documents post within one system |
| Entities in **different** SAP systems | **ALE / IDoc** distributes documents between systems (e.g. the IV invoice becomes an inbound invoice in the other system) |

In the story both companies share one client, so it's direct. When entities live in separate systems, **ALE/IDoc** messaging bridges them — more moving parts, more reconciliation discipline.

## Profit Center & Segment Reporting

Intercompany flows must carry the right **profit center** and **segment** so internal margins and segment results are reported correctly. The transfer price affects how much profit each entity (and profit center/segment) shows. At group level, intercompany profit in inventory must ultimately be eliminated so the consolidated result isn't overstated. Getting profit center/segment derivation right in intercompany documents is essential for accurate internal reporting and a clean consolidation.

## Why It Matters

Intercompany is where multi-entity groups actually operate day to day. Correct intercompany sales/billing, reconciling AP/AR, choosing single-client vs ALE, and proper profit center/segment handling determine whether each entity's books and the group consolidation are right. It's intricate, cross-module configuration — and a high-value consultant skill.`,
    keyConceptTitle: "Intercompany: one shipment, two billings (customer + IV), reconciled AP/AR, eliminated at group",
    keyConceptBody: `- **Intercompany sales (SD-MM)**: the selling entity takes the customer order, a sister entity delivers; one shipment yields customer billing **and** internal **intercompany billing (IV)**.
- The **IV** invoice uses transfer/intercompany pricing (splitting profit) and creates a receivable in the seller and a payable in the buyer that must **reconcile** at close.
- **Same client** = direct intercompany config; **different systems** = **ALE/IDoc** distributes the documents.
- Correct **profit center/segment** derivation is essential; intercompany profit is ultimately **eliminated** in group consolidation.`,
  },
});
const flowchart13_16 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_16.id },
  update: {},
  create: {
    lessonId: lesson13_16.id,
    title: "Intercompany Sales Flow (A delivers, B sells)",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🛒 Customer Order to Company B" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "🚚 Company A Plant Ships Goods" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 540, y: 60 }, data: { label: "🧾 B Bills External Customer" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 540, y: 180 }, data: { label: "🔁 A Bills B (IV, Transfer Price)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 800, y: 180 }, data: { label: "📒 IC AP/AR Reconcile → Group Elim" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart13_16.id, nodeId: "node1", title: "Customer Order to B", description: "The customer-facing entity (Company B) receives the sales order, but the delivering plant belongs to a sister entity (Company A).", tCode: "VA01", tips: "The delivering plant's company code is what makes the flow intercompany." },
    { flowchartId: flowchart13_16.id, nodeId: "node2", title: "Company A Ships", description: "Company A's plant executes the delivery and goods issue, physically fulfilling the customer order on B's behalf.", tCode: "VL01N", tips: "One physical shipment will trigger two billing relationships." },
    { flowchartId: flowchart13_16.id, nodeId: "node3", title: "B Bills Customer", description: "Company B issues the normal customer invoice at the customer price, recording external revenue and receivable.", tCode: "VF01", tips: "This is the customer-facing side — standard SD billing." },
    { flowchartId: flowchart13_16.id, nodeId: "node4", title: "A Bills B (IV)", description: "Company A raises an intercompany billing document (type IV) to Company B using transfer/intercompany pricing, splitting profit between entities.", tCode: "VF01 (IV)", tips: "Transfer pricing here is also a tax/transfer-pricing topic, not just config." },
    { flowchartId: flowchart13_16.id, nodeId: "node5", title: "Reconcile & Eliminate", description: "A's intercompany receivable and B's payable must reconcile at close; the internal profit is later eliminated in group consolidation.", tCode: "Group Reporting", tips: "Unreconciled intercompany balances block a clean consolidation — fix them at close." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson13_16.id },
  update: {},
  create: {
    lessonId: lesson13_16.id,
    title: "Intercompany Processes — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In an intercompany sales flow where Company B sells to the customer but Company A delivers, how many billing documents result from the single shipment, and to whom?",
          explanation: "Two: Company B bills the external customer (customer invoice at customer price), and Company A bills Company B with an intercompany billing document (IV) at transfer price. One physical shipment, two distinct billing relationships.",
          options: {
            create: [
              { text: "Two — B bills the customer, and A bills B with an intercompany (IV) invoice", isCorrect: true },
              { text: "One — only the customer invoice", isCorrect: false },
              { text: "None — intercompany flows aren't billed", isCorrect: false },
              { text: "Three — every entity bills every other", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Two group entities are in different SAP systems. How are intercompany documents typically exchanged between them?",
          explanation: "When entities live in separate systems, ALE/IDoc messaging distributes the documents between systems (e.g. the intercompany invoice becomes an inbound document in the other system). Within a single client, direct intercompany configuration posts within one system.",
          options: {
            create: [
              { text: "Via ALE/IDoc distribution between the systems", isCorrect: true },
              { text: "By emailing PDFs only", isCorrect: false },
              { text: "It's impossible across systems", isCorrect: false },
              { text: "They must merge into one company code", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why must intercompany AP/AR be reconciled before group consolidation?",
          explanation: "Company A's intercompany receivable should equal Company B's intercompany payable. If they don't reconcile (due to timing, pricing, or missing postings), the elimination at group level won't net cleanly, distorting the consolidated result. Reconciliation is a prerequisite for clean elimination.",
          options: {
            create: [
              { text: "The matched receivable/payable must agree so group elimination nets cleanly", isCorrect: true },
              { text: "To increase the group's tax bill", isCorrect: false },
              { text: "Because reconciliation creates new revenue", isCorrect: false },
              { text: "It isn't necessary — consolidation ignores intercompany", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.17: S/4HANA Data Migration — Migration Cockpit (LTMC)
const lesson13_17 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-migration-cockpit-ltmc" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "S/4HANA Data Migration — Migration Cockpit (LTMC)",
    slug: "s4-migration-cockpit-ltmc",
    order: 17,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A greenfield S/4HANA project is weeks from go-live, and the legacy data — customers, vendors, materials, open invoices, GL balances — must land in the new system correctly. The old LSMW-heavy approach was slow and error-prone. Suresh, the migration lead, uses the SAP S/4HANA Migration Cockpit with predefined migration objects, loads data via spreadsheet templates, validates it in staging, and simulates before posting. Get the sequence or a number range wrong and thousands of records fail — so discipline matters.

Data migration is the unglamorous task that can sink an otherwise perfect implementation.`,
    content: `## Why a Dedicated Migration Tool

Moving data into S/4HANA is high-stakes: it must be complete, correct, and in the right order, using the system's real APIs so business rules are respected. The **SAP S/4HANA Migration Cockpit (LTMC**, and the newer Fiori-based **Migrate Your Data** app**)** is the standard tool, replacing the older **LSMW** for S/4HANA. Its big advantage: **predefined migration objects** for common data, so you're not building everything from scratch.

## Migration Objects

A **migration object** is a ready-made template for a type of data, mapped to the correct S/4HANA load API. SAP ships many out of the box:

| Category | Example objects |
|----------|-----------------|
| Master data | Customer, Supplier (Business Partner), Material, G/L account, Cost center |
| Balances | G/L account balances |
| Open items | Open AR items, Open AP items, Open POs, Open sales orders |
| Inventory | Material stock (initial) |

You can also create custom migration objects for non-standard data. Each object knows the fields, the validations, and the target API.

## Two Approaches: File-Based vs Direct Transfer

| Approach | How it works | When |
|----------|--------------|------|
| **File-based (staging via spreadsheets/XML)** | Fill SAP-provided spreadsheet templates, upload to staging tables | Source isn't SAP, or you want manual control/cleansing |
| **Direct Transfer** | Read directly from a connected source SAP system's tables | Migrating from an SAP ECC source |
| **Staging tables (DB)** | Load data into staging DB tables (e.g. via ETL), then process | High volume, programmatic loads |

In all cases data lands in **staging**, is **mapped and validated**, then **simulated** and finally **posted** to live tables. Staging + validation + simulation is what catches errors before they corrupt the production system.

## The Validation & Simulation Steps

The cockpit walks each object through stages: **upload → map values (e.g. legacy codes to S/4 codes) → validate → simulate → migrate (post)**. Validation checks mandatory fields, value ranges, and consistency; simulation posts in test mode to surface errors without committing. Only after a clean simulation do you execute the real migration.

## Practical Migration Sequence

Order matters because data has dependencies:

1. **Configuration/customizing** must already exist (org structure, account ranges).
2. **Master data first** — Business Partners (customers/vendors), materials, G/L accounts, cost centers. Transactions reference these, so they must exist first.
3. **Balances** — G/L opening balances.
4. **Open items / transactional data** — open AR/AP, open POs, open sales orders, initial stock.

Loading an open AR item before its customer exists will simply fail — hence master-data-first.

## Common Pitfalls

- **Number ranges:** if you migrate with external (legacy) numbers, the number range must allow external assignment, or loads fail/renumber unexpectedly.
- **Posting periods:** balances and open items need the relevant posting periods **open**, or postings are rejected.
- **Mandatory fields & value mapping:** missing required fields or unmapped legacy codes are the top causes of validation failures.
- **Sequence violations:** transactional data before master data, or master data before required config.
- **Currency/date formats** in templates not matching expected formats.

Suresh's discipline — correct sequence, open periods, validated number ranges, clean simulation — is exactly what separates a smooth go-live from a data disaster.`,
    keyConceptTitle: "Migration Cockpit (LTMC): predefined objects, staging → validate → simulate → post, master data first",
    keyConceptBody: `- The **S/4HANA Migration Cockpit (LTMC / Migrate Your Data)** replaces LSMW, providing **predefined migration objects** mapped to real load APIs.
- Approaches: **file-based** (spreadsheet templates → staging), **Direct Transfer** (from an SAP source), or staging tables; all go **upload → map → validate → simulate → post**.
- Load in the right **sequence**: config exists → **master data first** (BP, material, G/L) → balances → open items/transactions, because of dependencies.
- Watch the classic pitfalls: **number ranges** (external assignment), **open posting periods**, mandatory fields/value mapping, and format mismatches.`,
  },
});
const flowchart13_17 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_17.id },
  update: {},
  create: {
    lessonId: lesson13_17.id,
    title: "Migration Cockpit Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "📋 Select Migration Object (predefined)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 320, y: 120 }, data: { label: "📥 Load to Staging (file / direct)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 550, y: 120 }, data: { label: "🔗 Map Values & Validate" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 550, y: 260 }, data: { label: "🧪 Simulate (test post)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 790, y: 120 }, data: { label: "✅ Migrate (Post to S/4HANA)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart13_17.id, nodeId: "node1", title: "Select Migration Object", description: "Choose a predefined migration object (Customer, Supplier, Material, G/L balance, open items) that maps to the correct S/4HANA load API.", tCode: "LTMC / Migrate Your Data", tips: "Prefer standard objects; build custom ones only for genuinely non-standard data." },
    { flowchartId: flowchart13_17.id, nodeId: "node2", title: "Load to Staging", description: "Fill the SAP spreadsheet/XML template (file-based) or read from a connected SAP source (Direct Transfer); data lands in staging, not live tables.", tCode: "LTMC", tips: "Staging means you can cleanse and re-load without touching production." },
    { flowchartId: flowchart13_17.id, nodeId: "node3", title: "Map & Validate", description: "Map legacy values to S/4 codes and run validation for mandatory fields, ranges, and consistency. Most failures surface here.", tCode: "LTMC (Mapping)", tips: "Unmapped legacy codes and missing mandatory fields are the top validation errors." },
    { flowchartId: flowchart13_17.id, nodeId: "node4", title: "Simulate", description: "A test-mode post surfaces posting errors (e.g. closed periods, number-range issues) without committing data.", tCode: "LTMC (Simulate)", tips: "Never skip simulation — it's your last safe check before live posting." },
    { flowchartId: flowchart13_17.id, nodeId: "node5", title: "Migrate (Post)", description: "After a clean simulation, the object is migrated for real, posting through the proper API so business rules are respected.", tCode: "LTMC (Migrate)", tips: "Follow the sequence: master data before balances before open items." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson13_17.id },
  update: {},
  create: {
    lessonId: lesson13_17.id,
    title: "Migration Cockpit (LTMC) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why must master data (customers, vendors, materials) be migrated before open items like open AR invoices?",
          explanation: "Transactional data references master data. An open AR invoice points to a customer; if that customer (Business Partner) doesn't exist yet, the load fails. Dependencies dictate master-data-first sequencing.",
          options: {
            create: [
              { text: "Open items reference master data, so the master records must exist first", isCorrect: true },
              { text: "Open items are larger files", isCorrect: false },
              { text: "Master data can only load on weekends", isCorrect: false },
              { text: "There is no required order", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the purpose of the 'simulate' step in the Migration Cockpit before the actual migration?",
          explanation: "Simulation posts in test mode to surface errors (closed posting periods, number-range problems, validation failures) without committing data to live tables. Only after a clean simulation do you execute the real migration.",
          options: {
            create: [
              { text: "It test-posts to surface errors without committing data to live tables", isCorrect: true },
              { text: "It permanently deletes the source system", isCorrect: false },
              { text: "It emails the data to the auditors", isCorrect: false },
              { text: "It is an optional cosmetic step", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A migration of G/L balances fails at posting even though the data validated. Which classic pitfall should you check first?",
          explanation: "Balance and open-item postings require the relevant posting periods to be open; if they're closed, the posting is rejected even when the data itself is valid. (Number-range external-assignment settings are the other classic culprit.)",
          options: {
            create: [
              { text: "Whether the relevant posting periods are open", isCorrect: true },
              { text: "Whether the internet connection is fast", isCorrect: false },
              { text: "Whether the user has a long enough password", isCorrect: false },
              { text: "Whether the company has a logo configured", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 13.18: Intelligent Enterprise — AI & Automation in S/4HANA
const lesson13_18 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-intelligent-enterprise-ai" } },
  update: {},
  create: {
    moduleId: s4Module.id,
    title: "Intelligent Enterprise — AI & Automation in S/4HANA",
    slug: "s4-intelligent-enterprise-ai",
    order: 18,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `An AR team spends hours each day matching incoming bank payments to open invoices — payments arrive with garbled references, partial amounts, and lump sums covering many invoices. A consultant, Anjali, turns on Cash Application, which learns from historical matching and auto-clears the majority of payments. Elsewhere, a sales manager gets a proactive alert that a high-value delivery is at risk, and a CFO asks SAP a question in plain language and gets an answer. The client is excited but also skeptical: which of this is real value, and which is marketing?

The "Intelligent Enterprise" is SAP's vision of AI woven into everyday processes — and a clear-eyed view of where it genuinely helps is itself a valuable skill.`,
    content: `## What "Intelligent Enterprise" Means

SAP's **Intelligent Enterprise** vision is AI and automation **embedded into business processes**, not bolted on as a separate analytics tool. The idea: routine decisions get automated, problems surface proactively, and users interact more naturally — all inside S/4HANA and the surrounding suite. The honest framing is that some of this delivers strong, measurable value today, while some is still maturing — so knowing the difference matters.

## Cash Application — Real, Proven Value

**Cash Application** automates matching incoming customer payments to open AR invoices. It learns from historical clearing behavior to handle the messy reality — wrong references, partial payments, lump sums — and auto-clears a large share, routing only the hard cases to humans. This is a flagship example of AI that **genuinely saves time** in a high-volume, rules-plus-pattern task. Similar embedded intelligence appears in areas like predictive analytics for receivables and inventory.

## Joule — SAP's AI Copilot

**Joule** is SAP's generative-AI copilot embedded across SAP applications including S/4HANA. Users ask questions or request actions in **natural language** and Joule responds using SAP data and context — navigating, retrieving information, and helping complete tasks. It lowers the barrier to using SAP (no hunting through transactions) and is a strategic direction, though its value depends on the specific scenarios enabled.

## Situation Handling — Proactive Alerts

**Situation Handling** proactively notifies the right user when a defined condition occurs — e.g. an overdue delivery, a contract about to expire, a blocked order. Instead of a problem being discovered late by chance, the system **pushes a contextual alert** with the information and actions to resolve it. It turns reactive firefighting into proactive management for well-defined situations.

## SAP Signavio — Process Intelligence

**SAP Signavio** is process intelligence: it **mines actual process execution** from system data to show how processes really run (not how you think they run), revealing bottlenecks, rework loops, and deviations. This is the analytical backbone of improvement — you find where automation or redesign will actually pay off, rather than guessing. It's especially used to prepare and optimize S/4HANA transformations.

## Where AI Helps vs Where It's Marketing

| Genuinely valuable today | More hype / situational |
|--------------------------|-------------------------|
| Cash Application (high-volume matching) | "AI" labels on simple rule-based features |
| Situation Handling for defined conditions | Vague "the system thinks for you" claims |
| Signavio process mining (find real bottlenecks) | One-off demos that don't scale to messy data |
| Joule for navigation/retrieval in supported scenarios | Expecting a copilot to replace functional expertise |

The practical lesson: embedded AI shines on **high-volume, pattern-rich, well-bounded** tasks (matching, alerting, mining). It underwhelms when applied to vague problems, poor-quality data, or scenarios sold as magic. A good consultant targets AI where the data and the task fit — and sets honest expectations everywhere else.

## Why It Matters

The Intelligent Enterprise is increasingly how S/4HANA differentiates itself. Understanding the genuinely valuable capabilities (Cash Application, Situation Handling, Signavio, Joule) — and being able to separate real ROI from marketing — lets you advise clients credibly and deploy AI where it actually moves the needle.`,
    keyConceptTitle: "Intelligent Enterprise = embedded AI (Cash App, Joule, Situation Handling, Signavio) — applied where it truly fits",
    keyConceptBody: `- **Intelligent Enterprise** means AI/automation embedded in S/4HANA processes, not a separate tool.
- **Cash Application** (auto-matching payments to invoices) is proven, high-value AI; **Situation Handling** pushes proactive alerts; **Joule** is the natural-language copilot; **SAP Signavio** mines real process execution to find bottlenecks.
- AI delivers most on **high-volume, pattern-rich, well-bounded** tasks; it underwhelms on vague problems or poor data.
- A key skill is separating genuine ROI from marketing and targeting AI where the data and task actually fit.`,
  },
});
const flowchart13_18 = await prisma.flowchart.upsert({
  where: { lessonId: lesson13_18.id },
  update: {},
  create: {
    lessonId: lesson13_18.id,
    title: "Embedded AI Across S/4HANA Processes",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "🏦 Cash Application (Auto-Match Payments)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 320, y: 60 }, data: { label: "🔔 Situation Handling (Proactive Alerts)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 320, y: 180 }, data: { label: "💬 Joule (NL Copilot)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 570, y: 120 }, data: { label: "🔎 Signavio (Process Mining)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 810, y: 120 }, data: { label: "🎯 Apply Where Data + Task Fit (Real ROI)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node5", type: "default" },
      { id: "e2", source: "node2", target: "node5", type: "default" },
      { id: "e3", source: "node3", target: "node5", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart13_18.id, nodeId: "node1", title: "Cash Application", description: "Learns from historical clearing to auto-match incoming payments (even with bad references, partials, lump sums) to open invoices, routing only hard cases to people.", tCode: "Cash Application (Fiori)", tips: "A flagship of proven embedded AI — high-volume, pattern-rich matching is the sweet spot." },
    { flowchartId: flowchart13_18.id, nodeId: "node2", title: "Situation Handling", description: "Proactively pushes a contextual alert when a defined condition occurs (overdue delivery, expiring contract), with the info and actions to resolve it.", tCode: "Situation Handling config", tips: "Best for well-defined, business-critical conditions you want caught early." },
    { flowchartId: flowchart13_18.id, nodeId: "node3", title: "Joule Copilot", description: "A generative-AI copilot you query in natural language; it retrieves information and helps complete tasks across SAP using context.", tCode: "Joule", tips: "Great for navigation/retrieval; it complements, not replaces, functional expertise." },
    { flowchartId: flowchart13_18.id, nodeId: "node4", title: "SAP Signavio", description: "Mines actual process execution from system data to reveal how processes truly run — bottlenecks, rework, deviations — guiding where to improve or automate.", tCode: "SAP Signavio", tips: "Use process mining to target automation where it actually pays off, not by guesswork." },
    { flowchartId: flowchart13_18.id, nodeId: "node5", title: "Apply Where It Fits", description: "The judgment skill: deploy AI on high-volume, pattern-rich, well-bounded tasks with good data — and set honest expectations elsewhere.", tCode: "N/A", tips: "Separating real ROI from marketing is what makes AI advice credible." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson13_18.id },
  update: {},
  create: {
    lessonId: lesson13_18.id,
    title: "Intelligent Enterprise — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why is Cash Application considered a strong, real-world example of embedded AI in S/4HANA?",
          explanation: "Cash Application tackles a high-volume, pattern-rich task — matching messy incoming payments (bad references, partials, lump sums) to open invoices — by learning from historical clearing. It auto-clears the bulk and routes only hard cases to humans, delivering measurable time savings. This is exactly the kind of bounded, data-rich task where AI excels.",
          options: {
            create: [
              { text: "It automates high-volume, pattern-rich payment matching, saving real time", isCorrect: true },
              { text: "It replaces the entire finance department", isCorrect: false },
              { text: "It is purely a marketing label on a manual process", isCorrect: false },
              { text: "It only works if there are no payments to match", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does SAP Signavio (process intelligence) actually do?",
          explanation: "Signavio mines real process-execution data to show how processes actually run — exposing bottlenecks, rework loops, and deviations from the intended flow. This evidence guides where automation or redesign will genuinely pay off, rather than relying on assumptions.",
          options: {
            create: [
              { text: "Mines real execution data to reveal how processes truly run and where they bottleneck", isCorrect: true },
              { text: "Pays vendor invoices automatically", isCorrect: false },
              { text: "Designs Fiori themes", isCorrect: false },
              { text: "Translates ABAP into Java", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Based on the lesson, where does embedded AI tend to deliver the most genuine value?",
          explanation: "AI shines on high-volume, pattern-rich, well-bounded tasks with good-quality data (like payment matching, defined-condition alerting, and process mining). It underwhelms on vague problems, poor data, or scenarios sold as magic — so consultants should target AI where the data and task fit.",
          options: {
            create: [
              { text: "On high-volume, pattern-rich, well-bounded tasks with good data", isCorrect: true },
              { text: "On vague, ill-defined problems with poor-quality data", isCorrect: false },
              { text: "Anywhere a vendor applies the word 'AI'", isCorrect: false },
              { text: "Only in one-off demos, never in production", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 6 COMPLETE: Advanced ABAP + Advanced S/4HANA — 127 total lessons ─



