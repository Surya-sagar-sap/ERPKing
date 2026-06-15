// ─── SESSION 10: Lesson Order + Interview Importance ──────────────────────────
//
// Re-sequences every lesson in pedagogical order (foundation → concepts →
// config → integration → advanced) and rates each for interview importance:
//   HIGH   = asked in almost every interview for that role; must know
//   MEDIUM = frequently asked, esp. mid-senior roles / specific projects
//   LOW    = deep dive / niche; specialist or advanced rounds only
//
// Assumes the module variables (foundationModule, ficoModule, …) already exist
// in scope, same pattern as the rest of the seed. Top-level await throughout.

// ─── FOUNDATION (8) ───────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "what-is-sap" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-navigation-tcodes" } },
  data: { order: 2, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-organizational-structure" } },
  data: { order: 3, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-master-data" } },
  data: { order: 4, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-document-principle" } },
  data: { order: 5, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-modules-overview" } },
  data: { order: 6, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "sap-reporting-basics" } },
  data: { order: 7, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: foundationModule.id, slug: "s4hana-vs-ecc" } },
  data: { order: 8, interviewImportance: "HIGH" },
});

// ─── FICO (32) ────────────────────────────────────────────────────────────────
// Foundation & structure
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-enterprise-structure" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "chart-of-accounts" } },
  data: { order: 2, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "general-ledger-accounts" } },
  data: { order: 3, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "document-types-number-ranges" } },
  data: { order: 4, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "posting-keys" } },
  data: { order: 5, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "automatic-account-determination" } },
  data: { order: 6, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-new-gl-document-splitting" } },
  data: { order: 7, interviewImportance: "HIGH" },
});
// Accounts payable / receivable & banking
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "accounts-payable-process" } },
  data: { order: 8, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "vendor-invoice-posting" } },
  data: { order: 9, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "accounts-receivable-process" } },
  data: { order: 10, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-house-banks-bank-accounting" } },
  data: { order: 11, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-automatic-payment-run-f110" } },
  data: { order: 12, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-dunning-f150" } },
  data: { order: 13, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-special-gl-transactions" } },
  data: { order: 14, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-tax-configuration" } },
  data: { order: 15, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-foreign-currency-valuation" } },
  data: { order: 16, interviewImportance: "MEDIUM" },
});
// Asset accounting
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "asset-accounting-basics" } },
  data: { order: 17, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-asset-accounting-deep-dive" } },
  data: { order: 18, interviewImportance: "MEDIUM" },
});
// Period-end & closing
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "month-end-closing" } },
  data: { order: 19, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-financial-statement-versions" } },
  data: { order: 20, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-year-end-closing" } },
  data: { order: 21, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-intercompany-accounting" } },
  data: { order: 22, interviewImportance: "MEDIUM" },
});
// Controlling (CO)
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-controlling-area-cost-elements" } },
  data: { order: 23, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "cost-centers-profit-centers" } },
  data: { order: 24, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "activity-types-co-om" } },
  data: { order: 25, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "cost-center-planning-co-om" } },
  data: { order: 26, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "allocation-cycles-assessment-distribution" } },
  data: { order: 27, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-internal-orders" } },
  data: { order: 28, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-product-cost-planning" } },
  data: { order: 29, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fico-profitability-analysis" } },
  data: { order: 30, interviewImportance: "MEDIUM" },
});
// Integration
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fi-mm-integration" } },
  data: { order: 31, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ficoModule.id, slug: "fi-sd-integration" } },
  data: { order: 32, interviewImportance: "HIGH" },
});

