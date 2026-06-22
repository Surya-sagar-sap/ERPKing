// ─── FILE: app/certificate/[credentialId]/page.tsx ───
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Award, ShieldCheck } from "lucide-react";
import CertificateActions from "@/components/CertificateActions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sapking.com";

async function getCertificate(credentialId: string) {
  return prisma.certificate.findUnique({
    where: { credentialId },
    include: {
      user: { select: { name: true } },
      module: { select: { title: true, color: true, icon: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { credentialId: string };
}): Promise<Metadata> {
  const cert = await getCertificate(params.credentialId);
  if (!cert) return { title: "Certificate not found — SAPKing" };
  return {
    title: `${cert.module.title} Certificate — ${cert.user.name ?? "SAPKing Learner"}`,
    description: `Verified SAPKing certificate of completion for ${cert.module.title}. Credential ${cert.credentialId}.`,
  };
}

export default async function CertificatePage({
  params,
}: {
  params: { credentialId: string };
}) {
  const cert = await getCertificate(params.credentialId);

  if (!cert) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Award className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold">Certificate not found</h1>
          <p className="text-muted-foreground text-sm mt-2">
            We couldn&apos;t find a certificate with ID{" "}
            <span className="font-mono">{params.credentialId}</span>. Please check the link and try again.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 text-sm font-semibold text-primary hover:underline"
          >
            ← Back to SAPKing
          </Link>
        </div>
      </div>
    );
  }

  const recipient = cert.user.name ?? "SAPKing Learner";
  const accent = cert.module.color || "#7C3AED";
  const issued = new Date(cert.issuedAt);
  const issuedLabel = issued.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const certUrl = `${SITE_URL}/certificate/${cert.credentialId}`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10 gap-8">
      {/* Print rules: only the certificate card prints. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body { background: #0b1020 !important; }
              body * { visibility: hidden !important; }
              #certificate-card, #certificate-card * { visibility: visible !important; }
              #certificate-card { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
              .no-print { display: none !important; }
            }
          `,
        }}
      />

      {/* ── Certificate card ── */}
      <div
        id="certificate-card"
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 px-8 py-12 sm:px-14 sm:py-16 text-center text-slate-100 shadow-2xl"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, #1b2440 0%, #0b1020 60%)",
        }}
      >
        {/* Accent glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full opacity-30 blur-[90px]"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 60%)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full opacity-20 blur-[90px]"
          style={{ background: "radial-gradient(circle, #C99B3B, transparent 60%)" }}
        />

        {/* Gold border frame */}
        <div className="pointer-events-none absolute inset-3 rounded-2xl border border-[#C99B3B]/40" />

        <div className="relative">
          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), #7C3AED)" }}
            >
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight">SAPKing</span>
          </div>

          <div className="inline-flex items-center gap-2 text-[#E8C66B] text-xs font-semibold uppercase tracking-[0.2em] mb-6">
            <Award className="w-4 h-4" /> Certificate of Completion
          </div>

          <p className="text-slate-400 text-sm">This certifies that</p>

          <h1 className="mt-3 mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {recipient}
          </h1>

          <p className="text-slate-400 text-sm">has successfully completed</p>

          <div className="mt-3 text-xl sm:text-2xl font-semibold">
            <span className="mr-2">{cert.module.icon}</span>
            {cert.module.title}
          </div>
          <div className="text-slate-400 text-sm mt-1">SAP Learning Path</div>

          {/* Divider */}
          <div
            className="mx-auto my-8 h-px w-40"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />

          {/* Meta row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Issued</div>
              <div className="text-sm font-medium">{issuedLabel}</div>
            </div>
            <div className="sm:text-right">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Credential ID</div>
              <div className="text-sm font-mono text-[#E8C66B]">{cert.credentialId}</div>
            </div>
          </div>

          {/* Verify line */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verify at {SITE_URL.replace(/^https?:\/\//, "")}/certificate/{cert.credentialId}
          </div>
        </div>
      </div>

      {/* ── Actions (hidden when printing) ── */}
      <CertificateActions
        credentialId={cert.credentialId}
        moduleTitle={cert.module.title}
        certUrl={certUrl}
        issueYear={issued.getFullYear()}
        issueMonth={issued.getMonth() + 1}
      />

      <Link href="/dashboard" className="no-print text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to dashboard
      </Link>
    </div>
  );
}
// ─── END FILE ───
