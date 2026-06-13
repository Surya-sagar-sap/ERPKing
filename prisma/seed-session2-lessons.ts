// ─── PP: NEW LESSONS ────────────────────────────────────────────────────────
// LESSON 5.3: Demand Management & Sales and Operations Planning (SOP)
const lesson5_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "demand-management-sop" } },
  update: {},
  create: {
    moduleId: ppModule.id,
    title: "Demand Management & SOP",
    slug: "demand-management-sop",
    order: 3,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Anjali plans production at a fan factory. Every summer, demand explodes — but if she waits for actual orders, the factory can never keep up. Her boss asks, "How many fans should we build next quarter, before the orders even arrive?"

Anjali needs to turn a sales forecast into a concrete production plan. That bridge — from "what we think we'll sell" to "what the factory should make" — is exactly what Sales & Operations Planning and Demand Management do in SAP.`,
    content: `## Planning Before the Orders Arrive

Factories can't wait for customer orders to start producing — long lead items would never be ready in time. So companies **plan ahead** using forecasts. SAP has two connected tools for this:

- **Sales & Operations Planning (SOP)** — the high-level plan: "How much will we sell and produce over the coming months?"
- **Demand Management** — converts that plan into precise **Planned Independent Requirements (PIRs)** that drive MRP.

Think of SOP as sketching the big picture, and Demand Management as writing the exact shopping list the factory acts on.

## Step 1: Sales & Operations Planning (SOP)

SOP balances expected demand against the company's capacity to produce. It works at the level of **product groups** (e.g. "all ceiling fans") rather than individual products, so management can plan strategically.

| SOP Element | Meaning |
|-------------|---------|
| Product Group | A family of similar products |
| Sales Plan | Forecasted sales quantities |
| Production Plan | Planned output to meet that demand |

T-codes: **MC81/MC87** (create/change SOP), **MC74** (transfer to Demand Management).

## Step 2: Demand Management — Creating PIRs

Demand Management takes the plan and creates **Planned Independent Requirements (PIRs)** — the forecasted demand for specific products that MRP will plan against. A PIR says: "We expect to need 5,000 fans in July."

- T-code: **MD61** (create PIRs), **MD62** (change).
- PIRs are independent of any sales order — they represent *anticipated* demand.

## How Forecast and Real Orders Combine

This is where **planning strategies** matter (covered in depth later). In **Make-to-Stock**, PIRs let you build to forecast; as real sales orders arrive, they **consume** the PIRs so you don't double-count demand.

## The Full Flow

1. Forecast sales by product group (SOP).
2. Transfer to Demand Management → PIRs per product.
3. MRP reads PIRs and creates planned orders / purchase requisitions.
4. Real sales orders gradually consume the PIRs.

## A Real Example

Anjali's fans:
- SOP forecasts 15,000 fans for the summer quarter.
- Demand Management creates PIRs: 5,000 in May, 5,000 in June, 5,000 in July.
- MRP plans production and component purchases early.
- When real orders arrive in May, they consume that month's PIRs.

The factory is ready *before* the rush — no scramble.

## Why It Matters

Without forecast-driven planning, companies either overstock (wasting cash) or run out (losing sales). SOP and Demand Management let you plan production proactively, smoothing the path from sales expectations to factory action.`,
    keyConceptTitle: "SOP Plans the Big Picture; Demand Management Creates PIRs",
    keyConceptBody: `- **SOP** balances forecasted demand against capacity at the **product group** level (MC81/MC87).
- **Demand Management** turns the plan into **Planned Independent Requirements (PIRs)** for specific products (MD61) that MRP plans against.
- PIRs represent *anticipated* demand; real sales orders later **consume** them so demand isn't double-counted.`,
  },
});
// Flowchart for lesson 5.3
const flowchart5_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson5_3.id },
  update: {},
  create: {
    lessonId: lesson5_3.id,
    title: "From Forecast to Production Plan",
    nodes: [
      { id: "node1", type: "default", position: { x: 80, y: 120 }, data: { label: "📈 Sales Forecast (SOP)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 120 }, data: { label: "🗓️ Demand Mgmt → PIRs (MD61)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 540, y: 120 }, data: { label: "🧠 MRP Run" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 540, y: 250 }, data: { label: "📋 Planned Orders / Pur. Reqs" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 300, y: 250 }, data: { label: "🛒 Sales Orders Consume PIRs" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node5", target: "node2", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart5_3.id, nodeId: "node1", title: "Sales Forecast (SOP)", description: "Sales & Operations Planning forecasts demand at the product-group level and checks it against rough capacity. It's the strategic, big-picture plan.", tCode: "MC81 / MC87", tips: "Plan at product-group level first — planning every single SKU at this stage is overkill." },
    { flowchartId: flowchart5_3.id, nodeId: "node2", title: "Demand Management (PIRs)", description: "Transfers the SOP plan into Planned Independent Requirements — specific forecast quantities per product and period that MRP will plan against.", tCode: "MC74 (transfer), MD61", tips: "PIRs are your forecast made concrete; getting them right is the key to good MRP results." },
    { flowchartId: flowchart5_3.id, nodeId: "node3", title: "MRP Run", description: "MRP reads the PIRs (plus any real orders) and calculates what to make and buy, creating procurement proposals.", tCode: "MD01 / MD02", tips: "MRP treats a PIR like demand — so a wrong forecast produces wrong plans." },
    { flowchartId: flowchart5_3.id, nodeId: "node4", title: "Planned Orders / Pur. Reqs", description: "MRP's output: planned orders for in-house production and purchase requisitions for bought materials, all timed to meet the forecast.", tCode: "MD04", tips: "Review MD04 to see how PIRs translated into concrete supply proposals." },
    { flowchartId: flowchart5_3.id, nodeId: "node5", title: "Sales Orders Consume PIRs", description: "As real customer orders arrive, they consume the forecast (PIRs) so the same demand isn't planned twice.", tCode: "MD04 / MD73", tips: "Watch consumption: leftover unconsumed PIRs at period end may mean the forecast was too high." },
  ],
});
// Quiz for lesson 5.3
await prisma.quiz.upsert({
  where: { lessonId: lesson5_3.id },
  update: {},
  create: {
    lessonId: lesson5_3.id,
    title: "Demand Management & SOP — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does Demand Management create that MRP then plans against?",
          explanation: "Demand Management converts the SOP plan into Planned Independent Requirements (PIRs) — forecasted demand per product and period that MRP uses to calculate what to make and buy.",
          options: {
            create: [
              { text: "Planned Independent Requirements (PIRs)", isCorrect: true },
              { text: "Vendor invoices", isCorrect: false },
              { text: "Purchase orders", isCorrect: false },
              { text: "Cost centers", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does a factory plan production from a forecast instead of waiting for actual sales orders?",
          explanation: "Components and production have lead times. If you wait for real orders, long-lead items won't be ready in time. Forecast-driven planning gets materials and capacity ready before demand hits.",
          options: {
            create: [
              { text: "Lead times mean materials must be planned before orders arrive", isCorrect: true },
              { text: "Sales orders are not allowed in SAP", isCorrect: false },
              { text: "Forecasts are always more accurate than real orders", isCorrect: false },
              { text: "It avoids ever needing to produce anything", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A PIR for 5,000 fans exists in July. A real sales order for 1,000 fans arrives. What ideally happens?",
          explanation: "The sales order consumes part of the forecast, so the PIR effectively reduces to reflect that 1,000 of the anticipated demand is now real. This prevents double-counting the same demand in planning.",
          options: {
            create: [
              { text: "The sales order consumes the forecast so demand isn't double-counted", isCorrect: true },
              { text: "Total demand becomes 6,000 (forecast plus order)", isCorrect: false },
              { text: "The PIR is deleted entirely", isCorrect: false },
              { text: "The sales order is rejected", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 5.4: Capacity Planning & Work Centers
const lesson5_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "capacity-planning-work-centers" } },
  update: {},
  create: {
    moduleId: ppModule.id,
    title: "Capacity Planning & Work Centers",
    slug: "capacity-planning-work-centers",
    order: 4,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Ravi runs the machining shop. MRP just told him to produce 800 gearboxes this week — but his main CNC machine can only handle 500. He's been promising deadlines he can't physically meet, and orders keep slipping.

The missing piece is capacity planning: MRP assumes infinite capacity, but real machines and people have limits. Work centers and capacity planning are how SAP makes the plan match reality.`,
    content: `## MRP Plans Materials — But What About Machines?

A standard MRP run plans *materials* assuming **infinite capacity** — it doesn't check whether your machines can actually do the work in time. That's why you can get a plan that looks fine on paper but is physically impossible. **Capacity Planning** closes that gap.

## Work Centers — Where Work Happens

A **Work Center** represents a machine, a group of machines, a production line, or a team where operations are performed. It's the resource that *has* capacity.

| Work Center holds | Example |
|-------------------|---------|
| Available capacity | 8 hours/day on a CNC machine |
| Formulas for time | How operation time is calculated |
| Costing link | Activity types & rates for CO |
| Scheduling data | Setup, processing, queue times |

T-codes: **CR01/CR02/CR03** (create/change/display work center).

Work centers also appear in **routings** (the steps to make a product) and in **maintenance orders** (PM) — they're a shared backbone.

## Capacity: Available vs Required

- **Available capacity** — what the work center *can* do (e.g. 40 hours/week).
- **Capacity requirements** — what the planned and production orders *demand* of it.

When requirements exceed available capacity, you have **overload** — the situation Ravi is in.

## Capacity Leveling

**Capacity leveling** resolves overloads by rescheduling, shifting work to other periods or work centers, or adjusting capacity (e.g. adding a shift). The classic tool is the **capacity planning table / graphical planning board**.

- T-codes: **CM01** (load analysis), **CM21** (graphical leveling board), **CM25**.

## Finite vs Infinite Scheduling

- **Infinite scheduling** (default MRP) ignores capacity limits.
- **Finite scheduling** respects them — it won't load more than a work center can handle, giving realistic dates.

## A Real Example

Ravi's CNC machine:
- Available: 500 gearboxes/week of capacity.
- MRP requirement: 800 → an overload of 300.
- In **CM21**, Ravi shifts 300 to next week (or to a second machine, or adds a shift).
- Now the schedule is achievable, and deadlines become reliable.

## Why It Matters

Capacity planning turns an idealized material plan into an executable schedule. Without it, you over-promise and miss dates; with it, production commitments are realistic and customers get accurate delivery times.`,
    keyConceptTitle: "Work Centers Hold Capacity; Leveling Fixes Overloads",
    keyConceptBody: `- A **Work Center** (CR01) is the machine/line/team where operations happen and where **capacity** lives.
- Standard MRP assumes **infinite capacity**; comparing **available** vs **required** capacity reveals overloads.
- **Capacity leveling** (CM21) reschedules or redistributes work so the plan becomes physically achievable.`,
  },
});
// Flowchart for lesson 5.4
const flowchart5_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson5_4.id },
  update: {},
  create: {
    lessonId: lesson5_4.id,
    title: "Capacity Planning Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 80, y: 110 }, data: { label: "📋 Orders Need Work" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 110 }, data: { label: "🏭 Work Center Capacity" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 110 }, data: { label: "⚖️ Compare Load vs Available (CM01)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 410, y: 250 }, data: { label: "🚨 Overload Detected" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 620, y: 250 }, data: { label: "🪄 Level Capacity (CM21)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 515, y: 380 }, data: { label: "✅ Achievable Schedule" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart5_4.id, nodeId: "node1", title: "Orders Need Work", description: "Planned and production orders generate operations that must be performed at work centers, creating capacity requirements.", tCode: "MD04 / CO01", tips: "Each routing operation points to a work center and a time, which becomes a capacity demand." },
    { flowchartId: flowchart5_4.id, nodeId: "node2", title: "Work Center Capacity", description: "A work center (machine, line, or team) defines how much capacity is available, plus scheduling and costing data.", tCode: "CR01 / CR02 / CR03", tips: "Define realistic available capacity (shifts, breaks, efficiency) or leveling will be misleading." },
    { flowchartId: flowchart5_4.id, nodeId: "node3", title: "Compare Load vs Available", description: "Capacity load analysis compares required capacity against available capacity per work center and period.", tCode: "CM01 / CM07", tips: "CM01 quickly shows which work centers are overloaded as a percentage." },
    { flowchartId: flowchart5_4.id, nodeId: "node4", title: "Overload Detected", description: "When requirements exceed available capacity, the work center is overloaded — the plan isn't physically achievable as-is.", tCode: "CM01", tips: "Overloads are normal output of infinite MRP; treat them as a to-do list, not a failure." },
    { flowchartId: flowchart5_4.id, nodeId: "node5", title: "Level Capacity", description: "Capacity leveling reschedules or redistributes work — to other periods, other work centers, or by adding shifts.", tCode: "CM21 / CM25", tips: "The graphical board (CM21) lets you drag operations to balance the load visually." },
    { flowchartId: flowchart5_4.id, nodeId: "node6", title: "Achievable Schedule", description: "After leveling, the schedule respects real capacity limits, so promised dates are realistic and reliable.", tCode: "CM21", tips: "Finite scheduling keeps the plan executable so you stop over-promising deadlines." },
  ],
});
// Quiz for lesson 5.4
await prisma.quiz.upsert({
  where: { lessonId: lesson5_4.id },
  update: {},
  create: {
    lessonId: lesson5_4.id,
    title: "Capacity Planning & Work Centers — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A standard MRP run gives a plan that a machine physically cannot complete in time. Why does this happen?",
          explanation: "Standard MRP plans materials assuming infinite capacity — it doesn't check whether work centers can actually do the work in the available time. Capacity planning is what adds that real-world constraint.",
          options: {
            create: [
              { text: "MRP plans assuming infinite capacity and ignores machine limits", isCorrect: true },
              { text: "MRP always doubles every quantity", isCorrect: false },
              { text: "MRP can only plan one product at a time", isCorrect: false },
              { text: "MRP refuses to plan without a sales order", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does a Work Center represent in SAP PP?",
          explanation: "A work center represents the resource where operations are performed — a machine, line, or team. It holds available capacity, scheduling data, and the link to costing (activity types/rates).",
          options: {
            create: [
              { text: "A machine, line, or team where operations are performed", isCorrect: true },
              { text: "A customer's delivery address", isCorrect: false },
              { text: "A type of vendor invoice", isCorrect: false },
              { text: "A finished product's sales price", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A work center needs 800 hours of work but only has 500 available this week. What is the BEST response?",
          explanation: "This is an overload. Capacity leveling (e.g. CM21) resolves it by rescheduling work to another period or work center, or by adding capacity like a shift — making the schedule achievable rather than simply ignoring the limit.",
          options: {
            create: [
              { text: "Use capacity leveling to reschedule or redistribute the excess work", isCorrect: true },
              { text: "Ignore it and promise the original date anyway", isCorrect: false },
              { text: "Delete the production orders", isCorrect: false },
              { text: "Cancel the work center", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 5.5: Repetitive vs Discrete Manufacturing
const lesson5_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "repetitive-vs-discrete-manufacturing" } },
  update: {},
  create: {
    moduleId: ppModule.id,
    title: "Repetitive vs Discrete Manufacturing",
    slug: "repetitive-vs-discrete-manufacturing",
    order: 5,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Two factories use SAP. One makes the same yoghurt cups on a line all day, every day. The other builds custom industrial pumps — each order different, with its own specs. Priya, a consultant, is told both use "PP," but they're set up completely differently.

Why? Because SAP offers two manufacturing styles — repetitive and discrete — and choosing the right one shapes how the whole factory runs in the system.`,
    content: `## Two Styles of Making Things

Not all manufacturing is the same. SAP PP supports two main execution types:

- **Discrete Manufacturing** — distinct production *orders* for specific quantities, often varied products. Think custom pumps, machines, batches of different items.
- **Repetitive Manufacturing (REM)** — continuous, steady production of the *same* products on a line, planned by rate and period rather than individual orders.

Choosing the right style is a fundamental setup decision.

## Discrete Manufacturing

Each production run is a separate **production order** with its own components, operations, and costs (the lifecycle you already learned: create → release → goods issue → confirm → goods receipt → settle).

| Discrete is good for | Why |
|----------------------|-----|
| Varied products | Each order can differ |
| Make-to-order | Order-specific tracking |
| Complex, traceable jobs | Detailed cost per order |

The trade-off: lots of individual orders = more administrative overhead.

## Repetitive Manufacturing (REM)

REM produces the same products continuously. Instead of many orders, you plan **production quantities per period** against a **production version**, and confirm output by **backflushing** (auto-consuming components when you report finished quantity).

| REM is good for | Why |
|-----------------|-----|
| High-volume, stable products | Same thing, every day |
| Flow/line production | No need for separate orders |
| Simplicity | Less paperwork, faster confirmation |

- Key concept: **Run Schedule Quantities** and **planned orders** drive the line.
- T-codes: **MF60** (material staging), **MFBF** (REM backflush/confirmation), **MF50** (planning table).

## Side-by-Side

| Aspect | Discrete | Repetitive |
|--------|----------|------------|
| Unit of control | Production order | Period rate / run schedule |
| Product variety | High | Low (stable) |
| Confirmation | Per order (CO11N) | Backflush (MFBF) |
| Overhead | Higher | Lower |
| Example | Custom pumps | Yoghurt cups |

## A Real Example

- **Pump factory (discrete):** each customer order becomes a production order with specific components and tracked costs.
- **Yoghurt factory (REM):** the line runs continuously; staff backflush 10,000 cups at end of shift, and components are consumed automatically.

## Why It Matters

Picking the right manufacturing type fits SAP to how the factory actually works. Force a high-volume line into discrete orders and you drown in paperwork; force custom jobs into REM and you lose the per-order detail you need. The right choice makes execution smooth and reporting meaningful.`,
    keyConceptTitle: "Discrete = Orders per Job; Repetitive = Rate per Period",
    keyConceptBody: `- **Discrete manufacturing** uses individual **production orders** — best for varied or made-to-order products with detailed per-order tracking.
- **Repetitive manufacturing (REM)** produces the same products continuously, planned by **period/rate** and confirmed by **backflush (MFBF)** — best for high-volume, stable lines.
- The choice shapes control, confirmation, and overhead, so it's matched to how the factory really operates.`,
  },
});
// Flowchart for lesson 5.5
const flowchart5_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson5_5.id },
  update: {},
  create: {
    lessonId: lesson5_5.id,
    title: "Choosing a Manufacturing Type",
    nodes: [
      { id: "node1", type: "default", position: { x: 300, y: 40 }, data: { label: "🏭 What Are You Making?" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 100, y: 170 }, data: { label: "🔧 Varied / Made-to-Order" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 170 }, data: { label: "🥤 Same Product, High Volume" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 100, y: 300 }, data: { label: "📋 Discrete: Production Orders" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 500, y: 300 }, data: { label: "🔁 Repetitive: Rate + Backflush" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart5_5.id, nodeId: "node1", title: "What Are You Making?", description: "The nature of the product decides the manufacturing type: varied/custom items versus the same high-volume product made continuously.", tCode: "N/A", tips: "This decision is set in the material master (MRP/work scheduling views) and config." },
    { flowchartId: flowchart5_5.id, nodeId: "node2", title: "Varied / Made-to-Order", description: "Products that differ per order or are built to specific customer requirements need individual tracking.", tCode: "N/A", tips: "If every job has different components or costs, discrete is usually the right fit." },
    { flowchartId: flowchart5_5.id, nodeId: "node3", title: "Same Product, High Volume", description: "Stable products produced continuously on a line, where individual orders would just add paperwork.", tCode: "N/A", tips: "Steady, repeating output is the signal to consider repetitive manufacturing." },
    { flowchartId: flowchart5_5.id, nodeId: "node4", title: "Discrete: Production Orders", description: "Each run is a production order with its own components, operations, and costs — full per-order traceability.", tCode: "CO01 / CO11N", tips: "Discrete gives the richest cost and tracking detail, at the price of more administration." },
    { flowchartId: flowchart5_5.id, nodeId: "node5", title: "Repetitive: Rate + Backflush", description: "Production is planned by period/rate against a production version and confirmed by backflushing finished quantities.", tCode: "MF50 / MFBF", tips: "Backflush auto-consumes components, making high-volume confirmation fast and simple." },
  ],
});
// Quiz for lesson 5.5
await prisma.quiz.upsert({
  where: { lessonId: lesson5_5.id },
  update: {},
  create: {
    lessonId: lesson5_5.id,
    title: "Repetitive vs Discrete — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "A factory produces the exact same beverage on a line all day, every day. Which manufacturing type fits best?",
          explanation: "Repetitive Manufacturing (REM) suits high-volume, stable products made continuously. It plans by period/rate and confirms via backflush — far less overhead than creating individual production orders.",
          options: {
            create: [
              { text: "Repetitive Manufacturing (REM)", isCorrect: true },
              { text: "Discrete Manufacturing", isCorrect: false },
              { text: "Make-to-Order only", isCorrect: false },
              { text: "Subcontracting only", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "In Repetitive Manufacturing, how are components typically consumed when output is confirmed?",
          explanation: "REM uses backflushing (MFBF): when you report the finished quantity, SAP automatically consumes the components per the BOM. This removes the need for separate manual goods issues per order.",
          options: {
            create: [
              { text: "Automatically via backflush when finished quantity is reported", isCorrect: true },
              { text: "Manually with a separate goods issue for every unit", isCorrect: false },
              { text: "They are never consumed in REM", isCorrect: false },
              { text: "Only the customer can consume them", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why would forcing a high-volume line into discrete production orders be a poor choice?",
          explanation: "Discrete creates a separate order for each run with its own paperwork and confirmation. For a high-volume line that's enormous administrative overhead, whereas REM plans by rate and backflushes — far more efficient.",
          options: {
            create: [
              { text: "It creates excessive order paperwork and overhead for steady output", isCorrect: true },
              { text: "Discrete cannot track costs at all", isCorrect: false },
              { text: "It would make the products defective", isCorrect: false },
              { text: "Discrete is illegal for food products", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 5.6: Shop Floor Control & Production Execution
const lesson5_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "shop-floor-control-execution" } },
  update: {},
  create: {
    moduleId: ppModule.id,
    title: "Shop Floor Control & Execution",
    slug: "shop-floor-control-execution",
    order: 6,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Suresh supervises the assembly floor. A released production order lands on his screen, but he needs the practical answers: What documents do operators get? How do they record that 200 of 500 units are done? How does the office know progress in real time without walking the floor?

That's shop floor control — the day-to-day execution layer that turns a released order into actual finished goods, tracked step by step.`,
    content: `## From Planning to Doing

You've seen how orders are created and planned. **Shop Floor Control (SFC)** is where the work actually happens — releasing orders to the floor, printing documents, recording progress, and feeding real data back to the system.

## Releasing and Printing

A production order must be **released (REL)** before work starts. On release, SAP can print **shop floor papers**:

| Document | Purpose |
|----------|---------|
| Operation list / Routing sheet | The steps to perform |
| Pick list | Components to fetch |
| Goods receipt slip | For receiving finished output |
| Time tickets | To record labor |

## Material Staging

Before production, components must be at the line. **Material staging** issues components from stores to the order (goods issue, movement type **261**), so operators have what they need.

## Confirmations — The Heartbeat of Execution

As work progresses, operators record **confirmations**. A confirmation reports, for an operation: how much was produced, how much scrapped, and time taken.

- **CO11N** — single operation confirmation.
- **CO15** — confirm the whole order.
- Confirmations update order status (**PCNF** partial → **CNF** final) and post actual activity costs.

Partial confirmations let you report "200 of 500 done" so the office sees live progress.

## Automatic Goods Movements

Confirmations can trigger automatic movements:
- **Backflush** — auto-consume components (261) at confirmation.
- **Auto goods receipt** — auto-receive finished goods (101) at final confirmation, if the control key allows.

## Monitoring Progress

Planners and supervisors monitor execution without walking the floor:
- **COOIS** — production order information system (the all-purpose monitor).
- **CO24** — missing parts list.
- Order status tells you exactly where each job stands.

## A Real Example

Suresh's order for 500 housings:
- Order released; routing sheet and pick list printed.
- Components staged to the line (261).
- Shift 1 finishes 200 → operator confirms in **CO11N** (status PCNF).
- Shift 2 finishes the rest → final confirmation (CNF); finished goods auto-received (101).
- Suresh watches all of it live in **COOIS**.

## Why It Matters

Shop floor control connects the system to the physical factory. Accurate, timely confirmations give real-time visibility, correct inventory, and reliable cost data — without anyone manually chasing the floor for updates.`,
    keyConceptTitle: "Shop Floor Control Executes and Confirms the Order",
    keyConceptBody: `- After **release (REL)**, SAP prints shop papers and components are **staged** (goods issue 261) to the order.
- Operators record **confirmations** (CO11N/CO15) of quantity, scrap, and time — moving status PCNF → CNF and posting actual costs.
- Confirmations can trigger **backflush** (auto-consume 261) and **auto goods receipt** (101); monitor everything live in **COOIS**.`,
  },
});
// Flowchart for lesson 5.6
const flowchart5_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson5_6.id },
  update: {},
  create: {
    lessonId: lesson5_6.id,
    title: "Shop Floor Execution Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🚀 Release Order (REL)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 110 }, data: { label: "📦 Stage Components (261)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 450, y: 110 }, data: { label: "🛠️ Perform Operations" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 650, y: 110 }, data: { label: "✅ Confirm (CO11N)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 550, y: 250 }, data: { label: "📥 Auto Goods Receipt (101)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 330, y: 250 }, data: { label: "📊 Monitor (COOIS)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
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
    { flowchartId: flowchart5_6.id, nodeId: "node1", title: "Release Order", description: "Releasing changes status to REL and authorizes the floor to begin. Shop papers (routing sheet, pick list) can print on release.", tCode: "CO02 / CO05N", tips: "No goods movements or confirmations are allowed until the order is released." },
    { flowchartId: flowchart5_6.id, nodeId: "node2", title: "Stage Components", description: "Components are issued from stores to the order (movement type 261) so operators have the materials they need at the line.", tCode: "MIGO (261) / MF60", tips: "Staging shortages show up in CO24 (missing parts) before they stall the line." },
    { flowchartId: flowchart5_6.id, nodeId: "node3", title: "Perform Operations", description: "Operators carry out the routing steps at the assigned work centers, producing the finished quantity.", tCode: "N/A", tips: "Routing operations define the sequence, work centers, and standard times for the job." },
    { flowchartId: flowchart5_6.id, nodeId: "node4", title: "Confirm", description: "Confirmations record produced quantity, scrap, and time. Status moves PCNF (partial) → CNF (final), posting actual activity costs.", tCode: "CO11N / CO15", tips: "Partial confirmations give live progress like '200 of 500 done' without waiting for completion." },
    { flowchartId: flowchart5_6.id, nodeId: "node5", title: "Auto Goods Receipt", description: "If the control key allows, final confirmation auto-receives finished goods into stock (movement type 101).", tCode: "MIGO (101)", tips: "Auto goods receipt at final confirmation saves a manual step for standard products." },
    { flowchartId: flowchart5_6.id, nodeId: "node6", title: "Monitor (COOIS)", description: "Supervisors track order status, confirmed quantities, and issues in real time without visiting the floor.", tCode: "COOIS / CO24", tips: "COOIS is the Swiss-army monitor for production orders — learn its layouts well." },
  ],
});
// Quiz for lesson 5.6
await prisma.quiz.upsert({
  where: { lessonId: lesson5_6.id },
  update: {},
  create: {
    lessonId: lesson5_6.id,
    title: "Shop Floor Control & Execution — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does an operator record in a production confirmation (CO11N)?",
          explanation: "A confirmation reports the produced quantity, any scrap, and the time taken for an operation. It updates order status and posts actual activity costs, giving real-time visibility into progress.",
          options: {
            create: [
              { text: "Produced quantity, scrap, and time taken for an operation", isCorrect: true },
              { text: "The customer's payment terms", isCorrect: false },
              { text: "The vendor's bank account", isCorrect: false },
              { text: "The sales price of the product", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why are partial confirmations useful during a production run?",
          explanation: "Partial confirmations (status PCNF) let the floor report progress like '200 of 500 done' before the order is fully complete, giving the office live visibility instead of an all-or-nothing update at the end.",
          options: {
            create: [
              { text: "They give live progress visibility before the order is fully complete", isCorrect: true },
              { text: "They cancel the production order", isCorrect: false },
              { text: "They are required to create the order", isCorrect: false },
              { text: "They increase the sales price automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "How can a supervisor see the status of all production orders without walking the floor?",
          explanation: "COOIS (the production order information system) is the all-purpose monitor showing order status, confirmed quantities, and issues in real time — driven by the confirmations operators post.",
          options: {
            create: [
              { text: "By using COOIS, the production order information system", isCorrect: true },
              { text: "By running the dunning program", isCorrect: false },
              { text: "By posting a vendor invoice", isCorrect: false },
              { text: "There is no way to see status in SAP", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 5.7: Subcontracting in PP
const lesson5_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "subcontracting-in-pp" } },
  update: {},
  create: {
    moduleId: ppModule.id,
    title: "Subcontracting in PP",
    slug: "subcontracting-in-pp",
    order: 7,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Meena's company builds furniture but doesn't do its own metal plating. So they send raw brackets to a plating vendor, who coats them and sends them back ready to assemble. Meena needs SAP to track materials that physically leave the building, get processed by someone else, and return — without losing sight of who owns what.

That's subcontracting: outsourcing a production step to an external vendor while SAP keeps the inventory and costs straight.`,
    content: `## What Is Subcontracting?

**Subcontracting** is when you send your own components to an **external vendor** who performs a processing step and returns a finished or semi-finished product. You provide the materials; they provide the work.

Think of it like sending fabric to a tailor: you supply the cloth, the tailor stitches it, and you get back a shirt — but the cloth was always yours.

## The Key Idea: You Still Own the Materials

Even though components physically sit at the vendor's site, **they remain your inventory** — tracked as **stock provided to vendor** (special stock category "O"). SAP never loses track of what's yours.

## The Subcontracting Process

| Step | What happens | T-code |
|------|--------------|--------|
| 1. Subcontract PO | Create a PO with item category **L** for the finished part | ME21N |
| 2. Provide components | Send your components to the vendor (movement **541**) | MIGO / ME2O |
| 3. Vendor processes | The vendor performs the work (outside SAP) | — |
| 4. Goods receipt | Receive the finished part; components consumed (**543**) | MIGO (101) |
| 5. Invoice | Pay the vendor for the *service* (the processing fee) | MIRO |

## The Subcontracting BOM

The subcontract PO has a **BOM of the components** you must supply. When you receive the finished part, SAP automatically **consumes** those components from the stock-provided-to-vendor (movement 543). So receiving 100 plated brackets automatically uses up the 100 raw brackets you sent.

## What You Pay For

You don't pay for a whole product — you pay the **subcontracting charge** (the value the vendor *adds*). Your component cost is already yours; the vendor invoices only their processing service.

## Monitoring Vendor Stock

- **ME2O** — monitor and provide components for subcontract POs.
- **MBLB** — stock at the subcontractor.

These let you see exactly what you've sent and what's still out there.

## A Real Example

Meena's plated brackets:
- Subcontract PO (item category L) for 100 plated brackets.
- Send 100 raw brackets to the plater (movement 541) — still her inventory at the vendor.
- Plater coats them and returns them.
- Goods receipt of 100 plated brackets → the 100 raw brackets auto-consumed (543).
- Vendor invoices only the plating fee (MIRO).

## Why It Matters

Subcontracting lets companies outsource specialized steps without losing inventory control or cost accuracy. SAP tracks your materials at the vendor, auto-consumes them on receipt, and charges only the added value — keeping the books correct even when work happens outside your walls.`,
    keyConceptTitle: "Subcontracting = Send Your Components, Pay for the Vendor's Work",
    keyConceptBody: `- **Subcontracting** outsources a processing step: you supply components (item category **L** PO) and the vendor returns the processed part.
- Your components stay **your inventory** as stock-provided-to-vendor (sent via movement **541**); on goods receipt they're auto-consumed (**543**).
- You pay only the **subcontracting charge** (the vendor's added value); monitor provided stock with **ME2O / MBLB**.`,
  },
});
// Flowchart for lesson 5.7
const flowchart5_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson5_7.id },
  update: {},
  create: {
    lessonId: lesson5_7.id,
    title: "Subcontracting Process",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "📋 Subcontract PO (Cat. L)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 260, y: 110 }, data: { label: "📤 Provide Components (541)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 110 }, data: { label: "🏭 Vendor Processes" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 660, y: 110 }, data: { label: "📥 Goods Receipt (101) + Consume (543)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 470, y: 250 }, data: { label: "🧾 Invoice the Service (MIRO)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart5_7.id, nodeId: "node1", title: "Subcontract PO (Cat. L)", description: "A purchase order with item category L tells SAP this is subcontracting. It carries a BOM of the components you must supply for the finished part.", tCode: "ME21N", tips: "Item category L is the flag that turns a normal PO into a subcontracting PO." },
    { flowchartId: flowchart5_7.id, nodeId: "node2", title: "Provide Components (541)", description: "You send components to the vendor with movement type 541. They become 'stock provided to vendor' — still your inventory, just located off-site.", tCode: "MIGO (541) / ME2O", tips: "Use ME2O to see what each subcontractor still holds of your material." },
    { flowchartId: flowchart5_7.id, nodeId: "node3", title: "Vendor Processes", description: "The vendor performs the outsourced step (plating, machining, assembly) outside SAP, using the components you provided.", tCode: "N/A", tips: "Agree clear specs and lead times — SAP tracks stock, not the vendor's quality." },
    { flowchartId: flowchart5_7.id, nodeId: "node4", title: "Goods Receipt + Consume", description: "Receiving the finished part (101) automatically consumes the provided components (543) per the subcontract BOM.", tCode: "MIGO (101/543)", tips: "If consumption looks wrong, check the subcontract BOM quantities on the PO." },
    { flowchartId: flowchart5_7.id, nodeId: "node5", title: "Invoice the Service", description: "The vendor invoices only the subcontracting charge — the value they added — not the whole product, since the components were already yours.", tCode: "MIRO", tips: "Verify the subcontract charge against the PO; you're paying for work, not materials." },
  ],
});
// Quiz for lesson 5.7
await prisma.quiz.upsert({
  where: { lessonId: lesson5_7.id },
  update: {},
  create: {
    lessonId: lesson5_7.id,
    title: "Subcontracting in PP — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "When you send components to a subcontract vendor, who owns that stock?",
          explanation: "The components remain YOUR inventory, tracked as 'stock provided to vendor' (special stock). They're just physically located at the vendor's site — SAP never loses track of your ownership.",
          options: {
            create: [
              { text: "You still own it — it's tracked as stock provided to vendor", isCorrect: true },
              { text: "The vendor owns it the moment it ships", isCorrect: false },
              { text: "Ownership is split 50/50", isCorrect: false },
              { text: "Nobody owns it until it's sold", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does the company actually pay the subcontractor for?",
          explanation: "You pay only the subcontracting charge — the value the vendor adds through their processing service. The component cost was already yours, so it isn't part of the vendor's invoice.",
          options: {
            create: [
              { text: "Only the processing service (the value the vendor adds)", isCorrect: true },
              { text: "The full retail price of the finished product", isCorrect: false },
              { text: "The cost of the components plus a markup", isCorrect: false },
              { text: "Nothing — subcontracting is always free", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "When you receive 100 finished parts from the subcontractor, what happens to the components you provided?",
          explanation: "Goods receipt of the finished part (movement 101) automatically consumes the provided components (movement 543) according to the subcontract BOM — so receiving 100 finished parts uses up the components for 100 parts.",
          options: {
            create: [
              { text: "They are automatically consumed (543) per the subcontract BOM", isCorrect: true },
              { text: "They are returned to you unused", isCorrect: false },
              { text: "They stay on your books forever", isCorrect: false },
              { text: "They become the vendor's property", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 5.8: Batch Management in Production
const lesson5_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "batch-management-production" } },
  update: {},
  create: {
    moduleId: ppModule.id,
    title: "Batch Management in Production",
    slug: "batch-management-production",
    order: 8,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Kiran works at a pharmaceutical plant. One day a regulator calls: "A specific lot of medicine may be contaminated — recall exactly that lot, and tell us which raw materials went into it and which customers received it." If Kiran can't trace it precisely, the company must recall everything — a disaster.

Batch management is what makes precise traceability possible: every production lot gets a unique batch number that follows it from raw material to customer.`,
    content: `## What Is a Batch?

A **batch** is a specific quantity of a material produced together, sharing the same characteristics (e.g. the same production run, expiry date, or quality grade). Each batch gets a **unique batch number** so it can be tracked individually.

Think of it like a **lot number** on a food package — it identifies exactly which production run that item came from.

## Why Batches Matter

Batch management is essential in industries like **pharma, food, and chemicals** where you must answer:
- Which raw material lots went into this finished batch?
- Which customers received a given batch?
- When does this batch expire?

This is **traceability** — and it's often a legal requirement.

## Batch Characteristics

Batches can carry **characteristics** (via the Classification system) such as potency, expiry date, country of origin, or quality grade. This lets you search and select batches by their properties — e.g. "find batches expiring within 30 days."

## Batches in the Production Flow

| Stage | Batch role |
|-------|-----------|
| Goods receipt of raw material | Each incoming lot gets a batch number |
| Component issue to order | The specific batch consumed is recorded |
| Production goods receipt | The finished output gets its own batch number |
| Delivery to customer | The batch shipped is recorded |

This unbroken chain enables **batch where-used** analysis in both directions.

## Batch Determination

**Batch determination** automatically selects which batch to use based on rules — for example **FIFO** (oldest first) or **shelf-life expiration date (SLED)** so near-expiry stock ships first.

## Key Batch T-Codes

| T-Code | Purpose |
|--------|---------|
| MSC1N / MSC2N / MSC3N | Create / Change / Display a batch |
| MB56 | Batch where-used list (traceability) |
| MMBE | Stock by batch |

## A Real Example

Kiran's medicine batch:
- Raw API received as batch **API-2401**.
- Production consumes API-2401 → finished medicine produced as batch **MED-7788** (with expiry date).
- MED-7788 ships to three hospitals (recorded).
- Recall call: Kiran runs **MB56** on MED-7788 → instantly sees it used API-2401 and went to those three hospitals. Only that lot is recalled.

## Why It Matters

Batch management turns a potential company-wide recall into a precise, limited one. It provides the traceability regulators demand, manages expiry dates, and protects both customers and the company's reputation — all built into the production flow.`,
    keyConceptTitle: "Batches Give Each Production Lot a Traceable Identity",
    keyConceptBody: `- A **batch** is a uniquely numbered quantity of material sharing the same characteristics (run, expiry, grade) — like a lot number.
- Batches enable **full traceability** (raw lot → finished lot → customer), essential in pharma, food, and chemicals; trace with **MB56**.
- **Batch determination** auto-selects batches by rules like **FIFO** or **shelf-life (SLED)** so the right stock is used first.`,
  },
});
// Flowchart for lesson 5.8
const flowchart5_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson5_8.id },
  update: {},
  create: {
    lessonId: lesson5_8.id,
    title: "Batch Traceability Through Production",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "📥 Raw Material Batch In" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 260, y: 110 }, data: { label: "🔧 Issued to Production Order" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 110 }, data: { label: "🏭 Finished Batch Created" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 680, y: 110 }, data: { label: "🚚 Batch Shipped to Customer" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 370, y: 250 }, data: { label: "🔎 Where-Used Trace (MB56)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart5_8.id, nodeId: "node1", title: "Raw Material Batch In", description: "Each incoming lot of raw material is assigned a unique batch number at goods receipt, often capturing expiry date and origin.", tCode: "MIGO / MSC1N", tips: "Capture expiry (SLED) at receipt so shelf-life rules can work later." },
    { flowchartId: flowchart5_8.id, nodeId: "node2", title: "Issued to Production", description: "When components are issued to a production order, SAP records exactly which batch was consumed — the link between raw and finished lots.", tCode: "MIGO (261)", tips: "Batch-managed components require you to specify the batch at goods issue." },
    { flowchartId: flowchart5_8.id, nodeId: "node3", title: "Finished Batch Created", description: "The production output receives its own batch number (with its own expiry/characteristics), linked to the raw batches consumed.", tCode: "MIGO (101)", tips: "The finished batch inherits a traceable link to every component batch used." },
    { flowchartId: flowchart5_8.id, nodeId: "node4", title: "Batch Shipped", description: "When the finished batch ships, the delivery records which batch went to which customer, completing the chain.", tCode: "VL01N", tips: "Batch determination can auto-pick the batch (e.g. nearest expiry first) at delivery." },
    { flowchartId: flowchart5_8.id, nodeId: "node5", title: "Where-Used Trace", description: "Batch where-used analysis traces in both directions: which raw lots made a finished batch, and which customers received it.", tCode: "MB56", tips: "MB56 turns a broad recall into a precise one — the core payoff of batch management." },
  ],
});
// Quiz for lesson 5.8
await prisma.quiz.upsert({
  where: { lessonId: lesson5_8.id },
  update: {},
  create: {
    lessonId: lesson5_8.id,
    title: "Batch Management — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is a 'batch' in SAP?",
          explanation: "A batch is a uniquely numbered quantity of a material produced together, sharing the same characteristics (production run, expiry date, quality grade). The unique number lets it be tracked individually — like a lot number.",
          options: {
            create: [
              { text: "A uniquely numbered quantity of material sharing the same characteristics", isCorrect: true },
              { text: "A customer's purchase order", isCorrect: false },
              { text: "A type of work center", isCorrect: false },
              { text: "A payroll wage type", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A regulator asks which customers received a specific contaminated lot. How does batch management help?",
          explanation: "Batch where-used analysis (MB56) traces a finished batch both backward (which raw lots went into it) and forward (which customers received it). This enables a precise recall of just that lot instead of everything.",
          options: {
            create: [
              { text: "Where-used tracing shows exactly which customers got that batch", isCorrect: true },
              { text: "It automatically refunds all customers", isCorrect: false },
              { text: "It deletes the batch from history", isCorrect: false },
              { text: "It has no role in recalls", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What does batch determination using the shelf-life expiration date (SLED) achieve?",
          explanation: "SLED-based batch determination automatically selects near-expiry batches first, so stock closest to expiring is used or shipped before it goes bad — critical for food and pharma.",
          options: {
            create: [
              { text: "It selects near-expiry batches first so stock is used before it expires", isCorrect: true },
              { text: "It always picks the newest batch", isCorrect: false },
              { text: "It deletes expired batches automatically", isCorrect: false },
              { text: "It sets the product's sales price", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 5.9: PP-MM Integration
const lesson5_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "pp-mm-integration" } },
  update: {},
  create: {
    moduleId: ppModule.id,
    title: "PP-MM Integration",
    slug: "pp-mm-integration",
    order: 9,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Arjun plans production of bicycles. To build 500 bikes he needs wheels, frames, and chains — but the company buys those parts from suppliers. Arjun doesn't raise purchase orders himself, yet somehow the right parts get ordered exactly when needed. He wonders: how does my production plan automatically tell purchasing what to buy?

That invisible handshake between making and buying is PP-MM integration — one of the most important connections in SAP.`,
    content: `## Making Needs Buying

A factory rarely makes everything from scratch — it buys raw materials and components, then assembles them. **PP-MM integration** is how the production side (PP) automatically tells the purchasing side (MM) what to procure, and how received goods flow back into production.

## The Trigger: MRP Explodes the BOM

When MRP runs against demand, it **explodes the BOM** — breaking a finished product into its components. For each component it checks: do we make it or buy it? This is driven by the material's **procurement type**:

| Procurement Type | Meaning | MRP creates |
|------------------|---------|-------------|
| **E** (in-house) | We produce it | Planned order |
| **F** (external) | We buy it | Purchase requisition |

So MRP creates **purchase requisitions** for bought components — the bridge into MM.

## The Handoff Chain

1. **MRP** finds a component shortage → creates a **purchase requisition** (PR).
2. **MM** converts the PR into a **purchase order** (the procure-to-pay process you learned).
3. Vendor delivers → **goods receipt (101)** increases component stock.
4. Production **issues** that stock to the order (movement **261**).
5. The component is consumed; finished goods are produced.

PP says "I need it," MM gets it, and it flows right back into production.

## Consumption-Based vs Planning

Some components (cheap, fast-moving) use **consumption-based planning** (reorder point) instead of demand-driven MRP — when stock drops below a set level, MM reorders automatically. Either way, the result is a purchase requisition.

## Why GR/IR and Stock Tie Together

When purchased components arrive (GR 101), stock rises and the GR/IR account is credited (the MM/FI concept). That stock is exactly what production then consumes — so the same material flows from purchasing, into inventory, into the production order.

## Key Integration T-Codes

| T-Code | Purpose |
|--------|---------|
| MD04 | Stock/requirements list (see PRs created by MRP) |
| MD01/MD02 | MRP run |
| ME21N | Convert PR to PO |
| MIGO | Goods receipt of components (101), issue to order (261) |

## A Real Example

Arjun's 500 bikes:
- MRP explodes the BOM → needs 1,000 wheels (buy), 500 frames (buy).
- For each, MRP creates a **purchase requisition**.
- MM converts them to POs; vendors deliver; goods receipt raises stock.
- Production issues wheels and frames to the order (261) and assembles the bikes.

Arjun never raised a PO — the plan did the asking.

## Why It Matters

PP-MM integration means production plans automatically drive purchasing, so the right components arrive just in time without manual coordination. Break this link and you get either stockouts (line stops) or excess inventory (cash wasted). It's the backbone of make-and-buy manufacturing.`,
    keyConceptTitle: "MRP Turns Production Demand into Purchase Requisitions",
    keyConceptBody: `- MRP **explodes the BOM** and, based on **procurement type**, creates **planned orders** (in-house, E) or **purchase requisitions** (external, F).
- Purchase requisitions hand off to **MM**: PR → PO → goods receipt (101) → issue to production order (261).
- This automatic link means production plans drive purchasing just in time, with no manual PO creation by planners.`,
  },
});
// Flowchart for lesson 5.9
const flowchart5_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson5_9.id },
  update: {},
  create: {
    lessonId: lesson5_9.id,
    title: "How Production Triggers Procurement",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🧠 MRP Explodes BOM" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 270, y: 110 }, data: { label: "📝 Purchase Requisition" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 470, y: 110 }, data: { label: "📋 Purchase Order (ME21N)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 680, y: 110 }, data: { label: "📥 Goods Receipt (101)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 580, y: 250 }, data: { label: "🔧 Issue to Production (261)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 360, y: 250 }, data: { label: "🏭 Produce Finished Goods" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart5_9.id, nodeId: "node1", title: "MRP Explodes BOM", description: "MRP breaks the finished product into components and checks each one's procurement type to decide make versus buy.", tCode: "MD01 / MD02", tips: "Procurement type E = make (planned order), F = buy (purchase requisition)." },
    { flowchartId: flowchart5_9.id, nodeId: "node2", title: "Purchase Requisition", description: "For bought components, MRP creates a purchase requisition — the internal request that hands demand over to MM.", tCode: "MD04 / ME51N", tips: "Review PRs in MD04; they're the visible link from your plan into purchasing." },
    { flowchartId: flowchart5_9.id, nodeId: "node3", title: "Purchase Order", description: "MM converts the requisition into a purchase order to the vendor — the start of procure-to-pay.", tCode: "ME21N / ME57", tips: "Source lists and info records help MM pick the right vendor automatically." },
    { flowchartId: flowchart5_9.id, nodeId: "node4", title: "Goods Receipt (101)", description: "The vendor delivers; goods receipt raises component stock and credits GR/IR (the MM-FI link).", tCode: "MIGO (101)", tips: "Stock must be unrestricted and available before production can consume it." },
    { flowchartId: flowchart5_9.id, nodeId: "node5", title: "Issue to Production (261)", description: "The received components are issued to the production order (movement 261), charging their cost to the order.", tCode: "MIGO (261)", tips: "Backflushing can auto-issue components at confirmation instead of a manual 261." },
    { flowchartId: flowchart5_9.id, nodeId: "node6", title: "Produce Finished Goods", description: "With components consumed, the order is completed and finished goods are received into stock — closing the make-and-buy loop.", tCode: "MIGO (101)", tips: "A missing component (CO24) here usually traces back to a delayed PR or PO." },
  ],
});
// Quiz for lesson 5.9
await prisma.quiz.upsert({
  where: { lessonId: lesson5_9.id },
  update: {},
  create: {
    lessonId: lesson5_9.id,
    title: "PP-MM Integration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "When MRP determines a bought component is short, what does it create to trigger purchasing?",
          explanation: "For externally procured components (procurement type F), MRP creates a purchase requisition. MM then converts it into a purchase order — this is the core PP-to-MM handoff.",
          options: {
            create: [
              { text: "A purchase requisition", isCorrect: true },
              { text: "A sales order", isCorrect: false },
              { text: "A billing document", isCorrect: false },
              { text: "A maintenance notification", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How does MRP decide whether to create a planned order or a purchase requisition for a component?",
          explanation: "The material's procurement type drives the decision: type E (in-house) creates a planned order to produce it, while type F (external) creates a purchase requisition to buy it.",
          options: {
            create: [
              { text: "By the material's procurement type (in-house vs external)", isCorrect: true },
              { text: "Randomly each MRP run", isCorrect: false },
              { text: "By the customer's payment terms", isCorrect: false },
              { text: "By the work center's color", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A planner never raises purchase orders, yet components arrive just in time for production. Why?",
          explanation: "PP-MM integration automates it: MRP creates purchase requisitions from the production plan, MM converts them to POs, goods are received, and the stock is issued back to the production order — all triggered by the plan, not manual effort.",
          options: {
            create: [
              { text: "MRP automatically creates requisitions that MM turns into orders", isCorrect: true },
              { text: "The vendor guesses what to send", isCorrect: false },
              { text: "Production never actually uses bought parts", isCorrect: false },
              { text: "Finance manually orders everything", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 5.10: PP-CO Integration (Production Cost Analysis)
const lesson5_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "pp-co-integration" } },
  update: {},
  create: {
    moduleId: ppModule.id,
    title: "PP-CO Integration",
    slug: "pp-co-integration",
    order: 10,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Lakshmi, a cost analyst, asks a sharp question: "We planned each pump to cost ₹8,000 to make — but did it really? And if it cost more, where did the extra go: materials, labor, or machine time?" The production team can build pumps, but nobody can clearly say what each one actually costs.

PP-CO integration answers exactly that — it turns every production order into a cost story, comparing planned versus actual and explaining the difference.`,
    content: `## Production Has a Cost Side

Every production order isn't just a build instruction — it's also a **cost collector**. As components and labor go into it, costs pile up. **PP-CO integration** is how Production Planning feeds Controlling so you can see what things really cost.

## The Production Order as a Cost Object

When a production order is created, SAP calculates its **planned cost** (a preliminary costing) from:
- **Material costs** — components from the BOM × their prices.
- **Activity costs** — operation times from the routing × work center activity rates (setup, machine, labor).
- **Overhead** — surcharges applied via costing sheets.

As the order runs, **actual costs** accumulate:

| Event | Actual cost charged |
|-------|---------------------|
| Goods issue of components (261) | Material cost |
| Confirmation of operations (CO11N) | Activity cost (labor/machine time) |
| Overhead calculation | Applied overhead |

And the order is **credited** when finished goods are received (101) at standard/planned value.

## The Heart: Planned vs Actual = Variance

Because the order collects planned and actual costs, the difference is the **variance**:

> Variance = Actual costs incurred − Value of goods received

Variances are categorized (price variance, quantity/usage variance, etc.) so you can see *why* it cost more — e.g. components were more expensive, or operations took longer than planned.

## Settlement Posts the Variance

At period-end, **settlement (KO88)** clears the order: the variance is posted to Controlling (e.g. to a price-difference account / profitability analysis). This is the moment the cost story is finalized in the books.

## Where to See the Costs

- **CO03 → Costs** or **KKF1/KKBC_ORD** — order cost analysis (planned vs actual vs variance).
- **COOIS** — mass view across orders.

## Key PP-CO T-Codes

| T-Code | Purpose |
|--------|---------|
| CO03 | Display production order (incl. cost view) |
| KKBC_ORD | Order cost analysis (planned/actual/variance) |
| CO11N / MIGO | Postings that create actual costs |
| KO88 / CO88 | Order settlement (single / collective) |

## A Real Example

Lakshmi's pump order (planned ₹8,000/unit):
- Components issued (261): actual material cost lands on the order.
- Operations confirmed (CO11N): actual machine and labor cost charged.
- Finished pump received (101): order credited at ₹8,000 standard.
- Actual came to ₹8,600 → a ₹600 variance. Analysis shows ₹400 from pricier steel, ₹200 from extra machine time.
- **KO88** settles the ₹600 variance to CO. Now Lakshmi knows exactly what it cost and why.

## Why It Matters

PP-CO integration converts physical production into financial truth. It reveals real product cost, explains variances, and feeds profitability analysis — letting management price correctly, control costs, and spot inefficiencies on the shop floor.`,
    keyConceptTitle: "The Production Order Collects Costs; Variance = Actual − Received",
    keyConceptBody: `- A production order is a **cost collector**: it gets a **planned cost** (BOM materials + routing activities + overhead) and accumulates **actual costs** as it runs.
- Goods issues (261) add material cost, confirmations (CO11N) add activity cost, and goods receipt (101) credits the order at standard value.
- The **variance** (actual − received value) is analyzed by type and posted to CO at **settlement (KO88)** — revealing true cost and why it differed.`,
  },
});
// Flowchart for lesson 5.10
const flowchart5_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson5_10.id },
  update: {},
  create: {
    lessonId: lesson5_10.id,
    title: "Production Cost Flow (PP-CO)",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🧮 Planned Cost (Preliminary Costing)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 60 }, data: { label: "📤 Material Cost (261)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 280, y: 170 }, data: { label: "⏱️ Activity Cost (CO11N)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 500, y: 110 }, data: { label: "📥 Order Credited at GR (101)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 720, y: 110 }, data: { label: "📊 Variance = Actual − Received" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 720, y: 250 }, data: { label: "💰 Settlement to CO (KO88)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node4", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
      { id: "e6", source: "node5", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart5_10.id, nodeId: "node1", title: "Planned Cost", description: "When the order is created, SAP computes a preliminary cost from BOM material prices, routing activity times × rates, and overhead.", tCode: "CO01 / CK11N", tips: "Planned cost is your benchmark — the variance later measures reality against it." },
    { flowchartId: flowchart5_10.id, nodeId: "node2", title: "Material Cost (261)", description: "Issuing components to the order (movement 261) charges their actual material cost to the order.", tCode: "MIGO (261)", tips: "Using a different (pricier) batch or more components than planned drives material variance." },
    { flowchartId: flowchart5_10.id, nodeId: "node3", title: "Activity Cost (CO11N)", description: "Confirming operations charges actual labor and machine time, valued at the work center's activity rates.", tCode: "CO11N", tips: "Longer-than-planned operation times create activity (efficiency) variance." },
    { flowchartId: flowchart5_10.id, nodeId: "node4", title: "Order Credited at GR", description: "Receiving the finished product (101) credits the order at standard/planned value — the offset against accumulated actual costs.", tCode: "MIGO (101)", tips: "If the order is debited more than this credit, you have an unfavorable variance." },
    { flowchartId: flowchart5_10.id, nodeId: "node5", title: "Variance", description: "The difference between accumulated actual costs and the credited value, broken into types (price, quantity, etc.) to explain why.", tCode: "KKBC_ORD", tips: "Variance categories tell you whether materials, labor, or overhead caused the gap." },
    { flowchartId: flowchart5_10.id, nodeId: "node6", title: "Settlement to CO", description: "At period-end, settlement clears the order and posts the variance to Controlling (e.g. price-difference / profitability analysis).", tCode: "KO88 / CO88", tips: "Run settlement as part of month-end so production costs are finalized in the books." },
  ],
});
// Quiz for lesson 5.10
await prisma.quiz.upsert({
  where: { lessonId: lesson5_10.id },
  update: {},
  create: {
    lessonId: lesson5_10.id,
    title: "PP-CO Integration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Why is a production order described as a 'cost collector'?",
          explanation: "As the order runs, it accumulates actual costs — material from goods issues (261), activity from confirmations (CO11N), and overhead — and is credited at goods receipt. This makes it the object where production costs are gathered and compared to plan.",
          options: {
            create: [
              { text: "It accumulates material, activity, and overhead costs as it runs", isCorrect: true },
              { text: "It physically stores cash on the shop floor", isCorrect: false },
              { text: "It collects customer payments", isCorrect: false },
              { text: "It has no connection to costs", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "A pump was planned to cost ₹8,000 but actually cost ₹8,600. What is the ₹600, and where does it go?",
          explanation: "The ₹600 is the production variance (actual costs minus the value credited at goods receipt). At settlement (KO88), this variance is posted to Controlling, finalizing the order's cost story in the books.",
          options: {
            create: [
              { text: "It's the variance, posted to CO at settlement (KO88)", isCorrect: true },
              { text: "It's profit paid to the operator", isCorrect: false },
              { text: "It's deleted and ignored", isCorrect: false },
              { text: "It's charged to the customer automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Production cost ₹400 more because steel was pricier and ₹200 more due to extra machine time. What does PP-CO let you do with this?",
          explanation: "Because variances are categorized (e.g. material price variance vs activity/efficiency variance), PP-CO lets you see WHY the cost differed — not just that it did. This pinpoints whether materials, labor, or machine time drove the overrun.",
          options: {
            create: [
              { text: "Break the variance into categories to see exactly why cost differed", isCorrect: true },
              { text: "Only see that there was a total difference, with no detail", isCorrect: false },
              { text: "Automatically lower the steel price", isCorrect: false },
              { text: "Nothing — variances can't be analyzed", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── HCM: NEW LESSONS ───────────────────────────────────────────────────────
// LESSON 6.3: Personnel Actions (PA40)
const lesson6_3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "personnel-actions-pa40" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "Personnel Actions (PA40)",
    slug: "personnel-actions-pa40",
    order: 3,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "BEGINNER",
    xpReward: 75,
    story: `Deepa in HR has to hire a new employee. She knows employee data lives in infotypes, but there are dozens of them — personal data, address, pay, bank details. Does she really open each one separately and hope she doesn't forget any? Her manager says, "Just run the hiring action in PA40."

Personnel Actions are HR's guided checklists: they walk you through every infotype a life event needs, in the right order, so nothing is missed.`,
    content: `## The Problem Actions Solve

An employee's data is spread across many **infotypes** (personal data 0002, address 0006, pay 0008, and more). For a big event like hiring, maintaining each one separately is slow and error-prone — miss one and payroll breaks.

A **Personnel Action** bundles the right infotypes into a guided sequence. It's like a **wizard**: SAP presents each required infotype one after another so you complete the whole event correctly.

## What Is PA40?

**PA40** is the transaction for running personnel actions. You pick an **action type** (Hiring, Transfer, Promotion, Termination), and SAP guides you through exactly the infotypes that event needs.

## Common Action Types

| Action | What it does | Key infotypes touched |
|--------|--------------|------------------------|
| **Hiring** | Bring a new employee in | 0000, 0001, 0002, 0006, 0007, 0008, 0009 |
| **Organizational Change / Transfer** | Move to a new position/department | 0000, 0001 |
| **Promotion / Pay Change** | New role or salary | 0000, 0001, 0008 |
| **Termination / Leaving** | Exit the company | 0000, 0001 (delimit records) |

## Infotype 0000 — The Action Record

Every action writes **Infotype 0000 (Actions)**, which records *what* happened and *when* (the action type and start date). This builds the employee's history — you can see their hiring, every promotion, and their exit on one timeline. It also sets the **employment status** (active, inactive, withdrawn).

## How a Hiring Action Flows

1. Run **PA40**, choose **Hiring**, enter the start date.
2. SAP creates the **PERNR** (personnel number) and opens infotype **0000**.
3. It then guides you through **0001** (org assignment), **0002** (personal data), **0006** (address), **0007** (working time), **0008** (basic pay), **0009** (bank details).
4. Save each screen; the action completes with a fully set-up employee.

## Why the Sequence Matters

Doing it through PA40 (not infotype-by-infotype in PA30) guarantees **completeness and order** — e.g. org assignment before pay, so cost center and pay scale are consistent. The action enforces good data.

## Key T-Codes

| T-Code | Purpose |
|--------|---------|
| PA40 | Run personnel actions (hire, transfer, etc.) |
| PA30 | Maintain individual infotypes |
| PA20 | Display infotypes |

## A Real Example

Deepa hires Ramesh:
- PA40 → Hiring → start date 1 July.
- SAP assigns PERNR, then walks her through org assignment, personal data, address, working time, pay, and bank details.
- Infotype 0000 now shows "Hiring – 1 July," and Ramesh is active and ready for payroll.

## Why It Matters

Personnel Actions make life events fast, complete, and auditable. They guarantee every required infotype is maintained in the right order, build a clean employee history in infotype 0000, and keep HR data consistent for payroll and reporting.`,
    keyConceptTitle: "Personnel Actions (PA40) Guide You Through Life-Event Infotypes",
    keyConceptBody: `- A **Personnel Action (PA40)** bundles the infotypes a life event (Hiring, Transfer, Promotion, Termination) needs into a guided sequence — like a wizard.
- Every action writes **Infotype 0000 (Actions)**, recording what happened and when, and setting employment status — building the employee's history.
- Running events via PA40 (not infotype-by-infotype) ensures completeness and correct order, keeping data consistent for payroll.`,
  },
});
// Flowchart for lesson 6.3
const flowchart6_3 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_3.id },
  update: {},
  create: {
    lessonId: lesson6_3.id,
    title: "Running a Hiring Action (PA40)",
    nodes: [
      { id: "node1", type: "default", position: { x: 80, y: 110 }, data: { label: "🎬 Start Action (PA40)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 290, y: 110 }, data: { label: "🆔 PERNR + Infotype 0000" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 110 }, data: { label: "🏢 Org Assignment (0001)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 510, y: 250 }, data: { label: "👤 Personal, Address, Time" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 290, y: 250 }, data: { label: "💰 Pay (0008) + Bank (0009)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 80, y: 250 }, data: { label: "✅ Employee Active" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart6_3.id, nodeId: "node1", title: "Start Action (PA40)", description: "You choose an action type (Hiring, Transfer, Promotion, Termination) and a start date. PA40 then drives the whole sequence.", tCode: "PA40", tips: "Always use PA40 for life events — it enforces the right infotypes in the right order." },
    { flowchartId: flowchart6_3.id, nodeId: "node2", title: "PERNR + Infotype 0000", description: "For a hire, SAP generates the personnel number and creates Infotype 0000, recording the action and setting employment status.", tCode: "PA40 / PA30 (IT0000)", tips: "Infotype 0000 is the employee's event history — every action lands here." },
    { flowchartId: flowchart6_3.id, nodeId: "node3", title: "Org Assignment (0001)", description: "Links the employee to position, org unit, and cost center first, so downstream pay and reporting are consistent.", tCode: "PA30 (IT0001)", tips: "Org assignment before pay ensures the right cost center bears the salary (HCM-FI link)." },
    { flowchartId: flowchart6_3.id, nodeId: "node4", title: "Personal / Address / Time", description: "The action guides you through personal data (0002), address (0006), and planned working time (0007).", tCode: "PA30 (IT0002/0006/0007)", tips: "Working time (0007) feeds time evaluation and payroll, so don't skip it." },
    { flowchartId: flowchart6_3.id, nodeId: "node5", title: "Pay (0008) + Bank (0009)", description: "Basic pay sets the salary/pay scale; bank details specify where the salary is paid.", tCode: "PA30 (IT0008/0009)", tips: "Wrong bank details (0009) cause failed salary transfers — double-check them." },
    { flowchartId: flowchart6_3.id, nodeId: "node6", title: "Employee Active", description: "With all infotypes saved, the employee is active and ready for time management and payroll.", tCode: "PA20", tips: "Use PA20 (display) to verify the new hire's records are complete before the first payroll." },
  ],
});
// Quiz for lesson 6.3
await prisma.quiz.upsert({
  where: { lessonId: lesson6_3.id },
  update: {},
  create: {
    lessonId: lesson6_3.id,
    title: "Personnel Actions (PA40) — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the main advantage of running a hiring through PA40 instead of maintaining each infotype separately in PA30?",
          explanation: "PA40 guides you through all the required infotypes in the correct order, ensuring nothing is missed. Doing infotypes one-by-one in PA30 risks forgetting a required record (like bank details), which breaks payroll.",
          options: {
            create: [
              { text: "It guides you through every required infotype in the right order", isCorrect: true },
              { text: "It is the only way to display employee data", isCorrect: false },
              { text: "It deletes the employee's history", isCorrect: false },
              { text: "It pays the employee immediately", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which infotype records that an action (like hiring or promotion) happened and when?",
          explanation: "Infotype 0000 (Actions) records the action type and start date, builds the employee's event history, and sets the employment status (active, inactive, withdrawn).",
          options: {
            create: [
              { text: "Infotype 0000 (Actions)", isCorrect: true },
              { text: "Infotype 0008 (Basic Pay)", isCorrect: false },
              { text: "Infotype 0006 (Address)", isCorrect: false },
              { text: "Infotype 0009 (Bank Details)", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does a hiring action maintain Org Assignment (0001) before Basic Pay (0008)?",
          explanation: "Org assignment links the employee to a position and cost center, which downstream pay and reporting depend on. Setting it first ensures the salary is charged to the correct cost center and aligns with the right pay scale — keeping the data consistent.",
          options: {
            create: [
              { text: "So pay is tied to the correct cost center and pay scale", isCorrect: true },
              { text: "Because pay cannot be entered in SAP at all", isCorrect: false },
              { text: "To hide the salary from the employee", isCorrect: false },
              { text: "The order makes no difference", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.4: Time Management
const lesson6_4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "time-management" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "Time Management in SAP",
    slug: "time-management",
    order: 4,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Sanjay manages a 24/7 factory with shifts, overtime, and people calling in sick. At month-end he needs to know exactly how many hours each worker put in, who worked overtime, and who was absent — because payroll depends on it. Doing this on paper is chaos.

Time Management is how SAP captures who was supposed to work, who actually worked, and every absence — turning messy attendance into clean numbers payroll can use.`,
    content: `## Why Time Management Exists

Pay depends on time: hours worked, overtime, shift premiums, and unpaid absences all change the paycheck. **Time Management** records the planned and actual working time of every employee and feeds it to payroll.

## The Foundation: Work Schedules

Every employee has a **work schedule** — their planned pattern of working days, hours, and shifts. It's built from:

| Building block | Meaning |
|----------------|---------|
| **Daily Work Schedule** | Hours for a single day (e.g. 9–5) |
| **Period Work Schedule** | A repeating pattern of daily schedules |
| **Work Schedule Rule** | The full plan assigned to the employee |

The result is stored in **Infotype 0007 (Planned Working Time)** — it says what the employee is *supposed* to work.

## Recording What Actually Happened

Against that plan, you record exceptions and actuals:

| Infotype | Captures | Example |
|----------|----------|---------|
| **2001 Absences** | Time NOT worked | Sick leave, vacation |
| **2002 Attendances** | Time worked (special) | Overtime, training |
| **2011 Time Events** | Clock in/out | Punches from a terminal |

## Positive vs Negative Time Recording

| Approach | What you record | Suits |
|----------|-----------------|-------|
| **Positive** | Every actual hour (clock in/out) | Factories, shift work |
| **Negative** | Only exceptions (absences) | Office staff on fixed hours |

Negative recording assumes "they worked their schedule unless told otherwise" — far less data entry for salaried staff.

## Time Evaluation

**Time Evaluation** (program **RPTIME00**, often via **PT60**) processes recorded times against the schedule and rules to calculate **time wage types** — regular hours, overtime, night/shift premiums, and absence quotas. These results flow into payroll.

## Key Time Management T-Codes

| T-Code | Purpose |
|--------|---------|
| PA30 (IT0007) | Maintain planned working time |
| PA61 / PA71 | Maintain time data (absences, attendances) |
| CAT2 | Time sheet entry (CATS) |
| PT60 | Run time evaluation |

## A Real Example

Sanjay's worker:
- Work schedule: rotating shifts, 8 hours/day (IT0007).
- This month: 2 days sick (IT2001), 6 hours overtime (IT2002).
- **Time evaluation (PT60)** computes: regular hours, 6 overtime hours at premium, and 2 days of paid sick absence.
- These wage types pass to payroll, so the paycheck is exactly right.

## Why It Matters

Time Management bridges attendance and pay. Accurate work schedules and time data mean correct salaries, proper overtime, valid leave balances, and labor-law compliance. Get time wrong and every paycheck is wrong — which is why it's a core HCM area.`,
    keyConceptTitle: "Time Management Captures Planned vs Actual Time for Payroll",
    keyConceptBody: `- Every employee has a **work schedule** (planned working time, **IT0007**); actuals and exceptions are recorded as **absences (2001)** and **attendances (2002)**.
- **Positive** time recording logs every actual hour (shift work); **negative** records only exceptions (office staff).
- **Time Evaluation (PT60/RPTIME00)** turns recorded time into wage types (regular, overtime, premiums) that feed payroll.`,
  },
});
// Flowchart for lesson 6.4
const flowchart6_4 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_4.id },
  update: {},
  create: {
    lessonId: lesson6_4.id,
    title: "Time Management Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 80, y: 110 }, data: { label: "📅 Work Schedule (IT0007)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 60 }, data: { label: "🤒 Absences (IT2001)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 170 }, data: { label: "⏰ Attendances/OT (IT2002)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 520, y: 110 }, data: { label: "⚙️ Time Evaluation (PT60)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 740, y: 110 }, data: { label: "💵 Time Wage Types → Payroll" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node4", type: "default" },
      { id: "e2", source: "node2", target: "node4", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_4.id, nodeId: "node1", title: "Work Schedule (IT0007)", description: "The employee's planned working pattern — daily and period schedules combined into a work schedule rule, stored in infotype 0007.", tCode: "PA30 (IT0007)", tips: "The work schedule defines 'expected' hours; everything else is measured against it." },
    { flowchartId: flowchart6_4.id, nodeId: "node2", title: "Absences (IT2001)", description: "Records time not worked — sick leave, vacation, unpaid leave. Each absence type can be paid or unpaid and affects quotas.", tCode: "PA30 / PA61 (IT2001)", tips: "Absence types are configured to deduct from the right leave quota automatically." },
    { flowchartId: flowchart6_4.id, nodeId: "node3", title: "Attendances / Overtime (IT2002)", description: "Records special worked time like overtime, training, or business trips that differ from the standard schedule.", tCode: "PA30 / PA61 (IT2002)", tips: "Overtime recorded here is what generates premium pay in time evaluation." },
    { flowchartId: flowchart6_4.id, nodeId: "node4", title: "Time Evaluation (PT60)", description: "Processes the schedule plus recorded times against rules to calculate regular hours, overtime, premiums, and leave accruals.", tCode: "PT60 / RPTIME00", tips: "Time evaluation errors (in PT_ERL00) must be cleared before payroll runs cleanly." },
    { flowchartId: flowchart6_4.id, nodeId: "node5", title: "Time Wage Types → Payroll", description: "The evaluation produces time wage types (regular, overtime, shift premium) that flow into the payroll calculation.", tCode: "PC00_M99_CALC", tips: "Accurate time data here is the difference between a correct and an incorrect paycheck." },
  ],
});
// Quiz for lesson 6.4
await prisma.quiz.upsert({
  where: { lessonId: lesson6_4.id },
  update: {},
  create: {
    lessonId: lesson6_4.id,
    title: "Time Management — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which infotype stores an employee's planned working time (their work schedule)?",
          explanation: "Infotype 0007 (Planned Working Time) holds the employee's work schedule rule — the expected pattern of working days and hours that everything else is measured against.",
          options: {
            create: [
              { text: "Infotype 0007 (Planned Working Time)", isCorrect: true },
              { text: "Infotype 2001 (Absences)", isCorrect: false },
              { text: "Infotype 0008 (Basic Pay)", isCorrect: false },
              { text: "Infotype 0000 (Actions)", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "An office with fixed-hours salaried staff wants minimal data entry. Which time recording approach fits best?",
          explanation: "Negative time recording captures only exceptions (absences), assuming employees worked their schedule otherwise. This minimizes data entry — ideal for salaried office staff. Positive recording (every clock in/out) suits shift/factory work.",
          options: {
            create: [
              { text: "Negative time recording (only exceptions)", isCorrect: true },
              { text: "Positive time recording (every hour clocked)", isCorrect: false },
              { text: "No time recording is possible", isCorrect: false },
              { text: "Recording each minute manually", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the role of Time Evaluation (PT60) in the time-to-pay process?",
          explanation: "Time Evaluation processes the work schedule plus recorded absences and attendances against the rules to calculate time wage types — regular hours, overtime, premiums, and leave accruals — which then feed payroll.",
          options: {
            create: [
              { text: "It turns recorded time into wage types that feed payroll", isCorrect: true },
              { text: "It creates purchase orders for the factory", isCorrect: false },
              { text: "It posts the general ledger", isCorrect: false },
              { text: "It hires new employees", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.5: The Payroll Process in Detail
const lesson6_5 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "payroll-process-detail" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "The Payroll Process in Detail",
    slug: "payroll-process-detail",
    order: 5,
    isPublished: true,
    estimatedMinutes: 12,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `It's payroll week and Fatima is responsible for paying 2,000 employees correctly and on time. She hears terms flying around: "lock the payroll area," "run the simulation," "release for correction," "exit payroll." One wrong move and thousands of paychecks could be wrong. She needs to understand the controlled steps that keep payroll safe.

The payroll process is a disciplined cycle with a built-in control record that prevents data changing mid-run — protecting every paycheck.`,
    content: `## Payroll Is a Controlled Cycle

Payroll isn't a single button — it's a **controlled process** that calculates net pay for many employees while preventing their data from changing mid-calculation. The discipline is what keeps 2,000 paychecks accurate.

## Payroll Areas and the Control Record

Employees are grouped into a **Payroll Area** — a set of people paid together on the same cycle (e.g. monthly). Each payroll area has a **control record** that holds the current payroll **period** and **status**, and crucially it **locks master and time data** during the run so nothing changes underneath you.

| Control record status | Meaning |
|-----------------------|---------|
| **Released for Payroll** | Run starts; master/time data locked |
| **Released for Correction** | Open data to fix errors, then re-run |
| **Exit Payroll** | Period finalized; move to next period |

T-code: **PA03** (manage the control record).

## The Payroll Run Steps

1. **Release Payroll** (PA03) — lock data, open the period.
2. **Simulation** — a test run that calculates pay **without saving** results, so you can spot errors safely.
3. **Live/Productive Run** — **PC00_M99_CALC** (the generic driver) calculates and stores results.
4. **Check results** — review the payroll log and remuneration statements (payslips).
5. **Corrections** — if errors, set "Released for Correction," fix data, re-run.
6. **Exit Payroll** — finalize the period.

## What the Calculation Does

The payroll driver processes each employee through a **schema** (a sequence of rules). It gathers their wage types — earnings (basic pay, allowances, overtime from time evaluation) and deductions (tax, provident fund, insurance) — and computes **gross → deductions → net pay**.

## After the Run: Posting and Payment

- **Posting to Accounting** — payroll results post to FI/CO (covered in the HCM-FI lesson).
- **Bank Transfer** — a payment program creates the bank file (e.g. **PC00_M99_FPAYM** / DME) so salaries are paid.

## Key Payroll T-Codes

| T-Code | Purpose |
|--------|---------|
| PA03 | Payroll control record |
| PC00_M99_CALC | Run payroll (international driver) |
| PC_PAYRESULT | Display payroll results |
| PC00_M99_CEDT | Remuneration statement (payslip) |

## A Real Example

Fatima's monthly run:
- **PA03**: release the payroll area for June → data locks.
- **Simulation**: spots one employee with a missing bank record → fix in correction mode.
- **Live run** (PC00_M99_CALC): net pay calculated and stored for all 2,000.
- Check payslips, post to accounting, generate the bank file, then **Exit Payroll**.

## Why It Matters

The control record and staged run make payroll safe and repeatable. Locking data prevents mid-run changes, simulation catches errors before money moves, and exit finalizes the period cleanly — so employees are paid correctly, on time, every cycle.`,
    keyConceptTitle: "Payroll Runs in a Controlled, Locked Cycle",
    keyConceptBody: `- Employees are grouped into a **Payroll Area**; its **control record (PA03)** holds the period/status and **locks data** during the run.
- The cycle is: release → **simulate** (test, no save) → live run (**PC00_M99_CALC**) → check → correct if needed → **exit payroll**.
- The run processes each employee's **wage types** (earnings − deductions = net pay); results then post to accounting and generate bank payments.`,
  },
});
// Flowchart for lesson 6.5
const flowchart6_5 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_5.id },
  update: {},
  create: {
    lessonId: lesson6_5.id,
    title: "The Payroll Run Cycle",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🔒 Release Payroll (PA03)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 110 }, data: { label: "🧪 Simulation (No Save)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 440, y: 110 }, data: { label: "⚙️ Live Run (PC00_M99_CALC)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 650, y: 110 }, data: { label: "🔎 Check Results / Payslips" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 440, y: 250 }, data: { label: "🛠️ Correct & Re-run (if errors)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 650, y: 250 }, data: { label: "🏁 Exit Payroll → Post & Pay" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node3", type: "default" },
      { id: "e6", source: "node4", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_5.id, nodeId: "node1", title: "Release Payroll (PA03)", description: "The control record for the payroll area is set to 'Released for Payroll', opening the period and locking master and time data so it can't change mid-run.", tCode: "PA03", tips: "The data lock is the whole point — it guarantees consistent results across the run." },
    { flowchartId: flowchart6_5.id, nodeId: "node2", title: "Simulation", description: "A test run calculates pay without saving results, letting you catch errors (missing bank data, bad time records) safely before the live run.", tCode: "PC00_M99_CALC_SIMU", tips: "Always simulate first — it's a free safety net before any money moves." },
    { flowchartId: flowchart6_5.id, nodeId: "node3", title: "Live Run", description: "The productive run processes each employee through the payroll schema, computing gross, deductions, and net pay, and stores the results.", tCode: "PC00_M99_CALC", tips: "PC00_M99_CALC is the international driver; country versions exist (e.g. _M40_ for India)." },
    { flowchartId: flowchart6_5.id, nodeId: "node4", title: "Check Results", description: "Review the payroll log and remuneration statements (payslips) to confirm pay is correct before finalizing.", tCode: "PC_PAYRESULT / CEDT", tips: "Spot-check high earners and recent hires — they're the most error-prone." },
    { flowchartId: flowchart6_5.id, nodeId: "node5", title: "Correct & Re-run", description: "If errors appear, set the control record to 'Released for Correction', fix the data, and re-run payroll for the affected employees.", tCode: "PA03", tips: "Correction mode reopens locked data so you can fix the root cause, then re-run cleanly." },
    { flowchartId: flowchart6_5.id, nodeId: "node6", title: "Exit Payroll → Post & Pay", description: "Exit finalizes the period. Results post to accounting (FI/CO) and a payment program generates the bank transfer file.", tCode: "PA03 / PC00_M99_FPAYM", tips: "Only exit once results are verified — exiting locks the period as complete." },
  ],
});
// Quiz for lesson 6.5
await prisma.quiz.upsert({
  where: { lessonId: lesson6_5.id },
  update: {},
  create: {
    lessonId: lesson6_5.id,
    title: "The Payroll Process — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the main purpose of the payroll control record (PA03) locking master and time data?",
          explanation: "Locking data during the run ensures it can't change mid-calculation, so results stay consistent across all employees. Without the lock, someone editing pay or time data partway through could corrupt the run.",
          options: {
            create: [
              { text: "To prevent data changing mid-run so results stay consistent", isCorrect: true },
              { text: "To permanently delete the employees' data", isCorrect: false },
              { text: "To stop employees from being paid", isCorrect: false },
              { text: "To create new positions", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why run a payroll simulation before the live run?",
          explanation: "A simulation calculates pay without saving results, so you can catch and fix errors (like a missing bank record) safely before any money is committed. It's a no-risk dry run.",
          options: {
            create: [
              { text: "It calculates pay without saving, so errors can be caught safely", isCorrect: true },
              { text: "It immediately transfers salaries to banks", isCorrect: false },
              { text: "It is required to delete the payroll area", isCorrect: false },
              { text: "It files the employees' taxes", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "During checking, you find one employee was paid incorrectly. What is the correct next step?",
          explanation: "Set the control record to 'Released for Correction', fix the underlying data, then re-run payroll. This controlled correction loop fixes errors without disturbing the locked, controlled process.",
          options: {
            create: [
              { text: "Set 'Released for Correction', fix the data, and re-run", isCorrect: true },
              { text: "Delete the entire payroll run for everyone", isCorrect: false },
              { text: "Ignore it and exit payroll anyway", isCorrect: false },
              { text: "Manually edit the bank file with the right amount", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.6: Wage Types
const lesson6_6 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "wage-types" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "Wage Types Explained",
    slug: "wage-types",
    order: 6,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `Nisha looks at her first SAP payslip and sees a list: Basic Salary, House Rent Allowance, Transport Allowance, Provident Fund, Income Tax. Her colleague mentions these are all "wage types." Nisha wonders: is every line on the payslip a wage type? How does SAP know which ones add to pay and which subtract?

Wage types are the building blocks of pay — every earning and deduction is one, and understanding them unlocks how payroll really works.`,
    content: `## The Building Blocks of Pay

A **wage type** is a code that represents a single component of pay — an **earning** (adds money) or a **deduction** (subtracts money). Every line on a payslip is a wage type. Payroll is essentially the sum of all an employee's wage types.

Think of wage types like **ingredients in a recipe**: basic pay, allowances, and deductions combine to produce net pay.

## Earnings vs Deductions

| Type | Effect | Examples |
|------|--------|----------|
| **Earnings** | Increase pay | Basic Salary, House Rent Allowance, Overtime, Bonus |
| **Deductions** | Reduce pay | Provident Fund, Income Tax, Insurance, Loan repayment |

Gross pay = sum of earnings; Net pay = gross − deductions.

## Where Wage Types Come From

Wage types enter payroll from several sources:

| Source | Example wage type |
|--------|-------------------|
| **Infotype 0008 (Basic Pay)** | Basic salary, fixed allowances |
| **Infotype 0014 (Recurring Pay/Ded)** | Monthly allowances or deductions |
| **Infotype 0015 (Additional Payments)** | One-time bonus |
| **Time Evaluation** | Overtime, shift premium |
| **Payroll calculation** | Tax, statutory contributions |

## Primary vs Technical Wage Types

- **Primary (dialog) wage types** — entered by users in infotypes (e.g. basic pay, an allowance).
- **Technical/secondary wage types** — generated by payroll itself during calculation (start with a slash, e.g. **/559** net pay). Users don't enter these; the system creates them.

## Wage Type Characteristics

Each wage type is configured with rules: is it an earning or deduction? Is it taxable? Does it count toward provident fund? Does it post to accounting? These **processing classes, cumulation classes, and evaluation classes** control how the wage type behaves throughout payroll and posting.

## Key Wage Type Facts

- Wage types are **country-specific** (tax and statutory rules differ by country).
- The configuration transaction is in the **wage type catalog** (config), and you assign permissible wage types to infotypes.

## A Real Example

Nisha's payslip wage types:
- **Earnings:** Basic Salary ₹50,000, HRA ₹20,000, Transport ₹3,000.
- **Deductions:** Provident Fund ₹6,000, Income Tax ₹8,000.
- Gross = ₹73,000; Net = ₹73,000 − ₹14,000 = **₹59,000**.
- Payroll also generates technical wage types like /559 (net pay) behind the scenes.

## Why It Matters

Wage types are the atoms of payroll — everything that affects pay is one. Understanding earnings vs deductions, where they originate, and how their characteristics control taxation and posting is essential to configuring or troubleshooting any payroll.`,
    keyConceptTitle: "Every Earning and Deduction Is a Wage Type",
    keyConceptBody: `- A **wage type** is a single pay component: an **earning** (adds) or **deduction** (subtracts); the payslip is a list of wage types.
- They come from infotypes (0008 basic pay, 0014 recurring, 0015 one-time), time evaluation (overtime), and payroll calculation (tax).
- **Primary** wage types are user-entered; **technical** ones (e.g. /559 net pay) are system-generated; characteristics control taxation, cumulation, and posting.`,
  },
});
// Flowchart for lesson 6.6
const flowchart6_6 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_6.id },
  update: {},
  create: {
    lessonId: lesson6_6.id,
    title: "How Wage Types Build Net Pay",
    nodes: [
      { id: "node1", type: "default", position: { x: 70, y: 60 }, data: { label: "💼 Earnings (Basic, HRA, OT)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 70, y: 190 }, data: { label: "➖ Deductions (PF, Tax)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 330, y: 60 }, data: { label: "📈 Gross Pay (Sum of Earnings)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 600, y: 125 }, data: { label: "🧮 Net Pay (Gross − Deductions)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 600, y: 255 }, data: { label: "🤖 Technical Wage Types (/559)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node3", type: "default" },
      { id: "e2", source: "node3", target: "node4", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_6.id, nodeId: "node1", title: "Earnings", description: "Wage types that add money: basic salary, house rent allowance, transport, overtime, bonus. They come from infotypes and time evaluation.", tCode: "PA30 (IT0008/0014/0015)", tips: "Fixed monthly items sit in 0008/0014; one-time items like bonus go in 0015." },
    { flowchartId: flowchart6_6.id, nodeId: "node2", title: "Deductions", description: "Wage types that subtract money: provident fund, income tax, insurance, loan repayments. Some are statutory, some voluntary.", tCode: "PA30 (IT0014) / payroll", tips: "Statutory deductions like tax are usually generated by payroll, not entered manually." },
    { flowchartId: flowchart6_6.id, nodeId: "node3", title: "Gross Pay", description: "The sum of all earning wage types — total pay before any deductions are applied.", tCode: "PC_PAYRESULT", tips: "Cumulation classes control which wage types roll up into gross and other totals." },
    { flowchartId: flowchart6_6.id, nodeId: "node4", title: "Net Pay", description: "Gross pay minus all deductions — the amount actually paid to the employee.", tCode: "PC_PAYRESULT", tips: "Net pay is what hits the bank; gross is what the employee 'earned' before deductions." },
    { flowchartId: flowchart6_6.id, nodeId: "node5", title: "Technical Wage Types", description: "Payroll generates internal wage types (starting with /) such as /559 net pay. Users never enter these; the system computes them.", tCode: "PC_PAYRESULT", tips: "When troubleshooting, technical wage types like /559 reveal exactly how net pay was derived." },
  ],
});
// Quiz for lesson 6.6
await prisma.quiz.upsert({
  where: { lessonId: lesson6_6.id },
  update: {},
  create: {
    lessonId: lesson6_6.id,
    title: "Wage Types — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is a wage type in SAP payroll?",
          explanation: "A wage type is a code for a single pay component — either an earning (adds money, like basic salary) or a deduction (subtracts money, like income tax). The payslip is essentially a list of wage types.",
          options: {
            create: [
              { text: "A single component of pay — an earning or a deduction", isCorrect: true },
              { text: "A type of work schedule", isCorrect: false },
              { text: "A purchase order line", isCorrect: false },
              { text: "A customer master record", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "An employee has Basic ₹50,000 + HRA ₹20,000 in earnings, and PF ₹6,000 + Tax ₹8,000 in deductions. What is net pay?",
          explanation: "Gross = 50,000 + 20,000 = ₹70,000. Deductions = 6,000 + 8,000 = ₹14,000. Net pay = gross − deductions = 70,000 − 14,000 = ₹56,000.",
          options: {
            create: [
              { text: "₹56,000", isCorrect: true },
              { text: "₹70,000", isCorrect: false },
              { text: "₹84,000", isCorrect: false },
              { text: "₹14,000", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the difference between a primary wage type and a technical wage type (e.g. /559)?",
          explanation: "Primary (dialog) wage types are entered by users in infotypes, like basic pay or an allowance. Technical wage types (starting with /) are generated by the payroll calculation itself — e.g. /559 net pay — and are never entered manually.",
          options: {
            create: [
              { text: "Primary are user-entered; technical (/559) are generated by payroll", isCorrect: true },
              { text: "They are identical in every way", isCorrect: false },
              { text: "Technical wage types are entered by the employee", isCorrect: false },
              { text: "Primary wage types never affect pay", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.7: Leave Management
const lesson6_7 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "leave-management" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "Leave Management",
    slug: "leave-management",
    order: 7,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Pooja wants to take 5 days of annual leave. She asks HR, "How many days do I have left?" Without a system, someone digs through emails and a spreadsheet to guess her balance. Meanwhile her manager isn't sure whether to approve it.

Leave Management in SAP gives everyone a clear answer: how much leave you're entitled to, how much you've used, and how much remains — all tracked automatically as quotas.`,
    content: `## What Leave Management Does

**Leave Management** tracks employee time off — entitlements, requests, approvals, and balances. It answers three questions automatically: how much leave do you get, how much have you taken, and how much is left.

## The Core Concept: Absence Quotas

A **leave quota** (Infotype **2006, Absence Quotas**) is the employee's entitlement balance for a leave type — e.g. "24 days annual leave this year." As leave is taken, the quota is **deducted**.

| Element | Meaning |
|---------|---------|
| **Quota entitlement** | Total days granted (e.g. 24 annual) |
| **Deduction** | Days used as leave is taken |
| **Remaining balance** | Entitlement − deduction |

## Leave Types

Different leave types behave differently:

| Leave Type | Typical behavior |
|------------|------------------|
| Annual / Earned Leave | Accrues over time, often carries forward |
| Sick Leave | Separate quota, may need a certificate |
| Casual Leave | Short-notice personal leave |
| Unpaid Leave | No quota; reduces pay |

## How a Leave Request Flows

1. **Entitlement** is generated — quotas are created (often automatically by time evaluation, or uploaded) in **IT2006**.
2. **Request** — the employee requests leave (via ESS, or HR enters an **absence in IT2001**).
3. **Approval** — the manager approves (typically through workflow / MSS).
4. **Deduction** — the approved absence deducts from the matching quota.
5. **Payroll** — paid leave flows to payroll normally; unpaid leave reduces pay.

## Quotas Connect to Time and Payroll

Leave sits at the crossroads of HCM:
- **Absences (IT2001)** record the actual time off and deduct the quota.
- **Time Evaluation** can generate/accrue quotas automatically.
- **Payroll** pays paid leave and docks unpaid leave.

## Key Leave T-Codes

| T-Code | Purpose |
|--------|---------|
| PA30 (IT2006) | Maintain absence quotas (entitlement/balance) |
| PA30 (IT2001) | Record an absence (the leave taken) |
| PT50 | Quota overview (balances) |
| PTARQ | Leave requests (self-service backend) |

## A Real Example

Pooja's annual leave:
- Entitlement in IT2006: **24 days** for the year.
- Already taken: 6 days → remaining **18**.
- She requests 5 more; her manager approves; an absence is recorded in IT2001.
- The quota deducts 5 → remaining **13**. Payroll treats it as paid leave.
- Anyone can now see her exact balance in **PT50**.

## Why It Matters

Leave Management removes guesswork and disputes. Employees see real balances, managers approve with confidence, payroll handles paid vs unpaid leave correctly, and the company stays compliant with leave policy and labor law.`,
    keyConceptTitle: "Leave = Quota Entitlement Minus Deductions",
    keyConceptBody: `- A **leave quota (IT2006)** holds the entitlement balance per leave type; taking leave **deducts** from it, leaving a clear remaining balance.
- An approved **absence (IT2001)** is what deducts the quota; entitlements are often generated automatically by **time evaluation**.
- Paid leave flows to payroll normally and unpaid leave reduces pay; check balances in **PT50**.`,
  },
});
// Flowchart for lesson 6.7
const flowchart6_7 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_7.id },
  update: {},
  create: {
    lessonId: lesson6_7.id,
    title: "Leave Request to Balance Update",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🎁 Quota Entitlement (IT2006)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 110 }, data: { label: "📝 Employee Requests Leave" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 490, y: 110 }, data: { label: "✅ Manager Approves" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 690, y: 110 }, data: { label: "📉 Absence Recorded (IT2001)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 490, y: 250 }, data: { label: "🔢 Quota Deducted → Balance" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart6_7.id, nodeId: "node1", title: "Quota Entitlement (IT2006)", description: "The employee's leave entitlement per type (e.g. 24 annual days), stored as an absence quota. It's the balance leave is drawn from.", tCode: "PA30 (IT2006)", tips: "Quotas are often generated automatically by time evaluation rather than entered by hand." },
    { flowchartId: flowchart6_7.id, nodeId: "node2", title: "Employee Requests Leave", description: "The employee submits a leave request, usually through Employee Self-Service, or HR records it directly.", tCode: "PTARQ / ESS", tips: "Self-service requests reduce HR's workload and give employees instant balance visibility." },
    { flowchartId: flowchart6_7.id, nodeId: "node3", title: "Manager Approves", description: "The request routes to the manager (often via workflow / MSS) for approval before it becomes an actual absence.", tCode: "MSS / workflow", tips: "Approval workflow gives managers control while keeping a clear audit trail." },
    { flowchartId: flowchart6_7.id, nodeId: "node4", title: "Absence Recorded (IT2001)", description: "Approved leave is recorded as an absence in infotype 2001, which is what actually triggers the quota deduction.", tCode: "PA30 (IT2001)", tips: "The absence type is configured to deduct from the matching quota automatically." },
    { flowchartId: flowchart6_7.id, nodeId: "node5", title: "Quota Deducted", description: "The quota balance reduces by the days taken, leaving an accurate remaining balance visible to everyone.", tCode: "PT50", tips: "PT50 is the go-to screen to answer 'how many days do I have left?'" },
  ],
});
// Quiz for lesson 6.7
await prisma.quiz.upsert({
  where: { lessonId: lesson6_7.id },
  update: {},
  create: {
    lessonId: lesson6_7.id,
    title: "Leave Management — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What does an absence quota (IT2006) represent?",
          explanation: "An absence quota holds the employee's leave entitlement balance for a leave type (e.g. 24 annual days). As leave is taken, the quota is deducted, leaving a clear remaining balance.",
          options: {
            create: [
              { text: "The employee's leave entitlement balance for a leave type", isCorrect: true },
              { text: "The employee's monthly salary", isCorrect: false },
              { text: "The number of purchase orders raised", isCorrect: false },
              { text: "The factory's production target", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "An employee has 24 annual leave days, has taken 6, and now takes 5 more (approved). What's the remaining balance?",
          explanation: "Entitlement 24 − 6 already taken − 5 newly approved = 13 days remaining. Each approved absence (IT2001) deducts from the quota automatically, keeping the balance accurate.",
          options: {
            create: [
              { text: "13 days", isCorrect: true },
              { text: "18 days", isCorrect: false },
              { text: "24 days", isCorrect: false },
              { text: "5 days", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Which action actually triggers the deduction from a leave quota?",
          explanation: "Recording the approved leave as an absence in infotype 2001 is what deducts the matching quota. The quota (IT2006) holds the balance; the absence (IT2001) draws it down.",
          options: {
            create: [
              { text: "Recording the absence in infotype 2001", isCorrect: true },
              { text: "Running the dunning program", isCorrect: false },
              { text: "Creating a purchase order", isCorrect: false },
              { text: "Posting a goods receipt", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.8: ESS / MSS (Self-Service)
const lesson6_8 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "ess-mss-self-service" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "ESS / MSS (Self-Service)",
    slug: "ess-mss-self-service",
    order: 8,
    isPublished: true,
    estimatedMinutes: 9,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `Every time an employee moves house, they email HR to update their address. Every leave request becomes a form on someone's desk. HR at Vikram's company spends half its day on routine data entry instead of real HR work. There has to be a better way.

There is: Employee and Manager Self-Service let people update their own details and approve requests directly — freeing HR to focus on what matters.`,
    content: `## The Idea: Let People Help Themselves

**Self-Service** moves routine HR tasks out of HR's inbox and into the hands of employees and managers, through easy web or mobile apps. Two flavors:

- **ESS (Employee Self-Service)** — for employees to manage their own information.
- **MSS (Manager Self-Service)** — for managers to handle their team.

## What ESS Lets Employees Do

| ESS task | Example |
|----------|---------|
| Update personal data | Change address, phone, bank details |
| Request leave | Apply for vacation and see balances |
| View payslip | Download monthly remuneration statement |
| Record working time | Enter time / CATS time sheet |
| Maintain benefits | Enroll in benefit plans |

Employees update *their own* infotypes (within allowed limits) — so the address change goes straight in, no HR email needed.

## What MSS Lets Managers Do

| MSS task | Example |
|----------|---------|
| Approve requests | Approve leave, time, or travel |
| View team data | See team org chart, absences, headcount |
| Initiate actions | Start a transfer or pay-change request |
| Monitor team | Review attendance and reports |

## How It Works Behind the Scenes

ESS/MSS are front-ends (today usually **SAP Fiori** apps; historically SAP Portal) that read and write the same HCM infotypes you've learned about. When an employee updates their address via ESS, it updates **Infotype 0006** — the exact same record HR would edit in PA30. The data is identical; only the access point changes.

Requests typically route through **workflow** — e.g. a leave request goes to the manager's MSS inbox for approval, then posts as an absence (IT2001) and deducts the quota.

## The Big Benefits

- **Less HR admin** — routine entry shifts to employees/managers.
- **Faster** — no waiting for HR to key in changes.
- **Accurate** — the person who knows the data enters it.
- **Anywhere** — Fiori apps work on phone and desktop.

## A Real Example

Vikram's company rolls out ESS/MSS:
- An employee moves house → updates address in ESS → IT0006 updated instantly, no HR email.
- They request 3 days leave in ESS → it lands in their manager's MSS inbox → approved → absence recorded and quota deducted.
- HR's routine workload drops sharply, freeing them for strategic work.

## Why It Matters

ESS/MSS modernize HR by distributing routine work to the people closest to it. They cut administrative load, speed up changes, improve data accuracy, and give a consumer-grade experience — a key reason companies adopt SuccessFactors and Fiori-based HR.`,
    keyConceptTitle: "ESS/MSS Push Routine HR Tasks to Employees and Managers",
    keyConceptBody: `- **ESS** lets employees maintain their own data (address, leave, payslips); **MSS** lets managers approve requests and view their team.
- They're front-ends (today **Fiori** apps) that read/write the **same HCM infotypes** — e.g. an ESS address change updates IT0006.
- Requests route through **workflow** (e.g. leave → manager approval → IT2001 + quota deduction), cutting HR admin and speeding up changes.`,
  },
});
// Flowchart for lesson 6.8
const flowchart6_8 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_8.id },
  update: {},
  create: {
    lessonId: lesson6_8.id,
    title: "Self-Service Request Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "📱 Employee Uses ESS" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 260, y: 60 }, data: { label: "🏠 Self-Update (e.g. IT0006)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 260, y: 170 }, data: { label: "📝 Submit Request (Leave)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 480, y: 170 }, data: { label: "👔 Manager Approves (MSS)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 700, y: 170 }, data: { label: "💾 Posts to Infotype" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node2", target: "node5", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart6_8.id, nodeId: "node1", title: "Employee Uses ESS", description: "Through a Fiori app on phone or desktop, the employee accesses their own HR data and requests — no HR email required.", tCode: "Fiori / ESS", tips: "ESS adoption depends on a clean, mobile-friendly launchpad employees actually want to use." },
    { flowchartId: flowchart6_8.id, nodeId: "node2", title: "Self-Update", description: "Direct changes like a new address write straight to the underlying infotype (e.g. IT0006) within allowed limits.", tCode: "ESS → IT0006", tips: "Configuration controls which fields employees may edit themselves versus HR-only fields." },
    { flowchartId: flowchart6_8.id, nodeId: "node3", title: "Submit Request", description: "Actions needing approval (leave, time, travel) are submitted as requests rather than direct updates.", tCode: "ESS / PTARQ", tips: "Requests give managers oversight while still removing the data-entry burden from HR." },
    { flowchartId: flowchart6_8.id, nodeId: "node4", title: "Manager Approves (MSS)", description: "The request appears in the manager's MSS inbox for approval, with team context to decide quickly.", tCode: "MSS / workflow", tips: "MSS also lets managers view team org charts, absences, and initiate actions." },
    { flowchartId: flowchart6_8.id, nodeId: "node5", title: "Posts to Infotype", description: "Once approved, the request posts to the relevant infotype (e.g. absence IT2001 with quota deduction) — the same record HR would maintain.", tCode: "IT2001 / IT0006", tips: "Self-service changes the access point, not the data — it's still standard infotypes underneath." },
  ],
});
// Quiz for lesson 6.8
await prisma.quiz.upsert({
  where: { lessonId: lesson6_8.id },
  update: {},
  create: {
    lessonId: lesson6_8.id,
    title: "ESS / MSS — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the difference between ESS and MSS?",
          explanation: "ESS (Employee Self-Service) lets employees manage their own data and requests; MSS (Manager Self-Service) lets managers approve requests and view/manage their team. Both are self-service front-ends to HCM.",
          options: {
            create: [
              { text: "ESS is for employees' own data; MSS is for managers handling their team", isCorrect: true },
              { text: "ESS is for finance; MSS is for production", isCorrect: false },
              { text: "They are two names for the same app", isCorrect: false },
              { text: "ESS deletes employees; MSS hires them", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "When an employee updates their address through ESS, what actually happens in the system?",
          explanation: "ESS is just a front-end. An address change writes to the same underlying infotype (IT0006) that HR would otherwise edit in PA30 — the data is identical; only the access point differs.",
          options: {
            create: [
              { text: "It updates the same infotype (IT0006) HR would have edited", isCorrect: true },
              { text: "It stores the address in a separate disconnected app", isCorrect: false },
              { text: "It emails the address to HR to type in manually", isCorrect: false },
              { text: "It changes the employee's salary", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "What is the main business benefit of rolling out ESS/MSS?",
          explanation: "Self-service shifts routine data entry and approvals to the people closest to the data, cutting HR's administrative load, speeding up changes, and improving accuracy — freeing HR for strategic work.",
          options: {
            create: [
              { text: "It cuts HR admin by moving routine tasks to employees and managers", isCorrect: true },
              { text: "It eliminates the need for any infotypes", isCorrect: false },
              { text: "It guarantees employees never take leave", isCorrect: false },
              { text: "It replaces the payroll calculation", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.9: HCM Reporting
const lesson6_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "hcm-reporting" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "HCM Reporting",
    slug: "hcm-reporting",
    order: 9,
    isPublished: true,
    estimatedMinutes: 10,
    difficulty: "BEGINNER",
    xpReward: 50,
    story: `The HR director asks Anita, "Give me a headcount by department, a list of everyone whose contract ends this quarter, and our gender diversity numbers — by this afternoon." Anita knows the data is all in SAP, but how does she pull it out quickly without exporting everything into a giant spreadsheet?

HCM Reporting is the toolkit for turning all that infotype data into the answers HR leaders need — fast.`,
    content: `## Data In, Insights Out

You've seen how HR data goes *in* via infotypes. **HCM Reporting** is how it comes *out* — headcounts, anniversaries, turnover, diversity, and dozens of standard reports drawn from the same infotypes.

## Standard HR Reports

SAP ships many ready-made HR reports, reachable through the HR information system menu (**S_PH0_48000513** and similar). Common examples:

| Report area | Answers |
|-------------|---------|
| Headcount | How many employees per org unit? |
| Service anniversaries | Who hits 5/10 years soon? |
| Date monitoring | Whose contract or probation ends soon? |
| Birthday list | Upcoming birthdays |
| EEO / Diversity | Gender and demographic breakdowns |

## Logical Databases — The HR Data Engine

Many HR reports run on a **logical database** (the main HR one is **PNP / PNPCE**). A logical database knows how to read infotypes for a selected set of employees over a period, handling the time-based nature of HR data automatically.

Its power is the **standard selection screen**: you choose employees by org unit, personnel area, employee group, etc., plus a **reporting period** — and every PNP-based report shares this consistent way of picking people.

## Ad Hoc Query & SAP Query

When no standard report fits, you build your own without programming:

| Tool | Purpose |
|------|---------|
| **Ad Hoc Query (InfoSet Query)** | Point-and-click: pick fields and conditions, get a list. T-code **S_PH0_48000510** |
| **SAP Query (SQ01)** | More powerful custom queries and layouts |

These let HR analysts answer new questions themselves rather than waiting for developers.

## Modern Reporting

In S/4HANA and SuccessFactors, reporting increasingly uses **Fiori analytical apps** and **People Analytics / SAP Analytics Cloud** for interactive dashboards — but they read the same underlying HR data.

## Key HCM Reporting T-Codes

| T-Code | Purpose |
|--------|---------|
| SAP Easy Access → HR Info System | Standard HR reports |
| S_PH0_48000510 | Ad Hoc Query |
| SQ01 | SAP Query |
| PC_PAYRESULT | Payroll results |

## A Real Example

Anita's afternoon requests:
- **Headcount by department** → a standard headcount report selected by org unit.
- **Contracts ending this quarter** → a date-monitoring report (reads IT0001/IT0016).
- **Gender diversity** → a standard demographic report or a quick Ad Hoc Query on personal data.
- She delivers all three before lunch — no giant spreadsheet needed.

## Why It Matters

HCM Reporting turns raw infotype data into decisions — workforce planning, compliance, diversity tracking, and cost analysis. Knowing standard reports plus Ad Hoc/SAP Query means HR can answer almost any people question quickly and accurately.`,
    keyConceptTitle: "HCM Reporting Turns Infotype Data into HR Answers",
    keyConceptBody: `- SAP ships many **standard HR reports** (headcount, anniversaries, date monitoring, diversity) reached via the HR Information System.
- Most run on the **PNP/PNPCE logical database**, which shares a consistent selection screen (by org unit, group) plus a **reporting period**.
- For custom questions, **Ad Hoc Query** and **SAP Query (SQ01)** build reports without programming; modern stacks add Fiori/SAC dashboards.`,
  },
});
// Flowchart for lesson 6.9
const flowchart6_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_9.id },
  update: {},
  create: {
    lessonId: lesson6_9.id,
    title: "How an HR Report Runs",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 110 }, data: { label: "🗃️ Infotype Data" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 140, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 250, y: 110 }, data: { label: "🧩 Logical Database (PNP)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 460, y: 110 }, data: { label: "🎯 Selection Screen + Period" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 680, y: 60 }, data: { label: "📋 Standard Report" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 680, y: 170 }, data: { label: "🔧 Ad Hoc / SAP Query" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart6_9.id, nodeId: "node1", title: "Infotype Data", description: "All HR reporting draws from the infotypes where employee data is stored — personal, org assignment, pay, time, and more.", tCode: "PA20 / PA30", tips: "Report quality depends on data quality — clean infotypes give trustworthy reports." },
    { flowchartId: flowchart6_9.id, nodeId: "node2", title: "Logical Database (PNP)", description: "The PNP/PNPCE logical database reads infotypes for selected employees over a period, handling HR's time-based data automatically.", tCode: "PNP / PNPCE", tips: "Most HR reports share PNP, which is why their selection screens look the same." },
    { flowchartId: flowchart6_9.id, nodeId: "node3", title: "Selection Screen + Period", description: "You pick employees (by org unit, personnel area, group) and a reporting period. Precise selection keeps reports fast and relevant.", tCode: "N/A", tips: "The reporting period matters — 'today' vs 'this year' can give very different results." },
    { flowchartId: flowchart6_9.id, nodeId: "node4", title: "Standard Report", description: "Ready-made reports cover headcount, anniversaries, date monitoring, and diversity — no build required.", tCode: "HR Info System", tips: "Check the standard reports first; most common questions already have one." },
    { flowchartId: flowchart6_9.id, nodeId: "node5", title: "Ad Hoc / SAP Query", description: "When no standard report fits, build a custom one by picking fields and conditions — no programming needed.", tCode: "S_PH0_48000510 / SQ01", tips: "Ad Hoc Query lets HR analysts answer new questions without waiting on developers." },
  ],
});
// Quiz for lesson 6.9
await prisma.quiz.upsert({
  where: { lessonId: lesson6_9.id },
  update: {},
  create: {
    lessonId: lesson6_9.id,
    title: "HCM Reporting — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What is the role of the PNP logical database in HR reporting?",
          explanation: "The PNP/PNPCE logical database reads infotype data for a selected set of employees over a reporting period, handling HR's time-based data and providing the standard selection screen that most HR reports share.",
          options: {
            create: [
              { text: "It reads infotype data for selected employees over a period", isCorrect: true },
              { text: "It calculates the production schedule", isCorrect: false },
              { text: "It stores vendor invoices", isCorrect: false },
              { text: "It is where salaries are paid from", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "HR needs a list that no standard report provides, but has no developer available. What's the best option?",
          explanation: "Ad Hoc Query (InfoSet Query) lets HR build a custom list by point-and-click — choosing fields and conditions — without any programming, so analysts can answer new questions themselves.",
          options: {
            create: [
              { text: "Build it with Ad Hoc Query (no programming needed)", isCorrect: true },
              { text: "Give up — only developers can make reports", isCorrect: false },
              { text: "Export every infotype to a spreadsheet manually", isCorrect: false },
              { text: "Run the payroll driver", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does the reporting period matter so much in HCM reports?",
          explanation: "HR data is time-based — employees join, change roles, and leave over time. The reporting period tells the report which point or span in time to evaluate, so 'today' versus 'this year' can yield very different (but both correct) results.",
          options: {
            create: [
              { text: "HR data is time-based, so the period determines which records count", isCorrect: true },
              { text: "It changes the employees' salaries", isCorrect: false },
              { text: "It has no effect on results", isCorrect: false },
              { text: "It deletes data outside the period", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 6.10: HCM-FI Integration
const lesson6_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "hcm-fi-integration" } },
  update: {},
  create: {
    moduleId: hcmModule.id,
    title: "HCM-FI Integration",
    slug: "hcm-fi-integration",
    order: 10,
    isPublished: true,
    estimatedMinutes: 11,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `After payroll runs, the finance team needs the numbers in the accounts: salary expense recorded, taxes and provident fund shown as payables, and each department's cost charged correctly. Rahul in finance asks, "Does someone re-type all this from the payslips?" The idea of manually re-entering 2,000 employees' pay sounds terrifying — and error-prone.

HCM-FI integration does it automatically: payroll results post straight into Financial Accounting and Controlling, with each cost landing in the right department.`,
    content: `## Payroll Must Become Accounting

Running payroll calculates what to pay — but the company's books must also reflect it: salary as an **expense**, unpaid taxes and contributions as **payables**, and each cost charged to the right **cost center**. **HCM-FI integration** posts payroll results into FI and CO automatically, with no re-typing.

## The Step: Posting to Accounting

After the payroll run is finalized, you run **Posting to Accounting** (transaction **PC00_M99_CIPE**). It takes the payroll results, groups the wage types by their accounting rules, and creates an FI/CO posting document.

| Payroll element | FI/CO posting |
|-----------------|---------------|
| Salary, allowances (earnings) | **Debit** salary expense accounts |
| Tax, PF, insurance (deductions) | **Credit** payable accounts (owed to authorities) |
| Net pay | **Credit** a payables/clearing account (to be paid to employees) |

The document balances (debits = credits) just like any FI document — the document principle applies.

## Wage Types Decide the Accounts

How does posting know which G/L account each wage type hits? Through **symbolic accounts** — a mapping layer. Each wage type points to a symbolic account, and symbolic accounts are mapped to real **G/L accounts**. This indirection makes configuration flexible and keeps payroll independent of the chart of accounts.

## The Cost Center Link

Remember **Infotype 0001 (Org Assignment)**? It ties each employee to a **cost center**. When payroll posts, each employee's salary expense is charged to *their* cost center — so the Marketing team's salaries hit Marketing's cost center in CO. This is the same HCM↔CO link from the org/payroll basics, now made concrete.

## After Posting

- The FI document shows salary expense and the various payables.
- A separate **payment** step (third-party remittance / bank transfer) actually pays employees and remits taxes/PF to authorities.

## Key HCM-FI T-Codes

| T-Code | Purpose |
|--------|---------|
| PC00_M99_CIPE | Posting payroll results to accounting |
| PCP0 | Display/manage posting runs |
| FB03 | Display the resulting FI document |

## A Real Example

After June payroll:
- **PC00_M99_CIPE** runs the posting.
- FI document: Debit Salary Expense ₹1,00,00,000; Credit Tax Payable ₹15,00,000; Credit PF Payable ₹8,00,000; Credit Net Pay clearing ₹77,00,000.
- Each department's share of salary expense is charged to its cost center via IT0001.
- Finance never re-keyed a thing — Rahul just reviews the FI document.

## Why It Matters

HCM-FI integration closes the loop from people to finance. It guarantees payroll is reflected accurately in the books, charges costs to the right departments, and eliminates error-prone manual entry — the same integration philosophy that makes all of SAP powerful.`,
    keyConceptTitle: "Payroll Results Post Automatically to FI and CO",
    keyConceptBody: `- **Posting to Accounting (PC00_M99_CIPE)** turns payroll results into a balanced FI document: **debit** salary expense, **credit** tax/PF/net-pay payables.
- **Symbolic accounts** map each wage type to real G/L accounts, keeping payroll flexible and independent of the chart of accounts.
- Each employee's cost is charged to their **cost center** (from **IT0001**), and a separate payment step remits net pay and statutory amounts.`,
  },
});
// Flowchart for lesson 6.10
const flowchart6_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson6_10.id },
  update: {},
  create: {
    lessonId: lesson6_10.id,
    title: "Payroll Posting to Accounting",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 120 }, data: { label: "✅ Payroll Results Finalized" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 120 }, data: { label: "🔗 Symbolic Accounts Map Wage Types" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 120 }, data: { label: "📝 Posting Run (PC00_M99_CIPE)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 740, y: 60 }, data: { label: "💰 FI Document (Expense/Payables)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 740, y: 190 }, data: { label: "🏢 Cost Center Charged (IT0001)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
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
    { flowchartId: flowchart6_10.id, nodeId: "node1", title: "Payroll Results Finalized", description: "After the live payroll run and checks, the results (all employees' wage types) are ready to be reflected in the company's books.", tCode: "PC_PAYRESULT", tips: "Only post to accounting once results are verified — posting commits them to finance." },
    { flowchartId: flowchart6_10.id, nodeId: "node2", title: "Symbolic Accounts", description: "Each wage type maps to a symbolic account, which in turn maps to a real G/L account — a flexible layer between payroll and the chart of accounts.", tCode: "Config (symbolic accounts)", tips: "Symbolic accounts let finance change G/L mappings without touching wage type config." },
    { flowchartId: flowchart6_10.id, nodeId: "node3", title: "Posting Run", description: "PC00_M99_CIPE groups wage types by their accounting rules and creates the balanced FI/CO posting document.", tCode: "PC00_M99_CIPE / PCP0", tips: "Review the posting run in PCP0 before releasing it to FI to catch mapping errors." },
    { flowchartId: flowchart6_10.id, nodeId: "node4", title: "FI Document", description: "The result is a standard FI document: debit salary expense, credit tax/PF/insurance payables and a net-pay clearing account — debits equal credits.", tCode: "FB03", tips: "It obeys the document principle like any FI posting — fully traceable and balanced." },
    { flowchartId: flowchart6_10.id, nodeId: "node5", title: "Cost Center Charged", description: "Each employee's salary expense is charged to their cost center (from IT0001), so departmental cost reports are accurate.", tCode: "IT0001 / CO reports", tips: "Wrong org assignment means salary hits the wrong department — a common cause of cost report errors." },
  ],
});
// Quiz for lesson 6.10
await prisma.quiz.upsert({
  where: { lessonId: lesson6_10.id },
  update: {},
  create: {
    lessonId: lesson6_10.id,
    title: "HCM-FI Integration — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "When payroll results post to accounting, how are salary and statutory deductions typically recorded?",
          explanation: "Posting creates a balanced FI document: salary and allowances are debited as expense, while tax, PF, and insurance deductions are credited as payables (amounts owed to authorities), along with a net-pay clearing credit.",
          options: {
            create: [
              { text: "Debit salary expense; credit tax/PF/net-pay payables", isCorrect: true },
              { text: "Debit revenue; credit inventory", isCorrect: false },
              { text: "Debit customer; credit sales", isCorrect: false },
              { text: "Nothing is recorded in finance", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "How does the posting process know which G/L account each wage type should hit?",
          explanation: "Wage types map to symbolic accounts, which are then mapped to real G/L accounts. This indirection keeps payroll independent of the chart of accounts and makes G/L changes easy without touching wage type config.",
          options: {
            create: [
              { text: "Wage types map to symbolic accounts, which map to G/L accounts", isCorrect: true },
              { text: "The employee chooses the G/L account", isCorrect: false },
              { text: "Every wage type uses the same single account", isCorrect: false },
              { text: "Finance types each one in by hand", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why does each employee's salary expense land in the correct department's cost center automatically?",
          explanation: "Infotype 0001 (Org Assignment) links each employee to a cost center. When payroll posts to accounting, the salary expense is charged to that cost center — so Marketing's salaries hit Marketing's cost center, with no manual allocation.",
          options: {
            create: [
              { text: "Infotype 0001 links each employee to a cost center used at posting", isCorrect: true },
              { text: "Finance guesses the department for each person", isCorrect: false },
              { text: "All salaries go to one company-wide account only", isCorrect: false },
              { text: "The employee selects their own cost center on the payslip", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 2 COMPLETE: 16 lessons written ──────────────────────────────────