// ─── MM (23) ──────────────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "procure-to-pay-overview" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-enterprise-structure" } },
  data: { order: 2, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "material-master" } },
  data: { order: 3, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "vendor-master" } },
  data: { order: 4, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "requisition-to-purchase-order" } },
  data: { order: 5, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-rfq-quotation-comparison" } },
  data: { order: 6, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-source-list-info-records" } },
  data: { order: 7, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-outline-agreements" } },
  data: { order: 8, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-release-strategies" } },
  data: { order: 9, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-item-categories" } },
  data: { order: 10, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-account-assignment-categories" } },
  data: { order: 11, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "goods-receipt-migo" } },
  data: { order: 12, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "invoice-verification-miro" } },
  data: { order: 13, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "stock-types-inventory" } },
  data: { order: 14, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-movement-types" } },
  data: { order: 15, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-stock-transfer-orders" } },
  data: { order: 16, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-physical-inventory" } },
  data: { order: 17, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-pricing-procedure-purchasing" } },
  data: { order: 18, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-valuation-obyc" } },
  data: { order: 19, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-subcontracting" } },
  data: { order: 20, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-consignment" } },
  data: { order: 21, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-service-procurement" } },
  data: { order: 22, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: mmModule.id, slug: "mm-integration-fi-sd-pp" } },
  data: { order: 23, interviewImportance: "HIGH" },
});

// ─── SD (24) ──────────────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "order-to-cash-overview" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-enterprise-structure" } },
  data: { order: 2, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "customer-master-data" } },
  data: { order: 3, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-material-master-views" } },
  data: { order: 4, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sales-order-structure" } },
  data: { order: 5, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-sales-document-types" } },
  data: { order: 6, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-item-categories" } },
  data: { order: 7, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-schedule-line-categories" } },
  data: { order: 8, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "delivery-process" } },
  data: { order: 9, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "billing-invoicing" } },
  data: { order: 10, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-copy-control" } },
  data: { order: 11, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "pricing-procedure-basics" } },
  data: { order: 12, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-condition-technique" } },
  data: { order: 13, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-condition-types-pricing" } },
  data: { order: 14, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-pricing-procedure-determination" } },
  data: { order: 15, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-output-determination" } },
  data: { order: 16, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-atp-available-to-promise" } },
  data: { order: 17, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-credit-management" } },
  data: { order: 18, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-shipping-transportation-config" } },
  data: { order: 19, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "returns-credit-memos" } },
  data: { order: 20, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-debit-memos-special-billing" } },
  data: { order: 21, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-consignment-processing" } },
  data: { order: 22, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-third-party-processing" } },
  data: { order: 23, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sdModule.id, slug: "sd-fi-integration" } },
  data: { order: 24, interviewImportance: "HIGH" },
});

// ─── PP (10) ──────────────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "production-planning-basics" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "demand-management-sop" } },
  data: { order: 2, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "capacity-planning-work-centers" } },
  data: { order: 3, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "repetitive-vs-discrete-manufacturing" } },
  data: { order: 4, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "production-order-lifecycle" } },
  data: { order: 5, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "shop-floor-control-execution" } },
  data: { order: 6, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "batch-management-production" } },
  data: { order: 7, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "subcontracting-in-pp" } },
  data: { order: 8, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "pp-mm-integration" } },
  data: { order: 9, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: ppModule.id, slug: "pp-co-integration" } },
  data: { order: 10, interviewImportance: "HIGH" },
});

// ─── HCM (16) ─────────────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "infotypes-master-data" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "org-management-payroll" } },
  data: { order: 2, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "personnel-actions-pa40" } },
  data: { order: 3, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "dynamic-actions" } },
  data: { order: 4, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "features-in-hcm" } },
  data: { order: 5, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "time-management" } },
  data: { order: 6, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "time-evaluation" } },
  data: { order: 7, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "leave-management" } },
  data: { order: 8, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "wage-types" } },
  data: { order: 9, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "payroll-control-record" } },
  data: { order: 10, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "payroll-process-detail" } },
  data: { order: 11, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "ess-mss-self-service" } },
  data: { order: 12, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "hcm-reporting" } },
  data: { order: 13, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "hcm-authorizations" } },
  data: { order: 14, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "payroll-posting-to-fi" } },
  data: { order: 15, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: hcmModule.id, slug: "hcm-fi-integration" } },
  data: { order: 16, interviewImportance: "HIGH" },
});

// ─── BASIS (16) ───────────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "sap-system-architecture" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "basis-system-landscape" } },
  data: { order: 2, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "work-process-administration" } },
  data: { order: 3, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "memory-administration" } },
  data: { order: 4, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "client-administration-scc4" } },
  data: { order: 5, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "transport-system-stms" } },
  data: { order: 6, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "user-administration-su01" } },
  data: { order: 7, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "roles-authorizations-pfcg" } },
  data: { order: 8, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "background-job-administration" } },
  data: { order: 9, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "monitoring-background-jobs" } },
  data: { order: 10, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "spool-print-management" } },
  data: { order: 11, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "system-parameters-rz10" } },
  data: { order: 12, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "rfc-administration" } },
  data: { order: 13, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "performance-monitoring" } },
  data: { order: 14, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "support-packages-notes" } },
  data: { order: 15, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: basisModule.id, slug: "database-administration" } },
  data: { order: 16, interviewImportance: "MEDIUM" },
});

