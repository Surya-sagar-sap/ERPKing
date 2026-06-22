// ─── FILE: components/SapArchitectureFlowClient.tsx ───
"use client";

import dynamic from "next/dynamic";

/**
 * Client wrapper for the ReactFlow-based architecture diagram.
 *
 * ReactFlow is not SSR-safe, so it must be loaded with `ssr: false`.
 * `next/dynamic` with `ssr: false` is NOT allowed inside Server Components
 * in the App Router, so the dynamic import lives here in a Client Component
 * and the server page imports this wrapper instead.
 */
const SapArchitectureFlow = dynamic(
  () => import("@/components/SapArchitectureFlow"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[340px] md:h-[420px] lg:h-[480px] rounded-2xl bg-[#0f172a] border border-white/10 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading SAP ecosystem…</div>
      </div>
    ),
  }
);

export default function SapArchitectureFlowClient() {
  return <SapArchitectureFlow />;
}
// ─── END FILE ───
