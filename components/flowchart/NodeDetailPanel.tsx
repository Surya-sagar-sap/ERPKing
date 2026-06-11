"use client";

import { useState } from "react";
import { X, Copy, Check, Lightbulb, Info, Terminal } from "lucide-react";

interface NodeDetail {
  nodeId: string;
  title: string;
  description: string;
  tCode: string | null;
  tips: string | null;
}

interface Props {
  detail: NodeDetail;
  moduleColor: string;
  onClose: () => void;
}

export default function NodeDetailPanel({ detail, moduleColor, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const copyTCode = () => {
    if (!detail.tCode) return;
    navigator.clipboard.writeText(detail.tCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-72 shrink-0 border-l bg-card flex flex-col animate-in slide-in-from-right-4 duration-200">
      {/* Panel header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: moduleColor + "12", borderBottom: `2px solid ${moduleColor}30` }}
      >
        <div className="font-semibold text-sm truncate pr-2">{detail.title}</div>
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Description */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            <Info className="w-3.5 h-3.5" />
            What it does
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {detail.description}
          </p>
        </div>

        {/* T-Code */}
        {detail.tCode && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              <Terminal className="w-3.5 h-3.5" />
              SAP Transaction Code
            </div>
            <div className="flex items-center gap-2">
              <code
                className="flex-1 px-3 py-2 rounded-lg text-sm font-mono font-bold"
                style={{
                  backgroundColor: moduleColor + "12",
                  color: moduleColor,
                  border: `1px solid ${moduleColor}30`,
                }}
              >
                {detail.tCode}
              </code>
              <button
                onClick={copyTCode}
                className="p-2 rounded-lg border hover:bg-muted transition-colors shrink-0"
                title="Copy T-Code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Type this in the SAP command field to open this function
            </p>
          </div>
        )}

        {/* Tips */}
        {detail.tips && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Pro Tip
            </div>
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              {detail.tips}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