// ─── ABAP (18) ────────────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-fundamentals" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-strings-advanced-types" } },
  data: { order: 2, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-data-dictionary" } },
  data: { order: 3, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-internal-tables" } },
  data: { order: 4, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-modularization" } },
  data: { order: 5, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-debugging" } },
  data: { order: 6, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-alv-reports" } },
  data: { order: 7, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-dialog-programming" } },
  data: { order: 8, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-smartforms-adobe-forms" } },
  data: { order: 9, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-object-oriented" } },
  data: { order: 10, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-class-based-exceptions" } },
  data: { order: 11, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-bapi-rfc" } },
  data: { order: 12, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-enhancements-badis" } },
  data: { order: 13, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-performance-optimization" } },
  data: { order: 14, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-cds-views" } },
  data: { order: 15, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-rap-model" } },
  data: { order: 16, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-cloud-steampunk" } },
  data: { order: 17, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: abapModule.id, slug: "abap-unit-testing-atc" } },
  data: { order: 18, interviewImportance: "MEDIUM" },
});

// ─── FIORI (10) ───────────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-launchpad" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-app-types" } },
  data: { order: 2, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-apps-library" } },
  data: { order: 3, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "sapui5-odata-basics" } },
  data: { order: 4, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-elements-vs-freestyle" } },
  data: { order: 5, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-launchpad-configuration" } },
  data: { order: 6, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-key-user-extensibility" } },
  data: { order: 7, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-my-inbox-approvals" } },
  data: { order: 8, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-responsive-design" } },
  data: { order: 9, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: fioriModule.id, slug: "fiori-theming" } },
  data: { order: 10, interviewImportance: "LOW" },
});

// ─── S/4HANA (18) ─────────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "what-is-s4hana" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4hana-cloud-vs-onpremise" } },
  data: { order: 2, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "universal-journal-acdoca" } },
  data: { order: 3, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "business-partner-concept" } },
  data: { order: 4, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "material-ledger-s4hana" } },
  data: { order: 5, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "embedded-analytics-vdm" } },
  data: { order: 6, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "sap-activate-methodology" } },
  data: { order: 7, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "migrating-to-s4hana" } },
  data: { order: 8, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-migration-cockpit-ltmc" } },
  data: { order: 9, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "central-finance" } },
  data: { order: 10, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-group-reporting" } },
  data: { order: 11, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-revenue-accounting-rar" } },
  data: { order: 12, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-treasury-cash-management" } },
  data: { order: 13, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-advanced-procurement" } },
  data: { order: 14, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-mrp-live-production" } },
  data: { order: 15, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-intercompany-processes" } },
  data: { order: 16, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "clean-core-concept" } },
  data: { order: 17, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: s4Module.id, slug: "s4-intelligent-enterprise-ai" } },
  data: { order: 18, interviewImportance: "MEDIUM" },
});

// ─── BTP (10) ─────────────────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "what-is-btp" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "btp-runtimes-cf-kyma" } },
  data: { order: 2, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "btp-security-identity" } },
  data: { order: 3, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "extending-sap-with-btp" } },
  data: { order: 4, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "sap-integration-suite" } },
  data: { order: 5, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "hana-cloud-on-btp" } },
  data: { order: 6, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "analytics-cloud-on-btp" } },
  data: { order: 7, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "build-process-automation" } },
  data: { order: 8, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "build-work-zone" } },
  data: { order: 9, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: btpModule.id, slug: "btp-ai-services-joule" } },
  data: { order: 10, interviewImportance: "MEDIUM" },
});

// ─── SUCCESSFACTORS (10) ──────────────────────────────────────────────────────
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "successfactors-employee-central" } },
  data: { order: 1, interviewImportance: "HIGH" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-admin-rbp" } },
  data: { order: 2, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "talent-lifecycle" } },
  data: { order: 3, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-performance-goals" } },
  data: { order: 4, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-recruiting-rcm" } },
  data: { order: 5, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-learning-lms" } },
  data: { order: 6, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-compensation-management" } },
  data: { order: 7, interviewImportance: "MEDIUM" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-succession-development" } },
  data: { order: 8, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-people-analytics" } },
  data: { order: 9, interviewImportance: "LOW" },
});
await prisma.lesson.update({
  where: { moduleId_slug: { moduleId: sfModule.id, slug: "sf-ec-payroll-integration" } },
  data: { order: 10, interviewImportance: "HIGH" },
});

// ─── SESSION 10 COMPLETE: 195 lessons ordered + rated ─────────────────────────
