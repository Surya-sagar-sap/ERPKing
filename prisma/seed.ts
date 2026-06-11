import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] });

async function main() {
  console.log("🌱 Seeding SAPKing database...");

  // ─────────────────────────────────────────────
  // BADGES
  // ─────────────────────────────────────────────
  await prisma.badge.createMany({
    skipDuplicates: true,
    data: [
      { name: "First Step", description: "Completed your first lesson", icon: "🎯", condition: "complete_first_lesson", xpReward: 50 },
      { name: "SAP Foundation", description: "Completed the Foundation module", icon: "🏛️", condition: "complete_foundation_module", xpReward: 200 },
      { name: "FICO Master", description: "Completed the SAP FICO module", icon: "💰", condition: "complete_fico_module", xpReward: 300 },
      { name: "MM Expert", description: "Completed the SAP MM module", icon: "📦", condition: "complete_mm_module", xpReward: 300 },
      { name: "Quiz Ace", description: "Scored 100% on any quiz", icon: "⭐", condition: "perfect_quiz_score", xpReward: 100 },
      { name: "On Fire", description: "7-day learning streak", icon: "🔥", condition: "streak_7_days", xpReward: 150 },
    ],
  });

  // ─────────────────────────────────────────────
  // MODULE 1: SAP FOUNDATION
  // ─────────────────────────────────────────────
  const foundationModule = await prisma.module.upsert({
    where: { slug: "foundation" },
    update: {},
    create: {
      title: "SAP Foundation",
      slug: "foundation",
      description: "Understand what SAP is, why companies use it, and how to navigate the system. Perfect starting point for absolute beginners.",
      color: "#2563EB",
      icon: "🏛️",
      order: 1,
      isPublished: true,
    },
  });

  // LESSON 1.1: What is SAP?
  const lesson1_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: foundationModule.id, slug: "what-is-sap" } },
    update: {},
    create: {
      moduleId: foundationModule.id,
      title: "What is SAP?",
      slug: "what-is-sap",
      order: 1,
      isPublished: true,
      estimatedMinutes: 8,
      difficulty: "BEGINNER",
      xpReward: 50,
      story: `Meet Priya. She works at a large manufacturing company called "TechMake Ltd."

Every morning, Priya gets calls from three different teams:
- The warehouse team asks: "How many units of steel do we have?"
- The finance team asks: "Did we pay the supplier invoice?"
- The HR team asks: "Is the new employee's salary set up?"

Priya has to log into 3 different systems, copy-paste data into Excel, and send emails. By the time she answers everyone, it's already noon. And sometimes the numbers don't match between systems.

Sound familiar? This is exactly the problem SAP was built to solve.`,
      content: `## The Problem SAP Solves

Before SAP, companies had separate software for each department:
- Finance had their own system
- Warehouse had their own system
- HR had their own system

These systems didn't talk to each other. Data had to be manually transferred. Mistakes happened. Reports were always outdated.

## What SAP Actually Is

**SAP** stands for **Systems, Applications, and Products in Data Processing**.

It's one giant system that connects ALL departments in a company. When the warehouse receives goods, the finance team automatically sees the cost. When HR hires someone, payroll is automatically set up.

Think of SAP like the **central nervous system** of a company — everything is connected.

## Why Companies Use SAP

- **One source of truth** — everyone sees the same data in real-time
- **No duplicate data entry** — enter once, use everywhere
- **Audit trail** — every transaction is recorded and traceable
- **Global scale** — works for companies with offices in 100 countries

## SAP by the Numbers

- Used by **92% of the Forbes Global 2000** companies
- Over **400,000 customers** in 180 countries
- Processes **80% of the world's financial transactions**

## The Key Idea

SAP is not just software. It's a way of organizing how a company works. When you learn SAP, you're learning how real businesses operate — finance, procurement, HR, sales, and more.`,
      keyConceptTitle: "SAP = One System for the Entire Company",
      keyConceptBody: `Instead of 10 separate systems that don't talk to each other, SAP is ONE integrated system where:
- Every department shares the same data
- A change in one area automatically updates others
- Management can see the whole business in real-time

This is called an **ERP system** (Enterprise Resource Planning).`,
    },
  });

  // Flowchart for lesson 1.1
  const flowchart1_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson1_1.id },
    update: {},
    create: {
      lessonId: lesson1_1.id,
      title: "How SAP Connects Departments",
      nodes: [
        { id: "sap", type: "default", position: { x: 350, y: 200 }, data: { label: "SAP ERP System" }, style: { background: "#2563EB", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "12px 20px" } },
        { id: "finance", type: "default", position: { x: 100, y: 50 }, data: { label: "💰 Finance" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
        { id: "mm", type: "default", position: { x: 350, y: 50 }, data: { label: "📦 Procurement" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
        { id: "hr", type: "default", position: { x: 600, y: 50 }, data: { label: "👥 HR" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
        { id: "sales", type: "default", position: { x: 100, y: 350 }, data: { label: "🛒 Sales" }, style: { background: "#EF4444", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
        { id: "production", type: "default", position: { x: 350, y: 350 }, data: { label: "🏭 Production" }, style: { background: "#06B6D4", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
        { id: "warehouse", type: "default", position: { x: 600, y: 350 }, data: { label: "🏪 Warehouse" }, style: { background: "#84CC16", color: "#fff", borderRadius: "8px", padding: "10px 16px" } },
      ],
      edges: [
        { id: "e1", source: "finance", target: "sap", type: "default" },
        { id: "e2", source: "mm", target: "sap", type: "default" },
        { id: "e3", source: "hr", target: "sap", type: "default" },
        { id: "e4", source: "sap", target: "sales", type: "default" },
        { id: "e5", source: "sap", target: "production", type: "default" },
        { id: "e6", source: "sap", target: "warehouse", type: "default" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart1_1.id, nodeId: "sap", title: "SAP ERP System", description: "The central hub. All departments connect to SAP and share the same database. When finance records a payment, procurement instantly sees it.", tCode: "SAP Easy Access Menu", tips: "SAP is the single source of truth. If data is in SAP, it's official." },
      { flowchartId: flowchart1_1.id, nodeId: "finance", title: "Finance (FI/CO)", description: "Handles all financial transactions — invoices, payments, budgets, P&L reports. SAP module: FICO", tCode: "FB50, F-02, FS00", tips: "Every transaction in SAP has a financial impact that FI captures automatically." },
      { flowchartId: flowchart1_1.id, nodeId: "mm", title: "Materials Management (MM)", description: "Handles purchasing — from raising a Purchase Order to receiving goods. SAP module: MM", tCode: "ME21N, MIGO, MIRO", tips: "When MM receives goods, it automatically posts a goods receipt in FI." },
      { flowchartId: flowchart1_1.id, nodeId: "hr", title: "Human Resources (HCM)", description: "Manages employee master data, payroll, time & attendance. SAP module: HCM / SuccessFactors", tCode: "PA30, PA20", tips: "SAP HR is tightly integrated with payroll — employee changes automatically affect salaries." },
      { flowchartId: flowchart1_1.id, nodeId: "sales", title: "Sales & Distribution (SD)", description: "Handles the order-to-cash process — quotes, orders, delivery, invoicing. SAP module: SD", tCode: "VA01, VL01N, VF01", tips: "A sales order in SD creates demand that PP and MM must fulfil." },
      { flowchartId: flowchart1_1.id, nodeId: "production", title: "Production Planning (PP)", description: "Plans and executes manufacturing. Creates production orders and tracks work-in-progress.", tCode: "MD04, CO01, CO11N", tips: "PP reads demand from SD and creates production orders." },
      { flowchartId: flowchart1_1.id, nodeId: "warehouse", title: "Warehouse Management (WM/EWM)", description: "Manages stock locations, bin management, goods movements within the warehouse.", tCode: "LT01, LT0A, LS24", tips: "Every goods movement in MM is reflected instantly in WM." },
    ],
  });

  // Quiz for lesson 1.1
  const quiz1_1 = await prisma.quiz.upsert({
    where: { lessonId: lesson1_1.id },
    update: {},
    create: {
      lessonId: lesson1_1.id,
      title: "What is SAP? — Check Your Understanding",
      questions: {
        create: [
          {
            order: 1,
            question: "What does ERP stand for?",
            explanation: "ERP stands for Enterprise Resource Planning. SAP is the world's leading ERP system, used by over 400,000 companies globally.",
            options: {
              create: [
                { text: "Enterprise Resource Planning", isCorrect: true },
                { text: "Electronic Reporting Platform", isCorrect: false },
                { text: "Efficient Results Processing", isCorrect: false },
                { text: "Enterprise Reporting Program", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What is the MAIN benefit of SAP compared to using separate systems for each department?",
            explanation: "SAP creates one shared database — all departments see the same real-time data. This eliminates data silos, reduces errors, and allows management to see the full picture.",
            options: {
              create: [
                { text: "All departments share one real-time database", isCorrect: true },
                { text: "It is cheaper than other software", isCorrect: false },
                { text: "It only works for the finance department", isCorrect: false },
                { text: "It replaces the need for employees", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "When goods are received in SAP's MM module, what happens automatically?",
            explanation: "SAP's integration means a goods receipt in MM automatically posts a financial document in FI. This is the power of an integrated ERP — one action triggers all related updates.",
            options: {
              create: [
                { text: "A financial document is posted in the FI module", isCorrect: true },
                { text: "Nothing — someone must manually update finance", isCorrect: false },
                { text: "An email is sent to the CEO", isCorrect: false },
                { text: "The warehouse is automatically restocked", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 1.2: SAP Modules Overview
  const lesson1_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-modules-overview" } },
    update: {},
    create: {
      moduleId: foundationModule.id,
      title: "SAP Modules: The Big Map",
      slug: "sap-modules-overview",
      order: 2,
      isPublished: true,
      estimatedMinutes: 10,
      difficulty: "BEGINNER",
      xpReward: 50,
      story: `Ravi just got his first job as an SAP consultant. On his first day, his manager asks: "Which SAP module do you want to specialize in?"

Ravi stares blankly. He's heard of "SAP FICO" and "SAP MM" but has no idea what they mean or how they relate to each other.

Sound familiar? Before you dive into any SAP topic, you need to understand the full landscape — what modules exist, what they do, and how they connect. Think of it as reading the map before starting a journey.`,
      content: `## SAP is Made of Modules

SAP isn't one monolithic thing — it's a collection of **modules**, each handling a specific business function. Companies can implement the modules they need.

## The Core Modules

### Financial Modules
| Module | Full Name | What It Does |
|--------|-----------|--------------|
| **FI** | Financial Accounting | Records all financial transactions, balance sheet, P&L |
| **CO** | Controlling | Internal cost management, profit centers, budgets |
| **FICO** | FI + CO together | Always implemented together. The financial backbone. |
| **TR** | Treasury | Cash management, banking, risk management |

### Logistics Modules
| Module | Full Name | What It Does |
|--------|-----------|--------------|
| **MM** | Materials Management | Purchasing, inventory, vendor management |
| **SD** | Sales & Distribution | Order management, delivery, customer invoicing |
| **PP** | Production Planning | Manufacturing, work orders, capacity planning |
| **QM** | Quality Management | Quality inspections, defect management |
| **PM** | Plant Maintenance | Equipment maintenance, work orders for repairs |
| **WM/EWM** | Warehouse Management | Bin locations, warehouse operations |

### HR Modules
| Module | Full Name | What It Does |
|--------|-----------|--------------|
| **HCM** | Human Capital Management | Employee master data, payroll, time |
| **SF** | SuccessFactors | Cloud-based HR, recruiting, learning |

### Technology Modules
| Module | Full Name | What It Does |
|--------|-----------|--------------|
| **BASIS** | System Administration | Technical admin, user management, transports |
| **ABAP** | Programming Language | SAP's own coding language for customization |
| **Fiori** | User Interface | Modern web UI for SAP (replaces the old SAP GUI) |
| **BTP** | Business Technology Platform | SAP's cloud development and integration platform |

## Which Module Should You Learn?

- **Want to work in Finance?** → Start with FICO
- **Want to work in Supply Chain?** → Start with MM or SD
- **Want to be a developer?** → Learn ABAP + BASIS
- **Want general knowledge?** → Start with Foundation, then pick one

## The Most In-Demand Modules (2024)

1. FICO (always #1)
2. MM (supply chain boom)
3. SD (e-commerce integration)
4. S/4HANA (the new SAP version everyone is migrating to)`,
      keyConceptTitle: "Each SAP Module = One Business Department",
      keyConceptBody: `Think of SAP modules like departments in a company:
- FI = Finance Department's software
- MM = Procurement Department's software
- SD = Sales Department's software
- HCM = HR Department's software

They all share the same database, so actions in MM automatically update FI.`,
    },
  });

  // Flowchart for lesson 1.2
  const flowchart1_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson1_2.id },
    update: {},
    create: {
      lessonId: lesson1_2.id,
      title: "SAP Module Landscape",
      nodes: [
        { id: "core", type: "default", position: { x: 300, y: 180 }, data: { label: "SAP Core\n(Shared Database)" }, style: { background: "#1E293B", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "12px 24px", width: 180 } },
        { id: "fico", type: "default", position: { x: 50, y: 50 }, data: { label: "💰 FICO\nFinancial Accounting\n& Controlling" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px", width: 160, fontSize: "12px" } },
        { id: "mm", type: "default", position: { x: 250, y: 50 }, data: { label: "📦 MM\nMaterials\nManagement" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px" } },
        { id: "sd", type: "default", position: { x: 430, y: 50 }, data: { label: "🛒 SD\nSales &\nDistribution" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px" } },
        { id: "pp", type: "default", position: { x: 600, y: 50 }, data: { label: "🏭 PP\nProduction\nPlanning" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px" } },
        { id: "hcm", type: "default", position: { x: 50, y: 320 }, data: { label: "👥 HCM\nHuman Capital\nManagement" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px" } },
        { id: "basis", type: "default", position: { x: 250, y: 320 }, data: { label: "⚙️ BASIS\nSystem\nAdministration" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px" } },
        { id: "abap", type: "default", position: { x: 430, y: 320 }, data: { label: "💻 ABAP\nProgramming\nLanguage" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px" } },
        { id: "fiori", type: "default", position: { x: 600, y: 320 }, data: { label: "🎨 Fiori\nModern UI\nLayer" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px" } },
      ],
      edges: [
        { id: "e1", source: "fico", target: "core" }, { id: "e2", source: "mm", target: "core" },
        { id: "e3", source: "sd", target: "core" }, { id: "e4", source: "pp", target: "core" },
        { id: "e5", source: "core", target: "hcm" }, { id: "e6", source: "core", target: "basis" },
        { id: "e7", source: "core", target: "abap" }, { id: "e8", source: "core", target: "fiori" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart1_2.id, nodeId: "fico", title: "SAP FICO", description: "Financial Accounting (FI) + Controlling (CO). Records every financial transaction. The most implemented SAP module worldwide.", tCode: "FB50, F-02, KP06", tips: "FICO consultants are always in demand. If you're from a finance background, start here." },
      { flowchartId: flowchart1_2.id, nodeId: "mm", title: "SAP MM", description: "Manages the procure-to-pay cycle: raising purchase orders, receiving goods, and paying suppliers.", tCode: "ME21N, MIGO, MIRO", tips: "MM is tightly linked to FI — every goods receipt automatically creates an accounting document." },
      { flowchartId: flowchart1_2.id, nodeId: "sd", title: "SAP SD", description: "Manages the order-to-cash cycle: customer orders, deliveries, and invoicing.", tCode: "VA01, VL01N, VF01", tips: "SD and MM are mirror images — SD handles outgoing goods, MM handles incoming goods." },
      { flowchartId: flowchart1_2.id, nodeId: "pp", title: "SAP PP", description: "Plans and executes manufacturing. Creates production orders and manages the shop floor.", tCode: "MD01, CO01, CO11N", tips: "PP gets demand signals from SD and sends material requirements to MM." },
      { flowchartId: flowchart1_2.id, nodeId: "hcm", title: "SAP HCM", description: "Manages the entire employee lifecycle — hiring, payroll, time management, and exit.", tCode: "PA30, PE51, PT60", tips: "HCM feeds data to FI for payroll postings. Every salary payment is a financial document." },
      { flowchartId: flowchart1_2.id, nodeId: "basis", title: "SAP BASIS", description: "The technical backbone. BASIS admins manage system installations, user access, transports between systems.", tCode: "SM21, SU01, STMS", tips: "Without BASIS, no other module works. It's like the IT infrastructure team of SAP." },
      { flowchartId: flowchart1_2.id, nodeId: "abap", title: "SAP ABAP", description: "SAP's proprietary programming language. Used to build custom reports, forms, enhancements, and integrations.", tCode: "SE38, SE37, SE80", tips: "ABAP developers are needed in every SAP project to customize standard SAP functionality." },
      { flowchartId: flowchart1_2.id, nodeId: "fiori", title: "SAP Fiori", description: "The modern web-based UI that replaced the old SAP GUI. Runs on any device — desktop, tablet, or mobile.", tCode: "/UI2/FLP (Fiori Launchpad)", tips: "All new SAP development should be Fiori-based. SAP GUI is being phased out." },
    ],
  });

  const quiz1_2 = await prisma.quiz.upsert({
    where: { lessonId: lesson1_2.id },
    update: {},
    create: {
      lessonId: lesson1_2.id,
      title: "SAP Modules — Check Your Understanding",
      questions: {
        create: [
          {
            order: 1,
            question: "A company wants to manage its purchasing process — from creating purchase orders to paying suppliers. Which SAP module handles this?",
            explanation: "MM (Materials Management) handles the procure-to-pay process. This includes purchase requisitions, purchase orders, goods receipts, and invoice verification.",
            options: {
              create: [
                { text: "MM (Materials Management)", isCorrect: true },
                { text: "FI (Financial Accounting)", isCorrect: false },
                { text: "SD (Sales & Distribution)", isCorrect: false },
                { text: "PP (Production Planning)", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which TWO modules are almost always implemented together and form the financial backbone of SAP?",
            explanation: "FI (Financial Accounting) and CO (Controlling) are always implemented together — so much so that they're called FICO. FI handles external reporting (balance sheet, P&L) and CO handles internal cost management.",
            options: {
              create: [
                { text: "FI and CO (together called FICO)", isCorrect: true },
                { text: "MM and SD", isCorrect: false },
                { text: "BASIS and ABAP", isCorrect: false },
                { text: "PP and QM", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What is SAP Fiori?",
            explanation: "SAP Fiori is SAP's modern web-based user interface. It replaced the older SAP GUI and works on any device. All new SAP apps are built in Fiori.",
            options: {
              create: [
                { text: "SAP's modern web-based user interface that works on any device", isCorrect: true },
                { text: "A financial reporting module", isCorrect: false },
                { text: "SAP's cloud storage solution", isCorrect: false },
                { text: "A programming language for SAP", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 2: SAP FICO
  // ─────────────────────────────────────────────
  const ficoModule = await prisma.module.upsert({
    where: { slug: "fico" },
    update: {},
    create: {
      title: "SAP FICO",
      slug: "fico",
      description: "Master Financial Accounting and Controlling in SAP. Learn how companies record transactions, manage costs, and generate financial reports.",
      color: "#2563EB",
      icon: "💰",
      order: 2,
      isPublished: true,
    },
  });

  // LESSON 2.1: Chart of Accounts
  const lesson2_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: ficoModule.id, slug: "chart-of-accounts" } },
    update: {},
    create: {
      moduleId: ficoModule.id,
      title: "Chart of Accounts",
      slug: "chart-of-accounts",
      order: 1,
      isPublished: true,
      estimatedMinutes: 12,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Meera is a new finance analyst at a manufacturing company. On her first week, she's asked to book an accounting entry for a supplier payment.

She opens SAP and sees a blank field asking for a "G/L Account" number. She has no idea what to type. Her colleague says "check the chart of accounts." But what IS a chart of accounts?

This confusion is incredibly common. Understanding the Chart of Accounts is the absolute first step in SAP FICO — it's the master list that defines ALL accounts in the company's books.`,
      content: `## What is a Chart of Accounts (COA)?

A **Chart of Accounts** is the master list of all **General Ledger (G/L) accounts** a company uses to record financial transactions.

Think of it like a **filing cabinet** where every drawer has a label:
- Drawer 100000-199999: Asset accounts (cash, buildings, equipment)
- Drawer 200000-299999: Liability accounts (loans, payables)
- Drawer 300000-399999: Equity accounts
- Drawer 400000-499999: Revenue accounts
- Drawer 500000-599999: Expense accounts

## Why It Matters in SAP

Every financial transaction in SAP MUST be posted to at least 2 G/L accounts (double-entry accounting). Before you can post anything, you need to know which account to use.

## The Structure in SAP

In SAP, a G/L account has:
- **Account Number**: e.g. 113100 (Bank Account)
- **Account Name**: descriptive name
- **Account Type**: Balance Sheet or Profit & Loss
- **Currency**: which currency the account holds

## Common Account Ranges (INT Chart of Accounts)

| Range | Account Type | Examples |
|-------|-------------|---------|
| 100000–199999 | Fixed Assets | Buildings, Machinery |
| 200000–299999 | Current Assets | Bank, Debtors, Inventory |
| 300000–399999 | Liabilities | Creditors, Loans |
| 400000–499999 | Revenue | Sales, Interest Income |
| 500000–599999 | COGS & Direct Expenses | Raw Material Costs |
| 600000–699999 | Operating Expenses | Salaries, Rent |

## Key SAP Transaction Codes

| T-Code | What It Does |
|--------|-------------|
| **FS00** | Create/Change/Display a G/L Account |
| **FSS0** | Display G/L Account Centrally |
| **OBD4** | Define Account Groups |
| **OB13** | Create Chart of Accounts |

## Real Example

When a company pays a supplier ₹10,000:
- **Debit**: Accounts Payable (300001) — reducing what we owe
- **Credit**: Bank Account (113100) — reducing our bank balance

Both accounts must exist in the Chart of Accounts before this entry can be posted.`,
      keyConceptTitle: "Chart of Accounts = Master List of All Accounts",
      keyConceptBody: `Before any transaction can be recorded in SAP, the accounts must exist in the Chart of Accounts.

Key SAP setting: Every company code (legal entity) is assigned ONE Chart of Accounts. All G/L accounts in that chart are then available for postings.

Use T-code FS00 to view or create G/L accounts.`,
    },
  });

  const flowchart2_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson2_1.id },
    update: {},
    create: {
      lessonId: lesson2_1.id,
      title: "Chart of Accounts Structure in SAP",
      nodes: [
        { id: "coa", type: "default", position: { x: 300, y: 30 }, data: { label: "📋 Chart of Accounts (COA)\nMaster Account List" }, style: { background: "#2563EB", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "12px 20px", width: 220 } },
        { id: "assets", type: "default", position: { x: 50, y: 160 }, data: { label: "🏦 Assets\n100000–199999" }, style: { background: "#10B981", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 150, fontSize: "12px" } },
        { id: "liabilities", type: "default", position: { x: 230, y: 160 }, data: { label: "💳 Liabilities\n300000–399999" }, style: { background: "#EF4444", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 150, fontSize: "12px" } },
        { id: "revenue", type: "default", position: { x: 420, y: 160 }, data: { label: "📈 Revenue\n400000–499999" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 150, fontSize: "12px" } },
        { id: "expense", type: "default", position: { x: 600, y: 160 }, data: { label: "📉 Expenses\n500000–699999" }, style: { background: "#8B5CF6", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 150, fontSize: "12px" } },
        { id: "fs00", type: "default", position: { x: 300, y: 300 }, data: { label: "⚙️ T-Code: FS00\nManage G/L Accounts" }, style: { background: "#1E293B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontSize: "12px" } },
      ],
      edges: [
        { id: "e1", source: "coa", target: "assets" }, { id: "e2", source: "coa", target: "liabilities" },
        { id: "e3", source: "coa", target: "revenue" }, { id: "e4", source: "coa", target: "expense" },
        { id: "e5", source: "assets", target: "fs00", type: "smoothstep" },
        { id: "e6", source: "liabilities", target: "fs00", type: "smoothstep" },
        { id: "e7", source: "revenue", target: "fs00", type: "smoothstep" },
        { id: "e8", source: "expense", target: "fs00", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart2_1.id, nodeId: "coa", title: "Chart of Accounts", description: "The master list of all G/L accounts for a company. In SAP, every company code (legal entity) is assigned one COA. The most common standard COA is 'INT' (International).", tCode: "OB13 (Create COA), OBD4 (Account Groups)", tips: "Companies typically use SAP's standard chart of accounts as a starting point and customize it." },
      { flowchartId: flowchart2_1.id, nodeId: "assets", title: "Asset Accounts", description: "Records company assets: bank accounts (113100), accounts receivable (140000), inventory (300000), fixed assets (100000). These appear on the Balance Sheet.", tCode: "FS00", tips: "Asset accounts increase with Debit entries and decrease with Credit entries." },
      { flowchartId: flowchart2_1.id, nodeId: "liabilities", title: "Liability Accounts", description: "Records amounts owed: accounts payable (160000), bank loans (170000), tax payable. These are Balance Sheet accounts.", tCode: "FS00, FK03", tips: "Liability accounts increase with Credit entries and decrease with Debit entries — opposite of assets." },
      { flowchartId: flowchart2_1.id, nodeId: "revenue", title: "Revenue Accounts", description: "Records income earned by the company: sales revenue (800000), interest income, other income. These are P&L accounts that reset to zero each year.", tCode: "FS00, VA01", tips: "Revenue accounts are closed to retained earnings at year-end." },
      { flowchartId: flowchart2_1.id, nodeId: "expense", title: "Expense Accounts", description: "Records costs: cost of goods sold (500000), salaries (620000), rent (626000), utilities. These are P&L accounts.", tCode: "FS00, FB50", tips: "Expense accounts are debited when costs are incurred. They reduce net profit." },
      { flowchartId: flowchart2_1.id, nodeId: "fs00", title: "T-Code FS00", description: "FS00 is the central transaction for managing G/L accounts. You can create new accounts, change descriptions, or display existing accounts. Every accountant uses this daily.", tCode: "FS00", tips: "Use the 'Display' option first when learning — you can't break anything by just viewing accounts." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson2_1.id },
    update: {},
    create: {
      lessonId: lesson2_1.id,
      title: "Chart of Accounts Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the purpose of a Chart of Accounts in SAP?",
            explanation: "The Chart of Accounts is the master list of all G/L accounts. Every financial posting must reference accounts from the COA. Without a COA, you cannot post any accounting entries.",
            options: {
              create: [
                { text: "It is the master list of all General Ledger accounts used for postings", isCorrect: true },
                { text: "It is a list of all customers", isCorrect: false },
                { text: "It shows the company's bank statements", isCorrect: false },
                { text: "It is the organizational chart of the finance team", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which SAP transaction code do you use to create or manage G/L Accounts?",
            explanation: "FS00 is the key T-code for G/L account management. You can create, change, or display accounts using this transaction.",
            options: {
              create: [
                { text: "FS00", isCorrect: true },
                { text: "ME21N", isCorrect: false },
                { text: "VA01", isCorrect: false },
                { text: "FB60", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "When a company pays ₹10,000 from its bank account to a supplier, which accounts are affected?",
            explanation: "In double-entry accounting: Accounts Payable (liability) is DEBITED (reducing the amount owed), and Bank Account (asset) is CREDITED (reducing cash). Both accounts must exist in the COA.",
            options: {
              create: [
                { text: "Debit Accounts Payable, Credit Bank Account", isCorrect: true },
                { text: "Debit Bank Account, Credit Revenue", isCorrect: false },
                { text: "Debit Expense, Credit Bank Account", isCorrect: false },
                { text: "Credit Accounts Payable, Debit Revenue", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 2.2: Vendor Invoice Posting (FB60)
  const lesson2_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: ficoModule.id, slug: "vendor-invoice-posting" } },
    update: {},
    create: {
      moduleId: ficoModule.id,
      title: "Posting a Vendor Invoice",
      slug: "vendor-invoice-posting",
      order: 2,
      isPublished: true,
      estimatedMinutes: 15,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `It's end of month. Arjun's company received an electricity bill of ₹25,000 from the power company. His manager says: "Post the invoice in SAP before close."

Arjun has never done this before. He knows it goes into accounts payable somehow, but which transaction do you use? What fields do you fill? What does "posting key" mean?

This lesson will walk you through the entire vendor invoice posting process in SAP FI — step by step, field by field.`,
      content: `## The Accounts Payable Process

When your company receives a bill (invoice) from a vendor, you need to:
1. Record it in SAP (create liability)
2. Pay it later (clear liability)

Step 1 is called **Invoice Posting**. The key transaction is **FB60**.

## What Happens When You Post an Invoice?

SAP creates a **Financial Document** with TWO line items (double-entry):
- **Credit**: Vendor account (you owe them money)
- **Debit**: Expense account (the cost is recorded)

**Example**: Electricity bill of ₹25,000:
- Credit: Electricity Vendor Account — ₹25,000 (liability created)
- Debit: Utility Expense Account 626000 — ₹25,000 (expense recorded)

## Transaction FB60: Enter Vendor Invoice

### Step-by-Step Process

**Step 1: Open FB60**
- Enter T-code FB60 in the command field
- This opens the vendor invoice entry screen

**Step 2: Header Data**
| Field | Description | Example |
|-------|-------------|---------|
| Vendor | The supplier's SAP number | 300001 |
| Invoice Date | Date on the paper invoice | 31.01.2024 |
| Posting Date | Date to post in SAP | 31.01.2024 |
| Amount | Invoice total | 25,000 |
| Currency | INR, USD, EUR etc. | INR |
| Text | Brief description | Electricity Jan 2024 |

**Step 3: G/L Line Items**
| Field | Description | Example |
|-------|-------------|---------|
| G/L Account | Expense account | 626000 (Utilities) |
| D/C | Debit or Credit | D (Debit) |
| Amount | Same as header | 25,000 |
| Cost Center | Who bears the cost | CC1000 |

**Step 4: Simulate and Post**
- Click Simulate to preview the accounting document
- If correct, click Post (or press F11)
- SAP generates a **Document Number** — save this!

## Key T-Codes for Accounts Payable

| T-Code | Purpose |
|--------|---------|
| **FB60** | Enter vendor invoice |
| **FB65** | Enter vendor credit memo |
| **F-53** | Post vendor outgoing payment |
| **F-44** | Clear vendor open items |
| **FBL1N** | Display vendor line items |
| **FK03** | Display vendor master data |

## The Three-Way Match Concept

In large companies, before posting a vendor invoice, SAP checks:
1. **Purchase Order** — was the item ordered?
2. **Goods Receipt** — were the goods received?
3. **Invoice** — does the invoice match both?

This is called the **3-way match** and is processed using **MIRO** (not FB60) when a PO exists.`,
      keyConceptTitle: "FB60 = Direct Vendor Invoice (No Purchase Order)",
      keyConceptBody: `Use FB60 when you receive a bill that was NOT preceded by a Purchase Order — like utility bills, rent, or professional fees.

For invoices related to Purchase Orders (materials, services), use MIRO instead. MIRO performs the 3-way match automatically.

The document number generated by FB60 is the audit trail — always note it down.`,
    },
  });

  const flowchart2_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson2_2.id },
    update: {},
    create: {
      lessonId: lesson2_2.id,
      title: "Vendor Invoice Posting Flow (FB60)",
      nodes: [
        { id: "start", type: "default", position: { x: 300, y: 20 }, data: { label: "📄 Receive Paper Invoice\nfrom Vendor" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180 } },
        { id: "fb60", type: "default", position: { x: 300, y: 130 }, data: { label: "⚡ Open T-Code FB60\nEnter Vendor Invoice" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontWeight: "bold" } },
        { id: "header", type: "default", position: { x: 80, y: 240 }, data: { label: "📋 Fill Header Data\nVendor, Date, Amount" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 160, fontSize: "12px" } },
        { id: "lines", type: "default", position: { x: 520, y: 240 }, data: { label: "📝 Add G/L Line Items\nExpense Account, Cost Center" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 160, fontSize: "12px" } },
        { id: "simulate", type: "default", position: { x: 300, y: 360 }, data: { label: "🔍 Simulate\nPreview Accounting Entry" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180 } },
        { id: "post", type: "default", position: { x: 300, y: 470 }, data: { label: "✅ Post Document\nPress F11 or Post Button" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 180, fontWeight: "bold" } },
        { id: "docnum", type: "default", position: { x: 300, y: 580 }, data: { label: "🔢 Document Number Generated\nAudit Trail Created" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 200 } },
      ],
      edges: [
        { id: "e1", source: "start", target: "fb60" },
        { id: "e2", source: "fb60", target: "header" },
        { id: "e3", source: "fb60", target: "lines" },
        { id: "e4", source: "header", target: "simulate", type: "smoothstep" },
        { id: "e5", source: "lines", target: "simulate", type: "smoothstep" },
        { id: "e6", source: "simulate", target: "post" },
        { id: "e7", source: "post", target: "docnum" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart2_2.id, nodeId: "fb60", title: "T-Code FB60: Enter Vendor Invoice", description: "FB60 is used for direct vendor invoice posting without a Purchase Order. Common use cases: utility bills, rent, professional service fees.", tCode: "FB60", tips: "If the invoice is related to a Purchase Order, use MIRO instead. MIRO performs the 3-way match (PO + GR + Invoice)." },
      { flowchartId: flowchart2_2.id, nodeId: "header", title: "Invoice Header Data", description: "The header contains the overall invoice details: vendor number, invoice date, posting date, total amount, currency, and reference number.", tCode: "FB60 (Header section)", tips: "Invoice Date = date on the paper invoice. Posting Date = date you want it recorded in books. These can be different!" },
      { flowchartId: flowchart2_2.id, nodeId: "lines", title: "G/L Account Line Items", description: "Each line item specifies which G/L account to use, whether it's a debit or credit, the amount, and any cost assignment (cost center, profit center, WBS element).", tCode: "FB60 (Line Items tab)", tips: "Always assign a Cost Center for expense accounts. Without it, controlling reports won't show the cost correctly." },
      { flowchartId: flowchart2_2.id, nodeId: "simulate", title: "Simulate Before Posting", description: "Simulation shows you the full accounting document before it's permanently posted. Check that debits equal credits and accounts are correct.", tCode: "FB60 > Simulate button", tips: "Always simulate first! Once posted, you need a reversal document to fix mistakes." },
      { flowchartId: flowchart2_2.id, nodeId: "post", title: "Post the Document", description: "Clicking Post creates the permanent accounting document. The liability to the vendor is now recorded and will appear in FBL1N.", tCode: "FB60 > Post (F11)", tips: "After posting, the vendor's open items list (FBL1N) will show this invoice as outstanding until it's paid." },
      { flowchartId: flowchart2_2.id, nodeId: "docnum", title: "Document Number", description: "Every posted document gets a unique number. This is the audit trail. You can use this number to display (FB03) or reverse (FB08) the document.", tCode: "FB03 (Display), FB08 (Reverse)", tips: "Always write down the document number after posting. It's your reference for queries and audits." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson2_2.id },
    update: {},
    create: {
      lessonId: lesson2_2.id,
      title: "Vendor Invoice Posting Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "Which SAP transaction code do you use to post a vendor invoice that has NO related Purchase Order?",
            explanation: "FB60 is used for direct vendor invoice posting (without PO). For invoices with a PO, use MIRO which performs the 3-way match (PO + Goods Receipt + Invoice).",
            options: {
              create: [
                { text: "FB60", isCorrect: true },
                { text: "MIRO", isCorrect: false },
                { text: "ME21N", isCorrect: false },
                { text: "F-53", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "When you post an electricity bill of ₹25,000 using FB60, which accounting entry does SAP create?",
            explanation: "When posting a vendor invoice: Credit the Vendor (creates a liability — you owe them money) and Debit the Expense account (records the cost). This follows double-entry accounting.",
            options: {
              create: [
                { text: "Credit Vendor Account ₹25,000 / Debit Expense Account ₹25,000", isCorrect: true },
                { text: "Debit Vendor Account ₹25,000 / Credit Bank Account ₹25,000", isCorrect: false },
                { text: "Debit Revenue ₹25,000 / Credit Expense ₹25,000", isCorrect: false },
                { text: "Credit Bank Account ₹25,000 / Debit Vendor ₹25,000", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "Why is it important to 'Simulate' before posting a document in FB60?",
            explanation: "Simulation shows you the full accounting document preview before it becomes permanent. Once you post, you can only fix mistakes by creating a reversal document — you cannot edit a posted document.",
            options: {
              create: [
                { text: "Because once posted, you cannot edit — only reverse with another document", isCorrect: true },
                { text: "Simulation is optional and only for training purposes", isCorrect: false },
                { text: "Simulation sends the invoice to the vendor for approval", isCorrect: false },
                { text: "Simulation is required to get the document number", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 3: SAP MM
  // ─────────────────────────────────────────────
  const mmModule = await prisma.module.upsert({
    where: { slug: "mm" },
    update: {},
    create: {
      title: "SAP MM",
      slug: "mm",
      description: "Master the Procure-to-Pay process in SAP. Learn how companies manage purchasing, inventory, and vendor payments.",
      color: "#D97706",
      icon: "📦",
      order: 3,
      isPublished: true,
    },
  });

  // LESSON 3.1: Procure-to-Pay Overview
  const lesson3_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: mmModule.id, slug: "procure-to-pay-overview" } },
    update: {},
    create: {
      moduleId: mmModule.id,
      title: "The Procure-to-Pay Process",
      slug: "procure-to-pay-overview",
      order: 1,
      isPublished: true,
      estimatedMinutes: 12,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Vikram works in the procurement team at a car parts manufacturer. Every day he has to:
1. Figure out which raw materials are running low
2. Decide which supplier to order from
3. Create a formal purchase order
4. Receive the goods when they arrive
5. Make sure the invoice matches what was ordered
6. Approve the payment

Before SAP, this involved phone calls, Excel sheets, and physical paperwork. Documents got lost. Vendors were paid twice. Goods arrived that nobody ordered.

SAP MM solves all of this with a structured, tracked, auditable process called **Procure-to-Pay (P2P)**.`,
      content: `## What is Procure-to-Pay?

**Procure-to-Pay (P2P)** is the complete business process from identifying a need for goods/services to paying the vendor. Every company does this — SAP just makes it structured and integrated.

## The 6 Steps of P2P in SAP

### Step 1: Purchase Requisition (PR) — ME51N
Someone in the company says "I need 100 units of steel."
- Created by: anyone who needs something
- It's just a request — no commitment to buy yet
- Gets approved by a manager
- T-Code: **ME51N** (Create) / **ME52N** (Change) / **ME53N** (Display)

### Step 2: Purchase Order (PO) — ME21N
Procurement converts the PR into an official order to the vendor.
- A PO is a **legal commitment** to buy
- Contains: item, quantity, price, delivery date, vendor
- T-Code: **ME21N** (Create) / **ME22N** (Change) / **ME23N** (Display)

### Step 3: Goods Receipt (GR) — MIGO
The goods arrive at the warehouse. The warehouse team confirms receipt in SAP.
- SAP automatically: updates stock, creates accounting document
- T-Code: **MIGO** (Movement Type 101)

### Step 4: Invoice Verification — MIRO
The vendor sends an invoice. Finance matches it against the PO and GR.
- This is the **3-way match**: PO + GR + Invoice
- If all three match → payment is approved
- T-Code: **MIRO**

### Step 5: Payment — F-53 / F110
Finance pays the vendor.
- Manual payment: T-code **F-53**
- Automatic payment run: T-code **F110**

## Why SAP Makes This Better

| Without SAP | With SAP MM |
|-------------|-------------|
| Orders placed via email/phone | Formal PO with approval workflow |
| No tracking of delivery | Real-time goods receipt updates stock |
| Manual invoice matching | Automatic 3-way match |
| Vendors paid twice | Duplicate invoice check |
| No audit trail | Every step logged with user + timestamp |`,
      keyConceptTitle: "P2P = PR → PO → GR → MIRO → Payment",
      keyConceptBody: `The five key T-codes for Procure-to-Pay:
1. **ME51N** — Create Purchase Requisition
2. **ME21N** — Create Purchase Order
3. **MIGO** — Post Goods Receipt
4. **MIRO** — Post Vendor Invoice (with 3-way match)
5. **F110** — Automatic Payment Run

Each step creates documents that link together — giving you a complete audit trail from "we need goods" to "vendor is paid."`,
    },
  });

  const flowchart3_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson3_1.id },
    update: {},
    create: {
      lessonId: lesson3_1.id,
      title: "Procure-to-Pay Process Flow",
      nodes: [
        { id: "pr", type: "default", position: { x: 100, y: 200 }, data: { label: "📝 Purchase\nRequisition\nME51N" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "approval", type: "default", position: { x: 260, y: 200 }, data: { label: "✅ Manager\nApproval" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "12px", width: 100, fontSize: "12px", textAlign: "center" } },
        { id: "po", type: "default", position: { x: 410, y: 200 }, data: { label: "📋 Purchase\nOrder\nME21N" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "vendor", type: "default", position: { x: 560, y: 100 }, data: { label: "🏭 Vendor\nDelivers Goods" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "gr", type: "default", position: { x: 560, y: 300 }, data: { label: "📦 Goods\nReceipt\nMIGO" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "miro", type: "default", position: { x: 700, y: 200 }, data: { label: "🧾 Invoice\nVerification\nMIRO" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "payment", type: "default", position: { x: 840, y: 200 }, data: { label: "💳 Payment\nF110 / F-53" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "pr", target: "approval", animated: false },
        { id: "e2", source: "approval", target: "po", animated: false },
        { id: "e3", source: "po", target: "vendor", animated: false },
        { id: "e4", source: "po", target: "gr", animated: false },
        { id: "e5", source: "vendor", target: "gr", animated: false },
        { id: "e6", source: "gr", target: "miro", animated: false },
        { id: "e7", source: "miro", target: "payment", animated: false },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart3_1.id, nodeId: "pr", title: "Purchase Requisition (PR)", description: "An internal document requesting to purchase goods or services. Created by any department. Not a legal commitment — it's just a request that needs approval.", tCode: "ME51N (Create), ME52N (Change), ME53N (Display)", tips: "PRs must be approved before they can be converted to POs. Approval workflows are configured in SAP." },
      { flowchartId: flowchart3_1.id, nodeId: "po", title: "Purchase Order (PO)", description: "A formal, legally binding order sent to a vendor. Contains material, quantity, price, delivery date, and payment terms. Created by procurement from an approved PR.", tCode: "ME21N (Create), ME22N (Change), ME23N (Display), ME2N (List)", tips: "A PO is a contract. Once the vendor accepts it, both parties are legally committed. Always double-check before saving." },
      { flowchartId: flowchart3_1.id, nodeId: "gr", title: "Goods Receipt (MIGO)", description: "Records the physical arrival of goods against a PO. Updates stock levels immediately. Creates an automatic accounting entry: Debit Inventory, Credit GR/IR account.", tCode: "MIGO (Movement Type 101), MB51 (Material Document List)", tips: "The GR is the trigger for the 3-way match. Without a GR, MIRO will block payment. Never skip this step!" },
      { flowchartId: flowchart3_1.id, nodeId: "miro", title: "Invoice Verification (MIRO)", description: "Posts the vendor invoice against the PO and GR. SAP performs the 3-way match automatically. If quantities or prices don't match, SAP blocks the invoice for review.", tCode: "MIRO (Post Invoice), MIR4 (Display), MRBR (Release Blocked Invoices)", tips: "Small price differences can be configured as tolerances. Outside tolerance = automatic block requiring manual review." },
      { flowchartId: flowchart3_1.id, nodeId: "payment", title: "Payment (F110 / F-53)", description: "F110 is the automatic payment run — processes all due invoices in batch. F-53 is manual payment for individual invoices. Both clear the vendor's open items.", tCode: "F110 (Auto Payment Run), F-53 (Manual Payment), FBL1N (Vendor Line Items)", tips: "F110 is run periodically (weekly/bi-weekly). It selects all invoices due for payment and creates bank transfer files." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson3_1.id },
    update: {},
    create: {
      lessonId: lesson3_1.id,
      title: "Procure-to-Pay Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the correct order of the Procure-to-Pay process in SAP?",
            explanation: "The P2P flow is: Purchase Requisition (ME51N) → Purchase Order (ME21N) → Goods Receipt (MIGO) → Invoice Verification (MIRO) → Payment (F110). Each step builds on the previous.",
            options: {
              create: [
                { text: "PR → PO → Goods Receipt → Invoice (MIRO) → Payment", isCorrect: true },
                { text: "PO → PR → Invoice → Goods Receipt → Payment", isCorrect: false },
                { text: "Invoice → PO → Payment → Goods Receipt", isCorrect: false },
                { text: "Payment → PO → Goods Receipt → Invoice", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What T-code do you use to post a Goods Receipt in SAP MM?",
            explanation: "MIGO is the universal goods movement transaction in SAP. For goods receipts against a PO, use MIGO with Movement Type 101. MIGO updates stock and creates an automatic accounting document.",
            options: {
              create: [
                { text: "MIGO", isCorrect: true },
                { text: "ME21N", isCorrect: false },
                { text: "MIRO", isCorrect: false },
                { text: "FB60", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What is the '3-way match' in SAP MM?",
            explanation: "The 3-way match is SAP's automatic check during invoice verification (MIRO): it compares the Purchase Order, the Goods Receipt, and the Vendor Invoice. All three must match for the invoice to be approved for payment.",
            options: {
              create: [
                { text: "Matching the Purchase Order, Goods Receipt, and Vendor Invoice", isCorrect: true },
                { text: "Matching the vendor number, material number, and price", isCorrect: false },
                { text: "Three approvals required before a PO is created", isCorrect: false },
                { text: "Matching three different bank accounts for payment", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 4: SAP SD (Sales & Distribution)
  // ─────────────────────────────────────────────
  const sdModule = await prisma.module.upsert({
    where: { slug: "sd" },
    update: {},
    create: {
      title: "SAP SD",
      slug: "sd",
      description: "Master the Order-to-Cash process in SAP. Learn how companies sell products, deliver goods, and bill customers.",
      color: "#DC2626",
      icon: "🛒",
      order: 4,
      isPublished: true,
    },
  });

  // LESSON 4.1: Order-to-Cash Overview
  const lesson4_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: sdModule.id, slug: "order-to-cash-overview" } },
    update: {},
    create: {
      moduleId: sdModule.id,
      title: "The Order-to-Cash Process",
      slug: "order-to-cash-overview",
      order: 1,
      isPublished: true,
      estimatedMinutes: 12,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Sneha works in sales at a furniture company. A customer calls and says: "I want to buy 50 office chairs."

What happens next? Sneha needs to confirm the price, check if there's enough stock, arrange delivery, and finally send an invoice so the company gets paid.

Before SAP, this meant scribbled notes, phone calls to the warehouse, and a separate accountant typing up invoices days later. Orders got forgotten. Customers were billed the wrong amount.

SAP SD turns this whole journey — from "I want to buy" to "we got paid" — into one connected, trackable process called **Order-to-Cash (O2C)**.`,
      content: `## What is Order-to-Cash?

**Order-to-Cash (O2C)** is the complete business process from receiving a customer order to collecting the payment. It's the mirror image of MM's Procure-to-Pay — instead of buying, you're selling.

## The 5 Steps of O2C in SAP

### Step 1: Sales Order — VA01
The customer places an order. You record what they want, quantity, price, and delivery date.
- A sales order is the central document of SD
- It checks stock availability automatically (ATP check)
- T-Code: **VA01** (Create) / **VA02** (Change) / **VA03** (Display)

### Step 2: Delivery — VL01N
The warehouse prepares and ships the goods.
- Picking (gathering items), packing, and posting goods issue
- Goods Issue reduces stock and creates an accounting document
- T-Code: **VL01N** (Create Outbound Delivery)

### Step 3: Goods Issue
When goods leave the warehouse, stock goes down.
- SAP automatically posts: Debit Cost of Goods Sold, Credit Inventory
- This is the moment ownership transfers to the customer

### Step 4: Billing — VF01
You send the customer an invoice.
- Billing creates the customer invoice and posts to FI
- SAP automatically posts: Debit Customer (receivable), Credit Revenue
- T-Code: **VF01** (Create Billing Document)

### Step 5: Payment Receipt — F-28
The customer pays. Finance records the incoming payment.
- Clears the customer's open receivable
- T-Code: **F-28** (Post Incoming Payment)

## SD and MM Are Mirror Images

| Concept | MM (Buying) | SD (Selling) |
|---------|-------------|--------------|
| Master partner | Vendor | Customer |
| Order document | Purchase Order | Sales Order |
| Goods movement | Goods Receipt | Goods Issue |
| Money document | Vendor Invoice | Customer Billing |
| Money flow | We pay out | We collect in |

## Why SAP Makes This Better

Every step links to the next. From a sales order you can see the delivery, the invoice, and the payment — one connected chain called the **document flow**.`,
      keyConceptTitle: "O2C = Sales Order → Delivery → Goods Issue → Billing → Payment",
      keyConceptBody: `The five key T-codes for Order-to-Cash:
1. **VA01** — Create Sales Order
2. **VL01N** — Create Outbound Delivery (picking + goods issue)
3. **VF01** — Create Billing Document (invoice)
4. **F-28** — Post Incoming Customer Payment

Each document links to the next. Use **VA03** and click "Document Flow" to see the entire chain from order to cash.`,
    },
  });

  const flowchart4_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson4_1.id },
    update: {},
    create: {
      lessonId: lesson4_1.id,
      title: "Order-to-Cash Process Flow",
      nodes: [
        { id: "inquiry", type: "default", position: { x: 60, y: 200 }, data: { label: "💬 Customer\nInquiry / Quote" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "order", type: "default", position: { x: 220, y: 200 }, data: { label: "🛒 Sales Order\nVA01" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "delivery", type: "default", position: { x: 380, y: 200 }, data: { label: "🚚 Delivery\nVL01N" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "gi", type: "default", position: { x: 540, y: 100 }, data: { label: "📦 Goods Issue\nStock ↓" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "billing", type: "default", position: { x: 540, y: 300 }, data: { label: "🧾 Billing\nVF01" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "payment", type: "default", position: { x: 720, y: 200 }, data: { label: "💰 Payment\nF-28" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "inquiry", target: "order" },
        { id: "e2", source: "order", target: "delivery" },
        { id: "e3", source: "delivery", target: "gi" },
        { id: "e4", source: "delivery", target: "billing" },
        { id: "e5", source: "gi", target: "billing", type: "smoothstep" },
        { id: "e6", source: "billing", target: "payment" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart4_1.id, nodeId: "order", title: "Sales Order (VA01)", description: "The central document in SD. Records what the customer wants: material, quantity, price, and requested delivery date. SAP runs an availability check (ATP) to confirm stock can be delivered on time.", tCode: "VA01 (Create), VA02 (Change), VA03 (Display)", tips: "The sales order pulls prices automatically from condition records. You rarely type prices manually." },
      { flowchartId: flowchart4_1.id, nodeId: "delivery", title: "Outbound Delivery (VL01N)", description: "Created with reference to the sales order. Covers picking (gathering goods), packing, and posting goods issue. Triggers warehouse activity.", tCode: "VL01N (Create), VL02N (Change), VL06O (List)", tips: "You can only create a delivery once the goods are available and the delivery date is reached." },
      { flowchartId: flowchart4_1.id, nodeId: "gi", title: "Goods Issue", description: "Posting Goods Issue reduces inventory and transfers ownership to the customer. SAP automatically posts: Debit Cost of Goods Sold, Credit Inventory.", tCode: "VL02N (Post Goods Issue), MB51", tips: "Goods Issue is the accounting moment the sale becomes real — inventory leaves your books." },
      { flowchartId: flowchart4_1.id, nodeId: "billing", title: "Billing Document (VF01)", description: "Creates the customer invoice with reference to the delivery. Automatically posts to FI: Debit Customer (Accounts Receivable), Credit Revenue.", tCode: "VF01 (Create), VF03 (Display), VF04 (Billing Due List)", tips: "Billing links SD to FICO. The moment you bill, the revenue appears in the financial statements." },
      { flowchartId: flowchart4_1.id, nodeId: "payment", title: "Incoming Payment (F-28)", description: "Records the customer's payment and clears the open receivable. Completes the Order-to-Cash cycle.", tCode: "F-28 (Post Incoming Payment), FBL5N (Customer Line Items)", tips: "Use FBL5N to see which customer invoices are still unpaid (open items)." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson4_1.id },
    update: {},
    create: {
      lessonId: lesson4_1.id,
      title: "Order-to-Cash Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the correct order of the Order-to-Cash process in SAP SD?",
            explanation: "The O2C flow is: Sales Order (VA01) → Delivery (VL01N) → Goods Issue → Billing (VF01) → Payment (F-28). The order is created first, goods are shipped, then the customer is billed and pays.",
            options: {
              create: [
                { text: "Sales Order → Delivery → Goods Issue → Billing → Payment", isCorrect: true },
                { text: "Billing → Sales Order → Delivery → Payment", isCorrect: false },
                { text: "Delivery → Sales Order → Payment → Billing", isCorrect: false },
                { text: "Payment → Sales Order → Billing → Delivery", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which SAP transaction code is used to create a Sales Order?",
            explanation: "VA01 creates a sales order — the central document in SD. VA02 changes it, and VA03 displays it. (VL01N is for deliveries, VF01 is for billing.)",
            options: {
              create: [
                { text: "VA01", isCorrect: true },
                { text: "VL01N", isCorrect: false },
                { text: "VF01", isCorrect: false },
                { text: "ME21N", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What happens automatically when you post Goods Issue in a delivery?",
            explanation: "Posting Goods Issue reduces inventory and posts an accounting document: Debit Cost of Goods Sold, Credit Inventory. Ownership of the goods transfers to the customer at this point.",
            options: {
              create: [
                { text: "Inventory is reduced and SAP posts Debit COGS / Credit Inventory", isCorrect: true },
                { text: "The customer is automatically paid", isCorrect: false },
                { text: "A purchase order is created", isCorrect: false },
                { text: "Nothing — goods issue is just a status flag", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 4.2: Sales Order Structure
  const lesson4_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: sdModule.id, slug: "sales-order-structure" } },
    update: {},
    create: {
      moduleId: sdModule.id,
      title: "Inside a Sales Order",
      slug: "sales-order-structure",
      order: 2,
      isPublished: true,
      estimatedMinutes: 12,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Karthik just created his first sales order in SAP. His trainer asks: "What's the order type? Which sales area did you use? What are the partner functions?"

Karthik froze. He typed some numbers and the order saved — but he doesn't understand WHY it worked or what all those fields mean.

A sales order looks simple on the surface, but underneath it has a clear structure: a header, line items, and schedule lines. Understanding this structure is what separates someone who clicks buttons from someone who actually understands SD.`,
      content: `## The Three Levels of a Sales Order

Every sales order in SAP has three levels, like a nested structure:

### 1. Header Level
Information that applies to the WHOLE order:
- **Sold-to party** — the customer placing the order
- **Order type** — e.g. OR (standard order), RE (returns)
- **Sales area** — Sales Org + Distribution Channel + Division
- **Payment terms, currency, pricing date**

### 2. Item Level
Each product on the order is a line item:
- **Material number** — what is being sold
- **Quantity and price**
- **Plant** — where it ships from
- Each item can have a different delivery date

### 3. Schedule Line Level
Within each item, schedule lines show WHEN and HOW MUCH:
- "20 units on Monday, 30 units next Friday"
- This is where the availability check (ATP) result lives

## The Sales Area — A Key Concept

A **Sales Area** is the combination of three organizational units:

| Unit | Meaning | Example |
|------|---------|---------|
| **Sales Organization** | Legal selling entity | 1000 (India Sales) |
| **Distribution Channel** | How you sell | 10 (Direct), 20 (Wholesale) |
| **Division** | Product line | 00 (Furniture), 01 (Electronics) |

Every sales order belongs to exactly ONE sales area. It determines pricing, which materials can be sold, and reporting.

## Partner Functions

A single order can involve different roles:

| Partner Function | Who They Are |
|------------------|--------------|
| **Sold-to Party (SP)** | Who placed the order |
| **Ship-to Party (SH)** | Where goods are delivered |
| **Bill-to Party (BP)** | Who receives the invoice |
| **Payer (PY)** | Who actually pays |

Often all four are the same customer — but for large companies they can differ (e.g. a head office pays, but goods ship to a branch).

## Key Customizing & Master Data

| Element | T-Code | Purpose |
|---------|--------|---------|
| **Customer Master** | BP / XD03 | Customer details, addresses |
| **Material Master** | MM03 | Product details, sales views |
| **Condition Records (Pricing)** | VK11 | Prices, discounts, taxes |
| **Sales Order** | VA01 | Create the order |`,
      keyConceptTitle: "Sales Order = Header + Items + Schedule Lines",
      keyConceptBody: `A sales order has three nested levels:
- **Header** — applies to the whole order (customer, order type, sales area)
- **Item** — each material being sold (quantity, price, plant)
- **Schedule Line** — when and how much will be delivered

The **Sales Area** (Sales Org + Distribution Channel + Division) is the backbone that determines pricing, valid materials, and reporting.`,
    },
  });

  const flowchart4_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson4_2.id },
    update: {},
    create: {
      lessonId: lesson4_2.id,
      title: "Sales Order Structure",
      nodes: [
        { id: "header", type: "default", position: { x: 300, y: 30 }, data: { label: "📄 Order Header\nCustomer, Order Type, Sales Area" }, style: { background: "#DC2626", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "12px 20px", width: 240 } },
        { id: "item1", type: "default", position: { x: 120, y: 170 }, data: { label: "📦 Item 10\nMaterial, Qty, Price, Plant" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px" } },
        { id: "item2", type: "default", position: { x: 420, y: 170 }, data: { label: "📦 Item 20\nMaterial, Qty, Price, Plant" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px" } },
        { id: "sched1", type: "default", position: { x: 120, y: 310 }, data: { label: "📅 Schedule Lines\nWhen + How Much (ATP)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px" } },
        { id: "sched2", type: "default", position: { x: 420, y: 310 }, data: { label: "📅 Schedule Lines\nWhen + How Much (ATP)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px" } },
        { id: "salesarea", type: "default", position: { x: 640, y: 30 }, data: { label: "🏢 Sales Area\nSalesOrg + Channel + Division" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 190, fontSize: "12px" } },
      ],
      edges: [
        { id: "e1", source: "header", target: "item1" },
        { id: "e2", source: "header", target: "item2" },
        { id: "e3", source: "item1", target: "sched1" },
        { id: "e4", source: "item2", target: "sched2" },
        { id: "e5", source: "salesarea", target: "header", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart4_2.id, nodeId: "header", title: "Order Header", description: "Holds data valid for the entire order: sold-to party, order type (OR = standard), sales area, payment terms, currency, and pricing date.", tCode: "VA01 (Header → Sales)", tips: "Change the header pricing date to re-price the whole order at a different date's conditions." },
      { flowchartId: flowchart4_2.id, nodeId: "item1", title: "Line Item", description: "Each product on the order. Contains the material number, order quantity, net price, and the plant it ships from. Each item can have its own delivery date and plant.", tCode: "VA01 (Item Overview)", tips: "Items are numbered 10, 20, 30 by default — leaving gaps so you can insert items later." },
      { flowchartId: flowchart4_2.id, nodeId: "sched1", title: "Schedule Lines", description: "Within an item, schedule lines define how much will be delivered on which date. The availability check (ATP) result is stored here — confirming if stock can meet the requested date.", tCode: "VA01 (Item → Schedule Lines)", tips: "If stock is short, SAP may split one item into multiple schedule lines with different dates." },
      { flowchartId: flowchart4_2.id, nodeId: "salesarea", title: "Sales Area", description: "The combination of Sales Organization + Distribution Channel + Division. Every order belongs to one sales area, which controls pricing, valid materials, and reporting.", tCode: "OVXG (Set up Sales Area), VA01", tips: "If a material isn't extended to your sales area, you can't sell it — a very common beginner error." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson4_2.id },
    update: {},
    create: {
      lessonId: lesson4_2.id,
      title: "Sales Order Structure Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What are the three levels of a sales order in SAP?",
            explanation: "A sales order has three nested levels: Header (whole order), Item (each material), and Schedule Line (when/how much each item is delivered).",
            options: {
              create: [
                { text: "Header, Item, and Schedule Line", isCorrect: true },
                { text: "Vendor, Customer, and Material", isCorrect: false },
                { text: "Order, Delivery, and Invoice", isCorrect: false },
                { text: "Debit, Credit, and Balance", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which three organizational units make up a Sales Area?",
            explanation: "A Sales Area = Sales Organization + Distribution Channel + Division. It determines pricing, which materials can be sold, and how sales are reported.",
            options: {
              create: [
                { text: "Sales Organization + Distribution Channel + Division", isCorrect: true },
                { text: "Company Code + Plant + Storage Location", isCorrect: false },
                { text: "Customer + Material + Price", isCorrect: false },
                { text: "Header + Item + Schedule Line", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "In a sales order, which partner function identifies WHERE the goods are delivered?",
            explanation: "The Ship-to Party (SH) is the address where goods are delivered. It can differ from the Sold-to Party (who ordered), Bill-to Party (who is invoiced), and Payer (who pays).",
            options: {
              create: [
                { text: "Ship-to Party", isCorrect: true },
                { text: "Sold-to Party", isCorrect: false },
                { text: "Payer", isCorrect: false },
                { text: "Bill-to Party", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 5: SAP PP (Production Planning)
  // ─────────────────────────────────────────────
  const ppModule = await prisma.module.upsert({
    where: { slug: "pp" },
    update: {},
    create: {
      title: "SAP PP",
      slug: "pp",
      description: "Learn how SAP plans and controls manufacturing — from demand planning to finished goods on the shop floor.",
      color: "#059669",
      icon: "🏭",
      order: 5,
      isPublished: true,
    },
  });

  // LESSON 5.1: Production Planning Basics
  const lesson5_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: ppModule.id, slug: "production-planning-basics" } },
    update: {},
    create: {
      moduleId: ppModule.id,
      title: "How Manufacturing Works in SAP",
      slug: "production-planning-basics",
      order: 1,
      isPublished: true,
      estimatedMinutes: 12,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Anita runs a bicycle factory. To build one bicycle, she needs 2 wheels, 1 frame, 1 handlebar, and a set of pedals. When a customer orders 100 bicycles, she has to figure out: do we have enough parts? What do we need to buy? When can we start building?

Doing this by hand for hundreds of products and thousands of parts is impossible. One missed component and the whole production line stops.

SAP PP solves this by knowing the "recipe" for every product and automatically calculating exactly what to make, what to buy, and when — a process called Production Planning.`,
      content: `## What is Production Planning?

**Production Planning (PP)** is the SAP module that plans and controls manufacturing. It answers three questions:
1. **What** do we need to produce?
2. **What materials** do we need to make it?
3. **When** should we start?

## The Two Master Data Pillars

Before SAP can plan anything, it needs two key pieces of master data:

### 1. Bill of Materials (BOM) — CS01
The "recipe" — a list of all components needed to make one finished product.
- Example: 1 Bicycle = 2 Wheels + 1 Frame + 1 Handlebar + 2 Pedals
- T-Code: **CS01** (Create) / **CS02** (Change) / **CS03** (Display)

### 2. Routing — CA01
The "instructions" — the sequence of operations and work centers to make the product.
- Example: Cut → Weld → Assemble → Paint → Inspect
- Tells SAP which machines and how much time each step takes
- T-Code: **CA01** (Create Routing)

## The PP Planning Flow

### Step 1: Demand (from SD or Forecast)
Demand comes from sales orders or a sales forecast (planned independent requirements).

### Step 2: MRP Run — MD01 / MD02
**Material Requirements Planning (MRP)** is the brain of PP. It looks at:
- Demand (what's needed)
- Current stock (what we have)
- The BOM (what each product requires)

Then it calculates exactly what to produce and what to buy, creating:
- **Planned Orders** (for items we make)
- **Purchase Requisitions** (for items we buy)
- T-Code: **MD01** (Total Planning) / **MD02** (Single Material) / **MD04** (Stock/Requirements List)

### Step 3: Production Order — CO01
Planned orders are converted into firm production orders.
- A production order is the instruction to actually make the product
- Reserves components and schedules machine time
- T-Code: **CO01** (Create) / **CO02** (Change)

### Step 4: Confirmation & Goods Receipt — CO11N / MIGO
- **CO11N** — confirm operations are done (records actual time/quantity)
- **MIGO** — receive the finished goods into stock (Movement Type 101)

## Make-to-Stock vs Make-to-Order

| Strategy | Meaning | Example |
|----------|---------|---------|
| **Make-to-Stock (MTS)** | Produce based on forecast, sell from stock | Consumer goods |
| **Make-to-Order (MTO)** | Produce only after a customer orders | Custom machinery |`,
      keyConceptTitle: "PP = BOM + Routing → MRP → Production Order",
      keyConceptBody: `Production Planning rests on two master data pillars:
- **BOM (CS01)** — the recipe: what components make the product
- **Routing (CA01)** — the steps: how the product is made

The **MRP run (MD01)** is the brain: it compares demand vs stock vs BOM and automatically creates **Planned Orders** (make) and **Purchase Requisitions** (buy). Planned orders become **Production Orders (CO01)** which are confirmed (CO11N) and received into stock (MIGO).`,
    },
  });

  const flowchart5_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson5_1.id },
    update: {},
    create: {
      lessonId: lesson5_1.id,
      title: "Production Planning Flow",
      nodes: [
        { id: "demand", type: "default", position: { x: 60, y: 200 }, data: { label: "📈 Demand\nSales Order / Forecast" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "12px", width: 140, fontSize: "12px", textAlign: "center" } },
        { id: "mrp", type: "default", position: { x: 250, y: 200 }, data: { label: "🧠 MRP Run\nMD01" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 130, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "bom", type: "default", position: { x: 250, y: 60 }, data: { label: "📋 BOM\nCS01" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px", width: 110, fontSize: "12px", textAlign: "center" } },
        { id: "planned", type: "default", position: { x: 430, y: 120 }, data: { label: "📝 Planned Order\n(Make)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "preq", type: "default", position: { x: 430, y: 280 }, data: { label: "🛒 Purchase Req\n(Buy → MM)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "12px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "prodorder", type: "default", position: { x: 610, y: 120 }, data: { label: "🏭 Production Order\nCO01" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 140, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "confirm", type: "default", position: { x: 790, y: 120 }, data: { label: "✅ Confirm + GR\nCO11N / MIGO" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 140, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "demand", target: "mrp" },
        { id: "e2", source: "bom", target: "mrp" },
        { id: "e3", source: "mrp", target: "planned" },
        { id: "e4", source: "mrp", target: "preq" },
        { id: "e5", source: "planned", target: "prodorder" },
        { id: "e6", source: "prodorder", target: "confirm" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart5_1.id, nodeId: "bom", title: "Bill of Materials (BOM)", description: "The recipe for a product — every component and quantity needed to make one finished unit. MRP explodes the BOM to know what raw materials are required.", tCode: "CS01 (Create), CS02 (Change), CS03 (Display), CS11 (Multi-level)", tips: "BOMs can be multi-level: a finished product contains assemblies, which themselves contain parts." },
      { flowchartId: flowchart5_1.id, nodeId: "mrp", title: "MRP Run (MD01/MD02)", description: "Material Requirements Planning — the engine of PP. Compares demand against stock and explodes BOMs to calculate what to make and what to buy.", tCode: "MD01 (Total), MD02 (Single Item), MD04 (Stock/Reqmts List)", tips: "MD04 is the most-used PP screen — it shows the live planning situation for any material." },
      { flowchartId: flowchart5_1.id, nodeId: "planned", title: "Planned Order", description: "MRP's proposal for in-house production. It's not yet firm — it's a suggestion. Planned orders are converted to production orders to actually start making the product.", tCode: "MD04, CO40 (Convert to Production Order)", tips: "Planned orders for purchased parts become purchase requisitions instead of production orders." },
      { flowchartId: flowchart5_1.id, nodeId: "preq", title: "Purchase Requisition", description: "For components you buy rather than make, MRP creates a purchase requisition that flows into MM's Procure-to-Pay process.", tCode: "ME51N, MD04", tips: "This is where PP hands off to MM — the same purchase requisition you learned about in the MM module." },
      { flowchartId: flowchart5_1.id, nodeId: "prodorder", title: "Production Order (CO01)", description: "The firm instruction to manufacture. Reserves components, schedules work centers, and collects actual costs. The shop floor works against this order.", tCode: "CO01 (Create), CO02 (Change), CO03 (Display)", tips: "A production order has a status (CRTD, REL, CNF) — it must be Released (REL) before work can begin." },
      { flowchartId: flowchart5_1.id, nodeId: "confirm", title: "Confirmation & Goods Receipt", description: "CO11N confirms operations were completed (actual time and quantity). MIGO posts the finished goods into inventory (Movement Type 101), increasing stock.", tCode: "CO11N (Confirm), MIGO (Goods Receipt)", tips: "Confirmation feeds actual costs back to CO — comparing planned vs actual production cost." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson5_1.id },
    update: {},
    create: {
      lessonId: lesson5_1.id,
      title: "Production Planning Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is a Bill of Materials (BOM) in SAP PP?",
            explanation: "A BOM is the 'recipe' for a product — the complete list of components and quantities needed to make one finished unit. MRP explodes the BOM to calculate material requirements.",
            options: {
              create: [
                { text: "The list of all components and quantities needed to make a product", isCorrect: true },
                { text: "A list of all bills the company must pay", isCorrect: false },
                { text: "The sequence of machines used in production", isCorrect: false },
                { text: "A customer's purchase order", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What does the MRP run create for materials that are MADE in-house versus materials that are BOUGHT?",
            explanation: "MRP creates Planned Orders for in-house manufacturing and Purchase Requisitions for materials that must be bought from vendors. The purchase requisitions then flow into MM's procurement process.",
            options: {
              create: [
                { text: "Planned Orders for in-house items, Purchase Requisitions for bought items", isCorrect: true },
                { text: "Sales orders for everything", isCorrect: false },
                { text: "Invoices for in-house items, deliveries for bought items", isCorrect: false },
                { text: "Nothing — MRP only reports, it doesn't create documents", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "In Make-to-Order (MTO) production, when is the product manufactured?",
            explanation: "In Make-to-Order, production starts only AFTER a specific customer order is received. This contrasts with Make-to-Stock, where products are made based on forecast and sold from stock.",
            options: {
              create: [
                { text: "Only after a specific customer order is received", isCorrect: true },
                { text: "Based on a forecast, before any order arrives", isCorrect: false },
                { text: "Once a year during annual planning", isCorrect: false },
                { text: "Never — MTO products are always purchased", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 5.2: The Production Order Lifecycle
  const lesson5_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: ppModule.id, slug: "production-order-lifecycle" } },
    update: {},
    create: {
      moduleId: ppModule.id,
      title: "The Production Order Lifecycle",
      slug: "production-order-lifecycle",
      order: 2,
      isPublished: true,
      estimatedMinutes: 12,
      difficulty: "INTERMEDIATE",
      xpReward: 75,
      story: `Ramesh manages the shop floor. A production order lands on his desk: "Make 100 bicycles." But what does he actually do with it in SAP? When does he take parts from the warehouse? How does the system know the bikes are done? And how does finance find out what it cost to make them?

A production order isn't just a document — it has a full lifecycle with clear stages. Understanding each stage is what makes you effective on the manufacturing side of SAP.`,
      content: `## The Production Order: Birth to Death

A production order moves through clear stages, each with a status and an action.

### Stage 1: Creation (Status: CRTD)
The order is created — either from a converted planned order or manually (CO01).
- Components are listed (from the BOM)
- Operations are scheduled (from the Routing)
- Planned costs are calculated

### Stage 2: Release (Status: REL)
The order is released, signaling "you may now start production."
- Before release, no goods movements are allowed
- T-Code: **CO02** → Release, or release at creation

### Stage 3: Goods Issue (Components leave warehouse)
Raw materials are issued to the order.
- **Movement Type 261** — Goods Issue to Production Order
- Stock of components decreases
- T-Code: **MIGO** or **MB1A**

### Stage 4: Confirmation (Status: PCNF / CNF)
The shop floor confirms work as it progresses.
- Records actual quantities produced and time taken
- **PCNF** = partially confirmed, **CNF** = fully confirmed
- T-Code: **CO11N** (Operation Confirmation)

### Stage 5: Goods Receipt (Finished goods enter stock)
The completed product is received into inventory.
- **Movement Type 101** — Goods Receipt for production order
- Finished goods stock increases
- T-Code: **MIGO**

### Stage 6: Settlement (Status: SETC)
Costs collected on the order are settled to the right place.
- Actual costs are compared to planned costs (variance)
- Variances are posted to CO
- T-Code: **KO88** (Order Settlement)

## The Accounting Story

A production order is also a **cost collector**:

| Event | Cost Impact |
|-------|-------------|
| Goods Issue (261) | Component cost charged to order |
| Confirmation | Labor / machine cost charged to order |
| Goods Receipt (101) | Finished goods value credited |
| Settlement | Difference (variance) sent to CO |

## Order Status Is Everything

In PP, you constantly check the **status** of an order. Key statuses:
- **CRTD** — Created (not yet started)
- **REL** — Released (can produce)
- **CNF** — Confirmed (work done)
- **DLV** — Delivered (goods received)
- **TECO** — Technically Complete (closed)
- **CLSD** — Closed`,
      keyConceptTitle: "Production Order = Create → Release → Issue → Confirm → Receive → Settle",
      keyConceptBody: `A production order lives through six stages:
1. **Create (CO01)** — components and operations planned
2. **Release (CO02)** — production allowed to begin
3. **Goods Issue (MvT 261)** — raw materials consumed
4. **Confirm (CO11N)** — actual time/quantity recorded
5. **Goods Receipt (MvT 101)** — finished goods into stock
6. **Settlement (KO88)** — costs and variances posted to CO

The order is also a **cost collector** — it gathers component and labor costs, then settles the variance to Controlling.`,
    },
  });

  const flowchart5_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson5_2.id },
    update: {},
    create: {
      lessonId: lesson5_2.id,
      title: "Production Order Lifecycle",
      nodes: [
        { id: "create", type: "default", position: { x: 40, y: 200 }, data: { label: "🆕 Create\nCO01 (CRTD)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "release", type: "default", position: { x: 200, y: 200 }, data: { label: "🚀 Release\nCO02 (REL)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "issue", type: "default", position: { x: 360, y: 200 }, data: { label: "📤 Goods Issue\nMvT 261" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "confirm", type: "default", position: { x: 520, y: 200 }, data: { label: "✅ Confirm\nCO11N (CNF)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "receipt", type: "default", position: { x: 680, y: 200 }, data: { label: "📥 Goods Receipt\nMvT 101" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "settle", type: "default", position: { x: 840, y: 200 }, data: { label: "💰 Settlement\nKO88" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "create", target: "release" },
        { id: "e2", source: "release", target: "issue" },
        { id: "e3", source: "issue", target: "confirm" },
        { id: "e4", source: "confirm", target: "receipt" },
        { id: "e5", source: "receipt", target: "settle" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart5_2.id, nodeId: "create", title: "Create Order (CO01)", description: "The production order is created with status CRTD. It pulls components from the BOM and operations from the Routing, and calculates planned costs.", tCode: "CO01 (Create), CO40 (from Planned Order)", tips: "At this stage nothing physical happens — no stock moves until the order is released." },
      { flowchartId: flowchart5_2.id, nodeId: "release", title: "Release Order (CO02)", description: "Releasing changes status to REL and authorizes production to begin. Only after release can you issue components and confirm operations.", tCode: "CO02 → Release, CO05N (Mass Release)", tips: "Many companies auto-release orders. Until REL, the shop floor can't draw materials." },
      { flowchartId: flowchart5_2.id, nodeId: "issue", title: "Goods Issue (MvT 261)", description: "Raw materials are issued from the warehouse to the order using movement type 261. Component stock decreases and the cost is charged to the order.", tCode: "MIGO (261), MB1A, COGI (Error List)", tips: "Backflushing can auto-issue components at confirmation time instead of manually." },
      { flowchartId: flowchart5_2.id, nodeId: "confirm", title: "Confirmation (CO11N)", description: "The shop floor confirms operations — recording actual machine time, labor, and quantity produced. Status moves to PCNF (partial) or CNF (full).", tCode: "CO11N (Single), CO15 (Order), CO12 (Collective)", tips: "Confirmations post activity costs to the order, enabling planned-vs-actual cost analysis." },
      { flowchartId: flowchart5_2.id, nodeId: "receipt", title: "Goods Receipt (MvT 101)", description: "The finished product is received into inventory with movement type 101. Finished goods stock increases and the inventory value is credited to the order.", tCode: "MIGO (101)", tips: "GR can be automatic at final confirmation if the 'control key' allows auto goods receipt." },
      { flowchartId: flowchart5_2.id, nodeId: "settle", title: "Settlement (KO88)", description: "The order's collected costs are settled. Actual costs are compared to the credited goods receipt value — any variance is posted to Controlling (CO).", tCode: "KO88 (Single), CO88 (Collective)", tips: "Settlement is usually run at month-end. Variances tell you if production cost more or less than planned." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson5_2.id },
    update: {},
    create: {
      lessonId: lesson5_2.id,
      title: "Production Order Lifecycle Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "Why must a production order be RELEASED (status REL) before production starts?",
            explanation: "Before release, no goods movements (issuing components, confirming work) are allowed. Releasing the order authorizes the shop floor to begin actual production.",
            options: {
              create: [
                { text: "Release authorizes production — no goods movements are allowed before it", isCorrect: true },
                { text: "Release sends the order to the customer", isCorrect: false },
                { text: "Release deletes the planned order", isCorrect: false },
                { text: "Release is optional and has no effect", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which movement type is used to issue raw materials (components) to a production order?",
            explanation: "Movement Type 261 is the Goods Issue to a production order. It consumes component stock and charges the cost to the order. (Movement Type 101 is the goods receipt of the FINISHED product.)",
            options: {
              create: [
                { text: "Movement Type 261", isCorrect: true },
                { text: "Movement Type 101", isCorrect: false },
                { text: "Movement Type 601", isCorrect: false },
                { text: "Movement Type 311", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What is the purpose of Settlement (KO88) at the end of a production order?",
            explanation: "Settlement compares the actual costs collected on the order against the value of goods received, and posts the difference (variance) to Controlling. This reveals whether production cost more or less than planned.",
            options: {
              create: [
                { text: "It posts the cost variance (planned vs actual) to Controlling", isCorrect: true },
                { text: "It ships the finished goods to the customer", isCorrect: false },
                { text: "It creates the purchase order for raw materials", isCorrect: false },
                { text: "It deletes the production order permanently", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 6: SAP HCM (Human Capital Management)
  // ─────────────────────────────────────────────
  const hcmModule = await prisma.module.upsert({
    where: { slug: "hcm" },
    update: {},
    create: {
      title: "SAP HCM",
      slug: "hcm",
      description: "Learn how SAP manages people — employee master data, organizational structure, time, and payroll.",
      color: "#7C3AED",
      icon: "👥",
      order: 6,
      isPublished: true,
    },
  });

  // LESSON 6.1: Employee Master Data & Infotypes
  const lesson6_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: hcmModule.id, slug: "infotypes-master-data" } },
    update: {},
    create: {
      moduleId: hcmModule.id,
      title: "Employee Data & Infotypes",
      slug: "infotypes-master-data",
      order: 1,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Deepa just joined the HR team. Her manager says: "Maintain the new joiner's data in PA30 — start with infotype 0002, then 0006 and 0008."

Deepa nods, but inside she's panicking. Infotype? 0002? It sounds like a secret code. Where does a person's name, address, and salary actually live in SAP?

The answer is beautifully simple once you get it: in SAP HCM, every type of employee information is stored in a numbered container called an **Infotype**. Learn the infotype system, and HR data suddenly makes sense.`,
      content: `## What is an Infotype?

In SAP HCM, employee data isn't stored in one giant record. Instead, it's split into **Infotypes** — each a small form holding one category of information, identified by a 4-digit number.

Think of infotypes like **tabs in an employee's file folder**:
- One tab for personal details
- One tab for address
- One tab for salary
- One tab for bank details

## The Most Common Infotypes

| Infotype | Name | What It Holds |
|----------|------|---------------|
| **0000** | Actions | Hiring, promotion, termination events |
| **0001** | Organizational Assignment | Position, department, cost center |
| **0002** | Personal Data | Name, date of birth, gender |
| **0006** | Addresses | Home/mailing address |
| **0007** | Planned Working Time | Work schedule |
| **0008** | Basic Pay | Salary, pay scale |
| **0009** | Bank Details | Where salary is paid |
| **0021** | Family / Dependents | Spouse, children |

## The Key T-Codes

| T-Code | Purpose |
|--------|---------|
| **PA30** | Maintain HR Master Data (create/edit infotypes) |
| **PA20** | Display HR Master Data (read-only) |
| **PA40** | Personnel Actions (run hiring, transfer, etc.) |

## How an Employee Is Identified

Every employee gets a unique **Personnel Number (PERNR)** — an 8-digit ID that links all their infotypes together. When you open PA30 and enter a PERNR, you see all that person's infotypes.

## Time-Based Data (Validity Periods)

A powerful HCM concept: infotypes store data with **start and end dates**. This means SAP keeps the full history.

Example — Basic Pay (0008):
- 01.01.2023 to 31.12.2023 → ₹50,000/month
- 01.01.2024 to 31.12.9999 → ₹60,000/month (after a raise)

SAP never overwrites — it keeps both records. You can always see what someone earned at any point in time.

## How HCM Connects to Other Modules

- **Organizational Assignment (0001)** links each employee to a **Cost Center** in CO — so salary costs hit the right department.
- **Payroll** results post to **FI** as accounting documents.
- This is why HR and Finance must stay in sync.`,
      keyConceptTitle: "Infotype = A Numbered Container for One Type of Employee Data",
      keyConceptBody: `In SAP HCM, employee data is split into **Infotypes**, each a 4-digit numbered form:
- **0002** = Personal Data (name, DOB)
- **0006** = Addresses
- **0008** = Basic Pay (salary)

Every employee has a unique **Personnel Number (PERNR)** linking all their infotypes. Use **PA30** to maintain data and **PA20** to display it. Infotypes are time-based (start/end dates), so SAP keeps the full history — it never overwrites.`,
    },
  });

  const flowchart6_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson6_1.id },
    update: {},
    create: {
      lessonId: lesson6_1.id,
      title: "Employee Infotype Structure",
      nodes: [
        { id: "pernr", type: "default", position: { x: 320, y: 30 }, data: { label: "👤 Employee\nPersonnel Number (PERNR)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "12px 20px", width: 230 } },
        { id: "it0002", type: "default", position: { x: 60, y: 180 }, data: { label: "0002\nPersonal Data" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "it0006", type: "default", position: { x: 200, y: 180 }, data: { label: "0006\nAddress" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "it0008", type: "default", position: { x: 340, y: 180 }, data: { label: "0008\nBasic Pay" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "it0001", type: "default", position: { x: 480, y: 180 }, data: { label: "0001\nOrg Assignment" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "it0009", type: "default", position: { x: 620, y: 180 }, data: { label: "0009\nBank Details" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "pa30", type: "default", position: { x: 320, y: 320 }, data: { label: "⚙️ PA30\nMaintain Master Data" }, style: { background: "#1E293B", color: "#fff", borderRadius: "8px", padding: "10px 16px", width: 190, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "pernr", target: "it0002" },
        { id: "e2", source: "pernr", target: "it0006" },
        { id: "e3", source: "pernr", target: "it0008" },
        { id: "e4", source: "pernr", target: "it0001" },
        { id: "e5", source: "pernr", target: "it0009" },
        { id: "e6", source: "it0008", target: "pa30", type: "smoothstep" },
        { id: "e7", source: "it0001", target: "pa30", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart6_1.id, nodeId: "pernr", title: "Personnel Number (PERNR)", description: "The unique 8-digit ID assigned to every employee. It links all of a person's infotypes together. Enter a PERNR in PA30/PA20 to access all their data.", tCode: "PA30, PA20", tips: "The PERNR is generated automatically when you hire someone via PA40 (Personnel Action)." },
      { flowchartId: flowchart6_1.id, nodeId: "it0002", title: "Infotype 0002 — Personal Data", description: "Stores name, date of birth, gender, marital status, and nationality. The most basic identity record for an employee.", tCode: "PA30 (Infotype 0002)", tips: "This is usually the first infotype filled when hiring an employee." },
      { flowchartId: flowchart6_1.id, nodeId: "it0008", title: "Infotype 0008 — Basic Pay", description: "Holds the employee's salary, pay scale group/level, and wage types. This data feeds directly into payroll.", tCode: "PA30 (Infotype 0008)", tips: "Pay changes create a new dated record — old salary history is preserved, never overwritten." },
      { flowchartId: flowchart6_1.id, nodeId: "it0001", title: "Infotype 0001 — Org Assignment", description: "Links the employee to their position, organizational unit, and cost center. This connection ensures payroll costs post to the correct department in CO.", tCode: "PA30 (Infotype 0001)", tips: "This infotype is the bridge between HCM and the Controlling (CO) module." },
      { flowchartId: flowchart6_1.id, nodeId: "pa30", title: "T-Code PA30", description: "The central transaction to maintain employee master data. Enter a PERNR, choose an infotype, and create/edit/copy records. PA20 is the display-only version.", tCode: "PA30 (Maintain), PA20 (Display)", tips: "Use PA20 when you only need to view data — you can't accidentally change anything." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson6_1.id },
    update: {},
    create: {
      lessonId: lesson6_1.id,
      title: "Infotypes & Master Data Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is an Infotype in SAP HCM?",
            explanation: "An infotype is a 4-digit numbered container that stores one category of employee information (e.g. 0002 = Personal Data, 0008 = Basic Pay). Splitting data this way keeps it organized and time-stamped.",
            options: {
              create: [
                { text: "A numbered container that stores one category of employee data", isCorrect: true },
                { text: "A type of payroll report", isCorrect: false },
                { text: "The employee's job title", isCorrect: false },
                { text: "A code for a SAP error message", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which transaction code is used to MAINTAIN (create/edit) employee master data?",
            explanation: "PA30 is used to maintain (create, edit, copy) employee master data. PA20 is the display-only version. PA40 runs personnel actions like hiring.",
            options: {
              create: [
                { text: "PA30", isCorrect: true },
                { text: "PA20", isCorrect: false },
                { text: "FS00", isCorrect: false },
                { text: "VA01", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "When an employee gets a salary raise, what does SAP do to infotype 0008 (Basic Pay)?",
            explanation: "Infotypes are time-based with start/end dates. SAP creates a NEW record with the new salary and new validity dates, while preserving the old record. The history is never overwritten — you can see what someone earned at any point in time.",
            options: {
              create: [
                { text: "Creates a new dated record while keeping the old one (full history preserved)", isCorrect: true },
                { text: "Overwrites the old salary permanently", isCorrect: false },
                { text: "Deletes infotype 0008 and creates 0009", isCorrect: false },
                { text: "Nothing — salary cannot be changed in SAP", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 6.2: Organizational Management & Payroll
  const lesson6_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: hcmModule.id, slug: "org-management-payroll" } },
    update: {},
    create: {
      moduleId: hcmModule.id,
      title: "Org Structure & Payroll Basics",
      slug: "org-management-payroll",
      order: 2,
      isPublished: true,
      estimatedMinutes: 12,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Naveen is told: "Create a new position for a Senior Engineer reporting to the Engineering Manager, then hire someone into it."

He wonders: isn't hiring just filling in a person's details? Why does he need to create a "position" first? And once people are hired, how does everyone actually get paid the right amount on the right day?

This lesson connects two big HCM ideas: how SAP models the company's structure (Organizational Management) and how it pays people (Payroll).`,
      content: `## Part 1: Organizational Management (OM)

SAP models a company's structure using building blocks called **Objects**. The three most important:

| Object | Code | Meaning |
|--------|------|---------|
| **Organizational Unit** | O | A department or team (e.g. Engineering) |
| **Position** | S | A specific seat (e.g. Senior Engineer) |
| **Person** | P | The actual employee who holds a position |

### The Golden Rule
**People hold Positions. Positions belong to Org Units.**

- "Engineering" is an Org Unit (O)
- "Senior Engineer" is a Position (S) inside it
- "Naveen" is a Person (P) who occupies that Position

This separation is powerful: when Naveen leaves, the Position stays — you just assign a new person to it.

### Key T-Code
- **PPOME** — Organization and Staffing (build the org chart visually)
- **PO13** — Maintain a Position

## Part 2: Payroll

**Payroll** calculates how much each employee gets paid and generates the payments.

### The Payroll Engine: Inputs
Payroll reads from infotypes:
- **0008 Basic Pay** — the salary
- **0014 Recurring Payments** — allowances
- **2001 Absences / 2002 Attendances** — time data
- Tax and social insurance settings

### Wage Types — The Building Blocks
Every payment or deduction is a **Wage Type** (a 4-character code):
- Basic Salary, House Rent Allowance, Provident Fund deduction, Income Tax

### The Payroll Run
1. **Simulation** — test run, no postings (PC00_M99_CALC_SIMU)
2. **Release Payroll** — lock master data (PA03)
3. **Live Run** — actual calculation
4. **Posting to FI** — payroll results become accounting documents (PC00_M99_CIPE)
5. **Bank Transfer** — generate payment files

### The Big Integration Point
Payroll results post to **FI** (as expense + payable) and to **CO** (cost center where the employee sits, from infotype 0001). This is why accurate org assignment matters — it decides which department bears the salary cost.`,
      keyConceptTitle: "OM Models the Structure; Payroll Pays the People",
      keyConceptBody: `**Organizational Management** uses three objects:
- **O** = Organizational Unit (department)
- **S** = Position (a seat)
- **P** = Person (the employee)

The rule: *People hold Positions; Positions belong to Org Units.* Build it in **PPOME**.

**Payroll** reads infotypes (0008 Basic Pay, time data), calculates **Wage Types**, and posts results to **FI** (expense/payable) and **CO** (the employee's cost center). Always simulate before the live run.`,
    },
  });

  const flowchart6_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson6_2.id },
    update: {},
    create: {
      lessonId: lesson6_2.id,
      title: "Org Structure & Payroll Flow",
      nodes: [
        { id: "orgunit", type: "default", position: { x: 60, y: 40 }, data: { label: "🏢 Org Unit (O)\nEngineering Dept" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 160, fontSize: "12px", fontWeight: "bold" } },
        { id: "position", type: "default", position: { x: 60, y: 160 }, data: { label: "💺 Position (S)\nSenior Engineer" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 160, fontSize: "12px" } },
        { id: "person", type: "default", position: { x: 60, y: 280 }, data: { label: "👤 Person (P)\nEmployee" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 160, fontSize: "12px" } },
        { id: "infotypes", type: "default", position: { x: 320, y: 280 }, data: { label: "📋 Infotypes\n0008 Pay, Time Data" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 170, fontSize: "12px" } },
        { id: "payroll", type: "default", position: { x: 560, y: 280 }, data: { label: "⚙️ Payroll Run\nWage Types Calculated" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px", fontWeight: "bold" } },
        { id: "post", type: "default", position: { x: 560, y: 130 }, data: { label: "💰 Post to FI + CO\nExpense / Payable / Cost Center" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 210, fontSize: "12px", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "orgunit", target: "position" },
        { id: "e2", source: "position", target: "person" },
        { id: "e3", source: "person", target: "infotypes" },
        { id: "e4", source: "infotypes", target: "payroll" },
        { id: "e5", source: "payroll", target: "post" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart6_2.id, nodeId: "orgunit", title: "Organizational Unit (O)", description: "Represents a department, team, or division. Org units link together to form the company's org chart hierarchy.", tCode: "PPOME, PO10", tips: "Org units can be nested — Engineering can contain Backend, Frontend, and QA sub-units." },
      { flowchartId: flowchart6_2.id, nodeId: "position", title: "Position (S)", description: "A specific seat in the organization (e.g. 'Senior Engineer'). A position belongs to one org unit and is held by a person. Positions persist even when people leave.", tCode: "PO13, PPOME", tips: "Separating Position from Person means re-hiring is just assigning a new person to an existing seat." },
      { flowchartId: flowchart6_2.id, nodeId: "person", title: "Person (P)", description: "The actual employee who occupies a position. Linked to the position via the org assignment (infotype 0001).", tCode: "PA30, PA40", tips: "One person normally holds one position, but SAP can model multiple assignments." },
      { flowchartId: flowchart6_2.id, nodeId: "payroll", title: "Payroll Run", description: "Reads infotypes and time data, then calculates each wage type (earnings and deductions) to determine net pay. Always run a simulation before the live run.", tCode: "PC00_M99_CALC (Run), PA03 (Control Record)", tips: "PA03 locks master data during the live payroll period so values can't change mid-run." },
      { flowchartId: flowchart6_2.id, nodeId: "post", title: "Post to FI + CO", description: "Payroll results become accounting documents: salary expense and statutory payables in FI, charged to the employee's cost center in CO (from infotype 0001).", tCode: "PC00_M99_CIPE (Posting to Accounting)", tips: "This is the key HCM↔FICO integration — wrong org assignment means salary hits the wrong department." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson6_2.id },
    update: {},
    create: {
      lessonId: lesson6_2.id,
      title: "Org Management & Payroll Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "In SAP Organizational Management, what is the correct relationship between Org Unit, Position, and Person?",
            explanation: "The golden rule: People hold Positions, and Positions belong to Org Units. 'Engineering' (Org Unit) contains the 'Senior Engineer' seat (Position), which is occupied by an employee (Person).",
            options: {
              create: [
                { text: "People hold Positions; Positions belong to Org Units", isCorrect: true },
                { text: "Org Units hold People; People belong to Positions", isCorrect: false },
                { text: "Positions hold Org Units; Org Units belong to People", isCorrect: false },
                { text: "They are unrelated and stored separately", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What is a Wage Type in SAP Payroll?",
            explanation: "A wage type is a 4-character code representing a single payment or deduction — like Basic Salary, House Rent Allowance, or Provident Fund deduction. Payroll calculates all wage types to determine net pay.",
            options: {
              create: [
                { text: "A code representing a single payment or deduction in payroll", isCorrect: true },
                { text: "The type of contract an employee has", isCorrect: false },
                { text: "A category of vendor invoice", isCorrect: false },
                { text: "The pay grade of a manager", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "When payroll runs, where do the results post, and what decides which department bears the cost?",
            explanation: "Payroll results post to FI (salary expense and payables) and to CO, charged to the employee's cost center. That cost center comes from infotype 0001 (Org Assignment) — which is why accurate org assignment is critical.",
            options: {
              create: [
                { text: "To FI and CO, with cost charged to the cost center from infotype 0001", isCorrect: true },
                { text: "To the MM module as a purchase order", isCorrect: false },
                { text: "Only to an Excel file emailed to HR", isCorrect: false },
                { text: "Nowhere — payroll only prints payslips", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 7: SAP PM (Plant Maintenance)
  // ─────────────────────────────────────────────
  const pmModule = await prisma.module.upsert({
    where: { slug: "pm" },
    update: {},
    create: {
      title: "SAP PM",
      slug: "pm",
      description: "Learn how SAP keeps machines and equipment running — maintenance requests, work orders, and preventive maintenance.",
      color: "#0891B2",
      icon: "🔧",
      order: 7,
      isPublished: true,
    },
  });

  // LESSON 7.1: Plant Maintenance Basics
  const lesson7_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: pmModule.id, slug: "plant-maintenance-basics" } },
    update: {},
    create: {
      moduleId: pmModule.id,
      title: "Keeping Equipment Running",
      slug: "plant-maintenance-basics",
      order: 1,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `At a bottling plant, a conveyor belt suddenly breaks down. The whole line stops. The operator yells for a technician. But who logs the problem? How does a spare part get ordered? How does the company know this belt breaks every 3 months?

Without a system, breakdowns are chaos — verbal requests, lost paperwork, no history. SAP PM brings order: every machine is registered, every breakdown is logged, every repair is tracked, and the system can even schedule maintenance BEFORE things break.`,
      content: `## What is Plant Maintenance?

**Plant Maintenance (PM)** manages the upkeep of a company's physical assets — machines, vehicles, buildings, and equipment. The goal: maximum uptime, minimum surprises.

## The Technical Objects (Master Data)

### 1. Functional Location — IL01
A *place* in the plant where equipment sits — like "Bottling Line 1 > Conveyor Section."
- Organized as a hierarchy of locations
- T-Code: **IL01** (Create), **IL03** (Display)

### 2. Equipment — IE01
A specific physical asset — "Conveyor Motor #4502."
- Has a serial number, manufacturer, warranty
- Can be installed at a functional location
- T-Code: **IE01** (Create), **IE03** (Display)

## The Maintenance Process

### Step 1: Notification — IW21
Someone reports a problem ("conveyor is making a grinding noise").
- A **Maintenance Notification** records what's wrong, where, and when
- It's a request — not yet a job to do
- T-Code: **IW21** (Create), **IW22** (Change)

### Step 2: Maintenance Order — IW31
The notification is converted into a **Maintenance Order** — the actual job.
- Plans operations, labor, spare parts, and costs
- Reserves materials and assigns technicians
- T-Code: **IW31** (Create), **IW32** (Change)

### Step 3: Execution & Confirmation — IW41
Technicians do the work and confirm time spent.
- Spare parts are issued (goods issue from MM)
- Labor hours are recorded
- T-Code: **IW41** (Confirm)

### Step 4: Technical Completion (TECO) & Settlement
- **TECO** closes the order from a technical standpoint
- Costs are settled to a cost center
- The equipment's history is updated

## Types of Maintenance

| Type | When | Example |
|------|------|---------|
| **Breakdown** | After failure | Motor stops working |
| **Corrective** | Fix a known issue | Replace worn bearing |
| **Preventive** | Scheduled, before failure | Oil change every 500 hrs |
| **Predictive** | Based on sensor data | Vibration analysis |

## The Power of Preventive Maintenance

PM can create **Maintenance Plans** that automatically generate orders on a schedule (e.g. "service every 3 months"). This prevents breakdowns instead of reacting to them — saving huge costs.`,
      keyConceptTitle: "PM = Notification → Order → Execution → Completion",
      keyConceptBody: `Plant Maintenance tracks two technical objects:
- **Functional Location (IL01)** — the place
- **Equipment (IE01)** — the physical asset

The maintenance flow:
1. **Notification (IW21)** — report the problem
2. **Maintenance Order (IW31)** — plan the job (labor, parts, cost)
3. **Confirmation (IW41)** — do the work, record time
4. **TECO + Settlement** — close and post costs

**Preventive maintenance plans** generate orders automatically on a schedule — fixing things before they break.`,
    },
  });

  const flowchart7_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson7_1.id },
    update: {},
    create: {
      lessonId: lesson7_1.id,
      title: "Plant Maintenance Process Flow",
      nodes: [
        { id: "equip", type: "default", position: { x: 60, y: 40 }, data: { label: "🏭 Equipment / FuncLoc\nIE01 / IL01" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px", fontWeight: "bold" } },
        { id: "notif", type: "default", position: { x: 60, y: 190 }, data: { label: "📢 Notification\nIW21 (Report Problem)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px" } },
        { id: "order", type: "default", position: { x: 320, y: 190 }, data: { label: "🔧 Maintenance Order\nIW31 (Plan Job)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px", fontWeight: "bold" } },
        { id: "parts", type: "default", position: { x: 320, y: 40 }, data: { label: "📦 Issue Spare Parts\n(from MM)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 160, fontSize: "12px" } },
        { id: "confirm", type: "default", position: { x: 580, y: 190 }, data: { label: "✅ Execute & Confirm\nIW41" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 170, fontSize: "12px", fontWeight: "bold" } },
        { id: "teco", type: "default", position: { x: 580, y: 320 }, data: { label: "🏁 TECO + Settlement\nClose + Post Costs" }, style: { background: "#1E293B", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px" } },
      ],
      edges: [
        { id: "e1", source: "equip", target: "notif" },
        { id: "e2", source: "notif", target: "order" },
        { id: "e3", source: "parts", target: "order" },
        { id: "e4", source: "order", target: "confirm" },
        { id: "e5", source: "confirm", target: "teco" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart7_1.id, nodeId: "equip", title: "Equipment & Functional Location", description: "Equipment (IE01) is a specific physical asset with a serial number. Functional Location (IL01) is the place where it sits. Together they let SAP track exactly what broke and where.", tCode: "IE01/IE03 (Equipment), IL01/IL03 (Func Loc)", tips: "Equipment can be 'installed' at a functional location and moved between them — SAP keeps the history." },
      { flowchartId: flowchart7_1.id, nodeId: "notif", title: "Maintenance Notification (IW21)", description: "Records that something is wrong — what, where, and when. It's a request that captures the problem before any work is planned.", tCode: "IW21 (Create), IW22 (Change), IW28 (List)", tips: "Notification types: M1 (breakdown), M2 (request), M3 (activity report)." },
      { flowchartId: flowchart7_1.id, nodeId: "order", title: "Maintenance Order (IW31)", description: "The actual job. Plans operations, required labor, spare parts, and estimated costs. Created from a notification or directly. Acts as a cost collector like a production order.", tCode: "IW31 (Create), IW32 (Change), IW38 (List)", tips: "The order reserves spare parts in MM and schedules technicians — it ties PM to materials and HR." },
      { flowchartId: flowchart7_1.id, nodeId: "confirm", title: "Execution & Confirmation (IW41)", description: "Technicians perform the work and confirm actual hours. Spare parts are issued from inventory, charging their cost to the order.", tCode: "IW41 (Time Confirmation), MIGO (Parts Issue)", tips: "Confirmations capture real labor time so actual maintenance cost can be compared to plan." },
      { flowchartId: flowchart7_1.id, nodeId: "teco", title: "TECO & Settlement", description: "Technical Completion (TECO) closes the order operationally. Settlement posts the collected costs to a cost center, and the equipment's maintenance history is updated.", tCode: "IW32 → TECO, KO88 (Settlement)", tips: "Equipment history (IH08) shows every past notification and order — invaluable for spotting recurring failures." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson7_1.id },
    update: {},
    create: {
      lessonId: lesson7_1.id,
      title: "Plant Maintenance Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "In SAP PM, what is the difference between a Maintenance Notification and a Maintenance Order?",
            explanation: "A Notification (IW21) reports a problem — it's a request. A Maintenance Order (IW31) is the actual planned job, with operations, labor, spare parts, and costs. The notification usually comes first and is converted into an order.",
            options: {
              create: [
                { text: "A Notification reports the problem; an Order is the planned job to fix it", isCorrect: true },
                { text: "They are the same thing with different names", isCorrect: false },
                { text: "An Order reports the problem; a Notification fixes it", isCorrect: false },
                { text: "A Notification is for vendors; an Order is for customers", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What is the benefit of Preventive Maintenance plans in SAP PM?",
            explanation: "Preventive maintenance plans automatically generate maintenance orders on a schedule (e.g. service every 3 months), allowing repairs BEFORE breakdowns occur. This maximizes uptime and reduces costly emergency repairs.",
            options: {
              create: [
                { text: "They generate orders on a schedule to prevent breakdowns before they happen", isCorrect: true },
                { text: "They eliminate the need for any technicians", isCorrect: false },
                { text: "They automatically sell broken equipment", isCorrect: false },
                { text: "They are only used for buildings, not machines", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What does a Functional Location represent in SAP PM?",
            explanation: "A Functional Location is a PLACE in the plant where equipment sits (e.g. 'Bottling Line 1 > Conveyor Section'), organized as a hierarchy. Equipment (a specific physical asset) can be installed at a functional location.",
            options: {
              create: [
                { text: "A place in the plant where equipment is installed", isCorrect: true },
                { text: "The bank account used to pay for repairs", isCorrect: false },
                { text: "A type of maintenance technician", isCorrect: false },
                { text: "A customer's delivery address", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 7.2: The Maintenance Order in Depth
  const lesson7_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: pmModule.id, slug: "maintenance-order-depth" } },
    update: {},
    create: {
      moduleId: pmModule.id,
      title: "Inside the Maintenance Order",
      slug: "maintenance-order-depth",
      order: 2,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "INTERMEDIATE",
      xpReward: 75,
      story: `Sunita is a maintenance planner. A notification comes in: "Pump P-101 is leaking." She needs to turn this into a real job — assign two technicians for 4 hours, order a new seal, and estimate the cost so her manager can approve it.

She opens IW31 and sees tabs: Operations, Components, Costs. What goes where? How does SAP know the cost? This lesson opens up the maintenance order so you understand each part and how it controls real maintenance work.`,
      content: `## The Maintenance Order Anatomy

A maintenance order is organized into sections. Master each and you understand the heart of PM.

### Header
- Order type (e.g. PM01 = breakdown, PM02 = preventive)
- The equipment / functional location being maintained
- Priority and dates

### Operations Tab
The steps of the job, each performed at a **Work Center** (a group of technicians or a machine):
- Operation 0010: Isolate pump (Electrical work center, 1 hr)
- Operation 0020: Replace seal (Mechanical work center, 3 hrs)

Each operation has a planned duration → this drives **labor cost**.

### Components Tab
The spare parts needed:
- 1 × Pump Seal (Material 50012)
- These are **reserved** in MM inventory and issued during the job

### Costs Tab
SAP automatically calculates planned cost from:
- Labor (operation hours × work center rate)
- Materials (component quantity × price)

## Order Status Flow

| Status | Meaning |
|--------|---------|
| **CRTD** | Created |
| **REL** | Released — work can start, parts can be issued |
| **PCNF** | Partially confirmed |
| **CNF** | Confirmed — work done |
| **TECO** | Technically Complete |
| **CLSD** | Closed (after settlement) |

## The Cost Story (PM ↔ FICO)

A maintenance order is a **cost collector**, just like a production order:

| Event | Accounting Impact |
|-------|-------------------|
| Issue spare parts (MvT 261) | Material cost charged to order |
| Confirm labor (IW41) | Activity cost charged to order |
| Settlement (KO88) | Total cost posted to cost center / asset |

## Integration Map

- **MM** — spare parts come from inventory; if not in stock, a purchase requisition is raised
- **CO** — costs settle to the cost center responsible for the equipment
- **HR/Work Centers** — labor hours link to technician capacity
- **PP** — work centers are a shared concept between PP and PM

## Real-World Tip

Planners spend most of their time in **IW31/IW32** building good orders, and in **IW38/IW39** (order lists) to manage the maintenance backlog.`,
      keyConceptTitle: "The Maintenance Order = Operations + Components + Costs",
      keyConceptBody: `A maintenance order has three working sections:
- **Operations** — the job steps, each at a Work Center (drives labor cost)
- **Components** — spare parts needed (reserved/issued from MM)
- **Costs** — auto-calculated from labor hours + material prices

It's a **cost collector**: parts issues and labor confirmations pile costs onto the order, which settle (KO88) to the responsible cost center. Status flows CRTD → REL → CNF → TECO → CLSD.`,
    },
  });

  const flowchart7_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson7_2.id },
    update: {},
    create: {
      lessonId: lesson7_2.id,
      title: "Maintenance Order Anatomy",
      nodes: [
        { id: "header", type: "default", position: { x: 300, y: 30 }, data: { label: "🔧 Maintenance Order\nIW31 (Header)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "12px 20px", width: 210 } },
        { id: "ops", type: "default", position: { x: 80, y: 180 }, data: { label: "🛠️ Operations\nWork Centers + Hours" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 170, fontSize: "12px" } },
        { id: "comp", type: "default", position: { x: 320, y: 180 }, data: { label: "📦 Components\nSpare Parts (MM)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 170, fontSize: "12px" } },
        { id: "costs", type: "default", position: { x: 560, y: 180 }, data: { label: "💵 Costs\nLabor + Materials" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 170, fontSize: "12px" } },
        { id: "settle", type: "default", position: { x: 320, y: 320 }, data: { label: "💰 Settlement → Cost Center\nKO88" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 210, fontSize: "12px", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "header", target: "ops" },
        { id: "e2", source: "header", target: "comp" },
        { id: "e3", source: "header", target: "costs" },
        { id: "e4", source: "ops", target: "costs", type: "smoothstep" },
        { id: "e5", source: "comp", target: "costs", type: "smoothstep" },
        { id: "e6", source: "costs", target: "settle" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart7_2.id, nodeId: "header", title: "Order Header", description: "Defines the order type (PM01 breakdown, PM02 preventive), the equipment being maintained, priority, and scheduling dates.", tCode: "IW31 (Create), IW32 (Change)", tips: "Order type controls number ranges, settlement rules, and which fields appear — chosen carefully during config." },
      { flowchartId: flowchart7_2.id, nodeId: "ops", title: "Operations", description: "The individual steps of the job, each assigned to a Work Center (technicians or a machine) with a planned duration. Operation hours drive the labor cost.", tCode: "IW31 (Operations tab), IR01 (Work Center)", tips: "Work Centers are shared between PM and PP — both schedule capacity against them." },
      { flowchartId: flowchart7_2.id, nodeId: "comp", title: "Components", description: "The spare parts required for the job. These are reserved against MM inventory; if stock is unavailable, a purchase requisition is created automatically.", tCode: "IW31 (Components tab), MIGO (Issue)", tips: "Non-stock parts can be entered directly on the order, triggering a purchase requisition to a vendor." },
      { flowchartId: flowchart7_2.id, nodeId: "costs", title: "Costs", description: "SAP automatically calculates planned cost = (operation hours × work center rate) + (component qty × price). Actual costs accumulate as work is confirmed.", tCode: "IW32 (Costs tab), S_ALR reports", tips: "Comparing planned vs actual cost on the order reveals whether maintenance is over budget." },
      { flowchartId: flowchart7_2.id, nodeId: "settle", title: "Settlement to Cost Center", description: "When the order is complete, settlement (KO88) posts the total collected cost to the cost center responsible for the equipment, integrating PM with Controlling.", tCode: "KO88 (Single), CO88 (Collective)", tips: "Maintenance cost can also settle to a fixed asset if it's a capital improvement rather than a repair." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson7_2.id },
    update: {},
    create: {
      lessonId: lesson7_2.id,
      title: "Maintenance Order Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "In a maintenance order, what drives the planned LABOR cost?",
            explanation: "Labor cost = operation hours × the work center's activity rate. Each operation is assigned to a work center with a planned duration, and SAP multiplies that by the rate to calculate labor cost.",
            options: {
              create: [
                { text: "Operation hours multiplied by the work center's rate", isCorrect: true },
                { text: "The number of spare parts used", isCorrect: false },
                { text: "The price the customer is charged", isCorrect: false },
                { text: "The equipment's purchase price", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What happens to a maintenance order's costs at settlement (KO88)?",
            explanation: "Like a production order, a maintenance order is a cost collector. At settlement, the total accumulated cost (labor + materials) is posted to the responsible cost center (or sometimes a fixed asset), connecting PM to Controlling.",
            options: {
              create: [
                { text: "They are posted to the responsible cost center", isCorrect: true },
                { text: "They are refunded to the technician", isCorrect: false },
                { text: "They are deleted to keep the books clean", isCorrect: false },
                { text: "They are sent to the customer as an invoice", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "If a required spare part is NOT in stock when planning a maintenance order, what does SAP do?",
            explanation: "If a component is not available in inventory, SAP automatically creates a purchase requisition, linking PM to the MM procurement process so the part can be bought from a vendor.",
            options: {
              create: [
                { text: "It automatically creates a purchase requisition (links to MM)", isCorrect: true },
                { text: "It cancels the maintenance order", isCorrect: false },
                { text: "It charges the technician personally", isCorrect: false },
                { text: "Nothing — you cannot plan parts not in stock", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 8: SAP QM (Quality Management)
  // ─────────────────────────────────────────────
  const qmModule = await prisma.module.upsert({
    where: { slug: "qm" },
    update: {},
    create: {
      title: "SAP QM",
      slug: "qm",
      description: "Learn how SAP ensures product quality — inspections, quality notifications, and certificates across the supply chain.",
      color: "#16A34A",
      icon: "✅",
      order: 8,
      isPublished: true,
    },
  });

  // LESSON 8.1: Quality Management Basics
  const lesson8_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: qmModule.id, slug: "quality-management-basics" } },
    update: {},
    create: {
      moduleId: qmModule.id,
      title: "How SAP Ensures Quality",
      slug: "quality-management-basics",
      order: 1,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `A pharmaceutical company receives a shipment of raw chemicals. Before using them, someone must test purity, weight, and contamination. If the batch fails, it must be quarantined — never used in medicine.

How does the company make sure no untested material slips into production? How is every test result recorded for auditors? SAP QM answers this by automatically holding incoming goods in "quality inspection" until they pass — and logging every result.`,
      content: `## What is Quality Management?

**Quality Management (QM)** ensures that materials and products meet defined quality standards. It's woven into procurement, production, and sales — checking quality at every critical point.

## Where QM Inspects

| Inspection Point | When | Example |
|------------------|------|---------|
| **Goods Receipt (01)** | Material arrives from vendor | Test incoming raw materials |
| **In-Process (03)** | During production | Check parts mid-manufacture |
| **Final / Goods Issue (04)** | Before shipping to customer | Final product check |
| **Recurring** | Periodically | Re-test stored stock |

## The Master Data

### 1. Inspection Plan — QP01
Defines WHAT to inspect and HOW:
- Characteristics to check (weight, length, purity)
- Specifications / tolerance limits
- T-Code: **QP01** (Create Inspection Plan)

### 2. Master Inspection Characteristic — QS21
A reusable definition of a single quality attribute (e.g. "Diameter: 10mm ± 0.5mm").

### 3. Material QM View — MM01
The material master must have QM activated, telling SAP to trigger inspections.

## The Inspection Process

### Step 1: Inspection Lot Created (Automatic)
When goods are received (MIGO), SAP automatically creates an **Inspection Lot** if QM is active. The stock goes into **Quality Inspection** status — it can't be used yet.

### Step 2: Record Results — QE01 / QE51N
The inspector records measured values against the specifications.
- T-Code: **QE51N** (Results Recording Worklist)

### Step 3: Usage Decision — QA11
Someone decides the fate of the batch:
- **Accept** → stock moves to unrestricted use
- **Reject** → stock moves to blocked/scrapped
- T-Code: **QA11** (Make Usage Decision)

## Quality Notifications — QM01

When a defect or complaint occurs (from a customer or internally), a **Quality Notification** records it, tracks root-cause analysis, and drives corrective action.
- T-Code: **QM01** (Create Quality Notification)

## The Big Idea: Stock Status

QM controls stock by status:
- **Quality Inspection** — being tested, cannot be used
- **Unrestricted** — passed, free to use
- **Blocked** — failed, cannot be used

This is how SAP guarantees untested or failed material never reaches production or customers.`,
      keyConceptTitle: "QM = Inspection Lot → Record Results → Usage Decision",
      keyConceptBody: `Quality Management checks quality at goods receipt, during production, and before shipping. The core flow:
1. **Inspection Lot** created automatically (e.g. at MIGO) — stock held in *Quality Inspection*
2. **Record Results (QE51N)** — measure against the Inspection Plan's specifications
3. **Usage Decision (QA11)** — Accept (→ unrestricted) or Reject (→ blocked)

The key power: stock in Quality Inspection status **cannot be used** until it passes — guaranteeing untested material never reaches production or customers.`,
    },
  });

  const flowchart8_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson8_1.id },
    update: {},
    create: {
      lessonId: lesson8_1.id,
      title: "Quality Inspection Process",
      nodes: [
        { id: "gr", type: "default", position: { x: 60, y: 180 }, data: { label: "📦 Goods Receipt\nMIGO" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "lot", type: "default", position: { x: 240, y: 180 }, data: { label: "🔬 Inspection Lot\n(Auto-Created)" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "12px", width: 140, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "qinsp", type: "default", position: { x: 240, y: 40 }, data: { label: "⏳ Stock: Quality\nInspection (locked)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "results", type: "default", position: { x: 430, y: 180 }, data: { label: "📝 Record Results\nQE51N" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 140, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "ud", type: "default", position: { x: 620, y: 180 }, data: { label: "⚖️ Usage Decision\nQA11" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "12px", width: 140, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "accept", type: "default", position: { x: 810, y: 100 }, data: { label: "✅ Accept →\nUnrestricted" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "reject", type: "default", position: { x: 810, y: 260 }, data: { label: "❌ Reject →\nBlocked / Scrap" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px", width: 130, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "gr", target: "lot" },
        { id: "e2", source: "lot", target: "qinsp" },
        { id: "e3", source: "lot", target: "results" },
        { id: "e4", source: "results", target: "ud" },
        { id: "e5", source: "ud", target: "accept" },
        { id: "e6", source: "ud", target: "reject" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart8_1.id, nodeId: "gr", title: "Goods Receipt Triggers QM", description: "When material with QM active is received via MIGO, SAP automatically launches a quality inspection instead of moving stock straight to usable inventory.", tCode: "MIGO", tips: "QM is activated per material in the material master (QM view). No QM view = no inspection." },
      { flowchartId: flowchart8_1.id, nodeId: "lot", title: "Inspection Lot", description: "The document that represents one inspection. It links the material, the quantity, and the inspection plan with all characteristics to be checked.", tCode: "QA01 (Manual Create), QA32 (Lot Worklist)", tips: "Most inspection lots are created automatically by events like goods receipt or production confirmation." },
      { flowchartId: flowchart8_1.id, nodeId: "qinsp", title: "Quality Inspection Stock", description: "While being inspected, stock sits in 'Quality Inspection' status — visible in inventory but NOT available for production or sales until it passes.", tCode: "MMBE (Stock Overview)", tips: "This status is the heart of QM control: untested goods are physically counted but functionally locked." },
      { flowchartId: flowchart8_1.id, nodeId: "results", title: "Record Results (QE51N)", description: "The inspector enters measured values for each characteristic and compares them to the plan's tolerance limits. SAP flags any value outside spec.", tCode: "QE51N (Worklist), QE01 (Single)", tips: "Results can be entered as numeric measurements or simple accept/reject attribute checks." },
      { flowchartId: flowchart8_1.id, nodeId: "ud", title: "Usage Decision (QA11)", description: "The final verdict. Accepting moves stock to unrestricted use; rejecting moves it to blocked or triggers scrapping. The decision closes the inspection lot.", tCode: "QA11 (Single), QA32 (Mass)", tips: "The usage decision can automatically post stock between status types via inventory movements." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson8_1.id },
    update: {},
    create: {
      lessonId: lesson8_1.id,
      title: "Quality Management Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "When material with QM active is received via MIGO, what happens to the stock?",
            explanation: "SAP automatically creates an inspection lot and places the stock in 'Quality Inspection' status. It is counted in inventory but cannot be used for production or sales until it passes inspection.",
            options: {
              create: [
                { text: "It goes into Quality Inspection status and cannot be used until it passes", isCorrect: true },
                { text: "It is immediately available for production", isCorrect: false },
                { text: "It is automatically returned to the vendor", isCorrect: false },
                { text: "It is scrapped by default", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What are the two main outcomes of a Usage Decision (QA11)?",
            explanation: "The Usage Decision determines the batch's fate: Accept moves stock to unrestricted use (free to use), or Reject moves it to blocked/scrapped. This closes the inspection lot.",
            options: {
              create: [
                { text: "Accept (→ unrestricted use) or Reject (→ blocked/scrapped)", isCorrect: true },
                { text: "Pay the vendor or return the goods", isCorrect: false },
                { text: "Create a sales order or a purchase order", isCorrect: false },
                { text: "Promote or demote the inspector", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What does an Inspection Plan (QP01) define?",
            explanation: "An Inspection Plan defines WHAT to inspect and HOW — the characteristics to check (weight, length, purity), along with their specifications and tolerance limits. The inspection lot uses the plan to know what to measure.",
            options: {
              create: [
                { text: "The characteristics to inspect and their tolerance limits", isCorrect: true },
                { text: "The price to charge for inspected goods", isCorrect: false },
                { text: "The vendor's bank account details", isCorrect: false },
                { text: "The delivery schedule to the customer", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 8.2: Quality Notifications & Defects
  const lesson8_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: qmModule.id, slug: "quality-notifications-defects" } },
    update: {},
    create: {
      moduleId: qmModule.id,
      title: "Handling Defects & Complaints",
      slug: "quality-notifications-defects",
      order: 2,
      isPublished: true,
      estimatedMinutes: 10,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `A customer emails: "The laptops you shipped have a cracked screen defect." Meanwhile, on the factory floor, a worker notices a batch of bolts is the wrong size.

Both are quality problems — but how does the company track them, find the root cause, and prove to auditors that they fixed it? Verbal complaints get forgotten. SAP QM uses **Quality Notifications** to capture every defect, drive corrective action, and keep a permanent record.`,
      content: `## What is a Quality Notification?

A **Quality Notification (QM01)** is a structured record of a quality problem. It captures the defect, analyzes the cause, and tracks the actions taken to fix it.

## Three Notification Types

| Type | Code | Use Case |
|------|------|----------|
| **Customer Complaint** | Q1 | A customer reports a defect in delivered goods |
| **Complaint Against Vendor** | Q2 | Your company complains to a supplier |
| **Internal Problem** | Q3 | A defect found inside your own operations |

## The Structure of a Notification

### 1. Subject — What's Wrong
- Reference object (material, batch, customer, vendor)
- Defect description and coding (standardized defect categories)

### 2. Items & Defects
- Each specific defect found, with a defect code
- Quantity affected

### 3. Causes
- Root cause analysis — WHY did it happen?
- Coded causes enable trend reporting

### 4. Tasks & Activities
- **Tasks** — corrective actions to take (with responsible person + due date)
- **Activities** — what was actually done

## The 8D / Corrective Action Flow

1. **Record** the defect (QM01)
2. **Analyze** — identify the root cause
3. **Contain** — immediate action (quarantine bad stock)
4. **Correct** — fix the underlying process
5. **Verify & Close** — confirm the fix worked, close the notification (QM02)

## Why Coded Defects & Causes Matter

By using standardized **catalog codes** for defects and causes, SAP can run powerful analytics:
- "Which defect happens most often?"
- "Which vendor has the most quality issues?"
- "Are complaints trending up or down?"

This turns scattered complaints into actionable quality intelligence.

## Integration

- **SD** — customer complaints can link to returns and credit memos
- **MM** — vendor complaints can link to the purchase order and trigger vendor evaluation
- **PM** — quality notifications share the same notification framework as maintenance notifications

## Key T-Codes

| T-Code | Purpose |
|--------|---------|
| **QM01** | Create Quality Notification |
| **QM02** | Change / Process Notification |
| **QM03** | Display Notification |
| **QM10** | Notification List / Worklist |`,
      keyConceptTitle: "Quality Notification = Record → Analyze → Correct → Close",
      keyConceptBody: `A **Quality Notification (QM01)** structures a quality problem so it's never lost:
- **Types**: Q1 customer complaint, Q2 vendor complaint, Q3 internal defect
- **Structure**: subject → defects → causes → tasks/activities

Using **coded defects and causes** lets SAP analyze trends (top defects, worst vendors). It connects to SD (returns/credits), MM (vendor evaluation), and shares the notification framework with PM. Process and close in **QM02**.`,
    },
  });

  const flowchart8_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson8_2.id },
    update: {},
    create: {
      lessonId: lesson8_2.id,
      title: "Quality Notification Flow",
      nodes: [
        { id: "defect", type: "default", position: { x: 60, y: 180 }, data: { label: "⚠️ Defect / Complaint\nFound" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "create", type: "default", position: { x: 250, y: 180 }, data: { label: "📝 Create Notification\nQM01" }, style: { background: "#16A34A", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "analyze", type: "default", position: { x: 440, y: 180 }, data: { label: "🔍 Analyze Cause\nRoot-Cause Codes" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "tasks", type: "default", position: { x: 630, y: 180 }, data: { label: "✅ Tasks & Activities\nCorrective Action" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "close", type: "default", position: { x: 820, y: 180 }, data: { label: "🏁 Close\nQM02" }, style: { background: "#1E293B", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "analytics", type: "default", position: { x: 440, y: 320 }, data: { label: "📊 Trend Analytics\n(Top Defects / Vendors)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 180, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "defect", target: "create" },
        { id: "e2", source: "create", target: "analyze" },
        { id: "e3", source: "analyze", target: "tasks" },
        { id: "e4", source: "tasks", target: "close" },
        { id: "e5", source: "analyze", target: "analytics", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart8_2.id, nodeId: "create", title: "Create Notification (QM01)", description: "Records the quality problem with its type (Q1 customer, Q2 vendor, Q3 internal), the reference object (material/batch/customer), and the defect description.", tCode: "QM01 (Create), QM10 (Worklist)", tips: "Choosing the right notification type sets up the correct partners and follow-on options." },
      { flowchartId: flowchart8_2.id, nodeId: "analyze", title: "Cause Analysis", description: "Root-cause analysis using standardized catalog codes for defects and causes. Coding is what makes later trend reporting possible.", tCode: "QM02 (Causes tab)", tips: "Resist free-text only — coded causes let you answer 'what's our #1 recurring problem?'" },
      { flowchartId: flowchart8_2.id, nodeId: "tasks", title: "Tasks & Activities", description: "Tasks are corrective actions to be done (with owner and due date). Activities record what was actually performed. Together they drive and document the fix.", tCode: "QM02 (Tasks/Activities tabs)", tips: "Tasks have their own status — the notification isn't truly resolved until all tasks are completed." },
      { flowchartId: flowchart8_2.id, nodeId: "close", title: "Close Notification (QM02)", description: "Once corrective actions are verified effective, the notification is completed and closed, creating a permanent auditable record.", tCode: "QM02 → Complete", tips: "A closed notification stays in the system forever — essential for audits and ISO compliance." },
      { flowchartId: flowchart8_2.id, nodeId: "analytics", title: "Trend Analytics", description: "Because defects and causes are coded, SAP can report on the most frequent defects, worst-performing vendors, and whether quality is improving over time.", tCode: "QM reports, vendor evaluation", tips: "These analytics feed vendor evaluation scores in MM — repeat offenders get lower ratings." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson8_2.id },
    update: {},
    create: {
      lessonId: lesson8_2.id,
      title: "Quality Notifications Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the purpose of a Quality Notification in SAP QM?",
            explanation: "A Quality Notification (QM01) is a structured record of a quality problem. It captures the defect, supports root-cause analysis, tracks corrective actions, and creates a permanent auditable record.",
            options: {
              create: [
                { text: "To record a quality problem, analyze its cause, and track the fix", isCorrect: true },
                { text: "To create a sales order for a customer", isCorrect: false },
                { text: "To pay a vendor invoice", isCorrect: false },
                { text: "To schedule preventive maintenance", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Why is it important to use coded defects and causes (rather than just free text)?",
            explanation: "Coded defects and causes enable powerful trend analytics — SAP can report the most frequent defects, the worst-performing vendors, and whether quality is improving. Free text alone can't be analyzed this way.",
            options: {
              create: [
                { text: "Codes allow SAP to analyze trends like top defects and worst vendors", isCorrect: true },
                { text: "Codes are required to send the notification by email", isCorrect: false },
                { text: "Free text is illegal in SAP", isCorrect: false },
                { text: "Codes automatically pay compensation to customers", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "A customer reports a defect in goods they received. Which notification type is appropriate?",
            explanation: "A customer complaint about delivered goods uses notification type Q1. Q2 is for complaints your company makes against a vendor, and Q3 is for internal problems found within your own operations.",
            options: {
              create: [
                { text: "Q1 — Customer Complaint", isCorrect: true },
                { text: "Q2 — Complaint Against Vendor", isCorrect: false },
                { text: "Q3 — Internal Problem", isCorrect: false },
                { text: "PM01 — Breakdown", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 9: SAP WM (Warehouse Management)
  // ─────────────────────────────────────────────
  const wmModule = await prisma.module.upsert({
    where: { slug: "wm" },
    update: {},
    create: {
      title: "SAP WM/EWM",
      slug: "wm",
      description: "Learn how SAP manages warehouses down to the bin level — storage structure, putaway, picking, and stock movements.",
      color: "#84CC16",
      icon: "🏪",
      order: 9,
      isPublished: true,
    },
  });

  // LESSON 9.1: Warehouse Structure
  const lesson9_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: wmModule.id, slug: "warehouse-structure" } },
    update: {},
    create: {
      moduleId: wmModule.id,
      title: "How a Warehouse is Organized",
      slug: "warehouse-structure",
      order: 1,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Imagine a warehouse the size of three football fields, holding 50,000 different products. A worker is told "go get product X." Without a precise location, they'd wander for hours.

Basic inventory (in MM) only tells you "we have 500 units of product X in this storage location." But WHERE exactly? Which shelf? Which bin? SAP WM adds the missing detail — pinpointing the exact bin, so workers find anything in seconds and the warehouse runs like clockwork.`,
      content: `## MM Inventory vs WM: What's the Difference?

- **MM (Inventory Management)** knows the *quantity* in a storage location: "500 units in SLOC 0001."
- **WM (Warehouse Management)** knows the *exact bin*: "200 units in bin A-01-02, 300 units in bin B-05-11."

WM sits "underneath" MM, adding bin-level precision.

## The Warehouse Structure (Top to Bottom)

| Level | Meaning | Example |
|-------|---------|---------|
| **Warehouse Number** | The whole warehouse | 100 |
| **Storage Type** | An area/method | High rack, bulk, picking area |
| **Storage Section** | A subdivision of a type | Fast-movers vs slow-movers |
| **Storage Bin** | The exact shelf location | A-01-02 (aisle-stack-level) |
| **Quant** | Quantity of one material in one bin | 200 units in A-01-02 |

Think of it like an address: Warehouse → Storage Type → Section → Bin is like Country → City → Street → House Number.

## The Heart of WM: The Transfer Order

Almost every physical movement in WM is executed by a **Transfer Order (TO)**:
- It tells a worker: "Move X units from source bin to destination bin"
- Created from a **Transfer Requirement** (the need) or delivery
- T-Code: **LT01** (Create TO), **LT12** (Confirm TO)

## Two Core Movements

### Putaway
Storing received goods INTO bins:
- Goods arrive (MM goods receipt) → WM creates a transfer order → worker puts stock in a bin → confirm TO

### Picking
Removing goods FROM bins for an outbound delivery:
- Sales delivery created → WM creates a transfer order → worker picks from bins → confirm TO → goods issue

## WM vs EWM

- **WM** — the classic warehouse module inside ECC
- **EWM (Extended Warehouse Management)** — the modern, far more powerful successor in S/4HANA, handling complex automation, labor management, and robotics

SAP is moving everyone toward **EWM**, but the core concepts (storage types, bins, putaway, picking) carry over.

## Key T-Codes

| T-Code | Purpose |
|--------|---------|
| **LT01** | Create Transfer Order |
| **LT12** | Confirm Transfer Order |
| **LS24** | Display Stock per Material (bins) |
| **LX02** | Stock Overview by Storage Type |
| **LT0A** | Process Transfer Requirements |`,
      keyConceptTitle: "WM Adds Bin-Level Precision Below MM",
      keyConceptBody: `MM tracks quantity per storage location; **WM** tracks the *exact bin*. The structure goes Warehouse Number → Storage Type → Storage Section → Storage Bin → Quant (like a postal address).

The engine of WM is the **Transfer Order (LT01)** — it directs a worker to move stock from a source bin to a destination bin. The two core flows are **Putaway** (received goods → bins) and **Picking** (bins → outbound delivery). **EWM** is the modern S/4HANA successor with the same core concepts.`,
    },
  });

  const flowchart9_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson9_1.id },
    update: {},
    create: {
      lessonId: lesson9_1.id,
      title: "Warehouse Structure Hierarchy",
      nodes: [
        { id: "whnum", type: "default", position: { x: 320, y: 30 }, data: { label: "🏭 Warehouse Number\n100" }, style: { background: "#84CC16", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "12px 20px", width: 200 } },
        { id: "type", type: "default", position: { x: 320, y: 150 }, data: { label: "📂 Storage Type\nHigh Rack / Bulk / Picking" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px" } },
        { id: "section", type: "default", position: { x: 320, y: 260 }, data: { label: "🗂️ Storage Section\nFast / Slow Movers" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px" } },
        { id: "bin", type: "default", position: { x: 320, y: 370 }, data: { label: "📍 Storage Bin\nA-01-02" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px", fontWeight: "bold" } },
        { id: "quant", type: "default", position: { x: 320, y: 480 }, data: { label: "🔢 Quant\n200 units in A-01-02" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px" } },
        { id: "to", type: "default", position: { x: 640, y: 370 }, data: { label: "📋 Transfer Order\nLT01 (Move Stock)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "whnum", target: "type" },
        { id: "e2", source: "type", target: "section" },
        { id: "e3", source: "section", target: "bin" },
        { id: "e4", source: "bin", target: "quant" },
        { id: "e5", source: "to", target: "bin", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart9_1.id, nodeId: "whnum", title: "Warehouse Number", description: "The top level — represents one physical warehouse complex. All storage types, sections, and bins live under a warehouse number. It's linked to a plant + storage location in MM.", tCode: "Config: SPRO, LS01N (create bins)", tips: "One warehouse number can serve multiple MM storage locations." },
      { flowchartId: flowchart9_1.id, nodeId: "type", title: "Storage Type", description: "An area or storage method within the warehouse — high rack shelving, bulk floor storage, or a fast-pick area. Each storage type has its own putaway and picking strategy.", tCode: "LX02 (Stock by Storage Type)", tips: "Special storage types include 'goods receipt area' (902) and 'goods issue area' (916) — interim zones." },
      { flowchartId: flowchart9_1.id, nodeId: "bin", title: "Storage Bin", description: "The exact location — the warehouse's 'house number'. A bin code like A-01-02 typically encodes aisle, stack, and level. This is the precision MM alone can't provide.", tCode: "LS01N (Create Bin), LS24 (Stock per Material)", tips: "Good bin naming (aisle-stack-level) lets workers walk straight to any location." },
      { flowchartId: flowchart9_1.id, nodeId: "quant", title: "Quant", description: "A quant is the quantity of one material in one bin, with its own batch and stock status. If a material sits in three bins, it has three quants.", tCode: "LS24", tips: "The quant is WM's most granular stock record — the bin-level equivalent of an MM stock line." },
      { flowchartId: flowchart9_1.id, nodeId: "to", title: "Transfer Order (LT01)", description: "The instruction that executes a physical move — source bin to destination bin. Created for putaway, picking, and internal stock transfers. Confirmed (LT12) when the move is done.", tCode: "LT01 (Create), LT12 (Confirm), LT21 (Display)", tips: "Nothing moves in WM without a transfer order — it's the universal movement document." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson9_1.id },
    update: {},
    create: {
      lessonId: lesson9_1.id,
      title: "Warehouse Structure Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What extra detail does WM provide that MM Inventory Management does not?",
            explanation: "MM tracks quantity per storage location ('500 units in SLOC 0001'). WM adds bin-level precision — the EXACT shelf/bin where each unit sits ('200 in bin A-01-02'). WM sits beneath MM for granular location control.",
            options: {
              create: [
                { text: "The exact storage bin location of stock", isCorrect: true },
                { text: "The price the customer pays", isCorrect: false },
                { text: "The vendor's bank details", isCorrect: false },
                { text: "The employee's salary", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What is the correct top-to-bottom order of the WM storage structure?",
            explanation: "The hierarchy is Warehouse Number → Storage Type → Storage Section → Storage Bin → Quant. It works like a postal address narrowing from the whole warehouse down to the exact location and quantity.",
            options: {
              create: [
                { text: "Warehouse Number → Storage Type → Storage Section → Storage Bin → Quant", isCorrect: true },
                { text: "Storage Bin → Warehouse Number → Quant → Storage Type", isCorrect: false },
                { text: "Quant → Storage Bin → Warehouse Number → Storage Type", isCorrect: false },
                { text: "Storage Type → Quant → Warehouse Number → Storage Bin", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What document is used to physically move stock between bins in WM?",
            explanation: "The Transfer Order (LT01) is the universal movement document in WM. It directs a worker to move stock from a source bin to a destination bin, and is used for putaway, picking, and internal transfers. It's confirmed with LT12.",
            options: {
              create: [
                { text: "Transfer Order (LT01)", isCorrect: true },
                { text: "Purchase Order (ME21N)", isCorrect: false },
                { text: "Sales Order (VA01)", isCorrect: false },
                { text: "Vendor Invoice (FB60)", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 9.2: Putaway & Picking
  const lesson9_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: wmModule.id, slug: "putaway-and-picking" } },
    update: {},
    create: {
      moduleId: wmModule.id,
      title: "Putaway & Picking in Action",
      slug: "putaway-and-picking",
      order: 2,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "INTERMEDIATE",
      xpReward: 75,
      story: `Two things happen in every warehouse, all day long: goods come IN and goods go OUT. A truck delivers pallets that must be shelved (putaway). Orders come in and items must be gathered for shipping (picking).

Ravi, a new warehouse supervisor, wonders: how does SAP decide WHICH bin to store goods in, and which bins to pick from? Does someone choose manually every time? No — SAP uses smart strategies. This lesson shows how putaway and picking really work.`,
      content: `## The Two Universal Warehouse Flows

### Putaway (Goods IN)
Storing received goods into bins.

**The flow:**
1. Goods Receipt posted in MM (MIGO) against a PO
2. WM creates a **Transfer Requirement** (the need to put away)
3. A **Transfer Order** is created (LT01 / LT0A) — SAP proposes a destination bin
4. Worker moves goods to the bin
5. **Confirm** the TO (LT12) — quant now lives in the bin

### Picking (Goods OUT)
Removing goods from bins to fulfil a delivery.

**The flow:**
1. Outbound Delivery created in SD (VL01N)
2. WM creates a **Transfer Order** for picking — SAP proposes source bins
3. Worker picks items from the bins
4. **Confirm** the TO (LT12)
5. **Post Goods Issue** — stock leaves the warehouse

## Putaway Strategies — How SAP Picks a Destination Bin

| Strategy | Logic |
|----------|-------|
| **Fixed Bin** | Each material always goes to its assigned bin |
| **Next Empty Bin** | Use any open bin |
| **Addition to Existing Stock** | Top up a bin that already has this material |
| **Bulk Storage** | Floor storage in blocks |

## Picking Strategies — How SAP Picks a Source Bin

| Strategy | Logic |
|----------|-------|
| **FIFO** | First In, First Out — oldest stock first |
| **LIFO** | Last In, First Out |
| **Shelf Life (SLED)** | Pick stock expiring soonest first |
| **Fixed Bin** | Always pick from the assigned bin |

FIFO and Shelf Life are critical for food, pharma, and any perishable goods.

## Interim Storage Areas

Goods often pass through temporary "interim" storage types:
- **Goods Receipt Zone (902)** — where putaway starts
- **Goods Issue Zone (916)** — where picking ends
- **Differences (999)** — where stock discrepancies land

## Confirming the Transfer Order

Confirmation (LT12) is critical — it tells SAP the physical move actually happened. Until confirmed:
- Putaway: stock is "in transit," not yet in the final bin
- Picking: goods can't be issued

## Key T-Codes

| T-Code | Purpose |
|--------|---------|
| **LT01** | Create Transfer Order |
| **LT0A** | Create TO from Transfer Requirement |
| **LT03** | Create TO for outbound delivery (picking) |
| **LT12** | Confirm Transfer Order |
| **LT22** | Display TOs by Storage Type |`,
      keyConceptTitle: "Putaway Stores In; Picking Takes Out — Both via Transfer Orders",
      keyConceptBody: `Every warehouse runs two flows, both executed by **Transfer Orders**:
- **Putaway**: MM goods receipt → Transfer Requirement → TO (SAP proposes a destination bin) → confirm
- **Picking**: SD delivery → TO (SAP proposes source bins) → pick → confirm → goods issue

SAP chooses bins using **strategies**: putaway (fixed bin, next empty, bulk) and picking (FIFO, LIFO, shelf-life/SLED). **Confirming the TO (LT12)** is essential — it records that the physical move really happened.`,
    },
  });

  const flowchart9_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson9_2.id },
    update: {},
    create: {
      lessonId: lesson9_2.id,
      title: "Putaway & Picking Flows",
      nodes: [
        { id: "gr", type: "default", position: { x: 40, y: 60 }, data: { label: "📦 Goods Receipt\nMIGO (MM)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px", textAlign: "center" } },
        { id: "putto", type: "default", position: { x: 220, y: 60 }, data: { label: "📋 Putaway TO\nSAP proposes bin" }, style: { background: "#84CC16", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "binin", type: "default", position: { x: 410, y: 60 }, data: { label: "📍 Stock in Bin\n(Confirm LT12)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "deliv", type: "default", position: { x: 40, y: 280 }, data: { label: "🚚 Outbound Delivery\nVL01N (SD)" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "pickto", type: "default", position: { x: 230, y: 280 }, data: { label: "📋 Picking TO\nSAP proposes source bin" }, style: { background: "#84CC16", color: "#fff", borderRadius: "8px", padding: "10px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "binout", type: "default", position: { x: 430, y: 280 }, data: { label: "✋ Pick from Bin\n(Confirm LT12)" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "gi", type: "default", position: { x: 620, y: 280 }, data: { label: "📤 Goods Issue\nStock leaves" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "gr", target: "putto" },
        { id: "e2", source: "putto", target: "binin" },
        { id: "e3", source: "deliv", target: "pickto" },
        { id: "e4", source: "pickto", target: "binout" },
        { id: "e5", source: "binout", target: "gi" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart9_2.id, nodeId: "gr", title: "Goods Receipt (Putaway Trigger)", description: "When goods arrive against a PO and are posted in MIGO, WM is signaled to put the stock away. The goods first land in an interim goods-receipt zone.", tCode: "MIGO", tips: "Until putaway is confirmed, stock sits in the GR interim storage type (e.g. 902), not its final bin." },
      { flowchartId: flowchart9_2.id, nodeId: "putto", title: "Putaway Transfer Order", description: "WM creates a TO and uses the putaway strategy (fixed bin, next empty bin, bulk) to propose the best destination bin for the received goods.", tCode: "LT01, LT0A (from Transfer Requirement)", tips: "Fixed-bin strategy is common for fast-movers; next-empty-bin suits random storage warehouses." },
      { flowchartId: flowchart9_2.id, nodeId: "binin", title: "Confirm Putaway", description: "The worker moves goods to the bin and confirms the TO (LT12). The quant is now officially in its final bin and available per stock status.", tCode: "LT12 (Confirm)", tips: "Confirmation can be done via RF scanners on the warehouse floor for real-time accuracy." },
      { flowchartId: flowchart9_2.id, nodeId: "pickto", title: "Picking Transfer Order", description: "Triggered by an outbound delivery. WM uses the picking strategy (FIFO, LIFO, shelf-life) to propose which source bins to pick from.", tCode: "LT03 (from Delivery), LT01", tips: "FIFO and shelf-life (SLED) strategies are essential for perishable or regulated goods." },
      { flowchartId: flowchart9_2.id, nodeId: "gi", title: "Goods Issue", description: "After picking is confirmed, posting Goods Issue removes the stock from the warehouse and completes the outbound delivery, transferring ownership to the customer.", tCode: "VL02N (Post Goods Issue)", tips: "WM picking must be confirmed before goods issue can be posted on the delivery." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson9_2.id },
    update: {},
    create: {
      lessonId: lesson9_2.id,
      title: "Putaway & Picking Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the difference between Putaway and Picking in WM?",
            explanation: "Putaway stores received goods INTO bins (goods in), while Picking removes goods FROM bins for an outbound delivery (goods out). Both are executed using Transfer Orders.",
            options: {
              create: [
                { text: "Putaway stores goods into bins; Picking removes goods from bins", isCorrect: true },
                { text: "Putaway is for sales; Picking is for purchasing", isCorrect: false },
                { text: "They are the same process", isCorrect: false },
                { text: "Putaway is done by finance; Picking by HR", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which picking strategy ensures the OLDEST stock is shipped first — critical for perishable goods?",
            explanation: "FIFO (First In, First Out) picks the oldest stock first. Along with the Shelf Life (SLED) strategy, it's essential for food, pharma, and perishable goods to prevent expiry.",
            options: {
              create: [
                { text: "FIFO (First In, First Out)", isCorrect: true },
                { text: "LIFO (Last In, First Out)", isCorrect: false },
                { text: "Next Empty Bin", isCorrect: false },
                { text: "Bulk Storage", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "Why is confirming the Transfer Order (LT12) important?",
            explanation: "Confirmation tells SAP the physical move actually happened. Until confirmed, putaway stock is 'in transit' (not in its final bin) and picked goods cannot be issued. Confirmation keeps the system in sync with reality.",
            options: {
              create: [
                { text: "It records that the physical move actually happened, syncing the system", isCorrect: true },
                { text: "It pays the warehouse worker", isCorrect: false },
                { text: "It creates the purchase order", isCorrect: false },
                { text: "It is optional and has no real effect", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 10: SAP BASIS (System Administration)
  // ─────────────────────────────────────────────
  const basisModule = await prisma.module.upsert({
    where: { slug: "basis" },
    update: {},
    create: {
      title: "SAP BASIS",
      slug: "basis",
      description: "Learn the technical backbone of SAP — system architecture, user administration, and transports that keep SAP running.",
      color: "#64748B",
      icon: "⚙️",
      order: 10,
      isPublished: true,
    },
  });

  // LESSON 10.1: What BASIS Does & System Landscape
  const lesson10_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: basisModule.id, slug: "basis-system-landscape" } },
    update: {},
    create: {
      moduleId: basisModule.id,
      title: "BASIS & the System Landscape",
      slug: "basis-system-landscape",
      order: 1,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Every SAP module you've learned — FICO, MM, SD — runs on top of something invisible. When a consultant builds a new report, where do they test it? How does it safely reach the live system without breaking the company? Who creates user logins and decides what each person can see?

That invisible foundation is **BASIS**. If FICO and MM are the apps, BASIS is the operating system, the IT team, and the safety net — all rolled into one. Without BASIS, nothing else works.`,
      content: `## What is BASIS?

**BASIS** is SAP's technical administration layer. BASIS administrators don't configure business processes — they keep the SAP *system itself* running: installation, performance, users, security, and moving changes safely between systems.

Think of it as the foundation of a building: invisible, but everything stands on it.

## The 3-System Landscape (The Golden Rule)

SAP changes are NEVER made directly in the live system. Instead, a typical landscape has three systems:

| System | Name | Purpose |
|--------|------|---------|
| **DEV** | Development | Build and unit-test changes |
| **QAS** | Quality Assurance | Test changes with realistic data |
| **PRD** | Production | The live system real users work in |

Changes flow in ONE direction: **DEV → QAS → PRD**.

## Transports — Moving Changes Safely

A **Transport Request** is a container that carries changes (config, code, etc.) from one system to the next.
- Created automatically when you make a change in DEV
- Released, then imported into QAS for testing
- Finally imported into PRD
- Managed via the **Transport Management System (STMS)**

This is why you can't break production with an untested change — everything is tested in QAS first.

## The Client Concept

Within one SAP system, a **Client** is a self-contained business unit with its own data (3-digit number, e.g. 100, 200, 800).
- Client 100 might be "Training," Client 200 "Config"
- Master and transaction data are client-specific
- Repository objects (programs) are cross-client (shared)

## Core BASIS Responsibilities

| Area | What BASIS Does |
|------|-----------------|
| **User Admin** | Create users, assign roles (SU01, PFCG) |
| **Transports** | Move changes DEV→QAS→PRD (STMS) |
| **Monitoring** | Watch performance, logs, jobs (SM21, ST22) |
| **Background Jobs** | Schedule batch jobs (SM37, SM36) |
| **Performance** | Tune work processes, memory (SM50, ST02) |
| **Spool/Printing** | Manage print output (SP01) |

## Key Architecture: The 3-Tier Model

SAP uses a 3-tier architecture:
1. **Presentation Layer** — what the user sees (SAP GUI / Fiori)
2. **Application Layer** — where business logic runs (work processes)
3. **Database Layer** — where all data is stored (HANA, Oracle, etc.)

BASIS administrators primarily manage the application and database layers.`,
      keyConceptTitle: "BASIS = The Technical Foundation: Landscape, Transports, Users",
      keyConceptBody: `**BASIS** keeps the SAP system itself running (not business config). Three pillars:
- **3-System Landscape**: DEV → QAS → PRD. Changes always flow one way and are tested before going live.
- **Transports (STMS)**: containers that carry changes safely between systems.
- **Clients**: self-contained data units within a system (e.g. 100, 200).

BASIS also handles user admin (SU01/PFCG), monitoring (SM21, ST22), and background jobs (SM37). SAP runs on a **3-tier architecture**: Presentation → Application → Database.`,
    },
  });

  const flowchart10_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson10_1.id },
    update: {},
    create: {
      lessonId: lesson10_1.id,
      title: "SAP System Landscape & Transports",
      nodes: [
        { id: "dev", type: "default", position: { x: 60, y: 180 }, data: { label: "🛠️ DEV\nDevelopment\n(Build + Unit Test)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "qas", type: "default", position: { x: 320, y: 180 }, data: { label: "🧪 QAS\nQuality Assurance\n(Test w/ Real Data)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "prd", type: "default", position: { x: 580, y: 180 }, data: { label: "🚀 PRD\nProduction\n(Live Users)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "transport", type: "default", position: { x: 320, y: 40 }, data: { label: "📦 Transport Request\nSTMS" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px", width: 170, fontSize: "12px", textAlign: "center" } },
        { id: "users", type: "default", position: { x: 320, y: 320 }, data: { label: "👤 User Admin\nSU01 / PFCG (Roles)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px", width: 180, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "dev", target: "qas", label: "Transport" },
        { id: "e2", source: "qas", target: "prd", label: "Transport" },
        { id: "e3", source: "transport", target: "dev", type: "smoothstep" },
        { id: "e4", source: "transport", target: "qas", type: "smoothstep" },
        { id: "e5", source: "transport", target: "prd", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart10_1.id, nodeId: "dev", title: "Development System (DEV)", description: "Where all changes begin — config and custom code are built and unit-tested here. Every change is automatically captured in a transport request.", tCode: "SE80, SPRO, SE10 (Transport Org)", tips: "DEV usually has small test data. Never assume something works just because it ran in DEV." },
      { flowchartId: flowchart10_1.id, nodeId: "qas", title: "Quality Assurance (QAS)", description: "Changes are imported here and tested with realistic, production-like data. Integration testing and user acceptance testing happen in QAS before go-live.", tCode: "STMS (Import), SCC1 (Client Copy)", tips: "QAS is your safety net — catching issues here protects the live production system." },
      { flowchartId: flowchart10_1.id, nodeId: "prd", title: "Production System (PRD)", description: "The live system where real business users work every day. Changes only arrive via tested transports — never built directly here.", tCode: "STMS (Import), SM21 (Logs)", tips: "PRD changes are tightly controlled. Direct config in PRD is usually locked down." },
      { flowchartId: flowchart10_1.id, nodeId: "transport", title: "Transport Request (STMS)", description: "A container that bundles changes and moves them DEV→QAS→PRD in one direction. Managed by the Transport Management System (STMS).", tCode: "SE10, SE09, STMS", tips: "A transport has a 10-character ID like DEVK900123. Releasing it makes it ready to import to the next system." },
      { flowchartId: flowchart10_1.id, nodeId: "users", title: "User Administration", description: "BASIS creates user accounts (SU01) and assigns authorization roles (PFCG) that control exactly which transactions and data each user can access.", tCode: "SU01 (Users), PFCG (Roles), SU53 (Auth Check)", tips: "SU53 is the go-to transaction when a user gets an 'authorization missing' error." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson10_1.id },
    update: {},
    create: {
      lessonId: lesson10_1.id,
      title: "BASIS & Landscape Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "In a standard SAP landscape, in which direction do changes flow?",
            explanation: "Changes always flow DEV → QAS → PRD. They are built and unit-tested in Development, validated in Quality Assurance with realistic data, then transported to Production. They are never built directly in PRD.",
            options: {
              create: [
                { text: "DEV → QAS → PRD (Development to Quality to Production)", isCorrect: true },
                { text: "PRD → QAS → DEV", isCorrect: false },
                { text: "QAS → PRD → DEV", isCorrect: false },
                { text: "Changes are made directly in all three at once", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What is a Transport Request in SAP?",
            explanation: "A transport request is a container that bundles changes (config, code) and carries them from one system to the next (DEV→QAS→PRD). It's managed via STMS and ensures changes are tested before reaching production.",
            options: {
              create: [
                { text: "A container that carries changes between SAP systems", isCorrect: true },
                { text: "A truck that delivers physical goods", isCorrect: false },
                { text: "A type of financial document", isCorrect: false },
                { text: "A customer's shipping request", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "Which transaction codes does a BASIS admin use to create users and assign authorization roles?",
            explanation: "SU01 is used to create and maintain user accounts, and PFCG (the Profile Generator) is used to build and assign authorization roles that control what each user can access.",
            options: {
              create: [
                { text: "SU01 (users) and PFCG (roles)", isCorrect: true },
                { text: "VA01 and VF01", isCorrect: false },
                { text: "ME21N and MIGO", isCorrect: false },
                { text: "FB60 and F-53", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 10.2: Monitoring & Background Jobs
  const lesson10_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: basisModule.id, slug: "monitoring-background-jobs" } },
    update: {},
    create: {
      moduleId: basisModule.id,
      title: "Monitoring & Background Jobs",
      slug: "monitoring-background-jobs",
      order: 2,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "INTERMEDIATE",
      xpReward: 75,
      story: `It's 9 AM and users flood the helpdesk: "SAP is slow!" "I got a dump!" "My report didn't run last night!"

A BASIS admin must instantly know where to look. Is the system overloaded? Did a program crash? Did the scheduled payroll job fail? Guessing wastes hours. SAP provides a precise set of monitoring transactions — learn them, and you can diagnose almost any problem in minutes.`,
      content: `## Why Monitoring Matters

A live SAP system serves thousands of users. BASIS admins watch its health constantly to catch problems before they spread. SAP gives a toolbox of monitoring transactions, each for a specific purpose.

## The Essential Monitoring T-Codes

| T-Code | Watches | Use When |
|--------|---------|----------|
| **SM21** | System Log | Checking for system-wide errors |
| **ST22** | ABAP Dumps | A program crashed ("short dump") |
| **SM50** | Work Processes (local) | System feels slow, find stuck processes |
| **SM66** | Work Processes (global) | Slowness across all servers |
| **SM12** | Lock Entries | A record is "locked by another user" |
| **SM13** | Update Records | Updates stuck or failing |
| **ST02** | Memory / Buffers | Tuning performance |
| **AL08** | Logged-on Users | See who's currently active |

## Work Processes — How SAP Handles Requests

When a user runs a transaction, it's handled by a **work process**. Types:
- **DIA** (Dialog) — interactive user requests
- **BTC** (Background) — scheduled jobs
- **UPD** (Update) — database updates
- **ENQ** (Enqueue) — lock management
- **SPO** (Spool) — printing

If all dialog work processes are busy, users wait — a common cause of "SAP is slow."

## Background Jobs — Work That Runs on a Schedule

Many tasks shouldn't run interactively — they're huge or need to run overnight (payroll, billing runs, data loads). These are **Background Jobs**.

### Managing Jobs
| T-Code | Purpose |
|--------|---------|
| **SM36** | Define / Schedule a Job |
| **SM37** | Monitor Jobs (the job overview) |

### Job Statuses (SM37)
- **Scheduled** — defined but no start time
- **Released** — has a start condition
- **Ready** — waiting for a free background process
- **Active** — currently running
- **Finished** — completed successfully
- **Cancelled** — failed (investigate in the job log!)

## The Daily BASIS Health Check

A typical morning routine:
1. **SM21** — any serious system log errors overnight?
2. **ST22** — any dumps to investigate?
3. **SM37** — did all critical jobs (payroll, billing) finish?
4. **SM12** — any old locks stuck from crashed sessions?
5. **ST02** — buffer swaps / memory pressure?

## Connecting It Together

When a user says "my overnight report didn't run," you go to **SM37**, find the job, check its status. If "Cancelled," open the **job log** to see why — often pointing to an **ST22** dump or a data issue.`,
      keyConceptTitle: "Monitor Health (SM21/ST22/SM50) and Schedule Work (SM36/SM37)",
      keyConceptBody: `BASIS keeps SAP healthy with targeted monitoring transactions:
- **SM21** — system log (errors), **ST22** — ABAP dumps (crashes)
- **SM50/SM66** — work processes (find what's slow), **SM12** — locks
- **AL08** — who's logged on, **ST02** — memory/buffers

Big or scheduled tasks (payroll, billing) run as **Background Jobs**: define in **SM36**, monitor in **SM37**. A cancelled job's **job log** tells you why it failed. A daily health check chains these transactions together.`,
    },
  });

  const flowchart10_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson10_2.id },
    update: {},
    create: {
      lessonId: lesson10_2.id,
      title: "BASIS Daily Health Check",
      nodes: [
        { id: "start", type: "default", position: { x: 320, y: 20 }, data: { label: "🌅 Morning Health Check" }, style: { background: "#1E293B", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "12px 20px", width: 200 } },
        { id: "sm21", type: "default", position: { x: 60, y: 150 }, data: { label: "📜 SM21\nSystem Log Errors" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "st22", type: "default", position: { x: 250, y: 150 }, data: { label: "💥 ST22\nABAP Dumps" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "sm37", type: "default", position: { x: 440, y: 150 }, data: { label: "⏰ SM37\nBackground Jobs" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "sm12", type: "default", position: { x: 630, y: 150 }, data: { label: "🔒 SM12\nStuck Locks" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "joblog", type: "default", position: { x: 440, y: 290 }, data: { label: "🔎 Cancelled? → Job Log\nFind Root Cause" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px", width: 190, fontSize: "12px", textAlign: "center" } },
        { id: "fix", type: "default", position: { x: 440, y: 410 }, data: { label: "🛠️ Resolve & Reschedule\nSM36" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 180, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "start", target: "sm21" },
        { id: "e2", source: "start", target: "st22" },
        { id: "e3", source: "start", target: "sm37" },
        { id: "e4", source: "start", target: "sm12" },
        { id: "e5", source: "sm37", target: "joblog" },
        { id: "e6", source: "joblog", target: "fix" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart10_2.id, nodeId: "sm21", title: "SM21 — System Log", description: "The central system log. Records system-wide events and errors: failed updates, database issues, security alerts. First stop when something feels broadly wrong.", tCode: "SM21", tips: "Filter by time range to focus on the window when users reported problems." },
      { flowchartId: flowchart10_2.id, nodeId: "st22", title: "ST22 — ABAP Dumps", description: "Lists 'short dumps' — runtime crashes of ABAP programs. Each dump shows the error, the program, and the line, helping pinpoint code or data problems.", tCode: "ST22", tips: "A spike in dumps after a transport usually means the new code has a bug — check what changed." },
      { flowchartId: flowchart10_2.id, nodeId: "sm37", title: "SM37 — Job Monitoring", description: "The background job overview. Shows every job's status (Active, Finished, Cancelled). Critical for verifying overnight jobs like payroll and billing completed.", tCode: "SM37 (Monitor), SM36 (Schedule)", tips: "Check SM37 every morning for any 'Cancelled' critical jobs before users notice." },
      { flowchartId: flowchart10_2.id, nodeId: "sm12", title: "SM12 — Lock Entries", description: "Shows records currently locked by users. Crashed sessions can leave 'stuck' locks that block others with 'record locked by another user' errors.", tCode: "SM12", tips: "Only delete a lock after confirming the owning session is truly dead — deleting a live lock can corrupt data." },
      { flowchartId: flowchart10_2.id, nodeId: "joblog", title: "Job Log Investigation", description: "When a job shows 'Cancelled', opening its job log reveals the exact failure reason — often an ABAP dump, missing authorization, or bad input data.", tCode: "SM37 → Job Log", tips: "The job log often references an ST22 dump number — follow it to the root cause." },
      { flowchartId: flowchart10_2.id, nodeId: "fix", title: "Resolve & Reschedule (SM36)", description: "After fixing the root cause, the job is rescheduled in SM36 so the missed work (e.g. a billing run) completes. Recurring jobs can be set on periodic schedules.", tCode: "SM36", tips: "Define periodic jobs (daily/weekly) so routine work runs automatically without manual scheduling." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson10_2.id },
    update: {},
    create: {
      lessonId: lesson10_2.id,
      title: "Monitoring & Jobs Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "A user reports 'I got a short dump' when running a transaction. Which transaction does a BASIS admin check?",
            explanation: "ST22 lists ABAP short dumps (runtime crashes). It shows the error, the program, and the exact line, helping the admin pinpoint the cause of the crash.",
            options: {
              create: [
                { text: "ST22 (ABAP Dumps)", isCorrect: true },
                { text: "VA01 (Sales Order)", isCorrect: false },
                { text: "FS00 (G/L Accounts)", isCorrect: false },
                { text: "MIGO (Goods Movement)", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Why are large or recurring tasks like payroll runs executed as Background Jobs?",
            explanation: "Background jobs run without tying up an interactive session — ideal for huge or scheduled tasks (payroll, billing, data loads) that should run overnight. They're defined in SM36 and monitored in SM37.",
            options: {
              create: [
                { text: "They run on a schedule without tying up an interactive session", isCorrect: true },
                { text: "They are cheaper to license", isCorrect: false },
                { text: "They bypass all security checks", isCorrect: false },
                { text: "They can only run during business hours", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "In SM37, a critical overnight job shows status 'Cancelled'. What is the BEST next step?",
            explanation: "Open the job's log to find the exact failure reason — it often references an ST22 dump, a missing authorization, or bad data. Diagnosing the root cause comes before rescheduling the job.",
            options: {
              create: [
                { text: "Open the job log to find the root cause of the failure", isCorrect: true },
                { text: "Immediately delete the job and ignore it", isCorrect: false },
                { text: "Restart the entire production system", isCorrect: false },
                { text: "Reset every user's password", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 11: SAP ABAP (Programming Language)
  // ─────────────────────────────────────────────
  const abapModule = await prisma.module.upsert({
    where: { slug: "abap" },
    update: {},
    create: {
      title: "SAP ABAP",
      slug: "abap",
      description: "Learn SAP's own programming language — write reports, work with the Data Dictionary, and customize SAP behavior.",
      color: "#0EA5E9",
      icon: "💻",
      order: 11,
      isPublished: true,
    },
  });

  // LESSON 11.1: ABAP Fundamentals
  const lesson11_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-fundamentals" } },
    update: {},
    create: {
      moduleId: abapModule.id,
      title: "Your First ABAP Program",
      slug: "abap-fundamentals",
      order: 1,
      isPublished: true,
      estimatedMinutes: 12,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Standard SAP is powerful, but no two companies are identical. A client says: "We need a report listing all overdue customer invoices, grouped by region — SAP doesn't have exactly that."

Someone has to build it. That someone is an **ABAP developer**. ABAP is SAP's own programming language, and it's how nearly every custom report, form, and enhancement in SAP gets made. Let's write your first program and learn the building blocks.`,
      content: `## What is ABAP?

**ABAP** (Advanced Business Application Programming) is SAP's proprietary programming language. Almost all of SAP's own applications are written in ABAP, and developers use it to build custom reports, forms, interfaces, and enhancements.

It runs *inside* the SAP application server, close to the database — which makes it fast for processing business data.

## Where You Write ABAP

| T-Code | Tool |
|--------|------|
| **SE38** | ABAP Editor (write/run programs) |
| **SE80** | Object Navigator (all-in-one workbench) |
| **SE11** | Data Dictionary (define tables/structures) |
| **SE37** | Function Builder (function modules) |
| **SE24** | Class Builder (ABAP OO classes) |

Modern development increasingly uses **ABAP Development Tools (ADT)** in Eclipse.

## Your First Program

\`\`\`abap
REPORT z_hello_world.

DATA: lv_name TYPE string.
lv_name = 'SAPKing Learner'.

WRITE: / 'Hello,', lv_name.
\`\`\`

- **REPORT** declares an executable program (custom programs start with Z or Y)
- **DATA** declares a variable
- **WRITE** outputs to the screen; \`/\` means a new line

## Core ABAP Building Blocks

### Variables & Data Types
\`\`\`abap
DATA: lv_count TYPE i,           " integer
      lv_price TYPE p DECIMALS 2," packed decimal
      lv_text  TYPE string.      " text
\`\`\`

### Internal Tables — Working with Many Rows
An **internal table** holds multiple rows in memory — like a temporary table:
\`\`\`abap
DATA: lt_customers TYPE TABLE OF kna1,
      ls_customer  TYPE kna1.

SELECT * FROM kna1 INTO TABLE lt_customers.

LOOP AT lt_customers INTO ls_customer.
  WRITE: / ls_customer-kunnr, ls_customer-name1.
ENDLOOP.
\`\`\`

### Reading the Database — SELECT
\`\`\`abap
SELECT kunnr name1
  FROM kna1
  INTO TABLE @DATA(lt_data)
  WHERE land1 = 'IN'.
\`\`\`

## Control Logic

\`\`\`abap
IF lv_count > 100.
  WRITE: / 'Large order'.
ELSE.
  WRITE: / 'Small order'.
ENDIF.

DO 5 TIMES.
  WRITE: / sy-index.   " sy-index = loop counter
ENDDO.
\`\`\`

## System Fields (sy-)

SAP gives special fields starting with **sy-**:
- **sy-subrc** — return code (0 = success!) after most operations
- **sy-uname** — current user
- **sy-datum** — current date
- **sy-index** — loop counter

Checking **sy-subrc = 0** after a SELECT is one of the most important habits in ABAP.`,
      keyConceptTitle: "ABAP = SAP's Language for Custom Reports & Logic",
      keyConceptBody: `**ABAP** is SAP's built-in programming language, used to build custom reports, forms, and enhancements. You write it in **SE38** (editor) or **SE80** (workbench).

Key building blocks:
- **DATA** declares variables; custom programs start with **Z** or **Y**
- **Internal tables** hold many rows in memory; **SELECT ... INTO TABLE** reads the database
- **LOOP AT** iterates rows; **WRITE** outputs results
- **System fields (sy-)** like **sy-subrc** (0 = success) report status — always check it after a SELECT.`,
    },
  });

  const flowchart11_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson11_1.id },
    update: {},
    create: {
      lessonId: lesson11_1.id,
      title: "How an ABAP Report Runs",
      nodes: [
        { id: "write", type: "default", position: { x: 60, y: 180 }, data: { label: "✍️ Write Program\nSE38 (Z/Y name)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "declare", type: "default", position: { x: 250, y: 180 }, data: { label: "📦 Declare Data\nVariables + Tables" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "select", type: "default", position: { x: 440, y: 180 }, data: { label: "🗄️ SELECT\nRead Database" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "loop", type: "default", position: { x: 630, y: 180 }, data: { label: "🔁 LOOP AT\nProcess Each Row" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "output", type: "default", position: { x: 820, y: 180 }, data: { label: "🖥️ WRITE / ALV\nDisplay Output" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "subrc", type: "default", position: { x: 440, y: 320 }, data: { label: "✅ Check sy-subrc\n0 = Success" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px", width: 160, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "write", target: "declare" },
        { id: "e2", source: "declare", target: "select" },
        { id: "e3", source: "select", target: "loop" },
        { id: "e4", source: "loop", target: "output" },
        { id: "e5", source: "select", target: "subrc", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart11_1.id, nodeId: "write", title: "Write the Program (SE38)", description: "Custom programs are created in the ABAP Editor (SE38) or Object Navigator (SE80). Customer-created objects must start with Z or Y to avoid clashing with SAP's own code.", tCode: "SE38, SE80", tips: "The Z/Y naming convention is enforced in the 'customer namespace' — SAP objects start with other letters." },
      { flowchartId: flowchart11_1.id, nodeId: "declare", title: "Declare Data", description: "Variables (DATA), structures, and internal tables are declared to hold values in memory while the program runs. Types can be elementary (i, p, string) or based on dictionary tables.", tCode: "SE38, SE11 (for types)", tips: "Typing a variable like a dictionary table (TYPE kna1) automatically gives it all that table's fields." },
      { flowchartId: flowchart11_1.id, nodeId: "select", title: "SELECT from Database", description: "The SELECT statement reads data from database tables into variables or internal tables. WHERE clauses filter rows, just like SQL.", tCode: "SE16N (browse data), SE11", tips: "Always SELECT only the fields and rows you need — selecting * on a huge table kills performance." },
      { flowchartId: flowchart11_1.id, nodeId: "loop", title: "LOOP AT Internal Table", description: "LOOP AT iterates over each row of an internal table, letting you process or transform records one at a time before output.", tCode: "SE38", tips: "Inside the loop, sy-tabix holds the current row index — useful for numbering or conditional logic." },
      { flowchartId: flowchart11_1.id, nodeId: "output", title: "Output Results", description: "WRITE produces simple list output. Real-world reports use ALV (ABAP List Viewer) for sortable, filterable, professional grids.", tCode: "SE38, ALV (REUSE_ALV_GRID_DISPLAY)", tips: "Learn ALV early — almost every production report uses it instead of plain WRITE." },
      { flowchartId: flowchart11_1.id, nodeId: "subrc", title: "Check sy-subrc", description: "After operations like SELECT, sy-subrc returns 0 for success and non-zero for failure (e.g. no rows found). Checking it prevents acting on missing data.", tCode: "SE38", tips: "Forgetting to check sy-subrc is the #1 source of subtle ABAP bugs." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson11_1.id },
    update: {},
    create: {
      lessonId: lesson11_1.id,
      title: "ABAP Fundamentals Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "Why must customer-created ABAP programs start with the letter Z or Y?",
            explanation: "Z and Y are reserved for the 'customer namespace'. Starting custom objects with Z/Y ensures they never clash with SAP's standard objects and won't be overwritten by SAP upgrades.",
            options: {
              create: [
                { text: "Z/Y is the customer namespace — it prevents clashes with SAP's own objects", isCorrect: true },
                { text: "It makes the program run faster", isCorrect: false },
                { text: "It is required for the program to compile in any language", isCorrect: false },
                { text: "Z/Y programs don't need authorization checks", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What is an internal table in ABAP?",
            explanation: "An internal table holds multiple rows of data in memory while the program runs — like a temporary table. You typically SELECT database records INTO an internal table, then LOOP AT it to process each row.",
            options: {
              create: [
                { text: "A table that holds multiple rows of data in memory during execution", isCorrect: true },
                { text: "A permanent table stored in the database forever", isCorrect: false },
                { text: "A list of internal employees", isCorrect: false },
                { text: "A type of financial report", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "After a SELECT statement, what does checking sy-subrc = 0 tell you?",
            explanation: "sy-subrc is the system return code. After a SELECT, a value of 0 means the operation succeeded (rows were found). A non-zero value means it failed or returned no data. Checking it prevents acting on missing data.",
            options: {
              create: [
                { text: "The operation succeeded (e.g. rows were found)", isCorrect: true },
                { text: "The current user is an administrator", isCorrect: false },
                { text: "The program has a syntax error", isCorrect: false },
                { text: "The database is offline", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 11.2: The Data Dictionary
  const lesson11_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-data-dictionary" } },
    update: {},
    create: {
      moduleId: abapModule.id,
      title: "The ABAP Data Dictionary",
      slug: "abap-data-dictionary",
      order: 2,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "INTERMEDIATE",
      xpReward: 75,
      story: `Priyanka is told her FB60 vendor invoice gets stored "in table BSIK." She wonders: how does she even look inside a table? Where are SAP's table definitions kept? And when developers build a custom table, how do they make sure a field like "Currency" behaves the same everywhere?

The answer is the **Data Dictionary (DDIC)** — SAP's central catalog of every table, field, and data type. Understanding it turns SAP from a black box into something you can read.`,
      content: `## What is the Data Dictionary?

The **ABAP Data Dictionary (DDIC)** is SAP's central, system-wide repository of data definitions — every table, view, structure, and data type. It's the single source of truth for how data is shaped across all of SAP.

Main transaction: **SE11**. To browse data inside tables: **SE16N**.

## The Building Blocks (Bottom Up)

### 1. Domain
Defines the *technical* attributes of a value: data type, length, and allowed values.
- Example: a domain "WAERS" = CHAR length 5 (used for all currency codes)

### 2. Data Element
Adds the *semantic* meaning + labels on top of a domain.
- Example: data element "WAERS" = "Currency Key" with field labels
- This is why "Currency" looks and behaves the same in every SAP screen

### 3. Table / Structure
Fields are built from data elements:
- A **Transparent Table** stores data in the database (e.g. KNA1 = customers)
- A **Structure** defines a record layout but holds no data on its own

## Reading a Real SAP Table

| Famous Table | Holds |
|--------------|-------|
| **KNA1** | Customer master (general data) |
| **LFA1** | Vendor master (general data) |
| **MARA** | Material master (general data) |
| **VBAK / VBAP** | Sales order header / items |
| **EKKO / EKPO** | Purchase order header / items |
| **BKPF / BSEG** | Accounting document header / line items |

Notice the pattern: many SAP documents split into a **header table** and an **items table**.

## Keys & Relationships

- **Primary Key** — fields that uniquely identify a row (e.g. client + customer number in KNA1)
- **Foreign Key** — links one table to another (e.g. a sales order's customer links to KNA1)
- The first field of almost every table is **MANDT** (the client) — that's the client concept from BASIS!

## Other DDIC Objects

| Object | Purpose |
|--------|---------|
| **View** | Combines fields from multiple tables |
| **Search Help** | The dropdown (F4) value list on a field |
| **Lock Object** | Defines how records are locked (the SM12 locks) |
| **CDS View** | Modern, code-based views central to S/4HANA |

## Why Developers Live in the DDIC

Before writing a report that reads vendor invoices, a developer opens **SE11** to learn the table (BSIK), its fields, and its keys. The DDIC is the map; without it you're coding blind.`,
      keyConceptTitle: "The Data Dictionary (SE11) = SAP's Catalog of All Data",
      keyConceptBody: `The **Data Dictionary (DDIC)** is SAP's central definition of every table, field, and type — explored in **SE11** (and **SE16N** to view data).

It builds bottom-up: **Domain** (technical: type/length) → **Data Element** (meaning + labels) → **Table/Structure** (fields). This is why a field like "Currency" behaves identically everywhere.

Know the famous tables (KNA1 customers, MARA materials, BKPF/BSEG accounting). Most documents split into **header + items** tables, and nearly every table starts with **MANDT** (the client).`,
    },
  });

  const flowchart11_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson11_2.id },
    update: {},
    create: {
      lessonId: lesson11_2.id,
      title: "Data Dictionary Building Blocks",
      nodes: [
        { id: "domain", type: "default", position: { x: 320, y: 30 }, data: { label: "🔧 Domain\nType + Length + Values" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px", fontWeight: "bold" } },
        { id: "delement", type: "default", position: { x: 320, y: 150 }, data: { label: "🏷️ Data Element\nMeaning + Field Labels" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px" } },
        { id: "table", type: "default", position: { x: 320, y: 270 }, data: { label: "🗄️ Table / Structure\nFields (e.g. KNA1)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px", fontWeight: "bold" } },
        { id: "se11", type: "default", position: { x: 60, y: 150 }, data: { label: "🛠️ SE11\nDefine / View Objects" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 170, fontSize: "12px" } },
        { id: "se16", type: "default", position: { x: 60, y: 270 }, data: { label: "🔍 SE16N\nBrowse Table Data" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 170, fontSize: "12px" } },
        { id: "mandt", type: "default", position: { x: 600, y: 270 }, data: { label: "🔑 MANDT (Client)\nFirst Key Field" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 170, fontSize: "12px" } },
      ],
      edges: [
        { id: "e1", source: "domain", target: "delement" },
        { id: "e2", source: "delement", target: "table" },
        { id: "e3", source: "se11", target: "delement", type: "smoothstep" },
        { id: "e4", source: "se16", target: "table", type: "smoothstep" },
        { id: "e5", source: "mandt", target: "table", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart11_2.id, nodeId: "domain", title: "Domain", description: "The lowest level — defines purely technical attributes: data type, length, decimals, and optionally a fixed list of allowed values. Reusable across many fields.", tCode: "SE11 (Domain)", tips: "A single domain (e.g. for currency) is reused by countless data elements, ensuring consistency." },
      { flowchartId: flowchart11_2.id, nodeId: "delement", title: "Data Element", description: "Sits on top of a domain and adds business meaning plus the field labels (short/medium/long) shown on screens. This is the semantic layer.", tCode: "SE11 (Data Element)", tips: "Hovering F1 on any SAP field shows its data element — a quick way to trace a field's definition." },
      { flowchartId: flowchart11_2.id, nodeId: "table", title: "Transparent Table", description: "Stores actual data rows in the database. Each column is typed by a data element. Examples: KNA1 (customers), MARA (materials), BKPF (accounting headers).", tCode: "SE11 (Table), SE16N (Data)", tips: "'Transparent' means there's a 1:1 match between the SAP table and the underlying database table." },
      { flowchartId: flowchart11_2.id, nodeId: "se11", title: "SE11 — Data Dictionary", description: "The transaction to create and inspect all DDIC objects: tables, structures, views, data elements, domains, search helps, and lock objects.", tCode: "SE11", tips: "Use SE11 to read a table's field list and keys before writing any SELECT against it." },
      { flowchartId: flowchart11_2.id, nodeId: "mandt", title: "MANDT — The Client Field", description: "Almost every SAP table's first key field is MANDT, the client. It keeps each client's data separate within the same system — the client concept from BASIS made physical.", tCode: "SE11, SE16N", tips: "ABAP automatically filters by the logged-on client, so you rarely code MANDT in WHERE clauses." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson11_2.id },
    update: {},
    create: {
      lessonId: lesson11_2.id,
      title: "Data Dictionary Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the correct bottom-up order of these Data Dictionary building blocks?",
            explanation: "The DDIC builds up: Domain (technical type/length) → Data Element (business meaning + labels) → Table/Structure (fields built from data elements). This layering ensures fields behave consistently across SAP.",
            options: {
              create: [
                { text: "Domain → Data Element → Table", isCorrect: true },
                { text: "Table → Domain → Data Element", isCorrect: false },
                { text: "Data Element → Table → Domain", isCorrect: false },
                { text: "Table → Data Element → Domain", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Many SAP documents (sales orders, purchase orders, accounting docs) are stored across how many tables, and why?",
            explanation: "They typically split into TWO tables: a header table and an items table (e.g. VBAK/VBAP for sales orders, EKKO/EKPO for purchase orders, BKPF/BSEG for accounting). The header holds document-level data, the items table holds each line.",
            options: {
              create: [
                { text: "Two — a header table and an items table", isCorrect: true },
                { text: "One giant table for everything", isCorrect: false },
                { text: "Ten tables, one per field", isCorrect: false },
                { text: "Zero — documents aren't stored in tables", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What is the MANDT field that appears as the first key field of almost every SAP table?",
            explanation: "MANDT is the client field. It keeps each client's data separate within the same SAP system — the physical implementation of the client concept. ABAP automatically filters by the logged-on client.",
            options: {
              create: [
                { text: "The client — it separates each client's data within one system", isCorrect: true },
                { text: "The material number", isCorrect: false },
                { text: "The mandatory date field", isCorrect: false },
                { text: "The manager's user ID", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 12: SAP Fiori (Modern UI)
  // ─────────────────────────────────────────────
  const fioriModule = await prisma.module.upsert({
    where: { slug: "fiori" },
    update: {},
    create: {
      title: "SAP Fiori",
      slug: "fiori",
      description: "Learn SAP's modern user experience — the Fiori Launchpad, app types, and how Fiori replaced the classic SAP GUI.",
      color: "#DB2777",
      icon: "🎨",
      order: 12,
      isPublished: true,
    },
  });

  // LESSON 12.1: Fiori & the Launchpad
  const lesson12_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-launchpad" } },
    update: {},
    create: {
      moduleId: fioriModule.id,
      title: "Fiori & the Launchpad",
      slug: "fiori-launchpad",
      order: 1,
      isPublished: true,
      estimatedMinutes: 10,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `A new employee logs into SAP for the first time, expecting the grey, menu-heavy SAP GUI their parents complained about. Instead, they see a clean screen of colorful tiles — like a phone's home screen — that even shows live numbers ("23 orders to approve"). They tap a tile and a friendly web app opens.

That's **SAP Fiori**: SAP's modern, app-like experience that's replacing the old SAP GUI. This lesson explains what Fiori is and how the Launchpad works.`,
      content: `## What is SAP Fiori?

**SAP Fiori** is SAP's modern user experience (UX) — a design system and a set of web apps that replace the classic, dense SAP GUI. Fiori apps are:
- **Role-based** — you see only the apps relevant to your job
- **Responsive** — work on desktop, tablet, and phone
- **Simple** — focused on one task, with a clean look
- **Consistent** — every app follows the same design language

## The Old vs The New

| Classic SAP GUI | SAP Fiori |
|-----------------|-----------|
| Transaction codes (VA01) | Apps with friendly names |
| Dense, grey screens | Clean, colorful, task-focused |
| Desktop only | Any device |
| One-size-fits-all menu | Role-based tiles |

## The Fiori Launchpad — Your Home Base

The **Fiori Launchpad (FLP)** is the single entry point — a web home page showing **tiles**, each launching an app.
- Tiles are grouped into pages/groups by role
- **Dynamic tiles** show live KPIs (e.g. "5 Purchase Orders to Approve")
- A central **search** finds apps and data
- Launched via T-code **/UI2/FLP** or a browser URL

## The Three Fiori App Types

| Type | What It Does | Example |
|------|--------------|---------|
| **Transactional** | Create/change data (do work) | Create Sales Order |
| **Analytical** | Show KPIs and insights | Cash flow dashboard |
| **Fact Sheet** | Display a 360° view of one object | View a customer's full profile |

## How Fiori Works (Simple View)

1. **Browser** loads the Launchpad
2. Apps are built with **SAPUI5** (SAP's JavaScript UI framework)
3. Apps call the backend through **OData services** (web APIs)
4. The backend (S/4HANA) returns the data

So Fiori is essentially: a web front-end (SAPUI5) talking to SAP via OData.

## Why Fiori Matters

- SAP GUI is being phased out; **S/4HANA leads with Fiori**
- Better adoption — apps that feel modern are actually used
- Mobile access — approve a PO from your phone
- One consistent experience across all SAP areas`,
      keyConceptTitle: "Fiori = SAP's Modern, Role-Based, App-Like Experience",
      keyConceptBody: `**SAP Fiori** replaces the classic SAP GUI with clean, responsive, role-based web apps. The **Fiori Launchpad (FLP)** is the home screen of **tiles** — some dynamic, showing live KPIs.

Three app types: **Transactional** (do work), **Analytical** (show KPIs), and **Fact Sheet** (360° view of one object).

Under the hood: apps are built in **SAPUI5** (JavaScript) and talk to the backend via **OData** services. S/4HANA leads with Fiori as its primary UX.`,
    },
  });

  const flowchart12_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson12_1.id },
    update: {},
    create: {
      lessonId: lesson12_1.id,
      title: "Fiori Architecture & Launchpad",
      nodes: [
        { id: "user", type: "default", position: { x: 60, y: 180 }, data: { label: "👤 User\n(Any Device)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "12px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "flp", type: "default", position: { x: 240, y: 180 }, data: { label: "🚀 Fiori Launchpad\nTiles (Home)" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "app", type: "default", position: { x: 430, y: 180 }, data: { label: "📱 Fiori App\nSAPUI5 (JavaScript)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "odata", type: "default", position: { x: 630, y: 180 }, data: { label: "🔌 OData Service\nWeb API" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "backend", type: "default", position: { x: 820, y: 180 }, data: { label: "🗄️ S/4HANA Backend\nData + Logic" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "types", type: "default", position: { x: 430, y: 320 }, data: { label: "🧩 App Types: Transactional /\nAnalytical / Fact Sheet" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 220, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "user", target: "flp" },
        { id: "e2", source: "flp", target: "app" },
        { id: "e3", source: "app", target: "odata" },
        { id: "e4", source: "odata", target: "backend" },
        { id: "e5", source: "app", target: "types", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart12_1.id, nodeId: "flp", title: "Fiori Launchpad (FLP)", description: "The single web entry point to all Fiori apps. Shows role-based tiles grouped into pages. Dynamic tiles display live KPIs like 'Orders to Approve: 5'.", tCode: "/UI2/FLP", tips: "What tiles a user sees is driven by their assigned Fiori catalogs and groups (role-based)." },
      { flowchartId: flowchart12_1.id, nodeId: "app", title: "Fiori App (SAPUI5)", description: "Each app is built with SAPUI5, SAP's HTML5/JavaScript UI framework. Apps are focused, responsive, and follow the Fiori design guidelines for a consistent look.", tCode: "SE80 / BAS (Business Application Studio)", tips: "SAPUI5 is the on-premise version; the cloud development edition is called OpenUI5/SAP UI5." },
      { flowchartId: flowchart12_1.id, nodeId: "odata", title: "OData Service", description: "The web API layer. Fiori apps don't talk to the database directly — they call OData services that expose backend data and logic over HTTP in a standard format.", tCode: "/IWFND/MAINT_SERVICE (Gateway)", tips: "OData is REST-based; understanding it is key to connecting any Fiori front-end to SAP." },
      { flowchartId: flowchart12_1.id, nodeId: "backend", title: "S/4HANA Backend", description: "Where the real business data and logic live. The OData service retrieves and updates data here, often through modern CDS views.", tCode: "S/4HANA", tips: "Fiori + CDS views + OData is the standard modern SAP application stack." },
      { flowchartId: flowchart12_1.id, nodeId: "types", title: "The Three App Types", description: "Transactional apps create/change data; Analytical apps show KPIs and dashboards; Fact Sheets give a 360° view of a single object (like one customer).", tCode: "Fiori Apps Library (reference)", tips: "The SAP Fiori Apps Library lists every standard app, its type, and its required backend components." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson12_1.id },
    update: {},
    create: {
      lessonId: lesson12_1.id,
      title: "Fiori & Launchpad Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the SAP Fiori Launchpad?",
            explanation: "The Fiori Launchpad (FLP) is the single web entry point to all Fiori apps — a home page of role-based tiles, some dynamic with live KPIs. It's launched via /UI2/FLP or a browser URL.",
            options: {
              create: [
                { text: "The single web home page of tiles that launches all Fiori apps", isCorrect: true },
                { text: "A programming language for SAP", isCorrect: false },
                { text: "A type of financial report", isCorrect: false },
                { text: "The database that stores SAP data", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which technology do Fiori apps use to communicate with the SAP backend?",
            explanation: "Fiori apps (built in SAPUI5) call the backend through OData services — REST-based web APIs that expose SAP data and logic over HTTP. Apps never talk to the database directly.",
            options: {
              create: [
                { text: "OData services (web APIs)", isCorrect: true },
                { text: "Direct database SQL from the browser", isCorrect: false },
                { text: "Physical transport requests", isCorrect: false },
                { text: "Email attachments", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "An app that shows a dashboard of KPIs and insights (rather than creating data) is which Fiori app type?",
            explanation: "Analytical apps display KPIs, charts, and insights. Transactional apps create/change data, and Fact Sheets show a 360° view of a single object. The dashboard described is Analytical.",
            options: {
              create: [
                { text: "Analytical", isCorrect: true },
                { text: "Transactional", isCorrect: false },
                { text: "Fact Sheet", isCorrect: false },
                { text: "Transport", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 12.2: SAPUI5 & OData Basics
  const lesson12_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: fioriModule.id, slug: "sapui5-odata-basics" } },
    update: {},
    create: {
      moduleId: fioriModule.id,
      title: "SAPUI5 & OData Basics",
      slug: "sapui5-odata-basics",
      order: 2,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "INTERMEDIATE",
      xpReward: 75,
      story: `Rahul wants to build a custom Fiori app that lists open sales orders. He keeps hearing two words: "SAPUI5" and "OData." He's overwhelmed — is this web development? SAP development? Both?

The good news: the concepts are simpler than they sound. SAPUI5 builds the screen; OData feeds it data. Once you see how the two fit together, building Fiori apps stops feeling like magic.`,
      content: `## The Two Halves of Every Fiori App

Every Fiori app is two cooperating pieces:
1. **SAPUI5** — the front-end (what the user sees and clicks)
2. **OData** — the data pipe (how the app gets/sends data to SAP)

## SAPUI5 — The Front-End Framework

**SAPUI5** is SAP's JavaScript/HTML5 framework for building web UIs. It follows the **MVC** pattern:

| Part | Role | File |
|------|------|------|
| **View** | The layout (buttons, tables, inputs) | XML view |
| **Controller** | The logic (what happens on click) | JavaScript |
| **Model** | The data the view binds to | JSON / OData model |

### Data Binding — The Magic
Instead of manually filling fields, SAPUI5 **binds** UI controls to a model. When the data changes, the screen updates automatically. Example: bind a table to a list of sales orders, and the table fills itself.

## OData — The Data Pipe

**OData** (Open Data Protocol) is a standardized, REST-based web protocol for exposing data. It speaks plain HTTP:

| HTTP Verb | OData Action | Meaning |
|-----------|--------------|---------|
| **GET** | Read | Fetch sales orders |
| **POST** | Create | Create a new order |
| **PUT/PATCH** | Update | Change an order |
| **DELETE** | Delete | Remove an order |

An OData service exposes **Entity Sets** (collections, like "SalesOrderSet") that the app reads and writes.

## How It Fits Together

1. User opens the app (SAPUI5 loads in the browser)
2. The app's **OData model** sends a **GET** request to the service
3. SAP returns the data (e.g. a list of orders) as JSON/XML
4. SAPUI5 **binds** that data to a table → the screen fills
5. User edits and saves → app sends **POST/PUT** back through OData

## Where OData Services Come From

- Built in the backend (SAP Gateway) often on top of **CDS views**
- Registered/activated via **/IWFND/MAINT_SERVICE**
- Modern approach: **RAP** (ABAP RESTful Application Programming model) generates OData from CDS

## The Beginner's Mental Model

> **SAPUI5 = the form. OData = the waiter** carrying data between the form and the SAP kitchen (backend).

Master these two and the rest of Fiori development is detail.`,
      keyConceptTitle: "SAPUI5 Builds the Screen; OData Carries the Data",
      keyConceptBody: `Every Fiori app has two halves:
- **SAPUI5** — the JavaScript/HTML5 front-end, structured as **MVC** (View = layout, Controller = logic, Model = data). Its superpower is **data binding** — bind a control to a model and the screen updates automatically.
- **OData** — the REST web protocol that carries data to/from SAP using HTTP verbs (GET read, POST create, PUT update, DELETE). It exposes **Entity Sets** like "SalesOrderSet".

Mental model: *SAPUI5 is the form; OData is the waiter* carrying data to the SAP backend (often via CDS views).`,
    },
  });

  const flowchart12_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson12_2.id },
    update: {},
    create: {
      lessonId: lesson12_2.id,
      title: "SAPUI5 + OData Data Flow",
      nodes: [
        { id: "view", type: "default", position: { x: 60, y: 60 }, data: { label: "🖼️ View (XML)\nLayout / Controls" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "controller", type: "default", position: { x: 60, y: 200 }, data: { label: "🎮 Controller (JS)\nLogic / Events" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "model", type: "default", position: { x: 60, y: 340 }, data: { label: "📊 Model\n(OData / JSON Data)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "odata", type: "default", position: { x: 320, y: 200 }, data: { label: "🔌 OData Service\nGET / POST / PUT / DELETE" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 200, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "cds", type: "default", position: { x: 580, y: 200 }, data: { label: "🧱 CDS View\nData Definition" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "db", type: "default", position: { x: 800, y: 200 }, data: { label: "🗄️ HANA Database" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "view", target: "controller" },
        { id: "e2", source: "controller", target: "model" },
        { id: "e3", source: "model", target: "odata", label: "binds to" },
        { id: "e4", source: "odata", target: "cds" },
        { id: "e5", source: "cds", target: "db" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart12_2.id, nodeId: "view", title: "View (XML)", description: "Defines the app's layout — the tables, forms, buttons, and inputs the user sees. In SAPUI5, views are usually written declaratively in XML.", tCode: "BAS / SE80", tips: "XML views are preferred over JS views because they cleanly separate layout from logic." },
      { flowchartId: flowchart12_2.id, nodeId: "controller", title: "Controller (JavaScript)", description: "Holds the app's logic — what happens when a user clicks a button, navigates, or saves. Each view has a matching controller.", tCode: "BAS / SE80", tips: "Keep controllers lean; heavy business logic belongs in the backend, not the front-end." },
      { flowchartId: flowchart12_2.id, nodeId: "model", title: "Model & Data Binding", description: "The model holds the data. SAPUI5 binds UI controls to the model so the screen automatically reflects data changes — no manual field-filling.", tCode: "SAPUI5 (sap.ui.model.odata)", tips: "An OData model auto-handles reading and writing to the service — binding does the heavy lifting." },
      { flowchartId: flowchart12_2.id, nodeId: "odata", title: "OData Service", description: "The REST web API connecting the app to SAP. Uses standard HTTP verbs: GET (read), POST (create), PUT/PATCH (update), DELETE. Exposes Entity Sets like SalesOrderSet.", tCode: "/IWFND/MAINT_SERVICE", tips: "You can test an OData service in a browser by appending the entity set to its URL — great for debugging." },
      { flowchartId: flowchart12_2.id, nodeId: "cds", title: "CDS View", description: "Core Data Services views define and shape data in the backend using SQL-like syntax. Modern OData services are often generated directly from CDS views.", tCode: "ADT / SE80", tips: "CDS + OData + Fiori is the standard S/4HANA development stack — learn CDS to go deep." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson12_2.id },
    update: {},
    create: {
      lessonId: lesson12_2.id,
      title: "SAPUI5 & OData Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "In the SAPUI5 MVC pattern, what is the role of the View?",
            explanation: "In MVC, the View defines the layout — the tables, forms, buttons, and inputs the user sees (usually written in XML). The Controller holds the logic, and the Model holds the data.",
            options: {
              create: [
                { text: "It defines the layout — the controls the user sees", isCorrect: true },
                { text: "It stores all the application data permanently", isCorrect: false },
                { text: "It connects directly to the HANA database", isCorrect: false },
                { text: "It schedules background jobs", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which OData/HTTP verb is used to READ data (e.g. fetch a list of sales orders)?",
            explanation: "GET reads data. The others map as: POST creates, PUT/PATCH updates, and DELETE removes. OData uses these standard HTTP verbs to expose SAP data over the web.",
            options: {
              create: [
                { text: "GET", isCorrect: true },
                { text: "POST", isCorrect: false },
                { text: "DELETE", isCorrect: false },
                { text: "PUT", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What is SAPUI5's 'data binding'?",
            explanation: "Data binding links UI controls to a model so the screen automatically reflects data changes (and vice versa). Bind a table to a list of orders and it fills itself — no manual field-by-field population.",
            options: {
              create: [
                { text: "Linking UI controls to a model so the screen updates automatically", isCorrect: true },
                { text: "Physically stapling printed reports together", isCorrect: false },
                { text: "Encrypting data before sending it", isCorrect: false },
                { text: "Locking a database record", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 13: SAP S/4HANA
  // ─────────────────────────────────────────────
  const s4Module = await prisma.module.upsert({
    where: { slug: "s4hana" },
    update: {},
    create: {
      title: "SAP S/4HANA",
      slug: "s4hana",
      description: "Understand SAP's next-generation ERP — the HANA in-memory database, the simplified data model, and why everyone is migrating.",
      color: "#1E40AF",
      icon: "⚡",
      order: 13,
      isPublished: true,
    },
  });

  // LESSON 13.1: What is S/4HANA?
  const lesson13_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: s4Module.id, slug: "what-is-s4hana" } },
    update: {},
    create: {
      moduleId: s4Module.id,
      title: "What is S/4HANA?",
      slug: "what-is-s4hana",
      order: 1,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Every SAP job posting in 2024 mentions it: "S/4HANA experience required." Companies are spending millions to migrate to it. But Anjali, learning SAP, keeps wondering: what actually IS S/4HANA? Is it a new module? A new database? A whole new SAP?

The short answer: S/4HANA is SAP's new-generation ERP, rebuilt to run on the lightning-fast HANA database. It's not a small upgrade — it's the future of SAP, and understanding why is essential for any SAP career.`,
      content: `## The Name, Decoded

**S/4HANA** = **S**AP Business Suite **4** (the 4th generation) for **HANA**.
- It's the successor to the older **SAP ECC** (ERP Central Component)
- The "HANA" part means it's built specifically for the SAP HANA database

## What is HANA?

**HANA** (High-performance ANalytic Appliance) is SAP's **in-memory** database.

| Traditional Database | SAP HANA |
|----------------------|----------|
| Data stored on disk | Data held in RAM (memory) |
| Row-based storage | Column-based storage |
| Reports run slowly | Reports run in seconds |
| Separate system for analytics | Transactions + analytics together |

Because data lives in fast memory and is stored in **columns** (great for aggregating), HANA can crunch huge reports instantly — no overnight batch needed.

## The Big Simplification

S/4HANA dramatically simplified SAP's data model. The most famous example:

### The Universal Journal (Table ACDOCA)
In old SAP (ECC), finance data was spread across many tables (totals tables, index tables, separate FI and CO tables). S/4HANA merged them into ONE table: **ACDOCA**.
- FI and CO are unified — no more reconciliation between them
- One line of truth for every financial posting
- Real-time financial reporting

This is why S/4HANA finance is considered a leap forward.

## What Else Changed

| Area | ECC | S/4HANA |
|------|-----|---------|
| UI | SAP GUI | Fiori-first |
| Database | Any (Oracle, etc.) | HANA only |
| Finance tables | Many | One (ACDOCA) |
| Material number | 18 chars | 40 chars |
| Customer/Vendor | Separate masters | Business Partner (BP) |
| MRP | Classic | Real-time (live MRP) |

## Deployment Options

| Option | Meaning |
|--------|---------|
| **On-Premise** | You run it in your own data center, full control |
| **Private Cloud** | Hosted, but your own dedicated system (RISE with SAP) |
| **Public Cloud** | Shared, standardized, fastest to adopt |

## Why Companies Are Migrating

- SAP will **end mainstream support for ECC in 2027** (extended to 2030 for some)
- Real-time insights instead of overnight reports
- Simpler, faster, modern UX (Fiori)
- A platform ready for AI and advanced analytics`,
      keyConceptTitle: "S/4HANA = SAP's New ERP Built for the In-Memory HANA Database",
      keyConceptBody: `**S/4HANA** is the successor to **SAP ECC**, built exclusively for the **HANA** in-memory, column-based database — so reports run in seconds.

Its signature simplification is the **Universal Journal (table ACDOCA)**, which merges FI and CO into one line of truth for real-time finance. It's **Fiori-first**, uses the unified **Business Partner** for customers/vendors, and comes in on-premise, private cloud, and public cloud flavours. With ECC support ending (2027/2030), migration is a top industry priority.`,
    },
  });

  const flowchart13_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson13_1.id },
    update: {},
    create: {
      lessonId: lesson13_1.id,
      title: "ECC vs S/4HANA",
      nodes: [
        { id: "ecc", type: "default", position: { x: 80, y: 40 }, data: { label: "🗂️ SAP ECC (Old)\nDisk DB + SAP GUI" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px", fontWeight: "bold" } },
        { id: "many", type: "default", position: { x: 80, y: 170 }, data: { label: "📚 Many Finance Tables\n(FI + CO separate)" }, style: { background: "#94A3B8", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px" } },
        { id: "s4", type: "default", position: { x: 420, y: 40 }, data: { label: "⚡ S/4HANA (New)\nHANA In-Memory + Fiori" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px", fontWeight: "bold" } },
        { id: "acdoca", type: "default", position: { x: 420, y: 170 }, data: { label: "📒 Universal Journal\nACDOCA (FI+CO unified)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px", fontWeight: "bold" } },
        { id: "bp", type: "default", position: { x: 420, y: 300 }, data: { label: "🤝 Business Partner\n(Customer + Vendor)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 200, fontSize: "12px" } },
        { id: "realtime", type: "default", position: { x: 700, y: 170 }, data: { label: "📊 Real-Time Reporting\n(No overnight batch)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px 14px", width: 180, fontSize: "12px", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "ecc", target: "many" },
        { id: "e2", source: "ecc", target: "s4", label: "Migrate" },
        { id: "e3", source: "s4", target: "acdoca" },
        { id: "e4", source: "s4", target: "bp" },
        { id: "e5", source: "acdoca", target: "realtime" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart13_1.id, nodeId: "ecc", title: "SAP ECC (The Predecessor)", description: "The previous-generation SAP ERP. Ran on any database (Oracle, DB2, etc.), used the SAP GUI, and stored finance data across many tables. Mainstream support ends 2027 (extended 2030).", tCode: "SAP ECC 6.0", tips: "Most existing SAP customers are still on ECC and actively planning their S/4HANA migration." },
      { flowchartId: flowchart13_1.id, nodeId: "s4", title: "SAP S/4HANA", description: "The new-generation ERP built exclusively for the HANA in-memory database. Fiori-first UX, simplified data model, and real-time analytics built in.", tCode: "S/4HANA", tips: "'S/4' = Suite 4th generation; 'HANA' = the mandatory in-memory database it runs on." },
      { flowchartId: flowchart13_1.id, nodeId: "acdoca", title: "Universal Journal (ACDOCA)", description: "The single finance table that merges what used to be dozens of FI and CO tables. One line of truth per posting means no FI-CO reconciliation and instant financial reporting.", tCode: "Table ACDOCA", tips: "ACDOCA is the heart of S/4HANA Finance — many interview questions focus on it." },
      { flowchartId: flowchart13_1.id, nodeId: "bp", title: "Business Partner (BP)", description: "In S/4HANA, customers and vendors are maintained through a single Business Partner object (transaction BP), replacing the separate customer/vendor masters of ECC.", tCode: "BP", tips: "BP is mandatory in S/4HANA — the old XD01/XK01 master transactions are redirected to it." },
      { flowchartId: flowchart13_1.id, nodeId: "realtime", title: "Real-Time Reporting", description: "Because HANA holds data in memory and stores it in columns, aggregations and reports that once needed overnight batch jobs now run instantly on live data.", tCode: "Fiori Analytical Apps", tips: "This 'transactions + analytics in one system' capability is HANA's headline advantage." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson13_1.id },
    update: {},
    create: {
      lessonId: lesson13_1.id,
      title: "What is S/4HANA Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What makes the HANA database so fast compared to traditional databases?",
            explanation: "HANA is an in-memory, column-based database — data lives in RAM (not on disk) and is stored in columns (ideal for aggregations). This lets reports that once needed overnight batch jobs run in seconds.",
            options: {
              create: [
                { text: "It holds data in-memory (RAM) and stores it in columns", isCorrect: true },
                { text: "It uses more hard disks than other databases", isCorrect: false },
                { text: "It deletes old data to stay small", isCorrect: false },
                { text: "It only stores summaries, not detail", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What is the Universal Journal (table ACDOCA) in S/4HANA?",
            explanation: "ACDOCA merges the many separate FI and CO tables of ECC into ONE table — a single line of truth for every financial posting. This unifies FI and CO (no reconciliation) and enables real-time financial reporting.",
            options: {
              create: [
                { text: "One table that merges FI and CO into a single line of truth", isCorrect: true },
                { text: "A diary the CFO writes in", isCorrect: false },
                { text: "A list of all SAP users", isCorrect: false },
                { text: "The warehouse bin layout", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "In S/4HANA, how are customers and vendors maintained?",
            explanation: "S/4HANA uses a single Business Partner (BP) object for both customers and vendors, replacing ECC's separate customer and vendor master records. Transaction BP is mandatory.",
            options: {
              create: [
                { text: "Through a single Business Partner (BP) object", isCorrect: true },
                { text: "In two completely separate, unrelated systems", isCorrect: false },
                { text: "Only on paper, not in SAP", isCorrect: false },
                { text: "They are no longer tracked in S/4HANA", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 13.2: Migrating to S/4HANA
  const lesson13_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: s4Module.id, slug: "migrating-to-s4hana" } },
    update: {},
    create: {
      moduleId: s4Module.id,
      title: "Paths to S/4HANA",
      slug: "migrating-to-s4hana",
      order: 2,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "INTERMEDIATE",
      xpReward: 75,
      story: `A company's CIO announces: "We're moving to S/4HANA." Immediately the project team splits into camps. One says "let's just convert our existing system." Another says "no — let's start fresh and clean up our mess." A third says "let's do it region by region."

Each is a real, named migration approach with big trade-offs in cost, risk, and time. Knowing these paths — and the famous SAP tools that support them — is exactly the kind of knowledge that lands S/4HANA consulting roles.`,
      content: `## The Three Migration Approaches

### 1. New Implementation ("Greenfield")
Build a brand-new S/4HANA system from scratch.
- Re-design processes using SAP best practices
- Migrate only the master data and balances you choose
- **Pro:** clean slate, drop old customizations and bad habits
- **Con:** more effort, change management, retraining
- Best for: companies wanting a fresh start or on very old/messy systems

### 2. System Conversion ("Brownfield")
Convert your existing ECC system in place to S/4HANA.
- Keeps your historical data, customizations, and processes
- A technical conversion of the same system
- **Pro:** faster, retains history and investment
- **Con:** carries over old complexity and technical debt
- Best for: companies happy with current processes

### 3. Selective Data Transition ("Bluefield" / Hybrid)
A mix — move selected data, configuration, and processes.
- Cherry-pick what to keep and what to redesign
- **Pro:** balances clean-up with retaining value
- **Con:** complex to plan, needs specialist tools
- Best for: large landscapes consolidating multiple systems

## Famous SAP Migration Tools

| Tool | Purpose |
|------|---------|
| **SAP Readiness Check** | Analyzes your ECC system and reports what needs attention before converting |
| **Maintenance Planner** | Mandatory first step; checks system & plans the conversion |
| **Software Update Manager (SUM)** with **DMO** | Performs the actual conversion + database migration in one run |
| **Custom Code Migration / ATC** | Finds custom ABAP code that won't work in S/4HANA |
| **SAP Activate** | The methodology (project framework) guiding the whole journey |

## The Simplified Process (Brownfield)

1. **Readiness Check** — what will break?
2. **Custom code analysis** — fix incompatible Z programs
3. **Maintenance Planner** — plan the stack
4. **SUM with DMO** — convert system + migrate to HANA
5. **Test** in QAS
6. **Go-live** in PRD

## RISE with SAP

**RISE with SAP** is SAP's bundled offering to move to S/4HANA Cloud — combining the software, cloud infrastructure, and services into one subscription. It's how SAP is steering customers toward the cloud.

## Why This Matters for Your Career

S/4HANA migration is one of the **biggest sources of SAP jobs today**. Consultants who understand greenfield vs brownfield, the tools, and SAP Activate are in very high demand through the 2027/2030 deadline.`,
      keyConceptTitle: "Three Paths: Greenfield (new), Brownfield (convert), Selective (hybrid)",
      keyConceptBody: `Companies reach S/4HANA via three approaches:
- **Greenfield** — brand-new build, clean slate, best practices
- **Brownfield** — convert the existing ECC system in place, keeping history and customizations
- **Selective Data Transition** — a hybrid, cherry-picking what to keep

Key tools: **SAP Readiness Check** (what needs fixing), **Maintenance Planner**, and **SUM with DMO** (the actual conversion + HANA migration), all guided by the **SAP Activate** methodology. **RISE with SAP** bundles the cloud move into one subscription.`,
    },
  });

  const flowchart13_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson13_2.id },
    update: {},
    create: {
      lessonId: lesson13_2.id,
      title: "S/4HANA Migration Paths & Tools",
      nodes: [
        { id: "ecc", type: "default", position: { x: 60, y: 200 }, data: { label: "🗂️ Existing ECC System" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "green", type: "default", position: { x: 320, y: 50 }, data: { label: "🌱 Greenfield\nNew Build" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "brown", type: "default", position: { x: 320, y: 200 }, data: { label: "🟤 Brownfield\nConvert In-Place" }, style: { background: "#92400E", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "blue", type: "default", position: { x: 320, y: 350 }, data: { label: "🔵 Selective\nHybrid Transition" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "tools", type: "default", position: { x: 560, y: 200 }, data: { label: "🛠️ Readiness Check\n+ SUM/DMO" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center" } },
        { id: "s4", type: "default", position: { x: 800, y: 200 }, data: { label: "⚡ S/4HANA\nLive" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "12px", width: 140, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "ecc", target: "green" },
        { id: "e2", source: "ecc", target: "brown" },
        { id: "e3", source: "ecc", target: "blue" },
        { id: "e4", source: "green", target: "tools" },
        { id: "e5", source: "brown", target: "tools" },
        { id: "e6", source: "blue", target: "tools" },
        { id: "e7", source: "tools", target: "s4" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart13_2.id, nodeId: "green", title: "Greenfield (New Implementation)", description: "Build a fresh S/4HANA system using SAP best practices, migrating only chosen master data and balances. A clean slate that drops legacy customizations.", tCode: "SAP Activate (methodology)", tips: "Best when current processes are messy or very old — but demands strong change management." },
      { flowchartId: flowchart13_2.id, nodeId: "brown", title: "Brownfield (System Conversion)", description: "Technically convert the existing ECC system in place to S/4HANA, keeping historical data, configuration, and customizations.", tCode: "SUM with DMO", tips: "Faster and retains investment, but carries existing technical debt forward into S/4HANA." },
      { flowchartId: flowchart13_2.id, nodeId: "blue", title: "Selective Data Transition", description: "A hybrid that cherry-picks which data, config, and processes to carry over. Common when consolidating several systems into one.", tCode: "Specialist partner tools", tips: "Most complex to plan; usually needs third-party tooling and experienced partners." },
      { flowchartId: flowchart13_2.id, nodeId: "tools", title: "Readiness Check & SUM/DMO", description: "SAP Readiness Check reports what needs fixing before conversion. SUM (Software Update Manager) with DMO (Database Migration Option) performs the conversion and HANA migration in one run.", tCode: "SAP Readiness Check, SUM/DMO, Maintenance Planner", tips: "Maintenance Planner is the mandatory first technical step before SUM can run." },
      { flowchartId: flowchart13_2.id, nodeId: "s4", title: "Live on S/4HANA", description: "After testing in QAS and cutover, the business runs on S/4HANA — gaining Fiori UX, the Universal Journal, and real-time analytics.", tCode: "S/4HANA", tips: "Post-go-live, teams often adopt Fiori apps gradually, retiring SAP GUI transactions over time." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson13_2.id },
    update: {},
    create: {
      lessonId: lesson13_2.id,
      title: "S/4HANA Migration Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the difference between a 'Greenfield' and a 'Brownfield' migration to S/4HANA?",
            explanation: "Greenfield is a brand-new implementation built from scratch with best practices (clean slate). Brownfield is a technical conversion of the existing ECC system in place, keeping its history and customizations.",
            options: {
              create: [
                { text: "Greenfield is a fresh new build; Brownfield converts the existing system in place", isCorrect: true },
                { text: "Greenfield is for finance; Brownfield is for logistics", isCorrect: false },
                { text: "They are two names for the same thing", isCorrect: false },
                { text: "Greenfield keeps all old data; Brownfield deletes everything", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which tool performs the actual system conversion AND database migration to HANA in one run?",
            explanation: "SUM (Software Update Manager) with the DMO (Database Migration Option) performs both the system conversion and the migration to the HANA database in a single procedure.",
            options: {
              create: [
                { text: "SUM with DMO (Database Migration Option)", isCorrect: true },
                { text: "Microsoft Excel", isCorrect: false },
                { text: "VA01", isCorrect: false },
                { text: "The Fiori Launchpad", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What is RISE with SAP?",
            explanation: "RISE with SAP is SAP's bundled offering that combines the S/4HANA Cloud software, cloud infrastructure, and services into a single subscription — SAP's way of steering customers toward the cloud.",
            options: {
              create: [
                { text: "A bundled subscription to move to S/4HANA Cloud (software + infra + services)", isCorrect: true },
                { text: "A morning alarm feature in SAP", isCorrect: false },
                { text: "A programming language", isCorrect: false },
                { text: "A type of financial report", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 14: SAP BTP (Business Technology Platform)
  // ─────────────────────────────────────────────
  const btpModule = await prisma.module.upsert({
    where: { slug: "btp" },
    update: {},
    create: {
      title: "SAP BTP",
      slug: "btp",
      description: "Learn SAP's cloud platform for building apps, integrating systems, analyzing data, and adding AI — without touching the core ERP.",
      color: "#0EA5E9",
      icon: "☁️",
      order: 14,
      isPublished: true,
    },
  });

  // LESSON 14.1: What is BTP?
  const lesson14_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: btpModule.id, slug: "what-is-btp" } },
    update: {},
    create: {
      moduleId: btpModule.id,
      title: "What is SAP BTP?",
      slug: "what-is-btp",
      order: 1,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `A company loves their S/4HANA system but wants a custom mobile app for field sales, an AI chatbot for HR, and a live dashboard pulling data from SAP and Salesforce together. The old instinct: modify the SAP core. But modifying the core makes upgrades painful and risky.

SAP's modern answer is "keep the core clean" — build all those extras OUTSIDE the ERP, on a cloud platform called **BTP**. This lesson explains what BTP is and why it's central to SAP's future.`,
      content: `## What is BTP?

**SAP Business Technology Platform (BTP)** is SAP's cloud platform-as-a-service. It's where you **build, integrate, analyze, and extend** — all around your core SAP systems, in the cloud.

Think of it as SAP's "everything-else" platform: the place for the custom apps, integrations, analytics, and AI that don't belong inside the ERP core.

## The "Keep the Core Clean" Principle

A central modern SAP idea:
- **Don't** modify the S/4HANA core with custom code (it makes upgrades hard)
- **Do** build extensions on BTP that connect to the core via APIs

This is called **side-by-side extensibility** — your custom stuff lives beside the core, not inside it.

## The Four Pillars of BTP

| Pillar | What It Does | Example |
|--------|--------------|---------|
| **Application Development** | Build custom apps & extensions | A custom Fiori app on BTP |
| **Integration** | Connect SAP to SAP and non-SAP systems | Sync S/4HANA with Salesforce |
| **Data & Analytics** | Store, model, and analyze data | SAP Analytics Cloud, HANA Cloud |
| **AI** | Add intelligence | SAP AI Core, Joule copilot |

## Key BTP Services (Names You'll Hear)

| Service | Purpose |
|---------|---------|
| **SAP Build** | Low-code/no-code app and automation building |
| **Cloud Application Programming (CAP)** | Framework to build business apps (Node.js/Java) |
| **SAP Integration Suite** | The integration toolkit (formerly CPI) |
| **SAP HANA Cloud** | The cloud version of the HANA database |
| **SAP Analytics Cloud (SAC)** | Cloud BI, planning, and dashboards |
| **Business Application Studio (BAS)** | The cloud IDE for developers |

## How BTP Connects to Your ERP

1. Your **S/4HANA** core exposes data through **APIs / OData**
2. A **BTP app** consumes those APIs
3. The app adds new logic, a new UI, or combines SAP data with other sources
4. The core stays untouched and upgrade-safe

## Why BTP Matters

- It's how SAP customers innovate **fast** without risking the ERP
- It unifies app dev, integration, analytics, and AI in one platform
- It's central to SAP's cloud strategy alongside S/4HANA and RISE
- Growing demand for **BTP developers and architects**`,
      keyConceptTitle: "BTP = SAP's Cloud Platform to Extend, Integrate, Analyze & Add AI",
      keyConceptBody: `**SAP BTP** is SAP's cloud platform for everything around the ERP core. Its guiding principle is **"keep the core clean"** — build extensions *beside* S/4HANA (side-by-side extensibility) that connect via APIs, instead of modifying the core.

Four pillars: **App Development**, **Integration**, **Data & Analytics**, and **AI**. Key services include **SAP Build** (low-code), **CAP** (build apps), **Integration Suite**, **HANA Cloud**, and **SAP Analytics Cloud**. This keeps the ERP upgrade-safe while letting companies innovate fast.`,
    },
  });

  const flowchart14_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson14_1.id },
    update: {},
    create: {
      lessonId: lesson14_1.id,
      title: "BTP & Side-by-Side Extensibility",
      nodes: [
        { id: "core", type: "default", position: { x: 60, y: 200 }, data: { label: "⚡ S/4HANA Core\n(Keep Clean)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "api", type: "default", position: { x: 280, y: 200 }, data: { label: "🔌 APIs / OData" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "12px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "btp", type: "default", position: { x: 470, y: 200 }, data: { label: "☁️ SAP BTP\n(Cloud Platform)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "12px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "appdev", type: "default", position: { x: 720, y: 40 }, data: { label: "🛠️ App Development\n(CAP / SAP Build)" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px", width: 170, fontSize: "12px", textAlign: "center" } },
        { id: "integ", type: "default", position: { x: 720, y: 150 }, data: { label: "🔗 Integration\n(Integration Suite)" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 170, fontSize: "12px", textAlign: "center" } },
        { id: "analytics", type: "default", position: { x: 720, y: 260 }, data: { label: "📊 Data & Analytics\n(SAC / HANA Cloud)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 170, fontSize: "12px", textAlign: "center" } },
        { id: "ai", type: "default", position: { x: 720, y: 370 }, data: { label: "🤖 AI\n(AI Core / Joule)" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px", width: 170, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "core", target: "api" },
        { id: "e2", source: "api", target: "btp" },
        { id: "e3", source: "btp", target: "appdev" },
        { id: "e4", source: "btp", target: "integ" },
        { id: "e5", source: "btp", target: "analytics" },
        { id: "e6", source: "btp", target: "ai" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart14_1.id, nodeId: "core", title: "S/4HANA Core (Keep Clean)", description: "The ERP core is left unmodified so upgrades stay easy and safe. Instead of custom code inside it, extensions are built outside on BTP.", tCode: "S/4HANA", tips: "'Clean core' is a guiding principle of modern SAP — minimize in-core modifications." },
      { flowchartId: flowchart14_1.id, nodeId: "api", title: "APIs / OData", description: "The core exposes its data and functions through standardized APIs (often OData). BTP apps consume these APIs to read and write ERP data safely.", tCode: "SAP API Business Hub", tips: "The SAP Business Accelerator Hub lists thousands of ready-made APIs you can call from BTP." },
      { flowchartId: flowchart14_1.id, nodeId: "btp", title: "SAP BTP", description: "The cloud platform-as-a-service hosting your extensions. It unifies application development, integration, data & analytics, and AI in one environment.", tCode: "BTP Cockpit", tips: "BTP is organized into global accounts, subaccounts, and spaces — the structure for managing your services." },
      { flowchartId: flowchart14_1.id, nodeId: "appdev", title: "Application Development", description: "Build custom apps and extensions using SAP Build (low-code) or the Cloud Application Programming model (CAP) in Business Application Studio.", tCode: "BAS, SAP Build", tips: "CAP (Node.js/Java) is the pro-code path; SAP Build is the low-code path for citizen developers." },
      { flowchartId: flowchart14_1.id, nodeId: "integ", title: "Integration", description: "SAP Integration Suite connects SAP systems to each other and to non-SAP systems (Salesforce, banks, etc.) using prebuilt connectors and flows.", tCode: "Integration Suite (formerly CPI)", tips: "Prebuilt integration content accelerates connecting common systems out of the box." },
      { flowchartId: flowchart14_1.id, nodeId: "analytics", title: "Data & Analytics", description: "HANA Cloud stores and models data; SAP Analytics Cloud delivers dashboards, BI, and planning — all able to draw on live ERP data.", tCode: "HANA Cloud, SAC", tips: "This pillar is where BTP overlaps with the SAC module you'll learn next." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson14_1.id },
    update: {},
    create: {
      lessonId: lesson14_1.id,
      title: "What is BTP Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What does the 'keep the core clean' principle mean in modern SAP?",
            explanation: "It means you should NOT modify the S/4HANA core with custom code (which makes upgrades painful). Instead, build extensions on BTP that connect to the core via APIs — called side-by-side extensibility.",
            options: {
              create: [
                { text: "Don't modify the ERP core — build extensions beside it on BTP via APIs", isCorrect: true },
                { text: "Delete all data from the core every night", isCorrect: false },
                { text: "Only allow administrators to log into the core", isCorrect: false },
                { text: "Run antivirus software on the SAP servers", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which of these are the four pillars of SAP BTP?",
            explanation: "BTP's four pillars are: Application Development, Integration, Data & Analytics, and AI. Together they cover everything you'd want to build around the ERP core.",
            options: {
              create: [
                { text: "App Development, Integration, Data & Analytics, and AI", isCorrect: true },
                { text: "Finance, Sales, HR, and Production", isCorrect: false },
                { text: "DEV, QAS, PRD, and Sandbox", isCorrect: false },
                { text: "Domains, Data Elements, Tables, and Views", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "A company wants to connect S/4HANA with Salesforce. Which BTP capability handles this?",
            explanation: "Integration (via SAP Integration Suite) connects SAP systems to each other and to non-SAP systems like Salesforce, using prebuilt connectors and integration flows.",
            options: {
              create: [
                { text: "Integration (SAP Integration Suite)", isCorrect: true },
                { text: "Payroll", isCorrect: false },
                { text: "Plant Maintenance", isCorrect: false },
                { text: "The Chart of Accounts", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 14.2: Extending SAP with BTP
  const lesson14_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: btpModule.id, slug: "extending-sap-with-btp" } },
    update: {},
    create: {
      moduleId: btpModule.id,
      title: "Extending SAP with BTP",
      slug: "extending-sap-with-btp",
      order: 2,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "INTERMEDIATE",
      xpReward: 75,
      story: `Meena's company runs S/4HANA. The sales team begs for a simple mobile app: "Let us approve discounts on our phones." A developer could hack this into the SAP core — but that's exactly the trap modern SAP warns against.

Instead, Meena's team builds it on BTP. But how, exactly? What's the difference between a quick low-code build and a full custom app? This lesson shows the practical ways to extend SAP using BTP.`,
      content: `## Two Styles of Extension

### Side-by-Side Extensibility (on BTP)
Build a separate app on BTP that talks to S/4HANA via APIs.
- Best for: new apps, complex logic, combining multiple systems
- The core stays completely clean

### In-App (Key User) Extensibility (inside S/4HANA)
Small tweaks made *within* S/4HANA using built-in tools — add a custom field, adapt a Fiori app, create a simple custom report.
- Best for: minor adjustments that don't justify a separate app
- Done by "key users," no deep coding

Modern projects use **both**: small tweaks in-app, bigger builds side-by-side on BTP.

## The Two Development Paths on BTP

### Low-Code / No-Code: SAP Build
- **SAP Build Apps** — drag-and-drop app builder
- **SAP Build Process Automation** — automate workflows & tasks (RPA-style)
- **SAP Build Work Zone** — build business sites/launchpads
- Best for: business users and fast delivery

### Pro-Code: CAP & ABAP Cloud
- **CAP (Cloud Application Programming model)** — build full business apps in Node.js or Java
- **ABAP Cloud** — modern, cloud-ready ABAP on BTP (the ABAP environment)
- Best for: developers building robust, complex applications

## A Typical Extension Recipe

Building that "approve discounts on mobile" app:
1. **Find the API** — locate the S/4HANA sales order API on the Business Accelerator Hub
2. **Build the app** — create a Fiori app (SAP Build or CAP) in Business Application Studio
3. **Add logic** — discount approval rules live in your BTP app
4. **Connect** — the app calls S/4HANA APIs to read/update orders
5. **Secure & deploy** — use BTP's authentication (XSUAA / Identity Authentication)
6. **Publish** — users access it via a launchpad on any device

## Joule — SAP's AI Copilot

**Joule** is SAP's generative-AI copilot, built using BTP AI services. It lets users ask questions and trigger actions in natural language across SAP apps — a flagship example of BTP's AI pillar.

## Why Companies Love This Model

- Innovate quickly without endangering the ERP
- Upgrades stay painless (clean core)
- One platform from quick automations to enterprise apps
- A clear path to add AI to existing processes

## Career Note

"Build extensions on BTP" is now a default answer in SAP projects. Skills in **SAP Build, CAP, and BTP integration** are increasingly requested alongside core module knowledge.`,
      keyConceptTitle: "Extend SAP: Side-by-Side on BTP + Small In-App Tweaks",
      keyConceptBody: `Two extension styles: **side-by-side** (separate BTP apps calling S/4HANA APIs — for bigger builds) and **in-app/key-user** (small tweaks like custom fields inside S/4HANA).

On BTP there are two dev paths: **low-code** with **SAP Build** (drag-and-drop apps, process automation) and **pro-code** with **CAP** and **ABAP Cloud**. A typical recipe: find the API → build the app in Business Application Studio → add logic → connect → secure → publish. **Joule** is SAP's AI copilot built on BTP's AI services.`,
    },
  });

  const flowchart14_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson14_2.id },
    update: {},
    create: {
      lessonId: lesson14_2.id,
      title: "Building a BTP Extension",
      nodes: [
        { id: "need", type: "default", position: { x: 60, y: 200 }, data: { label: "💡 Business Need\n(Mobile Approval App)" }, style: { background: "#64748B", color: "#fff", borderRadius: "8px", padding: "12px", width: 170, fontSize: "12px", textAlign: "center" } },
        { id: "api", type: "default", position: { x: 270, y: 200 }, data: { label: "🔌 Find S/4 API\n(Accelerator Hub)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center" } },
        { id: "build", type: "default", position: { x: 470, y: 110 }, data: { label: "🛠️ Build App\nSAP Build / CAP (BAS)" }, style: { background: "#0EA5E9", color: "#fff", borderRadius: "8px", padding: "12px", width: 180, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "logic", type: "default", position: { x: 470, y: 290 }, data: { label: "🧠 Add Logic\nApproval Rules" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center" } },
        { id: "secure", type: "default", position: { x: 690, y: 200 }, data: { label: "🔐 Secure & Deploy\nXSUAA / IAS" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center" } },
        { id: "publish", type: "default", position: { x: 890, y: 200 }, data: { label: "🚀 Publish to Users\n(Any Device)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "need", target: "api" },
        { id: "e2", source: "api", target: "build" },
        { id: "e3", source: "api", target: "logic" },
        { id: "e4", source: "build", target: "secure" },
        { id: "e5", source: "logic", target: "secure" },
        { id: "e6", source: "secure", target: "publish" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart14_2.id, nodeId: "api", title: "Find the S/4HANA API", description: "Locate the relevant standard API (e.g. Sales Order) on the SAP Business Accelerator Hub. The app will use this to read and update core ERP data safely.", tCode: "SAP Business Accelerator Hub", tips: "Always prefer a released public API over direct table access — it survives upgrades." },
      { flowchartId: flowchart14_2.id, nodeId: "build", title: "Build the App", description: "Create the app using a low-code tool (SAP Build Apps) or pro-code framework (CAP) in SAP Business Application Studio, the cloud IDE.", tCode: "BAS, SAP Build, CAP", tips: "Choose low-code for speed and simple apps; pro-code (CAP) for complex, long-lived applications." },
      { flowchartId: flowchart14_2.id, nodeId: "logic", title: "Add Business Logic", description: "Your custom rules (e.g. discount approval thresholds) live in the BTP app — not in the core — keeping S/4HANA clean and upgrade-safe.", tCode: "CAP (Node.js/Java)", tips: "Side-by-side logic means the core never has to know about your custom approval rules." },
      { flowchartId: flowchart14_2.id, nodeId: "secure", title: "Secure & Deploy", description: "BTP handles authentication and authorization via XSUAA and SAP Identity Authentication Service (IAS), ensuring only the right users access the app.", tCode: "XSUAA, IAS", tips: "Security is a first-class citizen on BTP — apps bind to auth services rather than rolling their own." },
      { flowchartId: flowchart14_2.id, nodeId: "publish", title: "Publish to Users", description: "The finished app is published to a launchpad (e.g. SAP Build Work Zone) and accessed on any device, completing the side-by-side extension.", tCode: "SAP Build Work Zone", tips: "Users get a seamless experience — the BTP app feels just like a native Fiori app in their launchpad." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson14_2.id },
    update: {},
    create: {
      lessonId: lesson14_2.id,
      title: "Extending SAP with BTP Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the difference between side-by-side and in-app (key user) extensibility?",
            explanation: "Side-by-side builds a separate app on BTP that calls S/4HANA via APIs (for bigger needs). In-app/key-user extensibility makes small tweaks WITHIN S/4HANA (like adding a custom field) without deep coding.",
            options: {
              create: [
                { text: "Side-by-side builds a separate BTP app; in-app makes small tweaks inside S/4HANA", isCorrect: true },
                { text: "They are identical approaches", isCorrect: false },
                { text: "Side-by-side is for finance only; in-app is for HR only", isCorrect: false },
                { text: "In-app requires rebuilding the entire ERP", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which BTP tool is the LOW-CODE / NO-CODE way to build apps and automate processes?",
            explanation: "SAP Build is the low-code/no-code suite — SAP Build Apps (drag-and-drop app builder), Build Process Automation (workflows), and Build Work Zone (sites). CAP and ABAP Cloud are the pro-code paths.",
            options: {
              create: [
                { text: "SAP Build", isCorrect: true },
                { text: "CAP (Cloud Application Programming)", isCorrect: false },
                { text: "ABAP Cloud", isCorrect: false },
                { text: "SUM with DMO", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What is Joule in the SAP ecosystem?",
            explanation: "Joule is SAP's generative-AI copilot, built using BTP's AI services. It lets users ask questions and trigger actions in natural language across SAP apps — a flagship example of BTP's AI pillar.",
            options: {
              create: [
                { text: "SAP's generative-AI copilot built on BTP AI services", isCorrect: true },
                { text: "A unit of electricity used to price SAP licenses", isCorrect: false },
                { text: "A type of purchase order", isCorrect: false },
                { text: "The HANA database's storage format", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 15: SAP SuccessFactors
  // ─────────────────────────────────────────────
  const sfModule = await prisma.module.upsert({
    where: { slug: "successfactors" },
    update: {},
    create: {
      title: "SAP SuccessFactors",
      slug: "successfactors",
      description: "Learn SAP's cloud HR suite — Employee Central, recruiting, performance, learning, and how it differs from on-premise HCM.",
      color: "#9333EA",
      icon: "🌟",
      order: 15,
      isPublished: true,
    },
  });

  // LESSON 15.1: SuccessFactors & Employee Central
  const lesson15_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: sfModule.id, slug: "successfactors-employee-central" } },
    update: {},
    create: {
      moduleId: sfModule.id,
      title: "SuccessFactors & Employee Central",
      slug: "successfactors-employee-central",
      order: 1,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `You already learned SAP HCM — the on-premise way to manage employees with infotypes and PA30. But when Priya's company moved HR to the cloud, the screens looked totally different: friendly self-service portals, mobile access, and a tool called "Employee Central."

That's **SAP SuccessFactors**, SAP's cloud HR suite. It's where most new HR projects happen today. This lesson explains what SuccessFactors is, how Employee Central works, and how it relates to the HCM you already know.`,
      content: `## What is SuccessFactors?

**SAP SuccessFactors (SF)** is SAP's cloud-based **Human Experience Management (HXM)** suite. It covers the full employee lifecycle — hire to retire — delivered as software-as-a-service (SaaS), updated regularly by SAP.

It's the cloud successor to on-premise **SAP HCM**.

## HCM vs SuccessFactors

| On-Premise HCM | SuccessFactors |
|----------------|----------------|
| Runs in your data center | Cloud (SaaS) |
| Infotypes + PA30 | Modern web UI + self-service |
| You manage upgrades | SAP updates it (quarterly) |
| Strong payroll core | Best-in-class talent modules |
| "Personnel Number" | "User / Person ID" |

Many companies run a **hybrid**: SuccessFactors for talent + on-premise/cloud payroll.

## The SuccessFactors Modules

| Module | What It Does |
|--------|--------------|
| **Employee Central (EC)** | The core HR system of record (the heart) |
| **Recruiting (RCM)** | Job postings, applicant tracking, hiring |
| **Onboarding** | New hire paperwork and ramp-up |
| **Performance & Goals** | Goal setting, reviews, ratings |
| **Compensation** | Salary planning, bonuses, merit |
| **Learning (LMS)** | Training courses and compliance |
| **Succession & Development** | Talent pipelines, career planning |

## Employee Central — The Core

**Employee Central (EC)** is the system of record — the cloud equivalent of HCM master data. Its key concepts:

### Foundation Objects
The organizational backbone: Legal Entity, Business Unit, Division, Department, Job Classification, Location. (Like OM structures in HCM.)

### Employee Data
- **Person objects** — data about the human (biographical, national ID)
- **Employment objects** — data about their job (hire date, position, pay)

### MDF (Metadata Framework)
The flexible engine that lets you create custom objects and fields without coding — SuccessFactors' configuration superpower.

## Self-Service — A Big Shift

A defining SuccessFactors feature:
- **ESS (Employee Self-Service)** — employees update their own info, request leave
- **MSS (Manager Self-Service)** — managers approve, view teams, run actions

This pushes routine HR tasks to employees and managers, freeing HR for strategic work.

## Integration

- SuccessFactors integrates with **S/4HANA** and payroll via standard integrations (often through BTP Integration Suite)
- Employee cost data still flows to **FICO** cost centers — the same principle as HCM`,
      keyConceptTitle: "SuccessFactors = Cloud HR; Employee Central = Its Core",
      keyConceptBody: `**SAP SuccessFactors** is SAP's cloud HR (HXM) suite — the SaaS successor to on-premise HCM, updated quarterly by SAP. It spans the full employee lifecycle: Recruiting, Onboarding, Performance & Goals, Compensation, Learning, and Succession.

Its heart is **Employee Central (EC)** — the HR system of record, built on **Foundation Objects** (org structure), **Person & Employment** data, and the flexible **MDF** (Metadata Framework). A defining shift is **self-service**: ESS for employees, MSS for managers.`,
    },
  });

  const flowchart15_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson15_1.id },
    update: {},
    create: {
      lessonId: lesson15_1.id,
      title: "SuccessFactors Suite & Employee Central",
      nodes: [
        { id: "ec", type: "default", position: { x: 330, y: 200 }, data: { label: "🌟 Employee Central\n(Core System of Record)" }, style: { background: "#9333EA", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "12px 18px", width: 200 } },
        { id: "recruit", type: "default", position: { x: 60, y: 40 }, data: { label: "📋 Recruiting" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "perf", type: "default", position: { x: 60, y: 200 }, data: { label: "🎯 Performance\n& Goals" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "10px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "comp", type: "default", position: { x: 60, y: 360 }, data: { label: "💰 Compensation" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "10px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "learn", type: "default", position: { x: 620, y: 40 }, data: { label: "📚 Learning (LMS)" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "succ", type: "default", position: { x: 620, y: 200 }, data: { label: "📈 Succession\n& Development" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px", textAlign: "center" } },
        { id: "ess", type: "default", position: { x: 620, y: 360 }, data: { label: "🙋 ESS / MSS\nSelf-Service" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px", width: 140, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "recruit", target: "ec" },
        { id: "e2", source: "perf", target: "ec" },
        { id: "e3", source: "comp", target: "ec" },
        { id: "e4", source: "ec", target: "learn" },
        { id: "e5", source: "ec", target: "succ" },
        { id: "e6", source: "ec", target: "ess" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart15_1.id, nodeId: "ec", title: "Employee Central (EC)", description: "The cloud HR system of record — the SuccessFactors equivalent of HCM master data. Built on Foundation Objects (org structure), Person & Employment data, and the MDF framework.", tCode: "SF cloud (no T-codes)", tips: "EC is usually implemented first; the talent modules plug into it as the single source of employee data." },
      { flowchartId: flowchart15_1.id, nodeId: "recruit", title: "Recruiting (RCM)", description: "Manages job requisitions, postings to job boards, applicant tracking, and the hiring workflow — feeding new hires into Onboarding and Employee Central.", tCode: "SF Recruiting", tips: "Recruiting + Onboarding together create a smooth candidate-to-employee journey." },
      { flowchartId: flowchart15_1.id, nodeId: "perf", title: "Performance & Goals", description: "Supports goal setting, continuous feedback, and formal performance reviews with ratings — aligning individual goals to company objectives.", tCode: "SF Performance & Goals", tips: "Ratings here often feed Compensation (merit increases) and Succession (talent identification)." },
      { flowchartId: flowchart15_1.id, nodeId: "learn", title: "Learning (LMS)", description: "Delivers and tracks training — online courses, instructor-led classes, certifications, and compliance training with completion records.", tCode: "SF Learning", tips: "LMS is critical in regulated industries for proving mandatory compliance training was completed." },
      { flowchartId: flowchart15_1.id, nodeId: "ess", title: "Self-Service (ESS/MSS)", description: "Employee Self-Service lets staff update personal info and request leave; Manager Self-Service lets managers approve requests and run team actions — reducing HR's admin load.", tCode: "SF ESS / MSS", tips: "Self-service is a defining cloud-HR shift — routine tasks move to employees and managers." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson15_1.id },
    update: {},
    create: {
      lessonId: lesson15_1.id,
      title: "SuccessFactors & Employee Central Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "How does SAP SuccessFactors differ from on-premise SAP HCM?",
            explanation: "SuccessFactors is SAP's cloud (SaaS) HR suite — updated quarterly by SAP, with modern self-service UIs — whereas on-premise HCM runs in your own data center with infotypes and PA30, and you manage the upgrades.",
            options: {
              create: [
                { text: "SuccessFactors is cloud/SaaS (SAP updates it); HCM is on-premise (you manage it)", isCorrect: true },
                { text: "SuccessFactors is for finance; HCM is for HR", isCorrect: false },
                { text: "They are the same product with different logos", isCorrect: false },
                { text: "SuccessFactors has no employee data", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "Which SuccessFactors module is the core 'system of record' for employee data?",
            explanation: "Employee Central (EC) is the core HR system of record — the cloud equivalent of HCM master data, built on Foundation Objects, Person & Employment data, and the MDF framework. The talent modules plug into it.",
            options: {
              create: [
                { text: "Employee Central (EC)", isCorrect: true },
                { text: "Recruiting", isCorrect: false },
                { text: "Learning (LMS)", isCorrect: false },
                { text: "Compensation", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "What is the purpose of Employee Self-Service (ESS) and Manager Self-Service (MSS)?",
            explanation: "ESS lets employees update their own info and request leave; MSS lets managers approve requests and run team actions. This pushes routine HR tasks to employees and managers, freeing HR for strategic work.",
            options: {
              create: [
                { text: "Let employees and managers handle routine HR tasks themselves", isCorrect: true },
                { text: "Automatically fire underperforming employees", isCorrect: false },
                { text: "Replace the finance department", isCorrect: false },
                { text: "Store the company's purchase orders", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 15.2: The Talent Lifecycle in SuccessFactors
  const lesson15_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: sfModule.id, slug: "talent-lifecycle" } },
    update: {},
    create: {
      moduleId: sfModule.id,
      title: "The Talent Lifecycle",
      slug: "talent-lifecycle",
      order: 2,
      isPublished: true,
      estimatedMinutes: 10,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `Think about your own work life: you applied for a job, got hired, were onboarded, set goals, got reviewed, maybe got a raise, took training, and perhaps got promoted. Every one of those moments is an HR process.

SuccessFactors models this entire journey — "hire to retire" — as one connected **talent lifecycle**. Seeing how the modules chain together is the key to understanding why SuccessFactors is structured the way it is.`,
      content: `## The Talent Lifecycle: Hire to Retire

SuccessFactors organizes HR around the employee's journey. Each stage is supported by a module, and they pass data to each other.

### Stage 1: Attract & Recruit (Recruiting)
- Create a job requisition, post it, collect applications
- Screen and interview candidates, select the best
- The hire flows into Onboarding and Employee Central

### Stage 2: Onboard (Onboarding)
- New hire paperwork, equipment, introductions
- Goal: productive faster, great first impression
- Data feeds into Employee Central as a new employee record

### Stage 3: Manage & Pay (Employee Central + Payroll)
- The person now lives in EC as the system of record
- Org assignment, position, pay; payroll runs (SF Payroll or integrated)

### Stage 4: Perform & Develop (Performance & Goals, Learning)
- Set goals aligned to company objectives
- Continuous feedback and formal reviews
- Learning addresses skill gaps

### Stage 5: Reward (Compensation)
- Salary planning, merit increases, and bonuses
- Often driven by performance ratings

### Stage 6: Grow & Retain (Succession & Development)
- Identify high-potential talent and successors for key roles
- Career and development planning to retain people

## The Connecting Thread: Data Flows

The power is in the **integration** between stages:
- A performance **rating** → feeds Compensation (merit) and Succession (talent pools)
- A skill **gap** in a review → triggers a Learning recommendation
- A **promotion** → updates Employee Central org data

Everything centers on **Employee Central** as the single source of truth.

## People Analytics & Stories

SuccessFactors includes **People Analytics** (and "Stories," powered by SAP Analytics Cloud technology) to answer questions like:
- What's our attrition rate by department?
- Where are our skill gaps?
- Is diversity improving over time?

## Why the Lifecycle View Matters

For an HR leader, the lifecycle means one connected experience instead of disconnected tools. For you as a learner, recognizing the lifecycle tells you exactly *which module* handles *which moment* — the mental map that makes SuccessFactors click.

## Integration Recap

SuccessFactors connects to:
- **S/4HANA / FICO** — employee costs to cost centers
- **Payroll** — pay results
- **BTP** — for custom integrations and extensions`,
      keyConceptTitle: "SuccessFactors Models the Whole 'Hire to Retire' Journey",
      keyConceptBody: `SuccessFactors organizes HR as a connected **talent lifecycle**:
**Recruit → Onboard → Manage/Pay (Employee Central) → Perform & Develop → Reward (Compensation) → Grow & Retain (Succession)**.

The power is in data flowing between stages: a performance **rating** feeds Compensation and Succession; a skill **gap** triggers Learning; a promotion updates EC. Everything centers on **Employee Central** as the single source of truth, with **People Analytics** providing workforce insights.`,
    },
  });

  const flowchart15_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson15_2.id },
    update: {},
    create: {
      lessonId: lesson15_2.id,
      title: "The Talent Lifecycle",
      nodes: [
        { id: "recruit", type: "default", position: { x: 40, y: 200 }, data: { label: "📋 Recruit" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "12px", width: 110, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "onboard", type: "default", position: { x: 190, y: 200 }, data: { label: "👋 Onboard" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "12px", width: 110, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "ec", type: "default", position: { x: 340, y: 200 }, data: { label: "🌟 Manage/Pay\nEmployee Central" }, style: { background: "#9333EA", color: "#fff", borderRadius: "8px", padding: "12px", width: 140, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "perform", type: "default", position: { x: 520, y: 200 }, data: { label: "🎯 Perform\n& Develop" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "reward", type: "default", position: { x: 680, y: 200 }, data: { label: "💰 Reward\nCompensation" }, style: { background: "#D97706", color: "#fff", borderRadius: "8px", padding: "12px", width: 130, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "grow", type: "default", position: { x: 850, y: 200 }, data: { label: "📈 Grow\n& Retain" }, style: { background: "#DC2626", color: "#fff", borderRadius: "8px", padding: "12px", width: 120, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "analytics", type: "default", position: { x: 430, y: 360 }, data: { label: "📊 People Analytics\n(Insights Across All)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "10px", width: 190, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "recruit", target: "onboard" },
        { id: "e2", source: "onboard", target: "ec" },
        { id: "e3", source: "ec", target: "perform" },
        { id: "e4", source: "perform", target: "reward" },
        { id: "e5", source: "reward", target: "grow" },
        { id: "e6", source: "ec", target: "analytics", type: "smoothstep" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart15_2.id, nodeId: "recruit", title: "Recruit", description: "Attract and hire talent — job requisitions, postings, applicant tracking, and selection. The chosen candidate flows into onboarding and becomes an employee record.", tCode: "SF Recruiting", tips: "A strong recruiting-to-onboarding handoff prevents new hires from falling through the cracks." },
      { flowchartId: flowchart15_2.id, nodeId: "onboard", title: "Onboard", description: "Get new hires productive quickly — paperwork, equipment, introductions, and early goals. Creates a great first impression and feeds data into Employee Central.", tCode: "SF Onboarding", tips: "Good onboarding measurably improves retention in the critical first 90 days." },
      { flowchartId: flowchart15_2.id, nodeId: "ec", title: "Manage & Pay (EC)", description: "The employee now lives in Employee Central — org assignment, position, and pay. Payroll runs from here, and EC is the hub all other modules reference.", tCode: "SF Employee Central", tips: "Because EC is the single source of truth, accurate EC data keeps every other module correct." },
      { flowchartId: flowchart15_2.id, nodeId: "perform", title: "Perform & Develop", description: "Set goals, give feedback, run reviews, and close skill gaps with Learning. Performance ratings ripple into compensation and succession decisions.", tCode: "SF Performance & Goals, Learning", tips: "Aligning individual goals to company objectives is the whole point of this stage." },
      { flowchartId: flowchart15_2.id, nodeId: "reward", title: "Reward", description: "Compensation planning — merit increases, bonuses, and equity — typically driven by performance ratings and budget guidelines.", tCode: "SF Compensation", tips: "Linking pay to performance ratings is a key reason Performance and Compensation integrate tightly." },
      { flowchartId: flowchart15_2.id, nodeId: "analytics", title: "People Analytics", description: "Workforce insights across the whole lifecycle — attrition, skill gaps, diversity trends — powered by SAP Analytics Cloud technology built into SuccessFactors.", tCode: "SF People Analytics / Stories", tips: "Analytics turns lifecycle data into decisions: where to hire, who to develop, why people leave." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson15_2.id },
    update: {},
    create: {
      lessonId: lesson15_2.id,
      title: "Talent Lifecycle Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What is the correct order of the SuccessFactors talent lifecycle?",
            explanation: "The lifecycle flows: Recruit → Onboard → Manage/Pay (Employee Central) → Perform & Develop → Reward (Compensation) → Grow & Retain (Succession). It mirrors an employee's real journey from hire to retire.",
            options: {
              create: [
                { text: "Recruit → Onboard → Manage/Pay → Perform → Reward → Grow & Retain", isCorrect: true },
                { text: "Reward → Recruit → Grow → Onboard → Perform", isCorrect: false },
                { text: "Onboard → Reward → Recruit → Perform → Grow", isCorrect: false },
                { text: "Perform → Recruit → Reward → Onboard → Grow", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "In the talent lifecycle, a performance RATING typically flows into which other processes?",
            explanation: "A performance rating feeds Compensation (driving merit increases and bonuses) and Succession (identifying high-potential talent for talent pools). This integration is the power of the connected lifecycle.",
            options: {
              create: [
                { text: "Compensation (merit/bonus) and Succession (talent pools)", isCorrect: true },
                { text: "The warehouse picking strategy", isCorrect: false },
                { text: "The vendor invoice posting", isCorrect: false },
                { text: "Nowhere — ratings are kept secret and unused", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "Which module sits at the center of the lifecycle as the single source of truth that other modules reference?",
            explanation: "Employee Central (EC) is the system of record at the center. All other modules (Recruiting, Performance, Compensation, etc.) reference EC's employee data, so accurate EC data keeps everything else correct.",
            options: {
              create: [
                { text: "Employee Central", isCorrect: true },
                { text: "Plant Maintenance", isCorrect: false },
                { text: "The Chart of Accounts", isCorrect: false },
                { text: "The Fiori Launchpad", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // MODULE 16: SAP Analytics Cloud (SAC)
  // ─────────────────────────────────────────────
  const sacModule = await prisma.module.upsert({
    where: { slug: "sac" },
    update: {},
    create: {
      title: "SAP Analytics Cloud",
      slug: "sac",
      description: "Learn SAP's cloud analytics tool — dashboards (Business Intelligence), planning, and predictive insights, all in one place.",
      color: "#F59E0B",
      icon: "📊",
      order: 16,
      isPublished: true,
    },
  });

  // LESSON 16.1: What is SAC?
  const lesson16_1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: sacModule.id, slug: "what-is-sac" } },
    update: {},
    create: {
      moduleId: sacModule.id,
      title: "What is SAP Analytics Cloud?",
      slug: "what-is-sac",
      order: 1,
      isPublished: true,
      estimatedMinutes: 10,
      difficulty: "BEGINNER",
      xpReward: 75,
      story: `The CFO wants a live dashboard: revenue by region, this year vs last, with a forecast for next quarter — all updating from SAP data automatically. The team's current process: export to Excel, build charts by hand, email a static PDF that's outdated by the next morning.

There's a better way. **SAP Analytics Cloud (SAC)** turns SAP data into live, interactive dashboards — and even lets you plan and forecast in the same tool. This lesson introduces what SAC is and the three things it does.`,
      content: `## What is SAC?

**SAP Analytics Cloud (SAC)** is SAP's all-in-one cloud analytics tool. Its big idea: combine three things that used to need three separate tools into ONE:

| Capability | What It Means |
|------------|---------------|
| **Business Intelligence (BI)** | Dashboards, charts, reports, exploration |
| **Planning** | Budgeting, forecasting, what-if scenarios |
| **Predictive** | AI-driven forecasts and smart insights |

It runs in the cloud (part of the BTP family) and connects live to SAP and non-SAP data.

## The Core Building Blocks

### 1. Connection
How SAC reaches your data:
- **Live connection** — query the source in real time (data stays put, always current)
- **Import connection** — copy data into SAC for fast modeling

### 2. Model
The semantic layer — defines your measures (e.g. Revenue, Cost) and dimensions (e.g. Region, Time, Product). Every story sits on a model.

### 3. Story
The dashboard/report — interactive pages of charts, tables, and visuals built on a model. This is what users see and explore.
(Newer SAC uses **Stories** built on the **Optimized Design Experience**.)

## A Simple SAC Workflow

1. **Connect** to S/4HANA (live) or import a dataset
2. **Build a Model** — define measures and dimensions
3. **Create a Story** — drag charts, tables, filters onto pages
4. **Explore** — users filter, drill down, and interact
5. **Share** — publish to teams; view on web or mobile

## BI Example

A sales Story might show:
- A KPI tile: "Total Revenue: ₹4.2 Cr"
- A bar chart: Revenue by Region
- A line chart: This Year vs Last Year
- A filter: pick a product line and everything updates

## Why SAC Beats Exporting to Excel

| Excel Reports | SAP Analytics Cloud |
|---------------|---------------------|
| Manual, static | Live, auto-refreshing |
| Outdated quickly | Always current |
| One person's file | Shared, governed |
| No planning link | BI + planning together |
| Desktop only | Web + mobile |

## Where SAC Fits

- Part of SAP's cloud/BTP ecosystem
- Powers analytics inside other products (e.g. SuccessFactors People Analytics "Stories")
- The strategic analytics layer for S/4HANA`,
      keyConceptTitle: "SAC = BI + Planning + Predictive, in One Cloud Tool",
      keyConceptBody: `**SAP Analytics Cloud (SAC)** unifies three capabilities that used to need separate tools: **Business Intelligence** (dashboards), **Planning** (budgeting/forecasting), and **Predictive** (AI insights).

Its building blocks: a **Connection** (live = real-time, or import = copied data) feeds a **Model** (measures + dimensions), which a **Story** (the interactive dashboard) is built on. Versus static Excel exports, SAC is live, shared, mobile, and links reporting directly to planning.`,
    },
  });

  const flowchart16_1 = await prisma.flowchart.upsert({
    where: { lessonId: lesson16_1.id },
    update: {},
    create: {
      lessonId: lesson16_1.id,
      title: "How SAC Works",
      nodes: [
        { id: "source", type: "default", position: { x: 40, y: 200 }, data: { label: "🗄️ Data Source\nS/4HANA / Files" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "conn", type: "default", position: { x: 230, y: 200 }, data: { label: "🔌 Connection\nLive or Import" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "model", type: "default", position: { x: 420, y: 200 }, data: { label: "🧱 Model\nMeasures + Dimensions" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "12px", width: 170, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "story", type: "default", position: { x: 630, y: 200 }, data: { label: "📖 Story\nInteractive Dashboard" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "12px", width: 170, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "bi", type: "default", position: { x: 850, y: 60 }, data: { label: "📊 BI\nDashboards" }, style: { background: "#2563EB", color: "#fff", borderRadius: "8px", padding: "10px", width: 120, fontSize: "12px", textAlign: "center" } },
        { id: "plan", type: "default", position: { x: 850, y: 200 }, data: { label: "📈 Planning\nBudget/Forecast" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "10px", width: 130, fontSize: "12px", textAlign: "center" } },
        { id: "pred", type: "default", position: { x: 850, y: 340 }, data: { label: "🤖 Predictive\nAI Forecasts" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "10px", width: 130, fontSize: "12px", textAlign: "center" } },
      ],
      edges: [
        { id: "e1", source: "source", target: "conn" },
        { id: "e2", source: "conn", target: "model" },
        { id: "e3", source: "model", target: "story" },
        { id: "e4", source: "story", target: "bi" },
        { id: "e5", source: "story", target: "plan" },
        { id: "e6", source: "story", target: "pred" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart16_1.id, nodeId: "conn", title: "Connection (Live vs Import)", description: "How SAC reaches data. A live connection queries the source in real time (data stays put, always current). An import connection copies data into SAC for fast, flexible modeling.", tCode: "SAC Connections", tips: "Live connections are great for governance and freshness; imports allow blending and offline-style modeling." },
      { flowchartId: flowchart16_1.id, nodeId: "model", title: "Model", description: "The semantic layer that defines Measures (numbers like Revenue, Cost) and Dimensions (categories like Region, Time, Product). Every Story is built on a model.", tCode: "SAC Modeler", tips: "A well-designed model with clear measures and dimensions makes building Stories fast and consistent." },
      { flowchartId: flowchart16_1.id, nodeId: "story", title: "Story (Dashboard)", description: "The interactive report — pages of charts, tables, KPIs, and filters built on a model. Users explore, filter, and drill down. The main thing end-users interact with.", tCode: "SAC Stories", tips: "Newer SAC builds Stories on the Optimized Design Experience for better performance and features." },
      { flowchartId: flowchart16_1.id, nodeId: "bi", title: "Business Intelligence", description: "Dashboards, charts, and ad-hoc exploration that turn raw data into visual insight — the classic reporting capability.", tCode: "SAC Stories", tips: "Interactive filters mean one Story can answer dozens of questions without rebuilding charts." },
      { flowchartId: flowchart16_1.id, nodeId: "plan", title: "Planning", description: "Budgeting, forecasting, and what-if scenarios in the SAME tool as reporting — users enter and adjust plan values directly, then compare plan vs actual.", tCode: "SAC Planning", tips: "Combining BI and planning in one tool is SAC's standout advantage over pure dashboard tools." },
      { flowchartId: flowchart16_1.id, nodeId: "pred", title: "Predictive", description: "AI-driven forecasting and smart insights — SAC can automatically project trends and surface key drivers behind the numbers.", tCode: "SAC Predictive / Smart Predict", tips: "Smart Predict and 'Smart Insights' let business users get AI forecasts without being data scientists." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson16_1.id },
    update: {},
    create: {
      lessonId: lesson16_1.id,
      title: "What is SAC Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "What three capabilities does SAP Analytics Cloud combine into one tool?",
            explanation: "SAC's big idea is unifying Business Intelligence (dashboards), Planning (budgeting/forecasting), and Predictive (AI insights) — three things that used to require three separate tools.",
            options: {
              create: [
                { text: "Business Intelligence, Planning, and Predictive", isCorrect: true },
                { text: "Payroll, Procurement, and Production", isCorrect: false },
                { text: "Development, Quality, and Production systems", isCorrect: false },
                { text: "Domains, Data Elements, and Tables", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What is the difference between a 'live' and an 'import' connection in SAC?",
            explanation: "A live connection queries the source system in real time (data stays put and is always current). An import connection copies the data into SAC for fast, flexible modeling.",
            options: {
              create: [
                { text: "Live queries the source in real time; Import copies data into SAC", isCorrect: true },
                { text: "Live is for finance; Import is for HR", isCorrect: false },
                { text: "They are the same thing", isCorrect: false },
                { text: "Live deletes the source data; Import backs it up", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "In SAC, what is a 'Story' built on top of?",
            explanation: "A Story (the interactive dashboard/report) is built on a Model — the semantic layer that defines measures (Revenue, Cost) and dimensions (Region, Time). The model in turn draws from a connection to the data source.",
            options: {
              create: [
                { text: "A Model (which defines measures and dimensions)", isCorrect: true },
                { text: "A purchase order", isCorrect: false },
                { text: "An ABAP program only", isCorrect: false },
                { text: "Nothing — Stories have no data", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // LESSON 16.2: Planning & Predictive in SAC
  const lesson16_2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: sacModule.id, slug: "planning-predictive-sac" } },
    update: {},
    create: {
      moduleId: sacModule.id,
      title: "Planning & Predictive in SAC",
      slug: "planning-predictive-sac",
      order: 2,
      isPublished: true,
      estimatedMinutes: 11,
      difficulty: "INTERMEDIATE",
      xpReward: 75,
      story: `Most analytics tools only look backward — they tell you what happened. But Lakshmi's finance team needs to look FORWARD: build next year's budget, test "what if sales grow 10%," and get an AI forecast of demand.

What makes SAC special is that it doesn't just report the past — it lets you plan and predict the future, in the same place as your dashboards. This lesson explores SAC's two forward-looking superpowers: Planning and Predictive.`,
      content: `## Beyond Dashboards: Looking Forward

Pure BI tools answer "what happened?" SAC adds two forward-looking capabilities most tools lack:
- **Planning** — decide what *should* happen (budgets, targets)
- **Predictive** — estimate what *will* happen (AI forecasts)

## Planning in SAC

SAC Planning lets users enter and adjust plan data directly in the tool — then compare it to actuals.

### Key Planning Concepts

| Concept | Meaning |
|---------|---------|
| **Version** | A scenario of the data: Actual, Budget, Forecast, or "what-if" copies |
| **Data Entry** | Users type plan values into cells (like a smart spreadsheet) |
| **Data Actions** | Automated calculations (e.g. "spread annual budget across 12 months") |
| **Allocation** | Distribute values (e.g. overhead across departments) |
| **Value Driver Tree** | Visual model of how drivers affect outcomes |

### A Planning Example
1. Copy "Actual" to a new "Budget 2025" version
2. Increase planned revenue by 8% using a data action
3. Enter departmental cost targets
4. Compare Budget vs Actual live as the year progresses

### What-If Analysis
Create multiple versions to test scenarios: "What if raw material costs rise 15%?" — see the impact on profit instantly.

## Predictive in SAC

SAC brings AI to business users (no data-science degree needed):

| Feature | What It Does |
|---------|--------------|
| **Smart Predict** | Builds forecast/classification models from your data |
| **Predictive Forecast** | Auto-projects a time series into the future on a chart |
| **Smart Insights** | Explains *why* a number changed (top contributors) |
| **Smart Discovery** | Finds hidden patterns and key influencers automatically |
| **Search to Insight** | Ask a question in plain language, get a chart |

### Predictive Example
On a revenue line chart, click "Add Predictive Forecast" — SAC analyzes history and draws the projected next 6 months with a confidence range.

## The Magic: It's All Connected

Because BI, Planning, and Predictive share the same models and Stories:
- A predictive forecast can *seed* a planning version
- Planned figures appear right beside actuals on the same dashboard
- One tool takes you from "what happened" → "what will happen" → "what we'll do about it"

## Why This Matters

This forward-looking ability is why finance and operations teams choose SAC over plain dashboard tools — it closes the loop from insight to action, all connected to live SAP data.`,
      keyConceptTitle: "SAC Looks Forward: Planning (what should happen) + Predictive (what will)",
      keyConceptBody: `Beyond dashboards, SAC adds two forward-looking powers:
- **Planning** — enter/adjust budgets and forecasts in **Versions** (Actual, Budget, what-if), using **Data Actions** and **Allocations** to automate calculations, then compare plan vs actual.
- **Predictive** — AI for business users: **Smart Predict**, **Predictive Forecast** (project a time series), **Smart Insights** (why a number changed), and **Search to Insight** (ask in plain language).

Because BI, Planning, and Predictive share the same models, a forecast can seed a plan — closing the loop from insight to action.`,
    },
  });

  const flowchart16_2 = await prisma.flowchart.upsert({
    where: { lessonId: lesson16_2.id },
    update: {},
    create: {
      lessonId: lesson16_2.id,
      title: "Planning & Predictive Flow",
      nodes: [
        { id: "actual", type: "default", position: { x: 60, y: 200 }, data: { label: "📥 Actuals\n(Live SAP Data)" }, style: { background: "#1E40AF", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "predict", type: "default", position: { x: 270, y: 80 }, data: { label: "🤖 Predictive Forecast\nProject the Future" }, style: { background: "#DB2777", color: "#fff", borderRadius: "8px", padding: "12px", width: 180, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "version", type: "default", position: { x: 290, y: 280 }, data: { label: "🗂️ Planning Version\nBudget / What-If" }, style: { background: "#059669", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "actions", type: "default", position: { x: 520, y: 280 }, data: { label: "⚙️ Data Actions\n+ Allocations" }, style: { background: "#0891B2", color: "#fff", borderRadius: "8px", padding: "12px", width: 150, fontSize: "12px", textAlign: "center" } },
        { id: "compare", type: "default", position: { x: 560, y: 120 }, data: { label: "📊 Plan vs Actual\nSame Dashboard" }, style: { background: "#F59E0B", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
        { id: "decide", type: "default", position: { x: 790, y: 200 }, data: { label: "✅ Decide & Act\n(Insight → Action)" }, style: { background: "#7C3AED", color: "#fff", borderRadius: "8px", padding: "12px", width: 160, fontSize: "12px", textAlign: "center", fontWeight: "bold" } },
      ],
      edges: [
        { id: "e1", source: "actual", target: "predict" },
        { id: "e2", source: "actual", target: "version" },
        { id: "e3", source: "predict", target: "version", label: "seeds" },
        { id: "e4", source: "version", target: "actions" },
        { id: "e5", source: "actions", target: "compare" },
        { id: "e6", source: "predict", target: "compare" },
        { id: "e7", source: "compare", target: "decide" },
      ],
    },
  });

  await prisma.flowchartNodeDetail.createMany({
    skipDuplicates: true,
    data: [
      { flowchartId: flowchart16_2.id, nodeId: "actual", title: "Actuals", description: "Real historical data, often live from S/4HANA. This is the foundation both predictive forecasts and planning versions build on.", tCode: "SAC Live Connection", tips: "Live actuals mean your forecasts and plans always start from the latest real numbers." },
      { flowchartId: flowchart16_2.id, nodeId: "predict", title: "Predictive Forecast", description: "SAC analyzes historical patterns and projects a time series into the future, complete with a confidence range — no data-science skills required.", tCode: "SAC Predictive Forecast / Smart Predict", tips: "A predictive forecast can be pushed into a planning version as a starting baseline." },
      { flowchartId: flowchart16_2.id, nodeId: "version", title: "Planning Version", description: "A scenario of the data — Actual, Budget, Forecast, or a what-if copy. Users enter and adjust plan values here, like a smart, governed spreadsheet.", tCode: "SAC Planning (Versions)", tips: "Create multiple versions to compare scenarios (optimistic vs conservative budgets)." },
      { flowchartId: flowchart16_2.id, nodeId: "actions", title: "Data Actions & Allocations", description: "Automate planning calculations: spread an annual budget across months, increase revenue by a percentage, or allocate overhead across departments.", tCode: "SAC Data Actions", tips: "Data actions replace error-prone manual spreadsheet formulas with reusable, governed logic." },
      { flowchartId: flowchart16_2.id, nodeId: "compare", title: "Plan vs Actual", description: "Because planning and BI share the same Story, planned figures sit right beside actuals — variances are visible live as the period progresses.", tCode: "SAC Stories", tips: "Real-time plan-vs-actual variance is the payoff of combining BI and planning in one tool." },
      { flowchartId: flowchart16_2.id, nodeId: "decide", title: "Decide & Act", description: "With past, present, and predicted future in one view, teams move from insight to action — adjusting budgets and operational decisions with confidence.", tCode: "SAC", tips: "Closing the loop from analysis to decision is exactly why SAC beats static reporting tools." },
    ],
  });

  await prisma.quiz.upsert({
    where: { lessonId: lesson16_2.id },
    update: {},
    create: {
      lessonId: lesson16_2.id,
      title: "Planning & Predictive Quiz",
      questions: {
        create: [
          {
            order: 1,
            question: "In SAC Planning, what is a 'Version'?",
            explanation: "A Version is a scenario of the data — such as Actual, Budget, Forecast, or a what-if copy. Users create multiple versions to plan and compare scenarios (e.g. optimistic vs conservative budgets).",
            options: {
              create: [
                { text: "A scenario of the data, like Actual, Budget, or a what-if copy", isCorrect: true },
                { text: "The software release number of SAC", isCorrect: false },
                { text: "A type of user login", isCorrect: false },
                { text: "A printed copy of a report", isCorrect: false },
              ],
            },
          },
          {
            order: 2,
            question: "What does SAC's 'Predictive Forecast' feature do?",
            explanation: "Predictive Forecast analyzes historical data and automatically projects a time series into the future (with a confidence range) — for example, drawing the projected next 6 months on a revenue chart. It brings AI forecasting to business users.",
            options: {
              create: [
                { text: "Projects historical trends into the future automatically", isCorrect: true },
                { text: "Deletes old data permanently", isCorrect: false },
                { text: "Sends invoices to customers", isCorrect: false },
                { text: "Schedules background jobs", isCorrect: false },
              ],
            },
          },
          {
            order: 3,
            question: "Why is it powerful that SAC combines BI, Planning, and Predictive on shared models?",
            explanation: "Because they share the same models and Stories, a predictive forecast can seed a planning version, and planned figures appear right beside actuals on one dashboard — taking teams from 'what happened' to 'what will happen' to 'what we'll do', all connected.",
            options: {
              create: [
                { text: "A forecast can seed a plan, and plan sits beside actuals — insight to action in one tool", isCorrect: true },
                { text: "It makes the data permanently read-only", isCorrect: false },
                { text: "It removes the need for any data source", isCorrect: false },
                { text: "It only works for the HR department", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // ─────────────────────────────────────────────
  // GLOSSARY
  // ─────────────────────────────────────────────
  await prisma.glossaryTerm.createMany({
    skipDuplicates: true,
    data: [
      { term: "ERP", definition: "Enterprise Resource Planning. Software that integrates all business processes into one system. SAP is the world's leading ERP.", moduleSlug: "foundation" },
      { term: "T-Code", definition: "Transaction Code. A shortcut to open any function in SAP. Example: ME21N opens the Create Purchase Order screen.", moduleSlug: "foundation" },
      { term: "Company Code", definition: "The smallest organizational unit in SAP that produces its own financial statements. Represents a legal entity.", moduleSlug: "fico" },
      { term: "G/L Account", definition: "General Ledger Account. The individual accounts used to record all financial transactions. Organized in the Chart of Accounts.", moduleSlug: "fico", tCode: "FS00" },
      { term: "Chart of Accounts (COA)", definition: "The master list of all G/L accounts available to a company code. Every posting must reference accounts from the COA.", moduleSlug: "fico", tCode: "OB13" },
      { term: "Vendor", definition: "A company or person from whom goods or services are purchased. Managed in the Vendor Master (BP transaction).", moduleSlug: "mm" },
      { term: "Purchase Order (PO)", definition: "A legal document sent to a vendor confirming the purchase of specific goods/services at an agreed price.", moduleSlug: "mm", tCode: "ME21N" },
      { term: "Goods Receipt (GR)", definition: "Recording the physical arrival of goods in SAP. Updates inventory and creates an automatic accounting entry.", moduleSlug: "mm", tCode: "MIGO" },
      { term: "3-Way Match", definition: "SAP's automatic verification during invoice posting: Purchase Order + Goods Receipt + Vendor Invoice must all match.", moduleSlug: "mm", tCode: "MIRO" },
      { term: "Movement Type", definition: "A 3-digit code in SAP MM that defines the type of goods movement. 101=Goods Receipt, 201=GI to Cost Center, 261=GI for Production.", moduleSlug: "mm" },
      { term: "Posting Key", definition: "A 2-character code that determines the debit/credit side of an accounting line item and the account type allowed.", moduleSlug: "fico" },
      { term: "Document Number", definition: "A unique number SAP assigns to every posted accounting document. Used for display, reversal, and audit purposes.", moduleSlug: "fico", tCode: "FB03" },
    ],
  });

  console.log("✅ Seeding complete!");
  console.log("📊 Created:");
  console.log("   - 16 modules (Foundation, FICO, MM, SD, PP, HCM, PM, QM, WM, BASIS, ABAP, Fiori, S/4HANA, BTP, SuccessFactors, SAC)");
  console.log("   - 31 lessons with stories, content, and key concepts");
  console.log("   - 31 interactive flowcharts with node details");
  console.log("   - 31 quizzes with 93 questions total");
  console.log("   - 6 badges");
  console.log("   - 12 glossary terms");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
