// ─── SD: DEEP DIVE LESSONS (Session 7) ───────────────────────────────────────
// LESSON 4.9: Enterprise Structure in SD
const lesson4_9 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-enterprise-structure" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Enterprise Structure in SD",
    slug: "sd-enterprise-structure",
    order: 9,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `On the first day of a greenfield S/4HANA project, the SD lead Karthik runs a blueprint workshop. The client sells electronics through three routes — big retail chains, their own online store, and direct corporate deals — across two legal entities. A junior consultant asks, "Why can't we just create sales orders and figure out the structure later?" Karthik smiles and draws three boxes on the whiteboard. "Because the system literally won't let you save an order until it knows the Sales Area. Get this wrong now and every report, every price, every tax determination breaks later." The room goes quiet — they realize the org structure is the foundation everything else sits on.`,
    content: `## Why the Org Structure Comes First

Before a single sales order can exist, SAP needs to know *who is selling, how, and what*. The SD enterprise structure answers exactly that. It is configured once, early, and almost never changed — because thousands of master records, prices, and documents get tied to it. Getting it right in the blueprint phase is one of the highest-leverage decisions on a project.

## The Three Core Elements

| Element | What it represents | Real-world example |
|---------|-------------------|--------------------|
| **Sales Organization** | The legal selling unit, responsible for the sale and liable for it. Assigned to exactly one **company code** (FI). | "INDE" – the India sales entity |
| **Distribution Channel** | The *route* through which goods reach the customer | Wholesale, Retail, Online, Direct |
| **Division** | A *product grouping* | Electronics, Appliances, Accessories |

A Sales Organization is always linked to a company code, which is how a sale eventually becomes revenue in Financial Accounting.

## The Sales Area — The Key Combination

The single most important concept here:

> **Sales Area = Sales Organization + Distribution Channel + Division**

The Sales Area is the unique key under which a customer is extended, prices are maintained, and orders are created. This is why \`VA01\` always demands a Sales Area before it lets you proceed — without it, the system cannot determine pricing, taxes, or the delivering plant. A customer "RetailCo" maintained for *INDE / Wholesale / Electronics* may have entirely different terms than the same customer under *INDE / Online / Electronics*.

## Internal Organization: Sales Office & Sales Group

Below the Sales Area, two optional elements model the internal sales team:

- **Sales Office** — a geographic or branch unit (e.g. "Mumbai Office"). Useful for regional reporting.
- **Sales Group** — a team or set of people within a sales office (e.g. "Key Accounts team").

These don't change pricing or tax logic; they exist mainly for responsibility assignment and reporting.

## How It All Assigns Together

The structure is built through **define** then **assign** steps:

\`\`\`
Company Code (FI)
   └── Sales Organization
          ├── assigned Distribution Channels
          ├── assigned Divisions
          └── assigned Plants (where goods ship from)
\`\`\`

A **plant** must be assigned to the Sales Org + Distribution Channel combination so the system knows it is allowed to deliver for that sales line. This single assignment quietly controls which materials can be sold through which channel.

## Where You Configure It

Everything lives in \`SPRO\`:

\`SPRO → Enterprise Structure → Definition → Sales and Distribution\` to *create* the elements, then \`SPRO → Enterprise Structure → Assignment → Sales and Distribution\` to *link* them (Sales Org → Company Code, Dist. Channel → Sales Org, etc.).

## Why It Matters on a Real Project

When the client later asks "show me online revenue for accessories only," that report is only possible because the Sales Area cleanly separates channel and division. A flat, lazy structure makes such analysis impossible without painful rework. The org structure is invisible to end users but governs everything they do.`,
    keyConceptTitle: "Sales Area = Sales Org + Distribution Channel + Division",
    keyConceptBody: `- The **Sales Organization** is the legal selling unit, tied to one company code (the FI link).
- **Distribution Channel** = the route to the customer; **Division** = the product grouping.
- Their combination is the **Sales Area** — the mandatory key for every customer extension, price record, and sales order. \`VA01\` cannot proceed without it.
- **Sales Office / Sales Group** model the internal team for reporting; **plants** are assigned to Sales Org + Channel so the system knows where goods can ship from.`,
  },
});
const flowchart4_9 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_9.id },
  update: {},
  create: {
    lessonId: lesson4_9.id,
    title: "Building the SD Enterprise Structure",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 40 }, data: { label: "🏛️ Company Code (FI)" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 60, y: 160 }, data: { label: "🏢 Sales Organization" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 100 }, data: { label: "🚚 Distribution Channel" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 220 }, data: { label: "📦 Division" }, style: { background: "#EF4444", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 560, y: 160 }, data: { label: "🎯 Sales Area (the key combination)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 820, y: 60 }, data: { label: "🏭 Plant (delivering)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 820, y: 230 }, data: { label: "🛒 Sales Order (VA01)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
      { id: "e6", source: "node5", target: "node6", type: "default" },
      { id: "e7", source: "node5", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_9.id, nodeId: "node1", title: "Company Code", description: "The legal accounting entity in FI. Every Sales Organization must be assigned to exactly one company code so that sales eventually post as revenue.", tCode: "OX02 / SPRO", tips: "The Sales Org → Company Code link is the bridge from SD to Financial Accounting." },
    { flowchartId: flowchart4_9.id, nodeId: "node2", title: "Sales Organization", description: "The top SD unit, legally responsible for the sale and for product liability. Reporting and statistics roll up here.", tCode: "SPRO (Define Sales Org)", tips: "Keep the number of sales orgs small — each one multiplies master-data maintenance." },
    { flowchartId: flowchart4_9.id, nodeId: "node3", title: "Distribution Channel", description: "The route through which goods reach the customer — wholesale, retail, online, direct. Prices and master data can differ per channel.", tCode: "SPRO (Define Dist. Channel)", tips: "Use channels to separate pricing strategies, e.g. cheaper wholesale vs. full-price retail." },
    { flowchartId: flowchart4_9.id, nodeId: "node4", title: "Division", description: "Groups related products (e.g. Electronics vs. Appliances). Enables product-line reporting and division-specific terms.", tCode: "SPRO (Define Division)", tips: "Divisions let you split sales analysis cleanly by product family." },
    { flowchartId: flowchart4_9.id, nodeId: "node5", title: "Sales Area", description: "Sales Org + Distribution Channel + Division. The mandatory key for customer extension, condition records, and every sales document.", tCode: "OVXG (set up Sales Area)", tips: "If a price or customer 'isn't found', check you're in the correct Sales Area first." },
    { flowchartId: flowchart4_9.id, nodeId: "node6", title: "Delivering Plant", description: "Plants are assigned to Sales Org + Distribution Channel, telling the system which location may ship goods for that sales line.", tCode: "SPRO (Assign Plant)", tips: "A material can only be sold through a channel if its plant is assigned to that combination." },
    { flowchartId: flowchart4_9.id, nodeId: "node7", title: "Sales Order (VA01)", description: "The order can only be created once a valid Sales Area exists — it drives pricing, tax, and plant determination from there.", tCode: "VA01", tips: "The very first thing VA01 asks for is the Sales Area — proof of how foundational it is." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_9.id },
  update: {},
  create: {
    lessonId: lesson4_9.id,
    title: "Enterprise Structure in SD — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which three elements combine to form a Sales Area?",
          explanation: "A Sales Area is the unique combination of Sales Organization + Distribution Channel + Division. It is the key under which customers, prices, and orders are created.",
          options: {
            create: [
              { text: "Sales Organization + Distribution Channel + Division", isCorrect: true },
              { text: "Company Code + Plant + Storage Location", isCorrect: false },
              { text: "Sales Office + Sales Group + Salesperson", isCorrect: false },
              { text: "Sales Organization + Plant + Company Code", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why must a Sales Organization be assigned to a company code?",
          explanation: "The Sales Org → Company Code assignment is the link between SD and FI. It is how a sale ultimately becomes posted revenue in Financial Accounting.",
          options: {
            create: [
              { text: "So sales can post as revenue to the correct legal accounting entity in FI", isCorrect: true },
              { text: "So the system knows which warehouse to pick from", isCorrect: false },
              { text: "To determine the customer's credit limit", isCorrect: false },
              { text: "It is optional and only used for reporting", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A consultant tries to create a sales order in VA01, but the system stops them immediately and won't show any items. The most likely cause is:",
          explanation: "VA01 requires a valid Sales Area before anything else, because the Sales Area drives pricing, tax, and plant determination. If the Sales Area is missing or not set up (channel/division not assigned to the sales org), the order cannot proceed.",
          options: {
            create: [
              { text: "A valid Sales Area has not been entered or set up for that org/channel/division", isCorrect: true },
              { text: "The customer has exceeded their credit limit", isCorrect: false },
              { text: "The material is out of stock", isCorrect: false },
              { text: "The billing document was not created", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.10: Material Master — SD Views
const lesson4_10 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-material-master-views" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Material Master — SD Views",
    slug: "sd-material-master-views",
    order: 10,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `During a config review, the client complains that a particular finished good keeps behaving like a free sample — it ships with no price and posts nothing to revenue. Meera, the SD consultant, pulls up the material in \`MM03\` and goes straight to the Sales Org 1 view. There it is: the **item category group** is set to wrong value. "The material master isn't one record," she explains to the client's team. "It's a stack of views, each owned by a different department, and one wrong field on the SD view changed how every order line behaves." Ten minutes in \`MM02\` fixes weeks of confusion.`,
    content: `## One Material, Many Views

A material master is not a single flat record. It is organized into **views**, each maintained by the department that cares about it — Basic Data (engineering), Purchasing (MM), Accounting/Costing (FI/CO), and several **Sales** views owned by SD. When you call \`MM01\`/\`MM02\`/\`MM03\` you choose which views to maintain, and you maintain them *per organizational level* (sales org + distribution channel for SD, plant for logistics).

## The SD-Relevant Views

| View | Org level | Key fields it controls |
|------|-----------|------------------------|
| **Sales: Sales Org 1** | Sales Org + Dist. Channel | Delivering plant, tax classification, **item category group**, sales unit, minimum order qty |
| **Sales: Sales Org 2** | Sales Org + Dist. Channel | **Account assignment group** (revenue posting), item category group (general), material statistics group |
| **Sales: General/Plant** | Plant | **Availability check** group, transportation group, loading group, gross/net weight |

Because the first two views are keyed by Sales Org + Distribution Channel, the *same* material can carry different settings in different sales areas.

## The Fields That Actually Drive Behavior

A few fields on these views quietly control major process outcomes:

- **Item category group** (Sales Org 1/2): the material's contribution to item category determination. Common values: \`NORM\` (standard stock item), \`LUMF\` (structured/BOM, sub-items priced), \`DIEN\` (service), \`BANS\` (third-party). Pick the wrong one and the line behaves like the wrong thing.
- **Account assignment group** (Sales Org 2): feeds **revenue account determination** — it helps decide which G/L account billing posts to.
- **Availability check group** (General/Plant): controls how ATP checks stock for this material.
- **Loading group + transportation group** (General/Plant): feed **shipping point** and **route** determination.
- **Tax classification** (Sales Org 1): combines with the customer's tax classification to determine the tax condition (e.g. \`MWST\`).

## How Item Category Determination Uses This

The material's **item category group** is half of the item-category formula:

> Sales Document Type + **Item Category Group (material)** + Usage + Higher-level item = **Item Category**

So a material flagged \`NORM\` in a standard order (\`OR\`) becomes item category \`TAN\` (standard, delivery- and billing-relevant). A material flagged \`LUMF\` behaves as a structured item. This is precisely why Meera's "free sample" bug happened: the item category group resolved to a category with no pricing and no billing relevance.

## The Classic Mistakes

- Maintaining the SD views for the **wrong sales area** — the material then "doesn't exist" for sales in the area you actually use.
- Wrong **item category group** → wrong delivery/billing behavior (free goods, services, third-party triggered by accident).
- Missing **delivering plant** on Sales Org 1 → the system can't propose a plant, and ATP/shipping break.
- Missing **account assignment group** → revenue account determination fails and billing can't release to accounting.

## Where to Maintain It

Use \`MM01\` (create), \`MM02\` (change), \`MM03\` (display). On the view-selection popup choose the Sales and Plant views, then enter the **organizational levels** (Sales Org, Distribution Channel, Plant) when prompted. Always confirm you are on the correct sales area before blaming "missing master data."`,
    keyConceptTitle: "SD views (Sales Org 1/2, General/Plant) carry the fields that drive order behavior",
    keyConceptBody: `- The material master is a stack of department-owned **views**; SD owns **Sales Org 1, Sales Org 2, and Sales: General/Plant**, maintained per sales area / plant.
- **Item category group** (e.g. \`NORM\`, \`LUMF\`, \`DIEN\`) is half of item-category determination — wrong value, wrong delivery/billing behavior.
- **Account assignment group** feeds revenue account determination; **availability check, loading & transportation groups** feed ATP and shipping/route determination.
- Maintain via \`MM01/02/03\`, always for the correct Sales Org + Distribution Channel + Plant.`,
  },
});
const flowchart4_10 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_10.id },
  update: {},
  create: {
    lessonId: lesson4_10.id,
    title: "SD Views of the Material Master and What They Drive",
    nodes: [
      { id: "node1", type: "default", position: { x: 80, y: 150 }, data: { label: "📋 Material Master (MM01/02/03)" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 340, y: 40 }, data: { label: "🟥 Sales Org 1 (plant, tax, item cat group)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 340, y: 150 }, data: { label: "🟥 Sales Org 2 (acct assignment group)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 340, y: 260 }, data: { label: "🟧 Sales: General/Plant (avail. check, loading grp)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 205, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 640, y: 40 }, data: { label: "🧩 Item Category Determination" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 640, y: 150 }, data: { label: "💰 Revenue Account Determination" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 640, y: 260 }, data: { label: "🚚 ATP + Shipping/Route" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node1", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node3", target: "node6", type: "default" },
      { id: "e6", source: "node4", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_10.id, nodeId: "node1", title: "Material Master", description: "A single material number whose data is split into department-owned views, maintained per organizational level.", tCode: "MM01 / MM02 / MM03", tips: "On the view-selection popup, pick the Sales views AND enter the right org levels." },
    { flowchartId: flowchart4_10.id, nodeId: "node2", title: "Sales Org 1 View", description: "Holds delivering plant, tax classification, sales unit, minimum order quantity, and the all-important item category group.", tCode: "MM02 (Sales Org 1)", tips: "A missing delivering plant here breaks plant proposal and ATP." },
    { flowchartId: flowchart4_10.id, nodeId: "node3", title: "Sales Org 2 View", description: "Holds the account assignment group (for revenue posting), item category group, and statistics group.", tCode: "MM02 (Sales Org 2)", tips: "No account assignment group = revenue account determination fails at billing release." },
    { flowchartId: flowchart4_10.id, nodeId: "node4", title: "Sales: General/Plant View", description: "Plant-level data: availability check group, transportation group, loading group, weights and volumes.", tCode: "MM02 (Sales: General/Plant)", tips: "Loading + transportation groups feed shipping point and route determination." },
    { flowchartId: flowchart4_10.id, nodeId: "node5", title: "Item Category Determination", description: "The item category group from the material combines with the sales doc type (+usage, +higher-level) to determine the item category.", tCode: "VOV4", tips: "Wrong item category group is the #1 cause of 'this line behaves like a free/3rd-party item'." },
    { flowchartId: flowchart4_10.id, nodeId: "node6", title: "Revenue Account Determination", description: "The account assignment group on the material (with the customer's group) helps determine the G/L revenue account at billing.", tCode: "VKOA", tips: "This is where SD hands revenue to FI — keep the groups consistent across materials." },
    { flowchartId: flowchart4_10.id, nodeId: "node7", title: "ATP + Shipping/Route", description: "Availability check group drives ATP; loading & transportation groups drive shipping point and route determination.", tCode: "MM02 (General/Plant)", tips: "If shipping point won't determine, check the loading group here first." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_10.id },
  update: {},
  create: {
    lessonId: lesson4_10.id,
    title: "Material Master SD Views — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which material master field is half of the formula for item category determination?",
          explanation: "The item category group (maintained on the Sales Org views, e.g. NORM, LUMF, DIEN) combines with the sales document type, usage, and higher-level item to determine the item category.",
          options: {
            create: [
              { text: "Item category group", isCorrect: true },
              { text: "Account assignment group", isCorrect: false },
              { text: "Loading group", isCorrect: false },
              { text: "Material statistics group", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Billing for a material can't be released to accounting because revenue account determination fails. Which SD material field is the likely culprit?",
          explanation: "The account assignment group on the Sales Org 2 view feeds revenue account determination (VKOA). If it is missing or wrong, the system can't determine the G/L revenue account and billing won't release to FI.",
          options: {
            create: [
              { text: "Account assignment group (Sales Org 2 view)", isCorrect: true },
              { text: "Transportation group (General/Plant view)", isCorrect: false },
              { text: "Minimum order quantity (Sales Org 1 view)", isCorrect: false },
              { text: "Gross weight (General/Plant view)", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A material was set up correctly, yet sales staff say it 'doesn't exist' when they try to order it for the online channel. What is the most likely explanation?",
          explanation: "SD views are keyed by Sales Org + Distribution Channel. If the views were maintained only for, say, the wholesale channel and not for online, the material effectively doesn't exist for sales in the online sales area — even though the material number exists.",
          options: {
            create: [
              { text: "The SD views were maintained for a different sales area (channel) than the one being used", isCorrect: true },
              { text: "The material has no basic data view", isCorrect: false },
              { text: "The customer's credit limit is zero", isCorrect: false },
              { text: "The billing type is missing", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.11: Sales Document Types & Order Processing Deep-Dive
const lesson4_11 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-sales-document-types" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Sales Document Types & Order Processing Deep-Dive",
    slug: "sd-sales-document-types",
    order: 11,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A telecom client tells consultant Arjun, "When the customer accepts our quotation, our team re-keys everything into a new order. They make typos, prices drift, it's a mess." Arjun realizes the client isn't using **referencing**. He configures the quotation type \`QT\` and standard order \`OR\` so an order can be created *with reference to* the quotation — copy control pulls every line and price across automatically. He also notices their rush deliveries are processed as normal orders, so he introduces the rush order type \`RO\`. By the end of the day, the document type is doing the heavy lifting the staff were doing by hand.`,
    content: `## The Sales Document Type Is the Control Center

Every sales document — inquiry, quotation, order, return — is created under a **sales document type**. The type is a small configuration object that controls an enormous amount of behavior: number ranges, which item categories are allowed, which delivery and billing types are linked, whether pricing is carried out, the default order/delivery dates, and which partner and output procedures apply.

### Common Standard Types

| Type | Purpose |
|------|---------|
| \`OR\` (TA) | Standard sales order |
| \`QT\` | Quotation (valid-to date, can be referenced into an order) |
| \`IN\` | Inquiry |
| \`RO\` | Rush order — delivery created immediately, billing later |
| \`KA\` | Consignment fill-up |
| \`RE\` | Returns |
| \`CR\` / \`DR\` | Credit / Debit memo request |

## What the Document Type Controls

- **Number range** — internal (system-assigned) vs external (user-entered) document numbers.
- **Allowed item categories** — which line behaviors are permitted.
- **Delivery type & billing type** — e.g. \`OR\` links to delivery \`LF\` and billing \`F2\`.
- **Immediate delivery flag** — rush order \`RO\` triggers the delivery at save.
- **Document pricing procedure indicator** — feeds pricing-procedure determination.
- **Screen sequence, incompletion procedure, partner procedure, output procedure.**

Configure all of this in \`VOV8\` (Define Sales Document Types).

## Referencing — Quotation → Order

When an order is created **with reference** to a quotation, **copy control** (\`VTAA\`, order→order) governs which header, item, and schedule-line data is copied and transformed. This eliminates re-keying and preserves agreed prices. The same mechanism links inquiry→quotation→order, building a clean **document flow** the user can trace end to end.

## Header vs Item Conditions

Pricing applies at two levels. **Item conditions** sit on each line. **Header conditions** apply to the whole document and are then distributed across items (by value, weight, or volume). A header discount of ₹1,000, for example, gets split across all lines proportionally — useful for an order-wide concession that shouldn't be keyed line by line.

## The Incompletion Log

Each document type points to an **incompletion procedure**: a list of fields that *must* be filled before the document is considered complete (e.g. purchase order number, payment terms, reason for rejection). In \`VA02\`, the **incompletion log** lists what's missing and can block the subsequent step (delivery or billing) until resolved. This is how a project enforces data quality without relying on user discipline.

## Partner Determination

A sales order involves several **partner functions**, and they are not always the same company:

- **Sold-to party (AG)** — who placed the order.
- **Ship-to party (WE)** — where the goods go.
- **Bill-to party (RE)** — who receives the invoice.
- **Payer (RG)** — who actually pays.

A large retailer might order centrally (sold-to), ship to 50 stores (many ship-tos), and pay from a shared-services center (payer). Partner determination (\`VOPA\`) controls which functions are mandatory and how they default.

## Rejecting Line Items

When a customer cancels part of an order, you don't delete the line — you assign a **reason for rejection** in \`VA02\`. The line stays for history and reporting but is excluded from delivery and billing. A whole order can be rejected the same way. This preserves the audit trail, which deletion would destroy.`,
    keyConceptTitle: "The sales document type controls number range, allowed item categories, delivery/billing links, and referencing",
    keyConceptBody: `- The **sales document type** (\`VOV8\`) governs number range, allowed item categories, linked delivery/billing types, pricing procedure indicator, and the incompletion/partner/output procedures.
- **Referencing** (e.g. quotation \`QT\` → order \`OR\`) uses **copy control** (\`VTAA\`) to pull data forward — no re-keying, prices preserved, clean document flow.
- **Header conditions** distribute across items; **item conditions** sit per line.
- **Partner functions** (sold-to, ship-to, bill-to, payer) need not be the same party; **rejection reasons** retire a line without deleting it.`,
  },
});
const flowchart4_11 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_11.id },
  update: {},
  create: {
    lessonId: lesson4_11.id,
    title: "Sales Document Type: Referencing and Controls",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 150 }, data: { label: "📄 Quotation (QT)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 150 }, data: { label: "🔁 Copy Control (VTAA)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 510, y: 150 }, data: { label: "🛒 Standard Order (OR)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 510, y: 30 }, data: { label: "⚙️ VOV8 Controls (number range, item cats, delivery/billing)" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 210, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 510, y: 280 }, data: { label: "📝 Incompletion Log (must-fill fields)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 770, y: 90 }, data: { label: "👥 Partner Determination (AG/WE/RE/RG)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 770, y: 220 }, data: { label: "✅ Delivery / Billing (LF / F2)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node4", target: "node3", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node3", target: "node6", type: "default" },
      { id: "e6", source: "node3", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_11.id, nodeId: "node1", title: "Quotation (QT)", description: "A binding offer with a validity date. It can be referenced to create a sales order, carrying its agreed prices forward.", tCode: "VA21 (create quotation)", tips: "Set a sensible valid-to date so stale quotations don't get referenced months later." },
    { flowchartId: flowchart4_11.id, nodeId: "node2", title: "Copy Control (VTAA)", description: "Defines, for order→order (and quotation→order), which header/item/schedule-line data is copied and how it's transformed.", tCode: "VTAA", tips: "Copy requirements and data-transfer routines live here — they decide what carries over." },
    { flowchartId: flowchart4_11.id, nodeId: "node3", title: "Standard Order (OR)", description: "The created order. Because it referenced the quotation, lines and prices come across automatically and the document flow links them.", tCode: "VA01 (create with reference)", tips: "Use 'Create with reference' rather than re-keying to preserve agreed pricing." },
    { flowchartId: flowchart4_11.id, nodeId: "node4", title: "VOV8 Controls", description: "The document type config: number range, allowed item categories, linked delivery/billing types, pricing procedure indicator, and assigned procedures.", tCode: "VOV8", tips: "Changing the linked delivery/billing type here changes downstream behavior for every order of this type." },
    { flowchartId: flowchart4_11.id, nodeId: "node5", title: "Incompletion Log", description: "Lists mandatory fields not yet filled. Can block delivery/billing until the document is complete.", tCode: "VA02 (Edit > Incompletion log)", tips: "Add fields like PO number to the incompletion procedure to enforce data quality." },
    { flowchartId: flowchart4_11.id, nodeId: "node6", title: "Partner Determination", description: "Sold-to, ship-to, bill-to, and payer can be different parties. The partner procedure controls which are mandatory and how they default.", tCode: "VOPA", tips: "One sold-to can have many ship-tos — model multi-store customers this way." },
    { flowchartId: flowchart4_11.id, nodeId: "node7", title: "Delivery / Billing", description: "The doc type's linked delivery (LF) and billing (F2) types drive the next steps. Rejected lines are excluded.", tCode: "VL01N / VF01", tips: "A rejection reason on a line keeps it for history but stops delivery and billing." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_11.id },
  update: {},
  create: {
    lessonId: lesson4_11.id,
    title: "Sales Document Types — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "In which transaction do you configure sales document types and their controls (number range, allowed item categories, linked delivery/billing types)?",
          explanation: "VOV8 (Define Sales Document Types) is where the document type and all its control attributes are configured.",
          options: {
            create: [
              { text: "VOV8", isCorrect: true },
              { text: "VA01", isCorrect: false },
              { text: "VKOA", isCorrect: false },
              { text: "MM02", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why is assigning a 'reason for rejection' to a line item better than simply deleting the line?",
          explanation: "A rejection reason excludes the line from delivery and billing while keeping it on the document for history and reporting. Deleting the line would destroy the audit trail of what was originally ordered.",
          options: {
            create: [
              { text: "It excludes the line from delivery/billing while preserving it for history and audit", isCorrect: true },
              { text: "It automatically refunds the customer", isCorrect: false },
              { text: "It increases the order value", isCorrect: false },
              { text: "There is no difference between the two", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A retailer orders centrally, ships to 50 stores, and pays through a shared-services center. How does SD model this in one sales order?",
          explanation: "Partner functions allow different parties for sold-to (who orders), ship-to (where goods go — many can exist), bill-to (who gets the invoice), and payer (who pays). Partner determination governs which are mandatory and how they default — so a single order can carry one sold-to with many ship-tos and a separate payer.",
          options: {
            create: [
              { text: "Using different partner functions — one sold-to, many ship-tos, a separate payer", isCorrect: true },
              { text: "By creating 50 separate sales organizations", isCorrect: false },
              { text: "By rejecting and re-entering the order 50 times", isCorrect: false },
              { text: "Partner functions must always be the same single company", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.12: Item Categories
const lesson4_12 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-item-categories" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Item Categories",
    slug: "sd-item-categories",
    order: 12,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A consumer-goods client runs a "buy one, get one free" promotion. The sales team enters two lines: the paid product and the free unit. But at month-end, finance is furious — the free units were billed at full price. Priya, the SD consultant, opens the order and sees both lines carry item category \`TAN\` (standard). The free line should be \`TANN\` — free of charge, no pricing. "The item category is the single most important control on a sales line," she tells them. "It decides whether the line gets priced, delivered, billed, and credit-checked. One wrong category and the whole promotion's economics break."`,
    content: `## The Most Important Control on a Line

If the sales document type controls the *header*, the **item category** controls each *line item*. It is the single field that determines the most consequential behaviors of a sales line: whether it is **priced**, whether it is **relevant for delivery**, whether it is **relevant for billing**, whether it triggers a **credit check**, how **returns** are handled, and whether it carries a **schedule line** at all.

## Key Item Categories

| Category | Meaning | Pricing | Delivery | Billing |
|----------|---------|---------|----------|---------|
| \`TAN\` | Standard item | Yes | Yes | Yes |
| \`TANN\` | Free of charge | No | Yes | No |
| \`TAB\` | Individual purchase order (third-party-style, stocked) | Yes | Yes | Yes |
| \`TAD\` | Service | Yes | **No** | Yes |
| \`TATX\` | Text item | No | No | No |
| \`TACS\` | Consignment | varies by step | varies | varies |

Notice the pattern: a **free** item (\`TANN\`) has no price; a **service** (\`TAD\`) has no delivery (there's nothing physical to ship); a **text** item (\`TATX\`) is just a note carried on the document.

## What the Item Category Controls (in VOV7)

Configured in \`VOV7\`, the key switches are:

- **Pricing** — is the line priced at all?
- **Item relevant for delivery** — does it flow into a delivery document?
- **Billing relevance** — order-related, delivery-related, or not billed.
- **Schedule line allowed** — only delivery-relevant items get schedule lines.
- **Credit active** — does this line count toward the credit check?
- **Business item / weight & volume relevant**, returns handling, and structure (for BOMs).

## Item Category Determination — the Formula

The system derives the item category automatically:

> **Sales Doc Type + Item Category Group (material) + Usage + Higher-level Item Category = Item Category**

- **Sales doc type** (e.g. \`OR\`) sets the context.
- **Item category group** comes from the material master (e.g. \`NORM\`, \`DIEN\`, \`LUMF\`).
- **Usage** is an indicator like \`FREE\` (free goods) or \`TEXT\`.
- **Higher-level item category** matters for sub-items in a BOM/structured order.

Example: \`OR\` + \`NORM\` + (no usage) + (no higher-level) → \`TAN\`. The same material with usage \`FREE\` → \`TANN\`. This determination is configured in \`VOV4\`.

## Why Priya's Bug Happened — and the Fix

The free line resolved to \`TAN\` because no **usage** \`FREE\` was applied, so it picked up the standard, fully priced category. The proper setup uses **free goods** (\`VBN1\`) or a manual category override so the free line becomes \`TANN\` — priced at zero, still delivered, never billed.

## Automatic vs Manual

Determination is automatic, but users can **manually override** the item category on a line *if* the alternative is allowed for that combination (configured as a permitted manual entry in \`VOV4\`). This is how a salesperson can convert a standard line to a free-of-charge line on the fly — but only within the boundaries config permits, which protects the process from arbitrary changes.

## The Practical Takeaway

When a line "behaves wrong" — gets billed when it shouldn't, won't deliver, isn't priced — the first thing a consultant checks is the **item category** and the determination behind it. It explains more day-to-day order behavior than almost any other single field.`,
    keyConceptTitle: "The item category controls pricing, delivery, billing, and credit relevance of each line",
    keyConceptBody: `- The **item category** (\`VOV7\`) is the master switch per line: pricing yes/no, delivery relevance, billing relevance, schedule line allowed, credit active, returns behavior.
- Key categories: \`TAN\` (standard), \`TANN\` (free — no price, no billing), \`TAB\` (individual PO), \`TAD\` (service — no delivery), \`TATX\` (text).
- Determination: **Sales Doc Type + Item Category Group + Usage + Higher-level Item Category** = Item Category (configured in \`VOV4\`).
- Determination is automatic but a user can **manually override** to another category only if config permits it.`,
  },
});
const flowchart4_12 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_12.id },
  update: {},
  create: {
    lessonId: lesson4_12.id,
    title: "How the Item Category Is Determined and What It Controls",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 40 }, data: { label: "📄 Sales Doc Type (e.g. OR)" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 40, y: 150 }, data: { label: "🏷️ Item Category Group (material)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 40, y: 260 }, data: { label: "🎯 Usage (e.g. FREE) + Higher-level item" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 340, y: 150 }, data: { label: "🧩 Determination (VOV4)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 165, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 600, y: 150 }, data: { label: "✅ Item Category (TAN / TANN / TAD...)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 860, y: 60 }, data: { label: "💲 Pricing? Billing?" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 860, y: 240 }, data: { label: "🚚 Delivery? Schedule line? Credit?" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node4", type: "default" },
      { id: "e2", source: "node2", target: "node4", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_12.id, nodeId: "node1", title: "Sales Document Type", description: "Sets the context for determination (e.g. standard order OR vs returns RE). Different doc types can map the same material group to different item categories.", tCode: "VOV8", tips: "The same material behaves differently in OR vs RE because the doc type is part of the key." },
    { flowchartId: flowchart4_12.id, nodeId: "node2", title: "Item Category Group", description: "Comes from the material master Sales views (NORM, DIEN, LUMF, BANS). It classifies what kind of thing the material is for SD.", tCode: "MM02 (Sales Org views)", tips: "DIEN → service-style behavior; NORM → standard stock item." },
    { flowchartId: flowchart4_12.id, nodeId: "node3", title: "Usage + Higher-level Item", description: "Usage (e.g. FREE, TEXT) and the higher-level item's category refine determination, especially for free goods and BOM sub-items.", tCode: "VBN1 (free goods)", tips: "Usage FREE is what flips a line to the free-of-charge category TANN." },
    { flowchartId: flowchart4_12.id, nodeId: "node4", title: "Determination (VOV4)", description: "The config table that maps the combination of doc type + item cat group + usage + higher-level to a resulting item category, plus allowed manual alternatives.", tCode: "VOV4", tips: "Allowed manual entries are defined here — they bound what users may override to." },
    { flowchartId: flowchart4_12.id, nodeId: "node5", title: "Resulting Item Category", description: "The category assigned to the line (TAN, TANN, TAB, TAD, TATX...). It is the master switch for the line's behavior.", tCode: "VOV7 (view category config)", tips: "Check this first when a line behaves unexpectedly." },
    { flowchartId: flowchart4_12.id, nodeId: "node6", title: "Pricing & Billing Control", description: "The category decides whether the line is priced and whether/how it is billed (order-related, delivery-related, or not at all).", tCode: "VOV7", tips: "TANN = no price, not billed; TAD = priced, billed, but not delivered." },
    { flowchartId: flowchart4_12.id, nodeId: "node7", title: "Delivery, Schedule Line & Credit", description: "It also controls delivery relevance, whether schedule lines are allowed, and whether the line is active for the credit check.", tCode: "VOV7", tips: "Only delivery-relevant items get schedule lines — services (TAD) do not." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_12.id },
  update: {},
  create: {
    lessonId: lesson4_12.id,
    title: "Item Categories — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which item category represents a free-of-charge item that is delivered but never billed?",
          explanation: "TANN is the free-of-charge item category: it carries no price and is not relevant for billing, but it is still delivered. TAN is standard (priced and billed); TAD is a service (no delivery).",
          options: {
            create: [
              { text: "TANN", isCorrect: true },
              { text: "TAN", isCorrect: false },
              { text: "TAD", isCorrect: false },
              { text: "TATX", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does a service item category like TAD typically have no delivery relevance?",
          explanation: "A service has nothing physical to ship, so the item category is configured as not relevant for delivery — and therefore has no schedule lines. It is still priced and billed (order-related billing).",
          options: {
            create: [
              { text: "There is nothing physical to ship, so it isn't delivery-relevant (and gets no schedule line)", isCorrect: true },
              { text: "Services are never priced", isCorrect: false },
              { text: "Services can't be billed", isCorrect: false },
              { text: "The customer rejects all service lines automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "In a 'buy one get one free' order, both lines are billed at full price. Investigation shows both lines carry category TAN. What is the correct fix?",
          explanation: "The free line should resolve to TANN (free of charge — no pricing, not billed). This is achieved via free-goods setup or applying usage FREE so determination yields TANN, or a permitted manual override. Leaving it as TAN means it gets fully priced and billed.",
          options: {
            create: [
              { text: "Make the free line resolve to TANN via free-goods/usage FREE or an allowed manual override", isCorrect: true },
              { text: "Delete the paid line", isCorrect: false },
              { text: "Change the sales organization", isCorrect: false },
              { text: "Increase the customer's credit limit", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.13: Schedule Line Categories
const lesson4_13 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-schedule-line-categories" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Schedule Line Categories",
    slug: "sd-schedule-line-categories",
    order: 13,
    isPublished: true,
    estimatedMinutes: 13,
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    story: `A planning manager at a pump manufacturer escalates to consultant Rahul: "We enter sales orders for our trading materials, but MRP never plans them — no planned orders, nothing. Yet our manufactured goods plan fine." Rahul opens an order line and drills into the schedule line. The schedule line category is \`CN\` instead of \`CP\`. He checks the material: its MRP type is \`ND\` (no planning). "The schedule line is where MRP relevance lives," he explains. "Your trading materials are flagged 'no planning', so the system correctly picks a category that doesn't transfer requirements. Change the MRP type and the category follows."`,
    content: `## The Third Level of a Sales Order

A sales order has three levels: **header** (customer, currency), **item** (material, quantity, item category), and **schedule lines** (confirmed quantities and dates). The schedule line is where the order says *"this many pieces, confirmed for this date."* A single item can have several schedule lines if the quantity is confirmed in parts on different dates.

The **schedule line category** is the control object at this level — the schedule-line equivalent of the item category.

## What the Schedule Line Category Controls

Configured in \`VOV6\`, the schedule line category controls:

- **MRP relevance / Transfer of Requirements** — does this schedule line pass a requirement to MRP so the supply chain plans for it?
- **Availability check** — is ATP performed for this schedule line?
- **Movement type** — which inventory movement the goods issue will use (e.g. \`601\` for a standard sales delivery goods issue).
- **Delivery relevance** — does the schedule line generate a delivery requirement?
- **Purchasing fields** — for third-party/individual PO scenarios, whether a purchase requisition is created.

## The Key Categories

| Category | MRP / Req. transfer | Availability check | Movement type | Typical use |
|----------|--------------------|--------------------|---------------|-------------|
| \`CP\` | Yes (transfers req.) | Yes | 601 | Standard make-to-stock item |
| \`CB\` | No transfer | Yes | 601 | Item where you don't want MRP to plan |
| \`CN\` | No | **No** | — | No planning material (MRP type ND) |
| \`CT\` / \`CS\` | varies | varies | — | Third-party / consignment variants |

\`CP\` is the workhorse: it triggers the availability check, transfers the requirement to MRP, and uses movement type \`601\` when the delivery is goods-issued.

## Automatic Determination

The schedule line category is determined automatically:

> **Item Category + MRP Type (material) = Schedule Line Category**

- The **item category** of the line (e.g. \`TAN\`) provides the base.
- The **MRP type** on the material master (MRP1 view) refines it.

This is exactly Rahul's case: item category \`TAN\` + MRP type \`ND\` (no planning) → schedule line \`CN\`, which deliberately performs **no availability check** and **no requirement transfer**. Switch the MRP type to a planning type (e.g. \`PD\`) and the same item determines \`CP\` instead, so MRP creates planned orders. Determination is configured in \`VOV5\`.

## Why ATP Lives Here

The **confirmed quantity** and **confirmed date** physically sit on the schedule line. When the availability check runs, its result — full, partial, or no confirmation — is written as schedule lines. A partially confirmed item, for instance, may produce two schedule lines: one confirming part of the quantity now and another confirming the rest later. So if you ever ask "what did the system actually promise the customer?", the answer is read off the schedule lines.

## The Practical Lesson

When MRP isn't planning a sales requirement, or when an order isn't doing an availability check, the schedule line category is the place to look. And because the category is *determined* from the item category plus the material's MRP type, the root cause is usually a master-data setting (the MRP type) rather than the order itself — which is why Rahul fixed the material, not the order.`,
    keyConceptTitle: "The schedule line category controls MRP transfer, availability check, and goods movement",
    keyConceptBody: `- Schedule lines are the **third level** of a sales order — they hold the **confirmed quantity and date**.
- The **schedule line category** (\`VOV6\`) controls **requirement transfer to MRP**, the **availability check**, the **goods movement type** (e.g. 601), and delivery/purchasing relevance.
- Key categories: \`CP\` (MRP + ATP + 601), \`CB\` (no MRP transfer), \`CN\` (no ATP, no transfer — for MRP type \`ND\`).
- Determination: **Item Category + MRP Type = Schedule Line Category** (\`VOV5\`). Fix MRP not planning by checking the material's MRP type, not the order.`,
  },
});
const flowchart4_13 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_13.id },
  update: {},
  create: {
    lessonId: lesson4_13.id,
    title: "Schedule Line Category Determination and Its Effects",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 60 }, data: { label: "🧩 Item Category (e.g. TAN)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 60, y: 230 }, data: { label: "⚙️ MRP Type (material, e.g. PD / ND)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 330, y: 150 }, data: { label: "🔧 Determination (VOV5)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 165, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 590, y: 150 }, data: { label: "📅 Schedule Line Category (CP / CN)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 860, y: 30 }, data: { label: "📈 Transfer of Requirements → MRP" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 860, y: 150 }, data: { label: "✅ Availability Check (ATP)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 860, y: 270 }, data: { label: "📦 Goods Movement (601 at PGI)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node3", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node4", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_13.id, nodeId: "node1", title: "Item Category", description: "The line's item category (e.g. TAN) is the base input for schedule-line-category determination.", tCode: "VOV7", tips: "Non-delivery-relevant items (like TAD services) don't get schedule lines at all." },
    { flowchartId: flowchart4_13.id, nodeId: "node2", title: "MRP Type", description: "From the material master MRP1 view. Planning types (PD) lead to planning-relevant schedule lines; ND (no planning) leads to CN.", tCode: "MM02 (MRP1)", tips: "This single master-data field is usually the real cause of 'MRP isn't planning my order'." },
    { flowchartId: flowchart4_13.id, nodeId: "node3", title: "Determination (VOV5)", description: "Maps item category + MRP type to a schedule line category, with allowed manual alternatives.", tCode: "VOV5", tips: "If determination gives the wrong category, fix the MRP type or the VOV5 assignment." },
    { flowchartId: flowchart4_13.id, nodeId: "node4", title: "Schedule Line Category", description: "The control object at schedule-line level (CP, CB, CN...). Decides MRP transfer, availability check, movement type, and delivery relevance.", tCode: "VOV6", tips: "CP is the standard, fully-active category; CN deliberately does nothing for planning/ATP." },
    { flowchartId: flowchart4_13.id, nodeId: "node5", title: "Transfer of Requirements", description: "If active, the schedule line passes a requirement to MRP so the supply chain plans procurement/production for it.", tCode: "MD04 (stock/req. list)", tips: "No transfer = MRP never sees the sales demand, so no planned orders are created." },
    { flowchartId: flowchart4_13.id, nodeId: "node6", title: "Availability Check (ATP)", description: "If active, ATP runs and writes confirmed quantities/dates onto the schedule lines.", tCode: "CO09 (ATP overview)", tips: "CN performs no availability check — the line confirms without checking stock." },
    { flowchartId: flowchart4_13.id, nodeId: "node7", title: "Goods Movement Type", description: "Defines the inventory movement used at goods issue (601 for a standard sales delivery).", tCode: "VL02N (PGI)", tips: "The movement type here is what posts the stock reduction when the delivery is goods-issued." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_13.id },
  update: {},
  create: {
    lessonId: lesson4_13.id,
    title: "Schedule Line Categories — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "What two inputs determine the schedule line category automatically?",
          explanation: "Schedule line category determination uses the item category (of the line) plus the MRP type (from the material master). This is configured in VOV5.",
          options: {
            create: [
              { text: "Item category + MRP type", isCorrect: true },
              { text: "Sales document type + customer group", isCorrect: false },
              { text: "Plant + storage location", isCorrect: false },
              { text: "Billing type + pricing procedure", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Which behaviors does the schedule line category control?",
          explanation: "The schedule line category controls the transfer of requirements to MRP, whether the availability check runs, and the goods movement type used at goods issue (plus delivery/purchasing relevance).",
          options: {
            create: [
              { text: "Requirement transfer to MRP, availability check, and goods movement type", isCorrect: true },
              { text: "The customer's credit limit and risk category", isCorrect: false },
              { text: "The G/L revenue account for billing", isCorrect: false },
              { text: "The output medium (print vs email)", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A material's sales orders never appear in MRP, and the schedule line category is CN. What is the root cause and fix?",
          explanation: "CN performs no requirement transfer and no availability check — it is determined for materials with MRP type ND (no planning). The fix is to change the material's MRP type to a planning type (e.g. PD), so determination yields CP and requirements flow to MRP. The problem is master data, not the order.",
          options: {
            create: [
              { text: "The material's MRP type is ND (no planning); change it to a planning type so CP is determined", isCorrect: true },
              { text: "The sales order was created in the wrong company code", isCorrect: false },
              { text: "The billing document is missing", isCorrect: false },
              { text: "The customer is blocked for credit", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.14: The Condition Technique
const lesson4_14 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-condition-technique" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "The Condition Technique",
    slug: "sd-condition-technique",
    order: 14,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A client manager corners consultant Sneha during a workshop: "Customer Mehta Traders always gets a special price on our flagship product — but every other customer pays list. Where is that defined? We can't find it." Sneha doesn't open the order. She opens the **access sequence** behind the price condition and walks the team down it line by line. "The system checks the most specific combination first — customer plus material. It finds Mehta's special record there and stops. For everyone else, that record doesn't exist, so it falls through to the general material list price." The room realizes that pricing isn't magic — it's a search down an ordered list, and that search is the condition technique.`,
    content: `## One Framework Behind Many Functions

The **condition technique** is the single most important mechanism to understand in SD configuration — because it powers **pricing**, **output determination**, **revenue account determination**, **material determination**, free goods, and more. Learn it once and you understand all of them. It is, at heart, a structured way for the system to *find the right value* by searching from the most specific match to the most general.

## The Five Components

| Component | What it is | Analogy |
|-----------|-----------|---------|
| **Condition Table** | A combination of fields that forms a key (e.g. Sales Org + Customer + Material) | The columns of a lookup table |
| **Access Sequence** | An *ordered* list of condition tables to search | The search strategy: try specific, then general |
| **Condition Type** | The pricing/output element being determined (e.g. \`PR00\` price) | The thing you're looking up |
| **Pricing Procedure** | The ordered list of all condition types applied | The recipe of every element |
| **Procedure Determination** | Rules that pick which procedure to use | Which recipe for this document |

## Condition Table — the Key

A condition table defines *which fields together* identify a condition record. For example:
- Table A: Sales Org + Distribution Channel + **Customer + Material** (very specific)
- Table B: Sales Org + Distribution Channel + **Material** (general list price)

A **condition record** (created in \`VK11\`) is one row of data for one of these keys — e.g. "Customer Mehta + Material PUMP-100 = ₹9,000."

## Access Sequence — Search Order Is Everything

An **access sequence** is an ordered list of condition tables. The system tries each access **in order** and **stops at the first match**:

\`\`\`
Access 1: Customer + Material   ← most specific, checked first
Access 2: Price list + Material
Access 3: Material              ← general fallback, checked last
\`\`\`

This ordering is *the whole point*. Because the customer+material access comes first, Mehta's special price wins. Any customer without such a record falls through to the general material price. Reorder the accesses and you change which price "wins."

## Condition Type — What's Being Found

A **condition type** (e.g. \`PR00\` for base price, \`K007\` for a discount) is assigned an access sequence. When the system processes a condition type during pricing, it runs that type's access sequence to find the applicable record.

## Procedure and Determination

The **pricing procedure** lists every condition type to apply, in order. Which procedure applies is itself determined (covered in depth in the next lesson) from the sales area + customer + document type. So the full chain is:

> Procedure determination → Pricing procedure → (each) Condition type → Access sequence → Condition table → Condition record

## Same Technique, Other Functions

The power is reuse. **Output determination** uses the identical structure: an output type (e.g. \`BA00\` order confirmation) has an access sequence over condition tables, and condition records say "for customer X, email the confirmation." **Revenue account determination** (\`VKOA\`) likewise uses condition tables to find the right G/L account. Once you can trace an access sequence, you can debug any of these.

## The Consultant's Superpower

When a customer "gets a weird price," the answer is never guesswork. You open the condition type's access sequence and walk it from specific to general, checking which condition record matched first. That trace — not opinion — is how pricing questions are answered on real projects.`,
    keyConceptTitle: "Condition technique = ordered search from specific to general, reused across pricing, output, and account determination",
    keyConceptBody: `- The **condition technique** has five parts: **Condition Table** (the key fields) → **Access Sequence** (ordered list of tables) → **Condition Type** (what's found) → **Pricing Procedure** (the full ordered list) → **Procedure Determination**.
- The **access sequence** searches **most specific first** (e.g. customer+material) and **stops at the first match**, which is why a customer-specific price overrides the general list price.
- **Condition records** (\`VK11\`) are the actual data rows for a table's key.
- The **same framework** powers Output determination and Revenue Account Determination (\`VKOA\`) — learn it once, debug them all.`,
  },
});
const flowchart4_14 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_14.id },
  update: {},
  create: {
    lessonId: lesson4_14.id,
    title: "The Condition Technique: Searching for the Right Value",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 150 }, data: { label: "🧾 Pricing Procedure (ordered condition types)" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 320, y: 150 }, data: { label: "💲 Condition Type (e.g. PR00)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 560, y: 150 }, data: { label: "🪜 Access Sequence (ordered)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 800, y: 40 }, data: { label: "1️⃣ Customer + Material (specific)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 800, y: 160 }, data: { label: "2️⃣ Price list + Material" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 800, y: 280 }, data: { label: "3️⃣ Material (general fallback)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 1050, y: 160 }, data: { label: "📌 Condition Record (VK11)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", label: "try first", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node3", target: "node6", label: "fallback", type: "default" },
      { id: "e6", source: "node4", target: "node7", label: "first match wins", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_14.id, nodeId: "node1", title: "Pricing Procedure", description: "The ordered list of all condition types to apply to the document. Determined from sales area + customer + document type.", tCode: "V/08", tips: "The procedure is the 'recipe'; each line is a condition type to process." },
    { flowchartId: flowchart4_14.id, nodeId: "node2", title: "Condition Type", description: "The individual element being determined — base price (PR00), discount (K007), freight, tax. Each is assigned an access sequence.", tCode: "V/06", tips: "Only condition types with an access sequence are found automatically; others are entered manually." },
    { flowchartId: flowchart4_14.id, nodeId: "node3", title: "Access Sequence", description: "An ordered list of condition tables. The system tries each access in order and stops at the first record it finds.", tCode: "V/07", tips: "Order = priority. Put the most specific table first so it wins." },
    { flowchartId: flowchart4_14.id, nodeId: "node4", title: "Access 1 — Specific", description: "The most specific key, e.g. Customer + Material. Checked first so customer-specific deals override everything else.", tCode: "V/03 (condition table)", tips: "This is where 'special price for one customer' lives." },
    { flowchartId: flowchart4_14.id, nodeId: "node5", title: "Access 2 — Intermediate", description: "A mid-level key such as price list + material, used when no customer-specific record exists.", tCode: "V/03", tips: "Use price-list keys to give groups of customers the same tier." },
    { flowchartId: flowchart4_14.id, nodeId: "node6", title: "Access 3 — General Fallback", description: "The broadest key (e.g. just Material), the default list price reached only if nothing more specific matched.", tCode: "V/03", tips: "Always maintain a general record so pricing never comes up empty." },
    { flowchartId: flowchart4_14.id, nodeId: "node7", title: "Condition Record", description: "The actual data row matched — the price or discount value the system uses. Created and maintained in VK11/VK12.", tCode: "VK11 / VK12 / VK13", tips: "To answer 'why this price?', find which record matched first in the access sequence." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_14.id },
  update: {},
  create: {
    lessonId: lesson4_14.id,
    title: "The Condition Technique — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which component of the condition technique is an ORDERED list of condition tables that the system searches?",
          explanation: "The access sequence is the ordered list of condition tables. The system searches them in order and stops at the first matching record.",
          options: {
            create: [
              { text: "Access sequence", isCorrect: true },
              { text: "Condition type", isCorrect: false },
              { text: "Pricing procedure", isCorrect: false },
              { text: "Condition record", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does a customer-specific price override the general material list price?",
          explanation: "Because the access sequence checks the more specific condition table (customer + material) before the general one (material only) and stops at the first match. The specific record is found first, so it wins.",
          options: {
            create: [
              { text: "The access sequence checks the specific (customer+material) table first and stops at the first match", isCorrect: true },
              { text: "Customer-specific prices are always stored in a separate database", isCorrect: false },
              { text: "The general list price is ignored by the system", isCorrect: false },
              { text: "Pricing picks the highest value automatically", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A consultant needs to explain why one customer gets an unexpected discount. What is the correct way to investigate?",
          explanation: "You trace the condition type's access sequence from most specific to most general, checking which condition record matched first. The condition technique makes pricing deterministic — the answer is found by walking the access sequence, not by guessing. The same approach works for output and account determination.",
          options: {
            create: [
              { text: "Open the condition type's access sequence and find which condition record matched first", isCorrect: true },
              { text: "Delete the order and recreate it until the price changes", isCorrect: false },
              { text: "Change the customer's company code", isCorrect: false },
              { text: "There is no way to trace it; pricing is random", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.15: Condition Types in Pricing
const lesson4_15 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-condition-types-pricing" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Condition Types in Pricing",
    slug: "sd-condition-types-pricing",
    order: 15,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A distributor wants tiered pricing: buy 100 units, get 5% off; buy 500, get 10%. The sales head also wants a fixed freight charge per order and the usual tax line. Consultant Imran maps each requirement to a **condition type**: the base price \`PR00\`, a scale-based discount, freight \`KF00\`, and tax \`MWST\`. "Each pricing element is its own condition type," he explains, "and each has a class that tells the system whether it's a price, a discount, a freight, or a tax — which controls how they combine. The tiers are just a scale on the discount condition." What looked like complex pricing is really a stack of well-defined condition types.`,
    content: `## Condition Types Are the Pricing Building Blocks

If the condition technique is the framework, **condition types** are the individual pieces of the price. Every element that appears on a pricing screen — the base price, each discount, freight, tax — is a separate condition type. The final net value is the result of stacking them in the pricing procedure.

## The Common Condition Types

| Type | Meaning |
|------|---------|
| \`PR00\` | Base price (gross price) |
| \`K004\` | Material discount |
| \`K005\` | Customer/material discount |
| \`K007\` | Customer discount (%) |
| \`KF00\` | Freight |
| \`MWST\` | Output tax |
| \`RA01\` | Percentage discount |
| \`RB00\` | Absolute (fixed amount) discount |

## What Defines a Condition Type (V/06)

Two settings on the condition type matter most because they govern how it combines and calculates:

**Condition class** — the *kind* of element:
- \`B\` = Prices
- \`A\` = Discount or surcharge
- \`C\` = Freight
- \`D\` = Taxes

The class controls *how the value participates* in the calculation (e.g. a price sets the base; a discount adjusts it).

**Calculation type** — the *math*:
- \`A\` = Percentage (e.g. 5%)
- \`B\` = Fixed amount
- \`C\` = Quantity-based (amount per unit)

So \`RA01\` (calculation type \`A\`) is a percentage; \`RB00\` (type \`B\`) is a flat amount.

## Plus/Minus — Surcharge vs Discount

Each condition type carries a **plus/minus** indicator that determines whether it *adds to* (surcharge, e.g. freight) or *subtracts from* (discount) the running value. The same condition type framework thus models both directions.

## Scales — Tiered Pricing

A condition record can carry a **scale**: tiered values based on quantity or value. This is exactly the distributor's requirement:

\`\`\`
from   100 PC → 5 % discount
from   500 PC → 10 % discount
\`\`\`

Scales can be **quantity-based** (PC, KG) or **value-based** (order value). They let one condition record express "the more you buy, the bigger the break" without separate records per tier.

## Manual vs Automatic Conditions

Some condition types are found **automatically** through their access sequence (e.g. \`PR00\` reads the price record). Others are **manual** — added by a salesperson during order entry (e.g. a one-off goodwill discount). The condition type configuration controls whether manual entry is allowed, whether the value can be changed, and whether it is mandatory. A well-designed procedure mixes both: automatic for governed prices, manual for negotiated concessions within limits.

## How They Combine on the Order

In the order's pricing screen each condition type appears as a line. The base price (\`PR00\`) sets the starting value; discounts (class \`A\`, minus) reduce it; freight (\`KF00\`, surcharge) adds; tax (\`MWST\`, class \`D\`) applies on the appropriate subtotal. The **condition class** is what keeps these behaving correctly — taxes calculate on a net base, discounts adjust the price base, and freight adds on top.

## The Practical View

When you need a new pricing element, you don't "write code" — you define a condition type with the right class and calculation type, attach an access sequence if it should be found automatically, decide plus/minus and manual/automatic, and slot it into the pricing procedure. Pricing complexity becomes a matter of *composing condition types*, which is exactly how SAP intends it.`,
    keyConceptTitle: "Each pricing element is a condition type defined by its class (price/discount/freight/tax) and calculation type",
    keyConceptBody: `- A **condition type** (\`V/06\`) is one pricing element: \`PR00\` (price), \`K004/K005/K007\` (discounts), \`KF00\` (freight), \`MWST\` (tax).
- **Condition class** (B=price, A=discount/surcharge, C=freight, D=tax) controls how it combines; **calculation type** (A=%, B=fixed, C=quantity) controls the math.
- The **plus/minus** flag makes it a surcharge or a discount; **scales** give quantity/value-based tiered pricing (buy 100 → 5%, buy 500 → 10%).
- Conditions can be found **automatically** (via access sequence) or entered **manually** by sales staff, as the type's config allows.`,
  },
});
const flowchart4_15 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_15.id },
  update: {},
  create: {
    lessonId: lesson4_15.id,
    title: "Condition Types Stacking into a Net Price",
    nodes: [
      { id: "node1", type: "default", position: { x: 80, y: 150 }, data: { label: "💲 PR00 Base Price (class B)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 340, y: 40 }, data: { label: "➖ K007 Discount (class A, %)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 340, y: 150 }, data: { label: "📊 Scale (100→5%, 500→10%)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 340, y: 260 }, data: { label: "➕ KF00 Freight (class C, surcharge)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 620, y: 150 }, data: { label: "🧮 MWST Tax (class D)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 860, y: 150 }, data: { label: "✅ Net Value on Order Line" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node1", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node5", type: "default" },
      { id: "e6", source: "node5", target: "node6", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_15.id, nodeId: "node1", title: "PR00 Base Price", description: "Condition class B (price). Sets the starting gross value of the line, usually found automatically via its access sequence.", tCode: "V/06 (PR00)", tips: "There can be only one active price (class B) on a line — it's the base everything else adjusts." },
    { flowchartId: flowchart4_15.id, nodeId: "node2", title: "K007 Discount", description: "Condition class A with calculation type A (percentage) and a minus sign, so it reduces the price.", tCode: "VK11 (K007)", tips: "Use customer/material/customer-group discount types depending on how broadly the deal applies." },
    { flowchartId: flowchart4_15.id, nodeId: "node3", title: "Scale", description: "A tiered table on the condition record — different rates by quantity or value (e.g. 100 PC → 5%, 500 PC → 10%).", tCode: "VK11 (scales button)", tips: "One record with a scale replaces many flat records — easier to maintain." },
    { flowchartId: flowchart4_15.id, nodeId: "node4", title: "KF00 Freight", description: "Condition class C (freight) with a plus sign — a surcharge added on top of the price.", tCode: "V/06 (KF00)", tips: "Freight is a surcharge; the plus/minus flag is what makes it add rather than subtract." },
    { flowchartId: flowchart4_15.id, nodeId: "node5", title: "MWST Tax", description: "Condition class D (taxes). Calculates on the appropriate net subtotal using the customer's and material's tax classification.", tCode: "V/06 (MWST)", tips: "Tax sits late in the procedure so it applies after discounts have adjusted the base." },
    { flowchartId: flowchart4_15.id, nodeId: "node6", title: "Net Value", description: "The result of stacking all condition types in procedure order — the value the customer is charged for the line.", tCode: "VA01 (Item > Conditions)", tips: "The conditions tab shows each type and its contribution to the final net value." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_15.id },
  update: {},
  create: {
    lessonId: lesson4_15.id,
    title: "Condition Types in Pricing — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which standard condition type represents the base (gross) price?",
          explanation: "PR00 is the standard base/gross price condition type. K004/K005/K007 are discounts, KF00 is freight, and MWST is tax.",
          options: {
            create: [
              { text: "PR00", isCorrect: true },
              { text: "MWST", isCorrect: false },
              { text: "KF00", isCorrect: false },
              { text: "K007", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does the 'condition class' of a condition type control?",
          explanation: "The condition class (B=price, A=discount/surcharge, C=freight, D=tax) defines what kind of element it is and therefore how it participates in and combines within the price calculation. The calculation type (separate setting) controls the math (%, fixed, quantity).",
          options: {
            create: [
              { text: "What kind of element it is (price, discount, freight, tax) and how it combines", isCorrect: true },
              { text: "The G/L account it posts to", isCorrect: false },
              { text: "Whether the customer is credit-blocked", isCorrect: false },
              { text: "The delivery date proposed by ATP", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A client wants 'buy 100 units → 5% off, buy 500 → 10% off' on one discount condition. How is this configured?",
          explanation: "This is a scale on the discount condition record — a quantity-based tiered table (from 100 → 5%, from 500 → 10%). One record with a scale expresses the tiers without separate records per quantity break.",
          options: {
            create: [
              { text: "A quantity-based scale on the discount condition record", isCorrect: true },
              { text: "Three separate sales organizations", isCorrect: false },
              { text: "A manual entry on every order line", isCorrect: false },
              { text: "A change to the customer's account group", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.16: Pricing Procedure Determination & Full Procedure
const lesson4_16 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-pricing-procedure-determination" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Pricing Procedure Determination & Full Procedure",
    slug: "sd-pricing-procedure-determination",
    order: 16,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `Two consultants argue in a config review. One insists a certain export customer should get a different set of pricing elements than domestic customers. The other says "the procedure is the same for everyone." The lead, Fatima, settles it by opening \`OVKK\`. "The procedure isn't fixed — it's *determined* from three things: the sales area, the customer's pricing procedure key, and the document's pricing procedure key. Give export customers a different customer pricing procedure and they automatically get a different procedure." She then opens \`V/08\` and walks the procedure row by row, showing how From/To references build subtotals. The argument ends — it's all in the determination and the procedure structure.`,
    content: `## The Pricing Procedure Is the Master Recipe

The **pricing procedure** is the ordered list of every condition type applied to a document, with rules for how each behaves. \`RVAA01\` is SAP's standard SD pricing procedure. Understanding two things makes you fluent: **how a procedure is determined**, and **how its rows are structured**.

## Procedure Determination (OVKK)

The procedure is not hard-wired — it is determined from three keys:

> **Sales Area + Customer Pricing Procedure + Document Pricing Procedure = Pricing Procedure**

- **Sales Area** — the org context.
- **Customer Pricing Procedure (CuPP)** — a one-character key on the customer master (Sales Area data). E.g. \`1\` = standard, \`2\` = export.
- **Document Pricing Procedure (DoPP)** — a key on the sales document type (\`VOV8\`). E.g. \`A\` = standard order, \`B\` = free-of-charge.

So an export customer (\`CuPP = 2\`) in a standard order can be routed to a different procedure than a domestic customer (\`CuPP = 1\`) — exactly Fatima's point. This determination is maintained in \`OVKK\`.

## The Structure of a Procedure (V/08)

Each row of a pricing procedure carries these fields:

| Field | Purpose |
|-------|---------|
| **Step / Counter** | The order of processing (10, 20, 30...; counters for sub-steps) |
| **Condition Type** | Which element this row applies (PR00, K007...) |
| **From / To** | Reference to earlier steps to build a subtotal/base |
| **Manual** | Can only be entered by hand (not auto-determined) |
| **Mandatory** | Pricing is incomplete if this is missing (e.g. base price) |
| **Statistical** | Shown for information only; does NOT affect the net value |
| **Print** | Whether/where it prints on output |
| **Subtotal** | Stores the value in a field (KZWI1–KZWI6) for later use |
| **Requirement** | A routine that decides whether the row is processed |
| **Account Key** | Links the condition to a G/L account category |

## From/To — How Subtotals Are Built

The **From/To** columns are how a procedure does arithmetic. A discount row might say "From step 10 (the base price)" so the percentage applies to that base. A "Net value" row might say "From 10 To 90," summing everything between. This is how the procedure adds the base price plus surcharges minus discounts into a net, then applies tax on that net.

## Subtotal Fields (KZWI1–6)

Intermediate values can be parked in **subtotal fields KZWI1 through KZWI6**. These carry meaning downstream — into CO-PA, into reporting, into FI. For example, a "net value before tax" subtotal might feed profitability analysis. They are how SD hands intermediate numbers to other modules.

## Account Key — The Bridge to FI

Each revenue/discount/freight/tax row can carry an **account key** (e.g. \`ERL\` for revenue, \`ERS\` for sales deductions, \`ERF\` for freight). The account key is what **revenue account determination** (\`VKOA\`) uses to post each condition to the right G/L account. So the procedure not only computes the price, it tells finance how to book each piece of it.

## Statistical Conditions

A **statistical** condition appears in pricing for information but does not change the net value — used for cost (\`VPRS\`, internal cost), expected competitor prices, or informational surcharges. Marking a row statistical is how you show a number without charging the customer for it.

## Header vs Item Conditions

Most conditions are **item conditions** (per line). A **header condition** applies to the whole document and is distributed across items — by value, by weight, or by volume, depending on the condition type. A header discount of a fixed amount, for instance, splits proportionally across all lines so each carries its share.

## Pulling It Together

When pricing "looks wrong," the procedure tells the whole story: which rows ran (requirements), how subtotals were built (From/To), what was informational (statistical), and where each piece posts (account key). Mastering \`OVKK\` (determination) and \`V/08\` (structure) is what separates a true pricing consultant from someone who just maintains records.`,
    keyConceptTitle: "The procedure is determined by Sales Area + CuPP + DoPP; its rows use From/To, statistical, and account keys",
    keyConceptBody: `- **Procedure determination** (\`OVKK\`): **Sales Area + Customer Pricing Procedure (CuPP) + Document Pricing Procedure (DoPP) = Pricing Procedure**. \`RVAA01\` is the SAP standard.
- Procedure rows (\`V/08\`) carry **Step/Counter, Condition Type, From/To, Manual, Mandatory, Statistical, Print, Subtotal (KZWI1–6), Requirement, Account Key**.
- **From/To** builds subtotals/bases (discount applies to the base price step; net sums a range); **statistical** rows show a value without affecting the net.
- The **account key** links a condition to its G/L account via \`VKOA\`; **header conditions** distribute across items by value/weight/volume.`,
  },
});
const flowchart4_16 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_16.id },
  update: {},
  create: {
    lessonId: lesson4_16.id,
    title: "Pricing Procedure Determination and Structure",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 40 }, data: { label: "🎯 Sales Area" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 40, y: 150 }, data: { label: "👤 Customer Pricing Proc. (CuPP)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 40, y: 270 }, data: { label: "📄 Document Pricing Proc. (DoPP)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 320, y: 150 }, data: { label: "🔧 Determination (OVKK)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 165, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 570, y: 150 }, data: { label: "🧾 Pricing Procedure (RVAA01)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 830, y: 60 }, data: { label: "📊 Steps + From/To Subtotals" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 830, y: 240 }, data: { label: "💰 Account Keys → FI (VKOA)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node4", type: "default" },
      { id: "e2", source: "node2", target: "node4", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_16.id, nodeId: "node1", title: "Sales Area", description: "The org context (Sales Org + Channel + Division) is the first key in procedure determination.", tCode: "OVKK", tips: "Different sales areas can legitimately use different procedures — e.g. domestic vs export org." },
    { flowchartId: flowchart4_16.id, nodeId: "node2", title: "Customer Pricing Procedure (CuPP)", description: "A one-character key on the customer master Sales Area data (e.g. 1 standard, 2 export). Routes different customer types to different procedures.", tCode: "XD02 (Sales Area data)", tips: "Change CuPP to give a class of customers a whole different pricing set." },
    { flowchartId: flowchart4_16.id, nodeId: "node3", title: "Document Pricing Procedure (DoPP)", description: "A key on the sales document type. Lets free-of-charge or special order types use a different procedure than standard orders.", tCode: "VOV8", tips: "DoPP is how a credit memo or FOC order prices differently from a standard order." },
    { flowchartId: flowchart4_16.id, nodeId: "node4", title: "Determination (OVKK)", description: "The table mapping Sales Area + CuPP + DoPP to a pricing procedure.", tCode: "OVKK", tips: "If the wrong procedure is pulled, this combination is the first thing to check." },
    { flowchartId: flowchart4_16.id, nodeId: "node5", title: "Pricing Procedure", description: "The ordered list of condition types with their control fields. RVAA01 is the standard SD procedure.", tCode: "V/08", tips: "Copy RVAA01 to a Z-procedure before customizing — never edit standard directly." },
    { flowchartId: flowchart4_16.id, nodeId: "node6", title: "Steps + From/To", description: "Steps order the rows; From/To reference earlier steps to build bases and subtotals (e.g. discount on base, net over a range). Statistical rows inform without affecting net.", tCode: "V/08", tips: "Use subtotal fields KZWI1–6 to carry intermediate values to CO-PA and reporting." },
    { flowchartId: flowchart4_16.id, nodeId: "node7", title: "Account Keys → FI", description: "Each condition row's account key (ERL, ERS, ERF...) drives revenue account determination so each piece posts to the right G/L account.", tCode: "VKOA", tips: "Revenue, discounts, and freight each get their own account key for clean FI postings." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_16.id },
  update: {},
  create: {
    lessonId: lesson4_16.id,
    title: "Pricing Procedure Determination — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which three keys determine the pricing procedure?",
          explanation: "The pricing procedure is determined (in OVKK) from the Sales Area + Customer Pricing Procedure (CuPP, from the customer master) + Document Pricing Procedure (DoPP, from the sales document type).",
          options: {
            create: [
              { text: "Sales Area + Customer Pricing Procedure + Document Pricing Procedure", isCorrect: true },
              { text: "Plant + Storage Location + Movement Type", isCorrect: false },
              { text: "Item Category + MRP Type + Schedule Line", isCorrect: false },
              { text: "Company Code + Sales Office + Sales Group", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What does marking a condition row as 'statistical' do?",
          explanation: "A statistical condition is displayed for information only and does not affect the net value the customer is charged — useful for cost (VPRS) or informational values that should appear but not change the price.",
          options: {
            create: [
              { text: "Shows the value for information only without affecting the net price", isCorrect: true },
              { text: "Makes the condition mandatory", isCorrect: false },
              { text: "Posts the condition to two G/L accounts", isCorrect: false },
              { text: "Prevents the order from being saved", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "An export customer must receive a completely different set of pricing elements than domestic customers, using the same order type. What is the cleanest way to achieve this?",
          explanation: "Assign the export customers a different Customer Pricing Procedure (CuPP) on the customer master. Because the procedure is determined from Sales Area + CuPP + DoPP, a different CuPP routes those customers to a different pricing procedure — without changing the order type.",
          options: {
            create: [
              { text: "Give export customers a different Customer Pricing Procedure (CuPP) so OVKK determines a different procedure", isCorrect: true },
              { text: "Manually re-enter every condition on each export order", isCorrect: false },
              { text: "Create a separate company code for exports", isCorrect: false },
              { text: "Mark all export conditions as statistical", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.17: ATP — Available-to-Promise
const lesson4_17 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-atp-available-to-promise" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "ATP — Available-to-Promise",
    slug: "sd-atp-available-to-promise",
    order: 17,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A customer phones the sales desk: "I need 500 units by Friday — can you commit?" The agent enters the order, and SAP instantly answers: 300 confirmed for Friday, 200 on the following Wednesday. The customer is annoyed but informed. Later, a delayed shipment arrives early, and overnight a batch job re-confirms hundreds of stuck orders automatically. Consultant Deepak explains to the trainees: "That instant promise, and that overnight catch-up, are both ATP. The system is constantly answering one question — can we deliver this quantity by this date — by netting supply against demand."`,
    content: `## The Question ATP Answers

**ATP (Available-to-Promise)** answers a single, business-critical question at order entry: *"Can we deliver X units on the requested date?"* It is what turns an order into a *promise*. The check runs automatically when a sales order line is created or changed, and it writes its answer onto the schedule lines as **confirmed quantities and dates**.

## The ATP Calculation

ATP is fundamentally a netting calculation over a time horizon:

> **ATP quantity = Stock + Planned Receipts − Planned Issues**

- **Stock** — unrestricted warehouse stock on hand.
- **Planned receipts** — incoming supply: planned orders, production orders, purchase orders.
- **Planned issues** — outgoing commitments: other sales orders, deliveries, reservations.

Whatever is left, on each date, is what can be promised. The check considers the *timeline*, not just today's stock — so a receipt arriving Thursday can confirm an order for Friday.

## What Goes Into the Check (the Scope)

The **checking rule** (and the availability check group on the material's MRP3 view) controls *which* elements ATP includes. For instance:
- Whether **safety stock** is included or held back.
- Whether **planned/production orders** count as receipts.
- Whether **purchase requisitions/orders** count.

This is configured so the business can decide how optimistic or conservative the promise should be. Include more receipts → more gets confirmed but with more risk; exclude them → safer but more conservative promises.

## Three Possible Outcomes

| Outcome | Meaning |
|---------|---------|
| **Fully confirmed** | The whole quantity is available by the requested date |
| **Partially confirmed** | Some now, the rest on a later date (multiple schedule lines) |
| **Not confirmed** | Nothing available by the date; the system proposes a new date |

## Delivery Proposals

When the full quantity can't be met, ATP offers a **delivery proposal**: either a **complete delivery** on a later date (wait until everything's available) or a **partial delivery** — ship what's available now and the rest later. Which is allowed depends on the customer's and material's delivery settings.

## Transfer of Requirements

ATP and planning are linked through the **transfer of requirements**: a confirmed (or unconfirmed) sales order line passes a requirement to MRP, so the supply chain plans to cover it. This is the same mechanism governed by the schedule line category — confirmed demand becomes input to procurement and production planning.

## Rescheduling and Backorders

Supply changes constantly, so ATP isn't a one-time event:
- **Rescheduling (\`V_V2\`)** — a batch job that re-runs the availability check across all open orders when supply arrives, re-confirming or re-sorting by priority. This is the overnight catch-up in the story.
- **Backorder processing (\`VA26\`, \`V_RA\`)** — manual or list-based handling of what to do when demand exceeds supply: which orders get the scarce stock first.

## Where to Look

\`CO09\` shows the **availability overview** for a material — the running ATP situation date by date. \`MD04\` (stock/requirements list) shows the supply/demand elements feeding it. Together they let a consultant explain *exactly* why an order confirmed the way it did.

## The Practical Point

ATP is where customer service meets supply reality. A confident, accurate promise depends on the checking rule being set sensibly and on rescheduling keeping confirmations current. Get the scope wrong and you either over-promise (and miss dates) or under-promise (and lose sales) — which is why ATP configuration is taken so seriously.`,
    keyConceptTitle: "ATP nets Stock + Receipts − Issues over time to confirm quantity and date",
    keyConceptBody: `- **ATP** answers "can we deliver X by this date?" at order entry, writing confirmed quantities/dates onto **schedule lines**.
- Core formula: **ATP = Stock + Planned Receipts − Planned Issues**, evaluated across the timeline; the **checking rule / availability check group** (material MRP3 view) controls what's included (e.g. safety stock, planned orders).
- Three outcomes: **fully / partially / not confirmed**, with a **delivery proposal** (complete-later vs partial-now).
- **Transfer of Requirements** feeds MRP; **rescheduling (\`V_V2\`)** re-confirms open orders when supply changes; **backorder processing (\`VA26\`)** allocates scarce stock. View via \`CO09\` / \`MD04\`.`,
  },
});
const flowchart4_17 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_17.id },
  update: {},
  create: {
    lessonId: lesson4_17.id,
    title: "The ATP Check: From Order to Confirmation",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 150 }, data: { label: "🛒 Sales Order Line Created" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 150 }, data: { label: "🔎 ATP Check (Stock + Receipts − Issues)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 570, y: 30 }, data: { label: "✅ Fully Confirmed" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 570, y: 150 }, data: { label: "🟧 Partially Confirmed (2 schedule lines)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 570, y: 280 }, data: { label: "❌ Not Confirmed → propose new date" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 840, y: 90 }, data: { label: "📈 Transfer of Req. → MRP" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 840, y: 240 }, data: { label: "🔁 Rescheduling (V_V2) / Backorder (VA26)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node3", target: "node6", type: "default" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_17.id, nodeId: "node1", title: "Sales Order Line", description: "ATP is triggered when a line is created or changed, using the requested delivery date and quantity.", tCode: "VA01 / VA02", tips: "Changing the quantity or date re-triggers the check automatically." },
    { flowchartId: flowchart4_17.id, nodeId: "node2", title: "ATP Check", description: "Nets stock plus planned receipts minus planned issues across the timeline. Scope is set by the checking rule and availability check group.", tCode: "CO09 (availability overview)", tips: "Use CO09 to see the date-by-date ATP situation behind a confirmation." },
    { flowchartId: flowchart4_17.id, nodeId: "node3", title: "Fully Confirmed", description: "The entire quantity is available by the requested date — one schedule line confirms it all.", tCode: "VA03 (schedule lines)", tips: "Full confirmation on the requested date is the happy path." },
    { flowchartId: flowchart4_17.id, nodeId: "node4", title: "Partially Confirmed", description: "Part of the quantity confirms now, the remainder on a later date — producing multiple schedule lines.", tCode: "VA03 (schedule lines)", tips: "The schedule lines are where the split promise is recorded." },
    { flowchartId: flowchart4_17.id, nodeId: "node5", title: "Not Confirmed", description: "Nothing is available by the requested date; ATP proposes the earliest possible date instead.", tCode: "VA02", tips: "A delivery proposal offers complete-later or partial-now depending on customer/material settings." },
    { flowchartId: flowchart4_17.id, nodeId: "node6", title: "Transfer of Requirements", description: "The order's demand is passed to MRP so procurement/production plan to cover it.", tCode: "MD04", tips: "Governed by the schedule line category — no transfer means MRP can't plan the demand." },
    { flowchartId: flowchart4_17.id, nodeId: "node7", title: "Rescheduling / Backorder", description: "V_V2 batch re-confirms open orders when supply changes; VA26/V_RA handle allocation when demand exceeds supply.", tCode: "V_V2 / VA26", tips: "Rescheduling by priority ensures the most important orders get scarce stock first." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_17.id },
  update: {},
  create: {
    lessonId: lesson4_17.id,
    title: "ATP — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "At a high level, how does ATP calculate what can be promised?",
          explanation: "ATP nets supply against demand over time: ATP = Stock + Planned Receipts − Planned Issues. The result on each date is what can be confirmed.",
          options: {
            create: [
              { text: "Stock + Planned Receipts − Planned Issues, across the timeline", isCorrect: true },
              { text: "Customer credit limit minus open invoices", isCorrect: false },
              { text: "List price multiplied by quantity", isCorrect: false },
              { text: "Number of sales orders divided by plants", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Where are the confirmed quantity and confirmed delivery date stored after the ATP check?",
          explanation: "ATP writes its result onto the schedule lines of the order item. A partial confirmation produces multiple schedule lines (some now, some later).",
          options: {
            create: [
              { text: "On the schedule lines of the order item", isCorrect: true },
              { text: "On the billing document only", isCorrect: false },
              { text: "In the customer master record", isCorrect: false },
              { text: "In the pricing procedure", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A delayed shipment arrives, and overnight hundreds of previously unconfirmed orders become confirmed without anyone touching them. What made this happen?",
          explanation: "Rescheduling (the V_V2 batch job) re-runs the availability check across all open orders when supply changes, re-confirming them (often by priority). This keeps confirmations current as supply arrives — exactly the overnight catch-up described.",
          options: {
            create: [
              { text: "The rescheduling batch job (V_V2) re-ran ATP against the new supply", isCorrect: true },
              { text: "The pricing procedure recalculated", isCorrect: false },
              { text: "The customers' credit limits increased", isCorrect: false },
              { text: "The billing due list was processed", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.18: Shipping & Transportation Configuration
const lesson4_18 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-shipping-transportation-config" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Shipping & Transportation Configuration",
    slug: "sd-shipping-transportation-config",
    order: 18,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A logistics lead asks consultant Nisha why orders for their southern customers always ship from the Chennai warehouse and never from Delhi — and why those orders need to be picked three days before the delivery date. Nisha pulls up the determination rules. "The shipping point comes from the customer's shipping condition, the material's loading group, and the plant. And the three days? That's the route's transit and lead time, scheduled backwards from the date the customer wants." She shows them the chain on screen. Suddenly the warehouse team understands that nothing is arbitrary — every shipment's origin and timing is *determined* by configuration.`,
    content: `## From Order to Physical Movement

Once an order is confirmed, SAP must decide **from where** the goods leave and **how/when** they travel. Two determinations answer this: **shipping point** (the departure location) and **route** (the transport path and its timing). Both feed **delivery scheduling**, which works backwards from the date the customer wants to the date the order must be processed.

## Shipping Point Determination

The **shipping point** is the physical place from which goods depart — a loading dock, a warehouse zone. It is determined automatically from three inputs:

> **Shipping Condition (customer) + Loading Group (material) + Plant = Shipping Point**

- **Shipping condition** — from the customer master (e.g. "standard," "express"); how the customer wants to receive goods.
- **Loading group** — from the material's Sales: General/Plant view (e.g. goods needing a forklift vs. hand-carried).
- **Plant** — the delivering plant on the order line.

This is why southern customers always ship from Chennai: their shipping condition + the material's loading group + the assigned plant resolve to the Chennai shipping point. Configured under \`SPRO → Logistics Execution → Shipping → Basic Shipping Functions → Shipping Point Determination\`.

## Route Determination

The **route** defines the transportation path and, crucially, its **timing**. It is determined from:

> **Departure Zone + Shipping Condition + Transportation Group (material) + Destination (transportation) Zone = Route**

- **Departure zone** — geographic zone of the shipping point.
- **Transportation group** — material grouping (e.g. bulky, refrigerated).
- **Destination zone** — geographic zone of the ship-to party.

The route carries **transit time** (how long goods are in transer) and **transportation lead time** (how far in advance you must arrange the carrier).

## Delivery Scheduling — Working Backwards

This is the elegant part. Given the **requested delivery date**, the system schedules *backwards* to find when each step must happen:

\`\`\`
Requested Delivery Date
   ← Transit Time (route)        → Goods Issue Date
   ← Loading Time                → Loading Date
   ← Pick/Pack Time              → Material Availability Date
   ← Transportation Lead Time    → Transportation Planning Date
= required Order/Material-Availability date
\`\`\`

If the calculated material-availability date is in the past, the requested date can't be met and ATP proposes a later one. This backward schedule is why the southern orders must be picked three days early — the transit and loading times push the goods-issue date back from the delivery date.

## Transportation Planning Point

Freight and carrier management hang off the **transportation planning point**, the organizational unit that plans shipments (transportation documents, freight costs). On a basic SD setup it may be light-touch; in transportation-heavy industries it manages carriers, freight condition records, and shipment cost documents.

## Why It Matters on a Project

When a customer complains "you always ship from the wrong warehouse" or "we never get enough lead time," the answer is in these determinations. Shipping point and route are *determined*, not chosen by clerks — so fixing the complaint means adjusting the shipping condition, loading/transportation group, or route definition, not nagging the warehouse. Mastering this chain lets a consultant control both the *origin* and the *timing* of every delivery.`,
    keyConceptTitle: "Shipping point and route are determined automatically and drive backward delivery scheduling",
    keyConceptBody: `- **Shipping point** = **Shipping Condition (customer) + Loading Group (material) + Plant** — the physical departure location.
- **Route** = **Departure Zone + Shipping Condition + Transportation Group + Destination Zone**; it carries **transit time** and **transportation lead time**.
- **Delivery scheduling** works **backwards** from the requested delivery date: delivery ← transit → goods issue ← loading → material availability ← lead time → order date.
- If the computed material-availability date is in the past, the requested date can't be met; the **transportation planning point** manages freight/carriers.`,
  },
});
const flowchart4_18 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_18.id },
  update: {},
  create: {
    lessonId: lesson4_18.id,
    title: "Shipping Point, Route, and Backward Scheduling",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 40 }, data: { label: "🚦 Shipping Condition (customer)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 40, y: 160 }, data: { label: "📦 Loading Group (material)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 40, y: 280 }, data: { label: "🏭 Plant" }, style: { background: "#EF4444", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 320, y: 160 }, data: { label: "📍 Shipping Point" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 560, y: 90 }, data: { label: "🗺️ Route (transit + lead time)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 560, y: 240 }, data: { label: "⏪ Backward Delivery Scheduling" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 830, y: 160 }, data: { label: "📅 Goods Issue / Loading / Avail. Dates" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node4", type: "default" },
      { id: "e2", source: "node2", target: "node4", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_18.id, nodeId: "node1", title: "Shipping Condition", description: "From the customer master — how the customer wants goods delivered (standard, express). One of three inputs to shipping point determination.", tCode: "XD02 (Shipping tab)", tips: "Express vs standard shipping conditions can route to different, faster shipping points." },
    { flowchartId: flowchart4_18.id, nodeId: "node2", title: "Loading Group", description: "From the material's Sales: General/Plant view — reflects how the material is handled/loaded (e.g. forklift, crane).", tCode: "MM02 (General/Plant)", tips: "If shipping point won't determine, an empty loading group is a common cause." },
    { flowchartId: flowchart4_18.id, nodeId: "node3", title: "Plant", description: "The delivering plant on the order line — the third input to shipping point determination.", tCode: "VA02 (item detail)", tips: "Plant comes from the material/customer determination; check it if the origin looks wrong." },
    { flowchartId: flowchart4_18.id, nodeId: "node4", title: "Shipping Point", description: "The determined physical departure location for the goods. Drives where picking/loading happens.", tCode: "SPRO (Shipping Point Det.)", tips: "Shipping point is determined, not chosen — fix the inputs to change the origin." },
    { flowchartId: flowchart4_18.id, nodeId: "node5", title: "Route", description: "Determined from departure zone + shipping condition + transportation group + destination zone. Holds transit time and transportation lead time.", tCode: "0VRF / SPRO (Route Det.)", tips: "Transit time is what pushes the goods-issue date earlier than the delivery date." },
    { flowchartId: flowchart4_18.id, nodeId: "node6", title: "Backward Scheduling", description: "From the requested delivery date the system subtracts transit, loading, pick/pack, and lead times to find when each step must occur.", tCode: "VA01 (scheduling)", tips: "If the computed availability date is in the past, the requested date can't be met." },
    { flowchartId: flowchart4_18.id, nodeId: "node7", title: "Scheduled Dates", description: "The resulting material-availability, loading, and goods-issue dates that drive warehouse and transport execution.", tCode: "VL01N (delivery)", tips: "These dates tell the warehouse exactly how early to start picking." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_18.id },
  update: {},
  create: {
    lessonId: lesson4_18.id,
    title: "Shipping & Transportation — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which three inputs determine the shipping point?",
          explanation: "Shipping point determination uses the shipping condition (customer master) + loading group (material) + delivering plant.",
          options: {
            create: [
              { text: "Shipping condition + loading group + plant", isCorrect: true },
              { text: "Sales org + distribution channel + division", isCorrect: false },
              { text: "Item category + MRP type + schedule line", isCorrect: false },
              { text: "Customer pricing procedure + document pricing procedure + sales area", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why does delivery scheduling work backwards from the requested delivery date?",
          explanation: "To meet a date the customer wants, the system must subtract transit time, loading time, pick/pack time, and transportation lead time to find the latest dates each step (goods issue, loading, material availability) can occur — and thus whether the date is achievable.",
          options: {
            create: [
              { text: "To compute when goods issue, loading, and material availability must happen to hit the requested date", isCorrect: true },
              { text: "Because SAP cannot calculate forward in time", isCorrect: false },
              { text: "To determine the customer's credit limit", isCorrect: false },
              { text: "To pick the G/L revenue account", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A customer complains they never get enough lead time before shipments. Where should the consultant look?",
          explanation: "Lead time comes from the route's transit time and transportation lead time (and the backward-scheduling times). Adjusting the route definition or the relevant scheduling times changes how early the process must start — the complaint is a configuration matter, not a warehouse behavior to nag about.",
          options: {
            create: [
              { text: "The route's transit/transportation lead times and the delivery scheduling setup", isCorrect: true },
              { text: "The customer's account group", isCorrect: false },
              { text: "The billing type linked to the order", isCorrect: false },
              { text: "The pricing procedure determination", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.19: Copy Control
const lesson4_19 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-copy-control" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Copy Control",
    slug: "sd-copy-control",
    order: 19,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A finance auditor flags a problem: a credit memo was issued at a higher price than the original invoice it referenced, costing the company money. The SD consultant, Vivek, traces it and finds the credit memo request was created freely, with manual prices, instead of *copying* the original billing document's conditions. "Copy control is the rulebook for how data flows from one document to the next," he explains. "When a credit memo references an invoice, copy control should pull the original price so nobody can quietly change it." He fixes the copy control settings, and the loophole closes.`,
    content: `## How Documents Flow Into Each Other

SD documents rarely stand alone — an order becomes a delivery, a delivery becomes an invoice, an invoice becomes a credit memo. **Copy control** is the configuration that governs *how data flows* from a source document to a target document: which fields copy, how they transform, and whether the copy is even allowed. It is what keeps the document chain consistent and auditable.

## The Main Copy Control Paths

Each path has its own configuration transaction:

| Path | Transaction | Example |
|------|-------------|---------|
| Order → Order | \`VTAA\` | Quotation → standard order |
| Order → Delivery | \`VTLA\` | Order → outbound delivery |
| Delivery → Billing | \`VTFL\` | Delivery → invoice |
| Order → Billing | \`VTFA\` | Order-related billing (e.g. services, credit memos) |

## Three Levels Within Each Path

For every source/target type combination, copy control is defined at up to three levels:

- **Header** — document-level data (e.g. customer, currency).
- **Item** — line-level data (material, quantity, pricing handling).
- **Schedule line** — for order→delivery, how confirmed quantities/dates flow.

At each level you specify the rules that govern the copy.

## The Key Control Fields

Two kinds of routines do the heavy lifting:

- **Data transfer routines (VOFM)** — small programs that decide *which fields are copied and how they're transformed* from source to target. SAP ships standard routines; custom ones can be written for special needs.
- **Copy requirements** — conditions that *must be satisfied before the copy is allowed*. For example, a common delivery→billing requirement is that the delivery must be **goods-issued** before it can be billed. If the requirement fails, the system blocks the copy.

Other item-level fields control **pricing type** — whether prices are **copied unchanged** from the source, **redetermined** fresh, or copied and only taxes redetermined. This single setting is exactly what fixed Vivek's bug.

## Why the Credit Memo Bug Happened

A credit memo request that references a billing document should use a **pricing type that copies the original conditions** (so the credit reflects what was actually charged). Vivek's system was redetermining or allowing manual prices, so the credit memo priced differently from the original invoice. Setting the correct pricing type in the order→billing copy control (\`VTFA\`) forces the original price to carry over and removes the loophole.

## Copy Requirements as Guardrails

Copy requirements aren't just technical — they enforce process rules. "You cannot bill a delivery that hasn't been goods-issued" is a copy requirement. "You can only create a return with reference to a billing document" is enforced through copy control. By controlling *what can be referenced from what*, copy control is a primary lever for tightening or loosening process discipline.

## A Common Config Task

Enabling a new flow — say, allowing a new Z-order type to be delivered and billed — almost always means setting up copy control for it. If a user reports "I can't create a delivery from this order type" or "the system won't let me reference this document," the cause is usually missing or restrictive copy control. It's one of the most frequent configuration touchpoints in SD.

## The Takeaway

Copy control is the invisible plumbing of the document flow. It decides what's allowed (requirements), what carries over (data transfer routines), and how pricing behaves (pricing type). Get it right and documents flow cleanly and accurately; get it wrong and you see blocked steps or — worse — silent pricing errors like the credit-memo case.`,
    keyConceptTitle: "Copy control governs what data flows between documents, how, and whether it's allowed",
    keyConceptBody: `- **Copy control** defines how data flows source→target across paths: Order→Order (\`VTAA\`), Order→Delivery (\`VTLA\`), Delivery→Billing (\`VTFL\`), Order→Billing (\`VTFA\`), each at **header / item / schedule-line** level.
- **Data transfer routines (VOFM)** decide which fields copy and how; **copy requirements** are conditions that must hold before a copy is allowed (e.g. delivery must be goods-issued before billing).
- The item **pricing type** controls whether prices are **copied unchanged**, **redetermined**, or partially redetermined — critical so a credit memo reflects the original invoice price.
- Missing/restrictive copy control is the usual cause of "I can't create a delivery/billing from this document."`,
  },
});
const flowchart4_19 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_19.id },
  update: {},
  create: {
    lessonId: lesson4_19.id,
    title: "Copy Control Across the Document Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 150 }, data: { label: "📄 Quotation / Order" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 260, y: 150 }, data: { label: "🛒 Sales Order (VTAA)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 480, y: 60 }, data: { label: "🚚 Delivery (VTLA)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 700, y: 60 }, data: { label: "🧾 Billing from Delivery (VTFL)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 700, y: 230 }, data: { label: "🧾 Billing from Order (VTFA)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 480, y: 230 }, data: { label: "🛡️ Copy Requirements (e.g. PGI done)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 940, y: 145 }, data: { label: "💲 Pricing Type (copy vs redetermine)" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node6", target: "node4", type: "default" },
      { id: "e6", source: "node4", target: "node7", type: "default" },
      { id: "e7", source: "node5", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_19.id, nodeId: "node1", title: "Source Document", description: "The originating document (quotation, order, delivery, or invoice) whose data will flow into the next document.", tCode: "VA21 / VA01", tips: "A clean document flow always starts from a properly referenced source." },
    { flowchartId: flowchart4_19.id, nodeId: "node2", title: "Order→Order Copy (VTAA)", description: "Controls how a quotation or prior order copies into a new sales order — header, item, and schedule-line rules.", tCode: "VTAA", tips: "Use this to let quotations be referenced into orders without re-keying." },
    { flowchartId: flowchart4_19.id, nodeId: "node3", title: "Order→Delivery Copy (VTLA)", description: "Defines how the order copies into the outbound delivery, including which schedule-line quantities flow.", tCode: "VTLA", tips: "If an order type 'can't create a delivery', VTLA setup is usually missing." },
    { flowchartId: flowchart4_19.id, nodeId: "node4", title: "Delivery→Billing Copy (VTFL)", description: "Governs delivery-related billing — the standard path for physical goods. Requirements ensure the delivery is goods-issued first.", tCode: "VTFL", tips: "Delivery-related billing is the norm for goods; order-related (VTFA) for services/credits." },
    { flowchartId: flowchart4_19.id, nodeId: "node5", title: "Order→Billing Copy (VTFA)", description: "Order-related billing, used for services, credit/debit memos, and pro-forma — where there is no delivery to bill from.", tCode: "VTFA", tips: "Credit/debit memo requests bill via VTFA referencing the original invoice." },
    { flowchartId: flowchart4_19.id, nodeId: "node6", title: "Copy Requirements", description: "Conditions that must be met before the copy is allowed — e.g. the delivery must be goods-issued before it can be billed.", tCode: "VOFM (requirements)", tips: "Requirements are guardrails that enforce process order across documents." },
    { flowchartId: flowchart4_19.id, nodeId: "node7", title: "Pricing Type", description: "Item-level setting: copy prices unchanged, redetermine them, or copy and redetermine only taxes. Critical for credit memos to reflect the original price.", tCode: "VTFA / VTFL (item)", tips: "Set 'copy unchanged' for credit memos so they can't be priced differently from the invoice." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_19.id },
  update: {},
  create: {
    lessonId: lesson4_19.id,
    title: "Copy Control — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which transaction configures copy control for delivery-to-billing?",
          explanation: "VTFL configures delivery→billing copy control. VTAA is order→order, VTLA is order→delivery, and VTFA is order→billing.",
          options: {
            create: [
              { text: "VTFL", isCorrect: true },
              { text: "VTAA", isCorrect: false },
              { text: "VTLA", isCorrect: false },
              { text: "VKOA", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the purpose of a 'copy requirement' in copy control?",
          explanation: "A copy requirement is a condition that must be satisfied before the copy is allowed — for example, requiring a delivery to be goods-issued before it can be billed. It enforces correct process order.",
          options: {
            create: [
              { text: "A condition that must be met before the copy is allowed (e.g. PGI before billing)", isCorrect: true },
              { text: "The G/L account the billing posts to", isCorrect: false },
              { text: "The customer's credit limit", isCorrect: false },
              { text: "The route's transit time", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A credit memo referencing an invoice was issued at a different price than the original. Which copy control setting fixes this?",
          explanation: "The item-level pricing type should be set to copy the original conditions unchanged from the referenced billing document, so the credit memo reflects exactly what was charged and prices can't be silently altered. Redetermining prices is what allowed the discrepancy.",
          options: {
            create: [
              { text: "Set the pricing type to copy the original billing conditions unchanged", isCorrect: true },
              { text: "Delete the original invoice", isCorrect: false },
              { text: "Change the customer's account group", isCorrect: false },
              { text: "Mark the credit memo as statistical", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.20: Credit Management
const lesson4_20 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-credit-management" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Credit Management",
    slug: "sd-credit-management",
    order: 20,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A new customer places a large first order. It saves, but immediately shows status "B" — blocked — and lands in the credit manager's worklist. The sales rep is frustrated: "They're a great prospect, why block them?" The credit analyst, Lakshmi, explains: "We gave them a deliberately low credit limit because they have no payment history with us. Until they prove they pay, the system protects us from over-exposure." She reviews and releases the order manually. "Credit management isn't about distrust," she tells the rep. "It's about making sure one unpaid customer can't sink our cash flow."`,
    content: `## What Credit Management Protects Against

**Credit management** controls whether a customer's order proceeds or is **blocked** when they would exceed their **credit limit**. Its job is to protect the company from overextending credit to customers who may not pay. When a check fails, the document is blocked and routed for manual review before it can continue to delivery and billing.

> Note: classic SD credit management (FD32 / OVA8) is described here as the foundational model; S/4HANA also offers SAP Credit Management (FSCM), which uses the credit-control transactions UKM* but follows the same concepts.

## Setting the Customer's Credit Profile (FD32)

In classic credit management, \`FD32\` is where a customer's credit data lives within a **credit control area**:

- **Credit limit** — the maximum exposure allowed.
- **Risk category** — low / medium / high, controlling how strict the check is.
- **Credit exposure** — the running total of what the customer currently owes plus committed.

## When the Check Runs

The credit check can be triggered at configurable points in the flow:

- **At order save** — block risky orders before they're processed.
- **At delivery creation** — re-check before committing goods.
- **At goods issue (PGI)** — final gate before stock leaves.

Where the check fires is configured in the credit-check settings (\`OVA8\`), letting the business choose how early to intervene.

## Three Types of Credit Check

| Check type | What it compares |
|------------|-----------------|
| **Static** | Credit limit vs. the simple sum of open items (a fixed snapshot) |
| **Dynamic** | Credit limit vs. exposure, considering a time horizon — open orders, deliveries, invoices, and AR within the horizon |
| **Maximum document value** | Blocks any single document above a set value, regardless of overall limit |

The **dynamic** check is the most common because it looks at the full, time-bounded picture of what the customer has committed.

## Credit Exposure — the Full Picture

A customer's **credit exposure** is more than unpaid invoices. It is:

> Open Orders + Open Deliveries + Open Billing + Open Accounts Receivable = Total Exposure

So a customer can hit their limit purely through *unbilled commitments* — large open orders — even before a single invoice is overdue. This is why a big first order can trip the block immediately.

## The Block and the Release (VKM1)

A blocked document gets credit status **"B"** and appears in the **credit manager's worklist (\`VKM1\`)**. The credit manager reviews the exposure and either **releases** the document (letting it continue) or holds it. This human checkpoint is deliberate — it puts a person between a risky order and the warehouse.

## Risk Categories in Practice

Risk categories tune the strictness:
- **Low risk** — lenient checks, established reliable customers.
- **Medium risk** — standard checking.
- **High risk** — tight checks, frequent blocks, for customers with payment concerns.

## The Practical Rule

A new customer should start with a **low credit limit** until payment history is established — exactly Lakshmi's point. As they prove reliable, the limit is raised. Credit management is the SD-FI bridge for *risk*: SD generates the exposure (orders, deliveries) and FI tracks the receivables, and credit management sits across both to keep the company's cash safe. When sales complains about blocks, the answer is usually to revisit the limit and risk category — not to disable the check.`,
    keyConceptTitle: "Credit management blocks orders that exceed the credit limit, with manual release via VKM1",
    keyConceptBody: `- **Credit management** blocks documents when a customer would exceed their **credit limit**; classic config uses \`FD32\` (limit, risk category) and \`OVA8\` (check settings); S/4HANA FSCM uses UKM* with the same concepts.
- The check can fire **at order save, delivery, or goods issue**; types are **static**, **dynamic** (time-horizon, most common), and **maximum document value**.
- **Credit exposure** = Open Orders + Open Deliveries + Open Billing + Open AR — so large unbilled orders can hit the limit on their own.
- Blocked documents get status **"B"** and appear in the credit manager's worklist (\`VKM1\`) for release; new customers should start with a **low limit**.`,
  },
});
const flowchart4_20 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_20.id },
  update: {},
  create: {
    lessonId: lesson4_20.id,
    title: "Credit Check: From Order to Block or Release",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 150 }, data: { label: "🛒 Order Saved" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 150, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 280, y: 150 }, data: { label: "🧮 Credit Check (exposure vs limit)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 280, y: 30 }, data: { label: "👤 Credit Master FD32 (limit, risk cat.)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 540, y: 60 }, data: { label: "✅ Within Limit → Proceed" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 540, y: 240 }, data: { label: "⛔ Over Limit → Status B (Blocked)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 810, y: 240 }, data: { label: "🧑‍💼 Credit Worklist VKM1 (release?)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 810, y: 60 }, data: { label: "🚚 Delivery / Goods Issue" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node3", target: "node2", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node6", target: "node7", label: "released", type: "default" },
      { id: "e7", source: "node4", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_20.id, nodeId: "node1", title: "Order Saved", description: "Saving the order triggers the credit check (if configured at order save). It can also fire at delivery or goods issue.", tCode: "VA01", tips: "Where the check fires is set in OVA8 — earlier is safer but more disruptive." },
    { flowchartId: flowchart4_20.id, nodeId: "node2", title: "Credit Check", description: "Compares the customer's credit exposure against their limit, using the configured check type (static, dynamic, or max document value).", tCode: "OVA8", tips: "The dynamic check uses a time horizon and is the most common in practice." },
    { flowchartId: flowchart4_20.id, nodeId: "node3", title: "Credit Master (FD32)", description: "Holds the customer's credit limit, risk category, and current exposure within the credit control area.", tCode: "FD32 (FSCM: UKM_BP)", tips: "Set new customers to a low limit and appropriate risk category until they prove they pay." },
    { flowchartId: flowchart4_20.id, nodeId: "node4", title: "Within Limit", description: "If exposure stays under the limit, the order proceeds normally toward delivery and billing.", tCode: "VA02", tips: "Most orders pass silently — blocks are the exception, not the rule." },
    { flowchartId: flowchart4_20.id, nodeId: "node5", title: "Blocked (Status B)", description: "Exceeding the limit sets credit status B and holds the document from further processing.", tCode: "VA02 (status)", tips: "A blocked order can't be delivered until it's released." },
    { flowchartId: flowchart4_20.id, nodeId: "node6", title: "Credit Worklist (VKM1)", description: "The credit manager reviews blocked documents and releases or holds them — the human checkpoint.", tCode: "VKM1 / VKM3", tips: "Releasing in VKM1 lets the document continue; the decision and reason are auditable." },
    { flowchartId: flowchart4_20.id, nodeId: "node7", title: "Delivery / Goods Issue", description: "Once within limit or released, the document continues to delivery and goods issue.", tCode: "VL01N", tips: "If the check is set at goods issue, this is the final credit gate before stock leaves." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_20.id },
  update: {},
  create: {
    lessonId: lesson4_20.id,
    title: "Credit Management — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Where does a credit manager review and release blocked sales documents?",
          explanation: "VKM1 is the credit manager's worklist where blocked documents (status B) are reviewed and released or held.",
          options: {
            create: [
              { text: "VKM1 (credit worklist)", isCorrect: true },
              { text: "VA01 (create order)", isCorrect: false },
              { text: "VF01 (billing)", isCorrect: false },
              { text: "MM02 (material master)", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Credit exposure includes more than overdue invoices. What does total exposure consist of?",
          explanation: "Total credit exposure = open orders + open deliveries + open billing + open accounts receivable. This is why a large unbilled order alone can hit a customer's credit limit.",
          options: {
            create: [
              { text: "Open orders + open deliveries + open billing + open AR", isCorrect: true },
              { text: "Only overdue invoices", isCorrect: false },
              { text: "The list price of the current order only", isCorrect: false },
              { text: "The customer's bank balance", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A promising new customer's first large order is immediately blocked. Why is this the system working correctly?",
          explanation: "A new customer is given a deliberately low credit limit because they have no payment history. A large first order's exposure exceeds that low limit, so the dynamic check blocks it for manual review — protecting the company until the customer proves reliable. The fix is a managed limit increase, not disabling the check.",
          options: {
            create: [
              { text: "New customers start with a low limit until they prove they pay, so a large order trips the block", isCorrect: true },
              { text: "The material was out of stock", isCorrect: false },
              { text: "The pricing procedure was wrong", isCorrect: false },
              { text: "The order referenced the wrong quotation", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.21: Output Determination
const lesson4_21 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-output-determination" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Output Determination",
    slug: "sd-output-determination",
    order: 21,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A large retail customer escalates: "We never receive your order confirmations, and your invoices still arrive by post — we need them emailed the moment they're created." The SD consultant, Sameer, doesn't touch any print program. He opens \`NACE\`, then creates a condition record in \`VV11\` that says: for this customer, output type \`BA00\` (order confirmation) and \`RD00\` (invoice) → medium email → timing immediate. "Output uses the condition technique, just like pricing," he explains. "I'm not coding anything — I'm telling the system which communication to trigger, for whom, how, and when." The customer starts getting instant emails the same afternoon.`,
    content: `## What "Output" Means in SD

**Output** is any communication an SD document triggers: a printed order confirmation, an emailed invoice, an EDI message to a trading partner, a fax, a PDF. **Output determination** is the configuration that decides *which* communication is triggered, *for whom*, through *what medium*, and *when*. Critically, it runs on the **condition technique** — the same framework as pricing — so once you understand pricing determination, output is familiar territory.

## The Condition Technique, Again

Output determination uses the now-familiar components:

> **Output Type → Access Sequence → Condition Tables → Condition Records**

- An **output type** (the thing being triggered) is assigned an **access sequence**.
- The access sequence searches **condition tables** for a matching **condition record**.
- The record says "for this key (e.g. customer / sales org), trigger this output via this medium at this time."

An **output determination procedure** bundles the output types and is assigned to each document type — mirroring how a pricing procedure is assigned.

## Key Output Types

| Output type | Document | Purpose |
|-------------|----------|---------|
| \`BA00\` | Sales order | Order confirmation |
| \`LD00\` / \`LADS\` | Delivery | Delivery note / packing |
| \`RD00\` | Billing | Invoice |
| \`KRML\` | Billing | Credit memo |

## Medium — How It's Sent

Each output record specifies a **medium**:

| Medium | Channel |
|--------|---------|
| 1 | Print output |
| 2 | Fax |
| 5 | External send (email) |
| 6 | EDI |
| 8 | Special function |

So the same output type \`RD00\` can print for one customer and email for another, purely through the condition record.

## Timing — When It's Sent

Output **timing** controls *when* the output is dispatched:
- **Immediately** (timing 4) — sent the moment the document is saved.
- **Scheduled / via batch** (timing 1) — collected and processed by a background job (e.g. \`RSNAST00\`).
- **On demand** — triggered manually by a user.

The retailer's "the moment they're created" requirement is simply timing = immediate.

## Configuring It: NACE, VV11, Smart Forms

- **\`NACE\`** — the central transaction to configure output: application area (V1 sales, V3 billing), output types, procedures, and assignments.
- **\`VV11\` / \`VV12\` / \`VV13\`** — create/change/display the **condition records** (the actual "for customer X, email the invoice" rules). There are application-specific variants (\`VV31\` for billing output, etc.).
- **Smart Forms / Adobe Forms** — generate the actual document layout (the PDF/print). Output determination decides *whether and how* to send; the form defines *what it looks like*.

## Why It's a Clean Separation

Notice what Sameer did *not* do: he didn't modify a print program or a form. Because output is determined by condition records, changing *who gets what, how, and when* is master-data maintenance (\`VV11\`), not development. Only changing the *layout* requires touching a Smart Form. This separation is deliberate — business users can adjust communication rules without a developer.

## The Practical Takeaway

When a customer says "we're not getting our documents" or "send them differently," the consultant checks the output determination: is there a condition record for that customer/output type? Is the medium and timing right? Is the procedure assigned to the document type? Output runs on the condition technique, so the troubleshooting method is identical to pricing — trace the access sequence to the matching record.`,
    keyConceptTitle: "Output determination uses the condition technique to decide which communication is sent, how, and when",
    keyConceptBody: `- **Output** = any document communication (print, email, EDI, fax, PDF); **output determination** runs on the **condition technique**: Output Type → Access Sequence → Condition Tables → Condition Records, bundled in a procedure assigned to the document type.
- Key output types: \`BA00\` (order confirmation), \`LD00/LADS\` (delivery note), \`RD00\` (invoice), \`KRML\` (credit memo).
- **Medium** (1 print, 2 fax, 5 email, 6 EDI) and **timing** (immediate vs batch vs on-demand) are set on the condition record.
- Configure in \`NACE\`; maintain records in \`VV11\`; **Smart Forms / Adobe Forms** define the layout. Changing who-gets-what is master data, not development.`,
  },
});
const flowchart4_21 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_21.id },
  update: {},
  create: {
    lessonId: lesson4_21.id,
    title: "Output Determination via the Condition Technique",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 150 }, data: { label: "📄 SD Document Saved (order/invoice)" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 320, y: 150 }, data: { label: "📨 Output Type (BA00 / RD00)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 560, y: 150 }, data: { label: "🪜 Access Sequence → Condition Tables" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 830, y: 150 }, data: { label: "📌 Condition Record (VV11)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 1080, y: 60 }, data: { label: "📧 Medium (print/email/EDI)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 1080, y: 240 }, data: { label: "⏱️ Timing (immediate/batch)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 830, y: 290 }, data: { label: "📰 Smart Form / Adobe Form (layout)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node4", target: "node5", type: "default" },
      { id: "e5", source: "node4", target: "node6", type: "default" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_21.id, nodeId: "node1", title: "SD Document Saved", description: "Saving a sales order, delivery, or invoice triggers output determination for that document's procedure.", tCode: "VA01 / VL01N / VF01", tips: "The output procedure is assigned per document type, just like a pricing procedure." },
    { flowchartId: flowchart4_21.id, nodeId: "node2", title: "Output Type", description: "The communication to potentially trigger (BA00 order confirmation, RD00 invoice). Each has an access sequence.", tCode: "NACE", tips: "Output types live in application areas — V1 for sales, V3 for billing." },
    { flowchartId: flowchart4_21.id, nodeId: "node3", title: "Access Sequence / Tables", description: "Searches condition tables (by customer, sales org, etc.) for a matching output record — identical mechanism to pricing.", tCode: "NACE (access seq.)", tips: "Trace the access sequence to see why a customer does or doesn't get an output." },
    { flowchartId: flowchart4_21.id, nodeId: "node4", title: "Condition Record", description: "The actual rule: for this key, trigger this output via this medium at this time. Maintained as master data.", tCode: "VV11 / VV12 / VV13", tips: "Adding 'email the invoice to customer X' is just a new VV11 record — no development." },
    { flowchartId: flowchart4_21.id, nodeId: "node5", title: "Medium", description: "How the output is sent: print (1), fax (2), email (5), EDI (6). The same output type can use different media per customer.", tCode: "VV11 (medium field)", tips: "EDI (6) is how large partners receive machine-readable orders/invoices." },
    { flowchartId: flowchart4_21.id, nodeId: "node6", title: "Timing", description: "When the output is dispatched: immediately on save, via a scheduled batch (RSNAST00), or on demand.", tCode: "VV11 (timing field)", tips: "Immediate timing is what makes invoices email the instant they're created." },
    { flowchartId: flowchart4_21.id, nodeId: "node7", title: "Smart Form / Adobe Form", description: "Generates the actual layout of the printed/PDF document. Output determination decides whether/how to send; the form defines appearance.", tCode: "SMARTFORMS / SFP", tips: "Changing the look of an invoice means editing the form, not the output records." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_21.id },
  update: {},
  create: {
    lessonId: lesson4_21.id,
    title: "Output Determination — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which underlying framework does output determination use?",
          explanation: "Output determination uses the condition technique — the same Output Type → Access Sequence → Condition Tables → Condition Records structure as pricing.",
          options: {
            create: [
              { text: "The condition technique", isCorrect: true },
              { text: "The MRP run", isCorrect: false },
              { text: "Backward delivery scheduling", isCorrect: false },
              { text: "The credit check", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the difference between an output type's medium and its timing?",
          explanation: "Medium controls HOW the output is sent (print, fax, email, EDI); timing controls WHEN it is sent (immediately on save, via scheduled batch, or on demand). Both are set on the condition record.",
          options: {
            create: [
              { text: "Medium = how it's sent (print/email/EDI); timing = when it's sent (immediate/batch/on-demand)", isCorrect: true },
              { text: "Medium = when; timing = how", isCorrect: false },
              { text: "They are the same setting", isCorrect: false },
              { text: "Medium sets the price; timing sets the tax", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A customer wants invoices emailed immediately instead of printed. What does the consultant change — and what stays untouched?",
          explanation: "The consultant creates/updates a condition record (VV11) for that customer's invoice output (RD00) setting medium = email and timing = immediate. The print program and Smart Form layout are NOT changed — output determination is master data, separate from the form's appearance.",
          options: {
            create: [
              { text: "Create a VV11 record with medium=email, timing=immediate; the form layout stays untouched", isCorrect: true },
              { text: "Rewrite the invoice print program in ABAP", isCorrect: false },
              { text: "Change the pricing procedure", isCorrect: false },
              { text: "Raise the customer's credit limit", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.22: Debit Memos & Special Billing Types
const lesson4_22 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-debit-memos-special-billing" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Debit Memos & Special Billing Types",
    slug: "sd-debit-memos-special-billing",
    order: 22,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `Two billing problems land on consultant Anita's desk the same morning. First, a customer was undercharged — a freight cost was missed on an invoice, and the company needs to bill them the difference. Second, an export shipment needs an invoice for customs *before* anything posts to accounting. "These aren't regular invoices," Anita explains to the billing clerk. "The undercharge is a debit memo — you charge the customer more. The customs document is a pro forma invoice — it looks like an invoice but never touches FI. SAP has a special billing type for each situation, and they all reference the original document through copy control."`,
    content: `## Not All Billing Is for Delivered Goods

The standard invoice (\`F2\`) bills a customer for goods that were delivered. But real business needs adjustments and special documents: charging more, charging less, correcting a mistake, producing a non-accounting document for customs, or billing between company codes. SAP provides **special billing types** for each, and they share a pattern — most are created from a **request** document and almost all **reference an original** through copy control.

## Debit Memo — Charging the Customer More

When a customer was **undercharged** (price too low, a missed charge, extra freight), you issue a **debit memo**:

> **Debit Memo Request (DR)** → **Debit Memo (L2)**

The DR is the SD request document (subject to approval/blocking); when released and billed it becomes the debit memo L2, which posts an additional receivable to the customer's account.

## Credit Memo — Its Counterpart

The mirror image, when a customer was **overcharged** or owed money back:

> **Credit Memo Request (CR)** → **Credit Memo (G2)**

(Covered in the returns/credit lesson; shown here as the counterpart to the debit memo.) Credit reduces the receivable; debit increases it.

## Invoice Correction Request — Fixing in One Document

When an invoice is simply *wrong* and needs both a credit and a debit to correct it, the **Invoice Correction Request (RK)** combines both in one document. It references the original billing document and shows the corrected values as paired credit/debit items, netting to the right adjustment. This is cleaner than issuing a separate credit and debit.

## Pro Forma Invoice — Looks Like an Invoice, Posts Nothing

A **pro forma invoice** (\`F5\` order-related, \`F8\` delivery-related) is a non-accounting document used for **customs and export** documentation. It looks like an invoice but **does not post to FI** and creates no receivable — it exists purely to accompany goods through customs or to inform the customer of expected values. Anita's customs document is exactly this.

## Intercompany Billing — Between Company Codes

When one company code delivers goods on behalf of another, **intercompany billing (\`IV\`)** creates an internal invoice between the two company codes, settling the value internally. It's how cross-entity fulfilment is reconciled financially.

## Down Payment Request — Linking SD to FI for Advances

For advance-payment scenarios (a customer pays before delivery), a **down payment request** links the SD document to FI so the advance is recorded and later cleared against the final invoice. This bridges SD and FI for prepayment business models.

## Why Copy Control Is Critical Here

Every one of these special billing types **references an original document**, and that reference is governed by **copy control** (\`VTFA\` order→billing, \`VTFL\` delivery→billing). The copy control's **pricing type** determines whether the special document copies the original prices or redetermines them. As the copy-control lesson showed, getting this wrong lets a debit/credit memo carry the wrong amount — so the copy-control setup is the safeguard that keeps adjustments tied to reality.

## The Practical Map

| Need | Document |
|------|----------|
| Charge more | Debit memo (DR → L2) |
| Give back money | Credit memo (CR → G2) |
| Correct a wrong invoice | Invoice correction request (RK) |
| Customs/export, no FI posting | Pro forma (F5 / F8) |
| Between company codes | Intercompany (IV) |
| Advance payment | Down payment request |

Knowing which document fits which situation — and that they all lean on copy control — is what lets a consultant handle the messy, real-world billing cases that go beyond the clean delivery-to-invoice path.`,
    keyConceptTitle: "Special billing types handle adjustments and non-standard invoices, all anchored by copy control",
    keyConceptBody: `- **Debit memo** (Debit Memo Request \`DR\` → \`L2\`) charges the customer **more**; **credit memo** (\`CR\` → \`G2\`) gives money **back** — they are counterparts.
- **Invoice Correction Request (\`RK\`)** combines credit + debit to fix a wrong invoice in one document; **pro forma** (\`F5\`/\`F8\`) is a customs/export document that **does not post to FI**.
- **Intercompany billing (\`IV\`)** invoices between company codes; **down payment requests** link SD to FI for advance payments.
- All special types **reference an original** via **copy control** (\`VTFA\`/\`VTFL\`); the **pricing type** there keeps the adjustment tied to the original amount.`,
  },
});
const flowchart4_22 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_22.id },
  update: {},
  create: {
    lessonId: lesson4_22.id,
    title: "Special Billing Types and Their Sources",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 150 }, data: { label: "🧾 Original Invoice (F2)" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 160, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 300, y: 30 }, data: { label: "⬆️ Debit Memo Req (DR) → L2 (charge more)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 300, y: 150 }, data: { label: "⬇️ Credit Memo Req (CR) → G2 (refund)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 300, y: 270 }, data: { label: "🔧 Invoice Correction Req (RK)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 580, y: 60 }, data: { label: "📋 Pro Forma (F5/F8) — no FI posting" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 580, y: 230 }, data: { label: "🏢 Intercompany (IV) / Down Payment" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 860, y: 150 }, data: { label: "🔁 Copy Control (VTFA/VTFL) ties to original" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node1", target: "node3", type: "default" },
      { id: "e3", source: "node1", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node7", type: "default" },
      { id: "e5", source: "node3", target: "node7", type: "default" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
      { id: "e7", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_22.id, nodeId: "node1", title: "Original Invoice (F2)", description: "The standard delivery-related invoice for goods shipped. Most special billing documents reference it.", tCode: "VF01", tips: "The original invoice is the anchor that special documents copy from." },
    { flowchartId: flowchart4_22.id, nodeId: "node2", title: "Debit Memo (DR → L2)", description: "Charges the customer more when they were undercharged (missed charge, too-low price). The DR is the request; L2 the posted memo.", tCode: "VA01 (DR) / VF01 (L2)", tips: "A debit memo increases the receivable — used to recover an undercharge." },
    { flowchartId: flowchart4_22.id, nodeId: "node3", title: "Credit Memo (CR → G2)", description: "Gives money back when the customer was overcharged or owed a credit. Counterpart to the debit memo.", tCode: "VA01 (CR) / VF01 (G2)", tips: "Credit reduces the receivable; debit increases it." },
    { flowchartId: flowchart4_22.id, nodeId: "node4", title: "Invoice Correction Request (RK)", description: "Combines credit and debit items to correct a wrong invoice in a single document, netting to the right adjustment.", tCode: "VA01 (RK)", tips: "Cleaner than separate credit + debit memos for fixing an erroneous invoice." },
    { flowchartId: flowchart4_22.id, nodeId: "node5", title: "Pro Forma (F5 / F8)", description: "A non-accounting invoice for customs/export. Looks like an invoice but posts nothing to FI and creates no receivable.", tCode: "VF01 (F5/F8)", tips: "Use pro forma for shipping/customs paperwork without financial impact." },
    { flowchartId: flowchart4_22.id, nodeId: "node6", title: "Intercompany / Down Payment", description: "Intercompany (IV) bills between company codes for cross-entity fulfilment; down payment requests link SD to FI for advance payments.", tCode: "VF01 (IV)", tips: "Intercompany settles value internally when one code ships for another." },
    { flowchartId: flowchart4_22.id, nodeId: "node7", title: "Copy Control Anchor", description: "Every special type references an original via copy control; the pricing type controls whether original prices copy or redetermine.", tCode: "VTFA / VTFL", tips: "Correct pricing type keeps debit/credit amounts tied to the original invoice." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_22.id },
  update: {},
  create: {
    lessonId: lesson4_22.id,
    title: "Special Billing Types — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which document is used to charge a customer MORE because they were undercharged?",
          explanation: "A debit memo (created from a Debit Memo Request DR, billed as L2) charges the customer more. A credit memo (CR → G2) does the opposite, refunding the customer.",
          options: {
            create: [
              { text: "Debit memo (DR → L2)", isCorrect: true },
              { text: "Credit memo (CR → G2)", isCorrect: false },
              { text: "Pro forma invoice (F8)", isCorrect: false },
              { text: "Standard invoice (F2)", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What makes a pro forma invoice different from a standard invoice?",
          explanation: "A pro forma invoice (F5/F8) is a non-accounting document used for customs/export. It does not post to FI and creates no receivable — unlike a standard invoice (F2), which posts revenue and a receivable.",
          options: {
            create: [
              { text: "It does not post to FI and creates no receivable (used for customs/export)", isCorrect: true },
              { text: "It charges double the normal price", isCorrect: false },
              { text: "It can only be created for free goods", isCorrect: false },
              { text: "It bypasses the customer master entirely", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "Why is copy control especially important for debit and credit memos?",
          explanation: "Debit/credit memos reference an original billing document, and copy control's pricing type determines whether the original prices are copied unchanged. If prices are redetermined or freely editable, the memo can carry a wrong amount — so copy control is the safeguard keeping the adjustment tied to the original invoice.",
          options: {
            create: [
              { text: "It references the original invoice and its pricing type keeps the memo's amount tied to the original", isCorrect: true },
              { text: "It determines the shipping point", isCorrect: false },
              { text: "It sets the customer's credit limit", isCorrect: false },
              { text: "It chooses the output medium", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.23: Third Party Processing
const lesson4_23 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-third-party-processing" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Third Party Processing",
    slug: "sd-third-party-processing",
    order: 23,
    isPublished: true,
    estimatedMinutes: 14,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A trading company sells industrial parts but holds almost no stock — their suppliers ship directly to the end customer. The new SD consultant, Ravi, is puzzled: "If we never touch the goods, how do we deliver and bill?" The senior consultant smiles. "We don't deliver — the vendor does. The sales order auto-creates a purchase requisition, procurement raises a PO, the vendor ships straight to the customer, and we record a *statistical* goods receipt just to track quantity. We bill the customer; the vendor bills us. It's called third-party processing, and it's the backbone of asset-light trading businesses."`,
    content: `## What Third-Party Processing Is

In **third-party processing**, the customer orders from you, but a **supplier delivers the goods directly to the customer** — you never physically handle them. You remain the seller (you bill the customer and own the customer relationship), but fulfilment is outsourced to the vendor. It's the standard model for trading companies that don't want to hold inventory.

## How It's Triggered

The trigger is the **item category \`TAB\`** in the sales order. When a line resolves to \`TAB\` (driven by the material's item category group, often \`BANS\`), SAP knows this line is third-party and sets up the procurement flow instead of a delivery. The schedule line category for such items is purchasing-relevant, so it generates a **purchase requisition** automatically.

## The End-to-End Flow

\`\`\`
Sales Order (item category TAB)
   → Purchase Requisition (auto-created)
   → Purchase Order to vendor (ME21N)
   → Vendor ships directly to customer
   → Statistical Goods Receipt (MIGO)   [quantity only, no stock]
   → Vendor Invoice (MIRO)              [COGS posts here]
   → Billing to customer (VF01)         [revenue posts here]
\`\`\`

1. **Sales Order** — created normally; the \`TAB\` line flags it third-party.
2. **Purchase Requisition** — generated automatically from the order's schedule line.
3. **Purchase Order** — procurement converts the requisition to a PO (\`ME21N\`) on the vendor.
4. **Vendor Delivery** — the vendor ships straight to your customer; you never see the goods.
5. **Goods Receipt (statistical)** — recorded in \`MIGO\` to confirm quantity, but it makes **no stock change** because the goods went directly to the customer.
6. **Vendor Invoice (\`MIRO\`)** — when the vendor bills you, **COGS** posts.
7. **Customer Billing (\`VF01\`)** — you invoice the customer; **revenue** posts.

## Statistical Goods Receipt — the Key Idea

The goods receipt in third-party is **statistical**: it records that the quantity arrived (at the customer) so the system can track and base billing on it, but it does **not** increase your inventory, because you never held the stock. This is the conceptual heart of third-party — a goods movement for tracking, not for stocking.

## Two Variants

| Variant | Billing basis |
|---------|--------------|
| **Standard third-party** | Billing to customer is based on the **goods receipt** quantity (you bill after the GR confirms what shipped) |
| **Individual PO / invoice-based** | Billing is based on the **vendor invoice (MIRO)** quantity |

The choice (controlled by the item category's billing relevance) decides whether you can bill the customer as soon as goods are received or must wait for the vendor's invoice. Goods-receipt-based billing lets you invoice sooner; invoice-based billing aligns customer billing precisely with what the vendor charged.

## Account Determination

The financial picture is clean: **COGS** is recognized when the **vendor invoice** is posted (\`MIRO\`), and **revenue** is recognized when you **bill the customer** (\`VF01\`). The margin is the difference — which is exactly the trading company's profit on a deal they never physically touched.

## Why It Matters

Third-party processing is common in trading, distribution, drop-ship e-commerce, and any asset-light model. For a consultant, the tell-tale signs are item category \`TAB\`, an auto-created purchase requisition from a sales order, and a statistical goods receipt. When someone asks "how can we sell things we don't stock?", this is the answer — and recognizing the \`TAB\`-driven flow is what lets you configure or troubleshoot it.`,
    keyConceptTitle: "Third-party: the vendor ships directly; item category TAB drives a PR→PO→statistical GR→billing flow",
    keyConceptBody: `- In **third-party processing** the **vendor delivers directly to the customer**; you stay the seller but never handle the goods. Triggered by item category **\`TAB\`** (material item category group often \`BANS\`).
- Flow: Sales Order → auto **Purchase Requisition** → **PO** (\`ME21N\`) → vendor ships → **statistical Goods Receipt** (\`MIGO\`, quantity only, no stock) → **Vendor Invoice** (\`MIRO\`, COGS) → **Customer Billing** (\`VF01\`, revenue).
- The **goods receipt is statistical** — it tracks quantity without changing inventory.
- Two variants: **GR-based billing** (bill after goods receipt) vs **invoice-based / individual PO** (bill per vendor invoice). COGS posts at \`MIRO\`, revenue at \`VF01\`.`,
  },
});
const flowchart4_23 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_23.id },
  update: {},
  create: {
    lessonId: lesson4_23.id,
    title: "Third-Party Processing Flow",
    nodes: [
      { id: "node1", type: "default", position: { x: 40, y: 150 }, data: { label: "🛒 Sales Order (item cat TAB)" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 270, y: 150 }, data: { label: "📝 Purchase Requisition (auto)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 500, y: 150 }, data: { label: "📄 Purchase Order (ME21N)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 170, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 730, y: 40 }, data: { label: "🚚 Vendor Ships to Customer" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 175, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 730, y: 160 }, data: { label: "📦 Statistical GR (MIGO, no stock)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 730, y: 280 }, data: { label: "💸 Vendor Invoice (MIRO → COGS)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 990, y: 160 }, data: { label: "🧾 Bill Customer (VF01 → Revenue)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node3", target: "node4", type: "default" },
      { id: "e4", source: "node3", target: "node5", type: "default" },
      { id: "e5", source: "node5", target: "node6", type: "default" },
      { id: "e6", source: "node5", target: "node7", type: "default" },
      { id: "e7", source: "node6", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_23.id, nodeId: "node1", title: "Sales Order (TAB)", description: "Created normally, but the line resolves to item category TAB, flagging it as third-party and triggering procurement instead of delivery.", tCode: "VA01", tips: "TAB comes from the material's item category group (often BANS) — that's the trigger." },
    { flowchartId: flowchart4_23.id, nodeId: "node2", title: "Purchase Requisition", description: "Automatically generated from the order's purchasing-relevant schedule line — the request for procurement to buy the goods.", tCode: "VA01 (auto) / ME53N", tips: "If no PR is created, check the schedule line category's purchasing relevance." },
    { flowchartId: flowchart4_23.id, nodeId: "node3", title: "Purchase Order", description: "Procurement converts the requisition into a PO on the vendor, instructing them to ship directly to the customer.", tCode: "ME21N", tips: "The PO carries the customer's address as the delivery address." },
    { flowchartId: flowchart4_23.id, nodeId: "node4", title: "Vendor Ships", description: "The vendor delivers goods straight to your customer. Your company never physically handles the stock.", tCode: "(vendor side)", tips: "This direct shipment is the whole point of third-party — asset-light fulfilment." },
    { flowchartId: flowchart4_23.id, nodeId: "node5", title: "Statistical Goods Receipt", description: "Posted in MIGO to confirm quantity received (at the customer) but makes no change to your inventory.", tCode: "MIGO", tips: "Statistical = quantity tracking only; no stock value hits your books." },
    { flowchartId: flowchart4_23.id, nodeId: "node6", title: "Vendor Invoice (MIRO)", description: "When the vendor bills you, the invoice is verified in MIRO and COGS is recognized.", tCode: "MIRO", tips: "COGS posts here; revenue posts at customer billing — the gap is your margin." },
    { flowchartId: flowchart4_23.id, nodeId: "node7", title: "Bill Customer (VF01)", description: "You invoice the customer. Revenue is recognized here. Billing basis is the GR (standard) or the vendor invoice (individual PO).", tCode: "VF01", tips: "GR-based billing lets you invoice sooner; invoice-based aligns to the vendor's charge." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_23.id },
  update: {},
  create: {
    lessonId: lesson4_23.id,
    title: "Third Party Processing — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "Which item category triggers third-party processing in the sales order?",
          explanation: "Item category TAB triggers third-party processing — it tells the system to create a purchase requisition for the vendor to ship directly, rather than a delivery from your own stock.",
          options: {
            create: [
              { text: "TAB", isCorrect: true },
              { text: "TAN", isCorrect: false },
              { text: "TANN", isCorrect: false },
              { text: "TATX", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "Why is the goods receipt in a third-party order 'statistical'?",
          explanation: "The goods went directly from the vendor to the customer, so your company never stocked them. The statistical goods receipt records the quantity (for tracking and billing) without changing your inventory.",
          options: {
            create: [
              { text: "It records quantity for tracking/billing but makes no change to your inventory", isCorrect: true },
              { text: "It doubles the stock on hand", isCorrect: false },
              { text: "It posts revenue immediately", isCorrect: false },
              { text: "It blocks the customer for credit", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A trading company holds no stock yet fulfills customer orders. In their flow, when do COGS and revenue post?",
          explanation: "In third-party processing, COGS is recognized when the vendor invoice is posted (MIRO), and revenue is recognized when the customer is billed (VF01). The difference between the two is the trading company's margin on goods it never physically handled.",
          options: {
            create: [
              { text: "COGS posts at the vendor invoice (MIRO); revenue posts at customer billing (VF01)", isCorrect: true },
              { text: "Both post at the sales order save", isCorrect: false },
              { text: "Both post at the statistical goods receipt", isCorrect: false },
              { text: "Neither posts because no goods are stocked", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// LESSON 4.24: Consignment Processing
const lesson4_24 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-consignment-processing" } },
  update: {},
  create: {
    moduleId: sdModule.id,
    title: "Consignment Processing",
    slug: "sd-consignment-processing",
    order: 24,
    isPublished: true,
    estimatedMinutes: 15,
    difficulty: "ADVANCED",
    xpReward: 75,
    story: `A pharmaceutical distributor stocks medicines at hospital pharmacies, but the hospital only pays for what it actually dispenses. The finance team is confused: "If the stock is sitting in their building, is it sold? When do we book revenue?" Consultant Pooja draws the four steps on the board. "You ship it to them but you still own it — that's fill-up, no revenue. When they use a box, that's the issue — now we bill and recognize revenue. Unused stock can come back, and eventually you collect your own goods. Ownership and revenue only move at the moment of issue, not when the goods physically arrive." The team finally sees why consignment needs its own special process.`,
    content: `## What Consignment Is

In **consignment**, your goods physically sit at the **customer's location**, but **ownership stays with you** until the customer actually uses (consumes/sells) them. Revenue is recognized only at the moment of use — not when the goods are delivered. It's common in pharma, retail, and industrial equipment, where customers want stock on hand but don't want to pay until they need it.

## The Four-Step Process

Consignment is modeled as four distinct processes, each with its own order type:

| Step | Order type | Stock effect | Billing? |
|------|-----------|--------------|----------|
| **1. Consignment Fill-Up** | \`KB\` | Moves goods to customer's consignment stock (still yours) | **No** |
| **2. Consignment Issue** | \`KE\` | Customer uses goods → leaves consignment stock | **Yes — revenue here** |
| **3. Consignment Return** | \`KR\` | Customer returns unused/defective goods to consignment stock | credit if billed |
| **4. Consignment Pick-Up** | \`KA\` | You collect your own unsold goods back to your warehouse | **No** |

## Step 1 — Fill-Up (KB): Stock Moves, Nothing Sold

A **consignment fill-up** ships goods to the customer's site and into **consignment stock**. There is **no billing and no revenue** — you've merely repositioned your own inventory closer to the customer. A delivery is created and goods are issued, but into special stock, not to the customer's ownership.

## Step 2 — Issue (KE): The Money Moment

When the customer **uses** some goods (a hospital dispenses a drug, a store sells an item), you process a **consignment issue**. *This* is when:
- The goods leave consignment stock for good.
- **Billing is triggered and revenue is recognized.**

The issue is the only step that bills the customer — exactly Pooja's "the moment of use" point.

## Step 3 — Return (KR) and Step 4 — Pick-Up (KA)

- **Consignment Return (\`KR\`)** — the customer sends back goods they took (defective or unwanted) into consignment stock; if already issued/billed, a credit follows.
- **Consignment Pick-Up (\`KA\`)** — *you* collect your **unsold** goods from the customer's site back into your own warehouse. Since these were never used/sold, there is **no billing** — it's just an inventory move back home.

The distinction matters: a **return** is the customer giving back goods they'd taken; a **pick-up** is you reclaiming goods that were never used.

## Special Stock — Where It Lives

Consignment stock at the customer is tracked under **special stock indicator \`W\`** (customer consignment). In the stock overview (\`MMBE\`), this stock is visible **per customer** — you can see exactly how much of your inventory sits at each customer's location. The goods are on your books as inventory (you still own them) but physically at the customer.

## Reconciliation

Because stock sits remotely and ownership is retained, periodic **reconciliation** is essential: a statement to the customer showing opening balance, fill-ups, issues, returns, and closing consignment balance. This keeps both parties agreed on how much of your stock is at their site and what's been consumed.

## Why It Needs Special Handling

A normal sale moves ownership and recognizes revenue at delivery. Consignment deliberately *separates* the physical movement (fill-up) from the ownership/revenue event (issue). That separation is the whole reason for the four order types — the system must know, at each step, whether stock is changing hands, whether ownership is transferring, and whether to bill. Recognizing the \`KB/KE/KR/KA\` pattern and the special-stock \`W\` indicator is what lets a consultant set up or debug a consignment scenario.`,
    keyConceptTitle: "Consignment separates physical delivery (fill-up) from ownership/revenue (issue) across four order types",
    keyConceptBody: `- In **consignment**, goods sit at the customer but **you retain ownership** until they're used; revenue is recognized only at issue.
- Four steps: **Fill-Up (\`KB\`)** ships to consignment stock (no billing), **Issue (\`KE\`)** = customer uses goods → **billing & revenue**, **Return (\`KR\`)** sends taken goods back, **Pick-Up (\`KA\`)** reclaims unused goods (no billing).
- Consignment stock is tracked under **special stock indicator \`W\`**, visible per customer in \`MMBE\` — it stays on your books while physically at the customer.
- Periodic **reconciliation** statements keep opening/closing consignment balances agreed; billing happens **only at \`KE\`**.`,
  },
});
const flowchart4_24 = await prisma.flowchart.upsert({
  where: { lessonId: lesson4_24.id },
  update: {},
  create: {
    lessonId: lesson4_24.id,
    title: "The Four Steps of Consignment Processing",
    nodes: [
      { id: "node1", type: "default", position: { x: 60, y: 150 }, data: { label: "📦 1. Fill-Up (KB) — ship, no billing" }, style: { background: "#B91C1C", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node2", type: "default", position: { x: 320, y: 150 }, data: { label: "🏥 Consignment Stock at Customer (special stock W)" }, style: { background: "#F97316", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node3", type: "default", position: { x: 610, y: 30 }, data: { label: "💰 2. Issue (KE) — used → BILL + revenue" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
      { id: "node4", type: "default", position: { x: 610, y: 150 }, data: { label: "↩️ 3. Return (KR) — taken goods back" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 195, fontSize: "12px", textAlign: "center" } },
      { id: "node5", type: "default", position: { x: 610, y: 270 }, data: { label: "🚛 4. Pick-Up (KA) — reclaim unused, no billing" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
      { id: "node6", type: "default", position: { x: 900, y: 30 }, data: { label: "🧾 Revenue Recognized (only at KE)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 185, fontSize: "12px", textAlign: "center" } },
      { id: "node7", type: "default", position: { x: 900, y: 220 }, data: { label: "📊 Reconciliation Statement (MMBE per customer)" }, style: { background: "#1F2937", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200, fontSize: "12px", textAlign: "center" } },
    ],
    edges: [
      { id: "e1", source: "node1", target: "node2", type: "default" },
      { id: "e2", source: "node2", target: "node3", type: "default" },
      { id: "e3", source: "node2", target: "node4", type: "default" },
      { id: "e4", source: "node2", target: "node5", type: "default" },
      { id: "e5", source: "node3", target: "node6", type: "default" },
      { id: "e6", source: "node2", target: "node7", type: "default" },
    ],
  },
});
await prisma.flowchartNodeDetail.createMany({
  skipDuplicates: true,
  data: [
    { flowchartId: flowchart4_24.id, nodeId: "node1", title: "Consignment Fill-Up (KB)", description: "Ships goods to the customer's consignment stock. A delivery and goods issue occur, but into special stock you still own — no billing, no revenue.", tCode: "VA01 (KB) / VL01N", tips: "Fill-up just repositions your stock closer to the customer; nothing is sold yet." },
    { flowchartId: flowchart4_24.id, nodeId: "node2", title: "Consignment Stock (W)", description: "Your inventory physically at the customer, tracked under special stock indicator W and visible per customer in MMBE.", tCode: "MMBE", tips: "This stock stays on your books — ownership hasn't moved." },
    { flowchartId: flowchart4_24.id, nodeId: "node3", title: "Consignment Issue (KE)", description: "The customer uses goods. Stock leaves consignment for good, billing is triggered, and revenue is recognized — the only billing step.", tCode: "VA01 (KE) / VF01", tips: "KE is the money moment: ownership and revenue move here, not at fill-up." },
    { flowchartId: flowchart4_24.id, nodeId: "node4", title: "Consignment Return (KR)", description: "The customer returns goods they had taken (defective/unwanted) back into consignment stock; a credit follows if already billed.", tCode: "VA01 (KR)", tips: "A return concerns goods the customer had taken — distinct from a pick-up." },
    { flowchartId: flowchart4_24.id, nodeId: "node5", title: "Consignment Pick-Up (KA)", description: "You collect your own unsold goods from the customer back to your warehouse. No billing — it's an inventory move home.", tCode: "VA01 (KA)", tips: "Pick-up reclaims goods that were never used; no financial impact on the customer." },
    { flowchartId: flowchart4_24.id, nodeId: "node6", title: "Revenue Recognition", description: "Revenue is recognized only at the consignment issue (KE) — the moment of customer use — never at fill-up.", tCode: "VF01", tips: "This timing is why consignment needs its own process: revenue ≠ delivery." },
    { flowchartId: flowchart4_24.id, nodeId: "node7", title: "Reconciliation", description: "Periodic statements show opening balance, fill-ups, issues, returns, and closing consignment balance so both parties agree on remote stock.", tCode: "MMBE / MB58", tips: "Regular reconciliation prevents disputes over how much of your stock sits at the customer." },
  ],
});
await prisma.quiz.upsert({
  where: { lessonId: lesson4_24.id },
  update: {},
  create: {
    lessonId: lesson4_24.id,
    title: "Consignment Processing — Check Your Understanding",
    questions: {
      create: [
        {
          order: 1,
          question: "At which step of consignment processing is the customer billed and revenue recognized?",
          explanation: "Billing and revenue happen at the Consignment Issue (KE) — the moment the customer actually uses the goods. Fill-up (KB) and pick-up (KA) involve no billing.",
          options: {
            create: [
              { text: "Consignment Issue (KE)", isCorrect: true },
              { text: "Consignment Fill-Up (KB)", isCorrect: false },
              { text: "Consignment Pick-Up (KA)", isCorrect: false },
              { text: "Revenue is recognized at fill-up", isCorrect: false },
            ],
          },
        },
        {
          order: 2,
          question: "What is the difference between a Consignment Return (KR) and a Consignment Pick-Up (KA)?",
          explanation: "A return (KR) is the customer sending back goods they had taken/used (with a credit if already billed). A pick-up (KA) is you reclaiming your own unsold goods from the customer's consignment stock, with no billing impact.",
          options: {
            create: [
              { text: "KR = customer returns goods they took; KA = you reclaim unsold goods (no billing)", isCorrect: true },
              { text: "KR ships goods out; KA bills the customer", isCorrect: false },
              { text: "They are identical", isCorrect: false },
              { text: "KR recognizes revenue; KA doubles it", isCorrect: false },
            ],
          },
        },
        {
          order: 3,
          question: "A hospital holds your medicines but only pays when it dispenses them. Why does standard order processing not fit, and what does consignment provide?",
          explanation: "A standard sale transfers ownership and recognizes revenue at delivery — but here the goods sit at the hospital still owned by you, with revenue due only on use. Consignment separates the physical move (fill-up, no revenue) from the ownership/revenue event (issue), tracking the remote stock under special stock indicator W. That separation is exactly what standard processing can't model.",
          options: {
            create: [
              { text: "Standard sales move ownership/revenue at delivery; consignment separates fill-up from the issue where revenue is recognized", isCorrect: true },
              { text: "Standard processing can't create a delivery at all", isCorrect: false },
              { text: "Consignment skips billing entirely", isCorrect: false },
              { text: "There is no real difference; either works the same", isCorrect: false },
            ],
          },
        },
      ],
    },
  },
});
// ─── SESSION 7 COMPLETE: SAP SD Deep Dive — 143 total lessons ─────────────────
