// ─── FILE: components/CertificateActions.tsx ───
"use client";

import { Linkedin, Printer, Check, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  credentialId: string;
  moduleTitle: string;
  certUrl: string;
  issueYear: number;
  issueMonth: number; // 1–12
}

export default function CertificateActions({
  credentialId,
  moduleTitle,
  certUrl,
  issueYear,
  issueMonth,
}: Props) {
  const [copied, setCopied] = useState(false);

  const linkedInUrl =
    "https://www.linkedin.com/profile/add?" +
    new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: `${moduleTitle} — SAPKing Certificate`,
      organizationName: "SAPKing",
      issueYear: String(issueYear),
      issueMonth: String(issueMonth),
      certUrl,
      certId: credentialId,
    }).toString();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(certUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center justify-center gap-3">
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Linkedin className="h-4 w-4" /> Add to LinkedIn
      </a>
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
      >
        <Printer className="h-4 w-4" /> Download PDF
      </button>
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <LinkIcon className="h-4 w-4" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
// ─── END FILE ───
