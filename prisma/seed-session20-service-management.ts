// ─── FILE: prisma/seed-session20-service-management.ts ───
// Session 20 — SAP Service Management (Customer Service / CS) module.
// Brand-new module with 17 lessons. Idempotent: re-running upserts by slug.
//
// Run with:  npx tsx prisma/seed-session20-service-management.ts

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
      create: { lessonId: lesson.id, title: o.flowchart.title, nodes: o.flowchart.nodes, edges: o.flowchart.edges },
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
  console.log("Session 20 — SAP Service Management module seeding…");

  // Create the module
  const sm = await prisma.module.upsert({
    where: { slug: "service-management" },
    update: {},
    create: {
      title: "SAP Service Management",
      slug: "service-management",
      description:
        "Complete SAP Customer Service (CS) module — from equipment master and service notifications to contracts, SLAs, repair orders, field service, and the modern S/4HANA Service evolution.",
      color: "#0284C7", // sky-600
      icon: "🔧",
      order: 14, // after the existing 13 modules
      isPublished: true,
    },
  });

  // ============================================================
  // LESSON 1 — What is SAP Service Management?
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "what-is-sap-service-management",
    title: "What is SAP Service Management?",
    order: 1,
    minutes: 12,
    difficulty: "BEGINNER",
    xp: 75,
    importance: "HIGH",
    story:
      "Priya manages operations at TurboMakine, a company that sells industrial CNC machines to factories across the country. Last month a customer's machine broke down mid-production and nobody at TurboMakine could tell who installed it, whether it was still under warranty, or which technician to send. The sales team only tracks the original sale, not what happens afterward. Priya realizes the company needs a system that manages everything that happens *after* the sale — and discovers that is exactly what the SAP Customer Service module exists to do.",
    content: `## What SAP Service Management actually is

SAP Service Management — known inside SAP as the **Customer Service (CS)** module — is the part of SAP that manages **everything that happens after you sell a product**: installing it, servicing it, repairing it, and supporting the customer over the product's whole life.

If the Sales module (SD) is about *winning the deal and shipping the product*, CS is about *keeping that product running for years afterward*. A company that sells coffee machines, elevators, medical scanners, or factory robots doesn't stop earning money at the sale — it earns ongoing revenue from service contracts, repairs, and spare parts. CS is the engine for that after-sales business.

### A simple analogy

Think of buying a car. **SD** is the dealership selling you the car. **CS** is the service centre that does your oil changes, honours the warranty, orders spare parts, and sends a mechanic when something breaks. Same company, completely different process — and the service side often makes more profit than the original sale.

### How CS differs from its neighbours

| Module | What it handles | Whose equipment |
|--------|-----------------|-----------------|
| **SD** (Sales & Distribution) | The original sale and delivery | Product being sold |
| **CS** (Customer Service) | Post-sales service & repair | The **customer's** equipment |
| **PM** (Plant Maintenance) | Internal maintenance | The **company's own** assets |

The single most important distinction to memorise: **CS is for equipment the customer owns; PM is for equipment your own company owns.** A machine you sold to a customer → CS. The conveyor belt in your own factory → PM. (The next lesson covers this in depth — it is the most-confused topic in the whole area.)

### The four core CS scenarios

Almost every CS process is one of these four:

1. **Simple service sale** — a one-off service or call-out, billed directly (e.g. a single repair visit).
2. **Service contract** — a long-term agreement to service the customer's equipment for a fixed fee (think "service subscription").
3. **In-house repair** — the customer ships broken equipment back to your workshop; you fix it and ship it back.
4. **Field service** — your technician travels to the customer's site to do the work on location.

### Where CS sits in the SAP landscape

CS never works alone. It connects to:

- **SD** — service contracts *are* sales documents, and service work is billed through SD invoices.
- **MM** (Materials Management) — spare parts come from MM inventory.
- **FI/CO** (Finance/Controlling) — costs and revenue from service flow into Finance.
- **QM** (Quality Management) — quality inspection after a repair.

\`\`\`
IE01  Create equipment master (the customer's machine)
IW51  Create a service notification (customer complaint)
IW31  Create a service order (the actual work)
\`\`\`

### Why it matters for your career

After-sales service is one of the fastest-growing, highest-margin areas in manufacturing, and CS consultants are in steady demand because the module touches SD, MM, FI and QM all at once. Understanding CS makes you the person who can explain the *whole* customer lifecycle, not just the sale — and that breadth is exactly what employers pay a premium for.`,
    keyTitle: "**Customer Service (CS):** the after-sales engine of SAP",
    keyBody:
      "**SAP Customer Service (CS)** manages everything that happens **after** a product is sold — installation, service, repair, and ongoing support of equipment the **customer owns**. It is distinct from **SD** (which handles the original sale) and from **PM** (which maintains the company's *own* internal assets). CS organises work around four scenarios: the **simple service sale**, the **service contract**, the **in-house repair**, and **field service**. Because service work must be billed, costed, and stocked with parts, CS is deeply integrated with **SD, MM, FI/CO, and QM** — making it one of the most cross-functional modules in SAP.",
    flowchart: {
      title: "SAP CS in the Business Landscape",
      nodes: [
        node("customer", 40, 200, "Customer (owns the equipment)", PALETTE[5], true),
        node("cs", 300, 200, "SAP CS (Customer Service)", PALETTE[0], true),
        node("s1", 580, 20, "Simple Service Sale", PALETTE[1]),
        node("s2", 580, 130, "Service Contract", PALETTE[1]),
        node("s3", 580, 240, "In-House Repair", PALETTE[1]),
        node("s4", 580, 350, "Field Service", PALETTE[1]),
        node("integ", 300, 400, "Integrates: SD · MM · FI · QM", PALETTE[4]),
      ],
      edges: [
        edge("customer", "cs"),
        edge("cs", "s1"),
        edge("cs", "s2"),
        edge("cs", "s3"),
        edge("cs", "s4"),
        edge("cs", "integ"),
      ],
      details: [
        { nodeId: "customer", title: "The Customer", description: "The owner of the equipment that needs service. In CS, the equipment belongs to the customer, not to your company — this is the defining trait of the whole module.", tips: "If your own company owns the asset, you are in PM territory, not CS." },
        { nodeId: "cs", title: "SAP Customer Service (CS)", description: "The central module that manages all post-sales service activity: notifications, service orders, contracts, warranties and billing.", tips: "CS is sometimes labelled 'Service Management' in newer SAP menus." },
        { nodeId: "s1", title: "Simple Service Sale", description: "A one-off, directly-billed service such as a single repair call or inspection visit.", tips: "Good starting scenario for learners — fewest moving parts." },
        { nodeId: "s2", title: "Service Contract", description: "A long-term agreement to service the customer's equipment for a recurring fee — the highest-margin CS scenario.", tCode: "VA41", tips: "Contracts are SD sales documents under the hood." },
        { nodeId: "s3", title: "In-House Repair", description: "Customer returns broken equipment; the company repairs it in a workshop and ships it back, then bills.", tCode: "IW81", tips: "Combines a repair sales order with a service order." },
        { nodeId: "s4", title: "Field Service", description: "A technician travels to the customer site to perform the service on location.", tips: "Modernised by SAP Field Service Management (FSM)." },
        { nodeId: "integ", title: "Integration points", description: "CS pushes contracts and billing to SD, draws parts from MM, settles costs and revenue to FI/CO, and triggers QM inspections after repairs.", tips: "Knowing these four links is a classic interview question." },
      ],
    },
    questions: [
      {
        q: "What does the SAP Customer Service (CS) module primarily manage?",
        e: "CS manages the after-sales lifecycle — installing, servicing, repairing and supporting equipment the customer owns. The original sale itself is handled by SD, not CS.",
        opts: [
          ["Everything that happens after a product is sold: service, repair and support of customer-owned equipment", true],
          ["The original quotation and sales order that wins the deal", false],
          ["Maintenance of the company's own internal production machines", false],
          ["The financial closing and balance sheet at month-end", false],
        ],
      },
      {
        q: "Which statement best distinguishes CS from PM (Plant Maintenance)?",
        e: "The defining line is ownership: CS services equipment owned by the customer, while PM maintains the company's own internal assets. Both use notifications and orders, but the business context differs entirely.",
        opts: [
          ["CS handles equipment the customer owns; PM maintains the company's own assets", true],
          ["CS is only used in retail; PM is only used in banking", false],
          ["CS handles finance postings; PM handles HR records", false],
          ["CS is a cloud product; PM only exists on paper", false],
        ],
      },
      {
        q: "Which of the following is one of the four core CS scenarios?",
        e: "The four core CS scenarios are the simple service sale, the service contract, the in-house repair, and field service. A purchase order for raw materials is an MM/procurement activity, not a CS scenario.",
        opts: [
          ["Service contract", true],
          ["Raw-material purchase order", false],
          ["Payroll run", false],
          ["General-ledger reconciliation", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 2 — CS vs Plant Maintenance (PM)
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "cs-vs-plant-maintenance",
    title: "CS vs Plant Maintenance (PM)",
    order: 2,
    minutes: 11,
    difficulty: "BEGINNER",
    xp: 75,
    importance: "HIGH",
    story:
      "Arjun just joined a manufacturing firm as a junior SAP consultant. In his first week he sees two almost-identical processes: a technician fixing the factory's own packaging robot, and a technician fixing a printing press the company sold to a customer last year. Both start with a 'notification' and lead to an 'order', and the screens look nearly the same. Arjun keeps mixing them up until a senior consultant gives him one question to ask every time — 'Who owns the equipment?' — and suddenly the whole thing clicks.",
    content: `## The most-confused topic in service

CS and PM look like twins. Both use **notifications**, both use **orders**, and many of the screens are nearly identical. But they answer two completely different business questions, and confusing them is the classic beginner mistake.

The one question that separates them: **Who owns the equipment being worked on?**

- The **customer** owns it → **CS** (Customer Service)
- Your **own company** owns it → **PM** (Plant Maintenance)

### CS vs PM side by side

| Aspect | CS (Customer Service) | PM (Plant Maintenance) |
|--------|----------------------|------------------------|
| **Who owns the equipment** | The customer | The company itself |
| **Who pays** | The customer pays you (revenue) | The company pays itself (internal cost) |
| **What triggers it** | A customer calls with a problem | An internal breakdown or planned schedule |
| **Typical example** | A customer's purchased machine breaks | The factory's own conveyor needs servicing |
| **Org structure** | Sales & Distribution org (sales org, distribution channel) | Plant / maintenance org (planning plant, work centre) |
| **End goal** | Bill the customer / honour a contract | Keep internal operations running |

### Why the confusion is natural

Both modules sit on the same underlying technical objects: the **equipment master**, the **functional location**, the **notification**, and the **order**. SAP deliberately reused the same building blocks. The *plumbing* is shared; the *purpose* is opposite.

A useful mental picture: imagine an appliance company.

- The repair team that goes to **customers' homes** to fix the fridges those customers bought → **CS** (the customer owns the fridge, the customer pays).
- The maintenance team that services the **assembly line inside the factory** that builds the fridges → **PM** (the company owns the line, the company pays).

### Organisational assignment

This is where the two truly diverge under the hood:

- **CS** is anchored in the **Sales & Distribution organisation** — a sales area, because service must be sold and billed to an external customer.
- **PM** is anchored in the **Plant / maintenance organisation** — planning plants and maintenance work centres, because the work is internal.

\`\`\`
CS path:  IW51  →  IW31   (service notification → service order, billed to customer)
PM path:  IW21  →  IW31   (maintenance notification → maintenance order, internal cost)
\`\`\`

### Why SAP kept them separate, and when both are used

A company often runs **both**. The same firm that maintains its own factory (PM) also services the machines it sells to customers (CS). SAP kept them separate so that revenue-generating customer work and internal cost-only maintenance don't get tangled in reporting, billing, and org structure. A field with the right answer in CS (bill the customer) would be wrong in PM (charge a cost centre).

### Why it matters for your career

Interviewers love this question because it instantly reveals whether you understand *business context* or just memorised screens. Being able to say "Who owns the equipment?" and then explain the org-structure and billing consequences marks you as someone who thinks about the process, not just the transaction code — and that is the difference between a junior and a senior consultant.`,
    keyTitle: "**CS vs PM:** it all comes down to who owns the equipment",
    keyBody:
      "**CS and PM share the same technical objects** — equipment, functional locations, notifications, and orders — but answer opposite questions. **CS services equipment the customer owns and bills the customer for revenue**, anchored in the **Sales & Distribution organisation**. **PM maintains the company's own internal assets as a cost**, anchored in the **plant/maintenance organisation**. The one decisive test is **\"Who owns the equipment?\"** — customer means CS, your own company means PM. Many firms run both side by side, and SAP keeps them separate so revenue-generating customer service never gets confused with cost-only internal maintenance in reporting and billing.",
    flowchart: {
      title: "Decision Tree: CS or PM?",
      nodes: [
        node("q", 320, 20, "Who owns the equipment?", PALETTE[3], true),
        node("cust", 80, 150, "The CUSTOMER", PALETTE[0], true),
        node("comp", 560, 150, "The COMPANY itself", PALETTE[2], true),
        node("csn", 80, 270, "CS Notification (IW51)", PALETTE[0]),
        node("pmn", 560, 270, "PM Notification (IW21)", PALETTE[2]),
        node("cso", 80, 390, "Service Order → bill customer", PALETTE[0]),
        node("pmo", 560, 390, "Maintenance Order → cost centre", PALETTE[2]),
      ],
      edges: [
        edge("q", "cust"),
        edge("q", "comp"),
        edge("cust", "csn"),
        edge("comp", "pmn"),
        edge("csn", "cso"),
        edge("pmn", "pmo"),
      ],
      details: [
        { nodeId: "q", title: "The decisive question", description: "Before choosing a process, always ask who owns the asset being worked on. Ownership decides everything that follows — org structure, billing, and reporting.", tips: "Memorise this single question; it answers the whole CS-vs-PM debate." },
        { nodeId: "cust", title: "Customer-owned", description: "If the customer owns the equipment, you are providing a paid service. This is the CS path.", tips: "Customer ownership = revenue opportunity." },
        { nodeId: "comp", title: "Company-owned", description: "If your own company owns the asset, the work is internal maintenance with no external invoice. This is the PM path.", tips: "Company ownership = internal cost only." },
        { nodeId: "csn", title: "CS Notification", description: "A service notification records the customer's complaint or request and lives in the Sales & Distribution org.", tCode: "IW51", tips: "Notification types here start with S (S1/S2/S3)." },
        { nodeId: "pmn", title: "PM Notification", description: "A maintenance notification records an internal malfunction or planned activity in the plant org.", tCode: "IW21", tips: "PM notification types start with M (M1/M2/M3)." },
        { nodeId: "cso", title: "CS Service Order", description: "Executes and costs the customer work, then settles to a sales document so the customer can be billed.", tCode: "IW31", tips: "Ends in a customer invoice via SD." },
        { nodeId: "pmo", title: "PM Maintenance Order", description: "Executes and costs internal work, then settles to a cost centre — no customer invoice.", tCode: "IW31", tips: "Same transaction, but settles internally, not to a customer." },
      ],
    },
    questions: [
      {
        q: "The single best test to decide between CS and PM is to ask:",
        e: "Ownership of the equipment is the decisive test. Customer-owned equipment means CS (paid service); company-owned equipment means PM (internal maintenance). Everything else — billing, org structure — follows from that.",
        opts: [
          ["\"Who owns the equipment being worked on?\"", true],
          ["\"Which technician is available today?\"", false],
          ["\"What colour is the machine?\"", false],
          ["\"Is it a Monday or a Friday?\"", false],
        ],
      },
      {
        q: "In which organisational structure is CS anchored?",
        e: "CS is anchored in the Sales & Distribution organisation (a sales area) because service must be sold and billed to an external customer. PM, by contrast, is anchored in the plant/maintenance organisation for internal work.",
        opts: [
          ["The Sales & Distribution organisation", true],
          ["The plant/maintenance organisation only", false],
          ["The HR personnel structure", false],
          ["The treasury and cash-management structure", false],
        ],
      },
      {
        q: "A factory services its own internal conveyor belt. Which module applies?",
        e: "The conveyor belt is owned by the company itself, so this is internal maintenance — PM. If the equipment were owned by an external customer, it would be CS.",
        opts: [
          ["PM (Plant Maintenance)", true],
          ["CS (Customer Service)", false],
          ["SD (Sales & Distribution)", false],
          ["FI (Financial Accounting)", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 3 — Equipment Master
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "equipment-master",
    title: "Equipment Master",
    order: 3,
    minutes: 13,
    difficulty: "BEGINNER",
    xp: 80,
    importance: "HIGH",
    story:
      "Lena works in the service desk at a medical-device company. A hospital calls about a specific ultrasound scanner that keeps overheating. The hospital bought twelve identical scanners, so 'the ultrasound scanner model X' tells Lena nothing — she needs to know *which one*. When she opens the equipment master record and types the serial number, the system shows that exact unit: who installed it, when, its warranty status, and every service it has ever had. In seconds she knows this individual machine is still under warranty.",
    content: `## What the Equipment Master really is

The **Equipment Master** is the central technical object in CS. It represents **one specific, individual physical asset** — a single machine with its own serial number, history, and identity.

This is the crucial distinction beginners miss: an **equipment is not a material**. A *material* is a **type** of product ("Ultrasound Scanner Model X"). An *equipment* is **one individual instance** of that product — serial number A-4471, installed at City Hospital, Room 3, on 12 March.

### The equation to memorise

> **Material + Serial Number = Equipment**

The material tells you *what kind* of thing it is. The serial number makes it *unique*. Together they become a tracked, individual equipment record with its own life story.

### A simple analogy

A material is like a **car model** — "Toyota Corolla 2024". An equipment is like **your actual car**, with its unique VIN, its service history, and its own dents. The dealership sells a *model*; you own a specific *vehicle*. CS tracks the specific vehicle.

### Key fields on an equipment record

| Field | What it captures |
|-------|------------------|
| **Equipment number** | The unique SAP ID for this individual asset |
| **Description** | Plain-language name |
| **Manufacturer / model** | Who built it and which model |
| **Serial number** | The real-world unique identifier |
| **Installation date** | When it went live at the customer |
| **Customer warranty end date** | When the warranty *you* gave the customer expires |
| **Vendor warranty end date** | When the warranty the *manufacturer/supplier* gave you expires |
| **Equipment category** | Classifies the type of equipment and which fields/behaviour apply |

The two warranty dates matter enormously: one decides whether you charge the customer, the other decides whether you can claim money back from your supplier (covered fully in the Warranty lesson).

### Equipment category — why it matters

The **equipment category** controls how the equipment behaves — what number range it uses, which extra screens appear, and whether it can have a serial number or be installed at a functional location. Choosing the right category at creation time is what makes the record behave correctly for the rest of its life.

### Transaction codes

\`\`\`
IE01   Create equipment
IE02   Change equipment
IE03   Display equipment
IH10   Display equipment list (find/browse equipment)
\`\`\`

### Linking equipment to the customer

Equipment is tied to the customer through **partner data** on the record — the sold-to party, the ship-to, and often the operator/owner. This is what lets a service agent pull up "all the equipment this customer owns" — the foundation of installed-base management (next lessons).

### The equipment lifecycle

A piece of equipment lives a long life inside SAP:

1. **Delivered & installed** at the customer (installation date set).
2. **In service** — accumulating notifications and service orders as its history.
3. **Maintained / repaired** over the years, with warranty checks each time.
4. **Decommissioned** at end of life (status set to inactive).

Because the history stays attached to the individual record, anyone can open one equipment and instantly see everything that ever happened to it.

### Why it matters for your career

The equipment master is the spine of CS — contracts, notifications, orders, warranties, and the installed base all hang off it. Consultants who deeply understand equipment (material vs instance, the warranty dates, the category) can configure clean service processes; those who don't create messy data that haunts the project for years. It is one of the first things an interviewer probes.`,
    keyTitle: "**Equipment Master:** one record for one physical machine",
    keyBody:
      "The **Equipment Master** is the central technical object in CS, representing **one specific physical asset** — not a product type. The key equation is **Material + Serial Number = Equipment**: a material is a *kind* of product, while an equipment is a unique *instance* with its own identity and history. Critical fields include the **serial number**, **installation date**, and two warranty dates — **customer warranty end** (do we charge the customer?) and **vendor warranty end** (can we claim from the supplier?). The **equipment category** controls its behaviour. Managed via **IE01/IE02/IE03** and listed with **IH10**, equipment is linked to its owner through **partner data** and carries its full service history for life.",
    flowchart: {
      title: "Equipment Master Structure",
      nodes: [
        node("mat", 60, 60, "Material (product type)", PALETTE[5]),
        node("ser", 60, 200, "Serial Number (unique)", PALETTE[5]),
        node("eq", 320, 130, "EQUIPMENT MASTER (one machine)", PALETTE[0], true),
        node("fl", 620, 0, "Functional Location (where installed)", PALETTE[1]),
        node("cust", 620, 100, "Customer (who owns it)", PALETTE[4]),
        node("warr", 620, 200, "Warranty Dates", PALETTE[3]),
        node("hist", 620, 300, "Service History (notifications + orders)", PALETTE[2]),
      ],
      edges: [
        edge("mat", "eq"),
        edge("ser", "eq"),
        edge("eq", "fl"),
        edge("eq", "cust"),
        edge("eq", "warr"),
        edge("eq", "hist"),
      ],
      details: [
        { nodeId: "mat", title: "Material", description: "The product type or model — what kind of thing it is. Many equipment records can share the same material.", tips: "Material = the model; equipment = your specific unit." },
        { nodeId: "ser", title: "Serial Number", description: "The real-world unique identifier that, combined with the material, makes the equipment individual and trackable.", tips: "Serial-number profiles in the material master enable serialization." },
        { nodeId: "eq", title: "Equipment Master", description: "The individual asset record. Holds identity, dates, partners, warranties and full history for one physical machine.", tCode: "IE01", tips: "Create with IE01, display with IE03." },
        { nodeId: "fl", title: "Functional Location", description: "The structured place where this equipment is installed (next lesson).", tCode: "IL03", tips: "Equipment can move between functional locations over time." },
        { nodeId: "cust", title: "Customer (partner data)", description: "Partner roles on the equipment record link it to the owner/operator, enabling 'all equipment for this customer' lookups.", tips: "Partner data drives the installed base." },
        { nodeId: "warr", title: "Warranty Dates", description: "Customer-warranty and vendor-warranty end dates that drive automatic warranty checks during service.", tips: "Two dates, two very different financial meanings." },
        { nodeId: "hist", title: "Service History", description: "Every notification and service order ever raised against this equipment, kept attached to the record for its whole life.", tCode: "IH10", tips: "History stays with the equipment even as it changes location." },
      ],
    },
    questions: [
      {
        q: "Which equation best describes how an equipment record is formed?",
        e: "An equipment is a unique instance: a material (the product type) plus a serial number (the unique identifier) becomes one tracked, individual equipment master. A material alone is only a type of product, not an instance.",
        opts: [
          ["Material + Serial Number = Equipment", true],
          ["Customer + Invoice = Equipment", false],
          ["Plant + Cost Centre = Equipment", false],
          ["Notification + Order = Equipment", false],
        ],
      },
      {
        q: "What is the transaction code to create an equipment master?",
        e: "IE01 creates equipment, IE02 changes it, and IE03 displays it. IH10 is used to display or browse a list of equipment, not to create a single record.",
        opts: [
          ["IE01", true],
          ["IE03", false],
          ["IH10", false],
          ["VA41", false],
        ],
      },
      {
        q: "Why are there two warranty end dates on an equipment record?",
        e: "One date is the customer warranty (decides whether you charge the customer for service), and the other is the vendor/manufacturer warranty (decides whether you can claim costs back from your supplier). They serve opposite financial purposes.",
        opts: [
          ["One governs whether the customer is charged; the other governs whether you can claim back from the supplier", true],
          ["One is in days and the other is in months, but they mean the same thing", false],
          ["They are duplicates kept for backup", false],
          ["One is for tax and the other is for shipping", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 4 — Functional Locations
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "functional-locations",
    title: "Functional Locations",
    order: 4,
    minutes: 11,
    difficulty: "BEGINNER",
    xp: 75,
    importance: "MEDIUM",
    story:
      "Sofia coordinates service for a company that maintains diagnostic equipment in hospitals. One hospital has machines spread across three buildings and dozens of rooms. When a scanner is replaced, the old one leaves and a new one arrives — but the *place* stays the same, and so does the question 'how often does equipment in Radiology Room 2 fail?'. Sofia uses functional locations to model the hospital as a structured tree of places, so the service history lives at the location even when the actual machine changes.",
    content: `## What a Functional Location is

A **Functional Location** is a **structured, hierarchical place where equipment is installed**. If the equipment master is the *machine*, the functional location is its *address* — the specific spot within a plant or customer facility where that machine lives and does its job.

The key idea: equipment comes and goes, but **the place stays**. A scanner might be swapped out after five years, but "Radiology, Building B, Room 2" remains — and so does the maintenance history of *that location*.

### A real-world analogy

Think of a **parking spot in a garage**. The spot (functional location) is fixed and numbered. Different cars (equipment) park there over time. If you wanted to know "how often does the car in spot B-12 get dinged?", you'd track the *spot*, not whichever car happens to be there today.

### Hierarchies — the defining feature

Functional locations are arranged in a **tree**, flexible and configured per company. Examples:

| Industry | Level 1 | Level 2 | Level 3 |
|----------|---------|---------|---------|
| Hospital | Building | Floor / Ward | Room |
| Factory | Building | Production line | Machine slot |
| Utility | Region | Substation | Bay |

Equipment is then **installed at** the lowest meaningful level. One functional location can have equipment installed and removed many times over its life.

### Two key configuration concepts

- **Structure indicator** — defines the *format* of the functional location code, e.g. \`AA-BBB-CCC\`, where each segment and its length describe a level of the hierarchy. It enforces a consistent naming pattern so the tree is readable at a glance.
- **Reference functional location** — a **template** used to create many similar locations quickly. If every hospital ward is structured the same way, you build one reference and reuse it, rather than retyping the structure each time.

### Transaction codes

\`\`\`
IL01   Create functional location
IL02   Change functional location
IL03   Display functional location
\`\`\`

### Why functional locations matter

The biggest payoff is **history that stays put**. Because the service record accumulates at the location (as well as on the equipment), you can answer questions the equipment record alone can't:

- "Which *locations* in this site cause the most service calls?" (maybe the room is too hot, not the machine.)
- "What is the maintenance cost of this production line over five years, regardless of how many machines we swapped through it?"

This separation — *machine history* on the equipment, *place history* on the functional location — is what makes long-term analysis possible.

### Why it matters for your career

Functional locations show whether a consultant can model the *real physical world* into SAP cleanly. A well-designed structure indicator and hierarchy make reporting effortless for a decade; a sloppy one makes every analysis painful. Being able to design a sensible location hierarchy — and explain why history lives at the place, not just the machine — signals genuine CS/PM maturity.`,
    keyTitle: "**Functional Location:** the fixed address where equipment lives",
    keyBody:
      "A **Functional Location** is a **structured, hierarchical place** where equipment is installed — the 'address' of a machine within a facility. Its defining feature is the **hierarchy** (e.g. Building → Floor → Room), shaped by a **structure indicator** that fixes the code format such as \`AA-BBB-CCC\`, and a **reference functional location** that acts as a reusable template. The crucial benefit is that **maintenance history accumulates at the location even when the equipment changes** — so you can analyse a *place* (a room, a production line) independently of whichever machine currently sits there. Managed with **IL01/IL02/IL03**, functional locations let you separate place-history from machine-history for powerful long-term reporting.",
    flowchart: {
      title: "Functional Location Hierarchy",
      nodes: [
        node("site", 320, 20, "Customer Site", PALETTE[5], true),
        node("bld", 320, 130, "Building (FL level 1)", PALETTE[1]),
        node("flr", 320, 240, "Floor / Ward (FL level 2)", PALETTE[1]),
        node("room", 320, 350, "Room / Slot (FL level 3)", PALETTE[1]),
        node("eq", 620, 350, "Equipment installed here", PALETTE[0], true),
        node("hist", 60, 240, "History accumulates at each level", PALETTE[4]),
      ],
      edges: [
        edge("site", "bld"),
        edge("bld", "flr"),
        edge("flr", "room"),
        edge("room", "eq"),
        edge("flr", "hist"),
      ],
      details: [
        { nodeId: "site", title: "Customer Site", description: "The top of the location tree — the overall facility, campus or plant belonging to the customer.", tips: "The root level frames everything below it." },
        { nodeId: "bld", title: "Building (Level 1)", description: "First structured level beneath the site. The structure indicator defines this segment's code format and length.", tCode: "IL01", tips: "Levels are configurable per company — there is no fixed number." },
        { nodeId: "flr", title: "Floor / Ward (Level 2)", description: "A mid-level location grouping rooms or slots. History rolls up here for area-level analysis.", tips: "Use reference functional locations to build repeating floors fast." },
        { nodeId: "room", title: "Room / Slot (Level 3)", description: "The lowest meaningful level, where individual equipment is actually installed.", tCode: "IL03", tips: "Install equipment at the level where it physically sits." },
        { nodeId: "eq", title: "Equipment installed here", description: "The physical machine occupying this location. It can be removed and replaced while the location persists.", tips: "Equipment changes; the location's history endures." },
        { nodeId: "hist", title: "Location history", description: "Service and maintenance records accumulate at the location itself, enabling place-based analysis independent of the current machine.", tips: "Lets you find problem rooms, not just problem machines." },
      ],
    },
    questions: [
      {
        q: "What is a functional location best described as?",
        e: "A functional location is the structured, hierarchical place where equipment is installed — essentially the 'address' of equipment within a facility. It is not the machine itself; equipment is installed at a functional location.",
        opts: [
          ["A structured, hierarchical place where equipment is installed", true],
          ["A type of customer invoice", false],
          ["The serial number of a single machine", false],
          ["A financial cost centre in FI", false],
        ],
      },
      {
        q: "Why is it valuable that history accumulates at the functional location?",
        e: "Because the place persists even when equipment is swapped, you can analyse the location over time — finding, for example, a room that causes repeated failures regardless of which machine is installed. History on the equipment alone cannot reveal place-based patterns.",
        opts: [
          ["You can analyse a place over time even as the equipment installed there changes", true],
          ["It deletes the equipment's own history to save space", false],
          ["It automatically pays the customer's invoice", false],
          ["It converts the location into a material master", false],
        ],
      },
      {
        q: "What does the structure indicator define?",
        e: "The structure indicator defines the format of the functional location code (for example AA-BBB-CCC), enforcing a consistent naming pattern that reflects the hierarchy levels. It does not handle pricing or warranties.",
        opts: [
          ["The format of the functional location code and its hierarchy levels", true],
          ["The price the customer pays for service", false],
          ["The warranty end date of the equipment", false],
          ["The technician's working hours", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 5 — Installed Base Management
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "installed-base-management",
    title: "Installed Base Management",
    order: 5,
    minutes: 12,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "HIGH",
    story:
      "Marcus is a field technician dispatched to a large bottling plant. In the old days he'd arrive blind, not knowing what equipment was on site or whether anything was under warranty. Now, before he leaves the depot, he pulls up the customer's installed base on his tablet: eight machines across three lines, two still under warranty, and the last service date on each. He arrives knowing exactly what he'll find — and doesn't accidentally charge the customer for work covered by warranty.",
    content: `## What the Installed Base is

The **Installed Base** (often shortened to **IBase**) is the **complete picture of all the equipment a customer has** — everything they've bought from you and where each item is installed. It is the customer's entire equipment landscape, seen from the **service provider's** point of view.

If a single equipment record is one machine, the installed base is the **whole collection** of that customer's machines, organised so a service team can see it at a glance.

### How it's represented in SAP CS

In classic CS, the installed base is built up from **equipment records linked to customers and functional locations**. Every time you sell a product and create its equipment master, that record becomes part of the customer's installed base. There's no extra magic — the installed base *is* the connected web of equipment + customer + location data.

### A simple analogy

Think of a **family doctor's patient file**. It doesn't just hold one visit — it holds the whole medical history: every condition, treatment, and allergy. The installed base is the customer's "equipment medical file": every machine they own, its warranty status, and its service history, all in one view.

### Why the installed base matters

| Benefit | What it enables |
|---------|-----------------|
| **Technician readiness** | Staff know exactly what the customer has *before* they arrive on site |
| **Contract scope** | Service contracts can reference the installed base to define what's covered |
| **Automatic warranty checks** | Because each equipment carries warranty dates, coverage is checked automatically |
| **Upsell & planning** | You can see ageing equipment and proactively offer replacements or upgrades |

### Classic IBase vs the modern approach

| | Classic CS | S/4HANA Service |
|---|-----------|-----------------|
| **Concept name** | Installed Base (IBase) | **Registered Products** |
| **Feel** | Equipment-centric, SAP GUI | Simplified, Fiori-based |
| **Purpose** | Track customer equipment landscape | Same purpose, modernised data model |

In S/4HANA Service, the customer's equipment landscape is tracked through **Registered Products** — conceptually the same idea as the IBase, rebuilt with a cleaner data model and Fiori apps. (The S/4HANA evolution gets its own lesson later.)

### The practical impact

The whole point is **knowing before doing**. A field technician can look up a customer's equipment, see the last service date, and check warranty status *before touching anything*. That prevents three expensive mistakes: arriving without the right parts, charging for work that's actually under warranty, and missing equipment that should have been serviced. The installed base turns service from reactive guesswork into informed, planned work.

### Why it matters for your career

The installed base is where CS becomes *strategic*: it's the asset that powers contracts, warranty automation, and proactive selling. Consultants who can explain how the installed base is assembled from equipment, customers and functional locations — and how it modernises into Registered Products in S/4HANA — demonstrate that they understand the *value* of CS data, not just the screens.`,
    keyTitle: "**Installed Base:** the customer's complete equipment landscape",
    keyBody:
      "The **Installed Base (IBase)** is the **complete picture of all equipment a customer owns** and where each item is installed — the customer's equipment landscape seen from the service provider's side. In classic CS it is assembled from **equipment records linked to customers and functional locations**; when you sell a product and create its equipment master, it joins that customer's installed base. The installed base powers **technician readiness, contract scope, and automatic warranty checks**, letting a technician verify what a customer has and its warranty status **before** arriving. In **S/4HANA Service**, the same concept is modernised as **Registered Products** with a simplified data model and Fiori apps.",
    flowchart: {
      title: "Installed Base from the Service Provider's View",
      nodes: [
        node("cust", 60, 200, "Customer", PALETTE[5], true),
        node("ibase", 300, 200, "Installed Base (all their equipment)", PALETTE[0], true),
        node("eq", 580, 200, "Individual Equipment records", PALETTE[1], true),
        node("warr", 840, 20, "Warranty info", PALETTE[3]),
        node("hist", 840, 130, "Service history", PALETTE[2]),
        node("fl", 840, 240, "Functional Location", PALETTE[4]),
        node("contr", 840, 350, "Contract coverage", PALETTE[1]),
      ],
      edges: [
        edge("cust", "ibase"),
        edge("ibase", "eq"),
        edge("eq", "warr"),
        edge("eq", "hist"),
        edge("eq", "fl"),
        edge("eq", "contr"),
      ],
      details: [
        { nodeId: "cust", title: "Customer", description: "The owner whose entire equipment landscape the installed base describes.", tips: "One customer can have a large, multi-site installed base." },
        { nodeId: "ibase", title: "Installed Base", description: "The aggregated view of everything the customer owns from you — assembled from linked equipment, customer and location data.", tips: "In S/4HANA this concept becomes Registered Products." },
        { nodeId: "eq", title: "Equipment records", description: "Each machine in the installed base is an individual equipment master with its own identity and data.", tCode: "IE03", tips: "The installed base is only as good as the equipment data behind it." },
        { nodeId: "warr", title: "Warranty info", description: "Each equipment carries warranty dates so coverage can be checked automatically during service.", tips: "Drives the 'do we charge?' decision." },
        { nodeId: "hist", title: "Service history", description: "Past notifications and orders per equipment, visible before a technician is dispatched.", tips: "Last service date prevents redundant or missed visits." },
        { nodeId: "fl", title: "Functional Location", description: "Where each piece of equipment is installed within the customer's site.", tCode: "IL03", tips: "Locates equipment for the visiting technician." },
        { nodeId: "contr", title: "Contract coverage", description: "Service contracts can reference the installed base to define exactly which equipment is covered.", tCode: "VA43", tips: "Links the asset landscape to commercial agreements." },
      ],
    },
    questions: [
      {
        q: "What is the installed base?",
        e: "The installed base is the complete picture of all equipment a customer owns and where it is installed, seen from the service provider's perspective. It is more than one machine — it is the customer's whole equipment landscape.",
        opts: [
          ["The complete set of all equipment a customer owns and where it is installed", true],
          ["A single invoice line for one repair", false],
          ["The company's own internal factory machines", false],
          ["A list of the company's employees", false],
        ],
      },
      {
        q: "In S/4HANA Service, the classic Installed Base concept is modernised as:",
        e: "S/4HANA Service tracks the customer's equipment landscape through Registered Products — the same concept as the classic IBase, rebuilt with a simplified data model and Fiori apps.",
        opts: [
          ["Registered Products", true],
          ["Cost Centres", false],
          ["Purchase Requisitions", false],
          ["General Ledger Accounts", false],
        ],
      },
      {
        q: "How does the installed base help a field technician before a visit?",
        e: "Because each equipment carries warranty dates and service history, the technician can check what the customer owns, the last service date, and warranty status before arriving — avoiding wrong parts, missed equipment, and charging for warranty-covered work.",
        opts: [
          ["It lets them check equipment, last service date and warranty status before arriving", true],
          ["It automatically drives the service van to the site", false],
          ["It replaces the need for any service order", false],
          ["It pays the technician's salary", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 6 — Service Notifications
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "service-notifications",
    title: "Service Notifications",
    order: 6,
    minutes: 12,
    difficulty: "BEGINNER",
    xp: 80,
    importance: "HIGH",
    story:
      "Daniel runs the service hotline at a packaging-machinery firm. A customer calls in a panic: a sealing machine has stopped on the production line. Daniel doesn't start dispatching technicians or ordering parts straight away — first he opens a service notification, records who's calling, which exact machine, when it failed, and how urgent it is. That single intake document becomes the anchor for everything that follows, and ensures nothing about the complaint gets lost.",
    content: `## What a Service Notification is

A **Service Notification** is **how a customer complaint or service request enters SAP**. It's the very first document created when a customer calls — the **intake form** for the service process. Before any work is planned, any technician dispatched, or any part ordered, the notification captures *what the customer reported*.

Think of it like the **triage form at a hospital A&E**: before treatment begins, someone records who you are, what's wrong, and how urgent it is. The notification does exactly that for a service request.

### Notification types in CS

CS uses a small set of standard notification types, each for a different situation:

| Type | Name | Used for |
|------|------|----------|
| **S1** | Service Request | General service request |
| **S2** | Malfunction Report | Something is broken / not working |
| **S3** | Activity Report | Recording planned or completed work |

### Key fields on a notification

- **Reported by** — the customer contact who raised the issue.
- **Equipment number** — *which* specific machine (links to the equipment master and its installed base).
- **Malfunction start date** — when the problem began (important for SLA and downtime tracking).
- **Description** — the problem in plain language.
- **Priority** — how urgent, which often drives the SLA response clock.

### Standalone or a trigger for a service order

A notification can go two ways:

1. **Resolved on its own** — for simple issues handled over the phone or with quick advice, the notification is created and completed without any service order.
2. **Trigger a service order** — for real work (a technician, parts, hours), the notification spawns a **service order** where the work is planned and costed (next lesson).

### The notification workflow

\`\`\`
Customer calls
   → IW51  Create notification
   → Categorise (S1 / S2 / S3)
   → Assign technician + priority
   → Can it be resolved immediately?
        Yes → complete notification
        No  → create Service Order → execute → complete notification
\`\`\`

### Transaction codes

\`\`\`
IW51   Create service notification
IW52   Change service notification
IW53   Display service notification
IW54   Complete service notification
\`\`\`

### Notification items — the three building blocks

Inside a notification you record structured detail:

- **Tasks** — what *needs to be done* (planned actions).
- **Activities** — what *was actually done* (recorded after the fact).
- **Causes** — the *root cause* of the problem, for analysis and prevention.

Capturing causes consistently is what later lets a company answer "why does this model keep failing?" — turning individual complaints into improvement data.

### Why it matters for your career

The notification is the front door of the entire CS process — get it wrong and everything downstream (orders, billing, SLA tracking, root-cause analysis) suffers. Knowing the notification types, the IW51–IW54 transactions, and the tasks/activities/causes structure shows an interviewer you understand how service work actually starts and how clean intake data powers the rest of the chain.`,
    keyTitle: "**Service Notification:** the intake form for every service request",
    keyBody:
      "A **Service Notification** is the **first document created when a customer reports a problem** — the intake form that captures the complaint before any work begins. CS uses three main types: **S1 (Service Request)**, **S2 (Malfunction Report)**, and **S3 (Activity Report)**. Key fields include **reported-by, equipment number, malfunction start date, description, and priority**. A notification can be **resolved on its own** or **trigger a service order** for real work. It is managed with **IW51 (create), IW52 (change), IW53 (display), IW54 (complete)**, and its items break down into **tasks** (what to do), **activities** (what was done), and **causes** (root cause) — the structure that turns complaints into analysable data.",
    flowchart: {
      title: "Service Notification Workflow",
      nodes: [
        node("call", 40, 180, "Customer calls", PALETTE[6], true),
        node("create", 250, 180, "IW51 Create Notification", PALETTE[0], true),
        node("cat", 470, 180, "Categorise S1 / S2 / S3", PALETTE[1]),
        node("assign", 690, 180, "Assign technician + priority", PALETTE[1]),
        node("dec", 690, 40, "Resolve immediately?", PALETTE[3], true),
        node("done", 470, 40, "Complete notification (IW54)", PALETTE[4]),
        node("order", 690, 320, "Create Service Order → execute", PALETTE[2]),
      ],
      edges: [
        edge("call", "create"),
        edge("create", "cat"),
        edge("cat", "assign"),
        edge("assign", "dec"),
        edge("dec", "done"),
        edge("dec", "order"),
        edge("order", "done"),
      ],
      details: [
        { nodeId: "call", title: "Customer calls", description: "The trigger: a customer reports a problem or requests service by phone, email or portal.", tips: "Everything in CS starts from a customer-reported event." },
        { nodeId: "create", title: "Create notification", description: "Capture the request as a notification — the official intake record that anchors all later documents.", tCode: "IW51", tips: "Always create the notification first, before dispatching or ordering parts." },
        { nodeId: "cat", title: "Categorise", description: "Choose the notification type: S1 general request, S2 malfunction, or S3 activity report.", tips: "The right type drives correct downstream behaviour and reporting." },
        { nodeId: "assign", title: "Assign", description: "Set the responsible technician/work centre and the priority that often starts the SLA clock.", tips: "Priority links directly to SLA response times." },
        { nodeId: "dec", title: "Resolve immediately?", description: "Decide whether the issue can be closed now or needs real work via a service order.", tips: "Simple advice → close; real work → service order." },
        { nodeId: "done", title: "Complete notification", description: "Close the notification once the issue is resolved, recording activities and causes.", tCode: "IW54", tips: "Completion timestamps feed SLA and downtime analysis." },
        { nodeId: "order", title: "Create service order", description: "For work needing labour, hours or parts, the notification spawns a service order that plans and costs the job.", tCode: "IW31", tips: "The order is where execution and costing happen." },
      ],
    },
    questions: [
      {
        q: "What role does a service notification play in the CS process?",
        e: "The service notification is the intake document — the first record created when a customer reports a problem, capturing the complaint before any work begins. It is not the billing document or the execution document.",
        opts: [
          ["It is the intake document that captures the customer's complaint first", true],
          ["It is the final invoice sent to the customer", false],
          ["It is the spare-parts purchase order", false],
          ["It is the company's internal balance sheet", false],
        ],
      },
      {
        q: "Which notification type is used specifically for something that is broken?",
        e: "S2 is the Malfunction Report, used when something is broken or not working. S1 is a general Service Request and S3 is an Activity Report for planned or completed work.",
        opts: [
          ["S2 — Malfunction Report", true],
          ["S1 — Service Request", false],
          ["S3 — Activity Report", false],
          ["S9 — Settlement Report", false],
        ],
      },
      {
        q: "Within a notification, what do 'causes' capture?",
        e: "Causes record the root cause of the problem, supporting analysis and prevention. Tasks capture what needs to be done and activities capture what was actually done — causes are specifically about *why* it happened.",
        opts: [
          ["The root cause of the problem, for analysis and prevention", true],
          ["The price the customer will be charged", false],
          ["The technician's home address", false],
          ["The warranty end date of the supplier", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 7 — Service Orders
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "service-orders",
    title: "Service Orders",
    order: 7,
    minutes: 14,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story:
      "Ravi supervises a service workshop for industrial pumps. A customer's notification has come in for a seized pump, and now the real work must be planned: which technician, how many hours, which spare parts, and how much it will all cost. Ravi opens a service order — the document that turns the complaint into an actual, costed job. As the technician confirms hours and parts are issued, the order quietly accumulates the true cost, so when it's done Ravi knows exactly what to bill.",
    content: `## What a Service Order really is

The **Service Order** is the **central execution document in CS** — the place where the actual work is *planned, tracked, and costed*. If the notification is the intake form, the service order is the **work order** handed to the technician or workshop. Everything that costs money — labour hours, spare parts, travel — is recorded against it.

Think of it as a **restaurant kitchen ticket**: the order at the counter (notification) becomes a ticket in the kitchen (service order) that lists every dish (operation) and ingredient (component), and tallies the cost of making it.

### The structure of a service order

A service order has four layers:

| Layer | What it holds |
|-------|---------------|
| **Header** | Order type, customer, equipment, dates, responsible work centre |
| **Operations** | Individual work steps — each with planned hours, work centre, and activity type |
| **Components** | Spare parts and materials needed — these create **reservations** in MM |
| **Costs** | Planned vs actual costs, tracked continuously as work happens |

The **operations** are the *labour* side (what people do), and the **components** are the *materials* side (what parts get used). Together they capture the full cost of the job.

### Order types

| Order type | Use |
|------------|-----|
| **SM01** | Standard service order |
| **SM03** | Repair-specific order |
| *(others)* | Configurable per company |

### The order lifecycle

A service order moves through clear statuses:

\`\`\`
Created
   → Released (RLSD)        ← work is now allowed to start
   → Technician works       ← hours confirmed, parts issued
   → Technically Completed (TECO)
   → Settled / Billed
\`\`\`

- **Released (RLSD)** — the order is approved and execution can begin (reservations become effective, confirmations allowed).
- **Technically Completed (TECO)** — the physical work is finished; no more execution, but costs can still settle.
- **Settled** — costs are cleared off the order to their final destination.

### Settlement — where the costs go

This is the part beginners overlook. A service order *collects* cost but doesn't keep it. At settlement, the accumulated cost is **transferred** somewhere:

- To a **sales document for billing** via **resource-related billing** (so the customer is invoiced — covered in its own lesson), or
- To a **cost centre** (when the work isn't billed externally).

### Transaction codes

\`\`\`
IW31   Create service order
IW32   Change service order
IW33   Display service order
IW38   List / worklist of service orders
\`\`\`

### Why it matters for your career

The service order is the operational heart of CS — it links the customer's problem to people, parts, cost, and ultimately revenue. Consultants who understand the header/operations/components/costs structure and the RLSD → TECO → settlement lifecycle can explain exactly *how field work becomes money*. That end-to-end fluency, especially the settlement step, is what interviewers use to separate people who've only seen the screens from people who understand the financial flow.`,
    keyTitle: "**Service Order:** the work order where CS work is planned and costed",
    keyBody:
      "The **Service Order** is the **central execution document in CS** — where work is planned, tracked, and costed. It is built from a **header** (order type, customer, equipment, work centre), **operations** (labour steps with planned hours), **components** (spare parts that create MM reservations), and **costs** (planned vs actual). It moves through a lifecycle: created → **released (RLSD)** → executed → **technically completed (TECO)** → **settled**. At settlement, accumulated costs are transferred either to a **sales document for billing** (via resource-related billing) or to a **cost centre**. Managed with **IW31 (create), IW32 (change), IW33 (display), IW38 (list)**, it is how a customer's problem becomes costed, billable work.",
    flowchart: {
      title: "Service Order Lifecycle",
      nodes: [
        node("notif", 40, 180, "Notification", PALETTE[5]),
        node("order", 240, 180, "Service Order (IW31)", PALETTE[0], true),
        node("ops", 470, 80, "Operations (work steps)", PALETTE[1]),
        node("comp", 470, 280, "Components (spare parts)", PALETTE[1]),
        node("rel", 690, 180, "Release (RLSD)", PALETTE[3]),
        node("exec", 880, 80, "Execution + TECO", PALETTE[4]),
        node("settle", 880, 280, "Settlement / Billing", PALETTE[2]),
      ],
      edges: [
        edge("notif", "order"),
        edge("order", "ops"),
        edge("order", "comp"),
        edge("ops", "rel"),
        edge("comp", "rel"),
        edge("rel", "exec"),
        edge("exec", "settle"),
      ],
      details: [
        { nodeId: "notif", title: "Notification", description: "The originating complaint or request that justifies creating a service order.", tCode: "IW51", tips: "Not every notification needs an order — only real work does." },
        { nodeId: "order", title: "Service Order", description: "The execution document that plans labour and parts and collects all cost for the job.", tCode: "IW31", tips: "The header sets order type, customer, equipment and responsible work centre." },
        { nodeId: "ops", title: "Operations", description: "Individual work steps, each with planned hours, a work centre and an activity type — the labour side of the order.", tips: "Confirmations against operations post actual labour cost." },
        { nodeId: "comp", title: "Components", description: "Spare parts and materials needed, which automatically create reservations in MM.", tips: "Components are the materials side of the cost." },
        { nodeId: "rel", title: "Release (RLSD)", description: "Approval status that allows execution to begin — confirmations and goods issues become possible.", tips: "Nothing can be executed until the order is released." },
        { nodeId: "exec", title: "Execution & TECO", description: "Technician confirms hours and consumes parts; when physical work is done the order is technically completed.", tips: "TECO stops execution but still allows cost settlement." },
        { nodeId: "settle", title: "Settlement", description: "Accumulated cost is transferred to a sales document for billing (RRB) or to a cost centre.", tips: "Settlement is how the order's cost finally leaves the order." },
      ],
    },
    questions: [
      {
        q: "What is the primary purpose of a service order in CS?",
        e: "The service order is the central execution document — it plans, tracks, and costs the actual work (labour and parts). The notification only captures the complaint; the order is where the work and its cost live.",
        opts: [
          ["To plan, track and cost the actual service work", true],
          ["To record the customer's complaint at intake", false],
          ["To store the customer's bank details", false],
          ["To define the company's chart of accounts", false],
        ],
      },
      {
        q: "In the service order lifecycle, what does TECO mean?",
        e: "TECO stands for Technically Completed — the physical work is finished and no further execution happens, although costs can still be settled afterward. Release (RLSD) is the earlier status that allows work to begin.",
        opts: [
          ["Technically Completed — physical work is finished", true],
          ["The order has just been created but not approved", false],
          ["The customer has cancelled the order", false],
          ["The spare parts are out of stock", false],
        ],
      },
      {
        q: "At settlement, where can a service order's costs be transferred?",
        e: "Settlement transfers accumulated costs either to a sales document for billing (via resource-related billing) so the customer is invoiced, or to a cost centre when the work is not billed externally. The order collects cost but does not keep it.",
        opts: [
          ["To a sales document for billing, or to a cost centre", true],
          ["Only to the customer's personal email", false],
          ["Only to the equipment's serial number field", false],
          ["Nowhere — costs always stay on the order forever", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 8 — Service Contracts
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "service-contracts",
    title: "Service Contracts",
    order: 8,
    minutes: 13,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story:
      "Elena negotiates service deals for a company that maintains commercial kitchen equipment in hotel chains. Rather than billing each repair one by one, a big hotel group wants predictable costs: one agreement covering all their ovens and fridges for three years, billed quarterly. Elena sets up a service contract — the equipment is listed, the price and billing plan are fixed, and from then on every service call is checked against the contract to see if it's already covered.",
    content: `## What a Service Contract is

A **Service Contract** is a **long-term agreement to provide service to a customer over a period** — typically one to three years — for a fixed fee or under defined conditions. It's the "**service subscription**" model: instead of paying per repair, the customer pays a recurring amount and gets agreed service coverage.

A useful analogy: a **gym membership** or a **phone plan**. You pay a regular fee for ongoing access, rather than paying each time you walk in. The provider gets predictable revenue; the customer gets predictable cost and guaranteed service.

### How SAP represents it

Under the hood, **service contracts are SD sales documents** — specifically the **contract category WV**. This is important: the contract lives in Sales & Distribution, which is why CS and SD are so tightly linked. It is *sold* like a sales document but *governs service* like a CS object.

### Key elements of a contract

| Element | What it defines |
|---------|-----------------|
| **Validity period** | Start and end date of coverage |
| **Object list** | The specific equipment covered |
| **Pricing** | Flat fee, per-visit, or per-hour conditions |
| **Billing plan** | When invoices are issued — monthly, quarterly, annual |

### Two contract types

| Type | Basis |
|------|-------|
| **Value contract** | A total agreed value to be consumed |
| **Quantity contract** | A defined number of service calls/visits |

The **object list** is what ties the contract to reality — it lists exactly which equipment (from the customer's installed base) the contract covers.

### The contract check — the clever part

This is what makes contracts powerful. When a **service order is created for equipment that's under contract**, the system **checks contract coverage**:

- **Covered** → the cost may be **absorbed in the contract fee** — the technician's time doesn't generate a new, separate invoice.
- **Not covered** → the work is **billed separately** as normal.

So the contract acts as a **pricing reference** for service orders. The same repair might be free-to-the-customer under contract, or chargeable if outside it — and the system decides automatically.

### The billing plan

Because revenue is recurring, the contract carries a **billing plan** that generates periodic invoices (e.g. a quarterly fee) regardless of how many service calls happen. This is the steady "subscription" income.

### Transaction codes

\`\`\`
VA41   Create service contract
VA42   Change service contract
VA43   Display service contract
\`\`\`

(Note these are *SD* sales-document transactions — further proof the contract is an SD object.)

### Why it matters for your career

Service contracts are where after-sales becomes *recurring, predictable revenue* — often the most profitable part of a service business. Understanding that a contract is an SD document (WV), how the object list defines coverage, and how the contract check redirects billing, shows you grasp the commercial heart of CS. It's also a favourite interview area because it sits exactly on the CS–SD boundary.`,
    keyTitle: "**Service Contract:** the service subscription that governs billing",
    keyBody:
      "A **Service Contract** is a **long-term agreement (typically 1–3 years)** to service a customer's equipment for a fixed fee — the 'service subscription' model. In SAP it is an **SD sales document (contract category WV)**, defined by a **validity period**, an **object list** of covered equipment, **pricing**, and a **billing plan** for periodic invoices. Contracts come as **value** (total amount) or **quantity** (number of calls) types. The key mechanic is the **contract check**: when a service order is raised for covered equipment, the system decides whether the cost is **absorbed in the contract fee** or **billed separately**. Managed with **VA41/VA42/VA43**, it makes the contract a pricing reference for all related service work.",
    flowchart: {
      title: "Service Contract & the Coverage Check",
      nodes: [
        node("sign", 40, 180, "Customer signs contract (VA41)", PALETTE[0], true),
        node("hdr", 270, 60, "Header: validity + pricing", PALETTE[1]),
        node("obj", 270, 180, "Object list (equipment covered)", PALETTE[1]),
        node("bill", 270, 300, "Billing plan (periodic invoices)", PALETTE[4]),
        node("order", 540, 180, "Service Order created", PALETTE[5]),
        node("check", 760, 180, "Contract check: covered?", PALETTE[3], true),
        node("yes", 980, 80, "Absorbed in contract fee", PALETTE[4]),
        node("no", 980, 280, "Billed separately", PALETTE[6]),
      ],
      edges: [
        edge("sign", "hdr"),
        edge("sign", "obj"),
        edge("sign", "bill"),
        edge("obj", "order"),
        edge("order", "check"),
        edge("check", "yes"),
        edge("check", "no"),
      ],
      details: [
        { nodeId: "sign", title: "Create contract", description: "The customer signs a long-term service agreement, created as an SD contract document.", tCode: "VA41", tips: "Contract category WV identifies it as a service contract." },
        { nodeId: "hdr", title: "Header", description: "Holds the validity period (start/end) and the pricing basis — flat fee, per visit or per hour.", tips: "Validity dates control when coverage is active." },
        { nodeId: "obj", title: "Object list", description: "Lists the specific equipment covered, drawn from the customer's installed base.", tips: "Coverage is only as accurate as the object list." },
        { nodeId: "bill", title: "Billing plan", description: "Schedules periodic invoices (monthly/quarterly/annual) for the recurring fee.", tips: "This is the steady subscription revenue, independent of call volume." },
        { nodeId: "order", title: "Service Order", description: "When service is needed, an order is raised for the covered equipment.", tCode: "IW31", tips: "The order triggers the coverage check automatically." },
        { nodeId: "check", title: "Contract check", description: "The system compares the order's equipment/service against the contract to decide billing.", tips: "This automatic check is the whole point of contracts." },
        { nodeId: "yes", title: "Covered", description: "Cost is absorbed in the contract fee — no separate invoice for the work.", tips: "Customer sees predictable cost; provider already collected the fee." },
        { nodeId: "no", title: "Not covered", description: "Work outside the contract scope is billed separately as a normal chargeable service.", tips: "Out-of-scope work protects the provider's margin." },
      ],
    },
    questions: [
      {
        q: "In SAP, a service contract is technically what kind of document?",
        e: "Service contracts are SD sales documents (contract category WV). This is why CS and SD are so tightly linked and why the create/change/display transactions are the SD VA41/VA42/VA43 codes.",
        opts: [
          ["An SD sales document (contract category WV)", true],
          ["A financial journal entry in FI", false],
          ["A material master record in MM", false],
          ["A quality inspection lot in QM", false],
        ],
      },
      {
        q: "What happens during the contract check when a service order is raised for covered equipment?",
        e: "The system checks contract coverage: if the equipment/service is covered, the cost may be absorbed in the contract fee rather than separately invoiced; if not covered, the work is billed separately. The contract acts as a pricing reference.",
        opts: [
          ["The cost may be absorbed in the contract fee instead of billed separately", true],
          ["The equipment is automatically scrapped", false],
          ["The customer master is deleted", false],
          ["A new contract is created for every order", false],
        ],
      },
      {
        q: "What does the object list in a service contract define?",
        e: "The object list specifies exactly which equipment the contract covers, drawn from the customer's installed base. It is the link between the commercial agreement and the physical assets being serviced.",
        opts: [
          ["The specific equipment covered by the contract", true],
          ["The technician's salary scale", false],
          ["The company's tax registration numbers", false],
          ["The warehouse storage bin layout", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 9 — Service Level Agreements (SLA)
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "service-level-agreements-sla",
    title: "Service Level Agreements (SLA)",
    order: 9,
    minutes: 13,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "HIGH",
    story:
      "Tom manages support for a company that services hospital MRI machines, where downtime can delay patient scans. The contract promises that any critical fault gets a response within two hours and is resolved by the next business day. When an MRI goes down, Tom watches the SLA clock the system started the moment the notification was logged — and as the deadline approaches, the system automatically escalates to his manager so the commitment isn't missed.",
    content: `## What an SLA is

A **Service Level Agreement (SLA)** defines the **response and resolution time commitments** a service provider makes to a customer. It turns vague promises ("we'll fix it soon") into measurable obligations: "we will respond within 4 hours" or "we will resolve the issue by the next business day."

An SLA is essentially a **clock with a promise attached**. The moment a problem is reported, timers start, and the provider has committed — often contractually — to hit specific deadlines.

### How SAP CS models SLAs

In CS, SLA terms are configured as **response profiles** and **service profiles**, which are attached to **service contracts** or driven by **notification priorities**. The profiles encode the working calendar and the time targets, so the system knows exactly when each deadline falls.

### The key time concepts

| Term | Meaning |
|------|---------|
| **Response Time** | Time from notification to first response |
| **Reaction Time** | Time until on-site arrival |
| **Resolution Time** | Time to fix the issue and close it |

These are different milestones on the same timeline — acknowledging the problem, getting there, and finishing the fix.

### Priority drives the SLA

Priority levels set how tight the clock is:

| Priority | Example response target |
|----------|------------------------|
| **1 – Critical** | 2-hour response |
| **2 – High** | Same day |
| **3 – Medium** | 2 business days |
| **4 – Low** | 5 business days |

A critical hospital machine gets a far tighter SLA than a low-priority cosmetic fault.

### SLA monitoring and escalation

The real value is **automatic monitoring**. The system tracks whether deadlines are being met and can:

- Trigger **alerts** when an SLA is **at risk**.
- **Escalate** automatically — sending notifications up to management when a deadline is about to be breached.

This **escalation management** means a looming breach gets human attention *before* it becomes a failure, not after.

### SLAs in S/4HANA Service

In modern **S/4HANA Service**, SLAs are managed through **Service Contract items with Date Rules** — a cleaner, rule-based way to calculate the response and resolution deadlines directly on the contract.

\`\`\`
Notification logged  →  SLA clock starts
   Response deadline  →  Resolution deadline
   At risk?  →  automatic escalation to management
\`\`\`

### Why SLAs matter

In B2B service, SLAs are **legally binding** and often carry **financial penalties for breach**. Missing a resolution deadline can cost real money and damage the relationship. That's why the automatic clock, monitoring, and escalation are so important — they protect both the customer's operations and the provider's reputation and revenue.

### Why it matters for your career

SLAs are where service promises become enforceable, measurable, and financially significant. Being able to explain response vs reaction vs resolution time, how priority drives the deadlines, and how escalation prevents breaches shows you understand the *commercial risk* side of service — not just the mechanics. It's a frequent interview topic precisely because it connects configuration to contractual and financial consequences.`,
    keyTitle: "**SLA:** measurable response and resolution commitments with escalation",
    keyBody:
      "A **Service Level Agreement (SLA)** defines the **response and resolution time commitments** a provider makes — turning promises into measurable deadlines. CS models them as **response profiles and service profiles** attached to **contracts** or driven by **notification priority**. The core measures are **response time** (to first reply), **reaction time** (to on-site arrival), and **resolution time** (to fix and close). **Priority** sets how tight the clock is (e.g. P1 → 2-hour response). The system **monitors deadlines and escalates automatically** to management when a breach is near. In **S/4HANA Service**, SLAs use **Service Contract items with Date Rules**. Because B2B SLAs are **legally binding with financial penalties**, this automation directly protects revenue and reputation.",
    flowchart: {
      title: "SLA Clock & Escalation",
      nodes: [
        node("notif", 40, 180, "Notification created", PALETTE[0], true),
        node("prio", 260, 180, "Priority assigned (1-High → 4-Low)", PALETTE[1]),
        node("clock", 500, 180, "SLA clock starts", PALETTE[3], true),
        node("resp", 740, 60, "Response deadline", PALETTE[1]),
        node("reso", 740, 300, "Resolution deadline", PALETTE[1]),
        node("met", 980, 60, "SLA met → complete", PALETTE[4]),
        node("breach", 980, 300, "At risk → escalate to management", PALETTE[6]),
      ],
      edges: [
        edge("notif", "prio"),
        edge("prio", "clock"),
        edge("clock", "resp"),
        edge("clock", "reso"),
        edge("resp", "met"),
        edge("reso", "breach"),
      ],
      details: [
        { nodeId: "notif", title: "Notification created", description: "Logging the notification is the event that starts the SLA timeline.", tCode: "IW51", tips: "The timestamp here is the SLA's zero hour." },
        { nodeId: "prio", title: "Priority assigned", description: "The chosen priority determines which response/resolution targets apply.", tips: "Higher priority = tighter deadlines." },
        { nodeId: "clock", title: "SLA clock starts", description: "Response and service profiles calculate the deadlines using the working calendar.", tips: "Profiles come from the contract or priority configuration." },
        { nodeId: "resp", title: "Response deadline", description: "The committed time for the first response (and reaction time for on-site arrival).", tips: "Responding is distinct from resolving." },
        { nodeId: "reso", title: "Resolution deadline", description: "The committed time to fully fix and close the issue.", tips: "Resolution is the deadline customers care about most." },
        { nodeId: "met", title: "SLA met", description: "Deadlines are honoured and the case completes normally.", tips: "Met SLAs protect the relationship and avoid penalties." },
        { nodeId: "breach", title: "Escalation", description: "When a deadline is at risk, the system alerts and escalates to management before the breach occurs.", tips: "Escalation is proactive, not after-the-fact." },
      ],
    },
    questions: [
      {
        q: "What does an SLA primarily define?",
        e: "An SLA defines the response and resolution time commitments the provider makes to the customer — measurable deadlines such as 'respond within 4 hours'. It is not about pricing or stock; it is about time commitments.",
        opts: [
          ["The response and resolution time commitments to the customer", true],
          ["The total price of the spare parts", false],
          ["The warehouse storage bin for components", false],
          ["The customer's preferred payment method", false],
        ],
      },
      {
        q: "How does priority relate to the SLA?",
        e: "Priority drives how tight the SLA deadlines are: a critical (Priority 1) issue gets a much shorter response target than a low (Priority 4) one. Priority is the lever that selects the applicable time commitments.",
        opts: [
          ["Higher priority means tighter response and resolution deadlines", true],
          ["Priority has no effect on the SLA timeline", false],
          ["Priority only changes the invoice currency", false],
          ["Priority deletes the notification automatically", false],
        ],
      },
      {
        q: "What does SLA escalation management do when a deadline is at risk?",
        e: "It automatically alerts and escalates to management before the breach occurs, so a looming failure gets human attention proactively. This protects the provider from missing legally binding commitments that may carry penalties.",
        opts: [
          ["Automatically alerts/escalates to management before the breach happens", true],
          ["Cancels the customer's contract immediately", false],
          ["Refunds the customer without any review", false],
          ["Converts the notification into a purchase order", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 10 — Warranty Management
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "warranty-management",
    title: "Warranty Management",
    order: 10,
    minutes: 13,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "HIGH",
    story:
      "Nadia handles billing decisions at a company that sells and services packaging machines. A customer's machine fails just eight months after purchase — well within the one-year warranty the company gave them, so charging for the repair would be wrong and would anger a good customer. Meanwhile, the faulty part came from a supplier whose own warranty is still valid, so the company can claim the cost back. SAP checks both warranties automatically the moment the notification is raised, and Nadia avoids two expensive mistakes at once.",
    content: `## What Warranty Management does

**Warranty Management** in SAP CS automatically handles **two different kinds of warranty** that both attach to a piece of equipment. Getting them right protects the company from two opposite mistakes: overcharging customers, and forgetting to reclaim money from suppliers.

### The two warranties

| Warranty | Who gave it | What it means |
|----------|-------------|---------------|
| **Customer Warranty** | *You* gave it to the customer | If equipment fails within the period, service is **free to the customer** |
| **Vendor / Manufacturer Warranty** | The *supplier* gave it to you | If a component is defective, the **vendor reimburses you** |

Think of buying a laptop. The **customer warranty** is the guarantee *you* give your buyer ("free repairs for 12 months"). The **vendor warranty** is the guarantee the *part manufacturer* gave you on the battery inside — if the battery is faulty, you claim from them. Same repair, two separate financial relationships.

### Where warranties live

Both warranties are tracked on the **Equipment Master** via **warranty end dates** — the customer-warranty end date and the vendor-warranty end date you learned about in the Equipment lesson. This is exactly why those two dates exist.

### The automatic warranty check

When a **service notification or order is created** for a piece of equipment, SAP **automatically checks warranty status**:

- **Under customer warranty?** → **No charge to the customer** for the covered service.
- **Under vendor warranty?** → Costs can be **claimed back from the vendor** through a warranty claim.

These two checks run independently — a repair can be free to the customer *and* claimable from the vendor at the same time.

### The vendor warranty claim process

When a vendor-warranty-covered defect is found:

\`\`\`
Service order executed
   → Warranty claim created
   → Sent to vendor for credit/reimbursement
\`\`\`

This recovers the cost of the defective component from the supplier rather than the company absorbing it.

### Configuration

Warranties are set up using the **warranty master** via transaction **BGMD**, which defines warranty types and the services/values they cover.

\`\`\`
BGMD   Warranty master (configure warranty types)
\`\`\`

### Why it matters

Without automatic warranty tracking, companies make costly errors in *both* directions:

- **Overcharging customers** for work that should be free — damaging relationships and trust.
- **Missing vendor warranty claims** — silently absorbing costs that the supplier should have paid.

Automatic checks at the moment of notification/order creation prevent both, protecting margin and customer goodwill simultaneously.

### Why it matters for your career

Warranty management is a clear example of SAP automating a *financial control* inside an operational process. Being able to distinguish customer vs vendor warranty, explain that both live as dates on the equipment master, and describe the claim process shows you understand how CS protects revenue on both sides. Interviewers value it because it links master data (the warranty dates) directly to money.`,
    keyTitle: "**Warranty Management:** two warranties, checked automatically on the equipment",
    keyBody:
      "**Warranty Management** automatically handles two warranties tracked as **end dates on the Equipment Master**. The **customer warranty** is what *you* gave the customer — if covered, **service is free to them**. The **vendor/manufacturer warranty** is what your *supplier* gave you — if a component is defective, you **claim the cost back from the vendor**. When a notification or service order is created, SAP runs an **automatic warranty check**: customer-warranty coverage means no charge to the customer, while vendor-warranty coverage triggers a **warranty claim** to the supplier. Configured via the warranty master (**BGMD**), it prevents two costly errors at once — **overcharging customers** and **missing recoverable vendor claims**.",
    flowchart: {
      title: "Automatic Warranty Check",
      nodes: [
        node("eq", 40, 180, "Equipment with warranty dates", PALETTE[5], true),
        node("notif", 270, 180, "Service notification created", PALETTE[0]),
        node("check", 500, 180, "Automatic warranty check", PALETTE[3], true),
        node("custY", 740, 50, "Customer warranty valid → no charge", PALETTE[4]),
        node("custN", 740, 170, "Not valid → bill customer", PALETTE[6]),
        node("vendY", 740, 290, "Vendor warranty → create claim", PALETTE[1]),
        node("vendN", 740, 400, "No vendor warranty → absorb cost", PALETTE[5]),
      ],
      edges: [
        edge("eq", "notif"),
        edge("notif", "check"),
        edge("check", "custY"),
        edge("check", "custN"),
        edge("check", "vendY"),
        edge("check", "vendN"),
      ],
      details: [
        { nodeId: "eq", title: "Equipment with warranty dates", description: "The equipment master carries both customer- and vendor-warranty end dates that drive the check.", tCode: "IE03", tips: "No dates on the equipment = no automatic check." },
        { nodeId: "notif", title: "Notification created", description: "Raising a notification (or order) for the equipment triggers the warranty evaluation.", tCode: "IW51", tips: "The check happens at creation time, automatically." },
        { nodeId: "check", title: "Warranty check", description: "SAP compares the current date against both warranty end dates independently.", tips: "Customer and vendor checks are separate and can both apply." },
        { nodeId: "custY", title: "Customer warranty valid", description: "If still under customer warranty, the covered service is free to the customer.", tips: "Prevents overcharging a customer for covered work." },
        { nodeId: "custN", title: "Customer warranty expired", description: "If the customer warranty has lapsed, the work is billed to the customer normally.", tips: "Expired warranty = chargeable service." },
        { nodeId: "vendY", title: "Vendor warranty valid", description: "A defective component under vendor warranty leads to a warranty claim against the supplier.", tips: "Recovers cost the company would otherwise absorb." },
        { nodeId: "vendN", title: "No vendor warranty", description: "Without vendor coverage, the company absorbs the component cost itself.", tips: "Tracking vendor dates is what avoids silently eating costs." },
      ],
    },
    questions: [
      {
        q: "What is the difference between customer warranty and vendor warranty?",
        e: "Customer warranty is the guarantee you gave the customer (covered service is free to them); vendor/manufacturer warranty is the guarantee your supplier gave you (you can claim defective-component costs back from the vendor). They are two separate financial relationships on the same equipment.",
        opts: [
          ["Customer warranty makes service free to the customer; vendor warranty lets you claim costs back from the supplier", true],
          ["They are the same thing with different names", false],
          ["Customer warranty is for software; vendor warranty is for hardware only", false],
          ["Customer warranty is internal; vendor warranty does not exist in SAP", false],
        ],
      },
      {
        q: "Where are warranty periods tracked in SAP CS?",
        e: "Both the customer- and vendor-warranty end dates are tracked on the Equipment Master. That is precisely why the equipment record carries two distinct warranty date fields, enabling the automatic check.",
        opts: [
          ["As warranty end dates on the Equipment Master", true],
          ["Only in the customer's email signature", false],
          ["In the company's chart of accounts", false],
          ["Nowhere — warranties are tracked on paper only", false],
        ],
      },
      {
        q: "Why does automatic warranty checking matter financially?",
        e: "It prevents two opposite costly errors: overcharging customers for work that should be free (harming the relationship) and missing vendor warranty claims (silently absorbing costs the supplier should pay). The check protects margin and goodwill at the same time.",
        opts: [
          ["It avoids both overcharging customers and missing recoverable vendor claims", true],
          ["It increases the price of every repair automatically", false],
          ["It deletes the equipment record after each repair", false],
          ["It only matters for tax filing once a year", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 11 — Repair Orders (In-House Repair)
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "repair-orders-in-house",
    title: "Repair Orders (In-House Repair)",
    order: 11,
    minutes: 14,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story:
      "Hassan runs a repair depot for a power-tools manufacturer. A customer ships back a faulty cordless drill rather than waiting for a technician to visit. Hassan needs to track the whole journey in SAP: receiving the broken drill into a returns area, repairing it in the workshop, sending it back, and finally billing the customer. He uses the in-house repair process, where a single repair order ties the entire round-trip together so nothing gets lost between receiving, fixing, and shipping.",
    content: `## What In-House Repair is

The **In-House Repair** process handles **defective equipment that the customer sends back** to be repaired at the company's own workshop. It is a complete **round-trip cycle**: the customer ships the broken item in, the company repairs it, ships it back, and bills for the work.

This is the opposite of **field service** (where the *technician travels to the customer*). In in-house repair, the *equipment travels to the company*. Think of sending a phone back to the manufacturer for repair versus having an engineer come to your house — same goal, opposite logistics.

### The documents involved

In-house repair cleverly combines two document types:

- A **Repair Order** — a special **sales order type: RA** — which tracks the whole lifecycle in *one* document.
- A **Service Order** — created from the repair order for the *actual repair work* (the labour and parts).

The repair order is the "master record" of the round-trip; the service order is the workshop's execution document.

### The step-by-step process

\`\`\`
1. Repair Request created          (VA01, order type RA)
2. Customer returns broken item    (returns delivery, goods receipt → returns stock)
3. Service Order created for repair (IW81, from the repair order)
4. Technician repairs in workshop
5. Repaired item posted back to usable stock
6. Outbound delivery created        (VL01N → ship back to customer)
7. Billing created                  (VF01 → invoice the customer)
\`\`\`

| Step | What happens | Typical transaction |
|------|--------------|--------------------|
| Repair request | Open the repair order | VA01 (type RA) |
| Goods receipt | Receive the broken item into returns stock | VL01N (returns) |
| Service order | Plan/execute the actual repair | IW81 |
| Goods issue | Ship the repaired item back | VL01N (outbound) |
| Billing | Invoice the customer | VF01 |

### The key transaction

\`\`\`
IW81   Create service order from a repair order
\`\`\`

This is the link that connects the commercial repair order to the operational service order.

### Why one repair order for the whole cycle

The repair order **tracks the entire lifecycle in one document** — receipt, repair, return, and billing all hang off it. That means at any point you can see where the customer's item is in the journey: still in returns, on the workshop bench, repaired and waiting to ship, or invoiced. Nothing falls through the cracks between departments.

### Optional QM inspection

Before shipping the repaired item back, a **quality inspection** can be triggered (QM integration) to confirm the repair meets standard — important for regulated or high-value equipment.

### Why it matters for your career

In-house repair is the most *logistically complex* CS scenario because it spans returns, workshop execution, outbound shipping, and billing — touching SD, MM, and QM. Being able to walk through the seven steps and name the linking transaction (IW81) demonstrates real end-to-end process knowledge. It's a strong interview answer precisely because it shows you can hold a multi-module flow in your head.`,
    keyTitle: "**In-House Repair:** the return-repair-return-bill round-trip in one order",
    keyBody:
      "**In-House Repair** handles **defective equipment the customer ships back** to the company's workshop — the opposite of field service. It combines a **Repair Order (sales order type RA)**, which tracks the whole lifecycle in one document, with a **Service Order** created from it (via **IW81**) for the actual repair work. The cycle runs: **repair request (VA01/RA) → goods receipt of the broken item into returns → service order (IW81) → workshop repair → optional QM inspection → outbound delivery back to the customer (VL01N) → billing (VF01)**. Because the single repair order ties receipt, repair, return, and invoice together, the customer's item can always be located in its journey, and the process spans **SD, MM, and QM**.",
    flowchart: {
      title: "In-House Repair Cycle",
      nodes: [
        node("ret", 40, 180, "Customer returns defective item", PALETTE[6], true),
        node("gr", 250, 180, "Goods Receipt (returns stock)", PALETTE[5]),
        node("ra", 460, 180, "Repair Order (RA) created", PALETTE[0], true),
        node("so", 670, 80, "Service Order for repair (IW81)", PALETTE[1]),
        node("qm", 670, 290, "QM inspection (optional)", PALETTE[3]),
        node("gi", 900, 80, "Goods Issue (ship back)", PALETTE[4]),
        node("bill", 900, 290, "Billing to customer (VF01)", PALETTE[2]),
      ],
      edges: [
        edge("ret", "gr"),
        edge("gr", "ra"),
        edge("ra", "so"),
        edge("ra", "qm"),
        edge("so", "gi"),
        edge("qm", "gi"),
        edge("gi", "bill"),
      ],
      details: [
        { nodeId: "ret", title: "Customer returns item", description: "The defective equipment is shipped back to the company — the trigger for in-house repair.", tips: "Contrast with field service, where the technician travels instead." },
        { nodeId: "gr", title: "Goods receipt (returns)", description: "The broken item is received via a returns delivery into a returns storage location.", tCode: "VL01N", tips: "Returns stock keeps defective items separate from sellable stock." },
        { nodeId: "ra", title: "Repair Order (RA)", description: "A special sales order type that tracks the whole repair lifecycle in a single document.", tCode: "VA01", tips: "Order type RA is the signature of in-house repair." },
        { nodeId: "so", title: "Service Order", description: "Created from the repair order to plan and execute the actual workshop repair (labour + parts).", tCode: "IW81", tips: "IW81 is the link between the repair order and the service order." },
        { nodeId: "qm", title: "QM inspection", description: "An optional quality inspection confirms the repair meets standard before shipping back.", tips: "Common for regulated or high-value equipment." },
        { nodeId: "gi", title: "Goods issue (ship back)", description: "The repaired item is posted to usable stock and shipped back to the customer via outbound delivery.", tCode: "VL01N", tips: "Outbound delivery completes the round-trip." },
        { nodeId: "bill", title: "Billing", description: "The customer is invoiced for the repair, closing the financial side of the cycle.", tCode: "VF01", tips: "Billing draws on the repair order's accumulated value." },
      ],
    },
    questions: [
      {
        q: "How does in-house repair differ from field service?",
        e: "In in-house repair the customer ships the defective equipment to the company's workshop, whereas in field service the technician travels to the customer's site. The logistics are reversed — the equipment moves, not the technician.",
        opts: [
          ["The customer ships equipment to the company, rather than a technician travelling to the customer", true],
          ["In-house repair never involves billing the customer", false],
          ["Field service is only for software, in-house only for hardware", false],
          ["They are identical processes with different names", false],
        ],
      },
      {
        q: "Which transaction creates a service order from a repair order?",
        e: "IW81 creates the service order from the repair order, linking the commercial repair order (type RA) to the operational repair work. VA01 creates the repair order itself, and VF01 handles billing.",
        opts: [
          ["IW81", true],
          ["VA01", false],
          ["VF01", false],
          ["MIGO", false],
        ],
      },
      {
        q: "Why is a single repair order used across the whole cycle?",
        e: "The repair order tracks the entire lifecycle — receipt, repair, return, and billing — in one document, so the customer's item can always be located in its journey and nothing slips between departments. It is the master record of the round-trip.",
        opts: [
          ["It tracks the entire lifecycle in one document so the item can always be located", true],
          ["It is legally required to delete the equipment record", false],
          ["It prevents the customer from ever being billed", false],
          ["It automatically doubles the repair price", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 12 — Spare Parts Management in CS
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "spare-parts-management",
    title: "Spare Parts Management in CS",
    order: 12,
    minutes: 12,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "MEDIUM",
    story:
      "Grace plans repairs for a company that services elevators. A technician's job needs a specific motor brush and a control board, and Grace must make sure both parts are reserved and waiting before the technician is dispatched — otherwise the visit is wasted. She adds the components to the service order, the system reserves them in the warehouse, and when the technician uses them their cost lands neatly on the order. One part isn't in stock, so SAP automatically raises a purchase requisition to procure it.",
    content: `## Why spare parts matter in CS

Service work rarely happens with labour alone — most repairs need **spare parts**: the components consumed to complete the service. SAP CS integrates tightly with **Materials Management (MM)** so that parts are reserved, picked, consumed, and costed against the service order seamlessly.

The relationship is simple to state: **CS plans the parts, MM supplies them, and the cost flows back to the service order.**

### How it works, step by step

When a technician adds a **component** (a material) to a service order operation, a chain of MM events follows:

\`\`\`
Add component to service order operation
   → Reservation created automatically in MM   (part reserved in warehouse)
   → Warehouse picks the part
   → Goods Issue posted against the reservation (MIGO or from the order)
   → Material cost flows onto the service order
\`\`\`

1. **Component assignment** — you specify which material, how much, and *which operation* (work step) uses it.
2. **Reservation** — SAP automatically reserves the material in the warehouse for this order, so it can't be given to another job.
3. **Goods Issue** — when the part is actually used, a goods issue is posted against the reservation (via **MIGO** or directly from the service order), reducing stock.
4. **Cost** — the material's cost then lands on the service order, becoming part of the billable/settled total.

### Key concepts

| Concept | Meaning |
|---------|---------|
| **Component assignment** | Linking a material to a specific operation in the order |
| **Reservation** | Automatic earmarking of stock for this order |
| **Goods Issue** | The actual consumption that reduces stock and posts cost |
| **Equipment BOM** | An equipment-specific bill of materials — the standard spare-parts list for a machine |

The **equipment BOM** is a real time-saver: it's a predefined parts list for a given piece of equipment, so planners can pick the right components quickly instead of searching every time.

### Special scenarios

- **Part not in stock** → a **purchase requisition** is created automatically from the service order (direct procurement), so the part is bought specifically for this job.
- **Serialized spare parts** → parts that carry serial numbers are tracked **individually**, so you always know exactly which unit went into which equipment.

### Transaction touchpoint

\`\`\`
MIGO   Goods movement (post goods issue for the consumed part)
\`\`\`

(The component planning itself happens inside the service order — IW31/IW32.)

### Why it matters for your career

Spare parts is where CS and MM meet in everyday operations — reservations, goods issues, BOMs, and direct procurement all show up on real projects. Understanding that adding a component automatically drives an MM reservation, and that consumption posts cost back to the order, demonstrates that you grasp the *integration*, not just the CS screens. It's the kind of cross-module detail that signals practical, hands-on competence.`,
    keyTitle: "**Spare Parts in CS:** components reserve in MM and post cost to the order",
    keyBody:
      "Most service work needs **spare parts**, and CS integrates tightly with **MM** to handle them. When a technician adds a **component** to a service order operation, SAP **automatically creates a reservation** in MM, earmarking the part in the warehouse. When the part is used, a **goods issue** (via **MIGO** or from the order) reduces stock and posts the **material cost onto the service order**. Key concepts include **component assignment** (material to operation), **reservation**, **goods issue**, and the **equipment BOM** (a machine's standard spare-parts list). If a part is **not in stock**, a **purchase requisition** is auto-created for direct procurement, and **serialized parts** are tracked individually. This is the everyday CS–MM integration in action.",
    flowchart: {
      title: "Spare Parts Flow (CS ↔ MM)",
      nodes: [
        node("order", 40, 180, "Service Order created", PALETTE[0], true),
        node("add", 250, 180, "Add material + quantity (component)", PALETTE[1]),
        node("res", 470, 180, "Automatic reservation in MM", PALETTE[3], true),
        node("pick", 690, 80, "Warehouse picks part", PALETTE[5]),
        node("gi", 690, 290, "Goods Issue (consumed)", PALETTE[4]),
        node("cost", 910, 180, "Cost hits service order", PALETTE[2], true),
        node("settle", 1120, 180, "Settlement / billing", PALETTE[1]),
      ],
      edges: [
        edge("order", "add"),
        edge("add", "res"),
        edge("res", "pick"),
        edge("pick", "gi"),
        edge("gi", "cost"),
        edge("cost", "settle"),
      ],
      details: [
        { nodeId: "order", title: "Service Order", description: "The order whose operations will consume the spare parts.", tCode: "IW31", tips: "Components are added per operation (work step)." },
        { nodeId: "add", title: "Add component", description: "Specify the material, quantity, and which operation uses it.", tips: "An equipment BOM speeds up choosing the right parts." },
        { nodeId: "res", title: "Reservation", description: "SAP automatically reserves the material in the warehouse so it can't be used elsewhere.", tips: "Reservation is automatic — no manual step needed." },
        { nodeId: "pick", title: "Warehouse picks", description: "The reserved part is picked from stock ready for the technician.", tips: "If not in stock, a purchase requisition is auto-created." },
        { nodeId: "gi", title: "Goods Issue", description: "Consuming the part posts a goods issue against the reservation, reducing stock.", tCode: "MIGO", tips: "Can be posted from MIGO or directly within the service order." },
        { nodeId: "cost", title: "Cost on order", description: "The material's cost flows onto the service order, joining labour in the total.", tips: "This is how parts become part of the billable amount." },
        { nodeId: "settle", title: "Settlement / billing", description: "The combined cost (labour + parts) is settled or billed to the customer.", tips: "Parts cost reaches the customer via RRB or contract." },
      ],
    },
    questions: [
      {
        q: "When a technician adds a component to a service order operation, what happens automatically?",
        e: "A reservation is created automatically in MM, earmarking the material in the warehouse for this order. This prevents the part from being allocated to another job and sets up the later goods issue.",
        opts: [
          ["A reservation is created automatically in MM", true],
          ["The customer is immediately refunded", false],
          ["The equipment record is deleted", false],
          ["The service order is closed instantly", false],
        ],
      },
      {
        q: "What is an equipment BOM in the CS spare-parts context?",
        e: "An equipment BOM is an equipment-specific bill of materials — the standard spare-parts list for a particular machine. It lets planners quickly select the correct components instead of searching each time.",
        opts: [
          ["An equipment-specific standard spare-parts list", true],
          ["The customer's billing address", false],
          ["A type of warranty claim form", false],
          ["The technician's certification record", false],
        ],
      },
      {
        q: "What happens if a required spare part is not in stock?",
        e: "A purchase requisition is created automatically from the service order (direct procurement), so the part is bought specifically for this job. This keeps the repair moving rather than stalling for lack of stock.",
        opts: [
          ["A purchase requisition is auto-created from the service order for direct procurement", true],
          ["The service order is permanently cancelled", false],
          ["The customer must mail in the part themselves", false],
          ["The cost is removed from the order entirely", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 13 — Resource-Related Billing (RRB)
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "resource-related-billing",
    title: "Resource-Related Billing (RRB)",
    order: 13,
    minutes: 15,
    difficulty: "ADVANCED",
    xp: 100,
    importance: "HIGH",
    story:
      "Priyanka is a finance-savvy CS consultant at a firm that services industrial generators. A technician just finished a big job: 14 labour hours, three replacement parts, and 200 km of travel — all recorded on the service order. But the customer hasn't been invoiced, because the service order only knows its *costs*, not how to turn them into a *bill*. Priyanka runs resource-related billing, and through the DIP profile those costs become neat invoice lines the customer can actually be charged for.",
    content: `## What RRB solves

A service order is brilliant at *collecting cost* — labour, materials, travel — but it has **no way to invoice the customer on its own**. **Resource-Related Billing (RRB)** is the mechanism that **transfers the costs accumulated on a service order into an SD billing document**, so the customer can finally be charged. RRB is the **bridge between CS and SD**.

Without RRB, you'd have a perfectly costed order and *no invoice* — the work would never turn into revenue. RRB is the "**final mile**" that converts field work into money.

### The key configuration object: the DIP Profile

The heart of RRB is the **DIP Profile** (Dynamic Item Processor Profile). It defines **how service-order cost elements map to SD billing items**. In other words, it's the translation table that says:

| Service order cost element | → maps to SD billing item |
|----------------------------|---------------------------|
| Labour hours | A service line on the invoice |
| Materials used | A parts line on the invoice |
| Travel costs | A travel line on the invoice |

Each cost type must be mapped to the **right SD condition type**. The DIP profile is what makes the invoice come out correctly structured and priced.

### The RRB process

\`\`\`
1. Service order work performed   (hours confirmed, materials issued)
2. Costs accumulate on the order  (labour + materials + travel)
3. Run RRB                         (DP90 single order, DP91 mass)
4. System reads costs via the DIP Profile
   → creates a resource-related quotation / billing request in SD
5. Final invoice created           (VF01)
\`\`\`

| Step | Transaction |
|------|-------------|
| RRB for a single order | **DP90** |
| RRB mass processing | **DP91** |
| Create the final invoice | **VF01** |

The DIP profile reads the real, actual costs on the order and generates a **billing request** (sometimes a debit-memo request). The actual invoice is then created from that request with **VF01**.

### Why RRB is considered complex

The complexity is all in the **DIP profile mapping**. If a cost element is mapped to the wrong **SD condition type**, the customer gets a **wrong invoice** — overcharged, undercharged, or with messy line items. Because RRB sits exactly where operations meet finance, a misconfiguration is both visible and expensive. Getting the DIP profile right is the difference between clean billing and constant invoice disputes.

### The big picture

\`\`\`
Service Order (labour + materials + travel)
   → DIP Profile maps costs
   → DP90 creates SD billing request
   → VF01 creates customer invoice
   → revenue recognised in FI
\`\`\`

RRB is what makes time-and-materials service billing possible: you bill the customer for *exactly what was consumed*, accurately translated into invoice lines.

### Why it matters for your career

RRB is one of the most respected topics in CS because it's where **operations, sales, and finance converge**. Being able to explain that the DIP profile maps cost elements to SD condition types, and that DP90/DP91 generate the billing request before VF01 invoices, marks you as someone who understands the *revenue-generating* end of service — not just the work. It's a senior-level differentiator and a frequent advanced interview question.`,
    keyTitle: "**RRB:** turning service-order costs into customer invoices via the DIP profile",
    keyBody:
      "**Resource-Related Billing (RRB)** transfers the costs accumulated on a **service order** into an **SD billing document** so the customer can be invoiced — the **bridge between CS and SD** and the 'final mile' that turns field work into revenue. Its core configuration is the **DIP Profile (Dynamic Item Processor)**, which maps service-order cost elements (**labour, materials, travel**) to **SD billing items / condition types**. The process: perform work → costs accumulate → run **DP90** (single) or **DP91** (mass) → the system reads costs via the DIP profile and creates a **billing request** → **VF01** creates the final invoice → revenue posts to FI. Mis-mapping the DIP profile causes wrong invoices, which is why RRB is considered complex.",
    flowchart: {
      title: "Resource-Related Billing Flow",
      nodes: [
        node("so", 40, 180, "Service Order (labour + materials + travel)", PALETTE[0], true),
        node("dip", 320, 180, "DIP Profile maps costs", PALETTE[3], true),
        node("dp90", 580, 180, "DP90 / DP91 (run RRB)", PALETTE[1]),
        node("req", 820, 180, "SD Billing Request created", PALETTE[1]),
        node("vf01", 1060, 80, "VF01 → Customer Invoice", PALETTE[4]),
        node("fi", 1060, 300, "Revenue recognised in FI", PALETTE[2]),
      ],
      edges: [
        edge("so", "dip"),
        edge("dip", "dp90"),
        edge("dp90", "req"),
        edge("req", "vf01"),
        edge("vf01", "fi"),
      ],
      details: [
        { nodeId: "so", title: "Service Order", description: "Holds the accumulated actual costs — confirmed labour hours, issued materials, and travel — but cannot invoice on its own.", tCode: "IW33", tips: "RRB exists because the order collects cost but can't bill." },
        { nodeId: "dip", title: "DIP Profile", description: "The Dynamic Item Processor profile that maps each cost element to the correct SD billing item and condition type.", tips: "Wrong mapping here = wrong customer invoice." },
        { nodeId: "dp90", title: "Run RRB", description: "DP90 processes a single order; DP91 handles many orders in mass. They read the costs through the DIP profile.", tCode: "DP90", tips: "DP91 is the mass-processing sibling of DP90." },
        { nodeId: "req", title: "Billing request", description: "RRB creates a resource-related billing request (or debit-memo request) in SD from the mapped costs.", tips: "This request is the precursor to the actual invoice." },
        { nodeId: "vf01", title: "Customer invoice", description: "The final invoice is created from the billing request, charging the customer for what was consumed.", tCode: "VF01", tips: "VF01 is standard SD billing — RRB just feeds it." },
        { nodeId: "fi", title: "Revenue in FI", description: "The invoice posts revenue and accounts receivable into Financial Accounting.", tips: "This closes the loop from field work to recognised revenue." },
      ],
    },
    questions: [
      {
        q: "What problem does Resource-Related Billing (RRB) solve?",
        e: "A service order accumulates costs but cannot invoice the customer by itself. RRB transfers those costs into an SD billing document so the customer can be charged — bridging CS and SD to turn work into revenue.",
        opts: [
          ["It transfers service-order costs into an SD billing document so the customer can be invoiced", true],
          ["It reserves spare parts in the warehouse", false],
          ["It creates the equipment master record", false],
          ["It assigns technician priorities for SLAs", false],
        ],
      },
      {
        q: "What is the role of the DIP Profile in RRB?",
        e: "The DIP (Dynamic Item Processor) Profile maps service-order cost elements — labour, materials, travel — to the correct SD billing items and condition types. Misconfiguring this mapping produces wrong invoices, which is why RRB is considered complex.",
        opts: [
          ["It maps service-order cost elements to SD billing items/condition types", true],
          ["It stores the customer's delivery address", false],
          ["It schedules the technician's route", false],
          ["It defines the warranty end dates", false],
        ],
      },
      {
        q: "Which transaction runs RRB for a single service order?",
        e: "DP90 runs resource-related billing for a single order, while DP91 is used for mass processing of many orders. VF01 then creates the final invoice from the billing request RRB generates.",
        opts: [
          ["DP90", true],
          ["VA41", false],
          ["IE01", false],
          ["MIGO", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 14 — Field Service Management (SAP FSM)
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "field-service-management-fsm",
    title: "Field Service Management (SAP FSM)",
    order: 14,
    minutes: 13,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story:
      "Carlos dispatches a team of 40 field technicians who service air-conditioning systems across a wide region. For years he juggled a whiteboard and phone calls, never quite sure who was free, who was nearest, or who had the right skills. With SAP FSM, service orders flow onto a scheduling board, the system suggests the best technician for each job, and each technician gets the work on a mobile app — even in basements with no signal. Carlos finally knows where everyone is and what they're doing.",
    content: `## What SAP FSM is

**SAP Field Service Management (FSM)** — formerly known as **Coresystems** — is SAP's **cloud solution for dispatching and managing field technicians**. If S/4HANA Service is the **back office** (the service orders, contracts, billing), FSM is the **field side**: scheduling, routing, the technician's mobile app, and real-time status.

The split is clean: **S/4HANA handles the paperwork and money; FSM handles getting the right person to the right place with the right parts.**

### How FSM integrates with S/4HANA

\`\`\`
S/4HANA Service Order released
   → Published to SAP FSM
   → Dispatcher assigns a technician (scheduling board)
   → Technician receives the job on the mobile app
   → Technician completes work on mobile
   → Completion synced back to S/4HANA
   → Billing triggered
\`\`\`

The order originates and is billed in S/4HANA, but the *doing* — scheduling and field execution — happens in FSM, with results flowing back.

### Key FSM capabilities

| Capability | What it does |
|------------|--------------|
| **Smart Scheduling** | AI-powered dispatch — right technician, right time, right location |
| **Real-time GPS tracking** | See where field technicians are, live |
| **Mobile app (offline)** | Technicians work without internet; syncs later |
| **Parts request from field** | Order parts directly from the job site |
| **Customer signature capture** | Proof of completion signed on the device |
| **Automatic travel time** | Calculates and accounts for travel between jobs |

**Smart scheduling** is the standout: instead of a human guessing, FSM optimises assignments based on skills, location, and availability — sending the technician who can actually do the job and is nearest.

### The mobile + offline advantage

Technicians often work in basements, remote sites, or buildings with no signal. FSM's **offline mobile app** lets them see the job, record work, request parts, and capture a signature **without a connection** — everything syncs once they're back online. This is what replaces paper job sheets.

### Why FSM matters

Without FSM, scheduling is **manual** (whiteboards, phone calls) and technicians carry **paper**. The classic pain is "**we don't know where our technicians are**" — leading to wasted travel, double-bookings, and missed SLAs. FSM eliminates this by giving dispatchers a live, optimised view and technicians a connected mobile tool.

### Why it matters for your career

FSM is where modern service becomes *efficient and visible*. Understanding that FSM is the field-execution layer that integrates with S/4HANA — receiving released orders, optimising dispatch, and syncing completions back to trigger billing — shows you grasp the **end-to-end modern service stack**, not just the ERP back office. As field service goes increasingly mobile and AI-scheduled, this knowledge is highly marketable.`,
    keyTitle: "**SAP FSM:** the cloud field-execution layer that dispatches technicians",
    keyBody:
      "**SAP Field Service Management (FSM)**, formerly **Coresystems**, is SAP's **cloud solution for scheduling and managing field technicians** — the field-side counterpart to S/4HANA Service's back office. The integration flow: a **released S/4HANA service order is published to FSM**, a **dispatcher assigns a technician** on the scheduling board, the technician receives and completes the job on a **mobile app**, and the **completion syncs back to S/4HANA to trigger billing**. Key capabilities include **Smart Scheduling** (AI dispatch by skills/location/availability), **real-time GPS tracking**, an **offline mobile app**, **field parts requests**, **signature capture**, and **automatic travel-time** calculation. FSM replaces manual whiteboards and paper job sheets, solving the 'we don't know where our technicians are' problem.",
    flowchart: {
      title: "FSM Dispatch & Sync Flow",
      nodes: [
        node("so", 40, 180, "S/4HANA Service Order released", PALETTE[0], true),
        node("pub", 270, 180, "Published to SAP FSM", PALETTE[1]),
        node("board", 490, 180, "Dispatcher scheduling board", PALETTE[3]),
        node("assign", 710, 80, "Assign technician (skills/location/availability)", PALETTE[1]),
        node("mobile", 710, 290, "Technician mobile app → travel → on-site work", PALETTE[4]),
        node("done", 950, 180, "Completion confirmed", PALETTE[4], true),
        node("sync", 1180, 180, "Sync back to S/4HANA → billing", PALETTE[2]),
      ],
      edges: [
        edge("so", "pub"),
        edge("pub", "board"),
        edge("board", "assign"),
        edge("assign", "mobile"),
        edge("mobile", "done"),
        edge("done", "sync"),
      ],
      details: [
        { nodeId: "so", title: "Service order released", description: "A released service order in S/4HANA is the trigger that hands the job to FSM for scheduling.", tips: "Back office creates and bills; FSM schedules and executes." },
        { nodeId: "pub", title: "Published to FSM", description: "The order is sent to the FSM cloud where dispatch and mobile execution happen.", tips: "Integration is native in modern S/4HANA Service." },
        { nodeId: "board", title: "Scheduling board", description: "The dispatcher's visual board showing technicians, jobs, and availability.", tips: "Replaces the old whiteboard-and-phone approach." },
        { nodeId: "assign", title: "Assign technician", description: "Smart Scheduling suggests the best technician by skills, location, and availability.", tips: "AI optimisation reduces travel and missed SLAs." },
        { nodeId: "mobile", title: "Mobile execution", description: "The technician receives the job on the mobile app, travels, and performs the work — even offline.", tips: "Offline support is key for basements and remote sites." },
        { nodeId: "done", title: "Completion confirmed", description: "Work is confirmed on the device, often with customer signature capture.", tips: "Signature provides proof of completion." },
        { nodeId: "sync", title: "Sync back & bill", description: "Completion data syncs back to S/4HANA, where billing is triggered.", tips: "Closes the loop between field work and revenue." },
      ],
    },
    questions: [
      {
        q: "What role does SAP FSM play relative to S/4HANA Service?",
        e: "FSM is the field-execution layer — scheduling, routing, mobile app, and real-time status — while S/4HANA Service handles the back office (orders, contracts, billing). Released S/4HANA orders are published to FSM, and completions sync back.",
        opts: [
          ["It handles field-side scheduling and mobile execution while S/4HANA handles the back office", true],
          ["It replaces Financial Accounting entirely", false],
          ["It is only a reporting dashboard with no scheduling", false],
          ["It is the same product as the equipment master", false],
        ],
      },
      {
        q: "What does FSM Smart Scheduling optimise for?",
        e: "Smart Scheduling uses AI to assign the right technician based on skills, location, and availability — getting a capable, nearby technician to each job. This reduces wasted travel, double-bookings, and SLA misses compared to manual dispatch.",
        opts: [
          ["Assigning the right technician by skills, location, and availability", true],
          ["The colour scheme of the invoice", false],
          ["The warranty end date calculation", false],
          ["The chart of accounts structure", false],
        ],
      },
      {
        q: "Why is FSM's offline mobile capability important?",
        e: "Technicians frequently work where there is no signal (basements, remote sites), so the offline app lets them view jobs, record work, request parts, and capture signatures without a connection, syncing later. This replaces paper job sheets reliably.",
        opts: [
          ["Technicians can work without internet and sync later, replacing paper job sheets", true],
          ["It lets customers pay their taxes directly", false],
          ["It deletes the service order after each visit", false],
          ["It is required to create a service contract", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 15 — SAP S/4HANA Service (The Modern Evolution)
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "s4hana-service-modern",
    title: "SAP S/4HANA Service (The Modern Evolution)",
    order: 15,
    minutes: 13,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story:
      "Aisha leads a project moving her company from classic SAP CS to S/4HANA. Her team worries everything they know is obsolete — the equipment, the notifications, the orders. As she digs in, she's relieved: the core concepts are the same, but the customer master is now a Business Partner, the old IW31 screen is replaced by a friendly 'Manage Service Orders' Fiori app, and the installed base is now 'Registered Products'. The logic survives; the interface and data model modernise.",
    content: `## What S/4HANA Service is

**SAP S/4HANA Service** is the **modern, reimagined version of the classic CS module** — rebuilt for S/4HANA with **Fiori apps**, a **simplified data model**, and **tighter cloud integration**. It's not a different concept of service; it's the *same service logic* wrapped in modern technology.

The reassuring headline for anyone who learned classic CS: **the core stays the same**. Equipment, notifications, orders, contracts, and RRB are conceptually identical — what changes is the *interface* and *data model*.

### Key differences from classic CS

| Area | Classic CS | S/4HANA Service |
|------|-----------|-----------------|
| **Master record** | Customer master | **Business Partner** (as in Finance) |
| **User interface** | SAP GUI transactions (IW31, etc.) | **Fiori apps** ("Manage Service Orders") |
| **In-house repair** | Multi-step manual process | Dedicated **Fiori app**, guided step-by-step |
| **Contracts** | SAP GUI | **Service Contract Management** app with SLA visibility |
| **FSM integration** | Custom | **Native** |

1. **Business Partner** replaces the old Customer master — the same single-entity approach used in S/4HANA Finance.
2. **Fiori apps** replace many GUI transactions (e.g. *"Manage Service Orders"* instead of IW31) — role-based, web-friendly screens.
3. **In-House Repair** gets a dedicated Fiori app with a guided, step-by-step flow.
4. **Service Contract Management** app gives clear **SLA visibility**.
5. **FSM integration is native**, not a custom build.

### New concepts in S/4HANA Service

| New concept | Replaces |
|-------------|----------|
| **Service Confirmation** | The old confirmation transactions |
| **Registered Products** | The old Installed Base for customer equipment |
| **Maintenance Plans in Fiori** | GUI-only maintenance planning |

- **Service Confirmation** is the modern way technicians confirm what was done and used.
- **Registered Products** is the modern customer-equipment tracking (the IBase, modernised).
- **Maintenance Plans** are now visible and manageable in Fiori.

### What stays the same

The **core logic is unchanged**: equipment, notifications, orders, contracts, and resource-related billing all work conceptually as before. Importantly, **the SAP GUI transactions still work for most things** — IW51, IE01, VA41 are not gone. But **Fiori is the strategic direction**, so new development and the best user experience live there.

\`\`\`
IW51  → "Create Service Request" (Fiori)
IE01  → "Manage Equipment"       (Fiori)
VA41  → "Manage Service Contracts" (Fiori)
\`\`\`

### Migration path

Companies on classic CS can usually **activate S/4HANA Service incrementally** — adopting Fiori apps and new concepts step by step rather than a risky big-bang switch. The familiar transactions keep working during the transition.

### Why it matters for your career

S/4HANA Service is the **future-facing skill**: employers migrating from ECC want consultants who know both the classic foundations *and* the modern Fiori-based way. Being able to say "the logic is the same, but the Customer became a Business Partner, IBase became Registered Products, and IW31 became a Fiori app" shows you can carry classic knowledge into the modern platform — exactly the bridge skill in demand right now.`,
    keyTitle: "**S/4HANA Service:** same service logic, modern Fiori apps and data model",
    keyBody:
      "**SAP S/4HANA Service** is the **modern rebuild of classic CS** — same core logic, new technology. Key changes: the **Customer master becomes the Business Partner**, **SAP GUI transactions are replaced by Fiori apps** (e.g. 'Manage Service Orders' instead of IW31), **In-House Repair and Service Contract Management get dedicated Fiori apps** with SLA visibility, and **FSM integration is native**. New concepts include **Service Confirmation** (replacing old confirmations), **Registered Products** (replacing the Installed Base), and **Maintenance Plans in Fiori**. Crucially, **the core logic — equipment, notifications, orders, contracts, RRB — is unchanged**, and most GUI transactions still work, but **Fiori is the strategic direction**, with incremental migration from classic CS.",
    flowchart: {
      title: "Classic CS vs S/4HANA Service",
      nodes: [
        node("gui", 60, 60, "Classic CS (SAP GUI)", PALETTE[5], true),
        node("fiori", 60, 320, "S/4HANA Service (Fiori)", PALETTE[0], true),
        node("iw51", 340, 20, "IW51 → 'Create Service Request' app", PALETTE[1]),
        node("ie01", 340, 160, "IE01 → 'Manage Equipment' app", PALETTE[1]),
        node("va41", 340, 300, "VA41 → 'Manage Service Contracts' app", PALETTE[1]),
        node("core", 700, 100, "Same core: Notification → Order → Billing", PALETTE[4], true),
        node("new", 700, 300, "New: Business Partner, Registered Products, Service Confirmation", PALETTE[2]),
      ],
      edges: [
        edge("gui", "iw51"),
        edge("gui", "ie01"),
        edge("gui", "va41"),
        edge("iw51", "core"),
        edge("ie01", "core"),
        edge("va41", "core"),
        edge("fiori", "new"),
        edge("new", "core"),
      ],
      details: [
        { nodeId: "gui", title: "Classic CS", description: "The traditional Customer Service module operated through SAP GUI transactions.", tips: "Most GUI transactions still work in S/4HANA." },
        { nodeId: "fiori", title: "S/4HANA Service", description: "The modern rebuild using Fiori apps, a simplified data model, and native cloud integration.", tips: "Fiori is the strategic direction for new work." },
        { nodeId: "iw51", title: "Service request", description: "The classic IW51 notification transaction becomes the 'Create Service Request' Fiori app.", tCode: "IW51", tips: "Same intake concept, modern role-based UI." },
        { nodeId: "ie01", title: "Manage equipment", description: "Equipment creation/maintenance moves into the 'Manage Equipment' Fiori app.", tCode: "IE01", tips: "Equipment master logic is unchanged underneath." },
        { nodeId: "va41", title: "Manage contracts", description: "Service contracts get a dedicated 'Manage Service Contracts' app with SLA visibility.", tCode: "VA41", tips: "Contracts remain SD documents under the hood." },
        { nodeId: "core", title: "Same core process", description: "Notification → Order → Billing and RRB are conceptually identical to classic CS.", tips: "Learning classic CS directly transfers to S/4HANA." },
        { nodeId: "new", title: "New concepts", description: "Business Partner replaces the Customer master; Registered Products replace the IBase; Service Confirmation replaces old confirmations.", tips: "These are modern data-model changes, not new logic." },
      ],
    },
    questions: [
      {
        q: "In S/4HANA Service, what replaces the old Customer master?",
        e: "The Business Partner replaces the Customer master, mirroring the same single-entity approach used in S/4HANA Finance. The underlying service logic remains the same; the master-data model is modernised.",
        opts: [
          ["The Business Partner", true],
          ["The equipment serial number", false],
          ["The DIP profile", false],
          ["The functional location", false],
        ],
      },
      {
        q: "What is true about the core service logic in S/4HANA Service?",
        e: "The core logic — equipment, notifications, orders, contracts, and RRB — is conceptually unchanged from classic CS. What changes is the interface (Fiori apps) and the data model (e.g. Business Partner, Registered Products).",
        opts: [
          ["It is conceptually the same as classic CS; mainly the UI and data model modernise", true],
          ["It is completely different and nothing transfers from classic CS", false],
          ["It removes equipment and notifications entirely", false],
          ["It only works on paper, not in the system", false],
        ],
      },
      {
        q: "In S/4HANA Service, the classic Installed Base is represented by which new concept?",
        e: "Registered Products replace the old Installed Base for tracking customer equipment. Similarly, Service Confirmation replaces the old confirmation transactions — both are modern data-model evolutions of familiar concepts.",
        opts: [
          ["Registered Products", true],
          ["Resource-Related Billing", false],
          ["The DIP profile", false],
          ["The structure indicator", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 16 — Integration: CS with SD, MM, FI, and QM
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "cs-integration-sd-mm-fi-qm",
    title: "Integration: CS with SD, MM, FI, and QM",
    order: 16,
    minutes: 14,
    difficulty: "INTERMEDIATE",
    xp: 90,
    importance: "HIGH",
    story:
      "Daniel is interviewing for a senior CS consultant role. The interviewer doesn't ask about a single transaction — instead: 'Walk me through how CS touches SD, MM, FI, and QM in one service process.' Daniel realises this is the question that separates juniors from seniors. He sketches CS in the centre, with contracts and billing going to SD, parts coming from MM, costs and revenue flowing to FI, and quality inspection looping through QM. The interviewer nods — that map is exactly what they wanted.",
    content: `## Why integration is the senior topic

CS **never works in isolation** — every real service process touches **SD, MM, FI, and QM**. Understanding these four integrations is precisely what **separates a junior CS consultant from a senior one**. Anyone can learn a transaction; a senior can draw the whole map.

Think of CS as the **central hub** of a wheel, with spokes reaching out to four other modules.

### CS ↔ SD (Sales & Distribution)

| Touchpoint | Detail |
|------------|--------|
| Service contracts | Are SD documents (sales order type) |
| Billing | Service work is billed via SD billing (**VF01**) |
| Delivery | Repair orders ship equipment back via SD delivery |

SD is where service becomes a *sellable, billable* thing — contracts, invoices, and deliveries all live here.

### CS ↔ MM (Materials Management)

| Touchpoint | Detail |
|------------|--------|
| Spare parts | Come from MM inventory |
| Reservations | Component reservations are MM reservations |
| Procurement | Purchase requisitions for missing parts flow to MM purchasing |

MM is the *materials* backbone — every part a technician uses is an MM movement.

### CS ↔ FI (Financial Accounting)

| Touchpoint | Detail |
|------------|--------|
| Costs | Service order costs (labour, materials) settle to CO objects and ultimately FI |
| Receivables | Customer invoices post to FI accounts receivable |
| Revenue | Service-contract revenue uses FI revenue posting |

FI is where it all becomes *money* — costs land, invoices become receivables, revenue is recognised.

### CS ↔ QM (Quality Management)

| Touchpoint | Detail |
|------------|--------|
| Inspection | After in-house repair, QM inspection can be triggered before shipping back |
| Inspection lots | Can be created from service orders |
| Non-conformance | Defective parts returned by customers link to QM |

QM is the *quality gate* — especially in repair, where you verify the fix before returning equipment.

### The direction of the flows

The integrations aren't all one-way:

- **CS pushes to SD and MM** — it creates contracts/billing requests and consumes parts.
- **Costs pull into FI** — accumulated order costs settle downward into finance.
- **QM feeds back** — inspection results return to inform whether the equipment can ship.

\`\`\`
        SD  (contracts + billing)
         |
MM ---  CS  --- FI   (costs + revenue + AR)
(parts)  |
        QM  (inspection after repair)
\`\`\`

### Why it matters for your career

This is **the** classic senior CS interview question: "draw the integration map." Being able to explain that contracts and billing are SD, parts and procurement are MM, costs and revenue are FI, and inspection is QM — *and* the direction each flow runs — proves you understand CS as part of an integrated business process, not an island. That systems-thinking is exactly what distinguishes a senior consultant and commands a higher rate.`,
    keyTitle: "**CS Integration:** the hub linking SD, MM, FI, and QM",
    keyBody:
      "CS **never works alone** — every service process integrates with four modules, and drawing this map is the classic **senior CS interview question**. **SD**: service contracts are SD documents, billing uses **VF01**, and repair deliveries use SD delivery. **MM**: spare parts come from MM inventory, component reservations are MM reservations, and missing-part purchase requisitions flow to MM purchasing. **FI**: service-order costs settle through CO to FI, customer invoices post to **accounts receivable**, and contract revenue uses FI revenue posting. **QM**: quality inspection can be triggered after in-house repair, inspection lots can come from service orders, and returned-defect non-conformance links to QM. CS **pushes** to SD/MM, **costs pull** into FI, and **QM feeds back** quality results.",
    flowchart: {
      title: "CS Integration Map",
      nodes: [
        node("cs", 450, 200, "CS (central hub)", PALETTE[0], true),
        node("sd", 450, 20, "SD: contracts + billing", PALETTE[1]),
        node("mm", 120, 200, "MM: spare parts + procurement", PALETTE[3]),
        node("fi", 780, 200, "FI: costs + revenue + AR", PALETTE[4]),
        node("qm", 450, 380, "QM: inspection after repair", PALETTE[2]),
      ],
      edges: [
        edge("cs", "sd"),
        edge("cs", "mm"),
        edge("cs", "fi"),
        edge("cs", "qm"),
      ],
      details: [
        { nodeId: "cs", title: "CS — the hub", description: "Customer Service sits at the centre, orchestrating service processes that reach into four other modules.", tips: "Picture CS as the hub of a wheel with four spokes." },
        { nodeId: "sd", title: "SD integration", description: "Service contracts are SD documents, service work is billed via SD (VF01), and repaired equipment ships via SD delivery.", tCode: "VF01", tips: "SD makes service sellable and billable." },
        { nodeId: "mm", title: "MM integration", description: "Spare parts come from MM inventory, components create MM reservations, and missing parts raise purchase requisitions in MM.", tCode: "MIGO", tips: "Every part used is an MM movement." },
        { nodeId: "fi", title: "FI integration", description: "Order costs settle through CO to FI, invoices post to accounts receivable, and contract revenue is recognised in FI.", tips: "FI is where service becomes money." },
        { nodeId: "qm", title: "QM integration", description: "Quality inspection can be triggered after repair, inspection lots can come from service orders, and returned defects link to QM.", tips: "QM is the quality gate before shipping repairs back." },
      ],
    },
    questions: [
      {
        q: "Which module handles the billing of service work and houses service contracts?",
        e: "SD (Sales & Distribution) handles billing via VF01 and is where service contracts live as sales documents. MM supplies parts, FI handles the money postings, and QM handles inspection.",
        opts: [
          ["SD (Sales & Distribution)", true],
          ["MM (Materials Management)", false],
          ["QM (Quality Management)", false],
          ["PP (Production Planning)", false],
        ],
      },
      {
        q: "How does CS integrate with FI?",
        e: "Service-order costs settle through CO to FI, customer invoices post to FI accounts receivable, and service-contract revenue uses FI revenue posting. FI is where the financial consequences of service are recorded.",
        opts: [
          ["Service costs settle to FI, invoices post to AR, and contract revenue is recognised in FI", true],
          ["FI schedules the field technicians", false],
          ["FI stores the equipment serial numbers", false],
          ["FI performs the quality inspection of repairs", false],
        ],
      },
      {
        q: "What is the typical QM integration point in a CS process?",
        e: "After an in-house repair, a QM quality inspection can be triggered before the equipment is shipped back, with inspection lots created from the service order. QM acts as the quality gate, especially for regulated or high-value repairs.",
        opts: [
          ["Quality inspection after in-house repair, before shipping equipment back", true],
          ["Calculating the customer's invoice total", false],
          ["Reserving spare parts in the warehouse", false],
          ["Creating the service contract billing plan", false],
        ],
      },
    ],
  });

  // ============================================================
  // LESSON 17 — SAP Service Cloud (CX Service)
  // ============================================================
  await makeLesson({
    moduleId: sm.id,
    slug: "sap-service-cloud-cx",
    title: "SAP Service Cloud (CX Service)",
    order: 17,
    minutes: 13,
    difficulty: "INTERMEDIATE",
    xp: 85,
    importance: "MEDIUM",
    story:
      "Maria is a contact-centre agent for an appliance brand. A customer messages on chat, then follows up by email and phone — and Maria needs all of it in one place, with the customer's full history. She works in SAP Service Cloud, where every channel lands in one ticket. Most issues she resolves herself using the knowledge base, but when a washing machine truly needs an engineer, she creates a back-office service order in S/4HANA and the ticket tracks it through to completion.",
    content: `## What SAP Service Cloud is

**SAP Service Cloud** (formerly **SAP Cloud for Customer / C4C Service**) is SAP's **cloud-native CRM service module**, part of the **SAP Customer Experience (CX)** suite. It is the **customer-facing, front-office** layer — the tool **agents use when customers contact them**.

This is the key distinction: **SAP CS / S/4HANA Service is the back-end ERP** (executing and billing the work), while **Service Cloud is the front office** (the contact-centre agent's desktop). One faces the customer; the other does the work behind the scenes.

### Service Cloud vs SAP CS

| | SAP Service Cloud | SAP CS / S/4HANA Service |
|---|------------------|--------------------------|
| **Role** | Front office / contact centre | Back office / ERP execution |
| **User** | Support agent | Service planner, technician, finance |
| **Focus** | Customer interaction & tickets | Orders, parts, costing, billing |
| **Suite** | CX (Customer Experience) | ERP (S/4HANA) |

### Key capabilities

| Capability | What it does |
|------------|--------------|
| **Omnichannel support** | Phone, email, chat, social — all in one interface |
| **Ticket management** | Customer cases/tickets with SLA tracking |
| **Knowledge base** | Agents search articles to resolve issues faster |
| **AI-assisted responses** | Suggested answers and sentiment analysis |
| **Customer 360 view** | Full history of interactions, purchases, and tickets |

**Omnichannel** is central: a customer might start on chat, follow up by email, then call — Service Cloud unifies all of it into one conversation, so the agent never loses context.

### Integration with S/4HANA

The two layers connect: when a ticket needs **back-office action** — a service order, a replacement part — **Service Cloud triggers a CS service order in S/4HANA** and **tracks its completion**. The agent stays informed through the ticket while the back office does the physical work.

\`\`\`
Customer contacts (phone/email/chat)
   → Service Cloud agent desktop → Ticket created
   → Knowledge base searched
   → Can the agent resolve it?
        Yes → close ticket
        No  → create S/4HANA Service Order → CS executes
              → completion updates the ticket → customer notified
\`\`\`

### How they work together

- **Service Cloud** = the contact-centre agent tool (the front door).
- **SAP CS / S/4HANA Service** = the back-office execution (the workshop and finance).

Together they cover the **full loop**: from "**customer contacts us**" to "**problem resolved and billed**." Neither alone covers the whole journey.

### The CX suite positioning

Service Cloud is one piece of the broader CX family:

\`\`\`
Service Cloud + Sales Cloud + Commerce Cloud + Marketing Cloud
   = complete customer journey management
\`\`\`

### Why it matters for your career

Service Cloud shows you understand the **front-office/back-office split** in modern SAP service. Being able to explain that Service Cloud is the CX contact-centre layer that *triggers* S/4HANA service orders — and that together they close the loop from contact to billing — demonstrates you see the whole customer journey, across both CX and ERP. As companies unify front and back office, consultants who bridge both are increasingly valuable.`,
    keyTitle: "**SAP Service Cloud:** the CX front office that triggers ERP service work",
    keyBody:
      "**SAP Service Cloud** (formerly **C4C Service**) is SAP's **cloud-native CRM service module** in the **Customer Experience (CX)** suite — the **customer-facing front office** agents use, as opposed to **SAP CS / S/4HANA Service**, which is the **back-office ERP** that executes and bills the work. Its capabilities include **omnichannel support** (phone, email, chat, social in one place), **ticket management** with SLA tracking, a **knowledge base**, **AI-assisted responses**, and a **Customer 360 view**. When a ticket needs physical work, **Service Cloud triggers a service order in S/4HANA and tracks its completion**. Together they close the full loop from 'customer contacts us' to 'resolved and billed'. Service Cloud sits alongside Sales, Commerce, and Marketing Cloud in the CX suite.",
    flowchart: {
      title: "Service Cloud → S/4HANA Loop",
      nodes: [
        node("contact", 40, 200, "Customer contacts (phone/email/chat)", PALETTE[5], true),
        node("desk", 280, 200, "Service Cloud agent desktop", PALETTE[0], true),
        node("ticket", 520, 200, "Ticket created", PALETTE[1]),
        node("kb", 520, 40, "Knowledge base searched", PALETTE[3]),
        node("resolve", 760, 200, "Agent can resolve?", PALETTE[3], true),
        node("close", 1000, 60, "Yes → close ticket", PALETTE[4]),
        node("so", 1000, 320, "No → S/4HANA Service Order → CS executes → ticket updated", PALETTE[2]),
      ],
      edges: [
        edge("contact", "desk"),
        edge("desk", "ticket"),
        edge("ticket", "kb"),
        edge("ticket", "resolve"),
        edge("resolve", "close"),
        edge("resolve", "so"),
      ],
      details: [
        { nodeId: "contact", title: "Customer contacts", description: "The customer reaches out via any channel — phone, email, chat, or social media.", tips: "Omnichannel means all channels land in one place." },
        { nodeId: "desk", title: "Agent desktop", description: "The Service Cloud front-office interface where agents handle interactions with full context.", tips: "This is the CX layer, not the ERP." },
        { nodeId: "ticket", title: "Ticket created", description: "The interaction becomes a ticket/case with SLA tracking and a Customer 360 history.", tips: "Tickets unify multi-channel conversations." },
        { nodeId: "kb", title: "Knowledge base", description: "Agents search articles (often AI-assisted) to resolve issues quickly.", tips: "Good knowledge bases cut resolution time sharply." },
        { nodeId: "resolve", title: "Resolve decision", description: "The agent decides whether the issue can be closed in the front office or needs back-office work.", tips: "Many issues never need an ERP order." },
        { nodeId: "close", title: "Close ticket", description: "If the agent resolves it directly, the ticket is closed and the customer notified.", tips: "Front-office resolution is fastest and cheapest." },
        { nodeId: "so", title: "Trigger S/4HANA order", description: "If physical work is needed, Service Cloud triggers a CS service order in S/4HANA and tracks completion back to the ticket.", tCode: "IW31", tips: "This is the front-to-back-office handoff that closes the loop." },
      ],
    },
    questions: [
      {
        q: "How does SAP Service Cloud differ from SAP CS / S/4HANA Service?",
        e: "Service Cloud is the customer-facing front office (the contact-centre agent's tool in the CX suite), while SAP CS / S/4HANA Service is the back-office ERP that executes and bills the work. One faces the customer; the other does the work behind the scenes.",
        opts: [
          ["Service Cloud is the front-office CX agent tool; SAP CS is the back-office ERP execution", true],
          ["They are the same product with two names", false],
          ["Service Cloud handles factory maintenance only", false],
          ["Service Cloud is an accounting ledger", false],
        ],
      },
      {
        q: "What does 'omnichannel support' in Service Cloud mean?",
        e: "Omnichannel means phone, email, chat, and social media interactions all come into one unified interface, so an agent keeps full context as a customer moves between channels. It prevents losing track of a conversation that spans multiple channels.",
        opts: [
          ["Phone, email, chat, and social are unified in one interface", true],
          ["The system only supports phone calls", false],
          ["It refers to multiple warehouses for spare parts", false],
          ["It is a type of financial posting", false],
        ],
      },
      {
        q: "What happens when a Service Cloud ticket needs physical back-office work?",
        e: "Service Cloud triggers a CS service order in S/4HANA and tracks its completion back to the ticket. This handoff closes the full loop from customer contact to resolved-and-billed, combining the CX front office with ERP execution.",
        opts: [
          ["Service Cloud triggers an S/4HANA service order and tracks its completion", true],
          ["The ticket is deleted with no further action", false],
          ["The customer is told to call a different company", false],
          ["The equipment master is automatically scrapped", false],
        ],
      },
    ],
  });

  console.log("\n✅ Session 20 complete — SAP Service Management: 17 lessons");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
