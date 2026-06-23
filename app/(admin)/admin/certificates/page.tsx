// ─── FILE: app/(admin)/admin/certificates/page.tsx ───
import { prisma } from "@/lib/prisma";
import { Award, Users, BookOpen } from "lucide-react";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      module: { select: { title: true, icon: true, color: true } },
    },
  });

  // Stats
  const total = certificates.length;
  const uniqueLearners = new Set(certificates.map((c) => c.user.email)).size;

  const moduleCounts = new Map<string, { title: string; icon: string | null; count: number }>();
  for (const c of certificates) {
    const key = c.module.title;
    const cur = moduleCounts.get(key);
    if (cur) cur.count += 1;
    else moduleCounts.set(key, { title: c.module.title, icon: c.module.icon, count: 1 });
  }
  const popular = Array.from(moduleCounts.values()).sort((a, b) => b.count - a.count)[0];

  const stats = [
    { label: "Certificates Issued", value: total, icon: Award, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
    { label: "Unique Learners", value: uniqueLearners, icon: Users, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
    { label: "Most Popular Module", value: popular ? `${popular.icon ?? ""} ${popular.title}` : "—", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950", sub: popular ? `${popular.count} issued` : undefined },
  ];

  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Certificates</h1>
        <p className="text-muted-foreground text-sm mt-1">All credentials issued to learners</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="border rounded-xl p-5 bg-card">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold truncate">{s.value}</div>
            <div className="font-medium text-sm mt-0.5">{s.label}</div>
            {s.sub && <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Module</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Learner</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Credential ID</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Issued</th>
              <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cert.module.color }} />
                    <span className="font-medium">{cert.module.icon} {cert.module.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{cert.user.name ?? "Learner"}</div>
                  <div className="text-xs text-muted-foreground">{cert.user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded select-all">{cert.credentialId}</span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{fmt(cert.issuedAt)}</td>
                <td className="px-6 py-4 text-right">
                  <a
                    href={`/certificate/${cert.credentialId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    View →
                  </a>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No certificates issued yet. Learners earn certificates by completing all lessons in a module.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// ─── END FILE ───
