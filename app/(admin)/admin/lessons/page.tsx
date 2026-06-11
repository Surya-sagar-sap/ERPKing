import { prisma } from "@/lib/prisma";
import { Eye, EyeOff, Pencil, Trash2, Plus, Clock, Zap } from "lucide-react";
import { toggleLessonPublished, deleteLesson, createLesson } from "./actions";
import Link from "next/link";

const DIFFICULTY_COLORS = {
  BEGINNER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  INTERMEDIATE: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  ADVANCED: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
};

export default async function AdminLessonsPage({
  searchParams,
}: {
  searchParams: { module?: string };
}) {
  const modules = await prisma.module.findMany({ orderBy: { order: "asc" } });

  const lessons = await prisma.lesson.findMany({
    where: searchParams.module ? { moduleId: searchParams.module } : {},
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
    include: {
      module: { select: { title: true, icon: true, color: true } },
      quiz: { select: { id: true } },
      flowchart: { select: { id: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Lessons</h1>
          <p className="text-muted-foreground text-sm mt-1">{lessons.length} lessons total</p>
        </div>
      </div>

      {/* Module filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/admin/lessons"
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${!searchParams.module ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:bg-muted"}`}
        >
          All Modules
        </Link>
        {modules.map((m) => (
          <Link
            key={m.id}
            href={`/admin/lessons?module=${m.id}`}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${searchParams.module === m.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:bg-muted"}`}
          >
            {m.icon} {m.title}
          </Link>
        ))}
      </div>

      {/* Create lesson form */}
      <details className="border rounded-xl bg-card mb-6">
        <summary className="flex items-center gap-2 px-6 py-4 cursor-pointer select-none font-medium text-sm hover:bg-muted/30 rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          Add New Lesson
        </summary>
        <form action={createLesson} className="px-6 pb-6 pt-4 border-t space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Module *</label>
              <select name="moduleId" required className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                <option value="">Select a module...</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>{m.icon} {m.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Difficulty</label>
              <select name="difficulty" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title *</label>
              <input name="title" required placeholder="e.g. Creating a Purchase Order" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slug *</label>
              <input name="slug" required placeholder="e.g. creating-purchase-order" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Order</label>
              <input name="order" type="number" placeholder="1" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Est. Minutes</label>
              <input name="estimatedMinutes" type="number" placeholder="10" defaultValue="10" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">XP Reward</label>
              <input name="xpReward" type="number" placeholder="50" defaultValue="50" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Opening Story *</label>
            <textarea name="story" rows={3} required placeholder="Start with a business story that sets up the problem this lesson solves..." className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Main Content (Markdown)</label>
            <textarea name="content" rows={6} placeholder="## What is...&#10;&#10;Explain the concept here using Markdown..." className="w-full px-3 py-2 rounded-lg border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Concept Title</label>
              <input name="keyConceptTitle" placeholder="e.g. ME21N = Create Purchase Order" className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Concept Body</label>
              <textarea name="keyConceptBody" rows={2} placeholder="The one thing to remember from this lesson..." className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
            </div>
          </div>

          <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
            Create Lesson
          </button>
        </form>
      </details>

      {/* Lessons table */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Lesson</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Module</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Details</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-xs text-muted-foreground">{lesson.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-0.5 rounded-md border" style={{ color: lesson.module.color, borderColor: lesson.module.color + "40", backgroundColor: lesson.module.color + "10" }}>
                    {lesson.module.icon} {lesson.module.title}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[lesson.difficulty as keyof typeof DIFFICULTY_COLORS]}`}>
                      {lesson.difficulty.charAt(0) + lesson.difficulty.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.estimatedMinutes}m
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" /> {lesson.xpReward}xp
                    </span>
                    {lesson.quiz && (
                      <span className="text-xs bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        quiz
                      </span>
                    )}
                    {lesson.flowchart && (
                      <span className="text-xs bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 px-2 py-0.5 rounded-full">
                        flowchart
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <form action={toggleLessonPublished.bind(null, lesson.id, lesson.isPublished)}>
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        lesson.isPublished
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {lesson.isPublished ? <><Eye className="w-3 h-3" /> Live</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/lessons/${lesson.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <form action={deleteLesson.bind(null, lesson.id)}>
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-muted-foreground dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {lessons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No lessons yet. Create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
