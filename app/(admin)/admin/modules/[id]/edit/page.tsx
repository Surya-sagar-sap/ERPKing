import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateModule } from "../../actions";

export default async function EditModulePage({ params }: { params: { id: string } }) {
  const mod = await prisma.module.findUnique({ where: { id: params.id } });
  if (!mod) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/modules" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Modules
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: mod.color + "20", border: `1px solid ${mod.color}40` }}
        >
          {mod.icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold">Edit Module</h1>
          <p className="text-muted-foreground text-sm">/learn/{mod.slug}</p>
        </div>
      </div>

      <form action={updateModule.bind(null, mod.id)} className="border rounded-xl bg-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title *</label>
            <input name="title" required defaultValue={mod.title} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slug (read-only)</label>
            <input value={mod.slug} disabled className="w-full px-3 py-2 rounded-lg border bg-muted/50 text-sm text-muted-foreground cursor-not-allowed" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
            <textarea name="description" rows={2} defaultValue={mod.description ?? ""} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Icon (emoji)</label>
            <input name="icon" defaultValue={mod.icon ?? ""} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Color (hex)</label>
            <input name="color" defaultValue={mod.color} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Order</label>
            <input name="order" type="number" defaultValue={mod.order} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
            Save Changes
          </button>
          <Link href="/admin/modules" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
