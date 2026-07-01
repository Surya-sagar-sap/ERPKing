// ─── FILE: components/PaymentSuccessBanner.tsx ───
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function PaymentSuccessBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success" || params.get("purchase") === "success") {
      setShow(true);

      // Remove the query param from the URL without reloading.
      params.delete("payment");
      params.delete("purchase");
      const qs = params.toString();
      const newUrl = window.location.pathname + (qs ? `?${qs}` : "");
      window.history.replaceState({}, "", newUrl);

      // Auto-dismiss after 5 seconds.
      const t = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-300/60 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <div className="font-bold text-emerald-800 dark:text-emerald-300">
          🎉 Purchase complete!
        </div>
        <div className="text-sm text-emerald-700 dark:text-emerald-400">
          Your lifetime access is unlocked. Enjoy learning!
        </div>
      </div>
      <button
        onClick={() => setShow(false)}
        aria-label="Dismiss"
        className="shrink-0 text-emerald-700/70 dark:text-emerald-400/70 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
// ─── END FILE ───
