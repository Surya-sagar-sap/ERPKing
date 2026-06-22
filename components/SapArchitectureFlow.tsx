// ─── FILE: components/SapArchitectureFlow.tsx ───
"use client";

import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";

/* One-line "what it covers" for the click tooltip */
const INFO: Record<string, string> = {
  p2p: "Procure to Pay — buying goods, from purchase order to vendor payment.",
  r2r: "Record to Report — recording transactions and closing the books.",
  o2c: "Order to Cash — selling, from customer order to receiving cash.",
  ptp: "Plan to Produce — planning and running manufacturing.",
  h2r: "Hire to Retire — the full employee lifecycle.",
  s4: "SAP S/4HANA — the central ERP that all modules and processes run on.",
  fico: "FICO — financial accounting and management controlling.",
  mm: "MM — purchasing, inventory, and material master data.",
  sd: "SD — sales orders, deliveries, and customer billing.",
  pp: "PP — production planning, BOMs, and manufacturing orders.",
  hcm: "HCM — employees, org structure, payroll, and time.",
  basis: "BASIS — the technical admin layer that keeps SAP running.",
  fiori: "Fiori — the modern, app-like user experience for SAP.",
  abap: "ABAP — SAP's language for building custom programs.",
  btp: "BTP — cloud platform for extensions, integration, and analytics.",
};

const DARK_CARD = "#1e293b";

/* Shared card style; per-layer border/background overrides merge on top */
const baseStyle = {
  background: DARK_CARD,
  color: "#e2e8f0",
  borderRadius: 12,
  borderWidth: 1.5,
  borderStyle: "solid",
  fontSize: 12,
  fontWeight: 600,
  padding: "8px 12px",
  width: 150,
  textAlign: "center" as const,
};

const biz = (border: string) => ({ ...baseStyle, borderColor: border });

const initialNodes: Node[] = [
  // ── Layer 1: Business processes (top) ──
  { id: "p2p", position: { x: 20, y: 0 }, data: { label: "📋 Procure to Pay" }, style: biz("#7C3AED") },
  { id: "r2r", position: { x: 200, y: 0 }, data: { label: "💰 Record to Report" }, style: biz("#7C3AED") },
  { id: "o2c", position: { x: 380, y: 0 }, data: { label: "🛒 Order to Cash" }, style: biz("#7C3AED") },
  { id: "ptp", position: { x: 560, y: 0 }, data: { label: "🏭 Plan to Produce" }, style: biz("#7C3AED") },
  { id: "h2r", position: { x: 740, y: 0 }, data: { label: "👥 Hire to Retire" }, style: biz("#7C3AED") },

  // ── Layer 2: SAP Core ERP (center hub) ──
  {
    id: "s4",
    position: { x: 350, y: 175 },
    data: { label: "🏢 SAP S/4HANA" },
    style: {
      ...baseStyle,
      background: "#1e40af",
      borderColor: "#2563EB",
      borderWidth: 2.5,
      width: 190,
      fontSize: 15,
      fontWeight: 700,
      padding: "14px 16px",
      color: "#ffffff",
    },
  },

  // ── Layer 3: Functional modules (left & right) ──
  { id: "fico", position: { x: 20, y: 130 }, data: { label: "💰 SAP FICO" }, style: biz("#2563EB") },
  { id: "mm", position: { x: 20, y: 190 }, data: { label: "📦 SAP MM" }, style: biz("#D97706") },
  { id: "sd", position: { x: 20, y: 250 }, data: { label: "🛒 SAP SD" }, style: biz("#DC2626") },
  { id: "pp", position: { x: 760, y: 130 }, data: { label: "🏭 SAP PP" }, style: biz("#16A34A") },
  { id: "hcm", position: { x: 760, y: 190 }, data: { label: "👥 SAP HCM" }, style: biz("#7C3AED") },
  { id: "basis", position: { x: 760, y: 250 }, data: { label: "⚙️ SAP BASIS" }, style: biz("#64748B") },

  // ── Layer 4: Technology & extensions (bottom) ──
  { id: "fiori", position: { x: 200, y: 350 }, data: { label: "🎨 SAP Fiori" }, style: biz("#0EA5E9") },
  { id: "abap", position: { x: 380, y: 350 }, data: { label: "💻 SAP ABAP" }, style: biz("#0EA5E9") },
  { id: "btp", position: { x: 560, y: 350 }, data: { label: "☁️ SAP BTP" }, style: biz("#0EA5E9") },
];

