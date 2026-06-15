// ─── BASIS: DEEP DIVE LESSONS (Session 9A) ────────────────────────────────────
// LESSON 10.11: SAP System Architecture Deep Dive
const lesson10_11 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "sap-system-architecture" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "SAP System Architecture Deep Dive",
    slug: "sap-system-architecture",
    order: 11,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `It's 2 a.m. in the go-live war room. Production has been live for six hours and suddenly users in the warehouse report that the SAP GUI "just hangs" when they post a goods receipt. The project manager turns to Ramesh, the lead BASIS consultant, and asks the only question that matters: "Where is it stuck — the network, the application server, or the database?"

Ramesh doesn't panic, because he carries a mental map of exactly how a request travels through an SAP system. He knows a user click leaves the SAP GUI, hits a dispatcher, waits for a free work process, runs ABAP that talks to the database, and returns. Knowing that path lets him jump straight to the right monitor instead of guessing. Architecture isn't theory — it's the map you follow under pressure.`,
    content: `## Why Architecture Is the First Thing a BASIS Person Learns

Every performance problem, every crash, every "the system is slow" ticket is really a question of *where* in the architecture something broke. If you can't picture the layers, you can't troubleshoot. So let's build that picture properly.

## The Three Tiers, Revisited

SAP is a classic **three-tier architecture**:

| Tier | What lives here | Examples |
|------|-----------------|----------|
| **Presentation** | What the user sees | SAP GUI, Fiori (browser) |
| **Application** | Where ABAP programs actually run | AS ABAP instance(s) |
| **Database** | Where all data is stored | HANA, Oracle, etc. |

The key idea: the application layer does the *thinking*, the database only *stores and retrieves*. Most beginners blame the database for slowness when the real bottleneck is a busy application layer.

## Inside AS ABAP — The Engine Room

The Application Server ABAP is made of several cooperating processes:

- **Dispatcher** — the traffic controller. It receives requests from the presentation layer and hands each one to a free work process.
- **Work Processes (WPs)** — the actual workers that execute ABAP. Each has a type: \`DIA\` (dialog/user requests), \`BGD\` (background jobs), \`UPD\` (asynchronous database updates), \`ENQ\` (lock management), \`SPO\` (printing).
- **Message Server** — coordinates communication *between* instances and handles logon load balancing.
- **Gateway** — manages RFC and external (CPIC) communication between systems.
- **ICM (Internet Communication Manager)** — handles all HTTP/HTTPS traffic, which is what makes Fiori, web services, and REST calls possible.

## How a Single Request Flows

\`\`\`
SAP GUI → Dispatcher → free Work Process (DIA) → Database → result → back to GUI
\`\`\`

When Ramesh debugged the warehouse hang, this chain told him where to look: if all \`DIA\` work processes were busy, users wait at the dispatcher (a "system busy" symptom). If a WP was stuck "on hold", the bottleneck was the database.

## Instance vs System — A Common Confusion

A **system** is identified by its three-character SID (e.g. \`PRD\`). A system can run **multiple instances**, and each instance has its *own* dispatcher and *own* set of work processes. Adding instances is how you scale SAP horizontally to serve more users.

## Where ABAP Actually Runs — Shared Memory

Programs execute inside memory areas managed by SAP, not just the OS:

- **Roll area** — small, per-user context (current screen, variables).
- **Extended Memory (EM)** — the main shared working memory for ABAP sessions.
- **Paging area** — temporary internal-table and data overflow.

## The Profiles That Start It All

Three profile files control an instance at startup:

- **START profile** — instructs which processes to launch to start the instance.
- **DEFAULT profile** — system-wide parameters shared by *every* instance.
- **INSTANCE profile** — parameters specific to *one* instance (e.g. its number of work processes).

## The Enqueue Server — SAP's Own Locking

SAP needs locks at the *business* level ("don't let two clerks edit the same material"), which database locks alone can't provide. The **Enqueue server** manages these SAP-level locks independently of the database, ensuring data consistency across the whole system.

## The Practical Payoff

Architecture is the prerequisite for every other BASIS skill. When something breaks, the question is always the same: *which layer?* Presentation, application, or database. Master the map, and troubleshooting becomes a guided search instead of a panic.`,
    keyConceptTitle: "A Request Flows GUI → Dispatcher → Work Process → DB; Know the Layer to Find the Fault",
    keyConceptBody: `- SAP is **three tiers**: Presentation (SAP GUI/Fiori) → Application (AS ABAP) → Database. The app layer thinks; the DB only stores.
- Inside AS ABAP: the **Dispatcher** routes requests to **Work Processes** (DIA, BGD, UPD, ENQ, SPO); the **Message Server** coordinates instances; the **Gateway** handles RFC; the **ICM** handles HTTP/HTTPS for Fiori.
- One **system** (SID) can have many **instances**, each with its own dispatcher and work processes — this is how SAP scales.
- Profiles: **START** launches the instance, **DEFAULT** holds system-wide params, **INSTANCE** holds instance-specific params; the **Enqueue server** manages SAP-level (business) locks separate from DB locks.`,
  },
});
const flowchart10_11 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_11.id },
  update: {},
  create: {
    lessonId: lesson10_11.id,
    title: "How a User Request Flows Through AS ABAP",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🖥️ Presentation (SAP GUI / Fiori)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "🚦 Dispatcher (routes requests)" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 100, y: 220 }, data: { label: "⚙️ DIA Work Process (runs ABAP)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 220 }, data: { label: "🌐 ICM (HTTP/HTTPS for Fiori)" }, style: { background: "#0E7490", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 100, y: 320 }, data: { label: "🔒 Enqueue Server (business locks)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 305, y: 420 }, data: { label: "🗄️ Database (HANA / Oracle)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 305, y: 520 }, data: { label: "↩️ Result returns to user" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default", label: "click / request" },
      { id: "e2", source: "node2", target: "node3", type: "default", label: "assigns to free WP" },
      { id: "e3", source: "node1", target: "node4", type: "default", label: "HTTP (Fiori)" },
      { id: "e4", source: "node3", target: "node5", type: "default", label: "requests lock" },
      { id: "e5", source: "node3", target: "node6", type: "default", label: "read / write" },
      { id: "e6", source: "node4", target: "node6", type: "default" },
      { id: "e7", source: "node6", target: "node7", type: "default", label: "data" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart10_11.id, nodeId: "node1", title: "Presentation Layer", description: "The front-end the user interacts with — either the classic SAP GUI (desktop) or Fiori apps (browser). It sends user actions to the application layer and renders the response.", tCode: null, tips: "The presentation layer does no business processing — it only displays screens and captures input." },
    { flowchartId: flowchart10_11.id, nodeId: "node2", title: "Dispatcher", description: "The traffic controller of an AS ABAP instance. It receives every request and queues it until a work process of the right type is free.", tCode: "SM51", tips: "If requests pile up at the dispatcher, all work processes are busy — that's a 'system busy' symptom, not a database problem." },
    { flowchartId: flowchart10_11.id, nodeId: "node3", title: "DIA Work Process", description: "A dialog work process executes the ABAP for an interactive user request. It runs the program, fetches data, and returns the screen.", tCode: "SM50", tips: "Watch DIA work process states in SM50 — a process 'on hold' is usually waiting on the database." },
    { flowchartId: flowchart10_11.id, nodeId: "node4", title: "ICM", description: "The Internet Communication Manager handles all inbound and outbound HTTP/HTTPS traffic, enabling Fiori apps, web services, and REST calls.", tCode: "SMICM", tips: "If Fiori is down but SAP GUI works, suspect the ICM before the application server itself." },
    { flowchartId: flowchart10_11.id, nodeId: "node5", title: "Enqueue Server", description: "Manages SAP-level (business) locks so two users can't edit the same business object at once. This is separate from database locks.", tCode: "SM12", tips: "Stale entries in SM12 (lock table) can block users — clear them only after confirming the owning session is truly dead." },
    { flowchartId: flowchart10_11.id, nodeId: "node6", title: "Database Layer", description: "Where all data physically lives (HANA in S/4, or Oracle/DB2 in older systems). The application layer reads and writes here; the DB does no business logic.", tCode: "DB02", tips: "Blaming 'the database' for slowness is common but often wrong — confirm with ST05/ST03 before pointing at the DB." },
    { flowchartId: flowchart10_11.id, nodeId: "node7", title: "Result Returns", description: "The work process assembles the result and the dispatcher sends it back to the presentation layer, completing the round trip.", tCode: null, tips: "End-to-end response time = network + dispatcher wait + WP processing + DB time. Knowing the split tells you where to optimise." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson10_11.id },
  update: {},
  create: {
    lessonId: lesson10_11.id,
    title: "SAP System Architecture Deep Dive — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which component receives a user request and hands it to a free work process?",
          explanation: "The Dispatcher is the traffic controller of an AS ABAP instance. It receives requests from the presentation layer and assigns each one to a free work process of the correct type.",
          options: {
            create: [
              { text: "The Dispatcher", isCorrect: true },
              { text: "The Enqueue server", isCorrect: false },
              { text: "The Message server", isCorrect: false },
              { text: "The Database", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does SAP run its own Enqueue server instead of relying only on database locks?",
          explanation: "SAP needs business-level locks (e.g. 'don't let two clerks edit the same material master') that span a whole logical transaction across instances. Database locks alone can't guarantee this, so the Enqueue server manages SAP-level locks independently.",
          options: {
            create: [
              { text: "To provide business-level locking across the whole system that database locks alone cannot guarantee", isCorrect: true },
              { text: "Because databases do not support any locking at all", isCorrect: false },
              { text: "To replace the database entirely for write operations", isCorrect: false },
              { text: "Because the dispatcher cannot route lock requests", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Warehouse users say the SAP GUI hangs on goods receipt. In SM50 every DIA work process shows 'running' and the dispatcher queue is full. What is the most likely diagnosis?",
          explanation: "When all DIA work processes are occupied and the dispatcher queue is full, new user requests must wait — the classic 'system busy' bottleneck at the application layer. The next step is to find the long-running work (e.g. via SM66 then ST05) rather than blaming the database outright.",
          options: {
            create: [
              { text: "All dialog work processes are occupied, so requests queue at the dispatcher — an application-layer bottleneck", isCorrect: true },
              { text: "The presentation layer (SAP GUI) is performing the business logic and overloaded", isCorrect: false },
              { text: "The ICM has crashed, which always freezes the SAP GUI", isCorrect: false },
              { text: "The DEFAULT profile is missing, so no instance can start", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.12: Work Process Administration
const lesson10_12 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "work-process-administration" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "Work Process Administration",
    slug: "work-process-administration",
    order: 12,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Friday, 4 p.m. The finance team is closing the month and the help desk lights up: "SAP says 'system busy', we can't post anything!" Sneha, the on-call BASIS consultant, opens SM66 and instantly sees the story — every single dialog work process across all instances is green and "running", most of them stuck on the same long report a manager kicked off.

There are no free workers left to serve anyone else, so new clicks just queue. Sneha doesn't restart the server or call SAP support; she identifies the runaway sessions, traces them in ST05, and frees the system. Work processes are the engine of SAP — and knowing how to read and manage them is the difference between a five-minute fix and a four-hour outage.`,
    content: `## Work Processes — The Engine of SAP

Everything SAP does is executed by a **work process (WP)**. A work process is a dedicated worker in an application server instance, and each one is configured to handle a specific *type* of task. If you understand WPs, you understand why systems get "busy", why batch jobs wait, and why updates sometimes fail.

## The Five Work Process Types

| Type | Name | Handles |
|------|------|---------|
| \`DIA\` | Dialog | Interactive user requests (every screen click) |
| \`BGD\` | Background | Scheduled batch jobs (no user waiting) |
| \`UPD\` / \`UPD2\` | Update | Asynchronous database writes (V1/V2 updates) |
| \`ENQ\` | Enqueue | SAP-level lock management |
| \`SPO\` | Spool | Print and output requests |

Dialog work processes are the ones users feel directly. When all of them are occupied, users get the dreaded **"system busy"** message — there is literally no free worker to take the next request.

## Watching Work Processes Live

Two transactions are your eyes:

- \`SM50\` — work process overview for the **current instance**: how many of each type, what each is doing right now, which user, which program, which table.
- \`SM66\` — global work process overview across **all instances** in the system. This is where you start when "the whole system is slow", because the problem may be on another instance.

## Reading Work Process States

A work process is always in one of these states:

- **Running** — actively executing ABAP.
- **Waiting** — idle, ready for the next request (this is healthy — you *want* free WPs).
- **On Hold** — paused waiting for something external, usually the database or an RFC. Many WPs "on hold" points at a slow DB.
- **Stopped / Ended** — a dead or crashed work process that no longer serves requests.

A **dead work process** is one that has stopped responding. It must be restarted (cancel the session in \`SM50\`), or the instance effectively has fewer workers than configured.

## Configuring How Many Work Processes Exist

The number of each type is set in the **instance profile** via parameters:

| Parameter | Controls |
|-----------|----------|
| \`rdisp/wp_no_dia\` | Number of dialog work processes |
| \`rdisp/wp_no_btc\` | Number of background work processes |
| \`rdisp/wp_no_upd\` | Number of update work processes |
| \`rdisp/wp_no_enq\` | Number of enqueue work processes |
| \`rdisp/wp_no_spo\` | Number of spool work processes |

Sizing these correctly is a balancing act: too few DIA and users wait; too many and you consume memory the database needs. SAP recommends keeping enough DIA free so a few long reports can never starve interactive users.

## The Real-World Diagnosis Pattern

Sneha's playbook is the one every BASIS consultant memorises:

\`\`\`
"System is slow" → SM66 → all DIA WPs running → identify long-running sessions
→ ST05 (SQL trace) on the culprit → fix or cancel the runaway query
\`\`\`

The lesson: don't reach for a restart. Read the work processes first. They tell you exactly which user, which program, and which database call is eating the system — and usually the fix is to cancel one runaway session, not to reboot the server.`,
    keyConceptTitle: "Work Processes Are Typed Workers; When DIA Runs Out, Users See 'System Busy'",
    keyConceptBody: `- A **work process** is a worker in an instance, typed by task: \`DIA\` (dialog), \`BGD\` (background), \`UPD/UPD2\` (update), \`ENQ\` (enqueue), \`SPO\` (spool).
- When all **DIA** work processes are occupied, new user requests queue and users get the **"system busy"** message — an application-layer bottleneck.
- Monitor with **SM50** (current instance) and **SM66** (all instances); read states: Running, Waiting (healthy/idle), On Hold (waiting on DB), Stopped/Ended (dead WP needing restart).
- Counts are set in the **instance profile** (\`rdisp/wp_no_dia\`, \`rdisp/wp_no_btc\`, etc.). Diagnosis pattern: SM66 → find long-running session → ST05 → fix the query, not a blind restart.`,
  },
});
const flowchart10_12 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_12.id },
  update: {},
  create: {
    lessonId: lesson10_12.id,
    title: "Diagnosing a 'System Busy' with Work Process Monitors",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🚨 Users report 'system busy'" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "🌍 SM66 — all instances overview" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 305, y: 220 }, data: { label: "⚙️ All DIA WPs running?" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 80, y: 330 }, data: { label: "🔍 SM50 — find long-running session" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 540, y: 330 }, data: { label: "✅ WPs free — look elsewhere" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 80, y: 440 }, data: { label: "🐢 ST05 — SQL trace the culprit" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 305, y: 540 }, data: { label: "🛠️ Cancel runaway / fix query" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default", label: "yes" },
      { id: "e4", source: "node3", target: "node5", type: "default", label: "no" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart10_12.id, nodeId: "node1", title: "System Busy Reported", description: "Users cannot get a response — clicks hang and SAP may show 'system busy'. This means no dialog work process is free to serve their request.", tCode: null, tips: "'System busy' is almost always a work-process availability issue, not a network or login problem." },
    { flowchartId: flowchart10_12.id, nodeId: "node2", title: "Start with SM66", description: "The global work process overview shows every instance at once. Start here because the saturated instance may not be the one you're logged into.", tCode: "SM66", tips: "SM66 first, SM50 second — get the system-wide picture before drilling into one instance." },
    { flowchartId: flowchart10_12.id, nodeId: "node3", title: "Are All DIA WPs Running?", description: "If every dialog work process shows 'running', there are no free workers and new requests queue. If some are 'waiting', the bottleneck is elsewhere.", tCode: "SM66", tips: "'Waiting' work processes are healthy and idle — you want some of those available at all times." },
    { flowchartId: flowchart10_12.id, nodeId: "node4", title: "Drill in with SM50", description: "On the saturated instance, SM50 shows which user and which program each work process is running, plus how long it's been running.", tCode: "SM50", tips: "Sort by running time — the oldest still-running sessions are usually your culprits." },
    { flowchartId: flowchart10_12.id, nodeId: "node5", title: "WPs Free — Look Elsewhere", description: "If dialog work processes are available, the slowness is not WP saturation. Investigate the database, network, or update processing instead.", tCode: "ST03", tips: "Use ST03 workload analysis to confirm whether the time is spent in the DB, in WPs, or on the wire." },
    { flowchartId: flowchart10_12.id, nodeId: "node6", title: "SQL Trace with ST05", description: "Trace the runaway session to see the exact SQL it is running. A missing index or full table scan is the most common cause of a long-running dialog step.", tCode: "ST05", tips: "A single bad SELECT without an index can hold a work process for minutes — ST05 exposes it instantly." },
    { flowchartId: flowchart10_12.id, nodeId: "node7", title: "Cancel or Fix", description: "Cancel the runaway session in SM50 to free the work process immediately, then address the root cause (tune the query, add an index, or reschedule the report off-peak).", tCode: "SM50", tips: "Cancelling one runaway session usually restores the whole system — far better than a full instance restart." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson10_12.id },
  update: {},
  create: {
    lessonId: lesson10_12.id,
    title: "Work Process Administration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which work process type handles interactive user requests (every screen click)?",
          explanation: "DIA (dialog) work processes handle interactive user requests. When all DIA work processes are busy, users get the 'system busy' message. BGD handles batch, UPD handles asynchronous updates, ENQ handles locks, and SPO handles printing.",
          options: {
            create: [
              { text: "DIA (Dialog)", isCorrect: true },
              { text: "BGD (Background)", isCorrect: false },
              { text: "UPD (Update)", isCorrect: false },
              { text: "SPO (Spool)", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A work process shows the state 'On Hold'. What does this usually indicate?",
          explanation: "'On Hold' means the work process is paused waiting for something external — most commonly the database (or an RFC call). Many work processes 'on hold' is a strong signal of a slow database. 'Waiting' (different state) means idle and ready for the next request.",
          options: {
            create: [
              { text: "It is paused waiting on an external resource, usually the database", isCorrect: true },
              { text: "It is idle and ready to take the next user request", isCorrect: false },
              { text: "It has crashed and must be deleted from the profile", isCorrect: false },
              { text: "It is printing a spool request", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "During month-end, SM66 shows every DIA work process running, mostly on one manager's long report, and users get 'system busy'. What is the best first action?",
          explanation: "The right move is to drill into SM50, identify the runaway sessions, trace with ST05 if needed, and cancel the offending session to free work processes immediately. Restarting the instance is disruptive and unnecessary; adding DIA work processes is a longer-term sizing change, not an immediate fix.",
          options: {
            create: [
              { text: "Identify the runaway sessions in SM50 and cancel them to free work processes immediately", isCorrect: true },
              { text: "Restart the production instance to clear all work processes", isCorrect: false },
              { text: "Increase rdisp/wp_no_dia right now and reboot to apply it", isCorrect: false },
              { text: "Ask all users to log off until the report finishes on its own", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.13: Background Job Administration (SM36/SM37)
const lesson10_13 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "background-job-administration" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "Background Job Administration (SM36/SM37)",
    slug: "background-job-administration",
    order: 13,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `It's the first business day of the month and the finance controller calls Karthik, the BASIS lead, in a cold sweat: "The depreciation run didn't post last night and the books need to close today." Karthik opens SM37, filters for the AFAB job, and sees it in red — status "Cancelled". One click into the job log shows the real cause: a locked asset table because someone left a session open.

In ten minutes Karthik knows exactly what failed, why, and what to fix — because background jobs always leave a trail. Mass processing in SAP, from payroll to payment runs to depreciation, runs as background jobs, unattended, overnight. Knowing how to schedule, monitor, and debug them is core BASIS work.`,
    content: `## Why Background Jobs Exist

Some work has no user sitting in front of it: posting depreciation for 50,000 assets, running payroll for 10,000 employees, executing a payment run. These are **background jobs** — ABAP programs scheduled to run without interaction, usually overnight when the system is quiet. They run in \`BGD\` work processes, separate from the dialog work processes that serve users.

## Scheduling a Job — SM36

\`SM36\` is where you define a job. A job has four essential parts:

| Element | What it is |
|---------|------------|
| **Job name** | A label you'll search for later in SM37 |
| **ABAP program + variant** | The report to run and its saved parameters |
| **Start condition** | When the job should begin |
| **Job class** | The priority of the job |

### Job Classes — Priority

- **Class A** — high priority, runs in a *reserved* background work process. Used for critical, time-sensitive jobs.
- **Class B** — normal priority.
- **Class C** — low priority; runs only when capacity allows.

### Start Conditions

A job can start: **immediately**, at a **date/time**, **after an event**, **after another job** finishes, or **periodically** (daily, weekly, monthly). The periodic flag is powerful — set it once and SAP automatically reschedules the next run after each completion.

## Variants — Saved Parameters

A **variant** is a saved set of input parameters for an ABAP report. Because a background job runs without a user to fill the selection screen, it *must* run a program with a specific variant. For example, the depreciation report runs with a variant specifying company code and fiscal period.

## Monitoring Jobs — SM37

\`SM37\` is the job monitor. You filter by job name, user, date, and status, then read the result:

| Status | Meaning |
|--------|---------|
| **Scheduled** | Defined but no start time set yet |
| **Released** | Ready to run when its start condition is met |
| **Active** | Currently running |
| **Finished** | Completed successfully |
| **Cancelled** | Failed — check the job log |

### The Job Log — Your Best Friend

Every job writes a **job log** recording each step and any error message. When a job is cancelled, the log shows the exact reason — a lock, a missing authorization, a short dump. This is always the first place to look. Active jobs can also be **cancelled** from SM37 if they run away.

## Periodic Jobs and Critical System Jobs

Many SAP housekeeping tasks run as periodic background jobs you must keep healthy:

- **\`RDDIMPDP\`** — the transport dispatcher that imports transport requests.
- **\`RSBDCSUB\`** — releases queued batch input sessions.
- **\`SAP_COLLECTOR_FOR_PERFMONITOR\`** — collects performance statistics for ST03.

If these stop, transports won't import and your performance monitors go blank — so they're part of every BASIS daily check.

## The Practical Payoff

When Karthik's depreciation job failed, the fix wasn't guesswork: SM37 → find the job → read the job log → see the lock → clear it → re-run. The same pattern rescues a failed \`F110\` payment run or a stuck payroll job. Background jobs always tell you what happened — if you know where to read.`,
    keyConceptTitle: "Schedule in SM36, Monitor in SM37, and Always Read the Job Log on Failure",
    keyConceptBody: `- **Background jobs** run ABAP programs unattended (depreciation, payroll, payment runs) in \`BGD\` work processes — defined with a job name, program + **variant**, start condition, and **job class** (A high/reserved, B normal, C low).
- **Start conditions**: immediate, date/time, after event, after job, or **periodic** (the periodic flag auto-reschedules each run).
- **SM36** schedules jobs; **SM37** monitors them by name/user/status (Scheduled, Released, Active, Finished, Cancelled). The **job log** shows the exact failure reason — always check it first.
- Critical periodic system jobs (\`RDDIMPDP\` for transports, \`RSBDCSUB\` for batch input, \`SAP_COLLECTOR_FOR_PERFMONITOR\` for stats) must stay healthy as part of daily checks.`,
  },
});
const flowchart10_13 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_13.id },
  update: {},
  create: {
    lessonId: lesson10_13.id,
    title: "Scheduling and Diagnosing a Background Job",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "📝 SM36 — define job" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 110 }, data: { label: "📦 Program + Variant (saved params)" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 200 }, data: { label: "⏰ Start condition + job class" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 305, y: 290 }, data: { label: "▶️ Job runs in BGD work process" }, style: { background: "#0E7490", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 305, y: 380 }, data: { label: "🔎 SM37 — check status" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 90, y: 480 }, data: { label: "✅ Finished — done" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 360, y: 480 }, data: { label: "❌ Cancelled — read job log" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 360, y: 580 }, data: { label: "🛠️ Fix cause → re-run" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default", label: "green" },
      { id: "e6", source: "node5", target: "node7", type: "default", label: "red" },
      { id: "e7", source: "node7", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart10_13.id, nodeId: "node1", title: "Define the Job (SM36)", description: "Create the job: give it a searchable name and decide its priority class. This is the entry point for all scheduled background work.", tCode: "SM36", tips: "Use clear, consistent job naming (e.g. FI_DEPRECIATION_MONTHLY) so SM37 searches are easy during an incident." },
    { flowchartId: flowchart10_13.id, nodeId: "node2", title: "Program + Variant", description: "Specify the ABAP report and a saved variant. Because no user fills the selection screen, the variant supplies all parameters (company code, period, etc.).", tCode: "SE38", tips: "A wrong variant is a common silent failure — the job 'succeeds' but processes the wrong period or company code." },
    { flowchartId: flowchart10_13.id, nodeId: "node3", title: "Start Condition + Class", description: "Set when the job runs (immediate, date/time, after event/job, or periodic) and its job class (A/B/C) for priority.", tCode: "SM36", tips: "Mark recurring jobs 'periodic' so SAP reschedules them automatically — no manual re-creation each cycle." },
    { flowchartId: flowchart10_13.id, nodeId: "node4", title: "Job Runs in BGD WP", description: "When the start condition is met, the job executes in a background work process, independent of dialog users.", tCode: "SM50", tips: "If background jobs aren't starting, check you have free BGD work processes (rdisp/wp_no_btc) — not just DIA." },
    { flowchartId: flowchart10_13.id, nodeId: "node5", title: "Check Status in SM37", description: "Monitor the job by name, user, date, and status. Scheduled/Released/Active/Finished/Cancelled tell you exactly where it stands.", tCode: "SM37", tips: "SM37 is the single most-used transaction for batch operations — bookmark it for daily monitoring." },
    { flowchartId: flowchart10_13.id, nodeId: "node6", title: "Finished Successfully", description: "A green 'Finished' status means the job completed without error. For periodic jobs, the next run is already scheduled.", tCode: "SM37", tips: "Still glance at the log of critical 'finished' jobs — some report warnings without cancelling." },
    { flowchartId: flowchart10_13.id, nodeId: "node7", title: "Cancelled — Read the Log", description: "A red 'Cancelled' status means the job failed. Open the job log to see the exact error: a lock, missing authorization, or short dump.", tCode: "SM37", tips: "The job log line in red is your root cause — don't re-run blindly before reading it." },
    { flowchartId: flowchart10_13.id, nodeId: "node8", title: "Fix and Re-run", description: "Address the root cause shown in the log (clear the lock, fix the variant, grant the authorization), then re-run or reschedule the job.", tCode: "SM37", tips: "For month-end critical jobs, fix and re-run immediately — every minute of delay risks the close deadline." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson10_13.id },
  update: {},
  create: {
    lessonId: lesson10_13.id,
    title: "Background Job Administration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to MONITOR background jobs and their status?",
          explanation: "SM37 is the job monitor — you filter by job name, user, date, and status, and read the job log. SM36 is used to schedule (define) jobs, not monitor them.",
          options: {
            create: [
              { text: "SM37", isCorrect: true },
              { text: "SM36", isCorrect: false },
              { text: "SM50", isCorrect: false },
              { text: "SM59", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why must a background job always run an ABAP report with a specific variant?",
          explanation: "A background job runs unattended, with no user to fill in the selection screen. The variant supplies all the required parameters (company code, period, etc.) so the program knows exactly what to process.",
          options: {
            create: [
              { text: "Because no user is present to fill the selection screen, so the variant supplies all input parameters", isCorrect: true },
              { text: "Because variants make the job run at a higher priority", isCorrect: false },
              { text: "Because without a variant the job runs in a dialog work process", isCorrect: false },
              { text: "Because variants are required only for periodic jobs", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "The month-end AFAB depreciation job shows status 'Cancelled' in SM37. What is the correct first step to diagnose it?",
          explanation: "Open the job log for the cancelled job. It records each step and the exact error (e.g. a locked asset table, a missing authorization, or a short dump). Re-running blindly wastes time; the log points straight to the cause so you can fix it and re-run.",
          options: {
            create: [
              { text: "Open the job log for that job to read the exact error message", isCorrect: true },
              { text: "Immediately re-run the job several times until it succeeds", isCorrect: false },
              { text: "Delete the job and create a brand new one in SM36", isCorrect: false },
              { text: "Restart the application server to clear the failure", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.14: RFC Administration (SM59)
const lesson10_14 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "rfc-administration" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "RFC Administration (SM59)",
    slug: "rfc-administration",
    order: 14,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `The treasury team reports that the daily \`F110\` payment run failed with a curt message: "RFC connection failed to BANK_PROD." No money moved to the bank, and the cut-off is in an hour. Meena, the BASIS consultant, opens SM59, selects the BANK_PROD destination, and clicks Connection Test. It times out — the bank changed its endpoint IP overnight and nobody updated SAP.

Two minutes later she corrects the host, the test goes green, and the payment run completes. RFC is the invisible plumbing that lets SAP talk to other systems — banks, BTP, CRM, other SAP instances. When that plumbing leaks, business processes stop, and SM59 is where you find and fix the leak.`,
    content: `## What RFC Actually Is

**RFC (Remote Function Call)** is SAP's mechanism for one system to call a function module that lives on *another* system. Whenever SAP needs to talk to something outside itself — another SAP system, a bank, a cloud service — it uses RFC. It is the backbone of all SAP-to-SAP and SAP-to-external integration.

## SM59 — Managing RFC Destinations

An **RFC destination** is a stored definition of *how* to reach a remote system: the target host, the logon user, the connection type. \`SM59\` is where you create, edit, and test these destinations. Every integration in the landscape has a destination here.

## The RFC Connection Types

| Type | Name | Used for |
|------|------|----------|
| **Type 3** | ABAP Connection | SAP-to-SAP (the most common) |
| **Type H** | HTTP Connection (ABAP) | SAP to web service / SAP BTP |
| **Type G** | HTTP Connection (external) | SAP to an external HTTP server |
| **Type L** | Logical destination | An alias that points to another RFC destination |

Type 3 is what links your ERP to BW, Solution Manager, or another SAP box. Type H is increasingly important as integrations move to BTP and REST/OData services.

## Testing a Destination

SM59 gives you three tests — run them in order when something breaks:

1. **Connection Test** — a simple ping; can SAP reach the target at all?
2. **Authorization Test** — does the logon user actually log in successfully?
3. **Unicode Test** — do the two systems agree on character encoding?

Meena's failure was at step 1: the ping timed out because the host was wrong.

## The Logon User Matters

Every destination logs into the target with a **logon user**. This should be a **system or technical (communication) user**, never a personal dialog user. Why? A dialog user's password expires, the account gets locked, or the person leaves — and the integration silently dies. Technical users are built for exactly this.

## Reliable Delivery — tRFC and qRFC

Plain RFC is "fire and forget". For data that *must* arrive, SAP layers on guarantees:

- **tRFC (transactional RFC)** — guarantees *once-only* delivery. If the target is down, the call is stored and retried. This is what ALE/IDoc uses to move documents between systems.
- **qRFC (queued RFC)** — adds *ordered* delivery on top of tRFC, so calls are processed in sequence. Used by APO, PI/XI, and similar.

When tRFC calls fail, they wait in **\`SM58\`** (the tRFC monitor) for retry — a key place to check when IDocs stop flowing.

## Where RFC Shows Up in Real Business

- A **FICO payment run** (\`F110\`) connecting to the bank's system.
- **SD billing** triggering a **CRM** update.
- **ALE/IDoc** exchanges between two SAP systems (purchase orders, invoices).

All of these ride on RFC. So when a business process that crosses systems fails, the first instinct is: check the RFC destination in SM59, confirm the target is up, and test the connection.

## The Practical Payoff

"RFC connection failed" is one of the most common integration errors. The drill is always the same: SM59 → select the destination → Connection Test → Authorization Test. The result tells you whether it's a network/host problem, a logon-user problem, or the target system being down — and points you straight at the fix.`,
    keyConceptTitle: "SM59 Defines and Tests RFC Destinations; tRFC/qRFC Guarantee Delivery, SM58 Shows Failures",
    keyConceptBody: `- **RFC** lets one SAP system call a function on a remote system — the backbone of all SAP integration. **SM59** creates, edits, and tests **RFC destinations**.
- Connection types: **Type 3** (ABAP/SAP-to-SAP, most common), **Type H** (HTTP to web service/BTP), **Type G** (HTTP to external server), **Type L** (logical alias).
- Test in SM59 with **Connection Test** (ping), **Authorization Test** (logon), and **Unicode Test**; the logon user should be a **technical/system user**, never a dialog user whose password expires.
- **tRFC** guarantees once-only delivery (used by ALE/IDoc); **qRFC** adds ordered delivery (APO/PI). Failed tRFC calls wait in **SM58** for retry — check it when IDocs stop flowing.`,
  },
});
const flowchart10_14 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_14.id },
  update: {},
  create: {
    lessonId: lesson10_14.id,
    title: "Diagnosing an 'RFC Connection Failed' Error",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🚨 'RFC connection failed'" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "🔧 SM59 — open destination" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 305, y: 220 }, data: { label: "📡 Connection Test (ping)" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 90, y: 320 }, data: { label: "❌ Fails → check host / network" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 360, y: 320 }, data: { label: "🔑 Authorization Test (logon)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 360, y: 420 }, data: { label: "🧑‍💻 Fails → check technical user" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 100, y: 520 }, data: { label: "📨 IDocs stuck? → SM58 retry" }, style: { background: "#0E7490", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 360, y: 520 }, data: { label: "✅ Green → connection restored" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default", label: "timeout" },
      { id: "e4", source: "node3", target: "node5", type: "default", label: "ping ok" },
      { id: "e5", source: "node5", target: "node6", type: "default", label: "logon fails" },
      { id: "e6", source: "node5", target: "node8", type: "default", label: "logon ok" },
      { id: "e7", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart10_14.id, nodeId: "node1", title: "RFC Connection Failed", description: "A cross-system process (payment run, IDoc, CRM update) failed because SAP could not reach the remote system over RFC.", tCode: null, tips: "Note the exact destination name in the error — it tells you which SM59 entry to investigate." },
    { flowchartId: flowchart10_14.id, nodeId: "node2", title: "Open the Destination", description: "In SM59, find and open the named RFC destination to inspect its target host, connection type, and logon user.", tCode: "SM59", tips: "Destinations are grouped by type in SM59 (3, H, G, L) — expand the right folder to find yours." },
    { flowchartId: flowchart10_14.id, nodeId: "node3", title: "Connection Test (Ping)", description: "The first test simply checks whether SAP can reach the target at all. A timeout means a network, host, or target-down problem.", tCode: "SM59", tips: "Run Connection Test first — there's no point checking logon if you can't even reach the box." },
    { flowchartId: flowchart10_14.id, nodeId: "node4", title: "Ping Fails — Check Host/Network", description: "If the ping fails, the target host is wrong, the network/firewall is blocking, or the remote system is down. Verify the host and that the target is running.", tCode: "SM59", tips: "A changed endpoint IP (common with banks/cloud) is a classic cause — confirm the host with the integration team." },
    { flowchartId: flowchart10_14.id, nodeId: "node5", title: "Authorization Test (Logon)", description: "If the ping works, test whether the logon user can actually authenticate on the target system.", tCode: "SM59", tips: "Authorization failures point at the logon user, not the network — they're a different class of problem." },
    { flowchartId: flowchart10_14.id, nodeId: "node6", title: "Logon Fails — Check Technical User", description: "A logon failure usually means the technical user's password expired, the account is locked, or its authorizations changed on the target.", tCode: "SU01", tips: "Always use a system/communication user for RFC — dialog users expire and silently break integrations." },
    { flowchartId: flowchart10_14.id, nodeId: "node7", title: "Stuck tRFC — SM58", description: "If IDocs or ALE data stopped flowing, failed tRFC calls are queued in SM58 waiting for retry. Reprocess them once the connection is fixed.", tCode: "SM58", tips: "After restoring a destination, check SM58 and reprocess the backlog so no documents are lost." },
    { flowchartId: flowchart10_14.id, nodeId: "node8", title: "Connection Restored", description: "When both Connection and Authorization tests are green, the destination is healthy and the business process can be re-run.", tCode: "SM59", tips: "Re-run the failed business job (e.g. F110) only after the destination tests green end to end." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson10_14.id },
  update: {},
  create: {
    lessonId: lesson10_14.id,
    title: "RFC Administration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which RFC connection type is used for standard SAP-to-SAP communication?",
          explanation: "Type 3 (ABAP Connection) is the most common type and is used for SAP-to-SAP communication (e.g. ERP to BW or Solution Manager). Type H/G are for HTTP connections, and Type L is a logical alias.",
          options: {
            create: [
              { text: "Type 3 (ABAP Connection)", isCorrect: true },
              { text: "Type H (HTTP Connection)", isCorrect: false },
              { text: "Type G (HTTP to external server)", isCorrect: false },
              { text: "Type L (Logical destination)", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why should an RFC destination's logon user be a technical/system user rather than a personal dialog user?",
          explanation: "A dialog user's password expires, the account can be locked, or the person may leave — any of which silently breaks the integration. A technical (system/communication) user is designed for unattended connections and avoids these failures.",
          options: {
            create: [
              { text: "A dialog user's password expires or account gets locked, silently breaking the integration; technical users avoid this", isCorrect: true },
              { text: "Technical users make the RFC call run faster", isCorrect: false },
              { text: "Dialog users cannot be assigned any authorizations", isCorrect: false },
              { text: "Only technical users support Type 3 connections", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "The F110 payment run fails with 'RFC connection failed to BANK_PROD'. In SM59 the Connection Test times out. What is the most likely cause?",
          explanation: "A Connection Test timeout means SAP cannot reach the target at all — typically a wrong/changed host IP, a network/firewall block, or the target system being down. Banks and cloud endpoints change IPs, so verifying the host is the right next step. An expired password would fail the Authorization Test, not the ping.",
          options: {
            create: [
              { text: "The target host/endpoint is wrong or unreachable (e.g. the bank changed its IP) or the target is down", isCorrect: true },
              { text: "The logon user's password expired (this fails the Authorization Test, not the ping)", isCorrect: false },
              { text: "A Unicode mismatch between the two systems", isCorrect: false },
              { text: "Too few dialog work processes on the source system", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.15: Memory Administration
const lesson10_15 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "memory-administration" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "Memory Administration",
    slug: "memory-administration",
    order: 15,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A custom ABAP report that an analyst runs every quarter suddenly dies with a short dump: \`STORAGE_PARAMETERS_WRONG_SET\`. The analyst insists "it worked last quarter!" Arjun, the BASIS consultant, opens ST02 and sees the truth — extended memory is exhausting and several work processes have flipped into PRIV mode, hoarding private heap memory. The report's data set has grown, and it's now blowing past the heap limit for a dialog work process.

Arjun has a choice: bump a memory parameter, or push the developer to fix a report that loads a million rows into one internal table. Understanding SAP's memory model lets him make that call correctly instead of just throwing RAM at the problem. Memory administration is where BASIS and ABAP performance meet.`,
    content: `## SAP Has Its Own Memory Layer

SAP doesn't just use raw operating-system memory — it manages its own memory areas *on top of* the OS. Understanding this layered model is what prevents the two classic failures: crashes from memory exhaustion and slowdowns from memory pressure.

## The Memory Areas a Work Process Uses

When an ABAP program runs in a work process, it consumes memory from several pools in a specific order:

| Area | What it holds | Characteristics |
|------|---------------|-----------------|
| **Roll area** | User context (current screen, variables) | Small, fixed per work process |
| **Extended Memory (EM)** | Main ABAP working memory | Shared across WPs via mapping — the primary pool |
| **Heap memory** | Fallback when EM is full | Private to one WP; triggers a costly **mode switch** |

The order matters: a program uses the roll area, then extended memory, and only falls back to **heap** when EM is exhausted. Heap is private and expensive — once a work process is in heap (**PRIV mode**), it can't serve other users until that program finishes.

## The Key Parameters

| Parameter | Controls |
|-----------|----------|
| \`ztta/roll_extension\` | Max extended memory a single user session can use |
| \`abap/heap_area_dia\` | Max heap memory a dialog work process may grab |
| \`em/initial_size_MB\` | Total size of the extended memory pool |

These are set in the instance/default profile. Raising them is sometimes the right fix — and sometimes a band-aid over a badly written program.

## Reading Memory Pressure

Two signals tell you memory is under stress:

- **SM50 shows PRIV mode** — a work process running in private (heap) memory because EM ran out. A few are normal; many at once means memory pressure.
- **\`ST02\` (memory utilization monitor)** — the master view. It shows extended memory usage, roll buffer hit/miss rates, and **buffer swap rates**. High swaps and red rows mean buffers or memory areas are too small.

## The OS Layer Underneath

SAP's memory ultimately comes from the operating system, where it **competes with the database** for RAM. This is why sizing is critical — give SAP too much and the DB starves; too little and SAP swaps. If the OS runs out of **swap space**, SAP processes crash outright. Monitor OS-level memory and swap via \`SM66\` or \`OS07\`.

## The Classic Crash and Its Fix

\`STORAGE_PARAMETERS_WRONG_SET\` is the runtime error you'll meet most: it means a program needed more heap than \`abap/heap_area_dia\` allows. You have two paths:

1. **Increase the heap parameter** — appropriate if the workload legitimately grew and the server has spare RAM.
2. **Fix the ABAP program** — better if the program is memory-hungry by design (e.g. selecting a million rows into one internal table with no paging). Throwing memory at bad code only delays the next crash.

## The Practical Payoff

When Arjun saw EM exhausting and PRIV-mode work processes in ST02/SM50, he diagnosed the real issue: a growing report exceeding heap limits. The senior move is knowing *when* to raise a parameter versus *when* to send the report back to the developer. That judgment — rooted in understanding roll, extended, and heap memory — is what separates a BASIS firefighter from a BASIS engineer.`,
    keyConceptTitle: "ABAP Uses Roll → Extended → Heap Memory; PRIV Mode and ST02 Reveal Memory Pressure",
    keyConceptBody: `- An ABAP program consumes memory in order: **Roll area** (small user context) → **Extended Memory (EM)** (main shared pool) → **Heap** (private fallback, triggers a costly mode switch / PRIV mode).
- Key parameters: \`ztta/roll_extension\` (max EM per session), \`abap/heap_area_dia\` (max heap per dialog WP), \`em/initial_size_MB\` (total EM pool size).
- Detect pressure via **SM50 PRIV mode** (WP using private heap) and **ST02** (EM usage, buffer hit/miss, swap rates); SAP competes with the DB for OS RAM, and exhausted **swap space** crashes SAP.
- \`STORAGE_PARAMETERS_WRONG_SET\` = heap exceeded → either raise the heap parameter (if workload legitimately grew) or fix the memory-hungry ABAP program (the better fix for bad code).`,
  },
});
const flowchart10_15 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_15.id },
  update: {},
  create: {
    lessonId: lesson10_15.id,
    title: "How ABAP Consumes Memory and Where It Breaks",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "▶️ ABAP program starts in WP" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "📄 Roll area (user context)" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 305, y: 220 }, data: { label: "🧠 Extended Memory (main pool)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 305, y: 320 }, data: { label: "⚠️ EM full? → Heap (PRIV mode)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 305, y: 420 }, data: { label: "💥 Heap exceeded → short dump" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 60, y: 420 }, data: { label: "📊 ST02 — watch EM & swaps" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 120, y: 520 }, data: { label: "🔧 Raise heap parameter" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 360, y: 520 }, data: { label: "🛠️ Fix memory-hungry ABAP" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default", label: "then" },
      { id: "e3", source: "node3", target: "node4", type: "default", label: "if full" },
      { id: "e4", source: "node4", target: "node5", type: "default", label: "exceeds limit" },
      { id: "e5", source: "node4", target: "node6", type: "default", label: "monitor" },
      { id: "e6", source: "node5", target: "node7", type: "default", label: "workload grew" },
      { id: "e7", source: "node5", target: "node8", type: "default", label: "bad code" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart10_15.id, nodeId: "node1", title: "Program Starts", description: "An ABAP program begins executing inside a work process and immediately starts requesting memory from SAP's managed pools.", tCode: "SM50", tips: "Memory is requested per user session — many sessions running heavy reports together is what builds pressure." },
    { flowchartId: flowchart10_15.id, nodeId: "node2", title: "Roll Area", description: "The small, fixed per-work-process area holding user context: the current screen, internal variables, and session state.", tCode: null, tips: "Roll area is tiny and rarely the bottleneck — but roll buffer misses in ST02 still signal tuning needs." },
    { flowchartId: flowchart10_15.id, nodeId: "node3", title: "Extended Memory (EM)", description: "The main ABAP working memory, shared across work processes through mapping. Most program data lives here. Sized by em/initial_size_MB.", tCode: "ST02", tips: "EM is the pool to watch — when it fills, work processes are forced into expensive private heap." },
    { flowchartId: flowchart10_15.id, nodeId: "node4", title: "Heap / PRIV Mode", description: "When EM is exhausted, the work process falls back to private heap memory and enters PRIV mode — it can no longer serve other users until done.", tCode: "SM50", tips: "A handful of PRIV work processes is normal; many at once means EM is too small or programs are too greedy." },
    { flowchartId: flowchart10_15.id, nodeId: "node5", title: "Short Dump", description: "If the program needs more heap than abap/heap_area_dia permits, it crashes with STORAGE_PARAMETERS_WRONG_SET.", tCode: "ST22", tips: "ST22 holds the short dump with the exact memory figures — read it before deciding parameter vs code fix." },
    { flowchartId: flowchart10_15.id, nodeId: "node6", title: "Monitor with ST02", description: "The memory utilization monitor shows EM usage, roll buffer hit/miss, and buffer swap rates — your early-warning system for memory pressure.", tCode: "ST02", tips: "Red rows and high swap rates in ST02 mean a buffer or memory area is undersized for the workload." },
    { flowchartId: flowchart10_15.id, nodeId: "node7", title: "Raise the Parameter", description: "If the workload has legitimately grown and the server has spare RAM, increasing abap/heap_area_dia or EM size is the correct fix.", tCode: "RZ10", tips: "Change parameters in RZ10, then restart the instance to apply — and confirm the OS actually has the RAM to spare." },
    { flowchartId: flowchart10_15.id, nodeId: "node8", title: "Fix the ABAP", description: "If the program is greedy by design (e.g. a million rows into one internal table), the right fix is to rewrite it with paging/packaging — not more memory.", tCode: "SE38", tips: "Throwing RAM at bad code only delays the next crash; package processing fixes the root cause." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson10_15.id },
  update: {},
  create: {
    lessonId: lesson10_15.id,
    title: "Memory Administration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In what order does an ABAP program consume SAP memory areas?",
          explanation: "A program uses the Roll area first (user context), then Extended Memory (the main shared pool), and only falls back to Heap memory (private to the work process) when Extended Memory is exhausted.",
          options: {
            create: [
              { text: "Roll area → Extended Memory → Heap", isCorrect: true },
              { text: "Heap → Extended Memory → Roll area", isCorrect: false },
              { text: "Extended Memory → Roll area → Heap", isCorrect: false },
              { text: "Heap → Roll area → Extended Memory", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does it mean when SM50 shows a work process in PRIV mode?",
          explanation: "PRIV (private) mode means the work process has run out of shared Extended Memory and is now using private heap memory. While in PRIV mode it cannot serve other users until the program finishes — many PRIV work processes at once indicate memory pressure.",
          options: {
            create: [
              { text: "Extended Memory was exhausted, so the work process switched to private heap and is dedicated to that program", isCorrect: true },
              { text: "The work process is idle and reserved for privileged users", isCorrect: false },
              { text: "The work process is running a private (encrypted) RFC call", isCorrect: false },
              { text: "The work process has crashed and must be deleted", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A custom report that 'worked last quarter' now crashes with STORAGE_PARAMETERS_WRONG_SET, and ST02 shows EM exhausting with several PRIV work processes. What is the senior BASIS judgment?",
          explanation: "The error means heap was exceeded. The correct judgment depends on the cause: if the workload legitimately grew and RAM is available, raise the heap parameter; but if the report is greedy by design (loading huge data into one internal table), the better fix is to have the developer rewrite it with package/paging processing. Blindly raising memory on bad code only delays the next crash.",
          options: {
            create: [
              { text: "Decide between raising the heap parameter (if workload grew and RAM is free) and fixing the memory-hungry report (if the code is greedy by design)", isCorrect: true },
              { text: "Always raise abap/heap_area_dia — parameters are the only real fix", isCorrect: false },
              { text: "Restart the database to release memory", isCorrect: false },
              { text: "Move the report to run in a dialog work process instead of background", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 10.16: Database Administration
const lesson10_16 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "database-administration" } },
  update: {},
  create: {
    moduleId: basisModule.id,
    title: "Database Administration",
    slug: "database-administration",
    order: 16,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `On a Tuesday morning the entire SD team reports that creating a sales order takes 40 seconds instead of two. Lakshmi, the BASIS consultant, opens DB02 and finds two red flags in under a minute: a tablespace is 94% full, and a large custom table has a query running a full table scan because a missing index was never created after a recent data load. Neither problem is in ABAP — both live in the database.

Even when a dedicated DBA team exists, BASIS owns the health of the database underneath SAP, because SAP performance *is* database performance most of the time. DB02 and DB13 are the BASIS person's window into that world — table spaces, statistics, backups, and indexes — and reading them turns a vague "system is slow" into a precise, fixable diagnosis.`,
    content: `## BASIS Owns the Database Underneath SAP

Even where a separate DBA team manages the database engine, the **BASIS team is responsible for the database health that SAP depends on**. The reason is simple: most SAP performance problems are database problems — a full tablespace, stale statistics, or a missing index. Two SAP transactions give you that visibility without needing native DB tools.

## DB02 — The Database Monitor

\`DB02\` is SAP's window into the database. It shows table and index sizes, space usage, missing indexes, and database alerts. It's where you go when you need to know *what* is happening inside the database right now.

## DB13 — The DBA Planning Calendar

\`DB13\` is the **database administration calendar** — a scheduler for routine DBA tasks. From here you schedule backups, update statistics, and run database checks on a recurring basis, so they happen automatically and on time.

## The Four Core DBA Tasks in an SAP Context

| Task | Where | Why it matters |
|------|-------|----------------|
| **Tablespace monitoring** | DB02 → Space → Critical Objects | A full tablespace stops *all* writes — postings fail |
| **Statistics update** | DB13 → Update Statistics | Helps the DB optimizer pick efficient execution plans |
| **Database backup** | DB13 → Backup | Full/incremental + log backups enable point-in-time recovery |
| **Index monitoring** | DB02 → Missing Indexes | A missing index means full table scans on large tables |

**Tablespaces** filling up is the most dangerous: at 100% the database can no longer write, and every posting in SAP fails. **Statistics** are subtler — when they're stale, the optimizer mis-estimates and chooses a slow plan, which is exactly how a query that was fast last week becomes slow today. **Backups** are non-negotiable: full backups plus log backups let you recover to any point in time. **Missing indexes** turn a quick lookup into a scan of millions of rows.

## Database-Specific Tooling

The transactions above are the SAP-level abstraction, but the engine underneath differs:

- **HANA (S/4HANA)** — administered via **HANA Studio** or **HANA Cockpit**. HANA is a column store, so there are *no traditional tablespaces* — memory and the column store are managed differently.
- **Oracle** — uses **BR*Tools** (\`brbackup\`, \`brrestore\`, \`brspace\`) run from the OS level for backup and space management.

Knowing which engine you're on tells you which toolset applies — a common interview and on-the-job distinction.

## The Early Watch Alert

The **Early Watch Alert (EWA)** is a weekly, automated health report generated from **SAP Solution Manager**. It covers database health, performance trends, growth, and configuration risks — a proactive document BASIS teams review every week to catch problems (like a tablespace trending toward full) *before* they cause an outage.

## The Practical Payoff

Lakshmi's "system is slow" became a precise fix because she knew where to look: DB02 → check tablespace usage (94% full → extend it) and check missing indexes (create the index on the large table). The same drill catches the two most common database-rooted slowdowns. Database administration is where BASIS turns a vague complaint into a concrete, two-step remedy.`,
    keyConceptTitle: "DB02 Shows Database State, DB13 Schedules DBA Tasks; Full Tablespaces and Missing Indexes Are the Usual Culprits",
    keyConceptBody: `- BASIS owns SAP database health even with a separate DBA team, because most SAP performance issues are database issues. **DB02** monitors the database (sizes, space, missing indexes, alerts); **DB13** is the DBA calendar that schedules backups, statistics updates, and checks.
- Core tasks: **tablespace monitoring** (full = all writes fail), **statistics update** (stale stats → slow optimizer plans), **backups** (full + log = point-in-time recovery), **index monitoring** (missing index → full table scans).
- Engine specifics: **HANA** (S/4) uses HANA Studio/Cockpit with a column store and no traditional tablespaces; **Oracle** uses **BR*Tools** (brbackup/brrestore/brspace) from the OS.
- The **Early Watch Alert (EWA)** is a weekly automated health report from Solution Manager covering DB health and growth — review it to catch problems before outages.`,
  },
});
const flowchart10_16 = await prisma.flowchart.upsert({
  where: { lessonId: lesson10_16.id },
  update: {},
  create: {
    lessonId: lesson10_16.id,
    title: "Diagnosing a Database-Rooted Slowdown",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🐢 'System suddenly slow'" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "🗄️ DB02 — database monitor" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 80, y: 230 }, data: { label: "📦 Tablespace 90%+ full?" }, style: { background: "#475569", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 360, y: 230 }, data: { label: "🔑 Missing index on big table?" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 80, y: 340 }, data: { label: "➕ Extend tablespace" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 360, y: 340 }, data: { label: "🏗️ Create index / update stats" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 305, y: 450 }, data: { label: "📅 DB13 — schedule stats & backups" }, style: { background: "#0E7490", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 305, y: 550 }, data: { label: "📈 EWA — weekly health review" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default", label: "yes" },
      { id: "e5", source: "node4", target: "node6", type: "default", label: "yes" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
      { id: "e7", source: "node6", target: "node7", type: "default" },
      { id: "e8", source: "node7", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart10_16.id, nodeId: "node1", title: "System Suddenly Slow", description: "Users report a process (e.g. sales-order creation) that was fast is now slow. A sudden change often points at the database rather than ABAP.", tCode: null, tips: "'Worked yesterday, slow today' frequently means stale statistics or a tablespace filling — both DB-side." },
    { flowchartId: flowchart10_16.id, nodeId: "node2", title: "Open DB02", description: "The database monitor shows space usage, table/index sizes, missing indexes, and alerts — your single window into database health.", tCode: "DB02", tips: "Start in DB02 for any suspected DB issue; it surfaces the two most common causes on one screen." },
    { flowchartId: flowchart10_16.id, nodeId: "node3", title: "Tablespace Full?", description: "Check Space → Critical Objects. A tablespace at 90%+ is dangerous; at 100% the database cannot write and all postings fail.", tCode: "DB02", tips: "Tablespace exhaustion causes hard failures, not just slowness — treat 90%+ as urgent." },
    { flowchartId: flowchart10_16.id, nodeId: "node4", title: "Missing Index?", description: "Check Missing Indexes. A large table without the needed index forces a full table scan, which is slow and CPU-heavy.", tCode: "DB02", tips: "Indexes are often forgotten after a bulk data load — a classic cause of a newly slow query." },
    { flowchartId: flowchart10_16.id, nodeId: "node5", title: "Extend the Tablespace", description: "Add space (or a datafile) to the full tablespace so the database can write again and postings resume.", tCode: "DB02", tips: "Extend proactively when EWA shows a tablespace trending toward full — don't wait for the outage." },
    { flowchartId: flowchart10_16.id, nodeId: "node6", title: "Create Index / Update Stats", description: "Create the missing index to eliminate the full table scan, and update statistics so the optimizer picks the efficient plan.", tCode: "DB13", tips: "After a big data load, refresh statistics — stale stats make even an indexed table use a poor plan." },
    { flowchartId: flowchart10_16.id, nodeId: "node7", title: "Schedule via DB13", description: "Use the DBA calendar to schedule recurring statistics updates, database checks, and backups so health is maintained automatically.", tCode: "DB13", tips: "Automate statistics and backups in DB13 — manual, ad-hoc runs are how gaps and missed backups happen." },
    { flowchartId: flowchart10_16.id, nodeId: "node8", title: "Review the EWA", description: "The weekly Early Watch Alert from Solution Manager flags database growth, performance trends, and risks before they cause outages.", tCode: null, tips: "Reading the EWA every week is the proactive half of DB admin — it warns you before DB02 turns red." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson10_16.id },
  update: {},
  create: {
    lessonId: lesson10_16.id,
    title: "Database Administration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is the database administration CALENDAR used to schedule backups and statistics updates?",
          explanation: "DB13 is the DBA planning calendar — you schedule recurring tasks like backups, statistics updates, and database checks here. DB02 is the database monitor for inspecting current state (space, indexes, alerts).",
          options: {
            create: [
              { text: "DB13", isCorrect: true },
              { text: "DB02", isCorrect: false },
              { text: "ST02", isCorrect: false },
              { text: "SM37", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does updating database statistics improve performance?",
          explanation: "Statistics describe the data distribution to the database optimizer. With fresh statistics the optimizer can choose an efficient execution plan; with stale statistics it mis-estimates and may pick a slow plan — which is how a query that was fast becomes slow after a large data change.",
          options: {
            create: [
              { text: "They give the optimizer accurate data distribution so it picks efficient execution plans", isCorrect: true },
              { text: "They physically defragment and shrink every table", isCorrect: false },
              { text: "They free up tablespace by deleting old rows", isCorrect: false },
              { text: "They create indexes automatically on all large tables", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Sales-order creation suddenly takes 40 seconds. In DB02 you see a tablespace at 94% and a large custom table doing full table scans. What are the correct two fixes?",
          explanation: "Both problems live in the database. Extend the nearly-full tablespace so writes don't fail, and create the missing index (and update statistics) on the large table to eliminate the full table scan. Neither is an ABAP change — DB02 pointed straight at both root causes.",
          options: {
            create: [
              { text: "Extend the tablespace and create the missing index (plus update statistics) on the large table", isCorrect: true },
              { text: "Rewrite the sales-order ABAP program to use less memory", isCorrect: false },
              { text: "Add more dialog work processes in the instance profile", isCorrect: false },
              { text: "Restart the database to clear the slowdown", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── HCM: DEEP DIVE LESSONS (Session 9A) ─────────────────────────────────────
// LESSON 6.11: Payroll Control Record (PA03)
const lesson6_11 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "payroll-control-record" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "Payroll Control Record (PA03)",
    slug: "payroll-control-record",
    order: 11,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Two days before payday, an HR officer named Divya tries to update an employee's salary in PA30 and gets a blunt error: she cannot change the record. She escalates to Rohan, the HRIS consultant, convinced something is broken. Rohan opens PA03, looks at the payroll area, and smiles — nothing is broken at all. The payroll run is in progress, so the control record has locked the payroll area, exactly as designed.

The Payroll Control Record is the quiet gatekeeper of the entire payroll process. It decides which period is open, what actions are allowed, and when master data can change. Misunderstand it and you'll think the system is buggy; understand it and you'll know precisely why a change is blocked and how to release it safely.`,
    content: `## The Gatekeeper of Payroll

Payroll is not a single button — it's a controlled sequence, and the **Payroll Control Record** is what enforces that control. There is one control record per **payroll area**, and it governs which period is open for processing and which actions are currently permitted. \`PA03\` is the transaction to display and manage it.

## The Payroll Status Cycle

The control record moves through a defined set of statuses, and each status permits different actions:

| Status | What it means |
|--------|---------------|
| **Released for Payroll** | The period is open; payroll can be run |
| **Payroll Run** | Payroll is actively being calculated |
| **Released for Posting** | Results are ready to post to FI |
| **Posting Run** | Posting to Financial Accounting is in progress |
| **Exit Payroll** | The period is closed; normal master-data changes resume |

This cycle exists so that money is never calculated on shifting data. Once a period is "released for payroll", the system protects the inputs.

## Why You Can't Change PA30 During a Run

When payroll is running, the control record **locks the payroll area** — no infotype changes are allowed for employees in that area. This is exactly what blocked Divya. It's not a bug; it's the system guaranteeing that the salary being calculated doesn't change halfway through. The fix isn't to force the change — it's to wait until payroll is released, or coordinate with the payroll team.

## The Payroll Period

The control record holds the **current payroll period** — the specific month or week being processed. This prevents one of the most dangerous errors: running the wrong period. The system always knows "we are processing June 2026", and it won't let you accidentally run May again or jump to July.

## Retroactive Accounting Date

The control record also stores the **earliest retroactive accounting date**. If someone makes a master-data change (say, a backdated salary increase) effective *before* this date, the next payroll run automatically performs **retroactive accounting** — it recalculates the affected prior periods and carries the difference forward. This is how a backdated raise correctly pays arrears without manual rework.

## Correction Runs

What if an error is found *after* payroll has run but before posting? The team can **exit payroll**, fix the errors in master data, and re-run. The control record flags this as a **correction run**, so the system recalculates cleanly. This is the safety valve that lets payroll be re-run without corrupting results.

## The Practical Payoff

Divya's "I can't change the salary" ticket is one of the most common in HCM support, and the answer is almost always the same: check \`PA03\`. If the payroll area is locked because a run is in progress, no infotype changes are possible until the payroll/Basis team releases it. Knowing this turns a panicked "the system is broken" into a calm "payroll is locked — here's when it'll open." The control record isn't an obstacle; it's the discipline that keeps payroll accurate.`,
    keyConceptTitle: "The Control Record (PA03) Locks the Payroll Area and Governs the Period and Allowed Actions",
    keyConceptBody: `- There is one **Payroll Control Record per payroll area** (managed in **PA03**); it governs which period is open and which actions are allowed.
- Status cycle: **Released for Payroll → Payroll Run → Released for Posting → Posting Run → Exit Payroll** — each status permits different actions so money is never calculated on shifting data.
- During a run the control record **locks the payroll area**, so infotype changes in PA30 are blocked — this is by design, not a bug. The **earliest retroactive accounting date** triggers automatic retro recalculation for backdated changes.
- A **correction run** (exit payroll → fix → re-run) lets payroll be safely re-run after errors. Diagnosis: "can't change salary in PA30" → check PA03; the area is likely locked.`,
  },
});
const flowchart6_11 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_11.id },
  update: {},
  create: {
    lessonId: lesson6_11.id,
    title: "The Payroll Control Record Status Cycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🔓 Released for Payroll" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "⚙️ Payroll Run (area locked)" }, style: { background: "#6D28D9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 305, y: 220 }, data: { label: "📤 Released for Posting" }, style: { background: "#5B21B6", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 305, y: 320 }, data: { label: "🏦 Posting Run (to FI)" }, style: { background: "#4C1D95", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 305, y: 420 }, data: { label: "🚪 Exit Payroll (period closed)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 600, y: 120 }, data: { label: "🚫 PA30 changes blocked" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 600, y: 220 }, data: { label: "🔁 Error? → correction run" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node2", target: "node6", type: "default", label: "locks area" },
      { id: "e6", source: "node3", target: "node7", type: "default", label: "if error" },
      { id: "e7", source: "node7", target: "node1", type: "default", label: "exit & re-run" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_11.id, nodeId: "node1", title: "Released for Payroll", description: "The payroll area is opened for the current period. Payroll can now be run, and the system fixes which period is being processed.", tCode: "PA03", tips: "Releasing for payroll is the deliberate start of the cycle — done by the payroll team, not individual HR officers." },
    { flowchartId: flowchart6_11.id, nodeId: "node2", title: "Payroll Run", description: "Payroll is actively calculating. The control record locks the payroll area so master data cannot change mid-calculation.", tCode: "PC00_M99_CALC", tips: "This lock is why PA30 changes fail during a run — the system protects the figures being computed." },
    { flowchartId: flowchart6_11.id, nodeId: "node3", title: "Released for Posting", description: "Payroll results are finalized and ready to be transferred to Financial Accounting.", tCode: "PA03", tips: "Reaching this status means the calculation is trusted — the next step is the FI posting run." },
    { flowchartId: flowchart6_11.id, nodeId: "node4", title: "Posting Run", description: "The payroll results post to FI, creating the accounting documents for salary expense and liabilities.", tCode: "PC00_M99_CIPE", tips: "Posting must fall in an open FI period — coordinate with FICO before this step." },
    { flowchartId: flowchart6_11.id, nodeId: "node5", title: "Exit Payroll", description: "The period is closed. Normal master-data changes resume, and the control record advances to the next period.", tCode: "PA03", tips: "Only exit payroll once posting is confirmed correct — exiting prematurely complicates corrections." },
    { flowchartId: flowchart6_11.id, nodeId: "node6", title: "PA30 Changes Blocked", description: "While the area is locked for a run, infotype changes in PA30 are rejected. This is the most common 'I can't edit the record' support ticket.", tCode: "PA30", tips: "Check PA03 first whenever a PA30 change is blocked — the lock explains it 90% of the time." },
    { flowchartId: flowchart6_11.id, nodeId: "node7", title: "Correction Run", description: "If an error is found before exit, the team exits payroll, fixes master data, and re-runs as a correction run for a clean recalculation.", tCode: "PA03", tips: "Correction runs are the safe way to fix mistakes — never edit results directly, always re-run." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson6_11.id },
  update: {},
  create: {
    lessonId: lesson6_11.id,
    title: "Payroll Control Record — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to display and manage the Payroll Control Record?",
          explanation: "PA03 is the transaction for the Payroll Control Record — it shows the payroll status, current period, and lets the payroll team release or exit payroll. PA30 maintains employee infotypes, not the control record.",
          options: {
            create: [
              { text: "PA03", isCorrect: true },
              { text: "PA30", isCorrect: false },
              { text: "PA40", isCorrect: false },
              { text: "PA20", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does the control record lock the payroll area during a payroll run?",
          explanation: "Locking the payroll area prevents master-data (infotype) changes while payroll is calculating, so the figures being computed cannot shift halfway through. This guarantees the payroll result is based on a consistent, frozen set of inputs.",
          options: {
            create: [
              { text: "To prevent infotype changes mid-calculation so payroll is computed on consistent, frozen data", isCorrect: true },
              { text: "To stop other users from logging into SAP during payroll", isCorrect: false },
              { text: "To free up work processes for the payroll run", isCorrect: false },
              { text: "Because the control record is being backed up", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "An HR officer reports she cannot change an employee's salary in PA30 two days before payday. What is the most likely cause and correct response?",
          explanation: "The payroll area is almost certainly locked because the control record is in a payroll run (or released for payroll). This is by design — the fix is to check PA03 and coordinate with the payroll/Basis team to make the change before the run or after the area is released, not to force the edit.",
          options: {
            create: [
              { text: "The payroll area is locked by the control record (run in progress); check PA03 and coordinate with the payroll team", isCorrect: true },
              { text: "The employee's infotype is corrupted and must be deleted", isCorrect: false },
              { text: "The officer lacks PA30 authorization and needs a new role", isCorrect: false },
              { text: "The SAP system is down and needs a restart", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.12: Time Evaluation (PT60)
const lesson6_12 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "time-evaluation" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "Time Evaluation (PT60)",
    slug: "time-evaluation",
    order: 12,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A factory supervisor escalates to Priya, the HCM consultant: "Ravi worked three night shifts of overtime last week, but his payslip shows nothing extra." Priya doesn't open the payslip first — she runs PT60 for Ravi's personnel number and the period in question, and the error log lights up. The night-shift clock-out on one day never matched a clock-in, so the time schema couldn't generate the overtime wage type.

This is the heart of time management: raw clock data is meaningless to payroll until **time evaluation** turns it into wage types. PT60 is the engine that does that translation, and reading its log is how you explain why an employee's hours did — or didn't — turn into money.`,
    content: `## Why Time Evaluation Exists

Payroll can't pay "a clock-in at 21:00 and a clock-out at 06:00" — it needs **wage types** like "overtime: 3 hours" or "night bonus: 8 hours". **Time evaluation** is the process that converts raw time data into those evaluated results. Without it, attendances and absences never become pay.

## PT60 — The Engine

\`PT60\` is the time evaluation program. You run it for a **date range** and a **personnel number selection** (one employee, a group, or everyone). It reads the raw inputs, applies the rules, and writes evaluated time results that payroll later consumes.

### What PT60 Reads

| Infotype | Holds |
|----------|-------|
| \`IT2011\` | Time events — clock-in / clock-out |
| \`IT2001\` | Absences (leave, sickness) |
| \`IT2002\` | Attendances (overtime, special duty) |

It processes these through a **time schema** and produces **time wage types** for payroll.

## Time Schemas — The Rulebook

A **time schema** is an ABAP-like decision structure that controls the logic of time evaluation: how to count hours, when overtime begins, how to value a night shift. SAP ships standard schemas you copy and adapt:

- **\`TM00\`** — designed for **negative** time management.
- **\`TM04\`** — designed for **positive** time management.

The schema is where business rules live — change the schema, and you change how every employee's time is interpreted.

## Positive vs Negative Time Management

This distinction decides *what data you have to record*:

| Type | What is recorded | Typical users |
|------|------------------|---------------|
| **Positive** | Every attendance and clocking | Factory / shift workers |
| **Negative** | Only deviations (absences) | Office staff — assumed present unless absent |

In **negative** time, the system assumes the employee worked their planned schedule unless an absence is posted — so HR only enters exceptions. In **positive** time, every clock event matters, which is why Ravi's unmatched clock-out broke his overtime.

## The Wage Types It Generates

Time evaluation produces **time wage types** that flow into payroll, for example:

- **\`M200\`** — overtime.
- **\`M110\`** — night shift bonus.

These are the bridge: PT60 creates them, payroll values them in rupees.

## Quotas and the Error Log

\`PT_QTA10\` gives an **absence quota overview** — how many leave days an employee has left, generated and tracked through time evaluation. And critically, every PT60 run produces an **error log** listing employees whose time couldn't be evaluated (a missing pairing, an invalid schedule). These errors **must be fixed before payroll**, because unevaluated time means missing or wrong pay.

## The Practical Payoff

When "overtime isn't showing in payroll", the diagnosis is precise: run \`PT60\` for that employee and read the result. Either the time schema generated the overtime wage type (so the problem is downstream in payroll) or it didn't (so the problem is the input data or the schema). For Ravi, the unmatched clock-out meant no \`M200\` was generated — fix the clock pairing, re-run PT60, and the overtime flows into his next payslip. Time evaluation is where attendance becomes money, and PT60's log is the receipt that proves it.`,
    keyConceptTitle: "PT60 Turns Raw Clock Data into Wage Types via a Time Schema; Fix Its Error Log Before Payroll",
    keyConceptBody: `- **Time evaluation (PT60)** converts raw time data — \`IT2011\` (clockings), \`IT2001\` (absences), \`IT2002\` (attendances) — into **time wage types** (e.g. \`M200\` overtime, \`M110\` night bonus) that payroll values.
- A **time schema** (ABAP-like rules) controls the logic: **\`TM00\`** for negative time, **\`TM04\`** for positive time.
- **Positive** time records every attendance/clocking (factory/shift workers); **negative** time records only deviations (office staff assumed present unless absent).
- **\`PT_QTA10\`** shows absence quotas; the **PT60 error log** lists employees whose time failed to evaluate and must be fixed before payroll. Diagnosis: "overtime missing in payroll" → run PT60 → check if the schema generated the wage type.`,
  },
});
const flowchart6_12 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_12.id },
  update: {},
  create: {
    lessonId: lesson6_12.id,
    title: "How PT60 Turns Clock Data into Payroll Wage Types",
    nodes: [
      { id: "node1", type: "default", position: { x: 80, y: 30 }, data: { label: "⏱️ IT2011 — clock-in/out" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 80, y: 130 }, data: { label: "🏖️ IT2001 — absences" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 80, y: 230 }, data: { label: "🛠️ IT2002 — attendances" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 350, y: 130 }, data: { label: "⚙️ PT60 — time evaluation" }, style: { background: "#6D28D9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 350, y: 240 }, data: { label: "📐 Time schema (TM00 / TM04)" }, style: { background: "#5B21B6", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 620, y: 70 }, data: { label: "💰 Wage types (M200, M110)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 620, y: 180 }, data: { label: "🚨 Error log — fix before payroll" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 620, y: 290 }, data: { label: "➡️ Payroll values the hours" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node4", type: "default" },
      { id: "e2", source: "node2", target: "node4", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default", label: "applies" },
      { id: "e5", source: "node4", target: "node6", type: "default", label: "generates" },
      { id: "e6", source: "node4", target: "node7", type: "default", label: "if errors" },
      { id: "e7", source: "node6", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_12.id, nodeId: "node1", title: "IT2011 — Time Events", description: "Raw clock-in and clock-out events captured from time terminals. In positive time management, these are the primary input to evaluation.", tCode: "PA30", tips: "An unmatched clock event (in without out) is the most common cause of failed time evaluation." },
    { flowchartId: flowchart6_12.id, nodeId: "node2", title: "IT2001 — Absences", description: "Recorded absences such as leave and sickness. In negative time, these deviations are the main thing HR records.", tCode: "PA30", tips: "Absences reduce worked time and consume quota — both flow through PT60." },
    { flowchartId: flowchart6_12.id, nodeId: "node3", title: "IT2002 — Attendances", description: "Recorded attendances such as overtime or special duty that need to be valued separately from the planned schedule.", tCode: "PA30", tips: "Overtime entered here only becomes pay if the schema generates the matching wage type." },
    { flowchartId: flowchart6_12.id, nodeId: "node4", title: "PT60 — Time Evaluation", description: "The engine. Run for a date range and personnel selection, it reads the inputs, applies the schema, and writes evaluated results.", tCode: "PT60", tips: "Run PT60 for a single employee and period to diagnose a specific 'missing hours' complaint quickly." },
    { flowchartId: flowchart6_12.id, nodeId: "node5", title: "Time Schema", description: "The ABAP-like rulebook (TM00 negative, TM04 positive) that defines how hours are counted, when overtime starts, and how shifts are valued.", tCode: "PE01", tips: "Business rules live in the schema — most 'wrong hours' issues trace back to schema configuration." },
    { flowchartId: flowchart6_12.id, nodeId: "node6", title: "Time Wage Types", description: "The output: wage types like M200 (overtime) and M110 (night bonus) that payroll later converts into money.", tCode: null, tips: "If the expected wage type isn't generated here, payroll can never pay it — the gap is in time, not payroll." },
    { flowchartId: flowchart6_12.id, nodeId: "node7", title: "Error Log", description: "Lists employees whose time could not be evaluated (missing pairings, invalid schedules). These must be cleared before payroll runs.", tCode: "PT60", tips: "Treat the PT60 error log as a payroll blocker — every unresolved error is potential wrong pay." },
    { flowchartId: flowchart6_12.id, nodeId: "node8", title: "Payroll Values the Hours", description: "Payroll picks up the generated time wage types and assigns monetary values, turning evaluated hours into payslip amounts.", tCode: "PC00_M99_CALC", tips: "Always run/clear time evaluation before payroll — payroll only sees what PT60 produced." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson6_12.id },
  update: {},
  create: {
    lessonId: lesson6_12.id,
    title: "Time Evaluation — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does the time evaluation program PT60 produce as its output for payroll?",
          explanation: "PT60 reads raw time data (clockings, absences, attendances), applies the time schema, and generates time wage types (e.g. M200 overtime, M110 night bonus) that payroll then values. It does not create payslips or G/L postings directly.",
          options: {
            create: [
              { text: "Time wage types (e.g. overtime, night bonus) for payroll to value", isCorrect: true },
              { text: "Finished payslips ready to email to employees", isCorrect: false },
              { text: "FI posting documents", isCorrect: false },
              { text: "The payroll control record", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the difference between positive and negative time management?",
          explanation: "Positive time records every attendance and clocking (factory/shift workers), so all clock events matter. Negative time records only deviations (absences) — the system assumes the employee worked the planned schedule unless an absence is posted, typical for office staff.",
          options: {
            create: [
              { text: "Positive records every clocking/attendance; negative records only deviations (absences), assuming planned work otherwise", isCorrect: true },
              { text: "Positive is for salaried staff; negative is for contractors only", isCorrect: false },
              { text: "Positive runs PT60; negative skips time evaluation entirely", isCorrect: false },
              { text: "Positive uses IT2001 only; negative uses IT2002 only", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A factory worker's three night-shift overtime sessions don't appear on his payslip. What is the correct diagnostic path?",
          explanation: "Run PT60 for that employee and period and read the result/error log. If the time schema didn't generate the overtime wage type (e.g. M200) — often because of an unmatched clock-in/out in IT2011 — the gap is in time evaluation, not payroll. Fix the input, re-run PT60, and the wage type flows to payroll.",
          options: {
            create: [
              { text: "Run PT60 for that employee/period and check the error log and whether the schema generated the overtime wage type", isCorrect: true },
              { text: "Re-run payroll several times until the overtime appears", isCorrect: false },
              { text: "Manually add the rupee amount to his payslip", isCorrect: false },
              { text: "Check the FI posting run for a missing G/L account", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.13: Features in HCM (FEAT)
const lesson6_13 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "features-in-hcm" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "Features in HCM (FEAT)",
    slug: "features-in-hcm",
    order: 13,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A company opens a new branch in Pune, and within a week the payroll team notices something alarming: every employee hired into the new personnel area is landing in the wrong payroll area, so their payroll won't even run. The HR admins swear they're entering everything correctly. Anjali, the HCM consultant, doesn't blame the data-entry team — she opens PE03 and looks at the feature **ABKRS**.

Sure enough, the decision tree has branches for the old locations but nothing for Pune, so it falls through to a default that's wrong. One missing branch in a feature was quietly mis-defaulting hundreds of employees. Features are the invisible automation of HCM — small decision trees that fill in the right values so humans don't have to, and when they're incomplete, the errors are silent and systemic.`,
    content: `## What a Feature Actually Is

A **feature** in SAP HCM is a small **decision tree** that automatically returns a default value based on an employee's data. When you hire someone, dozens of fields need sensible defaults — which payroll area, which number range, which administrator. Rather than rely on humans to remember every rule, SAP evaluates features that read the employee's attributes and return the correct value automatically.

## PE03 — Maintaining Features

\`PE03\` is the transaction to view and edit features. Inside, a feature looks like a branching tree: it tests conditions — **company code**, **personnel area**, **employee group/subgroup** — and based on the path, returns a value. It's essentially a configurable IF/THEN structure, maintained by consultants rather than developers.

## How a Feature Decides

\`\`\`
Evaluate conditions (company code, personnel area, EE group...)
        → follow the matching branch
                → return the default value
\`\`\`

The danger Anjali found: if no branch matches the employee's data (new Pune personnel area), the tree falls to whatever default exists — often a wrong or blank value.

## The Critical Features Every Consultant Must Know

| Feature | Defaults |
|---------|----------|
| **ABKRS** | The **payroll area** for a new employee (by company code / personnel area) |
| **TARIF** | The **pay scale area & type** (for collective/union agreements) |
| **PINCH** | The **administrator group** (who maintains which employee) |
| **NUMKR** | The **number range** for personnel numbers |
| **LGMST** | The **wage type model** for the Basic Pay infotype |

**ABKRS** is the most consequential: it decides the payroll area, and a wrong payroll area means payroll literally cannot run for that employee. **TARIF** matters wherever pay scales/unions apply. **NUMKR** silently controls what personnel number a new hire gets. **LGMST** pre-fills the default wage types on Basic Pay so HR doesn't enter them by hand.

## Why Features Exist — Eliminating Human Error

The whole point of features is to **remove manual decisions** from the hiring process. If a clerk had to manually pick the payroll area for every hire, mistakes would be constant. The feature encodes the rule once and applies it consistently. But that strength is also the risk: a wrong feature applies the *same* error to *every* affected employee. Wrong feature = wrong payroll area = payroll doesn't run — at scale.

## The Practical Payoff

When "new employees are going to the wrong payroll area", the experienced consultant doesn't audit individual records — they go straight to \`PE03\` and inspect **ABKRS**. Almost always, the decision tree is missing a branch for a newly created personnel area or company code, so new hires fall through to a wrong default. Add the branch, and every future hire defaults correctly. Features turn the chaos of remembering hundreds of rules into a maintainable tree — and knowing which feature controls which default is core HCM craftsmanship.`,
    keyConceptTitle: "Features (PE03) Are Decision Trees That Auto-Default Values; ABKRS Drives the Payroll Area",
    keyConceptBody: `- A **feature** is a decision tree (maintained in **PE03**) that returns a default value by evaluating conditions like company code, personnel area, and employee group — automating data entry and removing human error.
- Critical features: **ABKRS** (payroll area), **TARIF** (pay scale area/type), **PINCH** (administrator group), **NUMKR** (personnel number range), **LGMST** (wage type model for Basic Pay).
- A wrong or incomplete feature applies the same error to every affected employee — e.g. **wrong payroll area → payroll won't run**.
- Diagnosis: "new hires going to the wrong payroll area" → check **ABKRS** in PE03; the tree is likely missing a branch for a new personnel area/company code, so hires fall to a wrong default.`,
  },
});
const flowchart6_13 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_13.id },
  update: {},
  create: {
    lessonId: lesson6_13.id,
    title: "How the ABKRS Feature Defaults the Payroll Area",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🧑‍💼 New employee hired (PA40)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "🌳 Feature ABKRS evaluated" }, style: { background: "#6D28D9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 305, y: 220 }, data: { label: "❓ Branch for this personnel area?" }, style: { background: "#5B21B6", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 80, y: 330 }, data: { label: "✅ Returns correct payroll area" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 360, y: 330 }, data: { label: "⚠️ Falls to wrong default" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 80, y: 440 }, data: { label: "🏃 Payroll runs normally" }, style: { background: "#0E7490", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 360, y: 440 }, data: { label: "🚫 Payroll won't run for them" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 360, y: 540 }, data: { label: "🛠️ PE03 — add missing branch" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default", label: "match" },
      { id: "e4", source: "node3", target: "node5", type: "default", label: "no match" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
      { id: "e7", source: "node7", target: "node8", type: "default", label: "fix" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_13.id, nodeId: "node1", title: "New Employee Hired", description: "During a hiring action (PA40), SAP needs to default many fields — including the payroll area on the Organizational Assignment infotype.", tCode: "PA40", tips: "Defaults happen automatically during the action — the clerk usually doesn't pick the payroll area by hand." },
    { flowchartId: flowchart6_13.id, nodeId: "node2", title: "ABKRS Evaluated", description: "SAP runs the feature ABKRS to determine the payroll area, passing in the employee's company code, personnel area, and groupings.", tCode: "PE03", tips: "ABKRS is the single most important feature to verify when payroll areas come out wrong." },
    { flowchartId: flowchart6_13.id, nodeId: "node3", title: "Branch Match?", description: "The feature walks its decision tree looking for a branch matching the employee's data (e.g. the new Pune personnel area).", tCode: "PE03", tips: "Newly created personnel areas/company codes are the usual gaps — they were added after the feature was last maintained." },
    { flowchartId: flowchart6_13.id, nodeId: "node4", title: "Correct Default Returned", description: "When a matching branch exists, the feature returns the right payroll area and the employee is assigned correctly.", tCode: null, tips: "A correctly maintained feature makes hiring effortless — the right values appear with no manual choice." },
    { flowchartId: flowchart6_13.id, nodeId: "node5", title: "Wrong Default", description: "With no matching branch, the tree falls through to a generic default — often a wrong or blank payroll area.", tCode: "PE03", tips: "Silent fall-through is the danger: nothing errors at hire time, but payroll breaks later." },
    { flowchartId: flowchart6_13.id, nodeId: "node6", title: "Payroll Runs", description: "With the correct payroll area, the employee is included in the right payroll area's run and paid on schedule.", tCode: "PC00_M99_CALC", tips: "Correct ABKRS is a prerequisite for the employee even being selected by the payroll run." },
    { flowchartId: flowchart6_13.id, nodeId: "node7", title: "Payroll Won't Run", description: "A wrong payroll area means the employee isn't picked up by the intended run — payroll effectively fails for them.", tCode: "PA03", tips: "Mass-misassigned employees from a feature gap is a systemic, not individual, problem." },
    { flowchartId: flowchart6_13.id, nodeId: "node8", title: "Add the Missing Branch", description: "In PE03, add the branch for the new personnel area/company code so ABKRS returns the correct payroll area for future hires.", tCode: "PE03", tips: "After fixing the feature, correct already-hired employees' Organizational Assignment manually — the feature only affects new defaults." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson6_13.id },
  update: {},
  create: {
    lessonId: lesson6_13.id,
    title: "Features in HCM — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction is used to view and maintain HCM features?",
          explanation: "PE03 is the transaction for maintaining features (the decision trees that default values like the payroll area). PA30/PA40 are for employee master data and actions, not feature configuration.",
          options: {
            create: [
              { text: "PE03", isCorrect: true },
              { text: "PA40", isCorrect: false },
              { text: "PA03", isCorrect: false },
              { text: "PE04", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How does a feature decide which value to return?",
          explanation: "A feature is a decision tree: it evaluates conditions such as company code, personnel area, and employee group/subgroup, follows the matching branch, and returns the configured default value. If no branch matches, it falls through to a generic default.",
          options: {
            create: [
              { text: "It evaluates conditions (company code, personnel area, employee group) and returns the value on the matching branch", isCorrect: true },
              { text: "It always returns the same hard-coded value for every employee", isCorrect: false },
              { text: "It asks the HR clerk to type the value during hiring", isCorrect: false },
              { text: "It reads the value directly from the payroll control record", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "After opening a new branch, all employees in the new personnel area land in the wrong payroll area and payroll won't run. What is the most likely cause?",
          explanation: "The feature ABKRS (which defaults the payroll area) almost certainly has no branch for the newly created personnel area, so new hires fall through to a wrong default. Adding the missing branch in PE03 fixes future hires; existing records must be corrected manually.",
          options: {
            create: [
              { text: "The ABKRS feature is missing a branch for the new personnel area, so hires fall to a wrong default payroll area", isCorrect: true },
              { text: "The HR clerks are all entering the payroll area incorrectly by hand", isCorrect: false },
              { text: "The payroll control record is locked for the new branch", isCorrect: false },
              { text: "The NUMKR feature assigned duplicate personnel numbers", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.14: Dynamic Actions
const lesson6_14 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "dynamic-actions" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "Dynamic Actions",
    slug: "dynamic-actions",
    order: 14,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `After a system upgrade, the HR operations lead notices that newly hired employees are missing their work schedule — IT0007 simply isn't there, even though the hiring action completed cleanly. The team has to remember to create it manually for every hire, and they keep forgetting. Karthik, the HRIS consultant, suspects the automation, not the people, and opens PE04.

There it is: the dynamic action that used to auto-create IT0007 when the Actions infotype was saved had its condition broken during the upgrade. Dynamic actions are the silent reflexes of SAP HCM — when one infotype is saved, they automatically fire updates to others. When they work, hiring is seamless; when they break, infotypes quietly go missing.`,
    content: `## What Dynamic Actions Do

A **dynamic action** automatically triggers an infotype update *when another infotype is saved*. They are the system's reflexes: save the Actions infotype with a "Hire", and dynamic actions automatically create the Organizational Assignment and Work Schedule infotypes — no manual step required. This keeps master data complete and consistent without relying on human memory.

## PE04 and Table T588Z

Dynamic actions are maintained in \`PE04\` and stored in the table **\`T588Z\`**. Each line in the table defines a rule: *when this infotype is saved, under these conditions, perform this action on that infotype.*

## The Structure of a Rule

A dynamic action rule combines four parts:

\`\`\`
Infotype + Operation + Condition  →  Action (on another infotype)
\`\`\`

The **operation** says *which kind of save* triggers the rule:

| Operation | Triggers on |
|-----------|-------------|
| **I** | Insert (creating a record) |
| **U** | Update (changing a record) |
| **D** | Delete (removing a record) |

The **condition** narrows it further (e.g. only when action type = "Hire"), and the **action** is what to do — create, copy, or update a target infotype.

## Real-World Use Cases

| When this happens | Dynamic action does this |
|-------------------|--------------------------|
| \`IT0000\` (Actions) saved as "Hire" | Auto-create \`IT0001\` (Org Assignment), \`IT0007\` (Work Schedule) |
| \`IT0019\` (Monitoring of Task) saved | Create a follow-up task / reminder |
| \`IT0001\` org assignment changes (new personnel area) | Update \`IT0007\` work schedule to match |

These chains are why a single hiring action produces a complete employee record — each saved infotype quietly triggers the next.

## Dynamic Actions vs Personnel Actions

This is a classic exam and interview distinction, and it's about *who triggers the sequence*:

| | Personnel Action (PA40) | Dynamic Action |
|---|---|---|
| Triggered by | **User** — runs a defined sequence of screens | **System** — fires automatically on save |
| Visible? | Yes — the user steps through infotypes | No — happens behind the scenes |
| Configured in | Action menu / infogroups | PE04 (T588Z) |

A **personnel action** is a user-driven workflow (the clerk walks through hiring screens). A **dynamic action** is a system-driven reflex that fires automatically when an infotype is saved. They often work together: the personnel action presents screens, and dynamic actions fill in dependent infotypes automatically.

## The Practical Payoff

When "some infotypes aren't created automatically on hire", the diagnosis points straight at dynamic actions. Open \`PE04\`, find the rule for the \`IT0000\` "Hire" action type, and check whether the trigger exists and its condition is correct. Karthik's broken condition meant IT0007 was never created — repair the condition in T588Z, and every future hire gets its work schedule automatically again. Dynamic actions are invisible when healthy and maddening when broken, which is exactly why knowing where they live is essential HCM knowledge.`,
    keyConceptTitle: "Dynamic Actions (PE04 / T588Z) Auto-Trigger Infotype Updates on Save — Unlike User-Driven PA40",
    keyConceptBody: `- A **dynamic action** automatically triggers an infotype update when another infotype is saved (e.g. saving \`IT0000\` as "Hire" auto-creates \`IT0001\` and \`IT0007\`). Maintained in **PE04**, stored in table **\`T588Z\`**.
- Rule structure: **Infotype + Operation + Condition → Action**, where the operation is **I** (insert), **U** (update), or **D** (delete), and the condition narrows when it fires.
- Key difference from **Personnel Actions (PA40)**: PA40 is a **user-triggered** sequence of screens; dynamic actions are **system-triggered**, firing automatically and invisibly on save.
- Diagnosis: "some infotypes not created automatically on hire" → check PE04 for the IT0000 action-type rule; the trigger is likely missing or its condition is wrong.`,
  },
});
const flowchart6_14 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_14.id },
  update: {},
  create: {
    lessonId: lesson6_14.id,
    title: "How a Dynamic Action Fires on Infotype Save",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "💾 IT0000 saved as 'Hire'" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "🔍 T588Z checked (PE04)" }, style: { background: "#6D28D9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 305, y: 220 }, data: { label: "❓ Operation + condition match?" }, style: { background: "#5B21B6", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 90, y: 330 }, data: { label: "🏗️ Auto-create IT0001 (Org Assign)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 90, y: 430 }, data: { label: "🗓️ Auto-create IT0007 (Work Sched.)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 380, y: 330 }, data: { label: "⚠️ No match → nothing fires" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 380, y: 430 }, data: { label: "🚫 Infotype silently missing" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 90, y: 530 }, data: { label: "✅ Complete employee record" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default", label: "match" },
      { id: "e4", source: "node4", target: "node5", type: "default", label: "then" },
      { id: "e5", source: "node3", target: "node6", type: "default", label: "no match" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
      { id: "e7", source: "node5", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_14.id, nodeId: "node1", title: "IT0000 Saved as Hire", description: "An HR user saves the Actions infotype with action type 'Hire'. This save is the trigger event for dynamic actions.", tCode: "PA40", tips: "The save is what fires the reflex — dynamic actions never run on their own, only in response to an infotype save." },
    { flowchartId: flowchart6_14.id, nodeId: "node2", title: "T588Z Checked", description: "SAP consults table T588Z (maintained in PE04) to find any dynamic action rules registered for the saved infotype.", tCode: "PE04", tips: "If a rule isn't in T588Z, nothing happens — absence of a rule is the most common 'missing infotype' cause." },
    { flowchartId: flowchart6_14.id, nodeId: "node3", title: "Operation + Condition Match?", description: "The rule checks the operation (I/U/D) and any condition (e.g. action type = Hire). Only matching rules fire.", tCode: "PE04", tips: "A wrong condition (broken during an upgrade) silently stops the rule from matching — check it carefully." },
    { flowchartId: flowchart6_14.id, nodeId: "node4", title: "Auto-Create IT0001", description: "The matching rule automatically creates the Organizational Assignment infotype, linking the employee to their org unit, position, and payroll area.", tCode: null, tips: "Chained dynamic actions create several infotypes from one hire — IT0001 is usually first." },
    { flowchartId: flowchart6_14.id, nodeId: "node5", title: "Auto-Create IT0007", description: "A further rule creates the Work Schedule infotype, giving the new hire their planned working times automatically.", tCode: null, tips: "IT0007 is the one most often reported missing when a dynamic action breaks." },
    { flowchartId: flowchart6_14.id, nodeId: "node6", title: "No Match — Nothing Fires", description: "If no rule matches (missing rule or wrong condition), no automatic update occurs and no error is raised.", tCode: "PE04", tips: "Silence is the symptom — no error, just an absent infotype discovered later." },
    { flowchartId: flowchart6_14.id, nodeId: "node7", title: "Infotype Silently Missing", description: "The dependent infotype simply isn't created. HR must create it manually and often forgets, causing downstream payroll/time issues.", tCode: "PA30", tips: "If staff are 'remembering' to create an infotype manually, suspect a broken dynamic action immediately." },
    { flowchartId: flowchart6_14.id, nodeId: "node8", title: "Complete Employee Record", description: "When all rules fire correctly, a single hiring action yields a fully populated employee record with no manual follow-up.", tCode: null, tips: "Healthy dynamic actions are invisible — the proof is that no one has to remember the dependent infotypes." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson6_14.id },
  update: {},
  create: {
    lessonId: lesson6_14.id,
    title: "Dynamic Actions — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In which transaction (and table) are dynamic actions maintained?",
          explanation: "Dynamic actions are maintained in PE04 and stored in table T588Z. PE03 is for features; PA40 runs personnel actions. The T588Z table holds the rule definitions (infotype, operation, condition, action).",
          options: {
            create: [
              { text: "PE04 (table T588Z)", isCorrect: true },
              { text: "PE03 (table T588Z)", isCorrect: false },
              { text: "PA40 (table T588Z)", isCorrect: false },
              { text: "PA03 (table T549Q)", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the key difference between a Personnel Action (PA40) and a Dynamic Action?",
          explanation: "A Personnel Action is user-triggered: the clerk runs a defined sequence of infotype screens. A Dynamic Action is system-triggered: it fires automatically and invisibly when an infotype is saved. They often work together during a hire.",
          options: {
            create: [
              { text: "Personnel Actions are user-triggered sequences of screens; Dynamic Actions fire automatically by the system on infotype save", isCorrect: true },
              { text: "Personnel Actions fire automatically; Dynamic Actions require manual screens", isCorrect: false },
              { text: "They are two names for exactly the same thing", isCorrect: false },
              { text: "Dynamic Actions only work in payroll, Personnel Actions only in time", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "After an upgrade, newly hired employees are missing IT0007 (Work Schedule), with no error during hiring. What is the most likely cause and fix?",
          explanation: "A dynamic action that auto-creates IT0007 when IT0000 is saved as 'Hire' likely had its condition broken during the upgrade, so it no longer matches and fires nothing — silently. Open PE04, find the IT0000 'Hire' rule in T588Z, and repair the condition so future hires get IT0007 automatically.",
          options: {
            create: [
              { text: "A dynamic action for the IT0000 'Hire' rule has a broken/missing condition in T588Z; fix it in PE04", isCorrect: true },
              { text: "The payroll control record is locked, blocking IT0007 creation", isCorrect: false },
              { text: "The ABKRS feature is returning the wrong payroll area", isCorrect: false },
              { text: "Time evaluation (PT60) failed and deleted IT0007", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.15: HCM Authorizations
const lesson6_15 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "hcm-authorizations" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "HCM Authorizations",
    slug: "hcm-authorizations",
    order: 15,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `An internal audit finds a serious problem: a department manager can open PA20 and view the salary of *every* employee in the company, not just his own team. Payroll data for thousands of people is exposed to someone who should see fifteen. The Basis team insists his PFCG role is correct — and it is. Meera, the HCM authorizations specialist, knows immediately that the missing piece isn't the general role; it's the **structural** layer.

HCM is unusual: it has *two* authorization layers that must both be right. General authorizations decide *what* you can do; structural authorizations decide *whose* data you can do it to. The manager had the transactions but no structural profile limiting him to his team — so he could see everyone. Understanding both layers is what keeps sensitive HR data locked down.`,
    content: `## Why HCM Needs Two Layers

Most SAP modules need only one authorization question: *what can this user do?* HCM needs two, because HR data is personal: *what can they do* **and** *whose data can they do it to?* A payroll clerk may legitimately run \`PA30\`, but only for employees in their own area. That second dimension is what makes HCM authorizations special — and a frequent source of data-exposure incidents.

## Layer 1 — General Authorizations (PFCG)

**General authorizations** are standard SAP role-based access, built in \`PFCG\`. They control:

- which **transactions** a user can run (\`PA20\`, \`PA30\`, \`PT60\`, etc.), and
- which **infotypes** they may view, edit, or delete.

The key authorization object here is **\`P_ORGIN\`**, which governs infotype access in HCM. It checks a combination of: authorization group, **infotype**, **subtype**, **personnel area**, **employee group**, and the **access level** (R = read, W = write, D = delete). This is how you say "this user may *read* infotype 0008 (Basic Pay) for personnel area 1000".

## Layer 2 — Structural Authorizations

**Structural authorizations** are HCM-specific and answer *which employees* a user can see, based on the **org structure**. A manager should see their own team — not the whole company. A structural profile defines how far the user can see: up, down, and across the org hierarchy from a given root (e.g. their own position).

| T-code | Purpose |
|--------|---------|
| \`OOSP\` | Maintain structural profiles (the scope of the hierarchy) |
| \`OOSB\` | Assign structural profiles to users |

Meera's manager was missing exactly this: no structural profile (or one set to full org access), so the general role's transactions applied to *everyone*.

## How the Two Layers Combine

General and structural authorizations work **together** — both must permit an action:

\`\`\`
Can the user run the transaction & access the infotype?  (P_ORGIN / PFCG)
        AND
Is the employee within the user's structural scope?       (OOSP / OOSB)
        → only then is access granted
\`\`\`

**Context-dependent authorizations** (using object \`P_ORGINCON\`) fuse the two even more tightly: a user may access an infotype *only for employees within their org unit* — combining the "what" and the "whose" into a single check.

## Checking What a User Can Actually Access

The report **\`RPUACG00\`** runs an HR authorization check, showing which infotypes a given user can access. It's the practical tool for proving — to an auditor or to yourself — exactly what someone is permitted to see, instead of guessing from role names.

## The Practical Payoff

When "a manager can see all employees, not just his team", the answer is almost never the PFCG role — it's the structural layer. Either no structural profile is assigned in \`OOSB\`, or the assigned profile (\`OOSP\`) grants full org access. Assign a properly scoped profile rooted at the manager's position, and his view collapses to his real team. In HCM, locking down sensitive data means getting *both* layers right — general for the "what", structural for the "whose".`,
    keyConceptTitle: "HCM Has Two Layers: General (PFCG / P_ORGIN) for 'What', Structural (OOSP/OOSB) for 'Whose'",
    keyConceptBody: `- HCM authorization has **two layers** that must both pass. **General authorizations (PFCG)** control which transactions and infotypes a user can use; the key object **\`P_ORGIN\`** checks authorization group, infotype, subtype, personnel area, employee group, and access level (R/W/D).
- **Structural authorizations** control *which employees* a user can see based on the org structure — maintained in **\`OOSP\`** (profiles) and assigned in **\`OOSB\`**.
- **Context-dependent authorizations** (object \`P_ORGINCON\`) combine both: access an infotype only for employees in your org unit. The report **\`RPUACG00\`** shows which infotypes a user can actually access.
- Diagnosis: "manager sees all employees, not just his team" → the **structural profile** is unassigned or set to full org access (check OOSB/OOSP), not the PFCG role.`,
  },
});
const flowchart6_15 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_15.id },
  update: {},
  create: {
    lessonId: lesson6_15.id,
    title: "The Two-Layer HCM Authorization Check",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "🧑‍💼 Manager opens PA20" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "1️⃣ General auth (PFCG / P_ORGIN)" }, style: { background: "#6D28D9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 305, y: 220 }, data: { label: "❓ Txn + infotype allowed?" }, style: { background: "#5B21B6", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 305, y: 320 }, data: { label: "2️⃣ Structural auth (OOSP/OOSB)" }, style: { background: "#4C1D95", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 305, y: 420 }, data: { label: "❓ Employee in user's org scope?" }, style: { background: "#5B21B6", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 90, y: 520 }, data: { label: "✅ Sees only his team" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 380, y: 520 }, data: { label: "🚫 No profile → sees everyone" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 380, y: 620 }, data: { label: "🛠️ RPUACG00 + assign profile" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default", label: "yes" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default", label: "scoped profile" },
      { id: "e6", source: "node5", target: "node7", type: "default", label: "no/full profile" },
      { id: "e7", source: "node7", target: "node8", type: "default", label: "fix" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_15.id, nodeId: "node1", title: "Manager Opens PA20", description: "A manager tries to display employee data. SAP must now run both authorization layers before showing anything.", tCode: "PA20", tips: "Display (PA20) still requires full authorization — read access to sensitive infotypes is itself a risk." },
    { flowchartId: flowchart6_15.id, nodeId: "node2", title: "General Authorization", description: "The first check: does the user's PFCG role allow the transaction and the infotype? The P_ORGIN object governs this in HCM.", tCode: "PFCG", tips: "P_ORGIN checks infotype, subtype, personnel area, employee group, and access level (R/W/D) together." },
    { flowchartId: flowchart6_15.id, nodeId: "node3", title: "Transaction + Infotype Allowed?", description: "If the role doesn't permit the transaction or infotype access level, the action is blocked here regardless of structure.", tCode: "SU53", tips: "Use SU53 right after a failed authorization to see exactly which object/value was missing." },
    { flowchartId: flowchart6_15.id, nodeId: "node4", title: "Structural Authorization", description: "The second, HCM-specific check: which employees the user may see, based on the org structure and their assigned structural profile.", tCode: "OOSB", tips: "Structural auth is the layer most often forgotten — it's what scopes a manager to their own team." },
    { flowchartId: flowchart6_15.id, nodeId: "node5", title: "Employee in Org Scope?", description: "The structural profile defines a root (e.g. the manager's position) and how far up/down/across the hierarchy they can see. Only employees inside that scope are visible.", tCode: "OOSP", tips: "Define the profile's evaluation path and depth carefully — too wide exposes data, too narrow blocks legitimate access." },
    { flowchartId: flowchart6_15.id, nodeId: "node6", title: "Sees Only His Team", description: "With a properly scoped structural profile, the manager sees only his own team's data — exactly the least-privilege outcome.", tCode: null, tips: "Both layers passing for the right employees is the goal: correct 'what' AND correct 'whose'." },
    { flowchartId: flowchart6_15.id, nodeId: "node7", title: "No Profile — Sees Everyone", description: "If no structural profile is assigned (or it grants full org access), the general role's permissions apply to all employees — the audit finding.", tCode: "OOSB", tips: "A missing OOSB assignment is the classic cause of 'manager can see the whole company'." },
    { flowchartId: flowchart6_15.id, nodeId: "node8", title: "Check and Fix", description: "Run RPUACG00 to confirm what the user can access, then assign a correctly scoped structural profile in OOSB rooted at the manager's position.", tCode: "RPUACG00", tips: "Prove the fix with RPUACG00 afterward — don't assume; verify the access actually narrowed." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson6_15.id },
  update: {},
  create: {
    lessonId: lesson6_15.id,
    title: "HCM Authorizations — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which authorization object is the key control for infotype access in HCM general authorizations?",
          explanation: "P_ORGIN is the central authorization object for HCM infotype access. It checks authorization group, infotype, subtype, personnel area, employee group, and access level (R/W/D). Structural authorizations (OOSP/OOSB) are a separate layer controlling which employees are visible.",
          options: {
            create: [
              { text: "P_ORGIN", isCorrect: true },
              { text: "S_TCODE only", isCorrect: false },
              { text: "P_ABAP", isCorrect: false },
              { text: "M_MSEG_WMB", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What do structural authorizations control that general (PFCG) authorizations do not?",
          explanation: "General authorizations control WHAT a user can do (transactions and infotypes). Structural authorizations control WHICH employees the user can access, based on the org structure — e.g. limiting a manager to their own team rather than the whole company.",
          options: {
            create: [
              { text: "WHICH employees a user can see, based on the org structure (the 'whose' dimension)", isCorrect: true },
              { text: "Which transaction codes a user can launch", isCorrect: false },
              { text: "The user's password complexity rules", isCorrect: false },
              { text: "How many work processes the user consumes", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "An audit finds a manager can view salaries for ALL employees, not just his team, yet his PFCG role is correct. What is the cause and fix?",
          explanation: "The general (PFCG) role grants the transactions/infotypes, but the structural layer is missing — no structural profile is assigned in OOSB (or the assigned profile gives full org access). Assign a correctly scoped structural profile (OOSP) rooted at the manager's position via OOSB, and verify with RPUACG00.",
          options: {
            create: [
              { text: "The structural profile is unassigned or set to full org access; assign a scoped profile in OOSB and verify with RPUACG00", isCorrect: true },
              { text: "His PFCG role must be deleted and rebuilt from scratch", isCorrect: false },
              { text: "The payroll control record is unlocked, exposing data", isCorrect: false },
              { text: "The ABKRS feature is returning the wrong payroll area", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.16: Payroll Posting to FI
const lesson6_16 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "payroll-posting-to-fi" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "Payroll Posting to FI",
    slug: "payroll-posting-to-fi",
    order: 16,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `Payroll for 4,000 employees ran cleanly on the 28th — green status, no errors, everyone's net pay calculated. But on the 1st the finance controller calls Suresh, the HCM consultant, in a panic: "The salary expense isn't in the books. The P&L shows nothing for payroll this month." Payroll succeeded, yet FI is empty.

Suresh knows this is one of the most misunderstood seams in SAP: running payroll and *posting* payroll are two different steps. The calculation produces results inside HCM; a separate **posting run** transfers them into Financial Accounting. He checks \`PC00_M99_CIPE\`, finds the posting was never executed, runs it, and the salary expense appears in FI. Payroll posting is where HCM meets FICO — and where the two teams must speak the same language.`,
    content: `## Two Steps, Not One

A common misconception is that running payroll updates the books. It doesn't. There are two distinct steps:

\`\`\`
1. Payroll Run     (PC00_M99_CALC)  → calculates results inside HCM
2. Posting Run     (PC00_M99_CIPE)  → transfers results into FI as documents
\`\`\`

Payroll can be perfectly successful and yet *nothing* appears in Financial Accounting, because the posting run is separate. This is exactly what happened to Suresh's controller.

## PC00_M99_CIPE — The Posting Program

\`PC00_M99_CIPE\` is the payroll posting program. It reads the finalized payroll results and creates an FI **posting document** containing all the salary components — expenses and liabilities — for the period. This is the bridge that turns payroll numbers into accounting entries.

## The Mapping Chain — Wage Type to G/L

The heart of payroll posting is how each pay component finds its accounting home:

\`\`\`
Wage Type  →  Symbolic Account  →  G/L Account
\`\`\`

| Step | Example |
|------|---------|
| Each **wage type** is assigned a **symbolic account** | Basic salary → \`BASIC_SAL\` |
| The **symbolic account** maps to a **G/L account** (per chart of accounts) | \`BASIC_SAL\` → G/L 400100 |

This mapping lives in configuration (table **\`T52EK\`** for the symbolic-account-to-G/L assignment). It's the precise point where **HCM meets FI** — and it must be configured *jointly* by the HCM and FICO teams. If a wage type has no symbolic account, or a symbolic account has no G/L mapping, posting fails for that component.

## What the Posting Document Looks Like

A typical payroll posting is a balanced document:

- **Debit**: salary expense (a P&L account).
- **Credit**: PF (provident fund) liability, TDS payable, and net pay payable (balance-sheet accounts).

The debits (expense) equal the credits (what the company now owes employees and authorities), keeping the document balanced.

## Bank Transfer Is Separate

Posting to FI records the *liability* (net pay payable). Actually paying employees is a **separate process**: the net pay goes into a bank file for NEFT/RTGS transfer to employee accounts. Don't confuse "posted to FI" with "money paid" — they're distinct steps.

## Posting Periods and Reversals

Two operational realities:

- **Posting periods** — the payroll posting date must fall within an **open FI period**. If finance has closed the period, the posting fails until they open it. Coordinate timing with FICO.
- **Reversal** — if payroll is reversed (via \`PA03\`), the **FI posting must also be reversed**. The two systems must stay in sync; reversing one without the other leaves the books wrong.

## The Practical Payoff

"Payroll ran but salaries aren't in FI" has two usual causes, both found at \`PC00_M99_CIPE\`: either the **posting run was never executed** (Suresh's case — just run it), or a **symbolic-account-to-G/L mapping is missing** so a component couldn't post. Knowing that payroll and posting are separate steps — and that the wage-type → symbolic-account → G/L chain is the bridge — is what lets an HCM consultant resolve a finance-team emergency in minutes instead of hours.`,
    keyConceptTitle: "Payroll Run and Posting Run Are Separate; PC00_M99_CIPE Maps Wage Type → Symbolic Account → G/L",
    keyConceptBody: `- Running payroll (\`PC00_M99_CALC\`) and **posting** it to FI (\`PC00_M99_CIPE\`) are **two separate steps** — payroll can succeed with nothing yet in Financial Accounting.
- The posting program maps **Wage Type → Symbolic Account → G/L Account** (symbolic-to-G/L lives in table **\`T52EK\`**); this is configured **jointly by HCM and FICO**. A missing mapping blocks that component from posting.
- The posting document is balanced: **debit** salary expense (P&L), **credit** PF/TDS/net pay payable (balance sheet). The actual **bank transfer** (NEFT/RTGS) is a separate process from the FI posting.
- Posting must fall in an **open FI period**; if payroll is reversed (PA03), the **FI posting must be reversed too**. Diagnosis: "payroll ran but not in FI" → check PC00_M99_CIPE (posting not run, or symbolic→G/L mapping missing).`,
  },
});
const flowchart6_16 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_16.id },
  update: {},
  create: {
    lessonId: lesson6_16.id,
    title: "From Payroll Results to FI Posting Document",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 20 }, data: { label: "⚙️ Payroll Run (PC00_M99_CALC)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 305, y: 120 }, data: { label: "📤 Posting Run (PC00_M99_CIPE)" }, style: { background: "#6D28D9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 305, y: 220 }, data: { label: "🏷️ Wage type → symbolic account" }, style: { background: "#5B21B6", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 305, y: 320 }, data: { label: "📒 Symbolic → G/L (T52EK)" }, style: { background: "#4C1D95", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 90, y: 430 }, data: { label: "📄 FI document: Dr expense / Cr liabilities" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 230, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 420, y: 430 }, data: { label: "⚠️ Mapping missing → posting fails" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 90, y: 540 }, data: { label: "🏦 Bank file (NEFT/RTGS) — separate" }, style: { background: "#0E7490", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 220, fontSize: "12px", textAlign: "center" } },
      { id: "node8", type: "default", position: { x: 90, y: 640 }, data: { label: "📅 Must be in open FI period" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default", label: "separate step" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default", label: "mapping ok" },
      { id: "e5", source: "node4", target: "node6", type: "default", label: "no mapping" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
      { id: "e7", source: "node5", target: "node8", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_16.id, nodeId: "node1", title: "Payroll Run", description: "Calculates all payroll results (gross, deductions, net) inside HCM. This step does NOT touch Financial Accounting.", tCode: "PC00_M99_CALC", tips: "A green payroll run means the numbers are correct — not that they're in the books yet." },
    { flowchartId: flowchart6_16.id, nodeId: "node2", title: "Posting Run", description: "The separate step that reads finalized payroll results and prepares an FI posting document. This is what actually moves payroll into accounting.", tCode: "PC00_M99_CIPE", tips: "If FI is empty after payroll, this is the first place to look — it's often simply never been run." },
    { flowchartId: flowchart6_16.id, nodeId: "node3", title: "Wage Type → Symbolic Account", description: "Each wage type (basic salary, HRA, PF, TDS) is assigned a symbolic account — an abstraction layer between payroll and the chart of accounts.", tCode: null, tips: "A wage type with no symbolic account can't post — a common gap when new wage types are added." },
    { flowchartId: flowchart6_16.id, nodeId: "node4", title: "Symbolic → G/L (T52EK)", description: "The symbolic account maps to a real G/L account per chart of accounts, configured in table T52EK jointly by HCM and FICO.", tCode: "SM30", tips: "T52EK is the precise HCM-FI handshake point — both teams must agree on every mapping." },
    { flowchartId: flowchart6_16.id, nodeId: "node5", title: "FI Posting Document", description: "A balanced document: debit salary expense (P&L), credit PF/TDS/net pay payable (balance sheet). Now payroll is in the books.", tCode: "FB03", tips: "View the resulting document in FB03 to confirm expense and liabilities posted correctly." },
    { flowchartId: flowchart6_16.id, nodeId: "node6", title: "Mapping Missing — Fails", description: "If a symbolic account has no G/L mapping (or a wage type no symbolic account), posting fails for that component until the configuration is fixed.", tCode: "T52EK", tips: "The posting log names the missing mapping — fix it in T52EK and re-run the posting." },
    { flowchartId: flowchart6_16.id, nodeId: "node7", title: "Bank Transfer (Separate)", description: "Paying employees is a different process: net pay goes into a bank file for NEFT/RTGS. Posting to FI only records the liability, not the payment.", tCode: null, tips: "'Posted to FI' is not 'money paid' — the bank transfer is a distinct, later step." },
    { flowchartId: flowchart6_16.id, nodeId: "node8", title: "Open FI Period Required", description: "The posting date must fall in an open FI posting period. If finance has closed the period, posting fails until they reopen it.", tCode: "OB52", tips: "Coordinate posting timing with FICO around month-end close to avoid 'period closed' failures." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson6_16.id },
  update: {},
  create: {
    lessonId: lesson6_16.id,
    title: "Payroll Posting to FI — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which program performs the payroll posting that creates FI documents?",
          explanation: "PC00_M99_CIPE is the payroll posting program — it reads finalized payroll results and creates the FI posting document. PC00_M99_CALC is the payroll calculation run, which does not touch FI.",
          options: {
            create: [
              { text: "PC00_M99_CIPE", isCorrect: true },
              { text: "PC00_M99_CALC", isCorrect: false },
              { text: "PT60", isCorrect: false },
              { text: "PA03", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the mapping chain that routes a payroll wage type to the correct G/L account?",
          explanation: "Each wage type is assigned a symbolic account, and the symbolic account maps to a G/L account (per chart of accounts, in table T52EK). This chain — Wage Type → Symbolic Account → G/L Account — is configured jointly by HCM and FICO and is where HCM meets FI.",
          options: {
            create: [
              { text: "Wage Type → Symbolic Account → G/L Account", isCorrect: true },
              { text: "Wage Type → Cost Center → Vendor", isCorrect: false },
              { text: "Infotype → Payroll Area → G/L Account", isCorrect: false },
              { text: "G/L Account → Symbolic Account → Wage Type", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Payroll ran successfully for 4,000 employees, but the salary expense doesn't appear in FI. What are the two most likely causes?",
          explanation: "Both are found at PC00_M99_CIPE: either the posting run was simply never executed (running payroll does not post to FI — they are separate steps), or a symbolic-account-to-G/L mapping is missing so a component couldn't post. A clean payroll run does not guarantee anything is in the books.",
          options: {
            create: [
              { text: "The posting run (PC00_M99_CIPE) was never executed, or a symbolic-account-to-G/L mapping is missing", isCorrect: true },
              { text: "The payroll calculation failed and produced no results", isCorrect: false },
              { text: "The employees were assigned the wrong structural authorization profile", isCorrect: false },
              { text: "Time evaluation (PT60) did not generate any wage types", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 9A COMPLETE: BASIS + HCM Deep Dive — 187 total lessons ───────────


