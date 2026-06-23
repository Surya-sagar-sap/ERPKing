// ─── FILE: prisma/seed-session19b-hana-hsr-scaleout.ts ───
// Session 19b — Closes the final two HANA gaps:
//   Lesson 16: HANA System Replication (HSR) — High Availability & Disaster Recovery
//   Lesson 17: HANA Scale-Out — Multi-Host Architecture
// Idempotent: re-running upserts by slug.
//
// Run with:  npx tsx prisma/seed-session19b-hana-hsr-scaleout.ts

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
  console.log("Session 19b — HANA HSR & Scale-Out (lessons 16–17)…");

  const hana = await prisma.module.findUnique({ where: { slug: "hana" } });
  if (!hana) throw new Error("HANA module not found — run seed-session18 first.");

  // ════════════════════════════════════════════════
  // LESSON 16 — HANA System Replication (HSR)
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-system-replication",
    title: "HANA System Replication (HSR)",
    order: 16,
    minutes: 13,
    difficulty: "ADVANCED",
    xp: 110,
    importance: "HIGH",
    story: `It's a Friday afternoon when the primary HANA server loses a disk array. Without a plan, this is a catastrophe — hours or days of downtime for the entire ERP. But this company has HANA System Replication enabled. The standby takes over in under two minutes. Users barely notice. The admin on call just runs one command. That's what HSR is built for.`,
    content: `## The problem HSR solves

Backups protect against data loss but they can't restore quickly — a full HANA restore from backup can take hours. If the primary HANA system fails, you need a **live standby** that is already warm and up-to-date, ready to take over fast.

**HANA System Replication (HSR)** keeps a second HANA system **continuously synchronized** with the primary. If the primary fails, the secondary takes over — this is called **failover** or **takeover**.

## How HSR works

1. A **secondary HANA system** is set up with the same hardware profile as the primary
2. The primary **ships its redo log** to the secondary continuously (in real time)
3. The secondary **replays** those log entries to stay in sync
4. If the primary fails, an admin (or automation) triggers a **takeover** — the secondary promotes itself to primary
5. Once the original primary is repaired, it re-joins as the new secondary

The secondary is **not available for read/write during normal operation** — it's dedicated to staying in sync.

## Replication modes

HSR has three modes that trade **performance vs data safety**:

| Mode | How it works | Risk | Use for |
|---|---|---|---|
| **Synchronous (SYNC)** | Primary waits for secondary to confirm before committing | Zero data loss | Production HA (same data center) |
| **Synchronous in-memory (SYNCMEM)** | Secondary confirms once data is in memory (not persisted yet) | Tiny risk | High throughput, same DC |
| **Asynchronous (ASYNC)** | Primary doesn't wait — sends log in background | Some data loss possible | Disaster Recovery (cross-site) |

**Rule of thumb**: use **SYNC** for High Availability (HA) within a data center. Use **ASYNC** for Disaster Recovery (DR) to a remote site where network latency would make SYNC too slow.

## HA vs DR — two different goals

- **High Availability (HA)** — survive hardware failures within one site. Failover in minutes. Same city, low latency. Use SYNC mode.
- **Disaster Recovery (DR)** — survive a complete site going down (fire, flood, power outage). Failover may take longer. Cross-region. Use ASYNC mode.

Some companies chain both: **Primary → HA secondary (SYNC, same DC) → DR secondary (ASYNC, remote site)**. This is called a **multi-tier HSR** setup.

## Takeover — what actually happens

\`\`\`bash
# Triggered by admin on the secondary system
hdbnsutil -sr_takeover
\`\`\`

After takeover:
- Secondary becomes the new primary
- SAP systems reconnect (via SAP Host Agent automation or manual connection string update)
- The old primary, once repaired, is re-registered as secondary

## HSR and Pacemaker

In production, HSR is almost always paired with **Linux Pacemaker + STONITH** (a cluster manager) for **automatic failover** — no admin needs to run the command manually. SAP provides certified cluster configurations for SUSE and Red Hat Linux.

## What HSR does NOT replace

- **Backups** — HSR replicates corruption too. If data is accidentally deleted or corrupted, the secondary has the same problem. Backups are your only protection against logical corruption.
- **Read scaling** — the secondary is not available for queries during replication (unlike some databases). HSR is purely for HA/DR.`,
    keyTitle: "HSR = Live Standby for Fast Failover — SYNC for HA, ASYNC for DR",
    keyBody: `**HANA System Replication (HSR)** keeps a secondary HANA system continuously synchronized by shipping the **redo log** in real time. Three modes: **SYNC** (zero data loss, waits for secondary confirm — for HA same-site), **SYNCMEM** (confirms on memory receipt), **ASYNC** (no wait — for DR cross-site). **Takeover** promotes the secondary to primary with \`hdbnsutil -sr_takeover\`. In production, pair with **Pacemaker** for automatic failover. HSR does NOT replace backups — it replicates corruption too.`,
    flowchart: {
      title: "HANA System Replication: Normal & Failover",
      nodes: [
        node("app", 360, 20, "🏢 SAP Application\n(S/4HANA etc.)", PALETTE[5], true),
        node("primary", 360, 140, "🟢 Primary HANA\n(active, taking writes)", PALETTE[0], true),
        node("log", 360, 270, "📜 Redo Log\nstreamed continuously", PALETTE[3]),
        node("secondary", 360, 390, "🔵 Secondary HANA\n(warm standby)", PALETTE[1], true),
        node("fail", 100, 270, "💥 Primary\nfails", PALETTE[6], true),
        node("takeover", 620, 270, "⚡ Takeover\nhdbnsutil -sr_takeover", PALETTE[2], true),
        node("newprimary", 620, 390, "🟢 Secondary\nbecomes Primary", PALETTE[4], true),
      ],
      edges: [
        edge("app", "primary"),
        edge("primary", "log"),
        edge("log", "secondary"),
        edge("primary", "fail"),
        edge("fail", "takeover"),
        edge("takeover", "newprimary"),
      ],
      details: [
        { nodeId: "app", title: "SAP application", description: "S/4HANA and other SAP systems connect to the primary HANA system for all transactions and queries.", tips: "After takeover, the application reconnects to the new primary — either via automation (Pacemaker + virtual IP) or manual reconfiguration." },
        { nodeId: "primary", title: "Primary HANA", description: "The active HANA system that processes all transactions. Continuously ships its redo log to the secondary.", tCode: "hdbnsutil -sr_state (check HSR status)", tips: "Monitor HSR lag with: SELECT * FROM M_SERVICE_REPLICATION." },
        { nodeId: "log", title: "Redo log streaming", description: "The primary sends its redo log entries to the secondary in real time. In SYNC mode, it waits for acknowledgement before confirming the commit to the application.", tips: "Network latency between primary and secondary directly impacts SYNC mode performance — keep them in the same data center for HA." },
        { nodeId: "secondary", title: "Secondary HANA", description: "Replays incoming redo log entries to stay in sync with the primary. Remains in a warm, ready-to-take-over state. Not accessible for queries during normal replication.", tCode: "hdbnsutil -sr_register (register as secondary)", tips: "The secondary needs the same amount of RAM as the primary — it must hold the same in-memory dataset." },
        { nodeId: "fail", title: "Primary failure", description: "Hardware failure, network loss, or OS crash on the primary triggers the need for takeover. Pacemaker detects this automatically in automated setups.", tips: "Test failover regularly in non-production environments — untested failover is not HA." },
        { nodeId: "takeover", title: "Takeover command", description: "hdbnsutil -sr_takeover is run on the secondary (manually or by Pacemaker) to promote it to primary. The old primary is disconnected.", tCode: "hdbnsutil -sr_takeover", tips: "In async mode, there may be a small amount of data loss (the log entries not yet received). In sync mode, there is zero data loss." },
        { nodeId: "newprimary", title: "New primary is live", description: "The former secondary is now primary. Once the old primary is repaired, it is re-registered as secondary and replication resumes.", tCode: "hdbnsutil -sr_register (old primary re-joins)", tips: "After re-registration, the new secondary must synchronize (initial data shipping) before full HA is restored." },
      ],
    },
    questions: [
      { q: "What is the purpose of HANA System Replication (HSR)?", e: "HSR keeps a live secondary HANA system continuously synchronized with the primary by streaming the redo log. If the primary fails, the secondary can take over quickly — providing High Availability and/or Disaster Recovery.", opts: [["Keeping a live standby in sync for fast failover", true], ["Running reports on a second copy of data", false], ["Replacing the need for backups", false], ["Splitting transactions across two systems", false]] },
      { q: "Which HSR replication mode guarantees zero data loss?", e: "SYNC mode waits for the secondary to confirm it has received and persisted the redo log before the primary confirms the commit. This guarantees zero data loss but adds network round-trip latency to each commit.", opts: [["SYNC — primary waits for secondary confirmation before committing", true], ["ASYNC — primary doesn't wait", false], ["SYNCMEM — fastest but with tiny risk", false], ["MIRROR — not an HSR mode", false]] },
      { q: "Why does HSR not replace the need for database backups?", e: "HSR replicates every change — including accidental deletions or corruption. If data is corrupted on the primary, the same corruption is replicated to the secondary immediately. Only a backup (taken before the corruption) can restore the original data.", opts: [["HSR also replicates corruption — only a backup taken before the event can recover", true], ["HSR stores backups automatically", false], ["Backups are faster than HSR", false], ["HSR and backups serve the same purpose", false]] },
    ],
  });

  // ════════════════════════════════════════════════
  // LESSON 17 — HANA Scale-Out
  // ════════════════════════════════════════════════
  await makeLesson({
    moduleId: hana.id,
    slug: "hana-scale-out",
    title: "HANA Scale-Out: Multi-Host Architecture",
    order: 17,
    minutes: 11,
    difficulty: "ADVANCED",
    xp: 105,
    importance: "HIGH",
    story: `A global retailer's HANA system needs to hold 20TB of active data in memory. No single server has that much RAM. The architect's solution: instead of one enormous server (scale-up), spread the data across 8 servers that work together as one logical HANA system. Users and applications see a single database. Under the hood, it's a coordinated cluster. That's HANA scale-out.`,
    content: `## Two ways to grow HANA

When your data outgrows one server, you have two options:

| Approach | What it means | Limit |
|---|---|---|
| **Scale-Up** | Buy a bigger server with more RAM | Hardware limits (~24TB RAM on largest HANA-certified servers) |
| **Scale-Out** | Add more hosts; data spans all of them | Theoretically unlimited — add hosts as needed |

Scale-out is how enterprises run HANA systems with tens of terabytes — too large for any single machine.

## The scale-out architecture

A HANA scale-out system has one **logical database** split across multiple **physical hosts**:

### Master host
- Runs the **Name Server** for the whole cluster
- Coordinates query routing
- Handles DDL (CREATE TABLE, etc.)
- Usually also runs an Index Server (worker role)

### Worker hosts
- Each runs its own **Index Server**
- Hold a **partition of the data** in their local RAM
- Execute the portion of a query relevant to their data
- Report to the master

### Standby host (optional but recommended)
- Idle host ready to replace a failed worker
- When a worker fails, the standby takes over its data partitions automatically
- No data is lost because HANA persists all data to shared or local storage

## How queries work across hosts

When you run a query, HANA's **Parallel Execution Engine** splits it:

1. Master receives the SQL
2. It routes each part to the worker(s) holding the relevant data partitions
3. Workers execute in **parallel** — each scanning only their partition
4. Master **aggregates** the partial results
5. Final result returned to the application

This is why scale-out can actually be **faster than scale-up** for large analytical queries — more CPU cores working in parallel.

## Data distribution

Tables are distributed across workers using **table placement** rules or **hash partitioning**:

- **Partition distribution**: one partition per worker (set during table partitioning)
- **Table placement**: certain tables assigned to certain hosts
- Tables that are small or frequently joined together can be **replicated** to all hosts to avoid cross-host join overhead

## Shared storage vs local storage

- **Shared storage (NFS/SAN)**: all hosts access the same physical disk — simpler failover, standby can mount failed host's volumes immediately
- **Local storage**: each host has its own disk — faster I/O, but failover needs data to be re-loaded from the standby's own copy (requires log shipping or snapshots)

Most enterprise HANA scale-out uses shared storage for simpler HA.

## Scale-out and HSR

Scale-out and HSR can be combined: replicate an entire multi-host scale-out cluster to a secondary cluster. This is a complex but enterprise-grade HA/DR setup used by large SAP BW/4HANA and S/4HANA deployments.

## When scale-out is needed

- Active dataset exceeds single-host RAM (~6–24TB depending on server)
- Need more CPU parallelism for very large analytical queries
- BW/4HANA and large S/4HANA implementations often require scale-out`,
    keyTitle: "Scale-Out = One Logical HANA, Many Physical Hosts",
    keyBody: `**HANA Scale-Out** spreads one logical database across multiple hosts. The **master host** coordinates the cluster and routes queries; **worker hosts** each hold a data partition and execute queries in parallel; an optional **standby host** replaces a failed worker automatically. Queries are split by the **Parallel Execution Engine**, run in parallel on each worker, and aggregated by the master. Use scale-out when data exceeds single-host RAM limits. Combine with **HSR** for full HA/DR on large systems.`,
    flowchart: {
      title: "HANA Scale-Out: Master + Workers",
      nodes: [
        node("app", 380, 20, "🏢 Application\n(sees one HANA DB)", PALETTE[5], true),
        node("master", 380, 140, "👑 Master Host\nName Server\n+ Coordinator", PALETTE[0], true),
        node("w1", 80, 300, "⚙️ Worker 1\nPartition A\n(RAM: 6TB)", PALETTE[1]),
        node("w2", 280, 300, "⚙️ Worker 2\nPartition B\n(RAM: 6TB)", PALETTE[1]),
        node("w3", 480, 300, "⚙️ Worker 3\nPartition C\n(RAM: 6TB)", PALETTE[1]),
        node("standby", 680, 300, "🛡️ Standby Host\n(replaces any\nfailed worker)", PALETTE[4], true),
        node("storage", 380, 440, "💾 Shared Storage\n(NFS/SAN — all hosts)", PALETTE[3]),
      ],
      edges: [
        edge("app", "master"),
        edge("master", "w1"),
        edge("master", "w2"),
        edge("master", "w3"),
        edge("master", "standby"),
        edge("w1", "storage"),
        edge("w2", "storage"),
        edge("w3", "storage"),
        edge("standby", "storage"),
      ],
      details: [
        { nodeId: "app", title: "Single logical database", description: "Applications and SAP systems connect to HANA exactly as they would a single-host system — the scale-out architecture is completely transparent to SQL clients.", tips: "The application connects to the master host's port; routing to workers is internal." },
        { nodeId: "master", title: "Master host", description: "Runs the Name Server for the whole cluster, coordinates query routing, and handles DDL operations. Also typically runs an Index Server and holds some data.", tCode: "hdbnsutil -sr_state / landscape.ini", tips: "The master is a single point of failure unless you configure a master standby (master nameserver failover)." },
        { nodeId: "w1", title: "Worker host 1", description: "Holds a partition of the data in local RAM, runs queries on its partition, and returns partial results to the master for aggregation.", tips: "Add more workers to increase total memory capacity and query parallelism." },
        { nodeId: "w2", title: "Worker host 2", description: "Another independent worker holding a different data partition. Workers execute their portion of every query simultaneously.", tips: "Workers communicate with each other for cross-partition joins." },
        { nodeId: "w3", title: "Worker host 3", description: "A third worker. Each additional worker adds its RAM to the total memory pool and adds CPU parallelism.", tips: "A 4-worker cluster can run 4 analytical scan operations simultaneously — linear scaling." },
        { nodeId: "standby", title: "Standby host", description: "An idle host that monitors the workers. If a worker fails, the standby automatically takes over its partitions — HANA reloads the data from shared storage into the standby's RAM.", tCode: "Automatic — managed by HANA cluster", tips: "Always size the standby to have at least as much RAM as the largest worker it may need to replace." },
        { nodeId: "storage", title: "Shared storage", description: "NFS or SAN storage accessible by all hosts. Stores persistence (data volumes and log volumes). Shared storage allows the standby to mount a failed host's volumes instantly.", tips: "Storage I/O is critical in scale-out — use high-throughput SAN or fast NFS with low latency." },
      ],
    },
    questions: [
      { q: "What is the role of the master host in a HANA scale-out system?", e: "The master host runs the Name Server for the whole cluster, coordinates query routing to workers, and handles DDL operations. Workers run Index Servers and hold data partitions.", opts: [["Coordinates the cluster, routes queries, and runs the Name Server", true], ["Holds all the data exclusively", false], ["Acts as the only backup host", false], ["Runs only the Statistics Server", false]] },
      { q: "How does a HANA scale-out system process a large analytical query faster than a single host?", e: "The Parallel Execution Engine splits the query, sending each part to the worker holding the relevant data partition. All workers execute their portion simultaneously — more CPU cores in parallel means faster overall execution.", opts: [["Workers execute query parts simultaneously in parallel across their partitions", true], ["The master runs the query faster because it is a special server", false], ["Scale-out caches all query results permanently", false], ["Workers share one CPU and take turns", false]] },
      { q: "What happens when a worker host fails in a HANA scale-out system with a standby?", e: "The standby host automatically takes over the failed worker's data partitions. With shared storage, the standby mounts the failed host's volumes and reloads the data into its own RAM.", opts: [["The standby automatically takes over the failed worker's partitions", true], ["The entire scale-out system stops until the worker is repaired", false], ["The master permanently absorbs the failed worker's data", false], ["Other workers are shut down gracefully", false]] },
    ],
  });

  // Update module description to reflect full 17-lesson curriculum
  await prisma.module.update({
    where: { slug: "hana" },
    data: {
      description:
        "The complete SAP HANA curriculum — 17 lessons covering architecture, data modeling, SQLScript, security, monitoring, backup, data provisioning, advanced analytics, High Availability (HSR), and scale-out. Everything from fundamentals to enterprise-grade operations.",
    },
  });

  console.log("\n✅ Session 19b complete — SAP HANA now has 17 lessons. No gaps.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