const edgeStyle = { stroke: "#334155", strokeWidth: 1.5 };

const initialEdges: Edge[] = [
  // Business processes → S/4HANA (labeled with the module each maps to)
  { id: "e-p2p", source: "p2p", target: "s4", animated: true, style: edgeStyle, label: "MM", labelStyle: { fill: "#94a3b8", fontSize: 10 }, labelBgStyle: { fill: "#0f172a" } },
  { id: "e-r2r", source: "r2r", target: "s4", animated: true, style: edgeStyle, label: "FICO", labelStyle: { fill: "#94a3b8", fontSize: 10 }, labelBgStyle: { fill: "#0f172a" } },
  { id: "e-o2c", source: "o2c", target: "s4", animated: true, style: edgeStyle, label: "SD", labelStyle: { fill: "#94a3b8", fontSize: 10 }, labelBgStyle: { fill: "#0f172a" } },
  { id: "e-ptp", source: "ptp", target: "s4", animated: true, style: edgeStyle, label: "PP", labelStyle: { fill: "#94a3b8", fontSize: 10 }, labelBgStyle: { fill: "#0f172a" } },
  { id: "e-h2r", source: "h2r", target: "s4", animated: true, style: edgeStyle, label: "HCM", labelStyle: { fill: "#94a3b8", fontSize: 10 }, labelBgStyle: { fill: "#0f172a" } },

  // S/4HANA ↔ functional modules (bidirectional)
  { id: "e-fico", source: "s4", target: "fico", animated: true, style: edgeStyle },
  { id: "e-mm", source: "s4", target: "mm", animated: true, style: edgeStyle },
  { id: "e-sd", source: "s4", target: "sd", animated: true, style: edgeStyle },
  { id: "e-pp", source: "s4", target: "pp", animated: true, style: edgeStyle },
  { id: "e-hcm", source: "s4", target: "hcm", animated: true, style: edgeStyle },
  { id: "e-basis", source: "s4", target: "basis", animated: true, style: edgeStyle },

  // Functional / core → technology layer (bottom)
  { id: "e-s4-fiori", source: "s4", target: "fiori", animated: true, style: edgeStyle },
  { id: "e-s4-abap", source: "s4", target: "abap", animated: true, style: edgeStyle },
  { id: "e-s4-btp", source: "s4", target: "btp", animated: true, style: edgeStyle },
];

export default function SapArchitectureFlow() {
  const [selected, setSelected] = useState<{ label: string; info: string } | null>(null);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    const info = INFO[node.id];
    if (info) setSelected({ label: String(node.data?.label ?? ""), info });
  }, []);

  const nodes = useMemo(() => initialNodes, []);
  const edges = useMemo(() => initialEdges, []);

  return (
    <div className="relative h-[340px] md:h-[420px] lg:h-[480px] w-full" style={{ background: "#0f172a" }}>
      {/* Header */}
      <div className="absolute top-3 left-4 z-10 text-xs text-slate-400">
        SAP Ecosystem — Click any module to explore
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
      </ReactFlow>

      {/* Click-to-explore badge */}
      {selected && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 max-w-[92%] rounded-xl border border-white/10 bg-slate-800/95 px-4 py-2.5 shadow-xl backdrop-blur">
          <div className="text-xs font-semibold text-white">{selected.label}</div>
          <div className="text-[11px] leading-snug text-slate-300">{selected.info}</div>
        </div>
      )}
    </div>
  );
}
// ─── END FILE ───
