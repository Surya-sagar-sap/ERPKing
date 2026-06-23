import { prisma } from "@/lib/prisma";
import { Eye, EyeOff, Pencil, Plus } from "lucide-react";
import { toggleModulePublished, deleteModule, createModule } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";
import Link from "next/link";

export default async function AdminModulesPage() {
  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { lessons: true } } },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Modules</h1>
          <p className="text-muted-foreground text-sm mt-1">{modules.length} modules total</p>
        </div>
      </div>

      {/* Create Module Form */}
      <details className="border rounded-xl bg-card mb-6 group">
        <summary className="flex items-center gap-2 px-6 py-4 cursor-pointer select-none font-medium text-sm hover:bg-muted/30 rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          Add New Module
        </summary>
        <form action={createModule} className="px-6 pb-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title *</label>
              <input name="title" required placeholder="e.g. SAP SD" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slug *</label>
              <input name="slug" required placeholder="e.g. sd" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
              <textarea name="description" rows={2} placeholder="Short description of what learners will master..." className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Icon (emoji)</label>
              <input name="icon" placeholder="e.g. 🛒" defaultValue="📚" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Color (hex)</label>
              <input name="color" placeholder="#2563EB" defaultValue="#2563EB" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Order</label>
              <input name="order" type="number" placeholder="4" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
            Create Module
          </button>
        </form>
      </details>

      {/* Modules Table */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground w-10">#</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Module</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Lessons</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mod) => (
              <tr key={mod.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors group">
                <td className="px-6 py-4 text-muted-foreground">{mod.order}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: mod.color + "20", border: `1px solid ${mod.color}40` }}
                    >
                      {mod.icon}
                    </div>
                    <div>
                      <div className="font-medium">{mod.title}</div>
                      <div className="text-xs text-muted-foreground">/learn/{mod.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/lessons?module=${mod.id}`} className="text-primary hover:underline">
                    {mod._count.lessons} lessons →
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <form action={toggleModulePublished.bind(null, mod.id, mod.isPublished)}>
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        mod.isPublished
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {mod.isPublished ? <><Eye className="w-3 h-3" /> Published</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/modules/${mod.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteButton
                      action={deleteModule.bind(null, mod.id)}
                      message={`Delete "${mod.title}" and all its lessons? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {modules.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No modules yet. Create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
