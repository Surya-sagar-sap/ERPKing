import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateLesson } from "../../actions";

export default async function EditLessonPage({ params }: { params: { id: string } }) {
  const [lesson, modules] = await Promise.all([
    prisma.lesson.findUnique({ where: { id: params.id } }),
    prisma.module.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!lesson) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/lessons" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Lessons
      </Link>

      <h1 className="text-2xl font-bold mb-1">Edit Lesson</h1>
      <p className="text-muted-foreground text-sm mb-6">{lesson.title}</p>

      <form action={updateLesson.bind(null, lesson.id)} className="border rounded-xl bg-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Module *</label>
            <select name="moduleId" required defaultValue={lesson.moduleId} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.icon} {m.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Difficulty</label>
            <select name="difficulty" defaultValue={lesson.difficulty} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title *</label>
            <input name="title" required defaultValue={lesson.title} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slug *</label>
            <input name="slug" required defaultValue={lesson.slug} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Order</label>
            <input name="order" type="number" defaultValue={lesson.order} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Est. Minutes</label>
            <input name="estimatedMinutes" type="number" defaultValue={lesson.estimatedMinutes} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">XP Reward</label>
            <input name="xpReward" type="number" defaultValue={lesson.xpReward} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Opening Story *</label>
          <textarea name="story" rows={3} required defaultValue={lesson.story} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Main Content (Markdown)</label>
          <textarea name="content" rows={8} defaultValue={lesson.content ?? ""} className="w-full px-3 py-2 rounded-lg border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Concept Title</label>
            <input name="keyConceptTitle" defaultValue={lesson.keyConceptTitle ?? ""} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Concept Body</label>
            <textarea name="keyConceptBody" rows={2} defaultValue={lesson.keyConceptBody ?? ""} className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
            Save Changes
          </button>
          <Link href="/admin/lessons" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
